import RedDotNode from "./RedDotNode";
import Singleton from "./Singleton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RedDotMgr extends Singleton {
    public root: RedDotNode = new RedDotNode("RedDotMgr_Root");

    public addRedDot(id: string): void {
        this.root.addChild(id);
    }

    public getRedDot(id: string): RedDotNode {
        return this.findChild(id, this.root);
    }

    public findChild(id: string, node: RedDotNode): RedDotNode {
        if (!node) return null;
        for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].id === id) return node.children[i];
        }
        for (let i = 0; i < node.children.length; i++) {
            const child = this.findChild(id, node.children[i]);
            if (child) return child;
        }
        return null;
    }
}