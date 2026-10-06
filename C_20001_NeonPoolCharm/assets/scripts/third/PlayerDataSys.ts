import CueDataSys from "./CueDataSys";
import PlayerDataMgr, { LevelInfo } from "./PlayerDataMgr";
import CashMgr from "./CashMgr";
import * as SystemConfig from "./SystemConfig";
import GlobalDataMgr from "./GlobalDataMgr";
import AdManager from "./AdManager";
import ClientData from "./ClientData";
import SdkHelper from "./SdkHelper";
import EngineUtil from "./EngineUtil";
import ConfigDataSys from "./ConfigDataSys";

class PlayerDataSys extends PlayerDataMgr {
    userCpm: number = null;
    prop_info: Record<string, unknown> = {};
    max_level_id: number;
    loop_range: number;
    loop_start_level_id: number;
    extract_gold_cash_record: Map<number, unknown>;
    level_loop: unknown;
    sign_level_count: number;
    sign_today: unknown;
    sign_in_count: number;

    private static _instance: PlayerDataSys = null;

    get validConfigLevelID(): number {
        return this.getConfigLevelID(this.user_level);
    }

    get xiaoqiuADCount(): number {
        return this._xiaoqiuADCount;
    }
    set xiaoqiuADCount(value: number) {
        this._xiaoqiuADCount = value;
        Number(EngineUtil.localStorageSetItem("xq_count", String(value)));
    }

    get user_level(): number {
        return this._user_level;
    }
    set user_level(value: number) {
        this._user_level = value;
        this.caculateSceneIndex();
    }

    get level_info(): LevelInfo {
        return this._levelInfo;
    }
    set level_info(value: LevelInfo) {
        this._levelInfo = value;
    }

    get table(): string {
        return this._table;
    }
    set table(value: string) {
        this._table = value;
    }

    get turn_pass(): number {
        return this._turn_pass;
    }
    set turn_pass(value: number) {
        this._turn_pass = value;
    }

    get unlockSceneCount(): number {
        let count = 0;
        ConfigDataSys.scene_configMap.forEach((scene) => {
            if (this._user_level > scene.unlock_lv) {
                count++;
            }
        });
        return count;
    }

    get sucai_isAuto(): boolean {
        return !!cc.sys.localStorage.getItem("sucai_isAuto");
    }
    set sucai_isAuto(value: boolean) {
        if (value) {
            cc.sys.localStorage.setItem("sucai_isAuto", "true");
        } else {
            cc.sys.localStorage.removeItem("sucai_isAuto");
        }
    }

    get sucai_endRed(): number {
        const stored = cc.sys.localStorage.getItem("sucai_endRed");
        return stored ? Number(stored) : 0;
    }
    set sucai_endRed(value: number) {
        cc.sys.localStorage.setItem("sucai_endRed", String(value));
    }

    get sucai_ballArr(): number[] {
        const stored = cc.sys.localStorage.getItem("sucai_ballArr");
        return stored
            ? stored.split(",").map((item: any) => Number(item))
            : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    set sucai_ballArr(value: number[]) {
        cc.sys.localStorage.setItem("sucai_ballArr", value.join(","));
    }

    getCashBalance(amount?: number): string {
        if (amount == 0) {
            return amount.toString();
        }
        if (!amount) {
            amount = this.cash_balance;
        }
        const floored = Math.floor(100 * amount) / 100;
        if (floored < 100 && GlobalDataMgr.curLanguage == SystemConfig.languages.ID) {
            return floored.toString();
        }
        switch (GlobalDataMgr.curLanguage) {
            case SystemConfig.languages.ID:
                return CashMgr.getIDCashNum(floored);
            case SystemConfig.languages.BR:
                return CashMgr.getBRCashNum(floored);
            case SystemConfig.languages.RU:
                return CashMgr.getRUCashNum(floored);
            default:
                return CashMgr.getCNCashNum(floored);
        }
    }

    setFirstVideoCpm(value: string): void {
        EngineUtil.localStorageSetItem("FIRST_VIDEO_CPM", value);
    }

    addUserCashbalance(value: number): void {
        if (value >= 0) {
            this.cash_balance += value;
        }
    }

    getFirstVideoCpm(): string {
        return EngineUtil.localStorageGetItem("FIRST_VIDEO_CPM");
    }

    updateCashRecord(records: any[]): void {
        if (records && records.length) {
            records.forEach((record) => {
                this.extract_gold_cash_record.set(record.id, record);
            });
        }
    }

    setWdExtract(values: number[]): void {
        cc.sys.localStorage.setItem("saveWdExtract", values.join(","));
    }

    getTiXianInfo(id: number): boolean {
        return cc.sys.localStorage.getItem("tixian_" + id) != null;
    }

    saveWdExtract(value: number): void {
        const stored = cc.sys.localStorage.getItem("saveWdExtract");
        let list: number[] = [];
        if (stored) {
            list = stored.split(",").map((item: any) => Number(item));
        }
        list.unshift(value);
        cc.sys.localStorage.setItem("saveWdExtract", list.join(","));
    }

    getWdExtract(): number[] {
        const stored = cc.sys.localStorage.getItem("saveWdExtract");
        let list: number[] = [];
        if (stored) {
            list = stored.split(",").map((item: any) => Number(item));
        }
        return list;
    }

    getCashWithUnit(amount?: number): string {
        return GlobalDataMgr.curLanguage == "CN"
            ? this.getCashBalance(amount) + "元"
            : this.getCashUnit() + " " + this.getCashBalance(amount);
    }

    private static _getInstance(): PlayerDataSys {
        if (!PlayerDataSys._instance) {
            PlayerDataSys._instance = new PlayerDataSys();
        }
        return PlayerDataSys._instance;
    }

    removeWdExtract(index: number): void {
        const stored = cc.sys.localStorage.getItem("saveWdExtract");
        let list: number[] = [];
        if (stored) {
            list = stored.split(",").map((item: any) => Number(item));
        }
        if (list.length) {
            list.splice(index, 1);
            cc.sys.localStorage.setItem("saveWdExtract", list.join(","));
        }
    }

    init(data: any): void {
        if (!data) {
            return;
        }
        const gameInfo = data.game_info;
        console.log("game_info data: ", gameInfo);
        const levelKeys = Array.from(ConfigDataSys.level_configMap.keys());
        this.max_level_id = levelKeys[levelKeys.length - 1];
        this.loop_range = Number(ConfigDataSys.global_ConfigMap.get("level_loop_range"));
        this.loop_start_level_id = this.max_level_id - this.loop_range;
        this.setUserInfo(data);
        CueDataSys.initData(gameInfo);
        this._xiaoqiuADCount = Number(EngineUtil.localStorageGetItem("xq_count", "0"));
    }

    initUserId(data: { user_id?: string; user_name?: string; yid?: string }): void {
        console.log("initUserId data: ", data);
        const userId = data.user_id;
        const userName = data.user_name;
        const yid = data.yid;
        this.user_id = userId || "";
        this.user_name = userName || "";
        this.yid = yid || "yid_read_failed";
        ClientData.yid = yid;
        ClientData.setCommonData();
        EngineUtil.setLocalData("yid", yid);
    }

    getCashUnit(): string {
        return SystemConfig.Currency[GlobalDataMgr.curLanguage] || "R$ ";
    }

    getConfigLevelID(level: number): number {
        if (level <= this.max_level_id) {
            return level;
        }
        const offset = level - this.max_level_id;
        return this.loop_start_level_id + (offset % this.loop_range);
    }

    is_new_user(): boolean {
        return this.new_user;
    }

    initWxData(data: any): void {
        if (!data) {
            return;
        }
        this.initUserId(data);
        this.yid = data.yid || "yid_read_failed";
        this.user_id = data.user_id;
        this.user_name = data.nickname;
        this.wx_gender = data.gender || "";
        this.wx_head = data.headimgurl || "";
        this.bind_wx = 1;
    }

    arrivedNewCity(): void {
        if (this._curSceneID != 1) {
            const stored = EngineUtil.localStorageGetItem("arrived_new_country", "0,0").split(",");
            if (this._curSceneID > Number(stored[0])) {
                EngineUtil.localStorageSetItem("arrived_new_country", String(this._curSceneID) + ",0");
            }
        }
    }

    setTiXianInfo(id: number): void {
        cc.sys.localStorage.setItem("tixian_" + id, "true");
    }

    getUserCpm(): any {
        return (
            AdManager.getInstance().cpm_data || {
                cpm: 0,
                source: "",
                unitId: "",
                isApp: "",
                isClose: "",
                activity_date: "",
                activity_num: "",
            }
        );
    }

    caculateSceneIndex(): void {
        const keys = Array.from(ConfigDataSys.scene_configMap.keys());
        for (let i = keys.length - 1; i > -1; i--) {
            const sceneId = keys[i];
            const scene = ConfigDataSys.scene_configMap.get(sceneId);
            if (this._user_level > scene.unlock_lv) {
                if (this._curSceneID < sceneId) {
                    this._curSceneID = sceneId;
                    this.arrivedNewCity();
                }
                return;
            }
        }
        this._curSceneID = 0;
    }

    setUserInfo(data: any): void {
        if (!data) {
            return;
        }
        const userInfo = data.user_info;
        const gameInfo = data.game_info;
        console.log("user_info data: ", userInfo);
        this.user_level = gameInfo.level_a || 1;
        this.level_info.level_a = gameInfo.level_a;
        this.level_info.level_b = gameInfo.level_b;
        this.level_info.level_c = gameInfo.level_c;
        this.level_info.roundCount = gameInfo.roundCount;
        this.level_info.turnCount = gameInfo.turnCount;
        this.turn_pass = gameInfo.turn_pass;
        this.table = gameInfo.table;
        this.level_loop = gameInfo.level_loop;
        this.level_ad = gameInfo.level_ad;
        this._scene_id = gameInfo.scene_id;
        this.sign_level_count = gameInfo.sign_level_count;
        this.sign_today = gameInfo.sign_today;
        this.sign_in_count = gameInfo.sign_in_count;
        this.level_pass = gameInfo.level_pass;
        this.prop_info = gameInfo.prop;
        this.cash_balance = userInfo.cash_balance || 0;
        this.gold_balance = userInfo.gold_balance || 0;
        this.sign_balance = userInfo.sign_balance || 0;
        this._max_extract_id = userInfo.max_extract_id || 0;
        this.extract_gold_cash_record = new Map();
        this.total_video_count = userInfo.total_video_count || 0;
        this.level_pass_success_count = userInfo.level_pass_success_count || 0;
        if (userInfo.headimgurl) {
            this.wx_head = userInfo.headimgurl;
        }
        this.guide_id = userInfo.guide_id;
        this.new_user = this.guide_id == 0;
        this.total_gold = userInfo.total_gold || 0;
        this.is_gm = userInfo.is_gm;
        this.create_time = userInfo.create_time;
        this.updateCashRecord(userInfo.extract_gold_cash_record);
        this.chat_group_ban = userInfo.show_red_group == null || !userInfo.show_red_group;
        SdkHelper.setUserInfo({
            yid: this.yid,
            user_id: this.user_id,
            gender: this.wx_gender,
            create_time: this.create_time,
            is_travel: 0,
        });
    }

    getLevelTableFileName(): string {
        const level = ConfigDataSys.level_configMap.get(this.validConfigLevelID);
        return level ? level.lv_file : "l_1";
    }

    uploadCpm(value: string): void {
        this.userCpm = Number(value);
    }

    updateUserInfo(data: any): void {
        if (!data) {
            return;
        }
        const cashBalance = data.cash_balance;
        if (cashBalance != null) {
            this.cash_balance = cashBalance;
        }
    }
}

export default PlayerDataSys._getInstance();
