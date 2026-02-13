console.log("Public stats-side lastet");

/* ======================================================
   FIREBASE (CDN)
   ====================================================== */

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Bruk samme config som du allerede har
const firebaseConfig = {
  apiKey: "AIzaSyAKZMu2HZPmmoZ1fFT7DNA9Q6ystbKEPgE",
  authDomain: "samnanger-g14-f10a1.firebaseapp.com",
  projectId: "samnanger-g14-f10a1",
  storageBucket: "samnanger-g14-f10a1.firebasestorage.app",
  messagingSenderId: "926427862844",
  appId: "1:926427862844:web:eeb814a349e9bfd701b039",
  measurementId: "G-XJ4X7NXQCM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const titleEl = document.getElementById("printMatchTitle");

/* ======================================================
   VELG “PUBLIC TRAINER”
   ====================================================== */

// LIM INN UID-en du kopierte i steg 1:
const PUBLIC_COACH_UID = "t4UVzYK7jcNsBbFCCv6PibP9Sss1";

/* ======================================================
   LOAD + RENDER
   ====================================================== */

let allMatches = [];

async function loadMatchesForCoach(uid) {
  const ref = collection(db, "users", uid, "matches");
  const snap = await getDocs(ref);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

window.initStatistikkPublicPage = async function () {
  allMatches = (await loadMatchesForCoach(PUBLIC_COACH_UID))
  .filter(m => Array.isArray(m.playingTime) && m.playingTime.length > 0);

  renderMatches(allMatches);
  renderPlayerStats(allMatches);
  populateMatchSelect(allMatches);

  if (titleEl) {
  titleEl.textContent =
    `Spillerstatistikk – ${allMatches.length} ferdige kamper`;
}

};


/* ======================================================
   UI (samme som hos deg)
   ====================================================== */

const matchSelect = document.getElementById("matchSelect");
const totalBtn = document.getElementById("totalBtn");

if (totalBtn) {
  totalBtn.onclick = () => {
    if (matchSelect) {
      matchSelect.hidden = false;
      matchSelect.value = "";
    }
    document.getElementById("printMatchTitle").textContent =
      "Spillerstatistikk – Totalt";
    renderPlayerStats(allMatches);
  };
}

if (matchSelect) {
  matchSelect.onchange = () => {
    const id = matchSelect.value;
    if (!id) return;

    const match = allMatches.find(m => m.id === id);
    if (!match) return;

    document.getElementById("printMatchTitle").textContent =
      `${match.meta?.ourTeam || ""} – ${match.meta?.opponent || ""} (${match.meta?.date || ""})`;

    renderPlayerStats([match]);
  };
}

function populateMatchSelect(matches) {
  if (!matchSelect) return;
  matchSelect.hidden = false;
  matchSelect.innerHTML = `<option value="">Velg kamp</option>`;

  matches.forEach(match => {
    const opt = document.createElement("option");
    opt.value = match.id;
    opt.textContent = `${match.meta?.date || ""} – ${match.meta?.opponent || ""}`;
    matchSelect.appendChild(opt);
  });
}

/* ======================================================
   KAMP-LISTE
   ====================================================== */

function renderMatches(matches) {
  const tbody = document.querySelector("#matchesTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  matches.forEach(match => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${match.meta?.date || ""}</td>
      <td>${match.meta?.ourTeam || ""} – ${match.meta?.opponent || ""}</td>
      <td>${match.meta?.venue === "away" ? "Borte" : "Hjemme"}</td>
      <td>${match.score?.our ?? "-"} – ${match.score?.their ?? "-"}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ======================================================
   SPILLERSTATISTIKK
   ====================================================== */

function renderPlayerStats(matches) {
  const stats = {};

  matches.forEach(match => {
    const players = match.playingTime;
if (!Array.isArray(players) || players.length === 0) {
  return; // kamp teller ikke i statistikk
}

    players.forEach(player => {
      if (!player.id) return;

      if (!stats[player.id]) {
        stats[player.id] = {
          name: player.name,
          matches: 0,
          minutes: 0,
          goals: 0,
          yellow: 0,
          red: 0
        };
      }

      stats[player.id].matches += 1;
      stats[player.id].minutes += player.minutes || 0;

      const cards = player.cards || [];
      stats[player.id].yellow += cards.filter(c => c.type === "yellow").length;
      stats[player.id].red += cards.some(c => c.type === "red") ? 1 : 0;
    });

    match.events?.forEach(event => {
      if (
        event.type === "goal" &&
        event.team === "home" &&
        event.playerId &&
        stats[event.playerId]
      ) {
        stats[event.playerId].goals += 1;
      }
    });
  });

  const tbody = document.querySelector("#playersTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  Object.values(stats).forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.matches}</td>
      <td class="minutes">${p.minutes}</td>
      <td>${p.goals}</td>
      <td>${p.yellow}</td>
      <td>${p.red}</td>
    `;
    tbody.appendChild(tr);
  });
}


function accumulate(stats, player) {
  if (!stats[player.id]) {
    stats[player.id] = {
      name: player.name,
      matches: 0,
      minutes: 0,
      goals: 0,
      yellow: 0,
      red: 0
    };
  }

  stats[player.id].matches += 1;
  stats[player.id].minutes += player.minutes || 0;
  stats[player.id].yellow += player.yellow || 0;
  stats[player.id].red += player.red ? 1 : 0;
}

// print
const printBtn = document.getElementById("printBtn");
if (printBtn) printBtn.onclick = () => window.print();
