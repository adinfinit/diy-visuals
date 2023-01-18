const PHI = 1.618033988749894848204586834;
const TAU = 2 * Math.PI;
const PI = Math.PI;

(function (global) {
    let start = 0;
    global.now = function now() {
        return (+new Date()) * 0.001 - start;
    }
    start = now();
})(window || global || {});

function clamp(v, min, max) {
    if (v < min) return min
    if (v > max) return max
    return v;
}

function map(v, min, max, toMin, toMax) {
    const p = (v - min) / (max - min);
    return p * (toMax - toMin) + toMin;
}

function clamp1(v) {
    if (v <= 0) return 0;
    if (v >= 1) return 1;
    return v;
}

function clampUnit(v) {
    if (v <= -1) return -1;
    if (v >= 1) return 1;
    return v;
}

function lerp(a, b, p) {
    return a + (b - a) * p
}

function lerpClamp(a, b, p) {
    return a + (b - a) * clamp1(p);
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function randomRangeSnap(min, max, snap) {
    const range = max - min;
    Math.floor(Math.random() * range / snap);
    return range * snap + min;
}

function hsl(h, s, l) {
    h = h | 0;
    s = s | 0;
    l = l | 0;
    return "hsl(" + h + "," + s + "%, " + l + "%)";
}

function hsla(h, s, l, a) {
    h = h | 0;
    s = s | 0;
    l = l | 0;
    a = clamp(a, 0, 1);
    return "hsla(" + h + "," + s + "%, " + l + "%, " + a + ")";
}

function rgb(r, g, b) {
    r = r | 0;
    g = g | 0;
    b = b | 0;
    return "rgb(" + r + "," + g + ", " + b + ")";
}

function rgba(r, g, b, a) {
    r = r | 0;
    g = g | 0;
    b = b | 0;
    a = clamp(a, 0, 1);
    return "rgba(" + r + "," + g + ", " + b + ", " + a + ")";
}