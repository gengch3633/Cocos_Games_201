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

    onBtnEvent(event: cc.Event, data: string) {
        if ("1" == data) {
            if (!(this.editbox.string.trim().length > 0)) {
                FrameSDK.showToast("skey_024");
                return;
            }
            const index = this.paymentToggleContainer.toggleItems.findIndex(function (item) {
                return item.isChecked;
            });
            FrameData.saveData.account = this.editbox.string.trim();
            const paymentID = this._paymentIDs[index];
            FrameData.saveData.paymentID = paymentID != null ? paymentID : -1;
            if (this.viewData.closeCB != null) {
                this.viewData.closeCB.call(this.viewData);
            }
        }
        this.close();
    }

    onLoad() {
        FrameSDK.openEffect(this);
    }

    close() {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, null);
        }
    }

    onEnable() {
        const self = this;
        this.cashLabel.string = this.viewData.numStr != null ? this.viewData.numStr : "";
        this._paymentIDs = FrameData.CountryConf.cash_id.slice(0, 4);
        this.paymentToggleContainer.node.children.forEach(function (node, index) {
            const paymentID = self._paymentIDs[index];
            node.getComponent(PaymentItem).paymentID = paymentID != null ? paymentID : -1;
        });
    }
}
