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
    mouseX = map(e.pageX, 0, screenWidth, -1, 1);
    mouseY = map(e.pageY, 0, screenHeight, -1, 1);
};

function tree(level, time) {
    level--;
    if (level < 0) {
        return;
    }

    context.save();
    {
        const height = screenHeight * 0.2;

        const levelScale = 1 + level / 10;
        context.fillStyle = hsla(levelScale * time * 120, 70, 70, 0.5);
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

function render(time) {
    context.fillStyle = hsla(time * 90, 70, 70, 0.4);
    context.fillRect(-10, 0, 20, 100);
    context.fillRect(-10, 50, 20, 20);

    tree(4, time);
}

function update(deltaTime) {
    context.fillStyle = "#000";
    context.fillRect(0, 0, screenWidth, screenHeight);
    context.save();
    context.translate(screenWidth / 2, screenHeight / 2);
    context.scale(1, -1);
    context.globalCompositeOperation = "lighten";

    const log = new Log(context, 10, 10, 14, "#fff");
    log.line("mouse: ", mouseX.toFixed(2), ", ", mouseY.toFixed(2));

    const time = now();

    const step = TAU / 16;
    for (let k = 0; k < TAU; k += step) {
        context.rotate(step);
        render(time);
    }

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