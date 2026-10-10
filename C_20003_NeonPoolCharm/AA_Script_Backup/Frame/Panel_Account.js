let e = require;let t = module;let a = exports;
    "use strict";

    cc._RF.push(t, "896d9iccSVHzZ/+xLAfbbMI", "Panel_Account");
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
      l = cc._decorator,
      u = l.ccclass,
      d = l.property,
      p = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.panel_window = null;
          t.cashLabel = null;
          t.paymentToggleContainer = null;
          t.editbox = null;
          t.viewData = null;
          t._paymentIDs = [];
          t.hideTime = 0;
          return t;
        }
        t.prototype.onBtnEvent = function (e, t) {
          var a, o, n;
          if ("1" == t) {
            if (!(this.editbox.string.trim().length > 0)) {
              c.FrameSDK.showToast("skey_024");
              return;
            }
            var i = this.paymentToggleContainer.toggleItems.findIndex(function (e) {
              return e.isChecked;
            });
            r.FrameData.saveData.account = this.editbox.string.trim();
            r.FrameData.saveData.paymentID = null !== (a = this._paymentIDs[i]) && void 0 !== a ? a : -1;
            null === (n = (o = this.viewData).closeCB) || void 0 === n || n.call(o);
          }
          this.close();
        };
        t.prototype.onLoad = function () {
          c.FrameSDK.openEffect(this);
        };
        t.prototype.close = function () {
          if (Date.now() - this.hideTime <= 300) console.log("wait!!!，return");else {
            this.hideTime = Date.now();
            c.FrameSDK.closeEffect(this, null);
          }
        };
        t.prototype.onEnable = function () {
          var e,
            t = this;
          this.cashLabel.string = null !== (e = this.viewData.numStr) && void 0 !== e ? e : "";
          this._paymentIDs = r.FrameData.CountryConf.cash_id.slice(0, 4);
          this.paymentToggleContainer.node.children.forEach(function (e, a) {
            var o;
            return e.getComponent(s.default).paymentID = null !== (o = t._paymentIDs[a]) && void 0 !== o ? o : -1;
          });
        };
        i([d(cc.Node)], t.prototype, "panel_window", void 0);
        i([d(cc.Label)], t.prototype, "cashLabel", void 0);
        i([d(cc.ToggleContainer)], t.prototype, "paymentToggleContainer", void 0);
        i([d(cc.EditBox)], t.prototype, "editbox", void 0);
        return i([u], t);
      }(cc.Component);
    a.default = p;
    cc._RF.pop();
