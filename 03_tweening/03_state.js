"use strict";

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// set canvas size to the correct size
var screen = V(0, 0);
window.onresize = function(e) {
	screen.x = window.innerWidth;
	screen.y = window.innerHeight;

	canvas.width = screen.x;
	canvas.height = screen.y;
};
window.onresize();

var mouse = screen.mul(0.5);

window.onmousemove = function(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
};

function easeInOutQuad(t) {
	return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function cube2(t) {
	var s = sin(t * TAU);
	return t + s * s * s * s / 2;
}

const MOVING = 1;
const EATING = 2;

class Flob {
	constructor() {
		this.start = V(random(), random());
		this.target = V(random(), random());
		this.animation = 0;
		this.duration = randomRange(1, 2);
		this.hue = random() * 360;

		this.state = MOVING;
	}

	update(deltaTime) {
		this.animation += deltaTime / this.duration;
		if (this.animation > 1) {
			if (this.state == MOVING) {
				this.state = EATING;
				this.start = this.target;
				this.animation = 0;
				this.duration = randomRange(1, 3);
			} else {
				this.state = MOVING;
				this.target = V(random(), random());
				this.animation = 0;
				this.duration = randomRange(1, 2);
			}
		}
	}

	render(context) {
		var start = V.lerp(V(0, 0), screen, this.start);
		var target = V.lerp(V(0, 0), screen, this.target);

		if (this.state == MOVING) {
			var t = easeInOutQuad(this.animation);
			var p = V.lerp(start, target, t);
			context.fillStyle = hsla(this.hue, 70, 30, 0.8);
			context.fillCircle(p.x, p.y, 10);
		} else {
			var t = sin(this.animation * TAU * 4);
			context.fillStyle = hsla(this.hue, 70, 30, 0.8);
			context.fillCircle(start.x, start.y, 15 + t * 5);
		}

		context.fillStyle = hsla(0, 80, 80, 0.8);
		context.fillCircle(target.x, target.y, 5);
	}
}

var flobs = [];
for (var i = 0; i < 1; i++) {
	flobs.push(new Flob());
}

function update(deltaTime) {
	context.clearRect(0, 0, screen.x, screen.y);
	context.save();

	flobs.forEach(flob => {
		flob.update(deltaTime);
		flob.render(context);
	})

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