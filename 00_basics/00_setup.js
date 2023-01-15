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

// draw something on the screen
context.fillRect(screenWidth / 2 - 25, screenHeight / 2 - 25, 50, 50);