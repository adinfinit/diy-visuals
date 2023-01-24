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
Continue your house drawing exercise by making it animated.

Here are a few ideas on what to animate:

- grass moving
- bushes or tree waving in the wind
- a bird flapping wings in the sky
- clouds moving
- animate a whole day-night cycle by changing colors
  - also you can animate a sun and moon

*/
