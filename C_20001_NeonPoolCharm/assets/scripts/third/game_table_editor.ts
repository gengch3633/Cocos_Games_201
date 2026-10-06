import * as BallLogicMgr from "./BallLogicMgr";
import * as GameMgr from "./GameMgr";
import * as GlobalConfig from "./GlobalConfig";

const EditorMaxBallSize = GlobalConfig.Editor_MaxBallSize || 25;

const { ccclass, property } = cc._decorator;

@ccclass
export default class game_table_editor extends cc.Component {
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
        this.ui_condition.getComponent("game_UI_condition").setCallback((conditionInfo: any) => {
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
        const container = cc.find("node_ballModel_container", this.node);
        for (let i = 0; i < 5; i++) {
            const ballModel = cc.instantiate(this.ball_model_Prefab);
            ballModel.parent = container;
            ballModel.y = 90 * -i;
            ballModel.scale = 2;
            const matIdx = i + 2;
            ballModel.getComponent("BallMaterialComp").setMatIdx(matIdx);
            this.addTouchEvent(ballModel, tableNode);
            this.ballMatIdxs.push(matIdx);
        }
        const shopConfig = BallLogicMgr.shop_config();
        const container2 = cc.find("node_ballModel_container2", this.node);
        const ownedBalls = GlobalConfig.shop_ball_get().arr;
        for (let i = 0; i < ownedBalls.length; i++) {
            const cid = ownedBalls[i];
            const config = BallLogicMgr.getBy_cid(cid, shopConfig.balls_more);
            const ballModel = cc.instantiate(this.ball_model_Prefab);
            ballModel.parent = container2;
            ballModel.y = 90 * -i;
            ballModel.scale = 2;
            const matIdx = config.matIdx;
            ballModel.getComponent("BallMaterialComp").setMatIdx(matIdx);
            this.addTouchEvent(ballModel, tableNode);
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
                const balls = cc.find("node_table", this.node).children;
                for (let i = 0; i < balls.length; i++) {
                    const ball = balls[i];
                    if (ball.getComponent("BallControlInEditor")) {
                        const ballID = ball.getComponent("BallControlInEditor").ballID;
                        const matIdx = ball.getComponent("BallControlInEditor").getMatIdx();
                        console.log("matIdx ballID", matIdx, ballID);
                        if (matIdxs.indexOf(matIdx) < 0 && ballID != 100) {
                            matIdxs.push(matIdx);
                        }
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
            const touchPoint = cc.v2((event.touch as any)._point.x, (event.touch as any)._point.y);
            const localPos = tableNode.convertToNodeSpaceAR(touchPoint);
            this.sel_ball = this.checkBallClicked(localPos);
            this.sel_ball && this.sel_ball.getComponent("BallControlInEditor").onStart(event);
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            console.log("TOUCH_MOVE");
            if (this.sel_ball) {
                const touchPoint = cc.v2((event.touch as any)._point.x, (event.touch as any)._point.y);
                const localPos = this.sel_ball.parent.convertToNodeSpaceAR(touchPoint);
                if (this.checkNewPosAvailable(this.sel_ball, localPos)) {
                    this.sel_ball.getComponent("BallControlInEditor").onMove(event);
                }
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

    update(): void {}

    loadTableInfo(tableInfo: any): void {
        console.log("loadTableInfo", tableInfo);
        this.tableInfo = tableInfo;
        let ballNode: cc.Node = null;
        const self = this;
        const tableNode = cc.find("node_table", this.node);
        const whiteBall = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
        for (let i = 0; i < this.tableInfo.balls.length; i++) {
            const ballInfo = this.tableInfo.balls[i];
            if (ballInfo.ballType == BallLogicMgr.BallIDType_Normal) {
                ballNode = cc.instantiate(self.newBall_Prefab);
                ballNode.parent = tableNode;
                ballNode.getComponent("BallControlInEditor").node_editor = self;
                ballNode.getComponent("BallControlInEditor").ballType = ballInfo.ballType;
                ballNode.getComponent("BallControlInEditor").ballID = ballInfo.ballID;
                ballNode.getComponent("BallControlInEditor").setMatIdx(ballInfo.ballMatIdx);
                ballNode.getComponent("BallControlInEditor").deleteFun((node: cc.Node) => {
                    self.delleteOne(node);
                });
                ballNode.x = Math.floor(ballInfo.x);
                ballNode.y = Math.floor(ballInfo.y);
                this.ballMap.set(ballNode, ballInfo);
            } else {
                whiteBall.x = Math.floor(ballInfo.x);
                whiteBall.y = Math.floor(ballInfo.y);
            }
        }
    }

    getMatNum(): number {
        const matIdxs: number[] = [];
        for (const [, ballInfo] of this.ballMap.entries()) {
            if (matIdxs.indexOf(ballInfo.ballMatIdx) < 0) {
                matIdxs.push(ballInfo.ballMatIdx);
            }
        }
        return matIdxs.length;
    }

    showTip(msg: string): void {
        cc.find("node_floatTip", this.node).getComponent("FloatTipComp").show(msg);
    }

    checkBallClicked(pos: cc.Vec2): cc.Node {
        let minDist = 30;
        let selected: cc.Node = null;
        for (const [ballNode] of this.ballMap.entries()) {
            const ballPos = cc.v2(ballNode.x, ballNode.y);
            const dist = cc.Vec2.distance(pos, ballPos);
            console.log("len", dist);
            if (dist <= minDist) {
                minDist = dist;
                selected = ballNode;
            }
        }
        const whiteBall = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
        const whitePos = cc.v2(whiteBall.x, whiteBall.y);
        const whiteDist = cc.Vec2.distance(pos, whitePos);
        if (whiteDist <= minDist) {
            selected = whiteBall;
        }
        return selected;
    }

    saveTableInfo(mode?: number): any {
        mode = mode || 0;
        const balls: any[] = [];
        let ballID = 100 * BallLogicMgr.BallIDType_Normal;
        for (const [ballNode, ballInfo] of this.ballMap.entries()) {
            const packed = BallLogicMgr.pack_BallInfo(
                ballID,
                ballInfo.ballType,
                Math.floor(ballNode.x),
                Math.floor(ballNode.y),
                ballInfo.ballMatIdx
            );
            balls.push(packed);
            ballID += 1;
        }
        const whiteBall = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
        const whitePacked = BallLogicMgr.pack_BallInfo(
            100 * BallLogicMgr.BallIDType_White,
            BallLogicMgr.BallIDType_White,
            Math.floor(whiteBall.x),
            Math.floor(whiteBall.y)
        );
        balls.push(whitePacked);
        if (balls.length > 0 && this.tableInfo) {
            this.tableInfo.balls = balls;
            return this.tableInfo;
        }
        console.log("saveTableInfo failed", balls.length > 0, this.tableInfo);
        return null;
    }

    clear(): void {
        for (const [ballNode] of this.ballMap.entries()) {
            ballNode.parent = null;
            ballNode.destroy();
        }
        this.ballMap.clear();
        this.ballIdx = 0;
        const whiteBall = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
        whiteBall.x = 0;
        whiteBall.y = -195;
    }

    delleteOne(ballNode: cc.Node): void {
        if (this.ballMap.get(ballNode)) {
            this.ballMap.delete(ballNode);
            this.ballIdx = this.ballIdx - 1;
        }
    }

    checkNewPosAvailable(ballNode: cc.Node, pos: cc.Vec2): boolean {
        const whiteBall = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
        for (const [node] of this.ballMap.entries()) {
            if (node != ballNode) {
                const dist = cc.Vec2.distance(cc.v2(node.x, node.y), cc.v2(pos.x, pos.y));
                console.log("len", dist, dist <= 32);
                if (dist <= 32) {
                    return false;
                }
            }
        }
        if (whiteBall != ballNode) {
            const dist = cc.Vec2.distance(cc.v2(whiteBall.x, whiteBall.y), cc.v2(pos.x, pos.y));
            if (dist <= 32) {
                return false;
            }
        }
        return true;
    }

    saveOne(ballNode: cc.Node): void {
        const ballInfo = {
            x: Math.floor(ballNode.x),
            y: Math.floor(ballNode.y),
            ballType: ballNode.getComponent("BallControlInEditor").ballType,
            ballMatIdx: ballNode.getComponent("BallControlInEditor").getMatIdx(),
        };
        this.ballMap.set(ballNode, ballInfo);
        this.ballIdx = this.ballIdx + 1;
        console.log("saveOne", this.ballMap.size, ballNode.getComponent("BallControlInEditor").getMatIdx());
    }

    callback(): void {}

    checkAvailable(pos: cc.Vec2): boolean {
        const checkRect = cc.find("node_table", this.node).getChildByName("node_checkRect");
        if (
            !cc
                .rect(-checkRect.width / 2, -checkRect.height / 2, checkRect.width, checkRect.height)
                .contains(cc.v2(pos.x, pos.y))
        ) {
            console.log("not contains");
            return false;
        }
        return true;
    }

    addTouchEvent(source: cc.Node, tableNode: cc.Node, ballType?: number): void {
        let draggingBall: cc.Node = null;
        ballType = ballType || BallLogicMgr.BallIDType_Normal;
        source.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            console.log("TOUCH_START");
            const touchPoint = cc.v2((event.touch as any)._point.x, (event.touch as any)._point.y);
            const localPos = tableNode.convertToNodeSpaceAR(touchPoint);
            draggingBall = cc.instantiate(this.newBall_Prefab);
            draggingBall.parent = tableNode;
            draggingBall.getComponent("BallControlInEditor").node_editor = this;
            draggingBall.getComponent("BallControlInEditor").ballType = ballType;
            draggingBall.getComponent("BallControlInEditor").setMatIdx(source.getComponent("BallMaterialComp").getMatIdx());
            draggingBall.getComponent("BallControlInEditor").deleteFun((node: cc.Node) => {
                this.delleteOne(node);
            });
            draggingBall.x = Math.floor(localPos.x);
            draggingBall.y = Math.floor(localPos.y);
        });
        source.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            if (draggingBall) {
                const touchPoint = cc.v2((event.touch as any)._point.x, (event.touch as any)._point.y);
                const localPos = tableNode.convertToNodeSpaceAR(touchPoint);
                if (this.checkNewPosAvailable(draggingBall, localPos)) {
                    draggingBall.x = Math.floor(localPos.x);
                    draggingBall.y = Math.floor(localPos.y);
                }
            }
        });
        source.on(cc.Node.EventType.TOUCH_END, () => {
            console.log("TOUCH_END");
            if (draggingBall) {
                draggingBall.parent = null;
                draggingBall.destroy();
            }
            draggingBall = null;
        });
        source.on(cc.Node.EventType.TOUCH_CANCEL, () => {
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
        const balls: cc.Node[] = [cc.find("node_table", this.node).getChildByName("node_ball_model_white")];
        for (const [ballNode] of this.ballMap.entries()) {
            balls.push(ballNode);
        }
        for (let i = 0; i < balls.length; i++) {
            const ballA = balls[i];
            for (let j = 0; j < balls.length; j++) {
                if (ballA != balls[j]) {
                    const dist = cc.Vec2.distance(cc.v2(ballA.x, ballA.y), cc.v2(balls[j].x, balls[j].y));
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
