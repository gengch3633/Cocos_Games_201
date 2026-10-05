let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "fd4daykVVtGjIUdkMf3uC8v", "game_hall");
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
var r = e(DB "
  }].js),
      l = e(" BallLogicMgr.js "),
      s = cc._decorator,
      c = s.ccclass,
      u = s.property,
      p = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.ui_setting_prefab = null;
          t.ui_reward_prefab = null;
          t.ui_author_prefab = null;
          return t;
        }
        t.prototype.updateCoin = function () {
          this.updateInfo(r.userInfo.coin);
        };
        t.prototype.showAuthor = function (e) {
          cc.instantiate(this.ui_author_prefab).getComponent(" game_UI_author ").show(this, e);
        };
        t.prototype.updateInfo = function (e) {
          var t = cc.find(" node_coin ", this.node);
          e = e || r.userInfo.coin;
          cc.find(" label_coin ", t).getComponent(cc.Label).string = e;
        };
        t.prototype.updateRecIcon = function () {
          console.log(" updateRecIcon in hall ", l.is_record);
        };
        t.prototype.showTip = function (e) {
          cc.find(" node_floatTip ", this.node).getComponent(" FloatTipComp ").show(e);
        };
        t.prototype.checkTTState = function () {};
        t.prototype.onLoad = function () {
          var e = this;
          l.resetInHall();
          cc.find(" game_name ", this.node).opacity = 0;
          cc.find(" button_infinity ", this.node).on(" click ", function () {
            l.gotoTable_freeMode_useCacheIdx(!0);
          });
          cc.find(" button_edit ", this.node).on(" click ", function () {
            r.checkAuthorize(function (t, o) {
              console.log(" checkAuthorize btn edit return ", t, o);
              t ? l.gotoInfoList() : e.showAuthor(function (e) {
                e && l.gotoInfoList();
              });
            });
          });
          cc.find(" button_setting ", this.node).on(" click ", function () {
            cc.instantiate(e.ui_setting_prefab).getComponent(" game_UI_settting ").show(e.node);
          });
          cc.find(" button_login ", this.node).on(" click ", function () {});
          this.updateInfo();
          l.playBgMusic();
        };
        t.prototype.loadFModeConfig = function () {
          cc.loader.loadRes(" temp_file/ level_confi ", cc.JsonAsset, function () {});
        };
        a([u(cc.Prefab)], t.prototype, " ui_setting_prefab ", void 0);
        a([u(cc.Prefab)], t.prototype, " ui_reward_prefab ", void 0);
        a([u(cc.Prefab)], t.prototype, " ui_author_prefab ", void 0);
        return a([c], t);
      }(cc.Component);
    o.default = p;
    cc._RF.pop();
