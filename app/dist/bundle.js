/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/camera.js":
/*!***********************!*\
  !*** ./src/camera.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"cam\": () => (/* binding */ cam)\n/* harmony export */ });\n/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas */ \"./src/canvas.js\");\n/* harmony import */ var _player_player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player/player */ \"./src/player/player.js\");\n\n\n\n// camera for keeping an eye on the player\nconst cam = {\n    config: {\n        meter2pixels: null\n    },\n    init() {\n        // hardcoded for 16/9 ratio\n        this.w = 16 // meters in game\n        this.h = 9\n        this.config.meter2pixels = _canvas__WEBPACK_IMPORTED_MODULE_0__.cnv.width / this.w\n        this.pos = {x: 0, y: 0}\n        // boxOfStillness is a collisionbox which triggers camera movement\n        this.boxOfStillness = {\n            pos: {x: 4, y: 2},\n            w: 8,\n            h: 5\n        }\n    },\n    update() {\n        // if player went outside boxOfStillness \n        // then calculate dx and dy\n        let dx = 0\n        let dy = 0\n        if (_player_player__WEBPACK_IMPORTED_MODULE_1__.player.pos.x < this.boxOfStillness.pos.x)\n            dx = _player_player__WEBPACK_IMPORTED_MODULE_1__.player.pos.x - this.boxOfStillness.pos.x\n        else if (_player_player__WEBPACK_IMPORTED_MODULE_1__.player.pos.x > this.boxOfStillness.pos.x + this.boxOfStillness.w)\n            dx = _player_player__WEBPACK_IMPORTED_MODULE_1__.player.pos.x - this.boxOfStillness.pos.x - this.boxOfStillness.w\n        if (_player_player__WEBPACK_IMPORTED_MODULE_1__.player.pos.y < this.boxOfStillness.pos.y)\n            dy = _player_player__WEBPACK_IMPORTED_MODULE_1__.player.pos.y - this.boxOfStillness.pos.y\n        else if (_player_player__WEBPACK_IMPORTED_MODULE_1__.player.pos.y > this.boxOfStillness.pos.y + this.boxOfStillness.h)\n            dy = _player_player__WEBPACK_IMPORTED_MODULE_1__.player.pos.y - this.boxOfStillness.pos.y - this.boxOfStillness.h\n        \n        // move the camera and boxOfStillness by calculated distance\n        this.pos.x += dx\n        this.pos.y += dy\n        this.boxOfStillness.pos.x += dx\n        this.boxOfStillness.pos.y += dy\n    },\n    draw() {\n        _canvas__WEBPACK_IMPORTED_MODULE_0__.ctx.strokeStyle = \"#aaaa00\"\n        let boxDrawPos = this.gamePos2ScreenPos(this.boxOfStillness.pos)\n        let boxWidth = this.boxOfStillness.w * this.config.meter2pixels\n        let boxHeight = this.boxOfStillness.h * this.config.meter2pixels\n        _canvas__WEBPACK_IMPORTED_MODULE_0__.ctx.lineWidth = 4;\n        _canvas__WEBPACK_IMPORTED_MODULE_0__.ctx.strokeRect(boxDrawPos.x, boxDrawPos.y, boxWidth, boxHeight);\n    },\n    screenPos2GamePos(pos) {\n        return {\n            x: (pos.x + cam.pos.x) / this.config.meter2pixels,\n            y: (pos.y + cam.pos.y) / this.config.meter2pixels\n        }\n    }, \n    gamePos2ScreenPos(pos) {\n        return {\n            x: (pos.x - cam.pos.x) * this.config.meter2pixels,\n            y: (pos.y - cam.pos.y) * this.config.meter2pixels\n        }\n    }\n}\n\n//# sourceURL=webpack://app/./src/camera.js?");

/***/ }),

/***/ "./src/canvas.js":
/*!***********************!*\
  !*** ./src/canvas.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"cnv\": () => (/* binding */ cnv),\n/* harmony export */   \"ctx\": () => (/* binding */ ctx),\n/* harmony export */   \"graphic\": () => (/* binding */ graphic)\n/* harmony export */ });\nconst cnv = document.getElementById(\"game-container\")\nconst ctx = cnv.getContext('2d')\n\nconst graphic = {\n    init() {\n        ctx.imageSmoothingEnabled = false;\n        cnv.width = 1024\n        cnv.height = 576\n        // center horisontally\n        cnv.style.display = 'block'\n        cnv.style.margin = 'auto'\n        \n        // center vertically\n        cnv.style.position = 'relative'\n        cnv.style.top = '50%'\n        cnv.style.transform = 'translateY(-50%)'\n    }\n}\n\n//# sourceURL=webpack://app/./src/canvas.js?");

/***/ }),

/***/ "./src/dbg.js":
/*!********************!*\
  !*** ./src/dbg.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"debugInfo\": () => (/* binding */ debugInfo)\n/* harmony export */ });\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./src/game.js\");\n\n\nconst fpsCountMax = 100;\n\nconst debugInfo = {\n    fps: -1,\n    fpsTimeStamp: 0,\n    frameCounter: 0,\n    update() {\n        // count frames untill reaching some value\n        this.frameCounter = (this.frameCounter + 1) % fpsCountMax\n        // when that value is reached\n        if (!this.frameCounter) {\n            // calculate elapsed time\n            let elapsedTime = _game__WEBPACK_IMPORTED_MODULE_0__.timeNow - this.fpsTimeStamp;\n            // true fps = how many times counted fps devided by elapsed time\n            this.fps = fpsCountMax / elapsedTime * 1000; // in seconds\n            //restart counting\n            this.fpsTimeStamp = _game__WEBPACK_IMPORTED_MODULE_0__.timeNow\n            this.frameCounter = 0\n        }\n    },\n    init() {\n        this.fpsTimeStamp = _game__WEBPACK_IMPORTED_MODULE_0__.timeNow\n    }\n}\n\n//# sourceURL=webpack://app/./src/dbg.js?");

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"game\": () => (/* binding */ game),\n/* harmony export */   \"timeNow\": () => (/* binding */ timeNow)\n/* harmony export */ });\n/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera */ \"./src/camera.js\");\n/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canvas */ \"./src/canvas.js\");\n/* harmony import */ var _dbg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dbg */ \"./src/dbg.js\");\n/* harmony import */ var _player_input__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./player/input */ \"./src/player/input.js\");\n/* harmony import */ var _player_player__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./player/player */ \"./src/player/player.js\");\n/* harmony import */ var _terrain__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./terrain */ \"./src/terrain.js\");\n\n\n\n\n\n\n\nlet loop\nlet oldTime, dt\nvar timeNow = 0\n\nconst game = {\n    config: {\n        fpsLimit: 60\n    },\n    start() {\n        // initialize components\n        _player_input__WEBPACK_IMPORTED_MODULE_3__.input.init();\n        _terrain__WEBPACK_IMPORTED_MODULE_5__.terrain.init()\n        _player_player__WEBPACK_IMPORTED_MODULE_4__.players.addMainPlayer({x:8, y:5})\n        _camera__WEBPACK_IMPORTED_MODULE_0__.cam.init();\n        \n        // start timer\n        timeNow = oldTime = performance.now();\n        // initialize more components which needed timer\n        _dbg__WEBPACK_IMPORTED_MODULE_2__.debugInfo.init()\n        \n        // start loop\n        loop = setInterval(() => {\n            update()\n            draw()\n        }, 1000 / this.config.fpsLimit)\n\n        consoleLogSomethingAfterInit();\n    },\n    stop() {\n        clearInterval(loop)\n    }\n}\n\nfunction update() {\n    timeNow = performance.now();\n    dt = timeNow - oldTime;\n    _player_player__WEBPACK_IMPORTED_MODULE_4__.players.update(dt)\n    _camera__WEBPACK_IMPORTED_MODULE_0__.cam.update()\n    _dbg__WEBPACK_IMPORTED_MODULE_2__.debugInfo.update()\n    oldTime = timeNow\n}\n\nfunction draw() {\n    _canvas__WEBPACK_IMPORTED_MODULE_1__.ctx.fillStyle = 'black'\n    _canvas__WEBPACK_IMPORTED_MODULE_1__.ctx.fillRect(0, 0, _canvas__WEBPACK_IMPORTED_MODULE_1__.cnv.width, _canvas__WEBPACK_IMPORTED_MODULE_1__.cnv.height)\n    _camera__WEBPACK_IMPORTED_MODULE_0__.cam.draw()\n    _terrain__WEBPACK_IMPORTED_MODULE_5__.terrain.draw()\n    _player_player__WEBPACK_IMPORTED_MODULE_4__.players.draw()\n    drawCoords()\n}\n\nfunction drawCoords() {\n    _canvas__WEBPACK_IMPORTED_MODULE_1__.ctx.fillStyle = 'yellow'\n    _canvas__WEBPACK_IMPORTED_MODULE_1__.ctx.font = \"20px Arial\";\n    _canvas__WEBPACK_IMPORTED_MODULE_1__.ctx.fillText(\"fps: \" + _dbg__WEBPACK_IMPORTED_MODULE_2__.debugInfo.fps.toFixed(2), 24, 24)\n    _canvas__WEBPACK_IMPORTED_MODULE_1__.ctx.fillText(\"player x: \" + _player_player__WEBPACK_IMPORTED_MODULE_4__.player.pos.x.toFixed(2) + \", y: \" + _player_player__WEBPACK_IMPORTED_MODULE_4__.player.pos.y.toFixed(2), 24, 64)\n    _canvas__WEBPACK_IMPORTED_MODULE_1__.ctx.fillText(\"cam x: \" + _camera__WEBPACK_IMPORTED_MODULE_0__.cam.pos.x.toFixed(2) + \", y: \" + _camera__WEBPACK_IMPORTED_MODULE_0__.cam.pos.y.toFixed(2), 24, 92)\n    _canvas__WEBPACK_IMPORTED_MODULE_1__.ctx.fillText(\"bos x: \" + _camera__WEBPACK_IMPORTED_MODULE_0__.cam.boxOfStillness.pos.x.toFixed(2) + \", y: \" + _camera__WEBPACK_IMPORTED_MODULE_0__.cam.boxOfStillness.pos.y.toFixed(2), 24, 128)\n}\n\nfunction consoleLogSomethingAfterInit() {\n    console.log(_camera__WEBPACK_IMPORTED_MODULE_0__.cam.config.meter2pixels)\n    console.log(_camera__WEBPACK_IMPORTED_MODULE_0__.cam.gamePos2ScreenPos({ x: 1, y: 2 }))\n    console.log(_camera__WEBPACK_IMPORTED_MODULE_0__.cam.screenPos2GamePos({ x: 128, y: 12600 }))\n}\n\n//# sourceURL=webpack://app/./src/game.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas */ \"./src/canvas.js\");\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ \"./src/game.js\");\n\n\n\nlet startBtn = document.getElementById(\"start-btn\")\n\nstartBtn.onclick = function () {\n    this.textContent = \"Hello World!\"\n\n    // clear the start screen\n    let startScreen = document.getElementById(\"start-screen\")\n    startScreen.style.display = 'none'\n\n    // initialize canvas\n    _canvas__WEBPACK_IMPORTED_MODULE_0__.graphic.init()\n\n    // start the game\n    _game__WEBPACK_IMPORTED_MODULE_1__.game.start()\n}\n\n//# sourceURL=webpack://app/./src/index.js?");

/***/ }),

/***/ "./src/player/input.js":
/*!*****************************!*\
  !*** ./src/player/input.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"input\": () => (/* binding */ input)\n/* harmony export */ });\n/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ \"./src/player/player.js\");\n\n\nconst keyBinds = {\n    movement: {\n        left: \"KeyA\",\n        right: \"KeyD\",\n        up: \"KeyW\",\n        down: \"KeyS\"\n    }\n}\n\n// key value hashmap for methods associated with keybinds\nlet keyDownFoos = {}\nlet keyUpFoos = {}\n\nvar input = {\n    init() {\n        initKeyDownFoos()\n        initKeyUpFoos()\n        addEventListener(\"keydown\", function(e) {\n            // if pressed keycode is in hashmap then run method\n            if(keyDownFoos[e.code]) keyDownFoos[e.code]();\n        })\n        addEventListener(\"keyup\", function(e) {\n            if(keyUpFoos[e.code]) keyUpFoos[e.code]();\n        })\n    }\n}\n\nfunction initKeyDownFoos() {\n    keyDownFoos[keyBinds.movement.left]  = () => { _player__WEBPACK_IMPORTED_MODULE_0__.playerControl.pressingLeft = true }\n    keyDownFoos[keyBinds.movement.right] = () => { _player__WEBPACK_IMPORTED_MODULE_0__.playerControl.pressingRight = true }\n    keyDownFoos[keyBinds.movement.up]    = () => { _player__WEBPACK_IMPORTED_MODULE_0__.playerControl.pressingUp = true }\n    keyDownFoos[keyBinds.movement.down]  = () => { _player__WEBPACK_IMPORTED_MODULE_0__.playerControl.pressingDown = true }\n}\nfunction initKeyUpFoos() {\n    keyUpFoos[keyBinds.movement.left]  = () => { _player__WEBPACK_IMPORTED_MODULE_0__.playerControl.pressingLeft = false }\n    keyUpFoos[keyBinds.movement.right] = () => { _player__WEBPACK_IMPORTED_MODULE_0__.playerControl.pressingRight = false }\n    keyUpFoos[keyBinds.movement.up]    = () => { _player__WEBPACK_IMPORTED_MODULE_0__.playerControl.pressingUp = false }\n    keyUpFoos[keyBinds.movement.down]  = () => { _player__WEBPACK_IMPORTED_MODULE_0__.playerControl.pressingDown = false }\n}\n\n//# sourceURL=webpack://app/./src/player/input.js?");

/***/ }),

/***/ "./src/player/player.js":
/*!******************************!*\
  !*** ./src/player/player.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"player\": () => (/* binding */ player),\n/* harmony export */   \"playerControl\": () => (/* binding */ playerControl),\n/* harmony export */   \"players\": () => (/* binding */ players)\n/* harmony export */ });\n/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../camera */ \"./src/camera.js\");\n/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../canvas */ \"./src/canvas.js\");\n\n\n\nconst PLAYER_RADIUS = .50;\n\nclass Player {\n    constructor(position) {\n        this.pos = position     // game position\n        this.vec = {x: 0, y: 0} // velocity vector\n        this.speed = 0.004      // meter per milisecond\n    }\n\n    update(dt) {\n        // move by velocity\n        this.pos.x += dt * this.speed * this.vec.x\n        this.pos.y += dt * this.speed * this.vec.y\n    }\n\n    draw() {\n        // map game position to screen position\n        const drawPos = _camera__WEBPACK_IMPORTED_MODULE_0__.cam.gamePos2ScreenPos(this.pos)\n        const drawRadius = PLAYER_RADIUS * _camera__WEBPACK_IMPORTED_MODULE_0__.cam.config.meter2pixels \n        _canvas__WEBPACK_IMPORTED_MODULE_1__.ctx.fillStyle = 'white';\n        _canvas__WEBPACK_IMPORTED_MODULE_1__.ctx.beginPath();\n        _canvas__WEBPACK_IMPORTED_MODULE_1__.ctx.arc(drawPos.x, drawPos.y, drawRadius, 0, Math.PI*2, true)\n        _canvas__WEBPACK_IMPORTED_MODULE_1__.ctx.fill();\n    }\n}\nlet player;\nconst players = {\n    otherPlayers: {},\n    add(pos, id) {\n        this.otherPlayers[id] = new Player(pos)\n    },\n    addMainPlayer(pos) {\n        player = new Player(pos)\n    },\n    update(dt) {\n        // update player movement controls\n        if (playerControl.pressingLeft && !playerControl.pressingRight)\n            player.vec.x = -1\n        else if (playerControl.pressingRight && !playerControl.pressingLeft)\n            player.vec.x = 1\n        else player.vec.x = 0\n\n        if (playerControl.pressingUp && !playerControl.pressingDown)\n            player.vec.y = -1\n        else if (playerControl.pressingDown && !playerControl.pressingUp)\n            player.vec.y = 1\n        else player.vec.y = 0\n\n        player.update(dt)\n    },\n    draw() {\n        player.draw()\n    }\n}\n\nconst playerControl = {\n    pressingLeft: false,\n    pressingRight: false,\n    pressingUp: false,\n    pressingDown: false\n}\n\n//# sourceURL=webpack://app/./src/player/player.js?");

/***/ }),

/***/ "./src/terrain.js":
/*!************************!*\
  !*** ./src/terrain.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"terrain\": () => (/* binding */ terrain)\n/* harmony export */ });\n/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera */ \"./src/camera.js\");\n/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canvas */ \"./src/canvas.js\");\n\n\n\nconst terrain = {\n    init() {\n        \n    },\n    draw() {\n        _canvas__WEBPACK_IMPORTED_MODULE_1__.ctx.strokeStyle = \"#0090ff\"\n        _canvas__WEBPACK_IMPORTED_MODULE_1__.ctx.lineWidth = 2\n        let drawTopLeft = _camera__WEBPACK_IMPORTED_MODULE_0__.cam.gamePos2ScreenPos({\n            x: Math.floor(_camera__WEBPACK_IMPORTED_MODULE_0__.cam.pos.x),\n            y: Math.floor(_camera__WEBPACK_IMPORTED_MODULE_0__.cam.pos.y)})\n        for (let ix = 1; ix < _camera__WEBPACK_IMPORTED_MODULE_0__.cam.w; ix++) {\n            for (let iy = 1; iy < _camera__WEBPACK_IMPORTED_MODULE_0__.cam.h; iy++) {\n                let drawX = drawTopLeft.x + ix * _camera__WEBPACK_IMPORTED_MODULE_0__.cam.config.meter2pixels\n                let drawY = drawTopLeft.y + iy * _camera__WEBPACK_IMPORTED_MODULE_0__.cam.config.meter2pixels\n                _canvas__WEBPACK_IMPORTED_MODULE_1__.ctx.strokeRect(drawX, drawY, _camera__WEBPACK_IMPORTED_MODULE_0__.cam.config.meter2pixels, _camera__WEBPACK_IMPORTED_MODULE_0__.cam.config.meter2pixels)\n            }\n        }\n    }\n}\n\n//# sourceURL=webpack://app/./src/terrain.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;