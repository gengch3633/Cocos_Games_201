import AdManager from "./AdManager";
import CashMgr from "./CashMgr";
import ClientData from "./ClientData";
import ConfigDataSys from "./ConfigDataSys";
import CueDataSys from "./CueDataSys";
import EngineUtil from "./EngineUtil";
import GlobalDataMgr from "./GlobalDataMgr";
import PlayerDataMgr from "./PlayerDataMgr";
import SdkHelper from "./SdkHelper";
import { Currency, languages } from "./SystemConfig";

class PlayerDataSys extends PlayerDataMgr {
    static _instance = null;

    constructor() {
        super();
        this.user_id = null;
        this.user_name = null;
        this.yid = null;
        this._curSceneID = null;
        this.new_user = null;
        this.cash_balance = null;
        this.userCpm = null;
        this.prop_info = {};
    }

    get validConfigLevelID() {
        return this.getConfigLevelID(this.user_level);
    }

    get xiaoqiuADCount() {
        return this._xiaoqiuADCount;
    }

    set xiaoqiuADCount(e) {
        this._xiaoqiuADCount = e;
        Number(EngineUtil.localStorageSetItem("xq_count", String(e)));
    }

    get user_level() {
        return this._user_level;
    }

    set user_level(e) {
        this._user_level = e;
        this.caculateSceneIndex();
    }

    get level_info() {
        return this._levelInfo;
    }

    set level_info(e) {
        this._levelInfo = e;
    }

    get table() {
        return this._table;
    }

    set table(e) {
        this._table = e;
    }

    get turn_pass() {
        return this._turn_pass;
    }

    set turn_pass(e) {
        this._turn_pass = e;
    }

    get unlockSceneCount() {
        const e = this;
        let t = 0;
        ConfigDataSys.scene_configMap.forEach(function (o) {
            e._user_level > o.unlock_lv && t++;
        });
        return t;
    }

    get sucai_isAuto() {
        return !!cc.sys.localStorage.getItem("sucai_isAuto");
    }

    set sucai_isAuto(e) {
        e ? cc.sys.localStorage.setItem("sucai_isAuto", "true") : cc.sys.localStorage.removeItem("sucai_isAuto");
    }

    get sucai_endRed() {
        const e = cc.sys.localStorage.getItem("sucai_endRed");
        return e ? Number(e) : 0;
    }

    set sucai_endRed(e) {
        cc.sys.localStorage.setItem("sucai_endRed", e);
    }

    get sucai_ballArr() {
        const e = cc.sys.localStorage.getItem("sucai_ballArr");
        return e ? e.split(",").map(function (e) {
            return Number(e);
        }) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    set sucai_ballArr(e) {
        cc.sys.localStorage.setItem("sucai_ballArr", e.join(","));
    }

    getCashBalance(e) {
        if (0 == e) return e.toString();
        e || (e = this.cash_balance);
        const t = Math.floor(100 * e) / 100;
        if (t < 100 && GlobalDataMgr.curLanguage == languages.ID) return t.toString();
        let o = "";
        switch (GlobalDataMgr.curLanguage) {
            case languages.ID:
                o = CashMgr.getIDCashNum(t);
                break;
            case languages.BR:
                o = CashMgr.getBRCashNum(t);
                break;
            case languages.RU:
                o = CashMgr.getRUCashNum(t);
                break;
            default:
                o = CashMgr.getCNCashNum(t);
        }
        return o;
    }

    setFirstVideoCpm(e) {
        EngineUtil.localStorageSetItem("FIRST_VIDEO_CPM", e);
    }

    addUserCashbalance(e) {
        e >= 0 && (this.cash_balance += e);
    }

    getFirstVideoCpm() {
        return EngineUtil.localStorageGetItem("FIRST_VIDEO_CPM");
    }

    updateCashRecord(e) {
        const t = this;
        e && e.length && e.forEach(function (e) {
            t.extract_gold_cash_record.set(e.id, e);
        });
    }

    setWdExtract(e) {
        cc.sys.localStorage.setItem("saveWdExtract", e.join(","));
    }

    getTiXianInfo(e) {
        return null != cc.sys.localStorage.getItem("tixian_" + e);
    }

    saveWdExtract(e) {
        const t = cc.sys.localStorage.getItem("saveWdExtract");
        let o = [];
        t && (o = t.split(",").map(function (e) {
            return Number(e);
        }));
        o.unshift(e);
        cc.sys.localStorage.setItem("saveWdExtract", o.join(","));
    }

    getWdExtract() {
        const e = cc.sys.localStorage.getItem("saveWdExtract");
        let t = [];
        e && (t = e.split(",").map(function (e) {
            return Number(e);
        }));
        return t;
    }

    getCashWithUnit(e) {
        return "CN" == GlobalDataMgr.curLanguage ? this.getCashBalance(e) + "元" : this.getCashUnit() + " " + this.getCashBalance(e);
    }

    static _getInstance() {
        this._instance || (PlayerDataSys._instance = new PlayerDataSys());
        return PlayerDataSys._instance;
    }

    removeWdExtract(e) {
        const t = cc.sys.localStorage.getItem("saveWdExtract");
        let o = [];
        t && (o = t.split(",").map(function (e) {
            return Number(e);
        }));
        if (o.length) {
            o.splice(e, 1);
            cc.sys.localStorage.setItem("saveWdExtract", o.join(","));
        }
    }

    init(e) {
        if (e) {
            const t = e.game_info;
            console.log("game_info data: ", t);
            const o = Array.from(ConfigDataSys.level_configMap.keys());
            this.max_level_id = o[o.length - 1];
            this.loop_range = Number(ConfigDataSys.global_ConfigMap.get("level_loop_range"));
            this.loop_start_level_id = this.max_level_id - this.loop_range;
            this.setUserInfo(e);
            CueDataSys.initData(t);
            this._xiaoqiuADCount = Number(EngineUtil.localStorageGetItem("xq_count", "0"));
        }
    }

    initUserId(e) {
        console.log("initUserId data: ", e);
        const t = e.user_id;
        const o = e.user_name;
        const n = e.yid;
        this.user_id = t || "";
        this.user_name = o || "";
        this.yid = n || "yid_read_failed";
        ClientData.yid = n;
        ClientData.setCommonData();
        EngineUtil.setLocalData("yid", n);
    }

    getCashUnit() {
        return Currency[GlobalDataMgr.curLanguage] || "R$ ";
    }

    getConfigLevelID(e) {
        if (e <= this.max_level_id) return e;
        const t = e - this.max_level_id;
        return this.loop_start_level_id + t % this.loop_range;
    }

    is_new_user() {
        return this.new_user;
    }

    initWxData(e) {
        if (e) {
            this.initUserId(e);
            const t = e.gender;
            const o = e.yid;
            const n = e.user_id;
            const i = e.nickname;
            const a = e.headimgurl;
            this.yid = o || "yid_read_failed";
            this.user_id = n;
            this.user_name = i;
            this.wx_gender = t || "";
            this.wx_head = a || "";
            this.bind_wx = 1;
        }
    }

    arrivedNewCity() {
        if (1 != this._curSceneID) {
            const e = EngineUtil.localStorageGetItem("arrived_new_country", "0,0").split(",");
            this._curSceneID > Number(e[0]) && Number(EngineUtil.localStorageSetItem("arrived_new_country", String(this._curSceneID) + ",0"));
        }
    }

    setTiXianInfo(e) {
        cc.sys.localStorage.setItem("tixian_" + e, true);
    }

    getUserCpm() {
        return AdManager.getInstance().cpm_data || {
            cpm: 0,
            source: "",
            unitId: "",
            isApp: "",
            isClose: "",
            activity_date: "",
            activity_num: ""
        };
    }

    caculateSceneIndex() {
        const e = Array.from(ConfigDataSys.scene_configMap.keys());
        for (let t = e.length - 1; t > -1; t--) {
            const o = e[t];
            const n = ConfigDataSys.scene_configMap.get(o);
            if (this._user_level > n.unlock_lv) {
                if (this._curSceneID < o) {
                    this._curSceneID = o;
                    this.arrivedNewCity();
                }
                return;
            }
        }
        this._curSceneID = 0;
    }

    setUserInfo(e) {
        if (e) {
            const t = e.user_info;
            const o = e.game_info;
            console.log("user_info data: ", t);
            this.user_level = o.level_a || 1;
            this.level_info.level_a = o.level_a;
            this.level_info.level_b = o.level_b;
            this.level_info.level_c = o.level_c;
            this.level_info.roundCount = o.roundCount;
            this.level_info.turnCount = o.turnCount;
            this.turn_pass = o.turn_pass;
            this.table = o.table;
            this.level_loop = o.level_loop;
            this.level_ad = o.level_ad;
            this._scene_id = o.scene_id;
            this.sign_level_count = o.sign_level_count;
            this.sign_today = o.sign_today;
            this.sign_in_count = o.sign_in_count;
            this.level_pass = o.level_pass;
            this.prop_info = o.prop;
            this.cash_balance = t.cash_balance || 0;
            this.gold_balance = t.gold_balance || 0;
            this.sign_balance = t.sign_balance || 0;
            this._max_extract_id = t.max_extract_id || 0;
            this.extract_gold_cash_record = new Map();
            this.total_video_count = t.total_video_count || 0;
            this.level_pass_success_count = t.level_pass_success_count || 0;
            t.headimgurl && (this.wx_head = t.headimgurl);
            this.guide_id = t.guide_id;
            this.new_user = 0 == this.guide_id;
            this.total_gold = t.total_gold || 0;
            this.is_gm = t.is_gm;
            this.create_time = t.create_time;
            this.updateCashRecord(t.extract_gold_cash_record);
            this.chat_group_ban = null == t.show_red_group || !t.show_red_group;
            SdkHelper.setUserInfo({
                yid: this.yid,
                user_id: this.user_id,
                gender: this.wx_gender,
                create_time: this.create_time,
                is_travel: 0
            });
        }
    }

    getLevelTableFileName() {
        const e = ConfigDataSys.level_configMap.get(this.validConfigLevelID);
        return e ? e.lv_file : "l_1";
    }

    uploadCpm(e) {
        this.userCpm = Number(e);
    }

    updateUserInfo(e) {
        if (e) {
            const t = e.cash_balance;
            e.gold_balance;
            null != t && (this.cash_balance = t);
        }
    }
}

export default PlayerDataSys._getInstance();
