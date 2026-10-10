const { ccclass, property, menu } = cc._decorator;
menu;

export const ESpineEffectName = {
    E_XiaoChu: "xiaochu"
};

@ccclass
export default class SpineEffectCtrl extends cc.Component {
    @property(cc.Node)
    effect_container = null;

    _cb = null;
    _curEffectNode = null;

    onLoad() {
        const e = this;
        this.effect_container.children.forEach(function (t) {
            t.getComponent(sp.Skeleton).setCompleteListener(e.onEffectComplete.bind(e));
            t.active = false;
        });
    }

    onDisable() {
        this._cb = null;
        if (this._curEffectNode) {
            this._curEffectNode.active = false;
            this._curEffectNode = null;
        }
    }

    playEffect(e, t) {
        if (this._curEffectNode) {
            this._curEffectNode.active = false;
            this._curEffectNode = null;
        }
        this._curEffectNode = this.effect_container.getChildByName(e);
        this._curEffectNode || t && t(this.node);
        const o = this._curEffectNode.getComponent(sp.Skeleton);
        o.setAnimation(0, o.animation, false);
        this._curEffectNode.active = true;
        this._cb = t;
    }

    onEffectComplete() {
        if (this._curEffectNode) {
            this._curEffectNode.active = false;
            this._curEffectNode = null;
        }
        this._cb && this._cb(this.node);
        this._cb = null;
    }
}
