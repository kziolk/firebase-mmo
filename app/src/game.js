import { cam } from "./camera"
import { ctx, cnv } from "./canvas"
import { debugInfo } from "./dbg"
import { input } from "./player/input"
import { players, player } from "./player/player"
import { terrain } from "./terrain"

let loop
let oldTime, dt
export var timeNow = 0

export const game = {
    config: {
        fpsLimit: 60
    },
    start() {
        // initialize components
        input.init();
        terrain.init()
        players.addMainPlayer({x:8, y:5})
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
    timeNow = performance.now();
    dt = timeNow - oldTime;
    players.update(dt)
    cam.update()
    debugInfo.update()
    oldTime = timeNow
}

function draw() {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, cnv.width, cnv.height)
    cam.draw()
    terrain.draw()
    players.draw()
    drawCoords()
}

function drawCoords() {
    ctx.fillStyle = 'yellow'
    ctx.font = "20px Arial";
    ctx.fillText("fps: " + debugInfo.fps.toFixed(2), 24, 24)
    ctx.fillText("player x: " + player.pos.x.toFixed(2) + ", y: " + player.pos.y.toFixed(2), 24, 64)
    ctx.fillText("cam x: " + cam.pos.x.toFixed(2) + ", y: " + cam.pos.y.toFixed(2), 24, 92)
    ctx.fillText("bos x: " + cam.boxOfStillness.pos.x.toFixed(2) + ", y: " + cam.boxOfStillness.pos.y.toFixed(2), 24, 128)
}

function consoleLogSomethingAfterInit() {
    console.log(cam.config.meter2pixels)
    console.log(cam.gamePos2ScreenPos({ x: 1, y: 2 }))
    console.log(cam.screenPos2GamePos({ x: 128, y: 12600 }))
}