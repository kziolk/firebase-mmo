import { cnv, ctx } from "./canvas"
import { player } from "./player/player"

// camera for keeping an eye on the player
export const cam = {
    config: {
        meter2pixels: null
    },
    init() {
        // hardcoded for 16/9 ratio
        this.w = 16 // meters in game
        this.h = 9
        this.config.meter2pixels = cnv.width / this.w
        this.pos = {x: 0, y: 0}
        // boxOfStillness is a collisionbox which triggers camera movement
        this.boxOfStillness = {
            pos: {x: 4, y: 2},
            w: 8,
            h: 5
        }
    },
    update() {
        // if player went outside boxOfStillness 
        // then calculate dx and dy
        let dx = 0
        let dy = 0
        if (player.pos.x < this.boxOfStillness.pos.x)
            dx = player.pos.x - this.boxOfStillness.pos.x
        else if (player.pos.x > this.boxOfStillness.pos.x + this.boxOfStillness.w)
            dx = player.pos.x - this.boxOfStillness.pos.x - this.boxOfStillness.w
        if (player.pos.y < this.boxOfStillness.pos.y)
            dy = player.pos.y - this.boxOfStillness.pos.y
        else if (player.pos.y > this.boxOfStillness.pos.y + this.boxOfStillness.h)
            dy = player.pos.y - this.boxOfStillness.pos.y - this.boxOfStillness.h
        
        // move the camera and boxOfStillness by calculated distance
        this.pos.x += dx
        this.pos.y += dy
        this.boxOfStillness.pos.x += dx
        this.boxOfStillness.pos.y += dy
    },
    draw() {
        ctx.strokeStyle = "#aaaa00"
        let boxDrawPos = this.gamePos2ScreenPos(this.boxOfStillness.pos)
        let boxWidth = this.boxOfStillness.w * this.config.meter2pixels
        let boxHeight = this.boxOfStillness.h * this.config.meter2pixels
        ctx.lineWidth = 4;
        ctx.strokeRect(boxDrawPos.x, boxDrawPos.y, boxWidth, boxHeight);
    },
    screenPos2GamePos(pos) {
        return {
            x: (pos.x + cam.pos.x) / this.config.meter2pixels,
            y: (pos.y + cam.pos.y) / this.config.meter2pixels
        }
    }, 
    gamePos2ScreenPos(pos) {
        return {
            x: (pos.x - cam.pos.x) * this.config.meter2pixels,
            y: (pos.y - cam.pos.y) * this.config.meter2pixels
        }
    }
}