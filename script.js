// -------------------------------------------------------------
// Carusel la scroll: sincronizează cardurile text cu imaginile
// -------------------------------------------------------------
const productCards = document.querySelectorAll(".product-card");
const productImages = document.querySelectorAll(".product-image");

if (productCards.length && productImages.length) {
  let activeIndex = 0;

  // Marchează produsul care este în centrul ecranului
  const setActiveProduct = (index) => {
    productCards.forEach((card, i) =>
      card.classList.toggle("active", i === index)
    );
    productImages.forEach((img, i) =>
      img.classList.toggle("active", i === index)
    );
    activeIndex = index;
  };

  // Face textul mai transparent când cardul părăsește centrul
  const updateOpacity = () => {
    const viewportHeight = window.innerHeight;

    productCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(viewportHeight / 2 - cardCenter);

      let opacity;
      if (index === activeIndex) {
        // Cardul activ rămâne vizibil mai mult timp
        const plateau = viewportHeight * 0.2;
        const falloff = viewportHeight * 0.6;
        const adjusted = Math.max(0, distanceFromCenter - plateau);
        opacity = Math.max(0, 1 - adjusted / falloff);
      } else {
        // Cardurile din apropiere apar gradual pentru efect fluid
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

  // IntersectionObserver detectează când un card intră în zona vizibilă
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

  // Ajustează și vizibilitatea imaginilor pentru a imita un slideshow
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