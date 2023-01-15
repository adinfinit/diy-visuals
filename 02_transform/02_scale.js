"use strict";

var canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
var context = canvas.getContext("2d");

// set canvas size to the correct size
var screenWidth = 0;
var screenHeight = 0;
window.onresize = function(e) {
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;

	canvas.width = screenWidth;
	canvas.height = screenHeight;
};
window.onresize();

function update(deltaTime) {
	context.clearRect(0, 0, screenWidth, screenHeight);
	context.save();
	context.translate(screenWidth / 2, screenHeight / 2);
	var time = now();
	context.rotate(-time);
	context.scale(sin(time) + 1.5, cos(time) + 1.5);

	// gizmo
	context.gizmo(0, 0, 100);

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