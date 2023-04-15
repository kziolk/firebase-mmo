import { doc, setDoc, getDoc } from "firebase/firestore"
import { clientUid } from "./auth"
import { fs } from "./init"
import { eq } from "../eq/eq"
import { player } from "../entities/player"

export async function getEq() {
    let docSnap = await getDoc(doc(fs, 'playerEqs', clientUid))
    if (docSnap.exists()) {
        console.log("Downloaded EQ From Database")
        console.log(docSnap.data())
        eq.hotbar.items = docSnap.data().hotbar
        eq.backpack.items = docSnap.data().backpack
        eq.armor.items = docSnap.data().armor
    } else {
        console.log("Didn't find EQ in Database. Staring with default EQ")
    }
}

let oldEqDataStr = ""
export async function saveEq() {
    const newEqData = {
        armor: eq.armor.items, 
        backpack: eq.backpack.items, 
        hotbar: eq.hotbar.items
    }
    const newEqDataStr = JSON.stringify(newEqData)
    if (oldEqDataStr != newEqDataStr) {
        await setDoc(doc(fs, 'playerEqs', clientUid), {
            armor: eq.armor.items, 
            backpack: eq.backpack.items, 
            hotbar: eq.hotbar.items
        })
        oldEqDataStr = newEqDataStr
    }
}