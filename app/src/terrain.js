import alea from "alea"

export const CHUNK_SIZE = 128
export const GRID_SIZE = 3

export const terrain = {
    init() {
        // add 3x3 grid of chunks
        this.grid = new Array(GRID_SIZE)
        for (let x = 0; x < GRID_SIZE; x++) {
            this.grid[x] = new Array(GRID_SIZE)
            for (let y = 0; y < GRID_SIZE; y++) {
                this.grid[x][y] = createChunk(x - 1, y - 1)
            }
        }
    },
    getTileAt(pos) {
        let chunkIdX = Math.floor((pos.x + CHUNK_SIZE) / CHUNK_SIZE)
        let chunkIdY = Math.floor((pos.y + CHUNK_SIZE) / CHUNK_SIZE)
        // return "null" tile if it's outside the region
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

function createChunk(scaledX, scaledY) {
    // create 128x128 tile area and randomize tile values (0: empty, 1: tree)
    let generateRandom = alea(scaledX + "_" + scaledY)
    let tiles = new Array(CHUNK_SIZE)
    for (let x = 0; x < CHUNK_SIZE; x++) {
        tiles[x] = new Array(CHUNK_SIZE)
        for (let y = 0; y < CHUNK_SIZE; y++) {
            // dense trees (80% chance) on chunk borders
            if (x == 0 || y == 0) tiles[x][y] = (generateRandom() < 0.8) ? 1 : 0
            // else 10% chance for tree
            else tiles[x][y] = (generateRandom() < 0.1) ? 1 : 0
        }
    }
    return {
        x: scaledX * CHUNK_SIZE,
        y: scaledY * CHUNK_SIZE, 
        tiles: tiles
    }
}