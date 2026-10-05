import PlayerDataSys from "./PlayerDataSys";
import SystemDataSys from "./SystemDataSys";
import EngineUtil from "./EngineUtil";
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
    private static _instance: GameDataMgr = null;

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
    charge_list: unknown[] = [];
    subsidy_remove_reward = 0;
    remove_reward = 0;
    level_1: unknown[] = [];
    level_2: unknown[] = [];
    level_3: unknown[] = [];
    level_4_1: unknown[] = [];
    level_4_2: unknown[] = [];
    level_config: unknown[] = [];
    extract_info_can: Array<{ level: number; status: number }> = [];
    lucky_box_current_count = 0;
    lucky_box_daily_max_count = 0;
    lucky_box_diamond = 0;
    level_map: unknown[] = [];
    LevelArr: unknown[] = [];
    Trough_map: unknown[] = [];
    Shift_map: unknown[] = [];
    averageWithdrawCash = 0;
    averageChallengeTimes = 0;
    todayPassNum = 0;
    sroll_msg_list: unknown[] = [];
    level_4_1_num = 0;
    level_4_2_num = 0;
    removedata: unknown = null;
    removedata2: unknown = null;
    attempt_count: number = null;
    props_status: unknown = null;
    today: string = null;
    task_counts: unknown = null;
    reward_10times: { reward_10times_recharge_flag?: boolean } = null;

    getExtractState(level: number): number {
        for (let i = 0; i < this.extract_info_can.length; i++) {
            const item = this.extract_info_can[i];
            if (item.level == level) {
                return item.status;
            }
        }
        return 0;
    }

    initPropEffectPool(prefab: cc.Prefab, count = 3): void {
        if (prefab) {
            this.propeffect = prefab;
            if (this.propeffectPool.size() >= count) {
                return;
            }
            for (let i = 0; i < count; i++) {
                this.propeffectPool.put(cc.instantiate(prefab));
            }
        }
    }

    private static _getInstance(): GameDataMgr {
        if (!GameDataMgr._instance) {
            GameDataMgr._instance = new GameDataMgr();
        }
        return GameDataMgr._instance;
    }

    setpropeffectPool(node: cc.Node): void {
        this.propeffectPool.put(node);
    }

    is_reviewer(): boolean {
        return SystemDataSys.reviewing;
    }

    setAverageChallengeTimes(): void {
        if (this.attempt_count > 400) {
            this.attempt_count = 400;
        }
        const entry = this.board_try_times[this.attempt_count - 1];
        if (entry) {
            const min = entry.average_tryTimes_min;
            const max = entry.average_tryTimes_max;
            this.averageChallengeTimes = Number(EngineUtil.random(min, max));
        }
    }

    clear(): void {}

    getkaliPool(): cc.Node {
        return this.kaliPool.size() > 0 ? this.kaliPool.get() : cc.instantiate(this.kali);
    }

    getWithdrawItem(): cc.Node {
        return this.withdrawItemPool.size() > 0 ? this.withdrawItemPool.get() : cc.instantiate(this.withdrawItem);
    }

    getSubsidyRemoveReward(): number {
        let reward = this.subsidy_remove_reward;
        if (this.reward_10times?.reward_10times_recharge_flag) {
            reward *= 10;
        }
        return reward;
    }

    init(data?: unknown): void {
        if (data) {
            this.initGameConfig(data);
        }
    }

    setLevelPool(node: cc.Node): void {
        this.LevelPool.put(node);
    }

    initWithdrawItemPool(prefab: cc.Prefab, count = 60): void {
        if (prefab) {
            this.withdrawItem = prefab;
            if (this.withdrawItemPool.size() >= count) {
                return;
            }
            for (let i = 0; i < count; i++) {
                this.withdrawItemPool.put(cc.instantiate(prefab));
            }
        }
    }

    getNoticeTimeData(): unknown {
        const hour = new Date().getHours();
        for (let i = 3; i < this.board_frequency.length; i++) {
            const item = this.board_frequency[i];
            const max = item.time_rule_max;
            const min = item.time_rule_min;
            if (hour < max && hour >= min) {
                return this.board_frequency[i];
            }
        }
    }

    getTodayPassNum(): number {
        return this.todayPassNum;
    }

    addAverageChallengeTimes(value: number): void {
        const average = (this.averageChallengeTimes * (this.todayPassNum - 1) + value) / this.todayPassNum;
        this.averageChallengeTimes = Math.floor(100 * average) / 100;
    }

    setAverageWithdrawCash(): void {
        const factorA = EngineUtil.random(130, 180);
        const factorB = EngineUtil.random(70000, 110000);
        this.averageWithdrawCash = this.averageChallengeTimes * (factorA + factorB);
    }

    setRemoveData(data: unknown): void {
        this.removedata = data;
    }

    setkaliPool(node: cc.Node): void {
        this.kaliPool.put(node);
    }

    getAverageChallengeTimes(): number {
        const userLevel = PlayerDataSys.user_level;
        if (userLevel == 1 || userLevel == 2) {
            return 1;
        }
        if (userLevel == 3) {
            return Math.floor(5 * Math.random() + 11) / 10;
        }
        if (userLevel == 4) {
            return this.averageChallengeTimes;
        }
    }

    getpropeffectPool(): cc.Node {
        return this.propeffectPool.size() > 0 ? this.propeffectPool.get() : cc.instantiate(this.propeffect);
    }

    initkaliPool(prefab: cc.Prefab, count = 3): void {
        if (prefab) {
            this.kali = prefab;
            if (this.kaliPool.size() >= count) {
                return;
            }
            for (let i = 0; i < count; i++) {
                this.kaliPool.put(cc.instantiate(prefab));
            }
        }
    }

    getRemoveReward(): number {
        let reward = this.remove_reward;
        if (this.reward_10times?.reward_10times_recharge_flag) {
            reward *= 10;
        }
        return reward;
    }

    getRankItem(): cc.Node {
        return this.rankItemPool.size() > 0 ? this.rankItemPool.get() : cc.instantiate(this.rankItem);
    }

    setrollingPool(node: cc.Node): void {
        this.rollingItemPool.put(node);
    }

    initGameConfig(data: any): void {
        if (data) {
            this.extract_info_can = data.extract_info_can;
            this.level_1 = data.level_1;
            this.level_2 = data.level_2;
            this.level_3 = data.level_3;
            this.level_4_1 = data.level_4_1;
            this.level_4_2 = data.level_4_2;
            this.level_4_1_num = 1;
            this.level_4_2_num = 1;
            this.level_config = data.level_config_double;
            this.lucky_box_current_count = data.lucky_box_current_count;
            this.lucky_box_daily_max_count = data.lucky_box_daily_max_count;
            this.lucky_box_diamond = data.lucky_box_diamond;
            this.props_status = data.props_status;
            this.board_try_times = data.board_try_times;
            this.board_frequency = data.board_frequency;
            this.today = "today";
            this.task_counts = data.task_counts;
            this.attempt_count = 0;
            this.get_free_diamond_flag = data.get_free_diamond_flag;
            this.open_billboard_flag = data.open_billboard_flag;
            this.into_extract_flag = data.into_extract_flag;
            this.click_add_slot = data.click_add_slot;
            this.card_slot_number = data.card_slot_number;
            this.charge_list = data.charge_list;
            this.reward_10times = data.reward_10times;
            const offlineData = cc.sys.localStorage.getItem("offline_data");
            JSON.parse(offlineData);
        }
    }

    initRankItemPool(prefab: cc.Prefab, count = 60): void {
        if (prefab) {
            this.rankItem = prefab;
            if (this.rankItemPool.size() >= count) {
                return;
            }
            for (let i = 0; i < count; i++) {
                this.rankItemPool.put(cc.instantiate(prefab));
            }
        }
    }

    initrollingItemPool(prefab: cc.Prefab, count = 20): void {
        if (prefab) {
            this.rollingItem = prefab;
            if (this.rollingItemPool.size() >= count) {
                return;
            }
            for (let i = 0; i < count; i++) {
                this.rollingItemPool.put(cc.instantiate(prefab));
            }
        }
    }

    setTodayPassNum(value: number): void {
        this.todayPassNum = value;
    }

    setLevelMap(level: number): void {
        switch (level) {
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
                break;
        }
    }

    getTaskItem(): cc.Node {
        return this.taskItemPool.size() > 0 ? this.taskItemPool.get() : cc.instantiate(this.taskItem);
    }

    initTaskItemPool(prefab: cc.Prefab, count = 60): void {
        if (prefab) {
            this.taskItem = prefab;
            if (this.taskItemPool.size() >= count) {
                return;
            }
            for (let i = 0; i < count; i++) {
                this.taskItemPool.put(cc.instantiate(prefab));
            }
        }
    }

    addTodayPassNum(value: number): void {
        this.todayPassNum += value;
    }

    getAverageWithdrawCash(): number {
        const userLevel = PlayerDataSys.user_level;
        if (userLevel == 1) {
            return 20;
        }
        if (userLevel == 2) {
            return 300;
        }
        if (userLevel == 3) {
            return Number(EngineUtil.random(880, 1150));
        }
        if (userLevel == 4) {
            return this.averageWithdrawCash;
        }
    }

    getLevelPool(): cc.Node {
        return this.LevelPool.size() > 0 ? this.LevelPool.get() : cc.instantiate(this.Level);
    }

    initLevelPool(prefab: cc.Prefab, count = 3): void {
        if (prefab) {
            this.Level = prefab;
            if (this.LevelPool.size() >= count) {
                return;
            }
            for (let i = 0; i < count; i++) {
                this.LevelPool.put(cc.instantiate(prefab));
            }
        }
    }

    getrollingItem(): cc.Node {
        return this.rollingItemPool.size() > 0 ? this.rollingItemPool.get() : cc.instantiate(this.rollingItem);
    }

    setCardSpriteFrame(sprite: cc.Sprite, cardId: number): void {
        if (cc.isValid(sprite)) {
            UiManager.loadSpriteFrame(sprite, "card", "card_" + cardId);
        }
    }

    getLevelCardArray(): void {}

    setRemoveData2(data: unknown): void {
        this.removedata2 = data;
    }

    getNoticeData(): unknown {
        if (this.attempt_count > 400) {
            this.attempt_count = 400;
        }
        let entry = this.board_try_times[this.attempt_count - 1];
        if (entry == null) {
            entry = this.board_try_times[this.board_try_times.length - 1];
        }
        return entry;
    }

    addAverageWithdrawCash(value: number): void {
        this.averageWithdrawCash = Math.floor(
            (this.averageWithdrawCash * (this.todayPassNum - 1) + value) / this.todayPassNum
        );
    }
}

export default GameDataMgr._getInstance();
