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

  const $btnCc = document.getElementById("ctrl-cc");
  if ($btnCc) {
    $btnCc.innerHTML = ICONS.cc;
    $btnCc.addEventListener("click", () => {
      toggleSubtitles();
      showFlashOverlay("cc", subtitleEnabled);
    });
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
    } else if (key === "c") {
      e.preventDefault();
      toggleSubtitles();
      showFlashOverlay("cc", subtitleEnabled);
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
  const $ctxCc = document.getElementById("ctx-cc");
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
  if ($ctxCc) {
    $ctxCc.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSubtitles();
      showFlashOverlay("cc", subtitleEnabled);
    });
  }
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
  const savedHideOffline = localStorage.getItem("iptv-hide-offline");
  const defaultHideOffline = savedHideOffline !== "false"; // default to true (hide offline)

  document.body.classList.toggle("hide-offline-active", defaultHideOffline);
  const $btnToggleOffline = document.getElementById("btn-toggle-offline");
  if ($btnToggleOffline) {
    const $eyeOpen = $btnToggleOffline.querySelector(".eye-open");
    const $eyeClosed = $btnToggleOffline.querySelector(".eye-closed");
    if ($eyeOpen) $eyeOpen.classList.toggle("hidden", !defaultHideOffline);
    if ($eyeClosed) $eyeClosed.classList.toggle("hidden", defaultHideOffline);

    $btnToggleOffline.addEventListener("click", () => {
      const active = document.body.classList.toggle("hide-offline-active");
      localStorage.setItem("iptv-hide-offline", active);
      if ($eyeOpen) $eyeOpen.classList.toggle("hidden", !active);
      if ($eyeClosed) $eyeClosed.classList.toggle("hidden", active);

      updateChannelCount();
      onSearch({ target: $search });
    });
  }

  const $logo = document.getElementById("logo-home");
  if ($logo) {
    $logo.addEventListener("click", showHomePage);
  }

  // Dynamic cue alignment function to center captions at the bottom
  function forceCuesBottom(track) {
    if (!track) return;

    function formatCue(cue) {
      if (!cue) return;
      cue.snapToLines = false;
      cue.line = 85;
      cue.align = "center";
      cue.position = 50;
    }

    // 1. Override addCue to intercept cues as they are added by JS (HLS.js)
    if (!track.addCue_overridden && typeof track.addCue === "function") {
      track.addCue_overridden = true;
      const originalAddCue = track.addCue;
      track.addCue = function (cue) {
        formatCue(cue);
        originalAddCue.call(track, cue);
      };
    }

    // 2. If track already has cues, modify them immediately
    if (track.cues) {
      for (let i = 0; i < track.cues.length; i++) {
        formatCue(track.cues[i]);
      }
    }

    // 3. Fallback: listen to cuechange for active cues
    track.addEventListener("cuechange", () => {
      if (!track.activeCues) return;
      for (let i = 0; i < track.activeCues.length; i++) {
        formatCue(track.activeCues[i]);
      }
    });
  }

  // Monitor native text track changes for native subtitle support
  if ($video && $video.textTracks) {
    for (let i = 0; i < $video.textTracks.length; i++) {
      forceCuesBottom($video.textTracks[i]);
    }

    $video.textTracks.addEventListener("addtrack", (e) => {
      if (e.track) {
        forceCuesBottom(e.track);
      }
      updateCCButtonVisibility();
      if (subtitleEnabled) {
        for (let i = 0; i < $video.textTracks.length; i++) {
          const track = $video.textTracks[i];
          if (track.kind === "subtitles" || track.kind === "captions") {
            track.mode = "showing";
          }
        }
      }
    });
  }

  // Restore subtitle preference from localStorage (skip toast on load)
  const savedSubtitle =
    localStorage.getItem("iptv-subtitle-enabled") === "true";
  setSubtitlesActive(savedSubtitle, true);

  // Initialize channels and status checker
  initChannels();
  startAutomaticStatusCheck();

  // ── Clean Path Routing Interceptor ──
  // Check for 404.html sessionStorage redirect first (GitHub Pages SPA trick)
  const redirectPath = sessionStorage.getItem("iptv-redirect-path");
  if (redirectPath) {
    sessionStorage.removeItem("iptv-redirect-path");
    // Replace browser history so the clean URL is shown
    window.history.replaceState({ channelId: redirectPath }, "", redirectPath);
  }

  // Parses /{category}/{channel-id} or /tv/{channel-id} on initial page load
  const activePath = redirectPath || window.location.pathname;
  const pathSegments = activePath.split("/");

  if (pathSegments[1] && pathSegments[2]) {
    const targetChannelId = pathSegments[2];
    const validChannelExists = channels.find((c) => c.id === targetChannelId);

    if (validChannelExists) {
      loadChannel(targetChannelId);
    } else {
      showHomePage();
    }
  } else {
    showHomePage();
  }

  // ── Browser Back/Forward Navigation Handler ──
  window.addEventListener("popstate", (event) => {
    console.log("Browser navigation detected. Routing layout...");
    const pathSegments = window.location.pathname.split("/");

    if (pathSegments[1] && pathSegments[2]) {
      const targetChannelId = pathSegments[2];
      const validChannelExists = channels.find((c) => c.id === targetChannelId);

      if (validChannelExists) {
        // Use the history-safe bypass to avoid pushing a duplicate history entry
        loadChannelWithoutPush(targetChannelId);
      } else {
        showHomePage();
      }
    } else {
      showHomePage();
    }
  });

  // Initialize chat for the home/lobby screen.
  // core-player.js also calls initLiveChat() on every channel switch —
  // chat-engine.js now guards against double Firebase listeners internally.
  initLiveChat();
});
