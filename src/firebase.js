import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

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

// Firestore with persistence
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

// Auth
export const auth = getAuth(app);

// Functions
export const functions = getFunctions(app, "us-central1");

// Emulator Connection (Only in Development)
const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

if (isLocal) {
  try {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    console.log("🔥 Connected to Firebase Functions Emulator");
  } catch (error) {
    console.error("Failed to connect to Functions Emulator:", error);
  }
}

export default app;
