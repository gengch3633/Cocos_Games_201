const { ccclass } = cc._decorator;

@ccclass
export class Locator {
    static locating = false;
    static startTime = 0;
    static timeout = 5000;

    static parse(locator: string): { symbol: string; name: string }[] {
        cc.assert(locator, "locator string is null");
        return locator.split(/[.,/ /,>,#]/g).map((part) => {
            const idx = locator.indexOf(part);
            return {
                symbol: locator[idx - 1] || ">",
                name: part.trim(),
            };
        });
    }

    static seekNodeByName(root: cc.Node, name: string): cc.Node {
        if (!root) {
            return null;
        }
        if (root.name == name) {
            return root;
        }
        const children = root.children;
        const count = children.length;
        for (let i = 0; i < count; i++) {
            const child = children[i];
            const found = this.seekNodeByName(child, name);
            if (found != null) {
                return found;
            }
        }
        return null;
    }

    static locateNode(root: cc.Node, locator: string, callback?: (err: any, node?: cc.Node) => void): cc.Node {
        root = cc.find("Canvas");
        if (!this.locating) {
            this.startTime = Date.now();
            this.locating = true;
        }
        const parts = this.parse(locator);
        cc.assert(parts && parts.length);
        let current: cc.Node = root;
        let next: cc.Node;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            switch (part.symbol) {
                case "/":
                    next = current.getChildByName(part.name);
                    break;
                case ".":
                    next = current[part.name];
                    break;
                case ">":
                    next = this.seekNodeByName(current, part.name);
            }
            if (!next) {
                current = null;
                break;
            }
            current = next;
        }
        if (current && current.active && callback) {
            this.locating = false;
            callback(null, current);
        } else if (callback) {
            if (Date.now() - this.startTime > this.timeout) {
                callback({ error: "timeout", locator });
            } else {
                console.log("定位节点失败");
                setTimeout(() => {
                    this.locateNode(root, locator, callback);
                }, 30);
            }
        }
        return current;
    }

    static getNodeFullPath(node: cc.Node): string {
        const parts: string[] = [];
        let current: cc.Node = node;
        do {
            parts.unshift(current.name);
            current = current.parent;
        } while (current && current.name !== "Canvas");
        return parts.join("/");
    }
}
