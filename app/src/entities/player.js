import { cam } from "../graphic/camera"
import { ctx } from "../graphic/graphic"
import { attacks, attacksData } from "../combat/attacks"
import { input } from "../input"
import { MovingEntity, vectorUpdateKnockback } from "./MovingEntity"
import { ComplexSprite, animations } from "../graphic/sprite"
import { mobs } from "./mobs/mobsManager"
import { players } from "./playersManager"
import { PLAYER_RADIUS, PLAYER_REACH_DISTANCE, PLAYER_SPEED } from "./entityConsts"
import { eq } from "../eq/eq"
import { timeNow } from "../game"

class Player extends MovingEntity {
    constructor() {
        super({
                type: "circle",
                pos: {x: 0, y: 0},
                r: PLAYER_RADIUS
            }, PLAYER_SPEED)
        // player position in game coords, reference to hitbox postition
        this.pos = this.hitbox.pos
        // point under player mouse
        this.reachPoint = {x: 0, y: 0}
        // is player stunned / during attack animation
        this.occupied = false
        // tracking attack related data
        this.attack = { lastUsed: 0 }

        // for animation
        this.sprite = new ComplexSprite("player", {
            "arm_l": "arm_l", 
            "arm_r": "arm_r",
            "legs": "legs", 
            "torso": "torso", 
            "head": "head"
        })
        this.direction = "down"
        this.activity = "idle"        
    }

    init(pos) {
        // init player position from db
        this.pos.x = pos.x
        this.pos.y = pos.y

        // init player eq
        eq.init()
        this.initSelectedItem()
    }

    updateActions(dt) {
        updatePlayerReachPoint()
        if (this.occupied) {
            // debug: ratio of completing attack action
            playerDebugData.attackDurationBar = (timeNow - this.attack.lastUsed) / this.attack.duration
            // if attack in the middle of animation then attack

            // set occupied to false eventually
            if (timeNow - this.attack.lastUsed > this.attack.duration) {
                this.occupied = false
                this.attack.triggered = false // if mouse clicked during animation
            }
        }
        else {
            // update debug bar indicating time remaining for combination attack
            let attackName = playerAttackFromItem(this.item)
            let attackStep = attacksData[attackName].steps[this.attack.step]
            if ((this.attack.step < attacksData[attackName].steps.length) && 
            (timeNow - this.attack.lastUsed - this.attack.duration < attackStep.continueWindow)) {
                playerDebugData.attackCombinationWindowBar = (timeNow - this.attack.lastUsed - this.attack.duration) / attackStep.continueWindow
            } else {
                playerDebugData.attackCombinationWindowBar = 0
            }
            // update attack
            if (this.attack.triggered) {
                // if trigger occurs just after last attack then maybe it's the COMBINATION???
                // let attackName = playerAttackFromItemName[this.item.name]
                // let attackStep = attacksData[attackName].steps[this.attack.step]
                if ((this.attack.step < attacksData[attackName].steps.length - 1) && 
                    (timeNow - this.attack.lastUsed - this.attack.duration < attackStep.continueWindow)) {
                    this.attack.step++
                    attackStep = attacksData[attackName].steps[this.attack.step]
                    // debug: ratio of time last for combination attack
                    playerDebugData.attackCombinationWindowBar = (timeNow - this.attack.lastUsed - this.attack.duration) / attackStep.continueWindow
                } else {
                    this.attack.step = 0
                    attackStep = attacksData[attackName].steps[this.attack.step]
                    // debug: ratio of time last for combination attack
                    playerDebugData.attackCombinationWindowBar = 0
                }
                
                this.attack.name = attackStep.name
                attacks.trigger(this, mobs, players)
                this.occupied = true
                this.activity = attackStep.activity
                this.attack.duration = attackStep.duration
                this.attack.lastUsed = timeNow
                let animationName = this.activity + "_" + this.direction
                let animationFrameDuration = this.attack.duration / animations.player[animationName].frameCount
                this.sprite.resetAnimation(animationName, animationFrameDuration)
                this.attack.triggered = false
            }

            // update breaking blocks

            // update item special ability (placing blocks and more)
        }
    }

    updateMovement(dt) {
        if(this.occupied == false)
            updatePlayerVelocityVector(dt)
        // move by velocity
        this.move(dt)
    }

    draw() {
        // set animation when not busy doing something else
        if (this.occupied == false) {
            // choose direction based on mouse distance from player
            let dx = this.reachPoint.x - this.pos.x
            let dy = this.reachPoint.y - this.pos.y
            if (Math.abs(dx) > Math.abs(dy)) {
                // bigger distance horisontally means left or right
                if (dx > 0) this.direction = "right"
                else this.direction = "left"
            } else {
                if (dy > 0) this.direction = "down"
                else this.direction = "up"
            }
            // choose activity based on
            if (this.v.x || this.v.y) this.activity = "walking"
            else this.activity = "idle"
            this.sprite.setAnimation(this.activity + "_" + this.direction)
        }
        // draw sprite
        this.sprite.updatePos(this.pos)
        this.sprite.draw()
        // draw hitbox, mouse dot and reach line
        // map game position to screen position
        const drawPos = cam.gamePos2ScreenPos(this.pos)
        const drawRadius = PLAYER_RADIUS * cam.config.meter2pixels 
        ctx.fillStyle = 'rgba(0,255,255,0.3)'
        ctx.beginPath()
        ctx.arc(drawPos.x, drawPos.y, drawRadius, 0, Math.PI*2, true)
        ctx.fill()

        // map player reach position
        const reachPointDrawPos = cam.gamePos2ScreenPos(this.reachPoint)
        ctx.fillStyle = '#00ff00'
        ctx.beginPath()
        ctx.arc(reachPointDrawPos.x, reachPointDrawPos.y, 5, 0, Math.PI*2, true)
        ctx.fill()

        // draw reach line
        ctx.strokeStyle = '#00ff00'
        ctx.beginPath()
        ctx.moveTo(drawPos.x, drawPos.y)
        ctx.lineTo(reachPointDrawPos.x, reachPointDrawPos.y)
        ctx.stroke()
    }

    resetAttack() {
        // lastUsed cannot be reset because timer needs to remain after weapon change
        this.attack.step = 0
    }

    initSelectedItem() {
        this.item = eq.hotbar.items[eq.hotbar.selectedId]
        this.resetAttack()
        if (this.item) this.addItemSprite(this.item, "hotbar")
    }

    switchItem(slotId) {
        if (this.item) this.removeItemSprite(this.item, "hotbar")
        eq.hotbar.selectedId = slotId
        this.initSelectedItem()
    }

    addItemSprite(item, where) {
        let spritePart, spriteName
        if (where == "hotbar") {
            spritePart = spritePartInHotbar(item.spritePart)
            spriteName = spriteNameInHotbar(item.name, item.purpose)
        } else {
            spritePart = item.spritePart
            spriteName = item.name
        }
        console.log("adding item " + spriteName + " on " + where + " as " + spritePart)
        this.sprite.setSpritePart(spritePart, spriteName)
    }

    removeItemSprite(item, where) {
        let spritePart
        if (where == "hotbar") {
            spritePart = spritePartInHotbar(item.spritePart)
        } else {
            spritePart = item.spritePart
        }
        this.sprite.removeSpritePart(spritePart)
    }
}

export const player = new Player()

function updatePlayerReachPoint() {
    // face the mouse coursor
    // get distance from player to mouse in game coords
    let mouseGamePos = cam.screenPos2GamePos(input.mouse.pos)
    let mouseDx = mouseGamePos.x - player.pos.x
    let mouseDy = mouseGamePos.y - player.pos.y
    let mouseGameDistance = Math.sqrt(mouseDx*mouseDx + mouseDy*mouseDy)
    if (mouseGameDistance < PLAYER_REACH_DISTANCE) {
        player.reachPoint = mouseGamePos
    } else {
        let distanceScale = PLAYER_REACH_DISTANCE / mouseGameDistance
        player.reachPoint.x = player.pos.x + mouseDx * distanceScale
        player.reachPoint.y = player.pos.y + mouseDy * distanceScale
    }
}

function updatePlayerVelocityVector(dt) {
    playerVectorUpdateFoos[player.state.type](player, dt)
}

const playerVectorUpdateFoos = {
    default: function (mEntity, dt) {
        // update player movement controls
        if (input.keyboard.pressingLeft && !input.keyboard.pressingRight)
            player.v.x = -1
        else if (input.keyboard.pressingRight && !input.keyboard.pressingLeft)
            player.v.x = 1
        else player.v.x = 0
    
        if (input.keyboard.pressingUp && !input.keyboard.pressingDown)
            player.v.y = -1
        else if (input.keyboard.pressingDown && !input.keyboard.pressingUp)
            player.v.y = 1
        else player.v.y = 0
    },
    knockback: vectorUpdateKnockback
}

function playerAttackFromItem(item) {
    if (!item) return "fist"
    else if (item.purpose != "weapon") return "fist"
    else return item.type
}

export const playerDebugData = {
    attackDurationBar: 0,
    attackCombinationWindowBar: 0
}

function spritePartInHotbar(spritePart) {
    if (spritePart == "weapon_r" || spritePart == "weapon_l")
        return spritePart
    return "weapon_r"
}

function spriteNameInHotbar(spriteName, spritePurpose) {
    if (spritePurpose == "weapon")
        return spriteName
    return "holdable_" + spriteName
}