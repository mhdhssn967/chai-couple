// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getFirestore,
  serverTimestamp,
  doc,
  collection,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  runTransaction,
  query,
  where,
  orderBy
} from "firebase/firestore";

import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUx6tM4JF0vs7V21T1um-Wgskji4MksLs",
  authDomain: "chai-couple.firebaseapp.com",
  projectId: "chai-couple",
  storageBucket: "chai-couple.firebasestorage.app",
  messagingSenderId: "2737184288",
  appId: "1:2737184288:web:d3eb2ca550bdb193cf6645",
  measurementId: "G-ZKEBLKDCJM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);

export {
  serverTimestamp,
  doc,
  collection,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  runTransaction,
  query,
  where,
  orderBy,
  signInWithEmailAndPassword,
  signOut,
};
