let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "4192bi9qQVI0L1pTRT1qqdF", "GameTip");
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
var r = e("GuideManager.js"),
l = e("EventMgr.js"),
s = e("GameEventType.js"),
c = e(CocosHelper "
  }].js),
      u = cc._decorator.ccclass;
    cc._decorator.property;
    var p = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t.time = 0;
        t.showTime = 8;
        t.isPlay = null;
        return t;
      }
      t.prototype.onDisable = function () {
        l.default.ignore(s.default.HIDE_GAMETIP, this.hideTIp, this);
      };
      t.prototype.onLoad = function () {
        this.node.opacity = 0;
      };
      t.prototype.ani = function () {
        if (!this.isPlay) {
          this.isPlay = !0;
          c.default.runRepeatTweenSync(this.node, -1, cc.tween(this.node).to(2, {
            opacity: 255
          }).to(2, {
            opacity: 100
          }));
        }
      };
      t.prototype.hideTIp = function () {
        this.time = 0;
        this.stop();
      };
      t.prototype.stop = function () {
        if (this.isPlay) {
          cc.Tween.stopAllByTarget(this.node);
          this.node.opacity = 0;
          this.isPlay = !1;
        }
      };
      t.prototype.update = function (e) {
        if (!(r.default.Instance.stepId < 201)) {
          this.time += e;
          if (this.time >= this.showTime) {
            this.ani();
            this.showTime = 5;
          }
        }
      };
      t.prototype.onEnable = function () {
        l.default.listen(s.default.HIDE_GAMETIP, this.hideTIp, this);
      };
      return a([u], t);
    }(cc.Component);
    o.default = p;
    cc._RF.pop();
