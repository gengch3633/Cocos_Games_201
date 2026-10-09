import { CLICKLOCK } from "./CLICKLOCK";
import Frame from "./Frame";
import { FrameData } from "./FrameData";
import i18 from "./i18";
import Panel_Activity from "./Panel_Activity";
import Panel_SuperReward from "./Panel_SuperReward";
import Panel_Task from "./Panel_Task";
import RDM_Toast from "./RDM_Toast";

export enum EVideoEvent {
    START = 0,
    END = 1,
    CLICK = 2,
    INTERRUPT = 3,
    PROFIT = 4,
    FAIL = 5
}

export class FrameSDK {

    static Panel: cc.Node = null;
    static i18n: any = undefined;
    static ONLINE_TIME: any = null;
    static DATE_DAY: any = null;
    static soundList: any = [];
    static _lastVideoEndTime: number = 0;
    static _sceneFirstAccessFlags: any = {};
    static _appHideTime: any = null;
    static _playingAD: boolean = false;
    static frameData: any = null;
    static currLevel: number = 0;
    static openGradeNum: number = 0;

    static get now() {
        return Math.floor(cc.sys.now() / 1000);
    }

    static getNoAdDelayTime() {
        const passLevel = FrameSDK.frameData.gameData.passLevel;
        let delay;
        const list = FrameData.FRAME_CONF.noAdConfig;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (!(passLevel >= item.startLevel - 1)) {
                break;
            }
            delay = item.delayTime;
        }
        return delay;
    }

    static checkPopUp(scene, unused, done) {
        const self = this;
        let chain = Promise.resolve();
        if (!this._sceneFirstAccessFlags[scene]) {
            this._sceneFirstAccessFlags[scene] = true;
            chain = chain.then(function () {
                return new Promise<void>(function (resolve) {
                    const newHand = cc.sys.localStorage.getItem("newHand");
                    const passLevel = FrameSDK.frameData.gameData.passLevel;
                    if (!FrameSDK.frameData.gameData.noProfitAd && passLevel >= FrameData.FRAME_CONF.welcomeBackStartLevel - 1 && passLevel < FrameData.FRAME_CONF.welcomeBackEndLevel && null != newHand) {
                        self.openWindow("Panel_WelcomeBack", {
                            closeCB: function () {
                                return resolve();
                            }
                        });
                    } else {
                        resolve();
                    }
                });
            }).then(function () {
                return new Promise<void>(function (resolve) {
                    return Panel_Activity.onLogin(resolve);
                });
            });
        }
        chain.then(function () {
            return new Promise<void>(function (resolve) {
                if (!FrameSDK.frameData.gameData.noProfitAd && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.charityLevel && FrameData.saveData.charityGuideIndex <= 0) {
                    cc.director.once("CHARITY_GUIDE_FINISH", function () {
                        return resolve();
                    });
                    self.openWindow("Panel_GuideTips", {
                        type: "charity",
                        closeCB: function () {
                            return Frame.ins.setGuide2Show(true);
                        }
                    });
                } else {
                    resolve();
                }
            });
        }).then(function () {
            return new Promise<void>(function (resolve) {
                if (!FrameData.saveData.activity && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.bankLevel) {
                    Panel_Activity.startActivity(resolve);
                } else {
                    resolve();
                }
            });
        }).then(function () {
            return new Promise<void>(function (resolve) {
                if (null == FrameData.saveData.lvAwardinfo && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.taskLevel) {
                    Panel_Task.startTask(resolve);
                } else {
                    resolve();
                }
            });
        }).then(function () {
            return new Promise<void>(function (resolve) {
                if (!FrameData.saveData.superReward && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.superRewardLevel) {
                    Panel_SuperReward.startSuperReward(resolve);
                } else {
                    resolve();
                }
            });
        }).then(function () {
            if (done != null) {
                done();
            }
        });
    }

    static hideWebView(target) {
        const scene = cc.director.getScene();
        const node = scene != null ? scene.getChildByName("__Frame_web_view__") : undefined;
        if (node) {
            node.active = false;
            const existing = node.getComponent(cc.WebView);
            const webView = existing != null ? existing : node.addComponent(cc.WebView);
            webView.node.targetOff(target);
            webView.url = "";
        }
    }

    static getCurrentRedeemRequirement() {
        const passLevel = FrameSDK.frameData.gameData.passLevel;
        let first = FrameData.getCoinConf(1);
        let second = FrameData.getCoinConf(2);
        if (first.rdm_1 > second.rdm_1) {
            const swap = first;
            first = second;
            second = swap;
        }
        return passLevel >= second.rdm_1 ? null : passLevel >= first.rdm_1 ? second : first;
    }

    static init(frameData, settings, lang, splashCallback) {
        this.frameData = frameData;
        FrameSDK.initCocosAmend();
        FrameSDK.correctConfigs();
        cc.assetManager.getBundle("Frame").preloadDir("Prefab");
        FrameSDK.initSettings(settings);
        this.i18n = lang;
        this.setLan(cc.sys.languageCode);
        if (null == FrameData.saveData.date_day) {
            FrameData.saveData.date_day = FrameSDK.getDateDay(FrameSDK.now);
        }
        if (!FrameData.saveData.adAlternate) {
            FrameData.saveData.adAlternate = {
                totalComplete: {},
                todayComplete: {}
            };
        }
        FrameSDK.DATE_DAY = FrameData.saveData.date_day;
        FrameSDK.onlineTimeUpdate();
        FrameSDK.resetNextData();
        FrameSDK.updataTimeQueueUp();
        FrameSDK.initSplash(splashCallback);
    }

    static HttpGet(url, params, callback) {
        const xhr = cc.loader.getXMLHttpRequest();
        if (params) {
            url += "?" + function (data) {
                let query = "";
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        query += key + "=" + data[key] + "&";
                    }
                }
                return query.substring(0, query.length - 1);
            }(params);
        }
        xhr.open("GET", url, true);
        xhr.onload = function () {
            if (4 == xhr.readyState && 200 == xhr.status) {
                callback(null, xhr.responseText);
            } else {
                callback({
                    name: "Can't get",
                    message: url
                }, {});
            }
        };
        xhr.onerror = function () {
            callback({
                name: "Can't get it. The network may be disconnected",
                message: url
            }, {});
        };
        xhr.send();
    }

    static updataVideoQueueUp() {
        for (const key in FrameData.saveData.QueueUp) {
            const item = FrameData.saveData.QueueUp[key];
            if (null == item.deadLinePeopleCount) {
                item.deadLinePeopleCount = FrameSDK.randomInt(FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[0], FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[1]);
                item.deadLineTimeStamp = FrameSDK.now;
                item.historyList = [];
            }
            const rules = FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus;
            for (let i = 0; i < rules.length; i++) {
                if (item.deadLinePeopleCount > rules[i].count) {
                    const roll = FrameSDK.randomInt(0, 100);
                    const code = FrameSDK.getRandomInviteCode();
                    if (roll < FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[i].MinusPrecend) {
                        const minus = FrameSDK.randomInt(FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[i].minusCount[0], FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[i].minusCount[1]);
                        item.deadLinePeopleCount -= minus;
                        if (item.deadLinePeopleCount < 1) {
                            item.deadLinePeopleCount = 1;
                        }
                        item.deadLineShowTip = "tkey_211??&value1==<color = #249A50>" + code + "</color>&&value2==<color = #249A50>" + item.deadLinePeopleCount + "</color>";
                        if (item.historyList.length < FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) {
                            item.historyList.push({
                                key: "tkey_211",
                                account: code,
                                peopleCount: item.deadLinePeopleCount
                            });
                        } else {
                            item.historyList.shift();
                            item.historyList.push({
                                key: "tkey_211",
                                account: code,
                                peopleCount: item.deadLinePeopleCount
                            });
                        }
                    } else {
                        item.deadLinePeopleCount += FrameSDK.randomInt(FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[i].addCount[0], FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[i].addCount[1]);
                        item.deadLineShowTip = "tkey_210??&value1==<color = #249A50>" + code + "</color>&&value2==<color = #249A50>" + item.deadLinePeopleCount + "</color>";
                        if (item.historyList.length < FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) {
                            item.historyList.push({
                                key: "tkey_210",
                                account: code,
                                peopleCount: item.deadLinePeopleCount
                            });
                        } else {
                            item.historyList.shift();
                            item.historyList.push({
                                key: "tkey_210",
                                account: code,
                                peopleCount: item.deadLinePeopleCount
                            });
                        }
                    }
                    break;
                }
            }
        }
    }

    static openLevelAward(externalNode, unlockCountUpdateFunc, superExternalNode, param, closeCB) {
        FrameSDK.openWindow("Panel_Award_5", {
            externalNode: externalNode,
            unlockCountUpdateFunc: unlockCountUpdateFunc,
            superExternalNode: superExternalNode,
            param: param,
            closeCB: function (result) {
                if (FrameSDK.currLevel != FrameSDK.frameData.gameData.passLevel + 1) {
                    FrameSDK.currLevel = FrameSDK.frameData.gameData.passLevel + 1;
                }
                if (closeCB != null) {
                    closeCB(result);
                }
            }
        });
    }

    static _isOnceEventLogged(eventName, data) {
        const key = this._getOnceEventCacheKey(eventName, data);
        return true === FrameData.saveData.onceEventRecord[key];
    }

    static isShowInters() {
        if (FrameSDK.frameData.gameData.noProfitAd) {
            return false;
        }
        const passLevel = FrameSDK.frameData.gameData.passLevel;
        const config = FrameData.FRAME_CONF.InterConfig;
        if (passLevel < config.maxFreeLevel) {
            return false;
        }
        let cooldown = 0;
        const list = config.cooldown;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (!(passLevel >= item.startLevel - 1)) {
                break;
            }
            cooldown = item.cd;
        }
        return Date.now() - this._lastVideoEndTime >= cooldown;
    }

    static beforeGameLevelStart(level, round, extra, done) {
        const self = this;
        const parts = [level];
        if (null != round) {
            parts.push(round);
        }
        if (null != extra) {
            parts.push(extra);
        }
        FrameSDK.logGameEvent("thepool_game_lv", {
            object_action: "show",
            object_name: "lv_start",
            object_notes: "" + parts.join("_")
        }, true);
        new Promise<void>(function (resolve) {
            let timer = null;
            timer = setInterval(function () {
                if (Frame.ins) {
                    clearInterval(timer);
                    resolve();
                }
            });
        }).then(function () {
            return new Promise<void>(function (resolve) {
                if (level < FrameData.FRAME_CONF.RedeemTipsStartLevel || level > self.getFirstRedeemRequirement().rdm_1) {
                    resolve();
                } else {
                    self.openWindow("Panel_RedeemTips", {
                        level: level,
                        currentBonus: FrameData.credit,
                        closeCB: resolve
                    });
                }
            });
        }).then(function () {
            return new Promise<void>(function (resolve) {
                if (FrameSDK.isShowInters()) {
                    const passLevel = FrameSDK.frameData.gameData.passLevel;
                    let videoFirst = false;
                    const list = FrameData.FRAME_CONF.InterConfig.beforeLevelAd;
                    for (let i = 0; i < list.length; i++) {
                        const item = list[i];
                        if (!(passLevel >= item.startLevel - 1)) {
                            break;
                        }
                        videoFirst = item.videoFirst != null && item.videoFirst;
                    }
                    FrameSDK.logCommonEvent("c_ad_event", {
                        action: "touch",
                        type: videoFirst ? "video" : "interstitial",
                        placement: "enter_level"
                    });
                    (videoFirst ? FrameSDK.openVideo : FrameSDK.openInters).call(FrameSDK, "enter_level", false, function (adType) {
                        FrameSDK.logGameEvent("thepool_game_ad", {
                            object_action: "show",
                            object_name: "enter_level",
                            object_notes: "video" === adType ? "video" : "web" === adType ? "web" : "inter"
                        });
                    }, function (success) {
                        if (success) {
                            FrameSDK.addCoin(0, FrameData.getCharityOutNum(), 1, function () {
                                return resolve();
                            });
                        } else {
                            resolve();
                        }
                    }, function () {
                        return resolve();
                    });
                } else {
                    resolve();
                }
            });
        }).then(function () {
            if (done != null) {
                done();
            }
            cc.director.emit("SHOW_FLYING_BONUS");
        });
    }

    static addSuperAwardListen(callback, target) {
        cc.director.on("SUPER_AWARD", callback, target);
    }

    static openBanner(style = 1, align = 0) {
        if (FrameData.SDK_CONF.isShowBanner) {
            FrameSDK.frameData.sdkFuc.openBanner(style, align);
        } else {
            console.log("配置关闭了 Banner 广告");
        }
    }

    static debugAddCoin(type, change) {
        if (0 !== change) {
            const num = Math.max(0, FrameData.saveData.credit[type] + change);
            cc.director.emit("FRESH_CREDIT", {
                type: type,
                num: num,
                change: change
            });
            FrameData.saveData.credit[type] = num;
        }
    }

    static correctConfigs() {
        if (!FrameSDK.frameData.gameData.noProfitAd) {
            FrameData.FRAME_CONF.CoinConf = [{
                rdm_id: 1,
                rdm_1: 20,
                rdm_2: [5000, 20000],
                rdm_3: 100
            }, {
                rdm_id: 2,
                rdm_1: 40,
                rdm_2: [5000, 20000],
                rdm_3: 100
            }];
            FrameData.FRAME_CONF.RedeemRateConfig = [10, 1];
        }
    }

    static resetNextData() {
        if (this.DATE_DAY < FrameSDK.getDateDay(FrameSDK.now)) {
            this.DATE_DAY = FrameData.saveData.date_day = FrameSDK.getDateDay(FrameSDK.now);
            for (const key in FrameData.saveData.nextData) {
                if (Array.isArray(FrameData.saveData.nextData[key])) {
                    FrameData.saveData.nextData[key] = [];
                } else if ("object" == typeof FrameData.saveData.nextData[key]) {
                    FrameData.saveData.nextData[key] = {};
                } else if ("number" == typeof FrameData.saveData.nextData[key]) {
                    FrameData.saveData.nextData[key] = 0;
                }
            }
            FrameData.saveData.loginDays++;
            const adAlternate = FrameData.saveData.adAlternate;
            FrameData.saveData.adAlternate = {
                totalComplete: adAlternate.totalComplete,
                todayComplete: {}
            };
        }
    }

    static updataTimeQueueUp() {
        for (const key in FrameData.saveData.QueueUp) {
            const item = FrameData.saveData.QueueUp[key];
            if (null == item.deadLinePeopleCount) {
                item.deadLinePeopleCount = FrameSDK.randomInt(FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[0], FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[1]);
                item.deadLineTimeStamp = FrameSDK.now;
                item.historyList = [];
            }
            let people = item.deadLinePeopleCount;
            let stamp = item.deadLineTimeStamp;
            let delta = 0;
            let kind = -1;
            for (;;) {
                const step = FrameSDK.randomInt(FrameData.FRAME_CONF.TaskLineFrameConfig.flashDeltaTime[0], FrameData.FRAME_CONF.TaskLineFrameConfig.flashDeltaTime[1]);
                if (!(FrameSDK.now - step >= stamp)) {
                    break;
                }
                if (people + delta >= FrameData.FRAME_CONF.TaskLineFrameConfig.outLinePeopleCount) {
                    delta = 0;
                    people = FrameSDK.randomInt(FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[0], FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[1]);
                    kind = 1;
                } else {
                    const rules = FrameData.FRAME_CONF.TaskLineFrameConfig.ChangePlusList;
                    for (let i = 0; i < rules.length; i++) {
                        if (people + delta >= rules[i].count) {
                            if (FrameSDK.randomInt(0, 100) <= rules[i].precend) {
                                delta += FrameSDK.randomInt(rules[i].addCount[0], rules[i].addCount[1]);
                                kind = 2;
                            } else {
                                delta -= 1;
                                kind = 1;
                            }
                            break;
                        }
                    }
                }
                stamp += step;
            }
            item.deadLineTimeStamp = stamp;
            item.deadLinePeopleCount = delta + people;
            if (item.deadLinePeopleCount < 1) {
                item.deadLinePeopleCount = 1;
            }
            if (-1 != kind) {
                if (1 == kind) {
                    item.deadLineShowTip = "tkey_209??&value1==<color = #249A50>" + item.deadLinePeopleCount + "</color>";
                    if (item.historyList.length < FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) {
                        item.historyList.push({
                            key: "tkey_209",
                            account: "",
                            peopleCount: item.deadLinePeopleCount
                        });
                    } else {
                        item.historyList.shift();
                        item.historyList.push({
                            key: "tkey_209",
                            account: "",
                            peopleCount: item.deadLinePeopleCount
                        });
                    }
                }
                if (2 == kind) {
                    const code = FrameSDK.getRandomInviteCode();
                    item.deadLineShowTip = "tkey_210??&value1==<color = #249A50>" + code + "</color>&&value2==<color = #249A50>" + item.deadLinePeopleCount + "</color>";
                    if (item.historyList.length < FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) {
                        item.historyList.push({
                            key: "tkey_210",
                            account: code,
                            peopleCount: item.deadLinePeopleCount
                        });
                    } else {
                        item.historyList.shift();
                        item.historyList.push({
                            key: "tkey_210",
                            account: code,
                            peopleCount: item.deadLinePeopleCount
                        });
                    }
                }
            }
        }
    }

    static randomFloatNum(min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomInt(min, max?) {
        if (Array.isArray(min)) {
            max = min[1];
            min = min[0];
        }
        return Math.floor((max - min + 1) * Math.random()) + min;
    }

    static beforeEnterGame(done) {
        if (null != cc.sys.localStorage.getItem("newHand") && FrameData.SDK_CONF.splashEnabled) {
            FrameSDK.logGameEvent("thepool_sad", {
                object_action: "show",
                object_name: "sad_show",
                object_notes: "cold"
            });
            const deadline = Date.now() + 1000 * FrameData.SDK_CONF.splashWaitInterval;
            const tryOpen = function () {
                if (FrameSDK.frameData.sdkFuc.isSplashReady()) {
                    const scene = cc.director.getScene();
                    const splash = scene != null ? scene.getChildByName("__FRAME_SPLASH__") : undefined;
                    if (splash) {
                        splash.zIndex = cc.macro.MAX_ZINDEX;
                        splash.active = true;
                    }
                    FrameSDK.frameData.sdkFuc.openSplash(function (event) {
                        if (event === EVideoEvent.END || event === EVideoEvent.FAIL) {
                            FrameSDK.logGameEvent("thepool_sad", {
                                object_action: "show",
                                object_name: event === EVideoEvent.FAIL ? "sad_fail" : "sad_succ",
                                object_notes: "cold"
                            });
                            if (splash) {
                                splash.active = false;
                                cc.director.emit("HIDE_SPLASH");
                            }
                            if (done != null) {
                                done();
                            }
                        }
                    });
                } else if (Date.now() <= deadline) {
                    setTimeout(tryOpen, 0.3);
                } else {
                    FrameSDK.logGameEvent("thepool_sad", {
                        object_action: "show",
                        object_name: "sad_fail",
                        object_notes: "cold"
                    });
                    if (done != null) {
                        done();
                    }
                }
            };
            tryOpen();
        } else if (done != null) {
            done();
        }
    }

    static openABAward(done) {
        FrameData.saveData.preAwardType = (FrameData.saveData.preAwardType + 1) % 2;
        FrameSDK.openWindow("Panel_Award_" + (1 === FrameData.saveData.preAwardType ? "3" : "1"), {
            closeCB: function () {
                if (done) {
                    done();
                }
            }
        });
    }

    static formatSeconds(seconds) {
        const time = FrameSDK.formatSeconds3(seconds);
        return time.hour + time.minute + time.second;
    }

    static closeEffect(target, done) {
        if (target.black_sprite) {
            cc.tween(target.black_sprite.node).delay(0.06).to(0.24, {
                opacity: 0
            }).start();
        }
        if (target.noTouch) {
            target.noTouch.node.active = true;
        }
        if (null != target.panel_window) {
            target.panel_window.stopActionByTag(9029);
            let position = target.panel_window.position;
            let duration = 0.3;
            if (target._close_target) {
                duration = 0.5;
                position = target._close_target.convertToWorldSpaceAR(cc.v2());
                position = target.panel_window.parent.convertToNodeSpaceAR(position);
            }
            cc.tween(target.panel_window).to(duration, {
                scale: 0.1,
                opacity: 100,
                position: position
            }, {
                easing: "backIn"
            }).tag(9029).call(function () {
                if (done) {
                    done();
                }
                target.node.destroy();
            }).start();
        } else {
            if (!cc.isValid(target.node)) {
                console.error("cc.isValid(target.node)", target.node);
                return;
            }
            target.node.stopActionByTag(9029);
            cc.tween(target.node).tag(9029).call(function () {
                if (done) {
                    done();
                }
            }).removeSelf().start();
        }
    }

    static addFlagListen(callback, target) {
        cc.director.on(FrameSDK.frameData.ListenKeys.FRESH_FLAG, callback, target);
    }

    static hasPopUp() {
        return !FrameSDK.frameData.gameData.noProfitAd && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.charityLevel && FrameData.saveData.charityGuideIndex <= 0 || null === FrameData.saveData.activity && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.bankLevel || null == FrameData.saveData.lvAwardinfo && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.taskLevel || null == FrameData.saveData.superReward && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.superRewardLevel;
    }

    static addCountryListen(callback, target) {
        cc.director.on("CHANGE_COUNTRY", callback, target);
    }

    static addBitCoin(a, b, c, d, e) {
        cc.director.emit("ADD_BIT_COIN", a, b, c, d, e);
    }

    static getCountry_Language(languageCode) {
        const country = function (raw) {
            const hash = raw.indexOf("#");
            raw = raw.substring(0, -1 == hash ? raw.length : hash);
            const parts = raw.split(-1 != raw.indexOf("_") ? "_" : "-");
            for (let i = parts.length - 1; i >= 0; i--) {
                if ("" == parts[i]) {
                    parts.splice(i, 1);
                }
            }
            let parsed: any = {
                lang: parts[0],
                country: "SBALL"
            };
            if (parts.length > 1) {
                parsed = {
                    lang: parts[0],
                    country: parts[parts.length - 1]
                };
            }
            const list = FrameData.SDK_CONF.COUNTRY_LIST;
            for (let i = 0; i < list.length; i++) {
                if (parsed.country.toLowerCase() == list[i].country.toLowerCase()) {
                    return list[i];
                }
            }
            parsed = {
                lang: "en",
                country: "SBALL"
            };
            for (let i = 0; i < list.length; i++) {
                if (parsed.country.toLowerCase() == list[i].country.toLowerCase()) {
                    return list[i];
                }
            }
            return list[0];
        }(languageCode);
        FrameData.myCountry = country.country;
        FrameData.countryIndex = country.ad_t - 1;
        FrameData.CountryConf = country;
        FrameSDK.frameData.gameData.myLanguge = country.language;
        console.log("getCountry_Language", languageCode, FrameData.myCountry, FrameSDK.frameData.gameData.myLanguge);
    }

    static _getOnceEventCacheKey(eventName, data) {
        return eventName + "-" + data.object_action + "-" + (data.object_name != null ? data.object_name : "") + "-" + (data.object_notes != null ? data.object_notes : "");
    }

    @CLICKLOCK()
    static openVideo(placement, fromInters, onStart, onEnd, onInterrupt, webData) {
        const self = this;
        FrameSDK.frameData.sdkFuc.beforeOpenVideo(function (allowed) {
            if (allowed) {
                if (FrameData.SDK_CONF.NO_VIDEO || !FrameSDK.frameData) {
                    console.log("skip video");
                    self._lastVideoEndTime = Date.now();
                    self._playingAD = false;
                    if (onStart != null) {
                        onStart("video");
                    }
                    if (onEnd != null) {
                        onEnd(true, "video");
                    }
                } else {
                    self._playingAD = true;
                    FrameSDK.frameData.gameFuc.openLoad();
                    const deadline = FrameSDK.now + FrameData.SDK_CONF.videoRetryTime;
                    const tryOpen = function () {
                        if (FrameSDK.frameData.sdkFuc.isReadyVideo()) {
                            FrameSDK.frameData.sdkFuc.openVideo(placement, function (event) {
                                console.log("video event - " + EVideoEvent[event]);
                                switch (event) {
                                    case EVideoEvent.END:
                                        self._lastVideoEndTime = Date.now();
                                        self._playingAD = false;
                                        FrameSDK.frameData.gameFuc.closeLoad();
                                        cc.director.emit(FrameSDK.frameData.ListenKeys.VIDEO_SUC);
                                        if (onEnd != null) {
                                            onEnd(true, "video");
                                        }
                                        break;
                                    case EVideoEvent.INTERRUPT:
                                        self._playingAD = false;
                                        FrameSDK.frameData.gameFuc.closeLoad();
                                        if (onInterrupt != null) {
                                            onInterrupt();
                                        }
                                        break;
                                    case EVideoEvent.FAIL:
                                        self._playingAD = false;
                                        FrameSDK.frameData.gameFuc.closeLoad();
                                        if (fromInters) {
                                            if (webData) {
                                                console.log("interstitial to video failed, try web");
                                                self.openWeb(webData, onStart, onEnd, onInterrupt);
                                            } else if (onEnd != null) {
                                                onEnd(false);
                                            }
                                        } else {
                                            console.log("video failed, try interstitial");
                                            self.openInters(placement, true, onStart, onEnd, onInterrupt, webData);
                                        }
                                        break;
                                    case EVideoEvent.START:
                                        FrameSDK.frameData.gameFuc.closeLoad();
                                        FrameSDK.frameData.sdkFuc.earlierStageEvent("ad_success");
                                        FrameSDK.logLiftEvent("first_ad");
                                        if (onStart != null) {
                                            onStart("video");
                                        }
                                }
                            });
                        } else if (FrameSDK.now <= deadline) {
                            setTimeout(function () {
                                return tryOpen();
                            }, 300);
                        } else {
                            self._playingAD = false;
                            FrameSDK.frameData.gameFuc.closeLoad();
                            if (fromInters) {
                                if (webData) {
                                    console.log("interstitial to video failed, try web");
                                    self.openWeb(webData, onStart, onEnd, onInterrupt);
                                } else if (onEnd != null) {
                                    onEnd(false);
                                }
                            } else {
                                console.log("video failed, try interstitial");
                                self.openInters(placement, true, onStart, onEnd, onInterrupt, webData);
                            }
                        }
                    };
                    tryOpen();
                }
            } else if (onInterrupt != null) {
                onInterrupt();
            }
        });
    }

    static getFirstRedeemRequirement() {
        return FrameData.getCoinConf(1);
    }

    public static async loadPrefab(name: string, callback: (node: cc.Node) => void, showLoad: boolean = true, dir: string = "Prefab/"): Promise<void> {
        if (showLoad) {
            FrameSDK.frameData.gameFuc.openLoad();
        }
        cc.assetManager.getBundle("Frame").load(dir + name, cc.Prefab, function (err, prefab) {
            if (showLoad) {
                FrameSDK.frameData.gameFuc.closeLoad();
            }
            if (prefab) {
                callback(cc.instantiate(prefab));
            } else {
                console.error(err);
            }
        });
    }

    static logLiftEvent(eventName) {
        let name = eventName;
        if ("finish_task" === name) {
            if (1 == ++FrameData.saveData.wwyFinishTaskCount) {
                FrameSDK.frameData.sdkFuc.lifeEvent("submit_order");
            }
            name = "finish_task_" + FrameData.saveData.wwyFinishTaskCount;
        }
        if (!FrameData.saveData.wwyLifeEventRecord[name]) {
            FrameSDK.frameData.sdkFuc.lifeEvent(name);
            FrameData.saveData.wwyLifeEventRecord[name] = true;
        }
    }

    static addQueueUp(id, data = {}) {
        FrameData.saveData.QueueUp[id] = data;
        FrameSDK.updataTimeQueueUp();
    }

    static formatSeconds3(seconds) {
        if (seconds <= 0) {
            seconds = 0;
        }
        const pad = function (value) {
            return Number(value).toString().length < 2 ? "0" + value : value.toString();
        };
        let remain = parseInt(seconds + "") <= 0 ? 0 : parseInt(seconds + "");
        let hour = 0;
        let minute = 0;
        if (remain >= 60) {
            hour = parseInt((remain / 3600).toString());
            minute = parseInt((remain % 3600 / 60).toString());
            remain = parseInt((remain % 60).toString());
        }
        return {
            hour: pad(hour),
            minute: pad(minute),
            second: pad(remain)
        };
    }

    static getI18n() {
        return this.i18n != null ? this.i18n : i18;
    }

    static hiddenBanner() {
        FrameSDK.frameData.sdkFuc.hiddenBanner();
    }

    static addCoin(coin, charity, flag, done?) {
        cc.director.emit("ADD_COIN", coin, charity, flag, done);
    }

    static initSettings(settings) {
        FrameData.configs = settings;
        const basic = (settings != null ? settings.basicConfig : undefined) || {};
        for (const key in basic.SDK_CONF) {
            FrameData.SDK_CONF[key] = basic.SDK_CONF[key];
        }
        for (const key in basic.FRAME_CONF) {
            FrameData.FRAME_CONF[key] = basic.FRAME_CONF[key];
        }
        const countryCode = FrameSDK.frameData.sdkFuc.countryCode.toUpperCase();
        const localConf = basic.LOCAL_CONF != null ? basic.LOCAL_CONF[countryCode] : undefined;
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

    static convertCoinToStr(value, withSymbol = false) {
        return this.formatNumber(value, withSymbol ? 2 : 0, withSymbol ? FrameData.FRAME_CONF.RedeemRateConfig[0] : 0);
    }

    static openWindow(name, viewData = {}, parent?) {
        FrameSDK.loadPrefab(name, function (node) {
            const item = cc.instantiate(node);
            (item.getComponent(name) as any).viewData = viewData;
            item.parent = parent || FrameSDK.Panel;
        });
    }

    static debugChangeBankTime(seconds) {
        if (Panel_Activity.isActivityCollectable()) {
            seconds = Math.max(0, seconds);
            FrameData.saveData.activity.time = FrameSDK.now + seconds;
        }
    }

    static formatNumber(value, digits = 0, rate = 0) {
        digits = Math.max(0, Math.floor(digits));
        if (rate > 0) {
            value = value / rate * FrameData.CountryConf.rate;
        }
        const text = value.toString();
        const parts = text.split(".");
        if (digits <= 0) {
            parts.length = 1;
        } else if (parts.length > 1) {
            parts[1] = parts[1].substring(0, digits);
        }
        const sign = text.startsWith("+") || text.startsWith("-") ? parts[0].substring(0, 1) : "";
        parts[0] = parts[0].substring(sign.length);
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return "" + sign + (rate > 0 ? FrameData.CountryConf.symbol : "") + parts.join(".");
    }

    static logGameEvent(eventName, data, once = false) {
        if (!once || !this._isOnceEventLogged(eventName, data)) {
            const payload: any = {
                object_action: data.object_action
            };
            if (null !== data.object_name && undefined !== data.object_name) {
                payload.object_name = data.object_name;
            }
            if (null !== data.object_notes && undefined !== data.object_notes) {
                payload.object_notes = data.object_notes;
            }
            FrameSDK.frameData.sdkFuc.logGameEvent(eventName, payload, once);
            if (once) {
                const key = this._getOnceEventCacheKey(eventName, data);
                FrameData.saveData.onceEventRecord[key] = true;
            }
        }
    }

    static onlineTimeUpdate() {
        if (!FrameSDK.ONLINE_TIME) {
            FrameSDK.ONLINE_TIME = setInterval(function () {
                FrameSDK.resetNextData();
                FrameSDK.updataTimeQueueUp();
            }, 1000);
        }
    }

    static openPanel_Yellow() {
        FrameSDK.loadPrefab("RDM_Level", function (node) {
            cc.instantiate(node).parent = FrameSDK.Panel;
        });
    }

    static convertCharityToStr(value, withSymbol = false) {
        return this.formatNumber(value, withSymbol ? 2 : 0, withSymbol ? FrameData.FRAME_CONF.RedeemRateConfig[1] : 0);
    }

    static addCreditListen(callback, target) {
        cc.director.on("FRESH_CREDIT", callback, target);
    }

    static addi18nArray(data) {
        if (this.i18n) {
            this.i18n.addi18nArray(data);
        } else {
            i18.init(data, null, FrameData.SDK_CONF.COUNTRY_LIST);
        }
    }

    static openEffect(target, options?, done?) {
        if (!target.black_sprite) {
            target.black_sprite = new cc.Node(target.node.name + "_black_sprite").addComponent(cc.Sprite);
            target.black_sprite.node.addComponent(cc.BlockInputEvents);
            target.black_sprite.node.color = cc.Color.BLACK;
            target.black_sprite.node.zIndex = -1;
            target.node.addChild(target.black_sprite.node);
            cc.assetManager.getBundle("Frame").load("internal/image/default_editbox_bg", cc.SpriteFrame, function (err, spriteFrame) {
                target.black_sprite.spriteFrame = spriteFrame;
                target.black_sprite.node.width = cc.winSize.width + 200;
                target.black_sprite.node.height = cc.winSize.height + 200;
            });
            target.noTouch = new cc.Node(target.node.name + "_noTouch").addComponent(cc.BlockInputEvents);
            target.noTouch.node.setContentSize(cc.winSize.width + 200, cc.winSize.height + 200);
            target.node.addChild(target.noTouch.node);
        }
        if (target.black_sprite) {
            target.black_sprite.node.opacity = 0;
        }
        if (target.black_sprite) {
            const opacity = options != null ? options.opacity : undefined;
            cc.tween(target.black_sprite.node).to(0.2, {
                opacity: opacity != null ? opacity : 204
            }).start();
        }
        if (null != target.panel_window) {
            target.panel_window.stopActionByTag(4660);
            target.panel_window.scale = 0.1;
            target.panel_window.opacity = 255;
            cc.tween(target.panel_window).parallel(cc.tween().delay(0.01).call(function () {
                if (done) {
                    done();
                }
                target.noTouch.node.active = false;
            }), cc.tween().to(0.25, {
                scale: 1,
                opacity: 255
            }, {
                easing: "backOut"
            })).tag(4660).start();
        } else {
            target.node.stopActionByTag(4660);
            cc.tween(target.node).tag(4660).call(function () {
                if (done) {
                    done();
                }
                target.noTouch.node.active = false;
            }).start();
        }
    }

    static randomIntNum(min, max) {
        return parseInt(Math.random() * (max - min + 1) + min + "", 10);
    }

    @CLICKLOCK()
    static openWeb(data, onStart, onEnd, onInterrupt) {
        const self = this;
        if (!FrameData.SDK_CONF.NO_VIDEO && FrameSDK.frameData) {
            if (!FrameSDK.frameData.gameData.noProfitAd && FrameData.FRAME_CONF.adAlternateEnabled) {
                const record = FrameData.saveData.adAlternate;
                const candidates = [];
                const country = FrameData.myCountry.toUpperCase();
                let weight = 0;
                const configs = FrameData.FRAME_CONF.AdAlternateConfig;
                for (let i = 0; i < configs.length; i++) {
                    const config = configs[i];
                    const zoneMiss = config.fill_zone.length > 0 && config.fill_zone.findIndex(function (item) {
                        return item.toUpperCase() === country;
                    }) < 0;
                    const banned = config.fill_ban.length > 0 && config.fill_ban.findIndex(function (item) {
                        return item.toUpperCase() === country;
                    }) >= 0;
                    if (!(zoneMiss || banned)) {
                        const total = record.totalComplete[config.fill_id] != null ? record.totalComplete[config.fill_id] : 0;
                        const today = record.todayComplete[config.fill_id] != null ? record.todayComplete[config.fill_id] : 0;
                        if (!(total >= config.fill_total || today >= config.fill_daily)) {
                            candidates.push(config);
                            weight += config.fill_wgt;
                        }
                    }
                }
                let roll = Math.random() * weight;
                let picked = null;
                for (let i = 0; i < candidates.length; i++) {
                    const config = candidates[i];
                    if (roll < config.fill_wgt) {
                        picked = config;
                        break;
                    }
                    roll -= config.fill_wgt;
                }
                if (picked == null) {
                    if (onEnd != null) {
                        onEnd(false);
                    }
                } else {
                    FrameSDK.openWindow("Panel_AdAlternate", {
                        id: picked.fill_id,
                        time: picked.fill_time,
                        url: picked.fill_url,
                        reward: data.reward,
                        isMax: data.isMax,
                        startCallback: function () {
                            FrameSDK.frameData.sdkFuc.earlierStageEvent("ad_success");
                            FrameSDK.logLiftEvent("first_ad");
                            if (onStart != null) {
                                onStart("web");
                            }
                        },
                        cancelCallback: function () {
                            if (onInterrupt == null) {
                                return undefined;
                            }
                            return onInterrupt();
                        },
                        endCallback: function (success) {
                            if (success) {
                                self._lastVideoEndTime = Date.now();
                                const adAlternate = FrameData.saveData.adAlternate;
                                adAlternate.todayComplete[picked.fill_id] = (adAlternate.todayComplete[picked.fill_id] != null ? adAlternate.todayComplete[picked.fill_id] : 0) + 1;
                                adAlternate.totalComplete[picked.fill_id] = (adAlternate.totalComplete[picked.fill_id] != null ? adAlternate.totalComplete[picked.fill_id] : 0) + 1;
                                FrameData.saveData.adAlternate = adAlternate;
                            }
                            if (onEnd != null) {
                                onEnd(success, "web");
                            }
                        }
                    });
                }
            } else if (onEnd != null) {
                onEnd(false);
            }
        } else {
            console.log("skip web");
            this._lastVideoEndTime = Date.now();
            if (onEnd != null) {
                onEnd(true, "web");
            }
        }
    }

    static onAppLifecycleChange(show) {
        if (!this._playingAD && FrameData.SDK_CONF.splashEnabled) {
            const scene = cc.director.getScene();
            const splash = scene != null ? scene.getChildByName("__FRAME_SPLASH__") : undefined;
            if (show) {
                this._appHideTime = Date.now();
                if (!splash) {
                    return;
                }
                splash.zIndex = cc.macro.MAX_ZINDEX;
                splash.active = true;
                cc.director.emit("SHOW_SPLASH");
            } else {
                if (!splash) {
                    return;
                }
                splash.zIndex = cc.macro.MAX_ZINDEX;
                splash.active = true;
                cc.director.emit("SHOW_SPLASH");
                const interval = 1000 * (FrameData.SDK_CONF.splashShowInterval != null ? FrameData.SDK_CONF.splashShowInterval : 30);
                if ("loading" === FrameSDK.frameData.gameData.currentScene || null === this._appHideTime || undefined === this._appHideTime || Date.now() - this._appHideTime < interval) {
                    splash.active = false;
                    cc.director.emit("HIDE_SPLASH");
                    return;
                }
                FrameSDK.logGameEvent("thepool_sad", {
                    object_action: "show",
                    object_name: "sad_show",
                    object_notes: "hot"
                });
                if (!FrameSDK.frameData.sdkFuc.isSplashReady()) {
                    FrameSDK.logGameEvent("thepool_sad", {
                        object_action: "show",
                        object_name: "sad_fail",
                        object_notes: "hot"
                    });
                    splash.active = false;
                    cc.director.emit("HIDE_SPLASH");
                    return;
                }
                FrameSDK.frameData.sdkFuc.openSplash(function (event) {
                    if (event === EVideoEvent.END || event === EVideoEvent.FAIL) {
                        FrameSDK.logGameEvent("thepool_sad", {
                            object_action: "show",
                            object_name: event === EVideoEvent.FAIL ? "sad_fail" : "sad_succ",
                            object_notes: "hot"
                        });
                        splash.active = false;
                        cc.director.emit("HIDE_SPLASH");
                    }
                });
            }
        }
    }

    @CLICKLOCK()
    static openInters(placement, fromVideo, onStart, onEnd, onInterrupt, webData) {
        const self = this;
        if (FrameData.SDK_CONF.NO_VIDEO || !FrameSDK.frameData) {
            console.log("skip interstitial");
            this._lastVideoEndTime = Date.now();
            this._playingAD = false;
            if (onStart != null) {
                onStart("interstitial");
            }
            if (onEnd != null) {
                onEnd(true, "interstitial");
            }
        } else {
            this._playingAD = true;
            FrameSDK.frameData.gameFuc.openLoad();
            FrameSDK.frameData.sdkFuc.openInters(placement, function (event) {
                console.log("interstitial event - " + EVideoEvent[event]);
                switch (event) {
                    case EVideoEvent.END:
                        self._lastVideoEndTime = Date.now();
                        self._playingAD = false;
                        FrameSDK.frameData.gameFuc.closeLoad();
                        cc.director.emit(FrameSDK.frameData.ListenKeys.VIDEO_SUC);
                        if (onEnd != null) {
                            onEnd(true, "interstitial");
                        }
                        break;
                    case EVideoEvent.INTERRUPT:
                        self._playingAD = false;
                        FrameSDK.frameData.gameFuc.closeLoad();
                        if (onInterrupt != null) {
                            onInterrupt();
                        }
                        break;
                    case EVideoEvent.FAIL:
                        self._playingAD = false;
                        FrameSDK.frameData.gameFuc.closeLoad();
                        if (fromVideo) {
                            if (webData) {
                                console.log("video to interstitial failed, try web");
                                self.openWeb(webData, onStart, onEnd, onInterrupt);
                            } else if (onEnd != null) {
                                onEnd(false);
                            }
                        } else {
                            console.log("interstitial failed, try video");
                            self.openVideo(placement, true, onStart, onEnd, onInterrupt, webData);
                        }
                        break;
                    case EVideoEvent.START:
                        FrameSDK.frameData.gameFuc.closeLoad();
                        FrameSDK.frameData.sdkFuc.earlierStageEvent("ad_success");
                        FrameSDK.logLiftEvent("first_ad");
                        if (onStart != null) {
                            onStart("interstitial");
                        }
                }
            });
        }
    }

    static playEffect(name) {
        if (null == FrameSDK.soundList[name]) {
            cc.assetManager.getBundle("Frame").load("Sound/" + name, cc.AudioClip, function (err, clip) {
                if (clip) {
                    FrameSDK.soundList[name] = clip;
                    return FrameSDK.playEffect(name);
                }
                cc.warn("没有这个音效", name);
            });
        } else if (FrameSDK.frameData.gameData.isSound) {
            return cc.audioEngine.playEffect(FrameSDK.soundList[name], false);
        }
    }

    static showToast(text) {
        FrameSDK.loadPrefab("Panel_Toast", function (node) {
            const item = cc.instantiate(node);
            item.getComponent(RDM_Toast).text = text;
            item.parent = FrameSDK.Panel;
        });
    }

    static getDateDay(seconds) {
        const date = new Date(1000 * seconds);
        const year = date.getFullYear() + "";
        const month = date.getMonth() + 1 > 9 ? String(date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        const day = date.getDate() > 9 ? String(date.getDate()) : "0" + date.getDate();
        return parseInt(year + month + day);
    }

    static addNewHandFinishListen(callback, target) {
        cc.director.on("NEW_HAND_FINISH", callback, target);
    }

    static getRandomInviteCode() {
        const suffix = Math.ceil(10000 * Math.random()) + "**";
        const letters = Array.from({
            length: 26
        }, function (item, index) {
            return String.fromCharCode(65 + index);
        });
        return letters[Math.floor(Math.random() * letters.length)] + suffix;
    }

    static initSplash(done) {
        cc.director.off(FrameSDK.frameData.ListenKeys.APP_LIFECYCLE_CHANGE, this.onAppLifecycleChange, this);
        if (FrameData.SDK_CONF.NO_SPLASH) {
            if (done != null) {
                done();
            }
        } else {
            cc.director.on(FrameSDK.frameData.ListenKeys.APP_LIFECYCLE_CHANGE, this.onAppLifecycleChange, this);
            const scene = cc.director.getScene();
            if (scene) {
                if (scene.getChildByName("__FRAME_SPLASH__")) {
                    if (done != null) {
                        done();
                    }
                } else {
                    cc.assetManager.getBundle("Frame").load("Prefab/Splash", cc.Prefab, function (err, prefab) {
                        if (prefab) {
                            const splash = cc.instantiate(prefab);
                            splash.name = "__FRAME_SPLASH__";
                            splash.active = false;
                            scene.addChild(splash, cc.macro.MAX_ZINDEX);
                            cc.game.addPersistRootNode(splash);
                        } else {
                            const message = err != null ? err.message : undefined;
                            console.error("failed to load splash: " + (message != null ? message : "unknown reason"));
                        }
                        if (done != null) {
                            done();
                        }
                    });
                }
            } else {
                console.error("scene not found");
                if (done != null) {
                    done();
                }
            }
        }
    }

    static openRating(done) {
        if (0 == FrameData.saveData.isRating && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.ratingLevel) {
            if (0 == FrameData.SDK_CONF.GradeState || FrameData.saveData.openRatingInedx > 3) {
                if (done != null) {
                    done();
                }
                return;
            }
            FrameSDK.openGradeNum++;
            if (FrameData.saveData.openRatingInedx > 0 && FrameSDK.openGradeNum % FrameData.FRAME_CONF.intervalGrade != 0) {
                if (done != null) {
                    done();
                }
                return;
            }
            FrameSDK.openWindow("Panel_Rating", {
                closeCB: done
            });
        } else if (done != null) {
            done();
        }
    }

    static setLan(languageCode) {
        FrameSDK.getCountry_Language(languageCode);
        (this.i18n != null ? this.i18n : i18).setLanguage(languageCode);
    }

    static debugAddBankCoin(amount) {
        if (0 !== amount) {
            Panel_Activity.addCoin(amount);
        }
    }

    static openPanel_Charity() {
        FrameSDK.loadPrefab("RDM_Charity", function (node) {
            cc.instantiate(node).parent = FrameSDK.Panel;
        });
    }

    static initCocosAmend() {
        const self = this;
        cc.director.on(FrameSDK.frameData.ListenKeys.FRESH_STRING, function () {
            (self.i18n != null ? self.i18n : i18).updataString();
        });
        const root: any = cc;
        const webViewProto: any = cc.WebView.prototype;
        if (!root.__$_WebView_onEnable_$__) {
            root.__$_WebView_onEnable_$__ = webViewProto.onEnable;
            webViewProto.onEnable = function () {
                const view = this;
                root.__$_WebView_onEnable_$__.call(this);
                if (!this.__splashEventListened) {
                    cc.director.on("SHOW_SPLASH", function () {
                        if (view.node) {
                            if (null === view.__scaleX || undefined === view.__scaleX) {
                                view.__scaleX = view.node.scaleX;
                                view.node.scaleX = 0;
                            }
                            if (null === view.__scaleY || undefined === view.__scaleY) {
                                view.__scaleY = view.node.scaleY;
                                view.node.scaleY = 0;
                            }
                        }
                    });
                    cc.director.on("HIDE_SPLASH", function () {
                        if (view.node) {
                            if (null !== view.__scaleX && undefined !== view.__scaleX) {
                                view.node.scaleX = view.__scaleX;
                                view.__scaleX = undefined;
                            }
                            if (null !== view.__scaleY && undefined !== view.__scaleY) {
                                view.node.scaleY = view.__scaleY;
                                view.__scaleY = undefined;
                            }
                        }
                    });
                    this.__splashEventListened = true;
                }
            };
        }
    }

    static logCommonEvent(eventName, data = null) {
        FrameSDK.frameData.sdkFuc.logCommonEvent(eventName, data);
    }

    static getNodeTexture(nodes, parent?) {
        if (nodes instanceof cc.Node) {
            nodes = [nodes];
        }
        const cameraNode = new cc.Node();
        cameraNode.parent = parent || cc.find("Canvas");
        const camera = cameraNode.addComponent(cc.Camera);
        camera.cullingMask = 4294967295;
        camera.depth = 2;
        camera.alignWithScreen = true;
        const texture = new cc.RenderTexture();
        texture.initWithSize(cc.winSize.width, cc.winSize.height, cc.RenderTexture.DepthStencilFormat.RB_FMT_S8);
        camera.targetTexture = texture;
        for (let i = 0; i < nodes.length; i++) {
            camera.render(nodes[i]);
        }
        cameraNode.removeFromParent(true);
        cameraNode.destroy();
        const spriteFrame = new cc.SpriteFrame(texture);
        spriteFrame.setFlipY(true);
        return spriteFrame;
    }

    static getRes(path, type, callback) {
        const cached = cc.assetManager.getBundle("Frame").get("res/" + path, type);
        if (cached) {
            if (callback) {
                callback(cached);
            }
        } else {
            cc.assetManager.getBundle("Frame").load("res/" + path, type, function (err, asset) {
                if (callback) {
                    callback(asset);
                }
            });
        }
    }

    static showWebView(node: cc.Node) {
        const scene = cc.director.getScene();
        let webNode = scene.getChildByName("__Frame_web_view__");
        if (!webNode) {
            webNode = new cc.Node("__Frame_web_view__");
            scene.addChild(webNode, cc.macro.MAX_ZINDEX);
            webNode.setParent(scene);
        }
        if (!cc.game.isPersistRootNode(webNode)) {
            cc.game.addPersistRootNode(webNode);
        }
        webNode.active = true;
        const world = node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        const local = webNode.parent.convertToNodeSpaceAR(world);
        webNode.position = local;
        webNode.setAnchorPoint(node.anchorX, node.anchorY);
        webNode.setContentSize(node.width, node.height);
        const existing = webNode.getComponent(cc.WebView);
        return existing != null ? existing : webNode.addComponent(cc.WebView);
    }
}

cc.js.setClassName("FrameSDK", FrameSDK);
