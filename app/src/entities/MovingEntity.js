import { MovingBody } from "../physics/MovingBody"

export class MovingEntity extends MovingBody {
    constructor(hitbox, speed, v = {x:0, y:0}) {
        super(hitbox,speed,v)
        this.movement = {
            type: "default"
        }
    }
}

export function updateEntityKnockback(entity, dt) {
    // set vector to knockback-defined vector
    entity.v.x = entity.movement.vx
    entity.v.y = entity.movement.vy
    // calculate distance delta for this frame
    let dx = entity.speed * dt * entity.movement.vx
    let dy = entity.speed * dt * entity.movement.vy
    let dist = Math.sqrt(dx*dx + dy*dy)
    // subtract distance delta from knockback-defined distance
    entity.movement.distance -= dist
    // if the distance was covered, then change movement type to default
    if(entity.movement.distance <= 0)
        entity.movement.type = "default"
}
export function updateEntityTimeKnockback(entity, dt) {
    // set vector to knockback-defined vector
    entity.v.x = entity.movement.vx
    entity.v.y = entity.movement.vy
    // subtract delta time from knockback-defined time length
    entity.movement.time -= dt
    // if the time has passed, then change movement type to default
    if(entity.movement.time <= 0)
        entity.movement.type = "default"

}
export function updateEntityStun(entity, dt) {
    // set vector to zero
    entity.v.x = entity.v.y = 0
    // subtract delta time from knockback-defined time length
    entity.movement.time -= dt
    // if the time has passed, then change movement type to default
    if(entity.movement.time <= 0)
        entity.movement.type = "default"
}