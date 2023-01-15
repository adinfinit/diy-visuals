"use strict";

const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// set canvas size to the correct size
let screen = V(0, 0);

function onresize() {
    screen.x = window.innerWidth;
    screen.y = window.innerHeight;

    canvas.width = screen.x;
    canvas.height = screen.y;
}

window.addEventListener("resize", onresize);
onresize()

let mouse = screen.mul(0.5);
window.addEventListener("mousemove", function (e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
})

const easingFunctions = {
    // no easing, no acceleration
    linear: function (t) {
        return t
    },
    // accelerating from zero velocity
    easeInQuad: function (t) {
        return t * t
    },
    // decelerating to zero velocity
    easeOutQuad: function (t) {
        return t * (2 - t)
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    },
    // accelerating from zero velocity
    easeInCubic: function (t) {
        return t * t * t
    },
    // decelerating to zero velocity
    easeOutCubic: function (t) {
        return (--t) * t * t + 1
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function (t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    },
    // accelerating from zero velocity
    easeInQuart: function (t) {
        return t * t * t * t
    },
    // decelerating to zero velocity
    easeOutQuart: function (t) {
        return 1 - (--t) * t * t * t
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
    },
    // accelerating from zero velocity
    easeInQuint: function (t) {
        return t * t * t * t * t
    },
    // decelerating to zero velocity
    easeOutQuint: function (t) {
        return 1 + (--t) * t * t * t * t
    },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function (t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    },
    // logarithm
    logarithm: function (t) {
        return Math.log(t + 1) / Math.LN2;
    },
    // sin
    sin: function (t) {
        return t + Math.sin(t * TAU) / 2;
    },
    // sqr
    sqr: function (t) {
        return t * t;
    },
    // sqrt
    sqrt: function (t) {
        return Math.sqrt(t);
    },
    // wobble
    wobble: function (t) {
        return 0.0005 * (t - 1) * (t - 1) * t * (44851 - 224256 * t + 224256 * t * t)
    },
    cube: function (t) {
        const s = Math.sin(t * TAU);
        return t + s * s * s / 2;
    },
    cube2: function (t) {
        const s = Math.sin(t * TAU);
        return t + s * s * s * s / 2;
    }
};

class Easer {
    constructor(name, ease, p) {
        this.name = name;
        this.p = p;
        this.index = 0;
        this.time = 0;
        this.ease = ease;
    }

    update(deltaTime) {
        this.time += deltaTime;
    }

    render(context) {
        const y = lerp(50, screen.y - 50, this.p);
        const p0 = V(200, y);
        const p1 = V(screen.x - 200, y);
        const time = this.time % 1;
        const easedTime = this.ease(time);
        const color = hsl(this.index * PHI * 180, 80, 35);

        { // draw line
            context.fillStyle = rgba(0, 0, 0, 0.2);
            context.fillRect(p0.x, p0.y, p1.x - p0.x, 10);
            context.fillStyle = "#000";
            context.fillText(this.name, p0.x, p0.y - 3);

            const p = V.lerp(p0, p1, easedTime);
            context.fillStyle = color;
            context.fillCircle(p.x, p.y + 5, 5);
        }

        { // draw rotate 360
            context.save();
            context.translate(50, y);
            const rotation = lerp(0, TAU, easedTime);
            context.rotate(rotation)
            context.fillSquare(0, 0, 15);
            context.restore();
        }

        { // draw rotate 90
            context.save();
            context.translate(100, y);
            const rotation = lerp(0, TAU / 4, easedTime);
            context.rotate(rotation);
            context.fillSquare(0, 0, 15);
            context.restore();
        }

        { // draw rotate 90 and scale
            context.save();
            context.translate(150, y);
            const rotation = lerp(0, TAU / 2, easedTime);
            context.rotate(rotation);
            const scaling = lerp(1, 1.5, easedTime);
            context.scale(scaling, scaling);
            context.fillSquare(0, 0, 15);
            context.restore();
        }

        { // draw graph
            let r0 = p1.add(V(25, -25));
            if (this.index % 2 == 1) {
                r0 = r0.add(V(75, 0));
            }
            const r1 = r0.add(V(50, 50));
            context.fillStyle = "#eee";
            context.beginPath();
            context.rect(r0.x, r0.y, r1.x - r0.x, r1.y - r0.y);
            context.fill();
            context.strokeStyle = "#888";
            context.stroke();

            context.strokeStyle = color;
            context.beginPath();
            const N = 20;
            for (let i = 0; i <= N; i++) {
                let px = i / N;
                let py = this.ease(px);

                let tx = lerp(r0.x, r1.x, px);
                let ty = lerp(r1.y, r0.y, py);
                if (i == 0)
                    context.moveTo(tx, ty);
                else
                    context.lineTo(tx, ty);
            }
            context.stroke();

            let px = lerp(r0.x, r1.x, time);
            let py = lerp(r1.y, r0.y, easedTime);
            context.beginPath();
            context.moveTo(px, r0.y);
            context.lineTo(px, r1.y);
            context.moveTo(r0.x, py);
            context.lineTo(r1.x, py);
            context.stroke();
        }
    }
}

const easers = [];
for (let name in easingFunctions) {
    let ease = easingFunctions[name];
    easers.push(new Easer(name, ease, 0));
}
for (let i = 0; i < easers.length; i++) {
    easers[i].p = i / easers.length;
    easers[i].index = i;
}

function update(deltaTime) {
    context.clearRect(0, 0, screen.x, screen.y);
    context.save();

    easers.forEach(easer => {
        easer.update(deltaTime);
        easer.render(context);
    })

    context.restore();
}

// setup timing loop
let lastTime = 0;

function tick() {
    requestAnimationFrame(tick);
    const currentTime = now();
    update(currentTime - lastTime);
    lastTime = currentTime;
}

tick();