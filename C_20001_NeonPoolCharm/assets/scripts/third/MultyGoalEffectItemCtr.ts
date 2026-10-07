import AudioManager from "./AudioManager";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";

const { ccclass, menu, property } = cc._decorator;

const GOAL_THRESHOLDS = [4, 3, 2];

const GOAL_CONFIG: Record<number, { skAni: string; audio: string }> = {
    2: {
        skAni: "Excellent",
        audio: "pool_comb2",
    },
    3: {
        skAni: "Perfect",
        audio: "pool_comb3",
    },
    4: {
        skAni: "Unbelievable",
        audio: "pool_comb4",
    },
};

@ccclass
@menu("UI/pages/items/MultyGoalEffectItemCtr")
export default class MultyGoalEffectItemCtr extends cc.Component {
    @property(sp.Skeleton)
    multy_goal_sk: sp.Skeleton = null;

    @property(cc.Node)
    multy_goal_root_node: cc.Node = null;

    onLoad(): void {
        this.multy_goal_sk.setCompleteListener(this.onAniComplete.bind(this));
        this.multy_goal_sk.node.active = false;
    }

    onEnable(): void {
        EventMgr.listen(GameEventType.ON_MULTY_GOAL, this.onMultyGoal, this);
    }

    onDisable(): void {
        EventMgr.ignore(GameEventType.ON_MULTY_GOAL, this.onMultyGoal, this);
    }

    onAniComplete(): void {
        this.multy_goal_sk.node.active = false;
    }

    onMultyGoal(e: number): void {
        let t = 0;
        for (let o = 0; o < GOAL_THRESHOLDS.length; o++) {
            if (e >= GOAL_THRESHOLDS[o]) {
                t = GOAL_THRESHOLDS[o];
                break;
            }
        }
        const n = GOAL_CONFIG[t];
        if (n) {
            AudioManager.getInstance().playMusic(n.audio);
            this.multy_goal_sk.setAnimation(0, n.skAni, false);
            this.multy_goal_sk.node.active = true;
        }
    }
}
