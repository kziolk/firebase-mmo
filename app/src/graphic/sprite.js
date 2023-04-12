import { PLAYER_RADIUS } from "../entities/entityConsts"
import { ctx } from "./graphic"
import { cam } from "./camera"
import { timeNow } from "../game"

const PIXELS_PER_METER = 32

export class Sprite {
    constructor() {
        this.image = new Image()
        this.image.src = "img/entities/player.png"
        this.pos = {x: 0, y: 0}
        this.gameWidth = 1
        this.gameHeight = 1

        this.lastAnimationTimeStamp = 0
        this.animationFrame = 0
        this.animation = animations["player"]["walking_down"]
    }

    setAnimation(animationName) {
        this.animation = animations["player"][animationName]
    }

    updatePos(pos) {
        const adjustedPos = cam.gamePos2ScreenPos({
            x: pos.x - this.gameWidth / 2, 
            y: pos.y - this.gameHeight + PLAYER_RADIUS})
        this.pos.x = adjustedPos.x
        this.pos.y = adjustedPos.y
    }

    animate() {
        if (timeNow - this.lastAnimationTimeStamp > 200) {
            this.animationFrame = (this.animationFrame+1) % this.animation.frameCount
            this.lastAnimationTimeStamp = timeNow
        }
    }

    draw() {
        this.animate()
        ctx.drawImage(
            this.image,
            this.animation.x + 32 * this.animationFrame,
            this.animation.y,
            32,
            32,
            this.pos.x,
            this.pos.y,
            cam.config.meter2pixels * this.gameWidth,
            cam.config.meter2pixels * this.gameHeight
        )
    }
}


const animations = {
    player: {
        walking_down: {
            x: 0,
            y: 0,
            frameCount: 4
        },
        walking_right: {
            x: 0,
            y: 32,
            frameCount: 4
        },
        walking_left: {
            x: 0,
            y: 64,
            frameCount: 4
        },
        walking_up: {
            x: 0,
            y: 96,
            frameCount: 4
        },
        idle_down: {
            x: 0,
            y: 0,
            frameCount: 1
        },
        idle_right: {
            x: 0,
            y: 32,
            frameCount: 1
        },
        idle_left: {
            x: 0,
            y: 64,
            frameCount: 1
        },
        idle_up: {
            x: 0,
            y: 96,
            frameCount: 1
        },
        punch_down: {
            x: 128,
            y: 0,
            frameCount: 1
        },
        punch_right: {
            x: 128,
            y: 32,
            frameCount: 1
        },
        punch_left: {
            x: 128,
            y: 64,
            frameCount: 1
        },
        punch_up: {
            x: 128,
            y: 96,
            frameCount: 1
        }
    }
}