const { ccclass } = cc._decorator;

@ccclass
export default class rankItem extends cc.Component {
    rankItem: cc.Node = null;
    rank_item_bg: cc.Node = null;
    rank_num: cc.Node = null;
    rank_1: cc.Node = null;
    rank_2: cc.Node = null;
    rank_3: cc.Node = null;
    people: cc.Node = null;
    level: cc.Node = null;
    cash: cc.Node = null;

    static URL = "db://assets/resources/prefabs/rankItem.prefab";

    onLoad(): void {
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
