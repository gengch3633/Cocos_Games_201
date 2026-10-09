const { ccclass } = cc._decorator;

@ccclass
export default class RankPageNew extends cc.Component {
    RankPageNew = null;
    node = null;
    bg = null;
    title_bg = null;
    title_label = null;
    top_desc_label = null;
    pop_close = null;
    rank_title_bg = null;
    rank_title_zhanghao = null;
    rank_title_defen = null;
    rank_title_xianjin = null;
    ScrollView = null;
    view = null;
    content = null;
    bottom_desc_richtext = null;

    static URL = "db://assets/resources/pages/RankPageNew.prefab";

    onLoad() {
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
