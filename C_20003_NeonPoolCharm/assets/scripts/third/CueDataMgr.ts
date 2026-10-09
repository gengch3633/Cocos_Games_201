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
    _get_clubs = {};
    _usedCueId = 0;
    _nextCueID = undefined;
    _unlockedCueCount = 1;
    _openedCueCount = 1;

    get get_clubs() {
        return this._get_clubs;
    }

    set get_clubs(value) {
        this._get_clubs = value;
        const keys = Object.keys(value);
        this._openedCueCount = keys.length;
        this._unlockedCueCount = keys.reduce(function (count, key) {
            return count + (true === value[key] ? 1 : 0);
        }, 0);
    }

    get usedCueId() {
        return this._usedCueId;
    }

    set usedCueId(value) {
        this._usedCueId = value;
    }

    get nextCueID() {
        return this._nextCueID;
    }

    set nextCueID(value) {
        this._nextCueID = value;
    }

    get unlockedCueCount() {
        return this._unlockedCueCount;
    }

    get openedCueCount() {
        return this._openedCueCount;
    }

    initCueDataMgr() {
        const self = this;
        ConfigDataSys.cue_configMap.forEach(function (cue) {
            if (!self.max_power || self.max_power < cue.force) {
                self.max_power = cue.force;
            }
            if (!self.max_line_len || self.max_line_len < cue.aiming) {
                self.max_line_len = cue.aiming;
            }
            if (!self.max_spin || self.max_spin < cue.spin) {
                self.max_spin = cue.spin;
            }
            if (!self.min_power || self.min_power > cue.force) {
                self.min_power = cue.force;
            }
            if (!self.min_line_len || self.min_line_len > cue.aiming) {
                self.min_line_len = cue.aiming;
            }
            if (!self.min_spin || self.min_spin > cue.spin) {
                self.min_spin = cue.spin;
            }
        });
    }
}
