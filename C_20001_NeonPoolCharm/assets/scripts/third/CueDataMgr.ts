import ConfigDataSys from "./ConfigDataSys";

export const ECueState = cc.Enum({
    E_LOCK: 0,
    E_UNLOCK: 1,
    E_GOT: 2,
    E_USED: 3
});

export default class CueDataMgr {
    max_power = 0;
    min_power = 0;
    max_line_len = 0;
    min_line_len = 0;
    max_spin = 0;
    min_spin = 0;
    _get_clubs: Record<string, boolean> = {};
    _usedCueId = 0;
    _nextCueID: number = undefined;
    _unlockedCueCount = 1;
    _openedCueCount = 1;

    get get_clubs() {
        return this._get_clubs;
    }

    set get_clubs(e: Record<string, boolean>) {
        this._get_clubs = e;
        const t = Object.keys(e);
        this._openedCueCount = t.length;
        this._unlockedCueCount = t.reduce((count, o) => {
            return count + (true === e[o] ? 1 : 0);
        }, 0);
    }

    get usedCueId() {
        return this._usedCueId;
    }

    set usedCueId(e: number) {
        this._usedCueId = e;
    }

    get nextCueID() {
        return this._nextCueID;
    }

    set nextCueID(e: number) {
        this._nextCueID = e;
    }

    get unlockedCueCount() {
        return this._unlockedCueCount;
    }

    get openedCueCount() {
        return this._openedCueCount;
    }

    initCueDataMgr(): void {
        ConfigDataSys.cue_configMap.forEach((t) => {
            (!this.max_power || this.max_power < t.force) && (this.max_power = t.force);
            (!this.max_line_len || this.max_line_len < t.aiming) && (this.max_line_len = t.aiming);
            (!this.max_spin || this.max_spin < t.spin) && (this.max_spin = t.spin);
            (!this.min_power || this.min_power > t.force) && (this.min_power = t.force);
            (!this.min_line_len || this.min_line_len > t.aiming) && (this.min_line_len = t.aiming);
            (!this.min_spin || this.min_spin > t.spin) && (this.min_spin = t.spin);
        });
    }
}
