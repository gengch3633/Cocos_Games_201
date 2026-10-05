import * as GodGuideModule from "./GodGuide";

const TouchType = (GodGuideModule as any).TouchType;

const { ccclass, property } = cc._decorator;

@ccclass
export default class GuideFinger extends cc.Component {
    @property(sp.Skeleton)
    light: sp.Skeleton = null;

    @property(sp.Skeleton)
    finger: sp.Skeleton = null;

    play(touchType: number): void {
        if (touchType == TouchType.Click) {
            this.light.node.active = false;
            this.finger.setAnimation(0, "dian", true);
        } else if (touchType == TouchType.DragHorizontal) {
            this.light.node.active = true;
            this.finger.setAnimation(0, "you", true);
            this.light.setAnimation(0, "heng", true);
        } else if (touchType == TouchType.DragVertical) {
            this.light.node.active = true;
            this.finger.setAnimation(0, "xia", true);
            this.light.setAnimation(0, "shu", true);
        }
    }

    start(): void {}
}
