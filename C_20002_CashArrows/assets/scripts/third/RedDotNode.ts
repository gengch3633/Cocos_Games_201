export default class RedDotNode {
    static EventType = {
        COUNT_CHANGED: "RedDotNode.CountChanged",
    };

    id: string;
    parent: RedDotNode | null = null;
    children: RedDotNode[] = [];
    countAction: (() => number) | null = null;
    nodes: cc.Node[] = [];

    constructor(id: string, countAction: (() => number) | null = null) {
        if (id == null) {
            throw new Error("id 不能为 null 或 undefined");
        }
        this.id = id;
        this.countAction = countAction;
    }

    setParent(parent: RedDotNode | null): this {
        if (parent === this) {
            return this;
        }
        this.parent?.removeChild(this);
        this.parent = parent;
        return this;
    }

    addChild(child: RedDotNode): this {
        if (!child || this.children.includes(child)) {
            return this;
        }
        child.setParent(this);
        this.children.push(child);
        return this;
    }

    removeChild(child: RedDotNode): this {
        if (!child) {
            return this;
        }
        const index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
            child.parent = null;
        }
        return this;
    }

    removeAllChildren(): this {
        this.children.forEach((child) => {
            child.parent = null;
        });
        this.children = [];
        return this;
    }

    removeFromParent(): this {
        this.parent && this.parent.removeChild(this);
        return this;
    }

    getChildById(id: string): RedDotNode | null {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child.id === id) {
                return child;
            }
        }
        return null;
    }

    setCountAction(action: () => number): this {
        this.countAction = action;
        return this;
    }

    getCount(): number {
        let count = this.countAction ? this.countAction() : 0;
        this.children.forEach((child) => {
            count += child.getCount();
        });
        return count;
    }

    addAttachedNode(node: cc.Node): this {
        if (this.nodes.indexOf(node) >= 0) {
            return this;
        }
        this.nodes.push(node);
        return this;
    }

    removeAttachedNode(node: cc.Node): this {
        const index = this.nodes.indexOf(node);
        if (index >= 0) {
            this.nodes.splice(index, 1);
        }
        return this;
    }

    removeAllAttachedNodes(): this {
        this.nodes.length = 0;
        return this;
    }

    notify(): void {
        this.nodes.forEach((node) => {
            if (node?.isValid) {
                node.emit(RedDotNode.EventType.COUNT_CHANGED, this.id, this.getCount());
            }
        });
        this.children.forEach((child) => {
            child.notify();
        });
    }
}
