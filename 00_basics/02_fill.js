"use strict";

var canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
var context = canvas.getContext("2d");

// set canvas size to the correct size
var screenWidth = 0;
var screenHeight = 0;
window.onresize = function(e) {
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;

	canvas.width = screenWidth;
	canvas.height = screenHeight;
};

// update the variables
window.onresize();

// #rgb
context.fillStyle = "#f00";
context.fillRect(100, 100, 50, 50);

// #rrggbb
context.fillStyle = "#00ff00";
context.fillRect(200, 100, 50, 50);

// rgb(red, green, blue)
context.fillStyle = "rgb(0, 0, 255)";
context.fillRect(100, 200, 50, 50);
// rgba(red, green, blue, alpha)
context.fillStyle = "rgba(0, 255, 255, 0.5)";
context.fillRect(200, 200, 50, 50);

// hsl(hue, saturation, lightness)
context.fillStyle = "hsl(32, 60%, 60%)";
context.fillRect(100, 300, 50, 50);

// hsla(hue, saturation, lightness, alpha)
context.fillStyle = "hsla(180, 70%, 70%, 0.5)";
context.fillRect(200, 300, 50, 50);