export default class RedDotNode {
    parent: RedDotNode = null;
    children: RedDotNode[] = [];
    countAction: (() => number) | null = null;
    nodes: cc.Node[] = [];
    id: string;

    static EventType = {
        COUNT_CHANGED: "RedDotNode.CountChanged"
    };

    constructor(id: string, countAction: (() => number) | null = null) {
        if (null == id) {
            throw new Error("id 不能为 null 或 undefined");
        }
        this.id = id;
        this.countAction = countAction;
    }

    setParent(parent: RedDotNode) {
        var currentParent;
        return parent === this ? this : (null === (currentParent = this.parent) || void 0 === currentParent || currentParent.removeChild(this), this.parent = parent, this);
    }

    addChild(child: RedDotNode) {
        return !child || this.children.includes(child) ? this : (child.setParent(this), this.children.push(child), this);
    }

    removeChild(child: RedDotNode) {
        if (!child) {
            return this;
        }
        var index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
            child.parent = null;
        }
        return this;
    }

    removeAllChildren() {
        this.children.forEach(function (child) {
            return child.parent = null;
        });
        this.children = [];
        return this;
    }

    removeFromParent() {
        this.parent && this.parent.removeChild(this);
        return this;
    }

    getChildById(id: string) {
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            if (child.id === id) {
                return child;
            }
        }
        return null;
    }

    setCountAction(action: () => number) {
        this.countAction = action;
        return this;
    }

    getCount() {
        var count = this.countAction ? this.countAction() : 0;
        this.children.forEach(function (child) {
            count += child.getCount();
        });
        return count;
    }

    addAttachedNode(node: cc.Node) {
        return this.nodes.indexOf(node) >= 0 ? this : (this.nodes.push(node), this);
    }

    removeAttachedNode(node: cc.Node) {
        var index = this.nodes.indexOf(node);
        index >= 0 && this.nodes.splice(index, 1);
        return this;
    }

    removeAllAttachedNodes() {
        this.nodes.length = 0;
        return this;
    }

    notify() {
        var self = this;
        this.nodes.forEach(function (node) {
            (null == node ? void 0 : node.isValid) && (null == node || node.emit(RedDotNode.EventType.COUNT_CHANGED, self.id, self.getCount()));
        });
        this.children.forEach(function (child) {
            return child.notify();
        });
    }
}
