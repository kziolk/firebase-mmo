import { cam } from "../../graphic/camera"
import { ctx } from "../../graphic/graphic"
import { player } from "../player"
import { MovingEntity, updateEntityKnockback, updateEntityStun, updateEntityTimeKnockback } from "../MovingEntity"
import { MOB_RADIUS, MOB_SPEED, MOB_REACH_DISTANCE } from "../entityConsts"
import { ComplexSprite, animations } from "../../graphic/sprite"
import { attacks, attacksData } from "../../combat/attacks"
import { timeNow } from "../../game"
import { mobs } from "./mobsManager"

export class Mob extends MovingEntity {
    constructor(position, id) { 
        super({
                type: "circle",
                pos: position,
                r: MOB_RADIUS
            }, MOB_SPEED)
        this.pos = this.hitbox.pos
        this.id = id
        this.hp = 5
        // tracking attack related data
        this.reachPoint = {x: 0, y: 0}
        this.attack = { lastUsed: 0, coolDown: 500 }

        // for animation
        this.sprite = new ComplexSprite("player", {
            "arm_l": "arm_l", 
            "arm_r": "arm_r",
            "legs": "legs", 
            "torso": "torso"})
        this.activity = "walking" 
        this.direction = "down"  
    }

    updateActions(dt) {
        // if occupied return
        if (this.occupied) {
            if(timeNow - this.attack.lastUsed > this.attack.duration)
                this.occupied = false
            return
        }

        // set animations

        // TODO: multiplayer: choose one player as victim
        // singleplayer: player is victim
        let dx = player.pos.x - this.pos.x
        let dy = player.pos.y - this.pos.y
        let distToVictim = Math.sqrt(dx*dx + dy*dy)
        if (distToVictim > 1.4) return
        
        // start attacking
        if (timeNow - this.attack.lastUsed > this.attack.coolDown) {
            // console.log("mob triggeruje atak: AMASZ")
            updateMobReachPoint(this)
            this.attack.step = attacksData["fist"].steps[0]
            this.attack.name = this.attack.step.name
            //trigger attack
            attacks.trigger(
                this, 
                {
                    player: { "player": player }
                }, 
                null)
            // animations
            this.activity = this.attack.step.activity
            let animationName = this.activity + "_" + this.direction
            
            let animationFrameDuration = this.attack.duration / animations.player[animationName].frameCount
            this.sprite.resetAnimation(animationName, animationFrameDuration)
            this.attack.duration = this.attack.step.duration
            this.occupied = true
            this.attack.lastUsed = timeNow
        }
    }

    updateMovement(dt) {
        updateMobVelocityVector(this, dt)
        this.move(dt)
    }

    draw() {
        
        // set animation when not busy doing something else
        if (this.occupied == false) {
            // choose direction based on movement vector
            let dx = player.pos.x - this.pos.x
            let dy = player.pos.y - this.pos.y
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
        // map game position to screen position
        const drawPos = cam.gamePos2ScreenPos(this.pos) 
        const drawRadius = MOB_RADIUS * cam.config.meter2pixels 
        const drawRange = MOB_REACH_DISTANCE * cam.config.meter2pixels 
        ctx.fillStyle = 'rgba(255,0,255,0.3)';
        ctx.beginPath();
        ctx.arc(drawPos.x, drawPos.y, drawRadius, 0, Math.PI*2, true)
        ctx.fill();
    }

    pathFindPlayer() {

    }

    kill() {
        delete mobs[this.id]
    }
}


function updateMobVelocityVector(mob, dt) {
    mobVectorUpdateFoos[mob.movement.type](mob, dt)
}
const mobVectorUpdateFoos = {
    default: function (mEntity, dt) {
        // update player movement controls
        mEntity.v.x = (mEntity.pos.x - player.pos.x > 0) ? -1 : 1
        mEntity.v.y = (mEntity.pos.y - player.pos.y > 0) ? -1 : 1
    },
    knockback: updateEntityKnockback,
    timedKnockback: updateEntityTimeKnockback,
    stun: updateEntityStun
}


function updateMobReachPoint(mob) {
    // face the mouse coursor
    // get distance from player to mouse in game coords
    let victimPos = {x: player.pos.x, y: player.pos.y}
    let victimDx = victimPos.x - mob.pos.x
    let victimDy = victimPos.y - mob.pos.y
    let dist = Math.sqrt(victimDx*victimDx + victimDy*victimDy)
    if (dist < MOB_REACH_DISTANCE) {
        mob.reachPoint = victimPos
    } else {
        let distanceScale = MOB_REACH_DISTANCE / dist
        mob.reachPoint.x = mob.pos.x + victimDx * distanceScale
        mob.reachPoint.y = mob.pos.y + victimDy * distanceScale
    }
}