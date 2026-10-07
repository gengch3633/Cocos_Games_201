let e = require;
let t = module;
"use strict";
cc._RF.push(t, "acd07CUcxBDQZHeR0iLCvrI", "node");
e("index").NodeMemPool;
if(!("sortingPriority" in cc.Node.prototype)) {
  Object.defineProperty(cc.Node.prototype, "sortingPriority", {
    get: function() {
      return this._sortingPriority;
    }
, set: function(e) {
      this._sortingPriority = e;
    }
, enumerable: ! 0
  }
);
  Object.defineProperty(cc.Node.prototype, "sortingEnabled", {
    get: function() {
      return this._sortingEnabled;
    }
, set: function(e) {
      this._sortingEnabled = e;
    }
, enumerable: ! 0
  }
);
}
cc._RF.pop();
