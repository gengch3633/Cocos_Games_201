let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "b8225QM2n5M15VAHdVIs9wi", "ResLoader");
var n = __extends,
a = __awaiter,
o = __generator;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var r = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.remoteUrl = "";
    return t;
  }
  n(t, e);
  t.prototype.getBundle = function(e) {
    var t = this;
    return new Promise(function(i) {
      var n = e? cc.assetManager.getBundle(e): cc.assetManager.resources;
      if(n) i(n);
      else {
        var r = cc.sys.isBrowser|| cc.sys.isNative? "": t.remoteUrl;
        cc.assetManager.loadBundle(r+ e, {
          onProgress: function() {
          }
, onFileProgress: function() {
          }
        }
, function(e, n) {
          var r;
          e&& console.log(e);
          if((null === (r = null == n? void 0: n.deps)|| void 0 === r? void 0: r.length) > 0) {
            var s = n.deps.length;
            n.deps.forEach(function(e) {
              return a(t, void 0, void 0, function() {
                return o(this, function(t) {
                  switch(t.label) {
                    case 0: return[4, this.getBundle(e)];
                    case 1: t.sent();
                    0 == -- s&& i(n);
                    return[2];
                  }
                }
);
              }
);
            }
);
          } else i(n);
        }
);
      }
    }
);
  }
;
  t.prototype.loadRes = function(e, t, i, n) {
    var r = this;
    return new Promise(function(s) {
(i? r.getBundle(i): Promise.resolve(cc.resources)).then(function(i) {
        return a(r, void 0, void 0, function() {
          var a;
          return o(this, function() {
            return i?((a = i.get(e, t))? s(a): i.load(e, t, function(e, t) {
              n&& n(e, t);
            }
, function(e, t) {
              e&& console.error(e);
              s(t);
            }
), [2]):(s(null), [2]);
          }
);
        }
);
      }
);
    }
);
  }
;
  t.prototype.setSpriteFrame = function(e, t, i) {
    return a(this, void 0, Promise, function() {
      var n, a;
      return o(this, function(o) {
        switch(o.label) {
          case 0: return[4, this.loadRes(t, cc.SpriteFrame, i)];
          case 1: n = o.sent();
          a = null;
          e instanceof cc.Sprite? a = e:(null == e? void 0: e.isValid)&& (a = null == e? void 0: e.getComponent(cc.Sprite));
(null == a? void 0: a.isValid)&& (a.spriteFrame = n);
          return[2];
        }
      }
);
    }
);
  }
;
  t.prototype.setSkeleton = function(e, t, i, n) {
    return a(this, void 0, Promise, function() {
      var a, r;
      return o(this, function(o) {
        switch(o.label) {
          case 0: return[4, this.loadRes(t, sp.SkeletonData, i)];
          case 1: a = o.sent();
          r = null;
          if(null == (r = e instanceof sp.Skeleton? e: null == e? void 0: e.getComponent(sp.Skeleton))? void 0: r.isValid) {
            r.skeletonData = a;
            r.animation = n;
          }
          return[2];
        }
      }
);
    }
);
  }
;
  t.prototype.instantiate = function(e, t) {
    var i = cc.instantiate(e);
    return i?(t&& (i.parent = t), i): null;
  }
;
  t.prototype.instantiateByUrl = function(e, t, i, n) {
    return a(this, void 0, Promise, function() {
      var a;
      return o(this, function(o) {
        switch(o.label) {
          case 0: return[4, this.loadRes(e, cc.Prefab, i, n)];
          case 1: return(a = o.sent())?[2, this.instantiate(a, t)]:[2, null];
        }
      }
);
    }
);
  }
;
  return t;
}
(e(Singleton "
} ].js).default);
i.default = r;
cc._RF.pop();
