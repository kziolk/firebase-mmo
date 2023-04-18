import { onValue, ref } from "firebase/database"
import { dbPathTo } from "./gameDatabase"
import { db } from "./init"


export function startChunkListener(id) {
    onValue(ref(db, `${dbPathTo.chunks}/${id}`), stateSnap => {
        if (stateSnap.val()) {
            console.log("chunk value: ")
            console.log(stateSnap.val())
        } else {
            console.log("NO VALUEE!!!???: ")
            //terrain.generateChunk(id)
        }
    })
}