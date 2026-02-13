// Importer Firebase-moduler
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";



// Firebase konfigurasjon
export const firebaseConfig = {
  apiKey: "AIzaSyAKZMu2HZPmmoZ1fFT7DNA9Q6ystbKEPgE",
  authDomain: "samnanger-g14-f10a1.firebaseapp.com",
  projectId: "samnanger-g14-f10a1",
  storageBucket: "samnanger-g14-f10a1.firebasestorage.app",
  messagingSenderId: "926427862844",
  appId: "1:926427862844:web:5e6d11bb689c802d01b039",
  measurementId: "G-EJL3YYC63R"
};

// Start Firebase
export const app = initializeApp(firebaseConfig);

// Firestore-tilkobling
export const db = getFirestore(app);

window.db = db;
window.firestore = db;
window.firestoreCollection = collection;
window.firestoreGetDocs = getDocs;
window.firestoreDoc = doc;
window.firestoreGetDoc = getDoc;
window.firestoreSetDoc = setDoc;


