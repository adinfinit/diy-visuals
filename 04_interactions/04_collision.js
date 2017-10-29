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

class Ball {
	constructor(start) {
		this.hue = random() * 360;
		this.pos = start;
		this.radius = randomRange(10, 30);
		this.mass = (TAU / 2) * this.radius * this.radius;
		this.vel = V.random(400);
		this.force = V(0, 0);

		this.rotation = 0;
		this.angularSpeed = randomRange(-1.5, 1.5);
	}

	resetForce() {
		this.force = V(0, 0);
	}

	addForce(force) {
		this.force = this.force.add(force);
	}

	update(deltaTime) {
		if (this.pos.x - this.radius < 0) {
			this.vel.x = abs(this.vel.x);
			this.pos.x = this.radius;
			this.angularSpeed += sign(this.vel.y) * 5;
		}
		if (this.pos.x + this.radius > screen.x) {
			this.vel.x = -abs(this.vel.x);
			this.pos.x = screen.x - this.radius;
			this.angularSpeed -= sign(this.vel.y) * 5;
		}
		if (this.pos.y - this.radius < 0) {
			this.vel.y = abs(this.vel.y);
			this.pos.y = this.radius;
			this.angularSpeed -= sign(this.vel.x) * 5;
		}
		if (this.pos.y + this.radius > screen.y) {
			this.vel.y = -abs(this.vel.y);
			this.pos.y = screen.y - this.radius;
			this.angularSpeed += sign(this.vel.x) * 5;
		}
		this.angularSpeed *= 0.99;

		this.rotation += this.angularSpeed * deltaTime;

		this.vel = this.vel.add(this.force.mul(deltaTime));
		this.pos = this.pos.add(this.vel.mul(deltaTime));
	}

	render(context) {
		context.save();
		context.translate(this.pos.x, this.pos.y);
		context.rotate(this.rotation);

		context.fillStyle = hsla(this.hue, 70, 70, 1);
		context.strokeStyle = hsla(this.hue, 10, 10, 1);
		context.lineWidth = 2;

		context.beginPath();
		context.arc(0, 0, this.radius, 0, TAU, true);
		context.fill();
		context.stroke();

		{ // face
			context.fillStyle = "#fff";
			context.lineWidth = 1;
			context.beginPath();
			context.arc(-this.radius * 0.4, -this.radius * 0.2, this.radius * 0.3, 0, TAU, true);
			context.fill();
			context.stroke();
			context.beginPath();
			context.arc(this.radius * 0.4, -this.radius * 0.2, this.radius * 0.3, 0, TAU, true);
			context.fill();
			context.stroke();
			context.beginPath();
			context.arc(0, this.radius * 0.3, this.radius * 0.5, TAU / 2, 0, true);
			context.closePath();
			context.fill();
			context.stroke();
		}

		context.restore();
	}
}

var balls = [];
for (var i = 0; i < 20; i++) {
	var x = randomRange(0, screen.x);
	var y = randomRange(0, screen.x);
	balls.push(new Ball(V(x, y)));
}

function update(deltaTime) {
	context.clearRect(0, 0, screen.x, screen.y);
	context.save();

	balls.forEach(particle => {
		particle.resetForce();
	});

	for (var i = 0; i < balls.length; i++) {
		for (var k = i + 1; k < balls.length; k++) {
			var a = balls[i];
			var b = balls[k];

			var delta = a.pos.sub(b.pos);
			if (delta.length >= a.radius + b.radius)
				continue;

			var penetration = delta.unit.mul(a.radius + b.radius - delta.length);

			var ra = a.mass / (a.mass + b.mass);
			var rb = b.mass / (a.mass + b.mass);

			a.pos = a.pos.add(penetration.mul(rb));
			b.pos = b.pos.sub(penetration.mul(ra));

			var unit = delta.unit;
			var p = 2 * (a.vel.dot(unit) - b.vel.dot(unit)) / (a.mass + b.mass);

			var avel = a.vel.sub(unit.mul(p * a.mass));
			var bvel = b.vel.add(unit.mul(p * b.mass));

			a.vel = avel;
			b.vel = bvel;
		}
	}

	balls.forEach(particle => {
		particle.update(deltaTime);
	});
	balls.forEach(particle => {
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