import GlobalConfig from "./GlobalConfig";
import BallLogicMgr from "./BallLogicMgr";
import util from "./util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ListPageItemDetailComp extends cc.Component {
    @property
    idx = 0;

    @property(cc.Prefab)
    ball_Prefab: cc.Prefab = null;

    @property(cc.Prefab)
    white_ball_Prefab: cc.Prefab = null;

    publictableInfo: any = null;
    createBalls: cc.Node[] = null;
    callback: () => void = null;
    isEditing: boolean = null;

    closeAndDestroy(): void {
        this.node.parent = null;
        this.node.destroy();
    }

    setCallback(cb: () => void): void {
        this.callback = cb;
    }

    close(): void {
        this.node.parent = null;
    }

    update(): void {
    }

    clear(): void {
    }

    show(parent: cc.Node, data: any): void {
        this.node.parent = parent;
        this.setData(data);
        console.log("detail show", parent, data);
    }

    setData(e: any): void {
        this.publictableInfo = util.clone(e);
        this.createBalls = this.createBalls || [];
        cc.find("label_name", this.node).getComponent(cc.Label).string = e.tableID;
        this.clear();
        const table = cc.find("billiardtable", this.node);
        const balls = e.tableInfo.balls;
        for (let i = 0; i < balls.length; i++) {
            const ball = balls[i];
            if (ball.ballType == BallLogicMgr.BallIDType_White) {
                const node = cc.instantiate(this.white_ball_Prefab);
                node.parent = table;
                node.x = ball.x;
                node.y = ball.y;
                this.createBalls.push(node);
            } else if (ball.ballType == BallLogicMgr.BallIDType_Normal) {
                const node = cc.instantiate(this.ball_Prefab);
                node.parent = table;
                node.x = ball.x;
                node.y = ball.y;
                node.getComponent("BallMaterialComp").setMatIdx(ball.ballMatIdx);
                this.createBalls.push(node);
            }
        }
        cc.find("label_id", this.node).getComponent(cc.Label).string = this.publictableInfo.sID;
        cc.find("label_name", this.node).getComponent(cc.Label).string = this.publictableInfo.name;
        const leftNode = cc.find("node_left", this.node);
        cc.find("label_totalv", leftNode).getComponent(cc.Label).string = this.publictableInfo.totalNum;
        cc.find("label_winv", leftNode).getComponent(cc.Label).string = this.publictableInfo.winNum;
        cc.find("label_zan", this.node).getComponent(cc.Label).string = this.publictableInfo.zanIDS;
        cc.find("label_prv", leftNode).getComponent(cc.Label).string = Math.floor(100 * this.publictableInfo.pr) + "%";
    }

    onLoad(): void {
        this.idx = this.idx || 0;
        this.createBalls = this.createBalls || [];
        this.isEditing = this.isEditing || false;
        this.publictableInfo = this.publictableInfo || null;
        cc.find("button_back", this.node).on("click", () => {
            this.closeAndDestroy();
        });
        cc.find("button_zan", this.node).on("click", () => {
            BallLogicMgr.do_zan(this.publictableInfo, () => {
                this.publictableInfo.zanIDS = this.publictableInfo.zanIDS + 1;
                cc.find("label_zan", this.node).getComponent(cc.Label).string = this.publictableInfo.zanIDS;
            });
        });
        cc.find("button_go", this.node).on("click", () => {
            if (this.publictableInfo) {
                BallLogicMgr.gotoTable_challenge(this.publictableInfo.tableInfo, this.publictableInfo);
                GlobalConfig.add_challenge_list(this.publictableInfo.sID);
            }
            this.closeAndDestroy();
        });
    }
}
