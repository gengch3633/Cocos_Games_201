import BallLogicMgr from "./BallLogicMgr";
import GlobalConfig from "./GlobalConfig";
import util from "./util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ListPageItemDetailComp extends cc.Component {
    @property
    idx = 0;

    @property(cc.Prefab)
    ball_Prefab = null;

    @property(cc.Prefab)
    white_ball_Prefab = null;

    publictableInfo = null;
    createBalls = null;
    callback = null;
    isEditing = null;

    closeAndDestroy() {
        this.node.parent = null;
        this.node.destroy();
    }

    setCallback(e) {
        this.callback = e;
    }

    close() {
        this.node.parent = null;
    }

    update() {}

    clear() {}

    show(e, t) {
        this.node.parent = e;
        this.setData(t);
        console.log("detail show", e, t);
    }

    setData(e) {
        this.publictableInfo = util.clone(e);
        this.createBalls = this.createBalls || [];
        cc.find("label_name", this.node).getComponent(cc.Label).string = e.tableID;
        this.clear();
        for (var t = cc.find("billiardtable", this.node), o = e.tableInfo.balls, n = 0; n < o.length; n++) {
            var i = o[n];
            var a;
            if (i.ballType == BallLogicMgr.BallIDType_White) {
                (a = cc.instantiate(this.white_ball_Prefab)).parent = t;
                a.x = i.x;
                a.y = i.y;
                this.createBalls.push(a);
            } else if (i.ballType == BallLogicMgr.BallIDType_Normal) {
                (a = cc.instantiate(this.ball_Prefab)).parent = t;
                a.x = i.x;
                a.y = i.y;
                a.getComponent("BallMaterialComp").setMatIdx(i.ballMatIdx);
                this.createBalls.push(a);
            }
        }
        cc.find("label_id", this.node).getComponent(cc.Label).string = this.publictableInfo.sID;
        cc.find("label_name", this.node).getComponent(cc.Label).string = this.publictableInfo.name;
        var r = cc.find("node_left", this.node);
        cc.find("label_totalv", r).getComponent(cc.Label).string = this.publictableInfo.totalNum;
        cc.find("label_winv", r).getComponent(cc.Label).string = this.publictableInfo.winNum;
        cc.find("label_zan", this.node).getComponent(cc.Label).string = this.publictableInfo.zanIDS;
        cc.find("label_prv", r).getComponent(cc.Label).string = Math.floor(100 * this.publictableInfo.pr) + "%";
    }

    onLoad() {
        var e = this;
        this.idx = this.idx || 0;
        this.createBalls = this.createBalls || [];
        this.isEditing = this.isEditing || false;
        this.publictableInfo = this.publictableInfo || null;
        cc.find("button_back", this.node).on("click", function () {
            e.closeAndDestroy();
        });
        cc.find("button_zan", this.node).on("click", function () {
            BallLogicMgr.do_zan(e.publictableInfo, function () {
                e.publictableInfo.zanIDS = e.publictableInfo.zanIDS + 1;
                cc.find("label_zan", e.node).getComponent(cc.Label).string = e.publictableInfo.zanIDS;
            });
        });
        cc.find("button_go", this.node).on("click", function () {
            if (e.publictableInfo) {
                BallLogicMgr.gotoTable_challenge(e.publictableInfo.tableInfo, e.publictableInfo);
                GlobalConfig.add_challenge_list(e.publictableInfo.sID);
            }
            e.closeAndDestroy();
        });
    }
}
