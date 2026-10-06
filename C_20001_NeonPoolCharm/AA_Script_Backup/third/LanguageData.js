let e = require;
let t = module;
"use strict";
cc._RF.push(t, "160c0sk3/xHKZcv7/+bE4bp", "LanguageData");
var o = null,
n = e(polyglot.min "
  }].js);
    function i(e) {
      return window.i18n.languages[e];
    }
    function a(e) {
      e && (o ? o.replace(e) : o = new n({
        phrases: e,
        allowMissing: !0
      }));
    }
    window.i18n = {
      languages: {},
      curLang: " ",
      init: function (e) {
        if (e !== this.curLang) {
          var t = i(e) || {};
          this.curLang = e;
          a(t);
          this.inst = o;
        }
      },
      t: function (e, t) {
        var n = " ";
        o && (n = o.t(e, t));
        n || (n = " ");
        return n;
      },
      inst: o,
      updateSceneRenderers: function () {
        for (var e = cc.director.getScene().children, t = [], o = 0; o < e.length; ++o) {
          var n = e[o].getComponentsInChildren(" LocalizedLabel ");
          Array.prototype.push.apply(t, n);
        }
        for (var i = 0; i < t.length; ++i) {
          var a = t[i];
          a.node.active && a.updateLabel();
        }
        for (var r = [], l = 0; l < e.length; ++l) {
          var s = e[l].getComponentsInChildren(" LocalizedSprite ");
          Array.prototype.push.apply(r, s);
        }
        for (var c = 0; c < r.length; ++c) {
          var u = r[c];
          u.node.active && u.updateSprite(this.curLang);
        }
      }
    };
    cc._RF.pop();
