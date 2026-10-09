import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Activity extends cc.Component {

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

    static coinTarget: cc.Node = null;

    onDisable() {
        cc.director.emit("UPDATA_ACTIVITY");
        if (this.viewData.closeCB != null) {
            this.viewData.closeCB.call(this.viewData);
        }
    }

    onBtnEvent() {
        const config = FrameData.FRAME_CONF.PiggyConfig;
        const activity = FrameData.saveData.activity;
        switch (activity.state) {
            case 0:
                this.close();
                break;
            case 1:
                FrameSDK.logGameEvent("thepool_game_act", {
                    object_action: "show",
                    object_name: "pig_get",
                    object_notes: "" + ((activity.index != null ? activity.index : 0) + 1)
                }, true);
                FrameSDK.addCoin(config.num, 0, 0);
                activity.state = 2;
                this.close();
                break;
            default:
                activity.state = 0;
                activity.coin = 0;
                activity.time = FrameSDK.now + FrameData.FRAME_CONF.PiggyConfig.time;
                activity.index = (activity.index != null ? activity.index : 0) + 1;
                FrameSDK.logGameEvent("thepool_game_act", {
                    object_action: "show",
                    object_name: "pig_start",
                    object_notes: "" + ((activity.index != null ? activity.index : 0) + 1)
                }, true);
                this.updateUi();
                this.schedule(this.updateTime);
                FrameSDK.openEffect(this);
        }
    }

    static isAcitiviyClaimable() {
        const activity = FrameData.saveData.activity;
        return 1 === (activity != null ? activity.state : undefined);
    }

    static startActivity(closeCB?: any) {
        if (FrameData.saveData.activity) {
            FrameSDK.openWindow("Panel_Activity", {
                closeCB: closeCB
            });
        } else if (FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.bankLevel) {
            FrameSDK.openWindow("Panel_ActivityGuide", {
                type: 1,
                logoType: "bank",
                dtime: 2.5,
                text: 'skey_065??&value1==<color = #FF5148>1</c>&value2==<img src="dollar4"/><color = #FDFF48>' + FrameSDK.convertCoinToStr(FrameData.FRAME_CONF.PiggyConfig.num) + "</c>",
                closeCB: function () {
                    FrameSDK.openWindow("Panel_Activity", {
                        closeCB: closeCB
                    });
                }
            });
        } else if (closeCB != null) {
            closeCB();
        }
    }

    static addCoin(amount: number) {
        if (Panel_Activity.isActivityCollectable()) {
            const previous = FrameData.saveData.activity.coin;
            FrameData.saveData.activity.coin += amount;
            if (FrameData.saveData.activity.coin >= FrameData.FRAME_CONF.PiggyConfig.num) {
                FrameData.saveData.activity.coin = FrameData.FRAME_CONF.PiggyConfig.num;
                const index = FrameData.saveData.activity.index;
                FrameSDK.logGameEvent("thepool_game_act", {
                    object_action: "show",
                    object_name: "pig_full",
                    object_notes: "" + ((index != null ? index : 0) + 1)
                }, true);
                FrameData.saveData.activity.state = 1;
            } else if (FrameData.saveData.activity.coin < 0) {
                FrameData.saveData.activity.coin = 0;
            }
            cc.director.emit("UPDATA_ACTIVITY_COIN", amount, previous, FrameData.saveData.activity.coin);
        }
    }

    onEnable() {
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("page_show");
        cc.director.emit("UPDATA_ACTIVITY");
        const bonus = FrameSDK.convertCoinToStr(FrameData.FRAME_CONF.PiggyConfig.num);
        this.bonusLabel.string = bonus;
        this.state1Tips.string = 'skey_113??&value1==<img src="dollar4" offset=-5/> <size=36><color = #FDFF48>' + bonus + "</c></size>";
        this.updateUi();
    }

    onLoad() {
        this._close_target = Panel_Activity.coinTarget;
        if (!FrameData.saveData.activity) {
            FrameData.saveData.activity = {
                state: 0,
                coin: 0,
                time: FrameSDK.now + FrameData.FRAME_CONF.PiggyConfig.time,
                index: 0
            };
            FrameSDK.logGameEvent("thepool_game_act", {
                object_action: "show",
                object_name: "pig_start",
                object_notes: "1"
            }, true);
        }
        if (0 === FrameData.saveData.activity.state && FrameSDK.now < FrameData.saveData.activity.time) {
            this.schedule(this.updateTime);
        }
    }

    onTestEvent(event: cc.Event, data: string) {
        if ("0" == data) {
            FrameData.saveData.activity.time = FrameSDK.now + 1;
        } else if ("1" == data) {
            Panel_Activity.addCoin(FrameData.FRAME_CONF.PiggyConfig.num);
            this.updateUi();
        }
    }

    updateUi() {
        const config = FrameData.FRAME_CONF.PiggyConfig;
        const activity = FrameData.saveData.activity;
        const bonus = FrameSDK.convertCoinToStr(config.num);
        if (0 === activity.state) {
            if (activity.coin >= config.num) {
                FrameSDK.logGameEvent("thepool_game_act", {
                    object_action: "show",
                    object_name: "pig_full",
                    object_notes: "" + ((activity.index != null ? activity.index : 0) + 1)
                }, true);
                activity.state = 1;
            } else if (FrameSDK.now >= FrameData.saveData.activity.time) {
                FrameSDK.logGameEvent("thepool_game_act", {
                    object_action: "show",
                    object_name: "pig_fail",
                    object_notes: "" + ((activity.index != null ? activity.index : 0) + 1)
                }, true);
                activity.state = 3;
            }
        }
        this.state1.active = 0 === activity.state;
        this.state2.active = !this.state1.active;
        switch (activity.state) {
            case 0:
                this.progressSprite.fillRange = activity.coin / config.num;
                this.progressLabel.string = FrameSDK.convertCoinToStr(activity.coin) + "/" + bonus;
                this.buttonSprite.spriteFrame = this.normalButtonSpriteFrame;
                this.buttonLabel.string = "skey_061";
                break;
            case 1:
                this.state2Sprite.spriteFrame = this.claimBgSpriteFrame;
                this.state2TitleLabel.string = "skey_114";
                this.state2TipRichText.string = 'skey_115??&value1==<img src="dollar4" offset=-5/> <size=36><color= #FFF379><size=36>' + bonus + "</size></color>";
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
                this.state2TipRichText.string = 'skey_119??&value1==<img src="dollar4" offset=-5/> <size=36><color= #FFF379><size=36>' + bonus + "</size></color>";
                this.buttonSprite.spriteFrame = this.againButtonSpriteFrame;
                this.buttonLabel.string = "skey_121";
        }
    }

    static onLogin(closeCB: any) {
        if (FrameData.saveData.activity && !this.isActivityCollectable()) {
            FrameSDK.openWindow("Panel_Activity", {
                closeCB: closeCB
            });
        } else if (closeCB != null) {
            closeCB();
        }
    }

    close() {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, null);
        }
    }

    updateTime() {
        if (FrameData.saveData.activity) {
            const remain = FrameData.saveData.activity.time - FrameSDK.now;
            if (remain > 0) {
                const time = FrameSDK.formatSeconds3(remain);
                this.countdownLabel.string = time.hour + ":" + time.minute + ":" + time.second;
            } else {
                const index = FrameData.saveData.activity.index;
                FrameSDK.logGameEvent("thepool_game_act", {
                    object_action: "show",
                    object_name: "pig_fail",
                    object_notes: "" + ((index != null ? index : 0) + 1)
                }, true);
                FrameData.saveData.activity.state = 3;
                this.updateUi();
                this.unschedule(this.updateTime);
            }
        } else {
            this.unschedule(this.updateTime);
        }
    }

    static isActivityCollectable() {
        return FrameData.saveData.activity && 0 == FrameData.saveData.activity.state && FrameSDK.now < FrameData.saveData.activity.time;
    }
}
