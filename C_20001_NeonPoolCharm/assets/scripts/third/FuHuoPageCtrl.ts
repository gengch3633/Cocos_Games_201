import { GameConfigurations } from "./GameConfigurations";
import GameHelper from "./GameHelper";
import { PoolLogger } from "./PoolLogger";
import AudioManager from "./AudioManager";
import GameServiceMgr, { AD_TYPE } from "./GameServiceMgr";
import { UiManager } from "./UiManage";
import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import FuHuoPage from "./FuHuoPage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/FuHuoPageCtrl")
export default class FuHuoPageCtrl extends BasePageCtrl {
    ui: FuHuoPage = null;
    _exitCB: ((success?: boolean) => void) = null;
    _curTouchLock: boolean = false;

    onDisable(): void {
        super.onDisable();
        this._exitCB = null;
        this._curTouchLock = false;
    }

    clickClose(): void {
        if (this._exitCB) {
            this._exitCB(false);
        }
        this.hide();
    }

    addButtonListen(): void {
        UiManager.addButtonListen(this.ui.btn_get, this.clickFuHuo, this);
        UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
    }

    onEnable(): void {
        super.onEnable();
        cc.tween(this.ui.btn_get)
            .to(0.5, { scale: 1.1 }, { easing: "sineInOut" })
            .to(0.5, { scale: 1 }, { easing: "sineInOut" })
            .union()
            .repeatForever()
            .start();
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
    }

    _init(e?: { exitCB?: (success?: boolean) => void }): void {
        PoolLogger.instance.logEvent("c_ad_event", {
            action: "exposure",
            type: "video",
            placement: "game_rev",
        });
        this._exitCB = e ? e.exitCB : null;
        this.ui.hongbao_label.getComponent(cc.Label).string =
            "" + GameHelper.frameSDK.convertCoinToStr(GameConfigurations.customConfig.bonusForReviving, false);
        AudioManager.getInstance().playMusic("pool_ui_fuhuo");
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(FuHuoPage);
    }

    clickFuHuo(): void {
        if (!this._curTouchLock) {
            this._curTouchLock = true;
            PoolLogger.instance.logEvent("c_ad_event", {
                action: "touch",
                type: "video",
                placement: "game_rev",
            });
            GameHelper.instance.showVideo(
                "game_rev",
                false,
                (adType: string) => {
                    PoolLogger.instance.logGameEvent("thepool_game_ad", {
                        object_action: "show",
                        object_name: "game_rev",
                        object_notes: adType === "video" ? "video" : adType === "web" ? "web" : "inter",
                    });
                },
                (t: any) => {
                    GameServiceMgr.reportAd(
                        { ad_type: AD_TYPE.relive, success: true },
                        () => {
                            if (this._exitCB) {
                                this._exitCB(true);
                            }
                            this.hide();
                            this._curTouchLock = false;
                            if (GameHelper.pocketed) {
                                let n = 0;
                                let i = 0;
                                if (t) {
                                    n = GameHelper.getClassByName("FrameData").getCharityOutNum();
                                    i = 1;
                                }
                                GameHelper.frameSDK?.addCoin(GameConfigurations.customConfig.bonusForReviving, n, i);
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
                          reward: GameConfigurations.customConfig.bonusForReviving,
                          isMax: false,
                      }
                    : undefined
            );
        }
    }

    static prefabUrl = "FuHuoPage";
    static className = "FuHuoPageCtrl";
}
