export default class TimeDataMgr {
    _pauseTimeStamp = 0;

    _prevPauseTime = 0;

    _game_start_timeStamp = 0;

    get game_start_timeStamp() {
        return this._game_start_timeStamp;
    }

    set game_start_timeStamp(e) {
        this._game_start_timeStamp = e;
    }

    get prevPauseTime() {
        return this._prevPauseTime;
    }

    set prevPauseTime(e) {
        this._prevPauseTime = e;
    }

    get pauseTimeStamp() {
        return this._pauseTimeStamp;
    }

    set pauseTimeStamp(e) {
        this._pauseTimeStamp = e;
    }
}
