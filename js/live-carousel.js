document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("tv-ready");

  const setupLiveCarousel = () => {
    const track = document.querySelector(".live-carousel-track");
    if (!track || track.dataset.carouselReady === "true") return;

    const getSlides = () => Array.from(track.querySelectorAll(".home-ch-card"));
    let activeIndex = 0;
    let intervalId = null;
    let dotsWrap = null;

    const setActiveDot = () => {
      dotsWrap
        ?.querySelectorAll(".live-carousel-dot")
        .forEach((dot, index) => dot.classList.toggle("is-active", index === activeIndex));
    };

    const goToSlide = (index) => {
      const slides = getSlides();
      if (!slides.length) return;
      activeIndex = (index + slides.length) % slides.length;
      track.scrollTo({
        left: slides[activeIndex].offsetLeft - track.offsetLeft,
        behavior: "smooth",
      });
      setActiveDot();
    };

    const buildDots = () => {
      dotsWrap?.remove();
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
      const slides = getSlides();
      if (slides.length <= 1) return;
      intervalId = setInterval(() => goToSlide(activeIndex + 1), 5500);
    };

    const refresh = () => {
      const slides = getSlides();
      activeIndex = Math.min(activeIndex, Math.max(slides.length - 1, 0));
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
    refresh();
  };

  setupLiveCarousel();
  new MutationObserver(setupLiveCarousel).observe(document.body, {
    childList: true,
    subtree: true,
  });
});
