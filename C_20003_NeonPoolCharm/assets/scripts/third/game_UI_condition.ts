import BallLogicMgr from "./BallLogicMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class game_UI_condition extends cc.Component {
    @property(cc.Prefab)
    ball_model_Prefab = null;

    ballMatIdxs = null;

    callback = null;

    ball_model_arr = null;

    ganNum = null;

    onLoad() {
        const e = this;
        this.callback = this.callback || null;
        this.ballMatIdxs = this.ballMatIdxs || [];
        cc.find("node_balls", this.node);
        this.loadBalls();
        cc.find("button_close", this.node).on("click", function () {
            e.node.parent = null;
        });
        cc.find("button_save", this.node).on("click", function () {
            const t = e.doSave();
            if (t) {
                e.callback && e.callback(t);
                e.node.parent = null;
            }
        });
        const t = cc.find("node1", this.node).getChildByName("label_ganNum");
        this.ganNum = 1;
        t.getComponent(cc.Label).string = e.ganNum;
        cc.find("node1", this.node).getChildByName("button_sub").on("click", function () {
            e.ganNum = e.ganNum - 1;
            e.ganNum = e.ganNum < 1 ? 1 : e.ganNum;
            t.getComponent(cc.Label).string = e.ganNum;
        });
        cc.find("node1", this.node).getChildByName("button_add").on("click", function () {
            e.ganNum = e.ganNum + 1;
            e.ganNum = e.ganNum >= 5 ? 5 : e.ganNum;
            t.getComponent(cc.Label).string = e.ganNum;
        });
    }

    setCallback(e) {
        this.callback = e;
    }

    setMatIdxs(e) {
        console.log("setMatIdxs", e);
        this.ballMatIdxs = e;
        this.loadBalls();
    }

    doSave() {
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

    start() {}

    loadBalls() {
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
