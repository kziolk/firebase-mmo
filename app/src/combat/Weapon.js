import { collision } from "../physics/collision"
import { combat } from "./combat"

export class Weapon {
    constructor(wielder) {
        this.wielder = wielder
        this.lastUseTime = 0
    }

    attack(entities) {
        // if player initiated attack (leftclick)
        let damageHitbox = {
            type: 'line',
            p1: this.wielder.reachPoint,
            p2: { 
                x: (this.wielder.pos.x + this.wielder.reachPoint.x) / 2,
                y: (this.wielder.pos.y + this.wielder.reachPoint.y) / 2
            }
        }

        Object.keys(entities).forEach(entityId=> {
            let mob = entities[entityId]
            if (collision.detect(damageHitbox, mob.hitbox)) {
                combat.applyKnockbackOnMob(mob)
                //delete mobs[mobId]
            }
        })
    }

}