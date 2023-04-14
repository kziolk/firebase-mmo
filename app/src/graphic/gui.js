import { ctx, cnv } from "./graphic";
import { eq } from "../eq/eq";
import { input } from "../input";


export const gui = {
    config:{},
    show: { hotbar: true, inventory: false },
    hotbar:{},
    eq:{},
    itemSlot: {},
    init() {
        // init images
        Object.keys(imgData).forEach(imgId => {
            let img = imgs[imgId] = new Image();
            img.src = imgData[imgId].path;
        });
        this.resize()

    },
    resize() {
        // init config
        // canvas pixels per image pixel 
        this.config.ratio = (cnv.width / 2) / 360

        // init hotbar
        this.hotbar.width = 360 * this.config.ratio
        this.hotbar.height = 40 * this.config.ratio
        this.hotbar.x = cnv.width / 4
        this.hotbar.y = cnv.height - 1.5 * this.hotbar.height

        // init item slot size
        this.itemSlot.size = this.hotbar.height

        // init inventory
        this.eq.width = 520 * this.config.ratio
        this.eq.height = 400 * this.config.ratio
        this.eq.x = this.hotbar.x - 80 * this.config.ratio
        this.eq.y = this.hotbar.y - 342 * this.config.ratio
        this.eq.backpack = {
            x: this.eq.x + (80 * this.config.ratio),
            y: this.eq.y + (212 * this.config.ratio)
        }
        this.eq.armor = {
            x: this.eq.x + (10 * this.config.ratio),
            y: this.eq.y + (10 * this.config.ratio)
        }
    },
    openInventory() {
        this.show.inventory = true
        this.show.hotbar = false
        this.eq.hovered = { section: null }
        this.eq.selected = { section: null }
    },
    closeInventory() {
        this.show.inventory = false
        this.show.hotbar = true
    },
    draw() {
        if (this.show.hotbar) this.drawHotbar()
        if (this.show.inventory) this.drawInventory()
    },
    hoverOverItemSlot() {
        if (input.mouse.pos.x >= this.eq.armor.x &&
            input.mouse.pos.x <= this.eq.armor.x + this.itemSlot.size &&
            input.mouse.pos.y >= this.eq.armor.y &&
            input.mouse.pos.y <= this.eq.armor.y + 4*this.itemSlot.size)
        {
            // hovering over 1 of armor slots
            this.eq.hovered.section = "armor"
            this.eq.hovered.x = this.eq.armor.x + Math.floor((input.mouse.pos.x - this.eq.armor.x) / this.itemSlot.size) * this.itemSlot.size,
            this.eq.hovered.y = this.eq.armor.y + Math.floor((input.mouse.pos.y - this.eq.armor.y) / this.itemSlot.size) * this.itemSlot.size
        }
        else if (input.mouse.pos.x >= this.eq.backpack.x &&
            input.mouse.pos.x <= this.eq.backpack.x + 9*this.itemSlot.size &&
            input.mouse.pos.y >= this.eq.backpack.y &&
            input.mouse.pos.y <= this.eq.backpack.y + 3*this.itemSlot.size)
        {
            this.eq.hovered.section = "backpack"
            this.eq.hovered.x = this.eq.backpack.x + Math.floor((input.mouse.pos.x - this.eq.backpack.x) / this.itemSlot.size) * this.itemSlot.size,
            this.eq.hovered.y = this.eq.backpack.y + Math.floor((input.mouse.pos.y - this.eq.backpack.y) / this.itemSlot.size) * this.itemSlot.size
        }
        else if(input.mouse.pos.x >= this.hotbar.x &&
            input.mouse.pos.x <= this.hotbar.x + 9*this.itemSlot.size &&
            input.mouse.pos.y >= this.hotbar.y &&
            input.mouse.pos.y <= this.hotbar.y + this.itemSlot.size)
        {
            this.eq.hovered.section = "hotbar"
            this.eq.hovered.x = this.hotbar.x + Math.floor((input.mouse.pos.x - this.hotbar.x) / this.itemSlot.size) * this.itemSlot.size,
            this.eq.hovered.y = this.hotbar.y + Math.floor((input.mouse.pos.y - this.hotbar.y) / this.itemSlot.size) * this.itemSlot.size
        }
        else this.eq.hovered.section = null
    },
    selectHovered() {
        // abort if nothing is being hovered
        if (!this.eq.hovered.section) return
        // get id of hovered slot
        let itemId;
        switch (this.eq.hovered.section) {
            case "armor":
                itemId = (this.eq.hovered.y - this.eq.armor.y) / this.itemSlot.size
            break
            case "backpack":
                itemId = 
                    (this.eq.hovered.x - this.eq.backpack.x) / this.itemSlot.size +
                    9 * (this.eq.hovered.y - this.eq.backpack.y) / this.itemSlot.size
            break
            case "hotbar":
                itemId = (this.eq.hovered.x - this.hotbar.x) / this.itemSlot.size
            break
        }
        // round floating point deviation
        itemId = Math.round(itemId)

        // 2 cases:
        // 1. No item is selected. select new item
        if (!this.eq.selected.section) {
            // abort if slot is empty
            if (!eq[this.eq.hovered.section].items[itemId]) return
    
            this.eq.selected = {
                section: this.eq.hovered.section,
                x: this.eq.hovered.x,
                y: this.eq.hovered.y,
                itemId: itemId
            }
        } 
        // 2. Some item is already selected. drop selected item on given spot
        else {
            eq.swapItems(
                this.eq.selected.section, this.eq.selected.itemId, 
                this.eq.hovered.section, itemId)
            this.clearSelection()
        }
        
    },
    clearSelection() {
        this.eq.selected = { section: null }
    },
    drawHotbar() {
        let hX = this.hotbar.x
        let hY = this.hotbar.y
        let hW = this.hotbar.width
        let hH = this.hotbar.height
        ctx.fillStyle = "rgba(128, 98, 76, 0.7)"
        ctx.fillRect(hX, hY, hW, hH)
        ctx.drawImage(imgs.gui_hotbar, hX, hY, hW, hH)
    
        for (let i = 0; i < eq.hotbar.size; i++) {
            let x = hX + i * this.itemSlot.size
            if (eq.hotbar.items[i]) {
                ctx.drawImage(imgs["item_" + eq.hotbar.items[i].name], x, hY, this.itemSlot.size, this.itemSlot.size)
            }
            if (i == eq.hotbar.selectedId) {
                ctx.strokeStyle = "rgb(230, 230, 90)"
                ctx.lineWidth = 5
                ctx.strokeRect(x, hY, this.itemSlot.size, this.itemSlot.size)
            }
        }
    },
    drawInventory() {
        let iX = this.eq.x
        let iY = this.eq.y
        let iW = this.eq.width
        let iH = this.eq.height
        ctx.fillStyle = "rgba(100, 50, 0, 0.7)"
        ctx.fillRect(0, 0, cnv.width, cnv.height)
        
        ctx.drawImage(imgs.gui_inventory, iX, iY, iW, iH)

        // highlight hovered and selected slots
        if (this.eq.hovered.section) {
            ctx.fillStyle = "rgba(200, 200, 200, 0.5)"
            ctx.fillRect(this.eq.hovered.x, this.eq.hovered.y, this.itemSlot.size, this.itemSlot.size)
        }
        if (this.eq.selected.section) {
            ctx.fillStyle = "rgba(200, 200, 100, 0.6)"
            ctx.fillRect(this.eq.selected.x, this.eq.selected.y, this.itemSlot.size, this.itemSlot.size)
        }
        // items in backpack
        for (let ix = 0; ix < 9; ix++) {
            for (let iy = 0; iy < 3; iy++) {
                let x = this.eq.backpack.x + ix * this.itemSlot.size
                let y = this.eq.backpack.y + iy * this.itemSlot.size
                if (eq.backpack.items[ix + iy * 9]) {
                    ctx.drawImage(imgs["item_" + eq.backpack.items[ix + iy * 9].name], x, y, this.itemSlot.size, this.itemSlot.size)
                }
            }
        }

        // items in hotbar
        for (let i = 0; i < eq.hotbar.size; i++) {
            let x = this.hotbar.x + i * this.itemSlot.size
            if (eq.hotbar.items[i])
                ctx.drawImage(imgs["item_" + eq.hotbar.items[i].name], x, this.hotbar.y, this.itemSlot.size, this.itemSlot.size)
        }

        // armor
        for (let ay = 0; ay < 4; ay++) {
            let y = this.eq.armor.y + ay * this.itemSlot.size
            if (eq.armor.items[ay])
                ctx.drawImage(imgs["item_" + eq.armor.items[ay].name], this.eq.armor.x, y, this.itemSlot.size, this.itemSlot.size)
        }
    }
}


const imgs = {}

const imgData = {
    gui_hotbar: {
        path: "img/gui/hotbar.png"
    },
    gui_inventory: {
        path: "img/gui/inventory.png"
    },
    item_sword_r: {
        path: "img/items/sword_r.png"
    },
    item_bow_r: {
        path: "img/items/bow_r.png"
    },
    item_leather_helmet: {
        path: "img/items/leather_helmet.png"
    }
}