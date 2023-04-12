import { dbUpdater } from "../db/gameDatabase"
import { player } from "../entities/player"

export const combat = {
    applyKnockbackOnMob(mob) {
        // distance from player
        let dx = mob.pos.x - player.pos.x
        let dy = mob.pos.y - player.pos.y
        let dist = Math.sqrt(dx*dx + dy*dy)
        let ratio = 4 / dist // make mob fly 4 meters per sec
    
        mob.state = {
            type: "knockback",
            vx: dx * ratio,
            vy: dy * ratio,
            distance: 2
        }
    },
    applyKnockbackOnOtherPlayer(p, entityId) {
        // distance from player
        let dx = p.pos.x - player.pos.x
        let dy = p.pos.y - player.pos.y
        let dist = Math.sqrt(dx*dx + dy*dy)
        let ratio = 2 / dist // make mob fly 4 meters per sec

        dbUpdater.tasks.push({
            action: "set",
            where: `2_0/playersStates/${entityId}`,
            val: {
                type: "knockback",
                vx: dx * ratio,
                vy: dy * ratio,
                distance: 0.5
            }
        })
    },
    applyStateOnPlayer(state) {
        player.state = state
    }
}