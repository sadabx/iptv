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
let guideMode = "categories";
let activeGuideCategory = null;
let guideSearchReturnCategory = null;

const LIVE_MATCH_DEMO_PARAM = "demoMatches";

const GUIDE_ICON_BASE =
  'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

const GUIDE_CATEGORY_ICONS = {
  Sports: `<svg ${GUIDE_ICON_BASE}><circle cx="12" cy="12" r="9"></circle><path d="M8 4.8 12 8l4-3.2"></path><path d="m8 19.2 4-3.2 4 3.2"></path><path d="m3.6 10.5 4.4 1.7"></path><path d="m20.4 10.5-4.4 1.7"></path><path d="M12 8v8"></path></svg>`,
  News: `<svg ${GUIDE_ICON_BASE}><path d="M4 5h12a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3V5z"></path><path d="M8 9h7"></path><path d="M8 13h7"></path><path d="M8 17h4"></path><path d="M19 8h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1"></path></svg>`,
  Bangladesh: `<svg ${GUIDE_ICON_BASE}><path d="M5 20V4"></path><path d="M5 5h14l-2 5 2 5H5"></path><circle cx="11" cy="10" r="2.6"></circle></svg>`,
  Indian: `<svg ${GUIDE_ICON_BASE}><path d="M5 20V4"></path><path d="M5 5h14"></path><path d="M5 10h14"></path><path d="M5 15h14"></path><circle cx="12" cy="10" r="2"></circle></svg>`,
  International: `<svg ${GUIDE_ICON_BASE}><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a14 14 0 0 1 0 18"></path><path d="M12 3a14 14 0 0 0 0 18"></path></svg>`,
  Kids: `<svg ${GUIDE_ICON_BASE}><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><circle cx="9" cy="10" r="1"></circle><circle cx="15" cy="10" r="1"></circle><path d="M5 8a7 7 0 0 1 14 0v4a7 7 0 0 1-14 0V8z"></path><path d="M7 4 5 2"></path><path d="m17 4 2-2"></path></svg>`,
  Entertainment: `<svg ${GUIDE_ICON_BASE}><rect x="4" y="6" width="16" height="12" rx="2"></rect><path d="M8 6l2 12"></path><path d="m14 6 2 12"></path><path d="M4 10h16"></path><path d="M4 14h16"></path></svg>`,
  Infotainment: `<svg ${GUIDE_ICON_BASE}><rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M8 9h8"></path><path d="M8 13h5"></path><path d="M8 17h8"></path></svg>`,
  Religious: `<svg ${GUIDE_ICON_BASE}><path d="M15.4 4.2a8.2 8.2 0 1 0 0 15.6 7.1 7.1 0 1 1 0-15.6z"></path><path d="m17.7 8.2 1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2.1 1.1.4-2.3-1.7-1.6 2.3-.3 1.1-2.1z"></path></svg>`,
};

// ══════════════════════════════════════════
//  CHANNEL LIST & DOM BUILDERS
// ══════════════════════════════════════════
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function isLiveMatchDemoEnabled() {
  return new URLSearchParams(window.location.search).get(LIVE_MATCH_DEMO_PARAM) === "1";
}

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

  buildGuideCategoryNavigation();
  showGuideCategories();
  updateSidebarCategoryVisibility();
  updateChannelCount();
  initHomePage();
}

function getGuideCategoryIcon(name) {
  return GUIDE_CATEGORY_ICONS[name] || `<svg ${GUIDE_ICON_BASE}><rect x="5" y="5" width="14" height="14" rx="3"></rect><path d="M9 9h6v6H9z"></path></svg>`;
}

function categoryTargetId(name) {
  return `category-${String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

function buildGuideCategoryButton(cat) {
  const button = document.createElement("button");
  button.className = "guide-category-btn focusable";
  button.type = "button";
  button.dataset.cat = cat.name;
  button.innerHTML = `
    <span class="guide-category-icon">${getGuideCategoryIcon(cat.name)}</span>
    <span class="guide-category-name">${cat.name}</span>
    <span class="guide-category-count">${cat.channels.length}</span>
    <span class="guide-category-arrow" aria-hidden="true">
      <svg ${GUIDE_ICON_BASE}><path d="m9 18 6-6-6-6"></path></svg>
    </span>
  `;
  button.addEventListener("click", () => showGuideCategory(cat.name));
  return button;
}

function buildMobileBrowseButton(cat) {
  const button = document.createElement("button");
  button.className = "mobile-browse-btn focusable";
  button.type = "button";
  button.dataset.cat = cat.name;
  button.innerHTML = `
    <span class="mobile-browse-icon">${getGuideCategoryIcon(cat.name)}</span>
    <span class="mobile-browse-name">${cat.name}</span>
    <span class="mobile-browse-count">${cat.channels.length}</span>
  `;
  button.addEventListener("click", () => openCategoryFromBrowse(cat.name));
  return button;
}

function buildGuideRailButton(cat) {
  const button = document.createElement("button");
  button.className = "guide-rail-btn guide-rail-category-btn focusable";
  button.type = "button";
  button.dataset.cat = cat.name;
  button.setAttribute("aria-label", cat.name);
  button.innerHTML = `
    <span class="guide-rail-icon">${getGuideCategoryIcon(cat.name)}</span>
    <span class="guide-rail-label">${cat.name}</span>
    <span class="guide-rail-count">${cat.channels.length}</span>
    <span class="guide-rail-arrow" aria-hidden="true">
      <svg ${GUIDE_ICON_BASE}><path d="m9 18 6-6-6-6"></path></svg>
    </span>
  `;
  button.addEventListener("click", () => {
    if (typeof setGuideOpen === "function") setGuideOpen(true);
    showGuideCategory(cat.name);
  });
  return button;
}

function buildGuideCategoryNavigation() {
  const categoryList = document.getElementById("guide-category-list");
  const railCategories = document.getElementById("guide-rail-categories");
  const mobileBrowseGrid = document.getElementById("mobile-browse-grid");
  if (!categoryList || !railCategories || typeof CHANNELS_DATA === "undefined") return;

  categoryList.innerHTML = "";
  railCategories.innerHTML = "";
  if (mobileBrowseGrid) mobileBrowseGrid.innerHTML = "";

  CHANNELS_DATA.categories.forEach((cat) => {
    categoryList.appendChild(buildGuideCategoryButton(cat));
    railCategories.appendChild(buildGuideRailButton(cat));
    if (mobileBrowseGrid) mobileBrowseGrid.appendChild(buildMobileBrowseButton(cat));
  });
}

function setMobileBrowseSheetOpen(open) {
  document.body.classList.toggle("mobile-browse-open", open);
}

function openCategoryFromBrowse(categoryName) {
  setMobileBrowseSheetOpen(false);

  if (document.body.classList.contains("is-watching")) {
    if (activeId && typeof populateWatchMore === "function") {
      localStorage.setItem("iptv-wm-related-only", "false");
      populateWatchMore(activeId);
    }

    requestAnimationFrame(() => {
      const target = Array.from(document.querySelectorAll("#watch-more .wm-category"))
        .find((section) => section.dataset.cat === categoryName);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return;
  }

  const target = document.getElementById(categoryTargetId(categoryName));
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setGuideTitle(title, showBack) {
  const titleEl = document.querySelector(".guide-title");
  const backBtn = document.getElementById("guide-back");
  if (titleEl) titleEl.textContent = title;
  if (backBtn) backBtn.classList.toggle("hidden", !showBack);
}

function setRailActiveCategory(categoryName) {
  document.querySelectorAll(".guide-rail-category-btn").forEach((button) => {
    const isActive = Boolean(categoryName) && button.dataset.cat === categoryName;
    button.classList.toggle("is-active", isActive);
    if (isActive) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
  });
}

function showGuideCategories() {
  guideMode = "categories";
  activeGuideCategory = null;
  setRailActiveCategory(null);
  document.body.classList.remove("guide-searching", "guide-category-open");
  document.body.classList.add("guide-categories-open");
  setGuideTitle("Categories", false);
  document.querySelectorAll(".cat-label, .ch-item").forEach((el) => {
    el.style.display = "none";
  });
  const noResults = document.getElementById("no-results");
  if (noResults) noResults.style.display = "none";
}

function showGuideCategory(categoryName) {
  guideMode = "category";
  activeGuideCategory = categoryName;
  guideSearchReturnCategory = categoryName;
  setRailActiveCategory(categoryName);
  document.body.classList.remove("guide-searching", "guide-categories-open");
  document.body.classList.add("guide-category-open");
  setGuideTitle(categoryName, true);
  if ($search && $search.value) {
    $search.value = "";
    document.getElementById("search-clear")?.classList.add("hidden");
    renderFloatingSearchResults("");
  }

  const hideOffline = document.body.classList.contains("hide-offline-active");
  let inCategory = false;
  document.querySelectorAll("#ch-list > .cat-label, #ch-list > .ch-item").forEach((el) => {
    if (el.classList.contains("cat-label")) {
      inCategory = el.dataset.cat === categoryName;
      el.style.display = "none";
      return;
    }

    const isOffline = el.classList.contains("is-offline");
    el.style.display = inCategory && (!hideOffline || !isOffline) ? "" : "none";
  });

  updateSidebarCategoryVisibility();
}

function showGuideSearchResults() {
  guideSearchReturnCategory = activeGuideCategory;
  guideMode = "search";
  document.body.classList.remove("guide-categories-open", "guide-category-open");
  document.body.classList.add("guide-searching");
  setGuideTitle("Search", true);
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
      ? `<img class="ch-logo-img" src="${logoSrc}" alt="${ch.shortName}" referrerpolicy="no-referrer" loading="lazy" decoding="async" draggable="false" onerror="this.closest('.ch-logo-box').classList.add('logo-failed')">`
      : ""
    }
      <span class="ch-initials ch-logo-fallback">${initials}</span>
    </div>`;
}

function buildMatchLogo(match) {
  if (match.demoPoster) {
    const leftBadge = escapeHTML(match.demoPoster.left || "");
    const centerBadge = escapeHTML(match.demoPoster.center || "");
    const rightBadge = escapeHTML(match.demoPoster.right || "");

    return `
      <div class="ch-logo-box ch-logo-box--tile demo-match-poster demo-match-poster--${escapeHTML(match.demoPoster.theme || "green")}">
        <span class="demo-match-badge demo-match-badge--left">${leftBadge}</span>
        <span class="demo-match-badge demo-match-badge--center">${centerBadge}</span>
        <span class="demo-match-badge demo-match-badge--right">${rightBadge}</span>
      </div>`;
  }

  if (match.posterUrl) {
    return `
      <div class="ch-logo-box ch-logo-box--tile" style="background: #111; display: flex; align-items: center; justify-content: center;">
        <img class="ch-logo-img" src="${match.posterUrl}" alt="${escapeHTML(match.title)}" referrerpolicy="no-referrer" loading="lazy" draggable="false" style="height: 100%; width: 100%; object-fit: cover;">
      </div>`;
  }

  if (match.poster) {
    const posterSrc = `https://streamed.pk${match.poster}`;
    return `
      <div class="ch-logo-box ch-logo-box--tile" style="background: #111; display: flex; align-items: center; justify-content: center;">
        <img class="ch-logo-img" src="${posterSrc}" alt="${escapeHTML(match.title)}" referrerpolicy="no-referrer" loading="lazy" draggable="false" style="height: 100%; width: 100%; object-fit: cover;">
      </div>`;
  }

  const isTeamSport = match.category === "football" || match.category === "cricket";
  const hasBadges = isTeamSport && match.teams && match.teams.home && match.teams.away && match.teams.home.badge && match.teams.away.badge;

  if (hasBadges) {
    const homeSrc = `https://streamed.pk/api/images/badge/${match.teams.home.badge}.webp`;
    const awaySrc = `https://streamed.pk/api/images/badge/${match.teams.away.badge}.webp`;
    return `
      <div class="ch-logo-box ch-logo-box--tile" style="display: flex; gap: 4px; align-items: center; justify-content: center; padding: 4px; background: #ffffff;">
        <img class="ch-logo-img" src="${homeSrc}" alt="${match.teams.home.name || ''}" referrerpolicy="no-referrer" loading="lazy" draggable="false" style="max-height: 80%; max-width: 45%; object-fit: contain;">
        <img class="ch-logo-img" src="${awaySrc}" alt="${match.teams.away.name || ''}" referrerpolicy="no-referrer" loading="lazy" draggable="false" style="max-height: 80%; max-width: 45%; object-fit: contain;">
      </div>`;
  }

  const initials = match.title ? match.title.slice(0, 3).toUpperCase() : "LIVE";
  return `
    <div class="ch-logo-box ch-logo-box--tile logo-failed">
      <span class="ch-initials ch-logo-fallback" style="display: grid;">${initials}</span>
    </div>`;
}

function getMatchSubtitle(match) {
  const categoryLabels = {
    football: "Football",
    cricket: "Cricket",
    "motor-sports": "Motor Sports"
  };

  return match.league || match.competition || match.tournament || categoryLabels[match.category] || "Live Sports";
}

function getDemoLiveMatches() {
  const now = Date.now();

  return [
    {
      category: "football",
      date: now,
      demoPoster: {
        center: "FIFA",
        left: "FRA",
        right: "ESP",
        theme: "blue"
      },
      demoOnly: true,
      popularityScore: 99,
      sources: [{ source: "demo", id: "france-spain" }],
      title: "France vs Spain",
      tournament: "Football"
    },
    {
      category: "football",
      date: now,
      demoPoster: {
        center: "VS",
        left: "ENG",
        right: "ARG",
        theme: "green"
      },
      demoOnly: true,
      popularityScore: 96,
      sources: [{ source: "demo", id: "england-argentina" }],
      title: "England - Argentina",
      tournament: "Football"
    },
    {
      category: "cricket",
      date: now,
      demoPoster: {
        center: "LIVE",
        left: "BAN",
        right: "IND",
        theme: "red"
      },
      demoOnly: true,
      popularityScore: 92,
      sources: [{ source: "demo", id: "bangladesh-india" }],
      title: "Bangladesh vs India",
      tournament: "Cricket"
    }
  ];
}

function buildLiveMatchSection(liveSports) {
  const liveSection = document.createElement("div");
  liveSection.className = "home-section live-banner-section";
  const isMobileMatchCarousel = window.matchMedia("(max-width: 768px)").matches;

  const liveTitle = document.createElement("h2");
  liveTitle.className = "section-title live-banner-title";
  liveTitle.textContent = "POPULAR MATCHES";
  liveSection.appendChild(liveTitle);

  const liveCarousel = document.createElement("div");
  liveCarousel.className = "carousel-track live-carousel-track";
  if (isMobileMatchCarousel) {
    liveCarousel.style.gridAutoColumns = "100%";
    liveCarousel.style.gap = "0px";
    liveCarousel.style.overflowX = "hidden";
    liveCarousel.style.overflowY = "hidden";
  }
  liveSection.appendChild(liveCarousel);
  enableDragScroll(liveCarousel);

  liveSports.forEach((match) => {
    const card = document.createElement("div");
    card.className = "channel-card home-ch-card live-match-card";
    card.tabIndex = 0;
    if (isMobileMatchCarousel) {
      card.style.width = "100%";
      card.style.minWidth = "100%";
      card.style.maxWidth = "100%";
    }

    card.dataset.streamSource = match.sources[0].source;
    card.dataset.streamId = match.sources[0].id;
    card.dataset.matchTitle = match.title;
    card.dataset.id = `live_${match.sources[0].source}_${match.sources[0].id}`;
    card.dataset.search = match.title.toLowerCase();

    card.innerHTML = `
      <div class="channel-card-thumb">
        ${buildMatchLogo(match)}
      </div>
      <div class="live-match-content">
        <span class="channel-card-live home-live-badge">LIVE</span>
        <h3 class="live-match-title">${escapeHTML(match.title)}</h3>
        <p class="live-match-meta">${escapeHTML(getMatchSubtitle(match))}</p>
        <span class="live-match-cta">Watch now</span>
      </div>
    `;

    const openMatch = () => {
      if (match.demoOnly) {
        showToast("Demo match card only");
        return;
      }

      clearSearchState();
      window.clickedCard = card;
      loadChannel(card.dataset.id);
    };
    card.addEventListener("click", openMatch);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openMatch();
    });

    liveCarousel.appendChild(card);
  });

  createCarouselControls(liveSection, liveCarousel);
  return liveSection;
}

async function loadLiveMatches($stageHome) {
  if (isLiveMatchDemoEnabled()) {
    const demoMatches = getDemoLiveMatches();
    const liveSection = buildLiveMatchSection(demoMatches);
    $stageHome.prepend(liveSection);
    return;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch("https://streamed.pk/api/matches/all", {
      signal: controller.signal
    });
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

    if (liveSports.length === 0) return;

    // Create fragment for prepending matches to the sidebar
    const sidebarFragment = document.createDocumentFragment();

    const lbl = document.createElement("div");
    lbl.className = "cat-label";
    lbl.dataset.cat = "Popular Matches";
    lbl.innerHTML = "Popular Matches";
    sidebarFragment.appendChild(lbl);

    liveSports.forEach((match) => {
      // Build corresponding channel item for the sidebar
      let matchLogo = "";
      if (match.poster) {
        matchLogo = `https://streamed.pk${match.poster}`;
      } else if (match.teams && match.teams.home && match.teams.home.badge) {
        matchLogo = `https://streamed.pk/api/images/badge/${match.teams.home.badge}.webp`;
      }

      const matchCh = {
        id: `live_${match.sources[0].source}_${match.sources[0].id}`,
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

    const liveSection = buildLiveMatchSection(liveSports);
    $stageHome.prepend(liveSection);
    $chList.prepend(sidebarFragment);

    // Update sidebar counters & visibility styling
    updateSidebarCategoryVisibility();
    updateChannelCount();
  } catch (err) {
    console.error("Error loading dynamic sports matches:", err);
  } finally {
    clearTimeout(timeoutId);
  }
}

function enableDragScroll(track) {
  if (!track || track.dataset.dragScrollEnabled === "true") return;
  track.dataset.dragScrollEnabled = "true";

  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let dragged = false;

  track.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

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
  // Carousel arrow buttons are disabled; rows now use direct drag-scroll.
  return () => { };

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

  const title = section.querySelector(".section-title");
  if (title) {
    let header = title.closest(".section-header");
    if (!header) {
      header = document.createElement("div");
      header.className = "section-header";
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

  CHANNELS_DATA.categories.forEach((cat) => {
    const section = document.createElement("div");
    section.className = "home-section";
    section.id = categoryTargetId(cat.name);
    section.dataset.cat = cat.name;

    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = cat.name;
    section.appendChild(title);

    const carousel = document.createElement("div");
    carousel.className = "carousel-track";
    enableDragScroll(carousel);

    cat.channels.forEach((ch) => {
      const isOffline = offlineList.includes(ch.id);
      const card = document.createElement("div");
      card.className =
        "channel-card home-ch-card" + (isOffline ? " is-offline" : "");
      card.tabIndex = 0;
      card.dataset.id = ch.id;
      card.dataset.search = ch.name.toLowerCase();

      card.innerHTML = `
        <div class="channel-card-thumb">
          ${buildChannelLogo(ch, "tile")}
          <span class="channel-card-live home-live-badge">LIVE</span>
        </div>
        <p class="channel-card-title home-ch-name">${ch.name}</p>
      `;

      const openChannel = () => {
        clearSearchState();
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
	          <span class="footer-logo-mark"><img src="assets/t9.png" alt=""></span>
	          <span class="footer-logo-text">TRIONINE <sub>TV</sub></span>
	        </div>
	        <p class="footer-tagline">Live channels, sports events, and quick access streams in one lightweight TV hub.</p>
	        <div class="footer-chips" aria-label="Site highlights">
	          <span>Live TV</span>
	          <span>Sports</span>
	          <span>IPTV</span>
	        </div>
	      </div>
	      <div class="footer-links">
	        <div class="footer-col-label">Quick Links</div>
	        <a href="/link-auditor" target="_blank">Link Auditor</a>
          <a href="https://github.com/sadabx/TNTV/releases/download/v1.0.1/trionine-tv-v1.0.1.apk" target="_blank" rel="noopener" >Get Android TV APK ↗</a>
	        <a href="https://github.com/sadabx/iptv" target="_blank" rel="noopener">Contribute on GitHub ↗</a>
	      </div>
	      <div class="footer-meta">
	        <div class="footer-col-label">Network</div>
	        <a class="footer-discord" href="https://discord.gg/JxZ4RS4Y7x" target="_blank" rel="noopener">Discord community ↗</a>
	        <div class="footer-dev">Built by <a href="https://trionine.com" target="_blank" rel="noopener">trionine</a></div>
	        <p class="footer-note">External streams are provided as-is.</p>
	        <div class="footer-copy">© ${new Date().getFullYear()} TRIONINE TV</div>
	      </div>
	    </div>
  `;
  $stageHome.appendChild(footer);

  loadLiveMatches($stageHome);
}

function showHomePage() {
  activeId = null;
  resetHomeCatalogFilters();

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
  document.body.classList.remove("chat-open");
  document.getElementById("chat")?.classList.add("closed");
  document.getElementById("btn-chat")?.classList.remove("on");
  document.getElementById("ctrl-chat")?.classList.remove("on");

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
    </div>`;

  const openChannel = () => {
    clearSearchState();
    loadChannel(ch.id);
  };
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

function resetHomeCatalogFilters() {
  document.querySelectorAll(".home-ch-card, .wm-card").forEach((card) => {
    card.style.display = "";
  });
  document.querySelectorAll(".home-section").forEach((section) => {
    section.style.display = "";
  });
  const homeNoResults = document.getElementById("home-no-results");
  if (homeNoResults) homeNoResults.style.display = "none";
  const wmTitle = document.querySelector(".wm-title");
  if (wmTitle) wmTitle.style.display = "";
}

function clearSearchState() {
  if ($search) {
    $search.value = "";
    document.getElementById("search-clear")?.classList.add("hidden");
  }
  renderFloatingSearchResults("");
  document.body.classList.remove("guide-searching");
  resetHomeCatalogFilters();
}

function renderFloatingSearchResults(q) {
  const resultsEl = document.getElementById("floating-search-results");
  if (!resultsEl) return;

  const hideOffline = document.body.classList.contains("hide-offline-active");
  const query = (q || "").trim();
  const matches = channels
    .filter((ch) => {
      if (!ch || ch.stream === "DYNAMIC_SPORTS_STREAMED_PK") return false;
      if (hideOffline && getOfflineChannels().includes(ch.id)) return false;
      if (!query) return false;
      return ch.name.toLowerCase().includes(query);
    })
    .slice(0, 18);

  if (!query) {
    resultsEl.innerHTML = '<div class="floating-search-empty">Start typing to find a channel</div>';
    return;
  }

  if (!matches.length) {
    resultsEl.innerHTML = '<div class="floating-search-empty">No channels found</div>';
    return;
  }

  resultsEl.innerHTML = matches.map((ch) => `
    <button class="floating-search-result focusable" type="button" data-id="${ch.id}">
      ${buildChannelLogo(ch, "guide")}
      <span class="floating-search-result-main">
        <span class="floating-search-result-name">${escapeHTML(ch.name)}</span>
        <span class="floating-search-result-meta">${escapeHTML(ch.category || "Live TV")}</span>
      </span>
      <span class="floating-search-result-arrow" aria-hidden="true">
        <svg ${GUIDE_ICON_BASE}><path d="m9 18 6-6-6-6"></path></svg>
      </span>
    </button>
  `).join("");

  resultsEl.querySelectorAll(".floating-search-result").forEach((button) => {
    button.addEventListener("click", () => {
      clearSearchState();
      loadChannel(button.dataset.id);
    });
  });
}

function closeFloatingSearch(clearValue = false) {
  document.body.classList.remove("guide-searching");
  if (clearValue) {
    clearSearchState();
  }
  if (guideMode === "search") {
    if (activeGuideCategory) showGuideCategory(activeGuideCategory);
    else showGuideCategories();
  }
}

function onSearch(e) {
  const q = ((e && e.target ? e.target.value : null) || ($search ? $search.value : "")).toLowerCase().trim();
  const hideOffline = document.body.classList.contains("hide-offline-active");
  renderFloatingSearchResults(q);

  if (q) {
    showGuideSearchResults();
  }

  const anySidebarVisible = filterCards(".ch-item", q, hideOffline);
  if (q) {
    updateSidebarCategoryVisibility();
    document.querySelectorAll(".cat-label").forEach((lbl) => {
      lbl.style.display = "none";
    });
  }
  else if (guideMode === "search") {
    // Keep the floating search overlay open while the input is empty.
  }
  else if (guideMode === "category" && activeGuideCategory) showGuideCategory(activeGuideCategory);
  else showGuideCategories();
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
