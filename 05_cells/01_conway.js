"use strict";

const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// set canvas size to the correct size
let screen = V(0, 0);

function onresize() {
    screen.x = window.innerWidth;
    screen.y = window.innerHeight;

    canvas.width = screen.x;
    canvas.height = screen.y;
}

window.addEventListener("resize", onresize);
onresize()

let mouse = screen.mul(0.5);
window.addEventListener("mousemove", function (e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
})

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alive = false;
    }

    assign(other) {
        this.x = other.x;
        this.y = other.y;
        this.alive = other.alive;
    }

    randomize() {
        this.alive = Math.random() > 0.5;
    }

    update(lastGrid) {
        let aliveCount = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if ((dx == 0) && (dy == 0)) {
                    continue;
                }
                const neighbor = lastGrid.get(this.x + dx, this.y + dy);
                if (neighbor.alive) {
                    aliveCount++;
                }
            }
        }

        if (aliveCount < 2) {
            // under population
            this.alive = false;
        } else if (aliveCount > 3) {
            // over population
            this.alive = false;
        } else if (aliveCount == 3 && !this.alive) {
            // reproduction
            this.alive = true;
        }
    }

    render(context) {
        context.save();
        context.translate(this.x, this.y);
        context.fillStyle = this.alive ? "#eee" : "#333";
        context.fillRect(0.05, 0.05, 0.9, 0.9);
        //context.fillCircle(0.5, 0.5, 0.4);
        context.restore();
    }
}

const DEAD = new Cell(NaN, NaN);

class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.alive = false;
        this.cells = new Array(width * height);

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.cells[y * this.width + x] = new Cell(x, y);
            }
        }
    }

    assign(other) {
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i].assign(other.cells[i]);
        }
    }

    get(x, y) {
        if ((x < 0) || (this.width <= x)) return DEAD;
        if ((y < 0) || (this.height <= y)) return DEAD;
        return this.cells[y * this.width + x];
    }

    update(lastGrid) {
        this.cells.forEach(cell => {
            cell.update(lastGrid);
        })
    }

    render(context) {
        context.save();

        context.translate(screen.x / 2, screen.y / 2);
        const s = Math.min(screen.x, screen.y) / Math.max(this.width, this.height);
        context.scale(s, s);
        context.translate(-this.width / 2, -this.height / 2);

        this.cells.forEach(cell => {
            cell.render(context);
        });

        context.restore();
    }

    randomize() {
        this.cells.forEach(cell => {
            cell.randomize();
        });
    }
}

const previous = new Grid(25, 25);
const current = new Grid(25, 25);

current.randomize();

setInterval(function () {
    previous.assign(current);
    current.update(previous);
}, 100);

function update(deltaTime) {
    context.fillStyle = "rgba(0,0,0,0.5)";
    context.fillRect(0, 0, screen.x, screen.y);
    context.save();
    context.globalCompositeOperation = "lighten";

    current.render(context);

    context.restore();
}

// setup timing loop
let lastTime = 0;

function tick() {
    requestAnimationFrame(tick);
    const currentTime = now();
    update(currentTime - lastTime);
    lastTime = currentTime;
}

tick();