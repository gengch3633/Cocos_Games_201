import { ClickState } from "./game";
import AudioMgr from "./AudioMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import { bundleName, gameEvent } from "./InterfaceMgr";
import MultiPlatform from "./MultiPlatform";
import ResMgr from "./ResMgr";
import SpriteFrames from "./SpriteFrames";
import UserData from "./UserData";

export enum Bodyparts {
    头_上 = 0,
    头_下 = 1,
    头_左 = 2,
    头_右 = 3,
    身体_右右 = 4,
    身体_下右 = 5,
    身体_上右 = 6,
    身体_左左 = 7,
    身体_下左 = 8,
    身体_上左 = 9,
    身体_上上 = 10,
    身体_右上 = 11,
    身体_左上 = 12,
    身体_下下 = 13,
    身体_右下 = 14,
    身体_左下 = 15,
    尾_上 = 16,
    尾_下 = 17,
    尾_左 = 18,
    尾_右 = 19,
}

export enum Direction {
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3,
}

export enum snakeState {
    norlmal = 0,
    dead = 1,
}

const { ccclass } = cc._decorator;

@ccclass
export default class Snake extends cc.Component {
    id: any = 0;

    prefab_item: any = null;

    node_map: any = null;

    parent_snake: any = null;

    levelInfo: any = null;

    snakeInfo2: any = [];

    node_allbody: any = [];

    direction: any = null;

    num_movedistance: any = 50;

    bool_moveflag: any = ! 1;

    gameManager: any = null;

    action: any = [];

    snakeState: snakeState = snakeState.norlmal;

    node_fuzhuline: any = null;

    color_red: any = cc.color(255, 75, 93);

    color_black: any = cc.color(17, 20, 51);

    color_blue: any = cc.color(61, 83, 183);

    snakeColor: any = cc.color(17, 20, 51);

    num_clicktime: any = - 1;

    tipsTween: any = [];

    bool_iserrored: any = ! 1;

    bool_longtouchShowFuzhulline: any = ! 1;

    bool_needShowTuowei: any = ! 0;

    bool_isLongtimeTouch: any = ! 1;

    _parseHexColor(e) {
        if(! e|| "string" != typeof e|| e.length < 6) return cc.color(17, 20, 51);
            var t = parseInt(e.substring(0, 2), 16),
            i = parseInt(e.substring(2, 4), 16),
            n = parseInt(e.substring(4, 6), 16);
            return isNaN(t)|| isNaN(i)|| isNaN(n)? cc.color(17, 20, 51): cc.color(t, i, n);
    }

    Init(e, t, i, n) {
        var a = this;
            this.id = e;
            this.levelInfo = t;
            this.node_map = n;
            this.parent_snake = i;
            var o = this.levelInfo.Arrows[this.id];
            UserData.getInstance().colorMode&& o&& "string" == typeof o.Color&& (this.snakeColor = this._parseHexColor(o.Color));
            ResMgr.getInstance().loadRes("prefab/item", cc.Prefab, null, "game").then(function(e) {
              if(e) {
                a.prefab_item = e;
                a.ShowSnake();
                a.getNodePos({
                  x: 1, y: 1
                }
        );
                a.determineDirection();
                a.ShowFuzhuline2();
              }
            }
        );
    }

    setGameManager(e) {
        this.gameManager = e;
    }

    touch_start() {
        if(! this.bool_moveflag) {
              this.bool_isLongtimeTouch = ! 1;
              this.scheduleOnce(this.showFuzhuline, .8);
            }
    }

    showFuzhuline() {
        this.bool_longtouchShowFuzhulline = ! 0;
            this.bool_isLongtimeTouch = ! 0;
            this.node_fuzhuline&& (this.node_fuzhuline.active = ! 0);
            for(var e = 0;
            e < this.node_allbody.length;
            e++) this.node_allbody[e].getChildByName("show").color = this.color_blue;
    }

    touch_move(e) {
        var t = ! 1;
            this.node_allbody.forEach(function(i) {
              i.getBoundingBoxToWorld().contains(e.getLocation())&& (t = ! 0);
            }
        );
            if(! t) {
              console.log("touch_move,移走了  取消事件");
              this.bool_longtouchShowFuzhulline&& this.node_fuzhuline&& (this.node_fuzhuline.active = ! 1);
              this.node_fuzhuline&& (this.node_fuzhuline.active = ! 1);
              this.unschedule(this.showFuzhuline);
              for(var i = 0;
              i < this.node_allbody.length;
              i++) this.node_allbody[i].getChildByName("show").color = this.bool_iserrored? this.color_red: this.snakeColor;
            }
    }

    touch_end() {
        console.log("tc_end");
            if(! this.bool_moveflag) {
              this.unschedule(this.showFuzhuline);
              if(this.gameManager.clickState == ClickState.change) {
                AudioMgr.getInstance().playClickEff();
                this.ShowChange();
                this.gameManager.setState(ClickState.norlmal);
              } else if(this.gameManager.clickState == ClickState.yichu) {
                this.ShowYichu();
                this.gameManager.setState(ClickState.norlmal);
              } else if(this.bool_isLongtimeTouch) {
                this.bool_longtouchShowFuzhulline&& this.node_fuzhuline&& (this.node_fuzhuline.active = ! 1);
                GlobalEventMgr.getInstance().emit(gameEvent.notifyGameCanMove);
                this.bool_isLongtimeTouch = ! 1;
                for(var e = 0;
                e < this.node_allbody.length;
                e++) this.node_allbody[e].getChildByName("show").color = this.bool_iserrored? this.color_red: this.snakeColor;
              } else this.snakeMove();
              GlobalEventMgr.getInstance().emit(gameEvent.notifySnakeTouch, this.id);
            }
    }

    touch_cancle() {
        this.bool_longtouchShowFuzhulline&& this.node_fuzhuline&& (this.node_fuzhuline.active = ! 1);
            console.log("tc_cancle");
            this.unschedule(this.showFuzhuline);
            this.node_fuzhuline&& (this.node_fuzhuline.active = ! 1);
            this.bool_isLongtimeTouch = ! 1;
            GlobalEventMgr.getInstance().emit(gameEvent.notifyGameCanMove);
            for(var e = 0;
            e < this.node_allbody.length;
            e++) this.node_allbody[e].getChildByName("show").color = this.snakeColor;
    }

    ShowSnake() {
        for(var e = this, t = 0;
            t < this.levelInfo.Arrows[this.id].Indices.length;
            t++) {
              var i = this.levelInfo.Arrows[this.id].Indices[t],
              n = cc.instantiate(this.prefab_item);
              this.parent_snake.addChild(n);
              this.gameManager.Layout_map.node.children[i].getChildByName("dian").opacity = 255;
              n.active = ! 1;
              var a = i% this.levelInfo.XSize,
              o = Math.floor(i/ this.levelInfo.XSize);
              this.gameManager.num_mapInfo[a][o] = this.id+ "_"+ t;
              n.setPosition(this.getNodePos({
                x: a, y: o
              }
        ));
              this.snakeInfo2.push({
                x: a, y: o
              }
        );
              this.node_allbody.push(n);
              n.getChildByName("show").color = this.snakeColor;
              n.on(cc.Node.EventType.TOUCH_START, this.touch_start, this);
              n.on(cc.Node.EventType.TOUCH_MOVE, this.touch_move, this);
              n.on(cc.Node.EventType.TOUCH_END, this.touch_end, this);
              n.on(cc.Node.EventType.TOUCH_CANCEL, this.touch_cancle, this);
            }
            for(var r = 0, s = .3/ this.levelInfo.Arrows[this.id].Indices.length, l = function(t, i) {
              var n = c.node_allbody[t];
              c.scheduleOnce(function() {
                r+= 1;
                n.active = ! 0;
                r > 1&& e.updatePartialSnakeSkin();
              }
        , s* i);
            }
        , c = this, u = this.node_allbody.length- 1, d = 0;
            u >= 0;
            u--, d++) l(u, d);
    }

    updatePartialSnakeSkin() {
        var e = this.node_allbody.filter(function(e) {
              return e.active;
            }
        );
            if(0 !== e.length) for(var t = 0;
            t < e.length;
            t++) {
              var i = e[t],
              a = null,
              o = this.node_allbody.indexOf(i),
              r = o > 0? this.snakeInfo2[o- 1]: null,
              s = this.snakeInfo2[o],
              l = o < this.snakeInfo2.length- 1? this.snakeInfo2[o+ 1]: null,
              c = null !== r&& this.node_allbody[o- 1].active,
              u = null !== l&& this.node_allbody[o+ 1].active;
              if(c|| u) {
                var d = c? r: null,
                h = u? l: null;
                a = this.getBodyType(d, s, h);
              } else a = Bodyparts.尾_右;
              this.changeSpr(a, i);
            }
    }

    updateSnakeSkinByData() {
        
    }

    errorAni(): Promise<void> {
        MultiPlatform.getInstance().vibrateEnabled &&
            UserData.getInstance().shake &&
            MultiPlatform.getInstance().vibrateLong();
        AudioMgr.getInstance().playEffect("audio/click_wrong_arrow", bundleName.game);
        return new Promise((resolve) => {
            let offsetX = 0;
            let offsetY = 0;
            switch (this.direction) {
                case Direction.Left:
                    offsetX = -this.num_movedistance / 2;
                    break;
                case Direction.Right:
                    offsetX = this.num_movedistance / 2;
                    break;
                case Direction.Up:
                    offsetY = this.num_movedistance / 2;
                    break;
                case Direction.Down:
                    offsetY = -this.num_movedistance / 2;
                    break;
            }
            let finished = 0;
            const total = this.node_allbody.length;
            this.bool_iserrored = true;
            for (let i = 0; i < this.node_allbody.length; i++) {
                const bodyNode = this.node_allbody[i];
                bodyNode.getChildByName("show").color = this.color_red;
                cc.tween(bodyNode)
                    .delay(0.1)
                    .by(0.1, { x: offsetX, y: offsetY })
                    .by(0.1, { x: -offsetX, y: -offsetY })
                    .call(() => {
                        if (++finished === total) {
                            resolve();
                        }
                    })
                    .start();
            }
            if (total === 0) {
                resolve();
            }
        });
    }

    async snakeMove(): Promise<void> {
        MultiPlatform.getInstance().vibrateEnabled &&
            UserData.getInstance().shake &&
            MultiPlatform.getInstance().vibrateShort();
        this.bool_moveflag = true;
        const result = this.checkZhanai();

        if (result.hasCollision) {
            if (result.distance > 0) {
                let remaining = result.distance;
                for (let step = 0; step < result.distance; step++) {
                    await this.move();
                    if (--remaining <= 0) {
                        this._vibrateOnCollision();
                        GlobalEventMgr.getInstance().emit(gameEvent.snakeTouchSnake, result.collisionPos);
                        await this.errorAni();
                        GlobalEventMgr.getInstance().emit(gameEvent.gameFail, this.id);
                        await this.huitui();
                        break;
                    }
                }
            } else {
                this._vibrateOnCollision();
                GlobalEventMgr.getInstance().emit(gameEvent.snakeTouchSnake, result.collisionPos);
                await this.errorAni();
                GlobalEventMgr.getInstance().emit(gameEvent.gameFail, this.id);
            }
            this.bool_moveflag = false;
            return;
        }

        this.snakeState = snakeState.dead;
        this.gameManager.onSnakeDestroyed(this);
        this.node_fuzhuline.opacity = 0;
        for (let n = 0; n < this.node_allbody.length; n++) {
            const showNode = this.node_allbody[n].getChildByName("show");
            cc.tween(showNode)
                .to(0.2, { color: cc.color(61, 83, 183) })
                .to(0.2, { color: this.snakeColor })
                .start();
        }
        for (let n = 0; n < 200; n++) {
            await this.move();
        }
    }

    move(): Promise<void> {
        return new Promise((resolve) => {
            const snapshot = this.snakeInfo2.slice();
            const head = this.snakeInfo2[0];
            const headX = head.x;
            const headY = head.y;
            let nextHead: { x: number; y: number } | null = null;
            switch (this.direction) {
                case Direction.Left:
                    nextHead = { x: headX - 1, y: headY };
                    break;
                case Direction.Right:
                    nextHead = { x: headX + 1, y: headY };
                    break;
                case Direction.Up:
                    nextHead = { x: headX, y: headY + 1 };
                    break;
                case Direction.Down:
                    nextHead = { x: headX, y: headY - 1 };
                    break;
            }
            const movePromises: Promise<void>[] = [];
            this.snakeInfo2 = [nextHead!].concat(snapshot.slice(0, snapshot.length - 1));
            const tail = this.snakeInfo2[this.snakeInfo2.length - 1];
            if (
                tail &&
                this.gameManager.num_mapInfo &&
                this.gameManager.num_mapInfo[tail.x] &&
                this.gameManager.num_mapInfo[tail.x][tail.y] !== undefined
            ) {
                const tailIndex = tail.y * this.levelInfo.XSize + tail.x;
                const tailCell = this.gameManager.Layout_map.node.children[tailIndex];
                if (this.bool_needShowTuowei) {
                    cc.tween(tailCell).to(0.2, { scale: 3 }).to(0.2, { scale: 1 }).start();
                }
            }
            this.snakeInfo2.forEach((pos, index) => {
                const bodyNode = this.node_allbody[index];
                const targetPos = this.getNodePos(pos);
                if (
                    this.gameManager.num_mapInfo &&
                    this.gameManager.num_mapInfo[pos.x] &&
                    this.gameManager.num_mapInfo[pos.x][pos.y] === "o"
                ) {
                    cc.director.once(cc.Director.EVENT_AFTER_UPDATE, () => {
                        bodyNode.active = false;
                    });
                    if (index === this.node_allbody.length - 1) {
                        this.bool_needShowTuowei = false;
                    }
                    const wormholes = this.gameManager.heidong.filter(
                        (hole) => hole.posInfo.x === pos.x && hole.posInfo.y === pos.y
                    );
                    if (index === 0) {
                        wormholes[0].showStartAni();
                    } else if (index === this.node_allbody.length - 1) {
                        wormholes[0].showEndAni();
                    }
                }
                movePromises.push(this.moveBody(bodyNode, targetPos));
            });
            Promise.all(movePromises).then(() => {
                this.action.push(snapshot);
                resolve();
            });
        });
    }

    getNodePos(e) {
        var t = this.node_map.children[0].position;
            return cc.v3(e.x* this.num_movedistance, e.y* this.num_movedistance, 0).addSelf(t);
    }

    moveBody(bodyNode: cc.Node, targetPos: cc.Vec3): Promise<void> {
        return new Promise((resolve) => {
            bodyNode.setPosition(targetPos);
            this.updateSnakeBody(bodyNode);
            cc.director.once(cc.Director.EVENT_AFTER_UPDATE, () => {
                resolve();
            });
        });
    }

    async huitui(): Promise<void> {
        for (let i = this.action.length - 1; i >= 0; i--) {
            const snapshot = this.action[i];
            this.snakeInfo2 = snapshot;
            const movePromises: Promise<void>[] = [];
            snapshot.forEach((pos, index) => {
                const bodyNode = this.node_allbody[index];
                const targetPos = this.getNodePos(pos);
                movePromises.push(this.moveBody(bodyNode, targetPos));
            });
            await Promise.all(movePromises);
        }
        this.action = [];
    }

    updateSnakeBody(e) {
        var t,
            i = this.node_allbody.indexOf(e);
            t = this.getBodyType(this.snakeInfo2[i- 1], this.snakeInfo2[i], this.snakeInfo2[i+ 1]);
            this.changeSpr(t, e);
    }

    _isOwnBody(e) {
        return "string" == typeof e&& e.startsWith(this.id+ "_");
    }

    _vibrateOnCollision() {
        var e = MultiPlatform.getInstance().vibrateEnabled,
            t = UserData.getInstance().shake;
            console.log("[vibrate] collision trigger, vibrateEnabled="+ e+ " shake="+ t+ " isNative="+ cc.sys.isNative+ " os="+ cc.sys.os);
            if(e&& t) if(cc.sys.isNative&& cc.sys.os === cc.sys.OS_ANDROID) {
              if("undefined" == typeof jsb|| ! jsb.reflection) {
                console.warn("[vibrate] jsb.reflection unavailable");
                return;
              }
              try {
                jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxHelper", "vibrate", "(F)V", .08);
                console.log("[vibrate] android (F)V ok");
                return;
              } catch(e) {
                console.warn("[vibrate] android (F)V failed:", e&& e.message|| e);
              }
              try {
                jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxHelper", "vibrate", "(J)V", 80);
                console.log("[vibrate] android (J)V ok");
                return;
              } catch(e) {
                console.warn("[vibrate] android (J)V failed:", e&& e.message|| e);
              }
              try {
                MultiPlatform.getInstance().vibrateShort();
                console.log("[vibrate] android fallback -> MultiPlatform.vibrateShort");
              } catch(e) {
                console.warn("[vibrate] android all paths failed:", e&& e.message|| e);
              }
            } else if(cc.sys.isNative&& cc.sys.os === cc.sys.OS_IOS) try {
              MultiPlatform.getInstance().vibrateShort();
              console.log("[vibrate] ios -> MultiPlatform.vibrateShort");
            } catch(e) {
              console.warn("[vibrate] ios failed:", e&& e.message|| e);
            } else try {
              if("undefined" != typeof navigator&& "function" == typeof navigator.vibrate) {
                var i = navigator.vibrate(80);
                console.log("[vibrate] web navigator.vibrate ok="+ i);
              } else {
                MultiPlatform.getInstance().vibrateShort();
                console.log("[vibrate] web -> MultiPlatform.vibrateShort (no navigator.vibrate)");
              }
            } catch(e) {
              console.warn("[vibrate] web failed:", e&& e.message|| e);
            }
    }

    checkZhanai() {
        var e = this.snakeInfo2[0],
            t = e.x,
            i = e.y;
            switch(this.direction) {
              case Direction.Left: for(var n = t- 1;
              n >= 0;
              n--) if((r = this.gameManager.num_mapInfo&& this.gameManager.num_mapInfo[n]&& this.gameManager.num_mapInfo[n][i])&& "0" !== r&& ! this._isOwnBody(r)) return "o" === r? {
                distance: t- n,
                hasCollision: ! 1,
                collisionPos: {
                  x: n,
                  y: i
                }
        ,
                isHeidong: ! 0
              }
        :(console.log("向左移动会在("+ n+ ","+ i+ ")遇到障碍物"), {
                distance: t- n- 1, hasCollision: ! 0, collisionPos: {
                  x: n, y: i
                }
              }
        );
              return {
                distance:- 1,
                hasCollision: ! 1,
                collisionPos: null
              }
        ;
              case Direction.Right: for(n = t+ 1;
              n <= this.levelInfo.XSize- 1;
              n++) if((r = this.gameManager.num_mapInfo&& this.gameManager.num_mapInfo[n]&& this.gameManager.num_mapInfo[n][i])&& "0" !== r&& ! this._isOwnBody(r)) return "o" === r? {
                distance: n- t,
                hasCollision: ! 1,
                collisionPos: {
                  x: n,
                  y: i
                }
        ,
                isHeidong: ! 0
              }
        :(console.log("向右移动会在("+ n+ ","+ i+ ")遇到障碍物"), {
                distance: n- t- 1, hasCollision: ! 0, collisionPos: {
                  x: n, y: i
                }
              }
        );
              return {
                distance:- 1,
                hasCollision: ! 1,
                collisionPos: null
              }
        ;
              case Direction.Up: for(var o = i+ 1;
              o <= this.levelInfo.YSize- 1;
              o++) if((r = this.gameManager.num_mapInfo&& this.gameManager.num_mapInfo[t]&& this.gameManager.num_mapInfo[t][o])&& "0" !== r&& ! this._isOwnBody(r)) return "o" === r? {
                distance: o- i,
                hasCollision: ! 1,
                collisionPos: {
                  x: t,
                  y: o
                }
        ,
                isHeidong: ! 0
              }
        :(console.log("向上移动会在("+ t+ ","+ o+ ")遇到障碍物"), {
                distance: o- i- 1, hasCollision: ! 0, collisionPos: {
                  x: t, y: o
                }
              }
        );
              return {
                distance:- 1,
                hasCollision: ! 1,
                collisionPos: null
              }
        ;
              case Direction.Down: for(o = i- 1;
              o >= 0;
              o--) {
                var r;
                if((r = this.gameManager.num_mapInfo&& this.gameManager.num_mapInfo[t]&& this.gameManager.num_mapInfo[t][o])&& "0" !== r&& ! this._isOwnBody(r)) return "o" === r? {
                  distance: i- o,
                  hasCollision: ! 1,
                  collisionPos: {
                    x: t,
                    y: o
                  }
        ,
                  isHeidong: ! 0
                }
        :(console.log("向下移动会在("+ t+ ","+ o+ ")遇到障碍物"), {
                  distance: i- o- 1, hasCollision: ! 0, collisionPos: {
                    x: t, y: o
                  }
                }
        );
              }
              return {
                distance:- 1,
                hasCollision: ! 1,
                collisionPos: null
              }
        ;
            }
    }

    updateSnakePosition() {
        for(var e = 0;
            e < this.node_allbody.length;
            e++) {
              var t,
              i = this.node_allbody[e];
              t = this.getBodyType(this.snakeInfo2[e- 1], this.snakeInfo2[e], this.snakeInfo2[e+ 1]);
              this.changeSpr(t, i);
            }
    }

    determineDirection() {
        if(!(this.snakeInfo2.length < 2)) {
              var e = this.snakeInfo2[0],
              t = this.snakeInfo2[1];
              t.x === e.x+ 1? this.direction = Direction.Left: t.x === e.x- 1? this.direction = Direction.Right: t.y === e.y+ 1? this.direction = Direction.Down: t.y === e.y- 1&& (this.direction = Direction.Up);
            }
    }

    changeSpr_liti(e, t) {
        var i = t.getChildByName("show").getComponent(SpriteFrames);
            switch(e) {
              case Bodyparts.头_上: i.setFrameByIndex(9);
              break;
              case Bodyparts.头_下: i.setFrameByIndex(6);
              break;
              case Bodyparts.头_左: i.setFrameByIndex(7);
              break;
              case Bodyparts.头_右: i.setFrameByIndex(8);
              break;
              case Bodyparts.身体_右右: i.setFrameByIndex(2);
              break;
              case Bodyparts.身体_下右: i.setFrameByIndex(1);
              break;
              case Bodyparts.身体_上右: i.setFrameByIndex(3);
              break;
              case Bodyparts.身体_左左: i.setFrameByIndex(2);
              break;
              case Bodyparts.身体_下左: i.setFrameByIndex(0);
              break;
              case Bodyparts.身体_上左: i.setFrameByIndex(4);
              break;
              case Bodyparts.身体_上上: i.setFrameByIndex(5);
              break;
              case Bodyparts.身体_右上: i.setFrameByIndex(0);
              break;
              case Bodyparts.身体_左上: i.setFrameByIndex(1);
              break;
              case Bodyparts.身体_下下: i.setFrameByIndex(5);
              break;
              case Bodyparts.身体_右下: i.setFrameByIndex(4);
              break;
              case Bodyparts.身体_左下: i.setFrameByIndex(3);
              break;
              case Bodyparts.尾_上: i.setFrameByIndex(13);
              break;
              case Bodyparts.尾_下: i.setFrameByIndex(10);
              break;
              case Bodyparts.尾_左: i.setFrameByIndex(11);
              break;
              case Bodyparts.尾_右: i.setFrameByIndex(12);
              break;
              default: console.error("出错了,请检查");
              i.setFrameByIndex(3);
            }
    }

    changeSpr(e, t) {
        var i = t.getChildByName("show").getComponent(SpriteFrames);
            switch(e) {
              case Bodyparts.头_上: i.setFrameByIndex(0);
              i.node.angle = 0;
              break;
              case Bodyparts.头_下: i.setFrameByIndex(0);
              i.node.angle = 180;
              break;
              case Bodyparts.头_左: i.setFrameByIndex(0);
              i.node.angle = 90;
              break;
              case Bodyparts.头_右: i.setFrameByIndex(0);
              i.node.angle = - 90;
              break;
              case Bodyparts.身体_右右: i.setFrameByIndex(2);
              i.node.angle = 90;
              break;
              case Bodyparts.身体_下右: i.setFrameByIndex(3);
              i.node.angle = 0;
              break;
              case Bodyparts.身体_上右: i.setFrameByIndex(3);
              i.node.angle = - 90;
              break;
              case Bodyparts.身体_左左: i.setFrameByIndex(2);
              i.node.angle = 90;
              break;
              case Bodyparts.身体_下左: i.setFrameByIndex(3);
              i.node.angle = 90;
              break;
              case Bodyparts.身体_上左: i.setFrameByIndex(3);
              i.node.angle = 180;
              break;
              case Bodyparts.身体_上上: i.setFrameByIndex(2);
              i.node.angle = 0;
              break;
              case Bodyparts.身体_右上: i.setFrameByIndex(3);
              i.node.angle = 90;
              break;
              case Bodyparts.身体_左上: i.setFrameByIndex(3);
              i.node.angle = 0;
              break;
              case Bodyparts.身体_下下: i.setFrameByIndex(2);
              i.node.angle = 0;
              break;
              case Bodyparts.身体_右下: i.setFrameByIndex(3);
              i.node.angle = 180;
              break;
              case Bodyparts.身体_左下: i.setFrameByIndex(3);
              i.node.angle = - 90;
              break;
              case Bodyparts.尾_上: i.setFrameByIndex(1);
              i.node.angle = 0;
              break;
              case Bodyparts.尾_下: i.setFrameByIndex(1);
              i.node.angle = 180;
              break;
              case Bodyparts.尾_左: i.setFrameByIndex(1);
              i.node.angle = 90;
              break;
              case Bodyparts.尾_右: i.setFrameByIndex(1);
              i.node.angle = - 90;
              break;
              default: console.error("出错了,请检查");
              i.setFrameByIndex(3);
            }
    }

    getBodyType(e, t, i) {
        if(null === e|| null == e) {
              if(i.x == t.x+ 1) return Bodyparts.头_左;
              if(i.x == t.x- 1) return Bodyparts.头_右;
              if(i.y == t.y+ 1) return Bodyparts.头_下;
              if(i.y == t.y- 1) return Bodyparts.头_上;
            }
            if(void 0 === i|| null == i) {
              if(e.x == t.x+ 1) return Bodyparts.尾_右;
              if(e.x == t.x- 1) return Bodyparts.尾_左;
              if(e.y == t.y+ 1) return Bodyparts.尾_上;
              if(e.y == t.y- 1) return Bodyparts.尾_下;
            }
            if(e.x == t.x+ 1) {
              if(i.x == t.x- 1) return Bodyparts.身体_右右;
              if(i.y == t.y+ 1) return Bodyparts.身体_下右;
              if(i.y == t.y- 1) return Bodyparts.身体_上右;
            } else if(e.x == t.x- 1) {
              if(i.x == t.x+ 1) return Bodyparts.身体_左左;
              if(i.y == t.y+ 1) return Bodyparts.身体_下左;
              if(i.y == t.y- 1) return Bodyparts.身体_上左;
            } else if(e.y == t.y+ 1) {
              if(i.y == t.y- 1) return Bodyparts.身体_上上;
              if(i.x == t.x+ 1) return Bodyparts.身体_左上;
              if(i.x == t.x- 1) return Bodyparts.身体_右上;
            } else if(e.y == t.y- 1) {
              if(i.y == t.y+ 1) return Bodyparts.身体_下下;
              if(i.x == t.x+ 1) return Bodyparts.身体_左下;
              if(i.x == t.x- 1) return Bodyparts.身体_右下;
            }
            console.error("出错了,请检查", new Error().stack);
            return null;
    }

    showTip() {
        for(var e = 0;
            e < this.node_allbody.length;
            e++) {
              var t = this.node_allbody[e];
              this.tipsTween[e]&& this.tipsTween[e].stop();
              this.tipsTween[e] = cc.tween(t.getChildByName("show")).to(.8, {
                color: cc.Color.GREEN
              }
        ).to(.8, {
                color: this.snakeColor
              }
        ).union().repeatForever().start();
            }
    }

    ShowChange() {
        for(var e = this, t = 0;
            t < this.node_allbody.length;
            t++) {
              var i = this.node_allbody[t];
              cc.tween(i).to(.3, {
                opacity: 0
              }
        ).delay(.3).to(.3, {
                opacity: 255
              }
        ).start();
            }
            this.scheduleOnce(function() {
              e.node_fuzhuline&& (e.node_fuzhuline.active = ! 1);
              var t = u(e.snakeInfo2).reverse(), i = u(e.node_allbody).reverse();
              e.snakeInfo2 = t;
              e.node_allbody = i;
              for(var n = 0;
              n < e.node_allbody.length;
              n++) {
                var a = e.node_allbody[n], o = e.getNodePos(e.snakeInfo2[n]);
                a.setPosition(o);
                a.getChildByName("show").color = e.snakeColor;
                a.setSiblingIndex(n);
                e.updateSnakeBody(a);
              }
              e.determineDirection();
              if(e.gameManager&& e.gameManager.num_mapInfo) {
                for(var r = 0;
                r < e.levelInfo.XSize;
                r++) for(var s = 0;
                s < e.levelInfo.YSize;
                s++) {
                  var l = e.gameManager.num_mapInfo[r][s];
                  l&& l.startsWith(e.id+ "_")&& (e.gameManager.num_mapInfo[r][s] = "0");
                }
                for(n = 0;
                n < e.snakeInfo2.length;
                n++) {
                  var c = e.snakeInfo2[n];
                  e.gameManager.num_mapInfo[c.x][c.y] = e.id+ "_"+ n;
                }
              }
              for(n = 0;
              n < e.node_allbody.length;
              n++) {
        (a = e.node_allbody[n]).off(cc.Node.EventType.TOUCH_END, e.touch_end, e);
                a.on(cc.Node.EventType.TOUCH_END, e.touch_end, e);
              }
            }
        , .4);
    }

    ShowYichu() {
        this.snakeState = snakeState.dead;
            this.gameManager.onSnakeDestroyed(this);
            for(var e = function(e) {
              var i = t.node_allbody[e];
              i.off(cc.Node.EventType.TOUCH_END, t.touch_end, t);
              cc.tween(i).to(.2, {
                opacity: 0
              }
        ).to(.2, {
                opacity: 255
              }
        ).to(.2, {
                opacity: 0
              }
        ).to(.2, {
                opacity: 255
              }
        ).to(.2, {
                opacity: 0
              }
        ).call(function() {
                i.x = 9999;
                i.active = ! 1;
              }
        ).start();
            }
        , t = this, i = 0;
            i < this.node_allbody.length;
            i++) e(i);
            this.node_fuzhuline&& (this.node_fuzhuline.x = 9999);
    }

    ShowFuzhuline() {
        this.node_fuzhuline&& (this.node_fuzhuline.active = ! 0);
    }

    CloseFuzhuLine() {
        this.node_fuzhuline&& (this.node_fuzhuline.active = ! 1);
    }

    ShowFuzhuline2() {
        null == this.node_fuzhuline&& null == this.node_fuzhuline|| 1 == this.node_fuzhuline.active&& (this.node_fuzhuline.active = ! 1);
            var e = cc.instantiate(this.gameManager.node_fuzhuline);
            e.parent = this.node.parent;
            var t = this.node_allbody[0].convertToWorldSpaceAR(cc.v2(0, 0)),
            i = this.node.parent.convertToNodeSpaceAR(t);
            e.setPosition(i);
            e.setSiblingIndex(0);
            switch(this.direction) {
              case Direction.Left: e.angle = 90;
              break;
              case Direction.Right: e.angle = - 90;
              break;
              case Direction.Up: e.angle = 0;
              break;
              case Direction.Down: e.angle = 180;
            }
            e.active = ! 1;
            this.node_fuzhuline = e;
    }

    CloseFuzhuline() {
        null == this.node_fuzhuline&& null == this.node_fuzhuline|| 1 == this.node_fuzhuline.active&& (this.node_fuzhuline.active = ! 1);
    }

    showPengzhuan() {
        for(var e = 0;
            e < this.node_allbody.length;
            e++) {
              var t = this.node_allbody[e].getChildByName("show");
              cc.tween(t).delay(.2).to(.2, {
                color: this.color_red
              }
        ).to(.2, {
                color: this.snakeColor
              }
        ).start();
            }
    }

}
