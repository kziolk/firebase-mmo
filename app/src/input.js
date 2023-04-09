import { graphic } from "./graphic/graphic"
import { mobsManager } from "./entities/mobs/mobsManager"
import { player } from "./entities/player"

export var input = {
    currentMode: "player_control",
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
        // keyboard 
        initKeyBinds()
        addEventListener("keydown", function(e) {
            // if pressed keycode is in hashmap then run method
            const actionKey = mode[input.currentMode].keyBinds[e.code];
            const handleInput = mode[input.currentMode].keyDown[actionKey];
            if(handleInput) handleInput();
        })
        addEventListener("keyup", function(e) {
            const actionKey = mode[input.currentMode].keyBinds[e.code];
            const handleInput = mode[input.currentMode].keyUp[actionKey];
            if(handleInput) handleInput();
        })

        // mouse
        addEventListener("mousemove", function(e) {
           input.mouse.pos.x = e.x - graphic.screen.x
           input.mouse.pos.y = e.y - graphic.screen.y
        }, { passive: false })
        addEventListener("mousedown", function(e) {
            if (e.button == 0) {
                input.mouse.pressingLeft = true;
                player.attackTriggered = true;
            }
            else if (e.button == 1)
                input.mouse.pressingRight = true;
        }, { passive: false })
        addEventListener("mouseup", function(e) {
            if (e.button == 0)
                input.mouse.pressingLeft = false;
            else if (e.button == 1)
                input.mouse.pressingRight = false;
        }, { passive: false })
        addEventListener("wheel", function(e) {
            // let d = e.deltaY / Math.abs(e.deltaY);
            // eq.selectedSlot = (eq.size + eq.selectedSlot + d) % eq.size;
        })
    }
}



// key value hashmap for methods associated with keybinds
const mode = {
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
            }
        },
        keyUp: {
            left: function() { input.keyboard.pressingLeft = false },
            right: function () { input.keyboard.pressingRight = false },
            down: function () { input.keyboard.pressingDown = false },
            up: function () { input.keyboard.pressingUp = false }
        }
    }
}

function initKeyBinds() {
    mode.player_control.keyBinds["KeyA"] = "left";
    mode.player_control.keyBinds["KeyD"] = "right";
    mode.player_control.keyBinds["KeyW"] = "up";
    mode.player_control.keyBinds["KeyS"] = "down";
    mode.player_control.keyBinds["Space"] = "spawnMob";
}