let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "f8074WCokBL3JyjPmUFSbNz", "RVOMath");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e(Vector2 "
} ].js), a = function() {
function e() {}
e.abs = function(e) {
return this.sqrt(this.absSq(e));
};
e.absSq = function(e) {
return n.default.multiply(e, e);
};
e.normalize = function(e) {
return n.default.division(e, this.abs(e));
};
e.det = function(e, t) {
return e.x * t.y - e.y * t.x;
};
e.distSqPointLineSegment = function(e, t, i) {
var a = n.default.multiply(n.default.subtract(i, e), n.default.subtract(t, e)) / this.absSq(n.default.subtract(t, e));
return a < 0 ? this.absSq(n.default.subtract(i, e)) : a > 1 ? this.absSq(n.default.subtract(i, t)) : this.absSq(n.default.subtract(i, n.default.addition(e, n.default.multiply2(a, n.default.subtract(t, e)))));
};
e.fabs = function(e) {
return Math.abs(e);
};
e.leftOf = function(e, t, i) {
return this.det(n.default.subtract(e, i), n.default.subtract(t, e));
};
e.sqr = function(e) {
return e * e;
};
e.sqrt = function(e) {
return Math.sqrt(e);
};
e.transfromFloat = function(e) {
return Math.floor(10 * e) / 10;
};
e.RVO_EPSILON = 1e-5;
e.RVO_POSITIVEINFINITY = 1e13;
return e;
}();
i.default = a;
cc._RF.pop();
