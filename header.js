// header.js – robust versjon som venter på at headeren faktisk lastes inn
function initHeaderWhenReady() {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("header nav ul");

  if (!menuToggle || !menu) {
    console.warn("header.js: venter på header...");
    return setTimeout(initHeaderWhenReady, 200); // prøv igjen hvert 200 ms
  }

  console.log("✅ header.js: fant meny og toggle, init startet");

  // Åpne/lukk meny
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("show");
  });

  // Lukk meny ved klikk på valg
  menu.querySelectorAll("button, a").forEach((el) =>
    el.addEventListener("click", () => menu.classList.remove("show"))
  );

  // Lukk ved klikk utenfor
  document.addEventListener("click", (e) => {
    const inside = menu.contains(e.target) || menuToggle.contains(e.target);
    if (!inside && menu.classList.contains("show")) {
      menu.classList.remove("show");
    }
  });

  // Lukk med Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") menu.classList.remove("show");
  });
}

document.addEventListener("DOMContentLoaded", initHeaderWhenReady);
