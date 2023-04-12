import { cam } from "../graphic/camera";
import { ctx } from "../graphic/graphic"
import { Weapon } from "../combat/Weapon";
import { input } from "../input";
import { MovingEntity, vectorUpdateKnockback } from "./MovingEntity";
import { Sprite } from "../graphic/sprite";
import { mobs } from "./mobs/mobsManager";
import { players } from "./playersManager";
import { PLAYER_RADIUS, PLAYER_REACH_DISTANCE, PLAYER_SPEED } from "./entityConsts";

class Player extends MovingEntity {
    constructor() {
        super({
                type: "circle",
                pos: {x: 0, y: 0},
                r: PLAYER_RADIUS
            }, PLAYER_SPEED)
        this.pos = this.hitbox.pos
        this.reachPoint = {x: 0, y: 0}
        this.weapon = new Weapon(this)
        this.attackTriggered = false
        this.sprite = new Sprite()

        this.activity = "idle_down"
    }

    init(pos) {
        this.pos.x = pos.x
        this.pos.y = pos.y
    }

    updateActions(dt) {
        updatePlayerReachPoint()
        if (this.attackTriggered) {
            this.weapon.attack(mobs, players)
            this.attackTriggered = false
        }
    }

    updateMovement(dt) {
        updatePlayerVelocityVector(dt)
        // move by velocity
        this.move(dt)
    }

    draw() {
        // set animation
        let dx = this.reachPoint.x - this.pos.x
        let dy = this.reachPoint.y - this.pos.y
        if (Math.abs(dx) > Math.abs(dy)) {
            // left or right
            if (dx > 0) {
                if (this.v.x || this.v.y) this.activity = "walking_right"
                else this.activity = "idle_right"
            } else {
                if (this.v.x || this.v.y) this.activity = "walking_left"
                else this.activity = "idle_left"
            }
        } else {
            if (dy > 0) {
                if (this.v.x || this.v.y) this.activity = "walking_down"
                else this.activity = "idle_down"
            } else {
                if (this.v.x || this.v.y) this.activity = "walking_up"
                else this.activity = "idle_up"
            }
        }
        this.sprite.setAnimation(this.activity)

        this.sprite.updatePos(this.pos)
        this.sprite.draw()
        // map game position to screen position
        const drawPos = cam.gamePos2ScreenPos(this.pos)
        const drawRadius = PLAYER_RADIUS * cam.config.meter2pixels 
        ctx.fillStyle = 'rgba(0,255,255,0.5)'
        ctx.beginPath()
        ctx.arc(drawPos.x, drawPos.y, drawRadius, 0, Math.PI*2, true)
        ctx.fill()

        // map player reach position
        const drawReachPoint = cam.gamePos2ScreenPos(this.reachPoint)
        ctx.fillStyle = '#00ff00'
        ctx.beginPath()
        ctx.arc(drawReachPoint.x, drawReachPoint.y, 5, 0, Math.PI*2, true)
        ctx.fill()

        // draw reach line
        ctx.strokeStyle = '#00ff00'
        ctx.beginPath()
        ctx.moveTo(drawPos.x, drawPos.y)
        ctx.lineTo(drawReachPoint.x, drawReachPoint.y)
        ctx.stroke()
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