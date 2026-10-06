import Random from "./Random";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Machine extends cc.Component {
    @property(cc.Node)
    item: cc.Node = null;

    @property(cc.Node)
    window: cc.Node = null;

    isRolling: boolean = false;
    count: number = 0;
    itemPool: cc.NodePool = new cc.NodePool();

    slot(e: any, t: any, i: any, n: any = null) {
        var a = this;
        if (!this.isRolling) {
            this.isRolling = true;
            this.count = Math.round(i / .1);
            this.setWindowLayoutContent(e, t, n);
            var o = this.window.children[0].y + this.window.parent.y;
            cc.tween(this.window).to(i, {
                y: -o
            }, {
                easing: " sineInOut "
            }).call(function () {
                a.isRolling = false;
            }).start();
        }
    }

    scroll(e: any, t: any, i: any, n: any, a: any = null) {
        var o = this;
        if (!this.isRolling) {
            this.isRolling = true;
            this.setScrollLayoutContent(e, t, a);
            var r = this.window.children[i].y + this.window.parent.height / 2;
            cc.tween(this.window).to(n, {
                y: -r
            }, {
                easing: " sineInOut "
            }).call(function () {
                o.isRolling = false;
            }).start();
        }
    }

    setScrollLayoutContent(e: any, t: any, i: any) {
        for (; this.window.children.length > 0; ) this.itemPool.put(this.window.children[this.window.children.length - 1]);
        this.window.y = t * this.item.height;
        for (var n = 0; n < e.length; n++) this.spawnItem(e[n], this.window, i);
        this.window.getComponent(cc.Layout).updateLayout();
    }

    setWindowLayoutContent(e: any, t: any, i: any) {
        for (; this.window.children.length > 0; ) this.itemPool.put(this.window.children[this.window.children.length - 1]);
        this.window.y = 0;
        this.spawnItem(e[t], this.window, i);
        for (var n = 0; n < this.count; n++) this.spawnItem(e[Random.range(0, e.length - 1)], this.window, i);
        this.window.getComponent(cc.Layout).updateLayout();
    }

    spawnItem(e: any, t: cc.Node, i: any = null) {
        var n = this.itemPool.size() > 0 ? this.itemPool.get() : cc.instantiate(this.item);
        n.getComponent(cc.Label).string = this.renderText(e);
        n.getComponent(cc.Label)._forceUpdateRenderData();
        t.addChild(n);
        i && i(n.getComponent(cc.Label));
    }

    renderText(e: any) {
        var t = null == (e += " ") ? void 0 : e.split("/ n ");
        return t.length > 1 ? t[0] + " \ n " + t[1] : e;
    }
}
