import GameServiceMgr from "./GameServiceMgr";
import { UiManager } from "./UiManage";
import PageMgr from "./PageMgr";
import PropDataSys from "./PropDataSys";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import EngineUtil from "./EngineUtil";
import { ETaiQiuPropType } from "./ConfigDataMgr";

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

    private _curTouchLock = false;

    updateState(): void {
        const count = PropDataSys.getPropCount(ETaiQiuPropType.E_BaiQiu);
        this.addSpriteNode.active = count <= 0;
        this.numberLabel.node.active = count > 0;
        this.numberLabel.string = "" + count;
    }

    onLoad(): void {
        UiManager.addButtonListen(this.btn_node, this.onClickProp, this);
    }

    onEnable(): void {
        EventMgr.listen(GameEventType.ON_PROP_USED_STATE_CHANGED, this.updateState, this);
        EventMgr.listen(GameEventType.ON_PROP_COUNT_CHANGED, this.updateState, this);
        this.updateState();
    }

    onDisable(): void {
        EventMgr.ignore(GameEventType.ON_PROP_USED_STATE_CHANGED, this.updateState, this);
        EventMgr.ignore(GameEventType.ON_PROP_COUNT_CHANGED, this.updateState, this);
    }

    onClickProp(): void {
        if (this._curTouchLock) {
            return;
        }
        if (PropDataSys.getPropCount(ETaiQiuPropType.E_BaiQiu) > 0) {
            if (PropDataSys.isBaiQiuPropInUse) {
                EngineUtil.showManageViewToast("pkey_007");
            } else {
                EventMgr.trigger(GameEventType.SHOW_MAIN_UI_TOUCH_BLOCK, "baiqiu_btn_clicked");
                GameServiceMgr.UseMoveCueBallProp(
                    ETaiQiuPropType.E_BaiQiu,
                    () => {
                        this.updateState();
                        this._curTouchLock = false;
                        EventMgr.trigger(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, "baiqiu_btn_clicked");
                    },
                    () => {
                        this._curTouchLock = false;
                        EventMgr.trigger(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, "baiqiu_btn_clicked");
                    }
                );
            }
        } else {
            setTimeout(() => {
                this._curTouchLock = false;
            }, 500);
            PageMgr.showPage("UsePropPage", {
                prop_type: ETaiQiuPropType.E_BaiQiu,
            });
        }
    }
}
