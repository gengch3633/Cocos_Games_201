let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "3cd21ZDAYNBPpg0IKlqMxSd", "LinePropBtnItemCtr");
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
var r = e("UiManage.js"),
l = e("PageMgr.js"),
s = e("PropDataSys.js"),
c = e("EventMgr.js"),
u = e("GameEventType.js"),
p = e("TimeUtils.js"),
d = e(ConfigDataMgr "
  }].js),
      _ = cc._decorator,
      f = _.ccclass,
      h = _.menu,
      g = _.property,
      y = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.btn_node = null;
          t.nameLabel = null;
          t.addSpriteNode = null;
          t._scheduleFunc = void 0;
          return t;
        }
        t.prototype.onEnable = function () {
          c.default.listen(u.default.ON_LINE_PROP_USED_STATE_CHANGED, this.updateState, this);
          this.updateState();
        };
        t.prototype.onLoad = function () {
          r.UiManager.addButtonListen(this.btn_node, this.onClickProp, this);
        };
        t.prototype.updateCountdown = function () {
          var e = s.default.linePropTimer - p.default.getTimeinSeconds();
          if (s.default.isLinePropInfinite) {
            this.nameLabel.string = " ∞ ";
            this._stopSchedule();
          } else if (e > 0) this.nameLabel.string = " " + p.default.secondsToHMS(e, !1);else {
            this.nameLabel.string = " pkey_005 ";
            this._stopSchedule();
          }
        };
        t.prototype.onDisable = function () {
          c.default.ignore(u.default.ON_LINE_PROP_USED_STATE_CHANGED, this.updateState, this);
        };
        t.prototype._stopSchedule = function () {
          if (this._scheduleFunc) {
            this.unschedule(this._scheduleFunc);
            this._scheduleFunc = void 0;
          }
        };
        t.prototype.updateState = function () {
          var e = this;
          this._stopSchedule();
          if (s.default.isLinePropUseable) {
            this.addSpriteNode.active = !0;
            this.nameLabel.string = " pkey_005 ";
          } else {
            this.addSpriteNode.active = !1;
            this.updateCountdown();
            this.schedule(this._scheduleFunc = function () {
              return e.updateCountdown();
            });
          }
        };
        t.prototype.onClickProp = function () {
          s.default.isLinePropUseable && l.default.showPage(" UsePropPage ", {
            prop_type: d.ETaiQiuPropType.E_Line
          });
        };
        a([g(cc.Node)], t.prototype, " btn_node ", void 0);
        a([g(cc.Label)], t.prototype, " nameLabel ", void 0);
        a([g(cc.Node)], t.prototype, " addSpriteNode ", void 0);
        return a([f, h(" UI/ pages/ items/ LinePropBtnItemCtr ")], t);
      }(cc.Component);
    o.default = y;
    cc._RF.pop();
