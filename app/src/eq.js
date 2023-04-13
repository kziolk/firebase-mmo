export const hotbar = {
    size: 9,
    items: new Array(9),
    selectedId: 0,
    init() {
        this.items[0] = { name: "default" }
        this.items[1] = { name: "sword" }
        this.items[2] = { name: "bow" }
        this.items[3] = { name: "wand" }
        this.items[4] = { name: "hammer" }
        this.items[5] = { name: "staff" }
    }
}