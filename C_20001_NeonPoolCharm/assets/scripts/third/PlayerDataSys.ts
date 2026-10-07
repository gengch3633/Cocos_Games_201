import CueDataSys from "./CueDataSys";
import PlayerDataMgr from "./PlayerDataMgr";
import CashMgr from "./CashMgr";
import { Currency, languages } from "./SystemConfig";
import GlobalDataMgr from "./GlobalDataMgr";
import AdManager from "./AdManager";
import ClientData from "./ClientData";
import SdkHelper from "./SdkHelper";
import EngineUtil from "./EngineUtil";
import ConfigDataSys from "./ConfigDataSys";

class PlayerDataSys extends PlayerDataMgr {
    user_id: string = null;
    user_name: string = null;
    yid: string = null;
    _curSceneID: number = null;
    new_user: boolean = null;
    cash_balance: number = null;
    userCpm: number = null;
    prop_info: Record<string, any> = {};
    max_level_id: number = null;
    loop_range: number = null;
    loop_start_level_id: number = null;
    level_loop: any = null;
    sign_level_count: number = null;
    sign_today: boolean = null;
    sign_in_count: number = null;
    extract_gold_cash_record: Map<any, any> = null;

    get validConfigLevelID(): number {
        return this.getConfigLevelID(this.user_level);
    }

    get xiaoqiuADCount(): number {
        return this._xiaoqiuADCount;
    }

    set xiaoqiuADCount(e: number) {
        this._xiaoqiuADCount = e;
        Number(EngineUtil.localStorageSetItem("xq_count", String(e)));
    }

    get user_level(): number {
        return this._user_level;
    }

    set user_level(e: number) {
        this._user_level = e;
        this.caculateSceneIndex();
    }

    get level_info() {
        return this._levelInfo;
    }

    set level_info(e: typeof this._levelInfo) {
        this._levelInfo = e;
    }

    get table(): string {
        return this._table;
    }

    set table(e: string) {
        this._table = e;
    }

    get turn_pass(): number {
        return this._turn_pass;
    }

    set turn_pass(e: number) {
        this._turn_pass = e;
    }

    get unlockSceneCount(): number {
        let t = 0;
        ConfigDataSys.scene_configMap.forEach((o) => {
            this._user_level > o.unlock_lv && t++;
        });
        return t;
    }

    get sucai_isAuto(): boolean {
        return !!cc.sys.localStorage.getItem("sucai_isAuto");
    }

    set sucai_isAuto(e: boolean) {
        e ? cc.sys.localStorage.setItem("sucai_isAuto", "true") : cc.sys.localStorage.removeItem("sucai_isAuto");
    }

    get sucai_endRed(): number {
        const e = cc.sys.localStorage.getItem("sucai_endRed");
        return e ? Number(e) : 0;
    }

    set sucai_endRed(e: number) {
        cc.sys.localStorage.setItem("sucai_endRed", String(e));
    }

    get sucai_ballArr(): number[] {
        const e = cc.sys.localStorage.getItem("sucai_ballArr");
        return e
            ? e.split(",").map((item) => Number(item))
            : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    set sucai_ballArr(e: number[]) {
        cc.sys.localStorage.setItem("sucai_ballArr", e.join(","));
    }

    getCashBalance(e?: number): string {
        if (0 == e) {
            return e.toString();
        }
        e || (e = this.cash_balance);
        const t = Math.floor(100 * e) / 100;
        if (t < 100 && GlobalDataMgr.curLanguage == languages.ID) {
            return t.toString();
        }
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

    setFirstVideoCpm(e: any): void {
        EngineUtil.localStorageSetItem("FIRST_VIDEO_CPM", e);
    }

    addUserCashbalance(e: number): void {
        e >= 0 && (this.cash_balance += e);
    }

    getFirstVideoCpm(): any {
        return EngineUtil.localStorageGetItem("FIRST_VIDEO_CPM");
    }

    updateCashRecord(e: any[]): void {
        e &&
            e.length &&
            e.forEach((item) => {
                this.extract_gold_cash_record.set(item.id, item);
            });
    }

    setWdExtract(e: any[]): void {
        cc.sys.localStorage.setItem("saveWdExtract", e.join(","));
    }

    getTiXianInfo(e: any): boolean {
        return null != cc.sys.localStorage.getItem("tixian_" + e);
    }

    saveWdExtract(e: number): void {
        const t = cc.sys.localStorage.getItem("saveWdExtract");
        let o: number[] = [];
        t &&
            (o = t.split(",").map((item) => {
                return Number(item);
            }));
        o.unshift(e);
        cc.sys.localStorage.setItem("saveWdExtract", o.join(","));
    }

    getWdExtract(): number[] {
        const e = cc.sys.localStorage.getItem("saveWdExtract");
        let t: number[] = [];
        e &&
            (t = e.split(",").map((item) => {
                return Number(item);
            }));
        return t;
    }

    getCashWithUnit(e?: number): string {
        return "CN" == GlobalDataMgr.curLanguage
            ? this.getCashBalance(e) + "元"
            : this.getCashUnit() + " " + this.getCashBalance(e);
    }

    static _getInstance(): PlayerDataSys {
        this._instance || (this._instance = new PlayerDataSys());
        return this._instance;
    }

    removeWdExtract(e: number): void {
        const t = cc.sys.localStorage.getItem("saveWdExtract");
        let o: number[] = [];
        t &&
            (o = t.split(",").map((item) => {
                return Number(item);
            }));
        if (o.length) {
            o.splice(e, 1);
            cc.sys.localStorage.setItem("saveWdExtract", o.join(","));
        }
    }

    init(e: any): void {
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

    initUserId(e: any): void {
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

    getCashUnit(): string {
        return Currency[GlobalDataMgr.curLanguage] || "R$ ";
    }

    getConfigLevelID(e: number): number {
        if (e <= this.max_level_id) {
            return e;
        }
        const t = e - this.max_level_id;
        return this.loop_start_level_id + (t % this.loop_range);
    }

    is_new_user(): boolean {
        return this.new_user;
    }

    initWxData(e: any): void {
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

    arrivedNewCity(): void {
        if (1 != this._curSceneID) {
            const e = EngineUtil.localStorageGetItem("arrived_new_country", "0,0").split(",");
            this._curSceneID > Number(e[0]) &&
                Number(EngineUtil.localStorageSetItem("arrived_new_country", String(this._curSceneID) + ",0"));
        }
    }

    setTiXianInfo(e: any): void {
        cc.sys.localStorage.setItem("tixian_" + e, "true");
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

    setUserInfo(e: any): void {
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
                is_travel: 0,
            });
        }
    }

    getLevelTableFileName(): string {
        const e = ConfigDataSys.level_configMap.get(this.validConfigLevelID);
        return e ? e.lv_file : "l_1";
    }

    uploadCpm(e: any): void {
        this.userCpm = Number(e);
    }

    updateUserInfo(e: any): void {
        if (e) {
            const t = e.cash_balance;
            e.gold_balance;
            null != t && (this.cash_balance = t);
        }
    }

    private static _instance: PlayerDataSys = null;
}

export default PlayerDataSys._getInstance();
