document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("tv-ready");

  const setupLiveCarousel = () => {
    const track = document.querySelector(".live-carousel-track");
    if (!track || track.dataset.carouselReady === "true") return;

    const getSlides = () => Array.from(track.querySelectorAll(".home-ch-card"));
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    let activeIndex = 0;
    let intervalId = null;
    let dotsWrap = null;

    const applyLayoutMode = () => {
      const slides = getSlides();
      if (mobileQuery.matches) {
        track.style.gridAutoColumns = "100%";
        track.style.gap = "0px";
        track.style.overflowX = "hidden";
        track.style.overflowY = "hidden";
        slides.forEach((slide) => {
          slide.style.width = "100%";
          slide.style.minWidth = "100%";
          slide.style.maxWidth = "100%";
        });
        return;
      }

      track.style.removeProperty("grid-auto-columns");
      track.style.removeProperty("gap");
      track.style.removeProperty("overflow-x");
      track.style.removeProperty("overflow-y");
      slides.forEach((slide) => {
        slide.style.removeProperty("width");
        slide.style.removeProperty("min-width");
        slide.style.removeProperty("max-width");
        slide.style.removeProperty("display");
        slide.classList.remove("is-active");
      });
    };

    const setActiveSlides = () => {
      const slides = getSlides();
      slides.forEach((slide, index) => {
        const isActive = !mobileQuery.matches || index === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.style.display = isActive ? "" : "none";
      });
    };

    const setActiveDot = () => {
      dotsWrap
        ?.querySelectorAll(".live-carousel-dot")
        .forEach((dot, index) => dot.classList.toggle("is-active", index === activeIndex));
    };

    const goToSlide = (index) => {
      const slides = getSlides();
      if (!slides.length) return;
      activeIndex = (index + slides.length) % slides.length;
      if (mobileQuery.matches) {
        setActiveSlides();
        setActiveDot();
        return;
      }
      track.scrollTo({
        left: slides[activeIndex].offsetLeft - track.offsetLeft,
        behavior: "smooth",
      });
      setActiveDot();
    };

    const buildDots = () => {
      dotsWrap?.remove();
      dotsWrap = null;
      if (!mobileQuery.matches) return;
      const slides = getSlides();
      if (slides.length <= 1) return;

      dotsWrap = document.createElement("div");
      dotsWrap.className = "live-carousel-dots";

      slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.className = "live-carousel-dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Show live match ${index + 1}`);
        dot.addEventListener("click", () => {
          goToSlide(index);
          restart();
        });
        dotsWrap.appendChild(dot);
      });

      track.closest(".live-banner-section")?.appendChild(dotsWrap);
      setActiveDot();
    };

    const restart = () => {
      clearInterval(intervalId);
      intervalId = null;
      if (!mobileQuery.matches) return;
      const slides = getSlides();
      if (slides.length <= 1) return;
      intervalId = setInterval(() => goToSlide(activeIndex + 1), 5500);
    };

    const refresh = () => {
      const slides = getSlides();
      applyLayoutMode();
      activeIndex = Math.min(activeIndex, Math.max(slides.length - 1, 0));
      setActiveSlides();
      buildDots();
      restart();
    };

    const observer = new MutationObserver(refresh);
    observer.observe(track, { childList: true });
    track.dataset.carouselReady = "true";
    track.addEventListener("mouseenter", () => clearInterval(intervalId));
    track.addEventListener("mouseleave", restart);
    track.addEventListener("focusin", () => clearInterval(intervalId));
    track.addEventListener("focusout", restart);
    mobileQuery.addEventListener("change", refresh);
    refresh();
  };

  setupLiveCarousel();
  new MutationObserver(setupLiveCarousel).observe(document.body, {
    childList: true,
    subtree: true,
  });
});
