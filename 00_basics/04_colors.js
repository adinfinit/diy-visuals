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

// update the variables
window.onresize();

for (var x = 0; x < screenWidth; x += 10) {
	context.fillStyle = hsl(x * PHI, 70, 70);
	context.fillRect(x, 100, 10, 50);
}

for (var x = 0; x < screenWidth; x += 10) {
	context.fillStyle = rgb(x * PHI % 256, 50, 50);
	context.fillRect(x, 200, 10, 50);
}

for (var x = 0; x < screenWidth; x += 10) {
	context.fillStyle = rgb(
		sin((x / screenWidth) % 256) * 256,
		sin((TAU / 3 + 7 * x / screenWidth) % 256) * 256,
		sin((5 * x / screenWidth) % 256) * 256);
	context.fillRect(x, 300, 10, 50);
}