import { player } from "../entities/player"

export const combat = {
    createKnockback(posFrom, posTo, speed, dist) {
        // distance from player
        let dx = posTo.x - posFrom.x
        let dy = posTo.y - posFrom.y
        let pointsDist = Math.sqrt(dx*dx + dy*dy)
        let ratio = 4 / pointsDist // make mob fly 4 meters per sec
        return {
            type: "knockback",
            vx: dx * ratio,
            vy: dy * ratio,
            distance: dist
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

export const applyEffectsOn = {
    player: {
        dmg: function(player, dmg) {
            player.hp -= dmg
            if (player.hp <= 0)
                player.respawn()
        },
        knockback: function(player, knockback) {
            player.movement = knockback
        }
    },
    mobs: {
        dmg: function(mob, dmg) {
            mob.hp -= dmg
            if (mob.hp <= 0)
                mob.kill()
        },
        knockback: function(mob, knockback) {
            mob.movement = knockback
        }
    },
    otherPlayer: function(otherPlayer, effect) {
        
    }
}