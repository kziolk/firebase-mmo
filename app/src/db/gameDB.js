import { set } from "firebase/database";
import { player } from "../entities/player";
import { timeNow } from "../game";
import { playerRef } from "./auth";

const DB_UPDATE_DELAY = 200
let lastUpdateTime = 0

export const gameDB = {
    update() {
        if (timeNow - lastUpdateTime > DB_UPDATE_DELAY) {
            savePlayer()
            lastUpdateTime = timeNow
        }
    }
}

function savePlayer() {

    set(playerRef, {
        x: player.pos.x,
        y: player.pos.y
    })
}