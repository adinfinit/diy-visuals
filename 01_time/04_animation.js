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

function update(deltaTime) {
    context.clearRect(0, 0, screenWidth, screenHeight);

    const time = now() * 5;

    const x0 = screenWidth / 2;
    const y0 = screenHeight / 2;

    context.lineWidth = 10;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x0 - 150, y0 + sin(time) * 100);
    context.lineTo(x0 - 250, y0 + sin(time - 1) * 100);
    context.lineTo(x0 - 300, y0 + sin(time - 2) * 150);
    context.stroke();

    return;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x0 + 150, y0 + sin(time) * 100);
    context.lineTo(x0 + 250, y0 + sin(time - 1) * 100);
    context.lineTo(x0 + 300, y0 + sin(time - 2) * 150);
    context.stroke();
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