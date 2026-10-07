let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "69690MaI2hMQZrH1ShdyAP1", "NodePool");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e("EngineUtil.js"),
i = {
}
,
a = {
}
,
r = function() {
  function e() {
    this._pathList = null;
  }
  Object.defineProperty(e, "Instance", {
    get: function() {
      null == e._instance&& (e._instance = new e());
      return e._instance;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  e.prototype.loadPool = function(e, t) {
    var o = this;
    Array.isArray(e)|| (e = [e]);
    for(var n = [], i = 0;
    i < e.length;
    i++) n.push(this._pathList[e[i]]);
    cc.resources.load(n, cc.Prefab, function(e) {
      Array.isArray(e)|| (e = [e]);
      for(var n = 0;
      n < e.length;
      n++) {
        var i = e[n].name;
        o.hasPool(i)|| o.initPool(i, e[n]);
      }
      t&& t();
    }
);
  }
;
  e.prototype.addPath = function(e) {
    this._pathList = this._pathList|| {
    }
;
    Array.isArray(e)|| (e = [e]);
    for(var t = 0;
    t < e.length;
    t++) {
      var o = cc.path.basename(e[t]);
      this._pathList[o] = this._pathList[o]|| e[t];
    }
    console.log(this._pathList);
  }
;
  e.prototype.putNode = function(e, t) {
    if(cc.isValid(t)) {
      var o = i[e];
      if(o) {
        if(!(o.findIndex(function(e) {
          return e == t;
        }
) >= 0)) {
          t.stopAllActions();
          t.removeFromParent(! 0);
          t.x = 0;
          t.y = 0;
          t.scale = 1;
          t.opacity = 255;
          t.active = ! 1;
          o.push(t);
        }
      } else console.error("putNode: pool %s not found", e);
    } else console.error("putNode: node param is invalid");
  }
;
  e.prototype.getNode = function(e) {
    var t = i[e];
    if(! t) {
      console.error("getNode: pool %s not found", e);
      return null;
    }
    var o = t.length > 0? t.pop(): cc.instantiate(a[e]);
(o = cc.isValid(o)? o: cc.instantiate(a[e])).active = ! 0;
    o.x = 0;
    o.y = 0;
    return o;
  }
;
  e.prototype.getPool = function() {
    return i;
  }
;
  e.prototype.hasPool = function(e) {
    return a[e]&& a[e].isValid;
  }
;
  e.prototype.reset = function() {
    if(i) {
      var e = i;
      for(var t in e) for(var o = e[t];
      o.length > 0;
) n.default.destroyNode(o.pop());
    }
  }
;
  e.prototype._test = function() {
    console.log(i);
  }
;
  e.prototype.initPool = function(e, t, o) {
    void 0 === t&& (t = 1);
    void 0 === o&& (o = "");
    o|| (o = e.name);
    if(! this.hasPool(o)) {
      if(i[o]) for(var r = 0, l = i[o];
      r < l.length;
      r++) {
        var s = l[r];
        n.default.destroyNode(s);
      }
      i[o] = [];
      a[o] = e;
      for(var c = 0;
      c < t;
      c++) {
        var u = cc.instantiate(e);
        u.active = ! 1;
        i[o].push(u);
      }
    }
  }
;
  e._instance = null;
  return e;
}
();
o.default = r;
cc._RF.pop();
