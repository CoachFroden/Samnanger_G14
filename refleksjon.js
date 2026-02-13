import { auth, db } from "../firebase-refleksjon.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

async function ensureAuth() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Ikke innlogget");
  }
  return user;
}

// refleksjon.js
(function () {
  "use strict";

  // =====================================================
  //  Konfig
  // =====================================================
  const PASSWORD = "samnanger2025";
  const SESSION_KEY = "coach_refleksjon_unlocked_v1";

  function qs(id) {
    return document.getElementById(id);
  }

function safe(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}


  // =====================================================
  //  Firestore
  // =====================================================
async function fetchUsers() {
  const snap = await getDocs(collection(db, "users"));

  return snap.docs.map(d => {
    const data = d.data();
    return {
      uid: d.id,
      name:
        data.name?.trim() ||
        data.email?.trim() ||
        "Ukjent"
    };
  });
}

async function fetchRefleksjoner(playerId) {
  const snap = await getDocs(
    collection(db, "refleksjoner", playerId, "entries")
  );

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}


async function loadPendingUsersUI() {
  const toggle = document.getElementById("approvalToggle");
  const dropdown = document.getElementById("approvalDropdown");

  if (!toggle || !dropdown) return;

  dropdown.innerHTML = '<div class="ref-approval-empty">Laster…</div>';

  const snap = await getDocs(collection(db, "users"));

  const pending = snap.docs
  .map(d => ({ uid: d.id, ...d.data() }))
  .filter(u =>
    u.role === "player" &&        // ✅ kun spillere
    u.approved !== true
  );

  // Oppdater antall i knappen
  toggle.textContent = `Ventende (${pending.length}) ▾`;

  // Fyll dropdown
  if (pending.length === 0) {
    dropdown.innerHTML =
      '<div class="ref-approval-empty">Ingen ventende godkjenninger</div>';
    return;
  }

  dropdown.innerHTML = "";

pending.forEach(u => {
  const row = document.createElement("div");
  row.className = "ref-approval-item";

  const label = document.createElement("span");
  label.textContent = u.name || u.username || "Ukjent";

  const btn = document.createElement("button");
  btn.className = "ref-approve-btn";
  btn.type = "button";
  btn.textContent = "Godkjenn";

  btn.onclick = async () => {
    btn.disabled = true;
    btn.textContent = "…";

    try {
      const userRef = doc(db, "users", u.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("Bruker finnes ikke");
      }

      const userData = userSnap.data();
      const playerName = userData.name;

      if (!playerName) {
        throw new Error("Bruker har ikke valgt spiller");
      }

      // 🔗 Link UID til spiller
      await updateDoc(doc(db, "spillere", playerName), {
        uid: u.uid
      });

      // ✅ Godkjenn bruker
      await updateDoc(userRef, {
        approved: true
      });

      await loadPendingUsersUI();

    } catch (err) {
      console.error(err);
      btn.disabled = false;
      btn.textContent = "Godkjenn";
      alert("Kunne ikke godkjenne bruker.");
    }
  };

  row.appendChild(label);
  row.appendChild(btn);
  dropdown.appendChild(row);
});
}



  // =====================================================
  //  Passordmodal
  // =====================================================
  function openModal() {
    const m = qs("refPwModal");
    if (!m) return;

    m.classList.add("show");
    m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    qs("refPwInput").value = "";
    qs("refPwError").style.display = "none";

    setTimeout(() => qs("refPwInput").focus(), 50);
  }

  function closeModal() {
    const m = qs("refPwModal");
    if (!m) return;

    m.classList.remove("show");
    m.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function wrongPassword() {
    const err = qs("refPwError");
    err.style.display = "block";
    err.style.opacity = "1";

    setTimeout(() => {
      err.style.transition = "opacity 0.35s ease";
      err.style.opacity = "0";
      setTimeout(() => {
        err.style.display = "none";
        err.style.opacity = "1";
        err.style.transition = "";
      }, 350);
    }, 1400);
  }

function unlock() {
  sessionStorage.setItem(SESSION_KEY, "1");
  closeModal();

  const ref = document.getElementById("refContent");
  if (ref) {
    ref.hidden = false; // 🔑 DETTE MANGLER
  }

  initCoachRefleksjonUI(); // init direkte
}

  function goBackToCoachCorner() {
    closeModal();
    if (typeof window.loadPage === "function") {
      window.loadPage("trenerhjornet");
    }
  }

  function wireModal() {
    qs("refPwClose").onclick = goBackToCoachCorner;
    qs("refPwCancel").onclick = goBackToCoachCorner;

    qs("refPwOk").onclick = () => {
      const v = qs("refPwInput").value.trim();
      if (v !== PASSWORD) return wrongPassword();
      unlock();
    };

    qs("refPwInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const v = qs("refPwInput").value.trim();
        if (v !== PASSWORD) return wrongPassword();
        unlock();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        goBackToCoachCorner();
      }
    });

    window.addEventListener("click", (e) => {
      if (e.target === qs("refPwModal")) {
        goBackToCoachCorner();
      }
    });
  }

  // =====================================================
  //  UI – Refleksjoner
  // =====================================================
function openCoachRefleksjon() {
  const ref = qs("refContent");
  if (!ref) return;

  // 🔴 TVING FULL VISNING HVER GANG SIDEN ÅPNES
  ref.hidden = false;

  // 🔴 Tving også child-elementer synlige
  ref.querySelectorAll("[hidden]").forEach(el => {
    el.hidden = false;
  });

  const pending = qs("pendingContent");
  if (pending) pending.hidden = true;

  // 🔁 Alltid re-initialiser UI
  const unlocked = sessionStorage.getItem(SESSION_KEY) === "1";

  if (unlocked) {
    initCoachRefleksjonUI();
  } else {
    openModal();
  }
}

async function initCoachRefleksjonUI() {

  const approvalToggle = document.getElementById("approvalToggle");
  const approvalDropdown = document.getElementById("approvalDropdown");

  if (approvalToggle && approvalDropdown) {
    approvalToggle.onclick = () => {
      approvalDropdown.hidden = !approvalDropdown.hidden;
    };
  }
  await loadPendingUsersUI();

  const selPlayer = qs("refPlayerSelect");
  const selWeek = qs("refWeekSelect");
  const list = qs("refList");

    selPlayer.innerHTML = `<option value="" selected>Velg spiller</option>`;
    selWeek.innerHTML = `<option value="" selected>Alle</option>`;
    list.innerHTML = `<div class="ref-empty">Velg en spiller.</div>`;

// Hent kun spillere som faktisk har refleksjoner
const snap = await getDocs(collection(db, "refleksjoner"));
console.log("ANTALL REFLEKSJONS-DOK:", snap.size);
snap.forEach(d => {
  console.log("REF DOC ID:", d.id);
});

const seen = new Map();

for (const d of snap.docs) {
  const playerId = d.id;

  // hent brukerdokumentet for navn
  const userSnap = await getDoc(doc(db, "users", playerId));
  const seasonGoal = userSnap.exists() ? userSnap.data().seasonGoal : "";
  if (!userSnap.exists()) continue;

  const user = userSnap.data();
  if (user.approved !== true) continue; // ekstra sikkerhet

  seen.set(playerId, user.name || user.email || "Ukjent");
}

  // 👇 FYLL SPILLER-DROPDOWN MED SPILLERE SOM HAR REFLEKSJONER
  for (const [uid, name] of seen) {
    const op = document.createElement("option");
    op.value = uid;
    op.textContent = name;
    selPlayer.appendChild(op);
  }

    selPlayer.onchange = () => loadAndRenderRefleksjoner(selPlayer.value);
    selWeek.onchange = () => loadAndRenderRefleksjoner(selPlayer.value);

    const lockBtn = qs("refLockBtn");
    if (lockBtn) {
      lockBtn.onclick = () => {
        sessionStorage.removeItem(SESSION_KEY);
        qs("refContent").hidden = true;
        openModal();
      };
    }
  }

async function loadAndRenderRefleksjoner(playerId) {
	
  await ensureAuth();
  // 🔹 Hent sesongmål for spilleren
let seasonGoal = "";

const userSnap = await getDoc(doc(db, "users", playerId));
if (userSnap.exists()) {
  seasonGoal = userSnap.data().seasonGoal || "";
}

  const list = qs("refList");
  const selWeek = qs("refWeekSelect");

  // 🔒 Ingen spiller valgt → "lukk" visning
  if (!playerId) {
    selWeek.innerHTML = `<option value="" selected>Alle</option>`;
    list.innerHTML = `
      <div class="ref-empty">
        Velg en spiller for å se refleksjoner.
      </div>
    `;
    return;
  }
  
    const entries = await fetchRefleksjoner(playerId);

    // bygg uke-filter
    selWeek.innerHTML = `<option value="" selected>Alle</option>`;
    [...new Set(entries.map(e => String(e.week)))]
      .sort((a, b) => Number(b) - Number(a))
      .forEach(w => {
        const op = document.createElement("option");
        op.value = w;
        op.textContent = `Uke ${w}`;
        selWeek.appendChild(op);
      });

    const weekFilter = selWeek.value;
    const filtered = weekFilter
      ? entries.filter(e => String(e.week) === weekFilter)
      : entries;

    if (!filtered.length) {
      list.innerHTML = `<div class="ref-empty">Ingen refleksjoner funnet.</div>`;
      return;
    }

    list.innerHTML = filtered.map(e => `
      <div class="ref-item">
        <div class="ref-item-top">
          <div class="ref-item-title">
            Uke ${safe(e.week)} – ${safe(e.dateNor)}
          </div>
        </div>

        <div class="ref-kv">
<div class="season-goal-line">
  <strong>Mål for sesongen:</strong> ${seasonGoal ? safe(seasonGoal) : "—"}
</div>
          <div><span class="k">Innsats:</span> ${safe(e.effort)}</div>
          <div><span class="k">Energi:</span> ${safe(e.energy)}</div>
          <div><span class="k">Jobbet med fokus:</span> ${safe(e.workedOnSeasonGoal)}</div>
          ${e.goodThing ? `<div><span class="k">Fornøyd med:</span> ${safe(e.goodThing)}</div>` : ``}
          ${e.improveThing ? `<div><span class="k">Neste uke:</span> ${safe(e.improveThing)}</div>` : ``}
          ${e.coachNote ? `<div><span class="k">Til trener:</span> ${safe(e.coachNote)}</div>` : ``}
        </div>
      </div>
    `).join("");
  }

 // =====================================================
//  Auth listener (kun én gang, SPA-sikker)
// =====================================================
let authUnsub = null;

function ensureAuthListener() {
  if (authUnsub) return; // allerede registrert

  authUnsub = onAuthStateChanged(auth, async (user) => {
    const indicator = document.getElementById("authIndicator");

    if (indicator) {
      indicator.classList.toggle("is-online", !!user);
    }

    console.log("AUTH (ref):", user);

    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return;

    const data = snap.data();
    if (data.role !== "coach") {
      console.warn("⛔ Ikke trener");
      return;
    }

    console.log("✅ Trener bekreftet");
  });
}

// =====================================================
//  Eksponert init for SPA-navigasjon
// =====================================================
window.initRefleksjonPage = function () {
  console.log("🔁 initRefleksjonPage()");

  // 🔑 Sørg for at auth-lytteren er aktiv
  ensureAuthListener();

  // 🔑 Koble modal-knapper hver gang siden åpnes
  wireModal();

  const unlocked = sessionStorage.getItem(SESSION_KEY) === "1";

  if (unlocked) {
    const ref = document.getElementById("refContent");
    if (ref) {
      ref.hidden = false;
      ref.querySelectorAll("[hidden]").forEach(el => {
        el.hidden = false;
      });
    }
    initCoachRefleksjonUI();
  } else {
    openModal();
  }
};

})();
