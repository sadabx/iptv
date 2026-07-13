/* ==========================================
   ui-renderer.js — Guide, catalog, search, status UI, and DOM builders
   ========================================== */

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

let channels = [];

// ══════════════════════════════════════════
//  CHANNEL LIST & DOM BUILDERS
// ══════════════════════════════════════════
function initChannels() {
  if (typeof CHANNELS_DATA === "undefined") {
    $chList.innerHTML =
      '<div style="padding:16px;font-size:.78rem;color:var(--text3)">channel-catalog.js not found</div>';
    return;
  }
  channels = [];
  $chList.innerHTML = "";

  CHANNELS_DATA.categories.forEach((cat) => {
    const lbl = document.createElement("div");
    lbl.className = "cat-label";
    lbl.dataset.cat = cat.name;
    lbl.innerHTML = cat.name;
    $chList.appendChild(lbl);

    cat.channels.forEach((ch) => {
      ch.category = cat.name;
      channels.push(ch);
      $chList.appendChild(buildChItem(ch));
    });
  });

  // Add virtual channel for dynamic live sports matches so routing and lookups don't fail
  channels.push({
    id: "live-sports-automated",
    name: "Live Sports Engine",
    shortName: "LIVE",
    quality: "FHD",
    stream: "DYNAMIC_SPORTS_STREAMED_PK",
    isEmbed: true,
    category: "Sports"
  });

  channels.push({
    id: "f1-live",
    name: "Live F1 Match",
    shortName: "F1 LIVE",
    quality: "FHD",
    stream: "DYNAMIC_SPORTS_STREAMED_PK",
    isEmbed: true,
    category: "Sports"
  });

  channels.push({
    id: "fifa-live",
    name: "Live Football Match",
    shortName: "FIFA LIVE",
    quality: "FHD",
    stream: "DYNAMIC_SPORTS_STREAMED_PK",
    isEmbed: true,
    category: "Sports"
  });

  channels.push({
    id: "cricket-live",
    name: "Live Cricket Match",
    shortName: "CRIC LIVE",
    quality: "FHD",
    stream: "DYNAMIC_SPORTS_STREAMED_PK",
    isEmbed: true,
    category: "Sports"
  });

  updateSidebarCategoryVisibility();
  updateChannelCount();
  initHomePage();
}

function buildChannelLogo(ch, variant = "guide") {
  const initials = ch.shortName.slice(0, 3);
  const boxClass =
    variant === "tile"
      ? "ch-logo-box ch-logo-box--tile"
      : "ch-logo-box ch-logo-box--guide";
  const fallbackOnly = !ch.logo;

  // Normalize to root-relative path so logos resolve correctly even when the
  // active URL is a deep route like /sports/channel-id (relative paths would
  // otherwise resolve to /sports/assets/logos/... which is a 404).
  const logoSrc = ch.logo
    ? ch.logo.startsWith("http") || ch.logo.startsWith("/")
      ? ch.logo
      : "/" + ch.logo
    : "";

  return `
    <div class="${boxClass}${fallbackOnly ? " logo-failed" : ""}"${ch.themeColor ? ` style="background: ${ch.themeColor};"` : ""}>
      ${logoSrc
      ? `<img class="ch-logo-img" src="${logoSrc}" alt="${ch.shortName}" referrerpolicy="no-referrer" loading="lazy" decoding="async" onerror="this.closest('.ch-logo-box').classList.add('logo-failed')">`
      : ""
    }
      <span class="ch-initials ch-logo-fallback">${initials}</span>
    </div>`;
}

function buildMatchLogo(match) {
  if (match.poster) {
    const posterSrc = `https://streamed.pk${match.poster}`;
    return `
      <div class="ch-logo-box ch-logo-box--tile" style="background: #111; display: flex; align-items: center; justify-content: center;">
        <img class="ch-logo-img" src="${posterSrc}" alt="${match.title}" referrerpolicy="no-referrer" loading="lazy" style="height: 100%; width: 100%; object-fit: cover;">
      </div>`;
  }

  const isTeamSport = match.category === "football" || match.category === "cricket";
  const hasBadges = isTeamSport && match.teams && match.teams.home && match.teams.away && match.teams.home.badge && match.teams.away.badge;

  if (hasBadges) {
    const homeSrc = `https://streamed.pk/api/images/badge/${match.teams.home.badge}.webp`;
    const awaySrc = `https://streamed.pk/api/images/badge/${match.teams.away.badge}.webp`;
    return `
      <div class="ch-logo-box ch-logo-box--tile" style="display: flex; gap: 4px; align-items: center; justify-content: center; padding: 4px; background: #ffffff;">
        <img class="ch-logo-img" src="${homeSrc}" alt="${match.teams.home.name || ''}" referrerpolicy="no-referrer" loading="lazy" style="max-height: 80%; max-width: 45%; object-fit: contain;">
        <img class="ch-logo-img" src="${awaySrc}" alt="${match.teams.away.name || ''}" referrerpolicy="no-referrer" loading="lazy" style="max-height: 80%; max-width: 45%; object-fit: contain;">
      </div>`;
  }

  const initials = match.title ? match.title.slice(0, 3).toUpperCase() : "LIVE";
  return `
    <div class="ch-logo-box ch-logo-box--tile logo-failed">
      <span class="ch-initials ch-logo-fallback" style="display: grid;">${initials}</span>
    </div>`;
}

async function loadLiveMatches(carouselTrack) {
  try {
    const res = await fetch("https://streamed.pk/api/matches/all");
    if (!res.ok) throw new Error("API response error");
    const matches = await res.json();

    const now = Date.now();
    const liveSports = matches.filter((m) => {
      const validCategories = ["football", "motor-sports", "cricket"];
      const isSports = validCategories.includes(m.category);
      const hasSources = m.sources && m.sources.length > 0;

      const hoursSinceStart = (now - m.date) / (1000 * 60 * 60);

      let maxHours = 3;
      if (m.category === "cricket") maxHours = 8;
      if (m.category === "motor-sports") maxHours = 5;

      const isLive = hoursSinceStart >= -1.5 && hoursSinceStart <= maxHours;

      return isSports && hasSources && isLive && isPopularMatch(m);
    }).sort(sortPopularMatches);

    if (liveSports.length === 0) {
      if (carouselTrack.parentElement) {
        carouselTrack.parentElement.style.display = 'none';
      }
      return;
    }

    carouselTrack.innerHTML = "";

    // Create fragment for prepending matches to the sidebar
    const sidebarFragment = document.createDocumentFragment();

    const lbl = document.createElement("div");
    lbl.className = "cat-label";
    lbl.dataset.cat = "Popular Matches";
    lbl.innerHTML = "Popular Matches";
    sidebarFragment.appendChild(lbl);

    liveSports.forEach((match) => {
      const card = document.createElement("div");
      card.className = "yt-tile home-ch-card";
      card.tabIndex = 0;

      card.dataset.streamSource = match.sources[0].source;
      card.dataset.streamId = match.sources[0].id;
      card.dataset.matchTitle = match.title;
      card.dataset.id = `live_${match.sources[0].source}_${match.sources[0].id}`;
      card.dataset.search = match.title.toLowerCase();

      card.innerHTML = `
        <div class="yt-tile-thumb">
          ${buildMatchLogo(match)}
          <span class="yt-tile-live home-live-badge">LIVE</span>
        </div>
        <p class="yt-tile-title home-ch-name" title="${match.title}">${match.title}</p>
        <p class="yt-tile-meta">SPORTS</p>
      `;

      const openMatch = () => {
        window.clickedCard = card;
        loadChannel(card.dataset.id);
      };
      card.addEventListener("click", openMatch);
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openMatch();
      });

      carouselTrack.appendChild(card);

      // Build corresponding channel item for the sidebar
      let matchLogo = "";
      if (match.poster) {
        matchLogo = `https://streamed.pk${match.poster}`;
      } else if (match.teams && match.teams.home && match.teams.home.badge) {
        matchLogo = `https://streamed.pk/api/images/badge/${match.teams.home.badge}.webp`;
      }

      const matchCh = {
        id: card.dataset.id,
        name: match.title,
        shortName: "LIVE",
        quality: "FHD",
        logo: matchLogo,
        isEmbed: true,
        category: "Popular Matches"
      };

      // Push to the global channels list so searching, selection, and direct routing resolve
      channels.push(matchCh);

      const chItem = buildChItem(matchCh);
      sidebarFragment.appendChild(chItem);
    });

    $chList.prepend(sidebarFragment);

    // Update sidebar counters & visibility styling
    updateSidebarCategoryVisibility();
    updateChannelCount();
  } catch (err) {
    console.error("Error loading dynamic sports matches:", err);
    const sec = carouselTrack.closest(".home-section");
    if (sec) sec.style.display = "none";
  }
}

function enableDragScroll(track) {
  if (!track || track.dataset.dragScrollEnabled === "true") return;
  track.dataset.dragScrollEnabled = "true";

  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let dragged = false;

  track.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    isDown = true;
    dragged = false;
    startX = event.clientX;
    startScrollLeft = track.scrollLeft;
  });

  track.addEventListener("pointermove", (event) => {
    if (!isDown) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 10) {
      dragged = true;
      track.classList.add("is-dragging");
    }
    if (!dragged) return;
    track.scrollLeft = startScrollLeft - delta;
  });

  const stopDragging = (event) => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove("is-dragging");
  };

  track.addEventListener("pointerup", stopDragging);
  track.addEventListener("pointercancel", stopDragging);
  track.addEventListener("pointerleave", stopDragging);

  track.addEventListener("click", (event) => {
    if (!dragged) return;
    event.preventDefault();
    event.stopPropagation();
    dragged = false;
  }, true);
}

function createCarouselControls(section, track) {
  const controls = document.createElement("div");
  controls.className = "carousel-controls";
  controls.innerHTML = `
    <button class="carousel-nav-btn" type="button" data-dir="-1" aria-label="Previous channels">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6"></path>
      </svg>
    </button>
    <button class="carousel-nav-btn" type="button" data-dir="1" aria-label="Next channels">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M9 6l6 6-6 6"></path>
      </svg>
    </button>
  `;

  const updateControls = () => {
    const canScroll = track.scrollWidth > track.clientWidth + 2;
    const prev = controls.querySelector('[data-dir="-1"]');
    const next = controls.querySelector('[data-dir="1"]');

    controls.classList.toggle("is-hidden", !canScroll);
    if (!canScroll) return;

    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
  };

  controls.addEventListener("click", (event) => {
    const button = event.target.closest(".carousel-nav-btn");
    if (!button) return;
    const direction = Number(button.dataset.dir);
    track.scrollBy({
      left: direction * Math.max(track.clientWidth * 0.85, 240),
      behavior: "smooth"
    });
  });

  track.addEventListener("scroll", updateControls, { passive: true });
  window.addEventListener("resize", updateControls);

  const title = section.querySelector(".yt-row-title");
  if (title) {
    let header = title.closest(".yt-row-header");
    if (!header) {
      header = document.createElement("div");
      header.className = "yt-row-header";
      title.before(header);
      header.appendChild(title);
    }
    header.appendChild(controls);
  } else {
    section.appendChild(controls);
  }

  requestAnimationFrame(updateControls);

  return updateControls;
}

function initHomePage() {
  if (typeof CHANNELS_DATA === "undefined") return;
  const $stageHome = document.getElementById("stage-home");
  if (!$stageHome) return;

  $stageHome.innerHTML = "";
  const offlineList = getOfflineChannels();

  // Inject Popular Match Center row
  const liveSection = document.createElement("div");
  liveSection.className = "home-section live-banner-section";

  const liveTitle = document.createElement("h2");
  liveTitle.className = "yt-row-title live-banner-title";
  liveTitle.textContent = "Popular Matches";
  liveSection.appendChild(liveTitle);

  const liveCarousel = document.createElement("div");
  liveCarousel.className = "carousel-track live-carousel-track";
  liveCarousel.innerHTML = `
    <div class="live-empty-banner">
      <span class="home-live-badge">LIVE</span>
      <strong>Loading popular matches</strong>
      <p>Finding major football, cricket, and motorsport streams.</p>
    </div>
  `;
  liveSection.appendChild(liveCarousel);
  enableDragScroll(liveCarousel);
  const updateLiveControls = createCarouselControls(liveSection, liveCarousel);

  $stageHome.appendChild(liveSection);

  loadLiveMatches(liveCarousel).finally(updateLiveControls);

  CHANNELS_DATA.categories.forEach((cat) => {
    const section = document.createElement("div");
    section.className = "home-section";

    const title = document.createElement("h2");
    title.className = "yt-row-title";
    title.textContent = cat.name;
    section.appendChild(title);

    const carousel = document.createElement("div");
    carousel.className = "carousel-track";
    enableDragScroll(carousel);

    cat.channels.forEach((ch) => {
      const isOffline = offlineList.includes(ch.id);
      const card = document.createElement("div");
      card.className =
        "yt-tile home-ch-card" + (isOffline ? " is-offline" : "");
      card.tabIndex = 0;
      card.dataset.id = ch.id;
      card.dataset.search = ch.name.toLowerCase();

      card.innerHTML = `
        <div class="yt-tile-thumb">
          ${buildChannelLogo(ch, "tile")}
          <span class="yt-tile-live home-live-badge">LIVE</span>
        </div>
        <p class="yt-tile-title home-ch-name">${ch.name}</p>
      `;

      const openChannel = () => {
        loadChannel(ch.id);
      };
      card.addEventListener("click", openChannel);
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openChannel();
      });

      carousel.appendChild(card);
    });

    section.appendChild(carousel);
    createCarouselControls(section, carousel);
    $stageHome.appendChild(section);
    updateCategorySectionVisibility(section);
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
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">
          <span class="logo-pi">TN</span>
          <span>TV</span>
        </div>
        <p class="footer-tagline">A collection of live TV channels<br>and sports events, available for free.</p>
        <div class="footer-dev">Developed by <a href="https://trionine.xyz" target="_blank" rel="noopener">trionine</a></div>
      </div>
      <div class="footer-links">
        <div class="footer-col-label">QUICK LINKS</div>
        <a href="/">Home</a>
        <a href="/link-auditor" target="_blank">Link Auditor</a>
        <a href="https://discord.gg/JxZ4RS4Y7x" target="_blank" rel="noopener">Discord ↗</a>
        <a href="https://github.com/sadabx/iptv" target="_blank" rel="noopener">Contribute on GitHub ↗</a>
      </div>
      <div class="footer-meta">
        <div class="footer-col-label">DISCLAIMER</div>
        <p class="footer-note">External links are not endorsed.<br>Use at your own discretion.</p>
        <div class="footer-copy">© ${new Date().getFullYear()} T9TV</div>
      </div>
    </div>
  `;
  $stageHome.appendChild(footer);
}

function showHomePage() {
  activeId = null;

  // Clean URL routing: reset path to root when going home
  if (window.location.pathname !== "/") {
    window.history.pushState({}, "", "/");
  }

  document
    .querySelectorAll(".ch-item")
    .forEach((el) => el.classList.remove("active"));

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

  // Stop YouTube embed if still playing in background
  const $embedPlayer = document.getElementById("embed-player");
  if ($embedPlayer) {
    $embedPlayer.src = "";
    $embedPlayer.classList.add("hidden");
  }
  const $stage = document.querySelector(".stage");
  if ($stage) $stage.classList.remove("is-embed");
  isEmbedActive = false;

  stopStatsInterval();
  clearPlayTimeoutWatchdog();
  document.body.classList.remove("is-watching");

  if (typeof setGuideOpen === "function") {
    setGuideOpen(false);
  }

  $npName.textContent = "Browse Channels";
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
  el.tabIndex = 0;
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
      </div>
    </div>`;

  const openChannel = () => loadChannel(ch.id);
  el.addEventListener("click", openChannel);
  el.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openChannel();
  });
  return el;
}

// ══════════════════════════════════════════
//  SEARCH FILTER INTERFACE
// ══════════════════════════════════════════
function filterCards(selector, q, hideOffline) {
  let anyVisible = false;
  document.querySelectorAll(selector).forEach((card) => {
    const isOffline = card.classList.contains("is-offline");
    const match = (!hideOffline || !isOffline) && (!q || (card.dataset.search && card.dataset.search.includes(q)));
    card.style.display = match ? "" : "none";
    if (match) anyVisible = true;
  });
  return anyVisible;
}

function onSearch(e) {
  const q = ((e && e.target ? e.target.value : null) || ($search ? $search.value : "")).toLowerCase().trim();
  const hideOffline = document.body.classList.contains("hide-offline-active");

  const anySidebarVisible = filterCards(".ch-item", q, hideOffline);
  updateSidebarCategoryVisibility();
  if ($noResults) $noResults.style.display = anySidebarVisible ? "none" : "block";

  const anyHomeVisible = filterCards(".home-ch-card", q, hideOffline);
  document.querySelectorAll(".home-section").forEach(updateCategorySectionVisibility);

  const $homeNoResults = document.getElementById("home-no-results");
  if ($homeNoResults) $homeNoResults.style.display = anyHomeVisible ? "none" : "flex";

  const anyWmVisible = filterCards(".wm-card", q, hideOffline);
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

function updateSidebarCategoryVisibility() {
  const hideOffline = document.body.classList.contains("hide-offline-active");
  document.querySelectorAll(".cat-label").forEach((lbl) => {
    let sib = lbl.nextElementSibling;
    let catVisible = false;
    while (sib && !sib.classList.contains("cat-label")) {
      if (sib.style.display !== "none" && (!hideOffline || !sib.classList.contains("is-offline"))) {
        catVisible = true;
        break; // Optimization: early exit
      }
      sib = sib.nextElementSibling;
    }
    lbl.style.display = catVisible ? "" : "none";
  });
}

function updateCategorySectionVisibility(sec) {
  if (!sec) return;
  const hideOffline = document.body.classList.contains("hide-offline-active");
  const cards = sec.querySelectorAll(".home-ch-card");
  const secVisible = Array.from(cards).some((card) =>
    card.style.display !== "none" && (!hideOffline || !card.classList.contains("is-offline"))
  );
  sec.style.display = secVisible ? "" : "none";
}

function updateChannelCount() {
  if ($chCount) {
    const hideOffline = document.body.classList.contains("hide-offline-active");
    const count = hideOffline
      ? document.querySelectorAll(".ch-item:not(.is-offline)").length
      : document.querySelectorAll(".ch-item").length;
    $chCount.textContent = count;
  }
}

function updateChannelStatusUI(id, isOnline) {
  const $sideItem = document.getElementById(`ch-${id}`);
  if ($sideItem) {
    $sideItem.classList.toggle("is-offline", !isOnline);
  }
  updateSidebarCategoryVisibility();
  updateChannelCount();

  const $homeCard = document.querySelector(`.home-ch-card[data-id="${id}"]`);
  if ($homeCard) {
    $homeCard.classList.toggle("is-offline", !isOnline);
    updateCategorySectionVisibility($homeCard.closest(".home-section"));
  }
  const $wmCard = document.querySelector(`.wm-card[data-id="${id}"]`);
  if ($wmCard) {
    $wmCard.classList.toggle("is-offline", !isOnline);
  }
}

async function checkChannelStatus(ch) {
  if (
    ch.isEmbed ||
    ch.id === "peace-tv-bangla" ||
    ch.id === "madani-channel" ||
    ch.id === "peace-tv-english"
  )
    return true;

  const streams = getStreams(ch);
  if (!streams.length) return false;
  if (streams.some((s) => isYouTubeUrl(s.url))) return true;

  const url = streams[0]?.url;
  if (!url) return false;

  const proxiedUrl =
    typeof getProxiedUrl === "function" ? getProxiedUrl(url) : url;
  const controller = new AbortController();

  // Improvement 1: Give IPTV panels a realistic 8-second window to respond
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(proxiedUrl, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "*/*" },
    });

    clearTimeout(timeoutId);
    return res.ok; // Returns true if HTTP status code is 200-299
  } catch (e) {
    clearTimeout(timeoutId);

    // Improvement 2: Catch CORS/Network Error False Alarms
    // If the network request failed but was NOT cut off by your timeout,
    // the server is physically online and responsive, but browser security rules blocked a text read.
    if (e.name !== "AbortError") {
      console.log(
        `💡 Channel ${ch.name} is online but CORS-restricted. Keeping it clickable.`,
      );
      return true; // Keep it active/clickable on your homepage grid!
    }
  }
  return false; // The link is genuinely dead or timed out completely
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
