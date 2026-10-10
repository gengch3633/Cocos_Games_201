let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "870ebLjzJpM34+CWTtwvgst", "UiManage");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    o.UiManager = void 0;
    var n = function () {
      function e() {}
      e.loadSpine = function (e, t, o, n) {
        cc.resources.load(t + "/" + o, sp.SkeletonData, function (t, o) {
          if (t) cc.error(t);else {
            var i = null == e ? void 0 : e.getComponent(sp.Skeleton);
            i && (i.skeletonData = o);
            null == n || n(o);
          }
        });
      };
      e.loaderPrefab = function (e) {
        return new Promise(function (t, o) {
          cc.resources.load("prefabs/" + e, cc.Prefab, function (e, n) {
            if (e) {
              console.error("loaderPrefab==", e);
              o("未找到资源");
            } else t(n);
          });
        });
      };
      e.loadSpriteFrameInDeepPath = function (e, t) {
        return new Promise(function (o, n) {
          cc.resources.load(t, cc.SpriteFrame, function (t, i) {
            if (t) {
              console.error("loadSpriteFrameInDeepPath==", t);
              n("未找到资源");
            } else {
              e && e.getComponent(cc.Sprite) && (e.getComponent(cc.Sprite).spriteFrame = i);
              o(i);
            }
          });
        });
      };
      e.maksPos = function (e, t) {
        if (e) {
          e.getComponent(cc.Label) && e.getComponent(cc.Label)._forceUpdateRenderData && e.getComponent(cc.Label)._forceUpdateRenderData();
          var o = e.getContentSize().width;
          t.x = o / 2 - 3;
        }
      };
      e.loaderView = function (e, t, o, n, i) {
        void 0 === n && (n = 0);
        cc.resources.load("prefabs/" + t, cc.Prefab, function (a, r) {
          if (a) cc.error(a);else {
            var l = cc.instantiate(r);
            e.addChild(l, n);
            l.addComponent(t + "Ctrl");
            o && l.getComponent(t + "Ctrl").initData(o);
            i && i(l);
          }
        });
      };
      e.loaderHead = function (e, t, o) {
        void 0 === o && (o = 100);
        cc.assetManager.loadRemote(e, function (e, n) {
          if (e) console.log("头像加载失败", e);else {
            t.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(n);
            t.scale = o / t.getContentSize().width;
          }
        });
      };
      e.loadSpriteFrame = function (e, t, o, n) {
        cc.resources.load("img/" + t + "/" + o, cc.SpriteFrame, function (t, o) {
          if (t) {
            cc.error(t);
            n && n(!1);
          } else {
            e && e.getComponent(cc.Sprite) && (e.getComponent(cc.Sprite).spriteFrame = o);
            n && n(!0);
          }
        });
      };
      e.addButtonListen = function (e, t, o, n, i, a, r) {
        void 0 === n && (n = null);
        void 0 === i && (i = 300);
        void 0 === a && (a = "click");
        void 0 === r && (r = cc.Button.Transition.SCALE);
        if (e) {
          var l = e.getComponent(cc.Button);
          l || ((l = e.addComponent(cc.Button)).transition = r);
          e.on("click", function () {
            if (t) {
              t.bind(o)(n);
              if (i) {
                l.interactable = !1;
                setTimeout(function () {
                  cc.isValid(l) && (l.interactable = !0);
                }, i);
              }
            }
          }, o);
        }
      };
      e.loaderViewAsync = function (e, t, o, n, i, a) {
        void 0 === i && (i = 0);
        cc.resources.load("prefabs/" + o + "/" + t, cc.Prefab, function (o, r) {
          if (o) cc.error(o);else {
            var l = cc.instantiate(r);
            e.addChild(l, i);
            l.addComponent(t + "Ctrl");
            n && l.getComponent(t + "Ctrl").initData(n);
            a && a(l);
          }
        });
      };
      e.loaderViewDeepPath = function (e, t, o, n, i) {
        void 0 === i && (i = 0);
        return new Promise(function (a, r) {
          cc.resources.load("prefabs/" + o + "/" + t, cc.Prefab, function (o, l) {
            if (o) {
              console.error("loaderViewDeepPath==", o);
              r("未找到资源");
            } else {
              var s = cc.instantiate(l);
              e.addChild(s, i);
              s.addComponent(t + "Ctrl");
              n && s.getComponent(t + "Ctrl").initData(n);
              a(l);
            }
          });
        });
      };
      e.loaderPrefabInDeepPath = function (e) {
        return new Promise(function (t, o) {
          cc.resources.load("" + e, cc.Prefab, function (n, i) {
            if (n) {
              console.error("loaderPrefabInDeepPath==", n, e);
              o("未找到资源");
            } else t(i);
          });
        });
      };
      return e;
    }();
    o.UiManager = n;
    cc._RF.pop();
