/* ==========================================
   app.js — IPTV
   Player: HLS.js + native <video>
   Data:   CHANNELS_DATA from channels.js
   ========================================== */

// ── State
let hls = null;
let activeId = null;
let currentChannel = null;
let channels = []; // flat list
let muted = false;
let activeStreamIdx = 0; // current quality index
let retryCount = 0;
const MAX_RETRIES = 3;
let statsInterval = null;
let clickTimeout = null;
let playTimeoutTimer = null;
const STREAM_LOAD_TIMEOUT_MS = 12000; // 12 seconds before switching to backup
let isEmbedActive = false;

// ── Firebase Configuration
// Replace the values below with your web app's Firebase configuration from the Firebase console.
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCiOb_h9Mb73Ql09xxQXVq8zm_-isPjTNY",
  authDomain: "totemic-sector-373910.firebaseapp.com",
  databaseURL: "https://totemic-sector-373910-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "totemic-sector-373910",
  storageBucket: "totemic-sector-373910.firebasestorage.app",
  messagingSenderId: "993709551183",
  appId: "1:993709551183:web:358d38f050115cf984843a"
};


// ── SVG Icons
const ICONS = {
  play: `<svg id="icon-play" width="14" height="16" viewBox="0 0 14 16" fill="currentColor" class="hidden"><path d="M0 0L14 8L0 16V0Z"/></svg>
         <svg id="icon-pause" width="12" height="16" viewBox="0 0 12 16" fill="currentColor"><rect x="0" width="4" height="16" rx="1"/><rect x="8" width="4" height="16" rx="1"/></svg>`,
  vol: `<svg id="icon-vol" width="16" height="14" viewBox="0 0 16 14" fill="currentColor"><path d="M0 5v4h2.67L6 12.33V1.67L2.67 5H0zm10.5 2c0-1.77-1-3.29-2.5-4.03v8.05c1.5-.73 2.5-2.25 2.5-4.02z"/><path d="M8 0v1.56c2.37.97 4 3.31 4 6.04s-1.63 5.07-4 6.04V15c3.28-.97 5.5-4 5.5-7.5S11.28.97 8 0z"/></svg>
        <svg id="icon-muted" width="16" height="14" viewBox="0 0 16 14" fill="currentColor" class="hidden"><path d="M6 1.67L2.67 5H0v4h2.67L6 12.33V1.67zm7.5 5.33l1.5-1.5-1.06-1.06L12.44 6l-1.5-1.5L9.88 5.56 11.38 7l-1.5 1.5 1.06 1.06L12.44 8l1.5 1.5 1.06-1.06L13.5 7z"/></svg>`,
  pip: `<svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><path d="M13 1H2C.9 1 0 1.9 0 3v9c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 11H2V3h11v9zm-1-4.5H8.5V11H12V7.5z"/></svg>`,
  fullscreen: `<svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><path d="M1 1h4V0H0v5h1V1zm9-1v1h4v4h1V0h-5zm-9 14v-4H0v5h5v-1H1zm13 0h-4v1h5v-5h-1v4z"/></svg>`,
};

// ── DOM refs
let $video,
  $chList,
  $npName,
  $ctrlChName,
  $search,
  $ovLoad,
  $ovErr,
  $errSub,
  $btnPlay,
  $iconPlay,
  $iconPause,
  $btnMute,
  $iconVol,
  $iconMuted,
  $volSlider,
  $toasts,
  $noResults,
  $chCount,
  $qualBtn,
  $qualLabel,
  $qualMenu,
  $btnPip,
  $sidebar,
  $backdrop,
  $btnSB,
  setGuideOpen;

// ══════════════════════════════════════════
//  BOOT
// ══════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  $video = document.getElementById("player");
  $chList = document.getElementById("ch-list");
  $npName = document.getElementById("np-name");
  $ctrlChName = document.getElementById("ctrl-ch-name");
  $search = document.getElementById("search-input");
  $ovLoad = document.getElementById("overlay-loading");
  $ovErr = document.getElementById("overlay-error");
  $errSub = document.getElementById("err-sub");
  $btnPlay = document.getElementById("ctrl-play");
  $btnMute = document.getElementById("ctrl-mute");
  document.getElementById("ctrl-fs").innerHTML = ICONS.fullscreen;
  $btnPlay.innerHTML = ICONS.play;
  $btnMute.innerHTML = ICONS.vol;
  $iconPlay = document.getElementById("icon-play");
  $iconPause = document.getElementById("icon-pause");
  $iconVol = document.getElementById("icon-vol");
  $iconMuted = document.getElementById("icon-muted");
  $volSlider = document.getElementById("vol-slider");
  $toasts = document.getElementById("toasts");
  $noResults = document.getElementById("no-results");
  $chCount = document.getElementById("channel-count");
  $qualBtn = document.getElementById("ctrl-qual");
  $qualLabel = document.getElementById("qual-label");
  $qualMenu = document.getElementById("qual-menu");

  $btnPip = document.getElementById("ctrl-pip");
  if ($btnPip) {
    $btnPip.innerHTML = ICONS.pip;
    if (!document.pictureInPictureEnabled) {
      $btnPip.style.display = "none";
    } else {
      $btnPip.addEventListener("click", togglePiP);
    }
  }

  $sidebar = document.getElementById("sidebar");
  const $chat = document.getElementById("chat");
  $btnSB = document.getElementById("btn-sidebar");
  const $btnChat = document.getElementById("btn-chat");
  $backdrop = document.getElementById("guide-backdrop");

  // Chat is hidden by default — mark button as "closed"
  $chat.classList.add("closed");

  setGuideOpen = function (open) {
    $sidebar.classList.toggle("closed", !open);
    $btnSB.classList.toggle("on", open);
    if ($backdrop) $backdrop.classList.toggle("show", open);
  };

  // Live guide toggle
  $btnSB.addEventListener("click", () =>
    setGuideOpen($sidebar.classList.contains("closed")),
  );
  if ($backdrop) $backdrop.addEventListener("click", () => setGuideOpen(false));
  setGuideOpen(false);

  // Chat toggle
  $btnChat.addEventListener("click", () => {
    $chat.classList.toggle("closed");
    const isOpen = !$chat.classList.contains("closed");
    $btnChat.classList.toggle("on", isOpen);
    document.body.classList.toggle("chat-open", isOpen);
  });

  // Close guide after picking a channel (only on mobile/tablet/overlay widths)
  document.addEventListener("click", (e) => {
    const chItem = e.target.closest(".ch-item");
    if (chItem && !$sidebar.classList.contains("closed")) {
      if (window.innerWidth < 1200) {
        setGuideOpen(false);
      }
    }
  });

  // Auto-hide controls on idle
  const $stage = document.querySelector(".stage");
  let idleTimer = null;
  const IDLE_MS = 3000;

  function resetIdle() {
    $stage.classList.remove("idle");
    clearTimeout(idleTimer);

    // Only auto-hide controls if video is playing AND overlays are hidden
    const isError = $ovErr && $ovErr.classList.contains("show");
    const isLoading = $ovLoad && $ovLoad.classList.contains("show");
    if (!$video.paused && !isError && !isLoading) {
      idleTimer = setTimeout(() => $stage.classList.add("idle"), IDLE_MS);
    }
  }

  $stage.addEventListener("mousemove", resetIdle);
  $stage.addEventListener("mousedown", resetIdle);
  $stage.addEventListener("touchstart", resetIdle, { passive: true });
  resetIdle(); // start timer immediately

  // Restore Volume / Mute
  const savedVolume = localStorage.getItem("iptv-volume");
  const savedMuted = localStorage.getItem("iptv-muted") === "true";
  if (savedVolume !== null) {
    const vol = parseFloat(savedVolume);
    $video.volume = vol;
    $volSlider.value = vol;
  } else {
    $video.volume = 1.0;
    $volSlider.value = 1.0;
  }
  setMuted(savedMuted);

  // Controls Event Listeners
  $btnPlay.addEventListener("click", () => {
    togglePlay();
    showFlashOverlay($video.paused ? "pause" : "play");
  });
  $btnMute.addEventListener("click", () => {
    toggleMute();
    showFlashOverlay(muted ? "mute" : "volume");
  });
  $volSlider.addEventListener("input", (e) => {
    const vol = parseFloat(e.target.value);
    $video.volume = vol;
    localStorage.setItem("iptv-volume", vol);
    if (vol === 0) setMuted(true);
    else setMuted(false);
  });
  document.getElementById("ctrl-live").addEventListener("click", () => {
    jumpToLive();
    toast("Jumped to live");
  });
  document
    .getElementById("ctrl-fs")
    .addEventListener("click", toggleFullscreen);
  document.getElementById("retry-btn").addEventListener("click", retryStream);

  // Quality picker toggle
  $qualBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    $qualMenu.classList.toggle("hidden");
  });
  document.addEventListener("click", () => $qualMenu.classList.add("hidden"));

  // Video click & double-click interactions
  $video.addEventListener("click", (e) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      toggleFullscreen();
    } else {
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
        togglePlay();
        showFlashOverlay($video.paused ? "pause" : "play");
      }, 250);
    }
  });

  // Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    if (isEmbedActive) return;
    if (
      document.activeElement &&
      (document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA")
    ) {
      return;
    }

    const key = e.key.toLowerCase();

    if (key === " " || key === "k") {
      e.preventDefault();
      togglePlay();
      showFlashOverlay($video.paused ? "pause" : "play");
    } else if (key === "m") {
      toggleMute();
      showFlashOverlay(muted ? "mute" : "volume");
    } else if (key === "f") {
      e.preventDefault();
      toggleFullscreen();
    } else if (key === "p") {
      e.preventDefault();
      togglePiP();
    } else if (key === "l") {
      e.preventDefault();
      jumpToLive();
      toast("Jumped to live");
    } else if (key === "r") {
      e.preventDefault();
      retryStream();
      toast("Reconnecting stream...");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      adjustVolume(0.05);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      adjustVolume(-0.05);
    }
  });

  // Custom Context Menu Right Click
  const $ctxMenu = document.getElementById("context-menu");
  const $ctxPlay = document.getElementById("ctx-play");
  const $ctxMute = document.getElementById("ctx-mute");
  const $ctxPip = document.getElementById("ctx-pip");
  const $ctxFs = document.getElementById("ctx-fs");
  const $ctxStats = document.getElementById("ctx-stats");

  $stage.addEventListener("contextmenu", (e) => {
    if (e.shiftKey) return; // hold shift to bypass
    e.preventDefault();

    const rect = $stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    $ctxMenu.style.left = `${x}px`;
    $ctxMenu.style.top = `${y}px`;

    $ctxPlay.textContent = $video.paused ? "Play" : "Pause";
    $ctxMute.textContent = muted ? "Unmute" : "Mute";

    if (!document.pictureInPictureEnabled) {
      $ctxPip.style.display = "none";
    } else {
      $ctxPip.style.display = "block";
    }

    $ctxMenu.classList.remove("hidden");
  });

  document.addEventListener("click", () => {
    if ($ctxMenu) $ctxMenu.classList.add("hidden");
  });

  $ctxPlay.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePlay();
    showFlashOverlay($video.paused ? "pause" : "play");
  });
  $ctxMute.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMute();
    showFlashOverlay(muted ? "mute" : "volume");
  });
  $ctxPip.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePiP();
  });
  $ctxFs.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFullscreen();
  });
  $ctxStats.addEventListener("click", toggleStats);

  // Stats close button
  const $statsClose = document.getElementById("stats-close-btn");
  if ($statsClose) {
    $statsClose.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("stats-panel").classList.add("hidden");
      stopStatsInterval();
    });
  }

  // Video Media Engine Events
  $video.addEventListener("pause", () => {
    setPaused(true);
    clearPlayTimeoutWatchdog();
  });
  $video.addEventListener("play", () => setPaused(false));
  $video.addEventListener("waiting", () => showLoad(true));
  $video.addEventListener("playing", () => {
    showLoad(false);
    hideErr();
    clearPlayTimeoutWatchdog();
    if (activeId) {
      markChannelOnline(activeId);
    }
  });
  $video.addEventListener("error", () => {
    clearPlayTimeoutWatchdog();
    if (!hls) {
      handleNativeVideoError();
    }
  });

  // Search Engine Listener
  $search.addEventListener("input", onSearch);

  const $logo = document.getElementById("logo-home");
  if ($logo) {
    $logo.addEventListener("click", showHomePage);
  }

  // Initialize
  initChannels();
  startAutomaticStatusCheck();
  initLiveChat();
});

// ══════════════════════════════════════════
//  CHANNEL LIST & DOM BUILDERS
// ══════════════════════════════════════════
function initChannels() {
  if (typeof CHANNELS_DATA === "undefined") {
    $chList.innerHTML =
      '<div style="padding:16px;font-size:.78rem;color:var(--text3)">channels.js not found</div>';
    return;
  }
  channels = [];
  $chList.innerHTML = "";

  CHANNELS_DATA.categories.forEach((cat) => {
    const lbl = document.createElement("div");
    lbl.className = "cat-label";
    lbl.dataset.cat = cat.name;
    lbl.innerHTML = `<span class="cat-icon">${cat.icon}</span>${cat.name}`;
    $chList.appendChild(lbl);

    cat.channels.forEach((ch) => {
      ch.category = cat.name;
      channels.push(ch);
      $chList.appendChild(buildChItem(ch));
    });
  });

  if ($chCount) $chCount.textContent = channels.length;
  initHomePage();
}

function buildChannelLogo(ch, variant = "guide") {
  const initials = ch.shortName.slice(0, 3);
  const boxClass =
    variant === "tile"
      ? "ch-logo-box ch-logo-box--tile"
      : "ch-logo-box ch-logo-box--guide";
  const fallbackOnly = !ch.logo;

  return `
    <div class="${boxClass}${fallbackOnly ? " logo-failed" : ""}">
      ${
        ch.logo
          ? `<img class="ch-logo-img" src="${ch.logo}" alt="${ch.shortName}" referrerpolicy="no-referrer" loading="lazy" decoding="async" onerror="this.closest('.ch-logo-box').classList.add('logo-failed')">`
          : ""
      }
      <span class="ch-initials ch-logo-fallback">${initials}</span>
    </div>`;
}

function initHomePage() {
  if (typeof CHANNELS_DATA === "undefined") return;
  const $stageHome = document.getElementById("stage-home");
  if (!$stageHome) return;

  $stageHome.innerHTML = "";
  const offlineList = getOfflineChannels();

  CHANNELS_DATA.categories.forEach((cat) => {
    const section = document.createElement("div");
    section.className = "home-section";

    const title = document.createElement("h2");
    title.className = "yt-row-title";
    title.textContent = cat.name;
    section.appendChild(title);

    const carousel = document.createElement("div");
    carousel.className = "carousel-track";

    cat.channels.forEach((ch) => {
      const isOffline = offlineList.includes(ch.id);
      const card = document.createElement("div");
      card.className =
        "yt-tile home-ch-card" + (isOffline ? " is-offline" : "");
      card.dataset.id = ch.id;
      card.dataset.search = ch.name.toLowerCase();

      card.innerHTML = `
        <div class="yt-tile-thumb">
          ${buildChannelLogo(ch, "tile")}
          <span class="yt-tile-live home-live-badge">LIVE</span>
        </div>
        <p class="yt-tile-title home-ch-name">${ch.name}</p>
        <p class="yt-tile-meta">${ch.quality}</p>
      `;

      card.addEventListener("click", () => {
        loadChannel(ch.id);
      });

      carousel.appendChild(card);
    });

    section.appendChild(carousel);
    $stageHome.appendChild(section);
  });

  const noHomeResults = document.createElement("div");
  noHomeResults.id = "home-no-results";
  noHomeResults.className = "no-results-home";
  noHomeResults.style.display = "none";
  noHomeResults.innerHTML = `
    <div class="no-results-content">No channels found</div>
    <div class="no-results-sub">Try searching for another query</div>
  `;
  $stageHome.appendChild(noHomeResults);

  const footer = document.createElement("footer");
  footer.className = "app-footer";
  footer.innerHTML =
    'Developed by <a href="https://trionine.xyz" target="_blank" rel="noopener">TRIONINE</a>';
  $stageHome.appendChild(footer);
}

function showHomePage() {
  activeId = null;
  document
    .querySelectorAll(".ch-item")
    .forEach((el) => el.classList.remove("active"));

  if (hls) {
    hls.destroy();
    hls = null;
  }
  $video.src = "";
  $video.load();

  stopStatsInterval();
  clearPlayTimeoutWatchdog();
  document.body.classList.remove("is-watching");

  if (typeof setGuideOpen === "function") {
    setGuideOpen(false);
  }

  $npName.textContent = "Browse Live TV";
  $ctrlChName.textContent = "";

  const $idle = document.getElementById("idle-screen");
  if ($idle) $idle.style.display = "";

  showLoad(false);
  hideErr();
  const stage = document.querySelector(".stage");
  if (stage) stage.classList.add("idle");

  const $stageHome = document.getElementById("stage-home");
  if ($stageHome) $stageHome.classList.remove("hidden");
}

function buildChItem(ch) {
  const offlineList = getOfflineChannels();
  const isOffline = offlineList.includes(ch.id);
  const el = document.createElement("div");
  el.className = "ch-item" + (isOffline ? " is-offline" : "");
  el.id = `ch-${ch.id}`;
  el.dataset.id = ch.id;
  el.dataset.search = ch.name.toLowerCase();

  const q = (ch.quality || "HD").toLowerCase();
  const qClass = q === "fhd" ? "fhd" : q === "hd" ? "hd" : "sd";

  el.innerHTML = `
    ${buildChannelLogo(ch, "guide")}
    <div class="ch-info">
      <div class="ch-name">${ch.name}</div>
      <div class="ch-meta">
        <span class="ch-live-dot"></span>
        <span class="q-badge ${qClass}">${ch.quality}</span>
      </div>
    </div>`;

  el.addEventListener("click", () => loadChannel(ch.id));
  return el;
}

// ══════════════════════════════════════════
//  STREAM LOAD ENGINE
// ══════════════════════════════════════════
function loadChannel(id, streamIdx) {
  const ch = channels.find((c) => c.id === id);
  if (!ch) return;

  document.body.classList.add("is-watching");

  if (window.innerWidth >= 1200 && typeof setGuideOpen === "function") {
    setGuideOpen(true);
  }

  const $stageHome = document.getElementById("stage-home");
  if ($stageHome) $stageHome.classList.add("hidden");

  const $idle = document.getElementById("idle-screen");
  if ($idle) $idle.style.display = "none";

  document
    .querySelectorAll(".ch-item")
    .forEach((el) => el.classList.remove("active"));
  const el = document.getElementById(`ch-${id}`);
  if (el) {
    el.classList.add("active");
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  activeId = id;
  activeStreamIdx = streamIdx ?? 0;
  localStorage.setItem("iptv-last-channel", id);
  $npName.textContent = ch.name;
  $ctrlChName.textContent = ch.name;

  const $statsPanel = document.getElementById("stats-panel");
  if ($statsPanel && !$statsPanel.classList.contains("hidden")) {
    updateStats();
    startStatsInterval();
  }

  buildQualMenu(ch);

  const streams = getStreams(ch);
  const url = streams[activeStreamIdx]?.url || streams[0].url;

  const youtubeId = getYouTubeId(url);
  const $embedPlayer = document.getElementById("embed-player");
  const $stage = document.querySelector(".stage");

  if (youtubeId) {
    isEmbedActive = true;
    if (hls) {
      hls.destroy();
      hls = null;
    }
    $video.pause();
    $video.src = "";
    $video.classList.add("hidden");
    stopStatsInterval();
    clearPlayTimeoutWatchdog();

    if ($embedPlayer) {
      $embedPlayer.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
      $embedPlayer.classList.remove("hidden");
    }
    if ($stage) $stage.classList.add("is-embed");

    showLoad(false);
    hideErr();
  } else {
    isEmbedActive = false;
    if ($embedPlayer) {
      $embedPlayer.src = "";
      $embedPlayer.classList.add("hidden");
    }
    if ($stage) $stage.classList.remove("is-embed");
    $video.classList.remove("hidden");

    showLoad(true);
    hideErr();
    startHLS(url);
  }

  populateWatchMore(id);

  // Initialize or update the custom YouTube-style live chat
  currentChannel = ch;
  initLiveChat();
}

function getYouTubeId(url) {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getStreams(ch) {
  return ch.streams || [{ label: "Auto", url: ch.stream }];
}

function populateWatchMore(currentId) {
  const $wm = document.getElementById("watch-more");
  if (!$wm) return;

  const allChannels = [];
  CHANNELS_DATA.categories.forEach((cat) => {
    cat.channels.forEach((ch) => {
      if (ch.id !== currentId) {
        allChannels.push(ch);
      }
    });
  });

  if (!allChannels.length) {
    $wm.innerHTML = "";
    return;
  }

  const offlineList = getOfflineChannels();

  $wm.innerHTML = `
    <div class="wm-title">More Channels</div>
    <div class="wm-grid">
      ${allChannels
        .map((ch) => {
          const isOffline = offlineList.includes(ch.id);
          return `
          <div class="wm-card${isOffline ? " is-offline" : ""}" data-id="${ch.id}" data-search="${ch.name.toLowerCase()}">
            <div class="wm-thumb">
              ${buildChannelLogo(ch, "tile")}
            </div>
            <div class="wm-name">${ch.name}</div>
            <div class="wm-meta">${ch.quality}</div>
          </div>`;
        })
        .join("")}
    </div>`;

  $wm.querySelectorAll(".wm-card").forEach((card) => {
    card.addEventListener("click", () => loadChannel(card.dataset.id));
  });

  if ($search && $search.value) {
    onSearch({ target: $search });
  }
}

function buildQualMenu(ch) {
  const streams = getStreams(ch);
  const header = $qualMenu.querySelector(".qual-menu-label");
  $qualMenu.innerHTML = "";
  if (header) $qualMenu.appendChild(header);

  if (streams.length <= 1) {
    $qualBtn.style.display = "none";
    $qualLabel.textContent = streams[0]?.label || "AUTO";
    return;
  }
  $qualBtn.style.display = "";

  streams.forEach((s, i) => {
    const item = document.createElement("div");
    item.className = "qual-item" + (i === activeStreamIdx ? " active" : "");
    item.textContent = s.label;
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      $qualMenu.classList.add("hidden");
      if (i === activeStreamIdx) return;
      activeStreamIdx = i;
      $qualLabel.textContent = s.label.toUpperCase();
      showLoad(true);
      hideErr();
      startHLS(s.url);
      $qualMenu
        .querySelectorAll(".qual-item")
        .forEach((el, j) => el.classList.toggle("active", j === i));
      toast(`Quality: ${s.label}`);
    });
    $qualMenu.appendChild(item);
  });
  $qualLabel.textContent = (
    streams[activeStreamIdx]?.label || "AUTO"
  ).toUpperCase();
}

function buildQualMenuFromHlsLevels() {
  if (!hls || !hls.levels || hls.levels.length <= 1) {
    $qualBtn.style.display = "none";
    return;
  }

  $qualBtn.style.display = "";
  const header = $qualMenu.querySelector(".qual-menu-label");
  $qualMenu.innerHTML = "";
  if (header) $qualMenu.appendChild(header);

  const autoItem = document.createElement("div");
  autoItem.className = "qual-item" + (hls.currentLevel === -1 ? " active" : "");
  autoItem.textContent = "Auto";
  autoItem.addEventListener("click", (e) => {
    e.stopPropagation();
    $qualMenu.classList.add("hidden");
    hls.currentLevel = -1;
    $qualLabel.textContent = "AUTO";
    $qualMenu
      .querySelectorAll(".qual-item")
      .forEach((el) => el.classList.remove("active"));
    autoItem.classList.add("active");
    toast("Auto quality");
  });
  $qualMenu.appendChild(autoItem);

  for (let idx = hls.levels.length - 1; idx >= 0; idx--) {
    const lvl = hls.levels[idx];
    const item = document.createElement("div");
    const height =
      lvl.height || (lvl.bitrate ? `${Math.round(lvl.bitrate / 1000)}k` : idx);
    const label = height ? `${height}p` : `Level ${idx + 1}`;

    item.className = "qual-item" + (hls.currentLevel === idx ? " active" : "");
    item.textContent = label;
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      $qualMenu.classList.add("hidden");
      hls.currentLevel = idx;
      $qualLabel.textContent = label.toUpperCase();
      $qualMenu
        .querySelectorAll(".qual-item")
        .forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
      toast(`Quality: ${label}`);
    });
    $qualMenu.appendChild(item);
  }

  if (hls.currentLevel === -1) {
    $qualLabel.textContent = "AUTO";
  } else {
    const lvl = hls.levels[hls.currentLevel];
    const height = lvl ? lvl.height : null;
    $qualLabel.textContent = height ? `${height}P` : "AUTO";
  }
}

function startHLS(url) {
  if (hls) {
    hls.destroy();
    hls = null;
  }
  stopStatsInterval();
  clearPlayTimeoutWatchdog();
  startPlayTimeoutWatchdog();

  if (Hls.isSupported()) {
    hls = new Hls({ enableWorker: true });
    hls.loadSource(url);
    hls.attachMedia($video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      retryCount = 0;
      $video.play().catch(() => {});
      const ch = channels.find((c) => c.id === activeId);
      if (ch && (!ch.streams || ch.streams.length <= 1)) {
        buildQualMenuFromHlsLevels();
      }
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        console.warn("HLS Fatal Error:", data);
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            const isManifestError =
              data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR ||
              data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT;
            const ch = channels.find((c) => c.id === activeId);
            const hasBackup = ch && ch.streams && ch.streams.length > 1;

            if (isManifestError && hasBackup) {
              handleFatalError(data);
            } else if (retryCount < MAX_RETRIES) {
              retryCount++;
              toast(
                `Network issue. Retrying (${retryCount}/${MAX_RETRIES})...`,
              );
              hls.startLoad();
            } else {
              handleFatalError(data);
            }
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              toast(
                `Media issue. Recovering (${retryCount}/${MAX_RETRIES})...`,
              );
              hls.recoverMediaError();
            } else {
              handleFatalError(data);
            }
            break;
          default:
            handleFatalError(data);
            break;
        }
      }
    });
  } else if ($video.canPlayType("application/vnd.apple.mpegurl")) {
    retryCount = 0;
    $video.src = url;
    $video.play().catch(() => {});
  } else {
    showLoad(false);
    showErr("HLS not supported in this browser");
  }
}

function handleFatalError(data) {
  if (!activeId) return;
  const ch = channels.find((c) => c.id === activeId);
  if (ch) {
    const streams = getStreams(ch);
    if (activeStreamIdx + 1 < streams.length) {
      const nextIdx = activeStreamIdx + 1;
      toast(`Stream failed. Switching to backup ${streams[nextIdx].label}...`);
      clearPlayTimeoutWatchdog();
      setTimeout(() => {
        if (activeId) loadChannel(activeId, nextIdx);
      }, 500);
      return;
    }
  }
  showLoad(false);
  showErr(data.details || "Stream error");
  markChannelOffline(activeId);
}

function handleNativeVideoError() {
  if (!activeId) return;
  const ch = channels.find((c) => c.id === activeId);
  if (ch) {
    const streams = getStreams(ch);
    if (activeStreamIdx + 1 < streams.length) {
      const nextIdx = activeStreamIdx + 1;
      toast(`Stream failed. Switching to backup ${streams[nextIdx].label}...`);
      clearPlayTimeoutWatchdog();
      setTimeout(() => {
        if (activeId) loadChannel(activeId, nextIdx);
      }, 500);
      return;
    }
  }
  showLoad(false);
  showErr("Native playback failed");
  markChannelOffline(activeId);
}

function startPlayTimeoutWatchdog() {
  clearPlayTimeoutWatchdog();
  playTimeoutTimer = setTimeout(() => {
    if (!activeId) return;
    if ($video.paused || $video.seeking || !$video.currentTime) {
      const ch = channels.find((c) => c.id === activeId);
      if (ch) {
        const streams = getStreams(ch);
        if (activeStreamIdx + 1 < streams.length) {
          const nextIdx = activeStreamIdx + 1;
          toast(
            `Load timeout. Switching to backup ${streams[nextIdx].label}...`,
          );
          loadChannel(activeId, nextIdx);
          return;
        }
      }
      showLoad(false);
      showErr("Stream load timed out");
      markChannelOffline(activeId);
    }
  }, STREAM_LOAD_TIMEOUT_MS);
}

function clearPlayTimeoutWatchdog() {
  if (playTimeoutTimer) {
    clearTimeout(playTimeoutTimer);
    playTimeoutTimer = null;
  }
}

// ══════════════════════════════════════════
//  UI MEDIA INTERFACES
// ══════════════════════════════════════════
function togglePlay() {
  if ($video.paused) $video.play();
  else $video.pause();
}

function setPaused(paused) {
  $iconPlay.classList.toggle("hidden", !paused);
  $iconPause.classList.toggle("hidden", paused);
}

function toggleMute() {
  setMuted(!muted);
}

function setMuted(val) {
  muted = val;
  $video.muted = muted;
  $iconVol.classList.toggle("hidden", muted);
  $iconMuted.classList.toggle("hidden", !muted);
  if (muted) $volSlider.value = 0;
  else {
    $volSlider.value = $video.volume || 1;
    $video.volume = $video.volume || 1;
  }
  localStorage.setItem("iptv-muted", muted);
}

function adjustVolume(delta) {
  let vol = $video.volume + delta;
  vol = Math.max(0, Math.min(1, vol));
  $video.volume = vol;
  $volSlider.value = vol;
  localStorage.setItem("iptv-volume", vol);
  if (vol === 0) setMuted(true);
  else setMuted(false);
  showFlashOverlay("volume", Math.round(vol * 100));
}

async function togglePiP() {
  if (!document.pictureInPictureEnabled) {
    toast("PiP not supported");
    return;
  }
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      showFlashOverlay("pip", false);
    } else {
      await $video.requestPictureInPicture();
      showFlashOverlay("pip", true);
    }
  } catch (err) {
    console.error("PiP Error:", err);
    toast("Failed to toggle PiP");
  }
}

function showFlashOverlay(type, detail = "") {
  const $flash = document.getElementById("flash-overlay");
  const $icon = document.getElementById("flash-icon");
  const $text = document.getElementById("flash-text");
  if (!$flash || !$icon || !$text) return;

  $flash.classList.remove("show");
  void $flash.offsetWidth; // Force Reflow

  let iconHtml = "";
  let textStr = "";

  switch (type) {
    case "play":
      iconHtml =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      textStr = "PLAY";
      break;
    case "pause":
      iconHtml =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      textStr = "PAUSE";
      break;
    case "mute":
      iconHtml =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
      textStr = "MUTED";
      break;
    case "volume":
      iconHtml =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
      textStr = detail ? `${detail}%` : "VOLUME";
      break;
    case "pip":
      iconHtml =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7H9c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 12H9V9h10v10zm-9-2h6v-4h-6v4zM3 5v14H1V5c0-1.1.9-2 2-2h16v2H3z"/></svg>';
      textStr = detail ? "PIP ON" : "PIP OFF";
      break;
    default:
      return;
  }

  $icon.innerHTML = iconHtml;
  $text.textContent = textStr;
  $flash.classList.add("show");

  clearTimeout(window.flashTimeout);
  window.flashTimeout = setTimeout(() => {
    $flash.classList.remove("show");
  }, 600);
}

function toggleStats(e) {
  if (e) e.stopPropagation();
  const $stats = document.getElementById("stats-panel");
  if (!$stats) return;

  const isHidden = $stats.classList.toggle("hidden");
  if (!isHidden) startStatsInterval();
  else stopStatsInterval();
}

function startStatsInterval() {
  stopStatsInterval();
  updateStats();
  statsInterval = setInterval(updateStats, 1000);
}

function stopStatsInterval() {
  if (statsInterval) {
    clearInterval(statsInterval);
    statsInterval = null;
  }
}

function updateStats() {
  const $channel = document.getElementById("stats-channel");
  const $source = document.getElementById("stats-source");
  const $resolution = document.getElementById("stats-resolution");
  const $buffer = document.getElementById("stats-buffer");
  const $bitrate = document.getElementById("stats-bitrate");
  const $dropped = document.getElementById("stats-dropped");
  const $engine = document.getElementById("stats-engine");

  const ch = channels.find((c) => c.id === activeId);

  if ($channel) $channel.textContent = ch ? ch.name : "—";

  if ($source && ch) {
    const streams = getStreams(ch);
    const url = streams[activeStreamIdx]?.url || streams[0]?.url || "-";
    const label = streams[activeStreamIdx]?.label || "";
    try {
      const parsed = new URL(url);
      $source.textContent = (label ? `[${label}] ` : "") + parsed.hostname;
      $source.title = url;
    } catch {
      $source.textContent = url;
    }
  } else if ($source) {
    $source.textContent = "—";
  }

  if ($resolution) {
    $resolution.textContent = $video.videoWidth
      ? `${$video.videoWidth} × ${$video.videoHeight}`
      : "—";
  }

  if ($buffer) {
    let bufLen = 0;
    const time = $video.currentTime;
    try {
      for (let i = 0; i < $video.buffered.length; i++) {
        if (
          time >= $video.buffered.start(i) &&
          time <= $video.buffered.end(i)
        ) {
          bufLen = $video.buffered.end(i) - time;
          break;
        }
      }
    } catch {}
    $buffer.textContent = `${bufLen.toFixed(1)}s`;
  }

  if ($bitrate) {
    if (hls && hls.levels && hls.levels.length) {
      if (hls.currentLevel === -1) {
        $bitrate.textContent = "Auto";
      } else {
        const lvl = hls.levels[hls.currentLevel];
        $bitrate.textContent = lvl?.bitrate
          ? `${(lvl.bitrate / 1_000_000).toFixed(2)} Mbps`
          : "—";
      }
    } else {
      $bitrate.textContent = hls ? "—" : "N/A";
    }
  }

  if ($dropped) {
    if ($video.getVideoPlaybackQuality) {
      const q = $video.getVideoPlaybackQuality();
      $dropped.textContent = `${q.droppedVideoFrames} / ${q.totalVideoFrames}`;
    } else {
      $dropped.textContent = "N/A";
    }
  }

  if ($engine) $engine.textContent = hls ? "HLS.js" : "Native";
}

function jumpToLive() {
  if ($video.seekable.length) {
    $video.currentTime = $video.seekable.end($video.seekable.length - 1);
    $video.play().catch(() => {});
  }
}

function toggleFullscreen() {
  const stage = document.querySelector(".stage");
  if (!document.fullscreenElement) stage.requestFullscreen?.();
  else document.exitFullscreen?.();
}

function retryStream() {
  const ch = channels.find((c) => c.id === activeId);
  if (!ch) return;
  const streams = ch.streams || [{ label: "Auto", url: ch.stream }];
  hideErr();
  showLoad(true);
  startHLS(streams[activeStreamIdx]?.url || streams[0].url);
}

// ══════════════════════════════════════════
//  SEARCH FILTER INTERFACE
// ══════════════════════════════════════════
function onSearch(e) {
  const q = e.target.value.toLowerCase().trim();
  let anySidebarVisible = false;
  let anyHomeVisible = false;

  document.querySelectorAll(".ch-item").forEach((el) => {
    const match = !q || el.dataset.search.includes(q);
    el.style.display = match ? "" : "none";
    if (match) anySidebarVisible = true;
  });

  document.querySelectorAll(".cat-label").forEach((lbl) => {
    let sib = lbl.nextElementSibling;
    let catVisible = false;
    while (sib && !sib.classList.contains("cat-label")) {
      if (sib.style.display !== "none") catVisible = true;
      sib = sib.nextElementSibling;
    }
    lbl.style.display = catVisible ? "" : "none";
  });

  if ($noResults)
    $noResults.style.display = anySidebarVisible ? "none" : "block";

  document.querySelectorAll(".home-ch-card").forEach((card) => {
    const match =
      !q || (card.dataset.search && card.dataset.search.includes(q));
    card.style.display = match ? "" : "none";
    if (match) anyHomeVisible = true;
  });

  document.querySelectorAll(".home-section").forEach((sec) => {
    const cards = sec.querySelectorAll(".home-ch-card");
    let secVisible = false;
    cards.forEach((card) => {
      if (card.style.display !== "none") secVisible = true;
    });
    sec.style.display = secVisible ? "" : "none";
  });

  const $homeNoResults = document.getElementById("home-no-results");
  if ($homeNoResults)
    $homeNoResults.style.display = anyHomeVisible ? "none" : "flex";

  let anyWmVisible = false;
  document.querySelectorAll(".wm-card").forEach((card) => {
    const match =
      !q || (card.dataset.search && card.dataset.search.includes(q));
    card.style.display = match ? "" : "none";
    if (match) anyWmVisible = true;
  });

  const $wmTitle = document.querySelector(".wm-title");
  if ($wmTitle) $wmTitle.style.display = anyWmVisible ? "" : "none";
}

function showLoad(v) {
  if ($ovLoad) $ovLoad.classList.toggle("show", v);
}
function showErr(msg) {
  if ($errSub) $errSub.textContent = msg || "Stream unavailable";
  if ($ovErr) $ovErr.classList.add("show");
  showLoad(false);
}
function hideErr() {
  if ($ovErr) $ovErr.classList.remove("show");
}

function toast(msg, ms = 2200) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  $toasts.appendChild(t);
  setTimeout(() => {
    t.classList.add("out");
    t.addEventListener("animationend", () => t.remove(), { once: true });
  }, ms);
}

// ══════════════════════════════════════════
//  OFFLINE STATUS BACKGROUND CHECKER
// ══════════════════════════════════════════
function getOfflineChannels() {
  try {
    return JSON.parse(localStorage.getItem("iptv-offline-channels") || "[]");
  } catch (e) {
    return [];
  }
}
function saveOfflineChannels(list) {
  localStorage.setItem("iptv-offline-channels", JSON.stringify(list));
}

function markChannelOffline(id) {
  if (!id) return;
  let offline = getOfflineChannels();
  if (!offline.includes(id)) {
    offline.push(id);
    saveOfflineChannels(offline);
    updateChannelStatusUI(id, false);
  }
}

function markChannelOnline(id) {
  if (!id) return;
  let offline = getOfflineChannels();
  if (offline.includes(id)) {
    offline = offline.filter((x) => x !== id);
    saveOfflineChannels(offline);
    updateChannelStatusUI(id, true);
  }
}

function updateChannelStatusUI(id, isOnline) {
  const $sideItem = document.getElementById(`ch-${id}`);
  if ($sideItem) $sideItem.classList.toggle("is-offline", !isOnline);
  const $homeCard = document.querySelector(`.home-ch-card[data-id="${id}"]`);
  if ($homeCard) $homeCard.classList.toggle("is-offline", !isOnline);
  const $wmCard = document.querySelector(`.wm-card[data-id="${id}"]`);
  if ($wmCard) $wmCard.classList.toggle("is-offline", !isOnline);
}

async function checkChannelStatus(ch) {
  if (ch.isEmbed || ch.id === "peace-tv-bangla" || ch.id === "madani-channel")
    return true;
  const streams = getStreams(ch);
  if (!streams.length) return false;
  if (streams.some((s) => getYouTubeId(s.url))) return true;

  for (const stream of streams) {
    const url = stream.url;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: { Accept: "*/*" },
      });
      clearTimeout(timeoutId);
      if (!res.ok) continue;

      const text = await res.text();
      if (!text.trim().startsWith("#EXTM3U")) continue;

      let playlistText = text;
      let playlistUrl = url;

      if (text.includes("#EXT-X-STREAM-INF")) {
        const lines = text.split("\n");
        let subPath = "";
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes("#EXT-X-STREAM-INF")) {
            for (let j = i + 1; j < lines.length; j++) {
              const trimmed = lines[j].trim();
              if (trimmed && !trimmed.startsWith("#")) {
                subPath = trimmed;
                break;
              }
            }
            break;
          }
        }
        if (subPath) {
          const subUrl = subPath.startsWith("http")
            ? subPath
            : new URL(subPath, url).href;
          const subRes = await fetch(subUrl, {
            method: "GET",
            signal: controller.signal,
          });
          if (subRes.ok) {
            playlistText = await subRes.text();
            playlistUrl = subUrl;
          }
        }
      }

      if (!playlistText.trim().startsWith("#EXTM3U")) continue;

      if (playlistText.includes("#EXT-X-KEY")) {
        const match = playlistText.match(/URI=["']([^"']+)["']/);
        if (match && match[1]) {
          let keyUrl = match[1];
          if (!keyUrl.startsWith("http://") && !keyUrl.startsWith("https://"))
            keyUrl = new URL(keyUrl, playlistUrl).href;
          const keyRes = await fetch(keyUrl, {
            method: "GET",
            signal: controller.signal,
          });
          if (!keyRes.ok) continue;
        }
      }
      return true;
    } catch (e) {
      clearTimeout(timeoutId);
    }
  }
  return false;
}

async function startAutomaticStatusCheck() {
  if (typeof CHANNELS_DATA === "undefined" || !navigator.onLine) return;
  await new Promise((r) => setTimeout(r, 5000));

  const allChannels = [];
  CHANNELS_DATA.categories.forEach((cat) =>
    cat.channels.forEach((ch) => allChannels.push(ch)),
  );

  const concurrency = 2;
  let index = 0;

  async function worker() {
    while (index < allChannels.length) {
      const ch = allChannels[index++];
      if (!ch) break;
      if (document.body.classList.contains("is-watching"))
        await new Promise((r) => setTimeout(r, 2000));
      else await new Promise((r) => setTimeout(r, 300));

      const isOnline = await checkChannelStatus(ch);
      if (isOnline) markChannelOnline(ch.id);
      else markChannelOffline(ch.id);
    }
  }

  const workers = [];
  for (let i = 0; i < Math.min(concurrency, allChannels.length); i++)
    workers.push(worker());
  await Promise.all(workers);
}

// ── YouTube Live Chat Controller ──
let currentChatRef = null;

function initLiveChat() {
  const $msgContainer = document.getElementById("chat-messages");
  const $inputArea = document.getElementById("chat-input-area");
  const $btnClose = document.getElementById("btn-close-chat");

  if (!$msgContainer || !$inputArea) return;

  // Close button functionality
  if ($btnClose) {
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
              timestamp: Date.now()
            };
            currentChatRef.child('messages').push(msgData).then(() => {
              currentChatRef.child('lastActive').set(Date.now());
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
    const isAtBottom = $msgContainer.scrollHeight - $msgContainer.scrollTop <= $msgContainer.clientHeight + 50;

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
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Determine if Firebase is configured by checking the API Key placeholder
  const isFirebaseConfigured = typeof firebase !== "undefined" && 
                               FIREBASE_CONFIG.apiKey && 
                               FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";

  // Detach previous Firebase listeners
  if (currentChatRef) {
    currentChatRef.off();
    currentChatRef = null;
  }

  // Clear UI messages
  $msgContainer.innerHTML = "";

  if (isFirebaseConfigured) {
    // ── FIREBASE CHAT OPERATION ──
    if (firebase.apps.length === 0) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }

    const channelId = currentChannel ? currentChannel.id : "lobby";
    currentChatRef = firebase.database().ref(`chats/${channelId}`);

    // Auto-wipe inactivity cleanup (2 hours threshold)
    currentChatRef.child('lastActive').once('value').then(snap => {
      const lastActive = snap.val();
      const now = Date.now();
      if (lastActive && (now - lastActive > 2 * 60 * 60 * 1000)) {
        currentChatRef.child('messages').remove();
      }
      currentChatRef.child('lastActive').set(now);
    });

    // Listen to real-time database updates
    currentChatRef.child('messages').on('child_added', (snapshot) => {
      const msg = snapshot.val();
      if (msg && msg.user && msg.text) {
        addChatMessage(msg.user, msg.text, msg.color || "#e91e63", msg.user === username);
      }
    });

    // Client-side helper to truncate messages to the last 50
    function enforceMessageLimit() {
      currentChatRef.child('messages').once('value').then(snapshot => {
        if (snapshot.exists()) {
          const count = snapshot.numChildren();
          if (count > 50) {
            const keys = [];
            snapshot.forEach(child => {
              keys.push(child.key);
            });
            const toDelete = keys.slice(0, count - 50);
            const updates = {};
            toDelete.forEach(k => {
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
          <strong>Chat Offline:</strong> Configure Firebase at the top of <code>app.js</code> to enable real-time chat with friends.
        </span>
      </div>
    `;
    $msgContainer.appendChild($notice);
  }

  renderInputArea();
}
