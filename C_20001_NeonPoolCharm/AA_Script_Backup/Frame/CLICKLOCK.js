let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "0f8f5RQn5JF2oytopeur4Nn", "CLICKLOCK");
Object.defineProperty(a, "__esModule", {
  value: ! 0
}
);
a.CLICKLOCK = void 0;
a.CLICKLOCK = function(e) {
  void 0 === e&& (e = .5);
  return function(t, a, o) {
    var n = o.value,
    i = ! 1;
    o.value = function() {
      for(var t = [], o = 0;
      o < arguments.length;
      o++) t[o] = arguments[o];
      if(i) console.log("跳过了", this.name, a);
      else {
        i = ! 0;
        setTimeout(function() {
          i = ! 1;
        }
, 1e3* e);
        n.apply(this, t);
      }
    }
;
    return o;
  }
;
}
;
cc._RF.pop();
