import Random from "./Random";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Machine extends cc.Component {
    @property(cc.Node)
    public item: cc.Node = null;

    @property(cc.Node)
    public window: cc.Node = null;

    public isRolling: boolean = false;

    public count: number = 0;

    private itemPool: cc.NodePool = new cc.NodePool();

    public slot(content: string[], index: number, duration: number, onItem?: (label: cc.Label) => void): void {
        if (this.isRolling) {
            return;
        }
        this.isRolling = true;
        this.count = Math.round(duration / 0.1);
        this.setWindowLayoutContent(content, index, onItem);

        const offsetY: number = this.window.children[0].y + this.window.parent.y;
        cc.tween(this.window)
            .to(duration, { y: -offsetY }, { easing: "sineInOut" })
            .call(() => {
                this.isRolling = false;
            })
            .start();
    }

    public scroll(content: string[], startY: number, targetIndex: number, duration: number, onItem?: (label: cc.Label) => void): void {
        if (this.isRolling) {
            return;
        }
        this.isRolling = true;
        this.setScrollLayoutContent(content, startY, onItem);

        const offsetY: number = this.window.children[targetIndex].y + this.window.parent.height / 2;
        cc.tween(this.window)
            .to(duration, { y: -offsetY }, { easing: "sineInOut" })
            .call(() => {
                this.isRolling = false;
            })
            .start();
    }

    private setScrollLayoutContent(content: string[], startY: number, onItem?: (label: cc.Label) => void): void {
        while (this.window.children.length > 0) {
            this.itemPool.put(this.window.children[this.window.children.length - 1]);
        }

        this.window.y = startY * this.item.height;

        for (let i = 0; i < content.length; i++) {
            this.spawnItem(content[i], this.window, onItem);
        }

        this.window.getComponent(cc.Layout).updateLayout();
    }

    private setWindowLayoutContent(content: string[], index: number, onItem?: (label: cc.Label) => void): void {
        while (this.window.children.length > 0) {
            this.itemPool.put(this.window.children[this.window.children.length - 1]);
        }

        this.window.y = 0;
        this.spawnItem(content[index], this.window, onItem);

        for (let i = 0; i < this.count; i++) {
            this.spawnItem(content[Random.range(0, content.length - 1)], this.window, onItem);
        }

        this.window.getComponent(cc.Layout).updateLayout();
    }

    private spawnItem(text: string, parent: cc.Node, onItem?: (label: cc.Label) => void): void {
        const node: cc.Node = (this.itemPool.size() > 0 ? this.itemPool.get() : cc.instantiate(this.item)) as cc.Node;
        const label: cc.Label = node.getComponent(cc.Label);

        label.string = this.renderText(text);
        label._forceUpdateRenderData();

        parent.addChild(node);

        if (onItem) {
            onItem(label);
        }
    }

    private renderText(text: string): string {
        const str: string = text + "";
        const parts: string[] = str.split("/n");
        return parts.length > 1 ? parts[0] + "\n" + parts[1] : str;
    }
}