import RedDotNode from "./RedDotNode";
import Singleton from "./Singleton";

export default class RedDotMgr extends Singleton {
    root: RedDotNode = new RedDotNode("RedDotMgr_Root");

    addRedDot(node: RedDotNode): void {
        this.root.addChild(node);
    }

    getRedDot(id: string): RedDotNode {
        return this.findChild(id, this.root);
    }

    findChild(id: string, parent: RedDotNode): RedDotNode {
        if (!parent) {
            return null;
        }
        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i].id == id) {
                return parent.children[i];
            }
        }
        for (let i = 0; i < parent.children.length; i++) {
            const found = this.findChild(id, parent.children[i]);
            if (found) {
                return found;
            }
        }
        return null;
    }
}
