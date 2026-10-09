const { ccclass } = cc._decorator;

@ccclass
export default class RankPage extends cc.Component {
    RankPage = null;
    node = null;
    list = null;
    list_bg = null;
    head_bg = null;
    pe = null;
    na = null;
    ju = null;
    ak = null;
    ScrollView = null;
    view = null;
    content = null;
    rankItem = null;
    rank_num = null;
    rank_icon = null;
    Name = null;
    level = null;
    cash = null;
    bg = null;
    tittle = null;
    tip = null;
    lab_des = null;
    pop_close = null;

    static URL = "db://assets/resources/pages/RankPage.prefab";

    onLoad() {
        this.RankPage = this.node;
        this.list = this.RankPage.getChildByName("list");
        this.list_bg = this.list.getChildByName("list_bg");
        this.head_bg = this.list_bg.getChildByName("head_bg");
        this.pe = this.head_bg.getChildByName("pe");
        this.na = this.head_bg.getChildByName("na");
        this.ju = this.head_bg.getChildByName("ju");
        this.ak = this.head_bg.getChildByName("ak");
        this.ScrollView = this.list.getChildByName("ScrollView");
        this.view = this.ScrollView.getChildByName("view");
        this.content = this.view.getChildByName("content");
        this.rankItem = this.content.getChildByName("rankItem");
        this.rank_num = this.rankItem.getChildByName("rank_num");
        this.rank_icon = this.rankItem.getChildByName("rank_icon");
        this.Name = this.rankItem.getChildByName("Name");
        this.level = this.rankItem.getChildByName("level");
        this.cash = this.rankItem.getChildByName("cash");
        this.bg = this.RankPage.getChildByName("bg");
        this.tittle = this.RankPage.getChildByName("tittle");
        this.tip = this.RankPage.getChildByName("tip");
        this.lab_des = this.tip.getChildByName("lab_des");
        this.pop_close = this.RankPage.getChildByName("pop_close");
    }
}
