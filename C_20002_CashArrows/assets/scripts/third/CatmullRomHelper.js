let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "e713068G8FLs4HE5KSmQYDF", "CatmullRomHelper");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
  }
  e.interp = function(e, t) {
    var i = e.length- 3,
    n = Math.min(Math.floor(t* i), i- 1),
    a = t* i- n,
    o = e[n],
    r = e[n+ 1],
    s = e[n+ 2],
    l = e[n+ 3],
    c = o.mul(- 1).add(r.mul(3)).sub(s.mul(3)).add(l).mul(a* a* a),
    u = o.mul(2).sub(r.mul(5)).add(s.mul(4)).sub(l).mul(a* a),
    d = o.mul(- 1).add(s).mul(a),
    h = r.mul(2);
    return cc.v2(c.add(u).add(d).add(h).mul(.5));
  }
;
  e.generatePath = function(t, i) {
    void 0 === i&& (i = 20);
    if(! t|| t.length < 2) return[];
    var n = [].concat(t);
    n.unshift(n[0].add(n[0].sub(n[1])));
    n.push(n[n.length- 1].add(n[n.length- 1].sub(n[n.length- 2])));
    if(n[1].equals(n[n.length- 2])) {
      n[0] = n[n.length- 3];
      n[n.length- 1] = n[2];
    }
    for(var a = [], o = t.length* i, r = 0;
    r <= o;
    r++) {
      var s = r/ o,
      l = e.interp(n, s);
      a.push(l);
    }
    return a;
  }
;
  return e;
}
();
i.default = n;
cc._RF.pop();
