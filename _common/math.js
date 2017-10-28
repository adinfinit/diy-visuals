(function(global) {
	var expose = [
		"E", "LN2", "LN10", "LOG2E", "LOG10E", "PI", "SQRT1_2", "SQRT2",
		"abs", "acos", "acosh", "asin", "asinh", "atan", "atan2", "atanh",
		"cbrt", "ceil", "clz32", "cos", "cosh", "exp", "expm1",
		"floor", "fround", "hypot", "imul", "log", "log1p", "log2", "log10",
		"max", "min", "pow", "random", "round", "sign", "sin", "sinh", "sqrt", "tan", "tanh", "trunc"
	];

	for (var i = 0; i < expose.length; i++) {
		var name = expose[i];
		global[name] = Math[name];
	}
})(window || global || {});

var start = 0;

function now() {
	return (+new Date()) * 0.001 - start;
}
start = now();

function clamp(value, min, max) {
	if (value < min) {
		return min
	}
	if (value > max) {
		return max
	}
	return value;
}

function randomRange(min, max) {
	return Math.random() * (max - min) + min;
}

function randomRangeSnap(min, max, snap) {
	var range = max - min;
	Math.floor(Math.random() * range / snap);
	return range * snap + min;
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
	a = clamp(a, 0, 1);
	return "rgb(" + r + "," + g + ", " + b + ")";
}

function rgba(r, g, b, a) {
	r = r | 0;
	g = g | 0;
	b = b | 0;
	a = clamp(a, 0, 1);
	return "rgb(" + r + "," + g + ", " + b + ", " + a + ")";
}