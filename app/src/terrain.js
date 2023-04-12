import alea from "alea"

export const CHUNK_SIZE = 128
export const GRID_SIZE = 3

export const terrain = {
    init() {
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