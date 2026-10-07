let e = require;
let t = module;
"use strict";
cc._RF.push(t, "4fdbcUEG8hJ97v28wQK9035", "I18nSprite");
var i = e("GlobalEventMgr"),
n = e("InterfaceMgr"),
a = e("LanguageService.js"),
o = e("ResMgr"),
r = cc.Class({
  extends: cc.Component, properties: {
    i18nKey: {
      default: "", tooltip: "i18n key whose value is sprite path"
    }
, fallbackPath: {
      default: "", tooltip: "fallback sprite path when key missing or empty"
    }
, bundleName: {
      default: "ui", tooltip: "bundle name for sprite loading"
    }
, targetSprite: {
      default: null, type: cc.Sprite
    }
  }
, onLoad: function() {
    this.targetSprite|| (this.targetSprite = this.node.getComponent(cc.Sprite));
    this._requestVersion = 0;
    this.bindLanguageEvent();
    this.refreshSprite();
  }
, onDestroy: function() {
    this.unbindLanguageEvent();
  }
, bindLanguageEvent: function() {
    i.default.getInstance().on(n.gameEvent.languageChanged, this.onLanguageChanged, this);
  }
, unbindLanguageEvent: function() {
    i.default.getInstance().off(n.gameEvent.languageChanged, this.onLanguageChanged, this);
  }
, onLanguageChanged: function() {
    this.refreshSprite();
  }
, setI18nKey: function(e, t, i) {
    this.i18nKey = e|| "";
    void 0 !== t&& (this.fallbackPath = t|| "");
    void 0 !== i&& (this.bundleName = i|| "ui");
    this.refreshSprite();
  }
, getSpritePath: function() {
    var e = String(this.i18nKey|| "").trim();
    if(! e) return String(this.fallbackPath|| "").trim();
    var t = a.t(e, [], "");
    return String(t|| "").trim()|| String(this.fallbackPath|| "").trim();
  }
, refreshSprite: function() {
    var e = this;
    if(this.targetSprite&& this.targetSprite.isValid) {
      var t = this.getSpritePath();
      if(t) {
        var i = ++ this._requestVersion;
        o.default.getInstance().loadRes(t, cc.SpriteFrame, this, this.bundleName).then(function(t) {
          i === e._requestVersion&& e.targetSprite&& e.targetSprite.isValid&& t&& (e.targetSprite.spriteFrame = t);
        }
).catch(function(i) {
          cc.warn("[I18nSprite] loadRes failed:", t, e.bundleName, i);
        }
);
      }
    }
  }
}
);
t.exports = r;
t.exports.default = r;
cc._RF.pop();
