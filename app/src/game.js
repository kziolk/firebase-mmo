import { cam } from "./graphic/camera"
import { graphic } from "./graphic/graphic"
import { debugInfo } from "./dbg"
import { mobsManager } from "./entities/mobs/mobsManager"
import { input } from "./input"
import { player } from "./entities/player"
import { terrain } from "./terrain"
import { database } from "./db/gameDatabase"
import { playersManager } from "./entities/playersManager"
import { startPlayersListener } from "./db/players"
import { getEq } from "./db/eq"
import { eq } from "./eq/eq"

let loop
let oldTime, dt
export var timeNow = 0

export const game = {
    mode: "singleplayer",
    config: {
        fpsLimit: 60
    },
    async start() {
        // initialize components
        input.init();
        terrain.init()
        
        // adds default equipment
        eq.init()
        if (this.mode == "multiplayer") {
            // get eq from database, wait untill it is done
            await getEq()
            // set logged in and clear received attack data
            await database.initPlayer()
            // listen for changes in other players
            startPlayersListener()
            
        }
        player.resetSpriteParts()

        // camera needs player to be initiated
        cam.init();
        
        // start timer
        timeNow = oldTime = performance.now();

        // initialize more components which needed timer
        debugInfo.init()
        
        // start loop
        loop = setInterval(() => {
            update()
            graphic.draw()
        }, 1000 / this.config.fpsLimit)

        consoleLogSomethingAfterInit();
    },
    stop() {
        clearInterval(loop)
    }
}

function update() {
    // grab current time and calculate frame delay
    oldTime = timeNow
    timeNow = performance.now();
    dt = timeNow - oldTime;
    
    // entity update
    player.updateActions(dt)
    mobsManager.updateActions(dt)
    player.updateMovement(dt)
    mobsManager.updateMovement(dt)

    // estimate closest real position of other players in multiplayer
    //if (this.mode == "multiplayer")
    playersManager.updateMovement(dt)

    // save changes to DB
    if (game.mode == "multiplayer")
        database.update()

    // camera follows player
    cam.update()
    // real fps tracking
    debugInfo.update()
}

function consoleLogSomethingAfterInit() {
    console.log("Game Initialized!\nPlaying " + game.mode)
}