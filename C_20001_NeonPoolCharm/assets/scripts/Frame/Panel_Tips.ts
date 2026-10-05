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
        let tipsText = "";
        let barLabel = "LV." + this.viewData.now + "/LV." + this.viewData.total;
        this.labelBtn.string = "skey_060";
        if (this.viewData.isCharity) {
            if (this.viewData.status == 1) {
                this.labelBtn.string = "skey_061";
                barLabel = this.viewData.now + "/" + this.viewData.total;
                tipsText =
                    "skey_081??&value1==<color= #DF4704>" +
                    this.viewData.total +
                    "</c>&value2==<color= #DF4704>" +
                    Math.ceil(Math.max(0, this.viewData.total - this.viewData.now) / FrameData.getCoinOutNum("charity")) +
                    "</c>";
            } else if (this.viewData.status == 2) {
                tipsText =
                    "skey_059??&value1==<color= #DF4704>" +
                    this.viewData.total +
                    "</c>&value2==<color= #DF4704>" +
                    this.viewData.now +
                    "</c>&value3==<color= #DF4704>" +
                    Math.max(0, this.viewData.total - this.viewData.now) +
                    "</c>";
            }
        } else if (this.viewData.status == 1) {
            tipsText =
                "skey_057??&value1==<color= #DF4704>" +
                this.viewData.total +
                "</c>&value2==<color= #DF4704>" +
                this.viewData.now +
                "</c>&value3==<color= #DF4704>" +
                Math.max(0, this.viewData.total - this.viewData.now) +
                "</c>";
        } else if (this.viewData.status == 2) {
            this.labelBtn.string = "skey_061";
            barLabel =
                FrameSDK.convertCoinToStr(this.viewData.now, true) +
                "/" +
                FrameSDK.convertCoinToStr(this.viewData.total, true);
            tipsText =
                "skey_058??&value1==<color= #009D12>" +
                FrameSDK.convertCoinToStr(this.viewData.now, true) +
                "</c>&value2==<color= #009D12>" +
                FrameSDK.convertCoinToStr(this.viewData.total, true) +
                "</c>";
        } else if (this.viewData.status == 3) {
            tipsText =
                "skey_059??&value1==<color= #DF4704>" +
                this.viewData.total +
                "</c>&value2==<color= #DF4704>" +
                this.viewData.now +
                "</c>&value3==<color= #DF4704>" +
                Math.max(0, this.viewData.total - this.viewData.now) +
                "</c>";
        }
        this.rtx_tips1.string = tipsText;
        this.bar.fillRange = this.viewData.now / this.viewData.total;
        this.labelbar.string = barLabel;
    }
}
