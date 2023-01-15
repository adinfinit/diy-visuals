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

// rectangle
// fillRect(x, y, width, height)
context.fillRect(50, 50, 25, 25);
context.fillRect(50, 100, 100, 25);

// paths
context.beginPath()
context.moveTo(50, 150);
context.lineTo(100, 200);
context.lineTo(150, 160);
context.lineTo(200, 160);

context.lineWidth = 3;
context.stroke();

// fills
context.beginPath()
context.moveTo(50, 250);
context.lineTo(100, 275);
context.lineTo(150, 220);
context.lineTo(200, 260);
context.fill();

// circle
// arc(x, y, radius, startAngle, endAngle, clockwise)
context.beginPath();
context.arc(100, 350, 25, 0, 2 * PI, true);
context.fill();