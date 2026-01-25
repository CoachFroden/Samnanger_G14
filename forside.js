console.log("📄 forside.js lastet!");

// Pakk alt i én funksjon
function initForsidePage() {

  console.log("🚀 initForsidePage() kjøres!");

  // ================================
  // LAGET-KORT DATA
  // ================================

  let posCounts = {};

  if (window.lagetData) {
    const teamCountEl = document.getElementById("teamCount");
    const teamAgeEl = document.getElementById("teamAge");
    const coachEl = document.getElementById("teamCoach");
    const captainEl = document.getElementById("teamCaptain");

    if (teamAgeEl) teamAgeEl.textContent = lagetData.aldersgruppe;
    if (coachEl) coachEl.textContent = lagetData.trener;
    if (captainEl) captainEl.textContent = lagetData.kaptein;
    if (teamCountEl) teamCountEl.textContent = `${lagetData.spillere.length} spillere`;

    posCounts = {};
    lagetData.spillere.forEach(spiller => {
      posCounts[spiller.rolle] = (posCounts[spiller.rolle] || 0) + 1;
    });
  }

  // ================================
  // LAGET-MODAL
  // ================================

  const teamModal = document.getElementById("teamModal");
  const teamOverlay = document.getElementById("teamModalOverlay");
  const closeTeamModal = document.getElementById("closeTeamModal");
  const modalCoach = document.getElementById("modalTeamCoach");
  const modalCaptain = document.getElementById("modalTeamCaptain");
  const modalPositions = document.getElementById("modalPositionList");
  const toggleBtn = document.getElementById("teamToggleBtn");

  function openTeamModal() {
modalTeamCoach.textContent = "Frode Vinje Våge";
modalTeamCaptain.textContent = "Ask Naalsund Aldal";

modalPositionList.innerHTML = `
    <li>Keeper</li>
    <li>Forsvar</li>
    <li>Midtbane</li>
    <li>Angrep</li>
`;


    teamModal.hidden = false;
    teamOverlay.hidden = false;

    setTimeout(() => {
      teamModal.classList.add("active");
      teamOverlay.classList.add("active");
    }, 10);
  }

  function closeTeam() {
    teamModal.classList.remove("active");
    teamOverlay.classList.remove("active");
    setTimeout(() => {
      teamModal.hidden = true;
      teamOverlay.hidden = true;
    }, 200);
  }

  if (toggleBtn) toggleBtn.onclick = openTeamModal;
  if (closeTeamModal) closeTeamModal.onclick = closeTeam;
  if (teamOverlay) teamOverlay.onclick = closeTeam;

  // ================================
  // OM OSS-MODAL
  // ================================

  const aboutBtn = document.getElementById("toggleAbout");
  const aboutModal = document.getElementById("aboutModal");
  const aboutOverlay = document.getElementById("aboutModalOverlay");
  const closeAbout = document.getElementById("closeAboutModal");

  function openAbout() {
    aboutModal.hidden = false;
    aboutOverlay.hidden = false;

    setTimeout(() => {
      aboutModal.classList.add("active");
      aboutOverlay.classList.add("active");
    }, 10);
  }

  function closeAboutModal() {
    aboutModal.classList.remove("active");
    aboutOverlay.classList.remove("active");

    setTimeout(() => {
      aboutModal.hidden = true;
      aboutOverlay.hidden = true;
    }, 200);
  }

  if (aboutBtn) aboutBtn.onclick = openAbout;
  if (closeAbout) closeAbout.onclick = closeAboutModal;
  if (aboutOverlay) aboutOverlay.onclick = closeAboutModal;

  console.log("✅ initForsidePage fullført.");
}

// Gjør funksjonen tilgjengelig fra main.js
window.initForsidePage = initForsidePage;

