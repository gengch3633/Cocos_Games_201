import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import Panel_Feedback from "./Panel_Feedback";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Frame extends cc.Component {

    @property(cc.JsonAsset)
    i18Json: cc.JsonAsset = null;

    @property(cc.Node)
    guide: cc.Node = null;

    @property(cc.Node)
    guide2: cc.Node = null;

    @property(cc.Node)
    hand: cc.Node = null;

    @property(cc.Node)
    hand2: cc.Node = null;

    @property(cc.Node)
    feedbackInHome: cc.Node = null;

    @property(cc.Node)
    feedbackInGame: cc.Node = null;

    passLevel: number = -1;
    currentRound: number = -1;

    static ins: Frame = null;
    static _i18nLoaded: boolean = false;

    onLoad() {
        const self = this;
        Frame.ins = this;
        cc.Camera.main.backgroundColor = cc.color(0, 0, 0, 0);
        FrameSDK.Panel = this.node.getChildByName("popUpNode");
        if (!Frame._i18nLoaded) {
            Frame._i18nLoaded = true;
            FrameSDK.addi18nArray(this.i18Json.json);
        }
        cc.director.on("FRESH_CREDIT", function (e) {
            if (e.change > 0) {
                FrameData.saveData.historyCredit[e.type] += e.change;
            }
        });
        setInterval(function () {
            FrameData.saveData.online_total++;
            self.sendLevelMD();
        }, 1000);
        cc.director.on(FrameSDK.frameData.ListenKeys.VIDEO_SUC, function () {
            FrameData.saveData.skipADCount = 0;
            FrameData.saveData.CashVideoCount++;
            FrameSDK.updataVideoQueueUp();
        });
        this.setGuideShow(false);
        this.setGuide2Show(false);
        FrameSDK.currLevel = FrameSDK.frameData.gameData.passLevel + 1;
        this.updateUI();
    }

    onDestroy() {
        cc.director.removeAll(this);
        Frame.ins = null;
    }

    @CLICKLOCK()
    onFeedbackBtnEvent() {
        Panel_Feedback.openPage();
    }

    start() {
        if (!FrameSDK.frameData.gameData.noProfitAd) {
            FrameSDK.frameData.sdkFuc.ppEvent("slotShow");
        }
        FrameSDK.logLiftEvent("into_game");
        FrameSDK.logLiftEvent("start_game");
        this.sendLevelMD();
        if (cc.sys.os === cc.sys.OS_ANDROID && "" == FrameData.FRAME_CONF.androidRateUrl) {
            console.error('未配置Android评星链接：FrameData.FRAME_CONF.androidRateUrl = ""');
        }
        if (cc.sys.os === cc.sys.OS_IOS && "" == FrameData.FRAME_CONF.iosRateUrl) {
            console.error('未配置iOS评星链接：FrameData.FRAME_CONF.iosRateUrl = ""');
        }
    }

    setGuideShow(show: boolean) {
        this.guide.active = this.hand.active = show;
        if (show) {
            FrameSDK.logGameEvent("thepool_game_new", {
                object_action: "show",
                object_name: "new_5"
            }, true);
        }
    }

    updateUI() {
        const profit = !FrameSDK.frameData.gameData.noProfitAd;
        const scene = FrameSDK.frameData.gameData.currentScene;
        this.feedbackInHome.active = profit && "home" === scene;
        this.feedbackInGame.active = profit && "game" === scene;
    }

    @CLICKLOCK()
    onBtnEvent(event: cc.Event, data: string) {
        if ("1" == data) {
            FrameSDK.openPanel_Yellow();
        }
    }

    sendLevelMD() {
        if (this.passLevel != FrameSDK.frameData.gameData.passLevel || this.currentRound != FrameSDK.frameData.gameData.currentRound) {
            this.passLevel = FrameSDK.frameData.gameData.passLevel;
            this.currentRound = FrameSDK.frameData.gameData.currentRound;
            cc.director.emit("UPDATA_LEVEL");
        }
    }

    setGuide2Show(show: boolean) {
        this.guide2.active = this.hand2.active = show;
        if (show) {
            cc.director.emit("UNLOCK_CHARITY");
        }
    }
}
