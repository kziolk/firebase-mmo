import { doc, setDoc, getDoc } from "firebase/firestore"
import { clientUid } from "./auth"
import { fs } from "./init"
import { eq } from "../eq/eq"
import { player } from "../entities/player"

export async function getEq() {
    let docSnap = await getDoc(doc(fs, 'playerEqs', clientUid))
    if (docSnap.exists()) {
        console.log("EQ: ")
        console.log(docSnap.data())
        eq.hotbar.items = docSnap.data().hotbar
        eq.backpack.items = docSnap.data().backpack
        eq.hotbar.armor = docSnap.data().armor
        if (eq.hotbar.items[eq.hotbar.selectedId])
            player.addItemSprite(eq.hotbar.items[eq.hotbar.selectedId], "hotbar")
    } else {
        console.log("NO EQ In FS")
    }
}

export async function saveEq() {
    console.log("saving eq")
    await setDoc(doc(fs, 'playerEqs', clientUid), {
        armor: eq.armor.items, 
        backpack: eq.backpack.items, 
        hotbar: eq.hotbar.items
    })
    console.log("saved eq")
}