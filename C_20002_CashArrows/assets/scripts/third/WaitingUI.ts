const { ccclass } = cc._decorator;

@ccclass
export default class WaitingUI extends cc.Component {
    _hideLoadingText(): void {
        let skeletons: sp.Skeleton[] = [];
        if (typeof this.getComponentsInChildren === "function") {
            skeletons = this.getComponentsInChildren(sp.Skeleton) || [];
        }
        if ((!skeletons || skeletons.length <= 0) && this.node && typeof this.node.getComponentsInChildren === "function") {
            skeletons = this.node.getComponentsInChildren(sp.Skeleton) || [];
        }
        if ((!skeletons || skeletons.length <= 0) && typeof this.getComponent === "function") {
            const skeleton = this.getComponent(sp.Skeleton);
            if (skeleton) {
                skeletons = [skeleton];
            }
        }
        if (skeletons && skeletons.length > 0) {
            const boneNames = ["jiazai", "jiazai1", "jiazai2", "jiazai3", "jiazai4", "jiazai5", "jiazai6"];
            const slotNames = ["img/加", "jiazai", "jiazai2", "jiazai3", "jiazai4", "jiazai5"];
            for (let i = 0; i < skeletons.length; i++) {
                const skeleton = skeletons[i];
                if (skeleton?.isValid) {
                    for (let j = 0; j < boneNames.length; j++) {
                        const boneName = boneNames[j];
                        const bone = typeof skeleton.findBone === "function" ? skeleton.findBone(boneName) : null;
                        if (bone) {
                            bone.scaleX = 0;
                            bone.scaleY = 0;
                        }
                    }
                    for (let j = 0; j < slotNames.length; j++) {
                        const slotName = slotNames[j];
                        const slot = typeof skeleton.findSlot === "function" ? skeleton.findSlot(slotName) : null;
                        if (slot?.color) {
                            slot.color.a = 0;
                        }
                    }
                    if (typeof skeleton.invalidAnimationCache === "function") {
                        skeleton.invalidAnimationCache();
                    }
                }
            }
        }
    }

    hide(): void {
        this.node.active = false;
    }

    show(): void {
        this.node.active = true;
        this._hideLoadingText();
        this.scheduleOnce?.(this._hideLoadingText.bind(this), 0);
        this.getComponent(cc.Widget)?.updateAlignment();
    }

    progress(): void {}
}
