import { cam } from "../graphic/camera";
import { ctx } from "../graphic/graphic"
import { combat } from "../combat/combat";
import { input } from "../input";
import { MovingEntity } from "./MovingEntity";

export const PLAYER_RADIUS = .4;
export const PLAYER_REACH_DISTANCE = 1.2
const PLAYER_SPEED = 0.004

export const player = {
    init(position) {
        this.mEntity = new MovingEntity({
            type: "circle",
            pos: position,
            r: PLAYER_RADIUS
        }, PLAYER_SPEED)
        this.pos = this.mEntity.hitbox.pos // game position
        this.v = this.mEntity.v     // velocity vector
        this.reachPoint = {x: 0, y: 0}
        this.currentWeapon = "fist"
        this.attackTriggered = false
    },
    updateActions(dt) {
        updatePlayerReachPoint()
        if (this.attackTriggered) {
            combat.attack(this.mEntity.hitbox, this.reachPoint, this.currentWeapon)
            this.attackTriggered = false
        }
    },
    updateMovement(dt) {
        updatePlayerVelocityVector()
        // move by velocity
        this.mEntity.update(dt)
    },
    draw() {
        // map game position to screen position
        const drawPos = cam.gamePos2ScreenPos(this.pos)
        const drawRadius = PLAYER_RADIUS * cam.config.meter2pixels 
        ctx.fillStyle = 'white'
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

function updatePlayerVelocityVector() {
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
}