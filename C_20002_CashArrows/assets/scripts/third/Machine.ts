import Random from "./Random";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Machine extends cc.Component {
    @property(cc.Node)
    item: cc.Node | null = null;

    @property(cc.Node)
    window: cc.Node | null = null;

    isRolling = false;
    count = 0;
    itemPool = new cc.NodePool();

    slot(items: string[], targetIndex: number, duration: number, onSpawn?: (label: cc.Label) => void): void {
        if (this.isRolling || !this.window) {
            return;
        }
        this.isRolling = true;
        this.count = Math.round(duration / 0.1);
        this.setWindowLayoutContent(items, targetIndex, onSpawn || null);
        const offsetY = this.window.children[0].y + this.window.parent!.y;
        cc.tween(this.window)
            .to(duration, { y: -offsetY }, { easing: "sineInOut" })
            .call(() => {
                this.isRolling = false;
            })
            .start();
    }

    scroll(items: string[], startIndex: number, targetIndex: number, duration: number, onSpawn?: (label: cc.Label) => void): void {
        if (this.isRolling || !this.window) {
            return;
        }
        this.isRolling = true;
        this.setScrollLayoutContent(items, startIndex, onSpawn || null);
        const offsetY = this.window.children[targetIndex].y + this.window.parent!.height / 2;
        cc.tween(this.window)
            .to(duration, { y: -offsetY }, { easing: "sineInOut" })
            .call(() => {
                this.isRolling = false;
            })
            .start();
    }

    setScrollLayoutContent(items: string[], startIndex: number, onSpawn: ((label: cc.Label) => void) | null): void {
        if (!this.window) {
            return;
        }
        while (this.window.children.length > 0) {
            this.itemPool.put(this.window.children[this.window.children.length - 1]);
        }
        this.window.y = startIndex * (this.item?.height || 0);
        for (let i = 0; i < items.length; i++) {
            this.spawnItem(items[i], this.window, onSpawn);
        }
        this.window.getComponent(cc.Layout)!.updateLayout();
    }

    setWindowLayoutContent(items: string[], targetIndex: number, onSpawn: ((label: cc.Label) => void) | null): void {
        if (!this.window) {
            return;
        }
        while (this.window.children.length > 0) {
            this.itemPool.put(this.window.children[this.window.children.length - 1]);
        }
        this.window.y = 0;
        this.spawnItem(items[targetIndex], this.window, onSpawn);
        for (let i = 0; i < this.count; i++) {
            this.spawnItem(items[Random.range(0, items.length - 1)], this.window, onSpawn);
        }
        this.window.getComponent(cc.Layout)!.updateLayout();
    }

    spawnItem(text: string, parent: cc.Node, onSpawn: ((label: cc.Label) => void) | null): void {
        const node = this.itemPool.size() > 0 ? this.itemPool.get()! : cc.instantiate(this.item!);
        const label = node.getComponent(cc.Label)!;
        label.string = this.renderText(text);
        (label as cc.Label & { _forceUpdateRenderData?: () => void })._forceUpdateRenderData?.();
        parent.addChild(node);
        if (onSpawn) {
            onSpawn(label);
        }
    }

    renderText(value: string): string {
        const text = value == null ? "" : value + "";
        const parts = text.split("/n");
        return parts.length > 1 ? parts[0] + "\n" + parts[1] : text;
    }
}
