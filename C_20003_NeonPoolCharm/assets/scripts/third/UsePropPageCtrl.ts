import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import { ETaiQiuPropType } from "./ConfigDataMgr";
import ConfigDataSys from "./ConfigDataSys";
import { GameConfigurations } from "./GameConfigurations";
import GameHelper from "./GameHelper";
import GameServiceMgr, { AD_TYPE } from "./GameServiceMgr";
import { PoolLogger } from "./PoolLogger";
import PropDataSys from "./PropDataSys";
import { UiManager } from "./UiManage";
import UsePropPage from "./UsePropPage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/UsePropPageCtrl")
export default class UsePropPageCtrl extends BasePageCtrl {
    ui = null;
    _animType = null;
    _touchControl = null;
    _hasPeneLock = null;
    _hasBlack = null;
    _hasTouchLock = null;
    notReoprt = null;
    _curTouchLock = null;
    curPropType = 0;
    curAdType = undefined;
    _bonus = 0;

    static prefabUrl = "UsePropPage";
    static className = "UsePropPageCtrl";

    getLinePropTime() {
        const seconds = Number(ConfigDataSys.ad_configMap.get(AD_TYPE.line_prop).type_para);
        return Math.floor(seconds / 60);
    }

    _init(data) {
        if (data) {
            const propType = data.prop_type;
            this.curPropType = propType;
            this._bonus = 0;
            switch (propType) {
                case ETaiQiuPropType.E_BaiQiu:
                    PoolLogger.instance.logEvent("c_ad_event", {
                        action: "exposure",
                        type: "video",
                        placement: "item_1"
                    });
                    this.curAdType = AD_TYPE.baiqiu_prop;
                    this._bonus = GameConfigurations.customConfig.bonusForBuyingPlaceProp;
                    break;
                case ETaiQiuPropType.E_Line:
                    PoolLogger.instance.logEvent("c_ad_event", {
                        action: "exposure",
                        type: "video",
                        placement: "item_2"
                    });
                    this.curAdType = AD_TYPE.line_prop;
                    this._bonus = GameConfigurations.customConfig.bonusForBuyingAimProp;
            }
            this.updateUI();
            this.notReoprt = false;
            this._addReportData({
                prop_type: propType
            });
            this._reportEntry();
            this.notReoprt = true;
        }
    }

    clickClose() {
        this.hide();
    }

    clickGet() {
        const self = this;
        if (!this._curTouchLock) {
            this._curTouchLock = true;
            let placement = "item";
            switch (this.curPropType) {
                case ETaiQiuPropType.E_BaiQiu:
                    placement = "item_1";
                    PoolLogger.instance.logEvent("c_ad_event", {
                        action: "touch",
                        type: "video",
                        placement: placement
                    });
                    break;
                case ETaiQiuPropType.E_Line:
                    placement = "item_2";
                    PoolLogger.instance.logEvent("c_ad_event", {
                        action: "touch",
                        type: "video",
                        placement: placement
                    });
            }
            GameHelper.instance.showVideo(placement, false, function (adType) {
                switch (self.curPropType) {
                    case ETaiQiuPropType.E_BaiQiu:
                        PoolLogger.instance.logGameEvent("thepool_game_ad", {
                            object_action: "show",
                            object_name: "item_1",
                            object_notes: "video" === adType ? "video" : "web" === adType ? "web" : "inter"
                        });
                        break;
                    case ETaiQiuPropType.E_Line:
                        PoolLogger.instance.logGameEvent("thepool_game_ad", {
                            object_action: "show",
                            object_name: "item_2",
                            object_notes: "video" === adType ? "video" : "web" === adType ? "web" : "inter"
                        });
                }
            }, function (success) {
                GameServiceMgr.reportAd({
                    ad_type: self.curAdType,
                    success: true
                }, function () {
                    self.hide();
                    self._curTouchLock = false;
                    switch (self.curPropType) {
                        case ETaiQiuPropType.E_Line:
                            PropDataSys.usePropLine();
                    }
                    if (GameHelper.pocketed) {
                        let charity = 0;
                        let charityFlag = 0;
                        if (success) {
                            charity = GameHelper.getClassByName("FrameData").getCharityOutNum();
                            charityFlag = 1;
                        }
                        const frameSDK = GameHelper.frameSDK;
                        if (frameSDK != null) {
                            frameSDK.addCoin(self._bonus, charity, charityFlag);
                        }
                    }
                }, function () {
                    self._curTouchLock = false;
                });
            }, function () {
                return self._curTouchLock = false;
            }, GameHelper.pocketed ? {
                reward: this._bonus,
                isMax: false
            } : undefined);
        }
    }

    updateUI() {
        this.ui.richText.getComponent(cc.RichText).string = this.getPropDesc();
        this.ui.hongbao_label.getComponent(cc.Label).string = "" + GameHelper.frameSDK.convertCoinToStr(this._bonus, false);
        this.updateIcon();
    }

    onEnable() {
        super.onEnable();
        this._curTouchLock = false;
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

    onUILoad() {
        this.ui = this.node.addComponent(UsePropPage);
    }

    updateIcon() {
        switch (this.curPropType) {
            case ETaiQiuPropType.E_BaiQiu:
                this.ui.sp_icon_prop.active = true;
                this.ui.sp_icon_line.active = false;
                break;
            case ETaiQiuPropType.E_Line:
                this.ui.sp_icon_prop.active = false;
                this.ui.sp_icon_line.active = true;
        }
    }

    getBaiqiuPropCount() {
        return ConfigDataSys.ad_configMap.get(AD_TYPE.baiqiu_prop).type_para;
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
        this.notReoprt = true;
    }

    addButtonListen() {
        UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
        UiManager.addButtonListen(this.ui.btn_get, this.clickGet, this);
    }

    getPropDesc() {
        switch (this.curPropType) {
            case ETaiQiuPropType.E_BaiQiu:
                return "pkey_023??&value1==<color= #FFE956>" + this.getBaiqiuPropCount() + "</c>";
            case ETaiQiuPropType.E_Line:
                return "pkey_024??&value1==<color= #FFE956>80%</c>";
        }
        return "";
    }
}
