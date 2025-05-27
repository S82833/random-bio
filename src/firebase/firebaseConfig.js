// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAr0QpoKdBnswcFFldNBz2Bomt2KML3wY8",
  authDomain: "random-bio.firebaseapp.com",
  projectId: "random-bio",
  storageBucket: "random-bio.firebasestorage.app",
  messagingSenderId: "86002291598",
  appId: "1:86002291598:web:248473e3da7387d1594adf"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
