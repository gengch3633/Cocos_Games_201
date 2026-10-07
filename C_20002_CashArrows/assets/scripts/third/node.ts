import "./index";

if (!("sortingPriority" in cc.Node.prototype)) {
    Object.defineProperty(cc.Node.prototype, "sortingPriority", {
        get: function (this: cc.Node & { _sortingPriority?: number }) {
            return this._sortingPriority;
        },
        set: function (this: cc.Node & { _sortingPriority?: number }, value: number) {
            this._sortingPriority = value;
        },
        enumerable: true
    });
    Object.defineProperty(cc.Node.prototype, "sortingEnabled", {
        get: function (this: cc.Node & { _sortingEnabled?: boolean }) {
            return this._sortingEnabled;
        },
        set: function (this: cc.Node & { _sortingEnabled?: boolean }, value: boolean) {
            this._sortingEnabled = value;
        },
        enumerable: true
    });
}

export {};
