import { Mob } from "./mob"

export const mobs = {}
export const mobsManager = {
    createMob(pos) {
        let mobId = Math.floor(Math.random() * 10000000)
        mobs[mobId] = new Mob(pos, mobId)
    },
    updateActions(dt) {
        Object.keys(mobs).forEach(mobKey=>{
            mobs[mobKey].updateActions(dt)
        })
    },
    updateMovement(dt) {
        Object.keys(mobs).forEach(mobKey=>{
            mobs[mobKey].updateMovement(dt)
        })
    },
    draw() {
        Object.keys(mobs).forEach(mobKey=>{
            mobs[mobKey].draw()
        })
    }
}