import ClientDataStore from "./ClientDataStore";

interface ArrowLevelInfo {
    arrow_level_id: number;
    level_index: number;
    time_limit: number;
    arrow_count: number;
    big_reward_trigger: number;
    tail_clearance: number;
    show_countdown: boolean;
    eliminate_reward: number;
    life_count: number;
}

interface PlayerConfInfo {
    parameter_conf: Record<string, any>;
    cash_extract_conf: Record<string, any>;
}

interface InitUserIdParams {
    user_id?: string;
    user_name?: string;
    yid?: string;
}

class PlayerDataStore {
    public user_id: string = "";
    public user_name: string = "";
    public yid: string = "yid_read_failed";
    public fund_balance: number = 0;
    public cash_balance: number = 0;
    public bubble_balance: number = 0;
    public user_level: number = 0;
    public task_point_num: number = 0;
    public ltv_task_point_num: number = 0;
    public circle_count: number = 0;
    public sign_in: number = 0;
    public hint_prop_count: number = 0;
    public guideline_prop_count: number = 0;
    public levels_passed_count: number = 0;
    public guideline_eliminate_num: number = 0;
    public current_arrow_level_id: string = "0";
    public arrow_level: ArrowLevelInfo = {
        arrow_level_id: 0,
        level_index: 0,
        time_limit: 0,
        arrow_count: 0,
        big_reward_trigger: 0,
        tail_clearance: 5,
        show_countdown: false,
        eliminate_reward: 0,
        life_count: 3
    };
    public is_tourists: boolean = false;
    public create_time: string = "";
    public ab_info: Record<string, any> = {};
    public tx_bind_info: any[] = [];
    public conf: PlayerConfInfo = {
        parameter_conf: {},
        cash_extract_conf: {}
    };

    private _rawData: any = {};

    public initUserId(data: InitUserIdParams): void {
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
        } catch (e) {}
    }

    public init(data: any): void {
        if (!data) return;
        const raw = data.user_info && typeof data.user_info === "object"
            ? Object.assign({}, data, data.user_info)
            : data;
        this._rawData = raw || {};
        this.cash_balance = Number(raw.cash_balance || 0);
        this.fund_balance = Number(raw.fund_balance || 0);
        this.bubble_balance = Number(raw.bubble_balance || 0);
        this.user_level = Number(raw.user_level || 0);
        this.task_point_num = Number(raw.task_point_num || 0);
        this.ltv_task_point_num = Number(raw.ltv_task_point_num || 0);
        this.circle_count = Number(raw.circle_count || 0);
        this.sign_in = Number(raw.sign_in || 0);
        this.hint_prop_count = Number(raw.hint_prop_count || 0);
        this.guideline_prop_count = Number(raw.guideline_prop_count || 0);
        this.levels_passed_count = Number(raw.levels_passed_count || 0);
        this.guideline_eliminate_num = Number(raw.guideline_eliminate_num || 0);
        this.current_arrow_level_id = String(raw.current_arrow_level_id || "0");
        this.is_tourists = !!raw.is_tourists;
        this.create_time = String(raw.create_time || "");
        this.ab_info = raw.ab_info || {};
        this.tx_bind_info = Array.isArray(raw.tx_bind_info) ? raw.tx_bind_info : [];
        this.conf = raw.conf || {
            parameter_conf: {},
            cash_extract_conf: {}
        };
    }

    public updateArrowLevel(data: any): void {
        if (!data) return;
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
            life_count: Number(data.life_count || 3)
        };
        this.current_arrow_level_id = String(this.arrow_level.arrow_level_id || "0");
        try {
            console.log("[ArrowLevel] PlayerDataStore.updateArrowLevel: " + JSON.stringify(this.arrow_level));
        } catch (e) {}
    }

    public get(key: string, defaultValue: any = null): any {
        if (!key) return defaultValue;
        const keys = String(key).split(".");
        let current: any = this._rawData;
        for (let i = 0; i < keys.length; i++) {
            if (current == null) return defaultValue;
            const k = keys[i];
            if (!Object.prototype.hasOwnProperty.call(current, k)) return defaultValue;
            current = current[k];
        }
        return current == null ? defaultValue : current;
    }

    public getUserInfoForBiz(): any {
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
            conf: this.conf
        };
    }

    public getCashExtractConf(): any {
        return this.get("conf.cash_extract_conf", {});
    }

    public getParameterConf(): any {
        return this.get("conf.parameter_conf", {});
    }
}

export default new PlayerDataStore();