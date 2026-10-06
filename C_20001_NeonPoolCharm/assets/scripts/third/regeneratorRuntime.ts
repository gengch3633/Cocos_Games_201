// @ts-nocheck
"use strict";
function o(e) {
  return(o = "function" == typeof Symbol&& "symbol" == typeof Symbol.iterator? function(e) {
    return typeof e;
  }
: function(e) {
    return e&& "function" == typeof Symbol&& e.constructor === Symbol&& e !== Symbol.prototype? "symbol": typeof e;
  }
)(e);
}
(function() {
  var e = window.regeneratorRuntime = {
  }
, t = Object.prototype, n = t.hasOwnProperty, i = Object.defineProperty|| function(e, t, o) {
    e[t] = o.value;
  }
, a = "function" == typeof Symbol? Symbol: {
  }
, r = a.iterator|| "@@iterator", l = a.asyncIterator|| "@@asyncIterator", s = a.toStringTag|| "@@toStringTag";
  function c(e, t, o) {
    return Object.defineProperty(e, t, {
      value: o, enumerable: ! 0, configurable: ! 0, writable: ! 0
    }
), e[t];
  }
  try {
    c({
    }
, "");
  } catch(e) {
    c = function(e, t, o) {
      return e[t] = o;
    }
;
  }
  function u(e, t, o, n) {
    var a = t&& t.prototype instanceof _? t: _, r = Object.create(a.prototype), l = new E(n|| []);
    return i(r, "_invoke", {
      value: P(e, o, l)
    }
), r;
  }
  function p(e, t, o) {
    try {
      return {
        type: "normal", arg: e.call(t, o)
      }
;
    } catch(e) {
      return {
        type: "throw", arg: e
      }
;
    }
  }
  e.wrap = u;
  var d = {
  }
;
  function _() {
  }
  function f() {
  }
  function h() {
  }
  var g = {
  }
;
  c(g, r, function() {
    return this;
  }
);
  var y = Object.getPrototypeOf, v = y&& y(y(T([])));
  v&& v !== t&& n.call(v, r)&& (g = v);
  var m = h.prototype = _.prototype = Object.create(g);
  function b(e) {
["next", "throw", "return"].forEach(function(t) {
      c(e, t, function(e) {
        return this._invoke(t, e);
      }
);
    }
);
  }
  function C(e, t) {
    function a(i, r, l, s) {
      var c = p(e[i], e, r);
      if("throw" !== c.type) {
        var u = c.arg, d = u.value;
        return d&& "object" == o(d)&& n.call(d, "__await")? t.resolve(d.__await).then(function(e) {
          a("next", e, l, s);
        }
, function(e) {
          a("throw", e, l, s);
        }
): t.resolve(d).then(function(e) {
          u.value = e, l(u);
        }
, function(e) {
          return a("throw", e, l, s);
        }
);
      }
      s(c.arg);
    }
    var r;
    i(this, "_invoke", {
      value: function(e, o) {
        function n() {
          return new t(function(t, n) {
            a(e, o, t, n);
          }
);
        }
        return r = r? r.then(n, n): n();
      }
    }
);
  }
  function P(e, t, o) {
    var n = "suspendedStart";
    return function(i, a) {
      if("executing" === n) throw new Error("Generator is already running");
      if("completed" === n) {
        if("throw" === i) throw a;
        return {
          value: void 0, done: ! 0
        }
;
      }
      for(o.method = i, o.arg = a;
;
) {
        var r = o.delegate;
        if(r) {
          var l = S(r, o);
          if(l) {
            if(l === d) continue;
            return l;
          }
        }
        if("next" === o.method) o.sent = o._sent = o.arg;
        else if("throw" === o.method) {
          if("suspendedStart" === n) throw n = "completed", o.arg;
          o.dispatchException(o.arg);
        } else "return" === o.method&& o.abrupt("return", o.arg);
        n = "executing";
        var s = p(e, t, o);
        if("normal" === s.type) {
          if(n = o.done? "completed": "suspendedYield", s.arg === d) continue;
          return {
            value: s.arg, done: o.done
          }
;
        }
        "throw" === s.type&& (n = "completed", o.method = "throw", o.arg = s.arg);
      }
    }
;
  }
  function S(e, t) {
    var o = t.method, n = e.iterator[o];
    if(void 0 === n) return t.delegate = null, "throw" === o&& e.iterator.return&& (t.method = "return", t.arg = void 0, S(e, t), "throw" === t.method)|| "return" !== o&& (t.method = "throw", t.arg = new TypeError("The iterator does not provide a '"+ o+ "' method")), d;
    var i = p(n, e.iterator, t.arg);
    if("throw" === i.type) return t.method = "throw", t.arg = i.arg, t.delegate = null, d;
    var a = i.arg;
    return a? a.done?(t[e.resultName] = a.value, t.next = e.nextLoc, "return" !== t.method&& (t.method = "next", t.arg = void 0), t.delegate = null, d): a:(t.method = "throw", t.arg = new TypeError("iterator result is not an object"), t.delegate = null, d);
  }
  function I(e) {
    var t = {
      tryLoc: e[0]
    }
;
    1 in e&& (t.catchLoc = e[1]), 2 in e&& (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t);
  }
  function D(e) {
    var t = e.completion|| {
    }
;
    t.type = "normal", delete t.arg, e.completion = t;
  }
  function E(e) {
    this.tryEntries = [{
      tryLoc: "root"
    }
], e.forEach(I, this), this.reset(! 0);
  }
  function T(e) {
    if(e) {
      var t = e[r];
      if(t) return t.call(e);
      if("function" == typeof e.next) return e;
      if(! isNaN(e.length)) {
        var o = - 1, i = function t() {
          for(;
++ o < e.length;
) if(n.call(e, o)) return t.value = e[o], t.done = ! 1, t;
          return t.value = void 0, t.done = ! 0, t;
        }
;
        return i.next = i;
      }
    }
    return {
      next: w
    }
;
  }
  function w() {
    return {
      value: void 0, done: ! 0
    }
;
  }
  f.prototype = h, i(m, "constructor", {
    value: h, configurable: ! 0
  }
), i(h, "constructor", {
    value: f, configurable: ! 0
  }
), f.displayName = c(h, s, "GeneratorFunction"), e.isGeneratorFunction = function(e) {
    var t = "function" == typeof e&& e.constructor;
    return ! ! t&& (t === f|| "GeneratorFunction" === (t.displayName|| t.name));
  }
, e.mark = function(e) {
    return Object.setPrototypeOf? Object.setPrototypeOf(e, h):(e.__proto__ = h, c(e, s, "GeneratorFunction")), e.prototype = Object.create(m), e;
  }
, e.awrap = function(e) {
    return {
      __await: e
    }
;
  }
, b(C.prototype), c(C.prototype, l, function() {
    return this;
  }
), e.AsyncIterator = C, e.async = function(t, o, n, i, a) {
    void 0 === a&& (a = Promise);
    var r = new C(u(t, o, n, i), a);
    return e.isGeneratorFunction(o)? r: r.next().then(function(e) {
      return e.done? e.value: r.next();
    }
);
  }
, b(m), c(m, s, "Generator"), c(m, r, function() {
    return this;
  }
), c(m, "toString", function() {
    return "[object Generator]";
  }
), e.keys = function(e) {
    var t = Object(e), o = [];
    for(var n in t) o.push(n);
    return o.reverse(), function e() {
      for(;
      o.length;
) {
        var n = o.pop();
        if(n in t) return e.value = n, e.done = ! 1, e;
      }
      return e.done = ! 0, e;
    }
;
  }
, e.values = T, E.prototype = {
    constructor: E, reset: function(e) {
      if(this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = ! 1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(D), ! e) for(var t in this) "t" === t.charAt(0)&& n.call(this, t)&& ! isNaN(+ t.slice(1))&& (this[t] = void 0);
    }
, stop: function() {
      this.done = ! 0;
      var e = this.tryEntries[0].completion;
      if("throw" === e.type) throw e.arg;
      return this.rval;
    }
, dispatchException: function(e) {
      if(this.done) throw e;
      var t = this;
      function o(o, n) {
        return r.type = "throw", r.arg = e, t.next = o, n&& (t.method = "next", t.arg = void 0), ! ! n;
      }
      for(var i = this.tryEntries.length- 1;
      i >= 0;
-- i) {
        var a = this.tryEntries[i], r = a.completion;
        if("root" === a.tryLoc) return o("end");
        if(a.tryLoc <= this.prev) {
          var l = n.call(a, "catchLoc"), s = n.call(a, "finallyLoc");
          if(l&& s) {
            if(this.prev < a.catchLoc) return o(a.catchLoc, ! 0);
            if(this.prev < a.finallyLoc) return o(a.finallyLoc);
          } else if(l) {
            if(this.prev < a.catchLoc) return o(a.catchLoc, ! 0);
          } else {
            if(! s) throw new Error("try statement without catch or finally");
            if(this.prev < a.finallyLoc) return o(a.finallyLoc);
          }
        }
      }
    }
, abrupt: function(e, t) {
      for(var o = this.tryEntries.length- 1;
      o >= 0;
-- o) {
        var i = this.tryEntries[o];
        if(i.tryLoc <= this.prev&& n.call(i, "finallyLoc")&& this.prev < i.finallyLoc) {
          var a = i;
          break;
        }
      }
      a&& ("break" === e|| "continue" === e)&& a.tryLoc <= t&& t <= a.finallyLoc&& (a = null);
      var r = a? a.completion: {
      }
;
      return r.type = e, r.arg = t, a?(this.method = "next", this.next = a.finallyLoc, d): this.complete(r);
    }
, complete: function(e, t) {
      if("throw" === e.type) throw e.arg;
      return "break" === e.type|| "continue" === e.type? this.next = e.arg: "return" === e.type?(this.rval = this.arg = e.arg, this.method = "return", this.next = "end"): "normal" === e.type&& t&& (this.next = t), d;
    }
, finish: function(e) {
      for(var t = this.tryEntries.length- 1;
      t >= 0;
-- t) {
        var o = this.tryEntries[t];
        if(o.finallyLoc === e) return this.complete(o.completion, o.afterLoc), D(o), d;
      }
    }
, catch: function(e) {
      for(var t = this.tryEntries.length- 1;
      t >= 0;
-- t) {
        var o = this.tryEntries[t];
        if(o.tryLoc === e) {
          var n = o.completion;
          if("throw" === n.type) {
            var i = n.arg;
            D(o);
          }
          return i;
        }
      }
      throw new Error("illegal catch attempt");
    }
, delegateYield: function(e, t, o) {
      return this.delegate = {
        iterator: T(e), resultName: t, nextLoc: o
      }
, "next" === this.method&& (this.arg = void 0), d;
    }
  }
;
}
)();

