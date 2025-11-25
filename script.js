const buttons = document.querySelectorAll(".buy-btn");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const produs = btn.dataset.product || "produsul selectat";
    alert(
      `${produs} a fost adăugat în lista de dorințe. Checkout disponibil în curând.`
    );
  });
});

const productCards = document.querySelectorAll(".product-card");
const productImages = document.querySelectorAll(".product-image");

if (productCards.length && productImages.length) {
  let activeIndex = 0;

  const setActiveProduct = (index) => {
    productCards.forEach((card, i) =>
      card.classList.toggle("active", i === index)
    );
    productImages.forEach((img, i) =>
      img.classList.toggle("active", i === index)
    );
    activeIndex = index;
  };

  const updateOpacity = () => {
    const viewportHeight = window.innerHeight;

    productCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(viewportHeight / 2 - cardCenter);

      let opacity;
      if (index === activeIndex) {
        const plateau = viewportHeight * 0.2;
        const falloff = viewportHeight * 0.6;
        const adjusted = Math.max(0, distanceFromCenter - plateau);
        opacity = Math.max(0, 1 - adjusted / falloff);
      } else {
        const earlyFade = viewportHeight * 0.5;
        opacity = Math.max(
          0,
          1 - Math.max(0, distanceFromCenter - viewportHeight * 0.2) / earlyFade
        );
      }

      card.style.opacity = Math.min(1, opacity).toFixed(2);
    });
  };

  setActiveProduct(0);
  updateOpacity();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.dataset.product || 0);
          setActiveProduct(idx);
          updateOpacity();
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "-15% 0px -55% 0px",
    }
  );

  const syncImageOpacity = () => {
    const viewportHeight = window.innerHeight;
    const centerY = viewportHeight / 2;

    productCards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distance = Math.abs(centerY - cardCenter);
      const fadeRange = viewportHeight * 0.45;
      const opacity = Math.max(0, 1 - distance / fadeRange);

      if (productImages[idx]) {
        productImages[idx].style.opacity = opacity.toFixed(2);
      }
    });
  };

  productCards.forEach((card) => observer.observe(card));
  window.addEventListener("scroll", () => {
    updateOpacity();
    syncImageOpacity();
  });
  syncImageOpacity();
}

// Scroll-based image crossfade effect
const scrollTextItems = document.querySelectorAll(".scroll-text-item");
const scrollImageItems = document.querySelectorAll(".scroll-image-item");

if (scrollTextItems.length && scrollImageItems.length) {
  const clampIndex = (idx) =>
    Math.max(0, Math.min(idx, scrollImageItems.length - 1));

  const setActiveSlide = (index) => {
    const safeIndex = clampIndex(index);
    scrollTextItems.forEach((item, i) => {
      item.classList.toggle("active", i === safeIndex);
    });
    scrollImageItems.forEach((img, i) => {
      img.classList.toggle("active", i === safeIndex);
    });
  };

  setActiveSlide(0);

  const textObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.dataset.textIndex || 0);
          setActiveSlide(idx);
        }
      });
    },
    {
      root: null,
      threshold: 0.6,
    }
  );

  scrollTextItems.forEach((item) => textObserver.observe(item));
}
