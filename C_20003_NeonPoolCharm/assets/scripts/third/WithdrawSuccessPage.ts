const { ccclass } = cc._decorator;

@ccclass
export default class WithdrawSuccessPage extends cc.Component {
    WithdrawSuccessPage = null;

    node = null;

    sk = null;

    page_bg = null;

    icon_yelow = null;

    title_label = null;

    bg_withdaw1 = null;

    bg_withdaw2 = null;

    mid = null;

    metode = null;

    line2 = null;

    phone_label = null;

    line1 = null;

    platform_root = null;

    dana = null;

    danaplat = null;

    ovo = null;

    ovoplat = null;

    shopppay = null;

    shopppayplat = null;

    account = null;

    btn = null;

    btn_confirm_label = null;

    des = null;

    des_1 = null;

    cash = null;

    static URL = "db://assets/resources/pages/WithdrawSuccessPage.prefab";

    onLoad() {
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
