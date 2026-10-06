let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "17ad2dbUqpKtKIhCXy8OHrI", "PropDataSys");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e("GameConfigurations.js"),
i = e("AudioManager.js"),
a = e("ConfigDataSys.js"),
r = e("PlayerDataSys.js"),
l = e(ConfigDataMgr "
  }].js),
      s = e(" EventMgr.js "),
      c = e(" GameEventType.js "),
      u = e(" EngineUtil.js "),
      p = e(" TimeUtils.js "),
      d = e(" GameServiceMgr.js "),
      _ = function () {
        function e() {
          this._isLinePropStart = null;
          this._isBaiQiuPropInUse = null;
        }
        Object.defineProperty(e.prototype, " isBaiQiuPropInUse ", {
          get: function () {
            return this._isBaiQiuPropInUse;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " linePropTimer ", {
          get: function () {
            return Number(u.default.localStorageGetItem(" prop_line_time ", " 0 "));
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " isLinePropInfinite ", {
          get: function () {
            return r.default.level_pass < n.GameConfigurations.customConfig.maxLevelForFreeAimProp;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " isLinePropUseable ", {
          get: function () {
            return !this.isLinePropInfinite && this.linePropTimer <= p.default.getTimeinSeconds();
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " isLinePropUsed ", {
          get: function () {
            return this.isLinePropInfinite || this.linePropTimer > p.default.getTimeinSeconds();
          },
          enumerable: !1,
          configurable: !0
        });
        e.prototype.usePropBaiQiu = function (e) {
          if (!this._isBaiQiuPropInUse) {
            i.default.getInstance().playMusic(" pool_ui_useitem ");
            this._isBaiQiuPropInUse = !0;
            s.default.trigger(c.default.ON_PROP_USED_STATE_CHANGED, {
              prop_type: l.ETaiQiuPropType.E_BaiQiu,
              state: 1,
              isUsedProp: e
            });
          }
        };
        e.prototype.timeInterval = function () {
          if (this._isLinePropStart && this.linePropTimer <= p.default.getTimeinSeconds()) {
            this._isLinePropStart = !1;
            s.default.trigger(c.default.ON_LINE_PROP_USED_STATE_CHANGED, !1);
          }
        };
        e.prototype.init = function () {
          this._isLinePropStart = this.isLinePropUseable;
          setInterval(this.timeInterval.bind(this), 500);
        };
        e.prototype.propUsedComplete = function (e) {
          switch (e) {
            case l.ETaiQiuPropType.E_BaiQiu:
              this._isBaiQiuPropInUse = !1;
              s.default.trigger(c.default.ON_PROP_USED_STATE_CHANGED, {
                prop_type: l.ETaiQiuPropType.E_BaiQiu,
                state: 0
              });
          }
        };
        e.prototype.usePropLine = function () {
          if (this.linePropTimer > p.default.getTimeinSeconds()) console.error(" PropDataSys.usePropLine: 道具使用中 ");else {
            var e = Number(a.default.ad_configMap.get(d.AD_TYPE.line_prop).type_para),
              t = p.default.getTimeinSeconds() + e;
            u.default.localStorageSetItem(" prop_line_time ", String(t));
            this._isLinePropStart = !0;
            i.default.getInstance().playMusic(" pool_ui_useitem ");
            s.default.trigger(c.default.ON_LINE_PROP_USED_STATE_CHANGED, !0);
          }
        };
        e.prototype.getPropCount = function (e) {
          var t;
          return null !== (t = r.default.prop_info[e]) && void 0 !== t ? t : 0;
        };
        e._getInstance = function () {
          this._instance || (this._instance = new e());
          return this._instance;
        };
        e._instance = null;
        return e;
      }();
    o.default = _._getInstance();
    cc._RF.pop();
