import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/CommboHitItemCtr")
export default class CommboHitItemCtr extends cc.Component {
    @property(cc.Node)
    commbo_label = null;

    @property(sp.Skeleton)
    bg_effect_sk = null;

    @property(cc.Animation)
    idle_ani = null;

    @property(cc.Node)
    combo_root_node = null;

    _comboCount = null;
    _curTimeCount = null;
    _comboNumTween = null;
    _rootTween = null;
    _hideTween = null;

    onHideAinComplete() {
        this.combo_root_node.active = false;
    }

    update(dt) {
        if (this.combo_root_node.active && !(this._curTimeCount <= 0)) {
            this._curTimeCount -= dt;
            this.updateProgress();
        }
    }

    onBgEffectSkComplete() {
        this.bg_effect_sk.node.active = false;
    }

    setComboLabel() {
        this.commbo_label.getComponent(cc.Label).string = "" + this._comboCount;
    }

    onComboHit(count) {
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
                this.combo_root_node.scale = .2;
                this._rootTween.start();
                this._hideTween.stop();
                this.updateProgress();
            }
        }
    }

    onLoad() {
        const self = this;
        this._comboCount = 0;
        this.combo_root_node.active = false;
        this._curTimeCount = 1;
        this.bg_effect_sk.setCompleteListener(this.onBgEffectSkComplete.bind(this));
        this.bg_effect_sk.node.active = false;
        this._comboNumTween = cc.tween(this.combo_root_node).set({
            scale: 1
        }).call(function () {
            self.bg_effect_sk.node.active = true;
            self.bg_effect_sk.setAnimation(0, "idle_1", false);
        }).to(.01, {
            scale: 1.5
        }).call(function () {
            EngineUtil.seti18nString(self.commbo_label, "" + self._comboCount);
        }).to(.2, {
            scale: 1
        }, {
            easing: "bounceOut"
        }).call(function () {
            self.idle_ani.play();
        });
        this.combo_root_node.scale = .2;
        this._rootTween = cc.tween(this.combo_root_node).set({
            scale: .2
        }).call(function () {
            self.bg_effect_sk.node.active = true;
            self.bg_effect_sk.setAnimation(0, "idle_1", false);
        }).to(.2, {
            scale: 1
        }, {
            easing: "bounceOut"
        }).call(function () {
            self.idle_ani.play();
        });
        this._hideTween = cc.tween(this.combo_root_node).set({
            scale: 1
        }).call(function () {
            self.bg_effect_sk.node.active = true;
            self.bg_effect_sk.setAnimation(0, "idle_2", false);
        }).to(.1, {
            scaleY: .2
        }).call(this.onHideAinComplete.bind(this));
    }

    hideCount() {
        if (this.combo_root_node.active) {
            this.idle_ani.stop();
            this._curTimeCount = 0;
            this._comboNumTween.stop();
            this.commbo_label.scale = 1;
            this._rootTween.stop();
            this._hideTween.start();
        }
    }

    onEnable() {
        EventMgr.listen(GameEventType.ON_COMMBO_HIT, this.onComboHit, this);
    }

    onDisable() {
        EventMgr.ignore(GameEventType.ON_COMMBO_HIT, this.onComboHit, this);
    }

    updateProgress() {
    }

    playComboNumAni() {
        this.commbo_label.scale = 1;
        this._comboNumTween.stop();
        this._comboNumTween.start();
    }
}
