import EngineUtil from "./EngineUtil";
import PlayerDataSys from "./PlayerDataSys";
import SystemDataSys from "./SystemDataSys";
import { UiManager } from "./UiManage";

export const EffectEnum = cc.Enum({
    cash: 0,
    gold: 1,
});

export const AD_TYPE = {
    lucky_box: "lucky_box",
    relive: "relive",
};

export const WebUrlType = {
    USER_TYPE: "USER_TYPE",
    PRIVACY_TYPE: "PRIVACY_TYPE",
    USER_QUERY: "USER_QUERY",
};

export const failReason = cc.Enum({
    account_error: 2,
    account_abnormal: 3,
    merchat_exception: 4,
    system_error: 5,
    unknown_error: 9,
});

class GameDataMgr {
    taskItem: cc.Prefab = null;
    taskItemPool = new cc.NodePool();
    rankItem: cc.Prefab = null;
    rankItemPool = new cc.NodePool();
    withdrawItem: cc.Prefab = null;
    withdrawItemPool = new cc.NodePool();
    rollingItem: cc.Prefab = null;
    rollingItemPool = new cc.NodePool();
    Level: cc.Prefab = null;
    LevelPool = new cc.NodePool();
    kali: cc.Prefab = null;
    kaliPool = new cc.NodePool();
    propeffect: cc.Prefab = null;
    propeffectPool = new cc.NodePool();
    board_try_times: any[] = [];
    board_frequency: any[] = [];
    get_free_diamond_flag = false;
    open_billboard_flag = false;
    into_extract_flag = false;
    click_add_slot = false;
    card_slot_number = 0;
    charge_list: any[] = [];
    subsidy_remove_reward = 0;
    remove_reward = 0;
    level_1: any[] = [];
    level_2: any[] = [];
    level_3: any[] = [];
    level_4_1: any[] = [];
    level_4_2: any[] = [];
    level_config: any[] = [];
    extract_info_can: any[] = [];
    lucky_box_current_count = 0;
    lucky_box_daily_max_count = 0;
    lucky_box_diamond = 0;
    level_map: any[] = [];
    LevelArr: any[] = [];
    Trough_map: any[] = [];
    Shift_map: any[] = [];
    averageWithdrawCash = 0;
    averageChallengeTimes = 0;
    todayPassNum = 0;
    sroll_msg_list: any[] = [];
    level_4_1_num = 0;
    level_4_2_num = 0;
    removedata: any = null;
    removedata2: any = null;
    attempt_count: number = null;
    props_status: any = null;
    today: string = null;
    task_counts: any = null;
    reward_10times: any = null;

    private static _instance: GameDataMgr = null;

    static _getInstance(): GameDataMgr {
        if (!this._instance) {
            this._instance = new GameDataMgr();
        }
        return this._instance;
    }

    getExtractState(e: number): number {
        for (let t = 0; t < this.extract_info_can.length; t++) {
            const o = this.extract_info_can[t];
            if (o.level == e) {
                return o.status;
            }
        }
        return 0;
    }

    initPropEffectPool(e: cc.Prefab, t = 3): void {
        if (e) {
            this.propeffect = e;
            if (this.propeffectPool.size() >= t) {
                return;
            }
            for (let o = 0; o < t; o++) {
                const n = cc.instantiate(e);
                this.propeffectPool.put(n);
            }
        }
    }

    setpropeffectPool(e: cc.Node): void {
        this.propeffectPool.put(e);
    }

    is_reviewer(): boolean {
        return SystemDataSys.reviewing;
    }

    setAverageChallengeTimes(): void {
        if (this.attempt_count > 400) {
            this.attempt_count = 400;
        }
        const e = this.board_try_times[this.attempt_count - 1];
        if (e) {
            const t = e.average_tryTimes_max;
            const o = e.average_tryTimes_min;
            this.averageChallengeTimes = Number(EngineUtil.random(o, t));
        }
    }

    clear(): void {
    }

    getkaliPool(): cc.Node {
        return this.kaliPool.size() > 0 ? this.kaliPool.get() : cc.instantiate(this.kali);
    }

    getWithdrawItem(): cc.Node {
        return this.withdrawItemPool.size() > 0 ? this.withdrawItemPool.get() : cc.instantiate(this.withdrawItem);
    }

    getSubsidyRemoveReward(): number {
        let e = this.subsidy_remove_reward;
        if (this.reward_10times.reward_10times_recharge_flag) {
            e *= 10;
        }
        return e;
    }

    init(e: any): void {
        if (e) {
            this.initGameConfig(e);
        }
    }

    setLevelPool(e: cc.Node): void {
        this.LevelPool.put(e);
    }

    initWithdrawItemPool(e: cc.Prefab, t = 60): void {
        if (e) {
            this.withdrawItem = e;
            if (this.withdrawItemPool.size() >= t) {
                return;
            }
            for (let o = 0; o < t; o++) {
                const n = cc.instantiate(e);
                this.withdrawItemPool.put(n);
            }
        }
    }

    getNoticeTimeData(): any {
        const e = new Date().getHours();
        for (let t = 3; t < this.board_frequency.length; t++) {
            const o = this.board_frequency[t];
            const n = o.time_rule_max;
            const i = o.time_rule_min;
            if (e < n && e >= i) {
                return this.board_frequency[t];
            }
        }
    }

    getTodayPassNum(): number {
        return this.todayPassNum;
    }

    addAverageChallengeTimes(e: number): void {
        const t = (this.averageChallengeTimes * (this.todayPassNum - 1) + e) / this.todayPassNum;
        const o = Math.floor(100 * t) / 100;
        this.averageChallengeTimes = o;
    }

    setAverageWithdrawCash(): void {
        const e = EngineUtil.random(130, 180);
        const t = EngineUtil.random(70000, 110000);
        this.averageWithdrawCash = this.averageChallengeTimes * (e + t);
    }

    setRemoveData(e: any): void {
        this.removedata = e;
    }

    setkaliPool(e: cc.Node): void {
        this.kaliPool.put(e);
    }

    getAverageChallengeTimes(): number {
        const e = PlayerDataSys.user_level;
        if (e == 1 || e == 2) {
            return 1;
        }
        if (e == 3) {
            return Math.floor(5 * Math.random() + 11) / 10;
        }
        if (e == 4) {
            return this.averageChallengeTimes;
        }
    }

    getpropeffectPool(): cc.Node {
        return this.propeffectPool.size() > 0 ? this.propeffectPool.get() : cc.instantiate(this.propeffect);
    }

    initkaliPool(e: cc.Prefab, t = 3): void {
        if (e) {
            this.kali = e;
            if (this.kaliPool.size() >= t) {
                return;
            }
            for (let o = 0; o < t; o++) {
                const n = cc.instantiate(e);
                this.kaliPool.put(n);
            }
        }
    }

    getRemoveReward(): number {
        let e = this.remove_reward;
        if (this.reward_10times.reward_10times_recharge_flag) {
            e *= 10;
        }
        return e;
    }

    getRankItem(): cc.Node {
        return this.rankItemPool.size() > 0 ? this.rankItemPool.get() : cc.instantiate(this.rankItem);
    }

    setrollingPool(e: cc.Node): void {
        this.rollingItemPool.put(e);
    }

    initGameConfig(e: any): void {
        if (e) {
            const t = e.extract_info_can;
            const o = e.level_1;
            const n = e.level_2;
            const i = e.level_3;
            const a = e.level_4_1;
            const r = e.level_4_2;
            const l = e.level_config_double;
            const s = e.lucky_box_current_count;
            const c = e.lucky_box_daily_max_count;
            const u = e.lucky_box_diamond;
            const p = e.props_status;
            const d = e.board_try_times;
            const _ = e.board_frequency;
            const f = e.task_counts;
            const h = e.get_free_diamond_flag;
            const g = e.open_billboard_flag;
            const y = e.into_extract_flag;
            const v = e.click_add_slot;
            const m = e.card_slot_number;
            const b = e.charge_list;
            const C = e.reward_10times;
            this.extract_info_can = t;
            this.level_1 = o;
            this.level_2 = n;
            this.level_3 = i;
            this.level_4_1 = a;
            this.level_4_2 = r;
            this.level_4_1_num = 1;
            this.level_4_2_num = 1;
            this.level_config = l;
            this.lucky_box_current_count = s;
            this.lucky_box_daily_max_count = c;
            this.lucky_box_diamond = u;
            this.props_status = p;
            this.board_try_times = d;
            this.board_frequency = _;
            this.today = "today";
            this.task_counts = f;
            this.attempt_count = 0;
            this.get_free_diamond_flag = h;
            this.open_billboard_flag = g;
            this.into_extract_flag = y;
            this.click_add_slot = v;
            this.card_slot_number = m;
            this.charge_list = b;
            this.reward_10times = C;
            const P = cc.sys.localStorage.getItem("offline_data");
            JSON.parse(P);
        }
    }

    initRankItemPool(e: cc.Prefab, t = 60): void {
        if (e) {
            this.rankItem = e;
            if (this.rankItemPool.size() >= t) {
                return;
            }
            for (let o = 0; o < t; o++) {
                const n = cc.instantiate(e);
                this.rankItemPool.put(n);
            }
        }
    }

    initrollingItemPool(e: cc.Prefab, t = 20): void {
        if (e) {
            this.rollingItem = e;
            if (this.rollingItemPool.size() >= t) {
                return;
            }
            for (let o = 0; o < t; o++) {
                const n = cc.instantiate(e);
                this.rollingItemPool.put(n);
            }
        }
    }

    setTodayPassNum(e: number): void {
        this.todayPassNum = e;
    }

    setLevelMap(e: number): void {
        switch (e) {
            case 1:
                this.level_map = this.level_1;
                break;
            case 2:
                this.level_map = this.level_2;
                break;
            case 3:
                this.level_map = this.level_3;
                break;
            case 4:
                this.level_map = this.level_4_1.concat(this.level_4_2);
        }
    }

    getTaskItem(): cc.Node {
        return this.taskItemPool.size() > 0 ? this.taskItemPool.get() : cc.instantiate(this.taskItem);
    }

    initTaskItemPool(e: cc.Prefab, t = 60): void {
        if (e) {
            this.taskItem = e;
            if (this.taskItemPool.size() >= t) {
                return;
            }
            for (let o = 0; o < t; o++) {
                const n = cc.instantiate(e);
                this.taskItemPool.put(n);
            }
        }
    }

    addTodayPassNum(e: number): void {
        this.todayPassNum += e;
    }

    getAverageWithdrawCash(): number {
        const e = PlayerDataSys.user_level;
        if (e == 1) {
            return 20;
        }
        if (e == 2) {
            return 300;
        }
        if (e == 3) {
            return Number(EngineUtil.random(880, 1150));
        }
        if (e == 4) {
            return this.averageWithdrawCash;
        }
    }

    getLevelPool(): cc.Node {
        return this.LevelPool.size() > 0 ? this.LevelPool.get() : cc.instantiate(this.Level);
    }

    initLevelPool(e: cc.Prefab, t = 3): void {
        if (e) {
            this.Level = e;
            if (this.LevelPool.size() >= t) {
                return;
            }
            for (let o = 0; o < t; o++) {
                const n = cc.instantiate(e);
                this.LevelPool.put(n);
            }
        }
    }

    getrollingItem(): cc.Node {
        return this.rollingItemPool.size() > 0 ? this.rollingItemPool.get() : cc.instantiate(this.rollingItem);
    }

    setCardSpriteFrame(e: cc.Node, t: number): void {
        if (cc.isValid(e)) {
            UiManager.loadSpriteFrame(e, "card", "card_" + t);
        }
    }

    getLevelCardArray(): void {
    }

    setRemoveData2(e: any): void {
        this.removedata2 = e;
    }

    getNoticeData(): any {
        if (this.attempt_count > 400) {
            this.attempt_count = 400;
        }
        let e = this.board_try_times[this.attempt_count - 1];
        if (e == null) {
            e = this.board_try_times[this.board_try_times.length - 1];
        }
        return e;
    }

    addAverageWithdrawCash(e: number): void {
        this.averageWithdrawCash = Math.floor(
            (this.averageWithdrawCash * (this.todayPassNum - 1) + e) / this.todayPassNum
        );
    }
}

export default GameDataMgr._getInstance();
