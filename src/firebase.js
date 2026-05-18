import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
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

// Initialize Firebase Core Instance
const app = initializeApp(firebaseConfig);

// 🔥 MODERN OFFLINE PERSISTENCE (Replaces the deprecated enableIndexedDbPersistence)
// This enables secure offline snapshot tracking and keeps multi-tab queries in sync perfectly
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

export const auth = getAuth(app);
export const functions = getFunctions(app);

// Optional helper (recommended for your system consistency)
export const getCurrentUserId = () => auth.currentUser?.uid;

export { app };
