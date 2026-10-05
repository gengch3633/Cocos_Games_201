export default class TimeDataMgr {
    private _pauseTimeStamp = 0;
    private _prevPauseTime = 0;
    private _game_start_timeStamp = 0;

    get game_start_timeStamp(): number {
        return this._game_start_timeStamp;
    }

    set game_start_timeStamp(value: number) {
        this._game_start_timeStamp = value;
    }

    get prevPauseTime(): number {
        return this._prevPauseTime;
    }

    set prevPauseTime(value: number) {
        this._prevPauseTime = value;
    }

    get pauseTimeStamp(): number {
        return this._pauseTimeStamp;
    }

    set pauseTimeStamp(value: number) {
        this._pauseTimeStamp = value;
    }
}
