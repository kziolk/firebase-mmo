import { graphic } from "./canvas";
import { game } from "./game"

let startBtn = document.getElementById("start-btn")

startBtn.onclick = function () {
    this.textContent = "Hello World!"

    // clear the start screen
    let startScreen = document.getElementById("start-screen")
    startScreen.style.display = 'none'

    // initialize canvas
    graphic.init()

    // start the game
    game.start()
}