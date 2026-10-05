import TimeDataMgr from "./TimeDataMgr";
import NativeEventType from "./NativeEventType";
import PlayerDataSys from "./PlayerDataSys";
import EventMgr from "./EventMgr";
import EngineUtil from "./EngineUtil";

class TimeDataSys extends TimeDataMgr {
    private static _instance: TimeDataSys = null;

    private _isStart: boolean = null;
    game_start_timeStamp: number = null;

    constructor() {
        super();
        EventMgr.listen(NativeEventType.APP_PAUSE, this.appPause, this);
        EventMgr.listen(NativeEventType.APP_RESTART, this.appRestart, this);
    }

    appRestart(): void {
        if (this.game_start_timeStamp == 0) {
            this.game_start_timeStamp = EngineUtil.getTimeStamp();
        }
        this._isStart;
    }

    saveTime(): void {
        const total = this.readGameTime() + this.getGameTime();
        EngineUtil.localStorageSetItem(this.getLSKey(), String(total));
    }

    setTimerStart(start: boolean): void {
        this._isStart = start;
    }

    appPause(): void {
        if (this._isStart) {
            this.saveTime();
            this.game_start_timeStamp = 0;
        }
    }

    private static _getInstance(): TimeDataSys {
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

    getTimeCuration(reset: boolean): number {
        const duration = this.readGameTime() + this.getGameTime();
        console.log("本次挑战时长(秒)：" + duration);
        if (reset) {
            this._isStart = false;
            this.clearTimeLS();
        }
        return duration;
    }

    restartTimer(): void {
        this._isStart = true;
        this.game_start_timeStamp = EngineUtil.getTimeStamp();
    }

    readGameTime(): number {
        let time = Number(EngineUtil.localStorageGetItem(this.getLSKey(), "0"));
        if (time > 10800) {
            time = 0;
        }
        return time;
    }
}

export default TimeDataSys._getInstance();
