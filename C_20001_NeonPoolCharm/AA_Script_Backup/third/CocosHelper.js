let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "20646IgPxFICbEKLskr+Qoj", "CocosHelper");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
o.LoadProgress = void 0;
o.LoadProgress = function() {
}
;
var n = function() {
  function e() {
  }
  e.addRef = function(e) {
    if(e instanceof Array) for(var t = 0, o = e;
    t < o.length;
    t++) o[t].addRef();
    else e.addRef();
  }
;
  e.runTweenSync = function(e) {
    for(var t = [], o = 1;
    o < arguments.length;
    o++) t[o- 1] = arguments[o];
    return __awaiter(this, void 0, Promise, function() {
      return __generator(this, function() {
        return[2, new Promise(function(o) {
          for(var n = cc.tween(e), i = 0, a = t;
          i < a.length;
          i++) {
            var r = a[i];
            n = n.then(r);
          }
          n.call(function() {
            o();
          }
).start();
        }
)];
      }
);
    }
);
  }
;
  e.runActionSync = function(e) {
    for(var t = [], o = 1;
    o < arguments.length;
    o++) t[o- 1] = arguments[o];
    return __awaiter(this, void 0, void 0, function() {
      return __generator(this, function() {
        return ! t|| t.length <= 0?[2]:[2, new Promise(function(o) {
          t.push(cc.callFunc(function() {
            o(! 0);
          }
));
          e.runAction(cc.sequence(t));
        }
)];
      }
);
    }
);
  }
;
  e.runRepeatTweenSync = function(e, t) {
    for(var o = [], n = 2;
    n < arguments.length;
    n++) o[n- 2] = arguments[n];
    return __awaiter(this, void 0, void 0, function() {
      return __generator(this, function() {
        return[2, new Promise(function(n) {
          for(var i = cc.tween(e), a = 0, r = o;
          a < r.length;
          a++) {
            var l = r[a];
            i = i.then(l);
          }
          t < 0? cc.tween(e).repeatForever(i).start(): cc.tween(e).repeat(t, i).call(function() {
            n(! 0);
          }
).start();
        }
)];
      }
);
    }
);
  }
;
  e.stopTween = function(e) {
    cc.Tween.stopAllByTarget(e);
  }
;
  e.releaseAsset = function(e) {
    this.decRes(e);
  }
;
  e._onProgress = function(t, o, n) {
    e.loadProgress.completedCount = t;
    e.loadProgress.totalCount = o;
    e.loadProgress.item = n;
    e.loadProgress.cb&& e.loadProgress.cb(t, o, n);
  }
;
  e.loadResThrowErrorSync = function() {
    return null;
  }
;
  e.loadAssetFromBundleSync = function(e, t) {
    var o = cc.assetManager.getBundle(e);
    if(! o) {
      cc.error("加载bundle中的资源失败, 未找到bundle, bundleUrl:"+ e);
      return null;
    }
    return new Promise(function(e) {
      o.load(t, function(o, n) {
        if(o) {
          cc.error("加载bundle中的资源失败, 未找到asset, url:"+ t+ ", err:"+ o);
          e(null);
        } else e(n);
      }
);
    }
);
  }
;
  e.decRes = function(e) {
    if(e instanceof Array) for(var t = 0, o = e;
    t < o.length;
    t++) o[t].decRef();
    else e.decRef();
  }
;
  e.loadBundleSync = function(e, t) {
    return new Promise(function(o) {
      cc.assetManager.loadBundle(e, t, function(t, n) {
        if(t) o(n);
        else {
          cc.error("加载bundle失败, url: "+ e+ ", err:"+ t);
          o(null);
        }
      }
);
    }
);
  }
;
  e.runAnimSync = function(t, o) {
    return __awaiter(this, void 0, void 0, function() {
      var n, i, a, r;
      return __generator(this, function(l) {
        switch(l.label) {
          case 0: if(!(n = t.getComponent(cc.Animation))) return[2];
          i = null;
          if(o) {
            a = n.getClips();
            if("number" == typeof o) i = a[o];
            else if("string" == typeof o) for(r = 0;
            r < a.length;
            r++) if(a[r].name === o) {
              i = a[r];
              break;
            }
          } else i = n.defaultClip;
          return i?[4, e.sleepSync(i.duration)]:[2];
          case 1: l.sent();
          return[2];
        }
      }
);
    }
);
  }
;
  e.loadAssetSync = function(e) {
    var t = this;
    return new Promise(function(o) {
      cc.resources.load(e, function(n, i) {
        if(n) {
          t.addRef(i);
          o(i);
        } else {
          cc.error("加载asset失败, url:"+ e+ ", err: "+ n);
          o(null);
        }
      }
);
    }
);
  }
;
  e.loadRes = function(e, t, o) {
    var n = this;
    if(this._loadingMap[e]) this._loadingMap[e].push(o);
    else {
      this._loadingMap[e] = [o];
      this.loadResSync(e, t).then(function(t) {
        for(var o = 0, i = n._loadingMap[e];
        o < i.length;
        o++)(0, i[o])(t);
        n._loadingMap[e] = null;
        delete n._loadingMap[e];
      }
);
    }
  }
;
  e.sleepSync = function(e) {
    return new Promise(function(t) {
      cc.Canvas.instance.scheduleOnce(function() {
        t(! 0);
      }
, e);
    }
);
  }
;
  e.findChildInNode = function(e, t) {
    if(t.name == e) return t;
    for(var o = 0;
    o < t.childrenCount;
    o++) {
      var n = this.findChildInNode(e, t.children[o]);
      if(n) return n;
    }
    return null;
  }
;
  e.callInNextTick = function() {
    return __awaiter(this, void 0, void 0, function() {
      return __generator(this, function() {
        return[2, new Promise(function(e) {
          setTimeout(function() {
            e(! 0);
          }
, 0);
        }
)];
      }
);
    }
);
  }
;
  e.loadResSync = function(e, t, o) {
    var n = this;
    return new Promise(function(i) {
      o|| (o = n._onProgress);
      cc.resources.load(e, t, o, function(t, o) {
        if(t) {
          cc.error(e+ " [资源加载] 错误 "+ t);
          i(null);
        } else i(o);
      }
);
    }
);
  }
;
  e.stopTweenByTag = function(e) {
    cc.Tween.stopAllByTag(e);
  }
;
  e.getComponentName = function(e) {
    var t = e.name.match(/ < .* > $/);
    return t&& t.length > 0? t[0].slice(1, - 1): e.name;
  }
;
  e.captureScreen = function(e, t) {
    var o = new cc.RenderTexture(),
    n = e.targetTexture,
    i = cc.rect(0, 0, cc.visibleRect.width, cc.visibleRect.height);
    t&& (i = t instanceof cc.Node? t.getBoundingBoxToWorld(): t);
    o.initWithSize(cc.visibleRect.width, cc.visibleRect.height, cc.game._renderContext.STENCIL_INDEX8);
    e.targetTexture = o;
    e.render();
    e.targetTexture = n;
    var a = new ArrayBuffer(i.width* i.height* 4),
    r = new Uint8Array(a);
    o.readPixels(r, i.x, i.y, i.width, i.height);
    return r;
  }
;
  e.loadProgress = new o.LoadProgress();
  e._loadingMap = {
  }
;
  return e;
}
();
o.default = n;
cc._RF.pop();
