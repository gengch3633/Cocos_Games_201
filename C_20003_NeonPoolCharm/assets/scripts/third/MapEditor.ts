import BallEditor from "./BallEditor";
import BallLogicMgr from "./BallLogicMgr";
import ConfigDataSys from "./ConfigDataSys";
import EngineUtil from "./EngineUtil";
import FileMgr from "./FileMgr";
import List from "./List";
import { UiManager } from "./UiManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapEditor extends cc.Component {
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
    jsonArr = [];

    @property(List)
    list: List = null;

    ballID = 0;
    SelectedCards = [];
    addNum = 1;
    json = null;
    ctrlOrCmdPressed;
    startTouchPos;

    static PlayMode = false;
    static PlayJson;

    onCopyCardBtnClick() {
        const e = this;
        if (0 !== this.SelectedCards.length) {
            const t = [];
            this.SelectedCards.forEach(function (o) {
                const n: any = cc.instantiate(o.node);
                n.Ball_id = o.node.Ball_id;
                e.ballParent.addChild(n);
                n.setPosition(n.x + 10, n.y);
                const i = n.getComponent(BallEditor);
                i.SetSelect(true);
                t.push(i);
            });
            this.clearSelection();
            this.SelectedCards = t;
        }
    }

    clearSelection() {
        this.SelectedCards.forEach(function (e) {
            e.SetSelect(false);
        });
        this.SelectedCards = [];
    }

    onNewBall() {
        const e = {
            x: 0,
            y: 40 * this.ballID,
            ballID: this.ballID
        };
        this.createBall(e);
    }

    onSelet(e, t) {
        const o = this;
        const n = this.jsonArr[t].json;
        console.log("onSelet", t, n);
        this.clearSelection();
        const i = Math.floor(15 * Math.random()) + 1;
        n.balls.forEach(function (e) {
            e.ballID = i;
            const t: any = o.createBall(e, false);
            const n = t.getComponent(BallEditor);
            t.Ball_id = i;
            o.SelectedCards.push(n);
            n.SetSelect(true);
        });
    }

    createBall(e, t) {
        if (undefined === t) {
            t = true;
        }
        console.log("create", e);
        const o: any = cc.instantiate(this.ball);
        o.name = "3DBall_" + e.ballID;
        this.ballParent.addChild(o);
        o.getComponent(BallEditor).setMatIdx(0 == e.ballID ? 0 : e.ballID + 1);
        o.x = e.x;
        o.y = e.y;
        if (t) {
            this.clearSelection();
            const n = o.getComponent(BallEditor);
            this.SelectedCards.push(n);
            n.SetSelect(true);
            this.ballID++;
        }
        return o;
    }

    onListRender(e, t) {
        console.log(t);
        e.getComponentInChildren(cc.Label).string = this.jsonArr[t].name;
    }

    onPlayBtnClick() {
        console.log("onPlayBtnClick");
        MapEditor.PlayMode = true;
        const t = this.CreateJson();
        MapEditor.PlayJson = t;
        const o = JSON.parse(t);
        BallLogicMgr.isModifyBallDir = "1" == ConfigDataSys.global_ConfigMap.get("easyball_on");
        const i = Number(ConfigDataSys.global_ConfigMap.get("easyball_num")) || 20;
        BallLogicMgr.ballDirModifyThreshold = i / 180 * Math.PI;
        console.log("isModifyBallDir", BallLogicMgr.isModifyBallDir, "ballDirModifyThreshold", i);
        BallLogicMgr.gotoEditor(o);
    }

    onExportBtnClick() {
        console.log("onExportBtnClick");
        this.json = this.CreateJson();
        const e = "a_" + this.LevelEditBox.string + ".json";
        FileMgr.downloadFile(this.json, e);
    }

    CreateJson() {
        const e: any = {};
        e.table_key = this.TabelEditBox.string;
        const t = [];
        e.balls = t;
        let o = 0;
        this.ballParent.children.forEach(function (e: any) {
            let n;
            n = e.Ball_id ? e.Ball_id : o++;
            const i = {
                x: e.x,
                y: e.y,
                ballID: n
            };
            t.push(i);
        });
        const n = JSON.stringify(e);
        console.log(n);
        return n;
    }

    onSetPos() {
        if (this.SelectedCards.length) {
            const e = Number(this.PosXEditBox.string) || 0;
            const t = Number(this.PosYEditBox.string) || 0;
            this.SelectedCards[0].node.x = e;
            this.SelectedCards[0].node.y = t;
        }
    }

    onShowPos() {
        if (this.SelectedCards.length) {
            this.PosXEditBox.string = this.SelectedCards[0].node.x.toString();
            this.PosYEditBox.string = this.SelectedCards[0].node.y.toString();
        }
    }

    addEvent() {
        const e = this;
        const t = cc.find("plane_table", this.node).getChildByName("table_touch");
        t.getBoundingBox();
        const o = t.getBoundingBoxToWorld();
        const n = cc.v2(o.xMax, o.yMax);
        const i = cc.v2(o.xMin, o.yMin);
        const a = this.camera3D.getWorldToScreenPoint(n);
        const r = this.camera3D.getWorldToScreenPoint(i);
        const l = a.x - r.x;
        const s = a.y - r.y;
        const c = new cc.Rect(r.x, r.y, l, s);
        const p = function (e) {
            const o = e.sub(c.center);
            const n = o.x / (l / 2) * t.width / 2;
            const i = o.y / (s / 2) * t.height / 2;
            return cc.v2(n, i);
        };
        const d = [];
        t.childrenCount > 0 && t.children.forEach(function (e) {
            const t = e.getComponent(cc.PolygonCollider);
            t ? d.push({
                type: 1,
                value: t.points
            }) : d.push({
                type: 0,
                value: e.getBoundingBox()
            });
        });
        d.length;
        t.on(cc.Node.EventType.TOUCH_START, function (t) {
            if (e.ctrlOrCmdPressed) {
                e.startTouchPos = p(t.getLocation());
                e.SelectionBox.setPosition(e.startTouchPos);
                e.SelectionBox.width = 0;
                e.SelectionBox.height = 0;
                e.SelectionBox.active = true;
            } else {
                const o = e.camera3D.getRay(t.getLocation());
                const n = cc.geomUtils.intersect.raycast(e.ballParent, o, null, e.filterCard);
                console.log(n);
                if (n && n.length > 0) {
                    const i = n[0].node.getComponent(BallEditor);
                    e.clearSelection();
                    i.SetSelect(true);
                    e.SelectedCards.push(i);
                } else e.clearSelection();
            }
        }, this);
        t.on(cc.Node.EventType.TOUCH_MOVE, function (t) {
            if (e.ctrlOrCmdPressed) {
                const o = p(t.getLocation());
                const n = Math.min(e.startTouchPos.x, o.x);
                const i = Math.min(e.startTouchPos.y, o.y);
                const a = Math.max(e.startTouchPos.x, o.x);
                const r = Math.max(e.startTouchPos.y, o.y);
                e.SelectionBox.setPosition(n + (a - n) / 2, i + (r - i) / 2);
                e.SelectionBox.width = a - n;
                e.SelectionBox.height = r - i;
            } else {
                const l = p(t.getLocation());
                e.SelectedCards.length > 0 && (e.SelectedCards[0].node.position = cc.v3(Math.floor(l.x), Math.floor(l.y), 0));
            }
        }, this);
        t.on(cc.Node.EventType.TOUCH_END, function () {
            if (e.ctrlOrCmdPressed) {
                const t = e.SelectionBox.getBoundingBoxToWorld();
                e.clearSelection();
                e.ballParent.children.forEach(function (o) {
                    const n = o.getComponent(BallEditor);
                    if (n) {
                        const i = o.getBoundingBoxToWorld();
                        if (cc.Intersection.rectRect(t, i)) {
                            e.SelectedCards.push(n);
                            n.SetSelect(true);
                        }
                    }
                });
                e.SelectionBox.active = false;
            }
        });
    }

    public async changeTable(e): Promise<void> {
        const t = "prefabs/tables/table_" + e;
        const o = await UiManager.loaderPrefabInDeepPath(t);
        if (!o) {
            EngineUtil.showManageViewToast("table " + e + " not found");
            return;
        }
        const n = cc.instantiate(o);
        this.addTableNode(n);
        this.TabelEditBox.string = e;
    }

    public async loadMap(e): Promise<void> {
        const t = JSON.parse(e);
        const o = this;
        this.onClear(null, true);
        await this.changeTable(t.table_key);
        t.balls.forEach(function (e) {
            o.createBall(e).Ball_id = e.ballID;
        });
    }

    public async start(): Promise<void> {
        console.log(this.jsonArr);
        this.list.numItems = this.jsonArr.length;
        this.SelectionBox.active = false;
        const e = cc.winSize;
        console.log("design size", e);
        const t = e.height / e.width;
        console.log("ratio", t);
        t > 2 && (cc.find("Camera3D", this.node).z *= 1.225);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        if (MapEditor.PlayJson) this.loadMap(MapEditor.PlayJson); else {
            this.changeTable("0_1");
            this.onClear(null, false);
        }
    }

    filterCard(e) {
        return null != e.getComponent(BallEditor);
    }

    addTableNode(e) {
        const t = cc.find("plane_table", this.node);
        const o = t.getChildByName("table_layers");
        o.removeAllChildren(true);
        const n = e.getChildByName("plane_table");
        const i = n.getChildByName("table_layers").getChildByName("table");
        i.setParent(o);
        i.setPosition(cc.Vec2.ZERO);
        const a = t.getChildByName("table_touch");
        t.removeChild(a, true);
        const r = n.getChildByName("table_touch");
        r.setParent(t);
        r.setPosition(cc.Vec2.ZERO);
        const l = cc.find("zhuo_pengzhuang", this.node);
        l.removeAllChildren(true);
        const s = e.getChildByName("zhuo_pengzhuang").getChildByName("pengzhuang_root");
        s.setParent(l);
        s.setPosition(cc.Vec2.ZERO);
        this.addEvent();
    }

    onClear(e, t) {
        if (undefined === e) {
            e = null;
        }
        if (undefined === t) {
            t = false;
        }
        this.ballParent.removeAllChildren();
        this.shadow_container.removeAllChildren();
        this.ballID = 0;
        t || this.createBall({
            x: 0,
            y: 0,
            ballID: 0
        });
    }

    onImportBtnClick() {
        const e = this;
        console.log("导入关卡");
        FileMgr.readJsonFile(function (t, o) {
            console.log("导入关卡", o, t);
            e.LevelEditBox.string = o.split(".")[0];
            "string" == typeof t && e.loadMap(t);
        });
    }

    onKeyUp(e) {
        switch (e.keyCode) {
            case cc.macro.KEY.ctrl:
            case cc.macro.KEY.space:
                this.ctrlOrCmdPressed = false;
                break;
            case cc.macro.KEY.shift:
                this.addNum = 1;
        }
    }

    onKeyDown(e) {
        const t = this;
        switch (e.keyCode) {
            case cc.macro.KEY.w:
                this.SelectedCards.forEach(function (e) {
                    return e.node.setPosition(e.node.x, e.node.y + t.addNum);
                });
                break;
            case cc.macro.KEY.s:
                this.SelectedCards.forEach(function (e) {
                    return e.node.setPosition(e.node.x, e.node.y - t.addNum);
                });
                break;
            case cc.macro.KEY.a:
                this.SelectedCards.forEach(function (e) {
                    return e.node.setPosition(e.node.x - t.addNum, e.node.y);
                });
                break;
            case cc.macro.KEY.d:
                this.SelectedCards.forEach(function (e) {
                    return e.node.setPosition(e.node.x + t.addNum, e.node.y);
                });
                break;
            case cc.macro.KEY.x:
            case cc.macro.KEY.Delete:
            case cc.macro.KEY.backspace:
                this.SelectedCards.forEach(function (e) {
                    t.ballParent.removeChild(e.node);
                });
                break;
            case cc.macro.KEY.f:
                this.onCopyCardBtnClick();
                break;
            case cc.macro.KEY.ctrl:
                this.ctrlOrCmdPressed = true;
            case cc.macro.KEY.space:
                break;
            case cc.macro.KEY.shift:
                this.addNum = 10;
        }
    }

    onTableChangeBtnClick() {
        const e = this.TabelEditBox.string;
        this.changeTable(e);
    }
}
