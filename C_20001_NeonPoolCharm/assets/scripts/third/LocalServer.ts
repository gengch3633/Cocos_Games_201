import ConfigDataSys from "./ConfigDataSys";
import GameServiceMgr, { AD_TYPE } from "./GameServiceMgr";
import { GameConfigurations } from "./GameConfigurations";

export enum EStorageKey {
    USER = "user",
    INVENTORY = "inventory",
    CUE = "cue",
    GAME = "game",
}

export default class LocalServer {
    static EStorageKey = EStorageKey;
    private static _instance: LocalServer = null;

    static get instance(): LocalServer {
        if (!this._instance) {
            this._instance = new LocalServer();
        }
        return this._instance;
    }

    _levelConfigs: any = null;
    _userData: any;
    _inventoryData: any;
    _cachedItemIncrementRecord: Record<string, any> = {};
    _gameData: any;
    _cachedNewLoopLevelStartIndex: number;
    _cachedNewStartLevelCount: number;
    _cachedNewLoopLevelCount: number;
    _cachedLoopLevelStartIndex: number;
    _cachedStartLevelCount: number;
    _cachedLoopLevelCount: number;
    _cachedCueConfigs: any[] = [];
    _cachedNextCueIndex: number;

    constructor() {
        this._userData = this._loadData(EStorageKey.USER);
        if (!this._userData) {
            this._userData = {
                birthTime: Date.now(),
                guideID: 0,
                cues: { 1: true },
                currentCue: 1,
                clearBonusType: 0,
                props: {
                    1:
                        GameConfigurations.customConfig.initialPlacePropNum != null
                            ? GameConfigurations.customConfig.initialPlacePropNum
                            : 0,
                },
            };
            this._saveData(EStorageKey.USER, this._userData);
        }
        this._inventoryData = this._loadData(EStorageKey.INVENTORY) ?? {};
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
            newLevelConfigs.findIndex((cfg) => cfg.level_type === 2)
        );
        this._cachedNewStartLevelCount =
            newLevelConfigs[this._cachedNewLoopLevelStartIndex - 1]?.level_a ?? 0;
        this._cachedNewLoopLevelCount = newLevelConfigs[newLevelConfigs.length - 1]?.level_a ?? 0;
        const levelConfigs = GameConfigurations.customConfig.levelConfigs;
        this._cachedLoopLevelStartIndex = Math.max(
            0,
            levelConfigs.findIndex((cfg) => cfg.level_type === 2)
        );
        this._cachedStartLevelCount = levelConfigs[this._cachedLoopLevelStartIndex - 1]?.level_a ?? 0;
        this._cachedLoopLevelCount = levelConfigs[levelConfigs.length - 1]?.level_a ?? 0;
        this._cachedCueConfigs = [];
        this._cachedNextCueIndex = Object.keys(this._userData.cues).length;
        this._fixGameData();
    }

    pocketInBonus(): boolean {
        const bonusType = this._userData.clearBonusType;
        this._userData.clearBonusType = ++this._userData.clearBonusType % 2;
        this._saveData(EStorageKey.USER, this._userData);
        return bonusType === 1;
    }

    requestCompleteGuide(guideID: number): any {
        this._userData.guideID = guideID;
        this._saveData(EStorageKey.USER, this._userData);
        return { code: 1, data: { gold_balance: 1000 }, ecp: 0, message: "" };
    }

    requestCompleteAd(adType: string, success: boolean): any {
        if (success && adType === AD_TYPE.baiqiu_prop) {
            this._userData.props[1] =
                (this._userData.props[1] ?? 0) +
                ConfigDataSys.ad_configMap.get(AD_TYPE.baiqiu_prop).type_para;
            this._saveData(EStorageKey.USER, this._userData);
        }
        return {
            code: success ? 1 : 2,
            data: { prop: this._userData.props },
            ecp: 0,
            message: "",
        };
    }

    _generateTable(difficulty: number, save: boolean): void {
        const difficultyConfigs = GameConfigurations.customConfig.levelDifficultyConfigs;
        let difficultyConfig = difficultyConfigs.find((cfg) => cfg.ball_lv === difficulty);
        let tables = difficultyConfig?.tables;
        if (!tables || tables.length <= 0) {
            console.error("invalid tables of difficulty: " + difficulty);
            tables = difficultyConfigs[Math.floor(Math.random() * difficultyConfigs.length)].tables;
        }
        const available: string[] = [];
        tables.forEach((tableId: string) => {
            if (!this._gameData.usedTableRecord[tableId]) {
                available.push(tableId);
            }
        });
        if (available.length <= 0) {
            tables.forEach((tableId: string) => {
                delete this._gameData.usedTableRecord[tableId];
            });
        }
        this._gameData.table = (available.length > 0 ? available : tables)[
            Math.floor(Math.random() * (available.length > 0 ? available : tables).length)
        ];
        this._gameData.usedTableRecord[this._gameData.table] = true;
        if (save) {
            this._saveData(EStorageKey.GAME, this._gameData);
        }
    }

    debugRequestOpenCues(cueIndex: number): any {
        if (cueIndex !== this._cachedNextCueIndex) {
            const cues: Record<number, boolean> = {};
            const count = Math.min(cueIndex, this._cachedCueConfigs.length);
            for (let i = 0; i < count; i++) {
                const id = this._cachedCueConfigs[i].id;
                cues[id] = this._userData.cues[id] ?? false;
            }
            cues[1] = true;
            this._userData.cues = cues;
            this._cachedNextCueIndex = Object.keys(this._userData.cues).length;
            if (this._userData.cues[this._userData.currentCue] == null) {
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
        const nextCue = this._cachedCueConfigs[this._cachedNextCueIndex];
        if (nextCue) {
            this._userData.cues[nextCue.id] = false;
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

    requestCompleteGame(success: boolean): any {
        let levelConfig: any;
        let levelCompleted = false;
        if (success) {
            ++this._gameData.newCompletedRoundCount;
            levelConfig = this._getNewLevelConfig(this._gameData.newCompletedRoundCount);
            levelCompleted = levelConfig.level_b === 1;
            if (levelCompleted) {
                ++this._gameData.completedLevelCount;
            }
            this._generateTable(levelConfig.ball_lv, false);
            this._saveData(EStorageKey.GAME, this._gameData);
        } else {
            levelConfig = this._getNewLevelConfig(this._gameData.newCompletedRoundCount);
            levelCompleted = false;
        }
        const roundCount = this._getCurrentTotalRound(levelConfig.level_type, levelConfig.level_a);
        return {
            code: 1,
            data: {
                level_a: this._gameData.completedLevelCount + 1,
                level_b: levelConfig.level_b,
                level_c: 1,
                roundCount,
                turnCount: 1,
                level_completed: levelCompleted,
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
                show_level_reward: success,
            },
            ecp: 0,
            message: "",
        };
    }

    debugRequestChangeRound(round: number): any {
        round = Math.max(1, Math.floor(round));
        this._gameData.newCompletedRoundCount = round - 1;
        const levelConfig = this._getNewLevelConfig(this._gameData.newCompletedRoundCount);
        const roundCount = this._getCurrentTotalRound(levelConfig.level_type, levelConfig.level_a);
        if (this._gameData.newCompletedRoundCount < this._cachedNewLoopLevelStartIndex) {
            this._gameData.completedLevelCount = levelConfig.level_a - 1;
        } else {
            const loopCount = Math.floor(
                (this._gameData.newCompletedRoundCount - this._cachedNewLoopLevelStartIndex) /
                    (GameConfigurations.customConfig.newLevelConfigs.length - this._cachedNewLoopLevelStartIndex)
            );
            this._gameData.completedLevelCount =
                levelConfig.level_a - 1 + this._cachedNewStartLevelCount + this._cachedNewLoopLevelCount * loopCount;
        }
        this._generateTable(levelConfig.ball_lv, false);
        this._saveData(EStorageKey.GAME, this._gameData);
        return {
            code: 1,
            data: {
                level_a: this._gameData.completedLevelCount + 1,
                level_b: levelConfig.level_b,
                level_c: 1,
                roundCount,
                turnCount: 1,
                turn_pass: this._gameData.newCompletedRoundCount,
                level_pass: this._gameData.completedLevelCount,
                table: this._gameData.table,
            },
            ecp: 0,
            message: "",
        };
    }

    deprecatedDebugRequestChangeLevel(level: number, round = 1, turn = 1): any {
        level = Math.max(1, Math.floor(level));
        round = Math.max(1, Math.floor(round));
        turn = Math.max(1, Math.floor(turn));
        this._gameData.completedLevelCount = level - 1;
        let levelType: number;
        let levelA: number;
        let loopIndex: number;
        const levelConfigs = GameConfigurations.customConfig.levelConfigs;
        if (level <= this._cachedStartLevelCount) {
            levelType = 1;
            levelA = level;
        } else {
            levelType = 2;
            levelA = ((level - this._cachedStartLevelCount - 1) % this._cachedLoopLevelCount) + 1;
            loopIndex = Math.floor((level - this._cachedStartLevelCount - 1) / this._cachedLoopLevelCount);
        }
        const roundConfigs = levelConfigs.filter((cfg) => cfg.level_type === levelType && cfg.level_a === levelA);
        round = Math.min(round, roundConfigs[roundConfigs.length - 1].level_b);
        const turnConfigs = roundConfigs.filter((cfg) => cfg.level_b === round);
        turn = Math.min(turn, turnConfigs[turnConfigs.length - 1].level_c);
        const configIndex = levelConfigs.findIndex(
            (cfg) =>
                cfg.level_type === levelType && cfg.level_a === levelA && cfg.level_b === round && cfg.level_c === turn
        );
        this._gameData.completedTurnCount = configIndex;
        if (loopIndex != null) {
            this._gameData.completedTurnCount += (levelConfigs.length - this._cachedLoopLevelStartIndex) * loopIndex;
        }
        const levelConfig = levelConfigs[configIndex];
        this._generateTable(levelConfig.ball_lv, false);
        this._saveData(EStorageKey.GAME, this._gameData);
        return {
            code: 1,
            data: {
                level_a: level,
                level_b: levelConfig.level_b,
                level_c: levelConfig.level_c,
                roundCount: roundConfigs[roundConfigs.length - 1].level_b,
                turnCount: turnConfigs.length,
                turn_pass: this._gameData.completedTurnCount,
                level_pass: this._gameData.completedLevelCount,
                table: this._gameData.table,
            },
            ecp: 0,
            message: "",
        };
    }

    _getOldLevelConfig(turnIndex: number): any {
        const levelConfigs = GameConfigurations.customConfig.levelConfigs;
        if (turnIndex < levelConfigs.length) {
            return levelConfigs[turnIndex];
        }
        const loopSize = levelConfigs.length - this._cachedLoopLevelStartIndex;
        return levelConfigs[((turnIndex - this._cachedLoopLevelStartIndex) % loopSize) + this._cachedLoopLevelStartIndex];
    }

    _getOldLevelInfo(levelType: number, levelA: number, levelB: number): { roundCount: number; turnCount: number } {
        let roundCount = 0;
        let turnCount = 0;
        const configs = GameConfigurations.customConfig.levelConfigs.filter(
            (cfg) => cfg.level_type === levelType && cfg.level_a === levelA
        );
        if (configs.length > 0) {
            roundCount = configs[configs.length - 1].level_b;
            turnCount = configs.filter((cfg) => cfg.level_b === levelB).length;
        }
        return { roundCount, turnCount };
    }

    requestLogin(): any {
        return { code: 1, data: {}, ecp: 0, message: "" };
    }

    _fixGameData(): void {
        const completedTurnCount = this._gameData.completedTurnCount ?? 0;
        if (this._gameData.newCompletedRoundCount == null) {
            const levelA = this._gameData.completedLevelCount + 1;
            const oldConfig = this._getOldLevelConfig(completedTurnCount);
            let levelType: number;
            let levelIndex: number;
            let loopIndex: number;
            if (levelA <= this._cachedNewStartLevelCount) {
                levelType = 1;
                levelIndex = levelA;
            } else {
                levelType = 2;
                levelIndex = ((levelA - this._cachedNewStartLevelCount - 1) % this._cachedNewLoopLevelCount) + 1;
                loopIndex = Math.floor((levelA - this._cachedNewStartLevelCount - 1) / this._cachedNewLoopLevelCount);
            }
            const newLevelConfigs = GameConfigurations.customConfig.newLevelConfigs;
            const roundConfigs = newLevelConfigs.filter(
                (cfg) => cfg.level_type === levelType && cfg.level_a === levelIndex
            );
            const round = Math.min(oldConfig.level_b, roundConfigs[roundConfigs.length - 1].level_b);
            const configIndex = newLevelConfigs.findIndex(
                (cfg) => cfg.level_type === levelType && cfg.level_a === levelIndex && cfg.level_b === round
            );
            this._gameData.newCompletedRoundCount = configIndex;
            if (loopIndex != null) {
                this._gameData.newCompletedRoundCount +=
                    (newLevelConfigs.length - this._cachedNewLoopLevelStartIndex) * loopIndex;
            }
            const levelConfig = newLevelConfigs[configIndex];
            this._generateTable(levelConfig.ball_lv, false);
            this._saveData(EStorageKey.GAME, this._gameData);
        }
    }

    _loadData(key: string): any {
        const raw = cc.sys.localStorage.getItem(key) ?? "";
        let data = null;
        try {
            data = JSON.parse(raw);
        } catch {
            console.log("failed to load cache data <" + key + ">: " + raw);
        }
        return data;
    }

    _saveData(key: string, data: any): void {
        if (typeof data === "object") {
            cc.sys.localStorage.setItem(key, JSON.stringify(data));
        } else {
            console.error("invalid data when saving: " + typeof data);
        }
    }

    _getNewLevelConfig(roundIndex: number): any {
        const levelConfigs = GameConfigurations.customConfig.newLevelConfigs;
        if (roundIndex < levelConfigs.length) {
            return levelConfigs[roundIndex];
        }
        const loopSize = levelConfigs.length - this._cachedNewLoopLevelStartIndex;
        return levelConfigs[((roundIndex - this._cachedNewLoopLevelStartIndex) % loopSize) + this._cachedNewLoopLevelStartIndex];
    }

    requestChangeCue(cueId: number): any {
        if (this._userData.cues[cueId] === true) {
            this._userData.currentCue = cueId;
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

    deprecatedDebugRequestChangeTurn(turn: number): any {
        turn = Math.max(1, Math.floor(turn));
        this._gameData.completedTurnCount = turn - 1;
        const levelConfig = this._getOldLevelConfig(this._gameData.completedTurnCount);
        const levelInfo = this._getOldLevelInfo(levelConfig.level_type, levelConfig.level_a, levelConfig.level_b);
        if (this._gameData.completedTurnCount < this._cachedLoopLevelStartIndex) {
            this._gameData.completedLevelCount = levelConfig.level_a - 1;
        } else {
            const loopCount = Math.floor(
                (this._gameData.completedTurnCount - this._cachedLoopLevelStartIndex) /
                    (GameConfigurations.customConfig.levelConfigs.length - this._cachedLoopLevelStartIndex)
            );
            this._gameData.completedLevelCount =
                levelConfig.level_a - 1 + this._cachedStartLevelCount + this._cachedLoopLevelCount * loopCount;
        }
        this._generateTable(levelConfig.ball_lv, false);
        this._saveData(EStorageKey.GAME, this._gameData);
        return {
            code: 1,
            data: {
                level_a: this._gameData.completedLevelCount + 1,
                level_b: levelConfig.level_b,
                level_c: levelConfig.level_c,
                roundCount: levelInfo.roundCount,
                turnCount: levelInfo.turnCount,
                turn_pass: this._gameData.completedTurnCount,
                level_pass: this._gameData.completedLevelCount,
                table: this._gameData.table,
            },
            ecp: 0,
            message: "",
        };
    }

    debugRequestChangeLevel(level: number, round = 1): any {
        level = Math.max(1, Math.floor(level));
        round = Math.max(1, Math.floor(round));
        this._gameData.completedLevelCount = level - 1;
        let levelType: number;
        let levelA: number;
        let loopIndex: number;
        const levelConfigs = GameConfigurations.customConfig.newLevelConfigs;
        if (level <= this._cachedNewStartLevelCount) {
            levelType = 1;
            levelA = level;
        } else {
            levelType = 2;
            levelA = ((level - this._cachedNewStartLevelCount - 1) % this._cachedNewLoopLevelCount) + 1;
            loopIndex = Math.floor((level - this._cachedNewStartLevelCount - 1) / this._cachedNewLoopLevelCount);
        }
        const roundConfigs = levelConfigs.filter((cfg) => cfg.level_type === levelType && cfg.level_a === levelA);
        round = Math.min(round, roundConfigs[roundConfigs.length - 1].level_b);
        const configIndex = levelConfigs.findIndex(
            (cfg) => cfg.level_type === levelType && cfg.level_a === levelA && cfg.level_b === round
        );
        this._gameData.newCompletedRoundCount = configIndex;
        if (loopIndex != null) {
            this._gameData.newCompletedRoundCount +=
                (levelConfigs.length - this._cachedNewLoopLevelStartIndex) * loopIndex;
        }
        const levelConfig = levelConfigs[configIndex];
        this._generateTable(levelConfig.ball_lv, false);
        this._saveData(EStorageKey.GAME, this._gameData);
        return {
            code: 1,
            data: {
                level_a: level,
                level_b: levelConfig.level_b,
                level_c: 1,
                roundCount: roundConfigs[roundConfigs.length - 1].level_b,
                turnCount: 1,
                turn_pass: this._gameData.newCompletedRoundCount,
                level_pass: this._gameData.completedLevelCount,
                table: this._gameData.table,
            },
            ecp: 0,
            message: "",
        };
    }

    _getCurrentTotalRound(levelType: number, levelA: number): number {
        let roundCount = 0;
        const configs = GameConfigurations.customConfig.newLevelConfigs.filter(
            (cfg) => cfg.level_type === levelType && cfg.level_a === levelA
        );
        if (configs.length > 0) {
            roundCount = configs[configs.length - 1].level_b;
        }
        return roundCount;
    }

    requestUserInfo(onSuccess: (res: any) => void, onFail: (err: any) => void): void {
        cc.resources.load("config/info", cc.JsonAsset, (err, asset: cc.JsonAsset) => {
            if (!err && asset) {
                const levelConfig = this._getNewLevelConfig(this._gameData.newCompletedRoundCount);
                const roundCount = this._getCurrentTotalRound(levelConfig.level_type, levelConfig.level_a);
                const config = asset.json;
                const remoteConfig = GameConfigurations.remoteOriginalConfig;
                if (typeof remoteConfig === "object") {
                    GameConfigurations.mergeConfig(config, remoteConfig);
                }
                if (!this._gameData.table) {
                    this._generateTable(levelConfig.ball_lv, true);
                }
                const clubConfigs = config.tables.club;
                this._cachedCueConfigs.length = 0;
                for (const key in clubConfigs) {
                    const clubConfig = clubConfigs[key];
                    const cueConfig: any = { id: Number(key) };
                    Object.keys(clubConfig).forEach((prop) => {
                        cueConfig[prop] = clubConfig[prop];
                    });
                    this._cachedCueConfigs.push(cueConfig);
                }
                this._cachedCueConfigs.sort((a, b) => a.id - b.id);
                config.user_info.create_time = this._userData.birthTime;
                config.user_info.guide_id = this._userData.guideID;
                config.user_info.level_pass_success_count = this._gameData.completedLevelCount;
                config.user_info.cash_balance = 0;
                config.user_info.gold_balance = 0;
                config.game_info.level_a = this._gameData.completedLevelCount + 1;
                config.game_info.level_b = levelConfig.level_b;
                config.game_info.level_c = 1;
                config.game_info.roundCount = roundCount;
                config.game_info.turnCount = 1;
                config.game_info.table = this._gameData.table;
                config.game_info.turn_pass = this._gameData.newCompletedRoundCount;
                config.game_info.level_pass = this._gameData.completedLevelCount;
                config.game_info.get_clubs = this._userData.cues;
                config.game_info.use_club_id = this._userData.currentCue;
                config.game_info.next_club_id = this._cachedCueConfigs[this._cachedNextCueIndex]?.id;
                config.game_info.prop = this._userData.props;
                onSuccess({ code: 1, data: config, ecp: 0, message: "" });
            } else {
                onFail(err != null ? err : new Error("unknown reason"));
            }
        });
    }

    requestUnlockCue(cueId: number, equip: boolean): any {
        let changed = false;
        if (this._userData.cues[cueId] === false) {
            this._userData.cues[cueId] = true;
            changed = true;
        }
        if (equip) {
            this._userData.currentCue = cueId;
            changed = true;
        }
        if (changed) {
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
        let success = false;
        const count = this._userData.props[1] ?? 0;
        if (count > 0) {
            this._userData.props[1] = count - 1;
            this._saveData(EStorageKey.USER, this._userData);
            success = true;
        }
        return {
            code: 1,
            data: { prop: success ? this._userData.props : null },
            ecp: 0,
            message: "",
        };
    }
}
