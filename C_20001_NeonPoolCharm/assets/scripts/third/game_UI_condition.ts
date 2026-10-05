import * as BallLogicMgr from "./BallLogicMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class game_UI_condition extends cc.Component {
    @property(cc.Prefab)
    ball_model_Prefab: cc.Prefab = null;

    ballMatIdxs: number[] = null;
    callback: (result: any) => void = null;
    ball_model_arr: cc.Node[] = null;
    ganNum: number = null;

    onLoad(): void {
        this.callback = this.callback || null;
        this.ballMatIdxs = this.ballMatIdxs || [];
        cc.find("node_balls", this.node);
        this.loadBalls();
        cc.find("button_close", this.node).on("click", () => {
            this.node.parent = null;
        });
        cc.find("button_save", this.node).on("click", () => {
            const result = this.doSave();
            if (result) {
                this.callback && this.callback(result);
                this.node.parent = null;
            }
        });
        const labelGanNum = cc.find("node1", this.node).getChildByName("label_ganNum");
        this.ganNum = 1;
        labelGanNum.getComponent(cc.Label).string = "" + this.ganNum;
        cc.find("node1", this.node).getChildByName("button_sub").on("click", () => {
            this.ganNum = this.ganNum - 1;
            this.ganNum = this.ganNum < 1 ? 1 : this.ganNum;
            labelGanNum.getComponent(cc.Label).string = "" + this.ganNum;
        });
        cc.find("node1", this.node).getChildByName("button_add").on("click", () => {
            this.ganNum = this.ganNum + 1;
            this.ganNum = this.ganNum >= 5 ? 5 : this.ganNum;
            labelGanNum.getComponent(cc.Label).string = "" + this.ganNum;
        });
    }

    setCallback(callback: (result: any) => void): void {
        this.callback = callback;
    }

    setMatIdxs(idxs: number[]): void {
        console.log("setMatIdxs", idxs);
        this.ballMatIdxs = idxs;
        this.loadBalls();
    }

    doSave(): any {
        if (!(this.ganNum < 1)) {
            const selected: any[] = [];
            for (let i = 0; i < this.ballMatIdxs.length; i++) {
                const ballNode = this.ball_model_arr[i];
                if (ballNode.getComponent("BallConditionSelComp").getIsSel()) {
                    const matIdx = ballNode.getComponent("BallMaterialComp").getMatIdx();
                    const packed = BallLogicMgr.pack_BallMI(matIdx);
                    selected.push(packed);
                }
            }
            if (selected.length == 0) {
                console.log("没有选择目标球");
                return null;
            }
            return BallLogicMgr.pack_condition(this.ganNum, selected);
        }
    }

    start(): void {}

    loadBalls(): void {
        const container = cc.find("node_balls", this.node);
        container.removeAllChildren();
        this.ball_model_arr = [];
        for (let i = 0; i < this.ballMatIdxs.length; i++) {
            const ballNode = cc.instantiate(this.ball_model_Prefab);
            ballNode.parent = container;
            ballNode.x = 80 * i;
            if (i >= 4) {
                ballNode.y = -80;
                ballNode.x = 80 * (i - 4) - 200;
            }
            ballNode.scale = 1.5;
            ballNode.getComponent("BallMaterialComp").setMatIdx(this.ballMatIdxs[i]);
            ballNode.getComponent("BallConditionSelComp").open();
            ballNode.getComponent("BallConditionSelComp").idx = i;
            this.ball_model_arr.push(ballNode);
        }
    }
}
