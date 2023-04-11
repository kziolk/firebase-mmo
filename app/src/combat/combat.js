import { mobs } from "../entities/mobs/mobsManager"
import { player } from "../entities/player"
import { collision } from "../physics/collision"

export const combat = {
    attack(entityHitbox, attackPoint, weaponName) {
        weapons[weaponName].attack(entityHitbox, attackPoint)
    }
}

const weapons = {
    fist: {
        attack: function (entityHitbox, attackPoint) {
            // if player initiated attack (leftclick)
            let damageHitbox = {
                type: 'line',
                p1: player.reachPoint,
                p2: { 
                    x: (entityHitbox.pos.x + attackPoint.x) / 2,
                    y: (entityHitbox.pos.y + attackPoint.y) / 2
                }
            }
    
            Object.keys(mobs).forEach(mobId=> {
                let mob = mobs[mobId]
                let mobHitBox = {
                    type: 'circle',
                    pos: mob.pos,
                    r: 0.4
                }
                if (collision.detect(damageHitbox, mobHitBox)) {
                    applyKnockbackOnMob(mob)
                    //delete mobs[mobId]
                }
            })
        }
    }
}

function applyKnockbackOnMob(mob) {
    // distance from player
    let dx = mob.pos.x - player.pos.x
    let dy = mob.pos.y - player.pos.y
    let dist = Math.sqrt(dx*dx + dy*dy)
    let ratio = 4 / dist // make mob fly 2 meters per sec

    mob.state = {
        type: "knockback",
        vx: dx * ratio,
        vy: dy * ratio,
        distance: 2
    }
}