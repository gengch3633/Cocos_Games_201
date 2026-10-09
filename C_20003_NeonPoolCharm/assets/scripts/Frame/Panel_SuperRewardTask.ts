import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import WebViewManager from "./WebViewManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_SuperRewardTask extends cc.Component {

    @property(cc.RichText)
    announceRichText: cc.RichText = null;

    @property(cc.Label)
    bonus1Label: cc.Label = null;

    @property(cc.Label)
    bonus2Label: cc.Label = null;

    @property(cc.RichText)
    tipRichText: cc.RichText = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Label)
    progressLabel: cc.Label = null;

    @property(cc.Node)
    webViewAttachedNode: cc.Node = null;

    viewData: any = null;

    _scheduleFunc: any = null;

    _config: any = null;

    _interval: number = 0;

    _targetTime: number = 0;

    _startProgress: number = 0;

    _maxProgress: number = 0;

    onWebViewInteract(): void {
        if (!(3 !== this._config.task_rule || this._maxProgress >= 1)) {
            const time = this._config.task_time[1];
            this._interval = 1000 * (time != null ? time : 120);
            this._targetTime = Date.now() + this._interval;
            this._startProgress = FrameData.FRAME_CONF.SuperRewardConfig.taskBreakPoint;
            this._maxProgress = 1;
            this._startSchedule();
        }
    }

    onWebViewLoad(e: any): void {
        const t = this;
        this._stopSchedule();
        if (e) {
            if (2 !== this._config.task_rule) {
                this._targetTime = Date.now() + this._interval;
                this._startSchedule();
            }
        } else {
            const a = this.webViewAttachedNode.x;
            this.webViewAttachedNode.x = -10000;
            FrameSDK.openWindow("Panel_SuperRewardTips", {
                type: "error",
                bonus: this._config.task_coin,
                callback: function () {
                    t.webViewAttachedNode.x = a;
                    FrameSDK.closeEffect(t, function () {
                        const viewData = t.viewData;
                        const callback = viewData.callback;
                        if (callback) {
                            return callback.call(viewData, false);
                        }
                    });
                }
            });
        }
    }

    _showAnnounce(): void {
        const e = this;
        const t = this.viewData.announceNumbers[FrameSDK.randomInt(0, this.viewData.announceNumbers.length - 1)];
        this.announceRichText.string = "skey_137??&value1==" + FrameSDK.getRandomInviteCode() + '&value2==<img src="dollar4" offset=-3/><color= #FFE956>' + FrameSDK.convertCoinToStr(t) + "</c>";
        this.announceRichText.node.x = this.announceRichText.node.parent.width;
        cc.Tween.stopAllByTarget(this.announceRichText.node);
        cc.tween(this.announceRichText.node).call(function () {
            cc.tween(e.announceRichText.node).to(10, {
                x: -e.announceRichText.node.width - e.announceRichText.node.parent.width
            }).call(function () {
                return e._showAnnounce();
            }).start();
        }).start();
    }

    onDisable(): void {
        WebViewManager.hideWebView(this.webViewAttachedNode);
    }

    onWebViewExternalURL(e: any): void {
        if (!(2 !== this._config.task_rule || this._targetTime >= this._interval || e <= 0)) {
            this._targetTime += e;
            this.progressBar.progress = Math.min(this._targetTime / this._interval, 1);
            this.progressLabel.string = "skey_139??&value1==" + Math.floor(100 * this.progressBar.progress) + "%";
        }
    }

    _startSchedule(): void {
        const e = this;
        this._stopSchedule();
        this.schedule(this._scheduleFunc = function () {
            const t = Math.max(0, e._targetTime - Date.now());
            e.progressBar.progress = Math.min(e._startProgress + (e._interval - t) / e._interval * (e._maxProgress - e._startProgress), 1);
            e.progressLabel.string = "skey_139??&value1==" + Math.floor(100 * e.progressBar.progress) + "%";
            if (t <= 0) {
                e.progressBar.progress = Math.min(e._maxProgress, 1);
                e.progressLabel.string = "skey_139??&value1==" + Math.floor(100 * e.progressBar.progress) + "%";
                e._stopSchedule();
            }
        });
    }

    onEnable(): void {
        const d = this;
        const p = this.webViewAttachedNode.parent;
        p.width = cc.winSize.width;
        p.height = cc.winSize.height;
        if (cc.winSize.width / cc.winSize.height < 0.56) {
            p.height = cc.winSize.height - 70;
            p.y = -35;
        } else {
            p.y = 0;
        }
        FrameSDK.openEffect(this);
        this._config = FrameData.FRAME_CONF.SuperRewardTask.find(function (task) {
            return task.task_id === d.viewData.taskID;
        });
        this.bonus1Label.string = FrameSDK.convertCoinToStr(this._config.task_coin);
        this.bonus2Label.string = FrameSDK.convertCoinToStr(this._config.task_coin, true);
        this._targetTime = 0;
        switch (this._config.task_rule) {
            case 1: {
                const time1 = this._config.task_time[0];
                this._interval = 1000 * (time1 != null ? time1 : 240);
                this._startProgress = 0;
                this._maxProgress = 1;
                this.tipRichText.string = "skey_132??&value1==<color= #F8FF41>" + (time1 != null ? time1 : 240) / 60 + "</c>";
                break;
            }
            case 2: {
                const time2 = this._config.task_time[0];
                this._interval = 1000 * (time2 != null ? time2 : 180);
                this._startProgress = 0;
                this._maxProgress = 1;
                this.tipRichText.string = "skey_133??&value1==<color= #F8FF41>" + (time2 != null ? time2 : 180) / 60 + "</c>";
                break;
            }
            case 3: {
                const time3 = this._config.task_time[0];
                const time3b = this._config.task_time[1];
                this._interval = 1000 * (time3 != null ? time3 : 180);
                this._startProgress = 0;
                this._maxProgress = FrameData.FRAME_CONF.SuperRewardConfig.taskBreakPoint;
                this.tipRichText.string = "skey_134??&value1==<color= #F8FF41>" + ((time3 != null ? time3 : 180) + (time3b != null ? time3b : 120)) / 60 + "</c>";
                break;
            }
            default: {
                const timeDefault = this._config.task_time[0];
                this._interval = 1000 * (timeDefault != null ? timeDefault : 180);
                this._startProgress = 0;
                this._maxProgress = 1;
                this.tipRichText.string = "";
            }
        }
        this.progressBar.progress = 0;
        this.progressLabel.string = "skey_139??&value1==0%";
        this.scheduleOnce(function () {
            let url;
            if (1 === d._config.task_is_uid) {
                url = d._config.task_url.replace("{gaid}", FrameSDK.frameData.sdkFuc.gaid);
            } else if (2 === d._config.task_is_uid) {
                url = d._config.task_url.replace("{invite_code}", FrameSDK.frameData.sdkFuc.inviteCode);
            } else {
                url = d._config.task_url;
            }
            WebViewManager.showWebView(d.webViewAttachedNode, url, d);
        });
        this._showAnnounce();
    }

    onCloseButtonClick(): void {
        const e = this;
        const t = this.webViewAttachedNode.x;
        this.webViewAttachedNode.x = -10000;
        if (this.progressBar.progress < 1) {
            FrameSDK.openWindow("Panel_SuperRewardTips", {
                type: "quit",
                bonus: this._config.task_coin,
                callback: function (a) {
                    e.webViewAttachedNode.x = t;
                    if (!a) {
                        FrameSDK.closeEffect(e, function () {
                            const viewData = e.viewData;
                            const callback = viewData.callback;
                            if (callback) {
                                return callback.call(viewData, false);
                            }
                        });
                    }
                }
            });
        } else {
            FrameSDK.openWindow("Panel_SuperRewardTips", {
                type: "complete",
                bonus: this._config.task_coin,
                callback: function () {
                    e.webViewAttachedNode.x = t;
                    FrameSDK.closeEffect(e, function () {
                        const viewData = e.viewData;
                        const callback = viewData.callback;
                        if (callback) {
                            return callback.call(viewData, true);
                        }
                    });
                }
            });
        }
    }

    _stopSchedule(): void {
        if (this._scheduleFunc != null) {
            this.unschedule(this._scheduleFunc);
            this._scheduleFunc = null;
        }
    }

}
