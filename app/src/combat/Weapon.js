import { collision } from "../physics/collision"
import { combat } from "./combat"

export class Weapon {
    constructor(wielder) {
        this.wielder = wielder
        this.lastUseTime = 0
    }

    attack(mobEntities, playerEntities) {
        // if player initiated attack (leftclick)
        let damageHitbox = {
            type: 'line',
            p1: this.wielder.reachPoint,
            p2: { 
                x: (this.wielder.pos.x + this.wielder.reachPoint.x) / 2,
                y: (this.wielder.pos.y + this.wielder.reachPoint.y) / 2
            }
        }

        Object.keys(mobEntities).forEach(entityId=> {
            let m = mobEntities[entityId]
            if (collision.detect(damageHitbox, m.hitbox)) {
                combat.applyKnockbackOnMob(m)
                //delete mobs[mobId]
            }
        })

        Object.keys(playerEntities).forEach(entityId=> {
            let p = playerEntities[entityId]
            if (collision.detect(damageHitbox, p.hitbox)) {
                combat.applyKnockbackOnOtherPlayer(p, entityId)
                //delete mobs[mobId]
            }
        })
    }

}