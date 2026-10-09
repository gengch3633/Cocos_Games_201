const { ccclass } = cc._decorator;

@ccclass
export default class PowerBarComp extends cc.Component {
    callback = null;
    callback_update = null;
    valueY = null;

    onLoad() {
        var e = this,
            t = this.node.getChildByName("node_powerbars"),
            o = t.children;
        this.callback = this.callback || null;
        this.callback_update = this.callback_update || null;
        this.valueY = 0;
        this.node.on(cc.Node.EventType.TOUCH_START, function (n) {
            console.log("TOUCH_START", n);
            var i = n.touch._point;
            e.valueY = 0;
            i = n.touch._point, n.touch._prevPoint;
            for (var a = t.convertToNodeSpaceAR(i), r = 0; r < o.length; r++) {
                if (o[r].y > a.y) o[r].opacity = 0;else {
                    o[r].opacity = 255;
                    e.valueY = e.valueY + 1;
                }
            }
            e.callback_update && e.callback_update(e.getPercent());
            e.updateLabel();
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (n) {
            var i = n.touch._point,
                a = n.touch._prevPoint;
            i.y, a.y;
            e.valueY = 0;
            var r = t.convertToNodeSpaceAR(i);
            console.log("p ", r.y);
            for (var l = 0; l < o.length; l++) {
                if (o[l].y > r.y) o[l].opacity = 0;else {
                    o[l].opacity = 255;
                    e.valueY = e.valueY + 1;
                }
            }
            e.callback_update && e.callback_update(e.getPercent());
            e.updateLabel();
        });
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            console.log("TOUCH_END", e.valueY);
            e.hideAllBars();
            e.callback && e.callback(e.getPercent());
            e.clearLabel();
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            console.log("TOUCH_CANCEL", e.valueY);
            e.hideAllBars();
            e.callback && e.callback(e.getPercent());
            e.clearLabel();
        });
        e.hideAllBars();
    }

    hideAllBars() {
        for (var e = this.node.getChildByName("node_powerbars").children, t = 0; t < e.length; t++) e[t].opacity = 0;
    }

    getPercent() {
        return this.valueY / 11;
    }

    setCallBack(e) {
        this.callback = e;
    }

    setCallBack_update(e) {
        this.callback_update = e;
    }

    updateLabel() {
        var e = cc.find("label_value", this.node);
        e && (e.getComponent(cc.Label).string = Math.floor(100 * this.getPercent()));
    }

    clearLabel() {
        var e = cc.find("label_value", this.node);
        e && (e.getComponent(cc.Label).string = "");
    }

    applyByPower(e) {
        var t = cc.find("label_value", this.node);
        t && (t.getComponent(cc.Label).string = e);
    }
}
