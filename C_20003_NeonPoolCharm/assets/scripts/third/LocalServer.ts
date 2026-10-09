import ConfigDataSys from "./ConfigDataSys";
import { GameConfigurations } from "./GameConfigurations";
import { AD_TYPE } from "./GameServiceMgr";

enum EStorageKey {
    USER = "user",
    INVENTORY = "inventory",
    CUE = "cue",
    GAME = "game"
}

export default class LocalServer {
    _levelConfigs;
    _userData;
    _inventoryData;
    _cachedItemIncrementRecord;
    _gameData;
    _cachedNewLoopLevelStartIndex;
    _cachedNewStartLevelCount;
    _cachedNewLoopLevelCount;
    _cachedLoopLevelStartIndex;
    _cachedStartLevelCount;
    _cachedLoopLevelCount;
    _cachedCueConfigs;
    _cachedNextCueIndex;

    static EStorageKey = EStorageKey;

    static _instance = null;

    static get instance() {
        this._instance || (this._instance = new LocalServer());
        return this._instance;
    }

    constructor() {
        this._levelConfigs = null;
        this._userData = this._loadData(EStorageKey.USER);
        if (!this._userData) {
            const initialPlacePropNum = GameConfigurations.customConfig.initialPlacePropNum;
            this._userData = {
                birthTime: Date.now(),
                guideID: 0,
                cues: {
                    1: true
                },
                currentCue: 1,
                clearBonusType: 0,
                props: {
                    1: initialPlacePropNum !== null && initialPlacePropNum !== undefined ? initialPlacePropNum : 0
                }
            };
            this._saveData(EStorageKey.USER, this._userData);
        }
        const inventoryData = this._loadData(EStorageKey.INVENTORY);
        this._inventoryData = inventoryData !== null && inventoryData !== undefined ? inventoryData : {};
        this._cachedItemIncrementRecord = {};
        this._gameData = this._loadData(EStorageKey.GAME);
        if (!this._gameData) {
            this._gameData = {
                completedLevelCount: 0,
                newCompletedRoundCount: 0,
                completedTurnCount: 0,
                usedTableRecord: {},
                table: ""
            };
            this._saveData(EStorageKey.GAME, this._gameData);
        }
        const f = GameConfigurations.customConfig.newLevelConfigs;
        this._cachedNewLoopLevelStartIndex = Math.max(0, f.findIndex(function (e) {
            return 2 === e.level_type;
        }));
        const prevNewConfig = f[this._cachedNewLoopLevelStartIndex - 1];
        const prevNewLevelA = prevNewConfig === null || prevNewConfig === undefined ? undefined : prevNewConfig.level_a;
        this._cachedNewStartLevelCount = prevNewLevelA !== null && prevNewLevelA !== undefined ? prevNewLevelA : 0;
        const lastNewConfig = f[f.length - 1];
        const lastNewLevelA = lastNewConfig === null || lastNewConfig === undefined ? undefined : lastNewConfig.level_a;
        this._cachedNewLoopLevelCount = lastNewLevelA !== null && lastNewLevelA !== undefined ? lastNewLevelA : 0;
        const h = GameConfigurations.customConfig.levelConfigs;
        this._cachedLoopLevelStartIndex = Math.max(0, h.findIndex(function (e) {
            return 2 === e.level_type;
        }));
        const prevConfig = h[this._cachedLoopLevelStartIndex - 1];
        const prevLevelA = prevConfig === null || prevConfig === undefined ? undefined : prevConfig.level_a;
        this._cachedStartLevelCount = prevLevelA !== null && prevLevelA !== undefined ? prevLevelA : 0;
        const lastConfig = h[h.length - 1];
        const lastLevelA = lastConfig === null || lastConfig === undefined ? undefined : lastConfig.level_a;
        this._cachedLoopLevelCount = lastLevelA !== null && lastLevelA !== undefined ? lastLevelA : 0;
        this._cachedCueConfigs = [];
        this._cachedNextCueIndex = Object.keys(this._userData.cues).length;
        this._fixGameData();
    }

    pocketInBonus() {
        const e = this._userData.clearBonusType;
        this._userData.clearBonusType = ++this._userData.clearBonusType % 2;
        this._saveData(EStorageKey.USER, this._userData);
        return 1 === e;
    }

    requestCompleteGuide(e) {
        this._userData.guideID = e;
        this._saveData(EStorageKey.USER, this._userData);
        return {
            code: 1,
            data: {
                gold_balance: 1e3
            },
            ecp: 0,
            message: ""
        };
    }

    requestCompleteAd(e, t) {
        if (t && e === AD_TYPE.baiqiu_prop) {
            const o = this._userData.props[1];
            this._userData.props[1] = (o !== null && o !== undefined ? o : 0) + ConfigDataSys.ad_configMap.get(AD_TYPE.baiqiu_prop).type_para;
            this._saveData(EStorageKey.USER, this._userData);
        }
        return {
            code: t ? 1 : 2,
            data: {
                prop: this._userData.props
            },
            ecp: 0,
            message: ""
        };
    }

    _generateTable(e, t) {
        const o = this;
        const i = GameConfigurations.customConfig.levelDifficultyConfigs;
        const a = i.find(function (t) {
            return t.ball_lv === e;
        });
        let l = a == null ? undefined : a.tables;
        if (!l || l.length <= 0) {
            console.error("invalid tables of difficulty: " + e);
            l = i[Math.floor(Math.random() * i.length)].tables;
        }
        let s = [];
        l.forEach(function (e) {
            o._gameData.usedTableRecord[e] || s.push(e);
        });
        if (s.length <= 0) {
            s = l;
            l.forEach(function (e) {
                return delete o._gameData.usedTableRecord[e];
            });
        }
        this._gameData.table = s[Math.floor(Math.random() * s.length)];
        this._gameData.usedTableRecord[this._gameData.table] = true;
        t && this._saveData(EStorageKey.GAME, this._gameData);
    }

    debugRequestOpenCues(e) {
        if (e !== this._cachedNextCueIndex) {
            const i: any = {};
            const a = Math.min(e, this._cachedCueConfigs.length);
            for (let r = 0; r < a; r++) {
                const l = this._cachedCueConfigs[r].id;
                const owned = this._userData.cues[l];
                i[l] = owned !== null && owned !== undefined && owned;
            }
            i[1] = true;
            this._userData.cues = i;
            this._cachedNextCueIndex = Object.keys(this._userData.cues).length;
            if (i[this._userData.currentCue] === undefined || i[this._userData.currentCue] === null) {
                this._userData.currentCue = 1;
            }
            this._saveData(EStorageKey.USER, this._userData);
        }
        const nextCue = this._cachedCueConfigs[this._cachedNextCueIndex];
        return {
            code: 1,
            data: {
                get_clubs: this._userData.cues,
                use_club_id: this._userData.currentCue,
                next_club_id: nextCue === null || nextCue === undefined ? undefined : nextCue.id
            },
            ecp: 0,
            message: ""
        };
    }

    requestRefreshNextCue() {
        const t = this._cachedCueConfigs[this._cachedNextCueIndex];
        if (t) {
            this._userData.cues[t.id] = false;
            this._cachedNextCueIndex = Object.keys(this._userData.cues).length;
            this._saveData(EStorageKey.USER, this._userData);
        }
        const nextCue = this._cachedCueConfigs[this._cachedNextCueIndex];
        return {
            code: 1,
            data: {
                get_clubs: this._userData.cues,
                use_club_id: this._userData.currentCue,
                next_club_id: nextCue === null || nextCue === undefined ? undefined : nextCue.id
            },
            ecp: 0,
            message: ""
        };
    }

    requestCompleteGame(e) {
        let t;
        let i = false;
        if (e) {
            ++this._gameData.newCompletedRoundCount;
            t = this._getNewLevelConfig(this._gameData.newCompletedRoundCount);
            i = 1 === t.level_b;
            i && ++this._gameData.completedLevelCount;
            this._generateTable(t.ball_lv, false);
            this._saveData(EStorageKey.GAME, this._gameData);
        } else {
            t = this._getNewLevelConfig(this._gameData.newCompletedRoundCount);
            i = false;
        }
        const o = this._getCurrentTotalRound(t.level_type, t.level_a);
        return {
            code: 1,
            data: {
                level_a: this._gameData.completedLevelCount + 1,
                level_b: t.level_b,
                level_c: 1,
                roundCount: o,
                turnCount: 1,
                level_completed: i,
                turn_pass: this._gameData.newCompletedRoundCount,
                level_pass: this._gameData.completedLevelCount,
                table: this._gameData.table,
                cash_balance: 0,
                gold_balance: 0,
                level_force: false,
                level_pass_success_count: this._gameData.completedLevelCount,
                max_extract_id: 1,
                scene_id: 1,
                scene_prize: 0,
                show_draw: false,
                show_level_reward: e
            },
            ecp: 0,
            message: ""
        };
    }

    debugRequestChangeRound(e) {
        e = Math.max(1, Math.floor(e));
        this._gameData.newCompletedRoundCount = e - 1;
        const t = this._getNewLevelConfig(this._gameData.newCompletedRoundCount);
        const o = this._getCurrentTotalRound(t.level_type, t.level_a);
        if (this._gameData.newCompletedRoundCount < this._cachedNewLoopLevelStartIndex) this._gameData.completedLevelCount = t.level_a - 1; else {
            const i = Math.floor((this._gameData.newCompletedRoundCount - this._cachedNewLoopLevelStartIndex) / (GameConfigurations.customConfig.newLevelConfigs.length - this._cachedNewLoopLevelStartIndex));
            this._gameData.completedLevelCount = t.level_a - 1 + this._cachedNewStartLevelCount + this._cachedNewLoopLevelCount * i;
        }
        this._generateTable(t.ball_lv, false);
        this._saveData(EStorageKey.GAME, this._gameData);
        return {
            code: 1,
            data: {
                level_a: this._gameData.completedLevelCount + 1,
                level_b: t.level_b,
                level_c: 1,
                roundCount: o,
                turnCount: 1,
                turn_pass: this._gameData.newCompletedRoundCount,
                level_pass: this._gameData.completedLevelCount,
                table: this._gameData.table
            },
            ecp: 0,
            message: ""
        };
    }

    deprecatedDebugRequestChangeLevel(e, t, o) {
        if (t === undefined) {
            t = 1;
        }
        if (o === undefined) {
            o = 1;
        }
        e = Math.max(1, Math.floor(e));
        t = Math.max(1, Math.floor(t));
        o = Math.max(1, Math.floor(o));
        this._gameData.completedLevelCount = e - 1;
        let i;
        let a;
        let l = undefined;
        if (e <= this._cachedStartLevelCount) {
            i = 1;
            a = e;
        } else {
            i = 2;
            a = (e - this._cachedStartLevelCount - 1) % this._cachedLoopLevelCount + 1;
            l = Math.floor((e - this._cachedStartLevelCount - 1) / this._cachedLoopLevelCount);
        }
        const s = GameConfigurations.customConfig.levelConfigs;
        const c = s.filter(function (e) {
            return e.level_type === i && e.level_a === a;
        });
        t = Math.min(t, c[c.length - 1].level_b);
        const u = c.filter(function (e) {
            return e.level_b === t;
        });
        o = Math.min(o, u[u.length - 1].level_c);
        const p = s.findIndex(function (e) {
            return e.level_type === i && e.level_a === a && e.level_b === t && e.level_c === o;
        });
        this._gameData.completedTurnCount = p;
        l != null && (this._gameData.completedTurnCount += (s.length - this._cachedLoopLevelStartIndex) * l);
        const d = s[p];
        this._generateTable(d.ball_lv, false);
        this._saveData(EStorageKey.GAME, this._gameData);
        return {
            code: 1,
            data: {
                level_a: e,
                level_b: d.level_b,
                level_c: d.level_c,
                roundCount: c[c.length - 1].level_b,
                turnCount: u.length,
                turn_pass: this._gameData.completedTurnCount,
                level_pass: this._gameData.completedLevelCount,
                table: this._gameData.table
            },
            ecp: 0,
            message: ""
        };
    }

    _getOldLevelConfig(e) {
        const t = GameConfigurations.customConfig.levelConfigs;
        if (e < t.length) return t[e];
        const o = t.length - this._cachedLoopLevelStartIndex;
        return t[(e - this._cachedLoopLevelStartIndex) % o + this._cachedLoopLevelStartIndex];
    }

    _getOldLevelInfo(e, t, o) {
        let n = 0;
        let i = 0;
        const a = GameConfigurations.customConfig.levelConfigs.filter(function (o) {
            return o.level_type === e && o.level_a === t;
        });
        if (a.length > 0) {
            n = a[a.length - 1].level_b;
            i = a.filter(function (e) {
                return e.level_b === o;
            }).length;
        }
        return {
            roundCount: n,
            turnCount: i
        };
    }

    requestLogin() {
        return {
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        };
    }

    _fixGameData() {
        const completedTurnCount = this._gameData.completedTurnCount;
        const t = completedTurnCount !== null && completedTurnCount !== undefined ? completedTurnCount : 0;
        if (this._gameData.newCompletedRoundCount == null) {
            let o;
            let i;
            const a = this._gameData.completedLevelCount + 1;
            const l = this._getOldLevelConfig(t);
            let s = undefined;
            if (a <= this._cachedNewStartLevelCount) {
                o = 1;
                i = a;
            } else {
                o = 2;
                i = (a - this._cachedNewStartLevelCount - 1) % this._cachedNewLoopLevelCount + 1;
                s = Math.floor((a - this._cachedNewStartLevelCount - 1) / this._cachedNewLoopLevelCount);
            }
            const c = GameConfigurations.customConfig.newLevelConfigs;
            const u = c.filter(function (e) {
                return e.level_type === o && e.level_a === i;
            });
            const p = Math.min(l.level_b, u[u.length - 1].level_b);
            const d = c.findIndex(function (e) {
                return e.level_type === o && e.level_a === i && e.level_b === p;
            });
            this._gameData.newCompletedRoundCount = d;
            s != null && (this._gameData.newCompletedRoundCount += (c.length - this._cachedNewLoopLevelStartIndex) * s);
            const levelConfig = c[d];
            this._generateTable(levelConfig.ball_lv, false);
            this._saveData(EStorageKey.GAME, this._gameData);
        }
    }

    _loadData(e) {
        const stored = cc.sys.localStorage.getItem(e);
        const o = stored !== null && stored !== undefined ? stored : "";
        let n = null;
        try {
            n = JSON.parse(o);
        } catch (t) {
            console.log("failed to load cache data <" + e + ">: " + o);
        }
        return n;
    }

    _saveData(e, t) {
        "object" == typeof t ? cc.sys.localStorage.setItem(e, JSON.stringify(t)) : console.error("invalid data when saving: " + typeof t);
    }

    _getNewLevelConfig(e) {
        const t = GameConfigurations.customConfig.newLevelConfigs;
        if (e < t.length) return t[e];
        const o = t.length - this._cachedNewLoopLevelStartIndex;
        return t[(e - this._cachedNewLoopLevelStartIndex) % o + this._cachedNewLoopLevelStartIndex];
    }

    requestChangeCue(e) {
        if (true === this._userData.cues[e]) {
            this._userData.currentCue = e;
            this._saveData(EStorageKey.USER, this._userData);
        }
        const nextCue = this._cachedCueConfigs[this._cachedNextCueIndex];
        return {
            code: 1,
            data: {
                get_clubs: this._userData.cues,
                use_club_id: this._userData.currentCue,
                next_club_id: nextCue === null || nextCue === undefined ? undefined : nextCue.id
            },
            ecp: 0,
            message: ""
        };
    }

    deprecatedDebugRequestChangeTurn(e) {
        e = Math.max(1, Math.floor(e));
        this._gameData.completedTurnCount = e - 1;
        const t = this._getOldLevelConfig(this._gameData.completedTurnCount);
        const o = this._getOldLevelInfo(t.level_type, t.level_a, t.level_b);
        if (this._gameData.completedTurnCount < this._cachedLoopLevelStartIndex) this._gameData.completedLevelCount = t.level_a - 1; else {
            const i = Math.floor((this._gameData.completedTurnCount - this._cachedLoopLevelStartIndex) / (GameConfigurations.customConfig.levelConfigs.length - this._cachedLoopLevelStartIndex));
            this._gameData.completedLevelCount = t.level_a - 1 + this._cachedStartLevelCount + this._cachedLoopLevelCount * i;
        }
        this._generateTable(t.ball_lv, false);
        this._saveData(EStorageKey.GAME, this._gameData);
        return {
            code: 1,
            data: {
                level_a: this._gameData.completedLevelCount + 1,
                level_b: t.level_b,
                level_c: t.level_c,
                roundCount: o.roundCount,
                turnCount: o.turnCount,
                turn_pass: this._gameData.completedTurnCount,
                level_pass: this._gameData.completedLevelCount,
                table: this._gameData.table
            },
            ecp: 0,
            message: ""
        };
    }

    debugRequestChangeLevel(e, t) {
        if (t === undefined) {
            t = 1;
        }
        e = Math.max(1, Math.floor(e));
        t = Math.max(1, Math.floor(t));
        this._gameData.completedLevelCount = e - 1;
        let o;
        let i;
        let a = undefined;
        if (e <= this._cachedNewStartLevelCount) {
            o = 1;
            i = e;
        } else {
            o = 2;
            i = (e - this._cachedNewStartLevelCount - 1) % this._cachedNewLoopLevelCount + 1;
            a = Math.floor((e - this._cachedNewStartLevelCount - 1) / this._cachedNewLoopLevelCount);
        }
        const l = GameConfigurations.customConfig.newLevelConfigs;
        const s = l.filter(function (e) {
            return e.level_type === o && e.level_a === i;
        });
        t = Math.min(t, s[s.length - 1].level_b);
        const c = l.findIndex(function (e) {
            return e.level_type === o && e.level_a === i && e.level_b === t;
        });
        this._gameData.newCompletedRoundCount = c;
        a != null && (this._gameData.newCompletedRoundCount += (l.length - this._cachedNewLoopLevelStartIndex) * a);
        const u = l[c];
        this._generateTable(u.ball_lv, false);
        this._saveData(EStorageKey.GAME, this._gameData);
        return {
            code: 1,
            data: {
                level_a: e,
                level_b: u.level_b,
                level_c: 1,
                roundCount: s[s.length - 1].level_b,
                turnCount: 1,
                turn_pass: this._gameData.newCompletedRoundCount,
                level_pass: this._gameData.completedLevelCount,
                table: this._gameData.table
            },
            ecp: 0,
            message: ""
        };
    }

    _getCurrentTotalRound(e, t) {
        let o = 0;
        const n = GameConfigurations.customConfig.newLevelConfigs.filter(function (o) {
            return o.level_type === e && o.level_a === t;
        });
        n.length > 0 && (o = n[n.length - 1].level_b);
        return o;
    }

    requestUserInfo(e, t) {
        const o = this;
        cc.resources.load("config/info", cc.JsonAsset, function (n, i) {
            if (!n && i) {
                const l = o._getNewLevelConfig(o._gameData.newCompletedRoundCount);
                const s = o._getCurrentTotalRound(l.level_type, l.level_a);
                const c = i.json;
                const u = GameConfigurations.remoteOriginalConfig;
                "object" == typeof u && GameConfigurations.mergeConfig(c, u);
                o._gameData.table || o._generateTable(l.ball_lv, true);
                const club = c.tables.club;
                o._cachedCueConfigs.length = 0;
                for (const f in club) {
                    const p = club[f];
                    const d: any = {
                        id: Number(f)
                    };
                    Object.keys(p).forEach(function (e) {
                        return d[e] = p[e];
                    });
                    o._cachedCueConfigs.push(d);
                }
                o._cachedCueConfigs.sort(function (e, t) {
                    return e.id - t.id;
                });
                c.user_info.create_time = o._userData.birthTime;
                c.user_info.guide_id = o._userData.guideID;
                c.user_info.level_pass_success_count = o._gameData.completedLevelCount;
                c.user_info.cash_balance = 0;
                c.user_info.gold_balance = 0;
                c.game_info.level_a = o._gameData.completedLevelCount + 1;
                c.game_info.level_b = l.level_b;
                c.game_info.level_c = 1;
                c.game_info.roundCount = s;
                c.game_info.turnCount = 1;
                c.game_info.table = o._gameData.table;
                c.game_info.turn_pass = o._gameData.newCompletedRoundCount;
                c.game_info.level_pass = o._gameData.completedLevelCount;
                c.game_info.get_clubs = o._userData.cues;
                c.game_info.use_club_id = o._userData.currentCue;
                const nextCue = o._cachedCueConfigs[o._cachedNextCueIndex];
                c.game_info.next_club_id = nextCue === null || nextCue === undefined ? undefined : nextCue.id;
                c.game_info.prop = o._userData.props;
                e({
                    code: 1,
                    data: c,
                    ecp: 0,
                    message: ""
                });
            } else t(n != null ? n : new Error("unknown reason"));
        });
    }

    requestUnlockCue(e, t) {
        let i = false;
        if (false === this._userData.cues[e]) {
            this._userData.cues[e] = true;
            i = true;
        }
        if (t) {
            this._userData.currentCue = e;
            i = true;
        }
        i && this._saveData(EStorageKey.USER, this._userData);
        const nextCue = this._cachedCueConfigs[this._cachedNextCueIndex];
        return {
            code: 1,
            data: {
                get_clubs: this._userData.cues,
                use_club_id: this._userData.currentCue,
                next_club_id: nextCue === null || nextCue === undefined ? undefined : nextCue.id
            },
            ecp: 0,
            message: ""
        };
    }

    requestUseMoveCueBallProp() {
        const stored = this._userData.props[1];
        const o = stored !== null && stored !== undefined ? stored : 0;
        let t = false;
        if (o > 0) {
            this._userData.props[1] = o - 1;
            this._saveData(EStorageKey.USER, this._userData);
            t = true;
        }
        return {
            code: 1,
            data: {
                prop: t ? this._userData.props : null
            },
            ecp: 0,
            message: ""
        };
    }
}
