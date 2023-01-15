"use strict";

const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// set canvas size to the correct size
let screenWidth = 0;
let screenHeight = 0;

function onresize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    canvas.width = screenWidth;
    canvas.height = screenHeight;
}

window.addEventListener("resize", onresize);
// update the variables
onresize();

let mouseX = 0;
let mouseY = 0;

window.onmousemove = function (e) {
    mouseX = e.pageX;
    mouseY = e.pageY;

    mouseX /= screenWidth;
    mouseY /= screenHeight;
    mouseX = 2 * (mouseX - 0.5);
    mouseY = 2 * (mouseY - 0.5);
};

function tree(level, time) {
    level--;
    if (level < 0) {
        return;
    }

    context.save();
    {
        const height = screenHeight * 0.3;

        context.fillStyle = "#000";
        context.fillRect(-5, 0, 10, height);

        context.translate(0, height);
        context.scale(0.7, 0.7);

        context.rotate(-mouseX);
        tree(level, time);
        context.rotate(mouseX);
        context.rotate(mouseY);
        tree(level, time);
    }

    context.restore();
}


function update(deltaTime) {
    context.clearRect(0, 0, screenWidth, screenHeight);
    context.save();
    context.translate(screenWidth / 2, screenHeight);
    context.scale(1, -1);

    const log = new Log(context, 10, 10, 14, "#000");
    log.line("mouse: ", mouseX.toFixed(2), ", ", mouseY.toFixed(2));

    tree(10, now());
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