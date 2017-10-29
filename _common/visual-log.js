"use strict";

class Log {
	constructor(context, x, y, fontSize, fontColor) {
		this.context = context;
		this.x0 = x;
		this.y0 = y;
		this.x = x;
		this.y = y + fontSize;
		this.fontSize = fontSize || 12;
		this.fontColor = fontColor || "#000";
	}

	reset() {
		this.x = this.x0;
		this.y = this.y0 + this.fontSize;
	}

	line() {
		this.context.save();
		this.context.resetTransform();
		this.context.font = this.fontSize + "px monospace";
		this.context.fillStyle = this.fontColor;

		var line = "";
		for (var i = 0; i < arguments.length; i++) {
			if (line[line.length - 1] != " ") {
				line += " ";
			}
			line += arguments[i];
		}

		this.context.fillText(line, this.x, this.y);
		this.y += this.fontSize;

		this.context.restore();
	}
}