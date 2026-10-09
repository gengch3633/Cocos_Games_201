import { FrameSDK } from "./FrameSDK";
import WebViewManager from "./WebViewManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_AdAlternate extends cc.Component {

    @property(cc.Label)
    rewardLabel: cc.Label = null;

    @property(cc.Node)
    maxFlagNode: cc.Node = null;

    @property(cc.Label)
    tipLabel: cc.Label = null;

    @property(cc.ProgressBar)
    adProgressBar: cc.ProgressBar = null;

    @property(cc.Label)
    adProgressLabel: cc.Label = null;

    @property(cc.Node)
    closeButtonNode: cc.Node = null;

    @property(cc.ProgressBar)
    countdownProgressBar: cc.ProgressBar = null;

    @property(cc.Label)
    countdownLabel: cc.Label = null;

    @property(cc.Node)
    webViewAttachedNode: cc.Node = null;

    viewData: any = null;
    _scheduleFunc: Function = null;
    _targetTime: number = 0;
    _success: boolean = true;
    hideTime: number = 0;

    _stopSchedule() {
        if (null !== this._scheduleFunc && undefined !== this._scheduleFunc) {
            this.unschedule(this._scheduleFunc);
            this._scheduleFunc = null;
        }
    }

    onEnable() {
        const self = this;
        FrameSDK.openEffect(this);
        this.rewardLabel.string = "" + FrameSDK.convertCoinToStr(this.viewData.reward, false);
        this.maxFlagNode.active = this.viewData.isMax;
        this.tipLabel.string = "skey_147";
        this.adProgressBar.progress = 0;
        this.adProgressLabel.string = "skey_139??&value1==0%";
        this.closeButtonNode.active = false;
        this.countdownProgressBar.node.active = true;
        this.countdownProgressBar.progress = 0;
        this.countdownLabel.string = this.viewData.time + "s";
        this.scheduleOnce(function () {
            if (self.viewData.startCallback != null) {
                self.viewData.startCallback.call(self.viewData);
            }
            WebViewManager.showWebView(self.webViewAttachedNode, self.viewData.url, self);
        });
    }

    onDisable() {
        WebViewManager.hideWebView(this.webViewAttachedNode);
    }

    onWebViewLoad(success: boolean) {
        const self = this;
        this._stopSchedule();
        if (success) {
            this._targetTime = Date.now() + 1000 * this.viewData.time;
            this._success = true;
            this.schedule(this._scheduleFunc = function () {
                const remain = Math.max(0, self._targetTime - Date.now());
                self.adProgressBar.progress = (1000 * self.viewData.time - remain) / self.viewData.time / 1000;
                self.adProgressLabel.string = "skey_139??&value1==" + Math.floor(100 * self.adProgressBar.progress) + "%";
                self.countdownProgressBar.progress = self.adProgressBar.progress;
                self.countdownLabel.string = Math.ceil(remain / 1000) + "s";
                if (remain <= 0) {
                    self._stopSchedule();
                    self.tipLabel.string = "skey_148";
                    self.closeButtonNode.active = true;
                    self.countdownProgressBar.node.active = false;
                }
            });
        } else {
            this._targetTime = 0;
            this._success = false;
            this.tipLabel.string = "skey_148";
            this.adProgressBar.progress = 1;
            this.adProgressLabel.string = "skey_139??&value1==100%";
            this.closeButtonNode.active = true;
            this.countdownProgressBar.node.active = false;
        }
    }

    onTouchCloseTips() {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            const endCallback = this.viewData.endCallback;
            const success = this._success;
            FrameSDK.closeEffect(this, function () {
                if (endCallback == null) {
                    return undefined;
                }
                return endCallback(success);
            });
        }
    }
}
