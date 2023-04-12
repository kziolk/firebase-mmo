import { graphic } from "./graphic/graphic"
import { game } from "./game"
import { authenticateUser } from "./db/auth"
import { initDB } from "./db/init"

let startSingleBtn = document.getElementById("start-single-btn")
let startMultiBtn = document.getElementById("start-multi-btn")

startSingleBtn.onclick = function () {
    game.mode = "singleplayer"
    initializeGame()
}
startMultiBtn.onclick = function () {
    game.mode = "multiplayer"
    initDB().
    then(() => authenticateUser()).
    catch((error) => console.log(error))
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