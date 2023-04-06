export const cnv = document.getElementById("game-container")
export const ctx = cnv.getContext('2d')

export const graphic = {
    init() {
        ctx.imageSmoothingEnabled = false;
        cnv.width = 1024
        cnv.height = 576
        // center horisontally
        cnv.style.display = 'block'
        cnv.style.margin = 'auto'
        
        // center vertically
        cnv.style.position = 'relative'
        cnv.style.top = '50%'
        cnv.style.transform = 'translateY(-50%)'
    }
}