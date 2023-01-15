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
    context.save();
    context.translate(screenWidth / 2, screenHeight / 2);
    let time = now();
    context.rotate(-time);
    context.scale(Math.sin(time) + 1.5, Math.cos(time) + 1.5);

    // gizmo
    context.gizmo(0, 0, 100);

    // draw some content
    context.strokeStyle = "#0f0";
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(Math.cos(time) * 100, Math.sin(time) * 100);
    context.stroke();

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