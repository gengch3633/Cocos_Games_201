import "./index";

declare global {
    namespace cc {
        interface Node {
            _sortingPriority: number;
            _sortingEnabled: boolean;
            sortingPriority: number;
            sortingEnabled: boolean;
        }
    }
}

if (!("sortingPriority" in cc.Node.prototype)) {
    Object.defineProperty(cc.Node.prototype, "sortingPriority", {
        get(this: cc.Node): number {
            return this._sortingPriority;
        },
        set(this: cc.Node, value: number): void {
            this._sortingPriority = value;
        },
        enumerable: true
    });

    Object.defineProperty(cc.Node.prototype, "sortingEnabled", {
        get(this: cc.Node): boolean {
            return this._sortingEnabled;
        },
        set(this: cc.Node, value: boolean): void {
            this._sortingEnabled = value;
        },
        enumerable: true
    });
}