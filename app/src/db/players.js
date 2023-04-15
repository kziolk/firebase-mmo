import { db, fs, playersRef } from "./init.js"
import { child, get, onChildAdded, onChildChanged, onChildRemoved, onValue, ref } from "firebase/database"
import { playersManager } from "../entities/playersManager.js";
import { clientUid } from "./auth.js";
import { combat } from "../combat/combat.js";
import { eq } from "../eq/eq.js";
import { player } from "../entities/player.js";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { dbPathTo } from "./gameDatabase.js";

const playerOutfitSubs = {}

export function startPlayersListener() {
    onChildAdded(playersRef, (pSnap) => {
        if (pSnap.key != clientUid) {
            console.log("On child added!")
            playersManager.setOtherPlayerMovement(pSnap.key, pSnap.val())
            console.log("added listener for new player " + pSnap.key)
            if (!playerOutfitSubs[pSnap.key])
                playerOutfitSubs[pSnap.key] = onSnapshot(doc(fs, "playerOutfits", pSnap.key), (doc) => {
                    console.log("Got spriteParts after child added!")
                    if(doc.data()) playersManager.setOtherPlayerSpriteParts(pSnap.key, doc.data())
                });
        }
    });

    onChildChanged(playersRef, (pSnap) => {
        if (pSnap.key != clientUid) {
            playersManager.setOtherPlayerMovement(pSnap.key, pSnap.val())
        }
    });
    
    onChildRemoved(playersRef, (pSnap) => {
        if (pSnap.key != clientUid) {
            playersManager.removeOtherPlayer(pSnap.key)
            console.log("stopping listener for " + pSnap.key)
            playerOutfitSubs[pSnap.key]()
            delete playerOutfitSubs[pSnap.key]
        }
    });

    onValue(ref(db, `${dbPathTo.playerReceivedAttacks}/${clientUid}`), stateSnap => {
        if (stateSnap.val()) {
            combat.applyAttackOnPlayer(stateSnap.val())
        }
    })
}

let oldPlayerDataVisualsStr = "boop"
export function savePlayerVisuals() {
    let head = player.sprite.sprites["head"]
    let torso = player.sprite.sprites["torso"]
    let legs = player.sprite.sprites["legs"]
    let item = eq.hotbar.items[eq.hotbar.selectedId]
    let itemName
    if (!item) itemName = 0
    else if (item.purpose == "weapon") itemName = item.name
    else itemName = "holdable_" + item.name

    const newPlayerDataVisuals = {
        head: (head) ? head.name : 0, 
        torso: (torso) ? torso.name : 0, 
        legs: (legs) ? legs.name : 0, 
        helmet: (eq.armor.items[0]) ? eq.armor.items[0].name : 0, 
        chestplate: (eq.armor.items[1]) ? eq.armor.items[1].name : 0, 
        leggings: (eq.armor.items[2]) ? eq.armor.items[2].name : 0, 
        boots: (eq.armor.items[3]) ? eq.armor.items[3].name : 0, 
        weapon_r: itemName
    }
    const newPlayerDataVisualsStr = JSON.stringify(newPlayerDataVisuals)

    if (oldPlayerDataVisualsStr != newPlayerDataVisualsStr) {
        setDoc(doc(fs, 'playerOutfits', clientUid), newPlayerDataVisuals)
        oldPlayerDataVisualsStr = newPlayerDataVisualsStr
    }
}