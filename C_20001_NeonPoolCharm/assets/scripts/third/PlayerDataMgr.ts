import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";

export const ETaskStatus = cc.Enum({
    E_NON_COMPLETE: 0,
    E_CAN_RECEIVE: 1,
    E_COMPLETE: 2,
});

export interface LevelInfo {
    level_a: number;
    level_b: number;
    level_c: number;
    roundCount: number;
    turnCount: number;
}

export default class PlayerDataMgr {
    protected _bind_wx: number = 0;
    protected _wx_gender: string = "保密";
    protected _wx_head: string = "";
    protected _yid: string = "yid_read_failed";
    protected _create_time: string = "";
    protected _user_id: string = "";
    protected _user_name: string = "";
    protected _cash_balance: number = 0;
    protected _gold_balance: number = 0;
    protected _sign_balance: number = 0;
    protected _new_user: boolean = true;
    userCpm: number = 0;
    protected _curSceneID: number = 0;
    protected _user_level: number = 0;
    level_ad: number = 0;
    level_pass: number = 0;
    isYSDKLoginSuccess: boolean = false;
    level_force: boolean = false;
    show_draw: boolean = false;
    show_extract: boolean = false;
    show_scene: boolean = false;
    show_level_reward: boolean = false;
    is_gm: boolean = false;
    protected _max_extract_id: number = 0;
    protected _scene_id: number = 1;
    total_video_count: number = 0;
    level_pass_success_count: number = 0;
    guide_id: number = 0;
    total_gold: number = 0;
    protected _xiaoqiuADCount: number = 0;
    chat_group_ban: boolean = true;
    user_order_eid: unknown[] = [];
    headList: unknown[] = [];
    protected _level_config_index: number = 0;
    protected _levelInfo: LevelInfo = {
        level_a: 1,
        level_b: 1,
        level_c: 1,
        roundCount: 0,
        turnCount: 0,
    };
    protected _turn_pass: number = 0;
    protected _table: string = "";

    get curSceneID(): number {
        return this._curSceneID;
    }

    get level_config_index(): number {
        return this._level_config_index;
    }
    set level_config_index(value: number) {
        this._level_config_index;
        this._level_config_index = value;
    }

    get bind_wx(): number {
        return this._bind_wx;
    }
    set bind_wx(value: number) {
        this._bind_wx = value;
    }

    get yid(): string {
        return this._yid;
    }
    set yid(value: string) {
        this._yid = value;
    }

    get create_time(): string {
        return this._create_time;
    }
    set create_time(value: string) {
        this._create_time = value;
    }

    get user_id(): string {
        return this._user_id;
    }
    set user_id(value: string) {
        this._user_id = value;
    }

    get user_name(): string {
        return this._user_name;
    }
    set user_name(value: string) {
        this._user_name = value;
    }

    get cash_balance(): number {
        return this._cash_balance;
    }
    set cash_balance(value: number) {
        this._cash_balance = value;
        EventMgr.trigger(GameEventType.UPDATE_CASH, value);
    }

    get gold_balance(): number {
        return this._gold_balance;
    }
    set gold_balance(value: number) {
        this._gold_balance = value;
        EventMgr.trigger(GameEventType.UPDATE_GOLD, value);
    }

    get sign_balance(): number {
        return this._sign_balance;
    }
    set sign_balance(value: number) {
        this._sign_balance = value;
    }

    get max_extract_id(): number {
        return this._max_extract_id;
    }
    set max_extract_id(value: number) {
        if (value != this._max_extract_id) {
            this.show_extract = true;
        }
        this._max_extract_id = value;
    }

    get scene_id(): number {
        return this._scene_id;
    }
    set scene_id(value: number) {
        if (value != this._scene_id) {
            this.show_scene = true;
        }
        this._scene_id = value;
    }

    get new_user(): boolean {
        return this._new_user;
    }
    set new_user(value: boolean) {
        this._new_user = value;
    }

    get wx_gender(): string {
        return this._wx_gender;
    }
    set wx_gender(value: string) {
        this._wx_gender = value;
    }

    get wx_head(): string {
        return this._wx_head;
    }
    set wx_head(value: string) {
        this._wx_head = value;
    }

    get userOrderEid(): unknown[] {
        return this.user_order_eid;
    }
    set userOrderEid(value: unknown[]) {
        this.user_order_eid = value;
    }
}
