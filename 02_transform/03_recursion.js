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


function tree(level, time) {
	level--;
	if (level < 0) {
		return;
	}

	context.save(); {
		var height = screenHeight * 0.3;

		context.fillStyle = "#000";
		context.fillRect(-5, 0, 10, height);

		context.translate(0, height);
		context.scale(0.7, 0.7);

		var rotateLeft = sin(time * 3 + TAU * 0.1);
		var rotateRight = sin(time * 4 - TAU * 0.1);

		context.rotate(rotateLeft);
		tree(level, time);
		context.rotate(-rotateLeft);
		context.rotate(rotateRight);
		tree(level, time);
	};
	context.restore();
}


function update(deltaTime) {
	context.clearRect(0, 0, screenWidth, screenHeight);
	context.save();
	context.translate(screenWidth / 2, screenHeight);
	context.scale(1, -1);

	tree(3, 0);
	//tree(10, 0);
	//tree(10, now());
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