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

var mouseX = 0;
var mouseY = 0;

window.onmousemove = function(e) {
	mouseX = e.pageX;
	mouseY = e.pageY;

	mouseX /= screenWidth;
	mouseY /= screenHeight;
	mouseX = 2 * (mouseX - 0.5);
	mouseY = 2 * (mouseY - 0.5);
};

function tree(level, time) {
	level--;
	if (level < 0) {
		return;
	}

	context.save(); {
		var height = screenHeight * 0.2;

		var levelScale = 1 + level / 10;
		context.fillStyle = hsla(levelScale * time * 120, 70, 70, 0.5);
		context.fillRect(-5, 0, 10, height);

		context.translate(0, height);
		context.scale(0.7, 0.7);

		context.rotate(-mouseX);
		tree(level, time);
		context.rotate(mouseX);
		context.rotate(mouseY);
		tree(level, time);
	};
	context.restore();
}

function render(time) {
	context.fillStyle = hsla(time * 90, 70, 70, 0.4);
	context.fillRect(-10, 0, 20, 100);
	context.fillRect(-10, 50, 20, 20);

	tree(7, time);
}

function update(deltaTime) {
	context.fillStyle = "#000";
	context.fillRect(0, 0, screenWidth, screenHeight);
	context.save();
	context.translate(screenWidth / 2, screenHeight / 2);
	context.scale(1, -1);
	context.globalCompositeOperation = "lighten";

	var log = new Log(context, 10, 10, 14, "#fff");
	log.line("mouse: ", mouseX.toFixed(2), ", ", mouseY.toFixed(2));

	var time = now();

	var step = TAU / 16;
	for (var k = 0; k < TAU; k += step) {
		context.rotate(step);
		render(time);
	}

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