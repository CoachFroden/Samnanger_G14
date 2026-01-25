import { db } from "../js/firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("kampanalyseForm");
const liste = document.getElementById("analyseListe");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "kampanalyser"), {
    dato: dato.value,
    motstander: motstander.value,
    type: type.value,
    fungerteBra: fungerteBra.value,
    jobbeVidere: jobbeVidere.value,
    angrep: angrep.value,
    forsvar: forsvar.value,
    overganger: overganger.value,
    fokusVidere: fokusVidere.value,
    refleksjon: refleksjon.value,
    createdAt: serverTimestamp()
  });

  form.reset();
  hentAnalyser();
});

async function hentAnalyser() {
  liste.innerHTML = "";

  const q = query(
    collection(db, "kampanalyser"),
    orderBy("dato", "desc")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${data.dato} – ${data.motstander}</strong><br>
      Fokus: ${data.fokusVidere}
    `;
    liste.appendChild(li);
  });
}

hentAnalyser();
