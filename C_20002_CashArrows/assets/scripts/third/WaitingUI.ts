const { ccclass } = cc._decorator;

@ccclass
export default class WaitingUI extends cc.Component {
    _hideLoadingText() {
        var e: sp.Skeleton[] = [];
        " function " == typeof this.getComponentsInChildren && (e = this.getComponentsInChildren(sp.Skeleton) || []);
        (!e || e.length <= 0) && this.node && " function " == typeof this.node.getComponentsInChildren && (e = this.node.getComponentsInChildren(sp.Skeleton) || []);
        if ((!e || e.length <= 0) && " function " == typeof this.getComponent) {
            var t = this.getComponent(sp.Skeleton);
            t && (e = [t]);
        }
        if (e && !(e.length <= 0)) for (var i = ["jiazai", "jiazai1", "jiazai2", "jiazai3", "jiazai4", "jiazai5", "jiazai6"], n = ["img/加", "jiazai", "jiazai2", "jiazai3", "jiazai4", "jiazai5"], a = 0; a < e.length; a++) {
            var o = e[a];
            if (o && o.isValid) {
                for (var r = 0; r < i.length; r++) {
                    var s = i[r],
                        l = " function " == typeof o.findBone ? o.findBone(s) : null;
                    if (l) {
                        l.scaleX = 0;
                        l.scaleY = 0;
                    }
                }
                for (var c = 0; c < n.length; c++) {
                    var u = n[c],
                        d = " function " == typeof o.findSlot ? o.findSlot(u) : null;
                    d && d.color && (d.color.a = 0);
                }
                " function " == typeof o.invalidAnimationCache && o.invalidAnimationCache();
            }
        }
    }

    hide() {
        this.node.active = false;
    }

    show() {
        var e, t;
        this.node.active = true;
        this._hideLoadingText();
        null === (e = this.scheduleOnce) || void 0 === e || e.call(this, this._hideLoadingText.bind(this), 0);
        null === (t = this.getComponent(cc.Widget)) || void 0 === t || t.updateAlignment();
    }

    progress() {
    }
}
