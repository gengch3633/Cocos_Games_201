import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Feedback extends cc.Component {

    @property(cc.EditBox)
    editbox1: cc.EditBox = null;

    @property(cc.EditBox)
    editbox2: cc.EditBox = null;

    public static openPage(e?: any): void {
        FrameSDK.openWindow("Panel_Feedback", {
            closeCB: e
        });
    }

    onButSubmit(): void {
        const e = this;
        if (this.editbox1.string.length > 0 && this.editbox2.string.length > 0) {
            FrameSDK.frameData.gameFuc.openLoad();
            this.scheduleOnce(function () {
                FrameSDK.frameData.gameFuc.closeLoad();
                FrameSDK.showToast("fkey_140");
                e.node.destroy();
            }, 0.6 + 2 * Math.random());
            const t = new Date();
            const a = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0") + ":" + String(t.getHours()).padStart(2, "0") + ":" + String(t.getMinutes()).padStart(2, "0");
            FrameSDK.logCommonEvent("thepool_feedback", {
                object_action: "question:" + this.editbox1.string,
                object_name: "information:" + this.editbox2.string,
                object_notes: "time:" + a
            });
        } else if (this.editbox1.string.length <= 0) {
            FrameSDK.showToast("fkey_138");
        } else if (this.editbox2.string.length <= 0) {
            FrameSDK.showToast("fkey_139");
        } else {
            this.node.destroy();
        }
    }

    onButClose(): void {
        this.node.destroy();
    }

}
