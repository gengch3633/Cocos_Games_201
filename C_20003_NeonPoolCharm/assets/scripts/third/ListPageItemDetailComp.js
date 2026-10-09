let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "65de4cFaxhIeYGZbE9+jweX", "ListPageItemDetailComp");
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
    var r = e("GlobalConfig.js"),
      l = e("BallLogicMgr.js"),
      s = e("util.js"),
      c = cc._decorator,
      u = c.ccclass,
      p = c.property,
      d = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.idx = 0;
          t.ball_Prefab = null;
          t.white_ball_Prefab = null;
          t.publictableInfo = null;
          t.createBalls = null;
          t.callback = null;
          t.isEditing = null;
          return t;
        }
        t.prototype.closeAndDestroy = function () {
          this.node.parent = null;
          this.node.destroy();
        };
        t.prototype.setCallback = function (e) {
          this.callback = e;
        };
        t.prototype.close = function () {
          this.node.parent = null;
        };
        t.prototype.update = function () {};
        t.prototype.clear = function () {};
        t.prototype.show = function (e, t) {
          this.node.parent = e;
          this.setData(t);
          console.log("detail show", e, t);
        };
        t.prototype.setData = function (e) {
          this.publictableInfo = s.clone(e);
          this.createBalls = this.createBalls || [];
          cc.find("label_name", this.node).getComponent(cc.Label).string = e.tableID;
          this.clear();
          for (var t = cc.find("billiardtable", this.node), o = e.tableInfo.balls, n = 0; n < o.length; n++) {
            var i = o[n];
            if (i.ballType == l.BallIDType_White) {
              (a = cc.instantiate(this.white_ball_Prefab)).parent = t;
              a.x = i.x;
              a.y = i.y;
              this.createBalls.push(a);
            } else if (i.ballType == l.BallIDType_Normal) {
              var a;
              (a = cc.instantiate(this.ball_Prefab)).parent = t;
              a.x = i.x;
              a.y = i.y;
              a.getComponent("BallMaterialComp").setMatIdx(i.ballMatIdx);
              this.createBalls.push(a);
            }
          }
          cc.find("label_id", this.node).getComponent(cc.Label).string = this.publictableInfo.sID;
          cc.find("label_name", this.node).getComponent(cc.Label).string = this.publictableInfo.name;
          var r = cc.find("node_left", this.node);
          cc.find("label_totalv", r).getComponent(cc.Label).string = this.publictableInfo.totalNum;
          cc.find("label_winv", r).getComponent(cc.Label).string = this.publictableInfo.winNum;
          cc.find("label_zan", this.node).getComponent(cc.Label).string = this.publictableInfo.zanIDS;
          cc.find("label_prv", r).getComponent(cc.Label).string = Math.floor(100 * this.publictableInfo.pr) + "%";
        };
        t.prototype.onLoad = function () {
          var e = this;
          this.idx = this.idx || 0;
          this.createBalls = this.createBalls || [];
          this.isEditing = this.isEditing || !1;
          this.publictableInfo = this.publictableInfo || null;
          cc.find("button_back", this.node).on("click", function () {
            e.closeAndDestroy();
          });
          cc.find("button_zan", this.node).on("click", function () {
            l.do_zan(e.publictableInfo, function () {
              e.publictableInfo.zanIDS = e.publictableInfo.zanIDS + 1;
              cc.find("label_zan", e.node).getComponent(cc.Label).string = e.publictableInfo.zanIDS;
            });
          });
          cc.find("button_go", this.node).on("click", function () {
            if (e.publictableInfo) {
              l.gotoTable_challenge(e.publictableInfo.tableInfo, e.publictableInfo);
              r.add_challenge_list(e.publictableInfo.sID);
            }
            e.closeAndDestroy();
          });
        };
        a([p], t.prototype, "idx", void 0);
        a([p(cc.Prefab)], t.prototype, "ball_Prefab", void 0);
        a([p(cc.Prefab)], t.prototype, "white_ball_Prefab", void 0);
        return a([u], t);
      }(cc.Component);
    o.default = d;
    cc._RF.pop();
