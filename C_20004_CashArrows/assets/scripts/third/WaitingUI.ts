const { ccclass, property } = cc._decorator;

@ccclass
export default class WaitingUI extends cc.Component {
    private _hideLoadingText(): void {
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
        if (!skeletons || skeletons.length <= 0) {
            return;
        }

        const boneNames: string[] = ["jiazai", "jiazai1", "jiazai2", "jiazai3", "jiazai4", "jiazai5", "jiazai6"];
        const slotNames: string[] = ["img/加", "jiazai", "jiazai2", "jiazai3", "jiazai4", "jiazai5"];

        for (let i = 0; i < skeletons.length; i++) {
            const skeleton = skeletons[i];
            if (!skeleton || !skeleton.isValid) {
                continue;
            }

            for (let j = 0; j < boneNames.length; j++) {
                const boneName = boneNames[j];
                const bone = typeof skeleton.findBone === "function" ? skeleton.findBone(boneName) : null;
                if (bone) {
                    bone.scaleX = 0;
                    bone.scaleY = 0;
                }
            }

            for (let k = 0; k < slotNames.length; k++) {
                const slotName = slotNames[k];
                const slot = typeof skeleton.findSlot === "function" ? skeleton.findSlot(slotName) : null;
                if (slot && slot.color) {
                    slot.color.a = 0;
                }
            }

            if (typeof skeleton.invalidAnimationCache === "function") {
                skeleton.invalidAnimationCache();
            }
        }
    }

    public hide(): void {
        this.node.active = false;
    }

    public show(): void {
        this.node.active = true;

        this._hideLoadingText();

        if (this.scheduleOnce) {
            this.scheduleOnce(this._hideLoadingText.bind(this), 0);
        }

        const widget = this.getComponent(cc.Widget);
        if (widget) {
            widget.updateAlignment();
        }
    }

    public progress(): void {}
}