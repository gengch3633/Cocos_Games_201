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
    _scheduleFunc: (() => void) | null = null;
    _config: any = null;
    _interval: number = 0;
    _targetTime: number = 0;
    _startProgress: number = 0;
    _maxProgress: number = 0;

    onWebViewInteract(): void {
        if (this._config.task_rule === 3 && this._maxProgress < 1) {
            this._interval = 1000 * (this._config.task_time[1] ?? 120);
            this._targetTime = Date.now() + this._interval;
            this._startProgress = FrameData.FRAME_CONF.SuperRewardConfig.taskBreakPoint;
            this._maxProgress = 1;
            this._startSchedule();
        }
    }

    onWebViewLoad(success: boolean): void {
        this._stopSchedule();
        if (success) {
            if (this._config.task_rule !== 2) {
                this._targetTime = Date.now() + this._interval;
                this._startSchedule();
            }
        } else {
            const originalX = this.webViewAttachedNode.x;
            this.webViewAttachedNode.x = -10000;
            FrameSDK.openWindow("Panel_SuperRewardTips", {
                type: "error",
                bonus: this._config.task_coin,
                callback: () => {
                    this.webViewAttachedNode.x = originalX;
                    FrameSDK.closeEffect(this, () => this.viewData.callback?.(false));
                },
            });
        }
    }

    _showAnnounce(): void {
        const amount =
            this.viewData.announceNumbers[FrameSDK.randomInt(0, this.viewData.announceNumbers.length - 1)];
        this.announceRichText.string =
            "skey_137??&value1==" +
            FrameSDK.getRandomInviteCode() +
            '&value2==<img src="dollar4" offset=-3/><color= #FFE956>' +
            FrameSDK.convertCoinToStr(amount) +
            "</c>";
        this.announceRichText.node.x = this.announceRichText.node.parent.width;
        cc.Tween.stopAllByTarget(this.announceRichText.node);
        cc.tween(this.announceRichText.node)
            .call(() => {
                cc.tween(this.announceRichText.node)
                    .to(10, {
                        x: -this.announceRichText.node.width - this.announceRichText.node.parent.width,
                    })
                    .call(() => this._showAnnounce())
                    .start();
            })
            .start();
    }

    onDisable(): void {
        WebViewManager.hideWebView(this.webViewAttachedNode);
    }

    onWebViewExternalURL(seconds: number): void {
        if (this._config.task_rule === 2 && this._targetTime < this._interval && seconds > 0) {
            this._targetTime += seconds;
            this.progressBar.progress = Math.min(this._targetTime / this._interval, 1);
            this.progressLabel.string = "skey_139??&value1==" + Math.floor(100 * this.progressBar.progress) + "%";
        }
    }

    _startSchedule(): void {
        this._stopSchedule();
        this.schedule(
            (this._scheduleFunc = () => {
                const remaining = Math.max(0, this._targetTime - Date.now());
                this.progressBar.progress = Math.min(
                    this._startProgress +
                        ((this._interval - remaining) / this._interval) * (this._maxProgress - this._startProgress),
                    1
                );
                this.progressLabel.string = "skey_139??&value1==" + Math.floor(100 * this.progressBar.progress) + "%";
                if (remaining <= 0) {
                    this.progressBar.progress = Math.min(this._maxProgress, 1);
                    this.progressLabel.string = "skey_139??&value1==" + Math.floor(100 * this.progressBar.progress) + "%";
                    this._stopSchedule();
                }
            })
        );
    }

    onEnable(): void {
        const parent = this.webViewAttachedNode.parent;
        parent.width = cc.winSize.width;
        parent.height = cc.winSize.height;
        if (cc.winSize.width / cc.winSize.height < 0.56) {
            parent.height = cc.winSize.height - 70;
            parent.y = -35;
        } else {
            parent.y = 0;
        }
        FrameSDK.openEffect(this);
        this._config = FrameData.FRAME_CONF.SuperRewardTask.find((item) => item.task_id === this.viewData.taskID);
        this.bonus1Label.string = FrameSDK.convertCoinToStr(this._config.task_coin);
        this.bonus2Label.string = FrameSDK.convertCoinToStr(this._config.task_coin, true);
        this._targetTime = 0;
        switch (this._config.task_rule) {
            case 1:
                this._interval = 1000 * (this._config.task_time[0] ?? 240);
                this._startProgress = 0;
                this._maxProgress = 1;
                this.tipRichText.string =
                    "skey_132??&value1==<color= #F8FF41>" + (this._config.task_time[0] ?? 240) / 60 + "</c>";
                break;
            case 2:
                this._interval = 1000 * (this._config.task_time[0] ?? 180);
                this._startProgress = 0;
                this._maxProgress = 1;
                this.tipRichText.string =
                    "skey_133??&value1==<color= #F8FF41>" + (this._config.task_time[0] ?? 180) / 60 + "</c>";
                break;
            case 3:
                this._interval = 1000 * (this._config.task_time[0] ?? 180);
                this._startProgress = 0;
                this._maxProgress = FrameData.FRAME_CONF.SuperRewardConfig.taskBreakPoint;
                this.tipRichText.string =
                    "skey_134??&value1==<color= #F8FF41>" +
                    ((this._config.task_time[0] ?? 180) + (this._config.task_time[1] ?? 120)) / 60 +
                    "</c>";
                break;
            default:
                this._interval = 1000 * (this._config.task_time[0] ?? 180);
                this._startProgress = 0;
                this._maxProgress = 1;
                this.tipRichText.string = "";
        }
        this.progressBar.progress = 0;
        this.progressLabel.string = "skey_139??&value1==0%";
        this.scheduleOnce(() => {
            let url = this._config.task_url;
            if (this._config.task_is_uid === 1) {
                url = this._config.task_url.replace("{gaid}", FrameSDK.frameData.sdkFuc.gaid);
            } else if (this._config.task_is_uid === 2) {
                url = this._config.task_url.replace("{invite_code}", FrameSDK.frameData.sdkFuc.inviteCode);
            }
            WebViewManager.showWebView(this.webViewAttachedNode, url, this);
        });
        this._showAnnounce();
    }

    onCloseButtonClick(): void {
        const originalX = this.webViewAttachedNode.x;
        this.webViewAttachedNode.x = -10000;
        if (this.progressBar.progress < 1) {
            FrameSDK.openWindow("Panel_SuperRewardTips", {
                type: "quit",
                bonus: this._config.task_coin,
                callback: (keepGoing: boolean) => {
                    this.webViewAttachedNode.x = originalX;
                    if (!keepGoing) {
                        FrameSDK.closeEffect(this, () => this.viewData.callback?.(false));
                    }
                },
            });
        } else {
            FrameSDK.openWindow("Panel_SuperRewardTips", {
                type: "complete",
                bonus: this._config.task_coin,
                callback: () => {
                    this.webViewAttachedNode.x = originalX;
                    FrameSDK.closeEffect(this, () => this.viewData.callback?.(true));
                },
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
