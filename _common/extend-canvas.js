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