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

for (var x = 0; x < screenWidth; x += 10) {
    context.fillStyle = hsl(x * PHI, 70, 70);
    context.fillRect(x, 100, 10, 50);
}

for (var x = 0; x < screenWidth; x += 10) {
    context.fillStyle = rgb(x * PHI % 256, 50, 50);
    context.fillRect(x, 200, 10, 50);
}

for (var x = 0; x < screenWidth; x += 10) {
    context.fillStyle = rgb(
        sin((x / screenWidth) % 256) * 256,
        sin((TAU / 3 + 7 * x / screenWidth) % 256) * 256,
        sin((5 * x / screenWidth) % 256) * 256);
    context.fillRect(x, 300, 10, 50);
}