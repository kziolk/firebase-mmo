import { timeNow } from "./game";

const fpsCountMax = 100;

export const debugInfo = {
    fps: -1,
    fpsTimeStamp: 0,
    frameCounter: 0,
    update() {
        // count frames untill reaching some value
        this.frameCounter = (this.frameCounter + 1) % fpsCountMax
        // when that value is reached
        if (!this.frameCounter) {
            // calculate elapsed time
            let elapsedTime = timeNow - this.fpsTimeStamp;
            // true fps = how many times counted fps devided by elapsed time
            this.fps = fpsCountMax / elapsedTime * 1000; // in seconds
            //restart counting
            this.fpsTimeStamp = timeNow
            this.frameCounter = 0
        }
    },
    init() {
        this.fpsTimeStamp = timeNow
    }
}