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
    _scheduleFunc: (() => void) | null = null;
    _targetTime: number = 0;
    _success: boolean = true;
    hideTime: number = 0;

    _stopSchedule(): void {
        if (this._scheduleFunc != null) {
            this.unschedule(this._scheduleFunc);
            this._scheduleFunc = null;
        }
    }

    onEnable(): void {
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
        this.scheduleOnce(() => {
            this.viewData.startCallback?.();
            WebViewManager.showWebView(this.webViewAttachedNode, this.viewData.url, this);
        });
    }

    onDisable(): void {
        WebViewManager.hideWebView(this.webViewAttachedNode);
    }

    onWebViewLoad(success: boolean): void {
        this._stopSchedule();
        if (success) {
            this._targetTime = Date.now() + 1000 * this.viewData.time;
            this._success = true;
            this.schedule(
                (this._scheduleFunc = () => {
                    const remaining = Math.max(0, this._targetTime - Date.now());
                    this.adProgressBar.progress = (1000 * this.viewData.time - remaining) / this.viewData.time / 1000;
                    this.adProgressLabel.string = "skey_139??&value1==" + Math.floor(100 * this.adProgressBar.progress) + "%";
                    this.countdownProgressBar.progress = this.adProgressBar.progress;
                    this.countdownLabel.string = Math.ceil(remaining / 1000) + "s";
                    if (remaining <= 0) {
                        this._stopSchedule();
                        this.tipLabel.string = "skey_148";
                        this.closeButtonNode.active = true;
                        this.countdownProgressBar.node.active = false;
                    }
                })
            );
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

    onTouchCloseTips(): void {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            const endCallback = this.viewData.endCallback;
            const success = this._success;
            FrameSDK.closeEffect(this, () => endCallback?.(success));
        }
    }
}
