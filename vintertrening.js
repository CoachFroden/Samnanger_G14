function unlockTips() {
  const password = document.getElementById("coachPassword").value.trim();
  const box = document.getElementById("coachTipsBox");
  const error = document.getElementById("errorMsg");
  const passwordArea = document.getElementById("passwordArea");
  const lockIcon = document.getElementById("lockIcon");

  if (password === "samnanger") {
    lockIcon.classList.add("open");
    setTimeout(() => {
      box.classList.remove("locked");
      box.classList.add("unlocked");
      passwordArea.style.display = "none";
      error.textContent = "";
      lockIcon.textContent = "🔓";
    }, 500);
  } else {
    error.textContent = "Feil passord. Prøv igjen.";
  }
}

function lockTips() {
  const box = document.getElementById("coachTipsBox");
  const passwordArea = document.getElementById("passwordArea");
  const passwordInput = document.getElementById("coachPassword");
  const lockIcon = document.getElementById("lockIcon");

  // Re-lås med animasjon
  lockIcon.classList.remove("open");
  lockIcon.classList.add("close");
  lockIcon.textContent = "🔒";

  setTimeout(() => {
    box.classList.remove("unlocked");
    box.classList.add("locked");
    passwordArea.style.display = "block";
    passwordInput.value = "";
  }, 400);
}
// PATCHED BY CHATGPT: sikre vertikal rekkefølge og inline-fallback (vintertrening)
document.addEventListener('DOMContentLoaded', function () {
  try {
    // målrett seksjonen vi endret i HTML
    const section = document.querySelector('.vintertrening.mh-visual-force') || document.querySelector('.vintertrening');
    if (!section) return;

    // gi klassen for CSS-overrides
    section.classList.add('mh-visual-force');

    // flytt eventuelle elementer i logisk rekkefølge (header -> warmup -> structure -> stations -> coach-tips -> cooldown)
    const header = section.querySelector('.header');
    const warmup = section.querySelector('.warmup');
    const structure = section.querySelector('.structure');
    const stations = section.querySelector('.stations-grid');
    const coach = section.querySelector('.coach-tips');
    const cooldown = section.querySelector('.cooldown');

    // append i riktig rekkefølge hvis de finnes (sikrer vertikal DOM-flow)
    [header, warmup, structure, stations, coach, cooldown].forEach(el => {
      if (el) section.appendChild(el);
    });

    // sikkerhets-fallback: sett inline important-stiler hvis stylesheet overstyres
    function setImp(el, prop, val) {
      try { el.style.setProperty(prop, val, 'important'); }
      catch (e) { el.style[prop] = val; }
    }

    setImp(section, 'display', 'flex');
    setImp(section, 'flex-direction', 'column');
    setImp(section, 'gap', '1.6rem');

    // Forsikre stations-grid om korrekt oppførsel
    if (stations) {
      // behold grid-oppsett for store skjermer, men sikre column-fallback
      setImp(stations, 'display', getComputedStyle(stations).display || 'grid');
      // hvis noe tvinger rad-layout, gi column-alternativ
      if (getComputedStyle(section).display === 'flex' && getComputedStyle(stations).gridTemplateColumns === 'none') {
        // fallback: gjør stations til kolonne
        stations.classList.add('force-column');
        setImp(stations, 'display', 'flex');
        setImp(stations, 'flex-direction', 'column');
      }
    }

  } catch (err) {
    console.error('patch script error (vintertrening):', err);
  }
});
