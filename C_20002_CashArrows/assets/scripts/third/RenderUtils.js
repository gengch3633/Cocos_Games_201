let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "1a1ceo2bp5Dr4HNteCxQkxF", "RenderUtils");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
  }
  e.getRenderTexture = function(e, t) {
    if(! cc.isValid(e)) return null;
    t&& t instanceof cc.RenderTexture|| (t = new cc.RenderTexture());
    var i = Math.floor(e.width),
    n = Math.floor(e.height);
    t.initWithSize(i, n);
    var a = new cc.Node();
    a.parent = e;
    var o = a.addComponent(cc.Camera);
    o.clearFlags| = cc.Camera.ClearFlags.COLOR;
    o.backgroundColor = cc.color(0, 0, 0, 0);
    o.zoomRatio = cc.winSize.height/ n;
    o.targetTexture = t;
    o.render(e);
    a.destroy();
    return t;
  }
;
  e.getPixelsData = function(t, i) {
    void 0 === i&& (i = ! 0);
    if(! cc.isValid(t)) return null;
    var n = Math.floor(t.width),
    a = Math.floor(t.height),
    o = new cc.Node();
    o.parent = t;
    var r = o.addComponent(cc.Camera);
    r.clearFlags| = cc.Camera.ClearFlags.COLOR;
    r.backgroundColor = cc.color(0, 0, 0, 0);
    r.zoomRatio = cc.winSize.height/ a;
    var s = new cc.RenderTexture();
    s.initWithSize(n, a, cc.RenderTexture.DepthStencilFormat.RB_FMT_S8);
    r.targetTexture = s;
    r.render(t);
    var l = s.readPixels();
    s.destroy();
    o.destroy();
    return i? e.flipY(l, 4* n): l;
  }
;
  e.flipY = function(e, t) {
    for(var i = e.length, n = new Uint8Array(i), a = 0, o = i- t;
    a < i;
    a+= t, o-= t) for(var r = 0;
    r < t;
    r++) n[a+ r] = e[o+ r];
    return n;
  }
;
  e.hitColor = function(t, i, n) {
    if(! cc.isValid(t)) return null;
    var a = e.getPixelsData(t),
    o = t.parent.convertToNodeSpaceAR(i),
    r = o.x+ t.anchorX* t.width,
    s = -(o.y- t.anchorY* t.height),
    l = 4* t.width* Math.floor(s)+ 4* Math.floor(r),
    c = a.slice(l, l+ 4);
    n|| (n = new cc.Color());
    n.r = c[0];
    n.g = c[1];
    n.b = c[2];
    n.a = c[3];
    return n;
  }
;
  return e;
}
();
i.default = n;
cc._RF.pop();
