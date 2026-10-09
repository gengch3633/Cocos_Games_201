let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "d0336tBxb9C6bJyXhY7Pvzw", "game_shop");
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
      l = e("GlobalConfig.js"),
      s = cc._decorator,
      c = s.ccclass,
      u = s.property,
      p = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.node_page_item_Prefab = null;
          t.pageItems = null;
          t.pageType = null;
          t.pageIdx = null;
          return t;
        }
        t.prototype.initPageItems = function () {
          this.pageItems = [];
          for (var e = cc.find("node_page", this.node), t = 0; t < 6; t++) {
            var o = cc.instantiate(this.node_page_item_Prefab);
            o.getComponent("ShopListItemComp").idx = t;
            o.getComponent("ShopListItemComp").setShop(this);
            o.parent = e;
            o.x = t % 2 == 0 ? -150 : 150;
            var n = Math.floor(t / 2);
            o.y = -176 - 310 * n;
            this.pageItems.push(o);
          }
        };
        t.prototype.showTip = function (e) {
          cc.find("node_floatTip", this.node).getComponent("FloatTipComp").show(e);
        };
        t.prototype.hideAllItems = function () {
          for (var e = 0; e < 6; e++) {
            this.pageItems[e].opacity = 0;
            this.pageItems[e].getComponent("ShopListItemComp").random_move(!1);
          }
        };
        t.prototype.onLoad = function () {
          var e = this;
          e.shopConfig = r.shop_config();
          this.pageItems = [];
          this.pageType = 0;
          console.log("self.pageType = PageType.Ball", this.pageType, 0);
          l.debug_alpha && (this.node.opacity = 25);
          this.initPageItems();
          this.hideAllItems();
          cc.find("button_prev", this.node).on("click", function () {
            e.updatePageItems(e.pageIdx - 1);
          });
          cc.find("button_next", this.node).on("click", function () {
            e.updatePageItems(e.pageIdx + 1);
          });
          cc.find("button_back", this.node).on("click", function () {
            r.gotoHall();
          });
          var t = cc.find("toggleContainer", this.node);
          t.getChildByName("toggle1").on("toggle", function () {
            e.pageType = 0;
            e.pageIdx = 0;
            e.updatePageItems();
          });
          t.getChildByName("toggle2").on("toggle", function () {
            e.pageType = 1;
            e.pageIdx = 0;
            e.updatePageItems();
          });
          t.getChildByName("toggle3").on("toggle", function () {
            e.pageType = 2;
            e.pageIdx = 0;
            e.updatePageItems();
          });
          this.pageType = 0;
          this.pageIdx = 0;
          this.updatePageItems();
        };
        t.prototype.callback = function () {};
        t.prototype.updateCoin = function () {
          cc.find("node_coin", this.node).getComponent("CoinComp").updateV();
        };
        t.prototype.destroyAllItems = function () {
          for (var e = 0; e < 6; e++) this.pageItems[e].destroy();
        };
        t.prototype.onDestroy = function () {
          this.destroyAllItems();
        };
        t.prototype.update = function () {};
        t.prototype.updatePageItems = function (e) {
          if ((e = e || 0) < 0) e = 0;else {
            var t = 6;
            console.log("updatePageItems", this.pageType, 0 == this.pageType);
            if (0 == this.pageType) {
              if ((e + 0) * (t = 6) < (i = (n = this.shopConfig.balls_more).length)) {
                this.hideAllItems();
                for (var o = 0; o < t; o++) if ((a = e * t + o) < i) {
                  this.pageItems[o].getComponent("ShopListItemComp").setAsEditing(!1);
                  this.pageItems[o].opacity = 255;
                  this.pageItems[o].getComponent("ShopListItemComp").random_move(!1);
                  this.pageItems[o].getComponent("ShopListItemComp").setupConfig(0, n[a]);
                }
                this.pageIdx = e;
              }
            } else if (1 == this.pageType) {
              if ((e + 0) * (t = 6) < (i = (n = this.shopConfig.ball_colors).length)) {
                this.hideAllItems();
                for (o = 0; o < t; o++) if ((a = e * t + o) < i) {
                  this.pageItems[o].getComponent("ShopListItemComp").setAsEditing(!1);
                  this.pageItems[o].opacity = 255;
                  this.pageItems[o].getComponent("ShopListItemComp").random_move(!0);
                  this.pageItems[o].getComponent("ShopListItemComp").setupConfig(1, n[a]);
                }
                this.pageIdx = e;
              }
            } else if (2 == this.pageType) {
              var n, i;
              if ((e + 0) * (t = 6) < (i = (n = this.shopConfig.ball_particles).length)) {
                this.hideAllItems();
                for (o = 0; o < t; o++) {
                  var a;
                  if ((a = e * t + o) < i) {
                    this.pageItems[o].getComponent("ShopListItemComp").setAsEditing(!1);
                    this.pageItems[o].opacity = 255;
                    this.pageItems[o].getComponent("ShopListItemComp").random_move(!0);
                    this.pageItems[o].getComponent("ShopListItemComp").setupConfig(2, n[a]);
                  }
                }
                this.pageIdx = e;
              }
            }
          }
        };
        a([u(cc.Prefab)], t.prototype, "node_page_item_Prefab", void 0);
        return a([c], t);
      }(cc.Component);
    o.default = p;
    cc._RF.pop();
