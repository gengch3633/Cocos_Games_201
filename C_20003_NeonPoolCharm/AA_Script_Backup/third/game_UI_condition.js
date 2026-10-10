let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "42761CMuVtBjKEcI9NaVspT", "game_UI_condition");
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
    var r = e("BallLogicMgr.js"),
      l = cc._decorator,
      s = l.ccclass,
      c = l.property,
      u = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.ball_model_Prefab = null;
          t.ballMatIdxs = null;
          t.callback = null;
          t.ball_model_arr = null;
          t.ganNum = null;
          return t;
        }
        t.prototype.onLoad = function () {
          var e = this;
          this.callback = this.callback || null;
          this.ballMatIdxs = this.ballMatIdxs || [];
          cc.find("node_balls", this.node);
          this.loadBalls();
          cc.find("button_close", this.node).on("click", function () {
            e.node.parent = null;
          });
          cc.find("button_save", this.node).on("click", function () {
            var t = e.doSave();
            if (t) {
              e.callback && e.callback(t);
              e.node.parent = null;
            }
          });
          var t = cc.find("node1", this.node).getChildByName("label_ganNum");
          this.ganNum = 1;
          t.getComponent(cc.Label).string = e.ganNum;
          cc.find("node1", this.node).getChildByName("button_sub").on("click", function () {
            e.ganNum = e.ganNum - 1;
            e.ganNum = e.ganNum < 1 ? 1 : e.ganNum;
            t.getComponent(cc.Label).string = e.ganNum;
          });
          cc.find("node1", this.node).getChildByName("button_add").on("click", function () {
            e.ganNum = e.ganNum + 1;
            e.ganNum = e.ganNum >= 5 ? 5 : e.ganNum;
            t.getComponent(cc.Label).string = e.ganNum;
          });
        };
        t.prototype.setCallback = function (e) {
          this.callback = e;
        };
        t.prototype.setMatIdxs = function (e) {
          console.log("setMatIdxs", e);
          this.ballMatIdxs = e;
          this.loadBalls();
        };
        t.prototype.doSave = function () {
          if (!(this.ganNum < 1)) {
            for (var e = [], t = 0; t < this.ballMatIdxs.length; t++) {
              var o = this.ball_model_arr[t];
              if (o.getComponent("BallConditionSelComp").getIsSel()) {
                var n = o.getComponent("BallMaterialComp").getMatIdx(),
                  i = r.pack_BallMI(n);
                e.push(i);
              }
            }
            if (0 == e.length) {
              console.log("没有选择目标球");
              return null;
            }
            return r.pack_condition(this.ganNum, e);
          }
        };
        t.prototype.start = function () {};
        t.prototype.loadBalls = function () {
          var e = cc.find("node_balls", this.node);
          e.removeAllChildren();
          this.ball_model_arr = [];
          for (var t = 0; t < this.ballMatIdxs.length; t++) {
            var o = cc.instantiate(this.ball_model_Prefab);
            o.parent = e;
            o.x = 80 * t;
            if (t >= 4) {
              o.y = -80;
              o.x = 80 * (t - 4) - 200;
            }
            o.scale = 1.5;
            o.getComponent("BallMaterialComp").setMatIdx(this.ballMatIdxs[t]);
            o.getComponent("BallConditionSelComp").open();
            o.getComponent("BallConditionSelComp").idx = t;
            this.ball_model_arr.push(o);
          }
        };
        a([c(cc.Prefab)], t.prototype, "ball_model_Prefab", void 0);
        return a([s], t);
      }(cc.Component);
    o.default = u;
    cc._RF.pop();
