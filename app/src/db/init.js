import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database"
import { getFirestore } from "firebase/firestore"
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const dbRef = ref(db);
export const playersRef = ref(db, '2_0/players');

export const fs = getFirestore(app);