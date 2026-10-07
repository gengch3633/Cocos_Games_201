import BallLogicMgr from "./BallLogicMgr";
import DB from "./DB";
import util from "./util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ListPageItemComp extends cc.Component {
    @property
    idx = 0;

    @property(cc.Prefab)
    ball_Prefab: cc.Prefab = null;

    @property(cc.Prefab)
    white_ball_Prefab: cc.Prefab = null;

    @property(cc.Prefab)
    ui_detail_Prefab: cc.Prefab = null;

    publictableInfo: any = null;
    delCb: (sID: string) => void = null;
    createBalls: cc.Node[] = null;
    isEditing: boolean = null;
    isAllowDel: boolean = null;
    isCalDel: boolean = null;

    setData(e: any): void {
        this.publictableInfo = util.clone(e);
        cc.find("label_name", this.node).getComponent(cc.Label).string = e.sID;
        cc.find("label_totalv", this.node).getComponent(cc.Label).string = e.totalNum;
        cc.find("label_prv", this.node).getComponent(cc.Label).string = Math.floor(100 * e.pr) + "%";
        if (e.tableID == -1) {
            cc.find("label_name", this.node).getComponent(cc.Label).string = "新建一个";
        }
        cc.find("label_zan", this.node).getComponent(cc.Label).string = this.publictableInfo.zanIDS;
        this.clear();
        const time = this.publictableInfo.time;
        const elapsed = new Date().getTime() - time;
        const hours = Math.floor(elapsed / 3600000);
        if (this.isAllowDel && hours >= 24 && time >= 0) {
            this.setDelBtn(true);
        }
        const bg = cc.find("sprite_bg", this.node);
        const balls = e.tableInfo.balls;
        for (let i = 0; i < balls.length; i++) {
            const ball = balls[i];
            if (ball.ballType == BallLogicMgr.BallIDType_White) {
                const node = cc.instantiate(this.white_ball_Prefab);
                node.parent = bg;
                node.x = ball.x;
                node.y = ball.y;
                this.createBalls.push(node);
            } else if (ball.ballType == BallLogicMgr.BallIDType_Normal) {
                const node = cc.instantiate(this.ball_Prefab);
                node.parent = bg;
                node.x = ball.x;
                node.y = ball.y;
                node.getComponent("BallMaterialComp").setMatIdx(ball.ballMatIdx);
                this.createBalls.push(node);
            }
        }
    }

    setDelCB(cb: (sID: string) => void): void {
        this.delCb = cb;
    }

    clear(): void {
        this.createBalls = this.createBalls || [];
        for (let i = 0; i < this.createBalls.length; i++) {
            this.createBalls[i].destroy();
            this.createBalls[i].parent = null;
        }
        this.createBalls = [];
    }

    setAsEditing(editing: boolean): void {
        this.isEditing = editing;
        const plusNode = cc.find("cm_plus", this.node);
        if (editing) {
            plusNode.opacity = 255;
            cc.find("label_name", this.node).getComponent(cc.Label).string = "新建一个";
        } else {
            plusNode.opacity = 0;
        }
    }

    onDestroy(): void {
        this.clear();
    }

    update(): void {
    }

    getIsEditing(): boolean {
        return this.isEditing;
    }

    onEnable(): void {
    }

    onLoad(): void {
        this.idx = this.idx || 0;
        this.createBalls = this.createBalls || [];
        this.isEditing = this.isEditing || false;
        this.publictableInfo = this.publictableInfo || null;
        this.delCb = this.delCb || null;
        this.isCalDel = false;
        this.setDelBtn(false);
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (this.isEditing) {
                if (this.publictableInfo) {
                    BallLogicMgr.gotoEditor(this.publictableInfo.tableInfo);
                }
            } else if (this.publictableInfo) {
                const detail = cc.instantiate(this.ui_detail_Prefab);
                const parent = this.node.parent.parent;
                detail.getComponent("ListPageItemDetailComp").show(parent, this.publictableInfo);
            }
        });
        cc.find("button_del", this.node).on("click", () => {
            if (this.isCalDel) {
                DB.removeOnePublicTableInfo(this.publictableInfo, () => {
                    console.log("removeOnePublicTableInfo finish", this.publictableInfo.sID);
                    if (this.delCb) {
                        BallLogicMgr.publicTableList_removeBysID(this.publictableInfo.sID);
                        this.delCb(this.publictableInfo.sID);
                    }
                });
            }
        });
    }

    setAllowDel(allow: boolean): void {
        this.isAllowDel = allow;
        if (!allow) {
            this.setDelBtn(false);
        }
    }

    setDelBtn(active: boolean): void {
        cc.find("button_del", this.node).active = active;
        this.isCalDel = active;
    }
}
