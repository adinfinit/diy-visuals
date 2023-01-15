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
	context.font = "40px monospace";
	context.fillText(now().toFixed(3), 100, 100);
	context.fillText(deltaTime.toFixed(3), 100, 200);
	context.fillText((1 / deltaTime).toFixed(3), 100, 300);
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