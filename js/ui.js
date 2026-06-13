/* ==========================================
   ui.js — Sidebar States, Home Grids, Search, and Keystroke Binds
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
    lbl.innerHTML = cat.name;
    $chList.appendChild(lbl);

    cat.channels.forEach((ch) => {
      ch.category = cat.name;
      channels.push(ch);
      $chList.appendChild(buildChItem(ch));
    });
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
  footer.className = "app-footer";
  footer.innerHTML =
    'Developed by <a href="https://trionine.xyz" target="_blank" rel="noopener">TRIONINE</a> • <a href="link-auditor/index.html" target="_blank">Link Auditor</a>';
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
  if (mpegtsPlayer) {
    mpegtsPlayer.destroy();
    mpegtsPlayer = null;
  }
  $video.src = "";
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
//  SEARCH FILTER INTERFACE
// ══════════════════════════════════════════
function onSearch(e) {
  const q = e.target.value.toLowerCase().trim();
  let anySidebarVisible = false;
  let anyHomeVisible = false;

  document.querySelectorAll(".ch-item").forEach((el) => {
    const isOffline = el.classList.contains("is-offline");
    const match = !isOffline && (!q || el.dataset.search.includes(q));
    el.style.display = match ? "" : "none";
    if (match) anySidebarVisible = true;
  });

  document.querySelectorAll(".cat-label").forEach((lbl) => {
    let sib = lbl.nextElementSibling;
    let catVisible = false;
    while (sib && !sib.classList.contains("cat-label")) {
      if (sib.style.display !== "none" && !sib.classList.contains("is-offline"))
        catVisible = true;
      sib = sib.nextElementSibling;
    }
    lbl.style.display = catVisible ? "" : "none";
  });

  if ($noResults)
    $noResults.style.display = anySidebarVisible ? "none" : "block";

  document.querySelectorAll(".home-ch-card").forEach((card) => {
    const isOffline = card.classList.contains("is-offline");
    const match =
      !isOffline &&
      (!q || (card.dataset.search && card.dataset.search.includes(q)));
    card.style.display = match ? "" : "none";
    if (match) anyHomeVisible = true;
  });

  document.querySelectorAll(".home-section").forEach((sec) => {
    const cards = sec.querySelectorAll(".home-ch-card");
    let secVisible = false;
    cards.forEach((card) => {
      if (
        card.style.display !== "none" &&
        !card.classList.contains("is-offline")
      )
        secVisible = true;
    });
    sec.style.display = secVisible ? "" : "none";
  });

  const $homeNoResults = document.getElementById("home-no-results");
  if ($homeNoResults)
    $homeNoResults.style.display = anyHomeVisible ? "none" : "flex";

  let anyWmVisible = false;
  document.querySelectorAll(".wm-card").forEach((card) => {
    const isOffline = card.classList.contains("is-offline");
    const match =
      !isOffline &&
      (!q || (card.dataset.search && card.dataset.search.includes(q)));
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

function updateSidebarCategoryVisibility() {
  document.querySelectorAll(".cat-label").forEach((lbl) => {
    let sib = lbl.nextElementSibling;
    let catVisible = false;
    while (sib && !sib.classList.contains("cat-label")) {
      if (
        sib.style.display !== "none" &&
        !sib.classList.contains("is-offline")
      ) {
        catVisible = true;
      }
      sib = sib.nextElementSibling;
    }
    lbl.style.display = catVisible ? "" : "none";
  });
}

function updateCategorySectionVisibility(sec) {
  if (!sec) return;
  const cards = sec.querySelectorAll(".home-ch-card");
  let secVisible = false;
  cards.forEach((card) => {
    if (
      card.style.display !== "none" &&
      !card.classList.contains("is-offline")
    ) {
      secVisible = true;
    }
  });
  sec.style.display = secVisible ? "" : "none";
}

function updateChannelCount() {
  if ($chCount) {
    const totalOnline = document.querySelectorAll(
      ".ch-item:not(.is-offline)",
    ).length;
    $chCount.textContent = totalOnline;
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

      const contentType = (res.headers.get("content-type") || "").toLowerCase();
      const isHls =
        contentType.includes("mpegurl") ||
        contentType.includes("x-mpegurl") ||
        /\.(m3u8)(\?|$)/i.test(url);
      const isTs =
        contentType.includes("mp2t") ||
        contentType.includes("video/mp4") ||
        contentType.includes("octet-stream") ||
        /\.(ts|mpegts|m2ts)(\?|$)/i.test(url);

      if (isTs) {
        return true;
      }

      if (!isHls) {
        if (
          contentType.startsWith("video/") ||
          contentType.startsWith("audio/")
        ) {
          return true;
        }
      }

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
