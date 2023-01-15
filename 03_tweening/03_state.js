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

function easeInOutQuad(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function cube2(t) {
    const s = Math.sin(t * TAU);
    return t + s * s * s * s / 2;
}

const MOVING = 1;
const EATING = 2;

class Flob {
    constructor() {
        this.start = V(Math.random(), Math.random());
        this.target = V(Math.random(), Math.random());
        this.animation = 0;
        this.duration = randomRange(1, 2);
        this.hue = Math.random() * 360;

        this.state = MOVING;
    }

    update(deltaTime) {
        this.animation += deltaTime / this.duration;
        if (this.animation > 1) {
            if (this.state == MOVING) {
                this.state = EATING;
                this.start = this.target;
                this.animation = 0;
                this.duration = randomRange(1, 3);
            } else {
                this.state = MOVING;
                this.target = V(Math.random(), Math.random());
                this.animation = 0;
                this.duration = randomRange(1, 2);
            }
        }
    }

    render(context) {
        const start = V.lerp(V(0, 0), screen, this.start);
        const target = V.lerp(V(0, 0), screen, this.target);

        if (this.state == MOVING) {
            let t = easeInOutQuad(this.animation);
            const p = V.lerp(start, target, t);
            context.fillStyle = hsla(this.hue, 70, 30, 0.8);
            context.fillCircle(p.x, p.y, 10);
        } else {
            let t = Math.sin(this.animation * TAU * 4);
            context.fillStyle = hsla(this.hue, 70, 30, 0.8);
            context.fillCircle(start.x, start.y, 15 + t * 5);
        }

        context.fillStyle = hsla(0, 80, 80, 0.8);
        context.fillCircle(target.x, target.y, 5);
    }
}

const flobs = [];
for (let i = 0; i < 1; i++) {
    flobs.push(new Flob());
}

function update(deltaTime) {
    context.clearRect(0, 0, screen.x, screen.y);
    context.save();

    flobs.forEach(flob => {
        flob.update(deltaTime);
        flob.render(context);
    })

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