import { player } from "../entities/player"

export const eq = {
    init() {
        this.hotbar.init()
        this.backpack.init()
        this.armor.init()
    },
    hotbar: {
        size: 9,
        items: new Array(9),
        selectedId: 0,
        init() {}
    },
    backpack: {
        size: 9 * 3,
        items: new Array(9 * 3),
        init() {
            this.items[0] = {
                name: "sword_r", 
                type: "sword",
                purpose: "weapon",
                spritePart: "weapon_r"
            }
            this.items[1] = { 
                name: "bow_r", 
                type: "bow",
                purpose: "weapon",
                spritePart: "weapon_r"
            }
            this.items[2] = { 
                name: "leather_helmet", 
                type: "helmet",
                purpose: "armor",
                spritePart: "helmet"
            }
        }
    },
    armor: {
        size: 4,
        items: new Array(4),
        init() {}
    },
    swapItems(place1, id1, place2, id2) {
        // abort when items can't switch places
        if (!itemCanGoToSlot(this[place1].items[id1], place2, id2) || 
            !itemCanGoToSlot(this[place2].items[id2], place1, id1))
        return

        let item1 = this[place1].items[id1]
        let item2 = this[place2].items[id2]

        // take off sprite parts
        if (item1) {
            if (place1 == "armor") {
                player.removeItemSprite(item1, "armor")
            } else if (place1 == "hotbar" && id1 == this.hotbar.selectedId) {
                player.removeItemSprite(item1, "hotbar")
            }
        }
        if (item2) {
            if (place2 == "armor") {
                player.removeItemSprite(item2, "armor")
            } else if (place2 == "hotbar" && id2 == this.hotbar.selectedId) {
                player.removeItemSprite(item2, "hotbar")
            }
        }

        if (item2) this[place1].items[id1] = JSON.parse(JSON.stringify(item2))
        else this[place1].items[id1] = null
        if (item1) this[place2].items[id2] = JSON.parse(JSON.stringify(item1))
        else this[place2].items[id2] = null

        // wear sprite parts
        if (item2) {
            if (place1 == "armor") {
                player.addItemSprite(item2, "armor")
            } else if (place1 == "hotbar" && id1 == this.hotbar.selectedId) {
                player.addItemSprite(item2, "hotbar")
            }
        }
        if (item1) {
            if (place2 == "armor") {
                player.addItemSprite(item1, "armor")
            } else if (place2 == "hotbar" && id2 == this.hotbar.selectedId) {
                player.addItemSprite(item1, "hotbar")
            }
        }
    }
}

function itemCanGoToSlot(item, region, id) {
    if (region != "armor" || !item) return true
    switch (id) {
        case 0: return (item.spritePart == "helmet")
        case 1: return (item.spritePart == "chestplate")
        case 2: return (item.spritePart == "leggings")
        case 3: return (item.spritePart == "boots")
    }
}