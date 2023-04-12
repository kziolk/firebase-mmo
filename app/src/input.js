import { graphic } from "./graphic/graphic"
import { mobsManager } from "./entities/mobs/mobsManager"
import { player } from "./entities/player"
import { menu } from "./menu"

export var input = {
    mode: null,
    setMode(modeName) {
        this.mode = modes[modeName]
    },
    mouse: {
        pos: {x: -1, y: -1},
        pressingLeft: false,
        pressingRight: false
    },
    keyboard: {
        pressingLeft: false,
        pressingRight: false,
        pressingUp: false,
        pressingDown: false
    },
    init() {
        // init keyboard input 
        initKeyBinds()
        this.mode = modes.player_control
        addEventListener("keydown", function(keyEvent) {
            // if hashmap contains code of pressed key then run associated method
            const methodName = input.mode.keyBinds[keyEvent.code];
            const handleInput = input.mode.keyDown[methodName];
            if(handleInput) handleInput();
        })
        addEventListener("keyup", function(keyEvent) {
            const methodName = input.mode.keyBinds[keyEvent.code];
            const handleInput = input.mode.keyUp[methodName];
            if(handleInput) handleInput();
        })

        // init mouse input
        addEventListener("mousemove", function(mouseEvent) {
            const handleMouse = input.mode.mouseMove
            if(handleMouse) handleMouse(mouseEvent)
        }, { passive: false })
        addEventListener("mousedown", function(mouseEvent) {
            const handleMouse = input.mode.mouseDown
            if(handleMouse) handleMouse(mouseEvent)
        }, { passive: false })
        addEventListener("mouseup", function(mouseEvent) {
            const handleMouse = input.mode.mouseUp
            if(handleMouse) handleMouse(mouseEvent)
        }, { passive: false })
        addEventListener("wheel", function(mouseEvent) {
            // let d = e.deltaY / Math.abs(e.deltaY);
            // eq.selectedSlot = (eq.size + eq.selectedSlot + d) % eq.size;
        })
    }
}



// key value hashmap for methods associated with keybinds
const modes = {
    player_control: {
        keyBinds: {}, // to initialize
        keyDown: {
            left: function() { input.keyboard.pressingLeft = true },
            right: function () { input.keyboard.pressingRight = true },
            down: function () { input.keyboard.pressingDown = true },
            up: function () { input.keyboard.pressingUp = true },
            spawnMob: function () { 
                mobsManager.createMob({
                    x: player.pos.x + Math.random() * 10 - 5,
                    y: player.pos.y + Math.random() * 10 - 5 
                });
            },
            openMenu: function () {
                menu.open()
            }
        },
        keyUp: {
            left: function() { input.keyboard.pressingLeft = false },
            right: function () { input.keyboard.pressingRight = false },
            down: function () { input.keyboard.pressingDown = false },
            up: function () { input.keyboard.pressingUp = false }
        },
        mouseMove: function(mouseEvent) {
            // save mouse position relative to the canvas
           input.mouse.pos.x = mouseEvent.x - graphic.screen.x
           input.mouse.pos.y = mouseEvent.y - graphic.screen.y
        },
        mouseDown: function(mouseEvent){
            if (mouseEvent.button == 0) {
                input.mouse.pressingLeft = true;
                player.attackTriggered = true;
            }
            else if (mouseEvent.button == 1)
                input.mouse.pressingRight = true;
        },
        mouseUp: function(mouseEvent) {
            if (mouseEvent.button == 0)
                input.mouse.pressingLeft = false;
            else if (mouseEvent.button == 1)
                input.mouse.pressingRight = false;
        }
    },
    menu: {
        keyBinds: {
            Escape: "closeMenu"
        },
        keyDown: {
            closeMenu: function() { menu.close() }
        },
        keyUp: {}
    }
}

// associate key code to the method
function initKeyBinds() {
    modes.player_control.keyBinds["KeyA"] = "left";
    modes.player_control.keyBinds["KeyD"] = "right";
    modes.player_control.keyBinds["KeyW"] = "up";
    modes.player_control.keyBinds["KeyS"] = "down";
    modes.player_control.keyBinds["Space"] = "spawnMob";
    modes.player_control.keyBinds["Escape"] = "openMenu";
}