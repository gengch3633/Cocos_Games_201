import PlayerDataSys from "./PlayerDataSys";
import rankItem from "./rankItem";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/RankItemCtrl")
export default class RankItemCtrl extends cc.Component {
    ui = null;

    static prefabUrl = "assets/resources/prefabs/rankItem";
    static className = "RankItemCtrl";

    onUILoad() {
        this.ui = this.node.addComponent(rankItem);
    }

    setData(e) {
        this.initData(e);
    }

    start() {}

    addButtonListen() {}

    onLoad() {
        this.onUILoad();
        this.addButtonListen();
    }

    initData(e) {
        if (e) {
            this.ui.rank_1.active = 1 == e[0];
            this.ui.rank_2.active = 2 == e[0];
            this.ui.rank_3.active = 3 == e[0];
            this.ui.rank_item_bg.active = 0 == Number(e[0] % 2);
            this.ui.rank_num.getComponent(cc.Label).string = e[0];
            this.ui.people.getComponent(cc.Label).string = e[1];
            this.ui.level.getComponent(cc.Label).string = e[2];
            this.ui.cash.getComponent(cc.Label).string = PlayerDataSys.getCashWithUnit(e[3]);
        }
    }
}
