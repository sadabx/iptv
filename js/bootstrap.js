/* ==========================================
   bootstrap.js — App startup, event wiring, routing, and integration bootstrap
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
  $srvBtn = document.getElementById("ctrl-srv");
  $srvLabel = document.getElementById("srv-label");
  $srvMenu = document.getElementById("srv-menu");

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
  const $chScroll = document.getElementById("ch-list").parentElement; // .ch-scroll
  const $chat = document.getElementById("chat");

  // Restore sidebar scroll position
  if ($chScroll) {
    const savedScroll = sessionStorage.getItem("iptv-sidebar-scroll");
    if (savedScroll) $chScroll.scrollTop = parseInt(savedScroll, 10);
    $chScroll.addEventListener(
      "scroll",
      () => {
        sessionStorage.setItem(
          "iptv-sidebar-scroll",
          $chScroll.scrollTop.toString(),
        );
      },
      { passive: true },
    );
  }
  $btnSB = document.getElementById("btn-sidebar");
  const $btnChat = document.getElementById("btn-chat");
  const $ctrlChat = document.getElementById("ctrl-chat");
  $backdrop = document.getElementById("guide-backdrop");
  const $mobileTabHome = document.getElementById("mobile-tab-home");
  const $mobileTabChannels = document.getElementById("mobile-tab-channels");
  const $mobileTabSearch = document.getElementById("mobile-tab-search");
  const $mobileTabChat = document.getElementById("mobile-tab-chat");

  function setMobileTabActive(tabName) {
    if (tabName === "chat" && !document.body.classList.contains("is-watching")) {
      tabName = "home";
    }
    document.querySelectorAll(".mobile-tabbar-btn").forEach((button) => {
      button.classList.toggle("is-active", button.id === `mobile-tab-${tabName}`);
    });
  }

  function canUseChat() {
    return document.body.classList.contains("is-watching");
  }

  function isMobileLayout() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function toggleChatPanel() {
    if (!canUseChat()) {
      toast("Chat is available while streaming", 1200);
      setMobileTabActive("home");
      return;
    }

    if (typeof initLiveChat === "function") initLiveChat();
    $chat.classList.toggle("closed");
    const isOpen = !$chat.classList.contains("closed");
    $btnChat?.classList.toggle("on", isOpen);
    $ctrlChat?.classList.toggle("on", isOpen);
    document.body.classList.toggle("chat-open", isOpen);
    if (isOpen) setGuideOpen(false);
    setMobileTabActive(isOpen ? "chat" : document.body.classList.contains("is-watching") ? "channels" : "home");
  }

  // Chat is hidden by default — mark button as "closed"
  $chat.classList.add("closed");

  setGuideOpen = function (open) {
    $sidebar.classList.toggle("closed", !open);
    $btnSB.classList.toggle("on", open);
    if ($backdrop) $backdrop.classList.toggle("show", open);
    if (open && typeof showGuideCategories === "function" && !$search.value) {
      showGuideCategories();
    }
    if (open) setMobileTabActive(document.body.classList.contains("guide-searching") ? "search" : "channels");
    else if (!$chat || $chat.classList.contains("closed")) setMobileTabActive(document.body.classList.contains("is-watching") ? "channels" : "home");
  };

  // Live guide toggle
  $btnSB.addEventListener("click", () =>
    setGuideOpen($sidebar.classList.contains("closed")),
  );
  document.querySelector("[data-rail-home]")?.addEventListener("click", () => {
    showHomePage();
    setGuideOpen(false);
    setMobileTabActive("home");
  });
  document.querySelector("[data-rail-search]")?.addEventListener("click", () => {
    setGuideOpen(false);
    if (typeof showGuideSearchResults === "function") showGuideSearchResults();
    if (typeof renderFloatingSearchResults === "function") renderFloatingSearchResults($search?.value || "");
    setMobileTabActive("search");
    requestAnimationFrame(() => $search?.focus());
  });
  document.getElementById("guide-back")?.addEventListener("click", () => {
    if ($search && $search.value) {
      $search.value = "";
      document.getElementById("search-clear")?.classList.add("hidden");
      onSearch({ target: $search });
      return;
    }
    if (typeof showGuideCategories === "function") showGuideCategories();
  });
  if ($backdrop) $backdrop.addEventListener("click", () => setGuideOpen(false));
  document.querySelector(".mobile-browse-sheet")?.addEventListener("click", (event) => {
    if (!event.target.closest(".mobile-browse-shell") && typeof setMobileBrowseSheetOpen === "function") {
      setMobileBrowseSheetOpen(false);
      setMobileTabActive(document.body.classList.contains("is-watching") ? "channels" : "home");
    }
  });
  document.getElementById("mobile-browse-close")?.addEventListener("click", () => {
    if (typeof setMobileBrowseSheetOpen === "function") setMobileBrowseSheetOpen(false);
    setMobileTabActive(document.body.classList.contains("is-watching") ? "channels" : "home");
  });
  document.querySelector(".floating-search")?.addEventListener("click", (event) => {
    if (!event.target.closest(".floating-search-shell") && typeof closeFloatingSearch === "function") {
      closeFloatingSearch(false);
      setMobileTabActive(document.body.classList.contains("is-watching") ? "channels" : "home");
    }
  });
  document.getElementById("search-overlay-close")?.addEventListener("click", () => {
    if (typeof closeFloatingSearch === "function") closeFloatingSearch(false);
    setMobileTabActive(document.body.classList.contains("is-watching") ? "channels" : "home");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !document.body.classList.contains("mobile-browse-open")) return;
    event.preventDefault();
    if (typeof setMobileBrowseSheetOpen === "function") setMobileBrowseSheetOpen(false);
    setMobileTabActive(document.body.classList.contains("is-watching") ? "channels" : "home");
  });
  setGuideOpen(false);

  // Chat toggle
  $btnChat.addEventListener("click", () => {
    toggleChatPanel();
    toast($chat.classList.contains("closed") ? "Chat closed" : "Chat opened", 1000);
  });

  $ctrlChat?.addEventListener("click", () => {
    toggleChatPanel();
    toast($chat.classList.contains("closed") ? "Chat closed" : "Chat opened", 1000);
  });

  $mobileTabHome?.addEventListener("click", () => {
    showHomePage();
    setGuideOpen(false);
    if (typeof setMobileBrowseSheetOpen === "function") setMobileBrowseSheetOpen(false);
    if (!$chat.classList.contains("closed")) {
      $chat.classList.add("closed");
      $btnChat.classList.remove("on");
      $ctrlChat?.classList.remove("on");
      document.body.classList.remove("chat-open");
    }
    setMobileTabActive("home");
  });

  $mobileTabChannels?.addEventListener("click", () => {
    if (isMobileLayout() && typeof setMobileBrowseSheetOpen === "function") {
      setGuideOpen(false);
      if (typeof closeFloatingSearch === "function") closeFloatingSearch(false);
      setMobileBrowseSheetOpen(true);
      setMobileTabActive("channels");
      return;
    }

    setGuideOpen(true);
    if (typeof showGuideCategories === "function") showGuideCategories();
    setMobileTabActive("channels");
  });

  $mobileTabSearch?.addEventListener("click", () => {
    setGuideOpen(false);
    if (typeof setMobileBrowseSheetOpen === "function") setMobileBrowseSheetOpen(false);
    if (typeof showGuideSearchResults === "function") showGuideSearchResults();
    if (typeof renderFloatingSearchResults === "function") renderFloatingSearchResults($search?.value || "");
    setMobileTabActive("search");
    requestAnimationFrame(() => $search?.focus());
  });

  $mobileTabChat?.addEventListener("click", () => {
    toggleChatPanel();
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

  const $volWrap = $btnMute.parentElement;
  if ($volWrap && $volWrap.classList.contains("vol-wrap")) {
    $volWrap.addEventListener("wheel", (e) => {
      if (typeof isEmbedActive !== 'undefined' && isEmbedActive) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      adjustVolume(delta);
    }, { passive: false });
  }
  document.getElementById("ctrl-live").addEventListener("click", () => {
    jumpToLive();
    toast("Jumped to live");
  });
  document
    .getElementById("ctrl-fs")
    .addEventListener("click", toggleFullscreen);

  const $retryBtn =
    document.getElementById("err-retry") ||
    document.getElementById("retry-btn");
  if ($retryBtn) {
    $retryBtn.addEventListener("click", () => {
      retryStream();
      toast("Retrying...", 1000);
    });
  }

  // Error bar action buttons
  document.getElementById("err-retry")?.addEventListener("click", () => {
    retryStream();
    toast("Retrying...", 1000);
  });

  document.getElementById("err-next-server")?.addEventListener("click", () => {
    if (!activeId) return;
    const ch = findChannel(activeId);
    if (ch) {
      const streams = getStreams(ch);
      if (activeStreamIdx + 1 < streams.length) {
        const nextIdx = activeStreamIdx + 1;
        toast(`Switching to ${streams[nextIdx].label}...`, 1500);
        loadChannel(activeId, nextIdx);
      } else {
        toast("No backup servers available", 1500);
      }
    }
  });

  document.getElementById("err-proxy")?.addEventListener("click", () => {
    const currentProxy =
      localStorage.getItem("iptv-proxy-url") || DEFAULT_PROXY_URL;
    const newProxy = prompt(
      "Enter proxy URL (leave empty to disable):",
      currentProxy,
    );
    if (newProxy !== null) {
      if (newProxy.trim()) {
        localStorage.setItem("iptv-proxy-url", newProxy.trim());
        toast("Proxy updated. Retrying...", 1500);
      } else {
        localStorage.removeItem("iptv-proxy-url");
        toast("Proxy disabled. Retrying...", 1500);
      }
      retryStream();
    }
  });

  // Quality picker toggle
  if ($qualBtn) {
    $qualBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      $qualMenu.classList.toggle("hidden");
      if ($srvMenu) $srvMenu.classList.add("hidden");
      if (!$qualMenu.classList.contains("hidden")) {
        requestAnimationFrame(() => $qualMenu.querySelector(".qual-item")?.focus({ preventScroll: true }));
      }
    });
    document.addEventListener("click", () => $qualMenu.classList.add("hidden"));
  }

  // Server picker toggle
  if ($srvBtn) {
    $srvBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      $srvMenu.classList.toggle("hidden");
      if ($qualMenu) $qualMenu.classList.add("hidden");
      if (!$srvMenu.classList.contains("hidden")) {
        requestAnimationFrame(() => $srvMenu.querySelector(".qual-item")?.focus({ preventScroll: true }));
      }
    });
    document.addEventListener("click", () => $srvMenu.classList.add("hidden"));
  }

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

  const remoteFocusableSelector = [
    ".focusable",
    ".home-ch-card",
    ".ch-item",
    ".wm-card",
    ".carousel-nav-btn",
    ".ctrl-btn",
    ".ctrl-live-btn",
    ".ctrl-qual-btn",
    ".qual-item",
    ".vol-slider",
    ".err-bar-btn",
    "button",
    "input",
  ].join(",");

  function disableRemoteFocusMode() {
    document.body.classList.remove("remote-nav-active");
  }

  function isRemoteFocusableVisible(el) {
    if (el.disabled || el.tabIndex < 0) return false;
    if (el.closest("[hidden], .hidden")) return false;
    if (el.closest(".yt-guide.closed") && !el.closest(".guide-rail")) return false;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") return false;
    if (el.offsetParent === null && style.position !== "fixed") return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function getRemoteFocusableElements() {
    return Array.from(
      document.querySelectorAll(remoteFocusableSelector),
    ).filter(isRemoteFocusableVisible);
  }

  function getInitialRemoteFocusTarget(elements) {
    const activeCard = activeId
      ? elements.find((el) => el.dataset.id === activeId)
      : null;
    if (activeCard) return activeCard;

    const mainCard = elements.find((el) =>
      el.matches(".home-ch-card, .wm-card"),
    );
    if (mainCard) return mainCard;

    const guideCard = elements.find((el) => el.matches(".ch-item"));
    return guideCard || elements[0];
  }

  function getAxisOverlap(a, b, axis) {
    if (axis === "x") {
      return Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    }
    return Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  }

  function getCenterDistance(a, b, axis) {
    const aCenter = axis === "x" ? a.left + a.width / 2 : a.top + a.height / 2;
    const bCenter = axis === "x" ? b.left + b.width / 2 : b.top + b.height / 2;
    return Math.abs(bCenter - aCenter);
  }

  function getDirectionalDistance(from, to, direction) {
    if (direction === "left") return from.left - to.right;
    if (direction === "right") return to.left - from.right;
    if (direction === "up") return from.top - to.bottom;
    return to.top - from.bottom;
  }

  function getDirectionalCenterDelta(from, to, direction) {
    const fromX = from.left + from.width / 2;
    const fromY = from.top + from.height / 2;
    const toX = to.left + to.width / 2;
    const toY = to.top + to.height / 2;
    if (direction === "left") return fromX - toX;
    if (direction === "right") return toX - fromX;
    if (direction === "up") return fromY - toY;
    return toY - fromY;
  }

  function getOrderedGroupItems(el) {
    const group = el.closest(".carousel-track, .wm-grid, .ch-scroll");
    if (!group) return [];
    return getRemoteFocusableElements().filter(
      (item) =>
        item.closest(".carousel-track, .wm-grid, .ch-scroll") === group,
    );
  }

  function getSequentialGroupTarget(current, direction) {
    if (!current.matches(".home-ch-card, .wm-card, .ch-item")) return null;
    const group = current.closest(".carousel-track, .wm-grid, .ch-scroll");
    const isHorizontalCarousel = group?.classList.contains("carousel-track");

    if (isHorizontalCarousel && direction !== "left" && direction !== "right") {
      return null;
    }

    const groupItems = getOrderedGroupItems(current);
    const currentIndex = groupItems.indexOf(current);
    if (currentIndex < 0) return null;

    if (direction === "right" || direction === "down") {
      return groupItems[currentIndex + 1] || null;
    }

    if (direction === "left" || direction === "up") {
      return groupItems[currentIndex - 1] || null;
    }

    return null;
  }

  function getHomeCategoryNameFromCard(card) {
    const section = card.closest(".home-section");
    const title = section?.querySelector(".yt-row-title");
    return title?.textContent.trim() || "";
  }

  function getHomeCardsForRailCategory(categoryName) {
    if (!categoryName) return [];
    const sections = Array.from(
      document.querySelectorAll("#stage-home .home-section"),
    );
    const section = sections.find((item) => {
      const title = item.querySelector(".yt-row-title");
      return title?.textContent.trim() === categoryName;
    });

    if (!section) return [];
    return Array.from(section.querySelectorAll(".home-ch-card")).filter(
      isRemoteFocusableVisible,
    );
  }

  function focusElementForRemote(el) {
    if (!el) return false;
    document.body.classList.add("remote-nav-active");
    el.focus({ preventScroll: true });
    scrollRemoteTargetIntoView(el);
    return true;
  }

  function focusRailCategoryFromHomeCard(card) {
    const categoryName = getHomeCategoryNameFromCard(card);
    const rowCards = getHomeCardsForRailCategory(categoryName);
    if (rowCards[0] !== card) return false;

    const railButton = Array.from(
      document.querySelectorAll(".guide-rail-category-btn"),
    ).find((button) => button.dataset.cat === categoryName);

    if (!railButton || !isRemoteFocusableVisible(railButton)) return false;
    return focusElementForRemote(railButton);
  }

  function scrollRemoteTargetIntoView(el) {
    const carousel = el.closest(".carousel-track");
    if (carousel && typeof carousel.scrollTo === "function") {
      carousel.scrollTo({
        left: el.offsetLeft - (carousel.clientWidth - el.offsetWidth) / 2,
        behavior: "smooth",
      });
    }

    const scrollArea = el.closest(".ch-scroll, .yt-browse");
    if (scrollArea && typeof scrollArea.scrollTo === "function") {
      const elRect = el.getBoundingClientRect();
      const scrollRect = scrollArea.getBoundingClientRect();
      scrollArea.scrollTo({
        top:
          scrollArea.scrollTop +
          elRect.top -
          scrollRect.top -
          (scrollRect.height - elRect.height) / 2,
        behavior: "smooth",
      });
    }

    if (!carousel) {
      el.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
    }

    const track = el.closest(".wm-grid");
    if (track && typeof track.scrollTo === "function") {
      const elRect = el.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const inlineOverflow =
        elRect.left < trackRect.left || elRect.right > trackRect.right;
      const blockOverflow =
        elRect.top < trackRect.top || elRect.bottom > trackRect.bottom;

      if (inlineOverflow) {
        track.scrollBy({
          left:
            elRect.left -
            trackRect.left -
            (trackRect.width - elRect.width) / 2,
          behavior: "smooth",
        });
      }

      if (blockOverflow) {
        track.scrollBy({
          top:
            elRect.top -
            trackRect.top -
            (trackRect.height - elRect.height) / 2,
          behavior: "smooth",
        });
      }
    }
  }

  function wakePlayerControls() {
    if (!$stage) return;
    $stage.classList.remove("idle");
    resetIdle();
  }

  function isPlayerControl(el) {
    return Boolean(el?.closest?.(".ctrl-bar"));
  }

  function getVisiblePlayerControls() {
    return Array.from(
      document.querySelectorAll(
        ".ctrl-bar .ctrl-btn, .ctrl-bar .ctrl-live-btn, .ctrl-bar .ctrl-qual-btn, .ctrl-bar .vol-slider, .ctrl-bar .qual-item",
      ),
    ).filter(isRemoteFocusableVisible);
  }

  function focusPlayerControl(el) {
    if (!el) return false;
    wakePlayerControls();
    document.body.classList.add("remote-nav-active");
    el.focus({ preventScroll: true });
    return true;
  }

  function handlePlayerRemoteDirection(direction) {
    if (!direction || !document.body.classList.contains("is-watching")) {
      return false;
    }

    const current = document.activeElement;
    const controls = getVisiblePlayerControls();
    if (!controls.length || isEmbedActive) return false;

    if (isPlayerControl(current)) {
      wakePlayerControls();

      if (current.matches(".qual-item")) {
        const menu = current.closest(".qual-menu");
        const items = Array.from(menu?.querySelectorAll(".qual-item") || [])
          .filter(isRemoteFocusableVisible);

        if ((direction === "up" || direction === "down") && items.length) {
          const index = items.indexOf(current);
          const offset = direction === "down" ? 1 : -1;
          const nextIndex = Math.max(0, Math.min(items.length - 1, index + offset));
          return focusPlayerControl(items[nextIndex] || current);
        }

        if (direction === "left" || direction === "right") {
          menu?.classList.add("hidden");
          const owner = menu?.id === "srv-menu" ? $srvBtn : $qualBtn;
          return focusPlayerControl(owner);
        }

        return true;
      }

      if (direction === "left" || direction === "right") {
        const index = controls.indexOf(current);
        const offset = direction === "right" ? 1 : -1;
        const nextIndex = Math.max(
          0,
          Math.min(controls.length - 1, index + offset),
        );
        const next = controls[nextIndex];
        return focusPlayerControl(next || current);
      }

      if (
        current.matches("#ctrl-mute, #vol-slider") &&
        (direction === "up" || direction === "down")
      ) {
        adjustVolume(direction === "up" ? 0.05 : -0.05);
      }

      return true;
    }

    if (
      !document.body.classList.contains("remote-nav-active") &&
      (direction === "down" || direction === "right")
    ) {
      return focusPlayerControl(controls[0]);
    }

    return false;
  }

  function moveRemoteFocus(direction) {
    const elements = getRemoteFocusableElements();
    if (!elements.length) return false;

    if (!document.activeElement || !elements.includes(document.activeElement)) {
      const firstCard = getInitialRemoteFocusTarget(elements);
      document.body.classList.add("remote-nav-active");
      firstCard.focus({ preventScroll: false });
      scrollRemoteTargetIntoView(firstCard);
      return true;
    }

    const current = document.activeElement;
    if (
      direction === "left" &&
      current.matches(".home-ch-card") &&
      focusRailCategoryFromHomeCard(current)
    ) {
      return true;
    }

    const currentRect = current.getBoundingClientRect();
    const axis = direction === "left" || direction === "right" ? "x" : "y";
    const crossAxis = axis === "x" ? "y" : "x";
    const currentGroup = current.closest(
      ".carousel-track, .wm-grid, .ch-scroll, .yt-nav, .controls",
    );

    let best = null;
    let bestScore = Infinity;

    elements.forEach((el) => {
      if (el === current) return;
      const rect = el.getBoundingClientRect();
      const edgeDistance = getDirectionalDistance(
        currentRect,
        rect,
        direction,
      );
      const centerDelta = getDirectionalCenterDelta(
        currentRect,
        rect,
        direction,
      );

      if (edgeDistance < -12 && centerDelta <= 6) return;

      const overlap = getAxisOverlap(currentRect, rect, crossAxis);
      const crossDistance = getCenterDistance(currentRect, rect, crossAxis);
      const sameGroup = currentGroup && currentGroup === el.closest(
        ".carousel-track, .wm-grid, .ch-scroll, .yt-nav, .controls",
      );

      const alignedPenalty = overlap > 0 ? 0 : crossDistance * 1.9;
      const primary = Math.max(0, edgeDistance);
      let score = primary * 3 + alignedPenalty + crossDistance * 0.35;

      if (sameGroup) score -= 24;
      if (el.matches(".home-ch-card, .wm-card, .ch-item")) score -= 8;
      if (current.matches(".home-ch-card, .wm-card, .ch-item") && el.matches("input")) {
        score += 80;
      }

      if (score < bestScore) {
        bestScore = score;
        best = el;
      }
    });

    const sequentialTarget = getSequentialGroupTarget(current, direction);
    const shouldStayInGroup =
      (direction === "left" || direction === "right") &&
      sequentialTarget &&
      current.matches(".home-ch-card, .wm-card") &&
      best?.closest(".carousel-track, .wm-grid, .ch-scroll") !== currentGroup;

    if (shouldStayInGroup || !best) {
      best = sequentialTarget;
    }

    if (!best) return false;
    best.focus({ preventScroll: false });
    scrollRemoteTargetIntoView(best);
    document.body.classList.add("remote-nav-active");
    return true;
  }

  document.addEventListener("pointerdown", disableRemoteFocusMode, true);

  // Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    const remoteDirection = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
    }[e.key];

    if (remoteDirection && isMobileLayout()) {
      e.preventDefault();
      return;
    }

    if (
      document.activeElement &&
      (document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA")
    ) {
      if (document.activeElement.id === "vol-slider" && remoteDirection) {
        // Let TV/keyboard navigation leave the volume range input.
      }
      // Allow Up/Down arrows to escape inputs so TV remote users don't get stuck
      else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        // Fall through to let remote navigation handle it
      } else {
        return;
      }
    }

    const key = e.key.toLowerCase();

    if (remoteDirection && handlePlayerRemoteDirection(remoteDirection)) {
      e.preventDefault();
      return;
    }

    const shouldHandleRemoteDirection =
      remoteDirection &&
      (!document.body.classList.contains("is-watching") ||
        document.body.classList.contains("remote-nav-active") ||
        document.activeElement?.matches(remoteFocusableSelector));

    if (shouldHandleRemoteDirection) {
      e.preventDefault();
      if (moveRemoteFocus(remoteDirection)) {
        return;
      }
      return;
    }

    if (key === " " || key === "enter") {
      if (
        document.activeElement?.matches(remoteFocusableSelector) &&
        document.activeElement.tagName !== "INPUT"
      ) {
        e.preventDefault();
        document.activeElement.click();
        return;
      }
    }

    if (key === " " || key === "k") {
      e.preventDefault();
      if (!isEmbedActive) {
        togglePlay();
        showFlashOverlay($video.paused ? "pause" : "play");
      } else if (document.activeElement?.matches(remoteFocusableSelector)) {
        document.activeElement.click();
      }
    } else if (key === "m") {
      if (isEmbedActive) return;
      toggleMute();
      showFlashOverlay(muted ? "mute" : "volume");
    } else if (key === "f") {
      e.preventDefault();
      toggleFullscreen();
      showFlashOverlay(
        document.fullscreenElement ? "fullscreen" : "fullscreen-exit",
      );
    } else if (key === "p") {
      e.preventDefault();
      if (isEmbedActive) return;
      togglePiP();
    } else if (key === "c") {
      e.preventDefault();
      if (isEmbedActive) return;
      toggleSubtitles();
      showFlashOverlay("cc", subtitleEnabled);
    } else if (key === "l") {
      e.preventDefault();
      if (isEmbedActive) return;
      jumpToLive();
      toast("Jumped to live");
    } else if (key === "r") {
      e.preventDefault();
      retryStream();
      toast("Reconnecting stream...");
    } else if (e.key === "ArrowUp") {
      if (isEmbedActive) return;
      e.preventDefault();
      adjustVolume(0.05);
    } else if (e.key === "ArrowDown") {
      if (isEmbedActive) return;
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

  // Search Engine Listener (debounced)
  let searchDebounceTimer = null;
  $search.addEventListener("input", (e) => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => onSearch(e), 180);
  });

  // Search clear button
  const $searchClear = document.getElementById("search-clear");
  if ($searchClear) {
    $search.addEventListener("input", () => {
      $searchClear.classList.toggle("hidden", !$search.value);
    });
    $searchClear.addEventListener("click", () => {
      $search.value = "";
      $searchClear.classList.add("hidden");
      $search.focus();
      onSearch({ target: $search });
    });
    // Escape to clear
    $search.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && $search.value) {
        e.preventDefault();
        $search.value = "";
        $searchClear.classList.add("hidden");
        onSearch({ target: $search });
      } else if (e.key === "Escape" && typeof closeFloatingSearch === "function") {
        e.preventDefault();
        closeFloatingSearch(false);
        if (typeof setMobileBrowseSheetOpen === "function") setMobileBrowseSheetOpen(false);
        setMobileTabActive(document.body.classList.contains("is-watching") ? "channels" : "home");
      } else if (e.key === "Escape" && document.body.classList.contains("mobile-browse-open")) {
        e.preventDefault();
        if (typeof setMobileBrowseSheetOpen === "function") setMobileBrowseSheetOpen(false);
        setMobileTabActive(document.body.classList.contains("is-watching") ? "channels" : "home");
      }
    });
  }

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
      toast(
        active ? "Offline channels hidden" : "Offline channels shown",
        1200,
      );
    });
  }

  const $logo = document.getElementById("logo-home");
  if ($logo) {
    $logo.addEventListener("click", () => {
      showHomePage();
      setMobileTabActive("home");
    });
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
    const validChannelExists = findChannel(targetChannelId);

    if (validChannelExists) {
      loadChannel(targetChannelId);
    } else {
      showHomePage();
    }
  } else {
    // Disabled auto-restore to always show the home catalog on reload
    showHomePage();
  }

  // ── Browser Back/Forward Navigation Handler ──
  window.addEventListener("popstate", (event) => {
    console.log("Browser navigation detected. Routing layout...");
    const pathSegments = window.location.pathname.split("/");
    const state = event.state || {};

    // If navigating back from a match stream to the category page
    if (state.fromCategory && pathSegments[1] === "sports" && pathSegments[2]) {
      showHomePage();
      return;
    }

    if (pathSegments[1] && pathSegments[2]) {
      const targetChannelId = pathSegments[2];
      const validChannelExists = findChannel(targetChannelId);

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
  // stream-player.js also calls initLiveChat() on every channel switch.
  // live-chat.js guards against double Firebase listeners internally.
  initLiveChat();
});
