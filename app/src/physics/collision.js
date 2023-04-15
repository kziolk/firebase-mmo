import { terrain } from "../terrain"

export const collision = {
    init() { },
    bounceOffCbox(cBoxDynamic, cBoxStatic) {
        let executeTheBounce = bounceFoos[cBoxDynamic.type + "_" + cBoxStatic.type]
        executeTheBounce(cBoxDynamic, cBoxStatic)
    },
    detect(hitbox1, hitbox2) {
        let checkDetection = collisionDetectionFoos[hitbox1.type + "_" + hitbox2.type]
        if (checkDetection)
            return checkDetection(hitbox1, hitbox2)
        else return false
    },
    getCBoxesAround(pos) {
        let cBoxes = []
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let tile = terrain.getTileAt({
                    x: Math.floor(pos.x) + dx,
                    y: Math.floor(pos.y) + dy
                })
                let collisionAtTile = tileValToCollisionBox[tile.val]
                if (collisionAtTile)
                    cBoxes.push(collisionAtTile(tile.x, tile.y))
            }
        }
        return cBoxes
    }
}

const tileValToCollisionBox = {
    0: null,
    1: function (x, y) {
        return {
            type: "circle",
            pos: {x: x + 0.5, y: y + 0.5},
            r: 0.5
        }
    }
}

const bounceFoos = {
    circle_circle: function (cBoxDynamic, cBoxStatic) {
        let radii = cBoxDynamic.r + cBoxStatic.r
        let dx = cBoxStatic.pos.x - cBoxDynamic.pos.x
        let dy = cBoxStatic.pos.y - cBoxDynamic.pos.y
        let dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if(dist < radii) {
            cBoxDynamic.pos.x -=  (dx * radii / dist) - dx;
            cBoxDynamic.pos.y -= (dy * radii / dist) - dy;
        }
    }
}

// key = 2 hitbox type strings separated by _,
// value = function detecting collision between those 2 hitboxes
const collisionDetectionFoos = {
    line_circle: collisionLineCircle,
    circle_line: collisionCircleLine,
    circle_circle: function (circle1, circle2) {
        let radii = circle1.r + circle2.r
        let dx = circle1.pos.x - circle2.pos.x
        let dy = circle1.pos.y - circle2.pos.y
        let dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        return (dist < radii)
    }
}

// thanks stack overflow
function collisionLineCircle(line, circle){
    let lineCircleDistance = distanceSegmentToPoint(
        line.p1, line.p2, circle.pos);
    return (lineCircleDistance < circle.r);
}
function collisionCircleLine(circle, line) {
    return collisionLineCircle(line, circle)
}
/**
 * Returns the distance from line segment AB to point C
 */
function distanceSegmentToPoint(A, B, C) {
    // Compute vectors AC and AB
    const AC = sub(C, A);
    const AB = sub(B, A);

    // Get point D by taking the projection of AC onto AB then adding the offset of A
    const D = add(proj(AC, AB), A);

    const AD = sub(D, A);
    // D might not be on AB so calculate k of D down AB (aka solve AD = k * AB)
    // We can use either component, but choose larger value to reduce the chance of dividing by zero
    const k = Math.abs(AB.x) > Math.abs(AB.y) ? AD.x / AB.x : AD.y / AB.y;

    // Check if D is off either end of the line segment
    if (k <= 0.0) {
        return Math.sqrt(hypot2(C, A));
    } else if (k >= 1.0) {
        return Math.sqrt(hypot2(C, B));
    }

    return Math.sqrt(hypot2(C, D));
}
const add = (a, b) => ({x: a.x + b.x, y: a.y + b.y});
const sub = (a, b) => ({x: a.x - b.x, y: a.y - b.y});
const dot = (a, b) => a.x * b.x + a.y * b.y;
const hypot2 = (a, b) => dot(sub(a, b), sub(a, b));

// Function for projecting some vector a onto b
function proj(a, b) {
    const k = dot(a, b) / dot(b, b);
    return {x: k * b.x, y: k * b.y};
}