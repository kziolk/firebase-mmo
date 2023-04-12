import { ref, set } from "firebase/database";
import { player } from "../entities/player";
import { timeNow } from "../game";
import { playerRef } from "./auth";
import { db } from "./init";

const DB_UPDATE_DELAY = 50
let lastUpdateTime = 0

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


        if (timeNow - lastUpdateTime > DB_UPDATE_DELAY) {
            savePlayer()
            lastUpdateTime = timeNow
        }
    }
}

function savePlayer() {
    set(playerRef, {
        x: player.pos.x,
        y: player.pos.y,
        vx: player.v.x,
        vy: player.v.y,
        reachPointX: player.reachPoint.x,
        reachPointY: player.reachPoint.y,
        activity: player.activity
    })
}