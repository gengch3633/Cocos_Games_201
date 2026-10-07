import BallLogicMgr from "./BallLogicMgr";

const { ccclass, property } = cc._decorator;

@ccclass("game_UI_condition")
export default class GameUICondition extends cc.Component {
    @property(cc.Prefab)
    ball_model_Prefab: cc.Prefab = null;

    ballMatIdxs: number[] = null;
    callback: Function = null;
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
            const t = this.doSave();
            if (t) {
                this.callback && this.callback(t);
                this.node.parent = null;
            }
        });
        const t = cc.find("node1", this.node).getChildByName("label_ganNum");
        this.ganNum = 1;
        t.getComponent(cc.Label).string = "" + this.ganNum;
        cc.find("node1", this.node).getChildByName("button_sub").on("click", () => {
            this.ganNum = this.ganNum - 1;
            this.ganNum = this.ganNum < 1 ? 1 : this.ganNum;
            t.getComponent(cc.Label).string = "" + this.ganNum;
        });
        cc.find("node1", this.node).getChildByName("button_add").on("click", () => {
            this.ganNum = this.ganNum + 1;
            this.ganNum = this.ganNum >= 5 ? 5 : this.ganNum;
            t.getComponent(cc.Label).string = "" + this.ganNum;
        });
    }

    setCallback(e: Function): void {
        this.callback = e;
    }

    setMatIdxs(e: number[]): void {
        console.log("setMatIdxs", e);
        this.ballMatIdxs = e;
        this.loadBalls();
    }

    doSave(): any {
        if (!(this.ganNum < 1)) {
            const e = [];
            for (let t = 0; t < this.ballMatIdxs.length; t++) {
                const o = this.ball_model_arr[t];
                if (o.getComponent("BallConditionSelComp").getIsSel()) {
                    const n = o.getComponent("BallMaterialComp").getMatIdx();
                    const i = BallLogicMgr.pack_BallMI(n);
                    e.push(i);
                }
            }
            if (0 == e.length) {
                console.log("没有选择目标球");
                return null;
            }
            return BallLogicMgr.pack_condition(this.ganNum, e);
        }
    }

    start(): void {
    }

    loadBalls(): void {
        const e = cc.find("node_balls", this.node);
        e.removeAllChildren();
        this.ball_model_arr = [];
        for (let t = 0; t < this.ballMatIdxs.length; t++) {
            const o = cc.instantiate(this.ball_model_Prefab);
            o.parent = e;
            o.x = 80 * t;
            if (t >= 4) {
                o.y = -80;
                o.x = 80 * (t - 4) - 200;
            }
            o.scale = 1.5;
            o.getComponent("BallMaterialComp").setMatIdx(this.ballMatIdxs[t]);
            o.getComponent("BallConditionSelComp").open();
            o.getComponent("BallConditionSelComp").idx = t;
            this.ball_model_arr.push(o);
        }
    }
}
