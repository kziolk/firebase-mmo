import { cam } from "../../graphic/camera"
import { ctx } from "../../graphic/graphic"
import { player } from "../player"
import { MovingEntity, vectorUpdateKnockback } from "../MovingEntity"
import { MOB_RADIUS, MOB_SPEED, MOB_RANGE } from "../entityConsts"

export class Mob extends MovingEntity {
    constructor(position) { 
        super({
                type: "circle",
                pos: position,
                r: MOB_RADIUS
            }, MOB_SPEED)
        this.pos = this.hitbox.pos
        this.health = 3
    }

    updateActions(dt) {}

    updateMovement(dt) {
        updateMobVelocityVector(this, dt)
        this.move(dt)
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


function updateMobVelocityVector(mob, dt) {
    mobVectorUpdateFoos[mob.state.type](mob, dt)
}
const mobVectorUpdateFoos = {
    default: function (mEntity, dt) {
        // update player movement controls
        mEntity.v.x = (mEntity.pos.x - player.pos.x > 0) ? -1 : 1
        mEntity.v.y = (mEntity.pos.y - player.pos.y > 0) ? -1 : 1
    },
    knockback: vectorUpdateKnockback
}