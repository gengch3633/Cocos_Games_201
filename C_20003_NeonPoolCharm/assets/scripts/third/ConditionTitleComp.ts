import BallLogicMgr from "./BallLogicMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ConditionTitleComp extends cc.Component {
    @property(cc.Prefab)
    ball_prefab = null;

    condition = null;
    createBalls = null;

    updateGunNum(count) {
        cc.find("label_ganshu", this.node).getComponent(cc.Label).string = count + "/" + this.condition.ganNum;
    }

    updateContent() {
        this.createBalls = this.createBalls || [];
        cc.find("label_ganshu", this.node).getComponent(cc.Label).string = "0/" + this.condition.ganNum;
        const ballRoot = cc.find("node_balls", this.node);
        const balls = this.condition.cdBalls;
        let index = 0;
        for (let i = 0; i < balls.length; i++) {
            const ball = balls[i];
            if (ball.ballType == BallLogicMgr.BallIDType_White) {
            } else if (ball.ballType == BallLogicMgr.BallIDType_Normal) {
                const node = cc.instantiate(this.ball_prefab);
                node.parent = ballRoot;
                node.x = 40 * index;
                node.getComponent("BallMaterialComp").setMatIdx(ball.ballMatIdx);
                this.createBalls.push(node);
                index += 1;
            }
        }
    }

    clear() {
        this.createBalls = this.createBalls || [];
        for (let i = 0; i < this.createBalls.length; i++) {
            this.createBalls[i].destroy();
            this.createBalls[i].parent = null;
        }
        this.createBalls = [];
    }

    onLoad() {
        this.condition = this.condition || null;
        this.createBalls = this.createBalls || [];
        console.log("onLoad", this.condition, this.ball_prefab);
    }

    setCondition(condition) {
        this.condition = condition;
        this.updateContent();
    }

    onDestroy() {
        this.clear();
    }
}
