import { child, get, ref, remove, set } from "firebase/database";
import { player } from "../entities/player";
import { timeNow } from "../game";
import { clientUid, playerRef } from "./auth";
import { db } from "./init";
import { savePlayerVisuals } from "./players";
import { saveEq } from "./eq";

const DB_UPDATE_DELAY = 100
let lastDbUpdateTime = 0

const FS_UPDATE_DELAY = 2000
let lastFsUpdateTime = 0

export const dbUpdater = {
    tasks: []
}

export const database = {
    update() {
        dbUpdater.tasks.forEach(task => {
            if (task.action == "set") {
                set(ref(db, task.where), task.val)
            }
        })
        dbUpdater.tasks = []

        if (timeNow - lastDbUpdateTime > DB_UPDATE_DELAY) {
            savePlayer()
            lastDbUpdateTime = timeNow
        }
        if (timeNow - lastFsUpdateTime > FS_UPDATE_DELAY) {
            savePlayerVisuals()
            saveEq()
            lastFsUpdateTime = timeNow
        }
    },
    async initPlayer() {
        await remove(ref(db, `${dbPathTo.playerReceivedAttacks}/${clientUid}`))
        await get(child(ref(db), `${dbPathTo.playerData}/${clientUid}`)).
        then((pSnap) => {
            if (pSnap.exists()) {
                let pVal = pSnap.val()
                // set player positon
                player.setPosition({x: pVal.x, y: pVal.y})
                player.hp = pVal.hp
            }
        })
    }
}

export const dbPathTo = {
    playerReceivedAttacks: "playerReceivedAttacks",
    playerData: "playerData",
    playerSpriteParts: "playerSpriteParts",
}

let oldPlayerDataStr = "scoobydoo"
function savePlayer() {
    const newPlayerData = {
        x: player.pos.x,
        y: player.pos.y,
        vx: player.v.x / 2,
        vy: player.v.y / 2,
        reachPointX: player.reachPoint.x,
        reachPointY: player.reachPoint.y,
        activity: player.activity + "_" + player.direction,
        hp: player.hp,
        loggedIn: true
    }
    const newPlayerDataStr = JSON.stringify(newPlayerData)
    if (oldPlayerDataStr != newPlayerDataStr) {
        set(playerRef, newPlayerData)
        oldPlayerDataStr = newPlayerDataStr
    }
}