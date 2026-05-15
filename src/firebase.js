import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
