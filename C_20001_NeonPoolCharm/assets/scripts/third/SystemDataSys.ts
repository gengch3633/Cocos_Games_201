import SystemDataMgr from "./SystemDataMgr";
import ClientData from "./ClientData";
import SdkHelper from "./SdkHelper";
import EngineUtil from "./EngineUtil";
import PlayerDataSys from "./PlayerDataSys";

class SystemDataSys extends SystemDataMgr {
    reviewing: boolean = null;
    forbid_pai: boolean = null;
    auth_type: boolean = null;
    reviewing_splash: number = null;
    encrypt: number = null;
    is_reviewer: boolean = null;

    get_request_url(): string {
        return this.online_release ? this.getServerReleaseUrl() : this.getServerTestUrl();
    }

    getVersionRelease(): string {
        return this.getServerReleaseUrl() + "update";
    }

    init(): void {
        const e = EngineUtil.getLocalData("yid");
        PlayerDataSys.initUserId({ yid: e });
        const t = SdkHelper.getClientInfo();
        ClientData.init(t);
    }

    init_config(e: { activate?: boolean; is_encrypt?: number; is_reviewer?: boolean }): void {
        const t = e.activate;
        const o = e.is_encrypt;
        const n = e.is_reviewer;
        this.encrypt = o || 0;
        this.is_reviewer = !!n;
        if (t) {
            SdkHelper.reportData("activate");
        }
    }

    getTongDunId(): string {
        const e = SdkHelper.requestTDId();
        return "not_init" !== e ? e : null;
    }

    get_payerMaxCallBack_url(): string {
        return this.online_release ? "com.ggnbpool.kingt://pageJump" : "com.zsygtqyx.hwsl://pageJump";
    }

    get_version_url(): string {
        return this.online_release ? this.getVersionRelease() : this.getVersionTest();
    }

    getServerReleaseUrl(): string {
        return "http://haoyuntq-u.cognizematrix.com/";
    }

    init_middle_config(e: string): void {
        const t = JSON.parse(e);
        const o = t.forbid_screen;
        const n = t.ysdk_flag;
        this.reviewing = false;
        this.forbid_pai = false;
        this.auth_type = void 0 !== n && n;
        this.reviewing_splash = void 0 === o || o;
    }

    getCNVersionUrl(): string {
        return this.online_release ? "https://update.cognizematrix.com/hot_update" : "http://version-debug.huixuanjiasu.com/update/hot_update";
    }

    getVersionTest(): string {
        return this.getServerTestUrl() + "update";
    }

    static _getInstance(): SystemDataSys {
        if (!SystemDataSys._instance) {
            SystemDataSys._instance = new SystemDataSys();
        }
        return SystemDataSys._instance;
    }

    getServerTestUrl(): string {
        return "http://backend-debug5-new.huixuanjiasu.com/haoyuntq-android-cn/";
    }

    getConfmeBaseUrl(): string {
        return this.online_release ? this.confmeUrl : this.confmeUrlTest;
    }

    static _instance: SystemDataSys = null;
}

export default SystemDataSys._getInstance();
