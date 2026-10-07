let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "b980eC2QTZE27QcGt+v0T0J", "AbTestMgr");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
  }
  e.prototype.init = function(e) {
    if(e) {
      var t = e.ab_info;
      if(t) {
        var o = t.ab_props_num,
        n = t.ab_add_slot,
        i = t.ab_get_prop_2,
        a = t.ab_add_slot_price;
        this.ab_props_num = o;
        this.ab_add_slot = n;
        this.ab_add_slot_price = a;
        this.ab_get_prop_2 = i;
      }
    }
  }
;
  e.getInstance = function() {
    this._instance|| (this._instance = new e());
    return this._instance;
  }
;
  e._instance = new e();
  return e;
}
();
o.default = n.getInstance();
cc._RF.pop();
