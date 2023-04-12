import { graphic } from "./graphic/graphic"
import { input } from "./input"

export const menu = {
    config: {

    },
    open() {
        input.setMode("menu")
        graphic.darken = true

        const menuContainer = document.createElement("div")
        menuContainer.id = "menu-container"
        document.body.appendChild(menuContainer)

        const menuOption1 = document.createElement("div")
        menuOption1.className = "menu-option"
        menuContainer.appendChild(menuOption1)
        
        const returnBtn = document.createElement("button")
        returnBtn.textContent = "return"
        returnBtn.className = "menu-btn"
        returnBtn.onclick = function() {
            menu.close()
        }
        menuOption1.appendChild(returnBtn)

        const menuOption2 = document.createElement("div")
        menuOption2.className = "menu-option"
        menuContainer.appendChild(menuOption2)
        
        const quitBtn = document.createElement("button")
        quitBtn.textContent = "quit"
        quitBtn.className = "menu-btn"
        menuOption2.appendChild(quitBtn)
    },
    close() {
        document.body.removeChild(document.getElementById("menu-container"))
        input.setMode("player_control")
        graphic.darken = false
    }
}