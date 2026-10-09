let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "ce6ffyvr7NC5pQCuIU4ABFB", "BaiQiuPropBtnItemCtr");
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
    var r = e("GameServiceMgr.js"),
      l = e("UiManage.js"),
      s = e("PageMgr.js"),
      c = e("PropDataSys.js"),
      u = e("EventMgr.js"),
      p = e("GameEventType.js"),
      d = e("EngineUtil.js"),
      _ = e("ConfigDataMgr.js"),
      f = cc._decorator,
      h = f.ccclass,
      g = f.menu,
      y = f.property,
      v = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.btn_node = null;
          t.addSpriteNode = null;
          t.numberLabel = null;
          t._curTouchLock = !1;
          return t;
        }
        t.prototype.updateState = function () {
          var e = c.default.getPropCount(_.ETaiQiuPropType.E_BaiQiu);
          this.addSpriteNode.active = e <= 0;
          this.numberLabel.node.active = e > 0;
          this.numberLabel.string = "" + e;
        };
        t.prototype.onLoad = function () {
          l.UiManager.addButtonListen(this.btn_node, this.onClickProp, this);
        };
        t.prototype.onEnable = function () {
          u.default.listen(p.default.ON_PROP_USED_STATE_CHANGED, this.updateState, this);
          u.default.listen(p.default.ON_PROP_COUNT_CHANGED, this.updateState, this);
          this.updateState();
        };
        t.prototype.onDisable = function () {
          u.default.ignore(p.default.ON_PROP_USED_STATE_CHANGED, this.updateState, this);
          u.default.ignore(p.default.ON_PROP_COUNT_CHANGED, this.updateState, this);
        };
        t.prototype.onClickProp = function () {
          var e = this;
          if (!this._curTouchLock) if (c.default.getPropCount(_.ETaiQiuPropType.E_BaiQiu) > 0) {
            if (c.default.isBaiQiuPropInUse) d.default.showManageViewToast("pkey_007");else {
              u.default.trigger(p.default.SHOW_MAIN_UI_TOUCH_BLOCK, "baiqiu_btn_clicked");
              r.default.UseMoveCueBallProp(_.ETaiQiuPropType.E_BaiQiu, function () {
                e.updateState();
                e._curTouchLock = !1;
                u.default.trigger(p.default.HIDE_MAIN_UI_TOUCH_BLOCK, "baiqiu_btn_clicked");
              }, function () {
                e._curTouchLock = !1;
                u.default.trigger(p.default.HIDE_MAIN_UI_TOUCH_BLOCK, "baiqiu_btn_clicked");
              });
            }
          } else {
            setTimeout(function () {
              return e._curTouchLock = !1;
            }, 500);
            s.default.showPage("UsePropPage", {
              prop_type: _.ETaiQiuPropType.E_BaiQiu
            });
          }
        };
        a([y(cc.Node)], t.prototype, "btn_node", void 0);
        a([y(cc.Node)], t.prototype, "addSpriteNode", void 0);
        a([y(cc.Label)], t.prototype, "numberLabel", void 0);
        return a([h, g("UI/pages/items/BaiQiuPropBtnItemCtr")], t);
      }(cc.Component);
    o.default = v;
    cc._RF.pop();
