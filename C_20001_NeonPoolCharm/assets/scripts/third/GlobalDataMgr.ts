import ClientData from "./ClientData";
import HotUpdate from "./HotUpdate";
import PlayerDataSys from "./PlayerDataSys";
import SdkHelper from "./SdkHelper";
import { Default_Language, UseSpecialFont, UseSystemFont, languages } from "./SystemConfig";
import EngineUtil from "./EngineUtil";

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
    activate_cpm = 0.8;
    iconSubInfo = null;

    setCurrentLang(lang: string): void {
        this.curLanguage = lang;
        HotUpdate.getInstance().isOnlineRelease();
    }

    initAppFlyer(): void {
        if (!this.isInitAppFlyer) {
            if (PlayerDataSys.getFirstVideoCpm() && Number(PlayerDataSys.getFirstVideoCpm()) >= Number(this.activate_cpm)) {
                console.log("cocos初始化AppFlyer");
                SdkHelper.initAppFlyer();
            }
            this.isInitAppFlyer = true;
        }
    }

    getCustomAppVersion(): string {
        const e = ClientData.app_version_name;
        console.log("customAppVersion====", e);
        return e;
    }

    isSpecialFont(): boolean {
        if (UseSpecialFont[String(this.curLanguage)]) {
            return true;
        }
    }

    init(data: { new_user?: number; activate?: boolean; is_encrypt?: number; activate_cpm?: number }): void {
        const { new_user, activate, is_encrypt, activate_cpm } = data;
        this.activate_cpm = activate_cpm;
        this.new_user = new_user || 0;
        this.is_encrypt = is_encrypt;
        if (activate) {
            SdkHelper.reportData("activate", null, true);
            console.log("激活");
        }
        this.resetGameTime();
    }

    resetGameTime(): void {
        this.game_time = EngineUtil.getTimeStamp();
    }

    setYszc(url: string): void {
        this.yszcUrl = url;
    }

    i18nEdition(): boolean {
        if (this.curLanguage && this.curLanguage != Default_Language && languages[String(this.curLanguage)]) {
            return true;
        }
    }

    static _getInstance(): GlobalDataMgr {
        if (!GlobalDataMgr._instance) {
            GlobalDataMgr._instance = new GlobalDataMgr();
        }
        return GlobalDataMgr._instance;
    }

    isUsingForeignResources(): string {
        let e = this.curLanguage;
        if (
            this.curLanguage == languages.CA ||
            this.curLanguage == languages.AU ||
            this.curLanguage == languages.NZ ||
            this.curLanguage == languages.DK
        ) {
            e = languages.US;
        } else if (this.curLanguage == languages.AT || this.curLanguage == languages.CH) {
            e = languages.DE;
        }
        return e;
    }

    setYhxy(url: string): void {
        this.yhxyUrl = url;
    }

    getUserPrivacy(): string {
        return this.yszcUrl;
    }

    setEncrypt(value: number): void {
        this.is_encrypt = value;
    }

    decryptConfig(data: any): any {
        return SdkHelper.getAesDncrypData(data);
    }

    getUserAgreement(): string {
        return this.yhxyUrl;
    }

    isUseSysFont(): boolean {
        if (UseSystemFont[String(this.curLanguage)]) {
            return true;
        }
    }

    updateGameTime(): void {
        const e = EngineUtil.getTimeStamp() - this.game_time;
        SdkHelper.reportData("game_time", { time: e });
        this.game_time = EngineUtil.getTimeStamp();
    }

    private static _instance: GlobalDataMgr = null;
}

export default GlobalDataMgr._getInstance();
