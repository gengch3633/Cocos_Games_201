import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Tips extends cc.Component {

    @property(cc.Node)
    panel_window: cc.Node = null;

    @property(cc.RichText)
    rtx_tips1: cc.RichText = null;

    @property(cc.Sprite)
    bar: cc.Sprite = null;

    @property(cc.Label)
    labelbar: cc.Label = null;

    @property(cc.Label)
    labelBtn: cc.Label = null;

    viewData: any = null;

    hideTime: number = 0;

    onTouchCloseTips(): void {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, null);
        }
    }

    clickConfirm(): void {
        this.onTouchCloseTips();
    }

    onEnable(): void {
        FrameSDK.openEffect(this);
        let e = "";
        let t = "LV." + this.viewData.now + "/LV." + this.viewData.total;
        this.labelBtn.string = "skey_060";
        if (this.viewData.isCharity) {
            if (1 == this.viewData.status) {
                this.labelBtn.string = "skey_061";
                t = this.viewData.now + "/" + this.viewData.total;
                e = "skey_081??&value1==<color= #DF4704>" + this.viewData.total + "</c>&value2==<color= #DF4704>" + Math.ceil(Math.max(0, this.viewData.total - this.viewData.now) / FrameData.getCoinOutNum("charity")) + "</c>";
            } else if (2 == this.viewData.status) {
                e = "skey_059??&value1==<color= #DF4704>" + this.viewData.total + "</c>&value2==<color= #DF4704>" + this.viewData.now + "</c>&value3==<color= #DF4704>" + Math.max(0, this.viewData.total - this.viewData.now) + "</c>";
            }
        } else if (1 == this.viewData.status) {
            e = "skey_057??&value1==<color= #DF4704>" + this.viewData.total + "</c>&value2==<color= #DF4704>" + this.viewData.now + "</c>&value3==<color= #DF4704>" + Math.max(0, this.viewData.total - this.viewData.now) + "</c>";
        } else if (2 == this.viewData.status) {
            this.labelBtn.string = "skey_061";
            t = FrameSDK.convertCoinToStr(this.viewData.now, true) + "/" + FrameSDK.convertCoinToStr(this.viewData.total, true);
            e = "skey_058??&value1==<color= #009D12>" + FrameSDK.convertCoinToStr(this.viewData.now, true) + "</c>&value2==<color= #009D12>" + FrameSDK.convertCoinToStr(this.viewData.total, true) + "</c>";
        } else if (3 == this.viewData.status) {
            e = "skey_059??&value1==<color= #DF4704>" + this.viewData.total + "</c>&value2==<color= #DF4704>" + this.viewData.now + "</c>&value3==<color= #DF4704>" + Math.max(0, this.viewData.total - this.viewData.now) + "</c>";
        }
        this.rtx_tips1.string = e;
        this.bar.fillRange = this.viewData.now / this.viewData.total;
        this.labelbar.string = t;
    }

}
