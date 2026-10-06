import ClientDataStore from "./ClientDataStore";

class PlayerDataStore {
    user_id: any = " ";
    user_name: any = " ";
    yid: any = " yid_read_failed ";
    fund_balance: number = 0;
    cash_balance: number = 0;
    bubble_balance: number = 0;
    user_level: number = 0;
    task_point_num: number = 0;
    ltv_task_point_num: number = 0;
    circle_count: number = 0;
    sign_in: number = 0;
    hint_prop_count: number = 0;
    guideline_prop_count: number = 0;
    levels_passed_count: number = 0;
    guideline_eliminate_num: number = 0;
    current_arrow_level_id: any = " 0 ";
    arrow_level: any = {
        arrow_level_id: 0,
        level_index: 0,
        time_limit: 0,
        arrow_count: 0,
        big_reward_trigger: 0,
        tail_clearance: 5,
        show_countdown: !1,
        eliminate_reward: 0,
        life_count: 3
    };
    is_tourists: boolean = !1;
    create_time: any = " ";
    ab_info: any = {};
    tx_bind_info: any[] = [];
    conf: any = {
        parameter_conf: {},
        cash_extract_conf: {}
    };
    _rawData: any = {};

    initUserId(e: any) {
        var t = e.user_id, i = e.user_name, a = e.yid;
        this.user_id = t || " ";
        this.user_name = i || " ";
        this.yid = a || " yid_read_failed ";
        ClientDataStore.yid = a;
        ClientDataStore.user_id = t || " ";
        try {
            cc.sys.localStorage.setItem(" yid ", a);
        } catch (e) {}
    }

    init(e: any) {
        if (e) {
            var t = e.user_info && " object " == typeof e.user_info ? Object.assign({}, e, e.user_info) : e;
            this._rawData = t || {};
            this.cash_balance = Number(t.cash_balance || 0);
            this.fund_balance = Number(t.fund_balance || 0);
            this.bubble_balance = Number(t.bubble_balance || 0);
            this.user_level = Number(t.user_level || 0);
            this.task_point_num = Number(t.task_point_num || 0);
            this.ltv_task_point_num = Number(t.ltv_task_point_num || 0);
            this.circle_count = Number(t.circle_count || 0);
            this.sign_in = Number(t.sign_in || 0);
            this.hint_prop_count = Number(t.hint_prop_count || 0);
            this.guideline_prop_count = Number(t.guideline_prop_count || 0);
            this.levels_passed_count = Number(t.levels_passed_count || 0);
            this.guideline_eliminate_num = Number(t.guideline_eliminate_num || 0);
            this.current_arrow_level_id = String(t.current_arrow_level_id || " 0 ");
            this.is_tourists = !!t.is_tourists;
            this.create_time = String(t.create_time || " ");
            this.ab_info = t.ab_info || {};
            this.tx_bind_info = Array.isArray(t.tx_bind_info) ? t.tx_bind_info : [];
            this.conf = t.conf || {
                parameter_conf: {},
                cash_extract_conf: {}
            };
        }
    }

    updateArrowLevel(e: any) {
        if (e) {
            var t = Number((null != e.level_index ? e.level_index : e.arrow_level_index) || 0);
            this.arrow_level = {
                arrow_level_id: Number(e.arrow_level_id || 0),
                level_index: t,
                time_limit: Number(e.time_limit || 0),
                arrow_count: Number(e.arrow_count || 0),
                big_reward_trigger: Number(e.big_reward_trigger || 0),
                tail_clearance: Number(null != e.tail_clearance ? e.tail_clearance : 5),
                show_countdown: !!e.show_countdown,
                eliminate_reward: Number(e.eliminate_reward || 0),
                life_count: Number(e.life_count || 3)
            };
            this.current_arrow_level_id = String(this.arrow_level.arrow_level_id || " 0 ");
            try {
                console.log("[ArrowLevel] PlayerDataStore.updateArrowLevel: " + JSON.stringify(this.arrow_level));
            } catch (e) {}
        }
    }

    get(e: any, t: any = null) {
        if (!e) return t;
        for (var i = String(e).split("."), n = this._rawData, a = 0; a < i.length; a++) {
            if (null == n) return t;
            var o = i[a];
            if (!Object.prototype.hasOwnProperty.call(n, o)) return t;
            n = n[o];
        }
        return null == n ? t : n;
    }

    getUserInfoForBiz() {
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

    getCashExtractConf() {
        return this.get(" conf.cash_extract_conf ", {});
    }

    getParameterConf() {
        return this.get(" conf.parameter_conf ", {});
    }
}

export default new PlayerDataStore();
