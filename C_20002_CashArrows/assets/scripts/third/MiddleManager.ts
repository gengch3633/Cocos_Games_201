import MiddleNetwork from "./MiddleNetwork";
import MiddleService from "./MiddleService";
import { MiddleReqType } from "./MiddleReqType";
import MiddleHandler from "./MiddleHandler";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import CryptoHelper from "./CryptoHelper";
import ClientDataStore from "./ClientDataStore";
import MiddleHelper from "./MiddleHelper";
import MiddleSdkEventService from "./MiddleSdkEventService";
import MiddleUploadScheduler from "./MiddleUploadScheduler";

export default class MiddleManager {
    static LOG_TAG = "[MiddleManager.autoUploadEvent] ";
    static instance: MiddleManager = null;

    banRed = true;
    banPay = false;
    recogIRE = false;
    recogTF = false;
    isSupportHot = false;
    intervalSeconds = 60;
    isFinishReginal = false;
    mfi = true;
    _initMiddleRefer = false;
    _adConfig: any = null;
    autoUploadSeq = 0;
    lastAutoUploadAt = 0;
    sdkEventService: MiddleSdkEventService;
    uploadScheduler: MiddleUploadScheduler;

    constructor() {
        var e = this;
        this.sdkEventService = new MiddleSdkEventService();
        this.uploadScheduler = new MiddleUploadScheduler({
            isReady: function () {
                return e.isFinishReginal;
            },
            getIntervalSeconds: function () {
                return e.intervalSeconds;
            },
            uploadNow: function (t: any) {
                return e.autoUploadEvent(t);
            }
        });
        this.syncRegionalStateFromHelper();
        this.log(" scheduler created ", {
            intervalSeconds: this.intervalSeconds,
            isFinishReginal: this.isFinishReginal
        });
    }

    log(t: string, i?: any) {
        if (void 0 !== i) {
            var n = " ";
            try {
                n = JSON.stringify(i);
            } catch (e) {
                n = String(i);
            }
            console.log(MiddleManager.LOG_TAG + " " + t + " " + n);
        } else console.log(MiddleManager.LOG_TAG + " " + t);
    }

    static getInstance() {
        MiddleManager.instance || (MiddleManager.instance = new MiddleManager());
        return MiddleManager.instance;
    }

    middleTFRegional() {
        this.syncRegionalStateFromHelper();
        BusinessAnalyticsService.reportData(" middleTFRegional ");
        if (this._initMiddleRefer) BusinessAnalyticsService.reportData(" middleTFRegional_init_finish "); else {
            this._initMiddleRefer = true;
            BusinessAnalyticsService.reportData(" middleTFRegional_middleTF ");
            this.middleTF();
        }
    }

    middleTF(e?: () => void) {
        BusinessAnalyticsService.reportData(" middle_tf ");
        var t = MiddleService.paramData(MiddleReqType.Regional);
        console.log("[MiddleManager.middleTF] request params- > ", JSON.stringify(t));
        MiddleNetwork.getMiddleTFRegional(t, MiddleHandler.create(this, function (t: any) {
            console.log("[MiddleManager.middleTF] success result- > ", JSON.stringify(t));
            if (t) {
                BusinessAnalyticsService.reportData(" middle_tf_result ", {
                    is_self_match_tf: t.is_self_match_tf
                });
                e && e();
            }
        }), MiddleHandler.create(this, function (e: any) {
            console.error("[MiddleManager.middleTF] fail result- > ", JSON.stringify(e));
            BusinessAnalyticsService.reportData(" middle_tf_result_error ");
        }));
    }

    autoUploadEvent(e?: string) {
        var t = this;
        void 0 === e && (e = " unknown ");
        var i = this.isFinishReginal;
        this.syncRegionalStateFromHelper();
        if (!i && this.isFinishReginal) {
            this.log(" ready state changed ", {
                from: i,
                to: this.isFinishReginal,
                source: e
            });
            this.uploadScheduler.refreshTimerByMode();
        }
        var n = Date.now(), a = this.lastAutoUploadAt > 0 ? n - this.lastAutoUploadAt : -1;
        this.autoUploadSeq += 1;
        this.log(" trigger ", {
            seq: this.autoUploadSeq,
            source: e,
            isFinishReginal: this.isFinishReginal,
            intervalSeconds: this.intervalSeconds,
            elapsedSinceLastMs: a
        });
        this.lastAutoUploadAt = n;
        this.uploadScheduler.markUploadTriggered();
        this.sdkEventService.uploadOnce(function (i: number) {
            var n = t.intervalSeconds;
            t.intervalSeconds = i;
            t.log(" interval update ", {
                seq: t.autoUploadSeq,
                source: e,
                oldIntervalSeconds: n,
                newIntervalSeconds: t.intervalSeconds
            });
            t.uploadScheduler.refreshTimerByMode();
        });
    }

    onDestroy() {
        this.uploadScheduler && this.uploadScheduler.destroy();
    }

    getAdConfig(e?: (config: any) => void, t?: (err: any) => void) {
        var i = this;
        this.syncRegionalStateFromHelper();
        if (1 != this.mfi) {
            BusinessAnalyticsService.reportData(" wp_mfi_false ");
            console.log("[MiddleManager] 开始获取广告配置 ");
            var l = MiddleService.paramData(MiddleReqType.ADCONFIG);
            MiddleNetwork.getAdConfig(l, MiddleHandler.create(this, function (n: any) {
                if (n) {
                    console.log("[MiddleManager] 广告配置获取成功 ");
                    if (n.urls && Array.isArray(n.urls) && 0 !== n.urls.length) {
                        for (var a = 0; a < n.urls.length; a++) {
                            var o = n.urls[a];
                            if (o && o.sst) try {
                                var r = i.decryptAdConfigSst(o.sst);
                                if (r) {
                                    o.sst = r;
                                    console.log("[MiddleManager] config.urls[" + a + "].sst 解密成功 ");
                                }
                            } catch (e) {
                                BusinessAnalyticsService.reportData(" wp_config_error ", {
                                    error: " sst解密异常 "
                                });
                                console.error("[MiddleManager] config.urls[" + a + "].sst 解密异常: ", e);
                            }
                        }
                        i._adConfig = n;
                        e && e(n);
                    } else {
                        console.error("[MiddleManager] 广告配置中 urls 不存在或为空数组 ");
                        t && t(" 广告配置中 urls 不存在或为空数组 ");
                    }
                } else t && t(" 广告配置返回数据为空 ");
            }), MiddleHandler.create(this, function (e: any) {
                console.error("[MiddleManager] 广告配置获取失败: ", e);
                t && t(e);
            }));
        } else if (t) {
            t(" mfi为true ， 不获取广告配置 ");
            BusinessAnalyticsService.reportData(" wp_mfi_true ");
        }
    }

    getAdConfigData() {
        return this._adConfig;
    }

    syncRegionalStateFromHelper() {
        var e = MiddleHelper.getRegionalState ? MiddleHelper.getRegionalState() : null;
        if (e) {
            this.log(" syncRegionalStateFromHelper raw ", e);
            this.isSupportHot = !!e.isSupportHot;
            this.isFinishReginal = !!e.isFinishRegional;
            this.banRed = !!e.banRed;
            this.banPay = !!e.banPay;
            this.recogIRE = !!e.recogIRE;
            this.recogTF = !!e.recogTF;
            void 0 !== e.mfi && null !== e.mfi && (this.mfi = !!e.mfi);
            this.log(" syncRegionalStateFromHelper applied ", {
                isSupportHot: this.isSupportHot,
                isFinishReginal: this.isFinishReginal,
                banRed: this.banRed,
                banPay: this.banPay,
                recogIRE: this.recogIRE,
                recogTF: this.recogTF,
                mfi: this.mfi
            });
        } else this.log(" syncRegionalStateFromHelper no state ");
    }

    decryptAdConfigSst(e: any) {
        if (!e) return e;
        try {
            return CryptoHelper.decrypt(e, ClientDataStore.box_pkg_name);
        } catch (t) {
            return e;
        }
    }
}
