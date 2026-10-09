let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "b7b7afrqg9HmL7zCSQjMhZP", "PageMgr");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = e("EngineUtil.js"),
      i = function () {
        function e() {
          this.map_pages = new Map();
          this.arr_pageQueue = [];
          this.onShowNum = 0;
          this.set_onShowPages = new Set();
          this.pages = null;
          this.persist = null;
          this.effects = null;
          this.toast = null;
          this.message = null;
          this.touchNode = null;
          this.fadeNode = null;
          this.loadingMask = null;
        }
        e.prototype.getPagesParent = function () {
          var e = cc.director.getScene().children[0],
            t = e.getChildByName("pages");
          if (t) return t;
          (t = new cc.Node("pages")).zIndex = 1;
          e.addChild(t);
          return t;
        };
        e.prototype.init = function (e) {
          this.createNodes(e);
        };
        e.prototype.hidePage = function (e) {
          if (e) {
            var t = this.map_pages.get(e);
            if (t) {
              var o = t.node;
              if (o) {
                var n = o.getComponent(e + "Ctrl") || o.getComponent("BasePageCtrl"),
                  i = n._reuse,
                  a = n._inQueue;
                this.set_onShowPages.delete(o);
                if (i) n.hide();else {
                  o.destroy();
                  t.node = null;
                }
                if (a) {
                  this.onShowNum--;
                  this.onShowNum < 0 && (this.onShowNum = 0);
                  var r = this.arr_pageQueue.shift();
                  if (r) {
                    var l = r.name,
                      s = r.data;
                    this.showPage(l, s);
                  }
                }
              } else console.error("class:pageMgr.fun:hidePage没有页面信息node" + e);
            } else console.error("class:pageMgr.fun:hidePage没有页面信息" + e);
          } else console.error("class:pageMgr.fun:hidePage页面名称为空");
        };
        e.prototype.showPage = function (e, t) {
          if (e) {
            var o = this.map_pages.get(e);
            if (o) {
              var n = o.node,
                i = o.prefab,
                a = n;
              n && n.isValid || (a = cc.instantiate(i));
              this.addPage(e, n, a, i, t);
            } else this.loadPage(e, t);
          } else console.error("class:pageMgr.showPage页面名称为空");
        };
        e.prototype.createEffectsNode = function () {
          var e = new cc.Node("effects");
          this.effects = e;
          e.setPosition(cc.v2(0, 0));
          cc.director.getScene().children[0].addChild(e, 99);
        };
        e.prototype.addPage = function (e, t, o, n, i) {
          var a = null;
          (a = o.getComponent(e + "Ctrl") || o.getComponent("BasePageCtrl")) || (a = o.addComponent(e + "Ctrl"));
          if (!a._only || !this.hasShowPage(e)) {
            var r = 0;
            if (a._inQueue) {
              if (this.onShowNum > 0) {
                this.arr_pageQueue.push({
                  name: e,
                  data: i
                });
                return;
              }
              this.onShowNum++;
            } else r = this.getPageIndex();
            t && t.isValid || (t = o);
            var l = t.getComponent(e + "Ctrl") || t.getComponent("BasePageCtrl");
            a._reuse ? t.active = !0 : t = o;
            var s = this.getPagesParent();
            this.getPagesParent().getChildByName(e) || s.addChild(t);
            t.zIndex = r;
            l._init(i);
            this.set_onShowPages.add(t);
            this.map_pages.set(e, {
              node: t,
              prefab: n
            });
          }
        };
        e.prototype.loadPage = function (e, t) {
          var o = this;
          cc.resources.load("pages/" + e, cc.Prefab, function (i, a) {
            i ? n.default.error("class:pageMgr.fun:showPage加载页面错误", e, i) : o.addPage(e, null, cc.instantiate(a), a, t);
          });
        };
        e._getInstance = function () {
          if (this._instance) return this._instance;
          this._instance = new e();
          return this._instance;
        };
        e.prototype.getMessageNode = function () {
          return this.message;
        };
        e.prototype.hasShowPage = function (e) {
          var t = this.map_pages.get(e);
          if (!t) return !1;
          var o = t.node;
          return !!o && !!o.isValid && !!o.active;
        };
        e.prototype.getPageIndex = function () {
          var e = 0;
          this.set_onShowPages.forEach(function (t) {
            var o = t.zIndex;
            o >= e && (e = o + 1);
          });
          return e;
        };
        e.prototype.showLoading = function () {
          this.loadingMask && (this.loadingMask.active = !0);
        };
        e.prototype.hasPage = function (e) {
          return !!this.map_pages.get(e);
        };
        e.prototype.addFullScreenWidget = function (e) {
          var t,
            o = null !== (t = e.getComponent(cc.Widget)) && void 0 !== t ? t : e.addComponent(cc.Widget);
          o.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
          o.isAlignBottom = !0;
          o.isAlignLeft = !0;
          o.isAlignRight = !0;
          o.isAlignTop = !0;
          o.bottom = 0;
          o.left = 0;
          o.right = 0;
          o.top = 0;
          o.updateAlignment();
        };
        e.prototype.setToastNode = function (e) {
          e.parent = this.toast;
        };
        e.prototype.getTouchNode = function () {
          return this.touchNode;
        };
        e.prototype.hideLoading = function () {
          this.loadingMask && (this.loadingMask.active = !1);
        };
        e.prototype.createNodes = function (e) {
          var t = new cc.Node("persist");
          this.addFullScreenWidget(t);
          this.persist = t;
          var o = new cc.Node("effects");
          this.addFullScreenWidget(o);
          this.effects = o;
          var n = new cc.Node("toast");
          this.toast = n;
          var i = new cc.Node("message");
          this.message = i;
          var a = new cc.Node("TouchNode");
          this.touchNode = a;
          var r = new cc.Node("fadeNode");
          this.fadeNode = r;
          this.persist.addChild(o);
          this.persist.addChild(n);
          this.persist.addChild(i);
          this.persist.addChild(a);
          this.persist.addChild(r);
          t.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
          cc.game.addPersistRootNode(t);
          if (this.loadingMask) {
            this.loadingMask.removeFromParent(!0);
            this.loadingMask = null;
          }
          if (e) this.loadingMask = cc.instantiate(e);else {
            this.loadingMask = new cc.Node("loadingMask");
            this.loadingMask.addComponent(cc.BlockInputEvents);
          }
          this.loadingMask.setParent(this.fadeNode);
          this.loadingMask.active = !1;
        };
        e.prototype.clear = function () {
          this.map_pages.forEach(function (e) {
            var t = e.prefab,
              o = e.node;
            cc.assetManager.releaseAsset(t);
            o && cc.isValid(o) && o.destroy();
          });
          this.map_pages.clear();
          this.set_onShowPages.clear();
          this.onShowNum = 0;
          this.arr_pageQueue = [];
          this.pages && this.pages.destroy();
          this.pages = null;
        };
        e.prototype.hideAllPage = function () {
          var e = this;
          this.map_pages.forEach(function (t) {
            t.prefab;
            var o = t.node;
            if (cc.isValid(o)) {
              var n = o.name;
              e.hidePage(n);
            }
          });
        };
        e._instance = null;
        return e;
      }();
    o.default = i._getInstance();
    cc._RF.pop();
