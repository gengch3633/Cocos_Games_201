import GameServiceMgr, { AD_TYPE } from "./GameServiceMgr";
import { UiManager } from "./UiManage";
import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import UsePropPage from "./UsePropPage";
import PropDataSys from "./PropDataSys";
import { GameConfigurations } from "./GameConfigurations";
import GameHelper from "./GameHelper";
import { PoolLogger } from "./PoolLogger";
import ConfigDataSys from "./ConfigDataSys";
import { ETaiQiuPropType } from "./ConfigDataMgr";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/UsePropPageCtrl")
export default class UsePropPageCtrl extends BasePageCtrl {
    ui: UsePropPage = null;
    _curTouchLock: boolean = false;
    curPropType: number = 0;
    curAdType: AD_TYPE = undefined;
    _bonus: number = 0;

    getLinePropTime(): number {
        const e = Number(ConfigDataSys.ad_configMap.get(AD_TYPE.line_prop).type_para);
        return Math.floor(e / 60);
    }

    _init(e?: { prop_type: number }): void {
        if (e) {
            const t = e.prop_type;
            this.curPropType = t;
            this._bonus = 0;
            switch (t) {
                case ETaiQiuPropType.E_BaiQiu:
                    PoolLogger.instance.logEvent("c_ad_event", {
                        action: "exposure",
                        type: "video",
                        placement: "item_1",
                    });
                    this.curAdType = AD_TYPE.baiqiu_prop;
                    this._bonus = GameConfigurations.customConfig.bonusForBuyingPlaceProp;
                    break;
                case ETaiQiuPropType.E_Line:
                    PoolLogger.instance.logEvent("c_ad_event", {
                        action: "exposure",
                        type: "video",
                        placement: "item_2",
                    });
                    this.curAdType = AD_TYPE.line_prop;
                    this._bonus = GameConfigurations.customConfig.bonusForBuyingAimProp;
                    break;
            }
            this.updateUI();
            this.notReoprt = false;
            this._addReportData({ prop_type: t });
            this._reportEntry();
            this.notReoprt = true;
        }
    }

    clickClose(): void {
        this.hide();
    }

    clickGet(): void {
        if (!this._curTouchLock) {
            this._curTouchLock = true;
            let t = "item";
            switch (this.curPropType) {
                case ETaiQiuPropType.E_BaiQiu:
                    t = "item_1";
                    PoolLogger.instance.logEvent("c_ad_event", {
                        action: "touch",
                        type: "video",
                        placement: t,
                    });
                    break;
                case ETaiQiuPropType.E_Line:
                    t = "item_2";
                    PoolLogger.instance.logEvent("c_ad_event", {
                        action: "touch",
                        type: "video",
                        placement: t,
                    });
                    break;
            }
            GameHelper.instance.showVideo(
                t,
                false,
                (adType: string) => {
                    switch (this.curPropType) {
                        case ETaiQiuPropType.E_BaiQiu:
                            PoolLogger.instance.logGameEvent("thepool_game_ad", {
                                object_action: "show",
                                object_name: "item_1",
                                object_notes: adType === "video" ? "video" : adType === "web" ? "web" : "inter",
                            });
                            break;
                        case ETaiQiuPropType.E_Line:
                            PoolLogger.instance.logGameEvent("thepool_game_ad", {
                                object_action: "show",
                                object_name: "item_2",
                                object_notes: adType === "video" ? "video" : adType === "web" ? "web" : "inter",
                            });
                            break;
                    }
                },
                (rewardResult: any) => {
                    GameServiceMgr.reportAd(
                        { ad_type: this.curAdType, success: true },
                        () => {
                            this.hide();
                            this._curTouchLock = false;
                            switch (this.curPropType) {
                                case ETaiQiuPropType.E_Line:
                                    PropDataSys.usePropLine();
                                    break;
                            }
                            if (GameHelper.pocketed) {
                                let n = 0;
                                let i = 0;
                                if (rewardResult) {
                                    n = GameHelper.getClassByName("FrameData").getCharityOutNum();
                                    i = 1;
                                }
                                GameHelper.frameSDK?.addCoin(this._bonus, n, i);
                            }
                        },
                        () => {
                            this._curTouchLock = false;
                        }
                    );
                },
                () => {
                    this._curTouchLock = false;
                },
                GameHelper.pocketed
                    ? {
                          reward: this._bonus,
                          isMax: false,
                      }
                    : undefined
            );
        }
    }

    updateUI(): void {
        this.ui.richText.getComponent(cc.RichText).string = this.getPropDesc();
        this.ui.hongbao_label.getComponent(cc.Label).string =
            "" + GameHelper.frameSDK.convertCoinToStr(this._bonus, false);
        this.updateIcon();
    }

    onEnable(): void {
        super.onEnable();
        this._curTouchLock = false;
        cc.tween(this.ui.btn_get)
            .to(0.5, { scale: 1.1 }, { easing: "sineInOut" })
            .to(0.5, { scale: 1 }, { easing: "sineInOut" })
            .union()
            .repeatForever()
            .start();
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(UsePropPage);
    }

    updateIcon(): void {
        switch (this.curPropType) {
            case ETaiQiuPropType.E_BaiQiu:
                this.ui.sp_icon_prop.active = true;
                this.ui.sp_icon_line.active = false;
                break;
            case ETaiQiuPropType.E_Line:
                this.ui.sp_icon_prop.active = false;
                this.ui.sp_icon_line.active = true;
                break;
        }
    }

    getBaiqiuPropCount(): number {
        return ConfigDataSys.ad_configMap.get(AD_TYPE.baiqiu_prop).type_para;
    }

    onLoad(): void {
        this.onUILoad();
        this._animType = AnimType.SCALE;
        this._touchControl = false;
        this._hasPeneLock = true;
        this._hasBlack = true;
        this._hasTouchLock = false;
        super.onLoad();
        this.addButtonListen();
        this.notReoprt = true;
    }

    addButtonListen(): void {
        UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
        UiManager.addButtonListen(this.ui.btn_get, this.clickGet, this);
    }

    getPropDesc(): string {
        switch (this.curPropType) {
            case ETaiQiuPropType.E_BaiQiu:
                return "pkey_023??&value1==<color= #FFE956>" + this.getBaiqiuPropCount() + "</c>";
            case ETaiQiuPropType.E_Line:
                return "pkey_024??&value1==<color= #FFE956>80%</c>";
        }
        return "";
    }

    static prefabUrl = "UsePropPage";
    static className = "UsePropPageCtrl";
}
