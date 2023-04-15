import { player } from "../entities/player"

export const combat = {
    createKnockbackMovement(attacker, victim) {
        // distance from player
        let dx = victim.pos.x - attacker.pos.x
        let dy = victim.pos.y - attacker.pos.y
        let dist = Math.sqrt(dx*dx + dy*dy)
        let ratio = 4 / dist // make mob fly 4 meters per sec
        return {
            type: "knockback",
            vx: dx * ratio,
            vy: dy * ratio,
            distance: 0.5
        }
    },
    applyAttackOnPlayer(attack) {
        console.log("Received Attack: ")
        console.log(attack)
        if (attack.movement) player.movement = attack.movement
        player.applyEffects(attack.specialEffects)
        player.hp -= attack.dmg
        if (player.hp <= 0)
            player.respawn()
    }
}