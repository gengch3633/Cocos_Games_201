let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "01185GVtyZJNJxjXAob42yC", "Item_Record");
var o,
n = this&& this.__extends|| (o = function(e, t) {
  return(o = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var a in t) Object.prototype.hasOwnProperty.call(t, a)&& (e[a] = t[a]);
  }
)(e, t);
}
, function(e, t) {
  o(e, t);
  function a() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(a.prototype = t.prototype, new a());
}
),
i = this&& this.__decorate|| function(e, t, a, o) {
  var n,
  i = arguments.length,
  r = i < 3? t: null === o? o = Object.getOwnPropertyDescriptor(t, a): o;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, a, o);
  else for(var c = e.length- 1;
  c >= 0;
  c--)(n = e[c])&& (r = (i < 3? n(r): i > 3? n(t, a, r): n(t, a))|| r);
  return i > 3&& r&& Object.defineProperty(t, a, r),
  r;
}
;
Object.defineProperty(a, "__esModule", {
  value: ! 0
}
);
var r = cc._decorator,
c = r.ccclass,
s = r.property,
l = function(e) {
  n(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.rich = null;
    return t;
  }
  t.prototype.setData = function(e) {
    var t = "<color=#F18321>";
    if("tkey_209" == e.key) {
      t = "<color=#F18321>";
      this.rich.string = e.key+ "??&value1==<color =#4480BE>"+ e.peopleCount+ "</color>";
    } else if("tkey_210" == e.key) {
      t = "<color=#C23E3E>";
      this.rich.string = e.key+ "??&value1==<color =#4480BE>"+ e.account+ "</color>&&value2==<color =#4480BE>"+ e.peopleCount+ "</color>";
    } else if("tkey_211" == e.key) {
      t = "<color=#249A50>";
      this.rich.string = e.key+ "??&value1==<color =#4480BE>"+ e.account+ "</color>&&value2==<color =#4480BE>"+ e.peopleCount+ "</color>";
    }
    var a = this.rich.string.indexOf(":");
- 1 == a&& (a = this.rich.string.indexOf(":"));
    this.rich.string = - 1 != a? t+ this.rich.string.substring(0, a+ 1)+ "</color>"+ this.rich.string.substring(a+ 1, this.rich.string.length): ""+ this.rich.string;
  }
;
  i([s(cc.RichText)], t.prototype, "rich", void 0);
  return i([c], t);
}
(cc.Component);
a.default = l;
cc._RF.pop();
