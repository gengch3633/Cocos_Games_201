let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "9a0afV8oxpNZaOBn6MCFPaR", "PowerBar2Comp");
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
var r = e("CueDataSys.js"),
l = e("EventMgr.js"),
s = e(GameEventType "
  }].js),
      c = e(" UiManage.js "),
      u = cc._decorator,
      p = u.ccclass,
      d = u.property,
      _ = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.percenterLabel = null;
          t.maskNode = null;
          t.huakuai = null;
          t.cueNode = null;
          t.percent = null;
          t.callback = null;
          t.callback_update = null;
          t._indicatorToCueDiffY = 0;
          return t;
        }
        t.prototype.applyByPower = function (e) {
          this.percenterLabel.string = e + "% ";
        };
        t.prototype.start = function () {
          this.percenterLabel.string = " 0% ";
        };
        t.prototype.hideAllBars = function () {};
        t.prototype.clearLabel = function () {
          this.percenterLabel.string = " 0% ";
          this.maskNode.height = 0;
          this.huakuai.y = -22.5;
          this.cueNode.y = this.huakuai.y - this._indicatorToCueDiffY;
        };
        t.prototype.setCallBack_update = function (e) {
          this.callback_update = e;
        };
        t.prototype.getPercent = function () {
          return this.percent;
        };
        t.prototype.setCallBack = function (e) {
          this.callback = e;
        };
        t.prototype.onLoad = function () {
          var e = this;
          this.callback = this.callback || null;
          this.callback_update = this.callback_update || null;
          this.node.on(cc.Node.EventType.TOUCH_START, function (t) {
            var o;
            if (!t.touch || 0 == t.touch.getID()) {
              l.default.trigger(s.default.HIDE_GAMETIP);
              var n = e.node.convertToNodeSpaceAR(t.touch.getLocation());
              e._updateUI(n.y);
              null === (o = e.callback_update) || void 0 === o || o.call(e, e.getPercent());
            }
          });
          this.node.on(cc.Node.EventType.TOUCH_MOVE, function (t) {
            var o;
            if (!t.touch || 0 == t.touch.getID()) {
              l.default.trigger(s.default.HIDE_GAMETIP);
              var n = e.node.convertToNodeSpaceAR(t.touch.getLocation());
              e._updateUI(n.y);
              null === (o = e.callback_update) || void 0 === o || o.call(e, e.getPercent());
            }
          });
          this.node.on(cc.Node.EventType.TOUCH_END, function (t) {
            var o;
            if (!t.touch || 0 == t.touch.getID()) {
              l.default.trigger(s.default.HIDE_GAMETIP);
              e.hideAllBars();
              null === (o = e.callback) || void 0 === o || o.call(e, e.getPercent());
              e.clearLabel();
            }
          });
          this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (t) {
            var o;
            if (!t.touch || 0 == t.touch.getID()) {
              l.default.trigger(s.default.HIDE_GAMETIP);
              e.hideAllBars();
              null === (o = e.callback) || void 0 === o || o.call(e, e.getPercent());
              e.clearLabel();
            }
          });
          this.hideAllBars();
          this._indicatorToCueDiffY = this.huakuai.y - this.cueNode.y;
          var t = this.cueNode.getChildByName(" 10522_Pool_Cue_v1_SG ");
          c.UiManager.loadSpine(t, " cue_spine ", r.default.getCurCueSourceName(), function () {
            t.isValid && t.getComponent(sp.Skeleton).setAnimation(0, " animation ", !0);
          });
        };
        t.prototype._updateUI = function (e) {
          var t = -Math.max(20 - this.node.height, Math.min(e, -20));
          this.percent = (t - 20) / (this.node.height - 40);
          this.percenterLabel.string = Math.floor(100 * this.percent) + "% ";
          this.maskNode.height = t;
          this.huakuai.y = -t - 2.5;
          this.cueNode.y = this.huakuai.y - this._indicatorToCueDiffY;
        };
        a([d(cc.Label)], t.prototype, " percenterLabel ", void 0);
        a([d(cc.Node)], t.prototype, " maskNode ", void 0);
        a([d(cc.Node)], t.prototype, " huakuai ", void 0);
        a([d(cc.Node)], t.prototype, " cueNode ", void 0);
        return a([p], t);
      }(cc.Component);
    o.default = _;
    cc._RF.pop();
