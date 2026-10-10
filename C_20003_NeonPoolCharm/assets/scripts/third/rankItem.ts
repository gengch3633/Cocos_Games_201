const { ccclass } = cc._decorator;

@ccclass
export default class rankItem extends cc.Component {
    rankItem = null;
    node = null;
    rank_item_bg = null;
    rank_num = null;
    rank_1 = null;
    rank_2 = null;
    rank_3 = null;
    people = null;
    level = null;
    cash = null;

    static URL = "db://assets/resources/prefabs/rankItem.prefab";

    onLoad() {
        this.rankItem = this.node;
        this.rank_item_bg = this.rankItem.getChildByName("rank_item_bg");
        this.rank_num = this.rankItem.getChildByName("rank_num");
        this.rank_1 = this.rankItem.getChildByName("rank_1");
        this.rank_2 = this.rankItem.getChildByName("rank_2");
        this.rank_3 = this.rankItem.getChildByName("rank_3");
        this.people = this.rankItem.getChildByName("people");
        this.level = this.rankItem.getChildByName("level");
        this.cash = this.rankItem.getChildByName("cash");
    }
}
