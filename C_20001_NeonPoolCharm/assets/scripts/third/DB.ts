import BallLogicMgr from "./BallLogicMgr";
import GlobalConfig from "./GlobalConfig";
import Net from "./Net";

console.log("****require DB***");

const testDBInLocalhost = GlobalConfig.testDBInLocalhost;
const testDBInALI = GlobalConfig.testDBInALI;

console.log("isWX", false, cc.sys.platform);
console.log("isTT", false);

const DB = {
    isWX(): boolean {
        return false;
    },

    isTT(): boolean {
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

    getID(): void {
        DB.userInfo.openid = 1;
        DB.get_userInfo();
    },

    updateUserInfoKV(key: string, value: any, callback?: () => void): void {
        callback = callback || (() => {});
        console.log("updateUserInfoKV", key, value, false);
        DB.userInfo.openid;
    },

    getMovieInfo(data: any): void {
        data.openid;
        data.tableID;
    },

    createOnePublicTableInfo(data: any, callback?: () => void, mv?: any): void {
        callback = callback || (() => {});
        console.log("createOnePublicTableInfo", data);
        const tableInfo = BallLogicMgr.pack_PublicTableInfo(data);
        if (mv) {
            tableInfo.mv = mv;
        }
    },

    updateOnePublicTableInfo(openid: any, key: string, value: any, callback?: () => void): void {
        callback = callback || (() => {});
        console.log("updateOnePublicTableInfo", key, value, openid);
    },

    removeOnePublicTableInfo(data: any, callback?: () => void): void {
        callback = callback || (() => {});
    },

    getPublicTableInfo(callback?: () => void, tableID?: number, data?: any): void {
        if (tableID >= 0) {
            DB.userInfo.openid;
        }
        callback = callback || (() => {});
        data = data || null;
        console.log("getPublicTableInfo", false);
    },

    createOneTableInfo(): void {
    },

    saveOneTableInfo(data: any, callback?: () => void): void {
        callback = callback || (() => {});
    },

    saveTablesInfo(callback?: () => void): void {
        callback = callback || (() => {});
    },

    getLevel(userInfo?: any): number {
        if (!userInfo) {
            userInfo = DB.userInfo;
        }
        return 1;
    },

    get_userInfo_authorize_test(): void {
    },

    resetLoginTime(): void {
        const now = new Date().getTime();
        DB.userInfo.login_time = now;
        const date = new Date(now);
        const timestr =
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
        DB.userInfo.login_timestr = timestr;
    },

    resetTTName(): void {
    },

    get_userInfo(_data?: any, _refresh?: boolean): any {
        if (typeof _refresh !== "boolean") {
            _refresh = true;
        }
        return DB.userInfo;
    },

    get_ranklist(): null {
        return null;
    },

    get_userIcon(_url: string, node: cc.Node): void {
        cc.loader.loadRes("use/default_user", cc.SpriteFrame, (_err, spriteFrame) => {
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },

    doShare(): void {
    },

    checkAuthorize(callback: (success: boolean, msg: string) => void): void {
        callback(false, "");
    },

    closeAuthor(): void {
    },

    is_got_userInfo(): boolean {
        return false;
    },

    addoffLineCoin(amount: number): void {
        DB.userInfo.coin = DB.userInfo.coin + amount;
        GlobalConfig.unlogin_obj_setKV("coin", DB.userInfo.coin);
    },
};

if (testDBInLocalhost) {
    GlobalConfig.setting.platform_localhost.platform_str;
    Net.set_url(GlobalConfig.setting.platform_localhost.db_url);
} else if (testDBInALI) {
    GlobalConfig.setting.platform_alitestball.platform_str;
    Net.set_url(GlobalConfig.setting.platform_alitestball.db_url);
} else {
    GlobalConfig.setting.platform_other.platform_str;
    Net.set_url(GlobalConfig.setting.platform_other.db_url);
    console.log("set url", GlobalConfig.setting.platform_other.db_url);
}

DB.getID();

export default DB;
