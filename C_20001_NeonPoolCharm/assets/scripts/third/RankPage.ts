const { ccclass } = cc._decorator;

@ccclass
export default class RankPage extends cc.Component {
    static URL = "db://assets/resources/pages/RankPage.prefab";

    RankPage: cc.Node = null;
    list: cc.Node = null;
    list_bg: cc.Node = null;
    head_bg: cc.Node = null;
    pe: cc.Node = null;
    na: cc.Node = null;
    ju: cc.Node = null;
    ak: cc.Node = null;
    ScrollView: cc.Node = null;
    view: cc.Node = null;
    content: cc.Node = null;
    rankItem: cc.Node = null;
    rank_num: cc.Node = null;
    rank_icon: cc.Node = null;
    Name: cc.Node = null;
    level: cc.Node = null;
    cash: cc.Node = null;
    bg: cc.Node = null;
    tittle: cc.Node = null;
    tip: cc.Node = null;
    lab_des: cc.Node = null;
    pop_close: cc.Node = null;

    onLoad(): void {
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
