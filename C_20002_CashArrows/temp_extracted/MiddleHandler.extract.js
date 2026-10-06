MiddleHandler: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "94c8d8GcZdBbadtBlRImolx", "MiddleHandler");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = function() {
function e(e, t, i, n) {
void 0 === e && (e = null);
void 0 === t && (t = null);
void 0 === i && (i = null);
void 0 === n && (n = !1);
this.once = !1;
this._id = 0;
this.setTo(e, t, i, n);
}
e.prototype.setTo = function(t, i, n, a) {
void 0 === a && (a = !1);
this._id = e._gid++;
this.caller = t;
this.method = i;
this.args = n;
this.once = a;
return this;
};
e.prototype.run = function() {
if (null == this.method) return null;
if (!this.caller || cc.isValid(this.caller)) {
var e = this._id, t = this.method.apply(this.caller, this.args);
this._id === e && this.once && this.recover();
return t;
}
this.recover();
};
e.prototype.runWith = function(e) {
if (null == this.method) return null;
if (!this.caller || cc.isValid(this.caller)) {
var t = this._id;
if (null == e) var i = this.method.apply(this.caller, this.args); else i = this.args || e.unshift ? this.args ? this.method.apply(this.caller, this.args.concat(e)) : this.method.apply(this.caller, e) : this.method.call(this.caller, e);
this._id === t && this.once && this.recover();
return i;
}
this.recover();
};
e.prototype.clear = function() {
this.caller = null;
this.method = null;
this.args = null;
return this;
};
e.prototype.recover = function() {
if (this._id > 0) {
this._id = 0;
e._pool.push(this.clear());
}
};
e.create = function(t, i, n, a) {
void 0 === n && (n = null);
void 0 === a && (a = !0);
return e._pool.length ? e._pool.pop().setTo(t, i, n, a) : new e(t, i, n, a);
};
return e;
}();
i.default = n;
n._pool = [];
n._gid = 1;
cc._RF.pop();
}