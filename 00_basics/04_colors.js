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

for (let x = 0; x < screenWidth; x += 10) {
    context.fillStyle = hsl(x * PHI, 70, 50);
    context.fillRect(x, 100, 10, 50);
}

for (let x = 0; x < screenWidth; x += 10) {
    context.fillStyle = rgb(x * PHI % 256, 50, 50);
    context.fillRect(x, 200, 10, 50);
}

var gradient = context.createLinearGradient(0, 300, screenWidth, 300);
gradient.addColorStop(0, "red");
gradient.addColorStop(0.5, "green");
gradient.addColorStop(1, "purple");
context.fillStyle = gradient;
context.fillRect(0, 300, screenWidth, 50);

for (let x = 0; x < screenWidth; x += 10) {
    context.fillStyle = rgb(
        Math.sin((x / screenWidth) % 256) * 256,
        Math.sin((TAU / 3 + 7 * x / screenWidth) % 256) * 256,
        Math.sin((5 * x / screenWidth) % 256) * 256);
    context.fillRect(x, 400, 10, 50);
}