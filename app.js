/* ==========================================
   app.js — IPTV
   Player: HLS.js + native <video>
   Data:   CHANNELS_DATA from channels.js
   ========================================== */

// ── State
let hls = null;
let activeId = null;
let channels = [];   // flat list
let muted = false;
let activeStreamIdx = 0; // current quality index
let retryCount = 0;
const MAX_RETRIES = 3;
let statsInterval = null;
let clickTimeout = null;
let playTimeoutTimer = null;
const STREAM_LOAD_TIMEOUT_MS = 8000; // 8 seconds before switching to backup

// ── SVG Icons
const ICONS = {
  play:     `<svg id="icon-play" width="14" height="16" viewBox="0 0 14 16" fill="currentColor" class="hidden"><path d="M0 0L14 8L0 16V0Z"/></svg>
             <svg id="icon-pause" width="12" height="16" viewBox="0 0 12 16" fill="currentColor"><rect x="0" width="4" height="16" rx="1"/><rect x="8" width="4" height="16" rx="1"/></svg>`,
  vol:      `<svg id="icon-vol" width="16" height="14" viewBox="0 0 16 14" fill="currentColor"><path d="M0 5v4h2.67L6 12.33V1.67L2.67 5H0zm10.5 2c0-1.77-1-3.29-2.5-4.03v8.05c1.5-.73 2.5-2.25 2.5-4.02z"/><path d="M8 0v1.56c2.37.97 4 3.31 4 6.04s-1.63 5.07-4 6.04V15c3.28-.97 5.5-4 5.5-7.5S11.28.97 8 0z"/></svg>
             <svg id="icon-muted" width="16" height="14" viewBox="0 0 16 14" fill="currentColor" class="hidden"><path d="M6 1.67L2.67 5H0v4h2.67L6 12.33V1.67zm7.5 5.33l1.5-1.5-1.06-1.06L12.44 6l-1.5-1.5L9.88 5.56 11.38 7l-1.5 1.5 1.06 1.06L12.44 8l1.5 1.5 1.06-1.06L13.5 7z"/></svg>`,
  pip:      `<svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><path d="M13 1H2C.9 1 0 1.9 0 3v9c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 11H2V3h11v9zm-1-4.5H8.5V11H12V7.5z"/></svg>`,
  fullscreen:`<svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><path d="M1 1h4V0H0v5h1V1zm9-1v1h4v4h1V0h-5zm-9 14v-4H0v5h5v-1H1zm13 0h-4v1h5v-5h-1v4z"/></svg>`,
};

// ── DOM refs
let $video, $chList, $npName, $ctrlChName,
    $search, $ovLoad, $ovErr, $errSub,
    $btnPlay, $iconPlay, $iconPause,
    $btnMute, $iconVol, $iconMuted,
    $volSlider, $toasts, $noResults, $chCount,
    $qualBtn, $qualLabel, $qualMenu, $btnPip;

// ══════════════════════════════════════════
//  BOOT
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  $video       = document.getElementById('player');
  $chList      = document.getElementById('ch-list');
  $npName      = document.getElementById('np-name');
  $ctrlChName  = document.getElementById('ctrl-ch-name');
  $search      = document.getElementById('search-input');
  $ovLoad      = document.getElementById('overlay-loading');
  $ovErr       = document.getElementById('overlay-error');
  $errSub      = document.getElementById('err-sub');
  $btnPlay     = document.getElementById('ctrl-play');
  $btnMute     = document.getElementById('ctrl-mute');
  document.getElementById('ctrl-fs').innerHTML = ICONS.fullscreen;
  $btnPlay.innerHTML = ICONS.play;
  $btnMute.innerHTML = ICONS.vol;
  $iconPlay    = document.getElementById('icon-play');
  $iconPause   = document.getElementById('icon-pause');
  $iconVol     = document.getElementById('icon-vol');
  $iconMuted   = document.getElementById('icon-muted');
  $volSlider   = document.getElementById('vol-slider');
  $toasts      = document.getElementById('toasts');
  $noResults   = document.getElementById('no-results');
  $chCount     = document.getElementById('channel-count');
  $qualBtn     = document.getElementById('ctrl-qual');
  $qualLabel   = document.getElementById('qual-label');
  $qualMenu    = document.getElementById('qual-menu');

  $btnPip      = document.getElementById('ctrl-pip');
  if ($btnPip) {
    $btnPip.innerHTML = ICONS.pip;
    if (!document.pictureInPictureEnabled) {
      $btnPip.style.display = 'none';
    } else {
      $btnPip.addEventListener('click', togglePiP);
    }
  }

  const $sidebar   = document.getElementById('sidebar');
  const $chat      = document.getElementById('chat');
  const $btnSB     = document.getElementById('btn-sidebar');
  const $btnChat   = document.getElementById('btn-chat');
  const $backdrop  = document.getElementById('guide-backdrop');

  // Chat is hidden by default — mark button as "closed"
  $chat.classList.add('closed');

  function setGuideOpen(open) {
    $sidebar.classList.toggle('closed', !open);
    $btnSB.classList.toggle('on', open);
    if ($backdrop) $backdrop.classList.toggle('show', open);
  }

  // Live guide toggle
  $btnSB.addEventListener('click', () => setGuideOpen($sidebar.classList.contains('closed')));
  if ($backdrop) $backdrop.addEventListener('click', () => setGuideOpen(false));
  setGuideOpen(false);

  // Chat toggle
  $btnChat.addEventListener('click', () => {
    $chat.classList.toggle('closed');
    const isOpen = !$chat.classList.contains('closed');
    $btnChat.classList.toggle('on', isOpen);
    document.body.classList.toggle('chat-open', isOpen);
  });

  // Close guide after picking a channel
  document.addEventListener('click', (e) => {
    const chItem = e.target.closest('.ch-item');
    if (chItem && !$sidebar.classList.contains('closed')) {
      setGuideOpen(false);
    }
  });

  // Auto-hide controls on idle
  const $stage = document.querySelector('.stage');
  let idleTimer = null;
  const IDLE_MS = 3000;

  function resetIdle() {
    $stage.classList.remove('idle');
    clearTimeout(idleTimer);
    
    // Only auto-hide controls if video is playing AND overlays are hidden
    const isError = $ovErr && $ovErr.classList.contains('show');
    const isLoading = $ovLoad && $ovLoad.classList.contains('show');
    if (!$video.paused && !isError && !isLoading) {
      idleTimer = setTimeout(() => $stage.classList.add('idle'), IDLE_MS);
    }
  }

  $stage.addEventListener('mousemove', resetIdle);
  $stage.addEventListener('mousedown', resetIdle);
  $stage.addEventListener('touchstart', resetIdle, { passive: true });
  resetIdle(); // start timer immediately

  // Restore Volume / Mute
  const savedVolume = localStorage.getItem('iptv-volume');
  const savedMuted = localStorage.getItem('iptv-muted') === 'true';
  if (savedVolume !== null) {
    const vol = parseFloat(savedVolume);
    $video.volume = vol;
    $volSlider.value = vol;
  } else {
    $video.volume = 1.0;
    $volSlider.value = 1.0;
  }
  setMuted(savedMuted);

  // Controls
  $btnPlay.addEventListener('click', () => {
    togglePlay();
    showFlashOverlay($video.paused ? 'pause' : 'play');
  });
  $btnMute.addEventListener('click', () => {
    toggleMute();
    showFlashOverlay(muted ? 'mute' : 'volume');
  });
  $volSlider.addEventListener('input', e => {
    const vol = parseFloat(e.target.value);
    $video.volume = vol;
    localStorage.setItem('iptv-volume', vol);
    if (vol === 0) setMuted(true);
    else setMuted(false);
  });
  document.getElementById('ctrl-live').addEventListener('click', () => {
    jumpToLive();
    toast('Jumped to live');
  });
  document.getElementById('ctrl-fs').addEventListener('click', toggleFullscreen);
  document.getElementById('retry-btn').addEventListener('click', retryStream);

  // Quality picker toggle
  $qualBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    $qualMenu.classList.toggle('hidden');
  });
  document.addEventListener('click', () => $qualMenu.classList.add('hidden'));

  // Video click & double-click interactions
  $video.addEventListener('click', (e) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      toggleFullscreen();
    } else {
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
        togglePlay();
        showFlashOverlay($video.paused ? 'pause' : 'play');
      }, 250);
    }
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
      return;
    }

    const key = e.key.toLowerCase();
    
    if (key === ' ' || key === 'k') {
      e.preventDefault();
      togglePlay();
      showFlashOverlay($video.paused ? 'pause' : 'play');
    } else if (key === 'm') {
      toggleMute();
      showFlashOverlay(muted ? 'mute' : 'volume');
    } else if (key === 'f') {
      e.preventDefault();
      toggleFullscreen();
    } else if (key === 'p') {
      e.preventDefault();
      togglePiP();
    } else if (key === 'l') {
      e.preventDefault();
      jumpToLive();
      toast('Jumped to live');
    } else if (key === 'r') {
      e.preventDefault();
      retryStream();
      toast('Reconnecting stream...');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      adjustVolume(0.05);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      adjustVolume(-0.05);
    }
  });

  // Custom Context Menu Right Click
  const $ctxMenu = document.getElementById('context-menu');
  const $ctxPlay = document.getElementById('ctx-play');
  const $ctxMute = document.getElementById('ctx-mute');
  const $ctxPip = document.getElementById('ctx-pip');
  const $ctxFs = document.getElementById('ctx-fs');
  const $ctxStats = document.getElementById('ctx-stats');

  $stage.addEventListener('contextmenu', (e) => {
    if (e.shiftKey) return; // hold shift to bypass
    e.preventDefault();
    
    const rect = $stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    $ctxMenu.style.left = `${x}px`;
    $ctxMenu.style.top = `${y}px`;
    
    $ctxPlay.textContent = $video.paused ? 'Play' : 'Pause';
    $ctxMute.textContent = muted ? 'Unmute' : 'Mute';
    
    if (!document.pictureInPictureEnabled) {
      $ctxPip.style.display = 'none';
    } else {
      $ctxPip.style.display = 'block';
    }
    
    $ctxMenu.classList.remove('hidden');
  });

  document.addEventListener('click', () => {
    if ($ctxMenu) $ctxMenu.classList.add('hidden');
  });

  $ctxPlay.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); showFlashOverlay($video.paused ? 'pause' : 'play'); });
  $ctxMute.addEventListener('click', (e) => { e.stopPropagation(); toggleMute(); showFlashOverlay(muted ? 'mute' : 'volume'); });
  $ctxPip.addEventListener('click', (e) => { e.stopPropagation(); togglePiP(); });
  $ctxFs.addEventListener('click', (e) => { e.stopPropagation(); toggleFullscreen(); });
  $ctxStats.addEventListener('click', toggleStats);

  // Stats close button
  const $statsClose = document.getElementById('stats-close-btn');
  if ($statsClose) {
    $statsClose.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('stats-panel').classList.add('hidden');
      stopStatsInterval();
    });
  }

  // Video events
  $video.addEventListener('pause',   () => { setPaused(true); clearPlayTimeoutWatchdog(); });
  $video.addEventListener('play',    () => setPaused(false));
  $video.addEventListener('waiting', () => showLoad(true));
  $video.addEventListener('playing', () => { showLoad(false); hideErr(); clearPlayTimeoutWatchdog(); });
  $video.addEventListener('error', () => {
    clearPlayTimeoutWatchdog();
    if (!hls) {
      handleNativeVideoError();
    }
  });

  // Search
  $search.addEventListener('input', onSearch);

  const $logo = document.getElementById('logo-home');
  if ($logo) {
    $logo.addEventListener('click', showHomePage);
  }

  // Build channels
  initChannels();
});

// ══════════════════════════════════════════
//  CHANNEL LIST
// ══════════════════════════════════════════
function initChannels() {
  if (typeof CHANNELS_DATA === 'undefined') {
    $chList.innerHTML = '<div style="padding:16px;font-size:.78rem;color:var(--text3)">channels.js not found</div>';
    return;
  }
  channels = [];
  $chList.innerHTML = '';

  CHANNELS_DATA.categories.forEach(cat => {
    const lbl = document.createElement('div');
    lbl.className = 'cat-label';
    lbl.dataset.cat = cat.name;
    lbl.innerHTML = `<span class="cat-icon">${cat.icon}</span>${cat.name}`;
    $chList.appendChild(lbl);

    cat.channels.forEach(ch => {
      channels.push(ch);
      $chList.appendChild(buildChItem(ch));
    });
  });

  // Update count
  if ($chCount) $chCount.textContent = channels.length;

  // Initialize dynamic home screen grid
  initHomePage();
}

function buildChannelLogo(ch, variant = 'guide') {
  const initials = ch.shortName.slice(0, 3);
  const boxClass = variant === 'tile' ? 'ch-logo-box ch-logo-box--tile' : 'ch-logo-box ch-logo-box--guide';
  const fallbackOnly = !ch.logo;

  return `
    <div class="${boxClass}${fallbackOnly ? ' logo-failed' : ''}">
      ${ch.logo
        ? `<img class="ch-logo-img" src="${ch.logo}" alt="${ch.shortName}" referrerpolicy="no-referrer" loading="lazy" decoding="async" onerror="this.closest('.ch-logo-box').classList.add('logo-failed')">`
        : ''
      }
      <span class="ch-initials ch-logo-fallback">${initials}</span>
    </div>`;
}

function initHomePage() {
  if (typeof CHANNELS_DATA === 'undefined') return;
  const $stageHome = document.getElementById('stage-home');
  if (!$stageHome) return;

  $stageHome.innerHTML = '';

  CHANNELS_DATA.categories.forEach(cat => {
    const section = document.createElement('div');
    section.className = 'home-section';

    const title = document.createElement('h2');
    title.className = 'yt-row-title';
    title.textContent = cat.name;
    section.appendChild(title);

    const carousel = document.createElement('div');
    carousel.className = 'carousel-track';

    cat.channels.forEach(ch => {
      const card = document.createElement('div');
      card.className = 'yt-tile home-ch-card';
      card.dataset.id = ch.id;

      card.innerHTML = `
        <div class="yt-tile-thumb">
          ${buildChannelLogo(ch, 'tile')}
          <span class="yt-tile-live home-live-badge">LIVE</span>
        </div>
        <p class="yt-tile-title home-ch-name">${ch.name}</p>
        <p class="yt-tile-meta">${ch.quality}</p>
      `;

      card.addEventListener('click', () => {
        loadChannel(ch.id);
      });

      carousel.appendChild(card);
    });

    section.appendChild(carousel);
    $stageHome.appendChild(section);
  });

  // Append footer dynamically so it is part of the scroll container
  const footer = document.createElement('footer');
  footer.className = 'app-footer';
  footer.innerHTML = 'Developed by <a href="https://trionine.xyz" target="_blank" rel="noopener">TRIONINE</a>';
  $stageHome.appendChild(footer);
}

function showHomePage() {
  // Clear activeId FIRST so any async error/event callbacks can't retrigger loadChannel
  activeId = null;

  // Reset active sidebar selection
  document.querySelectorAll('.ch-item').forEach(el => el.classList.remove('active'));

  // Pause video and destroy hls
  if (hls) { hls.destroy(); hls = null; }
  $video.src = '';
  $video.load();

  stopStatsInterval();
  clearPlayTimeoutWatchdog();

  document.body.classList.remove('is-watching');
  $npName.textContent = 'Browse Live TV';
  $ctrlChName.textContent = '';

  const $idle = document.getElementById('idle-screen');
  if ($idle) $idle.style.display = '';

  // Hide controls, loader and errors
  showLoad(false);
  hideErr();
  const stage = document.querySelector('.stage');
  if (stage) stage.classList.add('idle');

  const $stageHome = document.getElementById('stage-home');
  if ($stageHome) $stageHome.classList.remove('hidden');
}

function buildChItem(ch) {
  const el = document.createElement('div');
  el.className = 'ch-item';
  el.id = `ch-${ch.id}`;
  el.dataset.id = ch.id;
  el.dataset.search = ch.name.toLowerCase();

  const q = (ch.quality || 'HD').toLowerCase();
  const qClass = q === 'fhd' ? 'fhd' : q === 'hd' ? 'hd' : 'sd';

  el.innerHTML = `
    ${buildChannelLogo(ch, 'guide')}
    <div class="ch-info">
      <div class="ch-name">${ch.name}</div>
      <div class="ch-meta">
        <span class="ch-live-dot"></span>
        <span class="q-badge ${qClass}">${ch.quality}</span>
      </div>
    </div>`;

  el.addEventListener('click', () => loadChannel(ch.id));
  return el;
}

// ══════════════════════════════════════════
//  LOAD / PLAY CHANNEL
// ══════════════════════════════════════════
function loadChannel(id, streamIdx) {
  const ch = channels.find(c => c.id === id);
  if (!ch) return;

  document.body.classList.add('is-watching');

  const $stageHome = document.getElementById('stage-home');
  if ($stageHome) $stageHome.classList.add('hidden');

  const $idle = document.getElementById('idle-screen');
  if ($idle) $idle.style.display = 'none';

  // Update active state
  document.querySelectorAll('.ch-item').forEach(el => el.classList.remove('active'));
  const el = document.getElementById(`ch-${id}`);
  if (el) {
    el.classList.add('active');
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  activeId = id;
  activeStreamIdx = streamIdx ?? 0;
  localStorage.setItem('iptv-last-channel', id);
  $npName.textContent = ch.name;
  $ctrlChName.textContent = ch.name;

  // If stats panel is open, refresh it immediately for the new channel
  const $statsPanel = document.getElementById('stats-panel');
  if ($statsPanel && !$statsPanel.classList.contains('hidden')) {
    updateStats();
    startStatsInterval(); // restart interval so cadence resets
  }

  // Build quality menu
  buildQualMenu(ch);

  const streams = getStreams(ch);
  const url = streams[activeStreamIdx]?.url || streams[0].url;

  showLoad(true);
  hideErr();
  startHLS(url);
  populateWatchMore(id);
}

// Helper: get the streams array for a channel
function getStreams(ch) {
  return ch.streams || [{ label: 'Auto', url: ch.stream }];
}

// Populate the mobile watch-more section with same-category channels
function populateWatchMore(currentId) {
  const $wm = document.getElementById('watch-more');
  if (!$wm) return;

  let catChannels = [];
  for (const cat of CHANNELS_DATA.categories) {
    if (cat.channels.some(c => c.id === currentId)) {
      catChannels = cat.channels.filter(c => c.id !== currentId);
      break;
    }
  }

  if (!catChannels.length) { $wm.innerHTML = ''; return; }

  $wm.innerHTML = `
    <div class="wm-title">More Channels</div>
    <div class="wm-grid">
      ${catChannels.map(ch => `
        <div class="wm-card" data-id="${ch.id}">
          <div class="wm-thumb ch-logo-box ch-logo-box--tile">
            <img class="ch-logo-img" src="${ch.logo}" alt="${ch.name}"
              onerror="this.closest('.ch-logo-box').classList.add('logo-failed')">
            <span class="ch-logo-fallback">${ch.shortName}</span>
          </div>
          <div class="wm-name">${ch.name}</div>
          <div class="wm-meta">${ch.quality}</div>
        </div>`).join('')}
    </div>`;

  $wm.querySelectorAll('.wm-card').forEach(card => {
    card.addEventListener('click', () => loadChannel(card.dataset.id));
  });
}

function buildQualMenu(ch) {
  const streams = getStreams(ch);
  const header = $qualMenu.querySelector('.qual-menu-label');
  $qualMenu.innerHTML = '';
  if (header) $qualMenu.appendChild(header);

  if (streams.length <= 1) {
    $qualBtn.style.display = 'none';
    $qualLabel.textContent = streams[0]?.label || 'AUTO';
    return;
  }
  $qualBtn.style.display = '';

  streams.forEach((s, i) => {
    const item = document.createElement('div');
    item.className = 'qual-item' + (i === activeStreamIdx ? ' active' : '');
    item.textContent = s.label;
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      $qualMenu.classList.add('hidden');
      if (i === activeStreamIdx) return;
      activeStreamIdx = i;
      $qualLabel.textContent = s.label.toUpperCase();
      showLoad(true); hideErr();
      startHLS(s.url);
      // Refresh active markers
      $qualMenu.querySelectorAll('.qual-item').forEach((el, j) => el.classList.toggle('active', j === i));
      toast(`Quality: ${s.label}`);
    });
    $qualMenu.appendChild(item);
  });
  $qualLabel.textContent = (streams[activeStreamIdx]?.label || 'AUTO').toUpperCase();
}

function buildQualMenuFromHlsLevels() {
  if (!hls || !hls.levels || hls.levels.length <= 1) {
    $qualBtn.style.display = 'none';
    return;
  }

  $qualBtn.style.display = '';
  const header = $qualMenu.querySelector('.qual-menu-label');
  $qualMenu.innerHTML = '';
  if (header) $qualMenu.appendChild(header);

  // Auto Option
  const autoItem = document.createElement('div');
  autoItem.className = 'qual-item' + (hls.currentLevel === -1 ? ' active' : '');
  autoItem.textContent = 'Auto';
  autoItem.addEventListener('click', (e) => {
    e.stopPropagation();
    $qualMenu.classList.add('hidden');
    hls.currentLevel = -1;
    $qualLabel.textContent = 'AUTO';
    $qualMenu.querySelectorAll('.qual-item').forEach(el => el.classList.remove('active'));
    autoItem.classList.add('active');
    toast('Auto quality');
  });
  $qualMenu.appendChild(autoItem);

  // Level Options (High to Low)
  for (let idx = hls.levels.length - 1; idx >= 0; idx--) {
    const lvl = hls.levels[idx];
    const item = document.createElement('div');
    const height = lvl.height || (lvl.bitrate ? `${Math.round(lvl.bitrate / 1000)}k` : idx);
    const label = height ? `${height}p` : `Level ${idx + 1}`;
    
    item.className = 'qual-item' + (hls.currentLevel === idx ? ' active' : '');
    item.textContent = label;
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      $qualMenu.classList.add('hidden');
      hls.currentLevel = idx;
      $qualLabel.textContent = label.toUpperCase();
      $qualMenu.querySelectorAll('.qual-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      toast(`Quality: ${label}`);
    });
    $qualMenu.appendChild(item);
  }

  if (hls.currentLevel === -1) {
    $qualLabel.textContent = 'AUTO';
  } else {
    const lvl = hls.levels[hls.currentLevel];
    const height = lvl ? lvl.height : null;
    $qualLabel.textContent = height ? `${height}P` : 'AUTO';
  }
}

function startHLS(url) {
  // Destroy previous instance
  if (hls) { hls.destroy(); hls = null; }
  stopStatsInterval();
  clearPlayTimeoutWatchdog();

  // Start watchdog timer
  startPlayTimeoutWatchdog();

  if (Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      // Removed lowLatencyMode and tight loading timeouts to allow standard HLS feeds to load smoothly
    });
    hls.loadSource(url);
    hls.attachMedia($video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      retryCount = 0; // reset retry on success
      $video.play().catch(() => {});
      
      const ch = channels.find(c => c.id === activeId);
      if (ch && (!ch.streams || ch.streams.length <= 1)) {
        buildQualMenuFromHlsLevels();
      }
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        console.warn('HLS Fatal Error:', data);
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            const isManifestError = data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR || 
                                    data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT;
            const ch = channels.find(c => c.id === activeId);
            const hasBackup = ch && ch.streams && ch.streams.length > 1;

            if (isManifestError && hasBackup) {
              // Bypasses retries on dead/slow manifests to trigger quick backup switch
              handleFatalError(data);
            } else if (retryCount < MAX_RETRIES) {
              retryCount++;
              toast(`Network issue. Retrying (${retryCount}/${MAX_RETRIES})...`);
              hls.startLoad();
            } else {
              handleFatalError(data);
            }
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              toast(`Media issue. Recovering (${retryCount}/${MAX_RETRIES})...`);
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
  } else if ($video.canPlayType('application/vnd.apple.mpegurl')) {
    // Native HLS (Safari)
    retryCount = 0;
    $video.src = url;
    $video.play().catch(() => {});
  } else {
    showLoad(false);
    showErr('HLS not supported in this browser');
  }
}

function handleFatalError(data) {
  if (!activeId) return;
  const ch = channels.find(c => c.id === activeId);
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
  showErr(data.details || 'Stream error');
}

function handleNativeVideoError() {
  if (!activeId) return;
  const ch = channels.find(c => c.id === activeId);
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
  showErr('Native playback failed');
}

// ── Watchdog Timer for Slow/Dead Loading Links
function startPlayTimeoutWatchdog() {
  clearPlayTimeoutWatchdog();
  playTimeoutTimer = setTimeout(() => {
    if (!activeId) return; // user navigated home during load
    if ($video.paused || $video.seeking || !$video.currentTime) {
      const ch = channels.find(c => c.id === activeId);
      if (ch) {
        const streams = getStreams(ch);
        if (activeStreamIdx + 1 < streams.length) {
          const nextIdx = activeStreamIdx + 1;
          toast(`Load timeout. Switching to backup ${streams[nextIdx].label}...`);
          loadChannel(activeId, nextIdx);
          return;
        }
      }
      showLoad(false);
      showErr('Stream load timed out');
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
//  CONTROLS
// ══════════════════════════════════════════
function togglePlay() {
  if ($video.paused) $video.play();
  else $video.pause();
}

function setPaused(paused) {
  $iconPlay.classList.toggle('hidden', !paused);
  $iconPause.classList.toggle('hidden', paused);
}

function toggleMute() {
  setMuted(!muted);
}

function setMuted(val) {
  muted = val;
  $video.muted = muted;
  $iconVol.classList.toggle('hidden', muted);
  $iconMuted.classList.toggle('hidden', !muted);
  if (muted) $volSlider.value = 0;
  else { $volSlider.value = $video.volume || 1; $video.volume = $video.volume || 1; }
  localStorage.setItem('iptv-muted', muted);
}

function adjustVolume(delta) {
  let vol = $video.volume + delta;
  vol = Math.max(0, Math.min(1, vol));
  $video.volume = vol;
  $volSlider.value = vol;
  localStorage.setItem('iptv-volume', vol);
  if (vol === 0) setMuted(true);
  else setMuted(false);
  showFlashOverlay('volume', Math.round(vol * 100));
}

async function togglePiP() {
  if (!document.pictureInPictureEnabled) {
    toast('PiP not supported');
    return;
  }
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      showFlashOverlay('pip', false);
    } else {
      await $video.requestPictureInPicture();
      showFlashOverlay('pip', true);
    }
  } catch (err) {
    console.error('PiP Error:', err);
    toast('Failed to toggle PiP');
  }
}

function showFlashOverlay(type, detail = '') {
  const $flash = document.getElementById('flash-overlay');
  const $icon = document.getElementById('flash-icon');
  const $text = document.getElementById('flash-text');
  if (!$flash || !$icon || !$text) return;

  $flash.classList.remove('show');
  void $flash.offsetWidth; // trigger reflow

  let iconHtml = '';
  let textStr = '';

  switch (type) {
    case 'play':
      iconHtml = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      textStr = 'PLAY';
      break;
    case 'pause':
      iconHtml = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      textStr = 'PAUSE';
      break;
    case 'mute':
      iconHtml = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
      textStr = 'MUTED';
      break;
    case 'volume':
      iconHtml = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
      textStr = detail ? `${detail}%` : 'VOLUME';
      break;
    case 'pip':
      iconHtml = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7H9c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 12H9V9h10v10zm-9-2h6v-4h-6v4zM3 5v14H1V5c0-1.1.9-2 2-2h16v2H3z"/></svg>';
      textStr = detail ? 'PIP ON' : 'PIP OFF';
      break;
    default:
      return;
  }

  $icon.innerHTML = iconHtml;
  $text.textContent = textStr;
  $flash.classList.add('show');
  
  clearTimeout(window.flashTimeout);
  window.flashTimeout = setTimeout(() => {
    $flash.classList.remove('show');
  }, 600);
}

function toggleStats(e) {
  if (e) e.stopPropagation();
  const $stats = document.getElementById('stats-panel');
  if (!$stats) return;
  
  const isHidden = $stats.classList.toggle('hidden');
  if (!isHidden) {
    startStatsInterval();
  } else {
    stopStatsInterval();
  }
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
  const $channel    = document.getElementById('stats-channel');
  const $source     = document.getElementById('stats-source');
  const $resolution = document.getElementById('stats-resolution');
  const $buffer     = document.getElementById('stats-buffer');
  const $bitrate    = document.getElementById('stats-bitrate');
  const $dropped    = document.getElementById('stats-dropped');
  const $engine     = document.getElementById('stats-engine');

  const ch = channels.find(c => c.id === activeId);

  // ── Channel name & stream source
  if ($channel) $channel.textContent = ch ? ch.name : '—';

  if ($source && ch) {
    const streams = getStreams(ch);
    const url = streams[activeStreamIdx]?.url || streams[0]?.url || '-';
    const label = streams[activeStreamIdx]?.label || '';
    try {
      const parsed = new URL(url);
      $source.textContent = (label ? `[${label}] ` : '') + parsed.hostname;
      $source.title = url;
    } catch {
      $source.textContent = url;
    }
  } else if ($source) {
    $source.textContent = '—';
  }

  // ── Resolution — show '—' while buffering/loading
  if ($resolution) {
    $resolution.textContent = $video.videoWidth
      ? `${$video.videoWidth} × ${$video.videoHeight}`
      : '—';
  }

  // ── Buffer ahead
  if ($buffer) {
    let bufLen = 0;
    const time = $video.currentTime;
    try {
      for (let i = 0; i < $video.buffered.length; i++) {
        if (time >= $video.buffered.start(i) && time <= $video.buffered.end(i)) {
          bufLen = $video.buffered.end(i) - time;
          break;
        }
      }
    } catch {}
    $buffer.textContent = `${bufLen.toFixed(1)}s`;
  }

  // ── Bitrate from HLS level
  if ($bitrate) {
    if (hls && hls.levels && hls.levels.length) {
      if (hls.currentLevel === -1) {
        $bitrate.textContent = 'Auto';
      } else {
        const lvl = hls.levels[hls.currentLevel];
        $bitrate.textContent = lvl?.bitrate
          ? `${(lvl.bitrate / 1_000_000).toFixed(2)} Mbps`
          : '—';
      }
    } else {
      $bitrate.textContent = hls ? '—' : 'N/A';
    }
  }

  // ── Dropped frames
  if ($dropped) {
    if ($video.getVideoPlaybackQuality) {
      const q = $video.getVideoPlaybackQuality();
      $dropped.textContent = `${q.droppedVideoFrames} / ${q.totalVideoFrames}`;
    } else {
      $dropped.textContent = 'N/A';
    }
  }

  // ── Engine
  if ($engine) {
    $engine.textContent = hls ? 'HLS.js' : 'Native';
  }
}

function jumpToLive() {
  if ($video.seekable.length) {
    $video.currentTime = $video.seekable.end($video.seekable.length - 1);
    $video.play().catch(() => {});
  }
}

function toggleFullscreen() {
  const stage = document.querySelector('.stage');
  if (!document.fullscreenElement) stage.requestFullscreen?.();
  else document.exitFullscreen?.();
}

function retryStream() {
  const ch = channels.find(c => c.id === activeId);
  if (!ch) return;
  const streams = ch.streams || [{ label: 'Auto', url: ch.stream }];
  hideErr();
  showLoad(true);
  startHLS(streams[activeStreamIdx]?.url || streams[0].url);
}

// ══════════════════════════════════════════
//  SEARCH
// ══════════════════════════════════════════
function onSearch(e) {
  const q = e.target.value.toLowerCase().trim();
  let anyVisible = false;

  document.querySelectorAll('.ch-item').forEach(el => {
    const match = !q || el.dataset.search.includes(q);
    el.style.display = match ? '' : 'none';
    if (match) anyVisible = true;
  });

  // Show/hide category labels
  document.querySelectorAll('.cat-label').forEach(lbl => {
    let sib = lbl.nextElementSibling;
    let catVisible = false;
    while (sib && !sib.classList.contains('cat-label')) {
      if (sib.style.display !== 'none') catVisible = true;
      sib = sib.nextElementSibling;
    }
    lbl.style.display = catVisible ? '' : 'none';
  });

  $noResults.style.display = anyVisible ? 'none' : 'block';
}

// ══════════════════════════════════════════
//  STATE OVERLAYS
// ══════════════════════════════════════════
function showLoad(v) { if ($ovLoad) $ovLoad.classList.toggle('show', v); }

function showErr(msg) {
  // Show a concise error in the top-left bar without blocking the whole screen
  if ($errSub) $errSub.textContent = msg || 'Stream unavailable';
  if ($ovErr)  $ovErr.classList.add('show');
  showLoad(false);
}

function hideErr() { if ($ovErr) $ovErr.classList.remove('show'); }

// ══════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════
function toast(msg, ms = 2200) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  $toasts.appendChild(t);
  setTimeout(() => {
    t.classList.add('out');
    t.addEventListener('animationend', () => t.remove(), { once: true });
  }, ms);
}
