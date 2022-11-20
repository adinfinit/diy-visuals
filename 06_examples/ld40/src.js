"use strict";

var canvas = document.getElementById('view'),
	context = canvas.getContext("2d");

var TAU = Math.PI * 2;
var PHI = 1.61803398874989484820;

var screenWidth = 0;
var screenHeight = 0;
window.onresize = function(e) {
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;

	canvas.width = screenWidth;
	canvas.height = screenHeight;
};
window.onresize();

var BOUNCE = 0;

(function(tick) {
	var last = new Date();
	var time = 0;

	function update() {
		window.requestAnimationFrame(update);
		try {
			context.save();
			var now = new Date();
			var dt = (now - last) * 0.001;
			last = now;
			if (dt > 0.1) {
				dt = 0.1;
			}
			time += dt;

			if (BOUNCE < 1.0) {
				BOUNCE += dt / 2.5;
			}

			//var p = Math.sin(time * 8) * 0.5 + 0.5
			//var p = bounce(p, 0, 1, 1) * 3;
			var NEXTSTROKE = 8 - bounce(BOUNCE, 0, 4, 1);
			STROKEWIDTH = lerp(STROKEWIDTH, NEXTSTROKE, 0.5);

			var NEXTSIZE = bounce(BOUNCE, 10, -10, 1);
			SIZEINCREASE = lerp(SIZEINCREASE, NEXTSIZE, 0.5);

			var s = Math.sin(time * 8);
			var c = Math.cos(time * 7.3);
			var offset = 1 + (s + c) * 0.008;
			tick(dt * offset);
		} finally {
			context.restore();
		}
	}
	window.setTimeout(update, 0);
})(Tick)

function random(min, max) {
	return +min + Math.random() * (+max - +min);
}

function randomsnap(min, max, snap) {
	return +min + Math.floor(Math.random() * (+max - +min) / +snap) * +snap;
}

function bounce(t, start, end, duration) {
	t = +t;
	start = +start;
	end = +end;
	duration = +duration;

	t = t / duration
	var ts = t * t
	var tc = ts * t
	return start + end * (33 * tc * ts + -106 * ts * ts + 126 * tc + -67 * ts + 15 * t)
}

class Interval {
	constructor(interval) {
		this.interval = interval;
		this.countdown = interval;
		this.trigger = false;
	}

	update(dt) {
		this.countdown -= dt;
		this.trigger = false;
		while (this.countdown < 0) {
			this.trigger = true;
			this.countdown += this.interval;
		}
	}

	do(fn) {
		if (this.trigger) {
			fn();
		}
	}
}

const rad2deg = 360.0 / TAU;
const deg2rad = TAU / 360.0;

/* vector.js */

function clamp01(x) {
	if (x < 0) return 0;
	if (x > 1) return 1;
	return x;
}

function clamp(x, min, max) {
	if (x < min) return min;
	if (x > max) return max;
	return x;
}

function lerp(a, b, p) {
	return a + (b - a) * p
}

function lerpClamped(a, b, p) {
	return lerp(a, b, clamp01(p));
}

class Vector {
	constructor(x, y) {
		this.x = +x;
		this.y = +y;
	}

	static fromAngle(angle, len) {
		len = +len || +1.0;
		return new Vector(Math.cos(angle) * len, Math.sin(angle) * len);
	}

	static lerp(a, b, p) {
		return a.add(b.sub(a).scale(p));
	}
	static lerpClamped(a, b, p) {
		return Vector.lerp(a, b, clamp01(p));
	}

	setAngle(angle, len) {
		this.x = Math.cos(angle) * len;
		this.y = Math.sin(angle) * len;
	}

	clone() {
		return new Vector(this.x, this.y);
	}
	zset(v) {
		this.x = v.x;
		this.y = v.y;
	}
	add(b) {
		return new Vector(this.x + b.x, this.y + b.y);
	}
	zadd(b) {
		this.x += b.x;
		this.y += b.y;
	}
	sub(b) {
		return new Vector(this.x - b.x, this.y - b.y);
	}
	zsub(b) {
		this.x -= b.x;
		this.y -= b.y;
	}
	scale(s) {
		return new Vector(this.x * s, this.y * s);
	}
	neg() {
		return new Vector(-this.x, -this.y);
	}
}
Vector.Zero = new Vector(0, 0);

/* stem.js */

const MAXTURN = TAU / 2.0;
const ANGLESNAP = TAU / 8.0;
const EPSILON = TAU / 128;

var STROKEWIDTH = 5;
var SIZEINCREASE = 0;

const State = {
	Growing: 0,
	Living: 1,
	Dying: 2,
	Dead: 3
};

var Z = 0;

var temp = new Vector();

class Stem {
	constructor(stem) {
		this.stem = stem || null;
		this.life = 0.0;

		this.state = State.Growing;
		this.start = 0.0;
		this.end = 0.0;
		this.width = 20.0;

		this.speed = 200.0;

		this.root = Vector.Zero;
		this.direction = random(0, TAU);
		this.turn = randomsnap(-MAXTURN, MAXTURN, ANGLESNAP);
		this.length = randomsnap(200, 500, 50);

		this.branchAngle = randomsnap(0.0, TAU / 4.0, ANGLESNAP);
		if (this.turn > 0) {
			this.branchAngle = -this.branchAngle;
		}

		this.fill = "hsl(" + (random(0, 360) | 0) + ", 70%, 40%)";
		this.stroke = "hsl(" + (random(0, 360) | 0) + ", 70%, 40%)";

		// drawing state
		this.tail = Vector.Zero;
		this.head = Vector.Zero;

		this.z = Z++;

		this.arc = {
			center: Vector.Zero,
			radius: 0,
			start: 0,
			end: 1,
			counterClock: false
		};
	}

	static from(prev) {
		var stem = new Stem();
		stem.root = prev.max();
		stem.speed = prev.speed;
		stem.width = prev.width;
		stem.direction = prev.direction + prev.turn;
		stem.fill = prev.fill;
		stem.stroke = prev.stroke;
		return stem;
	}

	get dying() {
		return (this.state == State.Dying) || (this.state == State.Dead);
	}
	get dead() {
		return this.state == State.Dead;
	}

	max() {
		if (Math.abs(this.turn) < EPSILON) {
			temp.setAngle(this.direction + this.turn, this.length);
			return this.root.add(temp);
		} else {
			var curvature = 1.0 / this.turn;
			var arcRadius = this.length * curvature;

			temp.setAngle(this.direction + TAU / 4, arcRadius);
			var arcCenter = this.root.add(temp);
			temp.setAngle(this.direction + this.turn + TAU / 4, arcRadius);
			arcCenter.zsub(temp);

			return arcCenter;
		}
	}

	update(dt) {
		if (this.stem) {
			if (this.stem.dying) {
				if (!this.dying) {
					this.state = State.Dying;
				}
			}
		}
		var speed = this.speed / this.length;

		this.life += dt * speed;
		if (this.state == State.Growing) {
			this.end += dt * speed;
			if (this.end > 1.0) {
				this.end = 1.0;
				this.state = State.Living;
			}
		} else if (this.state == State.Living) {

		} else if (this.state == State.Dying) {
			this.start += dt * speed;
			if (this.start > 1.0) {
				this.start = 1.0;
				this.state = State.Dead;
			}
		} else {
			this.start = 1.0;
			this.end = 1.0;
		}
		this.updateDraw();
	}

	updateDraw() {
		if (Math.abs(this.turn) <= EPSILON) {
			var min = this.root;
			temp.setAngle(this.direction, this.length);
			var max = this.root.add(temp);

			this.tail = Vector.lerp(min, max, this.start);
			this.head = Vector.lerp(min, max, this.end);
			return;
		}

		var curvature = 1.0 / this.turn;
		this.arc.radius = this.length * curvature;
		temp.setAngle(this.direction + TAU / 4, this.arc.radius);
		this.arc.center = this.root.add(temp);

		var minAngle, maxAngle, counterClock;
		if (this.turn >= 0.0) {
			minAngle = this.direction - TAU / 4;
			maxAngle = minAngle + this.turn;
			this.arc.counterClock = false;
		} else {
			minAngle = this.direction + TAU / 4;
			maxAngle = minAngle + this.turn;
			this.arc.counterClock = true;
		}

		this.arc.start = lerp(minAngle, maxAngle, this.start);
		this.arc.end = lerp(minAngle, maxAngle, this.end);

		temp.setAngle(this.arc.start, Math.abs(this.arc.radius));
		this.tail = this.arc.center.add(temp);
		temp.setAngle(this.arc.end, Math.abs(this.arc.radius));
		this.head = this.arc.center.add(temp);

		// arc-debug points
		// debug(this.arc.center, 5, "#000");
		// debug(this.tail, 5, "#f00");
		// debug(this.head, 5, "#0f0");
	}

	draw(context) {
		if (this.dead) {
			return;
		}
		if (Math.abs(this.turn) <= EPSILON) {
			context.beginPath();
			context.moveTo(this.tail.x, this.tail.y);
			context.lineTo(this.head.x, this.head.y);
		} else {
			context.beginPath();
			context.arc(
				this.arc.center.x,
				this.arc.center.y,
				Math.abs(this.arc.radius),
				this.arc.start,
				this.arc.end,
				this.arc.counterClock);
		}

		if (this.stroke) {
			context.lineCap = "round";
			context.strokeStyle = this.stroke;
			context.lineWidth = this.width;
			context.stroke();
		}

		if (this.fill) {
			context.lineCap = "round";
			context.strokeStyle = this.fill;
			context.lineWidth = this.width - 2 * STROKEWIDTH;
			context.stroke();
		}
	}
}

class Node {
	constructor(stem) {
		this.stem = stem;
		this.root = stem.root;
		this.life = 0.0;
		this.duration = 0.6;
		this.radius = stem.width * 1.2;
		this.state = State.Growing;
		this.fill = stem.fill;
		this.stroke = stem.stroke;

		this.z = Z++;
	}

	get dead() {
		return this.state == State.Dead;
	}

	update(dt) {
		if (this.stem.dying) {
			if (this.state != State.Dead) {
				this.state = State.Dying;
			}
		}

		if (this.state == State.Growing) {
			this.life += dt / this.duration;
			if (this.life > 1) {
				this.state = State.Living;
				this.life = 1;
			}
		}

		if (this.state == State.Dying) {
			this.life -= dt / this.duration;
			if (this.life < 0) {
				this.state = State.Dead;
				this.life = 0;
			}
		}
	}

	draw(context) {
		var p = bounce(this.life, 0, 1, 1);

		context.fillStyle = this.stroke;
		context.beginPath();
		context.arc(this.root.x, this.root.y, Math.abs(p * this.radius + SIZEINCREASE), 0, TAU, true);
		context.fill();

		context.fillStyle = this.fill;
		context.beginPath();
		var r = p * this.radius - STROKEWIDTH;
		if (r < 0) {
			r = 0;
		}
		context.arc(this.root.x, this.root.y, Math.abs(r + SIZEINCREASE), 0, TAU, true);
		context.fill();
	}
}

class Tree {
	constructor() {
		var stem = new Stem();
		stem.speed = 200;
		stem.stroke = "#333";
		stem.fill = "#fff";
		// stem.fill = "hsla(90, 70%, 40%, 0.8)";


		this.stems = [stem];
		this.nodes = [new Node(stem)];
		this.branches = [];

		this.spawnInterval = 0.3;
		this.spawnCountdown = this.spawnInterval;
	}

	last() {
		if (this.stems.length > 0) {
			return this.stems[this.stems.length - 1];
		}
		return null;
	}

	update(dt) {
		var last = this.last();

		this.spawnCountdown -= dt;
		if (this.spawnCountdown < 0) {
			this.spawnCountdown += this.spawnInterval;
			if (last != null) {
				var branch = Stem.from(last);
				branch.stem = last;
				// branch.stroke = "hsla(0, 0%, 30%, 0.3)";
				// branch.fill = "hsla(0, 0%, 30%, 0.3)";
				var color = "hsla(0, 0%, 20%, 0.5)";
				// var color = "#666";
				branch.stroke = color;
				branch.fill = null;
				branch.direction = lerp(last.direction, last.direction + last.turn + last.branchAngle, last.end);
				if (last.turn < 0) {
					branch.turn = randomsnap(ANGLESNAP, MAXTURN * 2, ANGLESNAP * 0.5);
				} else {
					branch.turn = randomsnap(-MAXTURN * 2, ANGLESNAP, ANGLESNAP * 0.5);
				}
				branch.z = last.z - 1;
				branch.width = last.width * random(0.3, 0.6);
				branch.length = randomsnap(100, last.length, 25);
				branch.root = last.head;
				this.branches.push(branch);
			}
		}

		if (last != null && last.state == State.Living) {
			var stem = Stem.from(last);
			this.stems.push(stem);
			var node = new Node(stem);
			this.nodes.push(node);

			BOUNCE = 0;
		}

		if (this.stems.length > 4) {
			if (this.stems[0].state == State.Living) {
				this.stems[0].state = State.Dying;
			}
		}

		this.stems.forEach(stem => stem.update(dt));
		this.stems = this.stems.filter(stem => !stem.dead);

		this.branches.forEach(branch => branch.update(dt));
		this.branches = this.branches.filter(branch => !branch.dead);

		this.nodes.forEach(node => node.update(dt));
		this.nodes = this.nodes.filter(node => !node.dead);
	}

	draw(context) {
		this.branches.forEach(item => item.draw(context));
		this.stems.forEach(item => item.draw(context));
		this.nodes.forEach(item => item.draw(context));
	}
}

var tree = new Tree();

function debug(p, size, color) {
	context.fillStyle = color || "#f00";
	context.beginPath();
	context.arc(p.x, p.y, size || 5, 0, TAU, true);
	context.fill();
}

function debugDir(p, angle, len, size, color) {
	context.strokeStyle = color || "#f00";
	context.lineWidth = size;
	context.beginPath();
	context.moveTo(p.x, p.y);
	var t = p.add(Vector.fromAngle(angle, len));
	context.lineTo(t.x, t.y);
	context.stroke();
}

var camera = Vector.Zero;
var hue = 0;

function Tick(dt) {
	context.save(); {
		hue += dt * 10;
		var sat = 50 + Math.sin(hue) * 10;
		var lit = 95;

		context.fillStyle = "hsl(" + (hue | 0) + ", " + sat + "%, " + lit + "%)";
		context.fillRect(0, 0, screenWidth, screenHeight);

		context.translate(screenWidth / 2, screenHeight / 2);

		var last = tree.last();
		if (last) {
			camera = Vector.lerp(camera, last.head.neg(), 0.05);
		}
		context.translate(camera.x, camera.y);

		tree.update(dt);
		tree.draw(context);
	}
	context.restore();

	function textWithShadow(text, x, y, size, align) {
		var fontSize = (screenHeight * size) | 0;
		context.font = fontSize + "px " + " Georgia";
		var size = context.measureText(text);

		if (align == "left") {} else if (align == "right") {
			x -= size.width;
		} else {
			x -= size.width / 2;
		}

		context.fillStyle = "rgba(0,0,0,0.5)";
		context.fillText(text, x, y - fontSize * 0.5 + fontSize * 0.05);

		context.lineWidth = 10;
		context.strokeStyle = "rgba(255,255,255,0.3)";
		context.strokeText(text, x, y - fontSize * 0.5);

		context.fillStyle = "rgba(0,0,0,0.8)";
		context.fillText(text, x, y - fontSize * 0.5);
	}

	function countdown(targethours) {
		function pad(x) {
			return x < 0 ? x : x < 10 ? "0" + x : x;
		}

		var now = new Date();
		var target = new Date(2017, 11, 4, targethours);
		var totalSeconds = (target - now) / 1000;
		if (totalSeconds < 0) {
			return "";
		}

		var hours = (totalSeconds / (60 * 60)) | 0;
		var minutes = ((totalSeconds / 60) - hours * 60) | 0;
		var seconds = (totalSeconds - minutes * 60 - hours * 60 * 60) | 0;

		return hours + ":" + pad(minutes) + ":" + pad(seconds);
	}

	{
		var base = screenHeight * 0.02;
		var step = screenHeight * 0.05;
		var block = screenHeight * 0.1;
		var x = screenWidth / 2 - screenWidth * 0.04;
		var x2 = screenWidth / 2 + screenWidth * 0.04;

		textWithShadow("Competition Deadline", x, base += block, 0.05, "right");
		textWithShadow("17:00", x, base += step, 0.05, "right");

		textWithShadow(countdown(17), x2, base + block * 0.5, 0.07, "left");

		textWithShadow("Voting", x, base += block, 0.05, "right");
		textWithShadow("17:00 - 19:00", x, base += step, 0.05, "right");

		textWithShadow(countdown(19), x2, base + block * 0.5, 0.07, "left");

		textWithShadow("Final Presentations", x, base += block, 0.05, "right");
		textWithShadow("19:00 - 20:00", x, base += step, 0.05, "right");

		textWithShadow("Award ceremony", x, base += block, 0.05, "right");
		textWithShadow("21:00", x, base += step, 0.05, "right");

		textWithShadow("The more you have,", screenWidth / 2, screenHeight * 0.77, 0.08);
		textWithShadow("the worse it is!", screenWidth / 2, screenHeight * 0.87, 0.08);
		textWithShadow("Ludum Dare 40", screenWidth / 2, screenHeight * 0.975, 0.05);
	}
}