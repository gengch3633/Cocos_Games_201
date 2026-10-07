import PageMgr from "./PageMgr";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import PlayerDataSys from "./PlayerDataSys";
import ConfigDataMgr, { EPropID } from "./ConfigDataMgr";
import { UiManager } from "./UiManage";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/PropBtnCtrl")
export default class PropBtnCtrl extends cc.Component {
    @property({ tooltip: "加号", type: cc.Enum(EPropID) })
    prop_id = EPropID.E_CiTie;

    @property({ tooltip: "加号", type: cc.Node })
    add_icon: cc.Node = null;

    @property({ tooltip: "计数根节点", type: cc.Node })
    count_root: cc.Node = null;

    @property({ tooltip: "道具数量", type: cc.Node })
    citie_prop_count_label: cc.Node = null;

    _clickBlocked: boolean = null;

    onLoad(): void {
    }

    updateUI(): void {
        const e = (PlayerDataSys as any).getPropCount(this.prop_id);
        this.add_icon.active = e < 1;
        this.count_root.active = e > 0;
        this.citie_prop_count_label.getComponent(cc.Label).string = String(e);
    }

    onUpdataProp(): void {
        this.prop_id == this.prop_id && this.updateUI();
    }

    start(): void {
        UiManager.addButtonListen(this.node, this.onThisClicked, this);
    }

    removeEvent(): void {
        EventMgr.ignore(GameEventType.UPDATE_PROP_ICON, this.onUpdataProp, this);
    }

    useProp(): boolean {
        if (!(PlayerDataSys as any).checkPropUseTimes(this.prop_id)) {
            return false;
        }
        EventMgr.trigger(GameEventType.USE_PROP, this.prop_id);
        return true;
    }

    addEvent(): void {
        EventMgr.trigger(GameEventType.UPDATE_PROP_ICON);
        EventMgr.listen(GameEventType.UPDATE_PROP_ICON, this.onUpdataProp, this);
    }

    onDisable(): void {
        this.removeEvent();
    }

    onEnable(): void {
        this._clickBlocked = false;
        this.addEvent();
        this.updateUI();
    }

    onThisClicked(): void {
        if (!this._clickBlocked) {
            this._clickBlocked = true;
            if ((PlayerDataSys as any).getPropCount(this.prop_id)) {
                this.useProp();
                this.scheduleOnce(() => {
                    this._clickBlocked = false;
                }, 0.2);
            } else {
                PageMgr.showPage("BuyPropPage", {
                    prop_id: this.prop_id,
                });
                this._clickBlocked = false;
            }
        }
    }
}
