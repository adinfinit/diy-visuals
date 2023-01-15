"use strict";

const canvas = document.getElementById('view'),
    /** @type {CanvasRenderingContext2D} */
    context = canvas.getContext("2d");

const TAU = Math.PI * 2;

let Time = 0.0;

function Vector(x, y, z) {
    this.X = +x;
    this.Y = +y;
    this.Z = +z;
}

Vector.prototype = {
    Set: function (b) {
        const a = this;
        a.X = b.X;
        a.Y = b.Y;
        a.Z = b.Z;
    },
    Add: function (b) {
        const a = this;
        a.X += b.X;
        a.Y += b.Y;
        a.Z += b.Z;
    },
    AddScaled: function (b, s) {
        const a = this;
        a.X += b.X * s;
        a.Y += b.Y * s;
        a.Z += b.Z * s;
    }
}

const Size = new Vector(0, 0);

window.onresize = function (e) {
    Size.X = window.innerWidth;
    Size.Y = window.innerHeight - 100;

    canvas.width = Size.X;
    canvas.height = Size.Y;
};
window.onresize();

const Min = Math.min;
const Max = Math.max;
const Abs = Math.abs;

function Random(size) {
    return Math.random() * size;
}

function RandomRange(a, b) {
    return Math.random() * (b - a) + a;
}

function RandomVector(low, high) {
    return new Vector(
        RandomRange(low, high),
        RandomRange(low, high),
        RandomRange(low, high)
    );
}

function Text(text, height, x, y, color) {
    context.fillStyle = color || "#fff";
    context.font = "Bold " + height + "px Tahoma";
    const width = context.measureText(text).width;
    context.fillText(text, x - width / 2, y + height / 2);
}

function Project(into, v) {
    into.X = v.X; // / (1.0 + v.Z * 0.1);
    into.Y = v.Y; // / (1.0 + v.Z * 0.1);
    into.Z = v.Z;
}

function Snake() {
    const snake = this;
    snake.Head = 0;
    snake.Velocity = new Vector(0, 0, 0);
    snake.Multiplier = RandomVector(-10, 10);

    snake.Hue = RandomRange(0, 360);

    snake.Spine = new Array(100);
    for (var i = 0; i < snake.Spine.length; i++) {
        snake.Spine[i] = new Vector(Size.X / 2, Size.Y / 2, 0);
    }

    snake.Drift = new Array(snake.Spine.length);
    for (var i = 0; i < snake.Spine.length; i++) {
        snake.Drift[i] = RandomVector(-10, 10);
    }
}

Snake.prototype = {
    tick: function (dt) {
        const snake = this;

        const last = snake.Spine[snake.Head];
        snake.Head = (snake.Head - 1 + snake.Spine.length) % snake.Spine.length;

        const head = snake.Spine[snake.Head];
        head.Set(last);
        head.AddScaled(snake.Velocity, dt);

        snake.Velocity.X = Math.cos(Time * snake.Multiplier.X) * 1000;
        snake.Velocity.Y = Math.cos(Time * snake.Multiplier.Y) * 1000;
        snake.Velocity.Z = Math.cos(Time * snake.Multiplier.Z) * 1000;

        for (var i = 0; i < snake.Spine.length; i++) {
            snake.Spine[i].Add(RandomVector(-100 * dt, 100 * dt))
        }

        for (var i = 0; i < snake.Spine.length; i++) {
            snake.Spine[i].AddScaled(snake.Drift[i], dt);
        }
    },
    Tick: function (dt) {
        this.tick(dt / 2);
        this.tick(dt / 2);
    },

    Render: function (context) {
        const snake = this;

        context.save();

        context.lineWidth = 20;
        context.strokeStyle = "hsla(" + (snake.Hue | 0) + ", 80%, 60%, 0.7)";

        const head = snake.Spine[snake.Head];

        const p = new Vector();
        const pp = new Vector();
        for (let i = snake.Head; i < snake.Head + snake.Spine.length; i += 2) {
            const seg1 = snake.Spine[i % snake.Spine.length];
            const seg2 = snake.Spine[(i + 1) % snake.Spine.length];

            Project(pp, seg1);
            Project(p, seg2);

            context.lineWidth = 2 + Math.tanh(p.Z / 100) * 50;
            context.beginPath();
            context.moveTo(pp.X, pp.Y);
            context.lineTo(p.X, p.Y);
            context.stroke();
        }

        context.restore();
    }
}

const snakes = [
    new Snake(),
    new Snake(),
    new Snake(),
    //new Snake(),
    //new Snake(),
    //new Snake(),
    //new Snake(),
    //new Snake(),
    //new Snake(),
    //new Snake(),
    //new Snake(),
    //new Snake(),
    //new Snake(),
    //new Snake()
];

function Tick(dt) {
    Time += dt;

    const gradient = context.createRadialGradient(
        Size.X / 2, Size.Y / 2,
        Math.min(Size.X / 2, Size.Y / 2) / 3,

        Size.X / 2, Size.Y / 2,
        Math.max(Size.X / 2, Size.Y / 2)
    );
    gradient.addColorStop(0, "hsla(90,80%,10%,0.1)");
    gradient.addColorStop(1, "hsla(90,30%,10%,0.5)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, Size.X, Size.Y);

    context.globalCompositeOperation = "lighten";

    for (let i = 0; i < snakes.length; i++) {
        const snake = snakes[i];
        snake.Tick(dt);
        snake.Render(context);
    }

    context.globalCompositeOperation = "source-over";

    Text("LD37", 80, Size.X / 2, Size.Y / 2);

    context.fillStyle = gradient;
    context.fillRect(0, 0, Size.X, Size.Y);
}

setInterval(function () {
    Tick(0.033);
}, 33);