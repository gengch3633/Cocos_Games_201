let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "34525uRLF9Ok6jxeytSPW+W", "MoreGamePageCtrl");
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
    var r = e("UiManage.js"),
      l = e("BasePageCtrl.js"),
      s = e("MoreGamePage.js"),
      c = cc._decorator,
      u = c.ccclass,
      p = c.menu,
      d = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.ui = null;
          return t;
        }
        t.prototype.onUILoad = function () {
          this.ui = this.node.addComponent(s.default);
        };
        t.prototype._updateWebView = function (e) {
          var t,
            o = cc.director.getScene(),
            n = o.getChildByName("_Pool_webview_");
          if (!n) {
            n = new cc.Node("_Pool_webview_");
            o.addChild(n, cc.macro.MAX_ZINDEX);
            n.setParent(o);
          }
          cc.game.isPersistRootNode(n) || cc.game.addPersistRootNode(n);
          n.active = !0;
          var i = this.ui.webViewNode.parent.convertToWorldSpaceAR(this.ui.webViewNode.position),
            a = n.parent.convertToNodeSpaceAR(i);
          n.position = a;
          n.anchorX = this.ui.webViewNode.anchorX;
          n.anchorY = this.ui.webViewNode.anchorY;
          n.width = this.ui.webViewNode.width;
          n.height = this.ui.webViewNode.height;
          var r = null !== (t = n.getComponent(cc.WebView)) && void 0 !== t ? t : n.addComponent(cc.WebView);
          if (null != e && r.url !== e) {
            r.url = "";
            r.url = e;
          }
        };
        t.prototype._onSizeChange = function () {
          this._updateWebView();
        };
        t.prototype.addButtonListen = function () {
          r.UiManager.addButtonListen(this.ui.close, this.hide, this);
        };
        t.prototype.onLoad = function () {
          var t = this;
          this.onUILoad();
          this._animType = l.AnimType.NONE;
          this._touchControl = !1;
          this._hasPeneLock = !0;
          this._hasBlack = !0;
          this._hasTouchLock = !1;
          e.prototype.onLoad.call(this);
          this.addButtonListen();
          this.ui.webViewNode.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
          this.scheduleOnce(function () {
            t.ui.webViewNode.height = t.ui.webViewNode.convertToWorldSpaceAR(cc.v2()).y;
          });
        };
        t.prototype._init = function (e) {
          this._updateWebView(e.url);
        };
        t.prototype.onDisable = function () {
          var t,
            o = cc.director.getScene().getChildByName("_Pool_webview_");
          if (o) {
            o.active = !1;
            (null !== (t = o.getComponent(cc.WebView)) && void 0 !== t ? t : o.addComponent(cc.WebView)).url = "";
          }
          e.prototype.onDisable.call(this);
        };
        t.prefabUrl = "MoreGamePage";
        t.className = "MoreGamePageCtrl";
        return a([u, p("UI/pages/MoreGamePageCtrl")], t);
      }(l.default);
    o.default = d;
    cc._RF.pop();
