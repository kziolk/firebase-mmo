import { ref, set } from "firebase/database";
import { player } from "../entities/player";
import { timeNow } from "../game";
import { playerRef } from "./auth";
import { db } from "./init";
import { savePlayerVisuals } from "./players";

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
            lastFsUpdateTime = timeNow
        }
    }
}

function savePlayer() {
    set(playerRef, {
        x: player.pos.x,
        y: player.pos.y,
        vx: player.v.x / 2,
        vy: player.v.y / 2,
        reachPointX: player.reachPoint.x,
        reachPointY: player.reachPoint.y,
        activity: player.activity + "_" + player.direction
    })
}