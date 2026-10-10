import BallLogicMgr from "./BallLogicMgr";
import GameMgr from "./GameMgr";
import GlobalConfig from "./GlobalConfig";

const { ccclass, property } = cc._decorator;

const h = GlobalConfig.Editor_MaxBallSize || 25;

@ccclass("game_table_editor")
export default class game_table_editor extends cc.Component {
    @property(cc.Prefab)
    ball_model_Prefab = null;

    @property(cc.Prefab)
    newBall_Prefab = null;

    @property(cc.Prefab)
    white_newBall_Prefab = null;

    @property(cc.Prefab)
    ui_condition_Prefab = null;

    ballIdx = null;
    ui_condition = null;
    ballMap = null;
    ballMatIdxs = null;
    tableInfo = null;
    sel_ball = null;

    onLoad() {
        const e = this;
        if (GlobalConfig.debug_alpha) {
            this.node.opacity = 25;
        }
        this.ui_condition = cc.instantiate(this.ui_condition_Prefab);
        this.ui_condition.getComponent("game_UI_condition").setCallback(function (t) {
            const o = e.saveTableInfo(0);
            console.log("tableInfo && conditionInfo", o, t);
            if (o && t) {
                if (!o.balls) {
                    e.showTip("请选择目标球");
                    return;
                }
                if (o.balls.length <= 1) {
                    return;
                }
                o.condition = t;
                const n = BallLogicMgr.pack_PublicTableInfo(o, true);
                GameMgr.local_set(GameMgr.LSKEY_EditingTableInfo, n);
                e.node.destroy();
                BallLogicMgr.gotoTable_editing(o);
            }
        });
        this.ballMap = new Map();
        this.ballIdx = 0;
        this.ballMatIdxs = [];
        const t = cc.find("node_table", this.node);
        cc.find("node_ball_model_white", this.node);
        const o = cc.find("node_ballModel_container", this.node);
        let p;
        for (let n = 0; n < 5; n++) {
            p = cc.instantiate(this.ball_model_Prefab);
            p.parent = o;
            p.y = 90 * -n;
            p.scale = 2;
            const i = n + 2;
            p.getComponent("BallMaterialComp").setMatIdx(i);
            this.addTouchEvent(p, t);
            this.ballMatIdxs.push(i);
        }
        const a = BallLogicMgr.shop_config();
        const c = cc.find("node_ballModel_container2", this.node);
        const u = GlobalConfig.shop_ball_get().arr;
        for (let n = 0; n < u.length; n++) {
            const d = u[n];
            const _ = BallLogicMgr.getBy_cid(d, a.balls_more);
            p = cc.instantiate(this.ball_model_Prefab);
            p.parent = c;
            p.y = 90 * -n;
            p.scale = 2;
            const i = _.matIdx;
            p.getComponent("BallMaterialComp").setMatIdx(i);
            this.addTouchEvent(p, t);
            this.ballMatIdxs.push(i);
        }
        cc.find("button_ok", this.node).on("click", function () {
            const tableInfo = e.saveTableInfo(0);
            console.log("button_ok", tableInfo);
            if (tableInfo) {
                console.log("tableInfo", tableInfo, tableInfo.balls);
                if (!tableInfo.balls) {
                    e.showTip("无法保存空场景");
                    return;
                }
                if (tableInfo.balls.length <= 1) {
                    e.showTip("无法保存空场景");
                    return;
                }
                if (e.checkBallsCollide()) {
                    e.showTip("有重叠，无法保存");
                    return;
                }
                if (e.getMatNum() >= 8) {
                    e.showTip("球的种类太多了!");
                    return;
                }
                e.ui_condition.parent = e.node;
                const mats = [];
                const children = cc.find("node_table", e.node).children;
                for (let i = 0; i < children.length; i++) {
                    const node = children[i];
                    if (node.getComponent("BallControlInEditor")) {
                        const ballID = node.getComponent("BallControlInEditor").ballID;
                        const matIdx = node.getComponent("BallControlInEditor").getMatIdx();
                        console.log("matIdx ballID", matIdx, ballID);
                        if (mats.indexOf(matIdx) < 0 && 100 != ballID) {
                            mats.push(matIdx);
                        }
                    }
                }
                e.ui_condition.getComponent("game_UI_condition").setMatIdxs(mats);
            } else {
                e.showTip("无法保存空场景");
            }
        });
        cc.find("button_back", this.node).on("click", function () {
            const info = e.saveTableInfo();
            if (info) {
                const packed = BallLogicMgr.pack_PublicTableInfo(info, true);
                GameMgr.local_set(GameMgr.LSKEY_EditingTableInfo, packed);
            }
            e.node.destroy();
            BallLogicMgr.backtoInfoList();
        });
        cc.find("button_clear", this.node).on("click", function () {
            e.clear();
            e.showTip("已经清空！");
        });
        cc.find("button_save2", this.node).on("click", function () {
            const info = e.saveTableInfo();
            const packed = BallLogicMgr.pack_PublicTableInfo(info, true);
            GameMgr.local_set(GameMgr.LSKEY_EditingTableInfo, packed);
        });
        if (BallLogicMgr.editingTableInfo) {
            this.loadTableInfo(BallLogicMgr.editingTableInfo);
        } else {
            console.log("into editor but no editingTableInfo", BallLogicMgr.editingTableInfo);
        }
        this.node.on(cc.Node.EventType.TOUCH_START, function (evt) {
            console.log("TOUCH_START");
            const point = cc.v2(evt.touch._point.x, evt.touch._point.y);
            const local = t.convertToNodeSpaceAR(point);
            e.sel_ball = e.checkBallClicked(local);
            if (e.sel_ball) {
                e.sel_ball.getComponent("BallControlInEditor").onStart(evt);
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (evt) {
            console.log("TOUCH_MOVE");
            if (e.sel_ball) {
                const point = cc.v2(evt.touch._point.x, evt.touch._point.y);
                const local = e.sel_ball.parent.convertToNodeSpaceAR(point);
                if (e.checkNewPosAvailable(e.sel_ball, local)) {
                    e.sel_ball.getComponent("BallControlInEditor").onMove(evt);
                }
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_END, function (evt) {
            console.log("TOUCH_END");
            if (e.sel_ball) {
                e.sel_ball.getComponent("BallControlInEditor").onEnd(evt);
            }
            e.sel_ball = null;
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (evt) {
            console.log("TOUCH_CANCEL");
            if (e.sel_ball) {
                e.sel_ball.getComponent("BallControlInEditor").onCancel(evt);
            }
            e.sel_ball = null;
        });
    }

    update() {}

    loadTableInfo(e) {
        console.log("loadTableInfo", e);
        this.tableInfo = e;
        const o = this;
        const n = cc.find("node_table", this.node);
        const i = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
        for (let a = 0; a < this.tableInfo.balls.length; a++) {
            const l = this.tableInfo.balls[a];
            if (l.ballType == BallLogicMgr.BallIDType_Normal) {
                const ball = cc.instantiate(o.newBall_Prefab);
                ball.parent = n;
                ball.getComponent("BallControlInEditor").node_editor = o;
                ball.getComponent("BallControlInEditor").ballType = l.ballType;
                ball.getComponent("BallControlInEditor").ballID = l.ballID;
                ball.getComponent("BallControlInEditor").setMatIdx(l.ballMatIdx);
                ball.getComponent("BallControlInEditor").deleteFun(function (node) {
                    o.delleteOne(node);
                });
                ball.x = Math.floor(l.x);
                ball.y = Math.floor(l.y);
                this.ballMap.set(ball, l);
            } else {
                i.x = Math.floor(l.x);
                i.y = Math.floor(l.y);
            }
        }
    }

    getMatNum() {
        const t = [];
        for (const entry of Array.from(this.ballMap.entries())) {
            const i = entry[1];
            if (t.indexOf(i.ballMatIdx) < 0) {
                t.push(i.ballMatIdx);
            }
        }
        return t.length;
    }

    showTip(e) {
        cc.find("node_floatTip", this.node).getComponent("FloatTipComp").show(e);
    }

    checkBallClicked(e) {
        let o = 30;
        let n = null;
        for (const entry of Array.from(this.ballMap.entries())) {
            const r = entry[0];
            const l = cc.v2(r.x, r.y);
            const s = cc.Vec2.distance(e, l);
            console.log("len", s);
            if (s <= o) {
                o = s;
                n = r;
            }
        }
        const c = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
        const whitePos = cc.v2(c.x, c.y);
        const whiteDist = cc.Vec2.distance(e, whitePos);
        if (whiteDist <= o) {
            o = whiteDist;
            n = c;
        }
        return n;
    }

    saveTableInfo(e) {
        e = e || 0;
        const o = [];
        let n = 100 * BallLogicMgr.BallIDType_Normal;
        for (const entry of Array.from(this.ballMap.entries())) {
            const l = entry[0];
            const s = entry[1];
            const c = BallLogicMgr.pack_BallInfo(n, s.ballType, Math.floor(l.x), Math.floor(l.y), s.ballMatIdx);
            o.push(c);
            n += 1;
        }
        const u = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
        const p = BallLogicMgr.pack_BallInfo(100 * BallLogicMgr.BallIDType_White, BallLogicMgr.BallIDType_White, Math.floor(u.x), Math.floor(u.y));
        o.push(p);
        if (o.length > 0 && this.tableInfo) {
            this.tableInfo.balls = o;
            return this.tableInfo;
        }
        console.log("saveTableInfo failed", o.length > 0, this.tableInfo);
        return null;
    }

    clear() {
        for (const entry of Array.from(this.ballMap.entries())) {
            const n = entry[0];
            n.parent = null;
            n.destroy();
        }
        this.ballMap.clear();
        this.ballIdx = 0;
        const i = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
        i.x = 0;
        i.y = -195;
    }

    delleteOne(e) {
        if (this.ballMap.get(e)) {
            this.ballMap.delete(e);
            this.ballIdx = this.ballIdx - 1;
        }
    }

    checkNewPosAvailable(e, t) {
        const n = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
        for (const entry of Array.from(this.ballMap.entries())) {
            const r = entry[0];
            if (r != e) {
                const l = cc.Vec2.distance(cc.v2(r.x, r.y), cc.v2(t.x, t.y));
                console.log("len", l, l <= 32);
                if (l <= 32) {
                    return false;
                }
            }
        }
        if (n != e) {
            const l = cc.Vec2.distance(cc.v2(n.x, n.y), cc.v2(t.x, t.y));
            if (l <= 32) {
                return false;
            }
        }
        return true;
    }

    saveOne(e) {
        const t = {
            x: Math.floor(e.x),
            y: Math.floor(e.y),
            ballType: e.getComponent("BallControlInEditor").ballType,
            ballMatIdx: e.getComponent("BallControlInEditor").getMatIdx()
        };
        this.ballMap.set(e, t);
        this.ballIdx = this.ballIdx + 1;
        console.log("saveOne", this.ballMap.size, e.getComponent("BallControlInEditor").getMatIdx());
    }

    callback() {}

    checkAvailable(e) {
        const t = cc.find("node_table", this.node).getChildByName("node_checkRect");
        if (!cc.rect(-t.width / 2, -t.height / 2, t.width, t.height).contains(cc.v2(e.x, e.y))) {
            console.log("not contains");
            return false;
        }
        return true;
    }

    addTouchEvent(e, t, o) {
        const n = this;
        let i = null;
        o = o || BallLogicMgr.BallIDType_Normal;
        e.on(cc.Node.EventType.TOUCH_START, function (a) {
            console.log("TOUCH_START");
            const r = cc.v2(a.touch._point.x, a.touch._point.y);
            const l = t.convertToNodeSpaceAR(r);
            i = cc.instantiate(n.newBall_Prefab);
            i.parent = t;
            i.getComponent("BallControlInEditor").node_editor = n;
            i.getComponent("BallControlInEditor").ballType = o;
            i.getComponent("BallControlInEditor").setMatIdx(e.getComponent("BallMaterialComp").getMatIdx());
            i.getComponent("BallControlInEditor").deleteFun(function (node) {
                n.delleteOne(node);
            });
            i.x = Math.floor(l.x);
            i.y = Math.floor(l.y);
        });
        e.on(cc.Node.EventType.TOUCH_MOVE, function (evt) {
            if (i) {
                const point = cc.v2(evt.touch._point.x, evt.touch._point.y);
                const local = t.convertToNodeSpaceAR(point);
                if (n.checkNewPosAvailable(i, local)) {
                    i.x = Math.floor(local.x);
                    i.y = Math.floor(local.y);
                }
            }
        });
        e.on(cc.Node.EventType.TOUCH_END, function () {
            console.log("TOUCH_END");
            if (i) {
                i.parent = null;
                i.destroy();
            }
            i = null;
        });
        e.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            console.log("TOUCH_CANCEL", n.getMatNum());
            if (n.checkAvailable(i)) {
                if (n.getMatNum() >= 8) {
                    i.parent = null;
                    i.destroy();
                    n.showTip("球的种类太多了!");
                } else if (n.ballMap.size < h) {
                    n.saveOne(i);
                } else {
                    i.parent = null;
                    i.destroy();
                    n.showTip("球的数量超过限制了!");
                }
            } else {
                i.parent = null;
                i.destroy();
            }
            i = null;
        });
    }

    onDestroy() {
        console.log("****game_table_editor destroyed***");
        this.ui_condition.destroy();
    }

    checkBallsCollide() {
        const t = [cc.find("node_table", this.node).getChildByName("node_ball_model_white")];
        for (const entry of Array.from(this.ballMap.entries())) {
            const i = entry[0];
            t.push(i);
        }
        for (let a = 0; a < t.length; a++) {
            const r = t[a];
            for (let l = 0; l < t.length; l++) {
                if (r != t[l]) {
                    const s = cc.Vec2.distance(cc.v2(r.x, r.y), cc.v2(t[l].x, t[l].y));
                    console.log("len", s);
                    if (s <= 30) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
