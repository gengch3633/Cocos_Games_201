import "./index";

declare interface NodeSortingExt {
    _sortingPriority?: number;
    _sortingEnabled?: boolean;
    sortingPriority: number;
    sortingEnabled: boolean;
}

if (!("sortingPriority" in cc.Node.prototype)) {
    Object.defineProperty(cc.Node.prototype, "sortingPriority", {
        get: function (this: cc.Node & NodeSortingExt) {
            return this._sortingPriority;
        },
        set: function (this: cc.Node & NodeSortingExt, value: number) {
            this._sortingPriority = value;
        },
        enumerable: true,
    });
    Object.defineProperty(cc.Node.prototype, "sortingEnabled", {
        get: function (this: cc.Node & NodeSortingExt) {
            return this._sortingEnabled;
        },
        set: function (this: cc.Node & NodeSortingExt, value: boolean) {
            this._sortingEnabled = value;
        },
        enumerable: true,
    });
}
