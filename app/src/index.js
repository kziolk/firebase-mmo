import { graphic } from "./graphic/graphic"
import { game } from "./game"
import { authenticateUser } from "./db/auth"

let startBtn = document.getElementById("start-btn")

startBtn.onclick = function () {
    initializeGame()
}

export function initializeGame() {
    // clear the start screen
    let startScreen = document.getElementById("start-screen")
    startScreen.style.display = 'none'

    // initialize canvas
    graphic.init()

    // start the game
    game.start()
}

authenticateUser()

// let camX = 0.1, camW = 10
// let chunkX = -128
// console.log(Math.floor((camX - chunkX) / 128))
// console.log(Math.floor((camX + camW - chunkX) / 128))

// camX = -0.1
// console.log(Math.floor((camX - chunkX) / 128))
// console.log(Math.floor((camX + camW - chunkX) / 128))

// camX = -128.1
// console.log(Math.floor((camX - chunkX) / 128))
// console.log(Math.floor((camX + camW - chunkX) / 128))

// camX = -138.1
// console.log(Math.floor((camX - chunkX) / 128))
// console.log(Math.floor((camX + camW - chunkX) / 128))

// camX = 127.9 - chunkX
// console.log(Math.floor((camX - chunkX) / 128))
// console.log(Math.floor((camX + camW - chunkX) / 128))

// camX = 128.01 - chunkX
// console.log(Math.floor((camX - chunkX) / 128))
// console.log(Math.floor((camX + camW - chunkX) / 128))
