// @ts-nocheck
import AudioMgr from "./AudioMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import NodePoolMgr from "./NodePoolMgr";
import ResMgr from "./ResMgr";
import ScrollView from "./ScrollView";
import UserData from "./UserData";

var n, a = __extends, o = __decorate;
i.Direction = i.ClickState = void 0;
(function(e) {
e[e.norlmal = 0] = "norlmal";
e[e.change = 1] = "change";
e[e.yichu = 2] = "yichu";
})(n = i.ClickState || (i.ClickState = {}));
(function(e) {
e[e.Up = 0] = "Up";
e[e.Down = 1] = "Down";
e[e.Left = 2] = "Left";
e[e.Right = 3] = "Right";
})(i.Direction || (i.Direction = {}));
var r = AudioMgr, s = GlobalEventMgr, l = ResMgr, c = InterfaceMgr, u = UserData, d = heidong, h = NodePoolMgr, p = snake, _ = zhanai, f = cc._decorator, g = f.ccclass, m = f.property, y = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.Layout_snake = null;
t.Layout_map = null;
t.node_fuzhuline = null;
t.node_item = null;
t.levelInfo = null;
t.num_mapInfo = [];
t.clickState = n.norlmal;
t.snakes = [];
t.zhanai = [];
t.heidong = [];
t.bool_moveflag = !1;
t.prefab_zhanai = null;
t.num_audioID = 0;
t.num_minScale = 0;
t.bool_canmove = !0;
t._bool_fuzhulineisOpen = !1;
t.obj_size = null;
t.doubleFlag = -1;
t.pointsDis = 0;
return t;
}
a(t, e);
Object.defineProperty(t.prototype, "bool_fuzhulineisOpen", {
get: function() {
return this._bool_fuzhulineisOpen;
},
set: function(e) {
this._bool_fuzhulineisOpen = e;
s.default.getInstance().emit(c.gameEvent.fuzhulineState, this.bool_fuzhulineisOpen);
},
enumerable: !1,
configurable: !0
});
t.prototype.onLoad = function() {
console.log("size", h.default.getInstance().pool_map.size);
this.EventAdd();
};
t.prototype.TouchEventAdd = function() {
this.node.on(cc.Node.EventType.TOUCH_START, this.tc_start, this);
this.node.on(cc.Node.EventType.TOUCH_MOVE, this.tc_move, this);
this.node.on(cc.Node.EventType.TOUCH_END, this.tc_end, this);
this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.tc_end, this);
};
t.prototype.EventAdd = function() {
s.default.getInstance().on(c.gameEvent.gameAdTips, this.showTips, this);
s.default.getInstance().on(c.gameEvent.gameAdChnage, this.showChange, this);
s.default.getInstance().on(c.gameEvent.gameAdYichu, this.showYichu, this);
s.default.getInstance().on(c.gameEvent.gameAdFuzhuxian, this.showFuzhuxian, this);
s.default.getInstance().on(c.gameEvent.snakeTouchSnake, this.showPenzhuang, this);
s.default.getInstance().on(c.gameEvent.notifyGameNoMove, this.onNotifyGameNoMove, this);
s.default.getInstance().on(c.gameEvent.notifyGameCanMove, this.onNotifyGameCanMove, this);
s.default.getInstance().on(c.gameEvent.gameWin, this.ShowSelfEndAni, this);
};
t.prototype.EventRemove = function() {
s.default.getInstance().off(c.gameEvent.gameAdTips, this.showTips, this);
s.default.getInstance().off(c.gameEvent.gameAdChnage, this.showChange, this);
s.default.getInstance().off(c.gameEvent.gameAdYichu, this.showYichu, this);
s.default.getInstance().off(c.gameEvent.gameAdFuzhuxian, this.showFuzhuxian, this);
s.default.getInstance().off(c.gameEvent.snakeTouchSnake, this.showPenzhuang, this);
s.default.getInstance().off(c.gameEvent.notifyGameNoMove, this.onNotifyGameNoMove, this);
s.default.getInstance().off(c.gameEvent.notifyGameCanMove, this.onNotifyGameCanMove, this);
s.default.getInstance().off(c.gameEvent.gameWin, this.ShowSelfEndAni, this);
};
t.prototype.onNotifyGameNoMove = function() {
console.log("no move");
this.bool_canmove = !1;
};
t.prototype.onNotifyGameCanMove = function() {
console.log("canmove");
this.bool_canmove = !0;
};
t.prototype.start = function() {
this.CreateMap();
this.CreateSnake();
this.createObstacles();
this.createHeidong();
this.node.getChildByNamScrollView.width = 0;
this.node.getChildByNamScrollView.height = 0;
this.obj_size = {
width: this.node.width,
height: this.node.height
};
this.node.width = 5e3;
this.node.height = 5e3;
this.TouchEventAdd();
this.showSelfAni();
};
t.prototype.tc_start = function(e) {
console.log("start111111111111111111");
this.pointsDis = 0;
var t = e.getTouches();
if (t.length >= 2) {
var i = this.node.convertToNodeSpaceAR(t[0].getLocation()), n = this.node.convertToNodeSpaceAR(t[1].getLocation());
this.pointsDis = i.sub(n).mag();
}
};
t.prototype.tc_move = function(e) {
if (this.bool_canmove) if (e.getTouches && e.getTouches().length > 1) this.handlePinch(e); else {
this.node.x += e.getDelta().x * (.75 * u.default.getInstance().dragSpeed + .25);
this.node.y += e.getDelta().y * (.75 * u.default.getInstance().dragSpeed + .25);
this.restrictNodePosition(this.node.parent, this.node);
}
};
t.prototype.handlePinch2 = function(e) {
var t = e.getTouches();
if (!(t.length < 2)) {
var i = this.node.convertToNodeSpaceAR(t[0].getLocation()), n = this.node.convertToNodeSpaceAR(t[1].getLocation()), a = i.sub(n).mag();
if (this.pointsDis <= 0) this.pointsDis = a; else {
var o = 1 + .8 * (a / this.pointsDis - 1), r = this.node.scale * o, s = this.num_minScale, l = this.num_minScale + 1;
this.node.scale = Math.min(Math.max(r, s), l);
this.pointsDis = a;
}
}
};
t.prototype.handlePinch = function(e) {
var t = e.getTouches();
if (!(t.length < 2)) {
var i = t[0].getLocation(), n = t[1].getLocation(), a = i.sub(n).mag();
if (this.pointsDis <= 0) this.pointsDis = a; else {
var o = 1 + .8 * (a / this.pointsDis - 1), r = this.node.scale * o, s = this.num_minScale, l = this.num_minScale + 1;
this.node.scale = Math.min(Math.max(r, s), l);
this.pointsDis = a;
}
}
};
t.prototype.tc_end = function() {
this.doubleFlag = -1;
s.default.getInstance().emit(c.gameEvent.gameScaleChange, {
scale: this.node.scale
});
};
t.prototype.resetPos = function() {
var e = this.node.parent.width / 2, t = this.node.parent.height / 2, i = this.node.width * this.node.scale / 2, n = this.node.height * this.node.scale / 2, a = Math.max(0, e - i), o = Math.max(0, t - n);
this.node.x = Math.min(a, Math.max(-a, this.node.x));
this.node.y = Math.min(o, Math.max(-o, this.node.y));
};
t.prototype.restrictNodePosition = function() {
var e = (this.node.scale - this.num_minScale) * this.obj_size.width / 2, t = (this.node.scale - this.num_minScale) * this.obj_size.height / 2, i = e + this.node.parent.width / 2, n = t + this.node.parent.height / 2;
this.node.x > i ? this.node.x = i : this.node.x < -i && (this.node.x = -i);
this.node.y > n ? this.node.y = n : this.node.y < -n && (this.node.y = -n);
};
t.prototype.CreateMap = function() {
this.node.width = this.levelInfo.XSize * this.node_item.width;
this.node.height = this.levelInfo.YSize * this.node_item.height;
this.Layout_map.node.width = this.levelInfo.XSize * this.node_item.width;
this.Layout_map.node.height = this.levelInfo.YSize * this.node_item.height;
this.Layout_map.enabled = !1;
for (var e = u.default.getInstance().colorMode, t = 0; t < this.levelInfo.XSize; t++) {
for (var i = [], n = 0; n < this.levelInfo.YSize; n++) {
var a = cc.instantiate(this.node_item);
a.name = this.Layout_map.node.childrenCount.toString();
a.parent = this.Layout_map.node;
a.active = !0;
if (e) {
var o = a.getChildByNamdian;
o && (o.color = cc.color(50, 52, 80));
}
i.push("0");
}
this.num_mapInfo.push(i);
}
this.Layout_map.enabled = !0;
this.Layout_map.updateLayout();
};
t.prototype.playRippleAnimation = function() {};
t.prototype.CreateSnake = function() {
this.Layout_snake.node.width = this.levelInfo.XSize * this.node_item.width;
this.Layout_snake.node.height = this.levelInfo.YSize * this.node_item.height;
s.default.getInstance().emit(c.gameEvent.notifySnakeNum, this.levelInfo.Arrows.length, this.levelInfo.Arrows.length);
for (var e = 0; e < this.levelInfo.Arrows.length; e++) {
var t = new cc.Node(), i = t.addComponent(p.default);
i.setGameManager(this);
this.Layout_snake.node.addChild(t);
i.Init(e, this.levelInfo, t, this.Layout_map.node);
this.snakes.push(i);
}
};
t.prototype.createObstacles = function() {
var e = this;
if (this.levelInfo.WayBlockers) {
var t = this;
l.default.getInstance().loadRes("prefab/item_zhanai", cc.Prefab, null, "game").then(function(i) {
if (i) {
e.prefab_zhanai = i;
for (var n = 0, a = e.levelInfo.WayBlockers; n < a.length; n++) {
var o = a[n], r = cc.instantiate(e.prefab_zhanai);
r.parent = e.Layout_snake.node;
var s = r.getComponent(_.default);
e.zhanai.push(s);
s.setGameManager(t);
s.Init(o);
}
}
});
}
};
t.prototype.createHeidong = function() {
var e = this;
if (this.levelInfo.BlackHoles) {
var t = this;
l.default.getInstance().loadRes("prefab/item_heidong", cc.Prefab, null, "game").then(function(i) {
if (i) {
e.prefab_zhanai = i;
for (var n = 0; n < e.levelInfo.BlackHoles.length; n++) {
var a = cc.instantiate(e.prefab_zhanai);
a.parent = e.Layout_snake.node;
var o = a.getComponent(d.default);
o.setGameManager(t);
o.Init(e.levelInfo.BlackHoles[n]);
e.heidong.push(o);
}
}
});
}
};
t.prototype.SliderValueChanged = function(e) {
this.node.x = 0;
this.node.y = 0;
this.Layout_snake.node.scale = e.progress;
this.Layout_map.node.scale = e.progress;
};
t.prototype.onSnakeDestroyed = function(e) {
s.default.getInstance().emit(c.gameEvent.notifySnakeNumChange);
for (var t = this.snakes.indexOf(e), i = this.snakes[t].snakeInfo2, n = 0; n < i.length; n++) this.num_mapInfo[i[n].x][i[n].y] = "0";
this.num_audioID++;
this.num_audioID > 7 && (this.num_audioID = 1);
r.default.getInstance().playEffect("audio/snakeMove/" + this.num_audioID, c.bundleName.game);
};
t.prototype.showTips = function() {
for (var e = 0; e < this.snakes.length; e++) if (this.snakes[e].snakeState != p.snakeState.dead && !this.snakes[e].checkZhanai().hasCollision) {
var t = this.snakes[e].node_allbody[0];
if (t) {
var i = t.convertToWorldSpaceAR(cc.Vec2.ZERO), n = this.node.parent.convertToWorldSpaceAR(cc.Vec2.ZERO).subtract(i);
this.node.x += n.x;
this.node.y += n.y;
}
return void this.snakes[e].showTip();
}
};
t.prototype.showChange = function() {
this.clickState = n.change;
};
t.prototype.showYichu = function() {
this.clickState = n.yichu;
};
t.prototype.setState = function(e) {
this.clickState = e;
};
t.prototype.showFuzhuxian = function() {
for (var e = 0; e < this.snakes.length; e++) {
var t = this.snakes[e];
this.bool_fuzhulineisOpen ? t.CloseFuzhuline() : t.ShowFuzhuline();
}
this.bool_fuzhulineisOpen = !this.bool_fuzhulineisOpen;
};
t.prototype.CloseFuzhuxian = function() {
this.bool_fuzhulineisOpen = !1;
for (var e = 0; e < this.snakes.length; e++) this.snakes[e].CloseFuzhuline();
};
t.prototype.showPenzhuang = function() {
for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
var i = this.num_mapInfo[e[0].x][e[0].y];
if ("x" != i) {
var n = i.split("_"), a = this.snakes[Number(n[0])];
a.showPengzhuan();
}
};
t.prototype.ShowSelfEndAni = function() {
var e = this;
cc.tween(this.node).to(.3, {
scale: this.num_minScale,
position: cc.v3(0, 0)
}).start();
for (var t = Math.floor(this.levelInfo.XSize / 2), i = Math.floor(this.levelInfo.YSize / 2), n = Math.max(t, i) + 5, a = .6000000000000001 + .05 * n, o = 0, r = 0, s = 0; s <= n; s++) for (var l = .05 * s + .5, c = 0; c < this.levelInfo.XSize; c++) for (var u = 0; u < this.levelInfo.YSize; u++) {
var d = Math.sqrt(Math.pow(c - t, 2) + Math.pow(u - i, 2));
if (d >= s && d < s + 2) {
var h = u * this.levelInfo.XSize + c, p = this.Layout_map.node.children[h];
if (p) {
var _ = p.getChildByNamdian;
if (_) {
r++;
cc.tween(_).delay(l).to(.1, {
scale: 2,
opacity: 255
}).to(.3, {
scale: 1,
opacity: 100
}).to(.2, {
scale: .5,
opacity: 0
}).call(function() {
++o === r && e.recycleNode();
}).start();
}
}
}
}
this.scheduleOnce(function() {
if (o < r) {
console.warn("动画未完全完成，强制执行回收");
e.recycleNode();
}
}, a + 1);
};
t.prototype.recycleNode = function() {};
t.prototype.onDestroy = function() {
this.EventRemove();
this.node.off(cc.Node.EventType.TOUCH_START, this.tc_start, this);
this.node.off(cc.Node.EventType.TOUCH_MOVE, this.tc_move, this);
this.node.off(cc.Node.EventType.TOUCH_END, this.tc_end, this);
this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.tc_end, this);
this.unscheduleAllCallbacks();
};
t.prototype.showSelfAni = function() {
this.node.scale = this.num_minScale + 1;
cc.tween(this.node).to(.6, {
scale: this.num_minScale
}).start();
};
o([ m(cc.Layout) ], t.prototype, "Layout_snake", void 0);
o([ m(cc.Layout) ], t.prototype, "Layout_map", void 0);
o([ m(cc.Node) ], t.prototype, "node_fuzhuline", void 0);
o([ m(cc.Node) ], t.prototype, "node_item", void 0);
return o([ g ], t);
}(cc.Component);
export default  y;
