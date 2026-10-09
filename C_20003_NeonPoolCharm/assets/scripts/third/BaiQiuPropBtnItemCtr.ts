import { ETaiQiuPropType } from "./ConfigDataMgr";
import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import GameServiceMgr from "./GameServiceMgr";
import PageMgr from "./PageMgr";
import PropDataSys from "./PropDataSys";
import { UiManager } from "./UiManage";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/BaiQiuPropBtnItemCtr")
export default class BaiQiuPropBtnItemCtr extends cc.Component {

    @property(cc.Node)
    btn_node: cc.Node = null;

    @property(cc.Node)
    addSpriteNode: cc.Node = null;

    @property(cc.Label)
    numberLabel: cc.Label = null;

    _curTouchLock = false;

    updateState() {
        const count = PropDataSys.getPropCount(ETaiQiuPropType.E_BaiQiu);
        this.addSpriteNode.active = count <= 0;
        this.numberLabel.node.active = count > 0;
        this.numberLabel.string = "" + count;
    }

    onLoad() {
        UiManager.addButtonListen(this.btn_node, this.onClickProp, this);
    }

    onEnable() {
        EventMgr.listen(GameEventType.ON_PROP_USED_STATE_CHANGED, this.updateState, this);
        EventMgr.listen(GameEventType.ON_PROP_COUNT_CHANGED, this.updateState, this);
        this.updateState();
    }

    onDisable() {
        EventMgr.ignore(GameEventType.ON_PROP_USED_STATE_CHANGED, this.updateState, this);
        EventMgr.ignore(GameEventType.ON_PROP_COUNT_CHANGED, this.updateState, this);
    }

    onClickProp() {
        const self = this;
        if (!this._curTouchLock) {
            if (PropDataSys.getPropCount(ETaiQiuPropType.E_BaiQiu) > 0) {
                if (PropDataSys.isBaiQiuPropInUse) {
                    EngineUtil.showManageViewToast("pkey_007");
                } else {
                    EventMgr.trigger(GameEventType.SHOW_MAIN_UI_TOUCH_BLOCK, "baiqiu_btn_clicked");
                    GameServiceMgr.UseMoveCueBallProp(ETaiQiuPropType.E_BaiQiu, function () {
                        self.updateState();
                        self._curTouchLock = false;
                        EventMgr.trigger(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, "baiqiu_btn_clicked");
                    }, function () {
                        self._curTouchLock = false;
                        EventMgr.trigger(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, "baiqiu_btn_clicked");
                    });
                }
            } else {
                setTimeout(function () {
                    return self._curTouchLock = false;
                }, 500);
                PageMgr.showPage("UsePropPage", {
                    prop_type: ETaiQiuPropType.E_BaiQiu
                });
            }
        }
    }
}
