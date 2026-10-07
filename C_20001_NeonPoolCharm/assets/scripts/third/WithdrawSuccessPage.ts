const { ccclass } = cc._decorator;

@ccclass
export default class WithdrawSuccessPage extends cc.Component {
    static URL = "db://assets/resources/pages/WithdrawSuccessPage.prefab";

    WithdrawSuccessPage: cc.Node = null;
    sk: cc.Node = null;
    page_bg: cc.Node = null;
    icon_yelow: cc.Node = null;
    title_label: cc.Node = null;
    bg_withdaw1: cc.Node = null;
    bg_withdaw2: cc.Node = null;
    mid: cc.Node = null;
    metode: cc.Node = null;
    line2: cc.Node = null;
    phone_label: cc.Node = null;
    line1: cc.Node = null;
    platform_root: cc.Node = null;
    dana: cc.Node = null;
    danaplat: cc.Node = null;
    ovo: cc.Node = null;
    ovoplat: cc.Node = null;
    shopppay: cc.Node = null;
    shopppayplat: cc.Node = null;
    account: cc.Node = null;
    btn: cc.Node = null;
    btn_confirm_label: cc.Node = null;
    des: cc.Node = null;
    des_1: cc.Node = null;
    cash: cc.Node = null;

    onLoad(): void {
        this.WithdrawSuccessPage = this.node;
        this.sk = this.WithdrawSuccessPage.getChildByName("sk");
        this.page_bg = this.WithdrawSuccessPage.getChildByName("page_bg");
        this.icon_yelow = this.page_bg.getChildByName("icon_yelow");
        this.title_label = this.page_bg.getChildByName("title_label");
        this.bg_withdaw1 = this.page_bg.getChildByName("bg_withdaw1");
        this.bg_withdaw2 = this.page_bg.getChildByName("bg_withdaw2");
        this.mid = this.page_bg.getChildByName("mid");
        this.metode = this.mid.getChildByName("metode");
        this.line2 = this.mid.getChildByName("line2");
        this.phone_label = this.mid.getChildByName("phone_label");
        this.line1 = this.mid.getChildByName("line1");
        this.platform_root = this.mid.getChildByName("platform_root");
        this.dana = this.platform_root.getChildByName("dana");
        this.danaplat = this.platform_root.getChildByName("danaplat");
        this.ovo = this.mid.getChildByName("ovo");
        this.ovoplat = this.ovo.getChildByName("ovoplat");
        this.shopppay = this.mid.getChildByName("shopppay");
        this.shopppayplat = this.shopppay.getChildByName("shopppayplat");
        this.account = this.mid.getChildByName("account");
        this.btn = this.page_bg.getChildByName("btn");
        this.btn_confirm_label = this.btn.getChildByName("btn_confirm_label");
        this.des = this.page_bg.getChildByName("des");
        this.des_1 = this.page_bg.getChildByName("des_1");
        this.cash = this.page_bg.getChildByName("cash");
    }
}
