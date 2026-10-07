import BallLogicMgr from "./BallLogicMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ConditionTitleComp extends cc.Component {
    @property(cc.Prefab)
    ball_prefab: cc.Prefab = null;

    condition: any = null;
    createBalls: cc.Node[] = null;

    updateGunNum(count: number): void {
        cc.find("label_ganshu", this.node).getComponent(cc.Label).string = count + "/" + this.condition.ganNum;
    }

    updateContent(): void {
        this.createBalls = this.createBalls || [];
        cc.find("label_ganshu", this.node).getComponent(cc.Label).string = "0/" + this.condition.ganNum;
        const ballsNode = cc.find("node_balls", this.node);
        const cdBalls = this.condition.cdBalls;
        let index = 0;
        for (let i = 0; i < cdBalls.length; i++) {
            const ball = cdBalls[i];
            if (ball.ballType == BallLogicMgr.BallIDType_White) {
                continue;
            }
            if (ball.ballType == BallLogicMgr.BallIDType_Normal) {
                const node = cc.instantiate(this.ball_prefab);
                node.parent = ballsNode;
                node.x = 40 * index;
                node.getComponent("BallMaterialComp").setMatIdx(ball.ballMatIdx);
                this.createBalls.push(node);
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

    setCondition(condition: any): void {
        this.condition = condition;
        this.updateContent();
    }

    onDestroy(): void {
        this.clear();
    }
}
