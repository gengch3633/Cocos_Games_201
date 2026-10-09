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
    qipao = null;

    @property(cc.Node)
    light = null;

    @property(cc.Label)
    day = null;

    @property(cc.Label)
    num = null;

    @property(cc.Node)
    successIcon = null;

    @property(cc.Sprite)
    icon = null;

    @property(cc.Label)
    bigNum = null;

    @property(sp.Skeleton)
    cue = null;

    data = null;

    updateUi() {
        const e = this,
            t = this.data;
        if (null != t) {
            const o = t.id - 1;
            let n = PlayerDataSys.sign_in_count % 10;
            let i = PlayerDataSys.sign_in_count;
            if (PlayerDataSys.sign_today) {
                i -= 1;
                0 == n && (n = 10);
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
            const a = t.reward.split("|"),
                r = Math.floor(i / 10),
                l = a[r] ? a[r] : a[a.length - 1];
            if (10 == t.id) {
                this.qipao.active = !this.successIcon.active && !SystemDataSys.is_IOS_reviewer;
                const _ = l.split(","),
                    f = _[0].split("_"),
                    h = Number(f[0]),
                    g = Number(f[1]);
                if (h == RewardType.Cue) {
                    this.cue.node.active = true;
                    this.icon.node.active = false;
                    this.num.string = "限定稀有球杆";
                    UiManager.loadSpine(this.cue.node, "cue_spine", CueDataSys.getCueSourceName(g), function () {
                        e.cue.setAnimation(0, "animation", true);
                    });
                } else {
                    this.cue.node.active = false;
                    this.icon.node.active = true;
                    this.num.string = PlayerDataSys.getCashWithUnit(g);
                    UiManager.loadSpriteFrame(this.icon.node, "reward_icon", "icon_" + h);
                }
                const y = _[1].split("_"),
                    v = (Number(y[0]), Number(y[1]));
                this.bigNum && (this.bigNum.string = PlayerDataSys.getCashWithUnit(v));
            } else {
                const m = l.split("_"),
                    b = Number(m[0]);
                let C = Number(m[1]);
                if (6 == b) {
                    const P = Number(m[1]);
                    C = Number(m[2]);
                    const S = 44 == P ? 2 : 7;
                    this.num.string = "x" + C;
                    UiManager.loadSpriteFrame(this.icon.node, "choujiang_icon", "icon_" + S);
                } else {
                    RewardType.HongBao == b || RewardType.XianJin == b || RewardType.SpecialHongBao == b ? this.num.string = PlayerDataSys.getCashWithUnit(C) : this.num.string = "x" + C;
                    UiManager.loadSpriteFrame(this.icon.node, "reward_icon", "icon_" + b);
                }
            }
        }
    }

    onEnable() {
        EventMgr.listen(GameEventType.UPDATE_QIANDAO, this.updateUi, this);
    }

    initData(e) {
        this.data = e;
        this.updateUi();
    }

    onDisable() {
        EventMgr.ignore(GameEventType.UPDATE_QIANDAO, this.updateUi, this);
    }
}
