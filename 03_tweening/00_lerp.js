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

class Follower {
	constructor(target, index) {
		this.target = target;
		this.position = screen.mul(0.5);
		this.index = index;
		this.time = 0;
	}

	update(deltaTime) {
		this.time += deltaTime;
		if (this.target.position.sub(this.position).length < 20) return;
		this.position = V.lerp(this.position, this.target.position, 0.1);
	}

	render(context) {
		var h = this.index * PHI * 360 / TAU;
		context.fillStyle = hsla(h, 40, 40, 0.5);
		context.fillCircle(this.position.x, this.position.y, 10);
		return;

		var offset = V.fromAngle(this.time + this.index);
		var p = this.position.add(offset.mul(10));
		context.fillCircle(p.x, p.y, 10);
	}
}

var followers = [];
var target = {
	position: mouse
};
for (var i = 0; i < 10; i++) {
	var follower = new Follower(target, i);
	target = follower;
	followers.push(follower);
}

function update(deltaTime) {
	context.clearRect(0, 0, screen.x, screen.y);
	context.save();

	var log = new Log(context, 10, 10, 14, "#000");
	var p0 = V(100, 200);
	var p1 = mouse;
	var t = now() % 1;
	var p = V.lerp(p0, p1, now() % 1);
	log.line("t", t.toFixed(2));

	context.fillStyle = rgb(60, 60, 60);
	context.fillCircle(p0.x, p0.y, 10);
	context.fillCircle(p1.x, p1.y, 10);
	context.fillStyle = rgb(255, 0, 0);
	context.fillCircle(p.x, p.y, 10);

	log.line();
	log.line("m", mouse);

	followers.forEach(follower => {
		log.line(follower.index, follower.position);
		follower.update(deltaTime);
		follower.render(context);
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