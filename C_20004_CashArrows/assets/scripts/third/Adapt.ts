const { ccclass, property } = cc._decorator;

@ccclass
export default class Adapt extends cc.Component {
    protected onLoad(): void {
        this.init();
    }

    protected onEnable(): void {
        this.adapt();
    }

    private init(): void {
        cc.view.setResizeCallback(() => this.onResize());
    }

    private onResize(): void {
        this.adapt();
    }

    private adapt(): void {
        const winSize = cc.winSize;
        const winRatio = winSize.width / winSize.height;
        const designResolution = cc.Canvas.instance.designResolution;
        const designRatio = designResolution.width / designResolution.height;

        if (winRatio <= 1 && winRatio <= designRatio) {
            this.setFitWidth();
        } else {
            this.setFitHeight();
        }
    }

    private setFitHeight(): void {
        const canvas = cc.Canvas.instance;
        canvas.fitHeight = true;
        canvas.fitWidth = false;
    }

    private setFitWidth(): void {
        const canvas = cc.Canvas.instance;
        canvas.fitHeight = false;
        canvas.fitWidth = true;
    }
}