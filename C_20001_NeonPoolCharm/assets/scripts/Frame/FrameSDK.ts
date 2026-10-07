import { CLICKLOCK } from "./CLICKLOCK";
import Frame from "./Frame";
import { FrameData } from "./FrameData";
import Panel_Activity from "./Panel_Activity";
import Panel_SuperReward from "./Panel_SuperReward";
import Panel_Task from "./Panel_Task";
import RDM_Toast from "./RDM_Toast";
import i18 from "./i18";

export enum EVideoEvent {
    START = 0,
    END = 1,
    CLICK = 2,
    INTERRUPT = 3,
    PROFIT = 4,
    FAIL = 5,
}

export class FrameSDK {
    static Panel: cc.Node = null;
    static i18n: typeof i18 = undefined;
    static ONLINE_TIME: any = null;
    static DATE_DAY: number = null;
    static soundList: cc.AudioClip[] = [];
    static _lastVideoEndTime: number = 0;
    static _sceneFirstAccessFlags: any = {};
    static _appHideTime: number = null;
    static _playingAD: boolean = false;
    static frameData: any = null;
    static currLevel: number = 0;
    static openGradeNum: number = 0;

    static get now(): number {
        return Math.floor(cc.sys.now() / 1000);
    }

    static getNoAdDelayTime(): number {
        const passLevel = FrameSDK.frameData.gameData.passLevel;
        let delay: number = undefined;
        for (const item of FrameData.FRAME_CONF.noAdConfig) {
            if (!(passLevel >= item.startLevel - 1)) {
                break;
            }
            delay = item.delayTime;
        }
        return delay;
    }

    static checkPopUp(scene: string, _a?: any, callback?: () => void): void {
        let chain = Promise.resolve() as Promise<void>;
        if (!this._sceneFirstAccessFlags[scene]) {
            this._sceneFirstAccessFlags[scene] = true;
            chain = chain
                .then(
                    () =>
                        new Promise<void>((resolve) => {
                            const newHand = cc.sys.localStorage.getItem("newHand");
                            const passLevel = FrameSDK.frameData.gameData.passLevel;
                            if (
                                !FrameSDK.frameData.gameData.noProfitAd &&
                                passLevel >= FrameData.FRAME_CONF.welcomeBackStartLevel - 1 &&
                                passLevel < FrameData.FRAME_CONF.welcomeBackEndLevel &&
                                newHand != null
                            ) {
                                FrameSDK.openWindow("Panel_WelcomeBack", { closeCB: () => resolve() });
                            } else {
                                resolve();
                            }
                        })
                )
                .then(() => new Promise<void>((resolve) => Panel_Activity.onLogin(resolve)));
        }
        chain
            .then(
                () =>
                    new Promise<void>((resolve) => {
                        if (
                            !FrameSDK.frameData.gameData.noProfitAd &&
                            FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.charityLevel &&
                            FrameData.saveData.charityGuideIndex <= 0
                        ) {
                            cc.director.once("CHARITY_GUIDE_FINISH", () => resolve());
                            FrameSDK.openWindow("Panel_GuideTips", {
                                type: "charity",
                                closeCB: () => Frame.ins.setGuide2Show(true),
                            });
                        } else {
                            resolve();
                        }
                    })
            )
            .then(
                () =>
                    new Promise<void>((resolve) => {
                        if (
                            !FrameData.saveData.activity &&
                            FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.bankLevel
                        ) {
                            Panel_Activity.startActivity(resolve);
                        } else {
                            resolve();
                        }
                    })
            )
            .then(
                () =>
                    new Promise<void>((resolve) => {
                        if (
                            FrameData.saveData.lvAwardinfo == null &&
                            FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.taskLevel
                        ) {
                            Panel_Task.startTask(resolve);
                        } else {
                            resolve();
                        }
                    })
            )
            .then(
                () =>
                    new Promise<void>((resolve) => {
                        if (
                            !FrameData.saveData.superReward &&
                            FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.superRewardLevel
                        ) {
                            Panel_SuperReward.startSuperReward(resolve);
                        } else {
                            resolve();
                        }
                    })
            )
            .then(() => {
                callback?.();
            });
    }

    static hideWebView(target: cc.WebView): void {
        const scene = cc.director.getScene();
        const webViewNode = scene?.getChildByName("__Frame_web_view__");
        if (webViewNode) {
            webViewNode.active = false;
            const webView = webViewNode.getComponent(cc.WebView) ?? webViewNode.addComponent(cc.WebView);
            webView.node.targetOff(target);
            webView.url = "";
        }
    }

    static getCurrentRedeemRequirement(): any {
        const passLevel = FrameSDK.frameData.gameData.passLevel;
        let conf1 = FrameData.getCoinConf(1);
        let conf2 = FrameData.getCoinConf(2);
        if (conf1.rdm_1 > conf2.rdm_1) {
            const temp = conf1;
            conf1 = conf2;
            conf2 = temp;
        }
        if (passLevel >= conf2.rdm_1) {
            return null;
        }
        if (passLevel >= conf1.rdm_1) {
            return conf2;
        }
        return conf1;
    }

    static init(frameData: any, settings: any, i18nModule: typeof i18, splashCallback?: () => void): void {
        FrameSDK.frameData = frameData;
        FrameSDK.initCocosAmend();
        FrameSDK.correctConfigs();
        cc.assetManager.getBundle("Frame").preloadDir("Prefab");
        FrameSDK.initSettings(settings);
        FrameSDK.i18n = i18nModule;
        FrameSDK.setLan(cc.sys.languageCode);
        if (FrameData.saveData.date_day == null) {
            FrameData.saveData.date_day = FrameSDK.getDateDay(FrameSDK.now);
        }
        if (!FrameData.saveData.adAlternate) {
            FrameData.saveData.adAlternate = { totalComplete: {}, todayComplete: {} };
        }
        FrameSDK.DATE_DAY = FrameData.saveData.date_day;
        FrameSDK.onlineTimeUpdate();
        FrameSDK.resetNextData();
        FrameSDK.updataTimeQueueUp();
        FrameSDK.initSplash(splashCallback);
    }

    static HttpGet(url: string, params: any, callback: (err: any, data?: any) => void): void {
        const xhr = cc.loader.getXMLHttpRequest();
        if (params) {
            url +=
                "?" +
                Object.keys(params)
                    .filter((key) => params.hasOwnProperty(key))
                    .map((key) => key + "=" + params[key])
                    .join("&");
        }
        xhr.open("GET", url, true);
        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(null, xhr.responseText);
            } else {
                callback({ name: "Can't get", message: url }, {});
            }
        };
        xhr.onerror = () => {
            callback({ name: "Can't get it. The network may be disconnected", message: url }, {});
        };
        xhr.send();
    }

    static updataVideoQueueUp(): void {
        for (const key in FrameData.saveData.QueueUp) {
            const queue = FrameData.saveData.QueueUp[key];
            if (queue.deadLinePeopleCount == null) {
                queue.deadLinePeopleCount = FrameSDK.randomInt(
                    FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[0],
                    FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[1]
                );
                queue.deadLineTimeStamp = FrameSDK.now;
                queue.historyList = [];
            }
            for (const minusConf of FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus) {
                if (queue.deadLinePeopleCount > minusConf.count) {
                    const roll = FrameSDK.randomInt(0, 100);
                    const inviteCode = FrameSDK.getRandomInviteCode();
                    if (roll < minusConf.MinusPrecend) {
                        const minus = FrameSDK.randomInt(minusConf.minusCount[0], minusConf.minusCount[1]);
                        queue.deadLinePeopleCount -= minus;
                        if (queue.deadLinePeopleCount < 1) {
                            queue.deadLinePeopleCount = 1;
                        }
                        queue.deadLineShowTip =
                            "tkey_211??&value1==<color = #249A50>" +
                            inviteCode +
                            "</color>&&value2==<color = #249A50>" +
                            queue.deadLinePeopleCount +
                            "</color>";
                        const entry = { key: "tkey_211", account: inviteCode, peopleCount: queue.deadLinePeopleCount };
                        if (queue.historyList.length < FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) {
                            queue.historyList.push(entry);
                        } else {
                            queue.historyList.shift();
                            queue.historyList.push(entry);
                        }
                    } else {
                        queue.deadLinePeopleCount += FrameSDK.randomInt(minusConf.addCount[0], minusConf.addCount[1]);
                        queue.deadLineShowTip =
                            "tkey_210??&value1==<color = #249A50>" +
                            inviteCode +
                            "</color>&&value2==<color = #249A50>" +
                            queue.deadLinePeopleCount +
                            "</color>";
                        const entry = { key: "tkey_210", account: inviteCode, peopleCount: queue.deadLinePeopleCount };
                        if (queue.historyList.length < FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) {
                            queue.historyList.push(entry);
                        } else {
                            queue.historyList.shift();
                            queue.historyList.push(entry);
                        }
                    }
                    break;
                }
            }
        }
    }

    static openLevelAward(
        externalNode: cc.Node,
        unlockCountUpdateFunc: any,
        superExternalNode: cc.Node,
        param: any,
        closeCB?: (result?: any) => void
    ): void {
        FrameSDK.openWindow("Panel_Award_5", {
            externalNode,
            unlockCountUpdateFunc,
            superExternalNode,
            param,
            closeCB: (result: any) => {
                if (FrameSDK.currLevel !== FrameSDK.frameData.gameData.passLevel + 1) {
                    FrameSDK.currLevel = FrameSDK.frameData.gameData.passLevel + 1;
                }
                closeCB?.(result);
            },
        });
    }

    static _isOnceEventLogged(eventName: string, payload: any): boolean {
        const cacheKey = FrameSDK._getOnceEventCacheKey(eventName, payload);
        return FrameData.saveData.onceEventRecord[cacheKey] === true;
    }

    static isShowInters(): boolean {
        if (FrameSDK.frameData.gameData.noProfitAd) {
            return false;
        }
        const passLevel = FrameSDK.frameData.gameData.passLevel;
        const interConfig = FrameData.FRAME_CONF.InterConfig;
        if (passLevel < interConfig.maxFreeLevel) {
            return false;
        }
        let cooldown = 0;
        for (const item of interConfig.cooldown) {
            if (!(passLevel >= item.startLevel - 1)) {
                break;
            }
            cooldown = item.cd;
        }
        return Date.now() - FrameSDK._lastVideoEndTime >= cooldown;
    }

    static beforeGameLevelStart(
        level: number,
        extra1?: any,
        extra2?: any,
        callback?: () => void
    ): void {
        const notes = [level];
        if (extra1 != null) notes.push(extra1);
        if (extra2 != null) notes.push(extra2);
        FrameSDK.logGameEvent(
            "thepool_game_lv",
            { object_action: "show", object_name: "lv_start", object_notes: "" + notes.join("_") },
            true
        );
        new Promise<void>((resolve) => {
            const timer = setInterval(() => {
                if (Frame.ins) {
                    clearInterval(timer);
                    resolve();
                }
            });
        })
            .then(
                () =>
                    new Promise<void>((resolve) => {
                        if (
                            level < FrameData.FRAME_CONF.RedeemTipsStartLevel ||
                            level > FrameSDK.getFirstRedeemRequirement().rdm_1
                        ) {
                            resolve();
                        } else {
                            FrameSDK.openWindow("Panel_RedeemTips", {
                                level,
                                currentBonus: FrameData.credit,
                                closeCB: resolve,
                            });
                        }
                    })
            )
            .then(
                () =>
                    new Promise<void>((resolve) => {
                        if (FrameSDK.isShowInters()) {
                            const passLevel = FrameSDK.frameData.gameData.passLevel;
                            let videoFirst = false;
                            for (const item of FrameData.FRAME_CONF.InterConfig.beforeLevelAd) {
                                if (!(passLevel >= item.startLevel - 1)) {
                                    break;
                                }
                                videoFirst = item.videoFirst ?? false;
                            }
                            FrameSDK.logCommonEvent("c_ad_event", {
                                action: "touch",
                                type: videoFirst ? "video" : "interstitial",
                                placement: "enter_level",
                            });
                            (videoFirst ? FrameSDK.openVideo : FrameSDK.openInters).call(
                                FrameSDK,
                                "enter_level",
                                false,
                                (adType: string) => {
                                    FrameSDK.logGameEvent("thepool_game_ad", {
                                        object_action: "show",
                                        object_name: "enter_level",
                                        object_notes:
                                            adType === "video" ? "video" : adType === "web" ? "web" : "inter",
                                    });
                                },
                                (success: boolean) => {
                                    if (success) {
                                        FrameSDK.addCoin(0, FrameData.getCharityOutNum(), 1, () => resolve());
                                    } else {
                                        resolve();
                                    }
                                },
                                () => resolve()
                            );
                        } else {
                            resolve();
                        }
                    })
            )
            .then(() => {
                callback?.();
                cc.director.emit("SHOW_FLYING_BONUS");
            });
    }

    static addSuperAwardListen(callback: (...args: any[]) => void, target: any): void {
        cc.director.on("SUPER_AWARD", callback, target);
    }

    static openBanner(type: number = 1, offset: number = 0): void {
        if (FrameData.SDK_CONF.isShowBanner) {
            FrameSDK.frameData.sdkFuc.openBanner(type, offset);
        } else {
            console.log("配置关闭了 Banner 广告");
        }
    }

    static debugAddCoin(coinType: string, amount: number): void {
        if (amount !== 0) {
            const newVal = Math.max(0, FrameData.saveData.credit[coinType] + amount);
            cc.director.emit("FRESH_CREDIT", { type: coinType, num: newVal, change: amount });
            FrameData.saveData.credit[coinType] = newVal;
        }
    }

    static correctConfigs(): void {
        if (!FrameSDK.frameData.gameData.noProfitAd) {
            FrameData.FRAME_CONF.CoinConf = [
                { rdm_id: 1, rdm_1: 20, rdm_2: [5000, 20000], rdm_3: 100 },
                { rdm_id: 2, rdm_1: 40, rdm_2: [5000, 20000], rdm_3: 100 },
            ];
            FrameData.FRAME_CONF.RedeemRateConfig = [10, 1];
        }
    }

    static resetNextData(): void {
        if (FrameSDK.DATE_DAY < FrameSDK.getDateDay(FrameSDK.now)) {
            FrameSDK.DATE_DAY = FrameData.saveData.date_day = FrameSDK.getDateDay(FrameSDK.now);
            for (const key in FrameData.saveData.nextData) {
                if (Array.isArray(FrameData.saveData.nextData[key])) {
                    FrameData.saveData.nextData[key] = [];
                } else if (typeof FrameData.saveData.nextData[key] === "object") {
                    FrameData.saveData.nextData[key] = {};
                } else if (typeof FrameData.saveData.nextData[key] === "number") {
                    FrameData.saveData.nextData[key] = 0;
                }
            }
            FrameData.saveData.loginDays++;
            const adAlternate = FrameData.saveData.adAlternate;
            FrameData.saveData.adAlternate = {
                totalComplete: adAlternate.totalComplete,
                todayComplete: {},
            };
        }
    }

    static updataTimeQueueUp(): void {
        for (const key in FrameData.saveData.QueueUp) {
            const queue = FrameData.saveData.QueueUp[key];
            if (queue.deadLinePeopleCount == null) {
                queue.deadLinePeopleCount = FrameSDK.randomInt(
                    FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[0],
                    FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[1]
                );
                queue.deadLineTimeStamp = FrameSDK.now;
                queue.historyList = [];
            }
            let peopleCount = queue.deadLinePeopleCount;
            let timeStamp = queue.deadLineTimeStamp;
            let delta = 0;
            let changeType = -1;
            for (;;) {
                const interval = FrameSDK.randomInt(
                    FrameData.FRAME_CONF.TaskLineFrameConfig.flashDeltaTime[0],
                    FrameData.FRAME_CONF.TaskLineFrameConfig.flashDeltaTime[1]
                );
                if (!(FrameSDK.now - interval >= timeStamp)) {
                    break;
                }
                if (peopleCount + delta >= FrameData.FRAME_CONF.TaskLineFrameConfig.outLinePeopleCount) {
                    delta = 0;
                    peopleCount = FrameSDK.randomInt(
                        FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[0],
                        FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[1]
                    );
                    changeType = 1;
                } else {
                    for (const plusConf of FrameData.FRAME_CONF.TaskLineFrameConfig.ChangePlusList) {
                        if (peopleCount + delta >= plusConf.count) {
                            if (FrameSDK.randomInt(0, 100) <= plusConf.precend) {
                                delta += FrameSDK.randomInt(plusConf.addCount[0], plusConf.addCount[1]);
                                changeType = 2;
                            } else {
                                delta -= 1;
                                changeType = 1;
                            }
                            break;
                        }
                    }
                }
                timeStamp += interval;
            }
            queue.deadLineTimeStamp = timeStamp;
            queue.deadLinePeopleCount = delta + peopleCount;
            if (queue.deadLinePeopleCount < 1) {
                queue.deadLinePeopleCount = 1;
            }
            if (changeType !== -1) {
                if (changeType === 1) {
                    queue.deadLineShowTip =
                        "tkey_209??&value1==<color = #249A50>" + queue.deadLinePeopleCount + "</color>";
                    const entry = { key: "tkey_209", account: "", peopleCount: queue.deadLinePeopleCount };
                    if (queue.historyList.length < FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) {
                        queue.historyList.push(entry);
                    } else {
                        queue.historyList.shift();
                        queue.historyList.push(entry);
                    }
                }
                if (changeType === 2) {
                    const inviteCode = FrameSDK.getRandomInviteCode();
                    queue.deadLineShowTip =
                        "tkey_210??&value1==<color = #249A50>" +
                        inviteCode +
                        "</color>&&value2==<color = #249A50>" +
                        queue.deadLinePeopleCount +
                        "</color>";
                    const entry = { key: "tkey_210", account: inviteCode, peopleCount: queue.deadLinePeopleCount };
                    if (queue.historyList.length < FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) {
                        queue.historyList.push(entry);
                    } else {
                        queue.historyList.shift();
                        queue.historyList.push(entry);
                    }
                }
            }
        }
    }

    static randomFloatNum(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    static randomInt(min: number | number[], max?: number): number {
        if (Array.isArray(min)) {
            max = min[1];
            min = min[0];
        }
        return Math.floor((max - min + 1) * Math.random()) + min;
    }

    static beforeEnterGame(callback?: () => void): void {
        if (cc.sys.localStorage.getItem("newHand") != null && FrameData.SDK_CONF.splashEnabled) {
            FrameSDK.logGameEvent("thepool_sad", {
                object_action: "show",
                object_name: "sad_show",
                object_notes: "cold",
            });
            const deadline = Date.now() + 1000 * FrameData.SDK_CONF.splashWaitInterval;
            const tryOpen = () => {
                if (FrameSDK.frameData.sdkFuc.isSplashReady()) {
                    const splashNode = cc.director.getScene()?.getChildByName("__FRAME_SPLASH__");
                    if (splashNode) {
                        splashNode.zIndex = cc.macro.MAX_ZINDEX;
                        splashNode.active = true;
                    }
                    FrameSDK.frameData.sdkFuc.openSplash((event: EVideoEvent) => {
                        if (event === EVideoEvent.END || event === EVideoEvent.FAIL) {
                            FrameSDK.logGameEvent("thepool_sad", {
                                object_action: "show",
                                object_name: event === EVideoEvent.FAIL ? "sad_fail" : "sad_succ",
                                object_notes: "cold",
                            });
                            if (splashNode) {
                                splashNode.active = false;
                                cc.director.emit("HIDE_SPLASH");
                            }
                            callback?.();
                        }
                    });
                } else if (Date.now() <= deadline) {
                    setTimeout(tryOpen, 300);
                } else {
                    FrameSDK.logGameEvent("thepool_sad", {
                        object_action: "show",
                        object_name: "sad_fail",
                        object_notes: "cold",
                    });
                    callback?.();
                }
            };
            tryOpen();
        } else {
            callback?.();
        }
    }

    static openABAward(callback?: () => void): void {
        FrameData.saveData.preAwardType = (FrameData.saveData.preAwardType + 1) % 2;
        FrameSDK.openWindow("Panel_Award_" + (FrameData.saveData.preAwardType === 1 ? "3" : "1"), {
            closeCB: () => callback?.(),
        });
    }

    static formatSeconds(seconds: number): string {
        const parts = FrameSDK.formatSeconds3(seconds);
        return parts.hour + parts.minute + parts.second;
    }

    static closeEffect(target: any, callback?: () => void): void {
        if (target.black_sprite) {
            cc.tween(target.black_sprite.node).delay(0.06).to(0.24, { opacity: 0 }).start();
        }
        if (target.noTouch) {
            target.noTouch.node.active = true;
        }
        if (target.panel_window != null) {
            target.panel_window.stopActionByTag(9029);
            let position = target.panel_window.position;
            let duration = 0.3;
            if (target._close_target) {
                duration = 0.5;
                position = target._close_target.convertToWorldSpaceAR(cc.v2());
                position = target.panel_window.parent.convertToNodeSpaceAR(position);
            }
            cc.tween(target.panel_window)
                .to(duration, { scale: 0.1, opacity: 100, position })
                .tag(9029)
                .call(() => {
                    callback?.();
                    target.node.destroy();
                })
                .start();
        } else {
            if (!cc.isValid(target.node)) {
                console.error("cc.isValid(target.node)", target.node);
                return;
            }
            target.node.stopActionByTag(9029);
            cc.tween(target.node)
                .tag(9029)
                .call(() => callback?.())
                .removeSelf()
                .start();
        }
    }

    static addFlagListen(callback: (...args: any[]) => void, target: any): void {
        cc.director.on(FrameSDK.frameData.ListenKeys.FRESH_FLAG, callback, target);
    }

    static hasPopUp(): boolean {
        return (
            (!FrameSDK.frameData.gameData.noProfitAd &&
                FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.charityLevel &&
                FrameData.saveData.charityGuideIndex <= 0) ||
            (FrameData.saveData.activity === null &&
                FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.bankLevel) ||
            (FrameData.saveData.lvAwardinfo == null &&
                FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.taskLevel) ||
            (FrameData.saveData.superReward == null &&
                FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.superRewardLevel)
        );
    }

    static addCountryListen(callback: (...args: any[]) => void, target: any): void {
        cc.director.on("CHANGE_COUNTRY", callback, target);
    }

    static addBitCoin(a: number, b: number, c: number, d: any, e: any): void {
        cc.director.emit("ADD_BIT_COIN", a, b, c, d, e);
    }

    static getCountry_Language(langCode: string): void {
        const parseLang = (code: string) => {
            const hashIndex = code.indexOf("#");
            const parts = code
                .substring(0, hashIndex === -1 ? code.length : hashIndex)
                .split(code.indexOf("_") !== -1 ? "_" : "-");
            for (let i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === "") parts.splice(i, 1);
            }
            let result: any = { lang: parts[0], country: "SBALL" };
            if (parts.length > 1) {
                result = { lang: parts[0], country: parts[parts.length - 1] };
            }
            for (const item of FrameData.SDK_CONF.COUNTRY_LIST) {
                if (result.country.toLowerCase() === item.country.toLowerCase()) {
                    return item;
                }
            }
            result = { lang: "en", country: "SBALL" };
            for (const item of FrameData.SDK_CONF.COUNTRY_LIST) {
                if (result.country.toLowerCase() === item.country.toLowerCase()) {
                    return item;
                }
            }
            return FrameData.SDK_CONF.COUNTRY_LIST[0];
        };
        const country = parseLang(langCode);
        FrameData.myCountry = country.country;
        FrameData.countryIndex = country.ad_t - 1;
        FrameData.CountryConf = country;
        FrameSDK.frameData.gameData.myLanguge = country.language;
        console.log("getCountry_Language", langCode, FrameData.myCountry, FrameSDK.frameData.gameData.myLanguge);
    }

    static _getOnceEventCacheKey(eventName: string, payload: any): string {
        return (
            eventName +
            "-" +
            payload.object_action +
            "-" +
            (payload.object_name ?? "") +
            "-" +
            (payload.object_notes ?? "")
        );
    }

    @CLICKLOCK()
    static openVideo(
        placement: string,
        isInterFallback: boolean,
        onStart?: (type: string) => void,
        onEnd?: (success: boolean, type?: string) => void,
        onInterrupt?: () => void,
        webFallback?: any
    ): void {
        FrameSDK.frameData.sdkFuc.beforeOpenVideo((allowed: boolean) => {
            if (!allowed) {
                onInterrupt?.();
                return;
            }
            if (FrameData.SDK_CONF.NO_VIDEO || !FrameSDK.frameData) {
                console.log("skip video");
                FrameSDK._lastVideoEndTime = Date.now();
                FrameSDK._playingAD = false;
                onStart?.("video");
                onEnd?.(true, "video");
            } else {
                FrameSDK._playingAD = true;
                FrameSDK.frameData.gameFuc.openLoad();
                const deadline = FrameSDK.now + FrameData.SDK_CONF.videoRetryTime;
                const tryOpen = () => {
                    if (FrameSDK.frameData.sdkFuc.isReadyVideo()) {
                        FrameSDK.frameData.sdkFuc.openVideo(placement, (event: EVideoEvent) => {
                            console.log("video event - " + EVideoEvent[event]);
                            switch (event) {
                                case EVideoEvent.END:
                                    FrameSDK._lastVideoEndTime = Date.now();
                                    FrameSDK._playingAD = false;
                                    FrameSDK.frameData.gameFuc.closeLoad();
                                    cc.director.emit(FrameSDK.frameData.ListenKeys.VIDEO_SUC);
                                    onEnd?.(true, "video");
                                    break;
                                case EVideoEvent.INTERRUPT:
                                    FrameSDK._playingAD = false;
                                    FrameSDK.frameData.gameFuc.closeLoad();
                                    onInterrupt?.();
                                    break;
                                case EVideoEvent.FAIL:
                                    FrameSDK._playingAD = false;
                                    FrameSDK.frameData.gameFuc.closeLoad();
                                    if (isInterFallback) {
                                        if (webFallback) {
                                            console.log("interstitial to video failed, try web");
                                            FrameSDK.openWeb(webFallback, onStart, onEnd, onInterrupt);
                                        } else {
                                            onEnd?.(false);
                                        }
                                    } else {
                                        console.log("video failed, try interstitial");
                                        FrameSDK.openInters(placement, true, onStart, onEnd, onInterrupt, webFallback);
                                    }
                                    break;
                                case EVideoEvent.START:
                                    FrameSDK.frameData.gameFuc.closeLoad();
                                    FrameSDK.frameData.sdkFuc.earlierStageEvent("ad_success");
                                    FrameSDK.logLiftEvent("first_ad");
                                    onStart?.("video");
                                    break;
                            }
                        });
                    } else if (FrameSDK.now <= deadline) {
                        setTimeout(() => tryOpen(), 300);
                    } else {
                        FrameSDK._playingAD = false;
                        FrameSDK.frameData.gameFuc.closeLoad();
                        if (isInterFallback) {
                            if (webFallback) {
                                console.log("interstitial to video failed, try web");
                                FrameSDK.openWeb(webFallback, onStart, onEnd, onInterrupt);
                            } else {
                                onEnd?.(false);
                            }
                        } else {
                            console.log("video failed, try interstitial");
                            FrameSDK.openInters(placement, true, onStart, onEnd, onInterrupt, webFallback);
                        }
                    }
                };
                tryOpen();
            }
        });
    }

    static getFirstRedeemRequirement(): any {
        return FrameData.getCoinConf(1);
    }

    static loadPrefab(
        prefabName: string,
        callback: (node: cc.Node) => void,
        showLoad: boolean = true,
        dir: string = "Prefab/"
    ): void {
        if (showLoad) {
            FrameSDK.frameData.gameFuc.openLoad();
        }
        cc.assetManager.getBundle("Frame").load(dir + prefabName, cc.Prefab, (err, asset) => {
            if (showLoad) {
                FrameSDK.frameData.gameFuc.closeLoad();
            }
            if (asset) {
                callback(cc.instantiate(asset));
            } else {
                console.error(err);
            }
        });
    }

    static logLiftEvent(eventName: string): void {
        let name = eventName;
        if (name === "finish_task") {
            if (++FrameData.saveData.wwyFinishTaskCount === 1) {
                FrameSDK.frameData.sdkFuc.lifeEvent("submit_order");
            }
            name = "finish_task_" + FrameData.saveData.wwyFinishTaskCount;
        }
        if (!FrameData.saveData.wwyLifeEventRecord[name]) {
            FrameSDK.frameData.sdkFuc.lifeEvent(name);
            FrameData.saveData.wwyLifeEventRecord[name] = true;
        }
    }

    static addQueueUp(key: string | number, data: any = {}): void {
        FrameData.saveData.QueueUp[key] = data;
        FrameSDK.updataTimeQueueUp();
    }

    static formatSeconds3(seconds: number): { hour: string; minute: string; second: string } {
        if (seconds <= 0) seconds = 0;
        const pad = (value: number) => (value.toString().length < 2 ? "0" + value : value.toString());
        let total = parseInt("" + seconds) <= 0 ? 0 : parseInt("" + seconds);
        let hour = 0;
        let minute = 0;
        if (total >= 60) {
            hour = parseInt((total / 3600).toString());
            minute = parseInt(((total % 3600) / 60).toString());
            total = parseInt((total % 60).toString());
        }
        return { hour: pad(hour), minute: pad(minute), second: pad(total) };
    }

    static getI18n(): typeof i18 {
        return FrameSDK.i18n ?? i18;
    }

    static hiddenBanner(): void {
        FrameSDK.frameData.sdkFuc.hiddenBanner();
    }

    static addCoin(yellow: number, green: number, charityCount: number, callback?: () => void): void {
        cc.director.emit("ADD_COIN", yellow, green, charityCount, callback);
    }

    static initSettings(settings: any): void {
        FrameData.configs = settings;
        const basicConfig = settings?.basicConfig ?? {};
        for (const key in basicConfig.SDK_CONF) {
            FrameData.SDK_CONF[key] = basicConfig.SDK_CONF[key];
        }
        for (const key in basicConfig.FRAME_CONF) {
            FrameData.FRAME_CONF[key] = basicConfig.FRAME_CONF[key];
        }
        const countryCode = FrameSDK.frameData.sdkFuc.countryCode.toUpperCase();
        const localConf = basicConfig.LOCAL_CONF?.[countryCode];
        console.log("current country code: " + countryCode);
        if (localConf) {
            if (localConf.SDK_CONF) {
                for (const key in localConf.SDK_CONF) {
                    FrameData.SDK_CONF[key] = localConf.SDK_CONF[key];
                }
            }
            if (localConf.FRAME_CONF) {
                for (const key in localConf.FRAME_CONF) {
                    FrameData.FRAME_CONF[key] = localConf.FRAME_CONF[key];
                }
            }
        }
        if (!FrameData.saveData.corrected) {
            FrameData.saveData.corrected = true;
            FrameData.saveData.credit.yellowCoin = FrameData.FRAME_CONF.InitialCoins[0];
            FrameData.saveData.credit.greenCoin = FrameData.FRAME_CONF.InitialCoins[1];
        }
    }

    static convertCoinToStr(value: number, withSymbol: boolean = false): string {
        return FrameSDK.formatNumber(
            value,
            withSymbol ? 2 : 0,
            withSymbol ? FrameData.FRAME_CONF.RedeemRateConfig[0] : 0
        );
    }

    static openWindow(prefabName: string, viewData: any = {}, parent?: cc.Node): void {
        FrameSDK.loadPrefab(prefabName, (node) => {
            const instance = cc.instantiate(node);
            instance.getComponent(prefabName).viewData = viewData;
            instance.parent = parent ?? FrameSDK.Panel;
        });
    }

    static debugChangeBankTime(seconds: number): void {
        if (Panel_Activity.isActivityCollectable()) {
            seconds = Math.max(0, seconds);
            FrameData.saveData.activity.time = FrameSDK.now + seconds;
        }
    }

    static formatNumber(value: number, decimals: number = 0, rateDivisor: number = 0): string {
        decimals = Math.max(0, Math.floor(decimals));
        if (rateDivisor > 0) {
            value = (value / rateDivisor) * FrameData.CountryConf.rate;
        }
        const raw = value.toString();
        const parts = raw.split(".");
        if (decimals <= 0) {
            parts.length = 1;
        } else if (parts.length > 1) {
            parts[1] = parts[1].substring(0, decimals);
        }
        const sign = raw.startsWith("+") || raw.startsWith("-") ? parts[0].substring(0, 1) : "";
        parts[0] = parts[0].substring(sign.length);
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return "" + sign + (rateDivisor > 0 ? FrameData.CountryConf.symbol : "") + parts.join(".");
    }

    static logGameEvent(eventName: string, payload: any, once: boolean = false): void {
        if (!once || !FrameSDK._isOnceEventLogged(eventName, payload)) {
            const data: any = { object_action: payload.object_action };
            if (payload.object_name != null) data.object_name = payload.object_name;
            if (payload.object_notes != null) data.object_notes = payload.object_notes;
            FrameSDK.frameData.sdkFuc.logGameEvent(eventName, data, once);
            if (once) {
                const cacheKey = FrameSDK._getOnceEventCacheKey(eventName, payload);
                FrameData.saveData.onceEventRecord[cacheKey] = true;
            }
        }
    }

    static onlineTimeUpdate(): void {
        if (!FrameSDK.ONLINE_TIME) {
            FrameSDK.ONLINE_TIME = setInterval(() => {
                FrameSDK.resetNextData();
                FrameSDK.updataTimeQueueUp();
            }, 1000);
        }
    }

    static openPanel_Yellow(): void {
        FrameSDK.loadPrefab("RDM_Level", (node) => {
            cc.instantiate(node).parent = FrameSDK.Panel;
        });
    }

    static convertCharityToStr(value: number, withSymbol: boolean = false): string {
        return FrameSDK.formatNumber(
            value,
            withSymbol ? 2 : 0,
            withSymbol ? FrameData.FRAME_CONF.RedeemRateConfig[1] : 0
        );
    }

    static addCreditListen(callback: (...args: any[]) => void, target: any): void {
        cc.director.on("FRESH_CREDIT", callback, target);
    }

    static addi18nArray(items: any[]): void {
        if (FrameSDK.i18n) {
            FrameSDK.i18n.addi18nArray(items);
        } else {
            i18.init(items, null, FrameData.SDK_CONF.COUNTRY_LIST);
        }
    }

    static openEffect(target: any, options?: any, callback?: () => void): void {
        if (!target.black_sprite) {
            target.black_sprite = new cc.Node(target.node.name + "_black_sprite").addComponent(cc.Sprite);
            target.black_sprite.node.addComponent(cc.BlockInputEvents);
            target.black_sprite.node.color = cc.Color.BLACK;
            target.black_sprite.node.zIndex = -1;
            target.node.addChild(target.black_sprite.node);
            cc.assetManager.getBundle("Frame").load("internal/image/default_editbox_bg", cc.SpriteFrame, (_err, frame) => {
                target.black_sprite.spriteFrame = frame;
                target.black_sprite.node.width = cc.winSize.width + 200;
                target.black_sprite.node.height = cc.winSize.height + 200;
            });
            target.noTouch = new cc.Node(target.node.name + "_noTouch").addComponent(cc.BlockInputEvents);
            target.noTouch.node.setContentSize(cc.winSize.width + 200, cc.winSize.height + 200);
            target.node.addChild(target.noTouch.node);
        }
        if (target.black_sprite) {
            target.black_sprite.node.opacity = 0;
            cc.tween(target.black_sprite.node)
                .to(0.2, { opacity: options?.opacity ?? 204 })
                .start();
        }
        if (target.panel_window != null) {
            target.panel_window.stopActionByTag(4660);
            target.panel_window.scale = 0.1;
            target.panel_window.opacity = 255;
            cc.tween(target.panel_window)
                .parallel(
                    cc.tween().delay(0.01).call(() => {
                        callback?.();
                        target.noTouch.node.active = false;
                    }),
                    cc.tween().to(0.25, { scale: 1, opacity: 255 }, { easing: "backOut" })
                )
                .tag(4660)
                .start();
        } else {
            target.node.stopActionByTag(4660);
            cc.tween(target.node)
                .tag(4660)
                .call(() => {
                    callback?.();
                    target.noTouch.node.active = false;
                })
                .start();
        }
    }

    static randomIntNum(min: number, max: number): number {
        return parseInt(Math.random() * (max - min + 1) + min + "", 10);
    }

    @CLICKLOCK()
    static openWeb(
        rewardInfo: any,
        onStart?: (type: string) => void,
        onEnd?: (success: boolean, type?: string) => void,
        onCancel?: () => void
    ): void {
        if (!FrameData.SDK_CONF.NO_VIDEO && FrameSDK.frameData) {
            if (!FrameSDK.frameData.gameData.noProfitAd && FrameData.FRAME_CONF.adAlternateEnabled) {
                const adAlternate = FrameData.saveData.adAlternate;
                const candidates: any[] = [];
                let totalWeight = 0;
                const country = FrameData.myCountry.toUpperCase();
                for (const config of FrameData.FRAME_CONF.AdAlternateConfig) {
                    if (
                        (config.fill_zone.length > 0 &&
                            config.fill_zone.findIndex((zone: string) => zone.toUpperCase() === country) < 0) ||
                        (config.fill_ban.length > 0 &&
                            config.fill_ban.findIndex((zone: string) => zone.toUpperCase() === country) >= 0)
                    ) {
                        continue;
                    }
                    const totalComplete = adAlternate.totalComplete[config.fill_id] ?? 0;
                    const todayComplete = adAlternate.todayComplete[config.fill_id] ?? 0;
                    if (!(totalComplete >= config.fill_total || todayComplete >= config.fill_daily)) {
                        candidates.push(config);
                        totalWeight += config.fill_wgt;
                    }
                }
                let roll = Math.random() * totalWeight;
                let selected: any = null;
                for (const config of candidates) {
                    if (roll < config.fill_wgt) {
                        selected = config;
                        break;
                    }
                    roll -= config.fill_wgt;
                }
                if (selected == null) {
                    onEnd?.(false);
                } else {
                    FrameSDK.openWindow("Panel_AdAlternate", {
                        id: selected.fill_id,
                        time: selected.fill_time,
                        url: selected.fill_url,
                        reward: rewardInfo.reward,
                        isMax: rewardInfo.isMax,
                        startCallback: () => {
                            FrameSDK.frameData.sdkFuc.earlierStageEvent("ad_success");
                            FrameSDK.logLiftEvent("first_ad");
                            onStart?.("web");
                        },
                        cancelCallback: () => onCancel?.(),
                        endCallback: (success: boolean) => {
                            if (success) {
                                FrameSDK._lastVideoEndTime = Date.now();
                                const data = FrameData.saveData.adAlternate;
                                data.todayComplete[selected.fill_id] = (data.todayComplete[selected.fill_id] ?? 0) + 1;
                                data.totalComplete[selected.fill_id] = (data.totalComplete[selected.fill_id] ?? 0) + 1;
                                FrameData.saveData.adAlternate = data;
                            }
                            onEnd?.(success, "web");
                        },
                    });
                }
            } else {
                onEnd?.(false);
            }
        } else {
            console.log("skip web");
            FrameSDK._lastVideoEndTime = Date.now();
            onEnd?.(true, "web");
        }
    }

    static onAppLifecycleChange(isHide: boolean): void {
        if (FrameSDK._playingAD || !FrameData.SDK_CONF.splashEnabled) {
            return;
        }
        const splashNode = cc.director.getScene()?.getChildByName("__FRAME_SPLASH__");
        if (isHide) {
            FrameSDK._appHideTime = Date.now();
            if (!splashNode) return;
            splashNode.zIndex = cc.macro.MAX_ZINDEX;
            splashNode.active = true;
            cc.director.emit("SHOW_SPLASH");
        } else {
            if (!splashNode) return;
            splashNode.zIndex = cc.macro.MAX_ZINDEX;
            splashNode.active = true;
            cc.director.emit("SHOW_SPLASH");
            const interval = 1000 * (FrameData.SDK_CONF.splashShowInterval ?? 30);
            if (
                FrameSDK.frameData.gameData.currentScene === "loading" ||
                FrameSDK._appHideTime == null ||
                Date.now() - FrameSDK._appHideTime < interval
            ) {
                splashNode.active = false;
                cc.director.emit("HIDE_SPLASH");
                return;
            }
            FrameSDK.logGameEvent("thepool_sad", {
                object_action: "show",
                object_name: "sad_show",
                object_notes: "hot",
            });
            if (!FrameSDK.frameData.sdkFuc.isSplashReady()) {
                FrameSDK.logGameEvent("thepool_sad", {
                    object_action: "show",
                    object_name: "sad_fail",
                    object_notes: "hot",
                });
                splashNode.active = false;
                cc.director.emit("HIDE_SPLASH");
                return;
            }
            FrameSDK.frameData.sdkFuc.openSplash((event: EVideoEvent) => {
                if (event === EVideoEvent.END || event === EVideoEvent.FAIL) {
                    FrameSDK.logGameEvent("thepool_sad", {
                        object_action: "show",
                        object_name: event === EVideoEvent.FAIL ? "sad_fail" : "sad_succ",
                        object_notes: "hot",
                    });
                    splashNode.active = false;
                    cc.director.emit("HIDE_SPLASH");
                }
            });
        }
    }

    @CLICKLOCK()
    static openInters(
        placement: string,
        isVideoFallback: boolean,
        onStart?: (type: string) => void,
        onEnd?: (success: boolean, type?: string) => void,
        onInterrupt?: () => void,
        webFallback?: any
    ): void {
        if (FrameData.SDK_CONF.NO_VIDEO || !FrameSDK.frameData) {
            console.log("skip interstitial");
            FrameSDK._lastVideoEndTime = Date.now();
            FrameSDK._playingAD = false;
            onStart?.("interstitial");
            onEnd?.(true, "interstitial");
        } else {
            FrameSDK._playingAD = true;
            FrameSDK.frameData.gameFuc.openLoad();
            FrameSDK.frameData.sdkFuc.openInters(placement, (event: EVideoEvent) => {
                console.log("interstitial event - " + EVideoEvent[event]);
                switch (event) {
                    case EVideoEvent.END:
                        FrameSDK._lastVideoEndTime = Date.now();
                        FrameSDK._playingAD = false;
                        FrameSDK.frameData.gameFuc.closeLoad();
                        cc.director.emit(FrameSDK.frameData.ListenKeys.VIDEO_SUC);
                        onEnd?.(true, "interstitial");
                        break;
                    case EVideoEvent.INTERRUPT:
                        FrameSDK._playingAD = false;
                        FrameSDK.frameData.gameFuc.closeLoad();
                        onInterrupt?.();
                        break;
                    case EVideoEvent.FAIL:
                        FrameSDK._playingAD = false;
                        FrameSDK.frameData.gameFuc.closeLoad();
                        if (isVideoFallback) {
                            if (webFallback) {
                                console.log("video to interstitial failed, try web");
                                FrameSDK.openWeb(webFallback, onStart, onEnd, onInterrupt);
                            } else {
                                onEnd?.(false);
                            }
                        } else {
                            console.log("interstitial failed, try video");
                            FrameSDK.openVideo(placement, true, onStart, onEnd, onInterrupt, webFallback);
                        }
                        break;
                    case EVideoEvent.START:
                        FrameSDK.frameData.gameFuc.closeLoad();
                        FrameSDK.frameData.sdkFuc.earlierStageEvent("ad_success");
                        FrameSDK.logLiftEvent("first_ad");
                        onStart?.("interstitial");
                        break;
                }
            });
        }
    }

    static playEffect(name: string): number {
        if (FrameSDK.soundList[name] == null) {
            cc.assetManager.getBundle("Frame").load("Sound/" + name, cc.AudioClip, (_err, clip) => {
                if (clip) {
                    FrameSDK.soundList[name] = clip;
                    FrameSDK.playEffect(name);
                } else {
                    cc.warn("没有这个音效", name);
                }
            });
        } else if (FrameSDK.frameData.gameData.isSound) {
            return cc.audioEngine.playEffect(FrameSDK.soundList[name], false);
        }
    }

    static showToast(text: string): void {
        FrameSDK.loadPrefab("Panel_Toast", (node) => {
            const instance = cc.instantiate(node);
            instance.getComponent(RDM_Toast).text = text;
            instance.parent = FrameSDK.Panel;
        });
    }

    static getDateDay(timestamp: number): number {
        const date = new Date(1000 * timestamp);
        const year = date.getFullYear() + "";
        const month = date.getMonth() + 1 > 9 ? String(date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        const day = date.getDate() > 9 ? String(date.getDate()) : "0" + date.getDate();
        return parseInt(year + month + day);
    }

    static addNewHandFinishListen(callback: (...args: any[]) => void, target: any): void {
        cc.director.on("NEW_HAND_FINISH", callback, target);
    }

    static getRandomInviteCode(): string {
        const num = Math.ceil(10000 * Math.random()) + "**";
        const letters = Array.from({ length: 26 }, (_v, i) => String.fromCharCode(65 + i));
        return letters[Math.floor(Math.random() * letters.length)] + num;
    }

    static initSplash(callback?: () => void): void {
        cc.director.off(FrameSDK.frameData.ListenKeys.APP_LIFECYCLE_CHANGE, FrameSDK.onAppLifecycleChange, FrameSDK);
        if (FrameData.SDK_CONF.NO_SPLASH) {
            callback?.();
        } else {
            cc.director.on(FrameSDK.frameData.ListenKeys.APP_LIFECYCLE_CHANGE, FrameSDK.onAppLifecycleChange, FrameSDK);
            const scene = cc.director.getScene();
            if (scene) {
                if (scene.getChildByName("__FRAME_SPLASH__")) {
                    callback?.();
                } else {
                    cc.assetManager.getBundle("Frame").load("Prefab/Splash", cc.Prefab, (err, prefab) => {
                        if (prefab) {
                            const splash = cc.instantiate(prefab);
                            splash.name = "__FRAME_SPLASH__";
                            splash.active = false;
                            scene.addChild(splash, cc.macro.MAX_ZINDEX);
                            cc.game.addPersistRootNode(splash);
                        } else {
                            console.error("failed to load splash: " + (err?.message ?? "unknown reason"));
                        }
                        callback?.();
                    });
                }
            } else {
                console.error("scene not found");
                callback?.();
            }
        }
    }

    static openRating(callback?: () => void): void {
        if (
            FrameData.saveData.isRating === false &&
            FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.ratingLevel
        ) {
            if (FrameData.SDK_CONF.GradeState === 0 || FrameData.saveData.openRatingInedx > 3) {
                callback?.();
                return;
            }
            FrameSDK.openGradeNum++;
            if (FrameData.saveData.openRatingInedx > 0 && FrameSDK.openGradeNum % FrameData.FRAME_CONF.intervalGrade !== 0) {
                callback?.();
                return;
            }
            FrameSDK.openWindow("Panel_Rating", { closeCB: callback });
        } else {
            callback?.();
        }
    }

    static setLan(langCode: string): void {
        FrameSDK.getCountry_Language(langCode);
        (FrameSDK.i18n ?? i18).setLanguage(langCode);
    }

    static debugAddBankCoin(amount: number): void {
        if (amount !== 0) {
            Panel_Activity.addCoin(amount);
        }
    }

    static openPanel_Charity(): void {
        FrameSDK.loadPrefab("RDM_Charity", (node) => {
            cc.instantiate(node).parent = FrameSDK.Panel;
        });
    }

    static initCocosAmend(): void {
        cc.director.on(FrameSDK.frameData.ListenKeys.FRESH_STRING, () => {
            (FrameSDK.i18n ?? i18).updataString();
        });
        if (!cc.__$_WebView_onEnable_$__) {
            cc.__$_WebView_onEnable_$__ = cc.WebView.prototype.onEnable;
            cc.WebView.prototype.onEnable = function (this: cc.WebView) {
                cc.__$_WebView_onEnable_$__.call(this);
                if (!this.__splashEventListened) {
                    cc.director.on("SHOW_SPLASH", () => {
                        if (this.node) {
                            if (this.__scaleX == null) {
                                this.__scaleX = this.node.scaleX;
                                this.node.scaleX = 0;
                            }
                            if (this.__scaleY == null) {
                                this.__scaleY = this.node.scaleY;
                                this.node.scaleY = 0;
                            }
                        }
                    });
                    cc.director.on("HIDE_SPLASH", () => {
                        if (this.node) {
                            if (this.__scaleX != null) {
                                this.node.scaleX = this.__scaleX;
                                this.__scaleX = undefined;
                            }
                            if (this.__scaleY != null) {
                                this.node.scaleY = this.__scaleY;
                                this.__scaleY = undefined;
                            }
                        }
                    });
                    this.__splashEventListened = true;
                }
            };
        }
    }

    static logCommonEvent(eventName: string, payload: any = null): void {
        FrameSDK.frameData.sdkFuc.logCommonEvent(eventName, payload);
    }

    static getNodeTexture(nodes: cc.Node | cc.Node[], parent?: cc.Node): cc.SpriteFrame {
        if (nodes instanceof cc.Node) {
            nodes = [nodes];
        }
        const cameraNode = new cc.Node();
        cameraNode.parent = parent ?? cc.find("Canvas");
        const camera = cameraNode.addComponent(cc.Camera);
        camera.cullingMask = 4294967295;
        camera.depth = 2;
        camera.alignWithScreen = true;
        const texture = new cc.RenderTexture();
        texture.initWithSize(cc.winSize.width, cc.winSize.height, cc.RenderTexture.DepthStencilFormat.RB_FMT_S8);
        camera.targetTexture = texture;
        for (const node of nodes) {
            camera.render(node);
        }
        cameraNode.removeFromParent(true);
        cameraNode.destroy();
        const frame = new cc.SpriteFrame(texture);
        frame.setFlipY(true);
        return frame;
    }

    static getRes(path: string, type: typeof cc.Asset, callback?: (asset: cc.Asset) => void): void {
        const asset = cc.assetManager.getBundle("Frame").get("res/" + path, type);
        if (asset) {
            callback?.(asset);
        } else {
            cc.assetManager.getBundle("Frame").load("res/" + path, type, (_err, loaded) => {
                callback?.(loaded);
            });
        }
    }

    static showWebView(sourceNode: cc.Node): cc.WebView {
        const scene = cc.director.getScene();
        let webViewNode = scene.getChildByName("__Frame_web_view__");
        if (!webViewNode) {
            webViewNode = new cc.Node("__Frame_web_view__");
            scene.addChild(webViewNode, cc.macro.MAX_ZINDEX);
            webViewNode.setParent(scene);
        }
        if (!cc.game.isPersistRootNode(webViewNode)) {
            cc.game.addPersistRootNode(webViewNode);
        }
        webViewNode.active = true;
        const worldPos = sourceNode.convertToWorldSpaceAR(cc.Vec3.ZERO);
        const localPos = webViewNode.parent.convertToNodeSpaceAR(worldPos);
        webViewNode.position = localPos;
        webViewNode.setAnchorPoint(sourceNode.anchorX, sourceNode.anchorY);
        webViewNode.setContentSize(sourceNode.width, sourceNode.height);
        return webViewNode.getComponent(cc.WebView) ?? webViewNode.addComponent(cc.WebView);
    }
}

cc.js.setClassName("FrameSDK", FrameSDK);
