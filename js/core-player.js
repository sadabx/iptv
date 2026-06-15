/* ==========================================
   core-player.js — Hls.js Initialization, Quality Maps, PiP, and Watchdog
   ========================================== */

// ── State
let hls = null;
let mpegtsPlayer = null;
let activeId = null;
let currentChannel = null;
let muted = false;
let activeStreamIdx = 0;
let retryCount = 0;
let subtitleEnabled = false;
const MAX_RETRIES = 3;
let statsInterval = null;
let clickTimeout = null;
let playTimeoutTimer = null;
const STREAM_LOAD_TIMEOUT_MS = 12000;
let isEmbedActive = false;

// ── Proxy Configuration
// If your site is hosted on HTTPS, HTTP stream links will fail due to mixed content.
// You can define a default proxy URL here or configure it via local storage:
// localStorage.setItem("iptv-proxy-url", "https://your-proxy.workers.dev/?url=")
const DEFAULT_PROXY_URL = "https://iptv-proxy.sadabsiperkhan.workers.dev/";

function getProxiedUrl(url) {
  if (!url) return "";
  const proxySetting = localStorage.getItem("iptv-proxy-url") || DEFAULT_PROXY_URL;
  if (proxySetting && window.location.protocol === "https:" && url.startsWith("http://")) {
    if (proxySetting.includes("?url=")) {
      return proxySetting + encodeURIComponent(url);
    }
    return proxySetting + url;
  }
  return url;
}

// ── SVG Icons
const ICONS = {
  play: `<svg id="icon-play" width="14" height="16" viewBox="0 0 14 16" fill="currentColor" class="hidden"><path d="M0 0L14 8L0 16V0Z"/></svg>
         <svg id="icon-pause" width="12" height="16" viewBox="0 0 12 16" fill="currentColor"><rect x="0" width="4" height="16" rx="1"/><rect x="8" width="4" height="16" rx="1"/></svg>`,
  vol: `<svg id="icon-vol" width="16" height="14" viewBox="0 0 16 14" fill="currentColor"><path d="M0 5v4h2.67L6 12.33V1.67L2.67 5H0zm10.5 2c0-1.77-1-3.29-2.5-4.03v8.05c1.5-.73 2.5-2.25 2.5-4.02z"/><path d="M8 0v1.56c2.37.97 4 3.31 4 6.04s-1.63 5.07-4 6.04V15c3.28-.97 5.5-4 5.5-7.5S11.28.97 8 0z"/></svg>
        <svg id="icon-muted" width="16" height="14" viewBox="0 0 16 14" fill="currentColor" class="hidden"><path d="M6 1.67L2.67 5H0v4h2.67L6 12.33V1.67zm7.5 5.33l1.5-1.5-1.06-1.06L12.44 6l-1.5-1.5L9.88 5.56 11.38 7l-1.5 1.5 1.06 1.06L12.44 8l1.5 1.5 1.06-1.06L13.5 7z"/></svg>`,
  pip: `<svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><path d="M13 1H2C.9 1 0 1.9 0 3v9c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 11H2V3h11v9zm-1-4.5H8.5V11H12V7.5z"/></svg>`,
  fullscreen: `<svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><path d="M1 1h4V0H0v5h1V1zm9-1v1h4v4h1V0h-5zm-9 14v-4H0v5h5v-1H1zm13 0h-4v1h5v-5h-1v4z"/></svg>`,
  cc: `<svg id="icon-cc" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1V10c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1zm8 0h-1.5v-.5h-2v3h2V13H19v1c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1V10c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1z"/></svg>`,
};

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

  const $ccBtn = document.getElementById("ctrl-cc");
  const $ctxCc = document.getElementById("ctx-cc");
  if ($ccBtn) $ccBtn.classList.add("hidden");
  if ($ctxCc) $ctxCc.classList.add("hidden");

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
    // ── YouTube Embed Mode ──
    isEmbedActive = true;
    if (hls) {
      hls.destroy();
      hls = null;
    }
    if (mpegtsPlayer) {
      mpegtsPlayer.destroy();
      mpegtsPlayer = null;
    }
    $video.pause();
    $video.removeAttribute("src");
    $video.load();
    $video.classList.add("hidden");
    stopStatsInterval();
    clearPlayTimeoutWatchdog();

    if ($embedPlayer) {
      $embedPlayer.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
      $embedPlayer.classList.remove("hidden");
    }
    if ($stage) $stage.classList.add("is-embed");

    showLoad(false);
    hideErr();
  } else {
    // ── Standard HLS / TS Mode ──
    isEmbedActive = false;
    if ($embedPlayer) {
      $embedPlayer.src = "";
      $embedPlayer.classList.add("hidden");
    }
    if ($stage) $stage.classList.remove("is-embed");
    $video.classList.remove("hidden");

    showLoad(true);
    hideErr();
    const proxiedUrl = getProxiedUrl(url);
    if (isTsUrl(url)) {
      startMpegTS(proxiedUrl);
    } else {
      startHLS(proxiedUrl);
    }
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

function isTsUrl(url) {
  if (!url) return false;
  return /\.(ts|mpegts|m2ts)(\?|$)/i.test(url);
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
    item.innerHTML = `${s.label}${s.bitrate ? `<span class="qual-bitrate">${s.bitrate}</span>` : ""}`;
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      $qualMenu.classList.add("hidden");
      if (i === activeStreamIdx) return;
      activeStreamIdx = i;
      $qualLabel.textContent = s.label.toUpperCase();
      loadChannel(activeId, i);
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
  autoItem.innerHTML = `Auto<span class="qual-bitrate"></span>`;
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
    const height =
      lvl.height || (lvl.bitrate ? `${Math.round(lvl.bitrate / 1000)}k` : idx);
    const bitrateMbps = lvl.bitrate
      ? (lvl.bitrate / 1_000_000).toFixed(2)
      : null;
    let label = height ? `${height}p` : `Level ${idx + 1}`;
    let bitrateLabel = bitrateMbps ? `${bitrateMbps} Mbps` : "";

    // Emulate YouTube's "Premium" or "Enhanced bitrate" style for high quality
    if (height >= 1080 && bitrateMbps && bitrateMbps > 5) {
      label = `${height}p Premium HD`;
      bitrateLabel = `Enhanced bitrate • ${bitrateMbps} Mbps`;
    } else if (height >= 720 && bitrateMbps) {
      bitrateLabel = `${bitrateMbps} Mbps`;
    }

    const item = document.createElement("div");
    item.className = "qual-item" + (hls.currentLevel === idx ? " active" : "");
    item.innerHTML = `${label}<span class="qual-bitrate">${bitrateLabel}</span>`;
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
  if (mpegtsPlayer) {
    mpegtsPlayer.destroy();
    mpegtsPlayer = null;
  }
  $video.pause();
  $video.removeAttribute("src");
  $video.load();
  stopStatsInterval();
  clearPlayTimeoutWatchdog();
  startPlayTimeoutWatchdog();

  if (Hls.isSupported()) {
    hls = new Hls({ enableWorker: true });

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      retryCount = 0;
      $video.play().catch(() => { });
      const ch = channels.find((c) => c.id === activeId);
      if (ch && (!ch.streams || ch.streams.length <= 1)) {
        buildQualMenuFromHlsLevels();
      }
    });

    hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (event, data) => {
      updateCCButtonVisibility();
      if (subtitleEnabled && data.subtitleTracks && data.subtitleTracks.length > 0) {
        hls.subtitleTrack = 0;
      }
    });

    hls.attachMedia($video);
    hls.loadSource(url);

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
    $video.play().catch(() => { });
  } else {
    showLoad(false);
    showErr("HLS not supported in this browser");
  }
}

function startMpegTS(url) {
  if (hls) {
    hls.destroy();
    hls = null;
  }
  if (mpegtsPlayer) {
    mpegtsPlayer.destroy();
    mpegtsPlayer = null;
  }
  $video.pause();
  $video.removeAttribute("src");
  $video.load();
  stopStatsInterval();
  clearPlayTimeoutWatchdog();
  startPlayTimeoutWatchdog();

  if (mpegts.getFeatureList().mseLivePlayback) {
    mpegtsPlayer = mpegts.createPlayer({
      type: "mpegts",
      isLive: true,
      url: url,
    }, {
      enableWorker: true,
      lazyLoadMaxDuration: 3 * 60,
      seekType: "range",
    });
    mpegtsPlayer.attachMediaElement($video);
    mpegtsPlayer.load();

    mpegtsPlayer.play()
      .then(() => {
        retryCount = 0;
        $qualBtn.style.display = "none";
        $qualLabel.textContent = "ORIGINAL";
      })
      .catch((err) => {
        console.warn("MpegTS play error:", err);
      });

    mpegtsPlayer.on(mpegts.Events.ERROR, (type, detail, info) => {
      console.warn("MpegTS Fatal Error:", type, detail, info);
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        toast(`MpegTS issue. Retrying (${retryCount}/${MAX_RETRIES})...`);
        mpegtsPlayer.unload();
        mpegtsPlayer.load();
        mpegtsPlayer.play().catch(() => { });
      } else {
        handleMpegTSError(type, detail, info);
      }
    });
  } else {
    showLoad(false);
    showErr("MPEG-TS not supported in this browser");
  }
}

function handleMpegTSError(type, detail, info) {
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
  showErr(detail || "MpegTS error");
  markChannelOffline(activeId);
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
      hideErr();
      toast("Stream load timed out");
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

function hasTextTracks() {
  if (!$video) return false;
  if (hls && hls.subtitleTracks && hls.subtitleTracks.length > 0) {
    return true;
  }
  const tracks = Array.from($video.textTracks || []);
  const subTracks = tracks.filter((t) => t.kind === "subtitles" || t.kind === "captions");
  return subTracks.length > 0;
}

function updateCCButtonVisibility() {
  const $ccBtn = document.getElementById("ctrl-cc");
  const $ctxCc = document.getElementById("ctx-cc");
  const hasSubs = hasTextTracks();

  if ($ccBtn) $ccBtn.classList.toggle("hidden", !hasSubs);
  if ($ctxCc) $ctxCc.classList.toggle("hidden", !hasSubs);
}

function toggleSubtitles() {
  setSubtitlesActive(!subtitleEnabled);
}

function setSubtitlesActive(active, skipToast = false) {
  subtitleEnabled = active;
  localStorage.setItem("iptv-subtitle-enabled", active);

  const $ccBtn = document.getElementById("ctrl-cc");
  const $ctxCc = document.getElementById("ctx-cc");

  if ($ccBtn) {
    $ccBtn.classList.toggle("active", active);
    $ccBtn.title = active ? "Turn off captions (c)" : "Turn on captions (c)";
  }
  if ($ctxCc) {
    $ctxCc.textContent = active ? "Subtitles: ON" : "Subtitles: OFF";
    $ctxCc.classList.toggle("active", active);
  }

  if (hls) {
    if (active) {
      if (hls.subtitleTracks && hls.subtitleTracks.length > 0) {
        hls.subtitleTrack = 0;
      }
    } else {
      hls.subtitleTrack = -1;
    }
  } else {
    // Only fall back to manual track mode loop if hls is not active
    if ($video && $video.textTracks) {
      for (let i = 0; i < $video.textTracks.length; i++) {
        const track = $video.textTracks[i];
        if (track.kind === "subtitles" || track.kind === "captions") {
          track.mode = active ? "showing" : "disabled";
        }
      }
    }
  }

  if (!skipToast) {
    toast(active ? "Subtitles enabled" : "Subtitles disabled");
  }
}

function showFlashOverlay(type, detail = "") {
  const $flash = document.getElementById("flash-overlay");
  const $icon = document.getElementById("flash-icon");
  const $text = document.getElementById("flash-text");
  if (!$flash || !$icon || !$text) return;

  $flash.classList.remove("show");
  void $flash.offsetWidth;

  let iconHtml = "";
  let textStr = "";

  switch (type) {
    case "play":
      iconHtml =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      textStr = "";
      break;
    case "pause":
      iconHtml =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      textStr = "";
      break;
    case "mute":
      iconHtml =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
      textStr = "";
      break;
    case "volume":
      iconHtml =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
      textStr = detail ? `${detail}%` : "";
      break;
    case "pip":
      iconHtml =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7H9c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 12H9V9h10v10zm-9-2h6v-4h-6v4zM3 5v14H1V5c0-1.1.9-2 2-2h16v2H3z"/></svg>';
      textStr = "";
      break;
    case "cc":
      iconHtml = ICONS.cc;
      textStr = detail ? "ON" : "OFF";
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

// Helper to generate a random sCPN-like string
function generateSCPN() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 3) result += " ";
  }
  return result;
}

// Enhanced stats panel like YouTube's "Stats for Nerds"
function updateStats() {
  const $channel = document.getElementById("stats-channel");
  const $source = document.getElementById("stats-source");
  const $resolution = document.getElementById("stats-resolution");
  const $buffer = document.getElementById("stats-buffer");
  const $bitrate = document.getElementById("stats-bitrate");
  const $dropped = document.getElementById("stats-dropped");
  const $engine = document.getElementById("stats-engine");
  const $codecs = document.getElementById("stats-codecs");
  const $color = document.getElementById("stats-color");
  const $connection = document.getElementById("stats-connection");
  const $networkActivity = document.getElementById("stats-network-activity");
  const $bufferHealth = document.getElementById("stats-buffer-health");
  const $sCPN = document.getElementById("stats-scpn");
  const $viewport = document.getElementById("stats-viewport");
  const $volumeRow = document.getElementById("stats-volume");

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

  // Resolution & frames
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  if ($viewport) $viewport.textContent = `${viewportWidth}x${viewportHeight}`;

  let videoWidth = $video.videoWidth || 0;
  let videoHeight = $video.videoHeight || 0;
  if ($resolution) {
    $resolution.textContent =
      videoWidth && videoHeight ? `${videoWidth}x${videoHeight}` : "—";
  }

  // Dropped frames
  let droppedFrames = 0;
  let totalFrames = 0;
  if ($video.getVideoPlaybackQuality) {
    const q = $video.getVideoPlaybackQuality();
    droppedFrames = q.droppedVideoFrames;
    totalFrames = q.totalVideoFrames;
  }
  if ($dropped) {
    $dropped.textContent = totalFrames
      ? `${droppedFrames} of ${totalFrames}`
      : "—";
  }

  // Buffer health
  let bufLen = 0;
  const time = $video.currentTime;
  try {
    for (let i = 0; i < $video.buffered.length; i++) {
      if (time >= $video.buffered.start(i) && time <= $video.buffered.end(i)) {
        bufLen = $video.buffered.end(i) - time;
        break;
      }
    }
  } catch { }
  if ($buffer) $buffer.textContent = `${bufLen.toFixed(1)}s`;
  if ($bufferHealth) $bufferHealth.textContent = `${bufLen.toFixed(1)} s`;

  // Bitrate
  if (hls && hls.levels && hls.levels.length) {
    if (hls.currentLevel === -1) {
      // Auto: try to get estimated bandwidth
      if (hls.bandwidthEstimate) {
        let currentBitrate = hls.bandwidthEstimate;
        if ($bitrate)
          $bitrate.textContent = `${(currentBitrate / 1_000_000).toFixed(2)} Mbps (Auto)`;
        if ($connection)
          $connection.textContent = `${(currentBitrate / 1000).toFixed(0)} Kbps`;
      } else {
        if ($bitrate) $bitrate.textContent = "Auto";
        if ($connection) $connection.textContent = "—";
      }
    } else {
      const lvl = hls.levels[hls.currentLevel];
      let currentBitrate = lvl?.bitrate || 0;
      if ($bitrate)
        $bitrate.textContent = currentBitrate
          ? `${(currentBitrate / 1_000_000).toFixed(2)} Mbps`
          : "—";
      if ($connection)
        $connection.textContent = currentBitrate
          ? `${(currentBitrate / 1000).toFixed(0)} Kbps`
          : "—";
    }
  } else if (mpegtsPlayer && mpegtsPlayer.statisticsInfo) {
    const stats = mpegtsPlayer.statisticsInfo;
    const speedKbps = stats.speed ? Math.round(stats.speed * 8) : 0;
    const speedMbps = speedKbps ? (speedKbps / 1000).toFixed(2) : null;
    if ($bitrate) {
      $bitrate.textContent = speedMbps ? `${speedMbps} Mbps` : "—";
    }
    if ($connection) {
      $connection.textContent = speedKbps ? `${speedKbps} Kbps` : "—";
    }
  } else {
    if ($bitrate) $bitrate.textContent = hls ? "—" : "N/A";
    if ($connection) $connection.textContent = "—";
  }

  // Network activity (simulated)
  if ($networkActivity)
    $networkActivity.textContent = `${Math.floor(Math.random() * 30 + 10)} s`;

  // Codecs (simulated, but can be extended with MediaSource)
  if ($codecs) {
    let videoCodec = "unknown";
    let audioCodec = "unknown";
    if (hls) {
      videoCodec = "avc1.640028";
      audioCodec = "mp4a.40.2";
    } else if (mpegtsPlayer && mpegtsPlayer.mediaInfo) {
      videoCodec = mpegtsPlayer.mediaInfo.videoCodec || "unknown";
      audioCodec = mpegtsPlayer.mediaInfo.audioCodec || "unknown";
    }
    $codecs.textContent = `${videoCodec} / ${audioCodec}`;
  }

  // Color
  if ($color) $color.textContent = "bt709 / bt709";

  // sCPN (randomized on each stats open)
  if ($sCPN && !window._scpn) window._scpn = generateSCPN();
  if ($sCPN) $sCPN.textContent = window._scpn || generateSCPN();

  // Volume
  if ($volumeRow) {
    const volPercent = Math.round(($video.volume || 0) * 100);
    $volumeRow.innerHTML = `<span>Volume / Normalized</span><span>${volPercent}% / 100% DRC (cont.-18.0dB tgt.-14.0dB)</span>`;
  }

  if ($engine) {
    if (hls) $engine.textContent = "HLS.js";
    else if (mpegtsPlayer) $engine.textContent = "MpegTS.js";
    else $engine.textContent = "Native";
  }
}

function jumpToLive() {
  if ($video.seekable.length) {
    $video.currentTime = $video.seekable.end($video.seekable.length - 1);
    $video.play().catch(() => { });
  }
}

function toggleFullscreen() {
  const stage = document.querySelector(".stage");
  if (!document.fullscreenElement) stage.requestFullscreen?.();
  else document.exitFullscreen?.();
}

function retryStream() {
  if (isEmbedActive) return;
  const ch = channels.find((c) => c.id === activeId);
  if (!ch) return;
  const streams = ch.streams || [{ label: "Auto", url: ch.stream }];
  const url = streams[activeStreamIdx]?.url || streams[0].url;
  hideErr();
  showLoad(true);
  const proxiedUrl = getProxiedUrl(url);
  if (isTsUrl(url)) {
    startMpegTS(proxiedUrl);
  } else {
    startHLS(proxiedUrl);
  }
}

// Add copy debug info functionality
function copyDebugInfo() {
  const stats = {
    channel: document.getElementById("stats-channel")?.textContent,
    videoId: window._scpn || "N/A",
    viewport: document.getElementById("stats-viewport")?.textContent,
    resolution: document.getElementById("stats-resolution")?.textContent,
    dropped: document.getElementById("stats-dropped")?.textContent,
    bitrate: document.getElementById("stats-bitrate")?.textContent,
    codecs: document.getElementById("stats-codecs")?.textContent,
    connection: document.getElementById("stats-connection")?.textContent,
    bufferHealth: document.getElementById("stats-buffer-health")?.textContent,
    date: new Date().toString(),
  };
  const debugString = Object.entries(stats)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  navigator.clipboard
    .writeText(debugString)
    .then(() => toast("Debug info copied"));
}
