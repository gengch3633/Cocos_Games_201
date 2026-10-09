import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";

export const ETaskStatus = cc.Enum({
    E_NON_COMPLETE: 0,
    E_CAN_RECEIVE: 1,
    E_COMPLETE: 2
});

export default class PlayerDataMgr {
    _bind_wx = 0;
    _wx_gender = "保密";
    _wx_head = "";
    _yid = "yid_read_failed";
    _create_time = "";
    _user_id = "";
    _user_name = "";
    _cash_balance = 0;
    _gold_balance = 0;
    _sign_balance = 0;
    _new_user = true;
    userCpm = 0;
    _curSceneID = 0;
    _user_level = 0;
    level_ad = 0;
    level_pass = 0;
    isYSDKLoginSuccess = false;
    level_force = false;
    show_draw = false;
    show_extract = false;
    show_scene = false;
    show_level_reward = false;
    is_gm = false;
    _max_extract_id = 0;
    _scene_id = 1;
    total_video_count = 0;
    level_pass_success_count = 0;
    guide_id = 0;
    total_gold = 0;
    _xiaoqiuADCount = 0;
    chat_group_ban = true;
    user_order_eid = [];
    headList = [];
    _level_config_index = 0;
    _levelInfo = {
        level_a: 1,
        level_b: 1,
        level_c: 1,
        roundCount: 0,
        turnCount: 0
    };
    _turn_pass = 0;
    _table = "";

    get curSceneID() {
        return this._curSceneID;
    }

    get level_config_index() {
        return this._level_config_index;
    }

    set level_config_index(e) {
        this._level_config_index;
        this._level_config_index = e;
    }

    get bind_wx() {
        return this._bind_wx;
    }

    set bind_wx(e) {
        this._bind_wx = e;
    }

    get yid() {
        return this._yid;
    }

    set yid(e) {
        this._yid = e;
    }

    get create_time() {
        return this._create_time;
    }

    set create_time(e) {
        this._create_time = e;
    }

    get user_id() {
        return this._user_id;
    }

    set user_id(e) {
        this._user_id = e;
    }

    get user_name() {
        return this._user_name;
    }

    set user_name(e) {
        this._user_name = e;
    }

    get cash_balance() {
        return this._cash_balance;
    }

    set cash_balance(e) {
        this._cash_balance = e;
        EventMgr.trigger(GameEventType.UPDATE_CASH, e);
    }

    get gold_balance() {
        return this._gold_balance;
    }

    set gold_balance(e) {
        this._gold_balance = e;
        EventMgr.trigger(GameEventType.UPDATE_GOLD, e);
    }

    get sign_balance() {
        return this._sign_balance;
    }

    set sign_balance(e) {
        this._sign_balance = e;
    }

    get max_extract_id() {
        return this._max_extract_id;
    }

    set max_extract_id(e) {
        e != this._max_extract_id && (this.show_extract = true);
        this._max_extract_id = e;
    }

    get scene_id() {
        return this._scene_id;
    }

    set scene_id(e) {
        e != this._scene_id && (this.show_scene = true);
        this._scene_id = e;
    }

    get new_user() {
        return this._new_user;
    }

    set new_user(e) {
        this._new_user = e;
    }

    get wx_gender() {
        return this._wx_gender;
    }

    set wx_gender(e) {
        this._wx_gender = e;
    }

    get wx_head() {
        return this._wx_head;
    }

    set wx_head(e) {
        this._wx_head = e;
    }

    get userOrderEid() {
        return this.user_order_eid;
    }

    set userOrderEid(e) {
        this.user_order_eid = e;
    }
}
