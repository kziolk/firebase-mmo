import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database"
import { getFirestore } from "firebase/firestore"

let app
export let db, dbRef, playersRef, fs;

export async function initDB() {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    dbRef = ref(db);
    playersRef = ref(db, '2_0/players');
    fs = getFirestore(app);
}

/*
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const dbRef = ref(db);
export const playersRef = ref(db, '2_0/players');

export const fs = getFirestore(app);
*/