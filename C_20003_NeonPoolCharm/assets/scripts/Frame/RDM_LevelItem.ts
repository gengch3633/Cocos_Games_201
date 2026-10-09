import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import RDM_Level from "./RDM_Level";

const { ccclass } = cc._decorator;

@ccclass
export default class RDM_LevelItem extends cc.Component {

    data: any = null;
    conf: any = null;

    onBtnTestEvent() {
        if (1 == this.data.status || 2 == this.data.status || 3 == this.data.status) {
            this.data.now = this.data.total;
        }
        this.updateUI();
    }

    init(e) {
        this.conf = e;
        this.data = RDM_Level.getData(e.rdm_id);
        this.updateUI();
    }

    onBtnEvent() {
        let e = this;
        if (this.data.now >= this.data.total) {
            new Promise<void>(function (resolve) {
                if (FrameData.saveData.account.length <= 0) {
                    FrameSDK.openWindow("Panel_Account", {
                        numStr: FrameSDK.convertCoinToStr(FrameData.credit, true),
                        closeCB: resolve
                    });
                } else {
                    resolve();
                }
            }).then(function () {
                FrameSDK.logLiftEvent("finish_task");
                FrameSDK.logGameEvent("thepool_game_rdm", {
                    object_action: "show",
                    object_name: "rdm_" + e.data.status + "_end",
                    object_notes: "redeem_" + e.conf.rdm_id
                }, true);
                if (1 == e.data.status) {
                    FrameData.saveData.CoinStep[e.conf.rdm_id] = {
                        status: 2,
                        targetCoin: FrameData.getTargetCoint(e.conf.rdm_id, FrameData.saveData.credit.yellowCoin)
                    };
                } else if (2 == e.data.status) {
                    FrameData.saveData.CoinStep[e.conf.rdm_id].status = 3;
                } else if (3 == e.data.status) {
                    FrameData.saveData.CoinStep[e.conf.rdm_id].status = 4;
                }
                cc.director.emit("REFRESH_INFO");
                FrameSDK.logGameEvent("thepool_game_rdm", {
                    object_action: "show",
                    object_name: "rdm_" + FrameData.saveData.CoinStep[e.conf.rdm_id].status + "_start",
                    object_notes: "redeem_" + e.conf.rdm_id
                }, true);
            });
        } else {
            FrameSDK.openWindow("Panel_Tips", this.data);
        }
    }

    updateUI() {
        this.node.children.forEach(function (e) {
            e.active = false;
        });
        let e = this.data;
        let t = this.node.getChildByName("state" + e.status);
        if (1 == e.status || 2 == e.status) {
            cc.find("label_1", t).getComponent(cc.Label).string = 1 == e.status ? "LV." + e.now + " / LV." + e.total : FrameSDK.convertCoinToStr(e.total, true);
            cc.find("rtx_tips2", t).getComponent(cc.RichText).string = e.tips;
            cc.find("node_progress/node_bar", t).getComponent(cc.Sprite).fillRange = e.now / e.total;
            cc.find("node_progress/node_bar/lbl_pro", t).getComponent(cc.Label).string = 1 == e.status ? "LV." + e.now + "/LV." + e.total : FrameSDK.convertCoinToStr(e.now, true) + "/" + FrameSDK.convertCoinToStr(e.total, true);
        } else if (3 == e.status) {
            cc.find("label_1", t).getComponent(cc.Label).string = FrameSDK.convertCoinToStr(FrameData.saveData.CoinStep[this.conf.rdm_id].targetCoin, true);
            cc.find("rtx_tips2", t).getComponent(cc.RichText).string = e.tips;
        } else if (4 == e.status) {
            cc.find("label_1", t).getComponent(cc.Label).string = FrameSDK.convertCoinToStr(FrameData.saveData.CoinStep[this.conf.rdm_id].targetCoin, true);
        }
        if (e.now >= e.total && 1 == e.status) {
            FrameSDK.logLiftEvent("reach_threshold");
        }
        t.active = true;
    }
}
