"use strict";

var canvas = document.getElementById("canvas");
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
	context.lineWidth = 5;
	context.fillStyle = "#f00";
	context.arrow(0, 0, 0, 100);
	context.fill();
	context.fillStyle = "#00f";
	context.arrow(0, 0, 100, 0);
	context.fill();

	context.fillStyle = rgba(0, 0, 0, 0.1);
	context.fillRect(0, 0, 100, 100);

	context.beginPath();
	context.arc(0, 0, 100, 0, TAU, true);
	context.fill();

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