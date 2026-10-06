heidong: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "35b24JUCi1Bz6FztJWggwm5", "heidong");
var n = __extends, a = __decorate;
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = cc._decorator, r = o.ccclass;
o.property;
var s = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.gameManager = null;
t.posInfo = null;
return t;
}
n(t, e);
t.prototype.start = function() {};
t.prototype.Init = function(e) {
var t = e % this.gameManager.levelInfo.XSize, i = Math.floor(e / this.gameManager.levelInfo.XSize);
this.gameManager.num_mapInfo[t][i] = "o";
this.node.setPosition(this.getNodePos({
x: t,
y: i
}));
console.log(this.gameManager.num_mapInfo);
this.posInfo = {
x: t,
y: i
};
};
t.prototype.getNodePos = function(e) {
var t = this.gameManager.Layout_map.node.children[0].position;
return cc.v3(50 * e.x, 50 * e.y, 0).addSelf(t);
};
t.prototype.showStartAni = function() {
var e = this.node.getChildByName("zhangai").getComponent(sp.Skeleton);
e.setAnimation(0, "heidong", !1);
e.setAnimation(0, "heidongidle", !0);
};
t.prototype.showEndAni = function() {
var e = this;
this.scheduleOnce(function() {
e.node.getChildByName("zhangai").getComponent(sp.Skeleton).setAnimation(0, "daiji2", !1);
}, .5);
};
t.prototype.setGameManager = function(e) {
this.gameManager = e;
};
return a([ r ], t);
}(cc.Component);
i.default = s;
cc._RF.pop();
}