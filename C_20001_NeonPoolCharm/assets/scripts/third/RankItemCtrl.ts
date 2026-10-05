import PlayerDataSys from "./PlayerDataSys";
import rankItem from "./rankItem";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/RankItemCtrl")
export default class RankItemCtrl extends cc.Component {
    static prefabUrl = "assets/resources/prefabs/rankItem";
    static className = "RankItemCtrl";

    ui: rankItem = null;

    onUILoad(): void {
        this.ui = this.node.addComponent(rankItem);
    }

    setData(data: [number, string, string, number]): void {
        this.initData(data);
    }

    start(): void {}

    addButtonListen(): void {}

    onLoad(): void {
        this.onUILoad();
        this.addButtonListen();
    }

    initData(data: [number, string, string, number]): void {
        if (data) {
            this.ui.rank_1.active = data[0] == 1;
            this.ui.rank_2.active = data[0] == 2;
            this.ui.rank_3.active = data[0] == 3;
            this.ui.rank_item_bg.active = Number(data[0] % 2) == 0;
            this.ui.rank_num.getComponent(cc.Label).string = String(data[0]);
            this.ui.people.getComponent(cc.Label).string = data[1];
            this.ui.level.getComponent(cc.Label).string = data[2];
            this.ui.cash.getComponent(cc.Label).string = PlayerDataSys.getCashWithUnit(data[3]);
        }
    }
}
