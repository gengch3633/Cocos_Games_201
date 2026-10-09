import EngineUtil from "./EngineUtil";
import PlayerDataSys from "./PlayerDataSys";
import SystemDataSys from "./SystemDataSys";
import { UiManager } from "./UiManage";

export const EffectEnum = cc.Enum({
    cash: 0,
    gold: 1
});

export const AD_TYPE = {
    lucky_box: "lucky_box",
    relive: "relive"
};

export const WebUrlType = {
    USER_TYPE: "USER_TYPE",
    PRIVACY_TYPE: "PRIVACY_TYPE",
    USER_QUERY: "USER_QUERY"
};

export const failReason = cc.Enum({
    account_error: 2,
    account_abnormal: 3,
    merchat_exception: 4,
    system_error: 5,
    unknown_error: 9
});

class GameDataMgr {

    taskItem = null;
    taskItemPool = new cc.NodePool();
    rankItem = null;
    rankItemPool = new cc.NodePool();
    withdrawItem = null;
    withdrawItemPool = new cc.NodePool();
    rollingItem = null;
    rollingItemPool = new cc.NodePool();
    Level = null;
    LevelPool = new cc.NodePool();
    kali = null;
    kaliPool = new cc.NodePool();
    propeffect = null;
    propeffectPool = new cc.NodePool();
    board_try_times = [];
    board_frequency = [];
    get_free_diamond_flag = false;
    open_billboard_flag = false;
    into_extract_flag = false;
    click_add_slot = false;
    card_slot_number = 0;
    charge_list = [];
    subsidy_remove_reward = 0;
    remove_reward = 0;
    level_1 = [];
    level_2 = [];
    level_3 = [];
    level_4_1 = [];
    level_4_2 = [];
    level_config = [];
    extract_info_can = [];
    lucky_box_current_count = 0;
    lucky_box_daily_max_count = 0;
    lucky_box_diamond = 0;
    level_map = [];
    LevelArr = [];
    Trough_map = [];
    Shift_map = [];
    averageWithdrawCash = 0;
    averageChallengeTimes = 0;
    todayPassNum = 0;
    sroll_msg_list = [];
    level_4_1_num = 0;
    level_4_2_num = 0;
    removedata = null;
    removedata2 = null;
    attempt_count = null;
    reward_10times;
    props_status;
    today;
    task_counts;

    static _instance: GameDataMgr = null;

    getExtractState(level) {
        for (let i = 0; i < this.extract_info_can.length; i++) {
            const info = this.extract_info_can[i];
            if (info.level == level) {
                return info.status;
            }
        }
        return 0;
    }

    initPropEffectPool(prefab, count?) {
        if (undefined === count) {
            count = 3;
        }
        if (prefab) {
            this.propeffect = prefab;
            if (this.propeffectPool.size() >= count) {
                return;
            }
            for (let i = 0; i < count; i++) {
                const node = cc.instantiate(prefab);
                this.propeffectPool.put(node);
            }
        }
    }

    static _getInstance() {
        this._instance || (GameDataMgr._instance = new GameDataMgr());
        return GameDataMgr._instance;
    }

    setpropeffectPool(node) {
        this.propeffectPool.put(node);
    }

    is_reviewer() {
        return SystemDataSys.reviewing;
    }

    setAverageChallengeTimes() {
        this.attempt_count > 400 && (this.attempt_count = 400);
        const item = this.board_try_times[this.attempt_count - 1];
        if (item) {
            const average_tryTimes_max = item.average_tryTimes_max;
            const average_tryTimes_min = item.average_tryTimes_min;
            item.tryTimes_show, item.tryTimes_show_rate, item.try_times;
            this.averageChallengeTimes = Number(EngineUtil.random(average_tryTimes_min, average_tryTimes_max));
        }
    }

    clear() {
    }

    getkaliPool() {
        return this.kaliPool.size() > 0 ? this.kaliPool.get() : cc.instantiate(this.kali);
    }

    getWithdrawItem() {
        return this.withdrawItemPool.size() > 0 ? this.withdrawItemPool.get() : cc.instantiate(this.withdrawItem);
    }

    getSubsidyRemoveReward() {
        let reward = this.subsidy_remove_reward;
        this.reward_10times.reward_10times_recharge_flag && (reward *= 10);
        return reward;
    }

    init(data) {
        data && this.initGameConfig(data);
    }

    setLevelPool(node) {
        this.LevelPool.put(node);
    }

    initWithdrawItemPool(prefab, count?) {
        if (undefined === count) {
            count = 60;
        }
        if (prefab) {
            this.withdrawItem = prefab;
            if (this.withdrawItemPool.size() >= count) {
                return;
            }
            for (let i = 0; i < count; i++) {
                const node = cc.instantiate(prefab);
                this.withdrawItemPool.put(node);
            }
        }
    }

    getNoticeTimeData() {
        const hour = new Date().getHours();
        for (let i = 3; i < this.board_frequency.length; i++) {
            const item = this.board_frequency[i];
            const time_rule_max = (item.id, item.level_rule, item.show_duration, item.show_duration_rate, item.time_rule_max);
            const time_rule_min = item.time_rule_min;
            if (hour < time_rule_max && hour >= time_rule_min) {
                return this.board_frequency[i];
            }
        }
    }

    getTodayPassNum() {
        return this.todayPassNum;
    }

    addAverageChallengeTimes(value) {
        const next = (this.averageChallengeTimes * (this.todayPassNum - 1) + value) / this.todayPassNum;
        const rounded = Math.floor(100 * next) / 100;
        this.averageChallengeTimes = rounded;
    }

    setAverageWithdrawCash() {
        const a = EngineUtil.random(130, 180);
        const b = EngineUtil.random(7e4, 11e4);
        this.averageWithdrawCash = this.averageChallengeTimes * (a + b);
    }

    setRemoveData(data) {
        this.removedata = data;
    }

    setkaliPool(node) {
        this.kaliPool.put(node);
    }

    getAverageChallengeTimes() {
        const level = PlayerDataSys.user_level;
        return 1 == level || 2 == level ? 1 : 3 == level ? Math.floor(5 * Math.random() + 11) / 10 : 4 == level ? this.averageChallengeTimes : undefined;
    }

    getpropeffectPool() {
        return this.propeffectPool.size() > 0 ? this.propeffectPool.get() : cc.instantiate(this.propeffect);
    }

    initkaliPool(prefab, count?) {
        if (undefined === count) {
            count = 3;
        }
        if (prefab) {
            this.kali = prefab;
            if (this.kaliPool.size() >= count) {
                return;
            }
            for (let i = 0; i < count; i++) {
                const node = cc.instantiate(prefab);
                this.kaliPool.put(node);
            }
        }
    }

    getRemoveReward() {
        let reward = this.remove_reward;
        this.reward_10times.reward_10times_recharge_flag && (reward *= 10);
        return reward;
    }

    getRankItem() {
        return this.rankItemPool.size() > 0 ? this.rankItemPool.get() : cc.instantiate(this.rankItem);
    }

    setrollingPool(node) {
        this.rollingItemPool.put(node);
    }

    initGameConfig(data) {
        if (data) {
            const extract_info_can = data.extract_info_can;
            const level_1 = data.level_1;
            const level_2 = data.level_2;
            const level_3 = data.level_3;
            const level_4_1 = data.level_4_1;
            const level_4_2 = data.level_4_2;
            const level_config_double = data.level_config_double;
            const lucky_box_current_count = data.lucky_box_current_count;
            const lucky_box_daily_max_count = data.lucky_box_daily_max_count;
            const lucky_box_diamond = data.lucky_box_diamond;
            const props_status = data.props_status;
            const board_try_times = (data.offline_data, data.level_statistics, data.board_try_times);
            const board_frequency = data.board_frequency;
            const task_counts = (data.diamond_recharge, data.task_counts);
            const get_free_diamond_flag = data.get_free_diamond_flag;
            const open_billboard_flag = data.open_billboard_flag;
            const into_extract_flag = data.into_extract_flag;
            const click_add_slot = data.click_add_slot;
            const card_slot_number = data.card_slot_number;
            const charge_list = data.charge_list;
            const reward_10times = data.reward_10times;
            data.is_reviewer;
            this.extract_info_can = extract_info_can;
            this.level_1 = level_1;
            this.level_2 = level_2;
            this.level_3 = level_3;
            this.level_4_1 = level_4_1;
            this.level_4_2 = level_4_2;
            this.level_4_1_num = 1;
            this.level_4_2_num = 1;
            this.level_config = level_config_double;
            this.lucky_box_current_count = lucky_box_current_count;
            this.lucky_box_daily_max_count = lucky_box_daily_max_count;
            this.lucky_box_diamond = lucky_box_diamond;
            this.props_status = props_status;
            this.board_try_times = board_try_times;
            this.board_frequency = board_frequency;
            this.today = "today";
            this.task_counts = task_counts;
            this.attempt_count = 0;
            this.get_free_diamond_flag = get_free_diamond_flag;
            this.open_billboard_flag = open_billboard_flag;
            this.into_extract_flag = into_extract_flag;
            this.click_add_slot = click_add_slot;
            this.card_slot_number = card_slot_number;
            this.charge_list = charge_list;
            this.reward_10times = reward_10times;
            const offlineData = cc.sys.localStorage.getItem("offline_data");
            JSON.parse(offlineData);
        }
    }

    initRankItemPool(prefab, count?) {
        if (undefined === count) {
            count = 60;
        }
        if (prefab) {
            this.rankItem = prefab;
            if (this.rankItemPool.size() >= count) {
                return;
            }
            for (let i = 0; i < count; i++) {
                const node = cc.instantiate(prefab);
                this.rankItemPool.put(node);
            }
        }
    }

    initrollingItemPool(prefab, count?) {
        if (undefined === count) {
            count = 20;
        }
        if (prefab) {
            this.rollingItem = prefab;
            if (this.rollingItemPool.size() >= count) {
                return;
            }
            for (let i = 0; i < count; i++) {
                const node = cc.instantiate(prefab);
                this.rollingItemPool.put(node);
            }
        }
    }

    setTodayPassNum(value) {
        this.todayPassNum = value;
    }

    setLevelMap(level) {
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
        }
    }

    getTaskItem() {
        return this.taskItemPool.size() > 0 ? this.taskItemPool.get() : cc.instantiate(this.taskItem);
    }

    initTaskItemPool(prefab, count?) {
        if (undefined === count) {
            count = 60;
        }
        if (prefab) {
            this.taskItem = prefab;
            if (this.taskItemPool.size() >= count) {
                return;
            }
            for (let i = 0; i < count; i++) {
                const node = cc.instantiate(prefab);
                this.taskItemPool.put(node);
            }
        }
    }

    addTodayPassNum(value) {
        this.todayPassNum += value;
    }

    getAverageWithdrawCash() {
        const level = PlayerDataSys.user_level;
        return 1 == level ? 20 : 2 == level ? 300 : 3 == level ? Number(EngineUtil.random(880, 1150)) : 4 == level ? this.averageWithdrawCash : undefined;
    }

    getLevelPool() {
        return this.LevelPool.size() > 0 ? this.LevelPool.get() : cc.instantiate(this.Level);
    }

    initLevelPool(prefab, count?) {
        if (undefined === count) {
            count = 3;
        }
        if (prefab) {
            this.Level = prefab;
            if (this.LevelPool.size() >= count) {
                return;
            }
            for (let i = 0; i < count; i++) {
                const node = cc.instantiate(prefab);
                this.LevelPool.put(node);
            }
        }
    }

    getrollingItem() {
        return this.rollingItemPool.size() > 0 ? this.rollingItemPool.get() : cc.instantiate(this.rollingItem);
    }

    setCardSpriteFrame(node, card) {
        cc.isValid(node) && UiManager.loadSpriteFrame(node, "card", "card_" + card);
    }

    getLevelCardArray() {
    }

    setRemoveData2(data) {
        this.removedata2 = data;
    }

    getNoticeData() {
        this.attempt_count > 400 && (this.attempt_count = 400);
        let item = this.board_try_times[this.attempt_count - 1];
        null == item && (item = this.board_try_times[this.board_try_times.length - 1]);
        return item;
    }

    addAverageWithdrawCash(value) {
        this.averageWithdrawCash = Math.floor((this.averageWithdrawCash * (this.todayPassNum - 1) + value) / this.todayPassNum);
    }
}

export default GameDataMgr._getInstance();
