let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "5946fHpqGROiqCsD1zS4xI8", "LevelProgressItemCtr");
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
var r = e("PageMgr.js"),
l = e("EventMgr.js"),
s = e("GameEventType.js"),
c = e("ConfigDataSys.js"),
u = e(PlayerDataSys "
  }].js),
      p = e(" UiManage.js "),
      d = cc._decorator,
      _ = d.ccclass,
      f = d.menu,
      h = d.property,
      g = (cc._decorator, function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.root = null;
          t.progress_bar = null;
          t.progress_key = null;
          t.progress_label = null;
          t.level_progress_bubble = null;
          t.lp_box_count_label = null;
          t.bg_qipao_ar = null;
          t._progressKeyPool = [];
          t._curProgressKeys = [];
          t._maxCount = 100;
          t._progressBarBaseHeight = null;
          t._progressKeyPrefab = null;
          t._curData = null;
          return t;
        }
        t.prototype.clearKeys = function () {
          var e = this;
          this.progress_bar.children.forEach(function (t) {
            t.active = !1;
            e._progressKeyPool.indexOf(t) < 0 && e._progressKeyPool.push(t);
          });
        };
        t.prototype.resetData = function () {
          var e = this;
          this.root.active = !0;
          this.clearKeys();
          var t = c.default.stage_configMap.get(u.default.user_level).progressbar.split(" _ ");
          this._maxCount = Number(t[0]);
          var o = t[1].split(", ");
          this._curData = [];
          o.forEach(function (t) {
            var o = Number(t);
            !isNaN(o) && o && e._curData.push(o);
          });
          this._curData.sort(function (e, t) {
            return e > t ? 1 : -1;
          });
          this.initProgressKey(this._curData);
          this.updateStageProgress();
        };
        t.prototype.onEnable = function () {
          l.default.listen(s.default.ON_UPDATE_LEVEL_PROGRESS, this.updateStageProgress, this);
        };
        t.prototype.initProgressKey = function (e) {
          this._curProgressKeys = [];
          for (var t = 0; t < e.length; t++) {
            var o = this.getProgressKey();
            o.active = !0;
            this._curProgressKeys.push(o);
          }
          this._progressKeyPool.forEach(function (e) {
            e.active = !1;
          });
        };
        t.prototype.addButton = function () {
          p.UiManager.addButtonListen(this.bg_qipao_ar, this.onBubbleClicked, this);
        };
        t.prototype.onBubbleClicked = function () {
          var e = 0;
          this._curData.forEach(function (t) {
            u.default.remove_card_count_single >= t && e++;
          });
          var t = u.default.level_gift_record.length;
          if (t < this._curData.length && u.default.remove_card_count_single >= this._curData[t]) {
            l.default.trigger(s.default.SHOW_MAIN_UI_TOUCH_BLOCK, " DiamondBoxRewardPage ");
            var o = this._curProgressKeys[u.default.level_gift_record.length].convertToWorldSpaceAR(cc.Vec2.ZERO);
            r.default.showPage(" DiamondBoxRewardPage ", {
              start_p: o,
              box_count: e - t
            });
          }
        };
        t.prototype.onLoad = function () {
          this._progressBarBaseHeight = this.progress_bar.height;
          this._progressKeyPrefab = this.progress_key;
          this.addButton();
        };
        t.prototype.updateProgressKey = function () {
          var e = this,
            t = u.default.remove_card_count_single;
          this._curProgressKeys.forEach(function (o, n) {
            if (1 == o.active) {
              var i = e._progressBarBaseHeight - e.progress_bar.height,
                a = e._progressBarBaseHeight * (e._curData[n] / e._maxCount) - i;
              a = Math.max(0, a);
              if (t >= e._curData[n]) {
                a = 0;
                o.active = !1;
              }
              o.setPosition(0, a);
            }
          });
        };
        t.prototype.getProgressKey = function () {
          if (this._progressKeyPool.length > 0) return this._progressKeyPool.pop();
          var e = cc.instantiate(this._progressKeyPrefab);
          e.setParent(this.progress_bar);
          return e;
        };
        t.prototype.updateStageProgress = function () {
          if (this.root.active) {
            var e = u.default.remove_card_count_single;
            if (e >= this._maxCount) {
              this.progress_label.string = " 0% ";
              this.progress_bar.height = 0;
            } else {
              var t = e / this._maxCount;
              t = 1 - t;
              this.progress_bar.height = this._progressBarBaseHeight * t;
              t = Math.floor(100 * t);
              this.progress_label.string = t + "% ";
            }
            this.updateProgressKey();
            this.checkReward();
          }
        };
        t.prototype.onDisable = function () {
          l.default.ignore(s.default.ON_UPDATE_LEVEL_PROGRESS, this.updateStageProgress, this);
        };
        t.prototype.checkReward = function () {
          var e = 0;
          this._curData.forEach(function (t) {
            u.default.remove_card_count_single >= t && e++;
          });
          var t = u.default.level_gift_record.length;
          if (t < this._curData.length && u.default.remove_card_count_single >= this._curData[t]) {
            this.level_progress_bubble.active = !0;
            this.lp_box_count_label.getComponent(cc.Label).string = " x " + (e - t);
          } else this.level_progress_bubble.active = !1;
        };
        a([h(cc.Node)], t.prototype, " root ", void 0);
        a([h(cc.Node)], t.prototype, " progress_bar ", void 0);
        a([h(cc.Node)], t.prototype, " progress_key ", void 0);
        a([h(cc.Label)], t.prototype, " progress_label ", void 0);
        a([h(cc.Node)], t.prototype, " level_progress_bubble ", void 0);
        a([h(cc.Label)], t.prototype, " lp_box_count_label ", void 0);
        a([h(cc.Node)], t.prototype, " bg_qipao_ar ", void 0);
        return a([_, f(" UI/ pages/ items/ LevelProgressItemCtr ")], t);
      }(cc.Component));
    o.default = g;
    cc._RF.pop();
