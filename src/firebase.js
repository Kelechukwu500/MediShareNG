import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 

const firebaseConfig = {
  apiKey: "AIzaSyAfq6-39HiPKQdU35w-laqo0WcBSWdLzpg",
  authDomain: "medishareng-5a742.firebaseapp.com",
  projectId: "medishareng-5a742",
  storageBucket: "medishareng-5a742.firebasestorage.app",
  messagingSenderId: "1011449021082",
  appId: "1:1011449021082:web:0da40df5ace874f109d523",
};

const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

//  Authentication 
export const auth = getAuth(app);
