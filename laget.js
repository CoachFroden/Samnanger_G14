"use strict";

/* -----------------------------------------------------
   SPILLERDATA
----------------------------------------------------- */

window.lagetData = window.lagetData || {};

window.lagetData.trener = "Trenernavn";
window.lagetData.kaptein = "Kapteinsnavn";

window.lagetData.posisjoner = ["Keeper", "Forsvar", "Midtbane", "Angrep"];


window.lagetData.spillere = [
  { nr: 1, navn: "Theodor Vinje Våge", rolle: "Keeper", image: "Theodor.png" },
  { nr: 12, navn: "Thage Haukenes", rolle: "Keeper", image: "/Thage.png" },
  { nr: 2, navn: "Gabriel Bjørkmo", rolle: "Forsvar", image: "drakter/Gabriel.png" },
  { nr: 3, navn: "Sondre Bruvik Nordvik", rolle: "Forsvar", image: "drakter/Sondre.png" },
  { nr: 4, navn: "William Langeland Jørgensen", rolle: "Midtbane", image: "drakter/William.png" },
  { nr: 5, navn: "Nicolai Lønnebakken Dalseid", rolle: "Midtbane", image: "drakter/Nicolai.png" },
  { nr: 6, navn: "Liam Moss Liøen", rolle: "Angrep", image: "drakter/Liam.png" },
  { nr: 7, navn: "Torvald Oma Høysæter", rolle: "Forsvar", image: "drakter/Torvald.png" },
  { nr: 8, navn: "Brage Bjørnås Teige", rolle: "Forsvar", image: "drakter/Brage.png" },
  { nr: 9, navn: "Lars Frøland", rolle: "Midtbane", image: "drakter/Lars.png" },
  { nr: 10, navn: "Snorre Naalsund Aldal", rolle: "Forsvar", image: "drakter/Snorre.png" },
  { nr: 11, navn: "Ask Aldal", rolle: "Forsvar", image: "drakter/Ask.png" },
  { nr: 13, navn: "Lukas Leander Steinsland Trengereid", rolle: "Midtbane", image: "drakter/Lukas.png" },
  { nr: 14, navn: "Oliver Rondestveit", rolle: "Angrep", image: "drakter/Oliver.png" },
  { nr: 17, navn: "Martin Flatjord Sandvik", rolle: "Forsvar", image: "drakter/Martin.png" },
  { nr: 18, navn: "Sverre Erstad", rolle: "Midtbane", image: "drakter/Sverre.png" },
  { nr: 19, navn: "Noah Langeland Drevsjø", rolle: "Midtbane", image: "drakter/Noah.png" },
  { nr: 16, navn: "Noah Fure Nytveit", rolle: "Angrep", image: "drakter/Nytveit.png" }
];

/* -----------------------------------------------------
   PASSORD PER SPILLER (fra originalfilen din)
----------------------------------------------------- */

window.lagetData.playerPasswords = {
  "Theodor Vinje Våge": "theodor",
  "Thage Haukenes": "thage",
  "Gabriel Bjørkmo": "gabriel",
  "Sondre Bruvik Nordvik": "sondre",
  "William Langeland Jørgensen": "william",
  "Nicolai Lønnebakken Dalseid": "nicolai",
  "Torvald Oma Høysæter": "torvald",
  "Brage Bjørnås Teige": "brage",
  "Lars Frøland": "lars",
  "Snorre Naalsund Aldal": "snorre",
  "Ask Aldal": "ask",
  "Lukas Leander Steinsland Trengereid": "lukas",
  "Oliver Rondestveit": "oliver",
  "Martin Flatjord Sandvik": "martin",
  "Sverre Erstad": "sverre",
  "Noah Langeland Drevsjø": "noah",
  "Noah Fure Nytveit": "nytveit",
  "Liam Moss Liøen": "liam"
};

/* -----------------------------------------------------
   BYGG SPILLERKORT (matcher CSS 100%)
----------------------------------------------------- */

function buildPlayerCards() {
  const container = document.getElementById("spillereContainer");
  if (!container) return;

  container.innerHTML = "";

  window.lagetData.spillere.forEach(player => {
    const card = document.createElement("div");
    card.className = "player-card";

    card.innerHTML = `
      <img class="jersey" src="${player.image}" alt="${player.navn}">
    `;

    card.onclick = () => openPasswordModal(player.navn);
    container.appendChild(card);
  });
}


/* -----------------------------------------------------
   PASSORDMODAL (helt korrekt gjenopprettet)
----------------------------------------------------- */

function openPasswordModal(playerName) {
  const modal = document.getElementById("password-modal");
  const input = document.getElementById("password-modal-input");
  const btn = document.getElementById("player-password-confirm");
  
  input.onkeypress = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    btn.click();
  }
};

  modal.dataset.player = playerName;
  modal.style.display = "flex";
  input.value = "";

  btn.onclick = () => {
    const expected = window.lagetData.playerPasswords[playerName] || "";
    const typed = input.value.trim().toLowerCase();

    if (typed === expected.toLowerCase()) {
      modal.style.display = "none";
      openPlanModal(playerName);
    } else {
      const err = document.getElementById("password-error");
      err.style.display = "block";
      err.style.opacity = "1";

      setTimeout(() => {
        err.style.transition = "opacity 0.4s ease";
        err.style.opacity = "0";
        setTimeout(() => (err.style.display = "none"), 400);
      }, 2000);
    }
  };
}

/* -----------------------------------------------------
   PLANMODAL – original layout, nå med Firebase
----------------------------------------------------- */

async function hentEvalueringFraFirebase(playerName) {
  const ref = window.firestore.doc(window.db, "evalueringer", playerName);
  const snap = await window.firestore.getDoc(ref);
  return snap.exists() ? snap.data() : null;
}


window.openPlanModal = function (playerName) {
  const modal = document.getElementById("plan-modal");
  const player = window.lagetData.spillere.find(p => p.navn === playerName);

  // Sikkerhetsnett hvis spiller ikke finnes
  if (!player) {
    console.error("Fant ikke spiller:", playerName);
    return;
  }

  document.getElementById("plan-player-name").textContent = player.navn;
  document.getElementById("plan-player-sub").textContent = `#${player.nr} • ${player.rolle}`;

  // ✅ VIS MODALEN MED EN GANG (uavhengig av Firebase)
  modal.classList.add("show");
  document.body.style.overflow = "hidden";

  // Sett default/placeholder med én gang
  const contentEl = document.getElementById("plan-content");
  const updatedEl = document.getElementById("plan-updated");

  contentEl.innerHTML = `<p class="plan-empty">Laster utviklingsplan…</p>`;
  updatedEl.textContent = "Oppdatert: –";

  document.getElementById("stat-games").textContent = "0";
  document.getElementById("stat-goals").textContent = "0";
  document.getElementById("stat-assists").textContent = "0";

  // Hent data etterpå
  hentEvalueringFraFirebase(playerName)
    .then(ev => {
      const esc = t => String(t || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      if (!ev) {
        contentEl.innerHTML = `<p class="plan-empty">Ingen utviklingsplan er lagt til ennå.</p>`;
        updatedEl.textContent = "Oppdatert: –";
        return;
      }

      let html = "";

      const addSection = (type, title, list) => {
        const clean = (list || []).filter(v => v && v.trim().length > 0);
        if (!clean.length) return;

        html += `
          <div class="plan-section plan-${type}">
            <div class="plan-section-title">${esc(title)}</div>
            <ul class="plan-section-list">
              ${clean.map(v => `<li>${esc(v)}</li>`).join("")}
            </ul>
          </div>`;
      };

      // 🔴 Tekniske mål
      addSection("tek", "Tekniske mål", [ev.tek1, ev.tek2]);
      addSection("ov", "Forslag til øvelse", [ev.tek3]);

      // 🟡 Taktiske mål
      addSection("tak", "Taktiske mål", [ev.tak1, ev.tak2]);
      addSection("ov", "Forslag til øvelse", [ev.tak3]);

      // 🔵 Fysiske mål
      addSection("fys", "Fysiske mål", [ev.fys1, ev.fys2]);
      addSection("ov", "Forslag til øvelse", [ev.fys3]);

      // 🟢 Kommentar
      if (ev.kommentar?.trim()) {
        html += `
          <div class="plan-section plan-kom">
            <div class="plan-section-title">Kommentar</div>
            <div class="plan-comment-box">${esc(ev.kommentar)}</div>
          </div>`;
      }

      contentEl.innerHTML = html;

      // Oppdatert-dato, med fallback
      try {
        updatedEl.textContent = `Oppdatert: ${new Date(ev.oppdatert).toLocaleDateString("no-NO")}`;
      } catch {
        updatedEl.textContent = "Oppdatert: –";
      }
    })
    .catch(err => {
      console.error("Firebase-feil:", err);
      // ✅ Modalen er allerede synlig – vis en tydelig melding i innholdet
      contentEl.innerHTML = `<p class="plan-empty">Ingen tilgang til utviklingsplan (Firestore permissions).</p>`;
      updatedEl.textContent = "Oppdatert: –";
    });
};


/* -----------------------------------------------------
   LUKKE FUNKSJONER FOR MODALENE
----------------------------------------------------- */

function closePasswordModal() {
    const modal = document.getElementById("password-modal");
    modal.style.display = "none";
}

function closePlanModal() {
    const modal = document.getElementById("plan-modal");
    modal.classList.remove("show");
    document.body.style.overflow = "";
}
/* -----------------------------------------------------
   LUKK MODALER VED KLIKK UTENFOR
----------------------------------------------------- */

// Passordmodal
window.addEventListener("click", function (event) {
    const modal = document.getElementById("password-modal");
    if (modal && event.target === modal) {
        closePasswordModal();
    }
});

// Planmodal
window.addEventListener("click", function (event) {
    const modal = document.getElementById("plan-modal");
    if (modal && event.target === modal) {
        closePlanModal();
    }
});


/* -----------------------------------------------------
   INIT
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  buildPlayerCards();
});

/* -----------------------------------------------------
   KOBLE LUKKE-KNAPPER (MÅ GJØRES ETTER HTML LASTES)
----------------------------------------------------- */


function connectCloseButtons() {
    const pwClose = document.getElementById("password-close-btn");
    if (pwClose) pwClose.onclick = closePasswordModal;

    const planClose = document.getElementById("plan-modal-close");
    if (planClose) planClose.onclick = closePlanModal;
}

setTimeout(connectCloseButtons, 100);


