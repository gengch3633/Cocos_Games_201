let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "0e227K7I55M+5zmD9lc6Xtk", "ConfigDataMgr");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    o.itemsConfigDDName = o.layerDDName = o.ETaiQiuPropType = o.ECueAttriType = o.PropIconMap = o.EPropID = void 0;
    var n,
      i = e("GameServiceMgr.js");
    o.EPropID = cc.Enum({
      E_CiTie: 1,
      E_XiPai: 2,
      E_CheChu: 3,
      E_FUHUO: 4,
      E_JIA_CAO: 5
    });
    o.PropIconMap = ((n = {})[o.EPropID.E_CiTie] = "prop2", n[o.EPropID.E_CheChu] = "prop3", n[o.EPropID.E_XiPai] = "prop4", n[o.EPropID.E_JIA_CAO] = "prop1", n);
    o.ECueAttriType = cc.Enum({
      E_POWER: 1,
      E_SPIN: 2,
      E_AMIING: 3
    });
    o.ETaiQiuPropType = cc.Enum({
      E_BaiQiu: 1,
      E_Line: 2
    });
    o.layerDDName = "layer_dd";
    o.itemsConfigDDName = "goods_dd";
    var a = function () {
      function e() {
        this._color = null;
        this.scene_configMap = new Map();
        this.level_configMap = new Map();
        this.cue_configMap = new Map();
        this.global_ConfigMap = new Map();
        this.gold_extract_configMap = new Map();
        this.cash_extract_configMap = new Map();
        this.sign_in_configMap = new Map();
        this.chouJiang_configMap = new Map();
        this.club_gold_configMap = new Map();
        this.ad_configMap = new Map();
        this.layerStyleMap = new Map();
        this.stage_configMap = new Map();
        this.stage_layerMap = new Map();
        this.stage_itemConfigMap = new Map();
        this.diamond_ConfigMap = new Map();
        this.diamond_ListConfig = [];
        this.task_ConfigMap = new Map();
        this.task_ConfigMapByType = new Map();
        this.prop_ConfigMap = new Map();
        this.rollingNotice_ConfigMap = new Map();
      }
      Object.defineProperty(e.prototype, "color", {
        get: function () {
          return this._color;
        },
        set: function (e) {
          this._color = e;
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e.prototype, "xiaoqiuADMaxCount", {
        get: function () {
          return Number(this.ad_configMap.get(i.AD_TYPE.remove_billiard_cash).type_para);
        },
        enumerable: !1,
        configurable: !0
      });
      e.prototype.calculateValue = function (e) {
        var t = this.global_ConfigMap.get("nonlinear_progress").split("#"),
          o = Number(t[0].split(",")[0]),
          n = Number(t[0].split(",")[1]),
          i = Number(t[1].split(",")[0]),
          a = Number(t[1].split(",")[1]),
          r = Number(t[2].split(",")[0]),
          l = Number(t[2].split(",")[1]);
        return e >= r ? Math.min(l + 1e-4 * (e - r), .9999) : e >= o && e < i ? n + (a - n) / (i - o) * (e - o) : e >= i && e < r ? a + (l - a) / (r - i) * (e - i) : n / o * e;
      };
      return e;
    }();
    o.default = a;
    cc._RF.pop();
