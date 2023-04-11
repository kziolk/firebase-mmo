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
    }
}