import TimeDataMgr from "./TimeDataMgr";
import NativeEventType from "./NativeEventType";
import PlayerDataSys from "./PlayerDataSys";
import EventMgr from "./EventMgr";
import EngineUtil from "./EngineUtil";

class TimeDataSys extends TimeDataMgr {
    private _isStart: boolean = null;

    constructor() {
        super();
        this.game_start_timeStamp = null;
        EventMgr.listen(NativeEventType.APP_PAUSE, this.appPause, this);
        EventMgr.listen(NativeEventType.APP_RESTART, this.appRestart, this);
    }

    appRestart(): void {
        if (0 == this.game_start_timeStamp) {
            this.game_start_timeStamp = EngineUtil.getTimeStamp();
        }
        this._isStart;
    }

    saveTime(): void {
        const e = this.readGameTime() + this.getGameTime();
        EngineUtil.localStorageSetItem(this.getLSKey(), String(e));
    }

    setTimerStart(e: boolean): void {
        this._isStart = e;
    }

    appPause(): void {
        if (this._isStart) {
            this.saveTime();
            this.game_start_timeStamp = 0;
        }
    }

    static _getInstance(): TimeDataSys {
        if (!TimeDataSys._instance) {
            TimeDataSys._instance = new TimeDataSys();
        }
        return TimeDataSys._instance;
    }

    getGameTime(): number {
        return EngineUtil.getTimeStamp() - this.game_start_timeStamp;
    }

    resetGameTime(): void {
        this.game_start_timeStamp = EngineUtil.getTimeStamp();
        this.clearTimeLS();
    }

    getLSKey(): string {
        return PlayerDataSys.user_level + "_ptime";
    }

    clearTimeLS(): void {
        EngineUtil.localStorageSetItem(this.getLSKey(), "0");
    }

    getTimeCuration(e: boolean): number {
        const t = this.readGameTime() + this.getGameTime();
        console.log("本次挑战时长(秒)：" + t);
        if (e) {
            this._isStart = false;
            this.clearTimeLS();
        }
        return t;
    }

    restartTimer(): void {
        this._isStart = true;
        this.game_start_timeStamp = EngineUtil.getTimeStamp();
    }

    readGameTime(): number {
        let e = Number(EngineUtil.localStorageGetItem(this.getLSKey(), "0"));
        if (e > 10800) {
            e = 0;
        }
        return e;
    }

    static _instance: TimeDataSys = null;
}

export default TimeDataSys._getInstance();
