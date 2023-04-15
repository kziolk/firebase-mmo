import { cam } from "./camera"
import { debugInfo } from "../dbg"
import { mobs } from "../entities/mobs/mobsManager"
import { input } from "../input"
import { player, playerDebugData } from "../entities/player"
import { CHUNK_SIZE, terrain } from "../terrain"
import { players } from "../entities/playersManager"
import { hotbar } from "../eq/eq"
import { PLAYER_RADIUS } from "../entities/entityConsts"
import { timeNow } from "../game"
import { gui } from "./gui"

export const cnv = document.getElementById("game-container")
export const ctx = cnv.getContext('2d')

export const graphic = {
    config: {
        sizeRatio: 16/9
    },
    darken: false,
    init() {
        // set size of canvas relative to the screen
        resizeCanvas()
        // canvas on window resize
        window.addEventListener('resize', function() {
            resizeCanvas()
            cam.resize()
            gui.resize()
        });
        // init images
        Object.keys(imgData).forEach(imgId => {
            let img = imgs[imgId] = new Image();
            img.src = imgData[imgId].path;
        });

        gui.init()
    },
    screen: { },
    draw() {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, cnv.width, cnv.height)

        // tiles and entities between tiles
        drawTerrain()

        //for debug
        drawPlayerAttackBars()

        // hotbar / inventory
        gui.draw()

        // debug info
        drawCoords()

        // collision box a
        //cam.draw()
        if(this.darken) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
            ctx.fillRect(0, 0, cnv.width, cnv.height)
        }
    }
}

let allEntities = []
function drawTerrain() {
    sortAllEntities()
    let nextEntityIdToDraw = 0
    
    let leftX = Math.floor(cam.pos.x + 1)
    if (leftX < terrain.grid[0][0].x)
        leftX = terrain.grid[0][0].x
    let topY = Math.floor(cam.pos.y + 1)
    if (topY < terrain.grid[0][0].y)
        topY = terrain.grid[0][0].y
    let rightX = Math.floor(cam.pos.x + cam.width)
    if (rightX >= terrain.grid[2][2].x + CHUNK_SIZE)
        rightX = terrain.grid[2][2].x + CHUNK_SIZE - 1
    let bottomY = Math.floor(cam.pos.y + cam.height)
    if (bottomY >= terrain.grid[2][2].y + CHUNK_SIZE)
        bottomY = terrain.grid[2][2].y + CHUNK_SIZE - 1

    let topLeftDrawPos = cam.gamePos2ScreenPos( {x: leftX, y: topY} )

    for (let y = topY; y < bottomY; y++) {
        let wallTiles = []
        // layer 1: row of floor tiles
        ctx.strokeStyle = "#0090ff"
        ctx.lineWidth = 2
        for (let x = leftX; x < rightX; x++) {
            let chunkIdX = Math.floor((x + CHUNK_SIZE) / CHUNK_SIZE)
            let chunkIdY = Math.floor((y + CHUNK_SIZE) / CHUNK_SIZE)
            let chunk = terrain.grid[chunkIdX][chunkIdY]
            let tileIdX = x - chunk.x
            let tileIdY = y - chunk.y
            let tileVal = chunk.tiles[tileIdX][tileIdY]
            let dx = x - leftX
            let dy = y - topY
            let drawX = topLeftDrawPos.x + dx * cam.config.meter2pixels
            let drawY = topLeftDrawPos.y + dy * cam.config.meter2pixels
            if(tileVal == 0) {
                // tile doesn't have a wall
                ctx.fillStyle = "#0c0c0c"
                ctx.fillRect(drawX, drawY, cam.config.meter2pixels, cam.config.meter2pixels)
                ctx.strokeRect(drawX, drawY, cam.config.meter2pixels, cam.config.meter2pixels)
            } else {
                // tile has a wall. save it to render on top of entitites
                ctx.fillStyle = "#0ca00c"
                ctx.fillRect(drawX, drawY, cam.config.meter2pixels, cam.config.meter2pixels)
                ctx.strokeRect(drawX, drawY, cam.config.meter2pixels, cam.config.meter2pixels)
                let idata = imgData["tile_tree"]
                wallTiles.push({
                    img: imgs["tile_tree"],
                    x: drawX + idata.offX * cam.config.meter2pixels,
                    y: drawY + idata.offY * cam.config.meter2pixels,
                    width: cam.config.meter2pixels * idata.scaleX,
                    height: cam.config.meter2pixels * idata.scaleY
                })
            }
        }
        // layer 2: after row of tiles, draw entities on top
        while (nextEntityIdToDraw < allEntities.length && 
        y + 1 > allEntities[nextEntityIdToDraw].yBottom ) {
            allEntities[nextEntityIdToDraw].draw()
            nextEntityIdToDraw++
        }

        // layer 3: draw walls that cover entities
        wallTiles.forEach(wallTile=>{
            ctx.drawImage(wallTile.img, wallTile.x, wallTile.y, wallTile.width, wallTile.height)
        })
    }
    // after that, draw all of remaining entities
    while (nextEntityIdToDraw < allEntities.length) {
        allEntities[nextEntityIdToDraw].draw()
        nextEntityIdToDraw++
    }
}

function drawPlayerAttackBars() {
    if (player.occupied) {
        let barX = player.pos.x - PLAYER_RADIUS
        let barY = player.pos.y - PLAYER_RADIUS
        let barH = PLAYER_RADIUS * 2 * playerDebugData.actionProgress
        barY += PLAYER_RADIUS * 2 - barH
        let barDrawPos = cam.gamePos2ScreenPos({x: barX, y: barY})
        ctx.fillStyle = "red"
        ctx.fillRect(barDrawPos.x - 30, barDrawPos.y, 20, barH * cam.config.meter2pixels)
    } else if (playerDebugData.comboGapStatus) {
        let barX = player.pos.x - PLAYER_RADIUS
        let barY = player.pos.y - PLAYER_RADIUS
        let barH = PLAYER_RADIUS * 2 * (playerDebugData.comboGapStatus)
        barY += PLAYER_RADIUS * 2 - barH
        let barDrawPos = cam.gamePos2ScreenPos({x: barX, y: barY})
        ctx.fillStyle = "yellow"
        ctx.fillRect(barDrawPos.x - 30, barDrawPos.y, 20, barH * cam.config.meter2pixels)
    }
}

function drawCoords() {
    ctx.fillStyle = 'yellow'
    ctx.font = "20px Arial";
    ctx.fillText("fps: " + debugInfo.fps.toFixed(2), 24, 30)
    ctx.fillText("player x: " + player.pos.x.toFixed(2) + ", y: " + player.pos.y.toFixed(2), 24, 60)
    ctx.fillText("cam x: " + cam.pos.x.toFixed(2) + ", y: " + cam.pos.y.toFixed(2), 24, 90)
    ctx.fillText("mouse x: " + input.mouse.pos.x.toFixed(2) + ", y: " + input.mouse.pos.y.toFixed(2), 24, 120)
    ctx.fillText("HP: " + player.hp, 24, 150)
}

function sortAllEntities() {
    allEntities = [player]
    Object.keys(mobs).forEach(mobId => {
        let mob = mobs[mobId]
        allEntities.push(mob)
    })
    Object.keys(players).forEach(playerId => {
        let otherPlayer = players[playerId]
        allEntities.push(otherPlayer)
    })
    allEntities.sort((lhs, rhs) => lhs.yBottom - rhs.yBottom)
}

function resizeCanvas() {
    let windowSizeRatio = window.innerWidth / window.innerHeight

    if (windowSizeRatio > graphic.config.sizeRatio) {
        // browser window is wider than 16/9
        cnv.height = window.innerHeight
        cnv.width = cnv.height * graphic.config.sizeRatio
    } else {
        // browser window is narrower than 16/9
        cnv.width = window.innerWidth
        cnv.height = cnv.width / graphic.config.sizeRatio
    }
    // init canvas style
    cnv.style.display = 'block'
    cnv.style.margin = 'auto'
    // center canvas vertically
    cnv.style.position = 'relative'
    cnv.style.top = '50%'
    cnv.style.transform = 'translateY(-50%)'

    ctx.imageSmoothingEnabled = false; // set this at the end
    // save to variable for checking mouse relatively to canvas
    let cnvRect = cnv.getBoundingClientRect()
    graphic.screen.x = cnvRect.x 
    graphic.screen.y = cnvRect.y
    graphic.screen.w = cnvRect.width
    graphic.screen.h = cnvRect.height
}


const tileValToImgName = {
    1: "tile_tree"
}

const imgs = {}

const imgData = {
    tile_tree: {
        path: "img/tiles/tree.png",
        offX: 0,
        offY: 1 - 50/32,
        scaleY: 50 / 32,
        scaleX: 1
    }
}