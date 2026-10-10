import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import PaymentItem from "./PaymentItem";
import RDM_LevelItem from "./RDM_LevelItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RDM_Level extends cc.Component {

    @property(cc.Node)
    top: cc.Node = null;

    @property(cc.RichText)
    rtx_turnInfo: cc.RichText = null;

    @property(cc.Label)
    lbl_gCoin: cc.Label = null;

    @property(cc.Node)
    paymentRootNode: cc.Node = null;

    @property(cc.RichText)
    rtx_tips: cc.RichText = null;

    @property(cc.Node)
    guide: cc.Node = null;

    @property(cc.ScrollView)
    scrollview: cc.ScrollView = null;

    coin: string = "0";
    guideInedx: number = 0;
    _newbieWithdrawGuide = false;
    _newbieGuideFinished = false;

    openGuide() {
        this.guide.active = true;
        this.guide.children.forEach(function (e) {
            e.active = false;
        });
        let e = cc.find("mask", this.guide).getComponent(cc.Mask);
        e.node.active = true;
        if (0 == this.guideInedx) {
            FrameSDK.logGameEvent("thepool_game_new", {
                object_action: "show",
                object_name: "new_6"
            }, true);
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
            FrameSDK.logGameEvent("thepool_game_new", {
                object_action: "show",
                object_name: "new_7"
            }, true);
            cc.find("tips2", this.guide).active = true;
            e.spriteFrame = FrameSDK.getNodeTexture(cc.find("panel_window/scrollview/view/content/item", this.node));
            cc.tween(cc.find("tips2/hand", this.guide)).by(.5, {
                x: 50,
                y: -50
            }).by(.5, {
                x: -50,
                y: 50
            }).union().repeatForever().start();
        } else if (2 == this.guideInedx) {
            cc.find("tips3", this.guide).active = true;
            let t = RDM_Level.getData(FrameData.FRAME_CONF.CoinConf[0].rdm_id);
            cc.find("tips3/label", this.guide).getComponent(cc.Label).string = "skey_040??&value1==" + (t.total - t.now);
            cc.tween(cc.find("tips3/hand", this.guide)).by(.5, {
                x: 50,
                y: -50
            }).by(.5, {
                x: -50,
                y: 50
            }).union().repeatForever().start();
            e.spriteFrame = FrameSDK.getNodeTexture(cc.find("panel_window/top/btn_close", this.node));
        } else if (3 == this.guideInedx) {
            FrameSDK.logGameEvent("thepool_game_new", {
                object_action: "show",
                object_name: "new_8"
            }, true);
            this.node.destroy();
            this._finishNewbieGuide();
        }
    }

    _finishNewbieGuide() {
        if (!this._newbieWithdrawGuide || this._newbieGuideFinished) {
            return;
        }
        this._newbieGuideFinished = true;
        cc.director.emit("NEW_HAND_FINISH");
    }

    onLoad() {
        let e = this;
        this.showTurnList();
        cc.director.on("REFRESH_INFO", this.updateUI, this);
        this.updateUI();
        this.guide.active = false;
        if (FrameData.saveData.guideInedx <= 1) {
            this._newbieWithdrawGuide = true;
            FrameData.saveData.guideInedx = 2;
            this.scheduleOnce(function () {
                e.openGuide();
            });
        }
        this.scheduleOnce(function () {
            e.scrollview.node.height = e.scrollview.node.convertToWorldSpaceAR(cc.v2()).y;
        });
        let t = FrameData.CountryConf.cash_id.slice(0, 4);
        this.paymentRootNode.children.forEach(function (node, a) {
            let o = t[a];
            node.getComponent(PaymentItem).paymentID = null !== o && undefined !== o ? o : 0;
        });
    }

    static getTurnInfo() {
        let e = JSON.parse(JSON.stringify(FrameData.FRAME_CONF.CoinConf)).sort(function () {
            return Math.random() - .5;
        })[0];
        return {
            level: e.rdm_1,
            coinCout: FrameData.getTargetCoint(e.rdm_id, FrameSDK.randomInt(2e4, 5e4))
        };
    }

    updateUI() {
        let e = this;
        this.coin = FrameSDK.convertCoinToStr(FrameData.credit, true);
        this.lbl_gCoin.string = this.coin;
        let t = FrameData.FRAME_CONF.RedeemRateConfig[0];
        this.rtx_tips.string = 'skey_094??&value1==<img src="dollar4" offset=-3/> <color= #8AFF77>' + FrameSDK.convertCoinToStr(t) + "</c>&value2==<color= #8AFF77>" + FrameSDK.convertCoinToStr(t, true) + "</c>";
        FrameData.FRAME_CONF.CoinConf.forEach(function (conf, a) {
            let o = e.scrollview.content.children[a] || cc.instantiate(e.scrollview.content.children[0]);
            o.getComponentInChildren(RDM_LevelItem).init(conf);
            o.parent = e.scrollview.content;
        });
        FrameData.saveData.account;
    }

    onEnable() {
        FrameSDK.playEffect("rdm");
    }

    onDestroy() {
        cc.director.removeAll(this);
    }

    onBtnEvent(e, t) {
        if ("0" == t) {
            if (this._newbieWithdrawGuide && this.guideInedx >= 2) {
                this._finishNewbieGuide();
            }
            this.node.destroy();
        } else if ("3" == t) {
            this.guideInedx++;
            this.openGuide();
        }
    }

    showTurnList() {
        let e = this;
        this.rtx_turnInfo.node.stopAllActions();
        let t = RDM_Level.getTurnInfo();
        let o = FrameSDK.getRandomInviteCode();
        this.rtx_turnInfo.string = "skey_001??&value1==" + o + "</c>&value2==" + t.level + "&value3==<color = #FFF882>" + FrameSDK.convertCoinToStr(t.coinCout, true) + "</c>";
        cc.tween(this.rtx_turnInfo.node).delay(.1).set({
            y: -(.5 * this.rtx_turnInfo.node.parent.height + .5 * this.rtx_turnInfo.node.height)
        }).to(1, {
            y: 0
        }).delay(1).to(1, {
            y: .5 * this.rtx_turnInfo.node.parent.height + .5 * this.rtx_turnInfo.node.height
        }).call(function () {
            e.showTurnList();
        }).start();
    }

    static getData(e) {
        let t = FrameData.getCoinConf(e);
        let a = FrameData.getExchangeStatus(e);
        let o: any = {};
        if (1 == a) {
            o = {
                now: Math.min(FrameSDK.frameData.gameData.passLevel, t.rdm_1),
                total: t.rdm_1,
                tips: "skey_049??&value1==<color= #DF4704>" + t.rdm_1 + "</c>"
            };
        } else if (2 == a) {
            let n = FrameData.saveData.CoinStep[e];
            o = {
                now: Math.min(FrameData.saveData.credit.yellowCoin, n.targetCoin),
                total: n.targetCoin,
                tips: "skey_050??&value1==<color= #009D12>" + FrameSDK.convertCoinToStr(n.targetCoin, true) + "</c>"
            };
        } else if (3 == a) {
            let n = FrameData.saveData.CoinStep[e];
            o = {
                now: Math.min(FrameSDK.frameData.gameData.passLevel, t.rdm_3),
                total: t.rdm_3,
                tips: "skey_053??&value1==<color= #DF4704>" + t.rdm_3 + "</c>&value2==<color= #009D12>" + FrameSDK.convertCoinToStr(n.targetCoin, true) + "</c>"
            };
        }
        o.status = a;
        return o;
    }
}
