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

// #rgb
context.strokeStyle = "#f00";
context.lineWidth = 10;
context.strokeRect(100, 100, 50, 50);

// #rrggbb
context.strokeStyle = "#00ff00";
context.strokeRect(200, 100, 50, 50);

// rgb(red, green, blue)
context.strokeStyle = "rgb(0, 0, 255)";
context.lineWidth = 5;
context.setLineDash([10, 5]);
context.strokeRect(100, 200, 50, 50);
// rgba(red, green, blue, alpha)
context.strokeStyle = "rgba(0, 255, 255, 0.5)";
context.strokeRect(200, 200, 50, 50);

// hsl(hue, saturation, lightness)
context.strokeStyle = "hsl(32, 60%, 60%)";
context.lineWidth = 1;
context.setLineDash([]);
context.strokeRect(100, 300, 50, 50);

// hsla(hue, saturation, lightness, alpha)
context.strokeStyle = "hsla(180, 70%, 70%, 0.5)";
context.strokeRect(200, 300, 50, 50);