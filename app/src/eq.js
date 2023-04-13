export const hotbar = {
    size: 9,
    items: new Array(9),
    selectedId: 0,
    init() {
        this.items[0] = {
            name: "sword_r", 
            type: "sword",
            spritePart: "weapon_r"
        }
        this.items[1] = { 
            name: "bow_l", 
            type: "bow",
            spritePart: "weapon_l"
        }
    }
}