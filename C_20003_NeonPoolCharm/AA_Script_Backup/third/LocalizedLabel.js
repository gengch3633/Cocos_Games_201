let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "9353ftBk3hAoZgRbbwADh8P", "LocalizedLabel");
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
      s = r.executeInEditMode,
      c = r.menu,
      u = r.property,
      p = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t._dataID = "";
          t.label = null;
          t.editBox = null;
          t.richText = null;
          return t;
        }
        Object.defineProperty(t.prototype, "dataID", {
          get: function () {
            return this._dataID;
          },
          set: function (e) {
            if (this._dataID !== e) {
              this._dataID = e;
              this.updateLabel();
            }
          },
          enumerable: !1,
          configurable: !0
        });
        t.prototype.updateLabel = function () {
          if (this.label || this.editBox || this.richText) {
            var e = i18n.t(this.dataID);
            if (e) {
              this.label && (this.label.string = e);
              this.editBox && (this.editBox.placeholder = e);
              this.richText && (this.richText.string = e);
            }
          } else cc.error("Failed to update localized label, label or editbox component is invalid!");
        };
        t.prototype.fetchRender = function () {
          var e = this.getComponent(cc.Label);
          e && (this.label = e);
          var t = this.getComponent(cc.EditBox);
          t && (this.editBox = t);
          var o = this.getComponent(cc.RichText);
          o && (this.richText = o);
          this.updateLabel();
        };
        t.prototype.onLoad = function () {
          i18n.inst || i18n.init();
          this.fetchRender();
        };
        a([u], t.prototype, "_dataID", void 0);
        a([u({})], t.prototype, "dataID", null);
        return a([l, s(), c("i18n/LocalizedLabel")], t);
      }(cc.Component);
    o.default = p;
    cc._RF.pop();
