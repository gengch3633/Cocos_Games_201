import AudioMgr from "./AudioMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import MultiPlatform from "./MultiPlatform";
import ResMgr from "./ResMgr";
import SpriteFrames from "./SpriteFrames";
import UserData from "./UserData";
import game from "./game";

declare const jsb: any;

const { ccclass, property } = cc._decorator;

interface GridPos {
    x: number;
    y: number;
}

interface LevelArrow {
    Indices: number[];
    Color?: string;
}

interface LevelInfo {
    Arrows: { [id: number]: LevelArrow };
    XSize: number;
    YSize: number;
}

interface ZhanaiResult {
    distance: number;
    hasCollision: boolean;
    collisionPos: GridPos | null;
    isHeidong?: boolean;
}

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
    西北 = 20,
    东北 = 21,
    西南 = 22,
    东南 = 23
}

export enum Direction {
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3
}

export enum snakeState {
    norlmal = 0,
    dead = 1
}

@ccclass
export default class snake extends cc.Component {

    public id: number = 0;
    public prefab_item: cc.Prefab = null;
    public node_map: cc.Node = null;
    public parent_snake: cc.Node = null;
    public levelInfo: LevelInfo = null;
    public snakeInfo2: GridPos[] = [];
    public node_allbody: cc.Node[] = [];
    public direction: Direction = null;
    public num_movedistance: number = 50;
    public bool_moveflag: boolean = false;
    public gameManager: any = null;
    public action: GridPos[][] = [];
    public snakeState: snakeState = snakeState.norlmal;
    public node_fuzhuline: cc.Node = null;
    public color_red: cc.Color = cc.color(255, 75, 93);
    public color_black: cc.Color = cc.color(17, 20, 51);
    public color_blue: cc.Color = cc.color(61, 83, 183);
    public snakeColor: cc.Color = cc.color(17, 20, 51);
    public num_clicktime: number = -1;
    public tipsTween: cc.Tween<cc.Node>[] = [];
    public bool_iserrored: boolean = false;
    public bool_longtouchShowFuzhulline: boolean = false;
    public bool_needShowTuowei: boolean = true;
    public bool_isLongtimeTouch: boolean = false;

    private _parseHexColor(colorStr: string): cc.Color {
        if (!colorStr || typeof colorStr !== "string" || colorStr.length < 6) {
            return cc.color(17, 20, 51);
        }
        const r = parseInt(colorStr.substring(0, 2), 16);
        const g = parseInt(colorStr.substring(2, 4), 16);
        const b = parseInt(colorStr.substring(4, 6), 16);
        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return cc.color(17, 20, 51);
        }
        return cc.color(r, g, b);
    }

    public Init(id: number, levelInfo: LevelInfo, parentSnake: cc.Node, nodeMap: cc.Node): void {
        this.id = id;
        this.levelInfo = levelInfo;
        this.node_map = nodeMap;
        this.parent_snake = parentSnake;
        const arrow = this.levelInfo.Arrows[this.id];
        if (UserData.getInstance().colorMode && arrow && typeof arrow.Color === "string") {
            this.snakeColor = this._parseHexColor(arrow.Color);
        }
        ResMgr.getInstance().loadRes("prefab/item", cc.Prefab, null, "game").then((prefab: any) => {
            if (prefab) {
                this.prefab_item = prefab;
                this.ShowSnake();
                this.getNodePos({ x: 1, y: 1 });
                this.determineDirection();
                this.ShowFuzhuline2();
            }
        });
    }

    public setGameManager(gameManager: any): void {
        this.gameManager = gameManager;
    }

    public touch_start(): void {
        if (!this.bool_moveflag) {
            this.bool_isLongtimeTouch = false;
            this.scheduleOnce(this.showFuzhuline, 0.8);
        }
    }

    public showFuzhuline(): void {
        this.bool_longtouchShowFuzhulline = true;
        this.bool_isLongtimeTouch = true;
        if (this.node_fuzhuline) {
            this.node_fuzhuline.active = true;
        }
        for (let i = 0; i < this.node_allbody.length; i++) {
            this.node_allbody[i].getChildByName("show").color = this.color_blue;
        }
    }

    public touch_move(event: cc.Event.EventTouch): void {
        let isInside = false;
        this.node_allbody.forEach((node) => {
            if (node.getBoundingBoxToWorld().contains(event.getLocation())) {
                isInside = true;
            }
        });
        if (!isInside) {
            console.log("touch_move,移走了  取消事件");
            if (this.bool_longtouchShowFuzhulline && this.node_fuzhuline) {
                this.node_fuzhuline.active = false;
            }
            if (this.node_fuzhuline) {
                this.node_fuzhuline.active = false;
            }
            this.unschedule(this.showFuzhuline);
            for (let i = 0; i < this.node_allbody.length; i++) {
                this.node_allbody[i].getChildByName("show").color = this.bool_iserrored ? this.color_red : this.snakeColor;
            }
        }
    }

    public touch_end(): void {
        console.log("tc_end");
        if (!this.bool_moveflag) {
            this.unschedule(this.showFuzhuline);
            if (this.gameManager.clickState === game.ClickState.change) {
                AudioMgr.getInstance().playClickEff();
                this.ShowChange();
                this.gameManager.setState(game.ClickState.norlmal);
            } else if (this.gameManager.clickState === game.ClickState.yichu) {
                this.ShowYichu();
                this.gameManager.setState(game.ClickState.norlmal);
            } else if (this.bool_isLongtimeTouch) {
                if (this.bool_longtouchShowFuzhulline && this.node_fuzhuline) {
                    this.node_fuzhuline.active = false;
                }
                GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.notifyGameCanMove);
                this.bool_isLongtimeTouch = false;
                for (let i = 0; i < this.node_allbody.length; i++) {
                    this.node_allbody[i].getChildByName("show").color = this.bool_iserrored ? this.color_red : this.snakeColor;
                }
            } else {
                this.snakeMove();
            }
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.notifySnakeTouch, this.id);
        }
    }

    public touch_cancle(): void {
        if (this.bool_longtouchShowFuzhulline && this.node_fuzhuline) {
            this.node_fuzhuline.active = false;
        }
        console.log("tc_cancle");
        this.unschedule(this.showFuzhuline);
        if (this.node_fuzhuline) {
            this.node_fuzhuline.active = false;
        }
        this.bool_isLongtimeTouch = false;
        GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.notifyGameCanMove);
        for (let i = 0; i < this.node_allbody.length; i++) {
            this.node_allbody[i].getChildByName("show").color = this.snakeColor;
        }
    }

    public ShowSnake(): void {
        const indices = this.levelInfo.Arrows[this.id].Indices;
        for (let i = 0; i < indices.length; i++) {
            const index = indices[i];
            const bodyNode: cc.Node = cc.instantiate(this.prefab_item);
            this.parent_snake.addChild(bodyNode);
            this.gameManager.Layout_map.node.children[index].getChildByName("dian").opacity = 255;
            bodyNode.active = false;
            const x = index % this.levelInfo.XSize;
            const y = Math.floor(index / this.levelInfo.XSize);
            this.gameManager.num_mapInfo[x][y] = this.id + "_" + i;
            bodyNode.setPosition(this.getNodePos({ x: x, y: y }));
            this.snakeInfo2.push({ x: x, y: y });
            this.node_allbody.push(bodyNode);
            bodyNode.getChildByName("show").color = this.snakeColor;
            bodyNode.on(cc.Node.EventType.TOUCH_START, this.touch_start, this);
            bodyNode.on(cc.Node.EventType.TOUCH_MOVE, this.touch_move, this);
            bodyNode.on(cc.Node.EventType.TOUCH_END, this.touch_end, this);
            bodyNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touch_cancle, this);
        }
        let shownCount = 0;
        const interval = 0.3 / indices.length;
        for (let i = this.node_allbody.length - 1, delayIndex = 0; i >= 0; i--, delayIndex++) {
            const bodyNode = this.node_allbody[i];
            this.scheduleOnce(() => {
                shownCount += 1;
                bodyNode.active = true;
                if (shownCount > 1) {
                    this.updatePartialSnakeSkin();
                }
            }, interval * delayIndex);
        }
    }

    public updatePartialSnakeSkin(): void {
        const activeBodies = this.node_allbody.filter((node) => node.active);
        if (activeBodies.length === 0) {
            return;
        }
        for (let i = 0; i < activeBodies.length; i++) {
            const bodyNode = activeBodies[i];
            let bodyType: Bodyparts = null;
            const index = this.node_allbody.indexOf(bodyNode);
            const prev = index > 0 ? this.snakeInfo2[index - 1] : null;
            const cur = this.snakeInfo2[index];
            const next = index < this.snakeInfo2.length - 1 ? this.snakeInfo2[index + 1] : null;
            const hasPrev = prev !== null && this.node_allbody[index - 1].active;
            const hasNext = next !== null && this.node_allbody[index + 1].active;
            if (hasPrev || hasNext) {
                const prevInfo = hasPrev ? prev : null;
                const nextInfo = hasNext ? next : null;
                bodyType = this.getBodyType(prevInfo, cur, nextInfo);
            } else {
                bodyType = Bodyparts.尾_右;
            }
            this.changeSpr(bodyType, bodyNode);
        }
    }

    public updateSnakeSkinByData(): void {
    }

    public async errorAni(): Promise<void> {
        if (MultiPlatform.getInstance().vibrateEnabled && UserData.getInstance().shake) {
            MultiPlatform.getInstance().vibrateLong();
        }
        AudioMgr.getInstance().playEffect("audio/click_wrong_arrow", InterfaceMgr.bundleName.game);
        await new Promise<void>((resolve) => {
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
            let finishedCount = 0;
            const total = this.node_allbody.length;
            this.bool_iserrored = true;
            for (let i = 0; i < this.node_allbody.length; i++) {
                const bodyNode = this.node_allbody[i];
                bodyNode.getChildByName("show").color = this.color_red;
                cc.tween(bodyNode).delay(0.1).by(0.1, { x: offsetX, y: offsetY }).by(0.1, { x: -offsetX, y: -offsetY }).call(() => {
                    finishedCount++;
                    if (finishedCount === total) {
                        resolve();
                    }
                }).start();
            }
            if (total === 0) {
                resolve();
            }
        });
    }

    public async snakeMove(): Promise<void> {
        if (MultiPlatform.getInstance().vibrateEnabled && UserData.getInstance().shake) {
            MultiPlatform.getInstance().vibrateShort();
        }
        this.bool_moveflag = true;
        const check = this.checkZhanai();
        if (!check.hasCollision) {
            this.snakeState = snakeState.dead;
            this.gameManager.onSnakeDestroyed(this);
            this.node_fuzhuline.opacity = 0;
            for (let i = 0; i < this.node_allbody.length; i++) {
                const showNode = this.node_allbody[i].getChildByName("show");
                cc.tween(showNode).to(0.2, { color: cc.color(61, 83, 183) }).to(0.2, { color: this.snakeColor }).start();
            }
            for (let i = 0; i < 200; i++) {
                await this.move();
            }
            return;
        }
        if (!(check.distance > 0)) {
            this._vibrateOnCollision();
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.snakeTouchSnake, check.collisionPos);
            await this.errorAni();
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameFail, this.id);
            this.bool_moveflag = false;
            return;
        }
        let remain = check.distance;
        for (let i = 0; i < check.distance; i++) {
            await this.move();
            if (--remain <= 0) {
                this._vibrateOnCollision();
                GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.snakeTouchSnake, check.collisionPos);
                await this.errorAni();
                GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameFail, this.id);
                await this.huitui();
            }
        }
        this.bool_moveflag = false;
    }

    public async move(): Promise<void> {
        await new Promise<void>((resolve) => {
            const oldSnakeInfo = this.snakeInfo2.slice();
            const head = this.snakeInfo2[0];
            const headX = head.x;
            const headY = head.y;
            let newHeadPos: GridPos = null;
            switch (this.direction) {
                case Direction.Left:
                    newHeadPos = { x: headX - 1, y: headY };
                    break;
                case Direction.Right:
                    newHeadPos = { x: headX + 1, y: headY };
                    break;
                case Direction.Up:
                    newHeadPos = { x: headX, y: headY + 1 };
                    break;
                case Direction.Down:
                    newHeadPos = { x: headX, y: headY - 1 };
                    break;
            }
            const movePromises: Promise<void>[] = [];
            const newSnakeInfo = [newHeadPos].concat(oldSnakeInfo.slice(0, oldSnakeInfo.length - 1));
            this.snakeInfo2 = newSnakeInfo;
            const tail = this.snakeInfo2[this.snakeInfo2.length - 1];
            if (tail && this.gameManager.num_mapInfo && this.gameManager.num_mapInfo[tail.x] && this.gameManager.num_mapInfo[tail.x][tail.y] !== undefined) {
                const mapIndex = tail.y * this.levelInfo.XSize + tail.x;
                const tailNode = this.gameManager.Layout_map.node.children[mapIndex];
                if (this.bool_needShowTuowei) {
                    cc.tween(tailNode).to(0.2, { scale: 3 }).to(0.2, { scale: 1 }).start();
                }
            }
            this.snakeInfo2.forEach((pos, i) => {
                const bodyNode = this.node_allbody[i];
                const nodePos = this.getNodePos(pos);
                if (this.gameManager.num_mapInfo && this.gameManager.num_mapInfo[pos.x] && this.gameManager.num_mapInfo[pos.x][pos.y] === "o") {
                    cc.director.once(cc.Director.EVENT_AFTER_UPDATE, () => {
                        bodyNode.active = false;
                    });
                    if (i === this.node_allbody.length - 1) {
                        this.bool_needShowTuowei = false;
                    }
                    const heidongList = this.gameManager.heidong.filter((item: any) => item.posInfo.x === pos.x && item.posInfo.y === pos.y);
                    if (i === 0) {
                        heidongList[0].showStartAni();
                    } else if (i === this.node_allbody.length - 1) {
                        heidongList[0].showEndAni();
                    }
                }
                movePromises.push(this.moveBody(bodyNode, nodePos));
            });
            Promise.all(movePromises).then(() => {
                this.action.push(oldSnakeInfo);
                resolve();
            });
        });
    }

    public getNodePos(pos: GridPos): cc.Vec3 {
        const origin = this.node_map.children[0].position;
        return cc.v3(pos.x * this.num_movedistance, pos.y * this.num_movedistance, 0).addSelf(origin);
    }

    public async moveBody(bodyNode: cc.Node, pos: cc.Vec3): Promise<void> {
        await new Promise<void>((resolve) => {
            bodyNode.setPosition(pos);
            this.updateSnakeBody(bodyNode);
            cc.director.once(cc.Director.EVENT_AFTER_UPDATE, () => {
                resolve();
            });
        });
    }

    public async huitui(): Promise<void> {
        for (let i = this.action.length - 1; i >= 0; i--) {
            const info = this.action[i];
            this.snakeInfo2 = info;
            const movePromises: Promise<void>[] = [];
            info.forEach((pos, j) => {
                const bodyNode = this.node_allbody[j];
                const nodePos = this.getNodePos(pos);
                movePromises.push(this.moveBody(bodyNode, nodePos));
            });
            await Promise.all(movePromises);
        }
        this.action = [];
    }

    public updateSnakeBody(bodyNode: cc.Node): void {
        const index = this.node_allbody.indexOf(bodyNode);
        const bodyType = this.getBodyType(this.snakeInfo2[index - 1], this.snakeInfo2[index], this.snakeInfo2[index + 1]);
        this.changeSpr(bodyType, bodyNode);
    }

    private _isOwnBody(cell: any): boolean {
        return typeof cell === "string" && cell.startsWith(this.id + "_");
    }

    private _vibrateOnCollision(): void {
        const vibrateEnabled = MultiPlatform.getInstance().vibrateEnabled;
        const shake = UserData.getInstance().shake;
        console.log("[vibrate] collision trigger, vibrateEnabled=" + vibrateEnabled + " shake=" + shake + " isNative=" + cc.sys.isNative + " os=" + cc.sys.os);
        if (vibrateEnabled && shake) {
            if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
                if ("undefined" === typeof jsb || !jsb.reflection) {
                    console.warn("[vibrate] jsb.reflection unavailable");
                    return;
                }
                try {
                    jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxHelper", "vibrate", "(F)V", 0.08);
                    console.log("[vibrate] android (F)V ok");
                    return;
                } catch (e) {
                    console.warn("[vibrate] android (F)V failed:", e && e.message || e);
                }
                try {
                    jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxHelper", "vibrate", "(J)V", 80);
                    console.log("[vibrate] android (J)V ok");
                    return;
                } catch (e) {
                    console.warn("[vibrate] android (J)V failed:", e && e.message || e);
                }
                try {
                    MultiPlatform.getInstance().vibrateShort();
                    console.log("[vibrate] android fallback -> MultiPlatform.vibrateShort");
                } catch (e) {
                    console.warn("[vibrate] android all paths failed:", e && e.message || e);
                }
            } else if (cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS) {
                try {
                    MultiPlatform.getInstance().vibrateShort();
                    console.log("[vibrate] ios -> MultiPlatform.vibrateShort");
                } catch (e) {
                    console.warn("[vibrate] ios failed:", e && e.message || e);
                }
            } else {
                try {
                    if ("undefined" !== typeof navigator && "function" === typeof navigator.vibrate) {
                        const ok = navigator.vibrate(80);
                        console.log("[vibrate] web navigator.vibrate ok=" + ok);
                    } else {
                        MultiPlatform.getInstance().vibrateShort();
                        console.log("[vibrate] web -> MultiPlatform.vibrateShort (no navigator.vibrate)");
                    }
                } catch (e) {
                    console.warn("[vibrate] web failed:", e && e.message || e);
                }
            }
        }
    }

    public checkZhanai(): ZhanaiResult {
        const head = this.snakeInfo2[0];
        const headX = head.x;
        const headY = head.y;
        let cell: any = null;
        switch (this.direction) {
            case Direction.Left:
                for (let x = headX - 1; x >= 0; x--) {
                    cell = this.gameManager.num_mapInfo && this.gameManager.num_mapInfo[x] && this.gameManager.num_mapInfo[x][headY];
                    if (cell && cell !== "0" && !this._isOwnBody(cell)) {
                        if (cell === "o") {
                            return { distance: headX - x, hasCollision: false, collisionPos: { x: x, y: headY }, isHeidong: true };
                        }
                        console.log("向左移动会在(" + x + "," + headY + ")遇到障碍物");
                        return { distance: headX - x - 1, hasCollision: true, collisionPos: { x: x, y: headY } };
                    }
                }
                return { distance: -1, hasCollision: false, collisionPos: null };
            case Direction.Right:
                for (let x = headX + 1; x <= this.levelInfo.XSize - 1; x++) {
                    cell = this.gameManager.num_mapInfo && this.gameManager.num_mapInfo[x] && this.gameManager.num_mapInfo[x][headY];
                    if (cell && cell !== "0" && !this._isOwnBody(cell)) {
                        if (cell === "o") {
                            return { distance: x - headX, hasCollision: false, collisionPos: { x: x, y: headY }, isHeidong: true };
                        }
                        console.log("向右移动会在(" + x + "," + headY + ")遇到障碍物");
                        return { distance: x - headX - 1, hasCollision: true, collisionPos: { x: x, y: headY } };
                    }
                }
                return { distance: -1, hasCollision: false, collisionPos: null };
            case Direction.Up:
                for (let y = headY + 1; y <= this.levelInfo.YSize - 1; y++) {
                    cell = this.gameManager.num_mapInfo && this.gameManager.num_mapInfo[headX] && this.gameManager.num_mapInfo[headX][y];
                    if (cell && cell !== "0" && !this._isOwnBody(cell)) {
                        if (cell === "o") {
                            return { distance: y - headY, hasCollision: false, collisionPos: { x: headX, y: y }, isHeidong: true };
                        }
                        console.log("向上移动会在(" + headX + "," + y + ")遇到障碍物");
                        return { distance: y - headY - 1, hasCollision: true, collisionPos: { x: headX, y: y } };
                    }
                }
                return { distance: -1, hasCollision: false, collisionPos: null };
            case Direction.Down:
                for (let y = headY - 1; y >= 0; y--) {
                    cell = this.gameManager.num_mapInfo && this.gameManager.num_mapInfo[headX] && this.gameManager.num_mapInfo[headX][y];
                    if (cell && cell !== "0" && !this._isOwnBody(cell)) {
                        if (cell === "o") {
                            return { distance: headY - y, hasCollision: false, collisionPos: { x: headX, y: y }, isHeidong: true };
                        }
                        console.log("向下移动会在(" + headX + "," + y + ")遇到障碍物");
                        return { distance: headY - y - 1, hasCollision: true, collisionPos: { x: headX, y: y } };
                    }
                }
                return { distance: -1, hasCollision: false, collisionPos: null };
        }
        return { distance: -1, hasCollision: false, collisionPos: null };
    }

    public updateSnakePosition(): void {
        for (let i = 0; i < this.node_allbody.length; i++) {
            const bodyNode = this.node_allbody[i];
            const bodyType = this.getBodyType(this.snakeInfo2[i - 1], this.snakeInfo2[i], this.snakeInfo2[i + 1]);
            this.changeSpr(bodyType, bodyNode);
        }
    }

    public determineDirection(): void {
        if (this.snakeInfo2.length < 2) {
            return;
        }
        const head = this.snakeInfo2[0];
        const second = this.snakeInfo2[1];
        if (second.x === head.x + 1) {
            this.direction = Direction.Left;
        } else if (second.x === head.x - 1) {
            this.direction = Direction.Right;
        } else if (second.y === head.y + 1) {
            this.direction = Direction.Down;
        } else if (second.y === head.y - 1) {
            this.direction = Direction.Up;
        }
    }

    public changeSpr_liti(bodyType: Bodyparts, bodyNode: cc.Node): void {
        const sprite = bodyNode.getChildByName("show").getComponent(SpriteFrames);
        switch (bodyType) {
            case Bodyparts.头_上:
                sprite.setFrameByIndex(9);
                break;
            case Bodyparts.头_下:
                sprite.setFrameByIndex(6);
                break;
            case Bodyparts.头_左:
                sprite.setFrameByIndex(7);
                break;
            case Bodyparts.头_右:
                sprite.setFrameByIndex(8);
                break;
            case Bodyparts.身体_右右:
                sprite.setFrameByIndex(2);
                break;
            case Bodyparts.身体_下右:
                sprite.setFrameByIndex(1);
                break;
            case Bodyparts.身体_上右:
                sprite.setFrameByIndex(3);
                break;
            case Bodyparts.身体_左左:
                sprite.setFrameByIndex(2);
                break;
            case Bodyparts.身体_下左:
                sprite.setFrameByIndex(0);
                break;
            case Bodyparts.身体_上左:
                sprite.setFrameByIndex(4);
                break;
            case Bodyparts.身体_上上:
                sprite.setFrameByIndex(5);
                break;
            case Bodyparts.身体_右上:
                sprite.setFrameByIndex(0);
                break;
            case Bodyparts.身体_左上:
                sprite.setFrameByIndex(1);
                break;
            case Bodyparts.身体_下下:
                sprite.setFrameByIndex(5);
                break;
            case Bodyparts.身体_右下:
                sprite.setFrameByIndex(4);
                break;
            case Bodyparts.身体_左下:
                sprite.setFrameByIndex(3);
                break;
            case Bodyparts.尾_上:
                sprite.setFrameByIndex(13);
                break;
            case Bodyparts.尾_下:
                sprite.setFrameByIndex(10);
                break;
            case Bodyparts.尾_左:
                sprite.setFrameByIndex(11);
                break;
            case Bodyparts.尾_右:
                sprite.setFrameByIndex(12);
                break;
            default:
                console.error("出错了,请检查");
                sprite.setFrameByIndex(3);
                break;
        }
    }

    public changeSpr(bodyType: Bodyparts, bodyNode: cc.Node): void {
        const sprite = bodyNode.getChildByName("show").getComponent(SpriteFrames);
        switch (bodyType) {
            case Bodyparts.头_上:
                sprite.setFrameByIndex(0);
                sprite.node.angle = 0;
                break;
            case Bodyparts.头_下:
                sprite.setFrameByIndex(0);
                sprite.node.angle = 180;
                break;
            case Bodyparts.头_左:
                sprite.setFrameByIndex(0);
                sprite.node.angle = 90;
                break;
            case Bodyparts.头_右:
                sprite.setFrameByIndex(0);
                sprite.node.angle = -90;
                break;
            case Bodyparts.身体_右右:
                sprite.setFrameByIndex(2);
                sprite.node.angle = 90;
                break;
            case Bodyparts.身体_下右:
                sprite.setFrameByIndex(3);
                sprite.node.angle = 0;
                break;
            case Bodyparts.身体_上右:
                sprite.setFrameByIndex(3);
                sprite.node.angle = -90;
                break;
            case Bodyparts.身体_左左:
                sprite.setFrameByIndex(2);
                sprite.node.angle = 90;
                break;
            case Bodyparts.身体_下左:
                sprite.setFrameByIndex(3);
                sprite.node.angle = 90;
                break;
            case Bodyparts.身体_上左:
                sprite.setFrameByIndex(3);
                sprite.node.angle = 180;
                break;
            case Bodyparts.身体_上上:
                sprite.setFrameByIndex(2);
                sprite.node.angle = 0;
                break;
            case Bodyparts.身体_右上:
                sprite.setFrameByIndex(3);
                sprite.node.angle = 90;
                break;
            case Bodyparts.身体_左上:
                sprite.setFrameByIndex(3);
                sprite.node.angle = 0;
                break;
            case Bodyparts.身体_下下:
                sprite.setFrameByIndex(2);
                sprite.node.angle = 0;
                break;
            case Bodyparts.身体_右下:
                sprite.setFrameByIndex(3);
                sprite.node.angle = 180;
                break;
            case Bodyparts.身体_左下:
                sprite.setFrameByIndex(3);
                sprite.node.angle = -90;
                break;
            case Bodyparts.尾_上:
                sprite.setFrameByIndex(1);
                sprite.node.angle = 0;
                break;
            case Bodyparts.尾_下:
                sprite.setFrameByIndex(1);
                sprite.node.angle = 180;
                break;
            case Bodyparts.尾_左:
                sprite.setFrameByIndex(1);
                sprite.node.angle = 90;
                break;
            case Bodyparts.尾_右:
                sprite.setFrameByIndex(1);
                sprite.node.angle = -90;
                break;
            default:
                console.error("出错了,请检查");
                sprite.setFrameByIndex(3);
                break;
        }
    }

    public getBodyType(prev: GridPos, cur: GridPos, next: GridPos): Bodyparts {
        if (prev === null || prev === undefined) {
            if (next.x === cur.x + 1) {
                return Bodyparts.头_左;
            }
            if (next.x === cur.x - 1) {
                return Bodyparts.头_右;
            }
            if (next.y === cur.y + 1) {
                return Bodyparts.头_下;
            }
            if (next.y === cur.y - 1) {
                return Bodyparts.头_上;
            }
        }
        if (next === undefined || next === null) {
            if (prev.x === cur.x + 1) {
                return Bodyparts.尾_右;
            }
            if (prev.x === cur.x - 1) {
                return Bodyparts.尾_左;
            }
            if (prev.y === cur.y + 1) {
                return Bodyparts.尾_上;
            }
            if (prev.y === cur.y - 1) {
                return Bodyparts.尾_下;
            }
        }
        if (prev.x === cur.x + 1) {
            if (next.x === cur.x - 1) {
                return Bodyparts.身体_右右;
            }
            if (next.y === cur.y + 1) {
                return Bodyparts.身体_下右;
            }
            if (next.y === cur.y - 1) {
                return Bodyparts.身体_上右;
            }
        } else if (prev.x === cur.x - 1) {
            if (next.x === cur.x + 1) {
                return Bodyparts.身体_左左;
            }
            if (next.y === cur.y + 1) {
                return Bodyparts.身体_下左;
            }
            if (next.y === cur.y - 1) {
                return Bodyparts.身体_上左;
            }
        } else if (prev.y === cur.y + 1) {
            if (next.y === cur.y - 1) {
                return Bodyparts.身体_上上;
            }
            if (next.x === cur.x + 1) {
                return Bodyparts.身体_左上;
            }
            if (next.x === cur.x - 1) {
                return Bodyparts.身体_右上;
            }
        } else if (prev.y === cur.y - 1) {
            if (next.y === cur.y + 1) {
                return Bodyparts.身体_下下;
            }
            if (next.x === cur.x + 1) {
                return Bodyparts.身体_左下;
            }
            if (next.x === cur.x - 1) {
                return Bodyparts.身体_右下;
            }
        }
        console.error("出错了,请检查", new Error().stack);
        return null;
    }

    public showTip(): void {
        for (let i = 0; i < this.node_allbody.length; i++) {
            const bodyNode = this.node_allbody[i];
            if (this.tipsTween[i]) {
                this.tipsTween[i].stop();
            }
            this.tipsTween[i] = cc.tween(bodyNode.getChildByName("show")).to(0.8, { color: cc.Color.GREEN }).to(0.8, { color: this.snakeColor }).union().repeatForever().start();
        }
    }

    public ShowChange(): void {
        for (let i = 0; i < this.node_allbody.length; i++) {
            const bodyNode = this.node_allbody[i];
            cc.tween(bodyNode).to(0.3, { opacity: 0 }).delay(0.3).to(0.3, { opacity: 255 }).start();
        }
        this.scheduleOnce(() => {
            if (this.node_fuzhuline) {
                this.node_fuzhuline.active = false;
            }
            const reversedInfo = [...this.snakeInfo2].reverse();
            const reversedBodies = [...this.node_allbody].reverse();
            this.snakeInfo2 = reversedInfo;
            this.node_allbody = reversedBodies;
            for (let i = 0; i < this.node_allbody.length; i++) {
                const bodyNode = this.node_allbody[i];
                const pos = this.getNodePos(this.snakeInfo2[i]);
                bodyNode.setPosition(pos);
                bodyNode.getChildByName("show").color = this.snakeColor;
                bodyNode.setSiblingIndex(i);
                this.updateSnakeBody(bodyNode);
            }
            this.determineDirection();
            if (this.gameManager && this.gameManager.num_mapInfo) {
                for (let x = 0; x < this.levelInfo.XSize; x++) {
                    for (let y = 0; y < this.levelInfo.YSize; y++) {
                        const val = this.gameManager.num_mapInfo[x][y];
                        if (val && val.startsWith(this.id + "_")) {
                            this.gameManager.num_mapInfo[x][y] = "0";
                        }
                    }
                }
                for (let i = 0; i < this.snakeInfo2.length; i++) {
                    const info = this.snakeInfo2[i];
                    this.gameManager.num_mapInfo[info.x][info.y] = this.id + "_" + i;
                }
            }
            for (let i = 0; i < this.node_allbody.length; i++) {
                const bodyNode = this.node_allbody[i];
                bodyNode.off(cc.Node.EventType.TOUCH_END, this.touch_end, this);
                bodyNode.on(cc.Node.EventType.TOUCH_END, this.touch_end, this);
            }
        }, 0.4);
    }

    public ShowYichu(): void {
        this.snakeState = snakeState.dead;
        this.gameManager.onSnakeDestroyed(this);
        for (let i = 0; i < this.node_allbody.length; i++) {
            const bodyNode = this.node_allbody[i];
            bodyNode.off(cc.Node.EventType.TOUCH_END, this.touch_end, this);
            cc.tween(bodyNode).to(0.2, { opacity: 0 }).to(0.2, { opacity: 255 }).to(0.2, { opacity: 0 }).to(0.2, { opacity: 255 }).to(0.2, { opacity: 0 }).call(() => {
                bodyNode.x = 9999;
                bodyNode.active = false;
            }).start();
        }
        if (this.node_fuzhuline) {
            this.node_fuzhuline.x = 9999;
        }
    }

    public ShowFuzhuline(): void {
        if (this.node_fuzhuline) {
            this.node_fuzhuline.active = true;
        }
    }

    public CloseFuzhuLine(): void {
        if (this.node_fuzhuline) {
            this.node_fuzhuline.active = false;
        }
    }

    public ShowFuzhuline2(): void {
        if (this.node_fuzhuline && this.node_fuzhuline.active) {
            this.node_fuzhuline.active = false;
        }
        const fuzhuline: cc.Node = cc.instantiate(this.gameManager.node_fuzhuline);
        fuzhuline.parent = this.node.parent;
        const worldPos = this.node_allbody[0].convertToWorldSpaceAR(cc.v2(0, 0));
        const localPos = this.node.parent.convertToNodeSpaceAR(worldPos);
        fuzhuline.setPosition(localPos);
        fuzhuline.setSiblingIndex(0);
        switch (this.direction) {
            case Direction.Left:
                fuzhuline.angle = 90;
                break;
            case Direction.Right:
                fuzhuline.angle = -90;
                break;
            case Direction.Up:
                fuzhuline.angle = 0;
                break;
            case Direction.Down:
                fuzhuline.angle = 180;
                break;
        }
        fuzhuline.active = false;
        this.node_fuzhuline = fuzhuline;
    }

    public CloseFuzhuline(): void {
        if (this.node_fuzhuline && this.node_fuzhuline.active) {
            this.node_fuzhuline.active = false;
        }
    }

    public showPengzhuan(): void {
        for (let i = 0; i < this.node_allbody.length; i++) {
            const showNode = this.node_allbody[i].getChildByName("show");
            cc.tween(showNode).delay(0.2).to(0.2, { color: this.color_red }).to(0.2, { color: this.snakeColor }).start();
        }
    }
}