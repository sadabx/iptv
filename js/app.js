/* ==========================================
   app.js — Central Orchestrator Initialization Bootstrapper
   ========================================== */

// ── Firebase Configuration
// Replace the values below with your web app's Firebase configuration from the Firebase console.
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCiOb_h9Mb73Ql09xxQXVq8zm_-isPjTNY",
  authDomain: "totemic-sector-373910.firebaseapp.com",
  databaseURL:
    "https://totemic-sector-373910-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "totemic-sector-373910",
  storageBucket: "totemic-sector-373910.firebasestorage.app",
  messagingSenderId: "993709551183",
  appId: "1:993709551183:web:358d38f050115cf984843a",
};

// ══════════════════════════════════════════
//  BOOT
// ══════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  // ── Cache DOM refs ──
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

    // Skip idle timer when YouTube embed is active (no website controls to hide)
    if (isEmbedActive) return;

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
  resetIdle();

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

  // Video click & double-click interactions (skip when YouTube embed is active)
  $video.addEventListener("click", (e) => {
    if (isEmbedActive) return;
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
    if (e.shiftKey) return;
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

  // Video Media Engine Events (skip when YouTube embed is active)
  $video.addEventListener("pause", () => {
    if (isEmbedActive) return;
    setPaused(true);
    clearPlayTimeoutWatchdog();
  });
  $video.addEventListener("play", () => {
    if (!isEmbedActive) setPaused(false);
  });
  $video.addEventListener("waiting", () => {
    if (!isEmbedActive) showLoad(true);
  });
  $video.addEventListener("playing", () => {
    if (isEmbedActive) return;
    showLoad(false);
    hideErr();
    clearPlayTimeoutWatchdog();
    if (activeId) {
      markChannelOnline(activeId);
    }
  });
  $video.addEventListener("error", () => {
    if (isEmbedActive) return;
    clearPlayTimeoutWatchdog();
    if (!hls) {
      handleNativeVideoError();
    }
  });

  // Search Engine Listener
  $search.addEventListener("input", onSearch);

  // Toggle Offline Listener
  const $btnToggleOffline = document.getElementById("btn-toggle-offline");
  if ($btnToggleOffline) {
    $btnToggleOffline.addEventListener("click", () => {
      const active = document.body.classList.toggle("hide-offline-active");
      $btnToggleOffline.querySelector(".eye-open").classList.toggle("hidden", !active);
      $btnToggleOffline.querySelector(".eye-closed").classList.toggle("hidden", active);
      
      updateChannelCount();
      onSearch({ target: $search });
    });
  }

  const $logo = document.getElementById("logo-home");
  if ($logo) {
    $logo.addEventListener("click", showHomePage);
  }

  // Hide preloader
  const $preloader = document.getElementById("preloader");
  if ($preloader) $preloader.classList.add("hidden");

  // Initialize
  initChannels();
  startAutomaticStatusCheck();
  initLiveChat();
});
