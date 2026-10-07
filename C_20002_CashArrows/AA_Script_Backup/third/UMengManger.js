let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "9e233OmWiZKfrKYnnpPRxAr", "UMengManger");
var n = __extends;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var a = e("MultiPlatform"),
o = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.enable = ! 0;
    return t;
  }
  n(t, e);
  t.prototype.trackEvent = function(e, t) {
    if(this.enable) {
      var i = a.default.getInstance().uma;
      i&& i.trackEvent(e, t);
    }
  }
;
  return t;
}
(e("Singleton").default);
i.default = o;
cc._RF.pop();
