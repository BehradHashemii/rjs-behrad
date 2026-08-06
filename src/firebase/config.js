// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// مقادیر زیر را با مقادیری که از کنسول فایربیس گرفتید جایگزین کنید

export const firebaseConfig = {
  apiKey: "AIzaSyAHLhxi20Wnp7wRLgwp4hgxREKR1LPMqWc",
  authDomain: "behrad-app.firebaseapp.com",
  projectId: "behrad-app",
  storageBucket: "behrad-app.firebasestorage.app",
  messagingSenderId: "1091333443178",
  appId: "1:1091333443178:web:151d35ab4f40983d864413",
  measurementId: "G-HRK85RP64Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// خروجی گرفتن از سرویس‌ها برای استفاده در سایر فایل‌ها
export const auth = getAuth(app);
export const db = getFirestore(app);
