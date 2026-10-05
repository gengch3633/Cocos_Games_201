import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import RDM_Charity from "./RDM_Charity";

const { ccclass } = cc._decorator;

@ccclass
export default class RDM_CharityItem extends cc.Component {
    data: any = null;
    conf: any = null;

    onBtnEvent(): void {
        if (this.data.now >= this.data.total) {
            new Promise<void>((resolve) => {
                if (FrameData.saveData.account.length <= 0) {
                    FrameSDK.openWindow("Panel_Account", {
                        numStr: FrameSDK.convertCharityToStr(this.conf.reward, true),
                        closeCB: resolve,
                    });
                } else {
                    resolve();
                }
            }).then(() => {
                FrameSDK.logLiftEvent("finish_task");
                FrameSDK.logGameEvent(
                    "thepool_game_rdm",
                    {
                        object_action: "show",
                        object_name: "rdm2_" + this.data.status + "_end",
                        object_notes: "redeem_" + this.conf.rdm_id,
                    },
                    true
                );
                if (this.data.status == 1) {
                    FrameData.saveData.CharityStep[this.conf.rdm_id] = { status: 2 };
                } else if (this.data.status == 2) {
                    FrameData.saveData.CharityStep[this.conf.rdm_id].status = 3;
                }
                cc.director.emit("REFRESH_INFO");
                FrameSDK.logGameEvent(
                    "thepool_game_rdm",
                    {
                        object_action: "show",
                        object_name: "rdm2_" + this.data.status + "_start",
                        object_notes: "redeem_" + this.conf.rdm_id,
                    },
                    true
                );
            });
        } else {
            FrameSDK.openWindow("Panel_Tips", this.data);
        }
    }

    onBtnTestEvent(): void {
        if (this.data.status == 1 || this.data.status == 2) {
            this.data.now = this.data.total;
        }
        this.updateUI();
    }

    init(conf: any): void {
        this.conf = conf;
        this.data = RDM_Charity.getData(conf.rdm_id);
        this.updateUI();
    }

    updateUI(): void {
        this.node.children.forEach((child) => {
            child.active = false;
        });
        const data = this.data;
        const stateNode = this.node.getChildByName("state" + data.status);
        if (data.status == 1) {
            cc.find("label_1", stateNode).getComponent(cc.Label).string =
                "" + FrameSDK.convertCharityToStr(this.conf.reward, true);
            cc.find("CashFishCredit/count", stateNode).getComponent(cc.Label).string =
                FrameSDK.convertCharityToStr(data.now) + "/" + FrameSDK.convertCharityToStr(data.total);
            cc.find("rtx_tips2", stateNode).getComponent(cc.RichText).string = data.tips;
        } else if (data.status == 2) {
            cc.find("label_1", stateNode).getComponent(cc.Label).string =
                FrameSDK.convertCharityToStr(this.conf.reward, true);
            cc.find("rtx_tips2", stateNode).getComponent(cc.RichText).string = data.tips;
        } else if (data.status == 3) {
            cc.find("label_1", stateNode).getComponent(cc.Label).string =
                FrameSDK.convertCharityToStr(this.conf.reward, true);
        }
        if (data.now >= data.total && data.status == 1) {
            FrameSDK.logLiftEvent("reach_threshold");
        }
        stateNode.active = true;
    }
}
