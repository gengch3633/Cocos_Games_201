import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import PlayerDataSys from "./PlayerDataSys";
import SystemDataSys from "./SystemDataSys";
import { RewardType } from "./RequestData";
import { UiManager } from "./UiManage";
import CueDataSys from "./CueDataSys";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/QianDaoItemCtr")
export default class QianDaoItemCtr extends cc.Component {
    @property(cc.Node)
    qipao: cc.Node = null;

    @property(cc.Node)
    light: cc.Node = null;

    @property(cc.Label)
    day: cc.Label = null;

    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.Node)
    successIcon: cc.Node = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    bigNum: cc.Label = null;

    @property(sp.Skeleton)
    cue: sp.Skeleton = null;

    data: { id: number; reward: string } = null;

    updateUi(): void {
        const itemData = this.data;
        if (itemData != null) {
            const dayIndex = itemData.id - 1;
            let currentDay = PlayerDataSys.sign_in_count % 10;
            let signCount = PlayerDataSys.sign_in_count;
            if (PlayerDataSys.sign_today) {
                signCount -= 1;
                if (currentDay == 0) {
                    currentDay = 10;
                }
                currentDay -= 1;
            }
            if (currentDay == dayIndex) {
                this.successIcon.active = PlayerDataSys.sign_today;
                this.light.active = PlayerDataSys.sign_today == 0;
            } else if (currentDay > dayIndex) {
                this.successIcon.active = true;
                this.light.active = false;
            } else {
                this.light.active = false;
                this.successIcon.active = false;
            }
            this.day.string = itemData.id.toString();
            const rewards = itemData.reward.split("|");
            const cycleIndex = Math.floor(signCount / 10);
            const rewardStr = rewards[cycleIndex] ? rewards[cycleIndex] : rewards[rewards.length - 1];
            if (itemData.id == 10) {
                this.qipao.active = !this.successIcon.active && !SystemDataSys.is_IOS_reviewer;
                const rewardParts = rewardStr.split(",");
                const primary = rewardParts[0].split("_");
                const primaryType = Number(primary[0]);
                const primaryValue = Number(primary[1]);
                if (primaryType == RewardType.Cue) {
                    this.cue.node.active = true;
                    this.icon.node.active = false;
                    this.num.string = "限定稀有球杆";
                    UiManager.loadSpine(this.cue.node, "cue_spine", CueDataSys.getCueSourceName(primaryValue), () => {
                        this.cue.setAnimation(0, "animation", true);
                    });
                } else {
                    this.cue.node.active = false;
                    this.icon.node.active = true;
                    this.num.string = PlayerDataSys.getCashWithUnit(primaryValue);
                    UiManager.loadSpriteFrame(this.icon.node, "reward_icon", "icon_" + primaryType);
                }
                const secondary = rewardParts[1].split("_");
                const secondaryValue = Number(secondary[1]);
                if (this.bigNum) {
                    this.bigNum.string = PlayerDataSys.getCashWithUnit(secondaryValue);
                }
            } else {
                const parts = rewardStr.split("_");
                const rewardType = Number(parts[0]);
                let rewardValue = Number(parts[1]);
                if (rewardType == 6) {
                    const subType = Number(parts[1]);
                    rewardValue = Number(parts[2]);
                    const iconId = subType == 44 ? 2 : 7;
                    this.num.string = "x" + rewardValue;
                    UiManager.loadSpriteFrame(this.icon.node, "choujiang_icon", "icon_" + iconId);
                } else {
                    if (
                        RewardType.HongBao == rewardType ||
                        RewardType.XianJin == rewardType ||
                        RewardType.SpecialHongBao == rewardType
                    ) {
                        this.num.string = PlayerDataSys.getCashWithUnit(rewardValue);
                    } else {
                        this.num.string = "x" + rewardValue;
                    }
                    UiManager.loadSpriteFrame(this.icon.node, "reward_icon", "icon_" + rewardType);
                }
            }
        }
    }

    onEnable(): void {
        EventMgr.listen(GameEventType.UPDATE_QIANDAO, this.updateUi, this);
    }

    initData(data: { id: number; reward: string }): void {
        this.data = data;
        this.updateUi();
    }

    onDisable(): void {
        EventMgr.ignore(GameEventType.UPDATE_QIANDAO, this.updateUi, this);
    }
}
