const { ccclass, property } = cc._decorator;

export const ESpineEffectName = {
    E_XiaoChu: "xiaochu",
};

@ccclass
export default class SpineEffectCtrl extends cc.Component {
    @property(cc.Node)
    effect_container: cc.Node = null;

    _cb: (node: cc.Node) => void = null;
    _curEffectNode: cc.Node = null;

    onLoad(): void {
        this.effect_container.children.forEach((effectNode) => {
            effectNode.getComponent(sp.Skeleton).setCompleteListener(this.onEffectComplete.bind(this));
            effectNode.active = false;
        });
    }

    onDisable(): void {
        this._cb = null;
        if (this._curEffectNode) {
            this._curEffectNode.active = false;
            this._curEffectNode = null;
        }
    }

    playEffect(effectName: string, callback?: (node: cc.Node) => void): void {
        if (this._curEffectNode) {
            this._curEffectNode.active = false;
            this._curEffectNode = null;
        }
        this._curEffectNode = this.effect_container.getChildByName(effectName);
        if (!this._curEffectNode) {
            callback && callback(this.node);
            return;
        }
        const skeleton = this._curEffectNode.getComponent(sp.Skeleton);
        skeleton.setAnimation(0, skeleton.animation, false);
        this._curEffectNode.active = true;
        this._cb = callback;
    }

    onEffectComplete(): void {
        if (this._curEffectNode) {
            this._curEffectNode.active = false;
            this._curEffectNode = null;
        }
        this._cb && this._cb(this.node);
        this._cb = null;
    }
}
