import { cam } from "./graphic/camera";
import { ctx } from "./graphic/graphic";
import alea from "alea"

const CHUNK_SIZE = 128
const GRID_SIZE = 3

export const terrain = {
    init() {
        this.grid = new Array(GRID_SIZE)
        for (let x = 0; x < GRID_SIZE; x++) {
            this.grid[x] = new Array(GRID_SIZE)
            for (let y = 0; y < GRID_SIZE; y++) {
                this.grid[x][y] = createChunk(x - 1, y - 1)
            }
        }

        Object.keys(imgData).forEach(imgId => {
            let img = imgs[imgId] = new Image();
            img.src = imgData[imgId].path;
        });
    },
    draw() {
        let leftX = Math.floor(cam.pos.x + 1)
        if (leftX < this.grid[0][0].x)
            leftX = this.grid[0][0].x
        let topY = Math.floor(cam.pos.y + 1)
        if (topY < this.grid[0][0].y)
            topY = this.grid[0][0].y
        let rightX = Math.floor(cam.pos.x + cam.width)
        if (rightX >= this.grid[2][2].x + CHUNK_SIZE)
            rightX = this.grid[2][2].x + CHUNK_SIZE - 1
        let bottomY = Math.floor(cam.pos.y + cam.height)
        if (bottomY >= this.grid[2][2].y + CHUNK_SIZE)
            bottomY = this.grid[2][2].y + CHUNK_SIZE - 1

        ctx.strokeStyle = "#0090ff"
        ctx.lineWidth = 2
        let drawTopLeft = cam.gamePos2ScreenPos( {x: leftX, y: topY} )

        for (let y = topY; y < bottomY; y++) {
            for (let x = leftX; x < rightX; x++) {
                let chunkIdX = Math.floor((x + CHUNK_SIZE) / CHUNK_SIZE)
                let chunkIdY = Math.floor((y + CHUNK_SIZE) / CHUNK_SIZE)
                let chunk = this.grid[chunkIdX][chunkIdY]
                let tileIdX = x - chunk.x
                let tileIdY = y - chunk.y
                let tileVal = chunk.tiles[tileIdX][tileIdY]
                let dx = x - leftX
                let dy = y - topY
                let drawX = drawTopLeft.x + dx * cam.config.meter2pixels
                let drawY = drawTopLeft.y + dy * cam.config.meter2pixels
                if(tileVal == 0) {
                    ctx.fillStyle = "#0c0c0c"
                    ctx.fillRect(drawX, drawY, cam.config.meter2pixels, cam.config.meter2pixels)
                    ctx.strokeRect(drawX, drawY, cam.config.meter2pixels, cam.config.meter2pixels)
                } else {
                    ctx.fillStyle = "#0ca00c"
                    ctx.fillRect(drawX, drawY, cam.config.meter2pixels, cam.config.meter2pixels)
                    ctx.strokeRect(drawX, drawY, cam.config.meter2pixels, cam.config.meter2pixels)
                    let idata = imgData["tile_tree"]
                    ctx.drawImage(
                        imgs["tile_tree"], 
                        drawX + idata.offX * cam.config.meter2pixels, 
                        drawY + idata.offY * cam.config.meter2pixels,
                        cam.config.meter2pixels * idata.scaleX,
                        cam.config.meter2pixels * idata.scaleY)
                }
            }
        }
    },
    getTileAt(pos) {
        let chunkIdX = Math.floor((pos.x + CHUNK_SIZE) / CHUNK_SIZE)
        let chunkIdY = Math.floor((pos.y + CHUNK_SIZE) / CHUNK_SIZE)
        if (chunkIdX < 0 || chunkIdX >= GRID_SIZE || chunkIdY < 0 || chunkIdY >= GRID_SIZE)
            return {val: 0}
        let chunk = this.grid[chunkIdX][chunkIdY]
        let tileIdX = Math.floor(pos.x) - chunk.x
        let tileIdY = Math.floor(pos.y) - chunk.y
        let tileVal = chunk.tiles[tileIdX][tileIdY]
        return {
            x: Math.floor(pos.x),
            y: Math.floor(pos.y),
            val: tileVal
        }
    }
}

function createChunk(x, y) {
    let random = alea(x + "_" + y)
    let tiles = new Array(CHUNK_SIZE)
    for (let x = 0; x < CHUNK_SIZE; x++) {
        tiles[x] = new Array(CHUNK_SIZE)
        for (let y = 0; y < CHUNK_SIZE; y++) {
            if (x == 0 || y == 0) tiles[x][y] = (random() > 0.8) ? 0 : 1
            else tiles[x][y] = (random() > 0.1) ? 0 : 1
        }
    }
    return {
        x: x * CHUNK_SIZE,
        y: y * CHUNK_SIZE, 
        tiles: tiles
    }
}

let tileValToImgName = {
    1: "tile_tree"
}

let imgs = {}

const imgData = {
    tile_tree: {
        path: "img/tiles/tree.png",
        offX: 0,
        offY: 1 - 50/32,
        scaleY: 50 / 32,
        scaleX: 1
    }
}