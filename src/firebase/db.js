
import { db } from './config';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    onSnapshot
} from "firebase/firestore";

export const addData = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log("Document written with ID: ", docRef.id);
        return docRef;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const getData = async (collectionName) => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw e;
    }
};

// Helper to subscribe to real-time updates for a collection
export const subscribeToCollection = (collectionName, callback) => {
    const q = query(collection(db, collectionName));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        callback(data);
    });
    return unsubscribe;
}
