import AudioMgr from "./AudioMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import heidong from "./heidong";
import * as InterfaceMgr from "./InterfaceMgr";
import NodePoolMgr from "./NodePoolMgr";
import ResMgr from "./ResMgr";
import snake, { snakeState } from "./snake";
import UserData from "./UserData";
import zhanai from "./zhanai";

const { ccclass, property } = cc._decorator;

export enum ClickState {
    norlmal = 0,
    change = 1,
    yichu = 2
}

export enum Direction {
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3
}

@ccclass
export default class game extends cc.Component {
    @property(cc.Layout)
    Layout_snake: cc.Layout = null;

    @property(cc.Layout)
    Layout_map: cc.Layout = null;

    @property(cc.Node)
    node_fuzhuline: cc.Node = null;

    @property(cc.Node)
    node_item: cc.Node = null;

    levelInfo: any = null;
    num_mapInfo: string[][] = [];
    clickState: ClickState = ClickState.norlmal;
    snakes: snake[] = [];
    zhanai: zhanai[] = [];
    heidong: heidong[] = [];
    bool_moveflag: boolean = false;
    prefab_zhanai: cc.Prefab = null;
    num_audioID: number = 0;
    num_minScale: number = 0;
    bool_canmove: boolean = true;
    _bool_fuzhulineisOpen: boolean = false;
    obj_size: { width: number, height: number } = null;
    doubleFlag: number = -1;
    pointsDis: number = 0;

    get bool_fuzhulineisOpen(): boolean {
        return this._bool_fuzhulineisOpen;
    }

    set bool_fuzhulineisOpen(value: boolean) {
        this._bool_fuzhulineisOpen = value;
        GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.fuzhulineState, this.bool_fuzhulineisOpen);
    }

    onLoad() {
        console.log("size", NodePoolMgr.getInstance().pool_map.size);
        this.EventAdd();
    }

    TouchEventAdd() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.tc_start, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.tc_move, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.tc_end, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.tc_end, this);
    }

    EventAdd() {
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameAdTips, this.showTips, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameAdChnage, this.showChange, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameAdYichu, this.showYichu, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameAdFuzhuxian, this.showFuzhuxian, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.snakeTouchSnake, this.showPenzhuang, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.notifyGameNoMove, this.onNotifyGameNoMove, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.notifyGameCanMove, this.onNotifyGameCanMove, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameWin, this.ShowSelfEndAni, this);
    }

    EventRemove() {
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gameAdTips, this.showTips, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gameAdChnage, this.showChange, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gameAdYichu, this.showYichu, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gameAdFuzhuxian, this.showFuzhuxian, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.snakeTouchSnake, this.showPenzhuang, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.notifyGameNoMove, this.onNotifyGameNoMove, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.notifyGameCanMove, this.onNotifyGameCanMove, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gameWin, this.ShowSelfEndAni, this);
    }

    onNotifyGameNoMove() {
        console.log("no move");
        this.bool_canmove = false;
    }

    onNotifyGameCanMove() {
        console.log("canmove");
        this.bool_canmove = true;
    }

    start() {
        this.CreateMap();
        this.CreateSnake();
        this.createObstacles();
        this.createHeidong();
        this.node.getChildByName("ScrollView").width = 0;
        this.node.getChildByName("ScrollView").height = 0;
        this.obj_size = {
            width: this.node.width,
            height: this.node.height
        };
        this.node.width = 5000;
        this.node.height = 5000;
        this.TouchEventAdd();
        this.showSelfAni();
    }

    tc_start(event: cc.Event.EventTouch) {
        console.log("start111111111111111111");
        this.pointsDis = 0;
        var touches = event.getTouches();
        if (touches.length >= 2) {
            var p1 = this.node.convertToNodeSpaceAR(touches[0].getLocation());
            var p2 = this.node.convertToNodeSpaceAR(touches[1].getLocation());
            this.pointsDis = p1.sub(p2).mag();
        }
    }

    tc_move(event: cc.Event.EventTouch) {
        if (this.bool_canmove) {
            if (event.getTouches && event.getTouches().length > 1) {
                this.handlePinch(event);
            } else {
                this.node.x += event.getDelta().x * (0.75 * UserData.getInstance().dragSpeed + 0.25);
                this.node.y += event.getDelta().y * (0.75 * UserData.getInstance().dragSpeed + 0.25);
                this.restrictNodePosition();
            }
        }
    }

    handlePinch2(event: cc.Event.EventTouch) {
        var touches = event.getTouches();
        if (touches.length < 2) return;
        var p1 = this.node.convertToNodeSpaceAR(touches[0].getLocation());
        var p2 = this.node.convertToNodeSpaceAR(touches[1].getLocation());
        var distance = p1.sub(p2).mag();
        if (this.pointsDis <= 0) {
            this.pointsDis = distance;
        } else {
            var scaleFactor = 1 + 0.8 * (distance / this.pointsDis - 1);
            var newScale = this.node.scale * scaleFactor;
            var minScale = this.num_minScale;
            var maxScale = this.num_minScale + 1;
            this.node.scale = Math.min(Math.max(newScale, minScale), maxScale);
            this.pointsDis = distance;
        }
    }

    handlePinch(event: cc.Event.EventTouch) {
        var touches = event.getTouches();
        if (touches.length < 2) return;
        var p1 = touches[0].getLocation();
        var p2 = touches[1].getLocation();
        var distance = p1.sub(p2).mag();
        if (this.pointsDis <= 0) {
            this.pointsDis = distance;
        } else {
            var scaleFactor = 1 + 0.8 * (distance / this.pointsDis - 1);
            var newScale = this.node.scale * scaleFactor;
            var minScale = this.num_minScale;
            var maxScale = this.num_minScale + 1;
            this.node.scale = Math.min(Math.max(newScale, minScale), maxScale);
            this.pointsDis = distance;
        }
    }

    tc_end() {
        this.doubleFlag = -1;
        GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameScaleChange, {
            scale: this.node.scale
        });
    }

    resetPos() {
        var parentWidth = this.node.parent.width / 2;
        var parentHeight = this.node.parent.height / 2;
        var halfWidth = this.node.width * this.node.scale / 2;
        var halfHeight = this.node.height * this.node.scale / 2;
        var maxX = Math.max(0, parentWidth - halfWidth);
        var maxY = Math.max(0, parentHeight - halfHeight);
        this.node.x = Math.min(maxX, Math.max(-maxX, this.node.x));
        this.node.y = Math.min(maxY, Math.max(-maxY, this.node.y));
    }

    restrictNodePosition() {
        var offsetX = (this.node.scale - this.num_minScale) * this.obj_size.width / 2;
        var offsetY = (this.node.scale - this.num_minScale) * this.obj_size.height / 2;
        var maxX = offsetX + this.node.parent.width / 2;
        var maxY = offsetY + this.node.parent.height / 2;
        if (this.node.x > maxX) {
            this.node.x = maxX;
        } else if (this.node.x < -maxX) {
            this.node.x = -maxX;
        }
        if (this.node.y > maxY) {
            this.node.y = maxY;
        } else if (this.node.y < -maxY) {
            this.node.y = -maxY;
        }
    }

    CreateMap() {
        this.node.width = this.levelInfo.XSize * this.node_item.width;
        this.node.height = this.levelInfo.YSize * this.node_item.height;
        this.Layout_map.node.width = this.levelInfo.XSize * this.node_item.width;
        this.Layout_map.node.height = this.levelInfo.YSize * this.node_item.height;
        this.Layout_map.enabled = false;
        var colorMode = UserData.getInstance().colorMode;
        for (var i = 0; i < this.levelInfo.XSize; i++) {
            var column: string[] = [];
            for (var j = 0; j < this.levelInfo.YSize; j++) {
                var item = cc.instantiate(this.node_item);
                item.name = this.Layout_map.node.childrenCount.toString();
                item.parent = this.Layout_map.node;
                item.active = true;
                if (colorMode) {
                    var dian = item.getChildByName("dian");
                    if (dian) {
                        dian.color = cc.color(50, 52, 80);
                    }
                }
                column.push("0");
            }
            this.num_mapInfo.push(column);
        }
        this.Layout_map.enabled = true;
        this.Layout_map.updateLayout();
    }

    playRippleAnimation() {
        // empty
    }

    CreateSnake() {
        this.Layout_snake.node.width = this.levelInfo.XSize * this.node_item.width;
        this.Layout_snake.node.height = this.levelInfo.YSize * this.node_item.height;
        GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.notifySnakeNum, this.levelInfo.Arrows.length, this.levelInfo.Arrows.length);
        for (var i = 0; i < this.levelInfo.Arrows.length; i++) {
            var node = new cc.Node();
            var snakeComp = node.addComponent(snake);
            snakeComp.setGameManager(this);
            this.Layout_snake.node.addChild(node);
            snakeComp.Init(i, this.levelInfo, node, this.Layout_map.node);
            this.snakes.push(snakeComp);
        }
    }

    createObstacles() {
        var self = this;
        if (this.levelInfo.WayBlockers) {
            var gameMgr = this;
            ResMgr.getInstance().loadRes("prefab/item_zhanai", cc.Prefab, null, "game").then(function (prefab: cc.Prefab) {
                if (prefab) {
                    self.prefab_zhanai = prefab;
                    for (var i = 0; i < self.levelInfo.WayBlockers.length; i++) {
                        var data = self.levelInfo.WayBlockers[i];
                        var node = cc.instantiate(self.prefab_zhanai);
                        node.parent = self.Layout_snake.node;
                        var comp = node.getComponent(zhanai);
                        self.zhanai.push(comp);
                        comp.setGameManager(gameMgr);
                        comp.Init(data);
                    }
                }
            });
        }
    }

    createHeidong() {
        var self = this;
        if (this.levelInfo.BlackHoles) {
            var gameMgr = this;
            ResMgr.getInstance().loadRes("prefab/item_heidong", cc.Prefab, null, "game").then(function (prefab: cc.Prefab) {
                if (prefab) {
                    self.prefab_zhanai = prefab;
                    for (var i = 0; i < self.levelInfo.BlackHoles.length; i++) {
                        var node = cc.instantiate(self.prefab_zhanai);
                        node.parent = self.Layout_snake.node;
                        var comp = node.getComponent(heidong);
                        comp.setGameManager(gameMgr);
                        comp.Init(self.levelInfo.BlackHoles[i]);
                        self.heidong.push(comp);
                    }
                }
            });
        }
    }

    SliderValueChanged(slider: cc.Slider) {
        this.node.x = 0;
        this.node.y = 0;
        this.Layout_snake.node.scale = slider.progress;
        this.Layout_map.node.scale = slider.progress;
    }

    onSnakeDestroyed(snakeComp: snake) {
        GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.notifySnakeNumChange);
        var index = this.snakes.indexOf(snakeComp);
        var snakeInfo2 = this.snakes[index].snakeInfo2;
        for (var i = 0; i < snakeInfo2.length; i++) {
            this.num_mapInfo[snakeInfo2[i].x][snakeInfo2[i].y] = "0";
        }
        this.num_audioID++;
        if (this.num_audioID > 7) {
            this.num_audioID = 1;
        }
        AudioMgr.getInstance().playEffect("audio/snakeMove/" + this.num_audioID, InterfaceMgr.bundleName.game);
    }

    showTips() {
        for (var i = 0; i < this.snakes.length; i++) {
            if (this.snakes[i].snakeState != snakeState.dead && !this.snakes[i].checkZhanai().hasCollision) {
                var head = this.snakes[i].node_allbody[0];
                if (head) {
                    var worldPos = head.convertToWorldSpaceAR(cc.Vec2.ZERO);
                    var nodeWorldPos = this.node.parent.convertToWorldSpaceAR(cc.Vec2.ZERO);
                    var offset = nodeWorldPos.subtract(worldPos);
                    this.node.x += offset.x;
                    this.node.y += offset.y;
                }
                this.snakes[i].showTip();
                return;
            }
        }
    }

    showChange() {
        this.clickState = ClickState.change;
    }

    showYichu() {
        this.clickState = ClickState.yichu;
    }

    setState(state: ClickState) {
        this.clickState = state;
    }

    showFuzhuxian() {
        for (var i = 0; i < this.snakes.length; i++) {
            var snakeComp = this.snakes[i];
            if (this.bool_fuzhulineisOpen) {
                snakeComp.CloseFuzhuline();
            } else {
                snakeComp.ShowFuzhuline();
            }
        }
        this.bool_fuzhulineisOpen = !this.bool_fuzhulineisOpen;
    }

    CloseFuzhuxian() {
        this.bool_fuzhulineisOpen = false;
        for (var i = 0; i < this.snakes.length; i++) {
            this.snakes[i].CloseFuzhuline();
        }
    }

    showPenzhuang(...args: any[]) {
        var pos = args[0];
        var mapValue = this.num_mapInfo[pos.x][pos.y];
        if (mapValue != "x") {
            var parts = mapValue.split("_");
            var snakeComp = this.snakes[Number(parts[0])];
            snakeComp.showPengzhuan();
        }
    }

    ShowSelfEndAni() {
        var self = this;
        cc.tween(this.node).to(0.3, {
            scale: this.num_minScale,
            position: cc.v3(0, 0)
        }).start();
        var centerX = Math.floor(this.levelInfo.XSize / 2);
        var centerY = Math.floor(this.levelInfo.YSize / 2);
        var maxRadius = Math.max(centerX, centerY) + 5;
        var totalTime = 0.6000000000000001 + 0.05 * maxRadius;
        var completed = 0;
        var totalAnimations = 0;
        for (var radius = 0; radius <= maxRadius; radius++) {
            var delayTime = 0.05 * radius + 0.5;
            for (var x = 0; x < this.levelInfo.XSize; x++) {
                for (var y = 0; y < this.levelInfo.YSize; y++) {
                    var distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                    if (distance >= radius && distance < radius + 2) {
                        var index = y * this.levelInfo.XSize + x;
                        var item = this.Layout_map.node.children[index];
                        if (item) {
                            var dian = item.getChildByName("dian");
                            if (dian) {
                                totalAnimations++;
                                cc.tween(dian).delay(delayTime).to(0.1, {
                                    scale: 2,
                                    opacity: 255
                                }).to(0.3, {
                                    scale: 1,
                                    opacity: 100
                                }).to(0.2, {
                                    scale: 0.5,
                                    opacity: 0
                                }).call(function () {
                                    completed++;
                                    if (completed === totalAnimations) {
                                        self.recycleNode();
                                    }
                                }).start();
                            }
                        }
                    }
                }
            }
        }
        this.scheduleOnce(function () {
            if (completed < totalAnimations) {
                console.warn("动画未完全完成，强制执行回收");
                self.recycleNode();
            }
        }, totalTime + 1);
    }

    recycleNode() {
        // empty
    }

    onDestroy() {
        this.EventRemove();
        this.node.off(cc.Node.EventType.TOUCH_START, this.tc_start, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.tc_move, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.tc_end, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.tc_end, this);
        this.unscheduleAllCallbacks();
    }

    showSelfAni() {
        this.node.scale = this.num_minScale + 1;
        cc.tween(this.node).to(0.6, {
            scale: this.num_minScale
        }).start();
    }
}