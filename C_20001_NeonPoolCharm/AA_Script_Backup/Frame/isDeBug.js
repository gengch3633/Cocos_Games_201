let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "2c638FxYotHg5ARjF0oxkkL", "isDeBug");
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
var r = e(FrameSDK "
  }].js),
      c = e(" FrameData.js "),
      s = cc._decorator,
      l = s.ccclass,
      u = (s.property, function (e) {
        n(t, e);
        function t() {
          return null !== e && e.apply(this, arguments) || this;
        }
        t.prototype.onLoad = function () {
          this.node.active = r.FrameSDK.frameData.isDeBug || c.FrameData.isTest;
        };
        return i([l], t);
      }(cc.Component));
    a.default = u;
    cc._RF.pop();
