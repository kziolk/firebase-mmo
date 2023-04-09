import { ref, onDisconnect } from "firebase/database"
/*import { doc, getDoc, setDoc } from "firebase/firestore"*/
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

import { db/*, fs*/ } from "./init.js"

export var playerRef = 0;
export var clientUid = 0;
const auth = getAuth();

export function authenticateUser() {
    signInAnonymously(auth)
    .then(() => {
    // Signed in..
        //could set up player here
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(error);
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        clientUid = user.uid;
        playerRef = ref(db, `2_0/players/${clientUid}`);
        console.log("user logged in");
        onDisconnect(ref(db, `players/${clientUid}/loggedIn`)).set(false);
    } else {
        // User is signed out
        // ... stop the game
        //character.set(players[myUid]);
        //character.logout();
        //console.log("USER LOGGED OUT");
    }
});