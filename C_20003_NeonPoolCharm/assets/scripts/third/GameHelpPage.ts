const { ccclass } = cc._decorator;

@ccclass
export default class GameHelpPage extends cc.Component {

    GameHelpPage = null;
    node = null;
    root = null;
    jiantou = null;
    jiantou_heng = null;
    mask_right = null;
    bg = null;
    mask_buttom = null;
    obj_tips_1 = null;
    lab_tips_1 = null;
    bg_qipao_1_3 = null;
    obj_tips_2 = null;
    lab_tips_2 = null;
    obj_tips_3 = null;
    icon_caihongdong = null;
    icon_daoju_miaozhun = null;
    icon_daoju_baiqiu = null;
    lab_tips_3_1 = null;
    lab_tips_3_2 = null;
    lab_tips_3_3 = null;
    lab_continue = null;
    btn_close = null;

    static URL = "db://assets/resources/pages/GameHelpPage.prefab";

    onLoad() {
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
