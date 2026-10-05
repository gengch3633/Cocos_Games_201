import SystemDataMgr from "./SystemDataMgr";
import ClientData from "./ClientData";
import SdkHelper from "./SdkHelper";
import EngineUtil from "./EngineUtil";
import PlayerDataSys from "./PlayerDataSys";

class SystemDataSys extends SystemDataMgr {
    private static _instance: SystemDataSys = null;

    get_request_url(): string {
        return this.online_release ? this.getServerReleaseUrl() : this.getServerTestUrl();
    }

    getVersionRelease(): string {
        return this.getServerReleaseUrl() + "update";
    }

    init(): void {
        const yid = EngineUtil.getLocalData("yid");
        PlayerDataSys.initUserId({ yid });
        const clientInfo = SdkHelper.getClientInfo();
        ClientData.init(clientInfo);
    }

    init_config(data: any): void {
        const activate = data.activate;
        const is_encrypt = data.is_encrypt;
        const is_reviewer = data.is_reviewer;
        this.encrypt = is_encrypt || 0;
        this.is_reviewer = !!is_reviewer;
        if (activate) {
            SdkHelper.reportData("activate");
        }
    }

    getTongDunId(): string | null {
        const id = SdkHelper.requestTDId();
        return id !== "not_init" ? id : null;
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

    init_middle_config(data: string): void {
        const config = JSON.parse(data);
        const forbid_screen = config.forbid_screen;
        const ysdk_flag = config.ysdk_flag;
        this.reviewing = false;
        this.forbid_pai = false;
        this.auth_type = ysdk_flag !== undefined && ysdk_flag;
        this.reviewing_splash = forbid_screen === undefined || forbid_screen;
    }

    getCNVersionUrl(): string {
        return this.online_release
            ? "https://update.cognizematrix.com/hot_update"
            : "http://version-debug.huixuanjiasu.com/update/hot_update";
    }

    getVersionTest(): string {
        return this.getServerTestUrl() + "update";
    }

    private static _getInstance(): SystemDataSys {
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
}

export default SystemDataSys._getInstance();
