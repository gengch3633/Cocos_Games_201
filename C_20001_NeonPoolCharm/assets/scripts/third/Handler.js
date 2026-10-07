let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "45f904E+kRMvochvTCsvLk0", "Handler");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e(e, t, o, n) {
    void 0 === e&& (e = null);
    this.once = ! 1;
    this._id = 0;
    this.caller = null;
    this.method = null;
    this.args = null;
    void 0 === t&& (t = null);
    void 0 === o&& (o = null);
    void 0 === n&& (n = ! 1);
    this.setTo(e, t, o, n);
  }
  e.prototype.run = function() {
    if(null == this.method) return null;
    if(! this.caller|| cc.isValid(this.caller)) {
      var e = this._id,
      t = this.method.apply(this.caller, this.args);
      this._id === e&& this.once&& this.recover();
      return t;
    }
    this.recover();
  }
;
  e.prototype.setTo = function(t, o, n, i) {
    void 0 === i&& (i = ! 1);
    this._id = e._gid++;
    this.caller = t;
    this.method = o;
    this.args = n;
    this.once = i;
    return this;
  }
;
  e.prototype.recover = function() {
    if(this._id > 0) {
      this._id = 0;
      e._pool.push(this.clear());
    }
  }
;
  e.prototype.runWith = function(e) {
    if(null == this.method) return null;
    if(! this.caller|| cc.isValid(this.caller)) {
      var t = this._id;
      if(null == e) var o = this.method.apply(this.caller, this.args);
      else o = this.args|| e.unshift? this.args? this.method.apply(this.caller, this.args.concat(e)): this.method.apply(this.caller, e): this.method.call(this.caller, e);
      this._id === t&& this.once&& this.recover();
      return o;
    }
    this.recover();
  }
;
  e.create = function(t, o, n, i) {
    void 0 === n&& (n = null);
    void 0 === i&& (i = ! 0);
    return e._pool.length? e._pool.pop().setTo(t, o, n, i): new e(t, o, n, i);
  }
;
  e.prototype.clear = function() {
    this.caller = null;
    this.method = null;
    this.args = null;
    return this;
  }
;
  return e;
}
();
o.default = n;
n._pool = [];
n._gid = 1;
cc._RF.pop();
