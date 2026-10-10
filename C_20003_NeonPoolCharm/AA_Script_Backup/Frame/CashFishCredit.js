let e = require;let t = module;let a = exports;
    "use strict";

    cc._RF.push(t, "268b8flbGNE46mMJoHtrdvj", "CashFishCredit");
    var o,
      n = this && this.__extends || (o = function (e, t) {
        return (o = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var a in t) Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
        })(e, t);
      }, function (e, t) {
        o(e, t);
        function a() {
          this.constructor = e;
        }
        e.prototype = null === t ? Object.create(t) : (a.prototype = t.prototype, new a());
      }),
      i = this && this.__decorate || function (e, t, a, o) {
        var n,
          i = arguments.length,
          r = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, a) : o;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, a, o);else for (var c = e.length - 1; c >= 0; c--) (n = e[c]) && (r = (i < 3 ? n(r) : i > 3 ? n(t, a, r) : n(t, a)) || r);
        return i > 3 && r && Object.defineProperty(t, a, r), r;
      };
    Object.defineProperty(a, "__esModule", {
      value: !0
    });
    var r = e("Frame.js"),
      c = e("Frame.jsData"),
      s = e("Frame.jsSDK"),
      l = cc._decorator,
      u = l.ccclass,
      d = l.property,
      p = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.creditNum = null;
          t.addNode = null;
          t.addNum = null;
          t.typs = "yellowCoin";
          t.prefix = "";
          t.data = {
            num: 0
          };
          return t;
        }
        a = t;
        t.prototype.updatecredit = function (e) {
          var t = this;
          if (e.type == this.typs && cc.isValid(this.addNode)) {
            var a = "yellowCoin" === e.type ? s.FrameSDK.convertCoinToStr : s.FrameSDK.convertCharityToStr;
            cc.Tween.stopAllByTarget(this.data);
            if (e.change > 0) {
              this.addNode.active = !0;
              this.addNode.scale = 0;
              this.addNum.string = "+" + a.call(s.FrameSDK, e.change);
              cc.tween(this.addNode).to(.1, {
                scale: 1
              }).start();
            }
            cc.tween(this.data).to(.5, {
              num: e.num
            }, {
              progress: function (e, a, o, n) {
                var i = e + (a - e) * n;
                cc.isValid(t.node) && t.updatecreditString(i);
                return i;
              }
            }).call(function () {
              if (cc.isValid(t.node)) {
                t.data.num = e.num;
                t.addNode.active = !1;
                t.updatecreditString(t.data.num);
              }
            }).start();
          }
        };
        t.getTarget = function (e) {
          if (1 == this._targets.length) return this._targets[0];
          for (var t = this._targets.length - 1; t >= 0; t--) if (this._targets[t].getComponent(a).typs == e) {
            var o = this._targets[t].getBoundingBoxToWorld();
            if (cc.rect(0, 0, cc.winSize.width, cc.winSize.height).containsRect(o)) return this._targets[t];
          }
          return this._targets[this._targets.length - 1] || this._targets[this._targets.length - 1];
        };
        t.prototype.openRedeem = function () {
          if ("yellowCoin" == this.typs) {
            s.FrameSDK.openPanel_Yellow();
            if (0 == c.FrameData.saveData.guideInedx) {
              c.FrameData.saveData.guideInedx++;
              r.default.ins.setGuideShow(!1);
            }
          } else {
            s.FrameSDK.openPanel_Charity();
            if (0 == c.FrameData.saveData.charityGuideIndex) {
              c.FrameData.saveData.charityGuideIndex++;
              r.default.ins.setGuide2Show(!1);
            }
          }
        };
        t.prototype.onDestroy = function () {
          cc.director.removeAll(this);
          a._targets.splice(a._targets.indexOf(this.node), 1);
        };
        t.prototype.onLoad = function () {
          cc.director.on("UNLOCK_CHARITY", this._onUnlockCharity, this);
          null == this.creditNum && (this.creditNum = this.getComponent(cc.Label) || this.getComponentInChildren(cc.Label));
          this.addNode && (this.addNode.active = !1);
          this.data.num = c.FrameData.saveData.credit[this.typs];
          this.updatecreditString();
          s.FrameSDK.addCreditListen(this.updatecredit, this);
          a._targets.push(this.node);
          this.updateUI();
        };
        t.prototype.getcreditString = function (e) {
          var t = "yellowCoin" === this.typs ? s.FrameSDK.convertCoinToStr(e) : s.FrameSDK.convertCharityToStr(e);
          return this.prefix + t;
        };
        t.isUnlocked = function (e) {
          return "yellowCoin" === e || ("greenCoin" === e ? !s.FrameSDK.frameData.gameData.noProfitAd && s.FrameSDK.frameData.gameData.passLevel >= c.FrameData.FRAME_CONF.charityLevel && c.FrameData.saveData.charityGuideIndex > 0 : void 0);
        };
        t.prototype.updateUI = function () {
          var e = s.FrameSDK.frameData.gameData.currentScene;
          this.node.active = ("home" === e || "game" === e) && a.isUnlocked(this.typs);
        };
        t.prototype._onUnlockCharity = function () {
          "greenCoin" !== this.typs || s.FrameSDK.frameData.gameData.noProfitAd || (this.node.active = !0);
        };
        t.prototype.updatecreditString = function (e) {
          e = null == e ? this.data.num : e;
          this.creditNum.string = this.getcreditString(e);
        };
        var a;
        t._targets = [];
        i([d(cc.Label)], t.prototype, "creditNum", void 0);
        i([d(cc.Node)], t.prototype, "addNode", void 0);
        i([d(cc.Label)], t.prototype, "addNum", void 0);
        i([d()], t.prototype, "typs", void 0);
        i([d()], t.prototype, "prefix", void 0);
        return a = i([u], t);
      }(cc.Component);
    a.default = p;
    cc._RF.pop();
