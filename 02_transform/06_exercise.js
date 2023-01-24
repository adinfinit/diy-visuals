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
Continue your house drawing exercise.

Here are a few ideas on what to do:

- add a fence by using translate and drawing the same shape multiple times
- change the trees to use the recursive approach
   - create multiple trees with variations
   - remember to keep them slightly animated
   - you can add leaves at end of branches to make it nicer
- make the cat or dog look at the direction of the mouse
- add perspective by translating things based on mouse position 
   - things in the background should move slower
   - than things in the foreground

*/
