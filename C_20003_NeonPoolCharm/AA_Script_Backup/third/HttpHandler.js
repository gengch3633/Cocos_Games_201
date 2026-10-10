let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "6957arYiH5JUZfPue6xmAQe", "HttpHandler");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = e("Service.js"),
      i = e("UrlMgr.js"),
      a = function () {
        function e(e, t, o) {
          this._successHandle = null;
          this._failHandle = null;
          this._requestType = null;
          this._requestData = null;
          this._retry = !1;
          this.setHandler(e, t, o);
        }
        e.prototype.clear = function () {
          this._requestType = null;
          this._requestData = null;
          this._successHandle && this._successHandle.recover();
          this._failHandle && this._failHandle.recover();
          return this;
        };
        e.prototype.setHandler = function (e, t, o) {
          this.setRequest(e);
          this._successHandle = t;
          this._failHandle = o;
          return this;
        };
        e.prototype.setRequest = function (e) {
          this._requestType = e;
          this._requestData = null;
          this._retry = i.default.getInstance().needEnqueue(this._requestType);
          return this;
        };
        e.prototype.getRequestData = function () {
          return this._requestData;
        };
        e.prototype.enterQueue = function () {
          return i.default.getInstance().needEnqueue(this._requestType);
        };
        e.prototype.getRequestType = function () {
          return this._requestType;
        };
        e.prototype.setRequestData = function (e) {
          void 0 === e && (e = null);
          this._requestData = e;
          return this;
        };
        e.prototype.setRetry = function (e) {
          this._retry = e;
          return this;
        };
        e.create = function (t, o, n) {
          return e._pool.length ? e._pool.pop().setHandler(t, o, n) : new e(t, o, n);
        };
        e.prototype.success = function (e) {
          this._successHandle && this._successHandle.runWith(e);
          this.recover();
          return !1;
        };
        e.prototype.needRetry = function () {
          return this._retry;
        };
        e.prototype.fail = function (e) {
          this._failHandle && this._failHandle.runWith(e);
          if (this._retry) return !0;
          this.recover();
          return !1;
        };
        e.prototype.recover = function () {
          e._pool.push(this.clear());
        };
        e.prototype.handleRequest = function () {
          n.default.request(this);
        };
        return e;
      }();
    o.default = a;
    a._pool = [];
    cc._RF.pop();
