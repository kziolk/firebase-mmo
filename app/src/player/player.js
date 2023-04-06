import { cam } from "../camera";
import { ctx } from "../canvas"

const PLAYER_RADIUS = .50;

class Player {
    constructor(position) {
        this.pos = position     // game position
        this.vec = {x: 0, y: 0} // velocity vector
        this.speed = 0.004      // meter per milisecond
    }

    update(dt) {
        // move by velocity
        this.pos.x += dt * this.speed * this.vec.x
        this.pos.y += dt * this.speed * this.vec.y
    }

    draw() {
        // map game position to screen position
        const drawPos = cam.gamePos2ScreenPos(this.pos)
        const drawRadius = PLAYER_RADIUS * cam.config.meter2pixels 
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(drawPos.x, drawPos.y, drawRadius, 0, Math.PI*2, true)
        ctx.fill();
    }
}
export let player;
export const players = {
    otherPlayers: {},
    add(pos, id) {
        this.otherPlayers[id] = new Player(pos)
    },
    addMainPlayer(pos) {
        player = new Player(pos)
    },
    update(dt) {
        // update player movement controls
        if (playerControl.pressingLeft && !playerControl.pressingRight)
            player.vec.x = -1
        else if (playerControl.pressingRight && !playerControl.pressingLeft)
            player.vec.x = 1
        else player.vec.x = 0

        if (playerControl.pressingUp && !playerControl.pressingDown)
            player.vec.y = -1
        else if (playerControl.pressingDown && !playerControl.pressingUp)
            player.vec.y = 1
        else player.vec.y = 0

        player.update(dt)
    },
    draw() {
        player.draw()
    }
}

export const playerControl = {
    pressingLeft: false,
    pressingRight: false,
    pressingUp: false,
    pressingDown: false
}