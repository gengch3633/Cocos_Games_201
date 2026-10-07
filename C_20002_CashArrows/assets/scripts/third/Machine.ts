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

    slot(items: any[], targetIndex: number, duration: number, onSpawn?: (label: cc.Label) => void): void {
        if (!this.isRolling) {
            this.isRolling = true;
            this.count = Math.round(duration / 0.1);
            this.setWindowLayoutContent(items, targetIndex, onSpawn);
            const offsetY = this.window.children[0].y + this.window.parent.y;
            cc.tween(this.window).to(duration, {
                y: -offsetY
            }, {
                easing: "sineInOut"
            }).call(() => {
                this.isRolling = false;
            }).start();
        }
    }

    scroll(items: any[], startIndex: number, targetIndex: number, duration: number, onSpawn?: (label: cc.Label) => void): void {
        if (!this.isRolling) {
            this.isRolling = true;
            this.setScrollLayoutContent(items, startIndex, onSpawn);
            const offsetY = this.window.children[targetIndex].y + this.window.parent.height / 2;
            cc.tween(this.window).to(duration, {
                y: -offsetY
            }, {
                easing: "sineInOut"
            }).call(() => {
                this.isRolling = false;
            }).start();
        }
    }

    setScrollLayoutContent(items: any[], startIndex: number, onSpawn?: (label: cc.Label) => void): void {
        while (this.window.children.length > 0) {
            this.itemPool.put(this.window.children[this.window.children.length - 1]);
        }
        this.window.y = startIndex * this.item.height;
        for (let i = 0; i < items.length; i++) {
            this.spawnItem(items[i], this.window, onSpawn);
        }
        this.window.getComponent(cc.Layout).updateLayout();
    }

    setWindowLayoutContent(items: any[], targetIndex: number, onSpawn?: (label: cc.Label) => void): void {
        while (this.window.children.length > 0) {
            this.itemPool.put(this.window.children[this.window.children.length - 1]);
        }
        this.window.y = 0;
        this.spawnItem(items[targetIndex], this.window, onSpawn);
        for (let i = 0; i < this.count; i++) {
            this.spawnItem(items[Random.range(0, items.length - 1)], this.window, onSpawn);
        }
        this.window.getComponent(cc.Layout).updateLayout();
    }

    spawnItem(text: any, parent: cc.Node, onSpawn?: (label: cc.Label) => void): void {
        const node = this.itemPool.size() > 0 ? this.itemPool.get() : cc.instantiate(this.item);
        const label = node.getComponent(cc.Label);
        label.string = this.renderText(text);
        label._forceUpdateRenderData();
        parent.addChild(node);
        if (onSpawn) {
            onSpawn(label);
        }
    }

    renderText(text: any): string {
        const value = text += "";
        const parts = value == null ? void 0 : value.split("/n");
        return parts.length > 1 ? parts[0] + "\n" + parts[1] : value;
    }
}
