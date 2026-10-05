let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "26830MXSp9Nm79TR8HpkRJ5", "EngineUtil");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e("SystemConfig.js"),
i = e("PageMgr.js"),
a = e("PlayerDataSys.js"),
r = e(SystemDataSys "
  }].js),
      l = function () {
        function e() {
          this.toastContent = " ";
          this.color = new cc.Color();
          this.currSeed = new Date().getTime();
          this.manageToast = null;
          this.manageShows = 0;
          this.bigToast = null;
          this.bigShows = 0;
        }
        e.prototype.randomKey = function (e) {
          for (var t = [" 0 ", " 1 ", " 2 ", " 3 ", " 4 ", " 5 ", " 6 ", " 7 ", " 8 ", " 9 ", " a ", " b ", " c ", " d ", " e ", " f ", " g ", " h ", " i ", " j ", " k ", " l ", " m ", " n ", " o ", " p ", " q ", " r ", " s ", " t ", " u ", " v ", " w ", " x ", " y ", " z ", " A ", " B ", " C ", " D ", " E ", " F ", " G ", " H ", " I ", " J ", " K ", " L ", " M ", " N ", " O ", " P ", " Q ", " R ", " S ", " T ", " U ", " V ", " W ", " X ", " Y ", " Z "], o = " ", n = t.length, i = 0; i < e; i++) o += t[this.randomInt(0, n - 1)];
          return o;
        };
        e.prototype.getRandId = function () {
          return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
        };
        e.prototype.getRandomNum = function (e, t) {
          return Math.floor(Math.random() * (t - e + 1)) + e;
        };
        e.prototype.seti18nString = function (e, t, o) {
          var n = e.getComponent(cc.Label);
          if (n) n.string = i18n.t(t, o);else {
            var i = e.getComponent(cc.RichText);
            i && (i.string = i18n.t(t, o));
          }
        };
        e.prototype.getTimeStamp = function () {
          return Math.floor(Date.now() / 1e3);
        };
        e.prototype.setLocalData = function (e, t) {
          cc.sys.localStorage.setItem(e, t);
        };
        e.prototype.error = function () {
          for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
          if (!r.default.online_release) if (cc.sys.isNative) try {
            console.error(n.GAME_NAME, JSON.stringify(e));
          } catch (e) {
            console.error(n.GAME_NAME, e);
          } else console.error(n.GAME_NAME, e);
        };
        e.prototype.registerBtnEvent = function (e, t, o, n, i, a) {
          void 0 === n && (n = " ");
          void 0 === i && (i = {});
          void 0 === a && (a = cc.Button.Transition.SCALE);
          if (cc.isValid(e)) {
            t && (t = t.name ? t.name : t);
            if (" function " == typeof t) {
              var r = " __BtnClick__ " + this.randomKey(16);
              o[r] = t;
              t = r;
            }
            var l = e.getComponent(cc.Button);
            if (!l) {
              (l = e.addComponent(cc.Button)).transition = a;
              l.zoomScale = 1.05;
              0 == i.isScale && (l.transition = cc.Button.Transition.NONE);
            }
            if (l && !l.clickEvents[0]) {
              var s = new cc.Component.EventHandler();
              s.target = o.node;
              s.component = cc.js.getClassName(o);
              s.handler = t;
              s.customEventData = n;
              l.clickEvents[0] = s;
              for (var c in i) i.hasOwnProperty(c) && (l[c] = i[c]);
            }
            e.on(" click ", function () {});
          }
        };
        e.prototype.loadRemoteJpg = function (e) {
          return new Promise(function (t, o) {
            cc.sys.isNative ? cc.assetManager.loadRemote(e, {
              ext: ".jpg "
            }, function (e, n) {
              e ? o(e) : t(n);
            }) : t(null);
          });
        };
        e.prototype.random = function (e, t) {
          return Math.round(Math.random() * (t - e) + e);
        };
        e.prototype.setStatsColor = function (e, t) {
          void 0 === e && (e = cc.Color.WHITE);
          void 0 === t && (t = cc.color(255, 255, 255, 100));
          var o = cc.find(" PROFILER- NODE ");
          if (!o) return cc.warn(" 未找到统计面板节点 ！ ");
          o.children.forEach(function (t) {
            return t.color = e;
          });
          var n = o.getChildByName(" BACKGROUND ");
          if (!n) {
            n = new cc.Node(" BACKGROUND ");
            o.addChild(n, cc.macro.MIN_ZINDEX);
            n.setContentSize(o.getBoundingBoxToWorld());
            n.setPosition(0, 0);
          }
          var i = n.getComponent(cc.Graphics) || n.addComponent(cc.Graphics);
          i.clear();
          i.rect(-5, 12.5, n.width + 10, n.height - 10);
          i.fillColor = t;
          i.fill();
        };
        e.prototype.dealPro = function (e, t) {
          if (null != e && null != t) return (Math.round(e / t * 1e4) / 100).toFixed(2) + "% ";
        };
        e.prototype.getScript = function (e) {
          if (!e) return null;
          for (var t = e._components, o = 0; o < t.length; o++) if (t[o] && t[o].hasOwnProperty(" _super ")) return t[o];
          return null;
        };
        e.prototype.loadRemoteAsset = function (e) {
          return new Promise(function (t, o) {
            cc.assetManager.loadRemote(e, function (n, i) {
              if (n) {
                console.log(" 加载远程资源错误url: " + e, n);
                o(n);
              } else t(i);
            });
          });
        };
        e.prototype.log = function () {
          for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
          if (cc.sys.isNative) try {
            console.log(n.GAME_NAME, JSON.stringify(e));
          } catch (e) {
            console.error(n.GAME_NAME, e);
          } else console.log(n.GAME_NAME, e);
        };
        e.prototype.showBigToast = function (e, t, o) {
          var n = this;
          void 0 === e && (e = " ");
          void 0 === t && (t = .8);
          void 0 === o && (o = !0);
          if (e && (!(this.bigShows > 0) || o)) if (this.bigToast) {
            var a = cc.instantiate(this.bigToast);
            i.default.setToastNode(a);
            a.getChildByName(" content ").getChildByName(" text ").getComponent(cc.RichText).string = e;
            a.zIndex = 999;
            this.bigShows++;
            a.runAction(cc.sequence(cc.moveBy(t, 0, 160), cc.delayTime(2), cc.fadeOut(.3), cc.callFunc(function () {
              a.parent = null;
              a.destroy();
              n.bigShows--;
            })));
          } else cc.loader.loadRes(" prefabs/ NoticeToast ", cc.Prefab, function (i, a) {
            if (!i) {
              n.bigToast = a;
              n.showBigToast(e, t, o);
            }
          });
        };
        e.prototype.shuffle = function (e) {
          for (var t, o = e.length; o;) {
            var n = Math.floor(Math.random() * o--);
            t = [e[o], e[n]], e[n] = t[0], e[o] = t[1];
          }
          return e;
        };
        e.prototype.isLargeScreen = function () {
          var e = cc.winSize.height / cc.winSize.width;
          return Number(e.toFixed(2)) > 2;
        };
        e.prototype.convertNodePosition = function (e, t) {
          if (e && e.parent && t && t.parent) return e.parent.convertToNodeSpaceAR(t.parent.convertToWorldSpaceAR(t.position));
        };
        e.prototype.hundredsNum = function (e, t) {
          void 0 === t && (t = ".");
          for (var o = " ", n = 0, i = (e = (e || 0).toString()).length - 1; i >= 0; i--) {
            n++;
            o = e.charAt(i) + o;
            n % 2 || 0 == i || (o = t + o);
          }
          return o;
        };
        e.prototype.showManageViewToast = function (e, t, o) {
          var n = this;
          void 0 === e && (e = " ");
          void 0 === t && (t = .8);
          void 0 === o && (o = !0);
          if (e && (!(this.manageShows > 0) || o)) if (this.manageToast) {
            var a = cc.instantiate(this.manageToast);
            i.default.setToastNode(a);
            a.getChildByName(" content ").getChildByName(" text ").getComponent(cc.Label).string = e;
            a.zIndex = 999;
            a.y = -cc.winSize.height / 2 + 200;
            this.manageShows++;
            a.runAction(cc.sequence(cc.delayTime(3), cc.fadeOut(.3), cc.callFunc(function () {
              a.parent = null;
              a.destroy();
              n.manageShows--;
            })));
          } else {
            var r = this;
            cc.loader.loadRes(" prefabs/ Toast ", cc.Prefab, function (n, i) {
              if (!n) {
                r.manageToast = i;
                r.showManageViewToast(e, t, o);
              }
            });
          }
        };
        e.prototype.subUserName = function (e, t) {
          void 0 === t && (t = 8);
          return " " != e && e.length > t ? e.substring(0, t) : e;
        };
        e.prototype.getBottomPosY = function () {
          var e = -cc.winSize.height / 2;
          this.isLargeScreen() && (e += 30);
          return e;
        };
        e.prototype.formatTime = function (e) {
          var t = Math.floor(e / 60 << 0),
            o = Math.floor(e % 60);
          t < 10 && (t = " 0 " + t);
          o < 10 && (o = " 0 " + o);
          return t + ": " + o;
        };
        e.prototype.range = function (e, t) {
          t = t || 1;
          e = e || 0;
          this.currSeed = (9301 * this.currSeed + 49297) % 233280;
          var o = this.currSeed / 233280;
          return parseInt((e + o * (t - e)).toString());
        };
        e.prototype.randomsInt = function (e, t, o) {
          var n;
          o > t - e && (o = t - e);
          for (var i = Array.from({
              length: t - e
            }, function (t, o) {
              return o + e;
            }), a = 0; a < o; a++) {
            var r = Math.floor(Math.random() * (i.length - a) + a);
            n = [i[r], i[a]], i[a] = n[0], i[r] = n[1];
          }
          i.length = o;
          return i;
        };
        e.prototype.GetChildByName = function (e, t, o) {
          var n = e.node ? e.node : e,
            i = null;
          if (n && t) {
            i = n.getChildByName(t);
            if (o && !i) for (var a = n.children, r = n.childrenCount, l = 0; l < r && !(i = this.GetChildByName(a[l], t, o)); ++l);
          }
          return i;
        };
        e.prototype.destroyNode = function (e) {
          if (cc.isValid(e)) {
            e.removeFromParent(!1);
            e.destroy();
          } else console.error(" Tools: destroyNode error, param is invalid ");
        };
        e.prototype.localStorageSetItem = function (e, t) {
          cc.sys.localStorage.setItem(e, t);
        };
        e.prototype.localStorageGetItem = function (e, t) {
          var o = cc.sys.localStorage.getItem(e);
          return o && " " != o && null != o && " nan " != o ? o : t;
        };
        e.prototype.GetPrize = function (e) {
          for (var t = e.reduce(function (e, t) {
              return e + t;
            }, 0), o = Math.ceil(Math.random() * t), n = 0; n < e.length; n++) if (o <= e[n]) return n;
        };
        e.prototype.isEmptyObj = function (e) {
          return " {
}
" === JSON.stringify(e);
        };
        e.prototype.getRandPos = function (e, t) {
          var o = cc.v2(0, 0);
          e.lerp(t, Math.random(), o);
          return o;
        };
        e.prototype.isEmojiCharacter = function (e) {
          if (!e) return !1;
          for (var t = 0; t < e.length; t++) {
            var o = e.charCodeAt(t);
            if (55296 <= o && o <= 56319) {
              if (e.length > 1) {
                var n = 1024 * (o - 55296) + (e.charCodeAt(t + 1) - 56320) + 65536;
                if (118784 <= n && n <= 128895) return !0;
              }
            } else if (e.length > 1) {
              if (8419 == e.charCodeAt(t + 1)) return !0;
            } else {
              if (8448 <= o && o <= 10239) return !0;
              if (11013 <= o && o <= 11015) return !0;
              if (10548 <= o && o <= 10549) return !0;
              if (12951 <= o && o <= 12953) return !0;
              if (169 == o || 174 == o || 12349 == o || 12336 == o || 11093 == o || 11036 == o || 11035 == o || 11088 == o) return !0;
            }
          }
          return !1;
        };
        e.prototype.thousandsNum = function (e, t) {
          void 0 === t && (t = ".");
          for (var o = " ", n = 0, i = (e = (e || 0).toString()).length - 1; i >= 0; i--) {
            n++;
            o = e.charAt(i) + o;
            n % 3 || 0 == i || (o = t + o);
          }
          return o;
        };
        e.prototype.loadRemoteImg = function (e) {
          return new Promise(function (t, o) {
            cc.assetManager.loadRemote(e, {
              ext: ".png "
            }, function (e, n) {
              e ? o(e) : t(n);
            });
          });
        };
        e.prototype.getPosByRot = function (e, t) {
          var o = e * Math.cos(2 * Math.PI / 360 * (90 - t)),
            n = e * Math.sin(2 * Math.PI / 360 * (90 - t));
          return cc.v2(o, n);
        };
        e.prototype.loadResourceAsset = function (e) {
          return new Promise(function (t, o) {
            cc.resources.load(e, function (n, i) {
              if (n) {
                console.log(" 加载resource错误url: " + e, n);
                o(n);
              } else t(i);
            });
          });
        };
        e.prototype.getColor = function (e) {
          e.includes(" # ") || (e = " # " + e);
          return this.color.fromHEX(e);
        };
        e.prototype.randomInt = function (e, t) {
          return Math.round(Math.random() * (t - e) + e);
        };
        e.prototype.getTopPosY = function () {
          var e = cc.winSize.height / 2;
          this.isLargeScreen() && (e -= 65);
          return e;
        };
        e.prototype.getLocalData = function (e) {
          return cc.sys.localStorage.getItem(e) || " ";
        };
        e.prototype.getTempOut = function (e, t) {
          if (t) {
            for (var o = [], n = [], i = t, a = i.length, r = 0; o.length < e; r++) {
              var l = Math.floor(Math.random() * a);
              if (!n[l]) {
                n[l] = 1;
                o.push(i[l]);
              }
            }
            return o;
          }
        };
        e.prototype.setHead = function (e) {
          a.default.wx_head && this.loadRemoteImg(a.default.wx_head).then(function (t) {
            t && (e.spriteFrame = new cc.SpriteFrame(t));
          }).catch(function (e) {
            console.log(" setHead 加载图片失败: " + a.default.wx_head, e);
          });
        };
        e._getInstance = function () {
          e._isntance || (e._isntance = new e());
          return e._isntance;
        };
        e.prototype.formatDate = function (e, t) {
          void 0 === t && (t = "- ");
          var o = new Date(e);
          return " " + o.getFullYear() + t + (o.getMonth() + 1) + t + o.getDate();
        };
        e.prototype.getProgressWidth = function (e, t, o) {
          var n = e < .5 ? Math.ceil(e * o) : Math.floor(e * o);
          0 != n && n < t && (n = t);
          n > o && (n = o);
          var i = Math.floor(100 * e);
          isNaN(i) && (i = 1);
          return {
            width: n,
            persent: i
          };
        };
        return e;
      }();
    o.default = l._getInstance();
    cc._RF.pop();
