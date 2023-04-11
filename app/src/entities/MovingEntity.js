import { MovingBody } from "../physics/MovingBody"

export class MovingEntity extends MovingBody {
    constructor(hitbox, speed, v = {x:0, y:0}, state = {type: "default"}) {
        super(hitbox,speed,v)
        this.state = state
    }
}

export function vectorUpdateKnockback(mEntity, dt) {
    mEntity.v.x = mEntity.state.vx
    mEntity.v.y = mEntity.state.vy
    let dx = mEntity.speed * dt * mEntity.state.vx
    let dy = mEntity.speed * dt * mEntity.state.vy
    let dist = Math.sqrt(dx*dx + dy*dy)
    mEntity.state.distance -= dist
    if(mEntity.state.distance <= 0)
        mEntity.state.type = "default"
}