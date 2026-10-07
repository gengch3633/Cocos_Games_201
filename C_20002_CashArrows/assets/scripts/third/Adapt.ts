const { ccclass } = cc._decorator;

@ccclass
export default class Adapt extends cc.Component {
    onLoad(): void {
        this.init();
    }

    onEnable(): void {
        this.adapt();
    }

    init(): void {
        cc.view.setResizeCallback(() => this.onResize());
    }

    onResize(): void {
        this.adapt();
    }

    adapt(): void {
        const winSize = cc.winSize;
        const aspect = winSize.width / winSize.height;
        const design = cc.Canvas.instance.designResolution;
        const designAspect = design.width / design.height;
        if (aspect <= 1 && aspect <= designAspect) {
            this.setFitWidth();
        } else {
            this.setFitHeight();
        }
    }

    setFitHeight(): void {
        const canvas = cc.Canvas.instance;
        canvas.fitHeight = true;
        canvas.fitWidth = false;
    }

    setFitWidth(): void {
        const canvas = cc.Canvas.instance;
        canvas.fitHeight = false;
        canvas.fitWidth = true;
    }
}
