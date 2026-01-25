// ===================================================================
//  Trenerhjørnet – Passordbeskyttelse og evalueringer
// ===================================================================

(function () {
  "use strict";

async function fetchPlayers() {
  const colRef = window.firestore.collection(window.db, "spillere");
  const snap = await window.firestore.getDocs(colRef);

  return snap.docs.map(d => ({
    id: d.id,
    navn: d.data().navn
  }));
}

  // =============================================================
  //  PASSORDMODAL (evalPwModal)
  // =============================================================

  // Riktig passord
  function getEvalPassword() {
    return "samnanger2025";
  }

  // Åpne passordmodal
  function openEvalPw() {
    const m = document.getElementById("evalPwModal");
    if (!m) return;

    m.classList.add("show");
    m.setAttribute("aria-hidden", "false");

    document.getElementById("evalPwInput").value = "";
    document.getElementById("evalPwError").style.display = "none";

    document.body.style.overflow = "hidden";
  }

  // Lukk passordmodal
  function closeEvalPw() {
    const m = document.getElementById("evalPwModal");
    if (!m) return;

    m.classList.remove("show");
    m.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
  }

function connectEvalButton() {
    const btn = document.getElementById("BtnEvaluering");
    if (!btn) return setTimeout(connectEvalButton, 100);
    btn.onclick = openEvalPw;
}
connectEvalButton();


// Avbryt-knapp
const cancelBtn = document.getElementById("evalPwCancel");
if (cancelBtn) cancelBtn.onclick = closeEvalPw;

// OK-knapp → sjekk passord (GUARDED)
const okBtn = document.getElementById("evalPwOk");
if (okBtn) okBtn.onclick = () => {
  const v = document.getElementById("evalPwInput").value.trim();

  if (v !== getEvalPassword()) {
    const err = document.getElementById("evalPwError");

    err.style.display = "block";
    err.style.opacity = "1";

    setTimeout(() => {
      err.style.transition = "opacity 0.4s ease";
      err.style.opacity = "0";

      setTimeout(() => {
        err.style.display = "none";
      }, 400);
    }, 2000);

    return;
  }

  document.getElementById("evalPwError").style.display = "none";
  closeEvalPw();
  openEvalPlanModal();
};


  // =============================================================
  //  EVALUERINGSMODAL (eval-plan-modal)
  // =============================================================

  function openEvalPlanModal() {
    const m = document.getElementById("eval-plan-modal");
    if (!m) return;

    m.classList.add("show");
    m.style.display = "flex";
    document.body.style.overflow = "hidden";

    // Fyll spillerlisten
  const sel = document.getElementById("eval-player-select");
sel.innerHTML = "";

const placeholder = document.createElement("option");
placeholder.value = "";
placeholder.textContent = "Velg spiller";
placeholder.disabled = true;
placeholder.selected = true;
sel.appendChild(placeholder);

fetchPlayers().then(players => {
  players.forEach(p => {
    const op = document.createElement("option");
    op.value = p.id || p.navn;
    op.textContent = p.navn;
    sel.appendChild(op);
  });

  sel.onchange = () => loadEval(sel.value);
});

    loadEval(sel.value);

    sel.onchange = () => loadEval(sel.value);

    document.getElementById("eval-save").onclick = saveEval;
    document.getElementById("eval-plan-close").onclick = closeEvalPlanModal;
  }

  function closeEvalPlanModal() {
    const m = document.getElementById("eval-plan-modal");
    if (!m) return;

    m.classList.remove("show");
    m.style.display = "none";
    document.body.style.overflow = "";
  }

  // Hent lagret evaluering
async function loadEval(name) {
  if (!name) return;

  const snap = await window.firestore.getDoc(
    window.firestore.doc(window.db, "evalueringer", name)
  );

  if (!snap.exists()) {
    document.getElementById("eval-tek1").value = "";
    document.getElementById("eval-tek2").value = "";
    document.getElementById("eval-tak1").value = "";
    document.getElementById("eval-tak2").value = "";
    document.getElementById("eval-fys1").value = "";
    document.getElementById("eval-fys2").value = "";
    document.getElementById("eval-kommentar").value = "";
    return;
  }

  const d = snap.data();

  document.getElementById("eval-tek1").value = d.tek1 || "";
  document.getElementById("eval-tek2").value = d.tek2 || "";
  document.getElementById("eval-tak1").value = d.tak1 || "";
  document.getElementById("eval-tak2").value = d.tak2 || "";
  document.getElementById("eval-fys1").value = d.fys1 || "";
  document.getElementById("eval-fys2").value = d.fys2 || "";
  document.getElementById("eval-kommentar").value = d.kommentar || "";
}


  // Lagre evaluering
async function saveEval() {
  const name = document.getElementById("eval-player-select").value;
  if (!name) return alert("Velg en spiller.");

  const obj = {
    tek1: document.getElementById("eval-tek1").value.trim(),
    tek2: document.getElementById("eval-tek2").value.trim(),
    tek3: document.getElementById("ovel-tek").value.trim(),
    tak1: document.getElementById("eval-tak1").value.trim(),
    tak2: document.getElementById("eval-tak2").value.trim(),
    tak3: document.getElementById("ovel-tak").value.trim(),
    fys1: document.getElementById("eval-fys1").value.trim(),
    fys2: document.getElementById("eval-fys2").value.trim(),
    fys3: document.getElementById("ovel-fys").value.trim(),
    kommentar: document.getElementById("eval-kommentar").value.trim(),
    oppdatert: new Date().toISOString(),
  };

  try {
    await window.firestore.setDoc(
      window.firestore.doc(window.db, "evalueringer", name),
      obj
    );

    alert("Evaluering lagret i Firebase!");
  } catch (err) {
    console.error(err);
    alert("Feil ved lagring til Firebase!");
  }

  // nullstill feltene
  document.getElementById("eval-tek1").value = "";
  document.getElementById("eval-tek2").value = "";
  document.getElementById("ovel-tek").value = "";

  document.getElementById("eval-tak1").value = "";
  document.getElementById("eval-tak2").value = "";
  document.getElementById("ovel-tak").value = "";

  document.getElementById("eval-fys1").value = "";
  document.getElementById("eval-fys2").value = "";
  document.getElementById("ovel-fys").value = "";

  document.getElementById("eval-kommentar").value = "";
}

/* -----------------------------------------------------
   LUKK MODALER VED KLIKK UTENFOR
----------------------------------------------------- */

// Lukk passordmodal når man klikker utenfor
window.addEventListener("click", function (event) {
  const modal = document.getElementById("evalPwModal");
  if (modal && event.target === modal) {
    closeEvalPw();
  }
});

// Lukk evalueringsmodal når man klikker utenfor
window.addEventListener("click", function (event) {
  const modal = document.getElementById("eval-plan-modal");
  if (modal && event.target === modal) {
    closeEvalPlanModal();
  }
});


})();
