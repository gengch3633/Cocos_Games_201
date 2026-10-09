import BallLogicMgr from "./BallLogicMgr";
import DB from "./DB";
import util from "./util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ListPageItemComp extends cc.Component {
    @property
    idx = 0;

    @property(cc.Prefab)
    ball_Prefab = null;

    @property(cc.Prefab)
    white_ball_Prefab = null;

    @property(cc.Prefab)
    ui_detail_Prefab = null;

    publictableInfo = null;
    delCb = null;
    createBalls = null;
    isEditing = null;
    isAllowDel = null;
    isCalDel = null;

    setData(e) {
        this.publictableInfo = util.clone(e);
        cc.find("label_name", this.node).getComponent(cc.Label).string = e.sID;
        cc.find("label_totalv", this.node).getComponent(cc.Label).string = e.totalNum;
        cc.find("label_prv", this.node).getComponent(cc.Label).string = Math.floor(100 * e.pr) + "%";
        -1 == e.tableID && (cc.find("label_name", this.node).getComponent(cc.Label).string = "新建一个");
        cc.find("label_zan", this.node).getComponent(cc.Label).string = this.publictableInfo.zanIDS;
        this.clear();
        var t = this.publictableInfo.time,
            o = new Date().getTime() - t,
            n = Math.floor(o / 36e5);
        this.isAllowDel && n >= 24 && t >= 0 && this.setDelBtn(true);
        for (var i = cc.find("sprite_bg", this.node), a = e.tableInfo.balls, l = 0; l < a.length; l++) {
            var c = a[l];
            var u;
            if (c.ballType == BallLogicMgr.BallIDType_White) {
                (u = cc.instantiate(this.white_ball_Prefab)).parent = i;
                u.x = c.x;
                u.y = c.y;
                this.createBalls.push(u);
            } else if (c.ballType == BallLogicMgr.BallIDType_Normal) {
                (u = cc.instantiate(this.ball_Prefab)).parent = i;
                u.x = c.x;
                u.y = c.y;
                u.getComponent("BallMaterialComp").setMatIdx(c.ballMatIdx);
                this.createBalls.push(u);
            }
        }
    }

    setDelCB(e) {
        this.delCb = e;
    }

    clear() {
        this.createBalls = this.createBalls || [];
        for (var e = 0; e < this.createBalls.length; e++) {
            this.createBalls[e].destroy();
            this.createBalls[e].parent = null;
        }
        this.createBalls = [];
    }

    setAsEditing(e) {
        this.isEditing = e;
        var t = cc.find("cm_plus", this.node);
        if (e) {
            t.opacity = 255;
            cc.find("label_name", this.node).getComponent(cc.Label).string = "新建一个";
        } else t.opacity = 0;
    }

    onDestroy() {
        this.clear();
    }

    update() {}

    getIsEditing() {
        return this.isEditing;
    }

    onEnable() {}

    onLoad() {
        var e = this;
        this.idx = this.idx || 0;
        this.createBalls = this.createBalls || [];
        this.isEditing = this.isEditing || false;
        this.publictableInfo = this.publictableInfo || null;
        this.delCb = this.delCb || null;
        this.isCalDel = false;
        this.setDelBtn(false);
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            if (e.isEditing) e.publictableInfo && BallLogicMgr.gotoEditor(e.publictableInfo.tableInfo);else if (e.publictableInfo) {
                var t = cc.instantiate(e.ui_detail_Prefab),
                    o = e.node.parent.parent;
                t.getComponent("ListPageItemDetailComp").show(o, e.publictableInfo);
            }
        });
        cc.find("button_del", this.node).on("click", function () {
            e.isCalDel && DB.removeOnePublicTableInfo(e.publictableInfo, function () {
                console.log("removeOnePublicTableInfo finish", e.publictableInfo.sID);
                if (e.delCb) {
                    BallLogicMgr.publicTableList_removeBysID(e.publictableInfo.sID);
                    e.delCb(e.publictableInfo.sID);
                }
            });
        });
    }

    setAllowDel(e) {
        this.isAllowDel = e;
        e || this.setDelBtn(false);
    }

    setDelBtn(e) {
        cc.find("button_del", this.node).active = e;
        this.isCalDel = e;
    }
}
