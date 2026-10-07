import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Activity extends cc.Component {
    static coinTarget: cc.Node = null;

    @property(cc.Node)
    panel_window: cc.Node = null;

    @property(cc.Label)
    bonusLabel: cc.Label = null;

    @property(cc.Node)
    state1: cc.Node = null;

    @property(cc.Label)
    countdownLabel: cc.Label = null;

    @property(cc.Sprite)
    progressSprite: cc.Sprite = null;

    @property(cc.Label)
    progressLabel: cc.Label = null;

    @property(cc.RichText)
    state1Tips: cc.RichText = null;

    @property(cc.Node)
    state2: cc.Node = null;

    @property(cc.Sprite)
    state2Sprite: cc.Sprite = null;

    @property(cc.Label)
    state2TitleLabel: cc.Label = null;

    @property(cc.RichText)
    state2TipRichText: cc.RichText = null;

    @property(cc.Sprite)
    buttonSprite: cc.Sprite = null;

    @property(cc.Label)
    buttonLabel: cc.Label = null;

    @property(cc.SpriteFrame)
    claimBgSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    successBgSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    failedBgSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    normalButtonSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    againButtonSpriteFrame: cc.SpriteFrame = null;

    viewData: any = null;
    _close_target: cc.Node = null;
    hideTime: number = 0;

    onDisable(): void {
        cc.director.emit("UPDATA_ACTIVITY");
        this.viewData?.closeCB?.();
    }

    onBtnEvent(): void {
        const piggyConfig = FrameData.FRAME_CONF.PiggyConfig;
        const activity = FrameData.saveData.activity;
        switch (activity.state) {
            case 0:
                this.close();
                break;
            case 1:
                FrameSDK.logGameEvent("thepool_game_act", {
                    object_action: "show",
                    object_name: "pig_get",
                    object_notes: "" + ((activity.index ?? 0) + 1),
                }, true);
                FrameSDK.addCoin(piggyConfig.num, 0, 0);
                activity.state = 2;
                this.close();
                break;
            default:
                activity.state = 0;
                activity.coin = 0;
                activity.time = FrameSDK.now + FrameData.FRAME_CONF.PiggyConfig.time;
                activity.index = (activity.index ?? 0) + 1;
                FrameSDK.logGameEvent("thepool_game_act", {
                    object_action: "show",
                    object_name: "pig_start",
                    object_notes: "" + ((activity.index ?? 0) + 1),
                }, true);
                this.updateUi();
                this.schedule(this.updateTime);
                FrameSDK.openEffect(this);
        }
    }

    static isAcitiviyClaimable(): boolean {
        return FrameData.saveData.activity?.state === 1;
    }

    static startActivity(closeCB?: () => void): void {
        if (FrameData.saveData.activity) {
            FrameSDK.openWindow("Panel_Activity", { closeCB });
        } else if (FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.bankLevel) {
            FrameSDK.openWindow("Panel_ActivityGuide", {
                type: 1,
                logoType: "bank",
                dtime: 2.5,
                text: 'skey_065??&value1==<color = #FF5148>1</c>&value2==<img src="dollar4"/><color = #FDFF48>' + FrameSDK.convertCoinToStr(FrameData.FRAME_CONF.PiggyConfig.num) + "</c>",
                closeCB: () => {
                    FrameSDK.openWindow("Panel_Activity", { closeCB });
                },
            });
        } else {
            closeCB?.();
        }
    }

    static addCoin(coin: number): void {
        if (Panel_Activity.isActivityCollectable()) {
            const oldCoin = FrameData.saveData.activity.coin;
            FrameData.saveData.activity.coin += coin;
            if (FrameData.saveData.activity.coin >= FrameData.FRAME_CONF.PiggyConfig.num) {
                FrameData.saveData.activity.coin = FrameData.FRAME_CONF.PiggyConfig.num;
                FrameSDK.logGameEvent("thepool_game_act", {
                    object_action: "show",
                    object_name: "pig_full",
                    object_notes: "" + ((FrameData.saveData.activity.index ?? 0) + 1),
                }, true);
                FrameData.saveData.activity.state = 1;
            } else if (FrameData.saveData.activity.coin < 0) {
                FrameData.saveData.activity.coin = 0;
            }
            cc.director.emit("UPDATA_ACTIVITY_COIN", coin, oldCoin, FrameData.saveData.activity.coin);
        }
    }

    onEnable(): void {
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("page_show");
        cc.director.emit("UPDATA_ACTIVITY");
        const coinStr = FrameSDK.convertCoinToStr(FrameData.FRAME_CONF.PiggyConfig.num);
        this.bonusLabel.string = coinStr;
        this.state1Tips.string = 'skey_113??&value1==<img src="dollar4" offset=-5/> <size=36><color = #FDFF48>' + coinStr + "</c></size>";
        this.updateUi();
    }

    onLoad(): void {
        this._close_target = Panel_Activity.coinTarget;
        if (!FrameData.saveData.activity) {
            FrameData.saveData.activity = {
                state: 0,
                coin: 0,
                time: FrameSDK.now + FrameData.FRAME_CONF.PiggyConfig.time,
                index: 0,
            };
            FrameSDK.logGameEvent("thepool_game_act", {
                object_action: "show",
                object_name: "pig_start",
                object_notes: "1",
            }, true);
        }
        if (FrameData.saveData.activity.state === 0 && FrameSDK.now < FrameData.saveData.activity.time) {
            this.schedule(this.updateTime);
        }
    }

    onTestEvent(_event: cc.Event, customEventData: string): void {
        if (customEventData == "0") {
            FrameData.saveData.activity.time = FrameSDK.now + 1;
        } else if (customEventData == "1") {
            Panel_Activity.addCoin(FrameData.FRAME_CONF.PiggyConfig.num);
            this.updateUi();
        }
    }

    updateUi(): void {
        const piggyConfig = FrameData.FRAME_CONF.PiggyConfig;
        const activity = FrameData.saveData.activity;
        const coinStr = FrameSDK.convertCoinToStr(piggyConfig.num);
        if (activity.state === 0) {
            if (activity.coin >= piggyConfig.num) {
                FrameSDK.logGameEvent("thepool_game_act", {
                    object_action: "show",
                    object_name: "pig_full",
                    object_notes: "" + ((activity.index ?? 0) + 1),
                }, true);
                activity.state = 1;
            } else if (FrameSDK.now >= FrameData.saveData.activity.time) {
                FrameSDK.logGameEvent("thepool_game_act", {
                    object_action: "show",
                    object_name: "pig_fail",
                    object_notes: "" + ((activity.index ?? 0) + 1),
                }, true);
                activity.state = 3;
            }
        }
        this.state1.active = activity.state === 0;
        this.state2.active = !this.state1.active;
        switch (activity.state) {
            case 0:
                this.progressSprite.fillRange = activity.coin / piggyConfig.num;
                this.progressLabel.string = FrameSDK.convertCoinToStr(activity.coin) + "/" + coinStr;
                this.buttonSprite.spriteFrame = this.normalButtonSpriteFrame;
                this.buttonLabel.string = "skey_061";
                break;
            case 1:
                this.state2Sprite.spriteFrame = this.claimBgSpriteFrame;
                this.state2TitleLabel.string = "skey_114";
                this.state2TipRichText.string = 'skey_115??&value1==<img src="dollar4" offset=-5/> <size=36><color= #FFF379><size=36>' + coinStr + "</size></color>";
                this.buttonSprite.spriteFrame = this.normalButtonSpriteFrame;
                this.buttonLabel.string = "skey_035";
                break;
            case 2:
                this.state2Sprite.spriteFrame = this.successBgSpriteFrame;
                this.state2TitleLabel.string = "skey_116";
                this.state2TipRichText.string = "skey_117";
                this.buttonSprite.spriteFrame = this.againButtonSpriteFrame;
                this.buttonLabel.string = "skey_120";
                break;
            default:
                this.state2Sprite.spriteFrame = this.failedBgSpriteFrame;
                this.state2TitleLabel.string = "skey_118";
                this.state2TipRichText.string = 'skey_119??&value1==<img src="dollar4" offset=-5/> <size=36><color= #FFF379><size=36>' + coinStr + "</size></color>";
                this.buttonSprite.spriteFrame = this.againButtonSpriteFrame;
                this.buttonLabel.string = "skey_121";
        }
    }

    static onLogin(closeCB?: () => void): void {
        if (FrameData.saveData.activity && !Panel_Activity.isActivityCollectable()) {
            FrameSDK.openWindow("Panel_Activity", { closeCB });
        } else {
            closeCB?.();
        }
    }

    close(): void {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, null);
        }
    }

    updateTime(): void {
        if (FrameData.saveData.activity) {
            const remaining = FrameData.saveData.activity.time - FrameSDK.now;
            if (remaining > 0) {
                const formatted = FrameSDK.formatSeconds3(remaining);
                this.countdownLabel.string = formatted.hour + ":" + formatted.minute + ":" + formatted.second;
            } else {
                FrameSDK.logGameEvent("thepool_game_act", {
                    object_action: "show",
                    object_name: "pig_fail",
                    object_notes: "" + ((FrameData.saveData.activity.index ?? 0) + 1),
                }, true);
                FrameData.saveData.activity.state = 3;
                this.updateUi();
                this.unschedule(this.updateTime);
            }
        } else {
            this.unschedule(this.updateTime);
        }
    }

    static isActivityCollectable(): boolean {
        return FrameData.saveData.activity && FrameData.saveData.activity.state == 0 && FrameSDK.now < FrameData.saveData.activity.time;
    }
}
