const { ccclass } = cc._decorator;

@ccclass
export default class withdrawItem extends cc.Component {
    withdrawItem = null;
    node = null;
    bg04 = null;
    bg05 = null;
    title_bg = null;
    title_root = null;
    title_level_label = null;
    title_label = null;
    btn_close = null;
    spr_content_in = null;
    cash_icon = null;
    lab_cash = null;
    des2 = null;
    btn = null;
    gray_btn_label = null;
    btn_yellow = null;
    yellow_btn_label = null;

    static URL = "db://assets/resources/prefabs/withdrawItem.prefab";

    onLoad() {
        this.withdrawItem = this.node;
        this.bg04 = this.withdrawItem.getChildByName("bg04");
        this.bg05 = this.bg04.getChildByName("bg05");
        this.title_bg = this.withdrawItem.getChildByName("title_bg");
        this.title_root = this.withdrawItem.getChildByName("title_root");
        this.title_level_label = this.title_root.getChildByName("title_level_label");
        this.title_label = this.title_root.getChildByName("title_label");
        this.btn_close = this.withdrawItem.getChildByName("btn_close");
        this.spr_content_in = this.withdrawItem.getChildByName("spr_content_in");
        this.cash_icon = this.spr_content_in.getChildByName("cash_icon");
        this.lab_cash = this.spr_content_in.getChildByName("lab_cash");
        this.des2 = this.withdrawItem.getChildByName("des2");
        this.btn = this.withdrawItem.getChildByName("btn");
        this.gray_btn_label = this.btn.getChildByName("gray_btn_label");
        this.btn_yellow = this.withdrawItem.getChildByName("btn_yellow");
        this.yellow_btn_label = this.btn_yellow.getChildByName("yellow_btn_label");
    }
}
