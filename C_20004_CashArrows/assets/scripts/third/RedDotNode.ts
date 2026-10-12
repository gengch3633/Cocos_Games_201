export default class RedDotNode {
    public static readonly EventType = {
        COUNT_CHANGED: "RedDotNode.CountChanged"
    };

    public parent: RedDotNode = null;
    public children: RedDotNode[] = [];
    public countAction: (() => number) | null = null;
    public nodes: cc.Node[] = [];
    public id: string;

    constructor(id: string, countAction: (() => number) | null = null) {
        if (id === null || id === undefined) {
            throw new Error("id 不能为 null 或 undefined");
        }
        this.id = id;
        this.countAction = countAction;
    }

    public setParent(parent: RedDotNode): this {
        if (parent === this) {
            return this;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.parent = parent;
        return this;
    }

    public addChild(child: RedDotNode): this {
        if (!child || this.children.includes(child)) {
            return this;
        }
        child.setParent(this);
        this.children.push(child);
        return this;
    }

    public removeChild(child: RedDotNode): this {
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

    public removeAllChildren(): this {
        this.children.forEach((child) => {
            child.parent = null;
        });
        this.children = [];
        return this;
    }

    public removeFromParent(): this {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        return this;
    }

    public getChildById(id: string): RedDotNode | null {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child.id === id) {
                return child;
            }
        }
        return null;
    }

    public setCountAction(countAction: (() => number) | null): this {
        this.countAction = countAction;
        return this;
    }

    public getCount(): number {
        let count = this.countAction ? this.countAction() : 0;
        this.children.forEach((child) => {
            count += child.getCount();
        });
        return count;
    }

    public addAttachedNode(node: cc.Node): this {
        if (this.nodes.indexOf(node) >= 0) {
            return this;
        }
        this.nodes.push(node);
        return this;
    }

    public removeAttachedNode(node: cc.Node): this {
        const index = this.nodes.indexOf(node);
        if (index >= 0) {
            this.nodes.splice(index, 1);
        }
        return this;
    }

    public removeAllAttachedNodes(): this {
        this.nodes.length = 0;
        return this;
    }

    public notify(): void {
        this.nodes.forEach((node) => {
            if (node && node.isValid) {
                node.emit(RedDotNode.EventType.COUNT_CHANGED, this.id, this.getCount());
            }
        });
        this.children.forEach((child) => {
            child.notify();
        });
    }
}