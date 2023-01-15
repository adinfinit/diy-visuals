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
    context.fillStyle = hsla(0, 0, 0, 0.05);
    context.fillRect(0, 0, screenWidth, screenHeight);

    var rx = (sin(now() * 2) + 1) * 0.5;
    var ry = (sin(now() * 3) + 1) * 0.5;

    var x = rx * screenWidth * 0.5 + screenWidth * 0.25;
    var y = ry * screenHeight * 0.5 + screenHeight * 0.25;

    context.fillStyle = hsla(now() * 180, 50, 70, 1);
    context.fillRect(x, y, 10, 10);

    context.fillStyle = "#fff";
    context.fillRect(x + 5, 50, 2, 10);
    context.fillRect(50, y + 5, 10, 2);
}

// setup timing loop
var lastTime = 0;

function tick() {
    requestAnimationFrame(tick);
    var currentTime = now();
    update(currentTime - lastTime);
    lastTime = currentTime;
}

tick();