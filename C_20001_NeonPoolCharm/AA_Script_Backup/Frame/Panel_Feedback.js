let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "981abRDeaxCXonCgJU66U4G", "Panel_Feedback");
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
var r = e("FrameSDK.js"),
c = cc._decorator,
s = c.ccclass,
l = c.property,
u = function(e) {
  n(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.editbox1 = null;
    t.editbox2 = null;
    return t;
  }
  t.openPage = function(e) {
    r.FrameSDK.openWindow("Panel_Feedback", {
      closeCB: e
    }
);
  }
;
  t.prototype.onButSubmit = function() {
    var e = this;
    if(this.editbox1.string.length > 0&& this.editbox2.string.length > 0) {
      r.FrameSDK.frameData.gameFuc.openLoad();
      this.scheduleOnce(function() {
        r.FrameSDK.frameData.gameFuc.closeLoad();
        r.FrameSDK.showToast("fkey_140");
        e.node.destroy();
      }
, .6+ 2* Math.random());
      var t = new Date(),
      a = t.getFullYear()+ "-"+ String(t.getMonth()+ 1).padStart(2, "0")+ "-"+ String(t.getDate()).padStart(2, "0")+ ":"+ String(t.getHours()).padStart(2, "0")+ ":"+ String(t.getMinutes()).padStart(2, "0");
      r.FrameSDK.logCommonEvent("thepool_feedback", {
        object_action: "question:"+ this.editbox1.string, object_name: "information:"+ this.editbox2.string, object_notes: "time:"+ a
      }
);
    } else this.editbox1.string.length <= 0? r.FrameSDK.showToast("fkey_138"): this.editbox2.string.length <= 0? r.FrameSDK.showToast("fkey_139"): this.node.destroy();
  }
;
  t.prototype.onButClose = function() {
    this.node.destroy();
  }
;
  i([l(cc.EditBox)], t.prototype, "editbox1", void 0);
  i([l(cc.EditBox)], t.prototype, "editbox2", void 0);
  return i([s], t);
}
(cc.Component);
a.default = u;
cc._RF.pop();
