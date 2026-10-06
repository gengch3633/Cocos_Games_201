let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "d4f5c8C2MpHLZUxHBuArBKs", "Pool");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e(e) {
    void 0 === e&& (e = 0);
    this.lendArr = [];
    this.arr = [];
    this.validAction = function() {
      return ! 0;
    }
;
    this._isInit = ! 1;
    this._capacity = 0;
    this._capacity = e;
  }
  Object.defineProperty(e.prototype, "isInit", {
    get: function() {
      return this._isInit;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  e.prototype.setCreateAction = function(e) {
    this.createAction = e;
    this._isInit = ! 0;
    return this;
  }
;
  e.prototype.setValidAction = function(e) {
    this.validAction = e;
    return this;
  }
;
  Object.defineProperty(e.prototype, "size", {
    get: function() {
      return this.arr.length;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "capacity", {
    get: function() {
      return this._capacity;
    }
, set: function(e) {
      this._capacity = e;
      this.resize();
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  e.prototype.resize = function() {
    var e,
    t = this.arr.length+ this.lendArr.length- this._capacity;
    if(!(t <= 0)) for(var i = 0;
    i < t;
    i++) null !== (e = this.arr.shift())&& void 0 !== e|| this.lendArr.shift();
  }
;
  e.prototype.get = function() {
    var e = null;
    if(this.arr.length > 0) e = this.arr.shift();
    else if(this._capacity <= 0|| this._capacity > this.lendArr.length) {
      if(! this.createAction) return null;
      e = this.createAction();
    } else {
      if(!(this.lendArr.length > 0)) return null;
      e = this.lendArr.shift();
    }
    return this.validAction(e)?(this.lendArr.indexOf(e) < 0&& this.lendArr.push(e), e): this.get();
  }
;
  e.prototype.put = function(e) {
    if(! this.validAction(e)) {
      var t = this.lendArr.indexOf(e);
      t >= 0&& this.lendArr.splice(t, 1);
      return ! 1;
    }
    if(this.arr.indexOf(e) >= 0) return ! 1;
    var i = this.lendArr.indexOf(e);
    i >= 0&& this.lendArr.splice(i, 1);
    this.arr.push(e);
    return ! 0;
  }
;
  e.prototype.getLendArr = function() {
    return this.lendArr;
  }
;
  e.prototype.recoverAllLends = function() {
    for(var e, t;
(null === (e = this.lendArr)|| void 0 === e? void 0: e.length) > 0;
) {
      var i = null === (t = this.lendArr)|| void 0 === t? void 0: t.shift();
      this.put(i);
    }
  }
;
  e.prototype.clear = function() {
    this.lendArr = [];
    this.arr = [];
  }
;
  return e;
}
();
i.default = n;
cc._RF.pop();
