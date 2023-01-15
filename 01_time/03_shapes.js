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

    context.beginPath();
    context.arc(100, 100, 50, 0, now() * 5, true);
    context.stroke();

    context.beginPath();
    context.arc(250, 100, 50, 0, now() * 2, true);
    context.fill();

    context.beginPath();
    context.moveTo(100, 250);
    context.arc(100, 250, 50, 0, now() * 4, true);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(250, 250);
    context.arc(250, 250, 50, 0, -now() * 3, true);
    context.closePath();
    context.fill();

    {
        const N = 250;

        var time = now();
        context.lineWidth = 10;
        context.fillStyle = "#ccc";
        context.strokeStyle = "#888";
        context.beginPath();
        var cx = 550;
        var cy = 250;

        for (var i = 0; i < N; i++) {
            var p = i * TAU / N;

            var r = 150 +
                sin(time * 7 + p * 5) * 50 +
                0 * cos(time * 8 + p * 3) * 30 +
                0 * cos(time * 16 + p * 16) * 10;

            var rx = cx + cos(p) * r;
            var ry = cy + sin(p) * r;
            if (i == 0)
                context.moveTo(rx, ry);
            else
                context.lineTo(rx, ry);
        }

        context.closePath();
        context.fill();
        context.stroke();
    }

    {
        var top = [];
        var bottom = [];
        const N = 40;
        var time = now();
        for (var i = 0; i < N; i++) {
            var t = i / N;
            var p = 100 * t;
            top.push({
                x: p + 100,
                y: -10 * sin(t * TAU + time * 3) + 350 - 20
            });
            bottom.push({
                x: p + 100,
                y: 10 * sin(t * TAU + time * 2) + 350 + 20
            });
        }
        context.beginPath();
        context.moveTo(top[0].x, top[0].y);
        for (var i = 1; i < N; i++) {
            context.lineTo(top[i].x, top[i].y);
        }
        for (var i = N - 1; i >= 0; i--) {
            context.lineTo(bottom[i].x, bottom[i].y);
        }
        context.closePath();
        context.fillStyle = "#eee";
        context.strokeStyle = "#666";
        context.fill();
        context.stroke();
    }
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