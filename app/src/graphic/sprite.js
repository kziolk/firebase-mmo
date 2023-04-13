import { PLAYER_RADIUS } from "../entities/entityConsts"
import { ctx } from "./graphic"
import { cam } from "./camera"
import { timeNow } from "../game"

const PIXELS_PER_METER = 32

const pathToSprite = {
    //"player": "img/entities/player_sprite_wip.png",
    //"mob": "img/entities/mob.png",
    // bodyparts
    "head": "img/animations/bodyParts/head.png",
    "arm_r": "img/animations/bodyParts/arm_r.png",
    "arm_l": "img/animations/bodyParts/arm_l.png", 
    "legs": "img/animations/bodyParts/legs.png", 
    "torso": "img/animations/bodyParts/torso.png",

    // armor
    "helmet": "img/animations/armorParts/helmet.png",

    // weapons
    "sword_r": "img/animations/weapons/sword_r.png"
}

export class ComplexSprite {
    constructor(entityName, spriteParts) {
        this.sprites = {}
        Object.keys(spriteParts).forEach(partName => {
            let spriteName = spriteParts[partName]
            this.sprites[partName] = {
                img: new Image(),
                pos: {x: 0, y: 0},
                gameWidth: 1,
                gameHeight: 1,
            }
            this.sprites[partName].img.src = pathToSprite[spriteName]
        });
        this.entityName = entityName
        this.lastAnimationTimeStamp = 0
        this.animationFrame = 0
        this.animation = animations[this.entityName]["walking_down"]
        this.frameDuration = 200
    }

    setSpritePart(partName, spriteName) {
        if (!this.sprites[partName])
            this.sprites[partName] = {
                img: new Image(),
                pos: {x: 0, y: 0},
                gameWidth: 1,
                gameHeight: 1,
            }
        this.sprites[partName].img.src = pathToSprite[spriteName]
    }

    removeSpritePart(partName) {
        delete this.sprites[partName]
    }

    setAnimation(animationName, frameDuration = 200) {
        this.animation = animations[this.entityName][animationName]
        this.frameDuration = frameDuration
    }

    resetAnimation(animationName, frameDuration = 200) {
        this.animationFrame = 0
        this.animation = animations[this.entityName][animationName]
        this.frameDuration = frameDuration
        this.lastAnimationTimeStamp = timeNow
    }

    updatePos(pos) {
        Object.keys(this.sprites).forEach(bodyPart => {
            let sprite = this.sprites[bodyPart]
            const adjustedPos = cam.gamePos2ScreenPos({
                x: pos.x - sprite.gameWidth / 2, 
                y: pos.y - sprite.gameHeight + PLAYER_RADIUS})
            sprite.pos = adjustedPos
        })
        // this.pos.x = adjustedPos.x
        // this.pos.y = adjustedPos.y
    }

    animate() {
        if (timeNow - this.lastAnimationTimeStamp > this.frameDuration) {
            this.animationFrame = (this.animationFrame+1) % this.animation.frameCount
            this.lastAnimationTimeStamp = timeNow
        }
    }

    draw() {
        this.animate()
        this.animation.drawOrder.forEach(bodyName => {
            let sprite = this.sprites[bodyName]
            if (sprite) {
                ctx.drawImage(
                    sprite.img,
                    this.animation.x + 32 * this.animationFrame,
                    this.animation.y,
                    32,
                    32,
                    sprite.pos.x,
                    sprite.pos.y,
                    cam.config.meter2pixels * sprite.gameWidth,
                    cam.config.meter2pixels * sprite.gameHeight
                )
            }
        })
    }
}


export const animations = {
    player: {
        walking_down: {
            x: 0,
            y: 0,
            frameCount: 4,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "weapon_r", "arm_r"
            ]
        },
        walking_right: {
            x: 0,
            y: 32,
            frameCount: 4,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "weapon_r", "arm_r"
            ]
        },
        walking_left: {
            x: 0,
            y: 64,
            frameCount: 4,
            drawOrder: [
                "weapon_r", "arm_r", "legs", "torso", "arm_l", "head", "helmet"
            ]
        },
        walking_up: {
            x: 0,
            y: 96,
            frameCount: 4,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "weapon_r", "arm_r"
            ]
        },
        idle_down: {
            x: 0,
            y: 0,
            frameCount: 1,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "weapon_r", "arm_r"
            ]
        },
        idle_right: {
            x: 0,
            y: 32,
            frameCount: 1,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "weapon_r", "arm_r"
            ]
        },
        idle_left: {
            x: 0,
            y: 64,
            frameCount: 1,
            drawOrder: [
                "weapon_r", "arm_r", "legs", "torso", "arm_l", "head", "helmet"
            ]
        },
        idle_up: {
            x: 0,
            y: 96,
            frameCount: 1,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "weapon_r", "arm_r"
            ]
        },
        punch_down: {
            x: 128,
            y: 0,
            frameCount: 1,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "arm_r"
            ]
        },
        punch_right: {
            x: 128,
            y: 32,
            frameCount: 1,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "arm_r"
            ]
        },
        punch_left: {
            x: 128,
            y: 64,
            frameCount: 1,
            drawOrder: [
                "arm_r", "legs", "torso", "arm_l", "head", "helmet"
            ]
        },
        punch_up: {
            x: 128,
            y: 96,
            frameCount: 1,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "arm_r"
            ]
        },
        kick_down: {
            x: 160,
            y: 0,
            frameCount: 1,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "arm_r"
            ]
        },
        kick_right: {
            x: 160,
            y: 32,
            frameCount: 1,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "arm_r"
            ]
        },
        kick_left: {
            x: 160,
            y: 64,
            frameCount: 1,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "arm_r"
            ]
        },
        kick_up: {
            x: 160,
            y: 96,
            frameCount: 1,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "arm_r"
            ]
        },
        "360_down": {
            x: 192,
            y: 0,
            frameCount: 4,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "arm_r"
            ]
        },
        "360_right": {
            x: 192,
            y: 32,
            frameCount: 4,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "arm_r"
            ]
        },
        "360_left": {
            x: 192,
            y: 64,
            frameCount: 4,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "arm_r"
            ]
        },
        "360_up": {
            x: 192,
            y: 96,
            frameCount: 4,
            drawOrder: [
                "arm_l", "legs", "torso", "head", "helmet", "arm_r"
            ]
        }
    }
}