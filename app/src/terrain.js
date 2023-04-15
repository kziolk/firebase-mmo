import alea from "alea"
import { player } from "./entities/player"
import { timeNow } from "./game"

export const CHUNK_SIZE = 2
export const GRID_SIZE = 3
let playerChunkPos
let lastBufferPurgeTime
const bufferPurgeDelay = 60 * 1000 

export const terrain = {
    init() {
        this.chunkBuffer = {}
        lastBufferPurgeTime = timeNow
        // create 3x3 area of chunks around player
        playerChunkPos = pos2ChunkPos(player.pos)
        this.grid = new Array(GRID_SIZE)
        for (let gx = 0; gx < GRID_SIZE; gx++) {
            this.grid[gx] = new Array(GRID_SIZE)
            for (let gy = 0; gy < GRID_SIZE; gy++) {
                let cx = playerChunkPos.x + (gx - 1) * CHUNK_SIZE
                let cy = playerChunkPos.y + (gy - 1) * CHUNK_SIZE
                fetchChunkAtXY(cx, cy)
                let chunkId = xyToId(cx, cy)
                this.grid[gx][gy] = this.chunkBuffer[chunkId]
                this.grid[gx][gy].loaded = true
            }
        }

    },
    update() {
        // load chunks if player changed chunks
        
        // for chunks that were on the grid last frame
        let oldChunkIds = []
        // for chunks that are on the grid this frame
        let newChunkIds = []
        
        playerChunkPos = pos2ChunkPos(player.pos)
        // loop through player grid
        for (let gx = 0; gx < GRID_SIZE; gx++) {
            for (let gy = 0; gy < GRID_SIZE; gy++) {
                // save chunk id from previous frame 
                let oldCx = this.grid[gx][gy].x
                let oldCy = this.grid[gx][gy].y
                oldChunkIds.push(xyToId(oldCx, oldCy))

                // save chunk id from current frame 
                let cx = playerChunkPos.x + (gx - 1) * CHUNK_SIZE
                let cy = playerChunkPos.y + (gy - 1) * CHUNK_SIZE
                newChunkIds.push(xyToId(cx, cy))
            }
        }
        // for every chunk from previous frame
        oldChunkIds.forEach(oldId => {
            // if it's no longer on this frame, then unload chunk
            if (!newChunkIds.includes(oldId)) {
                console.log("bye old chunk")
                // unloadChunk(oldId)
                this.chunkBuffer[oldId].loaded = false
            }
        })

        // for every chunk from this frame
        newChunkIds.forEach(newId => {
            // if it wasn't in previous frame, then load chunk
            if (!oldChunkIds.includes(newId)) {
                console.log("hello new chunk")
                // loadChunk(newId)
                let chunkPos = idToXY(newId)
                fetchChunkAtXY(chunkPos.x, chunkPos.y)
                this.chunkBuffer[newId].loaded = true
            }
        })

        // loop again to update grid with changes
        for (let gx = 0; gx < GRID_SIZE; gx++) {
            for (let gy = 0; gy < GRID_SIZE; gy++) {
                let cx = playerChunkPos.x + (gx - 1) * CHUNK_SIZE
                let cy = playerChunkPos.y + (gy - 1) * CHUNK_SIZE
                this.grid[gx][gy] = this.chunkBuffer[xyToId(cx, cy)]
            }
        }

        if (timeNow - lastBufferPurgeTime > bufferPurgeDelay) {
            let purgeCount = 0
            Object.keys(this.chunkBuffer).forEach(chunkId => {
                let chunk = this.chunkBuffer[chunkId]
                if (!chunk.loaded) {
                    purgeCount ++
                    delete this.chunkBuffer[chunkId]
                }
            })
            console.log("Deleted " + purgeCount + " chunks from memory")
            lastBufferPurgeTime = timeNow
        }
        
    },
    getTileAt(pos) {
        // return "null" chunk isn't loaded
        let chunkPos = pos2ChunkPos(pos)
        let chunkId = xyToId(chunkPos.x, chunkPos.y)
        let chunk = this.chunkBuffer[chunkId]
        if (!chunk || !chunk.tiles) return {val: 0}
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

function generateChunkTiles(cx, cy) {
    // create 128x128 tile area and randomize tile values (0: empty, 1: tree)
    let chunkId = xyToId(cx, cy)
    let generateRandom = alea(chunkId)
    let tiles = new Array(CHUNK_SIZE)
    for (let tx = 0; tx < CHUNK_SIZE; tx++) {
        tiles[tx] = new Array(CHUNK_SIZE)
        for (let ty = 0; ty < CHUNK_SIZE; ty++) {
            // dense trees (80% chance) on chunk borders
            if (tx == 0 || ty == 0) tiles[tx][ty] = (generateRandom() < 0.1) ? 1 : 0
            // else 10% chance for tree
            else tiles[tx][ty] = (generateRandom() < 0.1) ? 1 : 0
        }
    }
    return tiles
}

function pos2ChunkPos(pos) {
    return {
        x: Math.floor(pos.x / CHUNK_SIZE) * CHUNK_SIZE,
        y: Math.floor(pos.y / CHUNK_SIZE) * CHUNK_SIZE
    }
}

function fetchChunkAtXY(cx, cy) {
    // create empty chunk
    let chunkId = xyToId(cx, cy)
    terrain.chunkBuffer[chunkId] = {
        x: cx,
        y: cy,
        tiles: null
    }
    // grabbing chunk from db...
    new Promise(resolve => setTimeout(resolve, 2000)).
    then(() => {
        // set chunk
        terrain.chunkBuffer[chunkId].tiles = generateChunkTiles(cx, cy)
    })
}

function xyToId(cx, cy) {
    return (
        10000000 * (5000000 + cx / CHUNK_SIZE) + 
        5000000 + cy / CHUNK_SIZE
    )
}
function idToXY(id) {
    let cx = Math.floor(id / 10000000 - 5000000) * CHUNK_SIZE
    let cy = (id%10000000 - 5000000) * CHUNK_SIZE
    return {
        x: cx,
        y: cy
    }
}