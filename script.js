const buttons = document.querySelectorAll(".buy-btn");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const produs = btn.dataset.product || "produsul selectat";
    alert(
      `${produs} a fost adăugat în lista de dorințe. Checkout disponibil în curând.`
    );
  });
});
