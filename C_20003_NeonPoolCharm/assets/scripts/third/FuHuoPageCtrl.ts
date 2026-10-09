import AudioManager from "./AudioManager";
import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import FuHuoPage from "./FuHuoPage";
import { GameConfigurations } from "./GameConfigurations";
import GameHelper from "./GameHelper";
import GameServiceMgr, { AD_TYPE } from "./GameServiceMgr";
import { PoolLogger } from "./PoolLogger";
import { UiManager } from "./UiManage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/FuHuoPageCtrl")
export default class FuHuoPageCtrl extends BasePageCtrl {

    ui = null;
    _animType = null;
    _touchControl = null;
    _hasPeneLock = null;
    _hasBlack = null;
    _hasTouchLock = null;
    _exitCB = null;
    _curTouchLock = null;

    static prefabUrl = "FuHuoPage";
    static className = "FuHuoPageCtrl";

    onDisable() {
        super.onDisable();
        this._exitCB = null;
        this._curTouchLock = false;
    }

    clickClose() {
        if (this._exitCB) {
            this._exitCB(false);
        }
        this.hide();
    }

    addButtonListen() {
        UiManager.addButtonListen(this.ui.btn_get, this.clickFuHuo, this);
        UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
    }

    onEnable() {
        super.onEnable();
        cc.tween(this.ui.btn_get).to(0.5, {
            scale: 1.1
        }, {
            easing: "sineInOut"
        }).to(0.5, {
            scale: 1
        }, {
            easing: "sineInOut"
        }).union().repeatForever().start();
    }

    onLoad() {
        this.onUILoad();
        this._animType = AnimType.SCALE;
        this._touchControl = false;
        this._hasPeneLock = true;
        this._hasBlack = true;
        this._hasTouchLock = false;
        super.onLoad();
        this.addButtonListen();
    }

    _init(data) {
        PoolLogger.instance.logEvent("c_ad_event", {
            action: "exposure",
            type: "video",
            placement: "game_rev"
        });
        this._exitCB = data ? data.exitCB : null;
        this.ui.hongbao_label.getComponent(cc.Label).string = "" + GameHelper.frameSDK.convertCoinToStr(GameConfigurations.customConfig.bonusForReviving, false);
        AudioManager.getInstance().playMusic("pool_ui_fuhuo");
    }

    onUILoad() {
        this.ui = this.node.addComponent(FuHuoPage);
    }

    clickFuHuo() {
        const self = this;
        if (!this._curTouchLock) {
            this._curTouchLock = true;
            PoolLogger.instance.logEvent("c_ad_event", {
                action: "touch",
                type: "video",
                placement: "game_rev"
            });
            GameHelper.instance.showVideo("game_rev", false, function (adType) {
                PoolLogger.instance.logGameEvent("thepool_game_ad", {
                    object_action: "show",
                    object_name: "game_rev",
                    object_notes: "video" === adType ? "video" : "web" === adType ? "web" : "inter"
                });
            }, function (success) {
                GameServiceMgr.reportAd({
                    ad_type: AD_TYPE.relive,
                    success: true
                }, function () {
                    if (self._exitCB) {
                        self._exitCB(true);
                    }
                    self.hide();
                    self._curTouchLock = false;
                    if (GameHelper.pocketed) {
                        let charity = 0;
                        let charityFlag = 0;
                        if (success) {
                            charity = GameHelper.getClassByName("FrameData").getCharityOutNum();
                            charityFlag = 1;
                        }
                        const frameSDK = GameHelper.frameSDK;
                        if (frameSDK != null) {
                            frameSDK.addCoin(GameConfigurations.customConfig.bonusForReviving, charity, charityFlag);
                        }
                    }
                }, function () {
                    self._curTouchLock = false;
                });
            }, function () {
                return self._curTouchLock = false;
            }, GameHelper.pocketed ? {
                reward: GameConfigurations.customConfig.bonusForReviving,
                isMax: false
            } : undefined);
        }
    }
}
