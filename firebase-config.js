import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlr4sme2ialTSEjkO_SAxHIkfbq66jMX0",
  authDomain: "ai-horizons-54ab9.firebaseapp.com",
  projectId: "ai-horizons-54ab9",
  storageBucket: "ai-horizons-54ab9.firebasestorage.app",
  messagingSenderId: "1087064454163",
  appId: "1:1087064454163:web:b04cefb2d4d995b9e23be6",
  measurementId: "G-0VRZT968M5"
};

const app = initializeApp(firebaseConfig);

// Analytics is unavailable in some local or privacy-restricted browsers.
isSupported().then((supported) => {
  if (supported) getAnalytics(app);
});

export { app };
