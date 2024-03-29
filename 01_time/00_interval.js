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

// setup timing loop
setInterval(function () {
    context.clearRect(0, 0, screenWidth, screenHeight);
    context.font = "40px monospace";
    context.fillText(+new Date(), 100, 100);
}, 33);