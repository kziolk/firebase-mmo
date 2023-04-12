import { cam } from "./graphic/camera"
import { ctx, cnv } from "./graphic/graphic"
import { debugInfo } from "./dbg"
import { mobsManager } from "./entities/mobs/mobsManager"
import { input } from "./input"
import { player } from "./entities/player"
import { terrain } from "./terrain"
import { database } from "./db/gameDatabase"
import { playersManager } from "./entities/playersManager"
import { startPlayersListener } from "./db/players"

let loop
let oldTime, dt
export var timeNow = 0
export const GAMEMODE = "singleplayer"

export const game = {
    config: {
        fpsLimit: 60
    },
    start() {
        // initialize components
        input.init();
        terrain.init()
        
        startPlayersListener()

        player.init({x: 50, y: 30})

        // camera needs player to be initiated
        cam.init();
        
        // start timer
        timeNow = oldTime = performance.now();
        // initialize more components which needed timer
        debugInfo.init()
        
        // start loop
        loop = setInterval(() => {
            update()
            draw()
        }, 1000 / this.config.fpsLimit)

        consoleLogSomethingAfterInit();
    },
    stop() {
        clearInterval(loop)
    }
}

function update() {
    oldTime = timeNow
    timeNow = performance.now();
    dt = timeNow - oldTime;
    
    // entity update
    player.updateActions(dt)
    mobsManager.updateActions(dt)
    player.updateMovement(dt)
    mobsManager.updateMovement(dt)

    playersManager.updateMovement(dt)

    // save changes to DB
    database.update()

    // graphic / performance info update
    cam.update()
    debugInfo.update()
}

function draw() {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, cnv.width, cnv.height)
    terrain.draw()
    mobsManager.draw()
    playersManager.draw()
    player.draw()
    drawCoords()
    cam.draw()
}

function drawCoords() {
    ctx.fillStyle = 'yellow'
    ctx.font = "20px Arial";
    ctx.fillText("fps: " + debugInfo.fps.toFixed(2), 24, 30)
    ctx.fillText("player x: " + player.pos.x.toFixed(2) + ", y: " + player.pos.y.toFixed(2), 24, 60)
    ctx.fillText("cam x: " + cam.pos.x.toFixed(2) + ", y: " + cam.pos.y.toFixed(2), 24, 90)
    ctx.fillText("that box x: " + cam.boxOfStillness.pos.x.toFixed(2) + ", y: " + cam.boxOfStillness.pos.y.toFixed(2), 24, 120)
    ctx.fillText("mouse x: " + input.mouse.pos.x.toFixed(2) + ", y: " + input.mouse.pos.y.toFixed(2), 24, 150)
}

function consoleLogSomethingAfterInit() {
    console.log("Game initialized")
}