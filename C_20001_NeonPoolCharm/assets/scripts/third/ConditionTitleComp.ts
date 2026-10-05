import * as BallLogicMgr from "./BallLogicMgr";
import BallMaterialComp from "./BallMaterialComp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ConditionTitleComp extends cc.Component {
    @property(cc.Prefab)
    ball_prefab: cc.Prefab = null;

    condition: { ganNum: number; cdBalls: { ballType: number; ballMatIdx: number }[] } = null;
    createBalls: cc.Node[] = null;

    updateGunNum(num: number): void {
        cc.find("label_ganshu", this.node).getComponent(cc.Label).string =
            num + "/" + this.condition.ganNum;
    }

    updateContent(): void {
        this.createBalls = this.createBalls || [];
        cc.find("label_ganshu", this.node).getComponent(cc.Label).string =
            "0/" + this.condition.ganNum;
        const ballsNode = cc.find("node_balls", this.node);
        const cdBalls = this.condition.cdBalls;
        let index = 0;
        for (let i = 0; i < cdBalls.length; i++) {
            const ballInfo = cdBalls[i];
            if (ballInfo.ballType == BallLogicMgr.BallIDType_White) {
                continue;
            }
            if (ballInfo.ballType == BallLogicMgr.BallIDType_Normal) {
                const ballNode = cc.instantiate(this.ball_prefab);
                ballNode.parent = ballsNode;
                ballNode.x = 40 * index;
                ballNode.getComponent(BallMaterialComp).setMatIdx(ballInfo.ballMatIdx);
                this.createBalls.push(ballNode);
                index += 1;
            }
        }
    }

    clear(): void {
        this.createBalls = this.createBalls || [];
        for (let i = 0; i < this.createBalls.length; i++) {
            this.createBalls[i].destroy();
            this.createBalls[i].parent = null;
        }
        this.createBalls = [];
    }

    onLoad(): void {
        this.condition = this.condition || null;
        this.createBalls = this.createBalls || [];
        console.log("onLoad", this.condition, this.ball_prefab);
    }

    setCondition(condition: { ganNum: number; cdBalls: { ballType: number; ballMatIdx: number }[] }): void {
        this.condition = condition;
        this.updateContent();
    }

    onDestroy(): void {
        this.clear();
    }
}
