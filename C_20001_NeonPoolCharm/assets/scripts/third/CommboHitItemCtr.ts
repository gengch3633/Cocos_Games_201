import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/CommboHitItemCtr")
export default class CommboHitItemCtr extends cc.Component {
    @property(cc.Node)
    commbo_label: cc.Node = null;

    @property(sp.Skeleton)
    bg_effect_sk: sp.Skeleton = null;

    @property(cc.Animation)
    idle_ani: cc.Animation = null;

    @property(cc.Node)
    combo_root_node: cc.Node = null;

    private _comboCount: number = null;
    private _curTimeCount: number = null;
    private _comboNumTween: cc.Tween = null;
    private _rootTween: cc.Tween = null;
    private _hideTween: cc.Tween = null;

    onHideAinComplete(): void {
        this.combo_root_node.active = false;
    }

    update(dt: number): void {
        if (this.combo_root_node.active && this._curTimeCount > 0) {
            this._curTimeCount -= dt;
            this.updateProgress();
        }
    }

    onBgEffectSkComplete(): void {
        this.bg_effect_sk.node.active = false;
    }

    setComboLabel(): void {
        this.commbo_label.getComponent(cc.Label).string = "" + this._comboCount;
    }

    onComboHit(count: number): void {
        if (count < 2) {
            this.hideCount();
        } else {
            this._comboCount = count;
            this.idle_ani.stop();
            if (this.combo_root_node.active) {
                this._curTimeCount = 1;
                this.playComboNumAni();
            } else {
                this.setComboLabel();
                this._curTimeCount = 1;
                this.combo_root_node.active = true;
                this._rootTween.stop();
                this.combo_root_node.scale = 0.2;
                this._rootTween.start();
                this._hideTween.stop();
                this.updateProgress();
            }
        }
    }

    onLoad(): void {
        this._comboCount = 0;
        this.combo_root_node.active = false;
        this._curTimeCount = 1;
        this.bg_effect_sk.setCompleteListener(this.onBgEffectSkComplete.bind(this));
        this.bg_effect_sk.node.active = false;
        this._comboNumTween = cc
            .tween(this.combo_root_node)
            .set({ scale: 1 })
            .call(() => {
                this.bg_effect_sk.node.active = true;
                this.bg_effect_sk.setAnimation(0, "idle_1", false);
            })
            .to(0.01, { scale: 1.5 })
            .call(() => {
                EngineUtil.seti18nString(this.commbo_label, "" + this._comboCount);
            })
            .to(0.2, { scale: 1 }, { easing: "bounceOut" })
            .call(() => {
                this.idle_ani.play();
            });
        this.combo_root_node.scale = 0.2;
        this._rootTween = cc
            .tween(this.combo_root_node)
            .set({ scale: 0.2 })
            .call(() => {
                this.bg_effect_sk.node.active = true;
                this.bg_effect_sk.setAnimation(0, "idle_1", false);
            })
            .to(0.2, { scale: 1 }, { easing: "bounceOut" })
            .call(() => {
                this.idle_ani.play();
            });
        this._hideTween = cc
            .tween(this.combo_root_node)
            .set({ scale: 1 })
            .call(() => {
                this.bg_effect_sk.node.active = true;
                this.bg_effect_sk.setAnimation(0, "idle_2", false);
            })
            .to(0.1, { scaleY: 0.2 })
            .call(this.onHideAinComplete.bind(this));
    }

    hideCount(): void {
        if (this.combo_root_node.active) {
            this.idle_ani.stop();
            this._curTimeCount = 0;
            this._comboNumTween.stop();
            this.commbo_label.scale = 1;
            this._rootTween.stop();
            this._hideTween.start();
        }
    }

    onEnable(): void {
        EventMgr.listen(GameEventType.ON_COMMBO_HIT, this.onComboHit, this);
    }

    onDisable(): void {
        EventMgr.ignore(GameEventType.ON_COMMBO_HIT, this.onComboHit, this);
    }

    updateProgress(): void {}

    playComboNumAni(): void {
        this.commbo_label.scale = 1;
        this._comboNumTween.stop();
        this._comboNumTween.start();
    }
}
