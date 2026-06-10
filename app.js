/* ==========================================
   app.js — FamilyStream
   Player: HLS.js + native <video>
   Data:   CHANNELS_DATA from channels.js
   ========================================== */

// ── State
let hls = null;
let activeId = null;
let channels = [];   // flat list
let muted = false;

// ── DOM refs
let $video, $chList, $npName, $ctrlChName,
    $search, $ovLoad, $ovErr, $errSub,
    $btnPlay, $iconPlay, $iconPause,
    $btnMute, $iconVol, $iconMuted,
    $volSlider, $toasts, $noResults;

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
  $iconPlay    = document.getElementById('icon-play');
  $iconPause   = document.getElementById('icon-pause');
  $btnMute     = document.getElementById('ctrl-mute');
  $iconVol     = document.getElementById('icon-vol');
  $iconMuted   = document.getElementById('icon-muted');
  $volSlider   = document.getElementById('vol-slider');
  $toasts      = document.getElementById('toasts');
  $noResults   = document.getElementById('no-results');

  // Sidebar / chat toggles
  document.getElementById('btn-sidebar').addEventListener('click', () => {
    const sb = document.getElementById('sidebar');
    const btn = document.getElementById('btn-sidebar');
    sb.classList.toggle('closed');
    btn.classList.toggle('on', sb.classList.contains('closed'));
  });

  document.getElementById('btn-chat').addEventListener('click', () => {
    const ch = document.getElementById('chat');
    const btn = document.getElementById('btn-chat');
    ch.classList.toggle('closed');
    btn.classList.toggle('on', ch.classList.contains('closed'));
  });

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
    lbl.textContent = cat.name;
    lbl.dataset.cat = cat.name;
    $chList.appendChild(lbl);

    cat.channels.forEach(ch => {
      channels.push(ch);
      $chList.appendChild(buildChItem(ch));
    });
  });

  // Auto-play first
  if (channels.length) loadChannel(channels[0].id);
}

function buildChItem(ch) {
  const el = document.createElement('div');
  el.className = 'ch-item';
  el.id = `ch-${ch.id}`;
  el.dataset.id = ch.id;
  el.dataset.search = ch.name.toLowerCase();

  const initials = ch.shortName.slice(0, 3);
  const qClass = ch.quality === 'HD' ? 'hd' : 'sd';

  el.innerHTML = `
    <div class="ch-avatar">
      ${ch.logo
        ? `<img src="${ch.logo}" alt="${ch.shortName}" onerror="this.parentElement.textContent='${initials}'">`
        : initials
      }
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
  $npName.textContent = ch.name;
  $ctrlChName.textContent = ch.name;

  showLoad(true);
  hideErr();
  startHLS(ch.stream);
  toast(ch.name);
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
  $iconPlay.style.display  = paused  ? '' : 'none';
  $iconPause.style.display = paused ? 'none' : '';
}

function toggleMute() {
  setMuted(!muted);
}

function setMuted(val) {
  muted = val;
  $video.muted = muted;
  $iconVol.style.display    = muted ? 'none' : '';
  $iconMuted.style.display  = muted ? ''     : 'none';
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
