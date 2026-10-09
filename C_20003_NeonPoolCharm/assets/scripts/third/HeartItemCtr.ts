const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/HeartItemCtr")
export default class HeartItemCtr extends cc.Component {

    @property(sp.Skeleton)
    heart_sk: sp.Skeleton = null;

    _aniState = null;

    onEnable() {
    }

    onAniComplete(entry) {
        if ("xiaochu" == entry.animation.name) {
            this.heart_sk.node.active = false;
        } else if ("zengjia" == entry.animation.name) {
            this._aniState;
            this.heart_sk.setAnimation(0, "diaji", false);
        }
    }

    playXiaoChu() {
        if ("xiaochu" != this._aniState) {
            this._aniState = "xiaochu";
            this.playCurAni();
        }
    }

    playDaiJi() {
        if ("diaji" != this._aniState) {
            this._aniState = "diaji";
            this.playCurAni();
        }
    }

    playCurAni() {
        this.heart_sk.node.active = true;
        this.heart_sk.setAnimation(0, this._aniState || "diaji", false);
    }

    playZengJia() {
        if ("zengjia" != this._aniState && "diaji" != this._aniState) {
            this._aniState = "zengjia";
            this.playCurAni();
        }
    }

    onDisable() {
    }

    onLoad() {
        this.heart_sk.setCompleteListener(this.onAniComplete.bind(this));
        this._aniState = this.heart_sk.defaultAnimation;
    }
}
