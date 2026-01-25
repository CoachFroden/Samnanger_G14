/* =========================
   LAGRE KAMPANALYSE
========================= */

const lagreBtn = document.getElementById("ka-lagre");

lagreBtn.addEventListener("click", async () => {
  const dato = document.getElementById("ka-dato").value;
  const motstander = document.getElementById("ka-motstander").value.trim();

  if (!dato || !motstander) {
    alert("Dato og motstander må fylles ut");
    return;
  }

  // Samme mønster som evalueringer: fast dokument-ID
  const docId = `${dato}_${motstander}`;

  const obj = {
    dato,
    motstander,
    type: document.getElementById("ka-type").value,

    fungerteBra: document.getElementById("ka-bra").value.trim(),
    jobbeVidere: document.getElementById("ka-jobbe").value.trim(),
    angrep: document.getElementById("ka-angrep").value.trim(),
    forsvar: document.getElementById("ka-forsvar").value.trim(),
    overganger: document.getElementById("ka-overganger").value.trim(),
    fokusVidere: document.getElementById("ka-fokus").value.trim(),
    refleksjon: document.getElementById("ka-refleksjon").value.trim(),

    oppdatert: new Date().toISOString()
  };

  try {
    await window.firestore.setDoc(
      window.firestore.doc(window.db, "kampanalyser", docId),
      obj
    );

    alert("Kampanalyse lagret i Firebase!");
    hentKampanalyser(); // 🔄 oppdater visningen

  } catch (err) {
    console.error(err);
    alert("Feil ved lagring til Firebase");
  }
});

/* =========================
   HENT / VIS KAMPANALYSER
========================= */

async function hentKampanalyser() {
  const liste = document.getElementById("ka-historikk");

  if (!liste) {
    console.error("Fant ikke ka-historikk");
    return;
  }

  liste.innerHTML = "<li>Laster kampanalyser…</li>";

  try {
    const snapshot = await window.firestore.getDocs(
      window.firestore.collection(window.db, "kampanalyser")
    );

    if (snapshot.empty) {
      liste.innerHTML = "<li>Ingen kampanalyser lagret ennå.</li>";
      return;
    }

    liste.innerHTML = "";

    snapshot.forEach(docSnap => {
      const data = docSnap.data();

      const li = document.createElement("li");
      li.className = "ka-card";

      li.innerHTML = `
        <div class="ka-card-date">${data.dato}</div>
        <div class="ka-card-main">
          <div class="ka-card-opponent">${data.motstander}</div>
          <div class="ka-card-type">${data.type || ""}</div>
        </div>
      `;

      // Klar for modal / redigering senere
      li.addEventListener("click", () => {
  åpneDetaljModal(data);
});

      liste.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    liste.innerHTML = "<li>Kunne ikke hente kampanalyser.</li>";
  }
}

/* =========================
   LAST HISTORIKK VED ÅPNING
========================= */

/* =========================
   MODAL – ÅPNE / LUKKE
========================= */

const modal = document.getElementById("ka-modal");
const openBtn = document.getElementById("ka-open-modal");
const closeBtn = document.getElementById("ka-close-modal");

// Åpne modal
openBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// Lukk med X
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Lukk ved klikk utenfor boksen
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

/* =========================
   LAST HISTORIKK VED ÅPNING
========================= */

hentKampanalyser();

const detailModal = document.getElementById("ka-detail-modal");
const detailClose = document.getElementById("ka-detail-close");

detailClose.addEventListener("click", () => {
  detailModal.classList.add("hidden");
});

detailModal.addEventListener("click", (e) => {
  if (e.target === detailModal) {
    detailModal.classList.add("hidden");
  }
});
function åpneDetaljModal(data) {
  document.getElementById("ka-detail-title").textContent =
    `${data.dato} – ${data.motstander}`;

  document.getElementById("ka-detail-type").textContent =
    data.type || "";

  document.getElementById("ka-detail-bra").textContent =
    data.fungerteBra || "-";

  document.getElementById("ka-detail-jobbe").textContent =
    data.jobbeVidere || "-";

  document.getElementById("ka-detail-angrep").textContent =
    data.angrep || "-";

  document.getElementById("ka-detail-forsvar").textContent =
    data.forsvar || "-";

  document.getElementById("ka-detail-overganger").textContent =
    data.overganger || "-";

  document.getElementById("ka-detail-fokus").textContent =
    data.fokusVidere || "-";

  document.getElementById("ka-detail-refleksjon").textContent =
    data.refleksjon || "-";

  detailModal.classList.remove("hidden");
}
