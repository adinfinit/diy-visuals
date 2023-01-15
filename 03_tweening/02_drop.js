"use strict";

const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// set canvas size to the correct size
let screen = V(0, 0);
function onresize() {
	screen.x = window.innerWidth;
	screen.y = window.innerHeight;

	canvas.width = screen.x;
	canvas.height = screen.y;
}
window.addEventListener("resize", onresize);
onresize()

let mouse = screen.mul(0.5);
window.addEventListener("mousemove", function (e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
})

function easeInOutQuad(t) {
	return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

class Button {
	constructor(name) {
		this.name = name;
		this.time = 0;
	}

	update(deltaTime) {
		this.time += deltaTime;
		if (this.time > 10) {
			this.time = 0;
		}
	}

	render(context) {
		var t = clamp1(this.time);

		var y = easeInOutQuad(t) * screen.y * 0.5;
		context.translate(screen.x / 2, y);
		var s = map(sin(this.time * 1.4), -1, 1, 1, 1.3);
		var sx = s + sin(this.time * 1.1) * 0.2;
		var sy = s + sin(this.time * 1.2) * 0.2;
		context.scale(sx, sy);
		context.rotate(sin(this.time * 2.3) * 0.1 + cos(this.time * 1.7) * 0.2)

		context.fillStyle = hsla(180, 5, 80, 1);
		context.fillRect(-100, -50, 200, 100);
		context.strokeStyle = hsla(180, 5, 20, 1);
		context.strokeRect(-100, -50, 200, 100);

		context.fillStyle = "#000";
		context.font = "50px monospace";
		var m = context.measureText(this.name);
		context.strokeStyle = "#fff";
		context.lineWidth = 3;
		context.strokeText(this.name, -m.width / 2, 15);
		context.fillText(this.name, -m.width / 2, 15);
	}
}

var button = new Button("Hello");

function update(deltaTime) {
	context.clearRect(0, 0, screen.x, screen.y);
	context.save();

	button.update(deltaTime);
	button.render(context);

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