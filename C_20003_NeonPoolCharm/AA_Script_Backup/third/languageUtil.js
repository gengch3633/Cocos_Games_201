let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "d2036V4iFtG5JO/cmobjdC6", "languageUtil");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = e("SystemConfig.js"),
      i = e("GlobalDataMgr.js"),
      a = e("SdkHelper.js"),
      r = e("EngineUtil.js"),
      l = function () {
        function e() {}
        e.prototype.updateSpriteFrameByPath = function (e, t, o) {
          void 0 === t && (t = null);
          void 0 === o && (o = null);
          cc.loader.loadRes(e, cc.SpriteFrame, function (e, n) {
            if (e) cc.error(e.message || e);else if (n instanceof cc.SpriteFrame) {
              t && cc.isValid(t) && (t.spriteFrame = n);
              o && o(n);
            }
          });
        };
        e.prototype.init = function () {
          var e = a.default.getCurrentCountry();
          null != e && null != n.languages[String(e)] || (e = n.Default_Language);
          i.default.setCurrentLang(e);
          a.default.reportData("cocos_country_set", {
            country: e
          });
        };
        e.prototype.updateLabelByLang = function (e, t, o) {
          i.default.isSpecialFont();
          cc.isValid(e) && (e.string = i18n.t(t, o));
        };
        e.prototype.loadLanguage = function () {
          n.languages[String(i.default.curLanguage)] && r.default.loadResourceAsset("config/language").then(function (e) {
            if (e) {
              var t = e.json;
              if (t) {
                window.i18n.languages[i.default.isUsingForeignResources()] = t[i.default.isUsingForeignResources()];
                i18n.init(i.default.isUsingForeignResources());
              }
            }
          }).catch(function (e) {
            console.log("err====", e);
          });
        };
        e.prototype.isDynamicUpdate = function () {
          return i.default.i18nEdition();
        };
        e.prototype.updateSpriteByLang = function (e, t) {
          if (cc.isValid(e)) {
            var o = "i18n/" + i.default.isUsingForeignResources() + "/" + t;
            cc.loader.loadRes(o, cc.SpriteFrame, function (t, o) {
              t ? cc.error(t.message || t) : o instanceof cc.SpriteFrame && e && e.getComponent(cc.Sprite) && (e.getComponent(cc.Sprite).spriteFrame = o);
            });
          }
        };
        e.getInstance = function () {
          this._instance || (this._instance = new e());
          return this._instance;
        };
        e._instance = null;
        return e;
      }();
    o.default = l.getInstance();
    cc._RF.pop();
