
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAIrv9U7JK9Kf2bsiZ-UizlUD-D8qfWtlw",
    authDomain: "flowstack-46f06.firebaseapp.com",
    projectId: "flowstack-46f06",
    storageBucket: "flowstack-46f06.firebasestorage.app",
    messagingSenderId: "935550968714",
    appId: "1:935550968714:web:68aa056748abbe2b9c5e73",
    measurementId: "G-7ZZF307WXB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
