import { cam } from "../graphic/camera";
import { ctx } from "../graphic/graphic"
import { MovingEntity } from "./MovingEntity";
import { Sprite } from "../graphic/sprite";
import { PLAYER_RADIUS, PLAYER_SPEED } from "./entityConsts"

class OtherPlayer extends MovingEntity {
    constructor() {
        super({
                type: "circle",
                pos: {x: 0, y: 0},
                r: PLAYER_RADIUS
            }, PLAYER_SPEED)
        this.pos = this.hitbox.pos
        this.reachPoint = {x: 0, y: 0}
        this.sprite = new Sprite()
        this.activity = "idle_down"
    }

    draw() {
        this.sprite.setAnimation(this.activity)

        this.sprite.updatePos(this.pos)
        this.sprite.draw()
        // map game position to screen position
        const drawPos = cam.gamePos2ScreenPos(this.pos)
        const drawRadius = PLAYER_RADIUS * cam.config.meter2pixels 
        ctx.fillStyle = 'rgba(0,255,255,0.7)'
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

export const players = {}

export const playersManager = {
    draw() {
        Object.keys(players).forEach(playerKey=>{
            players[playerKey].draw()
        })
    },

    updateMovement(dt) {
        Object.keys(players).forEach(playerKey=>{
            players[playerKey].move(dt)
            //players[playerKey].yBottom = players[playerKey].pos.y + players[playerKey].hitbox.r
        })
    },
    setOtherPlayer(pKey, pVal) {
        if (!players[pKey]) {
            players[pKey] = new OtherPlayer()
        }
        let otherPlayer = players[pKey]
        otherPlayer.pos.x = pVal.x
        otherPlayer.pos.y = pVal.y
        otherPlayer.v.x = pVal.vx
        otherPlayer.v.y = pVal.vy
        otherPlayer.activity = pVal.activity
        otherPlayer.reachPoint.x = pVal.reachPointX
        otherPlayer.reachPoint.y = pVal.reachPointY
    },
    removeOtherPlayer(pKey) {
        delete players[pKey]
    }

}