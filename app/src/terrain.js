import { cam } from "./camera";
import { ctx } from "./canvas";

export const terrain = {
    init() {
        
    },
    draw() {
        ctx.strokeStyle = "#0090ff"
        ctx.lineWidth = 2
        let drawTopLeft = cam.gamePos2ScreenPos({
            x: Math.floor(cam.pos.x),
            y: Math.floor(cam.pos.y)})
        for (let ix = 1; ix < cam.w; ix++) {
            for (let iy = 1; iy < cam.h; iy++) {
                let drawX = drawTopLeft.x + ix * cam.config.meter2pixels
                let drawY = drawTopLeft.y + iy * cam.config.meter2pixels
                ctx.strokeRect(drawX, drawY, cam.config.meter2pixels, cam.config.meter2pixels)
            }
        }
    }
}