import DB from "./DB";
import AudioManager from "./AudioManager";
import ConfigDataSys from "./ConfigDataSys";
import EventMgr from "./EventMgr";
import * as GlobalConfig from "./GlobalConfig";
import GuideManager from "./GuideManager";
import LevelTableConfigManager from "./LevelTableConfigManager";
import * as util from "./util";
import FModeConfig1 from "./FModeConfig1";
import FModeConfig2 from "./FModeConfig2";

EventMgr;

const fModeConfigModules: Record<string, any> = {
    FModeConfig1,
    FModeConfig2,
};

function createForOfIteratorHelper<T>(e: Iterable<T> | ArrayLike<T>, t?: boolean): Iterator<T> | (() => IteratorResult<T>) {
    let o: Iterator<T> | ArrayLike<T>;
    if (typeof Symbol === "undefined" || e == null || (e as any)[Symbol.iterator] == null) {
        if (Array.isArray(e) || (o = unsupportedIterableToArray(e)) || (t && e && typeof (e as any).length === "number")) {
            o && (e = o as any);
            let n = 0;
            return function () {
                return n >= (e as T[]).length
                    ? { done: true }
                    : { done: false, value: (e as T[])[n++] };
            };
        }
        throw new TypeError(
            "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
    }
    o = (e as Iterable<T>)[Symbol.iterator]();
    return o.next.bind(o);
}

function unsupportedIterableToArray(e: any, t?: number): any[] | undefined {
    if (e) {
        if (typeof e === "string") return arrayLikeToArray(e, t);
        let o = Object.prototype.toString.call(e).slice(8, -1);
        o === "Object" && e.constructor && (o = e.constructor.name);
        return o === "Map" || o === "Set"
            ? Array.from(e)
            : o === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)
              ? arrayLikeToArray(e, t)
              : undefined;
    }
}

function arrayLikeToArray(e: ArrayLike<any>, t?: number): any[] {
    (t == null || t > e.length) && (t = e.length);
    const o = new Array(t);
    for (let n = 0; n < t; n++) o[n] = e[n];
    return o;
}

const BallLogicMgr = {
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
    publicTableList: null as any,
    otherPublicTableList: null as any,
    editingTableInfo: null as any,
    editingTryMaxNum: 5,
    challengeTryMaxNum: 2,
    last_pageType: null as any,
    last_pack_ball: null as any,
    last_pack_color: null as any,
    last_pack_particle: null as any,
    rewardMaxNum_oneDay: 3,
    shareRewardMaxNum_oneDay: 3,
    autoAdAtLogin: 0,
    msgCache_balls: [] as string[],
    physicParams: [
        {
            speed_power_reduce: 0.96,
            accele_power_reduce: 0.6,
        },
    ],
    getParam(e: string) {
        return BallLogicMgr.physicParams[0][e];
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
    ballDirModifyThreshold: 0.1111111111111111 * Math.PI,
    pack_ballMatIdx(e: any) {
        GlobalConfig.shop_ball_add(e);
    },
    unpack_ballMatIdx(e: any) {
        GlobalConfig.shop_ball_remove(e);
    },
    pack_color(e: any) {
        GlobalConfig.shop_color_set(e);
    },
    pack_particle(e: any) {
        GlobalConfig.shop_particle_set(e);
    },
    getBy_cid(e: any, t: any[]) {
        for (let o = 0; o < t.length; o++) if (t[o].cid == e) return t[o];
        return null;
    },
    addCoin(e: number, t: (coin: number) => void) {
        let n = DB.userInfo.coin;
        DB.updateUserInfoKV("coin", e, function () {
            n += e;
            console.log("add coin suc", e, n);
            BallLogicMgr.playCoinReward();
            DB.userInfo.coin = n;
            t(n);
        });
    },
    coin_notEnough() {},
    buy_ball(e: any, t: (e: any, status: any) => void) {
        DB.updateUserInfoKV("bmIdx", e, function (o: any) {
            const n = o.data.status;
            console.log("bmIdx status", n);
            t(e, n);
        });
    },
    buy_color(e: any, t: (e: any, status: any) => void) {
        DB.updateUserInfoKV("btx1", e, function (o: any) {
            const n = o.data.status;
            console.log("btx1 status", n);
            t(e, n);
        });
    },
    buy_particle(e: any, t: (e: any, status: any) => void) {
        DB.updateUserInfoKV("btx2", e, function (o: any) {
            const n = o.data.status;
            console.log("btx2 status", n);
            t(e, n);
        });
    },
    lookVideo() {},
    resetInHall() {
        BallLogicMgr.editingTableInfo = null;
        BallLogicMgr.game_mode = BallLogicMgr.MODE.ME_Free;
    },
    pack_WinInfo(e: any) {
        return {
            openid: DB.userInfo.openid,
            name: DB.userInfo.name,
            pic: DB.userInfo.pic,
            sec: e,
        };
    },
    pack_PublicTableInfo(e: any, t: any) {
        if (!t) {
            const n = new Date().getTime();
            e.time = n;
            const i = Math.floor(new Date().getTime() / 1e3);
            e.tableID = i;
            const a = DB.userInfo.name + i;
            e.name = a;
        }
        return {
            openid: DB.userInfo.openid,
            sID: e.sID,
            tableID: e.tableID,
            tableName: e.name,
            tableInfo: e,
            name: DB.userInfo.name,
            icon: DB.userInfo.pic,
            time: e.time,
            totalNum: 0,
            winNum: 0,
            zanIDS: 0,
            tj: 0,
            pr: 0,
            p1: 0,
            p2: 0,
        };
    },
    pack_BallMI(e?: number, t?: number, o?: number, n?: number, i?: number) {
        return {
            ballMatIdx: (e = e || 0),
            ballType: (t = t || BallLogicMgr.BallIDType_Normal),
            ballNum: (o = o || 0),
            p1: (n = n || 0),
            p2: (i = i || 0),
        };
    },
    pack_condition(e?: number, t?: any[], o?: any[], n?: number, i?: number, a?: number) {
        return {
            type: (n = n || 1),
            cdBalls: (t = t || []),
            lHallID: (o = o || []),
            ganNum: (e = e || 1),
            p1: (i = i || 0),
            p2: (a = a || 0),
        };
    },
    pack_BallInfo(e: any, t: any, o: any, n: any, i?: number, a?: number, r?: number) {
        return {
            ballID: e,
            ballType: t,
            x: o,
            y: n,
            tx1: (a = a || 0),
            tx2: (r = r || 0),
            ballMatIdx: (i = i || 0),
            p1: 0,
            p2: 0,
            p3: 0,
        };
    },
    pack_tableInfo(e?: string) {
        const t: any = {
            tableID: -1,
            sID: -1,
            name: (e = e || DB.userInfo.name + -1),
            time: new Date().getTime(),
            balls: [],
            condition: BallLogicMgr.pack_condition(),
            cue: {
                cueID: 0,
                Mat: 0,
                p1: 0,
                p2: 0,
            },
            isPass: 0,
            tableMat: 0,
            color: -1,
            particle: -1,
            p1: 0,
            p2: 0,
            p3: 0,
        };
        t.color = GlobalConfig.shop_color_get();
        t.particle = GlobalConfig.shop_particle_get();
        return t;
    },
    pack_answer(e: any, t: any, o?: number, n?: number, i?: number, a?: number) {
        return {
            angle: e,
            power: t,
            posT: (o = o || 0),
            posV: (n = n || 0),
            p1: (i = i || 0),
            p2: (a = a || 0),
        };
    },
    gotoHall() {
        console.log("gotoHall");
        cc.director.loadScene("game_main");
    },
    gotoTableEditor() {
        cc.director.loadScene("game_table_editor");
    },
    gotoShop() {
        cc.director.loadScene("game_shop");
    },
    gotoEditorAndCreateNew() {
        console.log("gotoEditorAndCreateNew");
        const e = BallLogicMgr.pack_tableInfo();
        BallLogicMgr.editingTableInfo = e;
        BallLogicMgr.gotoEditor(e);
    },
    gotoInfoList() {
        console.log("gotoListInfo");
        BallLogicMgr.gotoEditorAndCreateNew();
    },
    backtoInfoList() {
        BallLogicMgr.gotoHall();
    },
    loadLevelConfig(e: number, t?: (asset: cc.JsonAsset) => void) {
        cc.loader.loadRes("temp_file/l_" + (e + 1), cc.JsonAsset, function (err: any, o: cc.JsonAsset) {
            if (o) {
                o.json.tableInfo.condition.ganNum = Number(ConfigDataSys.global_ConfigMap.get("line_lv_life"));
                t && t(o);
            }
        });
    },
    loadLevelConfigOnServer(e: number, t?: (data: any) => void) {
        const o = this;
        BallLogicMgr.isGuideLevel = e < 1 && !GuideManager.Instance.id;
        LevelTableConfigManager.getLevelTableConfigByLevelID(e + 1).then(
            function (e: any) {
                const n = o.freemode_loadjs(1).arr[0];
                n.tableInfo.tableID = e.table_key;
                const i: any[] = [];
                n.tableInfo.balls = i;
                e.balls.forEach(function (e: any) {
                    const t = 0 == e.ballID ? 100 : 200 + e.ballID;
                    i.push({
                        ballID: t,
                        ballType: 0 == e.ballID ? 1 : 2,
                        x: e.x,
                        y: e.y,
                        tx1: 0,
                        tx2: 0,
                        ballMatIdx: 0 == e.ballID ? 0 : e.ballID + 1,
                        p1: 0,
                        p2: 0,
                        p3: 0,
                    });
                });
                n.tableInfo.condition.ganNum = Number(ConfigDataSys.global_ConfigMap.get("line_lv_life"));
                t && t(n);
            },
            function () {
                t && t(null);
            }
        );
    },
    gotoTable_free(e: any, t?: () => void, o?: boolean) {
        o === undefined && (o = false);
        BallLogicMgr.freeMode_jsonCfg = util.clone(e);
        const n = BallLogicMgr.freeMode_jsonCfg_idx;
        console.log("jkd BallLogicMgr.gotoTable_free ---------- idx:" + n);
        BallLogicMgr.loadLevelConfigOnServer(n, function (e: any) {
            BallLogicMgr.game_mode = BallLogicMgr.MODE.ME_Free;
            BallLogicMgr.editingTableInfo = e.tableInfo;
            t && t();
            o || cc.director.loadScene("game_tabel");
        });
    },
    gotoEditor(e: any) {
        BallLogicMgr.freeMode_totalGanNum = 0;
        const t = BallLogicMgr.freemode_loadjs(1);
        if (t) {
            BallLogicMgr.freeMode_jsonCfg = util.clone(t);
            BallLogicMgr.freeMode_jsonCfg_idx = 1;
            const o = BallLogicMgr.freemode_loadjs(1).arr[0];
            o.tableInfo.tableID = e.table_key;
            const n: any[] = [];
            o.tableInfo.balls = n;
            e.balls.forEach(function (e: any) {
                const t = 0 == e.ballID ? 100 : 200 + e.ballID;
                n.push({
                    ballID: t,
                    ballType: 0 == e.ballID ? 1 : 2,
                    x: e.x,
                    y: e.y,
                    tx1: 0,
                    tx2: 0,
                    ballMatIdx: 0 == e.ballID ? 0 : e.ballID + 1,
                    p1: 0,
                    p2: 0,
                    p3: 0,
                });
            });
            o.tableInfo.condition.ganNum = Number(ConfigDataSys.global_ConfigMap.get("line_lv_life"));
            const i = o;
            BallLogicMgr.game_mode = BallLogicMgr.MODE.ME_Free;
            BallLogicMgr.editingTableInfo = i.tableInfo;
            cc.director.loadScene("game_tabel");
        } else console.log("error:gotoTable_free_loadfirst json is null");
    },
    freemode_loadjs(t: number) {
        const moduleName = "FModeConfig" + Math.min(2, Math.floor(t / 10) + 1);
        const n = fModeConfigModules[moduleName];
        return n ? n.json : null;
    },
    freeMode_jsonCfg_idx: 0,
    freeMode_totalGanNum: 0,
    is_record: false,
    is_switching: false,
    record_time: 0,
    recorder: null as any,
    lastStop_time: 0,
    updateRecIcon: null as (() => void) | null,
    isStartTooFast() {
        return new Date().getTime() - BallLogicMgr.lastStop_time < 1e3;
    },
    showModal() {},
    initRecord() {
        if (!BallLogicMgr.recorder) {
            BallLogicMgr.recorder = (wx as any).getGameRecorderManager();
            BallLogicMgr.recorder.onStart(function () {
                console.log("rec onStart");
                BallLogicMgr.is_record = true;
                BallLogicMgr.is_switching = false;
            });
            BallLogicMgr.recorder.onStop(function (e: any) {
                const t = e.videoPath;
                console.log("rec onStop", BallLogicMgr.updateRecIcon);
                BallLogicMgr.is_switching = false;
                BallLogicMgr.is_record = false;
                BallLogicMgr.lastStop_time = new Date().getTime();
                if (BallLogicMgr.updateRecIcon) {
                    console.log("call BallLogicMgr.updateRecIcon", typeof BallLogicMgr.updateRecIcon);
                    BallLogicMgr.updateRecIcon();
                }
                (wx as any).showModal({
                    title: "录屏完成",
                    content: "录屏已经完成，是否发布这个录屏内容？",
                    success: function (e: any) {
                        if (e.confirm) {
                            console.log("confirm, continued");
                            (wx as any).shareVideo({
                                videoPath: "" + t,
                                success: function () {},
                                fail: function () {},
                            });
                        } else e.cancel && console.log("cancel, cold");
                    },
                    fail: function () {
                        console.log("showModal调用失败");
                    },
                });
            });
            return BallLogicMgr.recorder;
        }
    },
    gotoTable_freeMode_useCacheIdx(e: boolean) {
        if (e) {
            const t = GlobalConfig.freeModeLastBest_get();
            BallLogicMgr.freeMode_totalGanNum = Number(t.ganNum);
            BallLogicMgr.gotoTable_free_loadfirst(Number(t.idx) + 1);
        } else {
            BallLogicMgr.freeMode_totalGanNum = 0;
            BallLogicMgr.gotoTable_free_loadfirst(0);
        }
    },
    loadTable(e: number, t: string, o?: () => void, n?: boolean) {
        n === undefined && (n = false);
        BallLogicMgr.freeMode_totalGanNum = 0;
        const i = BallLogicMgr.freemode_loadjs(1);
        if (i) {
            BallLogicMgr.freeMode_jsonCfg_idx = e;
            BallLogicMgr.freeMode_jsonCfg = util.clone(i);
            const a = function (e: any) {
                BallLogicMgr.game_mode = BallLogicMgr.MODE.ME_Free;
                BallLogicMgr.editingTableInfo = e.tableInfo;
                o == null || o();
                n || cc.director.loadScene("game_tabel");
            };
            BallLogicMgr.isGuideLevel = e < 1 && !GuideManager.Instance.id;
            LevelTableConfigManager.getLevelTableConfigByFileName(t).then(
                function (e: any) {
                    const t = i.arr[0];
                    t.tableInfo.tableID = e.table_key;
                    const o: any[] = [];
                    t.tableInfo.balls = o;
                    e.balls.forEach(function (e: any) {
                        const t = 0 == e.ballID ? 100 : 200 + e.ballID;
                        o.push({
                            ballID: t,
                            ballType: 0 == e.ballID ? 1 : 2,
                            x: e.x,
                            y: e.y,
                            tx1: 0,
                            tx2: 0,
                            ballMatIdx: 0 == e.ballID ? 0 : e.ballID + 1,
                            p1: 0,
                            p2: 0,
                            p3: 0,
                        });
                    });
                    t.tableInfo.condition.ganNum = Number(ConfigDataSys.global_ConfigMap.get("line_lv_life"));
                    a(t);
                },
                function () {
                    return a(null);
                }
            );
        } else console.error("gotoTable_free_loadfirst json is null");
    },
    loadTable_freeMode_useIdx(e: number, t?: () => void, o?: boolean) {
        o === undefined && (o = false);
        BallLogicMgr.freeMode_totalGanNum = 0;
        BallLogicMgr.gotoTable_free_loadfirst(e, t, o);
    },
    loadTable_freeMode_useCacheIdx(e: boolean, t?: () => void) {
        if (e) {
            const o = GlobalConfig.freeModeLastBest_get();
            BallLogicMgr.freeMode_totalGanNum = Number(o.ganNum);
            BallLogicMgr.gotoTable_free_loadfirst(Number(o.idx) + 1, t, true);
        } else {
            BallLogicMgr.freeMode_totalGanNum = 0;
            BallLogicMgr.gotoTable_free_loadfirst(0, t, true);
        }
    },
    gotoTable_free_loadfirst(e: number, t?: () => void, o?: boolean) {
        const n = BallLogicMgr.freemode_loadjs(e < 0 ? 0 : e);
        if (n) {
            BallLogicMgr.freeMode_jsonCfg_idx = e;
            BallLogicMgr.gotoTable_free(n, t, o);
        } else console.log("error:gotoTable_free_loadfirst json is null");
    },
    getFreeModeCurCfgItem() {
        if (BallLogicMgr.freeMode_jsonCfg) {
            const e = BallLogicMgr.freeMode_jsonCfg.arr;
            let t = BallLogicMgr.freeMode_jsonCfg_idx;
            if (((t %= 50), t < e.length)) return e[t];
        }
        return null;
    },
    gotoFreeModeNextCfgItem(e: (info: any) => void) {
        if (BallLogicMgr.freeMode_jsonCfg) {
            BallLogicMgr.freeMode_jsonCfg.arr;
            let t = BallLogicMgr.freeMode_jsonCfg_idx + 1;
            if (0 == (t %= 50)) {
                const o = BallLogicMgr.freemode_loadjs(BallLogicMgr.freeMode_jsonCfg_idx + 1);
                if (o) {
                    BallLogicMgr.freeMode_jsonCfg = util.clone(o);
                    o.arr;
                    BallLogicMgr.loadLevelConfig(0, function (t: cc.JsonAsset) {
                        BallLogicMgr.freeMode_jsonCfg_idx = 0;
                        BallLogicMgr.editingTableInfo = t.json.tableInfo;
                        e(BallLogicMgr.editingTableInfo);
                    });
                } else e(null);
            } else
                t < 50
                    ? BallLogicMgr.loadLevelConfig(t, function (t: cc.JsonAsset) {
                          BallLogicMgr.freeMode_jsonCfg_idx += 1;
                          BallLogicMgr.editingTableInfo = t.json.tableInfo;
                          e(BallLogicMgr.editingTableInfo);
                      })
                    : e(null);
        } else e(null);
    },
    gotoTable_editing(e: any) {
        BallLogicMgr.game_mode = BallLogicMgr.MODE.ME_Editing;
        BallLogicMgr.editingTableInfo = e;
        cc.director.loadScene("game_tabel");
    },
    gotoTable_challenge(e: any, t: any) {
        BallLogicMgr.game_mode = BallLogicMgr.MODE.PVE_Challenge;
        BallLogicMgr.editingTableInfo = e;
        BallLogicMgr.challenging_publictableInfo = t;
        cc.director.loadScene("game_tabel");
    },
    clickTableEditListItem(e: number) {
        if (BallLogicMgr.publicTableList && e < BallLogicMgr.publicTableList.length) {
            const t = BallLogicMgr.publicTableList[e].tableInfo;
            BallLogicMgr.editingTableInfo = t;
            cc.director.loadScene("game_table_editor");
        }
    },
    clickTableEditListItem_play() {},
    clickTableEditListItem_challenge(e: any) {
        e && BallLogicMgr.gotoTable_challenge(e.tableInfo, e);
    },
    getTableArray(e?: any) {
        e = e || DB.userInfo.openid;
        BallLogicMgr.allTables.get(e);
        const n: any[] = [];
        for (let t, i = createForOfIteratorHelper(BallLogicMgr.tableInfos.values()); !(t = (i as any)()).done; ) {
            const a = t.value;
            n.push(a);
        }
        return n;
    },
    last_zan_ms: 0,
    do_zan(e: any, t: (result: any) => void) {
        new Date().getTime() - BallLogicMgr.last_zan_ms >= 6e4
            ? DB.updateOnePublicTableInfo(e, "zanIDS", 1, function (e: any) {
                  BallLogicMgr.last_zan_ms = new Date().getTime();
                  t(e);
              })
            : DB.isTT() &&
              (tt as any).showToast({
                  title: "请休息一会儿再点!",
                  duration: 800,
                  success: function (e: any) {
                      console.log("" + e);
                  },
                  fail: function () {
                      console.log("showToast调用失败");
                  },
              });
    },
    publicTableList_removeBysID(e: any) {
        if (BallLogicMgr.publicTableList) {
            let t = -1;
            for (let o = 0; o < BallLogicMgr.publicTableList.length; o++)
                if (BallLogicMgr.publicTableList[o].sID == e) {
                    t = o;
                    break;
                }
            t >= 0 && BallLogicMgr.publicTableList.splice(t, 1);
        }
    },
    saveFreeModeFinishIdx() {
        const e = BallLogicMgr.freeMode_jsonCfg_idx;
        GlobalConfig.freeModeIdx_set(e);
        let t = false;
        const o = GlobalConfig.freeModeLastBest_get();
        e > Number(o.idx)
            ? (t = true)
            : e == Number(o.idx) && BallLogicMgr.freeMode_totalGanNum < Number(o.ganNum) && (t = true);
        if (t) {
            console.log("isBetter true");
            const n = {
                idx: e,
                ganNum: BallLogicMgr.freeMode_totalGanNum,
            };
            GlobalConfig.freeModeLastBest_set(n);
        }
    },
    saveOneMoreRewardTime() {
        let e = GlobalConfig.rewardTimes_get();
        e = Number(e);
        e += 1;
        GlobalConfig.rewardTimes_set(e);
    },
    checkCanRewardToday() {
        let e = GlobalConfig.rewardTimes_get();
        e = Number(e);
        console.log("rewardTimes_get", e);
        return !(e >= BallLogicMgr.rewardMaxNum_oneDay);
    },
    saveOneMoreShareRewardTime() {
        let e = GlobalConfig.shareRewardTimes_get();
        e = Number(e);
        e += 1;
        GlobalConfig.shareRewardTimes_set(e);
    },
    checkCanShareRewardToday() {
        let e = GlobalConfig.shareRewardTimes_get();
        e = Number(e);
        console.log("shareRewardTimes_get", e);
        return !(e >= BallLogicMgr.shareRewardMaxNum_oneDay);
    },
    pushArrayBuffer(e: ArrayBuffer) {
        let t: Uint8Array;
        const o = ((t = new Uint8Array(e)), String.fromCharCode.apply(null, t as any));
        BallLogicMgr.msgCache_balls.push(o);
    },
    cur_bgMusicID: null as any,
    loading_bgMusic: false,
    playBgMusic() {},
    stopBgMusic() {},
    playBallCueCollide() {},
    last_ballCollideSound: 0,
    playBallCollideSound() {
        AudioManager.getInstance().playMusic("pool_ball_bump");
    },
    playBoardCollideSound() {
        AudioManager.getInstance().playMusic("pool_ball_bumptable");
    },
    playSound(e: string, t?: boolean) {
        (t && AudioManager.getInstance().isPlaying(e)) || AudioManager.getInstance().playMusic(e);
    },
    playUIClick() {},
    playCoinReward() {
        AudioManager.getInstance().playMusic("coin_reward");
    },
    showAD() {},
    destroyAD() {},
    lastCB_ms: 0,
    showAD_video() {
        return false;
    },
    showAD_video2() {
        return false;
    },
    game_mode: undefined as any,
    isGuideLevel: undefined as any,
    freeMode_jsonCfg: undefined as any,
    challenging_publictableInfo: undefined as any,
    allTables: undefined as any,
    tableInfos: undefined as any,
};

export = BallLogicMgr;
