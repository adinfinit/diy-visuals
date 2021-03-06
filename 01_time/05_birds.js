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

class Bird {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;

		this.time = 0;
		this.size = r;
		this.speed = r * 2;
	}

	update(deltaTime) {
		this.time += deltaTime * this.speed;
	}

	draw(context) {
		var x0 = (this.x) * screenWidth;
		var y0 = (this.y + sin(this.time * 0.1) * 0.5) * screenHeight;
		var time = this.time;

		var size = screenWidth * 0.1 * this.size / 10;

		context.strokeStyle = hsla(time, 70, 30, 0.9);

		context.lineWidth = 10;
		context.beginPath();
		context.moveTo(x0, y0);
		context.lineTo(x0 - size, y0 + sin(time) * size * 0.75);
		context.lineTo(x0 - size * 2, y0 + sin(time - 1) * size * 0.75);
		context.lineTo(x0 - size * 2.5, y0 + sin(time - 2) * size);
		context.stroke();

		context.beginPath();
		context.moveTo(x0, y0);
		context.lineTo(x0 + size, y0 + sin(time) * size * 0.75);
		context.lineTo(x0 + size * 2, y0 + sin(time - 1) * size * 0.75);
		context.lineTo(x0 + size * 2.5, y0 + sin(time - 2) * size);
		context.stroke();
	}
}

var birds = [];
const N = 10;
for (var i = 1; i < N; i++) {
	birds.push(new Bird(i / N, 0.5, i));
}

function update(deltaTime) {
	context.fillStyle = hsla(0, 0, 100, 0.6);
	context.fillRect(0, 0, screenWidth, screenHeight);

	birds.forEach(bird => {
		bird.update(deltaTime);
		bird.draw(context);
	})
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