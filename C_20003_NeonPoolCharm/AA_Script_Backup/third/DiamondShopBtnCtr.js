let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "6944eKBlxtCc5wA99NbEt87", "DiamondShopBtnCtr");
    var n,
      i = this && this.__extends || (n = function (e, t) {
        return (n = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        })(e, t);
      }, function (e, t) {
        n(e, t);
        function o() {
          this.constructor = e;
        }
        e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
      }),
      a = this && this.__decorate || function (e, t, o, n) {
        var i,
          a = arguments.length,
          r = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (r = (a < 3 ? i(r) : a > 3 ? i(t, o, r) : i(t, o)) || r);
        return a > 3 && r && Object.defineProperty(t, o, r), r;
      };
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var r = e("EventMgr.js"),
      l = e("GameEventType.js"),
      s = e("PlayerDataSys.js"),
      c = e("GameDataMgr.js"),
      u = cc._decorator,
      p = u.ccclass,
      d = u.menu,
      _ = u.property,
      f = (cc._decorator, function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.diamond_num_label = null;
          t.redPoint = null;
          return t;
        }
        t.prototype.removeEvent = function () {
          r.default.ignore(l.default.UPDATE_USER_DIAMOND, this.updateDiamond, this);
          r.default.ignore(l.default.SETDIAMONDPOINT, this.updateRedPoint, this);
        };
        t.prototype.addEvent = function () {
          r.default.listen(l.default.UPDATE_USER_DIAMOND, this.updateDiamond, this);
          r.default.listen(l.default.SETDIAMONDPOINT, this.updateRedPoint, this);
        };
        t.prototype.onEnable = function () {
          this.addEvent();
          this.updateDiamond();
          this.updateRedPoint();
        };
        t.prototype.onLoad = function () {};
        t.prototype.updateDiamond = function () {
          this.diamond_num_label.string = "" + s.default.getDiamondBalance();
        };
        t.prototype.onDisable = function () {
          this.removeEvent();
        };
        t.prototype.updateRedPoint = function () {
          this.redPoint.active = !c.default.get_free_diamond_flag;
        };
        a([_({
          tooltip: "钻石数量",
          type: cc.Label
        })], t.prototype, "diamond_num_label", void 0);
        a([_({
          tooltip: "红点",
          type: cc.Node
        })], t.prototype, "redPoint", void 0);
        return a([p, d("UI/pages/items/DiamondShopBtnCtr")], t);
      }(cc.Component));
    o.default = f;
    cc._RF.pop();
