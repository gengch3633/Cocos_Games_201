const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/HeartItemCtr")
export default class HeartItemCtr extends cc.Component {
    @property(sp.Skeleton)
    heart_sk: sp.Skeleton = null;

    private _aniState: string = null;

    onEnable(): void {
    }

    onAniComplete(entry: sp.spine.TrackEntry): void {
        if (entry.animation.name == "xiaochu") {
            this.heart_sk.node.active = false;
        } else if (entry.animation.name == "zengjia") {
            this.heart_sk.setAnimation(0, "diaji", false);
        }
    }

    playXiaoChu(): void {
        if (this._aniState != "xiaochu") {
            this._aniState = "xiaochu";
            this.playCurAni();
        }
    }

    playDaiJi(): void {
        if (this._aniState != "diaji") {
            this._aniState = "diaji";
            this.playCurAni();
        }
    }

    playCurAni(): void {
        this.heart_sk.node.active = true;
        this.heart_sk.setAnimation(0, this._aniState || "diaji", false);
    }

    playZengJia(): void {
        if (this._aniState != "zengjia" && this._aniState != "diaji") {
            this._aniState = "zengjia";
            this.playCurAni();
        }
    }

    onDisable(): void {
    }

    onLoad(): void {
        this.heart_sk.setCompleteListener(this.onAniComplete.bind(this));
        this._aniState = this.heart_sk.defaultAnimation;
    }
}
