export default class TimeDataMgr {
    private _pauseTimeStamp = 0;
    private _prevPauseTime = 0;
    private _game_start_timeStamp = 0;

    get game_start_timeStamp(): number {
        return this._game_start_timeStamp;
    }

    set game_start_timeStamp(e: number) {
        this._game_start_timeStamp = e;
    }

    get prevPauseTime(): number {
        return this._prevPauseTime;
    }

    set prevPauseTime(e: number) {
        this._prevPauseTime = e;
    }

    get pauseTimeStamp(): number {
        return this._pauseTimeStamp;
    }

    set pauseTimeStamp(e: number) {
        this._pauseTimeStamp = e;
    }
}
