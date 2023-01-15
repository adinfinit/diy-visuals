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

        // context.gizmo(0, 0, height * 0.5);

        context.translate(0, height);
        context.scale(0.7, 0.7);

        const rotateLeft = sin(time * 3 + TAU * 0.1);
        const rotateRight = sin(time * 4 - TAU * 0.1);

        context.rotate(rotateLeft);
        tree(level, time);
        context.rotate(-rotateLeft);
        context.rotate(rotateRight);
        tree(level, time);
    }

    context.restore();
}


function update(deltaTime) {
    context.clearRect(0, 0, screenWidth, screenHeight);
    context.save();
    context.translate(screenWidth / 2, screenHeight);
    context.scale(1, -1);

    tree(3, 0);
    //tree(10, 0);
    //tree(10, now());
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