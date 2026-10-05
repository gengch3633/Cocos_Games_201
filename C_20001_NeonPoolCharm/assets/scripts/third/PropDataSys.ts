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
    private static _instance: PropDataSys = null;

    private _isLinePropStart: boolean = null;
    private _isBaiQiuPropInUse: boolean = null;

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

    usePropBaiQiu(isUsedProp: boolean): void {
        if (!this._isBaiQiuPropInUse) {
            AudioManager.getInstance().playMusic("pool_ui_useitem");
            this._isBaiQiuPropInUse = true;
            EventMgr.trigger(GameEventType.ON_PROP_USED_STATE_CHANGED, {
                prop_type: ETaiQiuPropType.E_BaiQiu,
                state: 1,
                isUsedProp,
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

    propUsedComplete(propType: number): void {
        switch (propType) {
            case ETaiQiuPropType.E_BaiQiu:
                this._isBaiQiuPropInUse = false;
                EventMgr.trigger(GameEventType.ON_PROP_USED_STATE_CHANGED, {
                    prop_type: ETaiQiuPropType.E_BaiQiu,
                    state: 0,
                });
                break;
        }
    }

    usePropLine(): void {
        if (this.linePropTimer > TimeUtils.getTimeinSeconds()) {
            console.error("PropDataSys.usePropLine : 道具使用中");
        } else {
            const duration = Number(ConfigDataSys.ad_configMap.get(AD_TYPE.line_prop).type_para);
            const expireTime = TimeUtils.getTimeinSeconds() + duration;
            EngineUtil.localStorageSetItem("prop_line_time", String(expireTime));
            this._isLinePropStart = true;
            AudioManager.getInstance().playMusic("pool_ui_useitem");
            EventMgr.trigger(GameEventType.ON_LINE_PROP_USED_STATE_CHANGED, true);
        }
    }

    getPropCount(propId: number): number {
        return PlayerDataSys.prop_info[propId] ?? 0;
    }

    private static _getInstance(): PropDataSys {
        if (!PropDataSys._instance) {
            PropDataSys._instance = new PropDataSys();
        }
        return PropDataSys._instance;
    }
}

export default PropDataSys._getInstance();
