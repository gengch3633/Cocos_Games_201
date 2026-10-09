import EventMgr from "./EventMgr";
import GameDataMgr from "./GameDataMgr";
import GameEventType from "./GameEventType";
import PlayerDataSys from "./PlayerDataSys";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/DiamondShopBtnCtr")
export default class DiamondShopBtnCtr extends cc.Component {
    @property({
        tooltip: "钻石数量",
        type: cc.Label
    })
    diamond_num_label = null;

    @property({
        tooltip: "红点",
        type: cc.Node
    })
    redPoint = null;

    removeEvent() {
        EventMgr.ignore(GameEventType.UPDATE_USER_DIAMOND, this.updateDiamond, this);
        EventMgr.ignore(GameEventType.SETDIAMONDPOINT, this.updateRedPoint, this);
    }

    addEvent() {
        EventMgr.listen(GameEventType.UPDATE_USER_DIAMOND, this.updateDiamond, this);
        EventMgr.listen(GameEventType.SETDIAMONDPOINT, this.updateRedPoint, this);
    }

    onEnable() {
        this.addEvent();
        this.updateDiamond();
        this.updateRedPoint();
    }

    onLoad() {}

    updateDiamond() {
        this.diamond_num_label.string = "" + PlayerDataSys.getDiamondBalance();
    }

    onDisable() {
        this.removeEvent();
    }

    updateRedPoint() {
        this.redPoint.active = !GameDataMgr.get_free_diamond_flag;
    }
}
