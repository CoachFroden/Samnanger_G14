// === STANDARD JS-MAL FOR UNDERSIDE ===
// Denne koden kan kopieres til alle *side.js*-filer.
// Den kjøres når HTML-en for siden er lastet inn via main.js.

console.log("📄 trening.js lastet");

// Init-funksjon – alt du vil skal skje når siden vises
function initPage() {
  console.log("➡️ Kjører initPage() for [FILNAVN]");

  // 🔹 Eksempel: legg til event listeners
  // const knapp = document.querySelector(".min-knapp");
  // if (knapp) {
  //   knapp.addEventListener("click", () => {
  //     console.log("Knapp klikket på [FILNAVN]");
  //   });
  // }

  // 🔹 Eksempel: fade inn sideinnholdet
  const main = document.getElementById("main");
  main.style.opacity = 0;
  main.style.transition = "opacity 0.4s ease";
  setTimeout(() => {
    main.style.opacity = 1;
  }, 50);

  // 🔹 Eksempel: hent eller endre elementer spesifikt for denne siden
  // const tittel = document.querySelector(".page-title");
  // if (tittel) tittel.textContent = "Oppdatert tittel for [FILNAVN]";
}

// Vent litt slik at HTML faktisk er lastet inn
setTimeout(initPage, 100);
// ===== PATCH: ensure training page stacks vertically (same pattern as visualisering) =====
document.addEventListener('DOMContentLoaded', function () {
  try {
    const infoGrid = document.querySelector('.ex-grid');
    const section = document.querySelector('.trening') || (infoGrid ? infoGrid.parentElement : null);

    if (!section) return;

    // legg på markørklasse hvis ikke allerede
    if (!section.classList.contains('mh-visual-force')) {
      section.classList.add('mh-visual-force');
    }

    // sikkerhets-inline-stiler med important (hjelper hvis andre skript overstyrer)
    function setImportant(el, prop, val) {
      try { el.style.setProperty(prop, val, 'important'); }
      catch (e) { el.style[prop] = val; }
    }

    setImportant(section, 'display', 'flex');
    setImportant(section, 'flex-direction', 'column');
    setImportant(section, 'gap', '1.6rem');

    if (infoGrid) {
      setImportant(infoGrid, 'display', 'flex');
      setImportant(infoGrid, 'flex-direction', 'column');
      setImportant(infoGrid, 'width', '100%');
      setImportant(infoGrid, 'gap', '1.25rem');

      Array.from(infoGrid.children).forEach(function (el) {
        setImportant(el, 'display', 'flex');
        setImportant(el, 'width', '100%');
        setImportant(el, 'align-items', 'center');
        setImportant(el, 'gap', '1rem');
        setImportant(el, 'float', 'none');
      });
    }

  } catch (err) {
    console.error('trening layout patch failed:', err);
  }
});
