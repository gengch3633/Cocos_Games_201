let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "e40b6Y8xElFU510A4CgSzWG", "DebugCodePageCtrl");
var n,
i = this&& this.__extends|| (n = function(e, t) {
  return(n = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var o in t) Object.prototype.hasOwnProperty.call(t, o)&& (e[o] = t[o]);
  }
)(e, t);
}
, function(e, t) {
  n(e, t);
  function o() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(o.prototype = t.prototype, new o());
}
),
a = this&& this.__decorate|| function(e, t, o, n) {
  var i,
  a = arguments.length,
  r = a < 3? t: null === n? n = Object.getOwnPropertyDescriptor(t, o): n;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);
  else for(var l = e.length- 1;
  l >= 0;
  l--)(i = e[l])&& (r = (a < 3? i(r): a > 3? i(t, o, r): i(t, o))|| r);
  return a > 3&& r&& Object.defineProperty(t, o, r),
  r;
}
;
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var r = e("GameConfigurations.js"),
l = e("BasePageCtrl.js"),
s = e("PageMgr.js"),
c = cc._decorator,
u = c.ccclass,
p = c.menu,
d = c.property,
_ = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.editBox = null;
    return t;
  }
  t.prototype.onOKButtonClick = function() {
    var e = this.editBox.string,
    t = r.GameConfigurations.debugCode;
    this.hide();
    t.length > 0&& e === t&& s.default.showPage("DebugPage");
  }
;
  t.prefabUrl = "DebugCodePage";
  t.className = "DebugCodePageCtrl";
  a([d(cc.EditBox)], t.prototype, "editBox", void 0);
  return a([u, p("UI/pages/DebugCodePageCtrl")], t);
}
(l.default);
o.default = _;
cc._RF.pop();
