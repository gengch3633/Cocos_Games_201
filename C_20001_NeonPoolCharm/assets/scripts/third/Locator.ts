const { ccclass } = cc._decorator;

interface LocatorStep {
    symbol: string;
    name: string;
}

@ccclass
export class Locator {
    static locating = false;
    static startTime = 0;
    static timeout: number;

    static parse(locator: string): LocatorStep[] {
        cc.assert(!!locator, "locator string is null");
        return locator.split(/[.,\/\/,>,#]/g).map((part) => {
            const index = locator.indexOf(part);
            return {
                symbol: locator[index - 1] || ">",
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
        for (let i = 0; i < children.length; i++) {
            const found = this.seekNodeByName(children[i], name);
            if (found != null) {
                return found;
            }
        }
        return null;
    }

    static locateNode(
        _root: cc.Node,
        locator: string,
        callback?: (err: { error: string; locator: string } | null, node?: cc.Node) => void
    ): cc.Node {
        const canvas = cc.find("Canvas");
        if (!Locator.locating) {
            Locator.startTime = Date.now();
            Locator.locating = true;
        }
        const steps = Locator.parse(locator);
        cc.assert(steps && steps.length);
        let current: cc.Node = canvas;
        let found: cc.Node = null;
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            switch (step.symbol) {
                case "/":
                    found = current.getChildByName(step.name);
                    break;
                case ".":
                    found = current[step.name];
                    break;
                case ">":
                    found = this.seekNodeByName(current, step.name);
                    break;
            }
            if (!found) {
                current = null;
                break;
            }
            current = found;
        }
        if (current && current.active && callback) {
            Locator.locating = false;
            callback(null, current);
        } else if (callback) {
            if (Date.now() - Locator.startTime > Locator.timeout) {
                callback({ error: "timeout", locator });
            } else {
                console.log("定位节点失败");
                setTimeout(() => {
                    Locator.locateNode(canvas, locator, callback);
                }, 30);
            }
        }
        return current;
    }

    static getNodeFullPath(node: cc.Node): string {
        const parts: string[] = [];
        let current = node;
        do {
            parts.unshift(current.name);
            current = current.parent;
        } while (current && current.name !== "Canvas");
        return parts.join("/");
    }
}
