import BallLogicMgr from "./BallLogicMgr";
import GlobalConfig from "./GlobalConfig";
import Net from "./Net";

console.log("****require DB***");
const r = GlobalConfig.testDBInLocalhost;
const l = GlobalConfig.testDBInALI;
console.log("isWX", false, cc.sys.platform);
console.log("isTT", false);
const DB: any = {
    isWX: function () {
        return false;
    },
    isTT: function () {
        return false;
    },
    userInfo_reward: {
        bmIdx: [],
        btx1: [],
        btx2: [],
        msc1: [],
        cueIDs: [],
        cuetx: []
    },
    userInfo: {
        _id: -1,
        openid: -1,
        name: "username",
        pic: "",
        gender: -1,
        age: -1,
        exp: 0,
        level: 0,
        title: "",
        tili: 0,
        coin: 0,
        total_coin: 0,
        login_time: 0,
        login_timestr: 0,
        p1: 0,
        p2: 0,
        reward: {
            bmIdx: [],
            btx1: [],
            btx2: [],
            msc1: [],
            cueIDs: [],
            cuetx: []
        }
    },
    getID: function () {
        DB.userInfo.openid = 1;
        DB.get_userInfo();
    },
    updateUserInfoKV: function (e, t, o) {
        o = o || function () {};
        console.log("updateUserInfoKV", e, t, false);
        DB.userInfo.openid;
    },
    getMovieInfo: function (e) {
        e.openid, e.tableID;
    },
    createOnePublicTableInfo: function (e, t, n) {
        t = t || function () {};
        console.log("createOnePublicTableInfo", e);
        const i = BallLogicMgr.pack_PublicTableInfo(e);
        n && (i.mv = n);
    },
    updateOnePublicTableInfo: function (e, t, o, n) {
        n = n || function () {};
        console.log("updateOnePublicTableInfo", t, o, e);
    },
    removeOnePublicTableInfo: function (e, t) {
        t = t || function () {};
    },
    getPublicTableInfo: function (e, t, o) {
        t >= 0 && DB.userInfo.openid;
        e = e || function () {};
        o = o || null;
        console.log("getPublicTableInfo", false);
    },
    createOneTableInfo: function () {},
    saveOneTableInfo: function (e, t) {
        t = t || function () {};
    },
    saveTablesInfo: function (e) {
        e = e || function () {};
    },
    getLevel: function (e) {
        e || (e = DB.userInfo);
        return 1;
    },
    get_userInfo_authorize_test: function () {},
    resetLoginTime: function () {
        const e = new Date().getTime();
        DB.userInfo.login_time = e;
        const t = new Date(e);
        const o = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
        DB.userInfo.login_timestr = o;
    },
    resetTTName: function () {},
    get_userInfo: function (e, t) {
        "boolean" != typeof t && (t = true);
        return DB.userInfo;
    },
    get_ranklist: function () {
        return null;
    },
    get_userIcon: function (e, t) {
        cc.loader.loadRes("use/default_user", cc.SpriteFrame, function (e, o) {
            t.getComponent("cc.Sprite").spriteFrame = o;
        });
    },
    doShare: function () {},
    checkAuthorize: function (e) {
        e(true, "");
    },
    closeAuthor: function () {},
    is_got_userInfo: function () {
        return false;
    },
    addoffLineCoin: function (e) {
        DB.userInfo.coin = DB.userInfo.coin + e;
        GlobalConfig.unlogin_obj_setKV("coin", DB.userInfo.coin);
    }
};
if (r) {
    GlobalConfig.setting.platform_localhost.platform_str;
    Net.set_url(GlobalConfig.setting.platform_localhost.db_url);
} else if (l) {
    GlobalConfig.setting.platform_alitestball.platform_str;
    Net.set_url(GlobalConfig.setting.platform_alitestball.db_url);
} else {
    GlobalConfig.setting.platform_other.platform_str;
    Net.set_url(GlobalConfig.setting.platform_other.db_url);
    console.log("set url", GlobalConfig.setting.platform_other.db_url);
}
DB.getID();
export default DB;
