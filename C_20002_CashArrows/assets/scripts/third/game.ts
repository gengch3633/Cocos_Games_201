import AudioMgr from "./AudioMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import ResMgr from "./ResMgr";
import InterfaceMgr from "./InterfaceMgr";
import UserData from "./UserData";
import heidong from "./heidong";
import NodePoolMgr from "./NodePoolMgr";
import snake from "./snake";
import zhanai from "./zhanai";

export enum ClickState {
    norlmal = 0,
    change = 1,
    yichu = 2,
}

export enum Direction {
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3,
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Layout)
    Layout_snake: any = null;
    @property(cc.Layout)
    Layout_map: any = null;
    @property(cc.Node)
    node_fuzhuline: any = null;
    @property(cc.Node)
    node_item: any = null;
    levelInfo: any = null;
    num_mapInfo: any = [];
    clickState: any = ClickState.norlmal;
    snakes: any = [];
    zhanai: any = [];
    heidong: any = [];
    bool_moveflag: any = !1;
    prefab_zhanai: any = null;
    num_audioID: any = 0;
    num_minScale: any = 0;
    bool_canmove: any = !0;
    _bool_fuzhulineisOpen: any = !1;
    obj_size: any = null;
    doubleFlag: any = -1;
    pointsDis: any = 0;
get bool_fuzhulineisOpen() {
        return this._bool_fuzhulineisOpen;
    }
    set bool_fuzhulineisOpen(v: any) {
        this._bool_fuzhulineisOpen = v;
        GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.fuzhulineState, this.bool_fuzhulineisOpen);
    }


    onLoad() {
console.log(" size ", NodePoolMgr.getInstance().pool_map.size);
this.EventAdd();
};

    TouchEventAdd() {
this.node.on(cc.Node.EventType.TOUCH_START, this.tc_start, this);
this.node.on(cc.Node.EventType.TOUCH_MOVE, this.tc_move, this);
this.node.on(cc.Node.EventType.TOUCH_END, this.tc_end, this);
this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.tc_end, this);
};

    EventAdd() {
GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameAdTips, this.showTips, this);
GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameAdChnage, this.showChange, this);
GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameAdYichu, this.showYichu, this);
GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameAdFuzhuxian, this.showFuzhuxian, this);
GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.snakeTouchSnake, this.showPenzhuang, this);
GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.notifyGameNoMove, this.onNotifyGameNoMove, this);
GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.notifyGameCanMove, this.onNotifyGameCanMove, this);
GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameWin, this.ShowSelfEndAni, this);
};

    EventRemove() {
GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gameAdTips, this.showTips, this);
GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gameAdChnage, this.showChange, this);
GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gameAdYichu, this.showYichu, this);
GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gameAdFuzhuxian, this.showFuzhuxian, this);
GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.snakeTouchSnake, this.showPenzhuang, this);
GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.notifyGameNoMove, this.onNotifyGameNoMove, this);
GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.notifyGameCanMove, this.onNotifyGameCanMove, this);
GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gameWin, this.ShowSelfEndAni, this);
};

    onNotifyGameNoMove() {
console.log(" no move ");
this.bool_canmove = !1;
};

    onNotifyGameCanMove() {
console.log(" canmove ");
this.bool_canmove = !0;
};

    start() {
this.CreateMap();
this.CreateSnake();
this.createObstacles();
this.createHeidong();
this.node.getChildByName(" ScrollView ").width = 0;
this.node.getChildByName(" ScrollView ").height = 0;
this.obj_size = {
width: this.node.width,
height: this.node.height
};
this.node.width = 5e3;
this.node.height = 5e3;
this.TouchEventAdd();
this.showSelfAni();
};

    tc_start(e) {
console.log(" start111111111111111111 ");
this.pointsDis = 0;
var t = e.getTouches();
if (t.length >= 2) {
var i = this.node.convertToNodeSpaceAR(t[0].getLocation()), n = this.node.convertToNodeSpaceAR(t[1].getLocation());
this.pointsDis = i.sub(n).mag();
}
};

    tc_move(e) {
if (this.bool_canmove) if (e.getTouches && e.getTouches().length > 1) this.handlePinch(e); else {
this.node.x += e.getDelta().x * (.75 * UserData.getInstance().dragSpeed + .25);
this.node.y += e.getDelta().y * (.75 * UserData.getInstance().dragSpeed + .25);
this.restrictNodePosition(this.node.parent, this.node);
}
};

    handlePinch2(e) {
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

    handlePinch(e) {
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

    tc_end() {
this.doubleFlag = -1;
GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameScaleChange, {
scale: this.node.scale
});
};

    resetPos() {
var e = this.node.parent.width / 2, t = this.node.parent.height / 2, i = this.node.width * this.node.scale / 2, n = this.node.height * this.node.scale / 2, a = Math.max(0, e - i), o = Math.max(0, t - n);
this.node.x = Math.min(a, Math.max(-a, this.node.x));
this.node.y = Math.min(o, Math.max(-o, this.node.y));
};

    restrictNodePosition() {
var e = (this.node.scale - this.num_minScale) * this.obj_size.width / 2, t = (this.node.scale - this.num_minScale) * this.obj_size.height / 2, i = e + this.node.parent.width / 2, n = t + this.node.parent.height / 2;
this.node.x > i ? this.node.x = i : this.node.x < -i && (this.node.x = -i);
this.node.y > n ? this.node.y = n : this.node.y < -n && (this.node.y = -n);
};

    CreateMap() {
this.node.width = this.levelInfo.XSize * this.node_item.width;
this.node.height = this.levelInfo.YSize * this.node_item.height;
this.Layout_map.node.width = this.levelInfo.XSize * this.node_item.width;
this.Layout_map.node.height = this.levelInfo.YSize * this.node_item.height;
this.Layout_map.enabled = !1;
for (var e = UserData.getInstance().colorMode, t = 0; t < this.levelInfo.XSize; t++) {
for (var i = [], n = 0; n < this.levelInfo.YSize; n++) {
var a = cc.instantiate(this.node_item);
a.name = this.Layout_map.node.childrenCount.toString();
a.parent = this.Layout_map.node;
a.active = !0;
if (e) {
var o = a.getChildByName(" dian ");
o && (o.color = cc.color(50, 52, 80));
}
i.push(" 0 ");
}
this.num_mapInfo.push(i);
}
this.Layout_map.enabled = !0;
this.Layout_map.updateLayout();
};

    playRippleAnimation() {};

    CreateSnake() {
this.Layout_snake.node.width = this.levelInfo.XSize * this.node_item.width;
this.Layout_snake.node.height = this.levelInfo.YSize * this.node_item.height;
GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.notifySnakeNum, this.levelInfo.Arrows.length, this.levelInfo.Arrows.length);
for (var e = 0; e < this.levelInfo.Arrows.length; e++) {
var t = new cc.Node(), i = t.addComponent(snake);
i.setGameManager(this);
this.Layout_snake.node.addChild(t);
i.Init(e, this.levelInfo, t, this.Layout_map.node);
this.snakes.push(i);
}
};

    createObstacles() {
var e = this;
if (this.levelInfo.WayBlockers) {
var t = this;
ResMgr.getInstance().loadRes(" prefab/ item_zhanai ", cc.Prefab, null, " game ").then(function(i) {
if (i) {
e.prefab_zhanai = i;
for (var n = 0, a = e.levelInfo.WayBlockers; n < a.length; n++) {
var o = a[n], r = cc.instantiate(e.prefab_zhanai);
r.parent = e.Layout_snake.node;
var s = r.getComponent(zhanai);
e.zhanai.push(s);
s.setGameManager(t);
s.Init(o);
}
}
});
}
};

    createHeidong() {
var e = this;
if (this.levelInfo.BlackHoles) {
var t = this;
ResMgr.getInstance().loadRes(" prefab/ item_heidong ", cc.Prefab, null, " game ").then(function(i) {
if (i) {
e.prefab_zhanai = i;
for (var n = 0; n < e.levelInfo.BlackHoles.length; n++) {
var a = cc.instantiate(e.prefab_zhanai);
a.parent = e.Layout_snake.node;
var o = a.getComponent(heidong);
o.setGameManager(t);
o.Init(e.levelInfo.BlackHoles[n]);
e.heidong.push(o);
}
}
});
}
};

    SliderValueChanged(e) {
this.node.x = 0;
this.node.y = 0;
this.Layout_snake.node.scale = e.progress;
this.Layout_map.node.scale = e.progress;
};

    onSnakeDestroyed(e) {
GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.notifySnakeNumChange);
for (var t = this.snakes.indexOf(e), i = this.snakes[t].snakeInfo2, n = 0; n < i.length; n++) this.num_mapInfo[i[n].x][i[n].y] = " 0 ";
this.num_audioID++;
this.num_audioID > 7 && (this.num_audioID = 1);
AudioMgr.getInstance().playEffect(" audio/ snakeMove/ " + this.num_audioID, c.bundleName.game);
};

    showTips() {
for (var e = 0; e < this.snakes.length; e++) if (this.snakes[e].snakeState != snakeState.dead && !this.snakes[e].checkZhanai().hasCollision) {
var t = this.snakes[e].node_allbody[0];
if (t) {
var i = t.convertToWorldSpaceAR(cc.Vec2.ZERO), n = this.node.parent.convertToWorldSpaceAR(cc.Vec2.ZERO).subtract(i);
this.node.x += n.x;
this.node.y += n.y;
}
return void this.snakes[e].showTip();
}
};

    showChange() {
this.clickState = ClickState.change;
};

    showYichu() {
this.clickState = ClickState.yichu;
};

    setState(e) {
this.clickState = e;
};

    showFuzhuxian() {
for (var e = 0; e < this.snakes.length; e++) {
var t = this.snakes[e];
this.bool_fuzhulineisOpen ? t.CloseFuzhuline() : t.ShowFuzhuline();
}
this.bool_fuzhulineisOpen = !this.bool_fuzhulineisOpen;
};

    CloseFuzhuxian() {
this.bool_fuzhulineisOpen = !1;
for (var e = 0; e < this.snakes.length; e++) this.snakes[e].CloseFuzhuline();
};

    showPenzhuang() {
for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
var i = this.num_mapInfo[e[0].x][e[0].y];
if (" x " != i) {
var n = i.split(" _ "), a = this.snakes[Number(n[0])];
a.showPengzhuan();
}
};

    ShowSelfEndAni() {
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
var _ = p.getChildByName(" dian ");
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
console.warn(" 动画未完全完成 ， 强制执行回收 ");
e.recycleNode();
}
}, a + 1);
};

    recycleNode() {};

    onDestroy() {
this.EventRemove();
this.node.off(cc.Node.EventType.TOUCH_START, this.tc_start, this);
this.node.off(cc.Node.EventType.TOUCH_MOVE, this.tc_move, this);
this.node.off(cc.Node.EventType.TOUCH_END, this.tc_end, this);
this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.tc_end, this);
this.unscheduleAllCallbacks();
};

    showSelfAni() {
this.node.scale = this.num_minScale + 1;
cc.tween(this.node).to(.6, {
scale: this.num_minScale
}).start();
};
}
