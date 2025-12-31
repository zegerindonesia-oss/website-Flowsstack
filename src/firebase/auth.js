import { auth, db } from './config';
import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "firebase/firestore";

const provider = new GoogleAuthProvider();

export const registerWithEmail = async (email, password, name) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Update Profile Display Name
        await updateProfile(user, { displayName: name });

        // Create User Doc
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: name,
            photoURL: null, // No photo for email auth initially
            role: 'user',
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
        });

        return user;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
}

export const loginWithEmail = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Update last login
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            lastLogin: serverTimestamp()
        }, { merge: true });

        return user;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user document exists
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // Create new user document
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: 'user', // Default role
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp()
            });
            console.log("New user document created in Firestore.");
        } else {
            // Update last login
            await setDoc(userRef, {
                lastLogin: serverTimestamp()
            }, { merge: true });
            console.log("Existing user logged in, lastLogin updated.");
        }

        return user;
    } catch (error) {
        console.error("Error logging in with Google:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};

export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};
