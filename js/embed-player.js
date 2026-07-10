/* ==========================================
   embed-player.js — YouTube & 3rd-Party Embeds logic
   ========================================== */

const POPULAR_MATCH_KEYWORDS = [
  "world cup",
  "fifa",
  "uefa",
  "champions league",
  "europa league",
  "conference league",
  "premier league",
  "la liga",
  "serie a",
  "bundesliga",
  "ligue 1",
  "fa cup",
  "efl cup",
  "copa america",
  "afc",
  "ipl",
  "bpl",
  "psl",
  "big bash",
  "bbl",
  "the hundred",
  "test",
  "odi",
  "t20",
  "t20i",
  "formula 1",
  "f1",
  "grand prix",
  "motogp"
];

const POPULAR_MATCH_TEAMS = [
  "argentina",
  "brazil",
  "france",
  "england",
  "spain",
  "germany",
  "italy",
  "portugal",
  "netherlands",
  "belgium",
  "uruguay",
  "croatia",
  "morocco",
  "usa",
  "mexico",
  "japan",
  "south korea",
  "real madrid",
  "barcelona",
  "manchester united",
  "manchester city",
  "liverpool",
  "arsenal",
  "chelsea",
  "tottenham",
  "bayern",
  "borussia dortmund",
  "psg",
  "paris saint-germain",
  "juventus",
  "inter",
  "milan",
  "napoli",
  "atletico",
  "benfica",
  "porto",
  "ajax",
  "india",
  "pakistan",
  "bangladesh",
  "australia",
  "new zealand",
  "south africa",
  "sri lanka",
  "west indies",
  "afghanistan",
  "chennai super kings",
  "mumbai indians",
  "royal challengers",
  "kolkata knight riders",
  "dhaka",
  "comilla",
  "rangpur"
];

function normalizeMatchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getMatchSearchText(match) {
  const teams = match && match.teams
    ? [
      match.teams.home && match.teams.home.name,
      match.teams.away && match.teams.away.name
    ]
    : [];

  return normalizeMatchText([
    match && match.title,
    match && match.category,
    match && match.competition,
    match && match.league,
    match && match.tournament,
    ...teams
  ].filter(Boolean).join(" "));
}

function hasMatchKeyword(text, keywords) {
  return keywords.some((keyword) => {
    if (keyword.length <= 3) {
      return new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(text);
    }

    return text.includes(keyword);
  });
}

function getMatchPopularityScore(match) {
  if (!match) return 0;

  if (match.popular === true || match.isPopular === true || match.featured === true || match.hot === true || match.mainEvent === true) {
    return 100;
  }

  const numericFields = [
    { name: "popularity", value: match.popularity },
    { name: "popularityScore", value: match.popularityScore },
    { name: "score", value: match.score },
    { name: "viewers", value: match.viewers },
    { name: "viewerCount", value: match.viewerCount },
    { name: "views", value: match.views },
    { name: "rank", value: match.rank }
  ];

  for (const field of numericFields) {
    const value = Number(field.value);
    if (!Number.isFinite(value)) continue;
    if (field.name === "rank") {
      if (value > 0 && value <= 20) return 90 - value;
      continue;
    }
    if (value >= 1000) return 90;
    if (value >= 50) return 75;
  }

  const text = getMatchSearchText(match);
  let score = 0;
  if (hasMatchKeyword(text, POPULAR_MATCH_KEYWORDS)) score += 45;
  if (hasMatchKeyword(text, POPULAR_MATCH_TEAMS)) score += 45;
  if (match.poster) score += 5;
  if (match.teams && match.teams.home && match.teams.away) score += 5;

  return score;
}

function isPopularMatch(match) {
  return getMatchPopularityScore(match) >= 45;
}

function sortPopularMatches(a, b) {
  return getMatchPopularityScore(b) - getMatchPopularityScore(a);
}

// ── YouTube Helper Functions
function isYouTubeUrl(url) {
  if (!url) return false;
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    /^UC[A-Za-z0-9_-]{22}$/.test(url)
  );
}

function getYouTubeId(url) {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getYouTubeEmbedUrl(url) {
  if (!url) return "";

  // 1. Check if it is a dynamic channel live stream embed URL
  if (url.includes("live_stream") && url.includes("channel=")) {
    const match = url.match(/channel=([^&]+)/);
    if (match) {
      return `https://www.youtube.com/embed/live_stream?channel=${match[1]}&autoplay=1&mute=0&rel=0`;
    }
  }

  // 2. Check if it is a plain channel page URL (e.g. /channel/UC...)
  if (url.includes("/channel/")) {
    const match = url.match(/\/channel\/([^/?#&]+)/);
    if (match) {
      return `https://www.youtube.com/embed/live_stream?channel=${match[1]}&autoplay=1&mute=0&rel=0`;
    }
  }

  // 3. Check if it is a channel ID string directly (starts with UC and is 24 chars)
  if (/^UC[A-Za-z0-9_-]{22}$/.test(url)) {
    return `https://www.youtube.com/embed/live_stream?channel=${url}&autoplay=1&mute=0&rel=0`;
  }

  // 4. Otherwise, extract the standard video ID
  const videoId = getYouTubeId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0`;
  }

  return url;
}

function clearEmbedWatchdog() {
  if (embedWatchdogTimer) {
    clearTimeout(embedWatchdogTimer);
    embedWatchdogTimer = null;
  }
  if (embedCountdownInterval) {
    clearInterval(embedCountdownInterval);
    embedCountdownInterval = null;
  }
  const $status = document.querySelector(".embed-server-status");
  if ($status) {
    $status.classList.add("hidden");
  }
}

function startEmbedWatchdog(ch) {
  clearEmbedWatchdog();
  userInteractedWithEmbed = false;
  embedWatchdogSecondsLeft = EMBED_LOAD_TIMEOUT_SECONDS;

  const streams = getStreams(ch);
  if (streams.length <= 1) return;

  const $status = document.querySelector(".embed-server-status");
  if ($status) {
    $status.classList.remove("hidden");
  }

  // Start the 1-second countdown interval
  embedCountdownInterval = setInterval(() => {
    embedWatchdogSecondsLeft--;
    const $countdown = document.querySelector(".embed-countdown");
    if ($countdown) {
      $countdown.textContent = embedWatchdogSecondsLeft;
    }

    if (embedWatchdogSecondsLeft <= 0) {
      clearInterval(embedCountdownInterval);
      embedCountdownInterval = null;
    }
  }, 1000);

  // Start the fallback trigger timeout
  embedWatchdogTimer = setTimeout(() => {
    if (userInteractedWithEmbed) return;

    if (activeStreamIdx + 1 < streams.length) {
      const nextIdx = activeStreamIdx + 1;
      toast(
        `Server ${activeStreamIdx + 1} did not respond. Auto-switching to Server ${nextIdx + 1}...`,
      );
      activeStreamIdx = nextIdx;
      loadChannel(ch.id, nextIdx);
    } else {
      clearEmbedWatchdog();
      showLoad(false);
      showErr("All backup streams failed to respond.");
      markChannelOffline(ch.id);
    }
  }, EMBED_LOAD_TIMEOUT_SECONDS * 1000);
}

function renderEmbedServerSelector(ch) {
  // First, remove any existing selector
  const $existing = document.querySelector(".embed-server-selector");
  if ($existing) $existing.remove();

  if (!ch || !ch.isEmbed) return;

  const streams = getStreams(ch);
  if (streams.length <= 1) return;

  const $selector = document.createElement("div");
  $selector.className = "embed-server-selector";

  // Build dropdown items
  let dropdownItems = "";
  streams.forEach((s, idx) => {
    const isActive = idx === activeStreamIdx;
    dropdownItems += `<div class="dropdown-item${isActive ? " active" : ""}" data-index="${idx}">${s.label}</div>`;
  });

  $selector.innerHTML = `
    <button class="embed-server-toggle" title="Switch server">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
      <span class="server-badge">${streams.length}</span>
    </button>
    <div class="embed-server-dropdown hidden">
      <div class="dropdown-label">Servers</div>
      ${dropdownItems}
    </div>
  `;

  const $stage = document.querySelector(".stage");
  if ($stage) {
    $stage.appendChild($selector);
  }

  const $toggle = $selector.querySelector(".embed-server-toggle");
  const $dropdown = $selector.querySelector(".embed-server-dropdown");

  // Toggle dropdown on icon click
  $toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    $dropdown.classList.toggle("hidden");
  });

  // Close dropdown when clicking outside
  const closeDropdown = (e) => {
    if (!$selector.contains(e.target)) {
      $dropdown.classList.add("hidden");
    }
  };
  document.addEventListener("click", closeDropdown);

  // Hook up dropdown item events
  $dropdown.querySelectorAll(".dropdown-item").forEach(($item) => {
    $item.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt($item.getAttribute("data-index"), 10);
      if (idx === activeStreamIdx) return;

      clearEmbedWatchdog();
      activeStreamIdx = idx;
      $dropdown.classList.add("hidden");
      loadChannel(ch.id, idx);
    });
  });

  const $cancelBtn = $selector.querySelector(".embed-cancel-btn");
  if ($cancelBtn) {
    $cancelBtn.addEventListener("click", () => {
      clearEmbedWatchdog();
      toast("Auto-switching cancelled");
    });
  }
}

async function fetchStreamAndMount(source, streamId, title, streamIdx) {
  const $embedPlayer = document.getElementById("embed-player");
  const $stage = document.querySelector(".stage");
  
  try {
    const res = await fetch(`https://streamed.pk/api/stream/${source}/${streamId}`);
    if (!res.ok) throw new Error("Failed to fetch stream details");
    const streamList = await res.json();
    
    if (!streamList || streamList.length === 0) {
      throw new Error("No streams returned by API");
    }

    // Determine active stream index if not specified
    let selectedIdx = 0;
    if (streamIdx !== undefined && streamIdx !== null && streamIdx >= 0 && streamIdx < streamList.length) {
      selectedIdx = streamIdx;
    } else {
      // Prefer English language or HD streams
      let preferredStream = streamList.find(s => s.language?.toLowerCase() === 'english') ||
                            streamList.find(s => s.hd === true || s.hd === 'true') ||
                            streamList[0];
      selectedIdx = streamList.indexOf(preferredStream);
      if (selectedIdx === -1) selectedIdx = 0;
    }

    activeStreamIdx = selectedIdx; // Sync activeStreamIdx

    const selectedStream = streamList[selectedIdx];
    if (!selectedStream || !selectedStream.embedUrl) {
      throw new Error("No playable embedUrl found in stream details");
    }

    const embedUrl = selectedStream.embedUrl;

    if ($embedPlayer) {
      $embedPlayer.setAttribute("scrolling", "no");
      $embedPlayer.setAttribute("marginheight", "0");
      $embedPlayer.setAttribute("marginwidth", "0");
      $embedPlayer.setAttribute("frameborder", "0");
      $embedPlayer.src = embedUrl;
      $embedPlayer.classList.remove("hidden");
    }
    if ($stage) $stage.classList.add("is-embed");

    // Update typography
    $npName.textContent = title;
    $ctrlChName.textContent = title;

    if (streamList.length > 1) {
      renderDynamicEmbedServerSelector(streamList, title, source, streamId);
    } else {
      const $existing = document.querySelector(".embed-server-selector");
      if ($existing) $existing.remove();
    }

    showLoad(false);
    hideErr();
  } catch (err) {
    console.error("Error mounting dynamic match stream:", err);
    showLoad(false);
    showErr("Dynamic stream unavailable");
    const $existing = document.querySelector(".embed-server-selector");
    if ($existing) $existing.remove();
  }
}

async function fetchFirstLiveMatch(id, streamIdx) {
  try {
    const res = await fetch("https://streamed.pk/api/matches/live");
    if (!res.ok) throw new Error("Failed to fetch live matches");
    const matches = await res.json();
    const liveSports = matches.filter(
      (m) => (m.category === "football" || m.category === "motor-sports" || m.category === "cricket") && m.sources && m.sources.length > 0 && isPopularMatch(m)
    ).sort(sortPopularMatches);

    if (liveSports.length === 0) {
      throw new Error("No popular live matches available");
    }

    const match = liveSports[0];
    const source = match.sources[0].source;
    const streamId = match.sources[0].id;
    const title = match.title;

    window.clickedCard = {
      dataset: {
        streamSource: source,
        streamId: streamId,
        matchTitle: title,
        id: id
      }
    };

    $npName.textContent = title;
    $ctrlChName.textContent = title;

    fetchStreamAndMount(source, streamId, title, streamIdx);
  } catch (err) {
    console.error("Error fetching fallback live match:", err);
    showLoad(false);
    showErr("No live matches available");
  }
}

async function fetchLiveMatchByCategory(category, channelId, streamIdx) {
  try {
    const res = await fetch("https://streamed.pk/api/matches/all");
    if (!res.ok) throw new Error("Failed to fetch matches");
    const matches = await res.json();

    const now = Date.now();
    const liveSports = matches.filter((m) => {
      if (m.category !== category) return false;
      const hasSources = m.sources && m.sources.length > 0;
      
      const hoursSinceStart = (now - m.date) / (1000 * 60 * 60);
      let maxHours = 3;
      if (m.category === "cricket") maxHours = 8;
      if (m.category === "motor-sports") maxHours = 5;

      const isLive = hoursSinceStart >= -1.5 && hoursSinceStart <= maxHours;
      return hasSources && isLive && isPopularMatch(m);
    }).sort(sortPopularMatches);

    if (liveSports.length === 0) {
      const categoryLabel = category === "football" 
        ? "FIFA/Football" 
        : (category === "motor-sports" ? "F1" : category.toUpperCase());
      throw new Error(`No popular live ${categoryLabel} matches currently running`);
    }

    const match = liveSports[0];
    const source = match.sources[0].source;
    const streamId = match.sources[0].id;
    const title = match.title;

    // Push state redirecting the clean alias URL to the specific match URL
    const categorySlug = "sports";
    const cleanPath = `/${categorySlug}/live_${source}_${streamId}`;
    window.history.replaceState({ channelId: `live_${source}_${streamId}` }, "", cleanPath);
    
    // Set up activeId to the specific stream ID so other controls work
    activeId = `live_${source}_${streamId}`;

    $npName.textContent = title;
    $ctrlChName.textContent = title;

    fetchStreamAndMount(source, streamId, title, streamIdx);
  } catch (err) {
    console.error(`Error fetching live match for category ${category}:`, err);
    showLoad(false);
    showErr(err.message || "Live match unavailable");
  }
}

function renderDynamicEmbedServerSelector(streamList, title, source, streamId) {
  // First, remove any existing selector
  const $existing = document.querySelector(".embed-server-selector");
  if ($existing) $existing.remove();

  const $selector = document.createElement("div");
  $selector.className = "embed-server-selector";

  // Build dropdown items
  let dropdownItems = "";
  streamList.forEach((s, idx) => {
    const isActive = idx === activeStreamIdx;
    const streamNo = s.streamNo || (idx + 1);
    const quality = (s.hd === true || s.hd === "true") ? "HD" : "SD";
    const lang = s.language ? ` • ${s.language}` : "";
    const label = `Server ${streamNo} (${quality}${lang})`;
    dropdownItems += `<div class="dropdown-item${
      isActive ? " active" : ""
    }" data-index="${idx}">${label}</div>`;
  });

  $selector.innerHTML = `
    <button class="embed-server-toggle" title="Switch server">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
      <span class="server-badge">${streamList.length}</span>
    </button>
    <div class="embed-server-dropdown hidden">
      <div class="dropdown-label">Servers</div>
      ${dropdownItems}
    </div>
  `;

  const $stage = document.querySelector(".stage");
  if ($stage) {
    $stage.appendChild($selector);
  }

  const $toggle = $selector.querySelector(".embed-server-toggle");
  const $dropdown = $selector.querySelector(".embed-server-dropdown");

  // Toggle dropdown on icon click
  $toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    $dropdown.classList.toggle("hidden");
  });

  // Close dropdown when clicking outside
  const closeDropdown = (e) => {
    if (!$selector.contains(e.target)) {
      $dropdown.classList.add("hidden");
    }
  };
  document.addEventListener("click", closeDropdown);

  // Hook up dropdown item events
  $dropdown.querySelectorAll(".dropdown-item").forEach(($item) => {
    $item.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt($item.getAttribute("data-index"), 10);
      if (idx === activeStreamIdx) return;

      activeStreamIdx = idx;
      $dropdown.classList.add("hidden");
      showLoad(true);
      fetchStreamAndMount(source, streamId, title, idx);
    });
  });
}

// Listen to window blur to check if the user clicked/focused the iframe
window.addEventListener("blur", () => {
  if (isEmbedActive && !userInteractedWithEmbed) {
    setTimeout(() => {
      const $embedPlayer = document.getElementById("embed-player");
      if ($embedPlayer && document.activeElement === $embedPlayer) {
        userInteractedWithEmbed = true;
        clearEmbedWatchdog();
        toast("Interacted with stream player. Auto-switch disabled.");
      }
    }, 100);
  }
});
