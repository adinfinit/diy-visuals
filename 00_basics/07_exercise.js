"use strict";

const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// set canvas size to the correct size
let screenWidth = 0;
let screenHeight = 0;

function onresize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    canvas.width = screenWidth;
    canvas.height = screenHeight;
}

window.addEventListener("resize", onresize);
// update the variables
onresize();


/* 

Exercise, draw a house.

You can draw whatever you like, but here are
a few ideas on what you can add to make the
scene nicer.

- some windows
- a street sign or house number
- a chimney with smoke
- a fence
- some grass
- bush or a tree
- a cat or a dog
- a sun and clouds

*/

// here's a fancier roof you can start with
const roofTopX = 300;
const roofTopY = 100;
const roofHeight = 100;
const roofWidth = 100;
const roofCurveX = 50;
const roofCurveY = 90;
var p = new Path2D();
p.moveTo(roofTopX-roofWidth, roofTopY+roofHeight);
p.quadraticCurveTo(roofTopX-roofCurveX, roofTopY+roofCurveY, roofTopX, roofTopY);
p.quadraticCurveTo(roofTopX+roofCurveX, roofTopY+roofCurveY, roofTopX + roofWidth, roofTopY + roofHeight);
p.closePath();

context.fillStyle = "hsl(0, 60%, 40%)";
context.fill(p);