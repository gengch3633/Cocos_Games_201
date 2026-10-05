let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "1950fqEVMJLJITf4oPGvr0N", "GM");
var o,
n = this&& this.__extends|| (o = function(e, t) {
  return(o = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var a in t) Object.prototype.hasOwnProperty.call(t, a)&& (e[a] = t[a]);
  }
)(e, t);
}
, function(e, t) {
  o(e, t);
  function a() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(a.prototype = t.prototype, new a());
}
),
i = this&& this.__decorate|| function(e, t, a, o) {
  var n,
  i = arguments.length,
  r = i < 3? t: null === o? o = Object.getOwnPropertyDescriptor(t, a): o;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, a, o);
  else for(var c = e.length- 1;
  c >= 0;
  c--)(n = e[c])&& (r = (i < 3? n(r): i > 3? n(t, a, r): n(t, a))|| r);
  return i > 3&& r&& Object.defineProperty(t, a, r),
  r;
}
;
Object.defineProperty(a, "__esModule", {
  value: ! 0
}
);
var r = e("FrameData.js"),
c = e("FrameSDK.js"),
s = e(i18 "
  }].js),
      l = cc._decorator,
      u = l.ccclass,
      d = l.property,
      p = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.data = null;
          t.mGmNode = null;
          t.btnDetails = null;
          t.LangNode = null;
          t.Toast = null;
          t.bottomNode = null;
          t.editBox = null;
          t.toggleList = [];
          t.lPass = " ";
          t.mPassNode = null;
          t.baseVersion = " 1.0.0 ";
          t.coinType = [];
          t.baseType = -1;
          t.baseData = {
            6: [100, 1e3, 1e4, 1e5],
            4: [1, 2, 3, 4],
            8: [1, 10, 50, 100],
            9: [100, 1e3, 1e4, 1e5],
            10: [100, 1e3, 1e4, 1e5]
          };
          return t;
        }
        t.prototype.onDisable = function () {};
        t.prototype.initLang = function () {
          this.LangNode.active = !0;
          var e = this.LangNode.getChildByName(" mainNode "),
            t = cc.instantiate(e.children[0]);
          e.removeAllChildren();
          for (var a = 0, o = r.FrameData.SDK_CONF.COUNTRY_LIST; a < o.length; a++) {
            var n = o[a],
              i = cc.instantiate(t);
            i.getChildByName(" Label ").getComponent(cc.Label).string = n.country + "- " + n.language;
            i.getComponent(cc.Button).clickEvents[0].customEventData = n.language + " _ " + n.country;
            e.addChild(i);
          }
        };
        t.open = function (e) {
          var t = this;
          void 0 === e && (e = null);
          if (" " != r.FrameData.toolKey) {
            this.toutnum++;
            if (this.toutnum >= 5 && 0 == this.isopen) {
              this.isopen = !0;
              c.FrameSDK.loadPrefab(" Panel_GM ", function (a) {
                cc.instantiate(a).parent = c.FrameSDK.Panel;
                t.isopen = !1;
                e && e();
              });
            }
          }
        };
        t.prototype.onLoad = function () {
          this.LangNode.active = !1;
          this.Toast.active = !1;
          this.mPassNode.active = " " != r.FrameData.toolKey;
          this.coinType = Object.keys(r.FrameData.saveData.credit);
          " " == r.FrameData.toolKey && this.node.destroy();
        };
        t.prototype.closePage = function () {
          this.node.destroy();
        };
        t.prototype.setLang = function (e, t) {
          c.FrameSDK.setLan(t);
          this.LangNode.active = !1;
          this.initBottomData();
        };
        t.prototype.onEnable = function () {
          this.lPass = " ";
          this.toggleList[1].isChecked = r.FrameData.SDK_CONF.NO_VIDEO;
          this.toggleList[3].isChecked = r.FrameData.isTest;
        };
        t.prototype.clickGm = function (e) {
          switch (e.target.name) {
            case " 0 ":
              break;
            case " 1 ":
              r.FrameData.SDK_CONF.NO_VIDEO = e.target.getComponent(cc.Toggle).isChecked;
              break;
            case " 2 ":
              break;
            case " 3 ":
              r.FrameData.isTest = e.target.getComponent(cc.Toggle).isChecked;
              cc.director.emit(" showTest ");
              break;
            case " 4 ":
              this.initLang();
              break;
            case " 5 ":
              cc.sys.localStorage.clear();
              cc.assetManager.cacheManager.clearCache();
              cc.game.removeAll(cc.game.EVENT_SHOW);
              cc.game.removeAll(cc.game.EVENT_HIDE);
              cc.EventTarget.prototype.emit = function () {};
              cc.sys.isBrowser ? location.reload() : this.showToast(" 请手动重启游戏 ！ ");
              break;
            case " 6 ":
            case " 7 ":
            case " 8 ":
            case " 9 ":
            case " 10 ":
              this.initBtnDetail(parseInt(e.target.name));
          }
        };
        t.prototype.initBtnDetail = function (e) {
          if (this.baseType != e) {
            this.btnDetails.active = !0;
            if (this.btnDetails.active) {
              this.baseType = e;
              this.btnDetails.getChildByName(" 0 ").getComponentInChildren(cc.Label).string = "+ " + this.baseData[e][0];
              this.btnDetails.getChildByName(" 1 ").getComponentInChildren(cc.Label).string = "+ " + this.baseData[e][1];
              this.btnDetails.getChildByName(" 2 ").getComponentInChildren(cc.Label).string = "+ " + this.baseData[e][2];
              this.btnDetails.getChildByName(" 3 ").getComponentInChildren(cc.Label).string = "+ " + this.baseData[e][3];
            }
          } else this.btnDetails.active = !this.btnDetails.active;
        };
        t.prototype.showToast = function (e) {
          var t = this;
          this.Toast.active = !0;
          this.Toast.stopAllActions();
          this.Toast.position = cc.v3(0, 0);
          this.Toast.opacity = 255;
          this.Toast.getComponentInChildren(cc.Label).string = e;
          this.Toast.runAction(cc.sequence(cc.delayTime(.5), cc.spawn(cc.moveBy(.1, cc.v2(0, 200)), cc.fadeOut(.1)), cc.callFunc(function () {
            t.Toast.active = !1;
          })));
        };
        t.prototype.initBottomData = function () {
          this.bottomNode.getChildByName(" 1 ").getComponent(cc.Label).string = " GM_VERSION: NULL ";
          this.bottomNode.getChildByName(" 2 ").getComponent(cc.Label).string = " VERSION: NULL ";
          this.bottomNode.getChildByName(" 3 ").getComponent(cc.Label).string = " USER_ID: NULL ";
          this.bottomNode.getChildByName(" 4 ").getComponent(cc.Label).string = " Country: " + r.FrameData.myCountry;
          this.bottomNode.getChildByName(" 5 ").getComponent(cc.Label).string = " Languge: " + s.default.myLanguge;
          this.bottomNode.getChildByName(" 6 ").getComponent(cc.Label).string = " PG: NULL ";
          this.bottomNode.getChildByName(" 7 ").getComponent(cc.Label).string = " Code: NULL ";
          this.bottomNode.getChildByName(" 8 ").getComponent(cc.Label).string = " SDK_VERSION: NULL ";
          this.bottomNode.getChildByName(" 9 ").getComponent(cc.Label).string = " Accumulated online time: NULL ";
          this.bottomNode.getChildByName(" 10 ").getComponent(cc.Label).string = " Cumulative H5 duration: NULL ";
          this.bottomNode.getChildByName(" 11 ").getComponent(cc.Label).string = " Cumulative login days: " + r.FrameData.saveData.loginDays;
          this.bottomNode.getChildByName(" 12 ").getComponent(cc.Label).string = " Cumulative video count: NULL ";
          this.bottomNode.getChildByName(" 13 ").getComponent(cc.Label).string = " Total number of screen inserts: NULL ";
        };
        t.prototype.addBaseData = function (e) {
          var t = parseInt(e.target.name);
          5 == t && (this.baseData[this.baseType][t] = parseInt(this.editBox.string) ? parseInt(this.editBox.string) : 0);
          switch (this.baseType) {
            case 6:
              for (var a = 0; a < this.coinType.length; a++) r.FrameData.saveData.credit[this.coinType[a]] += this.baseData[this.baseType][t];
              this.showToast(" ICON+ " + this.baseData[this.baseType][t]);
              break;
            case 7:
              r.FrameData.saveData.loginDays += this.baseData[this.baseType][t];
              this.showToast(" Line Day+ " + this.baseData[this.baseType][t]);
              break;
            case 8:
              r.FrameData.saveData.CashVideoCount += this.baseData[this.baseType][t];
              cc.director.emit(c.FrameSDK.frameData.ListenKeys.VIDEO_SUC);
              this.showToast(" AD NUM+ " + this.baseData[this.baseType][t]);
          }
          this.initBottomData();
        };
        t.prototype.clickPass = function (e, t) {
          if (" OK " == t) {
            this.lPass = " ";
            this.showToast(" Password error ");
          } else {
            this.lPass += t;
            if (this.lPass == r.FrameData.toolKey) {
              this.mPassNode.active = !1;
              this.initBottomData();
              this.btnDetails.active = !1;
            }
          }
        };
        t.toutnum = 0;
        t.isopen = !1;
        i([d(cc.Node)], t.prototype, " mGmNode ", void 0);
        i([d(cc.Node)], t.prototype, " btnDetails ", void 0);
        i([d(cc.Node)], t.prototype, " LangNode ", void 0);
        i([d(cc.Node)], t.prototype, " Toast ", void 0);
        i([d(cc.Node)], t.prototype, " bottomNode ", void 0);
        i([d(cc.EditBox)], t.prototype, " editBox ", void 0);
        i([d(cc.Toggle)], t.prototype, " toggleList ", void 0);
        i([d(cc.Node)], t.prototype, " mPassNode ", void 0);
        return i([u], t);
      }(cc.Component);
    a.default = p;
    cc._RF.pop();
