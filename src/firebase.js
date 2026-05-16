import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAfq6-39HiPKQdU35w-laqo0WcBSWdLzpg",
  authDomain: "medishareng-5a742.firebaseapp.com",
  projectId: "medishareng-5a742",
  storageBucket: "medishareng-5a742.appspot.com",
  messagingSenderId: "1011449021082",
  appId: "1:1011449021082:web:0da40df5ace874f109d523",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

// 🔥 ENABLE OFFLINE PERSISTENCE (VERY IMPORTANT FOR REALTIME APPS)
try {
  enableIndexedDbPersistence(db);
} catch (err) {
  console.warn("Firestore persistence not enabled:", err.code);
}

// Optional helper (recommended for your system consistency)
export const getCurrentUserId = () => auth.currentUser?.uid;

export { app };
