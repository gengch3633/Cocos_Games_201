import ClientDataStore from "./ClientDataStore";

class PlayerDataStoreImpl {
    user_id = "";
    user_name = "";
    yid = "yid_read_failed";
    fund_balance = 0;
    cash_balance = 0;
    bubble_balance = 0;
    user_level = 0;
    task_point_num = 0;
    ltv_task_point_num = 0;
    circle_count = 0;
    sign_in = 0;
    hint_prop_count = 0;
    guideline_prop_count = 0;
    levels_passed_count = 0;
    guideline_eliminate_num = 0;
    current_arrow_level_id = "0";
    arrow_level = {
        arrow_level_id: 0,
        level_index: 0,
        time_limit: 0,
        arrow_count: 0,
        big_reward_trigger: 0,
        tail_clearance: 5,
        show_countdown: false,
        eliminate_reward: 0,
        life_count: 3,
    };
    is_tourists = false;
    create_time = "";
    ab_info: any = {};
    tx_bind_info: any[] = [];
    conf: any = {
        parameter_conf: {},
        cash_extract_conf: {},
    };
    _rawData: any = {};

    initUserId(data: any): void {
        const userId = data.user_id;
        const userName = data.user_name;
        const yid = data.yid;
        this.user_id = userId || "";
        this.user_name = userName || "";
        this.yid = yid || "yid_read_failed";
        ClientDataStore.yid = yid;
        ClientDataStore.user_id = userId || "";
        try {
            cc.sys.localStorage.setItem("yid", yid);
        } catch (e) {
        }
    }

    init(data: any): void {
        if (data) {
            const merged = data.user_info && typeof data.user_info === "object"
                ? Object.assign({}, data, data.user_info)
                : data;
            this._rawData = merged || {};
            this.cash_balance = Number(merged.cash_balance || 0);
            this.fund_balance = Number(merged.fund_balance || 0);
            this.bubble_balance = Number(merged.bubble_balance || 0);
            this.user_level = Number(merged.user_level || 0);
            this.task_point_num = Number(merged.task_point_num || 0);
            this.ltv_task_point_num = Number(merged.ltv_task_point_num || 0);
            this.circle_count = Number(merged.circle_count || 0);
            this.sign_in = Number(merged.sign_in || 0);
            this.hint_prop_count = Number(merged.hint_prop_count || 0);
            this.guideline_prop_count = Number(merged.guideline_prop_count || 0);
            this.levels_passed_count = Number(merged.levels_passed_count || 0);
            this.guideline_eliminate_num = Number(merged.guideline_eliminate_num || 0);
            this.current_arrow_level_id = String(merged.current_arrow_level_id || "0");
            this.is_tourists = !!merged.is_tourists;
            this.create_time = String(merged.create_time || "");
            this.ab_info = merged.ab_info || {};
            this.tx_bind_info = Array.isArray(merged.tx_bind_info) ? merged.tx_bind_info : [];
            this.conf = merged.conf || {
                parameter_conf: {},
                cash_extract_conf: {},
            };
        }
    }

    updateArrowLevel(data: any): void {
        if (data) {
            const levelIndex = Number((data.level_index != null ? data.level_index : data.arrow_level_index) || 0);
            this.arrow_level = {
                arrow_level_id: Number(data.arrow_level_id || 0),
                level_index: levelIndex,
                time_limit: Number(data.time_limit || 0),
                arrow_count: Number(data.arrow_count || 0),
                big_reward_trigger: Number(data.big_reward_trigger || 0),
                tail_clearance: Number(data.tail_clearance != null ? data.tail_clearance : 5),
                show_countdown: !!data.show_countdown,
                eliminate_reward: Number(data.eliminate_reward || 0),
                life_count: Number(data.life_count || 3),
            };
            this.current_arrow_level_id = String(this.arrow_level.arrow_level_id || "0");
            try {
                console.log("[ArrowLevel] PlayerDataStore.updateArrowLevel: " + JSON.stringify(this.arrow_level));
            } catch (e) {
            }
        }
    }

    get(path: string, defaultValue: any = null): any {
        if (!path) {
            return defaultValue;
        }
        const parts = String(path).split(".");
        let current = this._rawData;
        for (let i = 0; i < parts.length; i++) {
            if (current == null) {
                return defaultValue;
            }
            const key = parts[i];
            if (!Object.prototype.hasOwnProperty.call(current, key)) {
                return defaultValue;
            }
            current = current[key];
        }
        return current == null ? defaultValue : current;
    }

    getUserInfoForBiz(): any {
        return {
            cash_balance: this.cash_balance,
            fund_balance: this.fund_balance,
            bubble_balance: this.bubble_balance,
            user_level: this.user_level,
            task_point_num: this.task_point_num,
            ltv_task_point_num: this.ltv_task_point_num,
            circle_count: this.circle_count,
            sign_in: this.sign_in,
            hint_prop_count: this.hint_prop_count,
            guideline_prop_count: this.guideline_prop_count,
            levels_passed_count: this.levels_passed_count,
            guideline_eliminate_num: this.guideline_eliminate_num,
            current_arrow_level_id: this.current_arrow_level_id,
            is_tourists: this.is_tourists,
            create_time: this.create_time,
            tx_bind_info: this.tx_bind_info,
            ab_info: this.ab_info,
            conf: this.conf,
        };
    }

    getCashExtractConf(): any {
        return this.get("conf.cash_extract_conf", {});
    }

    getParameterConf(): any {
        return this.get("conf.parameter_conf", {});
    }
}

export default new PlayerDataStoreImpl();
