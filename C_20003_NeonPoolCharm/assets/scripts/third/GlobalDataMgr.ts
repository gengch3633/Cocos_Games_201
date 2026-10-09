import ClientData from "./ClientData";
import EngineUtil from "./EngineUtil";
import HotUpdate from "./HotUpdate";
import PlayerDataSys from "./PlayerDataSys";
import SdkHelper from "./SdkHelper";
import { Default_Language, UseSpecialFont, UseSystemFont, languages } from "./SystemConfig";

const { ccclass } = cc._decorator;

@ccclass("GlobalDataMgr")
class GlobalDataMgr {
    yhxyUrl = "https://raw.githubusercontent.com/haticerasit726/hacrt/live/haycop.txt";
    yszcUrl = "https://raw.githubusercontent.com/haticerasit726/hacrt/live/haycop.txt";
    reviewing = false;
    new_user = 1;
    pauseTime = 0;
    is_encrypt = 0;
    game_time = 0;
    curLanguage = "";
    isInitAppFlyer = false;
    gameVideoCount = 0;
    activate_cpm = .8;
    iconSubInfo = null;

    static _instance = null;

    static _getInstance() {
        GlobalDataMgr._instance || (GlobalDataMgr._instance = new GlobalDataMgr());
        return GlobalDataMgr._instance;
    }

    setCurrentLang(e) {
        this.curLanguage = e;
        HotUpdate.getInstance().isOnlineRelease();
    }

    initAppFlyer() {
        if (!this.isInitAppFlyer) {
            if (PlayerDataSys.getFirstVideoCpm() && Number(PlayerDataSys.getFirstVideoCpm()) >= Number(this.activate_cpm)) {
                console.log("cocos初始化AppFlyer");
                SdkHelper.initAppFlyer();
            }
            this.isInitAppFlyer = true;
        }
    }

    getCustomAppVersion() {
        const e = ClientData.app_version_name;
        console.log("customAppVersion====", e);
        return e;
    }

    isSpecialFont() {
        if (UseSpecialFont[String(this.curLanguage)]) return true;
    }

    init(e) {
        const t = e.new_user,
            o = e.activate,
            n = e.is_encrypt,
            i = e.activate_cpm;
        this.activate_cpm = i;
        this.new_user = t || 0;
        this.is_encrypt = n;
        if (o) {
            SdkHelper.reportData("activate", null, true);
            console.log("激活");
        }
        this.resetGameTime();
    }

    resetGameTime() {
        this.game_time = EngineUtil.getTimeStamp();
    }

    setYszc(e) {
        this.yszcUrl = e;
    }

    i18nEdition() {
        if (this.curLanguage && this.curLanguage != Default_Language && languages[String(this.curLanguage)]) return true;
    }

    isUsingForeignResources() {
        let e = this.curLanguage;
        this.curLanguage == languages.CA || this.curLanguage == languages.AU || this.curLanguage == languages.NZ || this.curLanguage == languages.DK ? e = languages.US : this.curLanguage != languages.AT && this.curLanguage != languages.CH || (e = languages.DE);
        return e;
    }

    setYhxy(e) {
        this.yhxyUrl = e;
    }

    getUserPrivacy() {
        return this.yszcUrl;
    }

    setEncrypt(e) {
        this.is_encrypt = e;
    }

    decryptConfig(e) {
        return SdkHelper.getAesDncrypData(e);
    }

    getUserAgreement() {
        return this.yhxyUrl;
    }

    isUseSysFont() {
        if (UseSystemFont[String(this.curLanguage)]) return true;
    }

    updateGameTime() {
        const e = EngineUtil.getTimeStamp() - this.game_time;
        SdkHelper.reportData("game_time", {
            time: e
        });
        this.game_time = EngineUtil.getTimeStamp();
    }
}

export default GlobalDataMgr._getInstance();
