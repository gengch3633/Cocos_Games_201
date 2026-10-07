import AudioManager from "./AudioManager";
import ConfigDataSys from "./ConfigDataSys";
import DB from "./DB";
import GlobalConfig from "./GlobalConfig";
import GuideManager from "./GuideManager";
import LevelTableConfigManager from "./LevelTableConfigManager";
import util from "./util";

const BallLogicMgr: any = {
    MODE: {
        ME_Free: 0,
        ME_Editing: 1,
        ME_PlayMV: 2,
        PVE_Infinity: 10,
        PVE_Challenge: 11,
        PVE_AI: 12,
        PVP_Friend: 20,
        PVP_Hall: 21,
    },
    BallIDType_White: 1,
    BallIDType_Normal: 2,
    isFristOpen: true,
    isWin: false,
    publicTableList: null,
    otherPublicTableList: null,
    editingTableInfo: null,
    editingTryMaxNum: 5,
    challengeTryMaxNum: 2,
    last_pageType: null,
    last_pack_ball: null,
    last_pack_color: null,
    last_pack_particle: null,
    rewardMaxNum_oneDay: 3,
    shareRewardMaxNum_oneDay: 3,
    autoAdAtLogin: 0,
    msgCache_balls: [],
    physicParams: [{ speed_power_reduce: 0.96, accele_power_reduce: 0.6 }],
    getParam(key: string) {
        return BallLogicMgr.physicParams[0][key];
    },
    shop_config() {
        return {
            balls_default: [
                { name: "white", default: true },
                { name: "black", default: true },
                { name: "ball11", default: true },
                { name: "ball12", default: true },
                { name: "ball13", default: true },
                { name: "ball14", default: true },
                { name: "ball15", default: true },
                { name: "ball16", default: true },
                { name: "ball17", default: true },
                { name: "ball18", default: true },
                { name: "ball21", default: true },
                { name: "ball22", default: true },
                { name: "ball23", default: true },
                { name: "ball24", default: true },
                { name: "ball25", default: true },
                { name: "ball26", default: true },
                { name: "ball27", default: true },
                { name: "ball28", default: true },
            ],
            balls_more: [
                { cid: 1, name: "emoj1", default: false, cost: 500, matIdx: 20 },
                { cid: 2, name: "emoj2", default: false, cost: 500, matIdx: 21 },
                { cid: 3, name: "apple", default: false, cost: 500, matIdx: 22 },
            ],
            ball_colors: [
                { cid: 1, name: "white", cost: 200, color: new cc.Color(255, 255, 255, 255) },
                { cid: 2, name: "red", cost: 300, color: new cc.Color(255, 0, 0, 100) },
                { cid: 3, name: "green", cost: 300, color: new cc.Color(0, 255, 0, 100) },
                { cid: 4, name: "blue", cost: 300, color: new cc.Color(0, 0, 255, 150) },
                { cid: 5, name: "yellow", cost: 300, color: new cc.Color(255, 255, 0, 255) },
                { cid: 6, name: "purple", cost: 300, color: new cc.Color(255, 0, 255, 255) },
                { cid: 7, name: "orange", cost: 300, color: new cc.Color(255, 125, 0, 255) },
            ],
            ball_particles: [
                { cid: 1, name: "red", style: 1, file: "red1", cost: 300 },
                { cid: 2, name: "green", style: 1, file: "green1", cost: 300 },
                { cid: 3, name: "blue", style: 1, file: "by1", cost: 300 },
                { cid: 4, name: "yellow", style: 1, file: "yellow1", cost: 300 },
                { cid: 5, name: "pink", style: 1, file: "pink1", cost: 300 },
                { cid: 6, name: "gold", style: 1, file: "gold1", cost: 300 },
            ],
        };
    },
    isModifyBallDir: true,
};

BallLogicMgr.ballDirModifyThreshold = (1 / 9) * Math.PI;

BallLogicMgr.pack_ballMatIdx = (idx: number) => {
    GlobalConfig.shop_ball_add(idx);
};

BallLogicMgr.unpack_ballMatIdx = (idx: number) => {
    GlobalConfig.shop_ball_remove(idx);
};

BallLogicMgr.pack_color = (color: number) => {
    GlobalConfig.shop_color_set(color);
};

BallLogicMgr.pack_particle = (particle: number) => {
    GlobalConfig.shop_particle_set(particle);
};

BallLogicMgr.getBy_cid = (cid: number, list: any[]) => {
    for (let i = 0; i < list.length; i++) {
        if (list[i].cid == cid) {
            return list[i];
        }
    }
    return null;
};

BallLogicMgr.addCoin = (amount: number, callback: (coin: number) => void) => {
    let coin = DB.userInfo.coin;
    DB.updateUserInfoKV("coin", amount, () => {
        coin += amount;
        console.log("add coin suc", amount, coin);
        BallLogicMgr.playCoinReward();
        DB.userInfo.coin = coin;
        callback(coin);
    });
};

BallLogicMgr.coin_notEnough = () => {};

BallLogicMgr.buy_ball = (idx: number, callback: (idx: number, status: any) => void) => {
    DB.updateUserInfoKV("bmIdx", idx, (res: any) => {
        const status = res.data.status;
        console.log("bmIdx status", status);
        callback(idx, status);
    });
};

BallLogicMgr.buy_color = (idx: number, callback: (idx: number, status: any) => void) => {
    DB.updateUserInfoKV("btx1", idx, (res: any) => {
        const status = res.data.status;
        console.log("btx1 status", status);
        callback(idx, status);
    });
};

BallLogicMgr.buy_particle = (idx: number, callback: (idx: number, status: any) => void) => {
    DB.updateUserInfoKV("btx2", idx, (res: any) => {
        const status = res.data.status;
        console.log("btx2 status", status);
        callback(idx, status);
    });
};

BallLogicMgr.lookVideo = () => {};

BallLogicMgr.resetInHall = () => {
    BallLogicMgr.editingTableInfo = null;
    BallLogicMgr.game_mode = BallLogicMgr.MODE.ME_Free;
};

BallLogicMgr.pack_WinInfo = (sec: number) => ({
    openid: DB.userInfo.openid,
    name: DB.userInfo.name,
    pic: DB.userInfo.pic,
    sec,
});

BallLogicMgr.pack_PublicTableInfo = (tableInfo: any, existing?: boolean) => {
    if (!existing) {
        const now = new Date().getTime();
        tableInfo.time = now;
        const tableID = Math.floor(new Date().getTime() / 1e3);
        tableInfo.tableID = tableID;
        tableInfo.name = DB.userInfo.name + tableID;
    }
    return {
        openid: DB.userInfo.openid,
        sID: tableInfo.sID,
        tableID: tableInfo.tableID,
        tableName: tableInfo.name,
        tableInfo,
        name: DB.userInfo.name,
        icon: DB.userInfo.pic,
        time: tableInfo.time,
        totalNum: 0,
        winNum: 0,
        zanIDS: 0,
        tj: 0,
        pr: 0,
        p1: 0,
        p2: 0,
    };
};

BallLogicMgr.pack_BallMI = (ballMatIdx?: number, ballType?: number, ballNum?: number, p1?: number, p2?: number) => ({
    ballMatIdx: ballMatIdx || 0,
    ballType: ballType || BallLogicMgr.BallIDType_Normal,
    ballNum: ballNum || 0,
    p1: p1 || 0,
    p2: p2 || 0,
});

BallLogicMgr.pack_condition = (ganNum?: number, cdBalls?: any[], lHallID?: any[], type?: number, p1?: number, p2?: number) => ({
    type: type || 1,
    cdBalls: cdBalls || [],
    lHallID: lHallID || [],
    ganNum: ganNum || 1,
    p1: p1 || 0,
    p2: p2 || 0,
});

BallLogicMgr.pack_BallInfo = (ballID: number, ballType: number, x: number, y: number, ballMatIdx?: number, tx1?: number, tx2?: number) => ({
    ballID,
    ballType,
    x,
    y,
    tx1: tx1 || 0,
    tx2: tx2 || 0,
    ballMatIdx: ballMatIdx || 0,
    p1: 0,
    p2: 0,
    p3: 0,
});

BallLogicMgr.pack_tableInfo = (name?: string) => {
    const tableInfo = {
        tableID: -1,
        sID: -1,
        name: name || DB.userInfo.name + -1,
        time: new Date().getTime(),
        balls: [],
        condition: BallLogicMgr.pack_condition(),
        cue: { cueID: 0, Mat: 0, p1: 0, p2: 0 },
        isPass: 0,
        tableMat: 0,
        color: -1,
        particle: -1,
        p1: 0,
        p2: 0,
        p3: 0,
    };
    tableInfo.color = GlobalConfig.shop_color_get();
    tableInfo.particle = GlobalConfig.shop_particle_get();
    return tableInfo;
};

BallLogicMgr.pack_answer = (angle: number, power: number, posT?: number, posV?: number, p1?: number, p2?: number) => ({
    angle,
    power,
    posT: posT || 0,
    posV: posV || 0,
    p1: p1 || 0,
    p2: p2 || 0,
});

BallLogicMgr.gotoHall = () => {
    console.log("gotoHall");
    cc.director.loadScene("game_main");
};

BallLogicMgr.gotoTableEditor = () => {
    cc.director.loadScene("game_table_editor");
};

BallLogicMgr.gotoShop = () => {
    cc.director.loadScene("game_shop");
};

BallLogicMgr.gotoEditorAndCreateNew = () => {
    console.log("gotoEditorAndCreateNew");
    const tableInfo = BallLogicMgr.pack_tableInfo();
    BallLogicMgr.editingTableInfo = tableInfo;
    BallLogicMgr.gotoEditor(tableInfo);
};

BallLogicMgr.gotoInfoList = () => {
    console.log("gotoListInfo");
    BallLogicMgr.gotoEditorAndCreateNew();
};

BallLogicMgr.backtoInfoList = () => {
    BallLogicMgr.gotoHall();
};

BallLogicMgr.loadLevelConfig = (level: number, callback?: (asset: cc.JsonAsset) => void) => {
    cc.loader.loadRes("temp_file/l_" + (level + 1), cc.JsonAsset, (err, asset: cc.JsonAsset) => {
        if (asset) {
            asset.json.tableInfo.condition.ganNum = Number(ConfigDataSys.global_ConfigMap.get("line_lv_life"));
            callback?.(asset);
        }
    });
};

BallLogicMgr.loadLevelConfigOnServer = (level: number, callback?: (data: any) => void) => {
    BallLogicMgr.isGuideLevel = level < 1 && !GuideManager.Instance.id;
    LevelTableConfigManager.getLevelTableConfigByLevelID(level + 1).then(
        (config) => {
            const item = BallLogicMgr.freemode_loadjs(1).arr[0];
            item.tableInfo.tableID = config.table_key;
            const balls: any[] = [];
            item.tableInfo.balls = balls;
            config.balls.forEach((ball: any) => {
                const ballID = ball.ballID == 0 ? 100 : 200 + ball.ballID;
                balls.push({
                    ballID,
                    ballType: ball.ballID == 0 ? 1 : 2,
                    x: ball.x,
                    y: ball.y,
                    tx1: 0,
                    tx2: 0,
                    ballMatIdx: ball.ballID == 0 ? 0 : ball.ballID + 1,
                    p1: 0,
                    p2: 0,
                    p3: 0,
                });
            });
            item.tableInfo.condition.ganNum = Number(ConfigDataSys.global_ConfigMap.get("line_lv_life"));
            callback?.(item);
        },
        () => {
            callback?.(null);
        }
    );
};

BallLogicMgr.gotoTable_free = (jsonCfg: any, callback?: () => void, skipLoadScene = false) => {
    BallLogicMgr.freeMode_jsonCfg = util.clone(jsonCfg);
    const idx = BallLogicMgr.freeMode_jsonCfg_idx;
    console.log("jkd BallLogicMgr.gotoTable_free ---------- idx:" + idx);
    BallLogicMgr.loadLevelConfigOnServer(idx, (data) => {
        BallLogicMgr.game_mode = BallLogicMgr.MODE.ME_Free;
        BallLogicMgr.editingTableInfo = data.tableInfo;
        callback?.();
        if (!skipLoadScene) {
            cc.director.loadScene("game_tabel");
        }
    });
};

BallLogicMgr.gotoEditor = (config: any) => {
    BallLogicMgr.freeMode_totalGanNum = 0;
    const modeConfig = BallLogicMgr.freemode_loadjs(1);
    if (modeConfig) {
        BallLogicMgr.freeMode_jsonCfg = util.clone(modeConfig);
        BallLogicMgr.freeMode_jsonCfg_idx = 1;
        const item = BallLogicMgr.freemode_loadjs(1).arr[0];
        item.tableInfo.tableID = config.table_key;
        const balls: any[] = [];
        item.tableInfo.balls = balls;
        config.balls.forEach((ball: any) => {
            const ballID = ball.ballID == 0 ? 100 : 200 + ball.ballID;
            balls.push({
                ballID,
                ballType: ball.ballID == 0 ? 1 : 2,
                x: ball.x,
                y: ball.y,
                tx1: 0,
                tx2: 0,
                ballMatIdx: ball.ballID == 0 ? 0 : ball.ballID + 1,
                p1: 0,
                p2: 0,
                p3: 0,
            });
        });
        item.tableInfo.condition.ganNum = Number(ConfigDataSys.global_ConfigMap.get("line_lv_life"));
        BallLogicMgr.game_mode = BallLogicMgr.MODE.ME_Free;
        BallLogicMgr.editingTableInfo = item.tableInfo;
        cc.director.loadScene("game_tabel");
    } else {
        console.log("error:gotoTable_free_loadfirst json is null");
    }
};

BallLogicMgr.freemode_loadjs = (idx: number) => {
    const moduleName = "FModeConfig" + Math.min(2, Math.floor(idx / 10) + 1);
    const mod = require("./" + moduleName);
    return mod ? mod.json : null;
};

BallLogicMgr.freeMode_jsonCfg_idx = 0;
BallLogicMgr.freeMode_totalGanNum = 0;
BallLogicMgr.is_record = false;
BallLogicMgr.is_switching = false;
BallLogicMgr.record_time = 0;
BallLogicMgr.recorder = null;
BallLogicMgr.lastStop_time = 0;
BallLogicMgr.updateRecIcon = null;

BallLogicMgr.isStartTooFast = () => new Date().getTime() - BallLogicMgr.lastStop_time < 1e3;

BallLogicMgr.showModal = () => {};

BallLogicMgr.initRecord = () => {
    if (!BallLogicMgr.recorder) {
        BallLogicMgr.recorder = wx.getGameRecorderManager();
        BallLogicMgr.recorder.onStart(() => {
            console.log("rec onStart");
            BallLogicMgr.is_record = true;
            BallLogicMgr.is_switching = false;
        });
        BallLogicMgr.recorder.onStop((res: any) => {
            const videoPath = res.videoPath;
            console.log("rec onStop", BallLogicMgr.updateRecIcon);
            BallLogicMgr.is_switching = false;
            BallLogicMgr.is_record = false;
            BallLogicMgr.lastStop_time = new Date().getTime();
            if (BallLogicMgr.updateRecIcon) {
                console.log("call BallLogicMgr.updateRecIcon", typeof BallLogicMgr.updateRecIcon);
                BallLogicMgr.updateRecIcon();
            }
            wx.showModal({
                title: "录屏完成",
                content: "录屏已经完成，是否发布这个录屏内容？",
                success: (result: any) => {
                    if (result.confirm) {
                        console.log("confirm, continued");
                        wx.shareVideo({
                            videoPath: "" + videoPath,
                            success: () => {},
                            fail: () => {},
                        });
                    } else if (result.cancel) {
                        console.log("cancel, cold");
                    }
                },
                fail: () => {
                    console.log("showModal调用失败");
                },
            });
        });
        return BallLogicMgr.recorder;
    }
};

BallLogicMgr.gotoTable_freeMode_useCacheIdx = (useCache: boolean) => {
    if (useCache) {
        const best = GlobalConfig.freeModeLastBest_get();
        BallLogicMgr.freeMode_totalGanNum = Number(best.ganNum);
        BallLogicMgr.gotoTable_free_loadfirst(Number(best.idx) + 1);
    } else {
        BallLogicMgr.freeMode_totalGanNum = 0;
        BallLogicMgr.gotoTable_free_loadfirst(0);
    }
};

BallLogicMgr.loadTable = (idx: number, fileName: string, callback?: () => void, skipLoadScene = false) => {
    BallLogicMgr.freeMode_totalGanNum = 0;
    const modeConfig = BallLogicMgr.freemode_loadjs(1);
    if (modeConfig) {
        BallLogicMgr.freeMode_jsonCfg_idx = idx;
        BallLogicMgr.freeMode_jsonCfg = util.clone(modeConfig);
        const onLoaded = (item: any) => {
            BallLogicMgr.game_mode = BallLogicMgr.MODE.ME_Free;
            BallLogicMgr.editingTableInfo = item.tableInfo;
            callback?.();
            if (!skipLoadScene) {
                cc.director.loadScene("game_tabel");
            }
        };
        BallLogicMgr.isGuideLevel = idx < 1 && !GuideManager.Instance.id;
        LevelTableConfigManager.getLevelTableConfigByFileName(fileName).then(
            (config) => {
                const item = modeConfig.arr[0];
                item.tableInfo.tableID = config.table_key;
                const balls: any[] = [];
                item.tableInfo.balls = balls;
                config.balls.forEach((ball: any) => {
                    const ballID = ball.ballID == 0 ? 100 : 200 + ball.ballID;
                    balls.push({
                        ballID,
                        ballType: ball.ballID == 0 ? 1 : 2,
                        x: ball.x,
                        y: ball.y,
                        tx1: 0,
                        tx2: 0,
                        ballMatIdx: ball.ballID == 0 ? 0 : ball.ballID + 1,
                        p1: 0,
                        p2: 0,
                        p3: 0,
                    });
                });
                item.tableInfo.condition.ganNum = Number(ConfigDataSys.global_ConfigMap.get("line_lv_life"));
                onLoaded(item);
            },
            () => onLoaded(null)
        );
    } else {
        console.error("gotoTable_free_loadfirst json is null");
    }
};

BallLogicMgr.loadTable_freeMode_useIdx = (idx: number, callback?: () => void, skipLoadScene = false) => {
    BallLogicMgr.freeMode_totalGanNum = 0;
    BallLogicMgr.gotoTable_free_loadfirst(idx, callback, skipLoadScene);
};

BallLogicMgr.loadTable_freeMode_useCacheIdx = (useCache: boolean, callback?: () => void) => {
    if (useCache) {
        const best = GlobalConfig.freeModeLastBest_get();
        BallLogicMgr.freeMode_totalGanNum = Number(best.ganNum);
        BallLogicMgr.gotoTable_free_loadfirst(Number(best.idx) + 1, callback, true);
    } else {
        BallLogicMgr.freeMode_totalGanNum = 0;
        BallLogicMgr.gotoTable_free_loadfirst(0, callback, true);
    }
};

BallLogicMgr.gotoTable_free_loadfirst = (idx: number, callback?: () => void, skipLoadScene = false) => {
    const modeConfig = BallLogicMgr.freemode_loadjs(idx < 0 ? 0 : idx);
    if (modeConfig) {
        BallLogicMgr.freeMode_jsonCfg_idx = idx;
        BallLogicMgr.gotoTable_free(modeConfig, callback, skipLoadScene);
    } else {
        console.log("error:gotoTable_free_loadfirst json is null");
    }
};

BallLogicMgr.getFreeModeCurCfgItem = () => {
    if (BallLogicMgr.freeMode_jsonCfg) {
        const arr = BallLogicMgr.freeMode_jsonCfg.arr;
        let idx = BallLogicMgr.freeMode_jsonCfg_idx;
        idx %= 50;
        if (idx < arr.length) {
            return arr[idx];
        }
    }
    return null;
};

BallLogicMgr.gotoFreeModeNextCfgItem = (callback: (info: any) => void) => {
    if (BallLogicMgr.freeMode_jsonCfg) {
        let idx = BallLogicMgr.freeMode_jsonCfg_idx + 1;
        idx %= 50;
        if (idx == 0) {
            const modeConfig = BallLogicMgr.freemode_loadjs(BallLogicMgr.freeMode_jsonCfg_idx + 1);
            if (modeConfig) {
                BallLogicMgr.freeMode_jsonCfg = util.clone(modeConfig);
                BallLogicMgr.loadLevelConfig(0, (asset) => {
                    BallLogicMgr.freeMode_jsonCfg_idx = 0;
                    BallLogicMgr.editingTableInfo = asset.json.tableInfo;
                    callback(BallLogicMgr.editingTableInfo);
                });
            } else {
                callback(null);
            }
        } else if (idx < 50) {
            BallLogicMgr.loadLevelConfig(idx, (asset) => {
                BallLogicMgr.freeMode_jsonCfg_idx += 1;
                BallLogicMgr.editingTableInfo = asset.json.tableInfo;
                callback(BallLogicMgr.editingTableInfo);
            });
        } else {
            callback(null);
        }
    } else {
        callback(null);
    }
};

BallLogicMgr.gotoTable_editing = (tableInfo: any) => {
    BallLogicMgr.game_mode = BallLogicMgr.MODE.ME_Editing;
    BallLogicMgr.editingTableInfo = tableInfo;
    cc.director.loadScene("game_tabel");
};

BallLogicMgr.gotoTable_challenge = (tableInfo: any, publicTableInfo: any) => {
    BallLogicMgr.game_mode = BallLogicMgr.MODE.PVE_Challenge;
    BallLogicMgr.editingTableInfo = tableInfo;
    BallLogicMgr.challenging_publictableInfo = publicTableInfo;
    cc.director.loadScene("game_tabel");
};

BallLogicMgr.clickTableEditListItem = (index: number) => {
    if (BallLogicMgr.publicTableList && index < BallLogicMgr.publicTableList.length) {
        const tableInfo = BallLogicMgr.publicTableList[index].tableInfo;
        BallLogicMgr.editingTableInfo = tableInfo;
        cc.director.loadScene("game_table_editor");
    }
};

BallLogicMgr.clickTableEditListItem_play = () => {};

BallLogicMgr.clickTableEditListItem_challenge = (item: any) => {
    if (item) {
        BallLogicMgr.gotoTable_challenge(item.tableInfo, item);
    }
};

BallLogicMgr.getTableArray = (openid?: string) => {
    openid = openid || DB.userInfo.openid;
    BallLogicMgr.allTables.get(openid);
    const result: any[] = [];
    for (const value of BallLogicMgr.tableInfos.values()) {
        result.push(value);
    }
    return result;
};

BallLogicMgr.last_zan_ms = 0;

BallLogicMgr.do_zan = (sID: any, callback: (res: any) => void) => {
    if (new Date().getTime() - BallLogicMgr.last_zan_ms >= 6e4) {
        DB.updateOnePublicTableInfo(sID, "zanIDS", 1, (res) => {
            BallLogicMgr.last_zan_ms = new Date().getTime();
            callback(res);
        });
    } else if (DB.isTT()) {
        tt.showToast({
            title: "请休息一会儿再点!",
            duration: 800,
            success: (res) => console.log("" + res),
            fail: () => console.log("showToast调用失败"),
        });
    }
};

BallLogicMgr.publicTableList_removeBysID = (sID: any) => {
    if (BallLogicMgr.publicTableList) {
        let index = -1;
        for (let i = 0; i < BallLogicMgr.publicTableList.length; i++) {
            if (BallLogicMgr.publicTableList[i].sID == sID) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            BallLogicMgr.publicTableList.splice(index, 1);
        }
    }
};

BallLogicMgr.saveFreeModeFinishIdx = () => {
    const idx = BallLogicMgr.freeMode_jsonCfg_idx;
    GlobalConfig.freeModeIdx_set(idx);
    let isBetter = false;
    const best = GlobalConfig.freeModeLastBest_get();
    if (idx > Number(best.idx)) {
        isBetter = true;
    } else if (idx == Number(best.idx) && BallLogicMgr.freeMode_totalGanNum < Number(best.ganNum)) {
        isBetter = true;
    }
    if (isBetter) {
        console.log("isBetter true");
        GlobalConfig.freeModeLastBest_set({ idx, ganNum: BallLogicMgr.freeMode_totalGanNum });
    }
};

BallLogicMgr.saveOneMoreRewardTime = () => {
    let times = Number(GlobalConfig.rewardTimes_get());
    times += 1;
    GlobalConfig.rewardTimes_set(times);
};

BallLogicMgr.checkCanRewardToday = () => {
    let times = Number(GlobalConfig.rewardTimes_get());
    console.log("rewardTimes_get", times);
    return !(times >= BallLogicMgr.rewardMaxNum_oneDay);
};

BallLogicMgr.saveOneMoreShareRewardTime = () => {
    let times = Number(GlobalConfig.shareRewardTimes_get());
    times += 1;
    GlobalConfig.shareRewardTimes_set(times);
};

BallLogicMgr.checkCanShareRewardToday = () => {
    let times = Number(GlobalConfig.shareRewardTimes_get());
    console.log("shareRewardTimes_get", times);
    return !(times >= BallLogicMgr.shareRewardMaxNum_oneDay);
};

BallLogicMgr.pushArrayBuffer = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    const str = String.fromCharCode.apply(null, bytes as any);
    BallLogicMgr.msgCache_balls.push(str);
};

BallLogicMgr.cur_bgMusicID = null;
BallLogicMgr.loading_bgMusic = false;
BallLogicMgr.playBgMusic = () => {};
BallLogicMgr.stopBgMusic = () => {};
BallLogicMgr.playBallCueCollide = () => {};
BallLogicMgr.last_ballCollideSound = 0;

BallLogicMgr.playBallCollideSound = () => {
    AudioManager.getInstance().playMusic("pool_ball_bump");
};

BallLogicMgr.playBoardCollideSound = () => {
    AudioManager.getInstance().playMusic("pool_ball_bumptable");
};

BallLogicMgr.playSound = (name: string, skipIfPlaying?: boolean) => {
    if (!skipIfPlaying || !AudioManager.getInstance().isPlaying(name)) {
        AudioManager.getInstance().playMusic(name);
    }
};

BallLogicMgr.playUIClick = () => {};
BallLogicMgr.playCoinReward = () => {
    AudioManager.getInstance().playMusic("coin_reward");
};
BallLogicMgr.showAD = () => {};
BallLogicMgr.destroyAD = () => {};
BallLogicMgr.lastCB_ms = 0;
BallLogicMgr.showAD_video = () => false;
BallLogicMgr.showAD_video2 = () => false;

export default BallLogicMgr;
