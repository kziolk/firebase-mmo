import { PLAYER_RADIUS } from "./player"

class otherPlayer {
    constructor(position) {
        this.hitbox = {
            type: "circle",
            pos: position,
            r: PLAYER_RADIUS
        }
        this.pos = this.hitbox.pos // game position
        this.reachPoint = {x: 0, y: 0}
        this.speed = 0.004      // meter per milisecond
    }
    draw() {
        // map game position to screen position
        const drawPos = cam.gamePos2ScreenPos(this.pos)
        const drawRadius = PLAYER_RADIUS * cam.config.meter2pixels 
        ctx.fillStyle = 'white'
        // draw player dot
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
    }

}