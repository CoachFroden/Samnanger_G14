// === STANDARD JS-MAL FOR UNDERSIDE ===
// Denne koden kan kopieres til alle *side.js*-filer.
// Den kjøres når HTML-en for siden er lastet inn via main.js.

console.log("📄 kampevaluering.js lastet");

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
