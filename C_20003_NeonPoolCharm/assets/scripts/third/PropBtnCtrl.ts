import { EPropID } from "./ConfigDataMgr";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import PageMgr from "./PageMgr";
import PlayerDataSys from "./PlayerDataSys";
import { UiManager } from "./UiManage";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/PropBtnCtrl")
export default class PropBtnCtrl extends cc.Component {
    @property({
        tooltip: "加号",
        type: cc.Enum(EPropID)
    })
    prop_id = EPropID.E_CiTie;

    @property({
        tooltip: "加号",
        type: cc.Node
    })
    add_icon = null;

    @property({
        tooltip: "计数根节点",
        type: cc.Node
    })
    count_root = null;

    @property({
        tooltip: "道具数量",
        type: cc.Node
    })
    citie_prop_count_label = null;

    _clickBlocked = null;

    onLoad() {}

    updateUI() {
        var e = PlayerDataSys.getPropCount(this.prop_id);
        this.add_icon.active = e < 1;
        this.count_root.active = e > 0;
        this.citie_prop_count_label.getComponent(cc.Label).string = e;
    }

    onUpdataProp() {
        this.prop_id == this.prop_id && this.updateUI();
    }

    start() {
        UiManager.addButtonListen(this.node, this.onThisClicked, this);
    }

    removeEvent() {
        EventMgr.ignore(GameEventType.UPDATE_PROP_ICON, this.onUpdataProp, this);
    }

    useProp() {
        if (!PlayerDataSys.checkPropUseTimes(this.prop_id)) return false;
        EventMgr.trigger(GameEventType.USE_PROP, this.prop_id);
        return true;
    }

    addEvent() {
        EventMgr.trigger(GameEventType.UPDATE_PROP_ICON);
        EventMgr.listen(GameEventType.UPDATE_PROP_ICON, this.onUpdataProp, this);
    }

    onDisable() {
        this.removeEvent();
    }

    onEnable() {
        this._clickBlocked = false;
        this.addEvent();
        this.updateUI();
    }

    onThisClicked() {
        var e = this;
        if (!this._clickBlocked) {
            this._clickBlocked = true;
            if (PlayerDataSys.getPropCount(this.prop_id)) {
                this.useProp();
                this.scheduleOnce(function () {
                    e._clickBlocked = false;
                }, 0.2);
            } else {
                PageMgr.showPage("BuyPropPage", {
                    prop_id: this.prop_id
                });
                this._clickBlocked = false;
            }
        }
    }
}
