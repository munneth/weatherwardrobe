// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "weatherwardrobe-496c1.firebaseapp.com",
  projectId: "weatherwardrobe-496c1",
  storageBucket: "weatherwardrobe-496c1.firebasestorage.app",
  messagingSenderId: "676954669922",
  appId: "1:676954669922:web:0fcb25e41ea3f5ce6a223b",
  measurementId: "G-FB48LSVY3K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export { app, analytics, auth };