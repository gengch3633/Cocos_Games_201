(function(e, t) {
"object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define([ "exports" ], t) : t((e = "undefined" != typeof globalThis ? globalThis : e || self).async = {});
})(this, function(e) {
"use strict";
function t(e, ...t) {
return (...r) => e(...t, ...r);
}
function r(e) {
return function(...t) {
var r = t.pop();
return e.call(this, t, r);
};
}
var n = "function" == typeof queueMicrotask && queueMicrotask, i = "function" == typeof setImmediate && setImmediate, u = "object" == typeof process && "function" == typeof process.nextTick;
function a(e) {
setTimeout(e, 0);
}
function o(e) {
return (t, ...r) => e(() => t(...r));
}
var f = o(n ? queueMicrotask : i ? setImmediate : u ? process.nextTick : a);
function s(e) {
return h(e) ? function(...t) {
const r = t.pop();
return c(e.apply(this, t), r);
} : r(function(t, r) {
var n;
try {
n = e.apply(this, t);
} catch (e) {
return r(e);
}
if (n && "function" == typeof n.then) return c(n, r);
r(null, n);
});
}
function c(e, t) {
return e.then(e => {
l(t, null, e);
}, e => {
l(t, e && (e instanceof Error || e.message) ? e : new Error(e));
});
}
function l(e, t, r) {
try {
e(t, r);
} catch (e) {
f(e => {
throw e;
}, e);
}
}
function h(e) {
return "AsyncFunction" === e[Symbol.toStringTag];
}
function p(e) {
return "AsyncGenerator" === e[Symbol.toStringTag];
}
function y(e) {
return "function" == typeof e[Symbol.asyncIterator];
}
function m(e) {
if ("function" != typeof e) throw new Error("expected a function");
return h(e) ? s(e) : e;
}
function v(e, t) {
t || (t = e.length);
if (!t) throw new Error("arity is undefined");
return function(...r) {
return "function" == typeof r[t - 1] ? e.apply(this, r) : new Promise((n, i) => {
r[t - 1] = (e, ...t) => {
if (e) return i(e);
n(t.length > 1 ? t : t[0]);
};
e.apply(this, r);
});
};
}
function d(e) {
return function(t, ...r) {
return v(function(n) {
var i = this;
return e(t, (e, t) => {
m(e).apply(i, r.concat(t));
}, n);
});
};
}
function g(e, t, r, n) {
t = t || [];
var i = [], u = 0, a = m(r);
return e(t, (e, t, r) => {
var n = u++;
a(e, (e, t) => {
i[n] = t;
r(e);
});
}, e => {
n(e, i);
});
}
function b(e) {
return e && "number" == typeof e.length && e.length >= 0 && e.length % 1 == 0;
}
const S = {};
function k(e) {
function t(...t) {
if (null !== e) {
var r = e;
e = null;
r.apply(this, t);
}
}
Object.assign(t, e);
return t;
}
function w(e) {
return e[Symbol.iterator] && e[Symbol.iterator]();
}
function E(e) {
var t = -1, r = e.length;
return function() {
return ++t < r ? {
value: e[t],
key: t
} : null;
};
}
function L(e) {
var t = -1;
return function() {
var r = e.next();
if (r.done) return null;
t++;
return {
value: r.value,
key: t
};
};
}
function A(e) {
if (b(e)) return E(e);
var t, r, n, i, u = w(e);
return u ? L(u) : (r = (t = e) ? Object.keys(t) : [], n = -1, i = r.length, function e() {
var u = r[++n];
return "__proto__" === u ? e() : n < i ? {
value: t[u],
key: u
} : null;
});
}
function x(e) {
return function(...t) {
if (null === e) throw new Error("Callback was already called.");
var r = e;
e = null;
r.apply(this, t);
};
}
function O(e, t, r, n) {
let i = !1, u = !1, a = !1, o = 0, f = 0;
function s() {
if (!(o >= t || a || i)) {
a = !0;
e.next().then(({value: e, done: t}) => {
if (!u && !i) {
a = !1;
if (t) {
i = !0;
o <= 0 && n(null);
} else {
o++;
r(e, f, c);
f++;
s();
}
}
}).catch(l);
}
}
function c(e, t) {
o -= 1;
if (!u) {
if (e) return l(e);
if (!1 !== e) {
if (t === S || i && o <= 0) {
i = !0;
return n(null);
}
s();
} else {
i = !0;
u = !0;
}
}
}
function l(e) {
if (!u) {
a = !1;
i = !0;
n(e);
}
}
s();
}
var j = e => (t, r, n) => {
n = k(n);
if (e <= 0) throw new RangeError("concurrency limit cannot be less than 1");
if (!t) return n(null);
if (p(t)) return O(t, e, r, n);
if (y(t)) return O(t[Symbol.asyncIterator](), e, r, n);
var i = A(t), u = !1, a = !1, o = 0, f = !1;
function s(e, t) {
if (!a) {
o -= 1;
if (e) {
u = !0;
n(e);
} else if (!1 === e) {
u = !0;
a = !0;
} else {
if (t === S || u && o <= 0) {
u = !0;
return n(null);
}
f || c();
}
}
}
function c() {
f = !0;
for (;o < e && !u; ) {
var t = i();
if (null === t) {
u = !0;
o <= 0 && n(null);
return;
}
o += 1;
r(t.value, t.key, x(s));
}
f = !1;
}
c();
}, I = v(function(e, t, r, n) {
return j(t)(e, m(r), n);
}, 4);
function _(e, t, r) {
r = k(r);
var n = 0, i = 0, {length: u} = e, a = !1;
0 === u && r(null);
function o(e, t) {
!1 === e && (a = !0);
!0 !== a && (e ? r(e) : ++i !== u && t !== S || r(null));
}
for (;n < u; n++) t(e[n], n, x(o));
}
function T(e, t, r) {
return I(e, Infinity, t, r);
}
var B = v(function(e, t, r) {
return (b(e) ? _ : T)(e, m(t), r);
}, 3), M = v(function(e, t, r) {
return g(B, e, t, r);
}, 3), F = d(M), C = v(function(e, t, r) {
return I(e, 1, t, r);
}, 3), q = v(function(e, t, r) {
return g(C, e, t, r);
}, 3), z = d(q);
const P = Symbol("promiseCallback");
function D() {
let e, t;
function r(r, ...n) {
if (r) return t(r);
e(n.length > 1 ? n : n[0]);
}
r[P] = new Promise((r, n) => {
e = r, t = n;
});
return r;
}
function V(e, t, r) {
if ("number" != typeof t) {
r = t;
t = null;
}
r = k(r || D());
var n = Object.keys(e).length;
if (!n) return r(null);
t || (t = n);
var i = {}, u = 0, a = !1, o = !1, f = Object.create(null), s = [], c = [], l = {};
Object.keys(e).forEach(t => {
var r = e[t];
if (Array.isArray(r)) {
var n = r.slice(0, r.length - 1), i = n.length;
if (0 !== i) {
l[t] = i;
n.forEach(u => {
if (!e[u]) throw new Error("async.auto task `" + t + "` has a non-existent dependency `" + u + "` in " + n.join(", "));
y(u, () => {
0 == --i && h(t, r);
});
});
} else {
h(t, r);
c.push(t);
}
} else {
h(t, [ r ]);
c.push(t);
}
});
(function() {
for (var e = 0; c.length; ) {
e++;
g(c.pop()).forEach(e => {
0 == --l[e] && c.push(e);
});
}
if (e !== n) throw new Error("async.auto cannot execute tasks due to a recursive dependency");
})();
p();
function h(e, t) {
s.push(() => d(e, t));
}
function p() {
if (!a) {
if (0 === s.length && 0 === u) return r(null, i);
for (;s.length && u < t; ) s.shift()();
}
}
function y(e, t) {
var r = f[e];
r || (r = f[e] = []);
r.push(t);
}
function v(e) {
(f[e] || []).forEach(e => e());
p();
}
function d(e, t) {
if (!o) {
var n = x((t, ...n) => {
u--;
if (!1 !== t) {
n.length < 2 && ([n] = n);
if (t) {
var s = {};
Object.keys(i).forEach(e => {
s[e] = i[e];
});
s[e] = n;
o = !0;
f = Object.create(null);
if (a) return;
r(t, s);
} else {
i[e] = n;
v(e);
}
} else a = !0;
});
u++;
var s = m(t[t.length - 1]);
t.length > 1 ? s(i, n) : s(n);
}
}
function g(t) {
var r = [];
Object.keys(e).forEach(n => {
const i = e[n];
Array.isArray(i) && i.indexOf(t) >= 0 && r.push(n);
});
return r;
}
return r[P];
}
var R = /^(?:async\s)?(?:function)?\s*(?:\w+\s*)?\(([^)]+)\)(?:\s*{)/, U = /^(?:async\s)?\s*(?:\(\s*)?((?:[^)=\s]\s*)*)(?:\)\s*)?=>/, Q = /,/, N = /(=.+)?(\s*)$/;
function G(e) {
let t = "", r = 0, n = e.indexOf("*/");
for (;r < e.length; ) if ("/" === e[r] && "/" === e[r + 1]) {
let t = e.indexOf("\n", r);
r = -1 === t ? e.length : t;
} else if (-1 !== n && "/" === e[r] && "*" === e[r + 1]) {
let i = e.indexOf("*/", r);
if (-1 !== i) {
r = i + 2;
n = e.indexOf("*/", r);
} else {
t += e[r];
r++;
}
} else {
t += e[r];
r++;
}
return t;
}
function W(e) {
const t = G(e.toString());
let r = t.match(R);
r || (r = t.match(U));
if (!r) throw new Error("could not parse args in autoInject\nSource:\n" + t);
let [, n] = r;
return n.replace(/\s/g, "").split(Q).map(e => e.replace(N, "").trim());
}
function $(e, t) {
var r = {};
Object.keys(e).forEach(t => {
var n, i = e[t], u = h(i), a = !u && 1 === i.length || u && 0 === i.length;
if (Array.isArray(i)) {
n = [ ...i ];
i = n.pop();
r[t] = n.concat(n.length > 0 ? o : i);
} else if (a) r[t] = i; else {
n = W(i);
if (0 === i.length && !u && 0 === n.length) throw new Error("autoInject task functions require explicit parameters.");
u || n.pop();
r[t] = n.concat(o);
}
function o(e, t) {
var r = n.map(t => e[t]);
r.push(t);
m(i)(...r);
}
});
return V(r, t);
}
class H {
constructor() {
this.head = this.tail = null;
this.length = 0;
}
removeLink(e) {
e.prev ? e.prev.next = e.next : this.head = e.next;
e.next ? e.next.prev = e.prev : this.tail = e.prev;
e.prev = e.next = null;
this.length -= 1;
return e;
}
empty() {
for (;this.head; ) this.shift();
return this;
}
insertAfter(e, t) {
t.prev = e;
t.next = e.next;
e.next ? e.next.prev = t : this.tail = t;
e.next = t;
this.length += 1;
}
insertBefore(e, t) {
t.prev = e.prev;
t.next = e;
e.prev ? e.prev.next = t : this.head = t;
e.prev = t;
this.length += 1;
}
unshift(e) {
this.head ? this.insertBefore(this.head, e) : J(this, e);
}
push(e) {
this.tail ? this.insertAfter(this.tail, e) : J(this, e);
}
shift() {
return this.head && this.removeLink(this.head);
}
pop() {
return this.tail && this.removeLink(this.tail);
}
toArray() {
return [ ...this ];
}
* [Symbol.iterator]() {
for (var e = this.head; e; ) {
yield e.data;
e = e.next;
}
}
remove(e) {
for (var t = this.head; t; ) {
var {next: r} = t;
e(t) && this.removeLink(t);
t = r;
}
return this;
}
}
function J(e, t) {
e.length = 1;
e.head = e.tail = t;
}
function K(e, t, r) {
if (null == t) t = 1; else if (0 === t) throw new RangeError("Concurrency must not be zero");
var n = m(e), i = 0, u = [];
const a = {
error: [],
drain: [],
saturated: [],
unsaturated: [],
empty: []
};
function o(e, t) {
a[e].push(t);
}
function s(e, t) {
const r = (...n) => {
c(e, r);
t(...n);
};
a[e].push(r);
}
function c(e, t) {
if (!e) return Object.keys(a).forEach(e => a[e] = []);
if (!t) return a[e] = [];
a[e] = a[e].filter(e => e !== t);
}
function l(e, ...t) {
a[e].forEach(e => e(...t));
}
var h = !1;
function p(e, t, r, n) {
if (null != n && "function" != typeof n) throw new Error("task callback must be a function");
b.started = !0;
var i, u;
function a(e, ...t) {
if (e) return r ? u(e) : i();
if (t.length <= 1) return i(t[0]);
i(t);
}
var o = b._createTaskItem(e, r ? a : n || a);
t ? b._tasks.unshift(o) : b._tasks.push(o);
if (!h) {
h = !0;
f(() => {
h = !1;
b.process();
});
}
if (r || !n) return new Promise((e, t) => {
i = e;
u = t;
});
}
function y(e) {
return function(t, ...r) {
i -= 1;
for (var n = 0, a = e.length; n < a; n++) {
var o = e[n], f = u.indexOf(o);
0 === f ? u.shift() : f > 0 && u.splice(f, 1);
o.callback(t, ...r);
null != t && l("error", t, o.data);
}
i <= b.concurrency - b.buffer && l("unsaturated");
b.idle() && l("drain");
b.process();
};
}
function v(e) {
if (0 === e.length && b.idle()) {
f(() => l("drain"));
return !0;
}
return !1;
}
const d = e => t => {
if (!t) return new Promise((t, r) => {
s(e, (e, n) => {
if (e) return r(e);
t(n);
});
});
c(e);
o(e, t);
};
var g = !1, b = {
_tasks: new H(),
_createTaskItem: (e, t) => ({
data: e,
callback: t
}),
* [Symbol.iterator]() {
yield* b._tasks[Symbol.iterator]();
},
concurrency: t,
payload: r,
buffer: t / 4,
started: !1,
paused: !1,
push(e, t) {
if (Array.isArray(e)) {
if (v(e)) return;
return e.map(e => p(e, !1, !1, t));
}
return p(e, !1, !1, t);
},
pushAsync(e, t) {
if (Array.isArray(e)) {
if (v(e)) return;
return e.map(e => p(e, !1, !0, t));
}
return p(e, !1, !0, t);
},
kill() {
c();
b._tasks.empty();
},
unshift(e, t) {
if (Array.isArray(e)) {
if (v(e)) return;
return e.map(e => p(e, !0, !1, t));
}
return p(e, !0, !1, t);
},
unshiftAsync(e, t) {
if (Array.isArray(e)) {
if (v(e)) return;
return e.map(e => p(e, !0, !0, t));
}
return p(e, !0, !0, t);
},
remove(e) {
b._tasks.remove(e);
},
process() {
if (!g) {
g = !0;
for (;!b.paused && i < b.concurrency && b._tasks.length; ) {
var e = [], t = [], r = b._tasks.length;
b.payload && (r = Math.min(r, b.payload));
for (var a = 0; a < r; a++) {
var o = b._tasks.shift();
e.push(o);
u.push(o);
t.push(o.data);
}
i += 1;
0 === b._tasks.length && l("empty");
i === b.concurrency && l("saturated");
var f = x(y(e));
n(t, f);
}
g = !1;
}
},
length: () => b._tasks.length,
running: () => i,
workersList: () => u,
idle: () => b._tasks.length + i === 0,
pause() {
b.paused = !0;
},
resume() {
if (!1 !== b.paused) {
b.paused = !1;
f(b.process);
}
}
};
Object.defineProperties(b, {
saturated: {
writable: !1,
value: d("saturated")
},
unsaturated: {
writable: !1,
value: d("unsaturated")
},
empty: {
writable: !1,
value: d("empty")
},
drain: {
writable: !1,
value: d("drain")
},
error: {
writable: !1,
value: d("error")
}
});
return b;
}
function X(e, t) {
return K(e, 1, t);
}
function Y(e, t, r) {
return K(e, t, r);
}
var Z = v(function(e, t, r, n) {
n = k(n);
var i = m(r);
return C(e, (e, r, n) => {
i(t, e, (e, r) => {
t = r;
n(e);
});
}, e => n(e, t));
}, 4);
function ee(...e) {
var t = e.map(m);
return function(...e) {
var r = this, n = e[e.length - 1];
"function" == typeof n ? e.pop() : n = D();
Z(t, e, (e, t, n) => {
t.apply(r, e.concat((e, ...t) => {
n(e, t);
}));
}, (e, t) => n(e, ...t));
return n[P];
};
}
function te(...e) {
return ee(...e.reverse());
}
var re = v(function(e, t, r, n) {
return g(j(t), e, r, n);
}, 4), ne = v(function(e, t, r, n) {
var i = m(r);
return re(e, t, (e, t) => {
i(e, (e, ...r) => e ? t(e) : t(e, r));
}, (e, t) => {
for (var r = [], i = 0; i < t.length; i++) t[i] && (r = r.concat(...t[i]));
return n(e, r);
});
}, 4), ie = v(function(e, t, r) {
return ne(e, Infinity, t, r);
}, 3), ue = v(function(e, t, r) {
return ne(e, 1, t, r);
}, 3);
function ae(...e) {
return function(...t) {
return t.pop()(null, ...e);
};
}
function oe(e, t) {
return (r, n, i, u) => {
var a, o = !1;
const f = m(i);
r(n, (r, n, i) => {
f(r, (n, u) => {
if (n || !1 === n) return i(n);
if (e(u) && !a) {
o = !0;
a = t(!0, r);
return i(null, S);
}
i();
});
}, e => {
if (e) return u(e);
u(null, o ? a : t(!1));
});
};
}
var fe = v(function(e, t, r) {
return oe(e => e, (e, t) => t)(B, e, t, r);
}, 3), se = v(function(e, t, r, n) {
return oe(e => e, (e, t) => t)(j(t), e, r, n);
}, 4), ce = v(function(e, t, r) {
return oe(e => e, (e, t) => t)(j(1), e, t, r);
}, 3);
function le(e) {
return (t, ...r) => m(t)(...r, (t, ...r) => {
"object" == typeof console && (t ? console.error && console.error(t) : console[e] && r.forEach(t => console[e](t)));
});
}
var he = le("dir"), pe = v(function(e, t, r) {
r = x(r);
var n, i = m(e), u = m(t);
function a(e, ...t) {
if (e) return r(e);
if (!1 !== e) {
n = t;
u(...t, o);
}
}
function o(e, t) {
if (e) return r(e);
if (!1 !== e) {
if (!t) return r(null, ...n);
i(a);
}
}
return o(null, !0);
}, 3);
function ye(e, t, r) {
const n = m(t);
return pe(e, (...e) => {
const t = e.pop();
n(...e, (e, r) => t(e, !r));
}, r);
}
function me(e) {
return (t, r, n) => e(t, n);
}
var ve = v(function(e, t, r) {
return B(e, me(m(t)), r);
}, 3), de = v(function(e, t, r, n) {
return j(t)(e, me(m(r)), n);
}, 4), ge = v(function(e, t, r) {
return de(e, 1, t, r);
}, 3);
function be(e) {
return h(e) ? e : function(...t) {
var r = t.pop(), n = !0;
t.push((...e) => {
n ? f(() => r(...e)) : r(...e);
});
e.apply(this, t);
n = !1;
};
}
var Se = v(function(e, t, r) {
return oe(e => !e, e => !e)(B, e, t, r);
}, 3), ke = v(function(e, t, r, n) {
return oe(e => !e, e => !e)(j(t), e, r, n);
}, 4), we = v(function(e, t, r) {
return oe(e => !e, e => !e)(C, e, t, r);
}, 3);
function Ee(e, t, r, n) {
var i = new Array(t.length);
e(t, (e, t, n) => {
r(e, (e, r) => {
i[t] = !!r;
n(e);
});
}, e => {
if (e) return n(e);
for (var r = [], u = 0; u < t.length; u++) i[u] && r.push(t[u]);
n(null, r);
});
}
function Le(e, t, r, n) {
var i = [];
e(t, (e, t, n) => {
r(e, (r, u) => {
if (r) return n(r);
u && i.push({
index: t,
value: e
});
n(r);
});
}, e => {
if (e) return n(e);
n(null, i.sort((e, t) => e.index - t.index).map(e => e.value));
});
}
function Ae(e, t, r, n) {
return (b(t) ? Ee : Le)(e, t, m(r), n);
}
var xe = v(function(e, t, r) {
return Ae(B, e, t, r);
}, 3), Oe = v(function(e, t, r, n) {
return Ae(j(t), e, r, n);
}, 4), je = v(function(e, t, r) {
return Ae(C, e, t, r);
}, 3), Ie = v(function(e, t) {
var r = x(t), n = m(be(e));
return function e(t) {
if (t) return r(t);
!1 !== t && n(e);
}();
}, 2), _e = v(function(e, t, r, n) {
var i = m(r);
return re(e, t, (e, t) => {
i(e, (r, n) => r ? t(r) : t(r, {
key: n,
val: e
}));
}, (e, t) => {
for (var r = {}, {hasOwnProperty: i} = Object.prototype, u = 0; u < t.length; u++) if (t[u]) {
var {key: a} = t[u], {val: o} = t[u];
i.call(r, a) ? r[a].push(o) : r[a] = [ o ];
}
return n(e, r);
});
}, 4);
function Te(e, t, r) {
return _e(e, Infinity, t, r);
}
function Be(e, t, r) {
return _e(e, 1, t, r);
}
var Me = le("log"), Fe = v(function(e, t, r, n) {
n = k(n);
var i = {}, u = m(r);
return j(t)(e, (e, t, r) => {
u(e, t, (e, n) => {
if (e) return r(e);
i[t] = n;
r(e);
});
}, e => n(e, i));
}, 4);
function Ce(e, t, r) {
return Fe(e, Infinity, t, r);
}
function qe(e, t, r) {
return Fe(e, 1, t, r);
}
function ze(e, t = (e => e)) {
var n = Object.create(null), i = Object.create(null), u = m(e), a = r((e, r) => {
var a = t(...e);
if (a in n) f(() => r(null, ...n[a])); else if (a in i) i[a].push(r); else {
i[a] = [ r ];
u(...e, (e, ...t) => {
e || (n[a] = t);
var r = i[a];
delete i[a];
for (var u = 0, o = r.length; u < o; u++) r[u](e, ...t);
});
}
});
a.memo = n;
a.unmemoized = e;
return a;
}
var Pe = o(u ? process.nextTick : i ? setImmediate : a), De = v((e, t, r) => {
var n = b(t) ? [] : {};
e(t, (e, t, r) => {
m(e)((e, ...i) => {
i.length < 2 && ([i] = i);
n[t] = i;
r(e);
});
}, e => r(e, n));
}, 3);
function Ve(e, t) {
return De(B, e, t);
}
function Re(e, t, r) {
return De(j(t), e, r);
}
function Ue(e, t) {
var r = m(e);
return K((e, t) => {
r(e[0], t);
}, t, 1);
}
class Qe {
constructor() {
this.heap = [];
this.pushCount = Number.MIN_SAFE_INTEGER;
}
get length() {
return this.heap.length;
}
empty() {
this.heap = [];
return this;
}
percUp(e) {
let t;
for (;e > 0 && Ge(this.heap[e], this.heap[t = Ne(e)]); ) {
let r = this.heap[e];
this.heap[e] = this.heap[t];
this.heap[t] = r;
e = t;
}
}
percDown(e) {
let t;
for (;(t = 1 + (e << 1)) < this.heap.length; ) {
t + 1 < this.heap.length && Ge(this.heap[t + 1], this.heap[t]) && (t += 1);
if (Ge(this.heap[e], this.heap[t])) break;
let r = this.heap[e];
this.heap[e] = this.heap[t];
this.heap[t] = r;
e = t;
}
}
push(e) {
e.pushCount = ++this.pushCount;
this.heap.push(e);
this.percUp(this.heap.length - 1);
}
unshift(e) {
return this.heap.push(e);
}
shift() {
let [e] = this.heap;
this.heap[0] = this.heap[this.heap.length - 1];
this.heap.pop();
this.percDown(0);
return e;
}
toArray() {
return [ ...this ];
}
* [Symbol.iterator]() {
for (let e = 0; e < this.heap.length; e++) yield this.heap[e].data;
}
remove(e) {
let t = 0;
for (let r = 0; r < this.heap.length; r++) if (!e(this.heap[r])) {
this.heap[t] = this.heap[r];
t++;
}
this.heap.splice(t);
for (let e = Ne(this.heap.length - 1); e >= 0; e--) this.percDown(e);
return this;
}
}
function Ne(e) {
return (e + 1 >> 1) - 1;
}
function Ge(e, t) {
return e.priority !== t.priority ? e.priority < t.priority : e.pushCount < t.pushCount;
}
function We(e, t) {
var r = Ue(e, t), {push: n, pushAsync: i} = r;
r._tasks = new Qe();
r._createTaskItem = ({data: e, priority: t}, r) => ({
data: e,
priority: t,
callback: r
});
function u(e, t) {
return Array.isArray(e) ? e.map(e => ({
data: e,
priority: t
})) : {
data: e,
priority: t
};
}
r.push = function(e, t = 0, r) {
return n(u(e, t), r);
};
r.pushAsync = function(e, t = 0, r) {
return i(u(e, t), r);
};
delete r.unshift;
delete r.unshiftAsync;
return r;
}
var $e = v(function(e, t) {
t = k(t);
if (!Array.isArray(e)) return t(new TypeError("First argument to race must be an array of functions"));
if (!e.length) return t();
for (var r = 0, n = e.length; r < n; r++) m(e[r])(t);
}, 2);
function He(e, t, r, n) {
var i = [ ...e ].reverse();
return Z(i, t, r, n);
}
function Je(e) {
var t = m(e);
return r(function(e, r) {
e.push((e, ...t) => {
let n = {};
e && (n.error = e);
if (t.length > 0) {
var i = t;
t.length <= 1 && ([i] = t);
n.value = i;
}
r(null, n);
});
return t.apply(this, e);
});
}
function Ke(e) {
var t;
if (Array.isArray(e)) t = e.map(Je); else {
t = {};
Object.keys(e).forEach(r => {
t[r] = Je.call(this, e[r]);
});
}
return t;
}
function Xe(e, t, r, n) {
const i = m(r);
return Ae(e, t, (e, t) => {
i(e, (e, r) => {
t(e, !r);
});
}, n);
}
var Ye = v(function(e, t, r) {
return Xe(B, e, t, r);
}, 3), Ze = v(function(e, t, r, n) {
return Xe(j(t), e, r, n);
}, 4), et = v(function(e, t, r) {
return Xe(C, e, t, r);
}, 3);
function tt(e) {
return function() {
return e;
};
}
const rt = 5, nt = 0;
function it(e, t, r) {
var n = {
times: rt,
intervalFunc: tt(nt)
};
if (arguments.length < 3 && "function" == typeof e) {
r = t || D();
t = e;
} else {
ut(n, e);
r = r || D();
}
if ("function" != typeof t) throw new Error("Invalid arguments for async.retry");
var i = m(t), u = 1;
(function e() {
i((t, ...i) => {
!1 !== t && (t && u++ < n.times && ("function" != typeof n.errorFilter || n.errorFilter(t)) ? setTimeout(e, n.intervalFunc(u - 1)) : r(t, ...i));
});
})();
return r[P];
}
function ut(e, t) {
if ("object" == typeof t) {
e.times = +t.times || rt;
e.intervalFunc = "function" == typeof t.interval ? t.interval : tt(+t.interval || nt);
e.errorFilter = t.errorFilter;
} else {
if ("number" != typeof t && "string" != typeof t) throw new Error("Invalid arguments for async.retry");
e.times = +t || rt;
}
}
function at(e, t) {
if (!t) {
t = e;
e = null;
}
let n = e && e.arity || t.length;
h(t) && (n += 1);
var i = m(t);
return r((t, r) => {
if (t.length < n - 1 || null == r) {
t.push(r);
r = D();
}
function u(e) {
i(...t, e);
}
e ? it(e, u, r) : it(u, r);
return r[P];
});
}
function ot(e, t) {
return De(C, e, t);
}
var ft = v(function(e, t, r) {
return oe(Boolean, e => e)(B, e, t, r);
}, 3), st = v(function(e, t, r, n) {
return oe(Boolean, e => e)(j(t), e, r, n);
}, 4), ct = v(function(e, t, r) {
return oe(Boolean, e => e)(C, e, t, r);
}, 3), lt = v(function(e, t, r) {
var n = m(t);
return M(e, (e, t) => {
n(e, (r, n) => {
if (r) return t(r);
t(r, {
value: e,
criteria: n
});
});
}, (e, t) => {
if (e) return r(e);
r(null, t.sort(i).map(e => e.value));
});
function i(e, t) {
var r = e.criteria, n = t.criteria;
return r < n ? -1 : r > n ? 1 : 0;
}
}, 3);
function ht(e, t, n) {
var i = m(e);
return r((r, u) => {
var a, o = !1;
r.push((...e) => {
if (!o) {
u(...e);
clearTimeout(a);
}
});
a = setTimeout(function() {
var t = e.name || "anonymous", r = new Error('Callback function "' + t + '" timed out.');
r.code = "ETIMEDOUT";
n && (r.info = n);
o = !0;
u(r);
}, t);
i(...r);
});
}
function pt(e) {
for (var t = Array(e); e--; ) t[e] = e;
return t;
}
function yt(e, t, r, n) {
var i = m(r);
return re(pt(e), t, i, n);
}
function mt(e, t, r) {
return yt(e, Infinity, t, r);
}
function vt(e, t, r) {
return yt(e, 1, t, r);
}
function dt(e, t, r, n) {
if (arguments.length <= 3 && "function" == typeof t) {
n = r;
r = t;
t = Array.isArray(e) ? [] : {};
}
n = k(n || D());
var i = m(r);
B(e, (e, r, n) => {
i(t, e, r, n);
}, e => n(e, t));
return n[P];
}
var gt = v(function(e, t) {
var r, n = null;
return ge(e, (e, t) => {
m(e)((e, ...i) => {
if (!1 === e) return t(e);
i.length < 2 ? [r] = i : r = i;
n = e;
t(e ? null : {});
});
}, () => t(n, r));
});
function bt(e) {
return (...t) => (e.unmemoized || e)(...t);
}
var St = v(function(e, t, r) {
r = x(r);
var n = m(t), i = m(e), u = [];
function a(e, ...t) {
if (e) return r(e);
u = t;
!1 !== e && i(o);
}
function o(e, t) {
if (e) return r(e);
if (!1 !== e) {
if (!t) return r(null, ...u);
n(a);
}
}
return i(o);
}, 3);
function kt(e, t, r) {
const n = m(e);
return St(e => n((t, r) => e(t, !r)), t, r);
}
var wt = v(function(e, t) {
t = k(t);
if (!Array.isArray(e)) return t(new Error("First argument to waterfall must be an array of functions"));
if (!e.length) return t();
var r = 0;
function n(t) {
m(e[r++])(...t, x(i));
}
function i(i, ...u) {
if (!1 !== i) {
if (i || r === e.length) return t(i, ...u);
n(u);
}
}
n([]);
}), Et = {
apply: t,
applyEach: F,
applyEachSeries: z,
asyncify: s,
auto: V,
autoInject: $,
cargo: X,
cargoQueue: Y,
compose: te,
concat: ie,
concatLimit: ne,
concatSeries: ue,
constant: ae,
detect: fe,
detectLimit: se,
detectSeries: ce,
dir: he,
doUntil: ye,
doWhilst: pe,
each: ve,
eachLimit: de,
eachOf: B,
eachOfLimit: I,
eachOfSeries: C,
eachSeries: ge,
ensureAsync: be,
every: Se,
everyLimit: ke,
everySeries: we,
filter: xe,
filterLimit: Oe,
filterSeries: je,
forever: Ie,
groupBy: Te,
groupByLimit: _e,
groupBySeries: Be,
log: Me,
map: M,
mapLimit: re,
mapSeries: q,
mapValues: Ce,
mapValuesLimit: Fe,
mapValuesSeries: qe,
memoize: ze,
nextTick: Pe,
parallel: Ve,
parallelLimit: Re,
priorityQueue: We,
queue: Ue,
race: $e,
reduce: Z,
reduceRight: He,
reflect: Je,
reflectAll: Ke,
reject: Ye,
rejectLimit: Ze,
rejectSeries: et,
retry: it,
retryable: at,
seq: ee,
series: ot,
setImmediate: f,
some: ft,
someLimit: st,
someSeries: ct,
sortBy: lt,
timeout: ht,
times: mt,
timesLimit: yt,
timesSeries: vt,
transform: dt,
tryEach: gt,
unmemoize: bt,
until: kt,
waterfall: wt,
whilst: St,
all: Se,
allLimit: ke,
allSeries: we,
any: ft,
anyLimit: st,
anySeries: ct,
find: fe,
findLimit: se,
findSeries: ce,
flatMap: ie,
flatMapLimit: ne,
flatMapSeries: ue,
forEach: ve,
forEachSeries: ge,
forEachLimit: de,
forEachOf: B,
forEachOfSeries: C,
forEachOfLimit: I,
inject: Z,
foldl: Z,
foldr: He,
select: xe,
selectLimit: Oe,
selectSeries: je,
wrapSync: s,
during: St,
doDuring: pe
};
e.all = Se;
e.allLimit = ke;
e.allSeries = we;
e.any = ft;
e.anyLimit = st;
e.anySeries = ct;
e.apply = t;
e.applyEach = F;
e.applyEachSeries = z;
e.asyncify = s;
e.auto = V;
e.autoInject = $;
e.cargo = X;
e.cargoQueue = Y;
e.compose = te;
e.concat = ie;
e.concatLimit = ne;
e.concatSeries = ue;
e.constant = ae;
e.default = Et;
e.detect = fe;
e.detectLimit = se;
e.detectSeries = ce;
e.dir = he;
e.doDuring = pe;
e.doUntil = ye;
e.doWhilst = pe;
e.during = St;
e.each = ve;
e.eachLimit = de;
e.eachOf = B;
e.eachOfLimit = I;
e.eachOfSeries = C;
e.eachSeries = ge;
e.ensureAsync = be;
e.every = Se;
e.everyLimit = ke;
e.everySeries = we;
e.filter = xe;
e.filterLimit = Oe;
e.filterSeries = je;
e.find = fe;
e.findLimit = se;
e.findSeries = ce;
e.flatMap = ie;
e.flatMapLimit = ne;
e.flatMapSeries = ue;
e.foldl = Z;
e.foldr = He;
e.forEach = ve;
e.forEachLimit = de;
e.forEachOf = B;
e.forEachOfLimit = I;
e.forEachOfSeries = C;
e.forEachSeries = ge;
e.forever = Ie;
e.groupBy = Te;
e.groupByLimit = _e;
e.groupBySeries = Be;
e.inject = Z;
e.log = Me;
e.map = M;
e.mapLimit = re;
e.mapSeries = q;
e.mapValues = Ce;
e.mapValuesLimit = Fe;
e.mapValuesSeries = qe;
e.memoize = ze;
e.nextTick = Pe;
e.parallel = Ve;
e.parallelLimit = Re;
e.priorityQueue = We;
e.queue = Ue;
e.race = $e;
e.reduce = Z;
e.reduceRight = He;
e.reflect = Je;
e.reflectAll = Ke;
e.reject = Ye;
e.rejectLimit = Ze;
e.rejectSeries = et;
e.retry = it;
e.retryable = at;
e.select = xe;
e.selectLimit = Oe;
e.selectSeries = je;
e.seq = ee;
e.series = ot;
e.setImmediate = f;
e.some = ft;
e.someLimit = st;
e.someSeries = ct;
e.sortBy = lt;
e.timeout = ht;
e.times = mt;
e.timesLimit = yt;
e.timesSeries = vt;
e.transform = dt;
e.tryEach = gt;
e.unmemoize = bt;
e.until = kt;
e.waterfall = wt;
e.whilst = St;
e.wrapSync = s;
Object.defineProperty(e, "__esModule", {
value: !0
});
});