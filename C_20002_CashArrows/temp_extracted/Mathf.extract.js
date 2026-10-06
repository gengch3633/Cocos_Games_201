Mathf: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "72da5LrQ/xMDaCPixLS3TnL", "Mathf");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.clamp = function(e, t, i) {
return Math.min(Math.max(e, t), i);
};
e.clamp01 = function(t) {
return e.clamp(t, 0, 1);
};
e.lerp = function(t, i, n) {
return t + (i - t) * e.clamp01(n);
};
e.inverseLerp = function(e, t, i) {
return (i - e) / (t - e);
};
e.lerpAngle = function(t, i, n) {
var a = e.repeat(i - t, 360);
a > 180 && (a -= 360);
return t + a * e.clamp01(n);
};
e.repeat = function(e, t) {
return e - Math.floor(e / t) * t;
};
e.pingPong = function(t, i) {
t = e.repeat(t, 2 * i);
return i - Math.abs(t - i);
};
e.deltaAngle = function(t, i) {
t = e.repeat(t, 360);
i = e.repeat(i, 360);
var n = e.abs(i - t);
n > 180 && (n = 360 - n);
return n;
};
e.isPowerOfTwo = function(e) {
return 0 == (e & e - 1) && 0 != e;
};
e.nextPowerOfTwo = function(e) {
return Math.pow(2, Math.ceil(Math.log2(e)));
};
e.approximate = function(t, i) {
return Math.abs(t - i) < e.Epsilon;
};
e.abs = function(e) {
return Math.abs(e);
};
e.acos = function(e) {
return Math.acos(e);
};
e.asin = function(e) {
return Math.asin(e);
};
e.atan = function(e) {
return Math.atan(e);
};
e.atan2 = function(e, t) {
return Math.atan2(e, t);
};
e.ceil = function(e) {
return Math.ceil(e);
};
e.cos = function(e) {
return Math.cos(e);
};
e.exp = function(e) {
return Math.exp(e);
};
e.floor = function(e) {
return Math.floor(e);
};
e.log = function(e) {
return Math.log(e);
};
e.log10 = function(e) {
return Math.log10(e);
};
e.min = function() {
for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
return Math.min.apply(Math, e);
};
e.max = function() {
for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
return Math.max.apply(Math, e);
};
e.pow = function(e, t) {
return Math.pow(e, t);
};
e.random = function() {
return Math.random();
};
e.round = function(e) {
return Math.round(e);
};
e.sin = function(e) {
return Math.sin(e);
};
e.sqrt = function(e) {
return Math.sqrt(e);
};
e.sign = function(e) {
return Math.sign(e);
};
e.tan = function(e) {
return Math.tan(e);
};
e.PI = Math.PI;
e.Infinity = Infinity;
e.Deg2Rad = Math.PI / 180;
e.Rad2Deg = 180 / Math.PI;
e.Epsilon = Number.EPSILON;
return e;
}();
i.default = n;
cc._RF.pop();
}