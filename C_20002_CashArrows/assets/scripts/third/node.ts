import { NodeMemPool } from "./index";

void NodeMemPool;

if (!("sortingPriority" in cc.Node.prototype)) {
    Object.defineProperty(cc.Node.prototype, "sortingPriority", {
        get: function () {
            return (this as any)._sortingPriority;
        },
        set: function (e) {
            (this as any)._sortingPriority = e;
        },
        enumerable: true
    });
    Object.defineProperty(cc.Node.prototype, "sortingEnabled", {
        get: function () {
            return (this as any)._sortingEnabled;
        },
        set: function (e) {
            (this as any)._sortingEnabled = e;
        },
        enumerable: true
    });
}
