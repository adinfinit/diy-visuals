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
        this.heat = 0;
        this.dead = false;
    }

    assign(other) {
        this.x = other.x;
        this.y = other.y;
        this.heat = other.heat;
    }

    randomize() {
        this.heat = Math.random();
        this.heat *= this.heat;
        this.heat *= this.heat;
        this.heat *= this.heat;
    }

    add(amount) {
        if (this.dead) return;
        this.heat += amount;
    }

    update(lastGrid) {
        let newHeat = 0;
        newHeat += lastGrid.get(this.x - 1, this.y + 1).heat;
        newHeat += lastGrid.get(this.x, this.y + 1).heat;
        newHeat += lastGrid.get(this.x + 1, this.y + 1).heat;
        newHeat += lastGrid.get(this.x, this.y + 2).heat;

        this.heat = newHeat / 4.1;
    }

    render(context) {
        context.save();
        context.translate(this.x, this.y);
        const r = this.heat * 255;
        const g = (this.heat * this.heat) * 255;
        context.fillStyle = rgba(r, g, 0, 1);
        context.fillRect(0.05, 0.05, 0.9, 0.9);
        context.restore();
    }
}

const OFFSCREEN = new Cell(NaN, NaN);
OFFSCREEN.dead = true;

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
        if ((x < 0) || (this.width <= x)) return OFFSCREEN;
        if ((y < 0) || (this.height <= y)) return OFFSCREEN;
        return this.cells[y * this.width + x];
    }

    addHeat(x, y, amount) {
        const lowX = Math.round(x);
        const lowY = Math.round(y);

        const dx = Math.sign(x - lowX);
        const dy = Math.sign(y - lowY);

        const contribLowX = 1 - Math.abs(x - lowX);
        const contribLowY = 1 - Math.abs(y - lowY);

        this.get(lowX, lowY).add(amount * contribLowX * contribLowY);
        this.get(lowX + dx, lowY).add(amount * (1 - contribLowX) * contribLowY);
        this.get(lowX, lowY + dy).add(amount * contribLowX * (1 - contribLowY));
        this.get(lowX + dx, lowY + dy).add(amount * (1 - contribLowX) * (1 - contribLowY));
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

function update(deltaTime) {
    context.fillStyle = "rgba(0,0,0,0.5)";
    context.fillRect(0, 0, screen.x, screen.y);
    context.save();
    context.globalCompositeOperation = "lighten";

    const cx = current.width / 2;
    const cy = current.height - 2;

    const dx = Math.sin(now() * 10) * 2;
    current.addHeat(cx + dx, cy, 5);

    previous.assign(current);
    current.update(previous);

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