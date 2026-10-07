import { GameConfigurations } from "./GameConfigurations";
import AudioManager from "./AudioManager";
import ConfigDataSys from "./ConfigDataSys";
import PlayerDataSys from "./PlayerDataSys";
import { ETaiQiuPropType } from "./ConfigDataMgr";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import EngineUtil from "./EngineUtil";
import TimeUtils from "./TimeUtils";
import GameServiceMgr, { AD_TYPE } from "./GameServiceMgr";

class PropDataSys {
    _isLinePropStart: boolean = null;
    _isBaiQiuPropInUse: boolean = null;

    get isBaiQiuPropInUse(): boolean {
        return this._isBaiQiuPropInUse;
    }

    get linePropTimer(): number {
        return Number(EngineUtil.localStorageGetItem("prop_line_time", "0"));
    }

    get isLinePropInfinite(): boolean {
        return PlayerDataSys.level_pass < GameConfigurations.customConfig.maxLevelForFreeAimProp;
    }

    get isLinePropUseable(): boolean {
        return !this.isLinePropInfinite && this.linePropTimer <= TimeUtils.getTimeinSeconds();
    }

    get isLinePropUsed(): boolean {
        return this.isLinePropInfinite || this.linePropTimer > TimeUtils.getTimeinSeconds();
    }

    usePropBaiQiu(e: boolean): void {
        if (!this._isBaiQiuPropInUse) {
            AudioManager.getInstance().playMusic("pool_ui_useitem");
            this._isBaiQiuPropInUse = true;
            EventMgr.trigger(GameEventType.ON_PROP_USED_STATE_CHANGED, {
                prop_type: ETaiQiuPropType.E_BaiQiu,
                state: 1,
                isUsedProp: e,
            });
        }
    }

    timeInterval(): void {
        if (this._isLinePropStart && this.linePropTimer <= TimeUtils.getTimeinSeconds()) {
            this._isLinePropStart = false;
            EventMgr.trigger(GameEventType.ON_LINE_PROP_USED_STATE_CHANGED, false);
        }
    }

    init(): void {
        this._isLinePropStart = this.isLinePropUseable;
        setInterval(this.timeInterval.bind(this), 500);
    }

    propUsedComplete(e: number): void {
        switch (e) {
            case ETaiQiuPropType.E_BaiQiu:
                this._isBaiQiuPropInUse = false;
                EventMgr.trigger(GameEventType.ON_PROP_USED_STATE_CHANGED, {
                    prop_type: ETaiQiuPropType.E_BaiQiu,
                    state: 0,
                });
        }
    }

    usePropLine(): void {
        if (this.linePropTimer > TimeUtils.getTimeinSeconds()) {
            console.error("PropDataSys.usePropLine : 道具使用中");
        } else {
            const e = Number(ConfigDataSys.ad_configMap.get(AD_TYPE.line_prop).type_para);
            const t = TimeUtils.getTimeinSeconds() + e;
            EngineUtil.localStorageSetItem("prop_line_time", String(t));
            this._isLinePropStart = true;
            AudioManager.getInstance().playMusic("pool_ui_useitem");
            EventMgr.trigger(GameEventType.ON_LINE_PROP_USED_STATE_CHANGED, true);
        }
    }

    getPropCount(e: number): number {
        return PlayerDataSys.prop_info[e] ?? 0;
    }

    static _getInstance(): PropDataSys {
        this._instance || (this._instance = new PropDataSys());
        return this._instance;
    }

    private static _instance: PropDataSys = null;
}

export default PropDataSys._getInstance();
