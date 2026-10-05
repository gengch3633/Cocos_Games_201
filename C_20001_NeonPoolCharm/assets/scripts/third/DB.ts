import * as BallLogicMgr from "./BallLogicMgr";
import * as GlobalConfig from "./GlobalConfig";
import * as Net from "./Net";

console.log("****require DB***");

interface UserReward {
    bmIdx: unknown[];
    btx1: unknown[];
    btx2: unknown[];
    msc1: unknown[];
    cueIDs: unknown[];
    cuetx: unknown[];
}

interface UserInfo {
    _id: number;
    openid: number;
    name: string;
    pic: string;
    gender: number;
    age: number;
    exp: number;
    level: number;
    title: string;
    tili: number;
    coin: number;
    total_coin: number;
    login_time: number;
    login_timestr: number | string;
    p1: number;
    p2: number;
    reward: UserReward;
}

interface DBModule {
    isWX(): boolean;
    isTT(): boolean;
    userInfo_reward: UserReward;
    userInfo: UserInfo;
    getID(): void;
    updateUserInfoKV(key: string, value: unknown, callback?: () => void): void;
    getMovieInfo(data: any): void;
    createOnePublicTableInfo(data: any, callback?: () => void, mv?: unknown): void;
    updateOnePublicTableInfo(data: any, t: unknown, o: unknown, callback?: () => void): void;
    removeOnePublicTableInfo(data: unknown, callback?: () => void): void;
    getPublicTableInfo(callback?: () => void, t?: number, o?: unknown): void;
    createOneTableInfo(): void;
    saveOneTableInfo(data: unknown, callback?: () => void): void;
    saveTablesInfo(callback?: () => void): void;
    getLevel(user?: UserInfo): number;
    get_userInfo_authorize_test(): void;
    resetLoginTime(): void;
    resetTTName(): void;
    get_userInfo(e?: unknown, t?: boolean): UserInfo;
    get_ranklist(): null;
    get_userIcon(e: unknown, node: cc.Node): void;
    doShare(): void;
    checkAuthorize(callback: (ok: boolean, msg: string) => void): void;
    closeAuthor(): void;
    is_got_userInfo(): boolean;
    addoffLineCoin(amount: number): void;
}

const db: DBModule = {
    isWX() {
        return false;
    },
    isTT() {
        return false;
    },
    userInfo_reward: {
        bmIdx: [],
        btx1: [],
        btx2: [],
        msc1: [],
        cueIDs: [],
        cuetx: [],
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
            cuetx: [],
        },
    },
    getID() {
        db.userInfo.openid = 1;
        db.get_userInfo();
    },
    updateUserInfoKV(key, value, callback) {
        callback = callback || (() => {});
        console.log("updateUserInfoKV", key, value, false);
        db.userInfo.openid;
    },
    getMovieInfo(data) {
        data.openid;
        data.tableID;
    },
    createOnePublicTableInfo(data, callback, mv) {
        callback = callback || (() => {});
        console.log("createOnePublicTableInfo", data);
        const packed = BallLogicMgr.pack_PublicTableInfo(data);
        if (mv) {
            packed.mv = mv;
        }
    },
    updateOnePublicTableInfo(data, t, o, callback) {
        callback = callback || (() => {});
        console.log("updateOnePublicTableInfo", t, o, data);
    },
    removeOnePublicTableInfo(data, callback) {
        callback = callback || (() => {});
    },
    getPublicTableInfo(callback, t, o) {
        if (t >= 0) {
            db.userInfo.openid;
        }
        callback = callback || (() => {});
        o = o || null;
        console.log("getPublicTableInfo", false);
    },
    createOneTableInfo() {},
    saveOneTableInfo(data, callback) {
        callback = callback || (() => {});
    },
    saveTablesInfo(callback) {
        callback = callback || (() => {});
    },
    getLevel(user) {
        user = user || db.userInfo;
        return 1;
    },
    get_userInfo_authorize_test() {},
    resetLoginTime() {
        const now = new Date().getTime();
        db.userInfo.login_time = now;
        const date = new Date(now);
        db.userInfo.login_timestr =
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate() +
            " " +
            date.getHours() +
            ":" +
            date.getMinutes() +
            ":" +
            date.getSeconds();
    },
    resetTTName() {},
    get_userInfo(e?, t?) {
        if (typeof t !== "boolean") {
            t = true;
        }
        return db.userInfo;
    },
    get_ranklist() {
        return null;
    },
    get_userIcon(e, node) {
        cc.loader.loadRes("use/default_user", cc.SpriteFrame, (err, frame) => {
            node.getComponent(cc.Sprite).spriteFrame = frame;
        });
    },
    doShare() {},
    checkAuthorize(callback) {
        callback(true, "");
    },
    closeAuthor() {},
    is_got_userInfo() {
        return false;
    },
    addoffLineCoin(amount) {
        db.userInfo.coin = db.userInfo.coin + amount;
        GlobalConfig.unlogin_obj_setKV("coin", db.userInfo.coin);
    },
};

console.log("isWX", false, cc.sys.platform);
console.log("isTT", false);

if (GlobalConfig.testDBInLocalhost) {
    GlobalConfig.setting.platform_localhost.platform_str;
    Net.set_url(GlobalConfig.setting.platform_localhost.db_url);
} else if (GlobalConfig.testDBInALI) {
    GlobalConfig.setting.platform_alitestball.platform_str;
    Net.set_url(GlobalConfig.setting.platform_alitestball.db_url);
} else {
    GlobalConfig.setting.platform_other.platform_str;
    Net.set_url(GlobalConfig.setting.platform_other.db_url);
    console.log("set url", GlobalConfig.setting.platform_other.db_url);
}

db.getID();

export default db;
