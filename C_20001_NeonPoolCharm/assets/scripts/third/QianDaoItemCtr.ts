import CueDataSys from "./CueDataSys";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import PlayerDataSys from "./PlayerDataSys";
import { RewardType } from "./RequestData";
import SystemDataSys from "./SystemDataSys";
import { UiManager } from "./UiManage";

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

    data: any = null;

    updateUi(): void {
        const t = this.data;
        if (null != t) {
            const o = t.id - 1;
            let n = PlayerDataSys.sign_in_count % 10;
            let i = PlayerDataSys.sign_in_count;
            if (PlayerDataSys.sign_today) {
                i -= 1;
                if (0 == n) {
                    n = 10;
                }
                n -= 1;
            }
            if (n == o) {
                this.successIcon.active = PlayerDataSys.sign_today;
                this.light.active = 0 == PlayerDataSys.sign_today;
            } else if (n > o) {
                this.successIcon.active = true;
                this.light.active = false;
            } else {
                this.light.active = false;
                this.successIcon.active = false;
            }
            this.day.string = t.id.toString();
            const a = t.reward.split("|");
            const r = Math.floor(i / 10);
            const l = a[r] ? a[r] : a[a.length - 1];
            if (10 == t.id) {
                this.qipao.active = !this.successIcon.active && !SystemDataSys.is_IOS_reviewer;
                const parts = l.split(",");
                const f = parts[0].split("_");
                const h = Number(f[0]);
                const g = Number(f[1]);
                if (h == RewardType.Cue) {
                    this.cue.node.active = true;
                    this.icon.node.active = false;
                    this.num.string = "限定稀有球杆";
                    UiManager.loadSpine(this.cue.node, "cue_spine", CueDataSys.getCueSourceName(g), () => {
                        this.cue.setAnimation(0, "animation", true);
                    });
                } else {
                    this.cue.node.active = false;
                    this.icon.node.active = true;
                    this.num.string = PlayerDataSys.getCashWithUnit(g);
                    UiManager.loadSpriteFrame(this.icon.node, "reward_icon", "icon_" + h);
                }
                const y = parts[1].split("_");
                Number(y[0]);
                const v = Number(y[1]);
                if (this.bigNum) {
                    this.bigNum.string = PlayerDataSys.getCashWithUnit(v);
                }
            } else {
                const m = l.split("_");
                let b = Number(m[0]);
                let C = Number(m[1]);
                if (6 == b) {
                    const P = Number(m[1]);
                    C = Number(m[2]);
                    const S = 44 == P ? 2 : 7;
                    this.num.string = "x" + C;
                    UiManager.loadSpriteFrame(this.icon.node, "choujiang_icon", "icon_" + S);
                } else {
                    if (RewardType.HongBao == b || RewardType.XianJin == b || RewardType.SpecialHongBao == b) {
                        this.num.string = PlayerDataSys.getCashWithUnit(C);
                    } else {
                        this.num.string = "x" + C;
                    }
                    UiManager.loadSpriteFrame(this.icon.node, "reward_icon", "icon_" + b);
                }
            }
        }
    }

    onEnable(): void {
        EventMgr.listen(GameEventType.UPDATE_QIANDAO, this.updateUi, this);
    }

    initData(e: any): void {
        this.data = e;
        this.updateUi();
    }

    onDisable(): void {
        EventMgr.ignore(GameEventType.UPDATE_QIANDAO, this.updateUi, this);
    }
}
