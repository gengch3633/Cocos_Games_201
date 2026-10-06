let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "3220cPEopJC7a8JfIvaS/9x", "GuideManager");
var n,
i = this&& this.__extends|| (n = function(e, t) {
  return(n = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var o in t) Object.prototype.hasOwnProperty.call(t, o)&& (e[o] = t[o]);
  }
)(e, t);
}
, function(e, t) {
  n(e, t);
  function o() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(o.prototype = t.prototype, new o());
}
),
a = this&& this.__decorate|| function(e, t, o, n) {
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
var r = e("AudioManager.js"),
l = e(GuideEvent "
  }].js),
      s = cc._decorator,
      c = s.ccclass,
      u = s.property,
      p = (cc._decorator, function (t) {
        i(o, t);
        function o() {
          var e = null !== t && t.apply(this, arguments) || this;
          e.PREFAB = null;
          e.parent = null;
          e.zIndex = 0;
          e.tasks = [];
          e._godGuide = null;
          return e;
        }
        n = o;
        Object.defineProperty(o.prototype, " id ", {
          get: function () {
            return this._godGuide.getGuideId;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(o.prototype, " stepId ", {
          get: function () {
            return this._godGuide.stepId;
          },
          enumerable: !1,
          configurable: !0
        });
        o.prototype.onLoad = function () {
          n.Instance = this;
          this.loadPrefab();
          cc.game.on(l.default.VideoEnd, this.playMusic, this);
        };
        o.prototype.playMusic = function () {
          r.default.getInstance().isMusicPlaying() || r.default.getInstance().playMusic(r.DEFAULT_BGM_NAME, !0, !0);
        };
        o.prototype.updateGuide = function () {
          var e = this.id;
          console.log(" updateGuide ", e);
          104 == e && this._godGuide.setGuideId(105);
          203 == e && this._godGuide.setGuideId(204);
          303 != e && 304 != e || this._godGuide.setGuideId(305);
        };
        o.prototype.loadPrefab = function () {
          try {
            var e = cc.instantiate(this.PREFAB);
            e.position = cc.v3(0, 0, 0);
            e.parent = this.parent || this.node;
            this._godGuide = e.getComponent(" GodGuide ");
          } catch (e) {
            cc.error(this.PREFAB);
            cc.error(e);
          }
        };
        o.prototype.emit = function (e) {
          this.scheduleOnce(function () {
            cc.game.emit(e);
          }, .1);
        };
        o.prototype.runTask = function (t) {
          var o = this;
          void 0 === t && (t = !0);
          console.log(" guidetime runTask ", cc.director.getTotalTime());
          t && this.updateGuide();
          async.eachSeries(this.tasks, function (t, n) {
            console.log(" taskFile---------- \ x3e ", t);
            var i = e(t).task;
            o._godGuide.setTask(i);
            o._godGuide.run(n);
          }, function () {
            cc.log(" 任务全部完成 ");
            o._godGuide.end();
          });
        };
        o.prototype.checkGuide = function () {
          this.id || this.emit(l.default.OpenMain);
        };
        o.prototype.showVideo = function (e) {
          this._godGuide.showVideo(e);
        };
        var n;
        o.Instance = null;
        a([u(cc.Prefab)], o.prototype, " PREFAB ", void 0);
        a([u(cc.Node)], o.prototype, " parent ", void 0);
        a([u()], o.prototype, " zIndex ", void 0);
        a([u([cc.String])], o.prototype, " tasks ", void 0);
        return n = a([c], o);
      }(cc.Component));
    o.default = p;
    cc._RF.pop();
