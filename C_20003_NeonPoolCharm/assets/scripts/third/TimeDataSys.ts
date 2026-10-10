import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import NativeEventType from "./NativeEventType";
import PlayerDataSys from "./PlayerDataSys";
import TimeDataMgr from "./TimeDataMgr";

class TimeDataSys extends TimeDataMgr {
    _isStart = null;

    static _instance = null;

    constructor() {
        super();
        this._isStart = null;
        this.game_start_timeStamp = null;
        EventMgr.listen(NativeEventType.APP_PAUSE, this.appPause, this);
        EventMgr.listen(NativeEventType.APP_RESTART, this.appRestart, this);
    }

    appRestart() {
        0 == this.game_start_timeStamp && (this.game_start_timeStamp = EngineUtil.getTimeStamp());
        this._isStart;
    }

    saveTime() {
        const e = this.readGameTime() + this.getGameTime();
        EngineUtil.localStorageSetItem(this.getLSKey(), String(e));
    }

    setTimerStart(e) {
        this._isStart = e;
    }

    appPause() {
        if (this._isStart) {
            this.saveTime();
            this.game_start_timeStamp = 0;
        }
    }

    static _getInstance() {
        this._instance || (this._instance = new TimeDataSys());
        return this._instance;
    }

    getGameTime() {
        return EngineUtil.getTimeStamp() - this.game_start_timeStamp;
    }

    resetGameTime() {
        this.game_start_timeStamp = EngineUtil.getTimeStamp();
        this.clearTimeLS();
    }

    getLSKey() {
        return PlayerDataSys.user_level + "_ptime";
    }

    clearTimeLS() {
        EngineUtil.localStorageSetItem(this.getLSKey(), "0");
    }

    getTimeCuration(e) {
        const t = this.readGameTime() + this.getGameTime();
        console.log("本次挑战时长(秒)：" + t);
        if (e) {
            this._isStart = false;
            this.clearTimeLS();
        }
        return t;
    }

    restartTimer() {
        this._isStart = true;
        this.game_start_timeStamp = EngineUtil.getTimeStamp();
    }

    readGameTime() {
        let e = Number(EngineUtil.localStorageGetItem(this.getLSKey(), "0"));
        e > 10800 && (e = 0);
        return e;
    }
}

export default TimeDataSys._getInstance();
