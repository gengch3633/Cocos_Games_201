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

    openGuide(): void {
        this.guide.active = true;
        this.guide.children.forEach((child) => {
            child.active = false;
        });
        const mask = cc.find("mask", this.guide).getComponent(cc.Mask);
        mask.node.active = true;
        if (this.guideInedx == 0) {
            FrameSDK.logGameEvent(
                "thepool_game_new",
                { object_action: "show", object_name: "new_6" },
                true
            );
            cc.find("tips1", this.guide).active = true;
            mask.spriteFrame = FrameSDK.getNodeTexture(cc.find("panel_window/node_list2", this.node));
            cc.tween(cc.find("tips1/hand", this.guide))
                .by(0.5, { x: 50, y: -50 })
                .by(0.5, { x: -50, y: 50 })
                .union()
                .repeatForever()
                .start();
        } else if (this.guideInedx == 1) {
            FrameSDK.logGameEvent(
                "thepool_game_new",
                { object_action: "show", object_name: "new_7" },
                true
            );
            cc.find("tips2", this.guide).active = true;
            mask.spriteFrame = FrameSDK.getNodeTexture(
                cc.find("panel_window/scrollview/view/content/item", this.node)
            );
            cc.tween(cc.find("tips2/hand", this.guide))
                .by(0.5, { x: 50, y: -50 })
                .by(0.5, { x: -50, y: 50 })
                .union()
                .repeatForever()
                .start();
        } else if (this.guideInedx == 2) {
            cc.find("tips3", this.guide).active = true;
            const data = RDM_Level.getData(FrameData.FRAME_CONF.CoinConf[0].rdm_id);
            cc.find("tips3/label", this.guide).getComponent(cc.Label).string =
                "skey_040??&value1==" + (data.total - data.now);
            cc.tween(cc.find("tips3/hand", this.guide))
                .by(0.5, { x: 50, y: -50 })
                .by(0.5, { x: -50, y: 50 })
                .union()
                .repeatForever()
                .start();
            mask.spriteFrame = FrameSDK.getNodeTexture(cc.find("panel_window/top/btn_close", this.node));
        } else if (this.guideInedx == 3) {
            FrameSDK.logGameEvent(
                "thepool_game_new",
                { object_action: "show", object_name: "new_8" },
                true
            );
            this.node.destroy();
            cc.director.emit("NEW_HAND_FINISH");
        }
    }

    onLoad(): void {
        this.showTurnList();
        cc.director.on("REFRESH_INFO", this.updateUI, this);
        this.updateUI();
        this.guide.active = false;
        if (FrameData.saveData.guideInedx <= 1) {
            FrameData.saveData.guideInedx = 2;
            this.scheduleOnce(() => {
                this.openGuide();
            });
        }
        this.scheduleOnce(() => {
            this.scrollview.node.height = this.scrollview.node.convertToWorldSpaceAR(cc.v2()).y;
        });
        const cashIds = FrameData.CountryConf.cash_id.slice(0, 4);
        this.paymentRootNode.children.forEach((child, index) => {
            child.getComponent(PaymentItem).paymentID = cashIds[index] ?? 0;
        });
    }

    static getTurnInfo(): { level: number; coinCout: number } {
        const conf = JSON.parse(JSON.stringify(FrameData.FRAME_CONF.CoinConf)).sort(
            () => Math.random() - 0.5
        )[0];
        return {
            level: conf.rdm_1,
            coinCout: FrameData.getTargetCoint(conf.rdm_id, FrameSDK.randomInt(20000, 50000)),
        };
    }

    updateUI(): void {
        this.coin = FrameSDK.convertCoinToStr(FrameData.credit, true);
        this.lbl_gCoin.string = this.coin;
        const rate = FrameData.FRAME_CONF.RedeemRateConfig[0];
        this.rtx_tips.string =
            'skey_094??&value1==<img src="dollar4" offset=-3/> <color= #8AFF77>' +
            FrameSDK.convertCoinToStr(rate) +
            "</c>&value2==<color= #8AFF77>" +
            FrameSDK.convertCoinToStr(rate, true) +
            "</c>";
        FrameData.FRAME_CONF.CoinConf.forEach((conf: any, index: number) => {
            const item =
                this.scrollview.content.children[index] ??
                cc.instantiate(this.scrollview.content.children[0]);
            item.getComponentInChildren(RDM_LevelItem).init(conf);
            item.parent = this.scrollview.content;
        });
        FrameData.saveData.account;
    }

    onEnable(): void {
        FrameSDK.playEffect("rdm");
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

    showTurnList(): void {
        this.rtx_turnInfo.node.stopAllActions();
        const info = RDM_Level.getTurnInfo();
        const code = FrameSDK.getRandomInviteCode();
        this.rtx_turnInfo.string =
            "skey_001??&value1==" +
            code +
            "</c>&value2==" +
            info.level +
            "&value3==<color = #FFF882>" +
            FrameSDK.convertCoinToStr(info.coinCout, true) +
            "</c>";
        cc.tween(this.rtx_turnInfo.node)
            .delay(0.1)
            .set({
                y: -(0.5 * this.rtx_turnInfo.node.parent.height + 0.5 * this.rtx_turnInfo.node.height),
            })
            .to(1, { y: 0 })
            .delay(1)
            .to(1, {
                y: 0.5 * this.rtx_turnInfo.node.parent.height + 0.5 * this.rtx_turnInfo.node.height,
            })
            .call(() => {
                this.showTurnList();
            })
            .start();
    }

    static getData(rdmId: number): any {
        const conf = FrameData.getCoinConf(rdmId);
        const status = FrameData.getExchangeStatus(rdmId);
        let result: any = {};
        if (status == 1) {
            result = {
                now: Math.min(FrameSDK.frameData.gameData.passLevel, conf.rdm_1),
                total: conf.rdm_1,
                tips: "skey_049??&value1==<color= #DF4704>" + conf.rdm_1 + "</c>",
            };
        } else if (status == 2) {
            const step = FrameData.saveData.CoinStep[rdmId];
            result = {
                now: Math.min(FrameData.saveData.credit.yellowCoin, step.targetCoin),
                total: step.targetCoin,
                tips:
                    "skey_050??&value1==<color= #009D12>" +
                    FrameSDK.convertCoinToStr(step.targetCoin, true) +
                    "</c>",
            };
        } else if (status == 3) {
            const step = FrameData.saveData.CoinStep[rdmId];
            result = {
                now: Math.min(FrameSDK.frameData.gameData.passLevel, conf.rdm_3),
                total: conf.rdm_3,
                tips:
                    "skey_053??&value1==<color= #DF4704>" +
                    conf.rdm_3 +
                    "</c>&value2==<color= #009D12>" +
                    FrameSDK.convertCoinToStr(step.targetCoin, true) +
                    "</c>",
            };
        }
        result.status = status;
        return result;
    }
}
