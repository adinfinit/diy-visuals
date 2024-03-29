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

class Follower {
    constructor(target, index) {
        this.target = target;
        this.position = screen.mul(0.5);
        this.index = index;
        this.time = 0;
    }

    update(deltaTime) {
        this.time += deltaTime;
        if (this.target.position.sub(this.position).length < 20) return;
        this.position = V.lerp(this.position, this.target.position, 0.1);
    }

    render(context) {
        const h = this.index * PHI * 360 / TAU;
        context.fillStyle = hsla(h, 40, 40, 0.5);
        context.fillCircle(this.position.x, this.position.y, 10);
        return;

        const offset = V.fromAngle(this.time + this.index);
        const p = this.position.add(offset.mul(10));
        context.fillCircle(p.x, p.y, 10);
    }
}

const followers = [];
let target = {
    position: mouse
};
for (let i = 0; i < 10; i++) {
    let follower = new Follower(target, i);
    target = follower;
    followers.push(follower);
}

function update(deltaTime) {
    context.clearRect(0, 0, screen.x, screen.y);
    context.save();

    const log = new Log(context, 10, 10, 14, "#000");
    const p0 = V(100, 200);
    const p1 = mouse;
    const t = now() % 1;
    const p = V.lerp(p0, p1, now() % 1);
    log.line("t", t.toFixed(2));

    context.fillStyle = rgb(60, 60, 60);
    context.fillCircle(p0.x, p0.y, 10);
    context.fillCircle(p1.x, p1.y, 10);
    context.fillStyle = rgb(255, 0, 0);
    context.fillCircle(p.x, p.y, 10);

    log.line();
    log.line("m", mouse);

    followers.forEach(follower => {
        log.line(follower.index, follower.position);
        follower.update(deltaTime);
        follower.render(context);
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