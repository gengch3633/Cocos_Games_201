import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import RDM_Charity from "./RDM_Charity";

const { ccclass } = cc._decorator;

@ccclass
export default class RDM_CharityItem extends cc.Component {

    data: any = null;
    conf: any = null;

    onBtnEvent() {
        let e = this;
        if (this.data.now >= this.data.total) {
            new Promise<void>(function (t) {
                if (FrameData.saveData.account.length <= 0) {
                    FrameSDK.openWindow("Panel_Account", {
                        numStr: FrameSDK.convertCharityToStr(e.conf.reward, true),
                        closeCB: t
                    });
                } else {
                    t();
                }
            }).then(function () {
                FrameSDK.logLiftEvent("finish_task");
                FrameSDK.logGameEvent("thepool_game_rdm", {
                    object_action: "show",
                    object_name: "rdm2_" + e.data.status + "_end",
                    object_notes: "redeem_" + e.conf.rdm_id
                }, true);
                if (1 == e.data.status) {
                    FrameData.saveData.CharityStep[e.conf.rdm_id] = {
                        status: 2
                    };
                } else if (2 == e.data.status) {
                    FrameData.saveData.CharityStep[e.conf.rdm_id].status = 3;
                }
                cc.director.emit("REFRESH_INFO");
                FrameSDK.logGameEvent("thepool_game_rdm", {
                    object_action: "show",
                    object_name: "rdm2_" + e.data.status + "_start",
                    object_notes: "redeem_" + e.conf.rdm_id
                }, true);
            });
        } else {
            FrameSDK.openWindow("Panel_Tips", this.data);
        }
    }

    onBtnTestEvent() {
        if (1 == this.data.status || 2 == this.data.status) {
            this.data.now = this.data.total;
        }
        this.updateUI();
    }

    init(e) {
        this.conf = e;
        this.data = RDM_Charity.getData(e.rdm_id);
        this.updateUI();
    }

    updateUI() {
        this.node.children.forEach(function (e) {
            e.active = false;
        });
        let e = this.data;
        let t = this.node.getChildByName("state" + e.status);
        if (1 == e.status) {
            cc.find("label_1", t).getComponent(cc.Label).string = "" + FrameSDK.convertCharityToStr(this.conf.reward, true);
            cc.find("CashFishCredit/count", t).getComponent(cc.Label).string = FrameSDK.convertCharityToStr(e.now) + "/" + FrameSDK.convertCharityToStr(e.total);
            cc.find("rtx_tips2", t).getComponent(cc.RichText).string = e.tips;
        } else if (2 == e.status) {
            cc.find("label_1", t).getComponent(cc.Label).string = FrameSDK.convertCharityToStr(this.conf.reward, true);
            cc.find("rtx_tips2", t).getComponent(cc.RichText).string = e.tips;
        } else if (3 == e.status) {
            cc.find("label_1", t).getComponent(cc.Label).string = FrameSDK.convertCharityToStr(this.conf.reward, true);
        }
        if (e.now >= e.total && 1 == e.status) {
            FrameSDK.logLiftEvent("reach_threshold");
        }
        t.active = true;
    }
}
