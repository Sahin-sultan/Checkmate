
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC-0FZx0Fp1gJGJItDD1OMGqGOFTPl4yz8",
    authDomain: "checkmate-f46a7.firebaseapp.com",
    projectId: "checkmate-f46a7",
    storageBucket: "checkmate-f46a7.firebasestorage.app",
    messagingSenderId: "168601292938",
    appId: "1:168601292938:web:c78c77078337c1eedd9d73",
    measurementId: "G-J5LQPFBS39"
};

import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
