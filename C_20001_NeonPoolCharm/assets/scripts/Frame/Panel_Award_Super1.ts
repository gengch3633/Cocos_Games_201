import AinanEff from "./AinanEff";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Award_Super1 extends cc.Component {
    @property(sp.Skeleton)
    titleSkeleton1: sp.Skeleton = null;

    @property(cc.Label)
    bonusLabel1: cc.Label = null;

    @property(cc.Node)
    adActionButton1: cc.Node = null;

    @property(cc.Node)
    noAdIcon: cc.Node = null;

    @property(cc.Node)
    adIcon1: cc.Node = null;

    @property(cc.Node)
    commonActionButton1: cc.Node = null;

    viewData: any = null;
    isTouch: boolean = true;
    hideTime: number = 0;

    onEnable(): void {
        FrameSDK.openEffect(this, { opacity: 240 });
        FrameSDK.playEffect("rewardshow");
        FrameSDK.frameData.sdkFuc.ppEvent("popupShow");
        FrameSDK.logCommonEvent("c_ad_event", { action: "exposure", type: "video", placement: "reward_sup" });
        FrameSDK.logGameEvent("thepool_game_rew", { object_action: "show", object_name: "sup_show" });
        this.titleSkeleton1.setAnimation(0, "start", false);
        this.titleSkeleton1.addAnimation(0, "loop", true);
        const bonusStr = FrameSDK.convertCoinToStr(this.viewData.bonus);
        const freeBonusStr = FrameSDK.convertCoinToStr(this.viewData.freeBonus);
        const showAd = !FrameSDK.frameData.gameData.noProfitAd;
        this.bonusLabel1.string = "" + bonusStr;
        this.noAdIcon.active = !showAd;
        this.adIcon1.active = showAd;
        this.commonActionButton1.active = showAd;
        this.commonActionButton1.getComponentInChildren(cc.Label).string = "skey_034 " + freeBonusStr;
    }

    onBtnEvent(): void {
        if (!this.isTouch) return;
        this.isTouch = false;
        const isFree = !this.adIcon1.active;
        FrameSDK.frameData.sdkFuc.ppEvent(isFree ? "freeClaim" : "claim");
        FrameSDK.logCommonEvent("c_ad_event", { action: "touch", type: "video", placement: "reward_sup" });
        FrameSDK.logGameEvent("thepool_game_rew", { object_action: "show", object_name: "sup_ad" });
        const onComplete = (withCharity: boolean) => {
            let charityNum = 0;
            let charityFlag = 0;
            if (!isFree && withCharity) {
                charityNum = FrameData.getCharityOutNum();
                charityFlag = 1;
            }
            FrameSDK.frameData.sdkFuc.ppEvent(isFree ? "freeCollected" : "collected");
            FrameSDK.addCoin(this.viewData.bonus, charityNum, charityFlag, this.viewData.closeCB);
            this.onTouchCloseTips();
        };
        if (isFree) {
            onComplete(false);
        } else {
            FrameSDK.openVideo(
                "reward_sup",
                false,
                (adType) => {
                    FrameSDK.logGameEvent("thepool_game_ad", {
                        object_action: "show",
                        object_name: "reward_sup",
                        object_notes: adType === "video" ? "video" : adType === "web" ? "web" : "inter",
                    });
                },
                (withCharity) => onComplete(withCharity),
                () => {
                    this.isTouch = true;
                },
                { reward: this.viewData.bonus, isMax: false }
            );
        }
    }

    onTouchCloseTips(): void {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, null);
        }
    }

    onLoad(): void {
        this.adActionButton1.on(cc.Node.EventType.TOUCH_END, this.onBtnEvent, this);
        this.commonActionButton1.on(cc.Node.EventType.TOUCH_END, this.click_Common, this);
        const delay = FrameSDK.getNoAdDelayTime();
        if (delay != null && delay >= 0) {
            this.commonActionButton1.getComponent(AinanEff).dtime += delay;
        }
    }

    click_Common(): void {
        if (!this.isTouch) return;
        this.isTouch = false;
        FrameSDK.logGameEvent("thepool_game_rew", { object_action: "show", object_name: "sup_free" });
        FrameSDK.frameData.sdkFuc.ppEvent("freeClaim");
        const charityNum = 0;
        const charityFlag = 0;
        FrameSDK.addCoin(this.viewData.freeBonus, charityNum, charityFlag, this.viewData.closeCB);
        FrameSDK.frameData.sdkFuc.ppEvent("freeCollected");
        this.onTouchCloseTips();
    }
}
