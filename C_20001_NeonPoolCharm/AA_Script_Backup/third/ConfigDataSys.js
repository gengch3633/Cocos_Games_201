let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "8e22d2vpVpDa5uxh9jjdHek", "ConfigDataSys");
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
);
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var a = e("CueDataSys.js"),
r = e("GameServiceMgr.js"),
l = e("ConfigDataMgr.js"),
s = e(PlayerDataSys "
  }].js),
      c = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.sim_MaxPlayerTimes = null;
          t.sim_playTimesRange = null;
          t.sim_cashRange = null;
          t.sim_rollingTimeRange = null;
          t.diamond_ListConfig = null;
          t.layerDDConfig = null;
          t.goodsDDConfig = null;
          return t;
        }
        Object.defineProperty(t.prototype, " levelqiqiu ", {
          get: function () {
            return 1 == Number(this.global_ConfigMap.get(" levelqiqiu "));
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(t.prototype, " getShowMaxCash ", {
          get: function () {
            return 1e3;
          },
          enumerable: !1,
          configurable: !0
        });
        t.prototype.initPropConfig = function (e) {
          this.initConfig(e.prop_config, this.prop_ConfigMap, " id ", !0);
        };
        t.prototype.parseStageItemConfig = function (e) {
          if (e) {
            var t = [];
            Object.keys(e).forEach(function (o) {
              var n = e[o],
                i = {},
                a = n.ID;
              i.id = a;
              i.item_id = a;
              Object.keys(n).forEach(function (e) {
                i[e] = n[e];
              });
              t.push(i);
            });
            return t;
          }
        };
        t.prototype.getLinePropTime = function () {
          var e = Number(this.ad_configMap.get(r.AD_TYPE.line_prop).type_para);
          return Math.floor(e / 60);
        };
        t.prototype.initGlobalConfig = function (e) {
          var t = this;
          Object.keys(e).forEach(function (o) {
            var n = e[o];
            t.global_ConfigMap.set(o, n.para_value);
          });
        };
        t.prototype.initSimData = function () {
          this.sim_MaxPlayerTimes = Array.from(this.rollingNotice_ConfigMap.keys()).reverse()[0];
          this.sim_playTimesRange = [];
          this.sim_cashRange = [Number(this.global_ConfigMap.get(" tips_cash_a ")), Number(this.global_ConfigMap.get(" tips_cash_b "))];
          this.sim_rollingTimeRange = [];
          var e = this.global_ConfigMap.get(" top_num ").split(", ");
          this.sim_playTimesRange[0] = Number(e[0]);
          this.sim_playTimesRange[1] = Number(e[1]);
          e = this.global_ConfigMap.get(" tips_time ").split(", ");
          this.sim_rollingTimeRange[0] = Number(e[0]);
          this.sim_rollingTimeRange[1] = Number(e[1]);
        };
        t.prototype.parseStageLayerConfig = function (e) {
          if (e) {
            var t = [];
            Object.keys(e).forEach(function (o) {
              var n = e[o],
                i = Number(n.layer_style_id);
              Number.isInteger(i) && i > 0 && t.push(i);
            });
            return t;
          }
        };
        t.prototype.init = function (e) {
          if (e) {
            this.initConfig(e.scene, this.scene_configMap);
            this.initConfig(e.level_main, this.level_configMap);
            this.initConfig(e.club, this.cue_configMap);
            this.initConfig(e.cash_extract, this.cash_extract_configMap);
            this.initConfig(e.gold_extract, this.gold_extract_configMap);
            this.initConfig(e.sign_in, this.sign_in_configMap);
            this.initConfig(e.lucky_draw, this.chouJiang_configMap);
            this.initConfig(e.ad, this.ad_configMap);
            this.initConfig(e.club_gold, this.club_gold_configMap);
            this.initGlobalConfig(e.game_global);
            a.default.initCueDataMgr();
          }
        };
        t.prototype.getFreeChouJiang = function () {
          var e = this.ad_configMap.get(r.AD_TYPE.lucky_draw).type_para.split(" _ ");
          console.log(e);
          return !!(e && e[1] && Number(e[1]));
        };
        t.prototype.getLevelCashNum = function () {
          return this.level_configMap.get(s.default.validConfigLevelID).cash_reward;
        };
        t.prototype.initConfig = function (e, t, o, n) {
          void 0 === n && (n = !1);
          if (e) {
            t.clear();
            Object.keys(e).forEach(function (i) {
              var a = e[i],
                r = {},
                l = o ? a[o] : Number(i);
              n && (l = Number(l));
              r.id = l;
              Object.keys(a).forEach(function (e) {
                r[e] = a[e];
              });
              t.set(l, r);
            });
          }
        };
        t.prototype.getFuhuoHeartAddCount = function () {
          return Number(this.ad_configMap.get(r.AD_TYPE.relive).type_para);
        };
        t.prototype.initTaskConfig = function (e) {
          this.initConfig(e.tasks, this.task_ConfigMap, " pass_task_id ");
          var t = this.task_ConfigMapByType;
          this.task_ConfigMap.forEach(function (e) {
            e.type = Number(e.type);
            var o = e.type,
              n = t.get(o);
            if (!n) {
              n = [];
              t.set(o, n);
            }
            n.push(e);
          });
        };
        t.prototype.getQiQiuLevel = function () {
          return Number(this.ad_configMap.get(r.AD_TYPE.baoxiang).type_para);
        };
        t.prototype.initLayerStyleConfig = function (e) {
          var t = this;
          e && Object.keys(e).forEach(function (o) {
            var n = e[o],
              i = {},
              a = n.ID;
            i.id = a;
            Object.keys(n).forEach(function (e) {
              if (e.startsWith(" box ")) {
                var t = String(n[e]);
                if (t.indexOf(", ") > -1) {
                  var o = t.split(", "),
                    a = {
                      boxTypeID: Number(o[0]),
                      boxLogicX: Number(o[1])
                    };
                  i.boxConfig || (i.boxConfig = []);
                  i.boxConfig.push(a);
                }
              }
            });
            t.layerStyleMap.set(a, i);
          });
        };
        t.prototype.initStripleStageConfig = function (e) {
          var t = this;
          this.initConfig(e.levels, this.stage_configMap, " id ");
          this.stage_configMap.forEach(function (o) {
            var n = o.layer_config_name,
              i = o.item_config_name;
            t.stage_layerMap.has(n) || t.stage_layerMap.set(n, t.parseStageLayerConfig(e[n]));
            i.split(" # ");
            i.split(" # ").forEach(function (o) {
              t.stage_itemConfigMap.has(o) || t.stage_itemConfigMap.set(o, t.parseStageItemConfig(e[o]));
            });
          });
          this.layerDDConfig = this.parseStageLayerConfig(e[l.layerDDName]);
          this.goodsDDConfig = this.parseStageItemConfig(e[l.itemsConfigDDName]);
        };
        t.prototype.getLevelCash = function () {
          var e = this.level_configMap.get(s.default.validConfigLevelID);
          return s.default.getCashWithUnit(e.cash_reward);
        };
        t.prototype.initDiamondConfig = function (e) {
          this.initConfig(e.recharge, this.diamond_ConfigMap, " id ");
          var t = Array.from(this.diamond_ConfigMap.values()).sort(function (e, t) {
            return e.id > t.id ? 1 : -1;
          });
          this.diamond_ListConfig = [];
          for (var o = [], n = 0; n < t.length; n++) {
            var i = t[n];
            if (3 != i.gear_type) if (2 != i.gear_type) {
              o.push(i.id);
              this.diamond_ListConfig.push(o);
              o = [];
            } else o.push(i.id);
            6 == i.id && (this.add_slot_price = i.gear_price);
          }
        };
        t.prototype.getBaiqiuPropCount = function () {
          return this.ad_configMap.get(r.AD_TYPE.baiqiu_prop).type_para;
        };
        t._getInstance = function () {
          t._instance || (t._instance = new t());
          return t._instance;
        };
        t._instance = null;
        return t;
      }(l.default);
    o.default = c._getInstance();
    cc._RF.pop();
