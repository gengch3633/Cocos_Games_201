const { ccclass } = cc._decorator;

@ccclass
export default class RankPageNew extends cc.Component {
    static URL = "db://assets/resources/pages/RankPageNew.prefab";

    RankPageNew: cc.Node = null;
    bg: cc.Node = null;
    title_bg: cc.Node = null;
    title_label: cc.Node = null;
    top_desc_label: cc.Node = null;
    pop_close: cc.Node = null;
    rank_title_bg: cc.Node = null;
    rank_title_zhanghao: cc.Node = null;
    rank_title_defen: cc.Node = null;
    rank_title_xianjin: cc.Node = null;
    ScrollView: cc.Node = null;
    view: cc.Node = null;
    content: cc.Node = null;
    bottom_desc_richtext: cc.Node = null;

    onLoad(): void {
        this.RankPageNew = this.node;
        this.bg = this.RankPageNew.getChildByName("bg");
        this.title_bg = this.RankPageNew.getChildByName("title_bg");
        this.title_label = this.RankPageNew.getChildByName("title_label");
        this.top_desc_label = this.RankPageNew.getChildByName("top_desc_label");
        this.pop_close = this.RankPageNew.getChildByName("pop_close");
        this.rank_title_bg = this.RankPageNew.getChildByName("rank_title_bg");
        this.rank_title_zhanghao = this.rank_title_bg.getChildByName("rank_title_zhanghao");
        this.rank_title_defen = this.rank_title_bg.getChildByName("rank_title_defen");
        this.rank_title_xianjin = this.rank_title_bg.getChildByName("rank_title_xianjin");
        this.ScrollView = this.RankPageNew.getChildByName("ScrollView");
        this.view = this.ScrollView.getChildByName("view");
        this.content = this.view.getChildByName("content");
        this.bottom_desc_richtext = this.RankPageNew.getChildByName("bottom_desc_richtext");
    }
}
