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

// create a path
var p = new Path2D();
p.moveTo(80, 60)
p.lineTo(200, 60);
p.lineTo(150, 120)
p.closePath();

// draw it
context.strokeStyle = "#f00";
context.stroke(p);

{
    // save the state
    context.save();
    // clip a particular region
    context.clip(p);

    // font and style
    context.font = "50px Courier";
    context.fillStyle = "#000";
    context.fillText("Hello", 100, 100);

    // restore the initial clip
    context.restore();
}