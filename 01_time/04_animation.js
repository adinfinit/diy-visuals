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

	var time = now() * 5;

	var x0 = screenWidth / 2;
	var y0 = screenHeight / 2;

	context.lineWidth = 10;
	context.beginPath();
	context.moveTo(x0, y0);
	context.lineTo(x0 - 150, y0 + sin(time) * 100);
	context.lineTo(x0 - 250, y0 + sin(time - 1) * 100);
	context.lineTo(x0 - 300, y0 + sin(time - 2) * 150);
	context.stroke();

	return;
	context.beginPath();
	context.moveTo(x0, y0);
	context.lineTo(x0 + 150, y0 + sin(time) * 100);
	context.lineTo(x0 + 250, y0 + sin(time - 1) * 100);
	context.lineTo(x0 + 300, y0 + sin(time - 2) * 150);
	context.stroke();
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