import ConfigDataMgr, { ETaiQiuPropType } from "./ConfigDataMgr";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import PageMgr from "./PageMgr";
import PropDataSys from "./PropDataSys";
import TimeUtils from "./TimeUtils";
import { UiManager } from "./UiManage";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/LinePropBtnItemCtr")
export default class LinePropBtnItemCtr extends cc.Component {
    @property(cc.Node)
    btn_node: cc.Node = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Node)
    addSpriteNode: cc.Node = null;

    private _scheduleFunc: () => void = undefined;

    onEnable(): void {
        EventMgr.listen(GameEventType.ON_LINE_PROP_USED_STATE_CHANGED, this.updateState, this);
        this.updateState();
    }

    onLoad(): void {
        UiManager.addButtonListen(this.btn_node, this.onClickProp, this);
    }

    updateCountdown(): void {
        const remaining = PropDataSys.linePropTimer - TimeUtils.getTimeinSeconds();
        if (PropDataSys.isLinePropInfinite) {
            this.nameLabel.string = "∞";
            this._stopSchedule();
        } else if (remaining > 0) {
            this.nameLabel.string = "" + TimeUtils.secondsToHMS(remaining, false);
        } else {
            this.nameLabel.string = "pkey_005";
            this._stopSchedule();
        }
    }

    onDisable(): void {
        EventMgr.ignore(GameEventType.ON_LINE_PROP_USED_STATE_CHANGED, this.updateState, this);
    }

    private _stopSchedule(): void {
        if (this._scheduleFunc) {
            this.unschedule(this._scheduleFunc);
            this._scheduleFunc = undefined;
        }
    }

    updateState(): void {
        this._stopSchedule();
        if (PropDataSys.isLinePropUseable) {
            this.addSpriteNode.active = true;
            this.nameLabel.string = "pkey_005";
        } else {
            this.addSpriteNode.active = false;
            this.updateCountdown();
            this.schedule(
                (this._scheduleFunc = () => {
                    this.updateCountdown();
                })
            );
        }
    }

    onClickProp(): void {
        if (PropDataSys.isLinePropUseable) {
            PageMgr.showPage("UsePropPage", {
                prop_type: ETaiQiuPropType.E_Line,
            });
        }
    }
}
