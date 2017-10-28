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