// @ts-nocheck

var n = function() {
function e() {
this._size = 0;
this._keyMap = {};
this._change = 0;
}
Object.defineProperty(e.prototype, "size", {
get: function() {
return this._size;
},
enumerable: !1,
configurable: !0
});
e.prototype.set = function(e, t) {
var i = this;
i._keyMap[e] || i._size++;
i[e] = t;
i._keyMap[e] = !0;
i._change |= 7;
};
e.prototype.delete = function(e) {
var t = this;
if (t._keyMap[e]) {
delete t[e];
delete t._keyMap[e];
t._size--;
t._change |= 7;
}
};
e.prototype.has = function(e) {
return !!this._keyMap[e];
};
e.prototype.get = function(e) {
return this[e];
};
e.prototype.clear = function() {
var e = this;
for (var t in e._keyMap) {
delete e[t];
delete e._keyMap[t];
e._change |= 7;
}
e._keys && (e._keys.length = 0);
e._values && (e._values.length = 0);
e._kvs && (e._kvs.length = 0);
e._size = 0;
};
e.prototype.keys = function() {
var e = this;
e._keys || (e._keys = []);
if (1 & e._change) {
e._change ^= 1;
e._keys.length = 0;
for (var t in e._keyMap) e._keys.push(t);
}
return e._keys;
};
e.prototype.values = function() {
var e = this;
e._values || (e._values = []);
if (2 & e._change) {
e._change ^= 2;
e._values.length = 0;
for (var t in e._keyMap) {
var i = e[t];
e._values.push(i);
}
}
return e._values;
};
e.prototype.kvs = function() {
var e = this;
e._kvs || (e._kvs = []);
if (4 & e._change) {
e._change ^= 4;
e._kvs.length = 0;
for (var t in e._keyMap) {
var i = e[t];
e._kvs.push([ t, i ]);
}
}
return e._kvs;
};
e.prototype.forEach = function(e, t) {
for (var i in this._keyMap) if (!1 === e.call(t, i, this[i])) return;
};
return e;
}();
export const SMap = n;
