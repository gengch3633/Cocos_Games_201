import { UiManager } from "./UiManage";
import List from "./List";
import EngineUtil from "./EngineUtil";
import ConfigDataSys from "./ConfigDataSys";
import BallEditor from "./BallEditor";
import FileMgr from "./FileMgr";
import BallLogicMgr from "./BallLogicMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapEditor extends cc.Component {
    static PlayMode = false;
    static PlayJson: string = null;

    @property(cc.EditBox)
    LevelEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    TabelEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    PosXEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    PosYEditBox: cc.EditBox = null;

    @property(cc.Prefab)
    ballPosNode: cc.Prefab = null;

    @property(cc.Prefab)
    ball: cc.Prefab = null;

    @property(cc.Prefab)
    shadow_prefab: cc.Prefab = null;

    @property(cc.Node)
    ballParent: cc.Node = null;

    @property(cc.Node)
    shadow_container: cc.Node = null;

    @property(cc.Camera)
    camera2D: cc.Camera = null;

    @property(cc.Camera)
    camera3D: cc.Camera = null;

    @property(cc.Node)
    SelectionBox: cc.Node = null;

    @property([cc.JsonAsset])
    jsonArr: cc.JsonAsset[] = [];

    @property(List)
    list: List = null;

    ballID = 0;
    SelectedCards: BallEditor[] = [];
    addNum = 1;
    json: string = null;
    ctrlOrCmdPressed = false;
    startTouchPos: cc.Vec2 = null;

    onCopyCardBtnClick(): void {
        if (this.SelectedCards.length !== 0) {
            const copied: BallEditor[] = [];
            this.SelectedCards.forEach((card) => {
                const node = cc.instantiate(card.node) as any;
                node.Ball_id = card.node.Ball_id;
                this.ballParent.addChild(node);
                node.setPosition(node.x + 10, node.y);
                const editor = node.getComponent(BallEditor);
                editor.SetSelect(true);
                copied.push(editor);
            });
            this.clearSelection();
            this.SelectedCards = copied;
        }
    }

    clearSelection(): void {
        this.SelectedCards.forEach((card) => card.SetSelect(false));
        this.SelectedCards = [];
    }

    onNewBall(): void {
        this.createBall({ x: 0, y: 40 * this.ballID, ballID: this.ballID });
    }

    onSelet(_event: any, index: number): void {
        const data = this.jsonArr[index].json;
        console.log("onSelet", index, data);
        this.clearSelection();
        const ballId = Math.floor(15 * Math.random()) + 1;
        data.balls.forEach((ball: any) => {
            ball.ballID = ballId;
            const node = this.createBall(ball, false) as any;
            const editor = node.getComponent(BallEditor);
            node.Ball_id = ballId;
            this.SelectedCards.push(editor);
            editor.SetSelect(true);
        });
    }

    createBall(ballData: any, select = true): cc.Node {
        console.log("create", ballData);
        const node = cc.instantiate(this.ball);
        node.name = "3DBall_" + ballData.ballID;
        this.ballParent.addChild(node);
        node.getComponent(BallEditor).setMatIdx(ballData.ballID == 0 ? 0 : ballData.ballID + 1);
        node.x = ballData.x;
        node.y = ballData.y;
        if (select) {
            this.clearSelection();
            const editor = node.getComponent(BallEditor);
            this.SelectedCards.push(editor);
            editor.SetSelect(true);
            this.ballID++;
        }
        return node;
    }

    onListRender(item: cc.Node, index: number): void {
        console.log(index);
        item.getComponentInChildren(cc.Label).string = this.jsonArr[index].name;
    }

    onPlayBtnClick(): void {
        console.log("onPlayBtnClick");
        MapEditor.PlayMode = true;
        const jsonStr = this.CreateJson();
        MapEditor.PlayJson = jsonStr;
        const tableInfo = JSON.parse(jsonStr);
        BallLogicMgr.isModifyBallDir = ConfigDataSys.global_ConfigMap.get("easyball_on") == "1";
        const angle = Number(ConfigDataSys.global_ConfigMap.get("easyball_num")) || 20;
        BallLogicMgr.ballDirModifyThreshold = (angle / 180) * Math.PI;
        console.log("isModifyBallDir", BallLogicMgr.isModifyBallDir, "ballDirModifyThreshold", angle);
        BallLogicMgr.gotoEditor(tableInfo);
    }

    onExportBtnClick(): void {
        console.log("onExportBtnClick");
        this.json = this.CreateJson();
        const filename = "a_" + this.LevelEditBox.string + ".json";
        FileMgr.downloadFile(this.json, filename);
    }

    CreateJson(): string {
        const data: any = {};
        data.table_key = this.TabelEditBox.string;
        const balls: any[] = [];
        data.balls = balls;
        let fallbackId = 0;
        this.ballParent.children.forEach((child: any) => {
            const ballID = child.Ball_id ? child.Ball_id : fallbackId++;
            balls.push({ x: child.x, y: child.y, ballID });
        });
        const jsonStr = JSON.stringify(data);
        console.log(jsonStr);
        return jsonStr;
    }

    onSetPos(): void {
        if (this.SelectedCards.length) {
            const x = Number(this.PosXEditBox.string) || 0;
            const y = Number(this.PosYEditBox.string) || 0;
            this.SelectedCards[0].node.x = x;
            this.SelectedCards[0].node.y = y;
        }
    }

    onShowPos(): void {
        if (this.SelectedCards.length) {
            this.PosXEditBox.string = this.SelectedCards[0].node.x.toString();
            this.PosYEditBox.string = this.SelectedCards[0].node.y.toString();
        }
    }

    addEvent(): void {
        const tableTouch = cc.find("plane_table", this.node).getChildByName("table_touch");
        const worldBox = tableTouch.getBoundingBoxToWorld();
        const topRight = cc.v2(worldBox.xMax, worldBox.yMax);
        const bottomLeft = cc.v2(worldBox.xMin, worldBox.yMin);
        const screenTopRight = this.camera3D.getWorldToScreenPoint(topRight);
        const screenBottomLeft = this.camera3D.getWorldToScreenPoint(bottomLeft);
        const screenWidth = screenTopRight.x - screenBottomLeft.x;
        const screenHeight = screenTopRight.y - screenBottomLeft.y;
        const screenRect = new cc.Rect(screenBottomLeft.x, screenBottomLeft.y, screenWidth, screenHeight);
        const toLocal = (location: cc.Vec2) => {
            const offset = location.sub(screenRect.center);
            const x = (offset.x / (screenWidth / 2)) * (tableTouch.width / 2);
            const y = (offset.y / (screenHeight / 2)) * (tableTouch.height / 2);
            return cc.v2(x, y);
        };

        tableTouch.on(
            cc.Node.EventType.TOUCH_START,
            (event: cc.Event.EventTouch) => {
                if (this.ctrlOrCmdPressed) {
                    this.startTouchPos = toLocal(event.getLocation());
                    this.SelectionBox.setPosition(this.startTouchPos);
                    this.SelectionBox.width = 0;
                    this.SelectionBox.height = 0;
                    this.SelectionBox.active = true;
                } else {
                    const ray = this.camera3D.getRay(event.getLocation());
                    const hits = (cc as any).geomUtils.intersect.raycast(
                        this.ballParent,
                        ray,
                        null,
                        this.filterCard
                    );
                    console.log(hits);
                    if (hits && hits.length > 0) {
                        const editor = hits[0].node.getComponent(BallEditor);
                        this.clearSelection();
                        editor.SetSelect(true);
                        this.SelectedCards.push(editor);
                    } else {
                        this.clearSelection();
                    }
                }
            },
            this
        );

        tableTouch.on(
            cc.Node.EventType.TOUCH_MOVE,
            (event: cc.Event.EventTouch) => {
                if (this.ctrlOrCmdPressed) {
                    const current = toLocal(event.getLocation());
                    const minX = Math.min(this.startTouchPos.x, current.x);
                    const minY = Math.min(this.startTouchPos.y, current.y);
                    const maxX = Math.max(this.startTouchPos.x, current.x);
                    const maxY = Math.max(this.startTouchPos.y, current.y);
                    this.SelectionBox.setPosition(minX + (maxX - minX) / 2, minY + (maxY - minY) / 2);
                    this.SelectionBox.width = maxX - minX;
                    this.SelectionBox.height = maxY - minY;
                } else {
                    const local = toLocal(event.getLocation());
                    if (this.SelectedCards.length > 0) {
                        this.SelectedCards[0].node.position = cc.v3(Math.floor(local.x), Math.floor(local.y), 0);
                    }
                }
            },
            this
        );

        tableTouch.on(
            cc.Node.EventType.TOUCH_END,
            () => {
                if (this.ctrlOrCmdPressed) {
                    const selectionRect = this.SelectionBox.getBoundingBoxToWorld();
                    this.clearSelection();
                    this.ballParent.children.forEach((child) => {
                        const editor = child.getComponent(BallEditor);
                        if (editor) {
                            const childRect = child.getBoundingBoxToWorld();
                            if (cc.Intersection.rectRect(selectionRect, childRect)) {
                                this.SelectedCards.push(editor);
                                editor.SetSelect(true);
                            }
                        }
                    });
                    this.SelectionBox.active = false;
                }
            },
            this
        );
    }

    async changeTable(tableKey: string): Promise<void> {
        const prefabPath = "prefabs/tables/table_" + tableKey;
        const prefab = await UiManager.loaderPrefabInDeepPath(prefabPath);
        if (!prefab) {
            EngineUtil.showManageViewToast("table " + tableKey + " not found");
            return;
        }
        const tableNode = cc.instantiate(prefab);
        this.addTableNode(tableNode);
        this.TabelEditBox.string = tableKey;
    }

    async loadMap(jsonStr: string): Promise<void> {
        const data = JSON.parse(jsonStr);
        this.onClear(null, true);
        await this.changeTable(data.table_key);
        data.balls.forEach((ball: any) => {
            (this.createBall(ball) as any).Ball_id = ball.ballID;
        });
    }

    async start(): Promise<void> {
        console.log(this.jsonArr);
        this.list.numItems = this.jsonArr.length;
        this.SelectionBox.active = false;
        const winSize = cc.winSize;
        console.log("design size", winSize);
        const ratio = winSize.height / winSize.width;
        console.log("ratio", ratio);
        if (ratio > 2) {
            cc.find("Camera3D", this.node).z *= 1.225;
        }
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        if (MapEditor.PlayJson) {
            await this.loadMap(MapEditor.PlayJson);
        } else {
            await this.changeTable("0_1");
            this.onClear(null, false);
        }
    }

    filterCard(node: cc.Node): boolean {
        return node.getComponent(BallEditor) != null;
    }

    addTableNode(tablePrefab: cc.Node): void {
        const planeTable = cc.find("plane_table", this.node);
        const tableLayers = planeTable.getChildByName("table_layers");
        tableLayers.removeAllChildren(true);
        const prefabPlane = tablePrefab.getChildByName("plane_table");
        const table = prefabPlane.getChildByName("table_layers").getChildByName("table");
        table.setParent(tableLayers);
        table.setPosition(cc.Vec2.ZERO);
        const oldTouch = planeTable.getChildByName("table_touch");
        planeTable.removeChild(oldTouch, true);
        const newTouch = prefabPlane.getChildByName("table_touch");
        newTouch.setParent(planeTable);
        newTouch.setPosition(cc.Vec2.ZERO);
        const collisionRoot = cc.find("zhuo_pengzhuang", this.node);
        collisionRoot.removeAllChildren(true);
        const collisionNode = tablePrefab.getChildByName("zhuo_pengzhuang").getChildByName("pengzhuang_root");
        collisionNode.setParent(collisionRoot);
        collisionNode.setPosition(cc.Vec2.ZERO);
        this.addEvent();
    }

    onClear(_event: any = null, skipDefaultBall = false): void {
        this.ballParent.removeAllChildren();
        this.shadow_container.removeAllChildren();
        this.ballID = 0;
        if (!skipDefaultBall) {
            this.createBall({ x: 0, y: 0, ballID: 0 });
        }
    }

    onImportBtnClick(): void {
        console.log("导入关卡");
        FileMgr.readJsonFile((content, filename) => {
            console.log("导入关卡", filename, content);
            this.LevelEditBox.string = filename.split(".")[0];
            if (typeof content === "string") {
                this.loadMap(content);
            }
        });
    }

    onKeyUp(event: cc.Event.EventKeyboard): void {
        switch (event.keyCode) {
            case cc.macro.KEY.ctrl:
            case cc.macro.KEY.space:
                this.ctrlOrCmdPressed = false;
                break;
            case cc.macro.KEY.shift:
                this.addNum = 1;
        }
    }

    onKeyDown(event: cc.Event.EventKeyboard): void {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this.SelectedCards.forEach((card) => card.node.setPosition(card.node.x, card.node.y + this.addNum));
                break;
            case cc.macro.KEY.s:
                this.SelectedCards.forEach((card) => card.node.setPosition(card.node.x, card.node.y - this.addNum));
                break;
            case cc.macro.KEY.a:
                this.SelectedCards.forEach((card) => card.node.setPosition(card.node.x - this.addNum, card.node.y));
                break;
            case cc.macro.KEY.d:
                this.SelectedCards.forEach((card) => card.node.setPosition(card.node.x + this.addNum, card.node.y));
                break;
            case cc.macro.KEY.x:
            case cc.macro.KEY.Delete:
            case cc.macro.KEY.backspace:
                this.SelectedCards.forEach((card) => this.ballParent.removeChild(card.node));
                break;
            case cc.macro.KEY.f:
                this.onCopyCardBtnClick();
                break;
            case cc.macro.KEY.ctrl:
                this.ctrlOrCmdPressed = true;
                break;
            case cc.macro.KEY.space:
                break;
            case cc.macro.KEY.shift:
                this.addNum = 10;
        }
    }

    onTableChangeBtnClick(): void {
        this.changeTable(this.TabelEditBox.string);
    }
}
