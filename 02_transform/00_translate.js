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

    // gizmo
    context.lineWidth = 5;
    context.fillStyle = "#f00";
    context.arrow(0, 0, 0, 100);
    context.fill();
    context.fillStyle = "#00f";
    context.arrow(0, 0, 100, 0);
    context.fill();

    context.fillStyle = rgba(0, 0, 0, 0.1);
    context.fillRect(0, 0, 100, 100);

    context.beginPath();
    context.arc(0, 0, 100, 0, TAU, true);
    context.fill();

    // context.gizmo(0, 0, 100);

    // draw some content
    context.strokeStyle = "#0f0";
    var time = now();
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(cos(time) * 100, sin(time) * 100);
    context.stroke();

    context.restore();
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