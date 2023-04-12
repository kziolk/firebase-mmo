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