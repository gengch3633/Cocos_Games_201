import ClientData from "./ClientData";
import EngineUtil from "./EngineUtil";
import PlayerDataSys from "./PlayerDataSys";
import SdkHelper from "./SdkHelper";
import SystemDataMgr from "./SystemDataMgr";

class SystemDataSys extends SystemDataMgr {
    static _instance = null;

    constructor() {
        super();
        this.reviewing = null;
        this.forbid_pai = null;
        this.auth_type = null;
        this.reviewing_splash = null;
        this.encrypt = null;
        this.is_reviewer = null;
    }

    get_request_url() {
        return this.online_release ? this.getServerReleaseUrl() : this.getServerTestUrl();
    }

    getVersionRelease() {
        return this.getServerReleaseUrl() + "update";
    }

    init() {
        const e = EngineUtil.getLocalData("yid");
        PlayerDataSys.initUserId({
            yid: e
        });
        const t = SdkHelper.getClientInfo();
        ClientData.init(t);
    }

    init_config(e) {
        const t = e.activate,
            o = e.is_encrypt,
            n = e.is_reviewer;
        this.encrypt = o || 0;
        this.is_reviewer = !!n;
        t && SdkHelper.reportData("activate");
    }

    getTongDunId() {
        const e = SdkHelper.requestTDId();
        return "not_init" !== e ? e : null;
    }

    get_payerMaxCallBack_url() {
        return this.online_release ? "com.ggnbpool.kingt://pageJump" : "com.zsygtqyx.hwsl://pageJump";
    }

    get_version_url() {
        return this.online_release ? this.getVersionRelease() : this.getVersionTest();
    }

    getServerReleaseUrl() {
        return "http://haoyuntq-u.cognizematrix.com/";
    }

    init_middle_config(e) {
        const t = JSON.parse(e),
            o = (t.location_flag, t.vv_flag, t.forbid_screen),
            n = (t.sm_flag, t.td_flag, t.hs_flag, t.notice_content, t.per_dialog_delay, t.notice_delay, t.ck_flag, t.tly_flag, t.force_flag, t.tab_flag, t.ysdk_flag);
        t.dir_flag, t.antian_flag, t.new_add_flag, t.forbid_red_envelope, t.recog_ire, t.recog_tf, t.forbid_pai;
        this.reviewing = false;
        this.forbid_pai = false;
        this.auth_type = undefined !== n && n;
        this.reviewing_splash = undefined === o || o;
    }

    getCNVersionUrl() {
        return this.online_release ? "https://update.cognizematrix.com/hot_update" : "http://version-debug.huixuanjiasu.com/update/hot_update";
    }

    getVersionTest() {
        return this.getServerTestUrl() + "update";
    }

    static _getInstance() {
        SystemDataSys._instance || (SystemDataSys._instance = new SystemDataSys());
        return SystemDataSys._instance;
    }

    getServerTestUrl() {
        return "http://backend-debug5-new.huixuanjiasu.com/haoyuntq-android-cn/";
    }

    getConfmeBaseUrl() {
        return this.online_release ? this.confmeUrl : this.confmeUrlTest;
    }
}

export default SystemDataSys._getInstance();
