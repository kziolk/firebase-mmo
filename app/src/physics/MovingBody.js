export class MovingBody {
    constructor(hitbox, speed, v = {x: 0, y: 0}) {
        this.hitbox = hitbox
        this.v = v
        this.speed = speed
    }

    move(dt) {
        this.hitbox.pos.x += this.speed * dt * this.v.x
        this.hitbox.pos.y += this.speed * dt * this.v.y
    }

    bounceOffObjects(cBoxes) {
        cBoxes.forEach(cBox => {
            collision.bounseOffCbox(this, cBox);
        });
    }
}