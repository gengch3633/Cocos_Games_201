const { ccclass } = cc._decorator;

@ccclass
export default class Adapt extends cc.Component {
    onLoad() {
        this.init();
    }

    onEnable() {
        this.adapt();
    }

    init() {
        const self = this;
        cc.view.setResizeCallback(function () {
            return self.onResize();
        });
    }

    onResize() {
        this.adapt();
    }

    adapt() {
        const size = cc.winSize;
        const ratio = size.width / size.height;
        const design = cc.Canvas.instance.designResolution;
        const designRatio = design.width / design.height;
        ratio <= 1 && ratio <= designRatio ? this.setFitWidth() : this.setFitHeight();
    }

    setFitHeight() {
        const canvas = cc.Canvas.instance;
        canvas.fitHeight = true;
        canvas.fitWidth = false;
    }

    setFitWidth() {
        const canvas = cc.Canvas.instance;
        canvas.fitHeight = false;
        canvas.fitWidth = true;
    }
}
