import { db, playersRef } from "./init.js"
import { onChildAdded, onChildChanged, onChildRemoved, onValue, ref } from "firebase/database"
import { playersManager } from "../entities/playersManager.js";
import { clientUid } from "./auth.js";
import { combat } from "../combat/combat.js";

export function startPlayersListener() {
    onChildAdded(playersRef, (pSnap) => {
        if (pSnap.key != clientUid)
            playersManager.setOtherPlayer(pSnap.key, pSnap.val());
    });
    
    onChildChanged(playersRef, (pSnap) => {
        if (pSnap.key != clientUid)
            playersManager.setOtherPlayer(pSnap.key, pSnap.val());
    });
    
    onChildRemoved(playersRef, (pSnap) => {
        playersManager.removeOtherPlayer(pSnap.key);
    });

    onValue(ref(db, `2_0/playersStates/${clientUid}`), stateSnap => {
        if (stateSnap.val()) {
            combat.applyStateOnPlayer(stateSnap.val())
        }
    })
}