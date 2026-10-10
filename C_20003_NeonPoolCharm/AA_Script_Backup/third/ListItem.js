let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "eb3ed6Eg55Nv6qx0yJzkO5h", "ListItem");
    var n,
      i = this && this.__extends || (n = function (e, t) {
        return (n = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        })(e, t);
      }, function (e, t) {
        n(e, t);
        function o() {
          this.constructor = e;
        }
        e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
      }),
      a = this && this.__decorate || function (e, t, o, n) {
        var i,
          a = arguments.length,
          r = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (r = (a < 3 ? i(r) : a > 3 ? i(t, o, r) : i(t, o)) || r);
        return a > 3 && r && Object.defineProperty(t, o, r), r;
      };
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var r = cc._decorator,
      l = r.ccclass,
      s = r.property,
      c = r.disallowMultiple,
      u = r.menu,
      p = r.executionOrder,
      d = cc.Enum({
        NONE: 0,
        TOGGLE: 1,
        SWITCH: 2
      }),
      _ = (cc._decorator, function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.icon = null;
          t.title = null;
          t.selectedMode = d.NONE;
          t.selectedFlag = null;
          t.selectedSpriteFrame = null;
          t._unselectedSpriteFrame = null;
          t.adaptiveSize = !1;
          t._selected = !1;
          t._eventReg = !1;
          t.listId = null;
          return t;
        }
        Object.defineProperty(t.prototype, "selected", {
          get: function () {
            return this._selected;
          },
          set: function (e) {
            this._selected = e;
            if (this.selectedFlag) switch (this.selectedMode) {
              case d.TOGGLE:
                this.selectedFlag.active = e;
                break;
              case d.SWITCH:
                var t = this.selectedFlag.getComponent(cc.Sprite);
                t && (t.spriteFrame = e ? this.selectedSpriteFrame : this._unselectedSpriteFrame);
            }
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(t.prototype, "btnCom", {
          get: function () {
            this._btnCom || (this._btnCom = this.node.getComponent(cc.Button));
            return this._btnCom;
          },
          enumerable: !1,
          configurable: !0
        });
        t.prototype.onLoad = function () {
          if (this.selectedMode == d.SWITCH) {
            var e = this.selectedFlag.getComponent(cc.Sprite);
            this._unselectedSpriteFrame = e.spriteFrame;
          }
        };
        t.prototype.showAni = function (e, t, o) {
          var n,
            i = this;
          switch (e) {
            case 0:
              n = cc.tween(i.node).to(.2, {
                scale: .7
              }).by(.3, {
                y: 2 * i.node.height
              });
              break;
            case 1:
              n = cc.tween(i.node).to(.2, {
                scale: .7
              }).by(.3, {
                x: 2 * i.node.width
              });
              break;
            case 2:
              n = cc.tween(i.node).to(.2, {
                scale: .7
              }).by(.3, {
                y: -2 * i.node.height
              });
              break;
            case 3:
              n = cc.tween(i.node).to(.2, {
                scale: .7
              }).by(.3, {
                x: -2 * i.node.width
              });
              break;
            default:
              n = cc.tween(i.node).to(.3, {
                scale: .1
              });
          }
          (t || o) && n.call(function () {
            if (o) {
              i.list._delSingleItem(i.node);
              for (var e = i.list.displayData.length - 1; e >= 0; e--) if (i.list.displayData[e].id == i.listId) {
                i.list.displayData.splice(e, 1);
                break;
              }
            }
            t();
          });
          n.start();
        };
        t.prototype.onDestroy = function () {
          this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
        };
        t.prototype.createEvt = function (e, t, o) {
          void 0 === o && (o = null);
          if (e.isValid) {
            e.comName = e.comName || e.name.match(/\<(.*?)\>/g).pop().replace(/\<|>/g, "");
            var n = new cc.Component.EventHandler();
            n.target = o || e.node;
            n.component = e.comName;
            n.handler = t;
            return n;
          }
        };
        t.prototype._onSizeChange = function () {
          this.list._onItemAdaptive(this.node);
        };
        t.prototype.onClickThis = function () {
          this.list.selectedId = this.listId;
        };
        t.prototype._registerEvent = function () {
          if (!this._eventReg) {
            this.btnCom && this.list.selectedMode > 0 && this.btnCom.clickEvents.unshift(this.createEvt(this, "onClickThis"));
            this.adaptiveSize && this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
            this._eventReg = !0;
          }
        };
        a([s({
          type: cc.Sprite,
          tooltip: ""
        })], t.prototype, "icon", void 0);
        a([s({
          type: cc.Node,
          tooltip: ""
        })], t.prototype, "title", void 0);
        a([s({
          type: cc.Enum(d),
          tooltip: ""
        })], t.prototype, "selectedMode", void 0);
        a([s({
          type: cc.Node,
          tooltip: "",
          visible: function () {
            return this.selectedMode > d.NONE;
          }
        })], t.prototype, "selectedFlag", void 0);
        a([s({
          type: cc.SpriteFrame,
          tooltip: "",
          visible: function () {
            return this.selectedMode == d.SWITCH;
          }
        })], t.prototype, "selectedSpriteFrame", void 0);
        a([s({
          tooltip: ""
        })], t.prototype, "adaptiveSize", void 0);
        return a([l, c(), u("自定义组件/List Item"), p(-5001)], t);
      }(cc.Component));
    o.default = _;
    cc._RF.pop();
