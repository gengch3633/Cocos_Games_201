import HotUpdate from "./HotUpdate";
import { Default_Language, languages, UseSpecialFont, UseSystemFont } from "./SystemConfig";
import PlayerDataSys from "./PlayerDataSys";
import ClientData from "./ClientData";
import SdkHelper from "./SdkHelper";
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
    iconSubInfo: unknown = null;

    private static _instance: GlobalDataMgr = null;

    setCurrentLang(lang: string): void {
        this.curLanguage = lang;
        HotUpdate.getInstance().isOnlineRelease();
    }

    initAppFlyer(): void {
        if (!this.isInitAppFlyer) {
            if (
                PlayerDataSys.getFirstVideoCpm() &&
                Number(PlayerDataSys.getFirstVideoCpm()) >= Number(this.activate_cpm)
            ) {
                console.log("cocos初始化AppFlyer");
                SdkHelper.initAppFlyer();
            }
            this.isInitAppFlyer = true;
        }
    }

    getCustomAppVersion(): string {
        const version = ClientData.app_version_name;
        console.log("customAppVersion====", version);
        return version;
    }

    isSpecialFont(): boolean {
        if (UseSpecialFont[String(this.curLanguage)]) {
            return true;
        }
    }

    init(data: {
        new_user?: number;
        activate?: boolean;
        is_encrypt?: number;
        activate_cpm?: number;
    }): void {
        this.activate_cpm = data.activate_cpm;
        this.new_user = data.new_user || 0;
        this.is_encrypt = data.is_encrypt;
        if (data.activate) {
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
        if (
            this.curLanguage &&
            this.curLanguage != Default_Language &&
            languages[String(this.curLanguage)]
        ) {
            return true;
        }
    }

    private static _getInstance(): GlobalDataMgr {
        if (!GlobalDataMgr._instance) {
            GlobalDataMgr._instance = new GlobalDataMgr();
        }
        return GlobalDataMgr._instance;
    }

    isUsingForeignResources(): string {
        let lang = this.curLanguage;
        if (
            this.curLanguage == languages.CA ||
            this.curLanguage == languages.AU ||
            this.curLanguage == languages.NZ ||
            this.curLanguage == languages.DK
        ) {
            lang = languages.US;
        } else if (this.curLanguage == languages.AT || this.curLanguage == languages.CH) {
            lang = languages.DE;
        }
        return lang;
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

    decryptConfig(data: string): any {
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
        const elapsed = EngineUtil.getTimeStamp() - this.game_time;
        SdkHelper.reportData("game_time", { time: elapsed });
        this.game_time = EngineUtil.getTimeStamp();
    }
}

export default GlobalDataMgr._getInstance();
