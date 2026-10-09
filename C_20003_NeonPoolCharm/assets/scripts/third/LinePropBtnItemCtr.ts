import { ETaiQiuPropType } from "./ConfigDataMgr";
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
    btn_node = null;

    @property(cc.Label)
    nameLabel = null;

    @property(cc.Node)
    addSpriteNode = null;

    _scheduleFunc = undefined;

    onEnable() {
        EventMgr.listen(GameEventType.ON_LINE_PROP_USED_STATE_CHANGED, this.updateState, this);
        this.updateState();
    }

    onLoad() {
        UiManager.addButtonListen(this.btn_node, this.onClickProp, this);
    }

    updateCountdown() {
        var e = PropDataSys.linePropTimer - TimeUtils.getTimeinSeconds();
        if (PropDataSys.isLinePropInfinite) {
            this.nameLabel.string = "∞";
            this._stopSchedule();
        } else if (e > 0) this.nameLabel.string = "" + TimeUtils.secondsToHMS(e, false);else {
            this.nameLabel.string = "pkey_005";
            this._stopSchedule();
        }
    }

    onDisable() {
        EventMgr.ignore(GameEventType.ON_LINE_PROP_USED_STATE_CHANGED, this.updateState, this);
    }

    _stopSchedule() {
        if (this._scheduleFunc) {
            this.unschedule(this._scheduleFunc);
            this._scheduleFunc = undefined;
        }
    }

    updateState() {
        var e = this;
        this._stopSchedule();
        if (PropDataSys.isLinePropUseable) {
            this.addSpriteNode.active = true;
            this.nameLabel.string = "pkey_005";
        } else {
            this.addSpriteNode.active = false;
            this.updateCountdown();
            this.schedule(this._scheduleFunc = function () {
                return e.updateCountdown();
            });
        }
    }

    onClickProp() {
        PropDataSys.isLinePropUseable && PageMgr.showPage("UsePropPage", {
            prop_type: ETaiQiuPropType.E_Line
        });
    }
}
