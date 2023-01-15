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

// font and style
context.font = "50px Courier";
context.fillStyle = "#000";
context.fillText("Hello", 100, 100);

context.font = "80px Arial";
context.strokeStyle = "#f00";
context.lineWidth = 2;
context.strokeText("Hello", 100, 200);

// convenience class
var log = new Log(context, 10, 10, 14);
log.reset();
log.line("Alpha");
log.line("Beta");
log.line("Gamma");
log.line("Delta");
log.line("Iota");