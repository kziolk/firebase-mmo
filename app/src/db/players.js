import { db, fs, playersRef } from "./init.js"
import { child, get, onChildAdded, onChildChanged, onChildRemoved, onValue, ref } from "firebase/database"
import { playersManager } from "../entities/playersManager.js";
import { clientUid } from "./auth.js";
import { combat } from "../combat/combat.js";
import { eq } from "../eq/eq.js";
import { player } from "../entities/player.js";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const playerOutfitSubs = {}

export function startPlayersListener() {
    onChildAdded(playersRef, (pSnap) => {
        if (pSnap.key != clientUid) {
            playersManager.setOtherPlayerMovement(pSnap.key, pSnap.val())
            console.log("added listener for new player")
            if (!playerOutfitSubs[pSnap.key])
                playerOutfitSubs[pSnap.key] = onSnapshot(doc(fs, "playerOutfits", pSnap.key), (doc) => {
                    console.log("Current data: ", doc.data());
                    playersManager.setOtherPlayerOutfit(pSnap.key, doc.data())
                });
        }
    });

    onChildChanged(playersRef, (pSnap) => {
        if (pSnap.key != clientUid)
            playersManager.setOtherPlayerMovement(pSnap.key, pSnap.val())
    });
    
    onChildRemoved(playersRef, (pSnap) => {
        playersManager.removeOtherPlayer(pSnap.key)
        console.log("stopping listener for " + pSnap.key)
        playerOutfitSubs[pSnap.key]()
    });

    onValue(ref(db, `2_0/playersStates/${clientUid}`), stateSnap => {
        if (stateSnap.val()) {
            combat.applyStateOnPlayer(stateSnap.val())
        }
    })

    get(child(ref(db), '2_0/players')).
    then(pSnap => {
        if(pSnap.exists()) {
            let snapData = pSnap.val()
            Object.keys(snapData).forEach((pUid) => {
                if (pUid != clientUid && !playerOutfitSubs[pUid])
                playerOutfitSubs[pUid] = onSnapshot(doc(fs, "playerOutfits", pUid), (doc) => {
                    console.log("Current data: ", doc.data());
                    playersManager.setOtherPlayerOutfit(pUid, doc.data())
                });
            })
        }
    })
}

export function savePlayerVisuals() {
    let head = player.sprite.sprites["head"]
    let torso = player.sprite.sprites["torso"]
    let legs = player.sprite.sprites["legs"]
    let item = eq.hotbar.items[eq.hotbar.selectedId]
    let itemName
    if (!item) itemName = 0
    else if (item.purpose == "weapon") itemName = item.name
    else itemName = "holdable_" + item.name 

    setDoc(doc(fs, 'playerOutfits', clientUid), {
        head: (head) ? head.name : 0, 
        torso: (torso) ? torso.name : 0, 
        legs: (legs) ? legs.name : 0, 
        helmet: (eq.armor.items[0]) ? eq.armor.items[0].name : 0, 
        chestplate: (eq.armor.items[1]) ? eq.armor.items[1].name : 0, 
        leggings: (eq.armor.items[2]) ? eq.armor.items[2].name : 0, 
        boots: (eq.armor.items[3]) ? eq.armor.items[3].name : 0, 
        weapon_r: itemName
    })
}