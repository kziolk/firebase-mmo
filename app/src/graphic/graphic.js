import { cam } from "./camera"
import { debugInfo } from "../dbg"
import { mobs, mobsManager } from "../entities/mobs/mobsManager"
import { input } from "../input"
import { player } from "../entities/player"
import { CHUNK_SIZE, terrain } from "../terrain"
import { players, playersManager } from "../entities/playersManager"

export const cnv = document.getElementById("game-container")
export const ctx = cnv.getContext('2d')

export const graphic = {
    init() {
        // init canvas style and size
        cnv.width = 1024
        cnv.height = 576
        cnv.style.display = 'block'
        cnv.style.margin = 'auto'
        
        // center canvas vertically
        cnv.style.position = 'relative'
        cnv.style.top = '50%'
        cnv.style.transform = 'translateY(-50%)'

        ctx.imageSmoothingEnabled = false; // set this at the end
        // save to variable for checking mouse relatively to canvas
        let cnvRect = cnv.getBoundingClientRect()
        this.screen.x = cnvRect.x 
        this.screen.y = cnvRect.y
        this.screen.w = cnvRect.width
        this.screen.h = cnvRect.height

        // save to variable every resize
        window.addEventListener('resize', function() {
            let cnvRect = cnv.getBoundingClientRect()
            graphic.screen.x = cnvRect.x 
            graphic.screen.y = cnvRect.y
            graphic.screen.w = cnvRect.width
            graphic.screen.h = cnvRect.height
            ctx.imageSmoothingEnabled = false;
        });

        // init images
        Object.keys(imgData).forEach(imgId => {
            let img = imgs[imgId] = new Image();
            img.src = imgData[imgId].path;
        });
    },
    screen: { },
    draw() {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, cnv.width, cnv.height)

        drawTerrain()

        drawCoords()

        //cam.draw()
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
        // layer 1: floor tiles
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
                ctx.fillStyle = "#0c0c0c"
                ctx.fillRect(drawX, drawY, cam.config.meter2pixels, cam.config.meter2pixels)
                ctx.strokeRect(drawX, drawY, cam.config.meter2pixels, cam.config.meter2pixels)
            } else {
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
    // after that, draw all the rest entities
    while (nextEntityIdToDraw < allEntities.length) {
        allEntities[nextEntityIdToDraw].draw()
        nextEntityIdToDraw++
    }
}

function drawCoords() {
    ctx.fillStyle = 'yellow'
    ctx.font = "20px Arial";
    ctx.fillText("fps: " + debugInfo.fps.toFixed(2), 24, 30)
    ctx.fillText("player x: " + player.pos.x.toFixed(2) + ", y: " + player.pos.y.toFixed(2), 24, 60)
    ctx.fillText("cam x: " + cam.pos.x.toFixed(2) + ", y: " + cam.pos.y.toFixed(2), 24, 90)
    ctx.fillText("that box x: " + cam.boxOfStillness.pos.x.toFixed(2) + ", y: " + cam.boxOfStillness.pos.y.toFixed(2), 24, 120)
    ctx.fillText("mouse x: " + input.mouse.pos.x.toFixed(2) + ", y: " + input.mouse.pos.y.toFixed(2), 24, 150)
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