// -------------------------------------------------------------
// Carusel la scroll: sincronizează cardurile text cu imaginile
//
// Ideea generală:
// - în HTML avem mai multe "carduri" de text (descrierile produselor) și mai multe imagini
// - fiecare card de text are un număr (data-product="0", "1", "2"...)
// - fiecare imagine are același număr
// - când dai scroll și un card de text ajunge în zona din mijloc a ecranului,
//   scriptul îl consideră "activ" și îi face imaginea corespunzătoare clară (cu opacitate mare),
//   iar celelalte devin mai șterse (opacitate mică).
// -------------------------------------------------------------

// Luăm din pagină TOATE elementele care reprezintă cardurile de produs (blocurile de text)
const productCards = document.querySelectorAll(".product-card");
// Luăm TOATE imaginile suprapuse din coloana din stânga
const productImages = document.querySelectorAll(".product-image");

// Verificăm că există măcar un card și o imagine înainte să rulăm logica
if (productCards.length && productImages.length) {
  // activeIndex va reține numărul produsului care este "în prim-plan"
  let activeIndex = 0;

  // Funcție care marchează produsul activ atât în text, cât și în imagini
  const setActiveProduct = (index) => {
    // Pentru fiecare card de text:
    // - dacă poziția lui (i) este egală cu indexul cerut, îi punem clasa "active"
    // - altfel îi scoatem clasa "active"
    productCards.forEach((card, i) =>
      card.classList.toggle("active", i === index)
    );

    // Facem același lucru și pentru imaginile produselor
    productImages.forEach((img, i) =>
      img.classList.toggle("active", i === index)
    );

    // Reținem ce produs este acum activ
    activeIndex = index;
  };

  // Funcție care reglează OPACITATEA textului în funcție de cât de aproape este de centrul ecranului
  const updateOpacity = () => {
    // Înălțimea ferestrei vizibile (adică zona pe care o vezi fără să dai scroll)
    const viewportHeight = window.innerHeight;

    // Parcurgem fiecare card de produs
    productCards.forEach((card, index) => {
      // getBoundingClientRect ne spune unde este elementul pe ecran (sus, jos, înălțime etc.)
      const rect = card.getBoundingClientRect();
      // Calculăm unde este centrul acestui card (la jumătatea dintre partea de sus și cea de jos)
      const cardCenter = rect.top + rect.height / 2;
      // Aflăm cât de departe este centrul cardului față de centrul ferestrei
      const distanceFromCenter = Math.abs(viewportHeight / 2 - cardCenter);

      let opacity;
      if (index === activeIndex) {
        // Pentru cardul ACTIV (cel considerat principal):
        // - vrem să rămână clar (opacitate mare) pe o zonă mai mare în jurul centrului,
        //   de aceea definim un mic "platou" în care nu scade opacitatea.
        const plateau = viewportHeight * 0.2; // 20% din înălțimea ferestrei, unde cardul rămâne clar
        const falloff = viewportHeight * 0.6; // după platou, începe să se estompeze pe o distanță mai mare
        const adjusted = Math.max(0, distanceFromCenter - plateau);
        // Opacitatea scade treptat de la 1 (clar) la 0 (invizibil) în funcție de distanță
        opacity = Math.max(0, 1 - adjusted / falloff);
      } else {
        // Pentru cardurile NEACTIVE (cele care au fost sau încă nu au ajuns în centru):
        // - încep să apară / dispară mai devreme, pentru a nu avea zone goale pe ecran.
        const earlyFade = viewportHeight * 0.5;
        opacity = Math.max(
          0,
          1 - Math.max(0, distanceFromCenter - viewportHeight * 0.2) / earlyFade
        );
      }

      // Setăm efectiv opacitatea pe stilul cardului (valoare între 0 și 1 cu două zecimale)
      card.style.opacity = Math.min(1, opacity).toFixed(2);
    });
  };

  // La început, marcăm primul produs ca activ și îi setăm opacitățile
  setActiveProduct(0);
  updateOpacity();

  // IntersectionObserver este o "unealtă" din browser care ne spune
  // când un element intră sau iese din zona vizibilă a ferestrei la scroll.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // entry.isIntersecting = true înseamnă că elementul a intrat suficient în cadru
        if (entry.isIntersecting) {
          // Luăm indexul produsului din atributul data-product din HTML
          const idx = Number(entry.target.dataset.product || 0);
          // Actualizăm produsul activ și refacem opacitatea textului
          setActiveProduct(idx);
          updateOpacity();
        }
      });
    },
    {
      // threshold 0.2 înseamnă că ne interesează când ~20% din card este vizibil
      threshold: 0.2,
      // rootMargin mută zona "sensibilă" puțin mai sus/jos pentru a regla momentul schimbării
      rootMargin: "-15% 0px -55% 0px",
    }
  );

  // Funcție care sincronizează opacitatea imaginilor cu poziția cardului de text
  const syncImageOpacity = () => {
    const viewportHeight = window.innerHeight;
    const centerY = viewportHeight / 2;

    productCards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distance = Math.abs(centerY - cardCenter);
      // fadeRange stabilește cât de repede trecem de la clar la estompat pentru imagini
      const fadeRange = viewportHeight * 0.45;
      const opacity = Math.max(0, 1 - distance / fadeRange);

      // Dacă există imagine pentru acest index, îi aplicăm opacitatea calculată
      if (productImages[idx]) {
        productImages[idx].style.opacity = opacity.toFixed(2);
      }
    });
  };

  // Începem să "urmărim" fiecare card; când se mișcă în/în afara zonei de interes,
  // observer-ul va apela funcția noastră de mai sus.
  productCards.forEach((card) => observer.observe(card));

  // De fiecare dată când utilizatorul dă scroll:
  // - recalculăm opacitatea textului
  // - și sincronizăm opacitatea imaginilor
  window.addEventListener("scroll", () => {
    updateOpacity();
    syncImageOpacity();
  });

  // Apelăm odată și la început pentru ca totul să fie aliniat înainte de primul scroll
  syncImageOpacity();
}
