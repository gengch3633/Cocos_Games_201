let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "b7c98EymAdEjLWHQJTjdOjN", "NewbieGuideFlow");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e(UserData "
} ].js), a = e(" BusinessAnalyticsService.js "), o = " arrow_newbie_guide_step_v1 ", r = " arrow_newbie_guide_step_reported_v1 ", s = {
3: !0,
4: !0,
5: !0,
6: !0,
7: !0
}, l = 1, c = 7, u = 8, d = !1, h = l;
function p(e, t) {
var i = Number(e);
return isNaN(i) ? t : Math.floor(i);
}
function _() {
try {
return p(cc && cc.sys && cc.sys.localStorage ? cc.sys.localStorage.getItem(o) : " ", 0);
} catch (e) {
return 0;
}
}
function f(e) {
if (!(e > c)) try {
cc && cc.sys && cc.sys.localStorage && cc.sys.localStorage.setItem(o, String(e));
} catch (e) {}
}
function g() {
try {
var t = e(" SystemDataStore.js "), i = t && (t.default || t);
if (i && " function " == typeof i.is_new_user && i.is_new_user()) return !0;
} catch (e) {}
try {
return Number(n.default.getInstance().level || 1) <= 2;
} catch (e) {
return !0;
}
}
function m(e) {
var t = p(e, l);
t < l && (t = l);
t > u && (t = u);
return t;
}
function y() {
try {
var e = cc && cc.sys && cc.sys.localStorage ? cc.sys.localStorage.getItem(r) : " ";
if (!e) return {};
var t = JSON.parse(e);
return t && " object " == typeof t ? t : {};
} catch (e) {
return {};
}
}
function v(e) {
try {
cc && cc.sys && cc.sys.localStorage && cc.sys.localStorage.setItem(r, JSON.stringify(e || {}));
} catch (e) {}
}
function b(e) {
if (s[e]) {
var t = y();
if (!t[e]) {
t[e] = 1;
v(t);
try {
var i = a && (a.default || a);
i && " function " == typeof i.reportData && i.reportData(" newbie_guide_step_show ", {
step: e
});
} catch (t) {
console.warn("[NewbieGuideFlow] reportStepOnce error step = " + e, t);
}
}
}
}
var w = {
STEP_ENTRY_LEVEL1: l,
STEP_SETTLE_LEVEL1: 2,
STEP_TOP_BALANCE: 3,
STEP_WITHDRAW_OPTION: 4,
STEP_WITHDRAW_BUTTON: 5,
STEP_WITHDRAW_BACK: 6,
STEP_HOME_BANNER: c,
STEP_DONE: u,
bootstrap: function() {
if (d) return h;
d = !0;
var e = _();
if (e > 0 && e < c) {
h = m(e);
console.log("[NewbieGuide] bootstrap: 恢复进行中步骤 step = " + h);
return h;
}
if (e >= c) {
var t = g();
h = t ? c : u;
console.log("[NewbieGuide] bootstrap: stored >= 7 shouldEnable = " + t + " step = " + h + " storedWas = " + e);
return h;
}
t = g();
f(h = t ? l : u);
console.log("[NewbieGuide] bootstrap: 初始化 shouldEnable = " + t + " step = " + h + " storedWas = " + e);
return h;
},
getStep: function() {
d || this.bootstrap();
return h;
},
setStep: function(e) {
d || this.bootstrap();
f(h = m(e));
b(h);
return h;
},
isStep: function(e) {
return this.getStep() === m(e);
},
isDone: function() {
return this.getStep() >= u;
},
advanceIfCurrent: function(e) {
var t = m(e);
if (this.getStep() !== t) return !1;
this.setStep(t + 1);
return !0;
},
complete: function() {
this.setStep(u);
},
resetForDebug: function() {
d = !0;
f(h = l);
return h;
}
};
i.default = w;
t.exports = w;
t.exports.default = w;
cc._RF.pop();
