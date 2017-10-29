CanvasRenderingContext2D.prototype["fillCircle"] = function(x0, y0, r) {
	this.beginPath();
	this.arc(x0, y0, r, 0, 2 * Math.PI, true);
	this.fill();
};

CanvasRenderingContext2D.prototype["fillSquare"] = function(x0, y0, r) {
	this.fillRect(x0 - r, y0 - r, 2 * r, 2 * r);
};


CanvasRenderingContext2D.prototype["arrow"] = function(x0, y0, x1, y1) {
	var hw = (parseInt(this.lineWidth) || 3) / 2;
	var dx = x1 - x0;
	var dy = y1 - y0;
	var d = Math.sqrt(dx * dx + dy * dy);

	var headLen = Math.min(hw * 3 / d, 0.5);
	var headWidth = 2.0;
	var tailLen = 1.0 - headLen;

	var nx = dx * hw / d;
	var ny = dy * hw / d;
	var nrx = -ny;
	var nry = nx;

	this.beginPath();
	this.moveTo(x0, y0);
	this.lineTo(
		x0 + nrx,
		y0 + nry);
	this.lineTo(
		x0 + nrx + dx * tailLen,
		y0 + nry + dy * tailLen);
	this.lineTo(
		x0 + nrx + dx * tailLen + headWidth * nrx,
		y0 + nry + dy * tailLen + headWidth * nry);
	this.lineTo(
		x0 + dx,
		y0 + dy);
	this.lineTo(
		x0 - nrx + dx * tailLen - headWidth * nrx,
		y0 - nry + dy * tailLen - headWidth * nry);
	this.lineTo(
		x0 - nrx + dx * tailLen,
		y0 - nry + dy * tailLen);
	this.lineTo(
		x0 - nrx,
		y0 - nry);
	this.lineTo(x0, y0);
};

CanvasRenderingContext2D.prototype["gizmo"] = function(x0, y0, size) {
	this.save();
	context.lineWidth = 5;
	context.fillStyle = "#f00";
	context.arrow(x0, y0, x0, y0 + size);
	context.fill();
	context.fillStyle = "#00f";
	context.arrow(x0, y0, x0 + size, y0);
	context.fill();

	context.fillStyle = rgba(0, 0, 0, 0.1);
	context.fillRect(x0, y0, x0 + size, y0 + size);

	// context.beginPath();
	// context.arc(x0, y0, size, 0, TAU, true);
	// context.fill();
	this.restore();
};