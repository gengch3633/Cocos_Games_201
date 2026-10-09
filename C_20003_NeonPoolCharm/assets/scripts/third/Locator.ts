const { ccclass } = cc._decorator;

@ccclass
export class Locator {

    static locating;
    static startTime;
    static timeout;

    static parse(locator) {
        cc.assert(locator, "locator string is null");
        return locator.split(/[.,\/\/,>,#]/g).map(function (name) {
            const index = locator.indexOf(name);
            return {
                symbol: locator[index - 1] || ">",
                name: name.trim()
            };
        });
    }

    static seekNodeByName(node, name) {
        if (!node) {
            return null;
        }
        if (node.name == name) {
            return node;
        }
        const children = node.children;
        const count = children.length;
        for (let i = 0; i < count; i++) {
            const child = children[i];
            const found = this.seekNodeByName(child, name);
            if (null != found) {
                return found;
            }
        }
        return null;
    }

    static locateNode(root, locator, callback) {
        const self = this;
        root = cc.find("Canvas");
        if (!Locator.locating) {
            this.startTime = Date.now();
            this.locating = true;
        }
        const parts = Locator.parse(locator);
        cc.assert(parts && parts.length);
        let current;
        let node = root;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            switch (part.symbol) {
                case "/":
                    current = node.getChildByName(part.name);
                    break;
                case ".":
                    current = node[part.name];
                    break;
                case ">":
                    current = this.seekNodeByName(node, part.name);
            }
            if (!current) {
                node = null;
                break;
            }
            node = current;
        }
        if (node && node.active && callback) {
            this.locating = false;
            callback(null, node);
        } else if (callback) {
            if (Date.now() - this.startTime > this.timeout) {
                callback({
                    error: "timeout",
                    locator: locator
                });
            } else {
                console.log("定位节点失败");
                setTimeout(function () {
                    self.locateNode(root, locator, callback);
                }, 30);
            }
        }
        return node;
    }

    static getNodeFullPath(node) {
        const names = [];
        let current = node;
        do {
            names.unshift(current.name);
            current = current.parent;
        } while (current && "Canvas" !== current.name);
        return names.join("/");
    }
}
