import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import PaymentItem from "./PaymentItem";
import RDM_CharityItem from "./RDM_CharityItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RDM_Charity extends cc.Component {
    @property(cc.Node)
    top: cc.Node = null;

    @property(cc.Label)
    lbl_gCoin: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    numberLabel: cc.Label = null;

    @property(cc.Label)
    peopleLabel: cc.Label = null;

    @property(cc.Node)
    paymentRootNode: cc.Node = null;

    @property(cc.ScrollView)
    scrollview: cc.ScrollView = null;

    @property(cc.Node)
    guide: cc.Node = null;

    coin: string = "0";
    guideInedx: number = 0;

    openGuide(): void {
        this.guide.active = true;
        this.guide.children.forEach((child) => {
            child.active = false;
        });
        const mask = cc.find("mask", this.guide).getComponent(cc.Mask);
        mask.node.active = true;
        if (this.guideInedx == 0) {
            cc.find("tips1", this.guide).active = true;
            mask.spriteFrame = FrameSDK.getNodeTexture(cc.find("panel_window/node_list2", this.node));
            cc.tween(cc.find("tips1/hand", this.guide))
                .by(0.5, { x: 50, y: -50 })
                .by(0.5, { x: -50, y: 50 })
                .union()
                .repeatForever()
                .start();
        } else if (this.guideInedx == 1) {
            cc.find("tips2", this.guide).active = true;
            const data = RDM_Charity.getData(FrameData.FRAME_CONF.CoinConf[0].rdm_id);
            mask.spriteFrame = FrameSDK.getNodeTexture(
                cc.find("panel_window/scrollview/view/content/item", this.node)
            );
            cc.find("tips2/label", this.guide).getComponent(cc.Label).string =
                "skey_109??&value1==" + data.total;
            cc.tween(cc.find("tips2/hand", this.guide))
                .by(0.5, { x: 50, y: -50 })
                .by(0.5, { x: -50, y: 50 })
                .union()
                .repeatForever()
                .start();
        } else if (this.guideInedx == 2) {
            cc.find("tips3", this.guide).active = true;
            const data = RDM_Charity.getData(FrameData.FRAME_CONF.CoinConf[0].rdm_id);
            cc.find("tips3/label", this.guide).getComponent(cc.Label).string =
                "skey_110??&value1==" + data.total;
            cc.tween(cc.find("tips3/hand", this.guide))
                .by(0.5, { x: 50, y: -50 })
                .by(0.5, { x: -50, y: 50 })
                .union()
                .repeatForever()
                .start();
            mask.spriteFrame = FrameSDK.getNodeTexture(cc.find("panel_window/top/btn_close", this.node));
        } else if (this.guideInedx == 3) {
            this.node.destroy();
            cc.director.emit("CHARITY_GUIDE_FINISH");
        }
    }

    updateUI(): void {
        this.coin = FrameSDK.convertCharityToStr(FrameData.charityCredit);
        this.lbl_gCoin.string = this.coin;
        this.timeLabel.string = "skey_089??&value1==" + FrameData.saveData.charityDonateTime;
        this.numberLabel.string = "" + FrameSDK.formatNumber(FrameData.saveData.charityDonated, 0, 1);
        this.peopleLabel.string =
            "skey_090??&value1==" +
            Math.floor(FrameData.saveData.charityDonated / FrameData.getCoinOutNum("charityPerPeople"));
        const cashIds = FrameData.CountryConf.cash_id.slice(0, 4);
        this.paymentRootNode.children.forEach((child, index) => {
            child.getComponent(PaymentItem).paymentID = cashIds[index] ?? 0;
        });
        FrameData.FRAME_CONF.CharityConf.forEach((conf, index) => {
            const item =
                this.scrollview.content.children[index] ??
                cc.instantiate(this.scrollview.content.children[0]);
            item.getComponentInChildren(RDM_CharityItem).init(conf);
            item.parent = this.scrollview.content;
        });
    }

    static getData(rdmId: number): any {
        const conf = FrameData.getCharityConf(rdmId);
        const status = FrameData.getCharityExchangeStatus(rdmId);
        let result: any = {};
        if (status == 1) {
            result = {
                now: Math.min(FrameData.saveData.credit.greenCoin, conf.rdm_1),
                total: conf.rdm_1,
                tips:
                    "skey_091??&value1==<color= #DF4704>" +
                    FrameSDK.convertCharityToStr(conf.rdm_1) +
                    "</c>",
            };
        } else if (status == 2) {
            result = {
                now: Math.min(FrameSDK.frameData.gameData.passLevel, conf.rdm_2),
                total: conf.rdm_2,
                tips:
                    "skey_053??&value1==<color= #DF4704>" +
                    conf.rdm_2 +
                    "</c>&value2==<color= #009D12>" +
                    FrameSDK.convertCharityToStr(conf.reward, true) +
                    "</c>",
            };
        }
        result.status = status;
        result.isCharity = true;
        return result;
    }

    onDestroy(): void {
        cc.director.removeAll(this);
    }

    onBtnEvent(_event: cc.Event, param: string): void {
        if (param == "0") {
            this.node.destroy();
        } else if (param == "3") {
            this.guideInedx++;
            this.openGuide();
        }
    }

    onEnable(): void {
        FrameSDK.playEffect("rdm");
    }

    onLoad(): void {
        cc.director.on("REFRESH_INFO", this.updateUI, this);
        this.updateUI();
        this.guide.active = false;
        if (FrameData.saveData.charityGuideIndex <= 1) {
            FrameData.saveData.charityGuideIndex = 2;
            this.scheduleOnce(() => {
                this.openGuide();
            });
        }
        this.scheduleOnce(() => {
            this.scrollview.node.height = this.scrollview.node.convertToWorldSpaceAR(cc.v2()).y;
        });
    }
}
