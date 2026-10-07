import AudioMgr from "./AudioMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import Heidong from "./heidong";
import { bundleName, gameEvent } from "./InterfaceMgr";
import NodePoolMgr from "./NodePoolMgr";
import ResMgr from "./ResMgr";
import Snake, { snakeState } from "./snake";
import UserData from "./UserData";
import Zhanai from "./zhanai";

const { ccclass, property } = cc._decorator;

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

@ccclass
export default class Game extends cc.Component {
    @property(cc.Layout)
    Layout_snake: cc.Layout | null = null;

    @property(cc.Layout)
    Layout_map: cc.Layout | null = null;

    @property(cc.Node)
    node_fuzhuline: cc.Node | null = null;

    @property(cc.Node)
    node_item: cc.Node | null = null;

    levelInfo: any = null;
    num_mapInfo: string[][] = [];
    clickState = ClickState.norlmal;
    snakes: Snake[] = [];
    zhanai: Zhanai[] = [];
    heidong: Heidong[] = [];
    bool_moveflag = false;
    prefab_zhanai: cc.Prefab | null = null;
    num_audioID = 0;
    num_minScale = 0;
    bool_canmove = true;
    _bool_fuzhulineisOpen = false;
    obj_size: { width: number; height: number } | null = null;
    doubleFlag = -1;
    pointsDis = 0;

    get bool_fuzhulineisOpen(): boolean {
        return this._bool_fuzhulineisOpen;
    }

    set bool_fuzhulineisOpen(value: boolean) {
        this._bool_fuzhulineisOpen = value;
        GlobalEventMgr.getInstance().emit(gameEvent.fuzhulineState, this.bool_fuzhulineisOpen);
    }

    onLoad(): void {
        console.log("size", NodePoolMgr.getInstance().pool_map.size);
        this.EventAdd();
    }

    TouchEventAdd(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.tc_start, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.tc_move, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.tc_end, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.tc_end, this);
    }

    EventAdd(): void {
        GlobalEventMgr.getInstance().on(gameEvent.gameAdTips, this.showTips, this);
        GlobalEventMgr.getInstance().on(gameEvent.gameAdChnage, this.showChange, this);
        GlobalEventMgr.getInstance().on(gameEvent.gameAdYichu, this.showYichu, this);
        GlobalEventMgr.getInstance().on(gameEvent.gameAdFuzhuxian, this.showFuzhuxian, this);
        GlobalEventMgr.getInstance().on(gameEvent.snakeTouchSnake, this.showPenzhuang, this);
        GlobalEventMgr.getInstance().on(gameEvent.notifyGameNoMove, this.onNotifyGameNoMove, this);
        GlobalEventMgr.getInstance().on(gameEvent.notifyGameCanMove, this.onNotifyGameCanMove, this);
        GlobalEventMgr.getInstance().on(gameEvent.gameWin, this.ShowSelfEndAni, this);
    }

    EventRemove(): void {
        GlobalEventMgr.getInstance().off(gameEvent.gameAdTips, this.showTips, this);
        GlobalEventMgr.getInstance().off(gameEvent.gameAdChnage, this.showChange, this);
        GlobalEventMgr.getInstance().off(gameEvent.gameAdYichu, this.showYichu, this);
        GlobalEventMgr.getInstance().off(gameEvent.gameAdFuzhuxian, this.showFuzhuxian, this);
        GlobalEventMgr.getInstance().off(gameEvent.snakeTouchSnake, this.showPenzhuang, this);
        GlobalEventMgr.getInstance().off(gameEvent.notifyGameNoMove, this.onNotifyGameNoMove, this);
        GlobalEventMgr.getInstance().off(gameEvent.notifyGameCanMove, this.onNotifyGameCanMove, this);
        GlobalEventMgr.getInstance().off(gameEvent.gameWin, this.ShowSelfEndAni, this);
    }

    onNotifyGameNoMove(): void {
        console.log("no move");
        this.bool_canmove = false;
    }

    onNotifyGameCanMove(): void {
        console.log("canmove");
        this.bool_canmove = true;
    }

    start(): void {
        this.CreateMap();
        this.CreateSnake();
        this.createObstacles();
        this.createHeidong();
        const scrollView = this.node.getChildByName("ScrollView");
        if (scrollView) {
            scrollView.width = 0;
            scrollView.height = 0;
        }
        this.obj_size = {
            width: this.node.width,
            height: this.node.height,
        };
        this.node.width = 5000;
        this.node.height = 5000;
        this.TouchEventAdd();
        this.showSelfAni();
    }

    tc_start(event: cc.Event.EventTouch): void {
        console.log("start111111111111111111");
        this.pointsDis = 0;
        const touches = event.getTouches();
        if (touches.length >= 2) {
            const p1 = this.node.convertToNodeSpaceAR(touches[0].getLocation());
            const p2 = this.node.convertToNodeSpaceAR(touches[1].getLocation());
            this.pointsDis = p1.sub(p2).mag();
        }
    }

    tc_move(event: cc.Event.EventTouch): void {
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

    handlePinch2(event: cc.Event.EventTouch): void {
        const touches = event.getTouches();
        if (touches.length < 2) {
            return;
        }
        const p1 = this.node.convertToNodeSpaceAR(touches[0].getLocation());
        const p2 = this.node.convertToNodeSpaceAR(touches[1].getLocation());
        const distance = p1.sub(p2).mag();
        if (this.pointsDis <= 0) {
            this.pointsDis = distance;
        } else {
            const scaleFactor = 1 + 0.8 * (distance / this.pointsDis - 1);
            const newScale = this.node.scale * scaleFactor;
            this.node.scale = Math.min(Math.max(newScale, this.num_minScale), this.num_minScale + 1);
            this.pointsDis = distance;
        }
    }

    handlePinch(event: cc.Event.EventTouch): void {
        const touches = event.getTouches();
        if (touches.length < 2) {
            return;
        }
        const p1 = touches[0].getLocation();
        const p2 = touches[1].getLocation();
        const distance = p1.sub(p2).mag();
        if (this.pointsDis <= 0) {
            this.pointsDis = distance;
        } else {
            const scaleFactor = 1 + 0.8 * (distance / this.pointsDis - 1);
            const newScale = this.node.scale * scaleFactor;
            this.node.scale = Math.min(Math.max(newScale, this.num_minScale), this.num_minScale + 1);
            this.pointsDis = distance;
        }
    }

    tc_end(): void {
        this.doubleFlag = -1;
        GlobalEventMgr.getInstance().emit(gameEvent.gameScaleChange, { scale: this.node.scale });
    }

    resetPos(): void {
        const halfParentW = this.node.parent.width / 2;
        const halfParentH = this.node.parent.height / 2;
        const halfNodeW = (this.node.width * this.node.scale) / 2;
        const halfNodeH = (this.node.height * this.node.scale) / 2;
        const maxX = Math.max(0, halfParentW - halfNodeW);
        const maxY = Math.max(0, halfParentH - halfNodeH);
        this.node.x = Math.min(maxX, Math.max(-maxX, this.node.x));
        this.node.y = Math.min(maxY, Math.max(-maxY, this.node.y));
    }

    restrictNodePosition(): void {
        if (!this.obj_size || !this.node.parent) {
            return;
        }
        const offsetX = (this.node.scale - this.num_minScale) * this.obj_size.width / 2;
        const offsetY = (this.node.scale - this.num_minScale) * this.obj_size.height / 2;
        const maxX = offsetX + this.node.parent.width / 2;
        const maxY = offsetY + this.node.parent.height / 2;
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

    CreateMap(): void {
        if (!this.node_item || !this.Layout_map) {
            return;
        }
        this.node.width = this.levelInfo.XSize * this.node_item.width;
        this.node.height = this.levelInfo.YSize * this.node_item.height;
        this.Layout_map.node.width = this.levelInfo.XSize * this.node_item.width;
        this.Layout_map.node.height = this.levelInfo.YSize * this.node_item.height;
        this.Layout_map.enabled = false;
        const colorMode = UserData.getInstance().colorMode;
        for (let x = 0; x < this.levelInfo.XSize; x++) {
            const row: string[] = [];
            for (let y = 0; y < this.levelInfo.YSize; y++) {
                const item = cc.instantiate(this.node_item);
                item.name = this.Layout_map.node.childrenCount.toString();
                item.parent = this.Layout_map.node;
                item.active = true;
                if (colorMode) {
                    const dot = item.getChildByName("dian");
                    if (dot) {
                        dot.color = cc.color(50, 52, 80);
                    }
                }
                row.push("0");
            }
            this.num_mapInfo.push(row);
        }
        this.Layout_map.enabled = true;
        this.Layout_map.updateLayout();
    }

    playRippleAnimation(): void {
    }

    CreateSnake(): void {
        if (!this.Layout_snake || !this.Layout_map) {
            return;
        }
        this.Layout_snake.node.width = this.levelInfo.XSize * this.node_item!.width;
        this.Layout_snake.node.height = this.levelInfo.YSize * this.node_item!.height;
        GlobalEventMgr.getInstance().emit(
            gameEvent.notifySnakeNum,
            this.levelInfo.Arrows.length,
            this.levelInfo.Arrows.length
        );
        for (let i = 0; i < this.levelInfo.Arrows.length; i++) {
            const node = new cc.Node();
            const snake = node.addComponent(Snake);
            snake.setGameManager(this);
            this.Layout_snake.node.addChild(node);
            snake.Init(i, this.levelInfo, node, this.Layout_map.node);
            this.snakes.push(snake);
        }
    }

    createObstacles(): void {
        if (!this.levelInfo.WayBlockers) {
            return;
        }
        const self = this;
        ResMgr.getInstance().loadRes("prefab/item_zhanai", cc.Prefab, null, "game").then((prefab) => {
            if (prefab) {
                self.prefab_zhanai = prefab;
                for (let i = 0; i < self.levelInfo.WayBlockers.length; i++) {
                    const blockerIndex = self.levelInfo.WayBlockers[i];
                    const node = cc.instantiate(self.prefab_zhanai);
                    node.parent = self.Layout_snake!.node;
                    const zhanai = node.getComponent(Zhanai)!;
                    self.zhanai.push(zhanai);
                    zhanai.setGameManager(self);
                    zhanai.Init(blockerIndex);
                }
            }
        });
    }

    createHeidong(): void {
        if (!this.levelInfo.BlackHoles) {
            return;
        }
        const self = this;
        ResMgr.getInstance().loadRes("prefab/item_heidong", cc.Prefab, null, "game").then((prefab) => {
            if (prefab) {
                self.prefab_zhanai = prefab;
                for (let i = 0; i < self.levelInfo.BlackHoles.length; i++) {
                    const node = cc.instantiate(self.prefab_zhanai);
                    node.parent = self.Layout_snake!.node;
                    const heidong = node.getComponent(Heidong)!;
                    heidong.setGameManager(self);
                    heidong.Init(self.levelInfo.BlackHoles[i]);
                    self.heidong.push(heidong);
                }
            }
        });
    }

    SliderValueChanged(slider: cc.Slider): void {
        this.node.x = 0;
        this.node.y = 0;
        if (this.Layout_snake) {
            this.Layout_snake.node.scale = slider.progress;
        }
        if (this.Layout_map) {
            this.Layout_map.node.scale = slider.progress;
        }
    }

    onSnakeDestroyed(snake: Snake): void {
        GlobalEventMgr.getInstance().emit(gameEvent.notifySnakeNumChange);
        const index = this.snakes.indexOf(snake);
        const snakeInfo = this.snakes[index].snakeInfo2;
        for (let i = 0; i < snakeInfo.length; i++) {
            this.num_mapInfo[snakeInfo[i].x][snakeInfo[i].y] = "0";
        }
        this.num_audioID++;
        if (this.num_audioID > 7) {
            this.num_audioID = 1;
        }
        AudioMgr.getInstance().playEffect("audio/snakeMove/" + this.num_audioID, bundleName.game);
    }

    showTips(): void {
        for (let i = 0; i < this.snakes.length; i++) {
            if (this.snakes[i].snakeState != snakeState.dead && !this.snakes[i].checkZhanai().hasCollision) {
                const head = this.snakes[i].node_allbody[0];
                if (head && this.node.parent) {
                    const headWorld = head.convertToWorldSpaceAR(cc.Vec2.ZERO);
                    const parentWorld = this.node.parent.convertToWorldSpaceAR(cc.Vec2.ZERO).subtract(headWorld);
                    this.node.x += parentWorld.x;
                    this.node.y += parentWorld.y;
                }
                this.snakes[i].showTip();
                return;
            }
        }
    }

    showChange(): void {
        this.clickState = ClickState.change;
    }

    showYichu(): void {
        this.clickState = ClickState.yichu;
    }

    setState(state: ClickState): void {
        this.clickState = state;
    }

    showFuzhuxian(): void {
        for (let i = 0; i < this.snakes.length; i++) {
            const snake = this.snakes[i];
            if (this.bool_fuzhulineisOpen) {
                snake.CloseFuzhuline();
            } else {
                snake.ShowFuzhuline();
            }
        }
        this.bool_fuzhulineisOpen = !this.bool_fuzhulineisOpen;
    }

    CloseFuzhuxian(): void {
        this.bool_fuzhulineisOpen = false;
        for (let i = 0; i < this.snakes.length; i++) {
            this.snakes[i].CloseFuzhuline();
        }
    }

    showPenzhuang(...args: any[]): void {
        const cell = args[0];
        const mapValue = this.num_mapInfo[cell.x][cell.y];
        if (mapValue != "x") {
            const parts = mapValue.split("_");
            const snake = this.snakes[Number(parts[0])];
            snake.showPengzhuan();
        }
    }

    ShowSelfEndAni(): void {
        cc.tween(this.node).to(0.3, {
            scale: this.num_minScale,
            position: cc.v3(0, 0),
        }).start();
        const centerX = Math.floor(this.levelInfo.XSize / 2);
        const centerY = Math.floor(this.levelInfo.YSize / 2);
        const maxRadius = Math.max(centerX, centerY) + 5;
        const timeout = 0.6000000000000001 + 0.05 * maxRadius;
        let completed = 0;
        let total = 0;
        for (let ring = 0; ring <= maxRadius; ring++) {
            const delay = 0.05 * ring + 0.5;
            for (let x = 0; x < this.levelInfo.XSize; x++) {
                for (let y = 0; y < this.levelInfo.YSize; y++) {
                    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                    if (distance >= ring && distance < ring + 2) {
                        const childIndex = y * this.levelInfo.XSize + x;
                        const cellNode = this.Layout_map!.node.children[childIndex];
                        if (cellNode) {
                            const dot = cellNode.getChildByName("dian");
                            if (dot) {
                                total++;
                                cc.tween(dot).delay(delay).to(0.1, {
                                    scale: 2,
                                    opacity: 255,
                                }).to(0.3, {
                                    scale: 1,
                                    opacity: 100,
                                }).to(0.2, {
                                    scale: 0.5,
                                    opacity: 0,
                                }).call(() => {
                                    completed++;
                                    if (completed === total) {
                                        this.recycleNode();
                                    }
                                }).start();
                            }
                        }
                    }
                }
            }
        }
        this.scheduleOnce(() => {
            if (completed < total) {
                console.warn("动画未完全完成，强制执行回收");
                this.recycleNode();
            }
        }, timeout + 1);
    }

    recycleNode(): void {
    }

    onDestroy(): void {
        this.EventRemove();
        this.node.off(cc.Node.EventType.TOUCH_START, this.tc_start, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.tc_move, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.tc_end, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.tc_end, this);
        this.unscheduleAllCallbacks();
    }

    showSelfAni(): void {
        this.node.scale = this.num_minScale + 1;
        cc.tween(this.node).to(0.6, {
            scale: this.num_minScale,
        }).start();
    }
}
