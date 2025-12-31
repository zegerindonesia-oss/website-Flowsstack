
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA_I3CGa7RlNpMs0f43QeDadFdwbG5dglE",
    authDomain: "flowassist-7ac56.firebaseapp.com",
    projectId: "flowassist-7ac56",
    storageBucket: "flowassist-7ac56.firebasestorage.app",
    messagingSenderId: "321012336628",
    appId: "1:321012336628:web:3f7cc7b4e229d06ed2dba1",
    measurementId: "G-STWCG7VLGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
