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

// ── SVG Icons
const ICONS = {
  play:     `<svg id="icon-play" width="14" height="16" viewBox="0 0 14 16" fill="currentColor" class="hidden"><path d="M0 0L14 8L0 16V0Z"/></svg>
             <svg id="icon-pause" width="12" height="16" viewBox="0 0 12 16" fill="currentColor"><rect x="0" width="4" height="16" rx="1"/><rect x="8" width="4" height="16" rx="1"/></svg>`,
  vol:      `<svg id="icon-vol" width="16" height="14" viewBox="0 0 16 14" fill="currentColor"><path d="M0 5v4h2.67L6 12.33V1.67L2.67 5H0zm10.5 2c0-1.77-1-3.29-2.5-4.03v8.05c1.5-.73 2.5-2.25 2.5-4.02z"/><path d="M8 0v1.56c2.37.97 4 3.31 4 6.04s-1.63 5.07-4 6.04V15c3.28-.97 5.5-4 5.5-7.5S11.28.97 8 0z"/></svg>
             <svg id="icon-muted" width="16" height="14" viewBox="0 0 16 14" fill="currentColor" class="hidden"><path d="M6 1.67L2.67 5H0v4h2.67L6 12.33V1.67zm7.5 5.33l1.5-1.5-1.06-1.06L12.44 6l-1.5-1.5L9.88 5.56 11.38 7l-1.5 1.5 1.06 1.06L12.44 8l1.5 1.5 1.06-1.06L13.5 7z"/></svg>`,
  fullscreen:`<svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><path d="M1 1h4V0H0v5h1V1zm9-1v1h4v4h1V0h-5zm-9 14v-4H0v5h5v-1H1zm13 0h-4v1h5v-5h-1v4z"/></svg>`,
};

// ── DOM refs
let $video, $chList, $npName, $ctrlChName,
    $search, $ovLoad, $ovErr, $errSub,
    $btnPlay, $iconPlay, $iconPause,
    $btnMute, $iconVol, $iconMuted,
    $volSlider, $toasts, $noResults, $chCount;

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

  const $sidebar  = document.getElementById('sidebar');
  const $chat     = document.getElementById('chat');
  const $btnSB    = document.getElementById('btn-sidebar');
  const $btnChat  = document.getElementById('btn-chat');

  // Chat is hidden by default — mark button as "closed"
  $chat.classList.add('closed');

  // Sidebar toggle
  $btnSB.addEventListener('click', () => {
    $sidebar.classList.toggle('closed');
    $btnSB.classList.toggle('on', !$sidebar.classList.contains('closed'));
  });
  // Start with sidebar open (button shows "on")
  $btnSB.classList.add('on');

  // Chat toggle
  $btnChat.addEventListener('click', () => {
    $chat.classList.toggle('closed');
    $btnChat.classList.toggle('on', !$chat.classList.contains('closed'));
  });

  // Close sidebar on channel click (mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      const chItem = e.target.closest('.ch-item');
      if (chItem && !$sidebar.classList.contains('closed')) {
        $sidebar.classList.add('closed');
        $btnSB.classList.remove('on');
      }
    }
  });

  // Auto-hide controls on idle
  const $stage = document.querySelector('.stage');
  let idleTimer = null;
  const IDLE_MS = 3000;

  function resetIdle() {
    $stage.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => $stage.classList.add('idle'), IDLE_MS);
  }

  $stage.addEventListener('mousemove', resetIdle);
  $stage.addEventListener('mousedown', resetIdle);
  $stage.addEventListener('touchstart', resetIdle, { passive: true });
  resetIdle(); // start timer immediately


  // Controls
  $btnPlay.addEventListener('click', togglePlay);
  $btnMute.addEventListener('click', toggleMute);
  $volSlider.addEventListener('input', e => {
    $video.volume = e.target.value;
    if ($video.volume === 0) setMuted(true);
    else setMuted(false);
  });
  document.getElementById('ctrl-live').addEventListener('click', jumpToLive);
  document.getElementById('ctrl-fs').addEventListener('click', toggleFullscreen);
  document.getElementById('retry-btn').addEventListener('click', retryStream);

  // Video events
  $video.addEventListener('pause',   () => setPaused(true));
  $video.addEventListener('play',    () => setPaused(false));
  $video.addEventListener('waiting', () => showLoad(true));
  $video.addEventListener('playing', () => { showLoad(false); hideErr(); });

  // Search
  $search.addEventListener('input', onSearch);

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

  // Restore last watched channel, else play first
  const lastId = localStorage.getItem('iptv-last-channel');
  const startId = (lastId && channels.find(c => c.id === lastId)) ? lastId : channels[0]?.id;
  if (startId) loadChannel(startId);
}

function buildChItem(ch) {
  const el = document.createElement('div');
  el.className = 'ch-item';
  el.id = `ch-${ch.id}`;
  el.dataset.id = ch.id;
  el.dataset.search = ch.name.toLowerCase();

  const initials = ch.shortName.slice(0, 4);
  const q = (ch.quality || 'HD').toLowerCase();
  const qClass = q === 'fhd' ? 'fhd' : q === 'hd' ? 'hd' : 'sd';

  el.innerHTML = `
    <div class="ch-avatar">
      ${ch.logo
        ? `<img src="${ch.logo}" alt="${ch.shortName}" referrerpolicy="no-referrer" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">`
        : ''
      }
      <span class="ch-initials" style="${ch.logo ? 'display:none' : ''}">${initials}</span>
    </div>
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
function loadChannel(id) {
  const ch = channels.find(c => c.id === id);
  if (!ch) return;

  // Update active state
  document.querySelectorAll('.ch-item').forEach(el => el.classList.remove('active'));
  const el = document.getElementById(`ch-${id}`);
  if (el) {
    el.classList.add('active');
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  activeId = id;
  localStorage.setItem('iptv-last-channel', id);
  $npName.textContent = ch.name;
  $ctrlChName.textContent = ch.name;

  showLoad(true);
  hideErr();
  startHLS(ch.stream);
  toast(`▶ ${ch.name}`);
}

function startHLS(url) {
  // Destroy previous instance
  if (hls) { hls.destroy(); hls = null; }

  if (Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 30,
    });
    hls.loadSource(url);
    hls.attachMedia($video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      $video.play().catch(() => {});
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        showLoad(false);
        showErr(data.details || 'Stream error');
      }
    });
  } else if ($video.canPlayType('application/vnd.apple.mpegurl')) {
    // Native HLS (Safari)
    $video.src = url;
    $video.play().catch(() => {});
  } else {
    showLoad(false);
    showErr('HLS not supported in this browser');
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
  hideErr();
  showLoad(true);
  startHLS(ch.stream);
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
function showLoad(v) { $ovLoad.classList.toggle('show', v); }

function showErr(msg) {
  $errSub.textContent = msg;
  $ovErr.classList.add('show');
  showLoad(false);
}

function hideErr() { $ovErr.classList.remove('show'); }

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
