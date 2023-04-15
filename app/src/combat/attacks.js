import { dbPathTo, dbUpdater } from "../db/gameDatabase"
import { player } from "../entities/player"
import { collision } from "../physics/collision"
import { combat } from "./combat"

export const attacks = {
    trigger(wielder, mobEntities, playerEntities) {
        const executeAttack = attackFoos[wielder.attack.name]
        if (executeAttack) executeAttack(wielder, mobEntities, playerEntities)
    }
}

export const attacksData = {
    fist: {
        steps: [
            { duration: 200, baseAttack: 10, activity: "punch", continueWindow: 500, name: "punch" },
            { duration: 200, baseAttack: 10, activity: "punch", continueWindow: 500, name: "punch" },
            { duration: 200, baseAttack: 10, activity: "punch", continueWindow: 500, name: "punch" },
            { duration: 200, baseAttack: 10, activity: "kick", continueWindow: 500, name: "punch" }
        ]
    },
    sword: {
        steps: [
            { duration: 200, baseAttack: 10, activity: "punch", continueWindow: 500, name: "punch" },
            { duration: 200, baseAttack: 10, activity: "kick", continueWindow: 500, name: "punch" },
            { duration: 200, baseAttack: 10, activity: "punch", continueWindow: 500, name: "punch" },
            { duration: 500, baseAttack: 10, activity: "kick", continueWindow: 500, name: "punch" }
        ]
    },
    bow: {
        steps: [
            { duration: 100, baseAttack: 10, activity: "360", name: "punch" }
        ]
    }
}

const attackFoos = {
    punch: function (wielder, mobEntities, playerEntities) {
        // if player initiated attack (leftclick)
        let damageHitbox = {
            type: 'line',
            p1: wielder.reachPoint,
            p2: { 
                x: (wielder.pos.x + wielder.reachPoint.x) / 2,
                y: (wielder.pos.y + wielder.reachPoint.y) / 2
            }
        }

        Object.keys(mobEntities).forEach(entityId=> {
            let m = mobEntities[entityId]
            if (collision.detect(damageHitbox, m.hitbox)) {
                //combat.applyKnockbackOnMob(m)
                delete mobs[mobId]
            }
        })

        Object.keys(playerEntities).forEach(entityId=> {
            let victim = playerEntities[entityId]
            if (collision.detect(damageHitbox, victim.hitbox)) {
                let knockback = combat.createKnockbackMovement(player, victim)
                
                dbUpdater.tasks.push({
                    action: "set",
                    where: `${dbPathTo.playerReceivedAttacks}/${entityId}`,
                    val: {
                        dmg: 1,
                        movement: knockback,
                        specialEffects: [
                            // fire, poison, slowness, weakness
                        ]
                    }
                })
            }
        })
    }
}