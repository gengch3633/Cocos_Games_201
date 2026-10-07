let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "e00ae4OtzFET5TtjAIm+CAc", "FMBaseUI");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
    this._btnNames = [];
    this._buttons = [];
    this._clickFastMap = new Map();
    this._clickInterval = 500;
    this._clickTimeMap = new Map();
  }
  e.prototype.addClickListener = function(e, t) {
    var i = this;
    this._callfunc = e;
    this._target = t;
    this._buttons = [];
    this._btnNames.forEach(function(e) {
      var t = i[e];
      t&& t instanceof cc.Button&& i._buttons.push(i[e]);
    }
);
    for(var n = 0;
    n < this._buttons.length;
    n++) {
      var a = this._buttons[n];
      a&& this._addClickListener(a);
    }
  }
;
  e.prototype.setClickFast = function(e) {
    this._buttons.includes(e)&& this._clickFastMap.set(e, ! 0);
  }
;
  e.prototype._addClickListener = function(e) {
    var t = e.node;
    t.off("click");
    t.on("click", this._clickListener, this);
  }
;
  e.prototype._clickListener = function(e) {
    var t = this._clickTimeMap.get(e),
    i = new Date().getTime(),
    n = 0;
    this._clickFastMap.has(e)|| (n = this._clickInterval);
    if(! t|| i- t >= n) {
      this._clickTimeMap.set(e, i);
      this._callfunc.apply(this._target, [e]);
    }
  }
;
  return e;
}
();
i.default = n;
cc._RF.pop();
