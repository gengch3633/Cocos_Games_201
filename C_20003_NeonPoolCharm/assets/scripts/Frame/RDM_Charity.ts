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

    openGuide() {
        this.guide.active = true;
        this.guide.children.forEach(function (e) {
            e.active = false;
        });
        let e = cc.find("mask", this.guide).getComponent(cc.Mask);
        e.node.active = true;
        if (0 == this.guideInedx) {
            cc.find("tips1", this.guide).active = true;
            e.spriteFrame = FrameSDK.getNodeTexture(cc.find("panel_window/node_list2", this.node));
            cc.tween(cc.find("tips1/hand", this.guide)).by(.5, {
                x: 50,
                y: -50
            }).by(.5, {
                x: -50,
                y: 50
            }).union().repeatForever().start();
        } else if (1 == this.guideInedx) {
            cc.find("tips2", this.guide).active = true;
            let t = RDM_Charity.getData(FrameData.FRAME_CONF.CoinConf[0].rdm_id);
            e.spriteFrame = FrameSDK.getNodeTexture(cc.find("panel_window/scrollview/view/content/item", this.node));
            cc.find("tips2/label", this.guide).getComponent(cc.Label).string = "skey_109??&value1==" + t.total;
            cc.tween(cc.find("tips2/hand", this.guide)).by(.5, {
                x: 50,
                y: -50
            }).by(.5, {
                x: -50,
                y: 50
            }).union().repeatForever().start();
        } else if (2 == this.guideInedx) {
            cc.find("tips3", this.guide).active = true;
            let t = RDM_Charity.getData(FrameData.FRAME_CONF.CoinConf[0].rdm_id);
            cc.find("tips3/label", this.guide).getComponent(cc.Label).string = "skey_110??&value1==" + t.total;
            cc.tween(cc.find("tips3/hand", this.guide)).by(.5, {
                x: 50,
                y: -50
            }).by(.5, {
                x: -50,
                y: 50
            }).union().repeatForever().start();
            e.spriteFrame = FrameSDK.getNodeTexture(cc.find("panel_window/top/btn_close", this.node));
        } else if (3 == this.guideInedx) {
            this.node.destroy();
            cc.director.emit("CHARITY_GUIDE_FINISH");
        }
    }

    updateUI() {
        this.coin = FrameSDK.convertCharityToStr(FrameData.charityCredit);
        this.lbl_gCoin.string = this.coin;
        this.timeLabel.string = "skey_089??&value1==" + FrameData.saveData.charityDonateTime;
        this.numberLabel.string = "" + FrameSDK.formatNumber(FrameData.saveData.charityDonated, 0, 1);
        this.peopleLabel.string = "skey_090??&value1==" + Math.floor(FrameData.saveData.charityDonated / FrameData.getCoinOutNum("charityPerPeople"));
        let t = FrameData.CountryConf.cash_id.slice(0, 4);
        this.paymentRootNode.children.forEach(function (e, a) {
            let o = t[a];
            e.getComponent(PaymentItem).paymentID = null !== o && undefined !== o ? o : 0;
        });
        let self = this;
        FrameData.FRAME_CONF.CharityConf.forEach(function (conf, a) {
            let o = self.scrollview.content.children[a];
            let n = null !== o && undefined !== o ? o : cc.instantiate(self.scrollview.content.children[0]);
            n.getComponentInChildren(RDM_CharityItem).init(conf);
            n.parent = self.scrollview.content;
        });
    }

    static getData(e) {
        let t = FrameData.getCharityConf(e);
        let a = FrameData.getCharityExchangeStatus(e);
        let o: any = {};
        if (1 == a) {
            o = {
                now: Math.min(FrameData.saveData.credit.greenCoin, t.rdm_1),
                total: t.rdm_1,
                tips: "skey_091??&value1==<color= #DF4704>" + FrameSDK.convertCharityToStr(t.rdm_1) + "</c>"
            };
        } else if (2 == a) {
            o = {
                now: Math.min(FrameSDK.frameData.gameData.passLevel, t.rdm_2),
                total: t.rdm_2,
                tips: "skey_053??&value1==<color= #DF4704>" + t.rdm_2 + "</c>&value2==<color= #009D12>" + FrameSDK.convertCharityToStr(t.reward, true) + "</c>"
            };
        }
        o.status = a;
        o.isCharity = true;
        return o;
    }

    onDestroy() {
        cc.director.removeAll(this);
    }

    onBtnEvent(e, t) {
        if ("0" == t) {
            this.node.destroy();
        } else if ("3" == t) {
            this.guideInedx++;
            this.openGuide();
        }
    }

    onEnable() {
        FrameSDK.playEffect("rdm");
    }

    onLoad() {
        let e = this;
        cc.director.on("REFRESH_INFO", this.updateUI, this);
        this.updateUI();
        this.guide.active = false;
        if (FrameData.saveData.charityGuideIndex <= 1) {
            FrameData.saveData.charityGuideIndex = 2;
            this.scheduleOnce(function () {
                e.openGuide();
            });
        }
        this.scheduleOnce(function () {
            e.scrollview.node.height = e.scrollview.node.convertToWorldSpaceAR(cc.v2()).y;
        });
    }
}
