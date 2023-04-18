import { dbPathTo, dbUpdater } from "../db/gameDatabase"
import { mobs } from "../entities/mobs/mobsManager"
import { player } from "../entities/player"
import { collision } from "../physics/collision"
import { applyEffectsOn, combat } from "./combat"

export const attacks = {
    trigger(wielder, victims, excludes) {
        const executeAttack = attackFoos[wielder.attack.name]
        if (executeAttack) executeAttack(wielder, victims, excludes)
    }
}

export const attacksData = {
    fist: {
        steps: [
            { duration: 200, baseDmg: 1, activity: "punch_r", continueWindow: 500, name: "punch" },
            { duration: 200, baseDmg: 1, activity: "punch_l", name: "punch" }
        ]
    },
    sword: {
        steps: [
            { duration: 400, baseDmg: 2, activity: "swordswipe", name: "punch" }
        ]
    },
    bow: {
        steps: []
    }
}

const attackFoos = {
    punch: function (wielder, victims, excludes) {
        // create attack hitbox
        let damageHitbox = {
            type: 'line',
            p1: wielder.reachPoint,
            p2: { 
                x: (wielder.pos.x + wielder.reachPoint.x) / 2,
                y: (wielder.pos.y + wielder.reachPoint.y) / 2
            }
        }
         
        // create attack effects
        let effects = {
            dmg: wielder.attack.step.baseDmg,
            knockback: combat.createKnockback(wielder.pos, wielder.reachPoint, 4, 0.8)
        }
        Object.keys(victims).forEach(victimType=> {
            let entities = victims[victimType]
            Object.keys(entities).forEach(eId => {
                let victim = entities[eId]
                // if collision detected then apply attack effects on the victim entity
                if (collision.detect(damageHitbox, victim.hitbox)) {
                    Object.keys(effects).forEach(eName=>{
                        let effect = effects[eName]
                        applyEffectsOn[victimType][eName](victim, effect)
                    })
                }

            })
        })

        // Object.keys(playerEntities).forEach(entityId=> {
        //     let victim = playerEntities[entityId]
        //     if (collision.detect(damageHitbox, victim.hitbox)) {
        //         let knockback = combat.createKnockbackMovement(player, victim)
                
        //         dbUpdater.tasks.push({
        //             action: "set",
        //             where: `${dbPathTo.playerReceivedAttacks}/${entityId}`,
        //             val: {
        //                 dmg: 1,
        //                 movement: knockback,
        //                 specialEffects: [
        //                     // fire, poison, slowness, weakness
        //                 ]
        //             }
        //         })
        //     }
        // })
    }
}