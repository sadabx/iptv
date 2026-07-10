/* ==========================================
   live-chat.js — Firebase-backed live chat state and message UI
   ========================================== */

// ── YouTube Live Chat Controller ──
let currentChatRef = null;
let chatCloseBtnBound = false; // prevents duplicate close-btn listeners
let currentChatChannelId = null; // tracks active channel to skip redundant re-inits

function initLiveChat() {
  const $msgContainer = document.getElementById("chat-messages");
  const $inputArea = document.getElementById("chat-input-area");
  const $btnClose = document.getElementById("btn-close-chat");

  if (!$msgContainer || !$inputArea) return;

  // Close button functionality — bind only once to avoid stacking listeners
  if ($btnClose && !chatCloseBtnBound) {
    chatCloseBtnBound = true;
    $btnClose.addEventListener("click", () => {
      const $chat = document.getElementById("chat");
      const $btnChat = document.getElementById("btn-chat");
      if ($chat) $chat.classList.add("closed");
      if ($btnChat) $btnChat.classList.remove("on");
      document.body.classList.remove("chat-open");
    });
  }

  // Load chat username
  let username = localStorage.getItem("chat_username");

  function renderInputArea() {
    if (!username) {
      $inputArea.innerHTML = `
        <form class="chat-join-form" id="chat-join-form">
          <span class="chat-join-label">Choose a nickname to join the chat</span>
          <div class="chat-join-row">
            <input type="text" class="chat-username-input" id="chat-username-input" placeholder="Enter nickname..." maxlength="20" required autocomplete="off" />
            <button type="submit" class="chat-join-btn">Join</button>
          </div>
        </form>
      `;
      const $form = document.getElementById("chat-join-form");
      $form.addEventListener("submit", (e) => {
        e.preventDefault();
        const val = document.getElementById("chat-username-input").value.trim();
        if (val) {
          username = val;
          localStorage.setItem("chat_username", username);
          renderInputArea();
        }
      });
    } else {
      $inputArea.innerHTML = `
        <form class="chat-message-form" id="chat-message-form">
          <div class="chat-msg-avatar" style="background: #e91e63;">${username[0]}</div>
          <input type="text" class="chat-text-input" id="chat-text-input" placeholder="Chat..." maxlength="150" required autocomplete="off" />
          <button type="submit" class="chat-send-btn" aria-label="Send message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      `;
      const $form = document.getElementById("chat-message-form");
      $form.addEventListener("submit", (e) => {
        e.preventDefault();
        const $input = document.getElementById("chat-text-input");
        const text = $input.value.trim();
        if (text) {
          if (isFirebaseConfigured) {
            // Push to Firebase Realtime Database
            const msgData = {
              user: username,
              text: text,
              color: "#e91e63",
              timestamp: Date.now(),
            };
            currentChatRef
              .child("messages")
              .push(msgData)
              .then(() => {
                currentChatRef.child("lastActive").set(Date.now());
                enforceMessageLimit();
              });
          } else {
            // Fallback: Local echo for demo simulation
            addChatMessage(username, text, "#e91e63", true);
          }
          $input.value = "";
        }
      });
    }
  }

  function addChatMessage(user, text, color, isSelf = false) {
    const isAtBottom =
      $msgContainer.scrollHeight - $msgContainer.scrollTop <=
      $msgContainer.clientHeight + 50;

    const $msg = document.createElement("div");
    $msg.className = "chat-msg";
    $msg.innerHTML = `
      <div class="chat-msg-avatar" style="background: ${color};">${user[0]}</div>
      <div class="chat-msg-content">
        <span class="chat-msg-user" style="color: ${isSelf ? "#ff4e45" : "#aaa"};">${user}</span>
        <span class="chat-msg-text">${escapeHTML(text)}</span>
      </div>
    `;
    $msgContainer.appendChild($msg);

    // Keep only last 100 messages in UI
    while ($msgContainer.children.length > 100) {
      $msgContainer.removeChild($msgContainer.firstChild);
    }

    // Scroll to bottom if user was already near bottom
    if (isAtBottom) {
      $msgContainer.scrollTop = $msgContainer.scrollHeight;
    }
  }

  function escapeHTML(str) {
    return str.replace(
      /[&<>'"]/g,
      (tag) =>
        ({ "&": "&", "<": "<", ">": ">", "'": "&#39;", '"': '"' })[tag] || tag,
    );
  }

  // Determine if Firebase is configured by checking the API Key placeholder
  const isFirebaseConfigured =
    typeof firebase !== "undefined" &&
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";

  // Determine target channel ID before touching any listeners
  const targetChannelId = currentChannel ? currentChannel.id : "lobby";

  // Skip full re-init if the channel hasn't changed (avoids duplicate message flash)
  if (isFirebaseConfigured && targetChannelId === currentChatChannelId && currentChatRef) {
    return;
  }

  // Detach previous Firebase listeners
  if (currentChatRef) {
    currentChatRef.off();
    currentChatRef = null;
  }
  currentChatChannelId = null;

  // Clear UI messages
  $msgContainer.innerHTML = "";

  if (isFirebaseConfigured) {
    // ── FIREBASE CHAT OPERATION ──
    if (firebase.apps.length === 0) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }

    currentChatChannelId = targetChannelId;
    currentChatRef = firebase.database().ref(`chats/${targetChannelId}`);

    // Auto-wipe inactivity cleanup (2 hours threshold)
    currentChatRef
      .child("lastActive")
      .once("value")
      .then((snap) => {
        const lastActive = snap.val();
        const now = Date.now();
        if (lastActive && now - lastActive > 2 * 60 * 60 * 1000) {
          currentChatRef.child("messages").remove();
        }
        currentChatRef.child("lastActive").set(now);
      });

    // Listen to real-time database updates
    currentChatRef.child("messages").on("child_added", (snapshot) => {
      const msg = snapshot.val();
      if (msg && msg.user && msg.text) {
        addChatMessage(
          msg.user,
          msg.text,
          msg.color || "#e91e63",
          msg.user === username,
        );
      }
    });

    // Client-side helper to truncate messages to the last 50
    function enforceMessageLimit() {
      currentChatRef
        .child("messages")
        .once("value")
        .then((snapshot) => {
          if (snapshot.exists()) {
            const count = snapshot.numChildren();
            if (count > 50) {
              const keys = [];
              snapshot.forEach((child) => {
                keys.push(child.key);
              });
              const toDelete = keys.slice(0, count - 50);
              const updates = {};
              toDelete.forEach((k) => {
                updates[`messages/${k}`] = null;
              });
              currentChatRef.update(updates);
            }
          }
        });
    }
  } else {
    // ── NO CONFIG WARNING BANNER ──
    const $notice = document.createElement("div");
    $notice.className = "chat-msg system-msg";
    $notice.innerHTML = `
      <div class="chat-msg-content" style="background: rgba(255, 78, 69, 0.08); padding: 8px; border-radius: 8px; border: 1px dashed rgba(255, 78, 69, 0.25); width: 100%; box-sizing: border-box;">
        <span class="chat-msg-text" style="color: #ff4e45; font-size: 0.75rem;">
          <strong>Chat Offline:</strong> Configure Firebase at the top of <code>bootstrap.js</code> to enable real-time chat with friends.
        </span>
      </div>
    `;
    $msgContainer.appendChild($notice);
  }

  renderInputArea();
}
