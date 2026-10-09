import AudioManager from "./AudioManager";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";

const { ccclass, menu, property } = cc._decorator;

const goalLevels = [4, 3, 2];
const goalAni: { [level: number]: { skAni: string, audio: string } } = {
    2: {
        skAni: "Excellent",
        audio: "pool_comb2"
    },
    3: {
        skAni: "Perfect",
        audio: "pool_comb3"
    },
    4: {
        skAni: "Unbelievable",
        audio: "pool_comb4"
    }
};

@ccclass
@menu("UI/pages/items/MultyGoalEffectItemCtr")
export default class MultyGoalEffectItemCtr extends cc.Component {
    @property(sp.Skeleton)
    multy_goal_sk = null;

    @property(cc.Node)
    multy_goal_root_node = null;

    onLoad() {
        this.multy_goal_sk.setCompleteListener(this.onAniComplete.bind(this));
        this.multy_goal_sk.node.active = false;
    }

    onEnable() {
        EventMgr.listen(GameEventType.ON_MULTY_GOAL, this.onMultyGoal, this);
    }

    onDisable() {
        EventMgr.ignore(GameEventType.ON_MULTY_GOAL, this.onMultyGoal, this);
    }

    onAniComplete() {
        this.multy_goal_sk.node.active = false;
    }

    onMultyGoal(count) {
        let matched = 0;
        for (let i = 0; i < goalLevels.length; i++) {
            if (count >= goalLevels[i]) {
                matched = goalLevels[i];
                break;
            }
        }
        const cfg = goalAni[matched];
        if (cfg) {
            AudioManager.getInstance().playMusic(cfg.audio);
            this.multy_goal_sk.setAnimation(0, cfg.skAni, false);
            this.multy_goal_sk.node.active = true;
        }
    }
}
