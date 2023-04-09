import { Mob } from "./mob"

export const mobs = {}
export const mobsManager = {
    createMob(pos) {
        let mobKey = Math.floor(Math.random() * 10000000)
        mobs[mobKey] = new Mob(pos)
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