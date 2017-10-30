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

class Cell {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.alive = false;
	}

	assign(other) {
		this.x = other.x;
		this.y = other.y;
		this.alive = other.alive;
	}

	randomize() {
		this.alive = random() > 0.5;
	}

	update(lastGrid) {
		var aliveCount = 0;
		for (var dy = -1; dy <= 1; dy++) {
			for (var dx = -1; dx <= 1; dx++) {
				if ((dx == 0) && (dy == 0)) {
					continue;
				}
				var neighbor = lastGrid.get(this.x + dx, this.y + dy);
				if (neighbor.alive) {
					aliveCount++;
				}
			}
		}

		if (aliveCount < 2) {
			// under population
			this.alive = false;
		} else if (aliveCount > 3) {
			// over population
			this.alive = false;
		} else if (aliveCount == 3 && !this.alive) {
			// reproduction
			this.alive = true;
		}
	}

	render(context) {
		context.save();
		context.translate(this.x, this.y);
		context.fillStyle = this.alive ? "#eee" : "#333";
		context.fillRect(0.05, 0.05, 0.9, 0.9);
		//context.fillCircle(0.5, 0.5, 0.4);
		context.restore();
	}
}

var DEAD = new Cell(NaN, NaN);

class Grid {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.alive = false;
		this.cells = new Array(width * height);

		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				this.cells[y * this.width + x] = new Cell(x, y);
			}
		}
	}

	assign(other) {
		for (var i = 0; i < this.cells.length; i++) {
			this.cells[i].assign(other.cells[i]);
		}
	}

	get(x, y) {
		if ((x < 0) || (this.width <= x)) return DEAD;
		if ((y < 0) || (this.height <= y)) return DEAD;
		return this.cells[y * this.width + x];
	}

	update(lastGrid) {
		this.cells.forEach(cell => {
			cell.update(lastGrid);
		})
	}

	render(context) {
		context.save();

		context.translate(screen.x / 2, screen.y / 2);
		var s = min(screen.x, screen.y) / max(this.width, this.height);
		context.scale(s, s);
		context.translate(-this.width / 2, -this.height / 2);

		this.cells.forEach(cell => {
			cell.render(context);
		});

		context.restore();
	}

	randomize() {
		this.cells.forEach(cell => {
			cell.randomize();
		});
	}
}

var previous = new Grid(25, 25);
var current = new Grid(25, 25);

current.randomize();

setInterval(function() {
	previous.assign(current);
	current.update(previous);
}, 100);

function update(deltaTime) {
	context.fillStyle = "rgba(0,0,0,0.5)";
	context.fillRect(0, 0, screen.x, screen.y);
	context.save();
	context.globalCompositeOperation = "lighten";

	current.render(context);

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