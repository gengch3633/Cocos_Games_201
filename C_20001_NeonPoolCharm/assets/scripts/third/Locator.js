let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "047d3+39FhJrKvTG/z3KHRH", "Locator");
var n = this&& this.__decorate|| function(e, t, o, n) {
  var i,
  a = arguments.length,
  r = a < 3? t: null === n? n = Object.getOwnPropertyDescriptor(t, o): n;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);
  else for(var l = e.length- 1;
  l >= 0;
  l--)(i = e[l])&& (r = (a < 3? i(r): a > 3? i(t, o, r): i(t, o))|| r);
  return a > 3&& r&& Object.defineProperty(t, o, r),
  r;
}
;
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
o.Locator = void 0;
var i = cc._decorator.ccclass,
a = function() {
  function e() {
  }
  t = e;
  e.parse = function(e) {
    cc.assert(e, "locator string is null");
    return e.split(/[., \/ \/, > , #]/ g).map(function(t) {
      var o = e.indexOf(t);
      return {
        symbol: e[o- 1]|| ">", name: t.trim()
      }
;
    }
);
  }
;
  e.seekNodeByName = function(e, t) {
    if(! e) return null;
    if(e.name == t) return e;
    for(var o = e.children, n = o.length, i = 0;
    i < n;
    i++) {
      var a = o[i],
      r = this.seekNodeByName(a, t);
      if(null != r) return r;
    }
    return null;
  }
;
  e.locateNode = function(e, o, n) {
    var i = this;
    e = cc.find("Canvas");
    if(! t.locating) {
      this.startTime = Date.now();
      this.locating = ! 0;
    }
    var a = t.parse(o);
    cc.assert(a&& a.length);
    for(var r, l = e, s = 0;
    s < a.length;
    s++) {
      var c = a[s];
      switch(c.symbol) {
        case "/": r = l.getChildByName(c.name);
        break;
        case ".": r = l[c.name];
        break;
        case ">": r = this.seekNodeByName(l, c.name);
      }
      if(! r) {
        l = null;
        break;
      }
      l = r;
    }
    if(l&& l.active&& n) {
      this.locating = ! 1;
      n(null, l);
    } else if(n) if(Date.now()- this.startTime > this.timeout) n({
      error: "timeout", locator: o
    }
);
    else {
      console.log("定位节点失败");
      setTimeout(function() {
        i.locateNode(e, o, n);
      }
, 30);
    }
    return l;
  }
;
  e.getNodeFullPath = function(e) {
    var t = [],
    o = e;
    do {
      t.unshift(o.name);
      o = o.parent;
    }
    while(o&& "Canvas" !== o.name);
    return t.join("/");
  }
;
  var t;
  return t = n([i], e);
}
();
o.Locator = a;
cc._RF.pop();
