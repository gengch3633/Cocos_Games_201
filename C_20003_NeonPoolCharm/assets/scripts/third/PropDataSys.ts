import AudioManager from "./AudioManager";
import { ETaiQiuPropType } from "./ConfigDataMgr";
import ConfigDataSys from "./ConfigDataSys";
import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import { GameConfigurations } from "./GameConfigurations";
import GameEventType from "./GameEventType";
import GameServiceMgr, { AD_TYPE } from "./GameServiceMgr";
import PlayerDataSys from "./PlayerDataSys";
import TimeUtils from "./TimeUtils";

class PropDataSys {
    _isLinePropStart = null;
    _isBaiQiuPropInUse = null;

    static _instance = null;

    get isBaiQiuPropInUse() {
        return this._isBaiQiuPropInUse;
    }

    get linePropTimer() {
        return Number(EngineUtil.localStorageGetItem("prop_line_time", "0"));
    }

    get isLinePropInfinite() {
        return PlayerDataSys.level_pass < GameConfigurations.customConfig.maxLevelForFreeAimProp;
    }

    get isLinePropUseable() {
        return !this.isLinePropInfinite && this.linePropTimer <= TimeUtils.getTimeinSeconds();
    }

    get isLinePropUsed() {
        return this.isLinePropInfinite || this.linePropTimer > TimeUtils.getTimeinSeconds();
    }

    usePropBaiQiu(e) {
        if (!this._isBaiQiuPropInUse) {
            AudioManager.getInstance().playMusic("pool_ui_useitem");
            this._isBaiQiuPropInUse = true;
            EventMgr.trigger(GameEventType.ON_PROP_USED_STATE_CHANGED, {
                prop_type: ETaiQiuPropType.E_BaiQiu,
                state: 1,
                isUsedProp: e
            });
        }
    }

    timeInterval() {
        if (this._isLinePropStart && this.linePropTimer <= TimeUtils.getTimeinSeconds()) {
            this._isLinePropStart = false;
            EventMgr.trigger(GameEventType.ON_LINE_PROP_USED_STATE_CHANGED, false);
        }
    }

    init() {
        this._isLinePropStart = this.isLinePropUseable;
        setInterval(this.timeInterval.bind(this), 500);
    }

    propUsedComplete(e) {
        switch (e) {
            case ETaiQiuPropType.E_BaiQiu:
                this._isBaiQiuPropInUse = false;
                EventMgr.trigger(GameEventType.ON_PROP_USED_STATE_CHANGED, {
                    prop_type: ETaiQiuPropType.E_BaiQiu,
                    state: 0
                });
        }
    }

    usePropLine() {
        if (this.linePropTimer > TimeUtils.getTimeinSeconds()) console.error("PropDataSys.usePropLine : 道具使用中");else {
            var e = Number(ConfigDataSys.ad_configMap.get(AD_TYPE.line_prop).type_para),
                t = TimeUtils.getTimeinSeconds() + e;
            EngineUtil.localStorageSetItem("prop_line_time", String(t));
            this._isLinePropStart = true;
            AudioManager.getInstance().playMusic("pool_ui_useitem");
            EventMgr.trigger(GameEventType.ON_LINE_PROP_USED_STATE_CHANGED, true);
        }
    }

    getPropCount(e) {
        var t = PlayerDataSys.prop_info[e];
        return null !== t && undefined !== t ? t : 0;
    }

    static _getInstance() {
        this._instance || (this._instance = new PropDataSys());
        return this._instance;
    }
}

export default PropDataSys._getInstance();
