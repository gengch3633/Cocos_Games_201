import ConfigDataSys from "./ConfigDataSys";

export const ECueState = cc.Enum({
    E_LOCK: 0,
    E_UNLOCK: 1,
    E_GOT: 2,
    E_USED: 3,
});

export default class CueDataMgr {
    max_power = 0;
    min_power = 0;
    max_line_len = 0;
    min_line_len = 0;
    max_spin = 0;
    min_spin = 0;

    private _get_clubs: Record<string, boolean> = {};
    private _usedCueId = 0;
    private _nextCueID: number = undefined;
    private _unlockedCueCount = 1;
    private _openedCueCount = 1;

    get get_clubs(): Record<string, boolean> {
        return this._get_clubs;
    }

    set get_clubs(value: Record<string, boolean>) {
        this._get_clubs = value;
        const keys = Object.keys(value);
        this._openedCueCount = keys.length;
        this._unlockedCueCount = keys.reduce((count, key) => count + (value[key] === true ? 1 : 0), 0);
    }

    get usedCueId(): number {
        return this._usedCueId;
    }

    set usedCueId(value: number) {
        this._usedCueId = value;
    }

    get nextCueID(): number {
        return this._nextCueID;
    }

    set nextCueID(value: number) {
        this._nextCueID = value;
    }

    get unlockedCueCount(): number {
        return this._unlockedCueCount;
    }

    get openedCueCount(): number {
        return this._openedCueCount;
    }

    initCueDataMgr(): void {
        ConfigDataSys.cue_configMap.forEach((config) => {
            if (!this.max_power || this.max_power < config.force) {
                this.max_power = config.force;
            }
            if (!this.max_line_len || this.max_line_len < config.aiming) {
                this.max_line_len = config.aiming;
            }
            if (!this.max_spin || this.max_spin < config.spin) {
                this.max_spin = config.spin;
            }
            if (!this.min_power || this.min_power > config.force) {
                this.min_power = config.force;
            }
            if (!this.min_line_len || this.min_line_len > config.aiming) {
                this.min_line_len = config.aiming;
            }
            if (!this.min_spin || this.min_spin > config.spin) {
                this.min_spin = config.spin;
            }
        });
    }
}
