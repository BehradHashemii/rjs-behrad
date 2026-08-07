// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAHLhxi20Wnp7wRLgwp4hgxREKR1LPMqWc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "behrad-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "behrad-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "behrad-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1091333443178",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1091333443178:web:151d35ab4f40983d864413",
  measurementId: "G-HRK85RP64Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth & Firestore Exports
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

