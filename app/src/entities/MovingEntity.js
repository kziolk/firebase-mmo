const updateFooTypes = {
    default: function (mEntity, dt) {
        mEntity.hitbox.pos.x += mEntity.speed * dt * mEntity.v.x
        mEntity.hitbox.pos.y += mEntity.speed * dt * mEntity.v.y
    },
    knockback: function (mEntity, dt) {
        let dx = mEntity.speed * dt * mEntity.state.vx
        let dy = mEntity.speed * dt * mEntity.state.vy
        mEntity.hitbox.pos.x += dx
        mEntity.hitbox.pos.y += dy
        let dist = Math.sqrt(dx*dx + dy*dy)
        mEntity.state.distance -= dist
        if(mEntity.state.distance <= 0)
            mEntity.state.type = "default"
    }
}

export class MovingEntity {
    constructor(hitbox, speed, v = {x: 0, y: 0}, state = {type: "default"}) {
        this.hitbox = hitbox
        this.v = v
        this.speed = speed
        this.state = state
    }

    update(dt) {
        updateFooTypes[this.state.type](this, dt)
    }

    bounceOffObjects(cBoxes) {
        cBoxes.forEach(cBox => {
            collision.bounseOffCbox(this, cBox);
        });
    }
}