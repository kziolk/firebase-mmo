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

        // save to variable
        let cnvRect = cnv.getBoundingClientRect()
        this.screen.x = cnvRect.x 
        this.screen.y = cnvRect.y
        this.screen.w = cnvRect.width
        this.screen.h = cnvRect.height

        window.addEventListener('resize', function() {
            let cnvRect = cnv.getBoundingClientRect()
            graphic.screen.x = cnvRect.x 
            graphic.screen.y = cnvRect.y
            graphic.screen.w = cnvRect.width
            graphic.screen.h = cnvRect.height
        });
    },
    screen: { }
}