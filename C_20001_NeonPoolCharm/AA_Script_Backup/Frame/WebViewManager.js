let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "9295a1ojORCg7jEU4jIO/of", "WebViewManager");
Object.defineProperty(a, "__esModule", {
  value: ! 0
}
);
var o,
n = e("FrameSDK.js");
(function(e) {
  e[e.READY = 0] = "READY";
  e[e.LOADING = 1] = "LOADING";
  e[e.LOADED = 2] = "LOADED";
  e[e.ERROR = 3] = "ERROR";
}
)(o|| (o = {
}
));
var i = function() {
  function e() {
  }
  e._onAppShow = function() {
    var e,
    t;
    if(this._state === o.LOADED&& null !== this._jumpTimestamp&& void 0 !== this._jumpTimestamp) {
      var a = Date.now()- this._jumpTimestamp;
      this._jumpTimestamp = null;
      null === (t = null === (e = this._delegate)|| void 0 === e? void 0: e.onWebViewExternalURL)|| void 0 === t|| t.call(e, a);
    }
  }
;
  e._onWebViewInteract = function() {
    var e,
    t;
    this._state === o.LOADED&& (null === (t = null === (e = this._delegate)|| void 0 === e? void 0: e.onWebViewInteract)|| void 0 === t|| t.call(e));
  }
;
  e._onWebViewError = function() {
    var e;
    this._clearTimeout();
    if(this._state !== o.READY&& this._state !== o.ERROR) {
      n.FrameSDK.frameData.gameFuc.closeLoad();
      this._webViewNode.scale = 1;
      this._state = o.ERROR;
      null === (e = this._delegate)|| void 0 === e|| e.onWebViewLoad(! 1);
    }
  }
;
  e._onWebViewLoaded = function(e) {
    var t;
    this._clearTimeout();
    if(this._state !== o.READY&& this._state !== o.LOADED&& this._state !== o.ERROR) {
      n.FrameSDK.frameData.gameFuc.closeLoad();
      this._webViewNode.scale = 1;
      e.evaluateJS("\n            if (!window.__injected) {\n                document.addEventListener('submit', function () {\n                    window[\"android\"].setCallBack(\"cc.js.getClassByName('WebViewManager')._onWebViewInteract();\");\n                });\n                window.__injected = true;\n            }\n        ");
      this._state = o.LOADED;
      null === (t = this._delegate)|| void 0 === t|| t.onWebViewLoad(! 0);
    }
  }
;
  e._onWebViewJumpExternal = function() {
    this._state !== o.LOADED|| null !== this._jumpTimestamp&& void 0 !== this._jumpTimestamp|| (this._jumpTimestamp = Date.now());
  }
;
  e._clearTimeout = function() {
    if(null !== this._timeoutID&& void 0 !== this._timeoutID) {
      clearTimeout(this._timeoutID);
      this._timeoutID = null;
    }
  }
;
  e.hideWebView = function(e) {
    var t;
    if(e === (null === (t = this._webViewNode)|| void 0 === t? void 0: t.parent)) {
      this._webViewNode.removeFromParent(! 1);
      this._state = o.READY;
      this._delegate = null;
      this._jumpTimestamp = null;
      cc.game.targetOff(this);
      var a = this._webViewNode.getComponent(cc.WebView);
      a&& (a.url = "");
    }
  }
;
  e.showWebView = function(e, t, a, i) {
    var r,
    c,
    s = this;
    void 0 === i&& (i = 30);
    if(e !== (null === (r = this._webViewNode)|| void 0 === r? void 0: r.parent)) {
      if(! this._webViewNode) {
        this._webViewNode = new cc.Node();
        this._webViewNode.on("loaded", this._onWebViewLoaded, this);
        this._webViewNode.on("error", this._onWebViewError, this);
        var l = this._webViewNode.addComponent(cc.Widget);
        l.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
        l.isAlignBottom = ! 0;
        l.isAlignLeft = ! 0;
        l.isAlignRight = ! 0;
        l.isAlignTop = ! 0;
        l.bottom = 0;
        l.left = 0;
        l.right = 0;
        l.top = 0;
      }
      this._webViewNode.setParent(e);
      this._webViewNode.getComponent(cc.Widget).updateAlignment();
      this._state = o.LOADING;
      this._delegate = a;
      this._jumpTimestamp = null;
      cc.sys.os === cc.sys.OS_ANDROID&& jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxWebView", "setExternalJSCallback", "(Ljava/lang/String;)V", "cc.js.getClassByName('WebViewManager')._onWebViewJumpExternal");
      cc.game.targetOff(this);
      cc.game.on(cc.game.EVENT_SHOW, this._onAppShow, this);
      var u = null !== (c = this._webViewNode.getComponent(cc.WebView))&& void 0 !== c? c: this._webViewNode.addComponent(cc.WebView);
      u.url = t;
      n.FrameSDK.frameData.gameFuc.openLoad();
      this._webViewNode.scale = 0;
      this._clearTimeout();
      this._timeoutID = setTimeout(function() {
        var e;
        n.FrameSDK.frameData.gameFuc.closeLoad();
        u.url = "";
        s._state = o.ERROR;
        null === (e = s._delegate)|| void 0 === e|| e.onWebViewLoad(! 1);
      }
, 1e3* i);
    }
  }
;
  e._webViewNode = null;
  e._state = o.READY;
  e._delegate = null;
  e._jumpTimestamp = null;
  e._timeoutID = null;
  return e;
}
();
a.default = i;
cc.js.setClassName("WebViewManager", i);
cc._RF.pop();
