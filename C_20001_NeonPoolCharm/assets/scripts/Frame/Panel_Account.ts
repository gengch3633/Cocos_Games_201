import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import PaymentItem from "./PaymentItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Account extends cc.Component {
    @property(cc.Node)
    panel_window: cc.Node = null;

    @property(cc.Label)
    cashLabel: cc.Label = null;

    @property(cc.ToggleContainer)
    paymentToggleContainer: cc.ToggleContainer = null;

    @property(cc.EditBox)
    editbox: cc.EditBox = null;

    viewData: any = null;
    _paymentIDs: number[] = [];
    hideTime: number = 0;

    onBtnEvent(_event: cc.Event, customEventData: string): void {
        if (customEventData == "1") {
            if (!(this.editbox.string.trim().length > 0)) {
                FrameSDK.showToast("skey_024");
                return;
            }
            const i = this.paymentToggleContainer.toggleItems.findIndex((item) => item.isChecked);
            FrameData.saveData.account = this.editbox.string.trim();
            FrameData.saveData.paymentID = this._paymentIDs[i] ?? -1;
            this.viewData?.closeCB?.();
        }
        this.close();
    }

    onLoad(): void {
        FrameSDK.openEffect(this);
    }

    close(): void {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, null);
        }
    }

    onEnable(): void {
        this.cashLabel.string = this.viewData?.numStr ?? "";
        this._paymentIDs = FrameData.CountryConf.cash_id.slice(0, 4);
        this.paymentToggleContainer.node.children.forEach((child, index) => {
            child.getComponent(PaymentItem).paymentID = this._paymentIDs[index] ?? -1;
        });
    }
}
