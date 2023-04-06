import { playerControl } from "./player"

const keyBinds = {
    movement: {
        left: "KeyA",
        right: "KeyD",
        up: "KeyW",
        down: "KeyS"
    }
}

// key value hashmap for methods associated with keybinds
let keyDownFoos = {}
let keyUpFoos = {}

export var input = {
    init() {
        initKeyDownFoos()
        initKeyUpFoos()
        addEventListener("keydown", function(e) {
            // if pressed keycode is in hashmap then run method
            if(keyDownFoos[e.code]) keyDownFoos[e.code]();
        })
        addEventListener("keyup", function(e) {
            if(keyUpFoos[e.code]) keyUpFoos[e.code]();
        })
    }
}

function initKeyDownFoos() {
    keyDownFoos[keyBinds.movement.left]  = () => { playerControl.pressingLeft = true }
    keyDownFoos[keyBinds.movement.right] = () => { playerControl.pressingRight = true }
    keyDownFoos[keyBinds.movement.up]    = () => { playerControl.pressingUp = true }
    keyDownFoos[keyBinds.movement.down]  = () => { playerControl.pressingDown = true }
}
function initKeyUpFoos() {
    keyUpFoos[keyBinds.movement.left]  = () => { playerControl.pressingLeft = false }
    keyUpFoos[keyBinds.movement.right] = () => { playerControl.pressingRight = false }
    keyUpFoos[keyBinds.movement.up]    = () => { playerControl.pressingUp = false }
    keyUpFoos[keyBinds.movement.down]  = () => { playerControl.pressingDown = false }
}