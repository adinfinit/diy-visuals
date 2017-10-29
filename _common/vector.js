class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	static fromAngle(a) {
		return new Vector(Math.cos(a), Math.sin(a));
	}
	static lerp(a, b, p) {
		return a.add(b.sub(a).mul(p));
	}
	static random(s) {
		var x = Math.random() * 2 * s - s;
		var y = Math.random() * 2 * s - s;
		return V(x, y).clampLength(s);
	}
	static lerpClamp(a, b, p) {
		if (p < 0) p = 0;
		if (p > 1) p = 1;
		return a.add(b.sub(a).mul(p));
	}
	map(min, max, toMin, toMax) {
		var p = this.sub(min).div(max.sub(min));
		return toMax.sub(toMin).mul(p).add(toMin);
	}

	negative() {
		return new Vector(-this.x, -this.y);
	}
	add(v) {
		if (typeof v == "number")
			return new Vector(this.x + v, this.y + v);
		return new Vector(this.x + v.x, this.y + v.y);
	}
	sub(v) {
		if (typeof v == "number")
			return new Vector(this.x - v, this.y - v);
		return new Vector(this.x - v.x, this.y - v.y);
	}
	mul(v) {
		if (typeof v == "number")
			return new Vector(this.x * v, this.y * v);
		return new Vector(this.x * v.x, this.y * v.y);
	}
	div(v) {
		if (typeof v == "number")
			return new Vector(this.x / v, this.y / v);
		return new Vector(this.x / v.x, this.y / v.y);
	}
	clampLength(targetLength) {
		var len = this.length;
		if (len > targetLength) {
			return this.div(len);
		}
		return this.clone();
	}
	scaleTo(targetLength) {
		return this.mul(targetLength / this.length);
	}
	eq(v) {
		return this.x == v.x && this.y == v.y;
	}
	dot(v) {
		return this.x * v.x + this.y * v.y;
	}
	get length() {
		return Math.sqrt(this.dot(this));
	}
	get normal() {
		return (new Vector(-this.y, this.x)).unit;
	}
	get unit() {
		return this.div(this.length);
	}
	get min() {
		return Math.min(this.x, this.y);
	}
	get max() {
		return Math.max(this.x, this.y);
	}
	get theta() {
		return Math.atan2(this.z, this.x);
	}
	get phi() {
		return Math.asin(this.y / this.length);
	}
	toString() {
		return "x:" + this.x.toFixed(2) + " y:" + this.y.toFixed(2);
	}
	angleTo(b) {
		return Math.acos(this.dot(b) / (this.length() * b.length()));
	}
	clone() {
		return new Vector(this.x, this.y);
	}
}

function V(x, y) {
	return new Vector(x, y);
}

V.random = Vector.random;
V.fromAngle = Vector.fromAngle;
V.lerp = Vector.lerp;
V.lerpClamp = Vector.lerpClamp;