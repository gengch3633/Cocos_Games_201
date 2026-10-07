let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "ac3faKcAs5B5oG/wH4jz35b", "UserArchive");
var n = __decorate,
a = __spreadArrays;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
i.nonSerialized = void 0;
var o = e("ArchiveMgr"),
r = e("Watch"),
s = e("Common"),
l = "_$nonSerializedKeys";
function c() {
  return function(e, t) {
    var i = e[l];
    if(! i) {
      i = [];
      e[l] = i;
    }
    i.push(t);
  }
;
}
i.nonSerialized = c;
var u = function() {
  function e(e, t) {
    void 0 === t&& (t = 0);
    this._$serverIndex = - 1;
    this._$watch = null;
    this._$version = 0;
    this._id = "";
    this._$key = s.default.version+ "_"+ e;
    if(t <= 0) {
      var i = 0;
      e.split("").forEach(function(e) {
        return i+= e.charCodeAt(0);
      }
);
      t = i = 6+ i% 20;
    }
    this._$serverIndex = t;
  }
  e.getInstance = function() {
    if(! this._ins) {
      var e = new this();
      e.create();
      this._ins = e._$watch;
    }
    return this._ins;
  }
;
  e.prototype.create = function() {
    this._id = "UserArchive_"+ this._$key+ "_"+ Date.now();
    var e = ! 0,
    t = o.default.getInstance().get(this._$key, this._$serverIndex);
    if(t&& (null == t? void 0: t._$version)) {
      Object.assign(this, t);
      e = ! 1;
    }
    this.init(e);
    this._$watch = r.default.create(this);
    o.default.getInstance().register(this);
  }
;
  e.prototype.on = function(e, t) {
    for(var i, n = [], o = 2;
    o < arguments.length;
    o++) n[o- 2] = arguments[o];
(i = this._$watch).on.apply(i, a([e, t], n));
  }
;
  e.prototype.once = function(e, t) {
    for(var i, n = [], o = 2;
    o < arguments.length;
    o++) n[o- 2] = arguments[o];
(i = this._$watch).once.apply(i, a([e, t], n));
  }
;
  e.prototype.off = function(e, t) {
    for(var i, n = [], o = 2;
    o < arguments.length;
    o++) n[o- 2] = arguments[o];
(i = this._$watch).off.apply(i, a([e, t], n));
  }
;
  e.prototype.targetOff = function(e) {
    this._$watch.targetOff(e);
  }
;
  e.prototype.clearAllEvent = function() {
    this._$watch.clearAllEvent();
  }
;
  e.prototype.toJSON = function() {
    var e = {
    }
,
    t = this[l];
    for(var i in this) if(Object.prototype.hasOwnProperty.call(this, i)) {
      if(t&& - 1 !== t.indexOf(i)) continue;
      var n = this[i];
      e[i] = n;
    }
    return e;
  }
;
  n([c()], e.prototype, "_$key", void 0);
  n([c()], e.prototype, "_$serverIndex", void 0);
  n([c()], e.prototype, "_$watch", void 0);
  n([r.ignoreWatch()], e.prototype, "_$version", void 0);
  n([c(), r.ignoreWatch()], e.prototype, "_id", void 0);
  return e;
}
();
i.default = u;
cc._RF.pop();
