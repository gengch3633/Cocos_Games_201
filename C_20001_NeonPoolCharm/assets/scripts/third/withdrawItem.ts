const { ccclass } = cc._decorator;

@ccclass
export default class withdrawItem extends cc.Component {
    static URL = "db://assets/resources/prefabs/withdrawItem.prefab";

    withdrawItem: cc.Node = null;
    bg04: cc.Node = null;
    bg05: cc.Node = null;
    title_bg: cc.Node = null;
    title_root: cc.Node = null;
    title_level_label: cc.Node = null;
    title_label: cc.Node = null;
    btn_close: cc.Node = null;
    spr_content_in: cc.Node = null;
    cash_icon: cc.Node = null;
    lab_cash: cc.Node = null;
    des2: cc.Node = null;
    btn: cc.Node = null;
    gray_btn_label: cc.Node = null;
    btn_yellow: cc.Node = null;
    yellow_btn_label: cc.Node = null;

    onLoad(): void {
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
