let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "ae1d44ljaNFXL8DMQb6zyY/", "EventSystem");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
i.CLOSE_RECONNECT = void 0;
var n = function(e) {
  __extends(t, e);
  function t(t, i, n, a) {
    return e.call(this, t, i, n, a)|| this;
  }
  t.prototype.recover = function() {
    if(this._id > 0) {
      this._id = 0;
      t._pool.push(this.clear());
    }
  }
;
  t.prototype.register = function(e, t) {
    this._dispatcher = e;
    this._type = t;
  }
;
  t.prototype.check = function(e, t) {
    return !(this._dispatcher&& this._dispatcher != e|| this._type&& this._type != t);
  }
;
  t.create = function(e, i, n, a) {
    void 0 === n&& (n = null);
    void 0 === a&& (a = ! 0);
    return t._pool.length? t._pool.pop().setTo(e, i, n, a): new t(e, i, n, a);
  }
;
  t._pool = [];
  return t;
}
(e("Handler.js").default),
a = function() {
  function e() {
  }
  e.prototype.event = function(e, t) {
    void 0 === t&& (t = null);
    if(! this._events|| ! this._events[e]) return ! 1;
    var i = this._events[e];
    if(i.run) {
      i.once&& delete this._events[e];
      i.check(this, e)&& (null != t? i.runWith(t): i.run());
    } else {
      for(var n = 0, a = i.length;
      n < a;
      n++) {
        var o = i[n];
        o&& o.check(this, e)&& (null != t? o.runWith(t): o.run());
        if(! o|| o.once) {
          i.splice(n, 1);
          n--;
          a--;
        }
      }
      0 === i.length&& this._events&& delete this._events[e];
    }
    return ! 0;
  }
;
  e.prototype.on = function(e, t, i, n) {
    void 0 === n&& (n = null);
    return this._createListener(e, t, i, n, ! 1);
  }
;
  e.prototype._createListener = function(e, t, i, a, o, r) {
    void 0 === r&& (r = ! 0);
    r&& this.off(e, t, i, o);
    var s = n.create(t|| this, i, a, o);
    s.register(this, e);
    this._events|| (this._events = {
    }
);
    var l = this._events;
    l[e]? l[e].run? l[e] = [l[e], s]: l[e].push(s): l[e] = s;
    return this;
  }
;
  e.prototype.off = function(e, t, i, n) {
    void 0 === n&& (n = ! 1);
    if(! this._events|| ! this._events[e]) return this;
    var a = this._events[e];
    if(null != a) if(a.run) {
      if((! t|| a.caller === t)&& (null == i|| a.method === i)&& (! n|| a.once)) {
        delete this._events[e];
        a.recover();
      }
    } else {
      for(var o = 0;
      o < a.length;
      o++) {
        var r = a[o];
        if(r&& (! t|| r.caller === t)&& (null == i|| r.method === i)&& (! n|| r.once)) {
          a.splice(o, 1);
          o--;
          r.recover();
        }
      }
      0 === a.length&& delete this._events[e];
    }
    return this;
  }
;
  e.prototype.offAllCaller = function(e) {
    if(e&& this._events) for(var t in this._events) this.off(t, e, null);
    return this;
  }
;
  return e;
}
(),
o = function() {
  function e() {
  }
  e.listen = function(e, t, i, n) {
    this.dispatcher.off(e, i, t);
    this.dispatcher.on(e, i, t, n);
  }
;
  e.ignore = function(e, t, i) {
    this.dispatcher.off(e, i, t, ! 1);
  }
;
  e.trigger = function(e, t) {
    this.dispatcher.event(e, t);
  }
;
  e.ignoreAll = function(e) {
    this.dispatcher.offAllCaller(e);
  }
;
  e.dispatcher = new a();
  return e;
}
();
i.default = o;
i.CLOSE_RECONNECT = "CLOSE_RECONNECT";
cc._RF.pop();
