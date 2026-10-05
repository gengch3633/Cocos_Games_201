import AudioManager from "./AudioManager";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";

const { ccclass, menu, property } = cc._decorator;

const GOAL_THRESHOLDS = [4, 3, 2];
const GOAL_CONFIG: Record<number, { skAni: string; audio: string }> = {
    2: { skAni: "Excellent", audio: "pool_comb2" },
    3: { skAni: "Perfect", audio: "pool_comb3" },
    4: { skAni: "Unbelievable", audio: "pool_comb4" },
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

    onMultyGoal(count: number): void {
        let threshold = 0;
        for (let i = 0; i < GOAL_THRESHOLDS.length; i++) {
            if (count >= GOAL_THRESHOLDS[i]) {
                threshold = GOAL_THRESHOLDS[i];
                break;
            }
        }
        const config = GOAL_CONFIG[threshold];
        if (config) {
            AudioManager.getInstance().playMusic(config.audio);
            this.multy_goal_sk.setAnimation(0, config.skAni, false);
            this.multy_goal_sk.node.active = true;
        }
    }
}
