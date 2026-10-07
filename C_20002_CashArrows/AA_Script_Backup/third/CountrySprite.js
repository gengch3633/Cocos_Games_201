let e = require;
let t = module;
"use strict";
cc._RF.push(t, "83610kEXp1CUpNOD3vk58BX", "CountrySprite");
var i = e("GlobalEventMgr"),
n = e("InterfaceMgr"),
a = e(ResMgr "
} ].js), o = e(" CountryAssetService.js "), r = cc.Class({
extends: cc.Component,
properties: {
imageName: {
default: " ",
tooltip: " single image name entry, e.g.money_mood_icon "
},
assetKey: {
default: " ",
tooltip: " optional global asset rule key in CountryAssetService "
},
pathMapText: {
default: " ",
tooltip: 'deprecated: JSON map, e.g. {" ID ":"..."}'
},
countryCode: {
default: " ",
tooltip: " force country code, empty means current country "
},
fallbackPath: {
default: " ",
tooltip: " fallback sprite path when map has no match "
},
bundleName: {
default: " ui ",
tooltip: " bundle name for sprite loading "
},
refreshOnLoad: {
default: !0
},
refreshOnLanguageChanged: {
default: !0,
tooltip: " use this event as a general refresh trigger "
},
targetSprite: {
default: null,
type: cc.Sprite
}
},
onLoad: function() {
this.targetSprite || (this.targetSprite = this.node.getComponent(cc.Sprite));
this._requestVersion = 0;
this._cachedMapText = null;
this._cachedMap = {};
this.bindLanguageEvent();
this.refreshOnLoad && this.refreshSprite();
},
onDestroy: function() {
this.unbindLanguageEvent();
},
onValidate: function() {
this.refreshSprite();
},
bindLanguageEvent: function() {
i.default.getInstance().on(n.gameEvent.languageChanged, this.onLanguageChanged, this);
},
unbindLanguageEvent: function() {
i.default.getInstance().off(n.gameEvent.languageChanged, this.onLanguageChanged, this);
},
onLanguageChanged: function() {
this.refreshOnLanguageChanged && this.refreshSprite();
},
setCountryCode: function(e) {
this.countryCode = String(e || " ").toUpperCase();
this.refreshSprite();
},
refreshSprite: function() {
if (this.targetSprite && this.targetSprite.isValid) {
(" number " != typeof this._requestVersion || isNaN(this._requestVersion)) && (this._requestVersion = 0);
var e = this.getSpritePath();
if (e) {
var t = ++this._requestVersion, i = this.getDefaultSpritePath();
this.loadSpriteWithFallback(e, i, t);
}
}
},
getSpritePath: function() {
var e = this.getTargetCountry(), t = this.getImageNamePath(e);
if (t) return t;
var i = this.getRuleMap();
return o.resolvePath(i, e, this.fallbackPath) || (this.assetKey ? o.getAssetPath(this.assetKey, e, this.fallbackPath) : String(this.fallbackPath || " ").trim());
},
getTargetCountry: function() {
return o.normalizeCountry(this.countryCode) || o.getCurrentCountry();
},
getRuleMap: function() {
var e = String(this.pathMapText || " ").trim();
if (!e) return {};
if (e === this._cachedMapText && this._cachedMap) return this._cachedMap;
this._cachedMapText = e;
this._cachedMap = o.parseRuleMapText(e);
return this._cachedMap;
},
getImageNamePath: function(e) {
var t = String(this.imageName || " ").trim();
return t ? o.getPathByImageName(t, e) : " ";
},
getDefaultSpritePath: function() {
var e = String(this.imageName || " ").trim();
if (e) return o.getPathByImageName(e, " ID ");
var t = String(this.fallbackPath || " ").trim();
return t ? o.resolvePath({}, " ID ", t) : " ";
},
loadSpriteWithFallback: function(e, t, i) {
var n = this;
a.default.getInstance().loadRes(e, cc.SpriteFrame, this, this.bundleName).then(function(e) {
i === n._requestVersion && n.targetSprite && n.targetSprite.isValid && e && (n.targetSprite.spriteFrame = e);
}).catch(function(a) {
t && t !== e ? n.loadFallbackSprite(t, i, a) : cc.warn("[CountrySprite] loadRes failed: ", e, n.bundleName, a);
});
},
loadFallbackSprite: function(e, t, i) {
var n = this;
a.default.getInstance().loadRes(e, cc.SpriteFrame, this, this.bundleName).then(function(e) {
t === n._requestVersion && n.targetSprite && n.targetSprite.isValid && e && (n.targetSprite.spriteFrame = e);
}).catch(function(t) {
cc.warn("[CountrySprite] loadRes failed: ", e, n.bundleName, i || t);
});
}
});
t.exports = r;
t.exports.default = r;
cc._RF.pop();
