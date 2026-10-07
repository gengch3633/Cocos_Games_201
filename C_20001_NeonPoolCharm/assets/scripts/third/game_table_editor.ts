import BallLogicMgr from "./BallLogicMgr";
import GameMgr from "./GameMgr";
import GlobalConfig from "./GlobalConfig";

const { ccclass, property } = cc._decorator;

const EditorMaxBallSize = GlobalConfig.Editor_MaxBallSize || 25;

@ccclass("game_table_editor")
export default class GameTableEditor extends cc.Component {
    @property(cc.Prefab)
    ball_model_Prefab: cc.Prefab = null;

    @property(cc.Prefab)
    newBall_Prefab: cc.Prefab = null;

    @property(cc.Prefab)
    white_newBall_Prefab: cc.Prefab = null;

    @property(cc.Prefab)
    ui_condition_Prefab: cc.Prefab = null;

    ballIdx: number = null;
    ui_condition: cc.Node = null;
    ballMap: Map<cc.Node, any> = null;
    ballMatIdxs: number[] = null;
    tableInfo: any = null;
    sel_ball: cc.Node = null;

    onLoad(): void {
        GlobalConfig.debug_alpha && (this.node.opacity = 25);
        this.ui_condition = cc.instantiate(this.ui_condition_Prefab);
        this.ui_condition.getComponent("game_UI_condition").setCallback((conditionInfo) => {
            const tableInfo = this.saveTableInfo(0);
            console.log("tableInfo && conditionInfo", tableInfo, conditionInfo);
            if (tableInfo && conditionInfo) {
                if (!tableInfo.balls) {
                    this.showTip("请选择目标球");
                    return;
                }
                if (tableInfo.balls.length <= 1) {
                    return;
                }
                tableInfo.condition = conditionInfo;
                const packed = BallLogicMgr.pack_PublicTableInfo(tableInfo, true);
                GameMgr.local_set(GameMgr.LSKEY_EditingTableInfo, packed);
                this.node.destroy();
                BallLogicMgr.gotoTable_editing(tableInfo);
            }
        });
        this.ballMap = new Map();
        this.ballIdx = 0;
        this.ballMatIdxs = [];
        const tableNode = cc.find("node_table", this.node);
        const ballModelContainer = cc.find("node_ballModel_container", this.node);
        for (let n = 0; n < 5; n++) {
            const model = cc.instantiate(this.ball_model_Prefab);
            model.parent = ballModelContainer;
            model.y = 90 * -n;
            model.scale = 2;
            const matIdx = n + 2;
            model.getComponent("BallMaterialComp").setMatIdx(matIdx);
            this.addTouchEvent(model, tableNode);
            this.ballMatIdxs.push(matIdx);
        }
        const shopConfig = BallLogicMgr.shop_config();
        const ballModelContainer2 = cc.find("node_ballModel_container2", this.node);
        const ownedBalls = GlobalConfig.shop_ball_get().arr;
        for (let n = 0; n < ownedBalls.length; n++) {
            const cid = ownedBalls[n];
            const ballCfg = BallLogicMgr.getBy_cid(cid, shopConfig.balls_more);
            const model = cc.instantiate(this.ball_model_Prefab);
            model.parent = ballModelContainer2;
            model.y = 90 * -n;
            model.scale = 2;
            const matIdx = ballCfg.matIdx;
            model.getComponent("BallMaterialComp").setMatIdx(matIdx);
            this.addTouchEvent(model, tableNode);
            this.ballMatIdxs.push(matIdx);
        }
        cc.find("button_ok", this.node).on("click", () => {
            const tableInfo = this.saveTableInfo(0);
            console.log("button_ok", tableInfo);
            if (tableInfo) {
                console.log("tableInfo", tableInfo, tableInfo.balls);
                if (!tableInfo.balls) {
                    this.showTip("无法保存空场景");
                    return;
                }
                if (tableInfo.balls.length <= 1) {
                    this.showTip("无法保存空场景");
                    return;
                }
                if (this.checkBallsCollide()) {
                    this.showTip("有重叠，无法保存");
                    return;
                }
                if (this.getMatNum() >= 8) {
                    this.showTip("球的种类太多了!");
                    return;
                }
                this.ui_condition.parent = this.node;
                const matIdxs: number[] = [];
                const children = cc.find("node_table", this.node).children;
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (child.getComponent("BallControlInEditor")) {
                        const ballID = child.getComponent("BallControlInEditor").ballID;
                        const matIdx = child.getComponent("BallControlInEditor").getMatIdx();
                        console.log("matIdx ballID", matIdx, ballID);
                        matIdxs.indexOf(matIdx) < 0 && ballID != 100 && matIdxs.push(matIdx);
                    }
                }
                this.ui_condition.getComponent("game_UI_condition").setMatIdxs(matIdxs);
            } else {
                this.showTip("无法保存空场景");
            }
        });
        cc.find("button_back", this.node).on("click", () => {
            const tableInfo = this.saveTableInfo();
            if (tableInfo) {
                const packed = BallLogicMgr.pack_PublicTableInfo(tableInfo, true);
                GameMgr.local_set(GameMgr.LSKEY_EditingTableInfo, packed);
            }
            this.node.destroy();
            BallLogicMgr.backtoInfoList();
        });
        cc.find("button_clear", this.node).on("click", () => {
            this.clear();
            this.showTip("已经清空！");
        });
        cc.find("button_save2", this.node).on("click", () => {
            const tableInfo = this.saveTableInfo();
            const packed = BallLogicMgr.pack_PublicTableInfo(tableInfo, true);
            GameMgr.local_set(GameMgr.LSKEY_EditingTableInfo, packed);
        });
        if (BallLogicMgr.editingTableInfo) {
            this.loadTableInfo(BallLogicMgr.editingTableInfo);
        } else {
            console.log("into editor but no editingTableInfo", BallLogicMgr.editingTableInfo);
        }
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            console.log("TOUCH_START");
            const screenPos = cc.v2(event.touch.getLocation());
            const localPos = tableNode.convertToNodeSpaceAR(screenPos);
            this.sel_ball = this.checkBallClicked(localPos);
            this.sel_ball && this.sel_ball.getComponent("BallControlInEditor").onStart(event);
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            console.log("TOUCH_MOVE");
            if (this.sel_ball) {
                const screenPos = cc.v2(event.touch.getLocation());
                const localPos = this.sel_ball.parent.convertToNodeSpaceAR(screenPos);
                this.checkNewPosAvailable(this.sel_ball, localPos) && this.sel_ball.getComponent("BallControlInEditor").onMove(event);
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            console.log("TOUCH_END");
            this.sel_ball && this.sel_ball.getComponent("BallControlInEditor").onEnd(event);
            this.sel_ball = null;
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            console.log("TOUCH_CANCEL");
            this.sel_ball && this.sel_ball.getComponent("BallControlInEditor").onCancel(event);
            this.sel_ball = null;
        });
    }

    update(): void {
    }

    loadTableInfo(tableInfo: any): void {
        console.log("loadTableInfo", tableInfo);
        this.tableInfo = tableInfo;
        const editor = this;
        const tableNode = cc.find("node_table", this.node);
        const whiteBall = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
        for (let a = 0; a < this.tableInfo.balls.length; a++) {
            const ball = this.tableInfo.balls[a];
            if (ball.ballType == BallLogicMgr.BallIDType_Normal) {
                const node = cc.instantiate(editor.newBall_Prefab);
                node.parent = tableNode;
                node.getComponent("BallControlInEditor").node_editor = editor;
                node.getComponent("BallControlInEditor").ballType = ball.ballType;
                node.getComponent("BallControlInEditor").ballID = ball.ballID;
                node.getComponent("BallControlInEditor").setMatIdx(ball.ballMatIdx);
                node.getComponent("BallControlInEditor").deleteFun((target) => {
                    editor.delleteOne(target);
                });
                node.x = Math.floor(ball.x);
                node.y = Math.floor(ball.y);
                this.ballMap.set(node, ball);
            } else {
                whiteBall.x = Math.floor(ball.x);
                whiteBall.y = Math.floor(ball.y);
            }
        }
    }

    getMatNum(): number {
        const matIdxs: number[] = [];
        for (const entry of this.ballMap.entries()) {
            const info = entry[1];
            matIdxs.indexOf(info.ballMatIdx) < 0 && matIdxs.push(info.ballMatIdx);
        }
        return matIdxs.length;
    }

    showTip(text: string): void {
        cc.find("node_floatTip", this.node).getComponent("FloatTipComp").show(text);
    }

    checkBallClicked(pos: cc.Vec2): cc.Node {
        let minDist = 30;
        let selected: cc.Node = null;
        for (const entry of this.ballMap.entries()) {
            const node = entry[0];
            const nodePos = cc.v2(node.x, node.y);
            const dist = cc.Vec2.distance(pos, nodePos);
            console.log("len", dist);
            if (dist <= minDist) {
                minDist = dist;
                selected = node;
            }
        }
        const whiteBall = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
        const whitePos = cc.v2(whiteBall.x, whiteBall.y);
        const whiteDist = cc.Vec2.distance(pos, whitePos);
        if (whiteDist <= minDist) {
            minDist = whiteDist;
            selected = whiteBall;
        }
        return selected;
    }

    saveTableInfo(_mode?: number): any {
        _mode = _mode || 0;
        const balls: any[] = [];
        let ballID = 100 * BallLogicMgr.BallIDType_Normal;
        for (const entry of this.ballMap.entries()) {
            const node = entry[0];
            const info = entry[1];
            const packed = BallLogicMgr.pack_BallInfo(ballID, info.ballType, Math.floor(node.x), Math.floor(node.y), info.ballMatIdx);
            balls.push(packed);
            ballID += 1;
        }
        const whiteBall = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
        const whitePacked = BallLogicMgr.pack_BallInfo(100 * BallLogicMgr.BallIDType_White, BallLogicMgr.BallIDType_White, Math.floor(whiteBall.x), Math.floor(whiteBall.y));
        balls.push(whitePacked);
        if (balls.length > 0 && this.tableInfo) {
            this.tableInfo.balls = balls;
            return this.tableInfo;
        }
        console.log("saveTableInfo failed", balls.length > 0, this.tableInfo);
        return null;
    }

    clear(): void {
        for (const entry of this.ballMap.entries()) {
            const node = entry[0];
            node.parent = null;
            node.destroy();
        }
        this.ballMap.clear();
        this.ballIdx = 0;
        const whiteBall = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
        whiteBall.x = 0;
        whiteBall.y = -195;
    }

    delleteOne(node: cc.Node): void {
        if (this.ballMap.get(node)) {
            this.ballMap.delete(node);
            this.ballIdx = this.ballIdx - 1;
        }
    }

    checkNewPosAvailable(node: cc.Node, pos: cc.Vec2): boolean {
        const whiteBall = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
        for (const entry of this.ballMap.entries()) {
            const other = entry[0];
            if (other != node) {
                const dist = cc.Vec2.distance(cc.v2(other.x, other.y), cc.v2(pos.x, pos.y));
                console.log("len", dist, dist <= 32);
                if (dist <= 32) {
                    return false;
                }
            }
        }
        return !((whiteBall != node) && cc.Vec2.distance(cc.v2(whiteBall.x, whiteBall.y), cc.v2(pos.x, pos.y)) <= 32);
    }

    saveOne(node: cc.Node): void {
        const info = {
            x: Math.floor(node.x),
            y: Math.floor(node.y),
            ballType: node.getComponent("BallControlInEditor").ballType,
            ballMatIdx: node.getComponent("BallControlInEditor").getMatIdx(),
        };
        this.ballMap.set(node, info);
        this.ballIdx = this.ballIdx + 1;
        console.log("saveOne", this.ballMap.size, node.getComponent("BallControlInEditor").getMatIdx());
    }

    callback(): void {
    }

    checkAvailable(node: cc.Node): boolean {
        const checkRect = cc.find("node_table", this.node).getChildByName("node_checkRect");
        if (!cc.rect(-checkRect.width / 2, -checkRect.height / 2, checkRect.width, checkRect.height).contains(cc.v2(node.x, node.y))) {
            console.log("not contains");
            return false;
        }
        return true;
    }

    addTouchEvent(model: cc.Node, tableNode: cc.Node, ballType?: number): void {
        let draggingBall: cc.Node = null;
        ballType = ballType || BallLogicMgr.BallIDType_Normal;
        model.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            console.log("TOUCH_START");
            const screenPos = cc.v2(event.touch.getLocation());
            const localPos = tableNode.convertToNodeSpaceAR(screenPos);
            draggingBall = cc.instantiate(this.newBall_Prefab);
            draggingBall.parent = tableNode;
            draggingBall.getComponent("BallControlInEditor").node_editor = this;
            draggingBall.getComponent("BallControlInEditor").ballType = ballType;
            draggingBall.getComponent("BallControlInEditor").setMatIdx(model.getComponent("BallMaterialComp").getMatIdx());
            draggingBall.getComponent("BallControlInEditor").deleteFun((target) => {
                this.delleteOne(target);
            });
            draggingBall.x = Math.floor(localPos.x);
            draggingBall.y = Math.floor(localPos.y);
        });
        model.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            if (draggingBall) {
                const screenPos = cc.v2(event.touch.getLocation());
                const localPos = tableNode.convertToNodeSpaceAR(screenPos);
                if (this.checkNewPosAvailable(draggingBall, localPos)) {
                    draggingBall.x = Math.floor(localPos.x);
                    draggingBall.y = Math.floor(localPos.y);
                }
            }
        });
        model.on(cc.Node.EventType.TOUCH_END, () => {
            console.log("TOUCH_END");
            if (draggingBall) {
                draggingBall.parent = null;
                draggingBall.destroy();
            }
            draggingBall = null;
        });
        model.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            console.log("TOUCH_CANCEL", this.getMatNum());
            if (this.checkAvailable(draggingBall)) {
                if (this.getMatNum() >= 8) {
                    draggingBall.parent = null;
                    draggingBall.destroy();
                    this.showTip("球的种类太多了!");
                } else if (this.ballMap.size < EditorMaxBallSize) {
                    this.saveOne(draggingBall);
                } else {
                    draggingBall.parent = null;
                    draggingBall.destroy();
                    this.showTip("球的数量超过限制了!");
                }
            } else {
                draggingBall.parent = null;
                draggingBall.destroy();
            }
            draggingBall = null;
        });
    }

    onDestroy(): void {
        console.log("****game_table_editor destroyed***");
        this.ui_condition.destroy();
    }

    checkBallsCollide(): boolean {
        const nodes = [cc.find("node_table", this.node).getChildByName("node_ball_model_white")];
        for (const entry of this.ballMap.entries()) {
            nodes.push(entry[0]);
        }
        for (let a = 0; a < nodes.length; a++) {
            const nodeA = nodes[a];
            for (let l = 0; l < nodes.length; l++) {
                if (nodeA != nodes[l]) {
                    const dist = cc.Vec2.distance(cc.v2(nodeA.x, nodeA.y), cc.v2(nodes[l].x, nodes[l].y));
                    console.log("len", dist);
                    if (dist <= 30) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
