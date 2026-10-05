const { ccclass } = cc._decorator;

@ccclass
export default class GameHelpPage extends cc.Component {
    static URL = "db://assets/resources/pages/GameHelpPage.prefab";

    GameHelpPage: cc.Node = null;
    root: cc.Node = null;
    jiantou: cc.Node = null;
    jiantou_heng: cc.Node = null;
    mask_right: cc.Node = null;
    bg: cc.Node = null;
    mask_buttom: cc.Node = null;
    obj_tips_1: cc.Node = null;
    lab_tips_1: cc.Node = null;
    bg_qipao_1_3: cc.Node = null;
    obj_tips_2: cc.Node = null;
    lab_tips_2: cc.Node = null;
    obj_tips_3: cc.Node = null;
    icon_caihongdong: cc.Node = null;
    icon_daoju_miaozhun: cc.Node = null;
    icon_daoju_baiqiu: cc.Node = null;
    lab_tips_3_1: cc.Node = null;
    lab_tips_3_2: cc.Node = null;
    lab_tips_3_3: cc.Node = null;
    lab_continue: cc.Node = null;
    btn_close: cc.Node = null;

    onLoad(): void {
        this.GameHelpPage = this.node;
        this.root = this.GameHelpPage.getChildByName("root");
        this.jiantou = this.root.getChildByName("jiantou");
        this.jiantou_heng = this.root.getChildByName("jiantou_heng");
        this.mask_right = this.root.getChildByName("mask_right");
        this.bg = this.mask_right.getChildByName("bg");
        this.mask_buttom = this.root.getChildByName("mask_buttom");
        this.obj_tips_1 = this.root.getChildByName("obj_tips_1");
        this.lab_tips_1 = this.obj_tips_1.getChildByName("lab_tips_1");
        this.bg_qipao_1_3 = this.obj_tips_1.getChildByName("bg_qipao_1_3");
        this.obj_tips_2 = this.root.getChildByName("obj_tips_2");
        this.lab_tips_2 = this.obj_tips_2.getChildByName("lab_tips_2");
        this.obj_tips_3 = this.root.getChildByName("obj_tips_3");
        this.icon_caihongdong = this.obj_tips_3.getChildByName("icon_caihongdong");
        this.icon_daoju_miaozhun = this.obj_tips_3.getChildByName("icon_daoju_miaozhun");
        this.icon_daoju_baiqiu = this.obj_tips_3.getChildByName("icon_daoju_baiqiu");
        this.lab_tips_3_1 = this.obj_tips_3.getChildByName("lab_tips_3_1");
        this.lab_tips_3_2 = this.obj_tips_3.getChildByName("lab_tips_3_2");
        this.lab_tips_3_3 = this.obj_tips_3.getChildByName("lab_tips_3_3");
        this.lab_continue = this.root.getChildByName("lab_continue");
        this.btn_close = this.root.getChildByName("btn_close");
    }
}
