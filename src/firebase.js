// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// ۲. ساخت نمونه Auth و خروجی گرفتن نام‌دار (Named Export)
export const auth = getAuth(app);

// ۳. (اختیاری) خروجی پیش‌فرض
export default app;

auth.settings.appVerificationDisabledForTesting = false;
