import { cnv, ctx } from "./graphic"
import { player } from "../entities/player"

// camera for keeping an eye on the player
export const cam = {
    config: {
        meter2pixels: null
    },
    init() {
        // hardcoded for 16/9 ratio
        this.width = 16 // meters in game
        this.height = 9
        this.config.meter2pixels = cnv.width / this.width
        this.pos = {x: player.pos.x - this.width / 2, y: player.pos.y - this.height / 2}
        // boxOfStillness is a collisionbox which triggers camera movement
        this.boxOfStillness = {
            pos: {x: this.pos.x + 6, y: this.pos.y + 3.5},
            width: 4,
            height: 2
        }
    },
    update() {
        // if player went outside boxOfStillness 
        // then calculate dx and dy
        let dx = 0
        let dy = 0
        if (player.pos.x < this.boxOfStillness.pos.x)
            dx = player.pos.x - this.boxOfStillness.pos.x
        else if (player.pos.x > this.boxOfStillness.pos.x + this.boxOfStillness.width)
            dx = player.pos.x - this.boxOfStillness.pos.x - this.boxOfStillness.width
        if (player.pos.y < this.boxOfStillness.pos.y)
            dy = player.pos.y - this.boxOfStillness.pos.y
        else if (player.pos.y > this.boxOfStillness.pos.y + this.boxOfStillness.height)
            dy = player.pos.y - this.boxOfStillness.pos.y - this.boxOfStillness.height
        
        // move the camera and boxOfStillness by calculated distance
        this.pos.x += dx
        this.pos.y += dy
        this.boxOfStillness.pos.x += dx
        this.boxOfStillness.pos.y += dy
    },
    draw() {
        ctx.strokeStyle = "#aaaa00"
        let boxDrawPos = this.gamePos2ScreenPos(this.boxOfStillness.pos)
        let boxWidth = this.boxOfStillness.width * this.config.meter2pixels
        let boxHeight = this.boxOfStillness.height * this.config.meter2pixels
        ctx.lineWidth = 4;
        ctx.strokeRect(boxDrawPos.x, boxDrawPos.y, boxWidth, boxHeight);
    },
    screenPos2GamePos(pos) {
        return {
            x: (pos.x) / this.config.meter2pixels + cam.pos.x,
            y: (pos.y) / this.config.meter2pixels + cam.pos.y
        }
    }, 
    gamePos2ScreenPos(pos) {
        return {
            x: (pos.x - cam.pos.x) * this.config.meter2pixels,
            y: (pos.y - cam.pos.y) * this.config.meter2pixels
        }
    }
}