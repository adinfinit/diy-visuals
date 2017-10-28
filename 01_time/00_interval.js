"use strict";

var canvas = document.getElementById("canvas");
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

// setup timing loop
setInterval(function() {
	context.clearRect(0, 0, screenWidth, screenHeight);
	context.font = "40px monospace";
	context.fillText(+new Date(), 100, 100);
}, 33);