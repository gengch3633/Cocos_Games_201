let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "10386zXK8pEY4gEg0Z6A6jb", "EncryptXOR");
var n = __extends;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var a = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.key = 15;
    return t;
  }
  n(t, e);
  t.prototype.encrypt = function(e) {
    return this.textFormat(e);
  }
;
  t.prototype.decrypt = function(e) {
    return this.textFormat(e);
  }
;
  t.prototype.textFormat = function(e) {
    var t = this,
    i = this.encode(e);
    i.forEach(function(e, n) {
      i[n] = e ^ t.key;
    }
);
    return this.decode(i);
  }
;
  t.prototype.encode = function(e) {
    return unescape(encodeURIComponent(e)).split("").map(function(e) {
      return e.charCodeAt(0);
    }
);
  }
;
  t.prototype.decode = function(e) {
    var t = e.map(function(e) {
      return String.fromCharCode(e);
    }
);
    return decodeURIComponent(escape(t.join("")));
  }
;
  return t;
}
(e("Singleton").default);
i.default = a;
cc._RF.pop();
