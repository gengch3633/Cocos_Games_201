SceneMgr: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "e3d1ddQGp9Af7Kff9MtSzhn", "SceneMgr");
var n = __extends, a = __awaiter, o = __generator;
Object.defineProperty(i, "__esModule", {
value: !0
});
var r = e("ResMgr"), s = e("Singleton"), l = e("UIMgr"), c = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._preSceneName = null;
return t;
}
n(t, e);
Object.defineProperty(t.prototype, "sceneName", {
get: function() {
var e;
return null !== (e = this._sceneName) && void 0 !== e ? e : cc.director.getScene().name;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "preSceneName", {
get: function() {
return this._preSceneName;
},
enumerable: !1,
configurable: !0
});
t.prototype.includes = function(e) {
return null != cc.assetManager.bundles.find(function(t) {
return null != t.getSceneInfo(e);
});
};
t.prototype.loadScene = function(e, t, i) {
void 0 === t && (t = null);
void 0 === i && (i = null);
return a(this, void 0, Promise, function() {
var n = this;
return o(this, function(a) {
switch (a.label) {
case 0:
return this.includes(e) ? (this._preSceneName = this._sceneName, cc.director.loadScene(e, function() {
n._sceneName = e;
i && i();
}), l.default.getInstance().hideWatingUI(), [ 2 ]) : (l.default.getInstance().showWatingUI(), 
[ 4, r.default.getInstance().getBundle(t) ]);

case 1:
a.sent();
return [ 2, this.loadScene(e, t, i) ];
}
});
});
};
return t;
}(s.default);
i.default = c;
cc._RF.pop();
}