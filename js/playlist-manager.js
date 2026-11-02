/* ==========================================
   playlist-manager.js — Custom M3U & Playlist Importer
   ========================================== */

const STORAGE_KEY_CUSTOM_PLAYLIST = "t9_custom_playlist";
const STORAGE_KEY_PLAYLIST_META = "t9_playlist_meta";

const PUBLIC_PRESETS = [
  {
    id: "eng",
    name: "English Worldwide",
    icon: "🌍",
    meta: "Official global English channels",
    url: "https://iptv-org.github.io/iptv/languages/eng.m3u"
  },
  {
    id: "news",
    name: "World News",
    icon: "📰",
    meta: "24/7 Global news channels",
    url: "https://iptv-org.github.io/iptv/categories/news.m3u"
  },
  {
    id: "sports",
    name: "Sports Highlights",
    icon: "⚽",
    meta: "Public sports & outdoor channels",
    url: "https://iptv-org.github.io/iptv/categories/sports.m3u"
  },
  {
    id: "movies",
    name: "Movies & Cinema",
    icon: "🎬",
    meta: "Free movie & series streams",
    url: "https://iptv-org.github.io/iptv/categories/movies.m3u"
  },
  {
    id: "music",
    name: "Music & Radio",
    icon: "🎵",
    meta: "Live music channels & festivals",
    url: "https://iptv-org.github.io/iptv/categories/music.m3u"
  },
  {
    id: "kids",
    name: "Kids & Animation",
    icon: "👶",
    meta: "Cartoons & educational TV",
    url: "https://iptv-org.github.io/iptv/categories/animation.m3u"
  }
];

// ── Parse M3U Text into TRIONINE CHANNELS_DATA structure
function parseM3UContent(text, playlistName = "Custom Playlist") {
  if (!text || typeof text !== "string") return null;

  const lines = text.split(/\r?\n/);
  const categoriesMap = new Map();
  let currentMeta = null;
  let totalChannels = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith("#EXTINF:")) {
      const info = line.substring(8);
      const titleMatch = info.match(/,(.+)$/);
      const title = titleMatch ? titleMatch[1].trim() : `Channel ${totalChannels + 1}`;

      const groupMatch = info.match(/group-title="([^"]*)"/i);
      const category = (groupMatch && groupMatch[1].trim()) || "General";

      const logoMatch = info.match(/tvg-logo="([^"]*)"/i);
      const logo = (logoMatch && logoMatch[1].trim()) || "";

      const idMatch = info.match(/tvg-id="([^"]*)"/i);
      const rawId = (idMatch && idMatch[1].trim()) || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, "") || `ch-${totalChannels + 1}`;

      currentMeta = {
        id: cleanId,
        name: title,
        shortName: title.substring(0, 4).toUpperCase(),
        logo: logo,
        category: category
      };
    } else if (!line.startsWith("#") && currentMeta) {
      const streamUrl = line;
      if (streamUrl.startsWith("http://") || streamUrl.startsWith("https://")) {
        totalChannels++;
        const cat = currentMeta.category;
        if (!categoriesMap.has(cat)) {
          categoriesMap.set(cat, []);
        }

        const uniqueId = `${currentMeta.id}-${totalChannels}`;
        categoriesMap.get(cat).push({
          id: uniqueId,
          name: currentMeta.name,
          shortName: currentMeta.shortName,
          logo: currentMeta.logo,
          stream: streamUrl,
          category: cat
        });
      }
      currentMeta = null;
    }
  }

  if (totalChannels === 0) return null;

  const categories = [];
  categoriesMap.forEach((channelList, catName) => {
    categories.push({
      name: catName,
      channels: channelList
    });
  });

  return {
    name: playlistName,
    channelCount: totalChannels,
    categories: categories
  };
}

// ── Apply Playlist to App
function applyPlaylistData(catalogData, metaInfo) {
  if (!catalogData || !catalogData.categories || catalogData.categories.length === 0) return false;

  window.CHANNELS_DATA = catalogData;

  // Persist if custom
  if (metaInfo && metaInfo.isCustom) {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_PLAYLIST, JSON.stringify(catalogData));
      localStorage.setItem(STORAGE_KEY_PLAYLIST_META, JSON.stringify(metaInfo));
    } catch (e) {
      console.warn("Storage quota exceeded when saving playlist:", e);
    }
    document.body.classList.add("has-custom-playlist");
  } else {
    localStorage.removeItem(STORAGE_KEY_CUSTOM_PLAYLIST);
    localStorage.removeItem(STORAGE_KEY_PLAYLIST_META);
    document.body.classList.remove("has-custom-playlist");
  }

  // Refresh UI
  if (typeof initChannels === "function") initChannels();
  if (typeof buildGuideCategoryNavigation === "function") buildGuideCategoryNavigation();
  if (typeof initHomePage === "function") initHomePage();
  if (typeof updateChannelCount === "function") updateChannelCount();

  updatePlaylistStatusUI();
  return true;
}

// ── Restore Custom Playlist on Page Load
function checkSavedCustomPlaylist() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_PLAYLIST);
    const meta = localStorage.getItem(STORAGE_KEY_PLAYLIST_META);
    if (saved) {
      const parsed = JSON.parse(saved);
      const parsedMeta = meta ? JSON.parse(meta) : { isCustom: true, name: "Custom Playlist" };
      applyPlaylistData(parsed, parsedMeta);
      console.log(`[Playlist] Loaded custom playlist: ${parsedMeta.name} (${parsedMeta.count || "?"} channels)`);
      return true;
    }
  } catch (err) {
    console.error("[Playlist] Failed to restore custom playlist:", err);
  }
  return false;
}

// ── Reset to Default Channels
function resetToDefaultPlaylist() {
  if (window.DEFAULT_CHANNELS_DATA) {
    applyPlaylistData(window.DEFAULT_CHANNELS_DATA, { isCustom: false, name: "Default Curated" });
    if (typeof toast === "function") toast("Reset to default curated channels");
    closePlaylistModal();
  }
}

// ── Fetch and Load M3U by URL
async function loadM3UFromUrl(url, playlistName) {
  if (!url) return;
  showPlaylistLoading(true, "Downloading playlist...");

  try {
    const res = await fetch(url, { headers: { Accept: "audio/x-mpegurl, application/x-mpegurl, text/plain, */*" } });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const text = await res.text();

    showPlaylistLoading(true, "Parsing channels...");
    const parsed = parseM3UContent(text, playlistName || "Custom URL Playlist");

    if (!parsed || parsed.channelCount === 0) {
      throw new Error("No playable channels found in this playlist.");
    }

    applyPlaylistData(parsed, {
      isCustom: true,
      name: playlistName || "Custom URL Playlist",
      count: parsed.channelCount,
      url: url,
      loadedAt: new Date().toLocaleDateString()
    });

    if (typeof toast === "function") {
      toast(`Loaded ${parsed.channelCount} channels from playlist!`);
    }
    closePlaylistModal();
  } catch (err) {
    alert("Error loading playlist: " + err.message);
  } finally {
    showPlaylistLoading(false);
  }
}

// ── Load M3U from local file
function loadM3UFromFile(file) {
  if (!file) return;
  showPlaylistLoading(true, `Reading ${file.name}...`);

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target.result;
      showPlaylistLoading(true, "Parsing channels...");
      const parsed = parseM3UContent(text, file.name);

      if (!parsed || parsed.channelCount === 0) {
        throw new Error("No playable channels found in file.");
      }

      applyPlaylistData(parsed, {
        isCustom: true,
        name: file.name,
        count: parsed.channelCount,
        loadedAt: new Date().toLocaleDateString()
      });

      if (typeof toast === "function") {
        toast(`Loaded ${parsed.channelCount} channels from ${file.name}!`);
      }
      closePlaylistModal();
    } catch (err) {
      alert("Error parsing file: " + err.message);
    } finally {
      showPlaylistLoading(false);
    }
  };
  reader.onerror = () => {
    showPlaylistLoading(false);
    alert("Could not read file.");
  };
  reader.readAsText(file);
}

// ── UI Modal Creation & Event Wiring
function injectPlaylistModal() {
  if (document.getElementById("playlist-modal-backdrop")) return;

  const backdrop = document.createElement("div");
  backdrop.id = "playlist-modal-backdrop";
  backdrop.className = "playlist-modal-backdrop";
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");
  backdrop.setAttribute("aria-label", "Playlist Manager");

  backdrop.innerHTML = `
    <div class="playlist-modal" id="playlist-modal">
      <div class="pm-header">
        <div class="pm-header-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 6h16M4 12h16M4 18h10"></path>
          </svg>
          <span>Playlist Manager</span>
        </div>
        <button class="pm-close-btn focusable" id="pm-close-btn" aria-label="Close modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="pm-tabs" role="tablist">
        <button class="pm-tab-btn is-active focusable" data-tab="presets" role="tab">Public Presets</button>
        <button class="pm-tab-btn focusable" data-tab="url" role="tab">From URL</button>
        <button class="pm-tab-btn focusable" data-tab="upload" role="tab">Upload .M3U File</button>
      </div>

      <div class="pm-body">
        <div class="pm-status-banner" id="pm-status-banner">
          <div class="pm-status-info">
            <span class="pm-status-label" id="pm-status-label">Default Curated Catalog</span>
            <span id="pm-status-sub" style="font-size: 0.72rem; color: #8fa0b5;">Standard permanent channels active</span>
          </div>
          <button class="pm-reset-btn focusable" id="pm-btn-reset">Reset to Default</button>
        </div>

        <!-- Presets Tab -->
        <div class="pm-tab-pane is-active" id="tab-presets">
          <p class="pm-hint">Select a 24/7 community-maintained playlist from the open-source <strong>iptv-org</strong> library:</p>
          <div class="pm-presets-grid" id="pm-presets-grid">
            ${PUBLIC_PRESETS.map((p) => `
              <div class="pm-preset-card focusable" tabindex="0" data-preset-id="${p.id}" data-url="${p.url}" data-name="${p.name}">
                <div class="pm-preset-icon">${p.icon}</div>
                <div class="pm-preset-name">${p.name}</div>
                <div class="pm-preset-meta">${p.meta}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- URL Tab -->
        <div class="pm-tab-pane" id="tab-url">
          <div class="pm-form-group">
            <label class="pm-label" for="pm-input-url">M3U / M3U8 Playlist URL</label>
            <input type="url" class="pm-input focusable" id="pm-input-url" placeholder="https://example.com/playlist.m3u" autocomplete="off" />
          </div>
          <p class="pm-hint">Enter any direct M3U URL from your IPTV provider, GitHub, or Pastebin.</p>
          <button class="pm-primary-btn focusable" id="pm-btn-load-url">
            <span>Load Playlist</span>
          </button>
        </div>

        <!-- Upload Tab -->
        <div class="pm-tab-pane" id="tab-upload">
          <div class="pm-dropzone focusable" id="pm-dropzone" tabindex="0">
            <input type="file" id="pm-file-input" accept=".m3u,.m3u8,text/plain" style="display:none;" />
            <svg class="pm-dropzone-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span class="pm-dropzone-text">Click or drag & drop .m3u file</span>
            <span class="pm-dropzone-sub">Supports standard M3U & M3U8 playlist files</span>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  wirePlaylistModalEvents(backdrop);
}

function wirePlaylistModalEvents(backdrop) {
  const closeBtn = document.getElementById("pm-close-btn");
  if (closeBtn) closeBtn.addEventListener("click", closePlaylistModal);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closePlaylistModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("is-open")) {
      closePlaylistModal();
    }
  });

  // Tab switching
  const tabBtns = backdrop.querySelectorAll(".pm-tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("is-active"));
      backdrop.querySelectorAll(".pm-tab-pane").forEach((p) => p.classList.remove("is-active"));
      btn.classList.add("is-active");
      const targetId = `tab-${btn.dataset.tab}`;
      const pane = document.getElementById(targetId);
      if (pane) pane.classList.add("is-active");
    });
  });

  // Presets click
  const presetCards = backdrop.querySelectorAll(".pm-preset-card");
  presetCards.forEach((card) => {
    const handleSelect = () => {
      const url = card.dataset.url;
      const name = card.dataset.name;
      loadM3UFromUrl(url, name);
    };
    card.addEventListener("click", handleSelect);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect();
      }
    });
  });

  // URL submit
  const loadUrlBtn = document.getElementById("pm-btn-load-url");
  const urlInput = document.getElementById("pm-input-url");
  if (loadUrlBtn && urlInput) {
    loadUrlBtn.addEventListener("click", () => {
      const url = urlInput.value.trim();
      if (!url) {
        alert("Please enter a valid M3U URL.");
        return;
      }
      loadM3UFromUrl(url);
    });
    urlInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        loadUrlBtn.click();
      }
    });
  }

  // Upload dropzone
  const dropzone = document.getElementById("pm-dropzone");
  const fileInput = document.getElementById("pm-file-input");
  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());
    dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInput.click();
      }
    });
    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        loadM3UFromFile(e.target.files[0]);
      }
    });

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("is-dragover");
    });
    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("is-dragover");
    });
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("is-dragover");
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        loadM3UFromFile(e.dataTransfer.files[0]);
      }
    });
  }

  // Reset button
  const resetBtn = document.getElementById("pm-btn-reset");
  if (resetBtn) resetBtn.addEventListener("click", resetToDefaultPlaylist);
}

function updatePlaylistStatusUI() {
  const label = document.getElementById("pm-status-label");
  const sub = document.getElementById("pm-status-sub");
  const resetBtn = document.getElementById("pm-btn-reset");
  const rawMeta = localStorage.getItem(STORAGE_KEY_PLAYLIST_META);

  if (rawMeta && label && sub) {
    try {
      const meta = JSON.parse(rawMeta);
      label.textContent = `Custom: ${meta.name}`;
      sub.textContent = `${meta.count || "?"} channels loaded • ${meta.loadedAt || "Active"}`;
      if (resetBtn) resetBtn.style.display = "block";
      return;
    } catch (e) {}
  }

  if (label) label.textContent = "Default Curated Catalog";
  if (sub) sub.textContent = "Permanent 24/7 channels active";
  if (resetBtn) resetBtn.style.display = "none";
}

function showPlaylistLoading(isLoading, message = "") {
  const loadBtn = document.getElementById("pm-btn-load-url");
  if (loadBtn) {
    loadBtn.disabled = isLoading;
    loadBtn.textContent = isLoading ? (message || "Loading...") : "Load Playlist";
  }
}

function openPlaylistModal() {
  injectPlaylistModal();
  updatePlaylistStatusUI();
  const backdrop = document.getElementById("playlist-modal-backdrop");
  if (backdrop) {
    backdrop.classList.add("is-open");
    const activeTabBtn = backdrop.querySelector(".pm-tab-btn.is-active");
    if (activeTabBtn) activeTabBtn.focus();
  }
}

function closePlaylistModal() {
  const backdrop = document.getElementById("playlist-modal-backdrop");
  if (backdrop) backdrop.classList.remove("is-open");
}

// Auto-run on script load
document.addEventListener("DOMContentLoaded", () => {
  injectPlaylistModal();
  checkSavedCustomPlaylist();
});
