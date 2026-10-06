// @ts-nocheck
import AudioMgr from "./AudioMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import * as InterfaceMgr from "./InterfaceMgr";

const { __extends, __decorate } = cc;
const n = __extends;
const a = __decorate;
var o = AudioMgr, r = GlobalEventMgr, s = InterfaceMgr, l = cc._decorator, c = l.ccclass, u = l.property, d = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.gameManager = null;
t.txt_num = null;
t.num_zhanai = 0;
t.posInfo = null;
return t;
}
n(t, e);
t.prototype.start = function() {
r.default.getInstance().on(s.gameEvent.notifySnakeNumChange, this.updateNum, this);
};
t.prototype.onDestroy = function() {
r.default.getInstance().off(s.gameEvent.notifySnakeNumChange, this.updateNum, this);
};
t.prototype.Init = function(e) {
var t = e.Index % this.gameManager.levelInfo.XSize, i = Math.floor(e.Index / this.gameManager.levelInfo.XSize);
this.gameManager.num_mapInfo[t][i] = "x";
this.num_zhanai = e.LockTime;
this.reference();
this.posInfo = {
x: t,
y: i
};
this.node.setPosition(this.getNodePos(this.posInfo));
};
t.prototype.getNodePos = function(e) {
var t = this.gameManager.Layout_map.node.children[0].position;
return cc.v3(50 * e.x, 50 * e.y, 0).addSelf(t);
};
t.prototype.reference = function() {
this.txt_num.string = this.num_zhanai.toString();
};
t.prototype.updateNum = function() {
var e = this;
this.num_zhanai--;
this.reference();
if (this.num_zhanai <= 0) {
var t = this.node.getChildByName("zhanai").getComponent(sp.Skeleton);
o.default.getInstance().playEffect("audio/unlock_obstacle", s.bundleName.game);
this.gameManager.zhanai.splice(this.gameManager.zhanai.indexOf(this), 1);
this.gameManager.num_mapInfo[this.posInfo.x][this.posInfo.y] = "0";
this.scheduleOnce(function() {
t.node.getChildByName("txt_num").active = !1;
}, .2);
t.setAnimation(0, "zhangaixiaochu", !1);
t.setCompleteListener(function() {
e.node.destroy();
});
}
};
t.prototype.setGameManager = function(e) {
this.gameManager = e;
};
a([ u(cc.Label) ], t.prototype, "txt_num", void 0);
return a([ c ], t);
}(cc.Component);
export default d;
