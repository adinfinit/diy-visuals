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


class Particle {
	constructor(start, speed) {
		this.hue = random() * 360;
		this.pos = start;
		this.speed = speed;
		this.force = V(0, 0);
		this.alive = true;
	}

	resetForce() {
		this.force = V(0, 0);
	}

	addForce(force) {
		this.force = this.force.add(force);
	}

	update(deltaTime) {
		particles.forEach(particle => {
			if (this == particle) return;

			var delta = particle.pos.sub(this.pos);
			var length = delta.length;
			if (length < screen.y * 0.1) {
				var force = delta.mul(1 / (length + 1));
				this.addForce(force.mul(0.2));
			}
		});

		this.speed = this.speed.add(this.force.mul(deltaTime));
		this.pos = this.pos.add(this.speed.mul(deltaTime));
	}

	render(context) {
		context.fillStyle = hsla(this.hue, 70, 70, 0.2);
		context.fillCircle(this.pos.x, this.pos.y, 0.5);
	}
}

var particles = [];

function update(deltaTime) {
	context.fillStyle = "rgba(0,0,0,0.5)";
	context.fillRect(0, 0, screen.x, screen.y);
	context.save();
	context.translate(screen.x / 2, screen.y / 2)
	context.scale(10, 10);

	context.globalCompositeOperation = "lighten";
	while (particles.length < 300) {
		var speed = V.random(50);
		var zero = V(0, 0);
		//var zero = V.random(20);
		var particle = new Particle(zero, speed);
		particles.push(particle);
	}

	particles.forEach(particle => {
		particle.resetForce();
		particle.addForce(particle.pos.mul(-1));
	});
	particles.forEach(particle => {
		particle.update(deltaTime);
	});
	particles.forEach(particle => {
		particle.render(context);
	});

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