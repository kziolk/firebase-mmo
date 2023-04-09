import { cam } from "../../graphic/camera"
import { ctx } from "../../graphic/graphic"
import { player } from "../player"
import { MovingEntity } from "../MovingEntity"
export const MOB_RADIUS = 0.4
export const MOB_RANGE = 0.6
const MOB_SPEED = 0.002

export class Mob {
    constructor(position) { 
        this.mEntity = new MovingEntity({
            type: "circle",
            pos: position,
            r: MOB_RADIUS
        }, MOB_SPEED)
        this.pos = this.mEntity.hitbox.pos
        this.v = this.mEntity.v
    }

    updateActions(dt){}

    updateMovement(dt) {
        this.v.x = (this.pos.x - player.pos.x > 0) ? -1 : 1
        this.v.y = (this.pos.y - player.pos.y > 0) ? -1 : 1
        this.mEntity.update(dt)
    }

    draw() {
        // map game position to screen position
        const drawPos = cam.gamePos2ScreenPos(this.pos)
        const drawRadius = MOB_RADIUS * cam.config.meter2pixels 
        const drawRange = MOB_RANGE * cam.config.meter2pixels 
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(drawPos.x, drawPos.y, drawRange, 0, Math.PI*2, true)
        ctx.fill();
        ctx.fillStyle = 'grey';
        ctx.beginPath();
        ctx.arc(drawPos.x, drawPos.y, drawRadius, 0, Math.PI*2, true)
        ctx.fill();
    }

    pathFindPlayer() {

    }
}