import { FrameSDK } from "./FrameSDK";

class FrameSaveData {
    corrected: boolean = false;
    credit: any = {
        yellowCoin: 0,
        greenCoin: 0
    };
    historyCredit: any = {
        pp: 0,
        am: 0
    };
    loginDays: number = 1;
    date_day: any = null;
    online_total: number = 0;
    onceEventRecord: any = {};
    wwyLifeEventRecord: any = {};
    wwyFinishTaskCount: number = 0;
    wwylifeCycleData: any = {};
    isRating: any = false;
    openRatingInedx: number = 0;
    guideInedx: number = 0;
    freeInedx: number = 0;
    charityGuideIndex: number = 0;
    CashVideoCount: number = 0;
    QueueUp: any = {};
    CharityQueueUp: any = {};
    lvAwardinfo: any = null;
    nextData: any = {
        WallTabLinkNum: {},
        listShow_Final: {},
        listClick_Final: {},
        listOnline_Final: {},
        freezeList_Final: [],
        listShow_Final_New: {},
        listClick_Final_New: {}
    };
    account: string = "";
    paymentID: number = -1;
    CoinStep: any[] = [];
    CharityStep: any[] = [];
    activity: any = null;
    skipADCount: number = 0;
    preAwardType: number = -1;
    firstRandomAward: boolean = true;
    award5: any = null;
    freeSuperAward: boolean = true;
    charityDonated: number = 0;
    charityDonateTime: number = 0;
    flyingBonusIndex: number = -1;
    superReward: any = null;
    adAlternate: any = null;

    constructor() {
        const stored = FrameSaveData.getStorageItem("FrameData", null, {});
        for (const key in stored) {
            this[key] = stored[key];
        }
        cc.game.on(cc.game.EVENT_HIDE, function () {
            FrameSaveData.setlocalStorageItem(null, FrameData.saveData, "FrameData");
        });
    }

    static setlocalStorageItem(key, value, storageKey) {
        if (null == value) {
            value = {};
        }
        let stored = this.getlocalStorageItem(undefined, storageKey);
        if (key) {
            if (null == stored || "" == stored) {
                stored = {};
            }
            stored[key] = value;
        } else {
            stored = value;
        }
        cc.sys.localStorage.setItem(storageKey || "FrameData", JSON.stringify(stored));
    }

    static getlocalStorageItem(key, storageKey) {
        const raw = cc.sys.localStorage.getItem(storageKey || "FrameData");
        if (raw && key && "" != raw) {
            return JSON.parse(raw)[key];
        }
        if (null != raw && "" != raw) {
            try {
                return JSON.parse(raw);
            } catch (e) {
                return raw;
            }
        }
        return null;
    }

    static getStorageItem(storageKey, key, fallback) {
        const stored = this.getlocalStorageItem(key, storageKey);
        if (stored) {
            return stored;
        }
        this.setlocalStorageItem(key, fallback, storageKey);
        return fallback;
    }
}

export class FrameData {
    static get toolKey() {
        return FrameSDK.frameData && FrameSDK.frameData.isDeBug ? FrameData.SDK_CONF.DEBUG_KEY : FrameData.SDK_CONF.RELEASE_KEY;
    }

    static get credit() {
        return FrameData.saveData.credit.yellowCoin;
    }

    static get charityCredit() {
        return FrameData.saveData.credit.greenCoin;
    }

    static getOutputConfig(firstAward) {
        let rate = FrameSDK.randomInt(FrameData.FRAME_CONF.OutputConfig.adRate);
        if (firstAward && FrameData.saveData.firstRandomAward) {
            FrameData.saveData.firstRandomAward = false;
            rate = FrameData.FRAME_CONF.OutputConfig.adRate[1];
        }
        return {
            isFree: FrameSDK.frameData.gameData.noProfitAd || FrameSDK.frameData.gameData.passLevel < FrameData.FRAME_CONF.abAdStartLevel,
            ml: rate,
            range: FrameData.FRAME_CONF.OutputConfig.adRate,
            displayRange: FrameData.FRAME_CONF.OutputConfig.adDisplayRate
        };
    }

    static updateNewBallConfig(config) {
        config && "object" == typeof config && config.GAME_CONF;
    }

    static getTargetCoint(id, amount) {
        const target = FrameData.FRAME_CONF.RedeemTargetConfig;
        const step = FrameData.FRAME_CONF.RedeemRateConfig[0] * target.factor;
        return Math.ceil(amount / step) * target.ratio * step + target.extra;
    }

    static getExchangeStatus(id) {
        if (FrameData.saveData.QueueUp[id]) {
            return 5;
        }
        if (null == FrameData.saveData.CoinStep[id]) {
            FrameData.saveData.CoinStep[id] = {
                status: 1,
                targetCoin: null
            };
            FrameSDK.logGameEvent("thepool_game_rdm", {
                object_action: "show",
                object_name: "rdm_1_start",
                object_notes: "redeem_" + id
            }, true);
        }
        return FrameData.saveData.CoinStep[id].status;
    }

    static getCoinConf(id) {
        let conf = FrameData.FRAME_CONF.CoinConf[0];
        for (let i = 0; i < FrameData.FRAME_CONF.CoinConf.length; i++) {
            if (FrameData.FRAME_CONF.CoinConf[i].rdm_id == id) {
                conf = FrameData.FRAME_CONF.CoinConf[i];
                break;
            }
        }
        return conf;
    }

    static getCoinOutNum(key) {
        return FrameData.FRAME_CONF.OutputConfig[key];
    }

    static getCharityOutNum() {
        let matched;
        const owned = FrameData.saveData.credit.greenCoin;
        const list = FrameData.FRAME_CONF.charityOutput;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (owned < item.have[1]) {
                matched = item;
                break;
            }
        }
        if (!matched) {
            matched = FrameData.FRAME_CONF.charityOutput[FrameData.FRAME_CONF.charityOutput.length - 1];
        }
        return FrameSDK.randomInt(matched.value);
    }

    static getCharityConf(id) {
        let conf = FrameData.FRAME_CONF.CharityConf[0];
        for (let i = 0; i < FrameData.FRAME_CONF.CharityConf.length; i++) {
            if (FrameData.FRAME_CONF.CharityConf[i].rdm_id == id) {
                conf = FrameData.FRAME_CONF.CharityConf[i];
                break;
            }
        }
        return conf;
    }

    static getCharityExchangeStatus(id) {
        if (FrameData.saveData.CharityQueueUp[id]) {
            return 4;
        }
        if (null == FrameData.saveData.CharityStep[id]) {
            FrameData.saveData.CharityStep[id] = {
                status: 1
            };
        }
        FrameSDK.logGameEvent("thepool_game_rdm", {
            object_action: "show",
            object_name: "rdm2_1_start",
            object_notes: "redeem_" + id
        }, true);
        return FrameData.saveData.CharityStep[id].status;
    }

    static saveData = new Proxy(new FrameSaveData(), {
        get: function (target, key) {
            return target[key];
        },
        set: function (target, key, value) {
            const ok = Reflect.set(target, key, value);
            if (ok) {
                FrameSaveData.setlocalStorageItem(null, FrameData.saveData, "FrameData");
            }
            return ok;
        }
    });

    static isTest = false;
    static countryIndex = 2;
    static myCountry = "US";
    static CountryConf = {
        id: 101,
        name: "美国",
        country: "US",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
    };
    static configs = null;
    static SDK_CONF = {
          DEBUG_KEY: "114159",
          RELEASE_KEY: "",
          EMAIL: "light@out.net",
          GradleUrl: "https://play.google.com/store/apps/details?id=com.relating.singles.creation",
          NO_VIDEO: false,
          isLOG: false,
          isShowBanner: true,
          "//": " GradeState 评星状态  0 关闭  1开启",
          GradeState: 1,
          videoRetryTime: 3,
          NO_SPLASH: false,
          splashWaitInterval: 3,
          splashShowInterval: 3,
          splashEnabled: false,
          COUNTRY_LIST: [{
            id: 101,
            name: "美国",
            country: "US",
            language: "en",
            rate: 1,
            symbol: "$",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 102,
            name: "英国",
            country: "GB",
            language: "en",
            rate: 1,
            symbol: "￡",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 103,
            name: "法国",
            country: "FR",
            language: "fr",
            rate: 1,
            symbol: "€",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 104,
            name: "德国",
            country: "DE",
            language: "de",
            rate: 1,
            symbol: "€",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 105,
            name: "日本",
            country: "JP",
            language: "ja",
            rate: 100,
            symbol: "円",
            ad_t: 1,
            cash_id: [122, 126, 101, 103]
          }, {
            id: 106,
            name: "加拿大",
            country: "CA",
            language: "en",
            rate: 1,
            symbol: "$",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 107,
            name: "澳大利亚",
            country: "AU",
            language: "en",
            rate: 1,
            symbol: "$",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 108,
            name: "新西兰",
            country: "NZ",
            language: "en",
            rate: 1,
            symbol: "$",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 109,
            name: "挪威",
            country: "NO",
            language: "no",
            rate: 10,
            symbol: "NOK",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 110,
            name: "新加坡",
            country: "SG",
            language: "en",
            rate: 1,
            symbol: "$",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 111,
            name: "瑞典",
            country: "SE",
            language: "se",
            rate: 10,
            symbol: "SEK",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 112,
            name: "瑞士",
            country: "CH",
            language: "de",
            rate: 1,
            symbol: "CHF",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 201,
            name: "西班牙",
            country: "ES",
            language: "es",
            rate: 1,
            symbol: "€",
            ad_t: 2,
            cash_id: [113, 111, 101, 103]
          }, {
            id: 202,
            name: "阿拉伯",
            country: "SA",
            language: "ar",
            rate: 5,
            symbol: "SR",
            ad_t: 2,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 203,
            name: "波兰",
            country: "PL",
            language: "pl",
            rate: 5,
            symbol: "złote",
            ad_t: 2,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 204,
            name: "韩国",
            country: "KR",
            language: "ko",
            rate: 1e3,
            symbol: "₩",
            ad_t: 2,
            cash_id: [130, 101, 103, 102]
          }, {
            id: 205,
            name: "意大利",
            country: "IT",
            language: "it",
            rate: 1,
            symbol: "€",
            ad_t: 2,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 206,
            name: "比利时",
            country: "BE",
            language: "nl",
            rate: 1,
            symbol: "€",
            ad_t: 2,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 207,
            name: "荷兰",
            country: "NL",
            language: "nl",
            rate: 1,
            symbol: "€",
            ad_t: 2,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 301,
            name: "印度",
            country: "IN",
            language: "hi",
            rate: 80,
            symbol: "₹",
            ad_t: 3,
            cash_id: [124, 125, 101, 103]
          }, {
            id: 302,
            name: "印尼",
            country: "ID",
            language: "in",
            rate: 15e3,
            symbol: "Rp",
            ad_t: 3,
            cash_id: [105, 106, 101, 103]
          }, {
            id: 303,
            name: "葡萄牙",
            country: "PT",
            language: "pt",
            rate: 1,
            symbol: "€",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 304,
            name: "泰国",
            country: "TH",
            language: "th",
            rate: 30,
            symbol: "฿",
            ad_t: 3,
            cash_id: [112, 118, 101, 103]
          }, {
            id: 305,
            name: "菲律宾",
            country: "PH",
            language: "fil",
            rate: 50,
            symbol: "₱",
            ad_t: 3,
            cash_id: [121, 116, 101, 103]
          }, {
            id: 306,
            name: "马来西亚",
            country: "MY",
            language: "ms",
            rate: 5,
            symbol: "RM",
            ad_t: 3,
            cash_id: [119, 121, 101, 103]
          }, {
            id: 307,
            name: "哥伦比亚",
            country: "CO",
            language: "es",
            rate: 3e3,
            symbol: "COP",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 308,
            name: "阿根廷",
            country: "AR",
            language: "es",
            rate: 350,
            symbol: "ARS",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 309,
            name: "墨西哥",
            country: "MX",
            language: "es",
            rate: 20,
            symbol: "Mex.$",
            ad_t: 3,
            cash_id: [113, 111, 101, 103]
          }, {
            id: 310,
            name: "巴西",
            country: "BR",
            language: "pt",
            rate: 5,
            symbol: "R$",
            ad_t: 3,
            cash_id: [107, 113, 123, 101]
          }, {
            id: 311,
            name: "越南",
            country: "VN",
            language: "vi",
            rate: 2e4,
            symbol: "₫",
            ad_t: 3,
            cash_id: [120, 115, 101, 103]
          }, {
            id: 312,
            name: "土耳其",
            country: "TR",
            language: "tr",
            rate: 8,
            symbol: "₺",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 313,
            name: "罗马尼亚",
            country: "RO",
            language: "ro",
            rate: 5,
            symbol: "Lei",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 314,
            name: "约旦",
            country: "JO",
            language: "ar",
            rate: 1,
            symbol: "$",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 315,
            name: "伊拉克",
            country: "IQ",
            language: "ar",
            rate: 1,
            symbol: "$",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 316,
            name: "埃及",
            country: "EG",
            language: "ar",
            rate: 1,
            symbol: "$",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 317,
            name: "以色列",
            country: "IL",
            language: "ar",
            rate: 1,
            symbol: "$",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 318,
            name: "俄罗斯",
            country: "RU",
            language: "ru",
            rate: 70,
            symbol: "₽",
            ad_t: 3,
            cash_id: [114, 117, 101, 103]
          }, {
            id: 319,
            name: "乌克兰",
            country: "UA",
            language: "uk",
            rate: 20,
            symbol: "₴",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 400,
            name: "SBALL",
            country: "SBALL",
            language: "en",
            rate: 1,
            symbol: "$",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }]
        };
    static FRAME_CONF = {
          SDK_VER: "1.0",
          EMAIL: null,
          rDTime: [10, 15],
          TaskLineFrameConfig: {
            startPeople: [300, 400],
            flashDeltaTime: [600, 600],
            videoMinus: [{
              count: 300,
              minusCount: [30, 50],
              MinusPrecend: 100,
              addCount: [1, 1]
            }, {
              count: 200,
              minusCount: [15, 30],
              MinusPrecend: 100,
              addCount: [1, 1]
            }, {
              count: 100,
              minusCount: [10, 15],
              MinusPrecend: 100,
              addCount: [1, 1]
            }, {
              count: 50,
              minusCount: [5, 10],
              MinusPrecend: 100,
              addCount: [1, 1]
            }, {
              count: 20,
              minusCount: [1, 2],
              MinusPrecend: 100,
              addCount: [1, 5]
            }, {
              count: 10,
              minusCount: [1, 2],
              MinusPrecend: 50,
              addCount: [1, 1]
            }, {
              count: 5,
              minusCount: [1, 1],
              MinusPrecend: 50,
              addCount: [1, 1]
            }, {
              count: 3,
              minusCount: [1, 1],
              MinusPrecend: 30,
              addCount: [1, 1]
            }, {
              count: 2,
              minusCount: [1, 1],
              MinusPrecend: 0,
              addCount: [1, 1]
            }, {
              count: 0,
              minusCount: [1, 1],
              MinusPrecend: 0,
              addCount: [1, 1]
            }],
            ChangePlusList: [{
              count: 300,
              addCount: [30, 50],
              precend: 10
            }, {
              count: 200,
              addCount: [15, 30],
              precend: 30
            }, {
              count: 100,
              addCount: [10, 15],
              precend: 50
            }, {
              count: 50,
              addCount: [5, 10],
              precend: 70
            }, {
              count: 0,
              addCount: [1, 2],
              precend: 100
            }],
            outLinePeopleCount: 400,
            MaxLength: 20
          },
          newHand: {
            max: 2e4,
            people: [1e4, 5e4],
            random: [1e4, 2e4]
          },
          TaskConfig: [{
            task_id: 101,
            task_lv: 5,
            task_num: 200
          }, {
            task_id: 102,
            task_lv: 10,
            task_num: 300
          }, {
            task_id: 103,
            task_lv: 20,
            task_num: 500
          }, {
            task_id: 104,
            task_lv: 30,
            task_num: 1e3
          }, {
            task_id: 105,
            task_lv: 40,
            task_num: 1500
          }, {
            task_id: 106,
            task_lv: 50,
            task_num: 1500
          }, {
            task_id: 107,
            task_lv: 60,
            task_num: 2e3
          }, {
            task_id: 108,
            task_lv: 80,
            task_num: 3e3
          }],
          InitialCoins: [0, 0],
          CoinConf: [{
            rdm_id: 1,
            rdm_1: 50,
            rdm_2: [5e3, 2e4],
            rdm_3: 200
          }, {
            rdm_id: 2,
            rdm_1: 100,
            rdm_2: [5e3, 2e4],
            rdm_3: 200
          }],
          CharityConf: [{
            rdm_id: 1,
            rdm_1: 300,
            rdm_2: 100,
            reward: 2e3
          }, {
            rdm_id: 2,
            rdm_1: 500,
            rdm_2: 100,
            reward: 5e3
          }],
          RedeemRateConfig: [1e3, 1],
          RedeemTipsStartLevel: 2,
          RedeemTargetConfig: {
            ratio: 2,
            extra: 3e4,
            factor: 100
          },
          OutputConfig: {
            newFixed: [1e3, 200, 100],
            new: 1e3,
            newRandom: [50, 200],
            ad: 100,
            adRate: [7, 10],
            adDisplayRate: [2, 10],
            draw: 150,
            drawRate: [2, 3, 5],
            free: 20,
            superFree: 50,
            superAd: 1e3,
            boxFixed: [],
            boxRandom: [30, 80],
            flyingBonus: 1e3,
            charity: 1,
            charityRate: [5, 10],
            charityPerPeople: 10
          },
          charityOutput: [{
            id: 101,
            have: [0, 100],
            value: [50, 50]
          }, {
            id: 102,
            have: [100, 150],
            value: [20, 25]
          }, {
            id: 103,
            have: [150, 200],
            value: [10, 20]
          }, {
            id: 104,
            have: [200, 250],
            value: [5, 10]
          }, {
            id: 105,
            have: [250, 275],
            value: [3, 5]
          }, {
            id: 106,
            have: [275, 290],
            value: [1, 2]
          }, {
            id: 107,
            have: [290, 300],
            value: [1, 1]
          }],
          PiggyConfig: {
            time: 86400,
            num: 3e4
          },
          forceVideo: 3,
          freeInedx: 3,
          abAdStartLevel: 3,
          welcomeBackStartLevel: 2,
          welcomeBackEndLevel: 20,
          charityLevel: 3,
          ratingLevel: 6,
          taskLevel: 5,
          bankLevel: 2,
          flyingBonusLevel: 4,
          superRewardLevel: 13,
          superRewardEnabled: false,
          adAlternateEnabled: false,
          intervalGrade: 5,
          androidRateUrl: "https://play.google.com/store/apps/details?id=com.replace.industries.article",
          iosRateUrl: "",
          normalDouble: 3,
          InterConfig: {
            maxFreeLevel: 9,
            cooldown: [{
              startLevel: 0,
              cd: 3e4
            }, {
              startLevel: 18,
              cd: 0
            }],
            beforeLevelAd: [{
              startLevel: 0,
              videoFirst: false
            }]
          },
          noAdConfig: [{
            startLevel: 0,
            delayTime: 0
          }],
          SuperRewardTask: [{
            task_id: 101,
            task_name: "appluck_1",
            task_type: 1,
            task_rule: 2,
            task_wgt: 500,
            task_daily: 2,
            task_time: [30],
            task_total: 9999,
            task_coin: 5e3,
            task_zone: ["us"],
            task_ban: [],
            task_is_uid: 1,
            task_url: "https://news.zephyrona.com/scene?sk=q820d25ace7865d65&lzdid={gaid}"
          }, {
            task_id: 102,
            task_name: "appluck_2",
            task_type: 1,
            task_rule: 2,
            task_wgt: 500,
            task_daily: 2,
            task_time: [30],
            task_total: 9999,
            task_coin: 5e3,
            task_zone: ["us"],
            task_ban: [],
            task_is_uid: 1,
            task_url: "https://events.vortexiax.com/scene?sk=q820d25ace7865d6b&lzdid={gaid}"
          }, {
            task_id: 201,
            task_name: "okspin_1",
            task_type: 2,
            task_rule: 2,
            task_wgt: 500,
            task_daily: 2,
            task_time: [30],
            task_total: 9999,
            task_coin: 5e3,
            task_zone: ["us"],
            task_ban: [],
            task_is_uid: 1,
            task_url: "https://s.gamifyspace.com/tml?pid=19555&appk=BzOELJrKBLXjHlcaWdTTkCFL1D7lEhUi&did={gaid}"
          }, {
            task_id: 202,
            task_name: "okspin_2",
            task_type: 2,
            task_rule: 2,
            task_wgt: 500,
            task_daily: 2,
            task_time: [30],
            task_total: 9999,
            task_coin: 5e3,
            task_zone: ["us"],
            task_ban: [],
            task_is_uid: 1,
            task_url: "https://s.gamifyspace.com/tml?pid=19554&appk=BzOELJrKBLXjHlcaWdTTkCFL1D7lEhUi&did={gaid}"
          }, {
            task_id: 301,
            task_name: "cpl_us",
            task_type: 3,
            task_rule: 1,
            task_wgt: 500,
            task_daily: 1,
            task_time: [120],
            task_total: 2,
            task_coin: 1e4,
            task_zone: ["us"],
            task_ban: [],
            task_is_uid: 2,
            task_url: "https://m.witskies.click/c/c/226/5138?sc=com.replace.industries.article&s2=S226&s1={invite_code}"
          }, {
            task_id: 302,
            task_name: "cpl_all",
            task_type: 3,
            task_rule: 1,
            task_wgt: 500,
            task_daily: 1,
            task_time: [120],
            task_total: 2,
            task_coin: 1e4,
            task_zone: [],
            task_ban: ["us"],
            task_is_uid: 2,
            task_url: "https://m.witskies.click/c/c/228/5138?sc=com.replace.industries.article&s2=S228&s1={invite_code}"
          }],
          SuperRewardConfig: {
            topNumber: 1e3,
            extraRewardRequirement: 3,
            extraRewardDisplay: 1e6,
            extraRewardRange: [2e4, 5e4],
            extraRewardLoop: -1,
            taskBonusTotal: 3e3,
            taskPeopleInitRange: [70, 80],
            taskPeopleAddRange: [2, 4],
            taskPeopleLimit: 95,
            taskBreakPoint: .7
          },
          AdAlternateConfig: [{
            fill_id: 101,
            task_name: "CY_A",
            fill_type: 1,
            fill_wgt: 1e4,
            fill_daily: 5,
            fill_time: [45],
            fill_total: 100,
            fill_zone: [],
            fill_ban: [],
            fill_is_uid: 0,
            fill_url: "https://fun.foiqxdas.xyz"
          }, {
            fill_id: 102,
            task_name: "WOSO_AFP_AD33",
            fill_type: 1,
            fill_wgt: 500,
            fill_daily: 5,
            fill_time: [45],
            fill_total: 100,
            fill_zone: [],
            fill_ban: [],
            fill_is_uid: 0,
            fill_url: "https://glee.5760.top"
          }, {
            fill_id: 104,
            task_name: "Simeng_steven",
            fill_type: 2,
            fill_wgt: 500,
            fill_daily: 5,
            fill_time: [45],
            fill_total: 100,
            fill_zone: [],
            fill_ban: [],
            fill_is_uid: 0,
            fill_url: "https://mood.freshleaf.store"
          }],
          webTargetButtonKeywords: ["confirm", "submit", "continue", "next"]
        };
}

cc.js.setClassName("FrameData", FrameData);
