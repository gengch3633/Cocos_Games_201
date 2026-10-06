// @ts-nocheck
import { NodeMemPool } from "./index";

void NodeMemPool;

if (!("sortingPriority" in cc.Node.prototype)) {
    Object.defineProperty(cc.Node.prototype, "sortingPriority", {
        get: function () {
            return this._sortingPriority;
        },
        set: function (value) {
            this._sortingPriority = value;
        },
        enumerable: true,
    });
    Object.defineProperty(cc.Node.prototype, "sortingEnabled", {
        get: function () {
            return this._sortingEnabled;
        },
        set: function (value) {
            this._sortingEnabled = value;
        },
        enumerable: true,
    });
}
