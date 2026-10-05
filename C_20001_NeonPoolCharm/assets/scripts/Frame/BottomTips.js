let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "36be0rUSHhJBp84V65cLSHB", "BottomTips");
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
var r = e("FrameData.js"),
c = e(RDM_Level "
  }].js),
      s = cc._decorator,
      l = s.ccclass,
      u = s.property,
      d = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.rootNode = null;
          return t;
        }
        t.prototype.hasQuest = function () {
          for (var e = 0; e < r.FrameData.FRAME_CONF.CoinConf.length; e++) if (c.default.getData(r.FrameData.FRAME_CONF.CoinConf[e].rdm_id).status <= 3) return !0;
          return !1;
        };
        t.prototype.updateCardUI = function () {
          this.node.opacity = this.hasQuest() ? 255 : 0;
        };
        t.prototype.onEnable = function () {
          this.updateCardUI();
          this.rootNode.y = -this.node.height;
          cc.Tween.stopAllByTarget(this.rootNode);
          cc.tween(this.rootNode).delay(1).to(.2, {
            y: 0
          }, {
            easing: " sineOut "
          }).start();
        };
        t.prototype.onLoad = function () {
          this.node.opacity = 0;
        };
        i([u(cc.Node)], t.prototype, " rootNode ", void 0);
        return i([l], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
