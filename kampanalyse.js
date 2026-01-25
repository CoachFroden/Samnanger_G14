import { db } from "../js/firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lagreBtn = document.getElementById("ka-lagre");
const historikkListe = document.getElementById("ka-historikk");

/* === LAGRE KAMPANALYSE === */
lagreBtn.addEventListener("click", async () => {
  const data = {
    dato: document.getElementById("ka-dato").value,
    motstander: document.getElementById("ka-motstander").value.trim(),
    type: document.getElementById("ka-type").value,

    fungerteBra: document.getElementById("ka-bra").value.trim(),
    jobbeVidere: document.getElementById("ka-jobbe").value.trim(),
    angrep: document.getElementById("ka-angrep").value.trim(),
    forsvar: document.getElementById("ka-forsvar").value.trim(),
    overganger: document.getElementById("ka-overganger").value.trim(),
    fokusVidere: document.getElementById("ka-fokus").value.trim(),
    refleksjon: document.getElementById("ka-refleksjon").value.trim(),

    createdAt: serverTimestamp()
  };

  if (!data.dato || !data.motstander) {
    alert("Dato og motstander må fylles ut");
    return;
  }

  try {
    await addDoc(collection(db, "kampanalyser"), data);
    alert("Kampanalyse lagret");
    tømSkjema();
    hentAnalyser();
  } catch (err) {
    console.error("Feil ved lagring:", err);
    alert("Kunne ikke lagre kampanalyse");
  }
});

/* === HENT TIDLIGERE ANALYSER === */
async function hentAnalyser() {
  historikkListe.innerHTML = "";

  const q = query(
    collection(db, "kampanalyser"),
    orderBy("dato", "desc")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const d = doc.data();
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${d.dato} – ${d.motstander}</strong><br>
      <em>${d.type}</em><br>
      Fokus: ${d.fokusVidere || "-"}
    `;

    historikkListe.appendChild(li);
  });
}

/* === TØM FELTER === */
function tømSkjema() {
  document
    .querySelectorAll(".kampanalyse-form input, .kampanalyse-form textarea")
    .forEach(el => el.value = "");
}

/* === LAST HISTORIKK VED ÅPNING === */
hentAnalyser();
