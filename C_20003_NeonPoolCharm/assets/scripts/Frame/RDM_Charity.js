let e = require;let t = module;let a = exports;
    "use strict";

    cc._RF.push(t, "0f6b4sNvFJJRKzY9NGUY2HH", "RDM_Charity");
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
    var r = e("FrameData.js"),
      c = e("FrameSDK.js"),
      s = e("PaymentItem.js"),
      l = e("RDM_CharityItem.js"),
      u = cc._decorator,
      d = u.ccclass,
      p = u.property,
      h = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.top = null;
          t.lbl_gCoin = null;
          t.timeLabel = null;
          t.numberLabel = null;
          t.peopleLabel = null;
          t.paymentRootNode = null;
          t.scrollview = null;
          t.guide = null;
          t.coin = "0";
          t.guideInedx = 0;
          return t;
        }
        a = t;
        t.prototype.openGuide = function () {
          this.guide.active = !0;
          this.guide.children.forEach(function (e) {
            e.active = !1;
          });
          var e = cc.find("mask", this.guide).getComponent(cc.Mask);
          e.node.active = !0;
          if (0 == this.guideInedx) {
            cc.find("tips1", this.guide).active = !0;
            e.spriteFrame = c.FrameSDK.getNodeTexture(cc.find("panel_window/node_list2", this.node));
            cc.tween(cc.find("tips1/hand", this.guide)).by(.5, {
              x: 50,
              y: -50
            }).by(.5, {
              x: -50,
              y: 50
            }).union().repeatForever().start();
          } else if (1 == this.guideInedx) {
            cc.find("tips2", this.guide).active = !0;
            var t = a.getData(r.FrameData.FRAME_CONF.CoinConf[0].rdm_id);
            e.spriteFrame = c.FrameSDK.getNodeTexture(cc.find("panel_window/scrollview/view/content/item", this.node));
            cc.find("tips2/label", this.guide).getComponent(cc.Label).string = "skey_109??&value1==" + t.total;
            cc.tween(cc.find("tips2/hand", this.guide)).by(.5, {
              x: 50,
              y: -50
            }).by(.5, {
              x: -50,
              y: 50
            }).union().repeatForever().start();
          } else if (2 == this.guideInedx) {
            cc.find("tips3", this.guide).active = !0;
            t = a.getData(r.FrameData.FRAME_CONF.CoinConf[0].rdm_id);
            cc.find("tips3/label", this.guide).getComponent(cc.Label).string = "skey_110??&value1==" + t.total;
            cc.tween(cc.find("tips3/hand", this.guide)).by(.5, {
              x: 50,
              y: -50
            }).by(.5, {
              x: -50,
              y: 50
            }).union().repeatForever().start();
            e.spriteFrame = c.FrameSDK.getNodeTexture(cc.find("panel_window/top/btn_close", this.node));
          } else if (3 == this.guideInedx) {
            this.node.destroy();
            cc.director.emit("CHARITY_GUIDE_FINISH");
          }
        };
        t.prototype.updateUI = function () {
          var e = this;
          this.coin = c.FrameSDK.convertCharityToStr(r.FrameData.charityCredit);
          this.lbl_gCoin.string = this.coin;
          this.timeLabel.string = "skey_089??&value1==" + r.FrameData.saveData.charityDonateTime;
          this.numberLabel.string = "" + c.FrameSDK.formatNumber(r.FrameData.saveData.charityDonated, 0, 1);
          this.peopleLabel.string = "skey_090??&value1==" + Math.floor(r.FrameData.saveData.charityDonated / r.FrameData.getCoinOutNum("charityPerPeople"));
          var t = r.FrameData.CountryConf.cash_id.slice(0, 4);
          this.paymentRootNode.children.forEach(function (e, a) {
            var o;
            return e.getComponent(s.default).paymentID = null !== (o = t[a]) && void 0 !== o ? o : 0;
          });
          r.FrameData.FRAME_CONF.CharityConf.forEach(function (t, a) {
            var o,
              n = null !== (o = e.scrollview.content.children[a]) && void 0 !== o ? o : cc.instantiate(e.scrollview.content.children[0]);
            n.getComponentInChildren(l.default).init(t);
            n.parent = e.scrollview.content;
          });
        };
        t.getData = function (e) {
          var t = r.FrameData.getCharityConf(e),
            a = r.FrameData.getCharityExchangeStatus(e),
            o = {};
          1 == a ? o = {
            now: Math.min(r.FrameData.saveData.credit.greenCoin, t.rdm_1),
            total: t.rdm_1,
            tips: "skey_091??&value1==<color= #DF4704>" + c.FrameSDK.convertCharityToStr(t.rdm_1) + "</c>"
          } : 2 == a && (o = {
            now: Math.min(c.FrameSDK.frameData.gameData.passLevel, t.rdm_2),
            total: t.rdm_2,
            tips: "skey_053??&value1==<color= #DF4704>" + t.rdm_2 + "</c>&value2==<color= #009D12>" + c.FrameSDK.convertCharityToStr(t.reward, !0) + "</c>"
          });
          o.status = a;
          o.isCharity = !0;
          return o;
        };
        t.prototype.onDestroy = function () {
          cc.director.removeAll(this);
        };
        t.prototype.onBtnEvent = function (e, t) {
          if ("0" == t) this.node.destroy();else if ("3" == t) {
            this.guideInedx++;
            this.openGuide();
          }
        };
        t.prototype.onEnable = function () {
          c.FrameSDK.playEffect("rdm");
        };
        t.prototype.onLoad = function () {
          var e = this;
          cc.director.on("REFRESH_INFO", this.updateUI, this);
          this.updateUI();
          this.guide.active = !1;
          if (r.FrameData.saveData.charityGuideIndex <= 1) {
            r.FrameData.saveData.charityGuideIndex = 2;
            this.scheduleOnce(function () {
              e.openGuide();
            });
          }
          this.scheduleOnce(function () {
            e.scrollview.node.height = e.scrollview.node.convertToWorldSpaceAR(cc.v2()).y;
          });
        };
        var a;
        i([p(cc.Node)], t.prototype, "top", void 0);
        i([p(cc.Label)], t.prototype, "lbl_gCoin", void 0);
        i([p(cc.Label)], t.prototype, "timeLabel", void 0);
        i([p(cc.Label)], t.prototype, "numberLabel", void 0);
        i([p(cc.Label)], t.prototype, "peopleLabel", void 0);
        i([p(cc.Node)], t.prototype, "paymentRootNode", void 0);
        i([p(cc.ScrollView)], t.prototype, "scrollview", void 0);
        i([p(cc.Node)], t.prototype, "guide", void 0);
        return a = i([d], t);
      }(cc.Component);
    a.default = h;
    cc._RF.pop();
