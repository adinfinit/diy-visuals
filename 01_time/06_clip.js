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

    const time = now() * 2;

    const x0 = screenWidth / 2;
    const y0 = screenHeight / 2;

    context.save();

    const p = new Path2D();
    for(let i = 0; i < 3; i++) {
        const y = y0 + Math.sin(time * (i+1.15) + i * PHI) * 25 - 5;
        const h = 10;
        p.moveTo(0, y);
        p.lineTo(screenWidth, y);
        p.lineTo(screenWidth, y+h);
        p.lineTo(0, y+h);
        p.closePath()  
    }

    context.clip(p);

    const text = "HELLO";
    context.font = "100px Courier";
    context.fillStyle = "#000";
    const metrics = context.measureText(text);

    context.fillText(text, x0 - metrics.width/2, y0 + 25);

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