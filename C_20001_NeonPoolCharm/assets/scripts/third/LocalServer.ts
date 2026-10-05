import ConfigDataSys from "./ConfigDataSys";
import { AD_TYPE } from "./GameServiceMgr";
import { GameConfigurations } from "./GameConfigurations";

enum EStorageKey {
    USER = "user",
    INVENTORY = "inventory",
    CUE = "cue",
    GAME = "game",
}

export default class LocalServer {
    static EStorageKey = EStorageKey;

    private static _instance: LocalServer = null;

    static get instance(): LocalServer {
        if (!LocalServer._instance) {
            LocalServer._instance = new LocalServer();
        }
        return LocalServer._instance;
    }

    private _levelConfigs: any = null;
    private _userData: any;
    private _inventoryData: any;
    private _cachedItemIncrementRecord: any;
    private _gameData: any;
    private _cachedNewLoopLevelStartIndex: number;
    private _cachedNewStartLevelCount: number;
    private _cachedNewLoopLevelCount: number;
    private _cachedLoopLevelStartIndex: number;
    private _cachedStartLevelCount: number;
    private _cachedLoopLevelCount: number;
    private _cachedCueConfigs: any[];
    private _cachedNextCueIndex: number;

    constructor() {
        this._levelConfigs = null;
        this._userData = this._loadData(EStorageKey.USER);
        if (!this._userData) {
            this._userData = {
                birthTime: Date.now(),
                guideID: 0,
                cues: { 1: true },
                currentCue: 1,
                clearBonusType: 0,
                props: {
                    1: GameConfigurations.customConfig.initialPlacePropNum ?? 0,
                },
            };
            this._saveData(EStorageKey.USER, this._userData);
        }
        this._inventoryData = this._loadData(EStorageKey.INVENTORY) ?? {};
        this._cachedItemIncrementRecord = {};
        this._gameData = this._loadData(EStorageKey.GAME);
        if (!this._gameData) {
            this._gameData = {
                completedLevelCount: 0,
                newCompletedRoundCount: 0,
                completedTurnCount: 0,
                usedTableRecord: {},
                table: "",
            };
            this._saveData(EStorageKey.GAME, this._gameData);
        }
        const newLevelConfigs = GameConfigurations.customConfig.newLevelConfigs;
        this._cachedNewLoopLevelStartIndex = Math.max(
            0,
            newLevelConfigs.findIndex((e: any) => 2 === e.level_type)
        );
        this._cachedNewStartLevelCount =
            newLevelConfigs[this._cachedNewLoopLevelStartIndex - 1]?.level_a ?? 0;
        this._cachedNewLoopLevelCount =
            newLevelConfigs[newLevelConfigs.length - 1]?.level_a ?? 0;
        const levelConfigs = GameConfigurations.customConfig.levelConfigs;
        this._cachedLoopLevelStartIndex = Math.max(
            0,
            levelConfigs.findIndex((e: any) => 2 === e.level_type)
        );
        this._cachedStartLevelCount =
            levelConfigs[this._cachedLoopLevelStartIndex - 1]?.level_a ?? 0;
        this._cachedLoopLevelCount =
            levelConfigs[levelConfigs.length - 1]?.level_a ?? 0;
        this._cachedCueConfigs = [];
        this._cachedNextCueIndex = Object.keys(this._userData.cues).length;
        this._fixGameData();
    }

    pocketInBonus(): boolean {
        const e = this._userData.clearBonusType;
        this._userData.clearBonusType = ++this._userData.clearBonusType % 2;
        this._saveData(EStorageKey.USER, this._userData);
        return 1 === e;
    }

    requestCompleteGuide(e: number): any {
        this._userData.guideID = e;
        this._saveData(EStorageKey.USER, this._userData);
        return {
            code: 1,
            data: {
                gold_balance: 1000,
            },
            ecp: 0,
            message: "",
        };
    }

    requestCompleteAd(e: any, t: boolean): any {
        if (t && e === AD_TYPE.baiqiu_prop) {
            this._userData.props[1] =
                (this._userData.props[1] ?? 0) +
                ConfigDataSys.ad_configMap.get(AD_TYPE.baiqiu_prop).type_para;
            this._saveData(EStorageKey.USER, this._userData);
        }
        return {
            code: t ? 1 : 2,
            data: {
                prop: this._userData.props,
            },
            ecp: 0,
            message: "",
        };
    }

    _generateTable(e: number, t: boolean): void {
        const levelDifficultyConfigs =
            GameConfigurations.customConfig.levelDifficultyConfigs;
        let a = levelDifficultyConfigs.find((t: any) => t.ball_lv === e);
        let l = a?.tables;
        if (!l || l.length <= 0) {
            console.error("invalid tables of difficulty: " + e);
            l = levelDifficultyConfigs[
                Math.floor(Math.random() * levelDifficultyConfigs.length)
            ].tables;
        }
        let s: any[] = [];
        l.forEach((table: any) => {
            if (!this._gameData.usedTableRecord[table]) {
                s.push(table);
            }
        });
        if (s.length <= 0) {
            s = l;
            l.forEach((table: any) => {
                delete this._gameData.usedTableRecord[table];
            });
        }
        this._gameData.table = s[Math.floor(Math.random() * s.length)];
        this._gameData.usedTableRecord[this._gameData.table] = true;
        if (t) {
            this._saveData(EStorageKey.GAME, this._gameData);
        }
    }

    debugRequestOpenCues(e: number): any {
        if (e !== this._cachedNextCueIndex) {
            const i: any = {};
            const a = Math.min(e, this._cachedCueConfigs.length);
            for (let r = 0; r < a; r++) {
                const l = this._cachedCueConfigs[r].id;
                i[l] = !!this._userData.cues[l];
            }
            i[1] = true;
            this._userData.cues = i;
            this._cachedNextCueIndex = Object.keys(this._userData.cues).length;
            if (
                i[this._userData.currentCue] === undefined ||
                i[this._userData.currentCue] === null
            ) {
                this._userData.currentCue = 1;
            }
            this._saveData(EStorageKey.USER, this._userData);
        }
        return {
            code: 1,
            data: {
                get_clubs: this._userData.cues,
                use_club_id: this._userData.currentCue,
                next_club_id: this._cachedCueConfigs[this._cachedNextCueIndex]?.id,
            },
            ecp: 0,
            message: "",
        };
    }

    requestRefreshNextCue(): any {
        const t = this._cachedCueConfigs[this._cachedNextCueIndex];
        if (t) {
            this._userData.cues[t.id] = false;
            this._cachedNextCueIndex = Object.keys(this._userData.cues).length;
            this._saveData(EStorageKey.USER, this._userData);
        }
        return {
            code: 1,
            data: {
                get_clubs: this._userData.cues,
                use_club_id: this._userData.currentCue,
                next_club_id: this._cachedCueConfigs[this._cachedNextCueIndex]?.id,
            },
            ecp: 0,
            message: "",
        };
    }

    requestCompleteGame(e: boolean): any {
        let t: any;
        let i = false;
        if (e) {
            ++this._gameData.newCompletedRoundCount;
            t = this._getNewLevelConfig(this._gameData.newCompletedRoundCount);
            i = 1 === t.level_b;
            if (i) {
                ++this._gameData.completedLevelCount;
            }
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
                show_level_reward: e,
            },
            ecp: 0,
            message: "",
        };
    }

    debugRequestChangeRound(e: number): any {
        e = Math.max(1, Math.floor(e));
        this._gameData.newCompletedRoundCount = e - 1;
        const t = this._getNewLevelConfig(this._gameData.newCompletedRoundCount);
        const o = this._getCurrentTotalRound(t.level_type, t.level_a);
        if (this._gameData.newCompletedRoundCount < this._cachedNewLoopLevelStartIndex) {
            this._gameData.completedLevelCount = t.level_a - 1;
        } else {
            const i = Math.floor(
                (this._gameData.newCompletedRoundCount - this._cachedNewLoopLevelStartIndex) /
                    (GameConfigurations.customConfig.newLevelConfigs.length -
                        this._cachedNewLoopLevelStartIndex)
            );
            this._gameData.completedLevelCount =
                t.level_a - 1 + this._cachedNewStartLevelCount + this._cachedNewLoopLevelCount * i;
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
                table: this._gameData.table,
            },
            ecp: 0,
            message: "",
        };
    }

    deprecatedDebugRequestChangeLevel(e: number, t: number = 1, o: number = 1): any {
        e = Math.max(1, Math.floor(e));
        t = Math.max(1, Math.floor(t));
        o = Math.max(1, Math.floor(o));
        this._gameData.completedLevelCount = e - 1;
        let i: number;
        let a: number;
        let l: number | undefined = undefined;
        if (e <= this._cachedStartLevelCount) {
            i = 1;
            a = e;
        } else {
            i = 2;
            a = ((e - this._cachedStartLevelCount - 1) % this._cachedLoopLevelCount) + 1;
            l = Math.floor((e - this._cachedStartLevelCount - 1) / this._cachedLoopLevelCount);
        }
        const s = GameConfigurations.customConfig.levelConfigs;
        const c = s.filter((e: any) => e.level_type === i && e.level_a === a);
        t = Math.min(t, c[c.length - 1].level_b);
        const u = c.filter((e: any) => e.level_b === t);
        o = Math.min(o, u[u.length - 1].level_c);
        const p = s.findIndex(
            (e: any) => e.level_type === i && e.level_a === a && e.level_b === t && e.level_c === o
        );
        this._gameData.completedTurnCount = p;
        if (l != null) {
            this._gameData.completedTurnCount +=
                (s.length - this._cachedLoopLevelStartIndex) * l;
        }
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
                table: this._gameData.table,
            },
            ecp: 0,
            message: "",
        };
    }

    _getOldLevelConfig(e: number): any {
        const t = GameConfigurations.customConfig.levelConfigs;
        if (e < t.length) {
            return t[e];
        }
        const o = t.length - this._cachedLoopLevelStartIndex;
        return t[((e - this._cachedLoopLevelStartIndex) % o) + this._cachedLoopLevelStartIndex];
    }

    _getOldLevelInfo(e: number, t: number, o: number): any {
        let n = 0;
        let i = 0;
        const a = GameConfigurations.customConfig.levelConfigs.filter(
            (o: any) => o.level_type === e && o.level_a === t
        );
        if (a.length > 0) {
            n = a[a.length - 1].level_b;
            i = a.filter((e: any) => e.level_b === o).length;
        }
        return {
            roundCount: n,
            turnCount: i,
        };
    }

    requestLogin(): any {
        return {
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        };
    }

    _fixGameData(): void {
        const t = this._gameData.completedTurnCount ?? 0;
        if (this._gameData.newCompletedRoundCount == null) {
            let o: number;
            let i: number;
            let s: number | undefined = undefined;
            const a = this._gameData.completedLevelCount + 1;
            const l = this._getOldLevelConfig(t);
            if (a <= this._cachedNewStartLevelCount) {
                o = 1;
                i = a;
            } else {
                o = 2;
                i = ((a - this._cachedNewStartLevelCount - 1) % this._cachedNewLoopLevelCount) + 1;
                s = Math.floor(
                    (a - this._cachedNewStartLevelCount - 1) / this._cachedNewLoopLevelCount
                );
            }
            const c = GameConfigurations.customConfig.newLevelConfigs;
            const u = c.filter((e: any) => e.level_type === o && e.level_a === i);
            const p = Math.min(l.level_b, u[u.length - 1].level_b);
            const d = c.findIndex(
                (e: any) => e.level_type === o && e.level_a === i && e.level_b === p
            );
            this._gameData.newCompletedRoundCount = d;
            if (s != null) {
                this._gameData.newCompletedRoundCount +=
                    (c.length - this._cachedNewLoopLevelStartIndex) * s;
            }
            const _ = c[d];
            this._generateTable(_.ball_lv, false);
            this._saveData(EStorageKey.GAME, this._gameData);
        }
    }

    _loadData(e: string): any {
        const o = cc.sys.localStorage.getItem(e) ?? "";
        let n: any = null;
        try {
            n = JSON.parse(o);
        } catch (t) {
            console.log("failed to load cache data <" + e + ">: " + o);
        }
        return n;
    }

    _saveData(e: string, t: any): void {
        if (typeof t === "object") {
            cc.sys.localStorage.setItem(e, JSON.stringify(t));
        } else {
            console.error("invalid data when saving: " + typeof t);
        }
    }

    _getNewLevelConfig(e: number): any {
        const t = GameConfigurations.customConfig.newLevelConfigs;
        if (e < t.length) {
            return t[e];
        }
        const o = t.length - this._cachedNewLoopLevelStartIndex;
        return t[((e - this._cachedNewLoopLevelStartIndex) % o) + this._cachedNewLoopLevelStartIndex];
    }

    requestChangeCue(e: number): any {
        if (this._userData.cues[e] === true) {
            this._userData.currentCue = e;
            this._saveData(EStorageKey.USER, this._userData);
        }
        return {
            code: 1,
            data: {
                get_clubs: this._userData.cues,
                use_club_id: this._userData.currentCue,
                next_club_id: this._cachedCueConfigs[this._cachedNextCueIndex]?.id,
            },
            ecp: 0,
            message: "",
        };
    }

    deprecatedDebugRequestChangeTurn(e: number): any {
        e = Math.max(1, Math.floor(e));
        this._gameData.completedTurnCount = e - 1;
        const t = this._getOldLevelConfig(this._gameData.completedTurnCount);
        const o = this._getOldLevelInfo(t.level_type, t.level_a, t.level_b);
        if (this._gameData.completedTurnCount < this._cachedLoopLevelStartIndex) {
            this._gameData.completedLevelCount = t.level_a - 1;
        } else {
            const i = Math.floor(
                (this._gameData.completedTurnCount - this._cachedLoopLevelStartIndex) /
                    (GameConfigurations.customConfig.levelConfigs.length -
                        this._cachedLoopLevelStartIndex)
            );
            this._gameData.completedLevelCount =
                t.level_a - 1 + this._cachedStartLevelCount + this._cachedLoopLevelCount * i;
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
                table: this._gameData.table,
            },
            ecp: 0,
            message: "",
        };
    }

    debugRequestChangeLevel(e: number, t: number = 1): any {
        e = Math.max(1, Math.floor(e));
        t = Math.max(1, Math.floor(t));
        this._gameData.completedLevelCount = e - 1;
        let o: number;
        let i: number;
        let a: number | undefined = undefined;
        if (e <= this._cachedNewStartLevelCount) {
            o = 1;
            i = e;
        } else {
            o = 2;
            i = ((e - this._cachedNewStartLevelCount - 1) % this._cachedNewLoopLevelCount) + 1;
            a = Math.floor(
                (e - this._cachedNewStartLevelCount - 1) / this._cachedNewLoopLevelCount
            );
        }
        const l = GameConfigurations.customConfig.newLevelConfigs;
        const s = l.filter((e: any) => e.level_type === o && e.level_a === i);
        t = Math.min(t, s[s.length - 1].level_b);
        const c = l.findIndex(
            (e: any) => e.level_type === o && e.level_a === i && e.level_b === t
        );
        this._gameData.newCompletedRoundCount = c;
        if (a != null) {
            this._gameData.newCompletedRoundCount +=
                (l.length - this._cachedNewLoopLevelStartIndex) * a;
        }
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
                table: this._gameData.table,
            },
            ecp: 0,
            message: "",
        };
    }

    _getCurrentTotalRound(e: number, t: number): number {
        let o = 0;
        const n = GameConfigurations.customConfig.newLevelConfigs.filter(
            (o: any) => o.level_type === e && o.level_a === t
        );
        if (n.length > 0) {
            o = n[n.length - 1].level_b;
        }
        return o;
    }

    requestUserInfo(e: (result: any) => void, t: (err: any) => void): void {
        cc.resources.load("config/info", cc.JsonAsset, (n: any, i: cc.JsonAsset) => {
            if (!n && i) {
                const l = this._getNewLevelConfig(this._gameData.newCompletedRoundCount);
                const s = this._getCurrentTotalRound(l.level_type, l.level_a);
                const c = i.json;
                const u = GameConfigurations.remoteOriginalConfig;
                if (typeof u === "object") {
                    GameConfigurations.mergeConfig(c, u);
                }
                if (!this._gameData.table) {
                    this._generateTable(l.ball_lv, true);
                }
                const _ = c.tables.club;
                this._cachedCueConfigs.length = 0;
                for (const f in _) {
                    const p = _[f];
                    const d: any = {
                        id: Number(f),
                    };
                    Object.keys(p).forEach((key) => {
                        d[key] = p[key];
                    });
                    this._cachedCueConfigs.push(d);
                }
                this._cachedCueConfigs.sort((e: any, t: any) => e.id - t.id);
                c.user_info.create_time = this._userData.birthTime;
                c.user_info.guide_id = this._userData.guideID;
                c.user_info.level_pass_success_count = this._gameData.completedLevelCount;
                c.user_info.cash_balance = 0;
                c.user_info.gold_balance = 0;
                c.game_info.level_a = this._gameData.completedLevelCount + 1;
                c.game_info.level_b = l.level_b;
                c.game_info.level_c = 1;
                c.game_info.roundCount = s;
                c.game_info.turnCount = 1;
                c.game_info.table = this._gameData.table;
                c.game_info.turn_pass = this._gameData.newCompletedRoundCount;
                c.game_info.level_pass = this._gameData.completedLevelCount;
                c.game_info.get_clubs = this._userData.cues;
                c.game_info.use_club_id = this._userData.currentCue;
                c.game_info.next_club_id =
                    this._cachedCueConfigs[this._cachedNextCueIndex]?.id;
                c.game_info.prop = this._userData.props;
                e({
                    code: 1,
                    data: c,
                    ecp: 0,
                    message: "",
                });
            } else {
                t(n != null ? n : new Error("unknown reason"));
            }
        });
    }

    requestUnlockCue(e: number, t: boolean): any {
        let i = false;
        if (this._userData.cues[e] === false) {
            this._userData.cues[e] = true;
            i = true;
        }
        if (t) {
            this._userData.currentCue = e;
            i = true;
        }
        if (i) {
            this._saveData(EStorageKey.USER, this._userData);
        }
        return {
            code: 1,
            data: {
                get_clubs: this._userData.cues,
                use_club_id: this._userData.currentCue,
                next_club_id: this._cachedCueConfigs[this._cachedNextCueIndex]?.id,
            },
            ecp: 0,
            message: "",
        };
    }

    requestUseMoveCueBallProp(): any {
        const o = this._userData.props[1] ?? 0;
        let t = false;
        if (o > 0) {
            this._userData.props[1] = o - 1;
            this._saveData(EStorageKey.USER, this._userData);
            t = true;
        }
        return {
            code: 1,
            data: {
                prop: t ? this._userData.props : null,
            },
            ecp: 0,
            message: "",
        };
    }
}
