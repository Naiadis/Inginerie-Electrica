const buttons = document.querySelectorAll(".buy-btn");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const produs = btn.dataset.product || "produsul selectat";
    alert(
      `${produs} a fost adăugat în lista de dorințe. Checkout disponibil în curând.`
    );
  });
});

// Scroll-based image crossfade effect
const scrollFadeSection = document.getElementById("scroll-fade");
const images = document.querySelectorAll(".scroll-image-item");
const texts = document.querySelectorAll(".scroll-text-item");

if (scrollFadeSection && images.length > 0) {
  const sectionHeight = scrollFadeSection.offsetHeight;
  const imageCount = images.length;
  const segmentHeight = sectionHeight / imageCount;

  function updateScrollFade() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const sectionTop = scrollFadeSection.offsetTop;
    const sectionBottom = sectionTop + sectionHeight;
    const viewportHeight = window.innerHeight;

    // Check if section is in viewport
    if (scrollTop + viewportHeight < sectionTop || scrollTop > sectionBottom) {
      return;
    }

    // Calculate progress through the section (0 to 1)
    const scrollProgress = Math.max(
      0,
      Math.min(1, (scrollTop + viewportHeight - sectionTop) / sectionHeight)
    );

    // Determine which segment we're in
    const currentSegment = Math.floor(scrollProgress * imageCount);
    const segmentProgress = (scrollProgress * imageCount) % 1;

    images.forEach((img, index) => {
      let opacity = 0;

      if (index === currentSegment) {
        // Current image: fade out as we scroll through its segment
        opacity = 1 - segmentProgress;
      } else if (index === currentSegment + 1 && currentSegment < imageCount - 1) {
        // Next image: fade in as we scroll
        opacity = segmentProgress;
      } else if (index < currentSegment) {
        // Past images: fully faded out
        opacity = 0;
      } else if (index > currentSegment + 1) {
        // Future images: fully faded out
        opacity = 0;
      }

      img.style.opacity = Math.max(0, Math.min(1, opacity));
    });

    // Update text visibility
    texts.forEach((text, index) => {
      if (index === currentSegment) {
        text.classList.add("active");
      } else {
        text.classList.remove("active");
      }
    });
  }

  // Initial update
  updateScrollFade();

  // Throttle scroll events for performance
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollFade();
        ticking = false;
      });
      ticking = true;
    }
  });
}
