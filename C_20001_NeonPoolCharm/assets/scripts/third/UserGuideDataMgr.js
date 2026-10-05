let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "ac947enE0hFC5koAk6ciIdt", "UserGuideDataMgr");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
o.UserGuideDataMgr = void 0;
var n = e("AudioManager.js"),
i = e(EngineUtil "
  }].js),
      a = function () {
        function e() {
          this._guideId = 0;
          this.guideAudio = " ";
          this.isGuidePlant = !1;
        }
        Object.defineProperty(e.prototype, " guideId ", {
          get: function () {
            this._guideId || (this._guideId = parseInt(i.default.getLocalData(" guideId ")) || 0);
            return this._guideId;
          },
          set: function (e) {
            this._guideId = e;
            i.default.setLocalData(" guideId ", this._guideId + " ");
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e, " instance ", {
          get: function () {
            this._instance || (this._instance = new e());
            return this._instance;
          },
          enumerable: !1,
          configurable: !0
        });
        e.prototype.update = function (e) {
          void 0 === e && (e = 0);
          this[" step " + this.guideId] && (this[" step " + this.guideId].active = !1);
          console.log(" guide === = ", e);
          e ? this.guideId = e + 1 : this.guideId++;
          console.log(" guideStep: " + this.guideId);
          this._guideId > 3 || this.refresh();
        };
        e.prototype.refresh = function () {
          var e = this[" step " + this.guideId];
          e && (e.active = !0);
        };
        e.prototype.stopGuideAudio = function () {
          n.default.getInstance().stopMusic(this.guideAudio, !1);
          this.guideAudio = " ";
        };
        e.prototype.playGuideAudio = function () {
          this.stopGuideAudio();
          console.log(" 播放音频this.guideId === = ", this.guideId);
          this.guideAudio = " step_ " + this.guideId;
          n.default.getInstance().playMusic(this.guideAudio);
        };
        e.prototype.startGuide = function (e) {
          if (this[" step " + e]) {
            this[" step " + e].active = !0;
            this.playGuideAudio();
          }
        };
        return e;
      }();
    o.UserGuideDataMgr = a;
    cc._RF.pop();
