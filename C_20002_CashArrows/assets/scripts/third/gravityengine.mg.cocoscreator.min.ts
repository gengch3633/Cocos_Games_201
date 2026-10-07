function i(e, t) {
  var i,
  n = Object.keys(e);
  if(Object.getOwnPropertySymbols) {
    i = Object.getOwnPropertySymbols(e);
    t&& (i = i.filter(function(t) {
      return Object.getOwnPropertyDescriptor(e, t).enumerable;
    }
));
    n.push.apply(n, i);
  }
  return n;
}
function n(e) {
  for(var t = 1;
  t < arguments.length;
  t++) {
    var n = null != arguments[t]? arguments[t]: {
    }
;
    t% 2? i(Object(n), ! 0).forEach(function(t) {
      d(e, t, n[t]);
    }
): Object.getOwnPropertyDescriptors? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)): i(Object(n)).forEach(function(t) {
      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
    }
);
  }
  return e;
}
function a() {
  a = function() {
    return e;
  }
;
  var e = {
  }
,
  t = Object.prototype,
  i = t.hasOwnProperty,
  n = Object.defineProperty|| function(e, t, i) {
    e[t] = i.value;
  }
,
  o = (d = "function" == typeof Symbol? Symbol: {
  }
).iterator|| "@@iterator",
  r = d.asyncIterator|| "@@asyncIterator",
  s = d.toStringTag|| "@@toStringTag";
  function l(e, t, i) {
    Object.defineProperty(e, t, {
      value: i, enumerable: ! 0, configurable: ! 0, writable: ! 0
    }
);
    return e[t];
  }
  try {
    l({
    }
, "");
  } catch(t) {
    l = function(e, t, i) {
      return e[t] = i;
    }
;
  }
  function c(e, t, i, a) {
    var o,
    r,
    s,
    l;
    t = t&& t.prototype instanceof _? t: _;
    t = Object.create(t.prototype);
    a = new k(a|| []);
    n(t, "_invoke", {
      value:(o = e, r = i, s = a, l = "suspendedStart", function(e, t) {
        if("executing" === l) throw new Error("Generator is already running");
        if("completed" === l) {
          if("throw" === e) throw t;
          return {
            value: void 0, done: ! 0
          }
;
        }
        s.method = e;
        for(s.arg = t;
;
) {
          var i = s.delegate;
          if(i&& (i = function e(t, i) {
            var n = i.method, a = t.iterator[n];
            return void 0 === a?(i.delegate = null, "throw" === n&& t.iterator.return&& (i.method = "return", i.arg = void 0, e(t, i), "throw" === i.method)|| "return" !== n&& (i.method = "throw", i.arg = new TypeError("The iterator does not provide a '"+ n+ "' method")), p): "throw" === (n = u(a, t.iterator, i.arg)).type?(i.method = "throw", i.arg = n.arg, i.delegate = null, p):(a = n.arg)? a.done?(i[t.resultName] = a.value, i.next = t.nextLoc, "return" !== i.method&& (i.method = "next", i.arg = void 0), i.delegate = null, p): a:(i.method = "throw", i.arg = new TypeError("iterator result is not an object"), i.delegate = null, p);
          }
(i, s))) {
            if(i === p) continue;
            return i;
          }
          if("next" === s.method) s.sent = s._sent = s.arg;
          else if("throw" === s.method) {
            if("suspendedStart" === l) throw l = "completed", s.arg;
            s.dispatchException(s.arg);
          } else "return" === s.method&& s.abrupt("return", s.arg);
          l = "executing";
          if("normal" === (i = u(o, r, s)).type) {
            l = s.done? "completed": "suspendedYield";
            if(i.arg === p) continue;
            return {
              value: i.arg, done: s.done
            }
;
          }
          if("throw" === i.type) {
            l = "completed";
            s.method = "throw";
            s.arg = i.arg;
          }
        }
      }
)
    }
);
    return t;
  }
  function u(e, t, i) {
    try {
      return {
        type: "normal",
        arg: e.call(t, i)
      }
;
    } catch(e) {
      return {
        type: "throw",
        arg: e
      }
;
    }
  }
  e.wrap = c;
  var d,
  h,
  p = {
  }
;
  function _() {
  }
  function f() {
  }
  function g() {
  }
  l(d = {
  }
, o, function() {
    return this;
  }
);
(h = (h = Object.getPrototypeOf)&& h(h(S([]))))&& h !== t&& i.call(h, o)&& (d = h);
  var m = g.prototype = _.prototype = Object.create(d);
  function y(e) {
["next", "throw", "return"].forEach(function(t) {
      l(e, t, function(e) {
        return this._invoke(t, e);
      }
);
    }
);
  }
  function v(e, t) {
    var a;
    n(this, "_invoke", {
      value: function(n, o) {
        function r() {
          return new t(function(a, r) {
! function n(a, o, r, s) {
              var l;
              if("throw" !== (a = u(e[a], e, o)).type) return(o = (l = a.arg).value)&& "object" == typeof o&& i.call(o, "__await")? t.resolve(o.__await).then(function(e) {
                n("next", e, r, s);
              }
, function(e) {
                n("throw", e, r, s);
              }
): t.resolve(o).then(function(e) {
                l.value = e;
                r(l);
              }
, function(e) {
                return n("throw", e, r, s);
              }
);
              s(a.arg);
            }
(n, o, a, r);
          }
);
        }
        return a = a? a.then(r, r): r();
      }
    }
);
  }
  function b(e) {
    var t = {
      tryLoc: e[0]
    }
;
    1 in e&& (t.catchLoc = e[1]);
    if(2 in e) {
      t.finallyLoc = e[2];
      t.afterLoc = e[3];
    }
    this.tryEntries.push(t);
  }
  function w(e) {
    var t = e.completion|| {
    }
;
    t.type = "normal";
    delete t.arg;
    e.completion = t;
  }
  function k(e) {
    this.tryEntries = [{
      tryLoc: "root"
    }
];
    e.forEach(b, this);
    this.reset(! 0);
  }
  function S(e) {
    if(e|| "" === e) {
      var t,
      n = e[o];
      if(n) return n.call(e);
      if("function" == typeof e.next) return e;
      if(! isNaN(e.length)) {
        t = - 1;
        return(n = function n() {
          for(;
++ t < e.length;
) if(i.call(e, t)) {
            n.value = e[t];
            n.done = ! 1;
            return n;
          }
          n.value = void 0;
          n.done = ! 0;
          return n;
        }
).next = n;
      }
    }
    throw new TypeError(typeof e+ " is not iterable");
  }
  n(m, "constructor", {
    value: f.prototype = g, configurable: ! 0
  }
);
  n(g, "constructor", {
    value: f, configurable: ! 0
  }
);
  f.displayName = l(g, s, "GeneratorFunction");
  e.isGeneratorFunction = function(e) {
    return ! !(e = "function" == typeof e&& e.constructor)&& (e === f|| "GeneratorFunction" === (e.displayName|| e.name));
  }
;
  e.mark = function(e) {
    if(Object.setPrototypeOf) Object.setPrototypeOf(e, g);
    else {
      e.__proto__ = g;
      l(e, s, "GeneratorFunction");
    }
    e.prototype = Object.create(m);
    return e;
  }
;
  e.awrap = function(e) {
    return {
      __await: e
    }
;
  }
;
  y(v.prototype);
  l(v.prototype, r, function() {
    return this;
  }
);
  e.AsyncIterator = v;
  e.async = function(t, i, n, a, o) {
    void 0 === o&& (o = Promise);
    var r = new v(c(t, i, n, a), o);
    return e.isGeneratorFunction(i)? r: r.next().then(function(e) {
      return e.done? e.value: r.next();
    }
);
  }
;
  y(m);
  l(m, s, "Generator");
  l(m, o, function() {
    return this;
  }
);
  l(m, "toString", function() {
    return "[object Generator]";
  }
);
  e.keys = function(e) {
    var t,
    i = Object(e),
    n = [];
    for(t in i) n.push(t);
    n.reverse();
    return function e() {
      for(;
      n.length;
) {
        var t = n.pop();
        if(t in i) {
          e.value = t;
          e.done = ! 1;
          return e;
        }
      }
      e.done = ! 0;
      return e;
    }
;
  }
;
  e.values = S;
  k.prototype = {
    constructor: k,
    reset: function(e) {
      this.prev = 0;
      this.next = 0;
      this.sent = this._sent = void 0;
      this.done = ! 1;
      this.delegate = null;
      this.method = "next";
      this.arg = void 0;
      this.tryEntries.forEach(w);
      if(! e) for(var t in this) "t" === t.charAt(0)&& i.call(this, t)&& ! isNaN(+ t.slice(1))&& (this[t] = void 0);
    }
,
    stop: function() {
      this.done = ! 0;
      var e = this.tryEntries[0].completion;
      if("throw" === e.type) throw e.arg;
      return this.rval;
    }
,
    dispatchException: function(e) {
      if(this.done) throw e;
      var t = this;
      function n(i, n) {
        r.type = "throw";
        r.arg = e;
        t.next = i;
        if(n) {
          t.method = "next";
          t.arg = void 0;
        }
        return ! ! n;
      }
      for(var a = this.tryEntries.length- 1;
      0 <= a;
-- a) {
        var o = this.tryEntries[a],
        r = o.completion;
        if("root" === o.tryLoc) return n("end");
        if(o.tryLoc <= this.prev) {
          var s = i.call(o, "catchLoc"),
          l = i.call(o, "finallyLoc");
          if(s&& l) {
            if(this.prev < o.catchLoc) return n(o.catchLoc, ! 0);
            if(this.prev < o.finallyLoc) return n(o.finallyLoc);
          } else if(s) {
            if(this.prev < o.catchLoc) return n(o.catchLoc, ! 0);
          } else {
            if(! l) throw new Error("try statement without catch or finally");
            if(this.prev < o.finallyLoc) return n(o.finallyLoc);
          }
        }
      }
    }
,
    abrupt: function(e, t) {
      for(var n = this.tryEntries.length- 1;
      0 <= n;
-- n) {
        var a = this.tryEntries[n];
        if(a.tryLoc <= this.prev&& i.call(a, "finallyLoc")&& this.prev < a.finallyLoc) {
          var o = a;
          break;
        }
      }
      var r = (o = o&& ("break" === e|| "continue" === e)&& o.tryLoc <= t&& t <= o.finallyLoc? null: o)? o.completion: {
      }
;
      r.type = e;
      r.arg = t;
      return o?(this.method = "next", this.next = o.finallyLoc, p): this.complete(r);
    }
,
    complete: function(e, t) {
      if("throw" === e.type) throw e.arg;
      if("break" === e.type|| "continue" === e.type) this.next = e.arg;
      else if("return" === e.type) {
        this.rval = this.arg = e.arg;
        this.method = "return";
        this.next = "end";
      } else "normal" === e.type&& t&& (this.next = t);
      return p;
    }
,
    finish: function(e) {
      for(var t = this.tryEntries.length- 1;
      0 <= t;
-- t) {
        var i = this.tryEntries[t];
        if(i.finallyLoc === e) {
          this.complete(i.completion, i.afterLoc);
          w(i);
          return p;
        }
      }
    }
,
    catch: function(e) {
      for(var t = this.tryEntries.length- 1;
      0 <= t;
-- t) {
        var i,
        n,
        a = this.tryEntries[t];
        if(a.tryLoc === e) {
          if("throw" === (i = a.completion).type) {
            n = i.arg;
            w(a);
          }
          return n;
        }
      }
      throw new Error("illegal catch attempt");
    }
,
    delegateYield: function(e, t, i) {
      this.delegate = {
        iterator: S(e),
        resultName: t,
        nextLoc: i
      }
;
      "next" === this.method&& (this.arg = void 0);
      return p;
    }
  }
;
  return e;
}
function o(e) {
  return(o = "function" == typeof Symbol&& "symbol" == typeof Symbol.iterator? function(e) {
    return typeof e;
  }
: function(e) {
    return e&& "function" == typeof Symbol&& e.constructor === Symbol&& e !== Symbol.prototype? "symbol": typeof e;
  }
)(e);
}
function r(e, t, i, n, a, o, r) {
  try {
    var s = e[o](r),
    l = s.value;
  } catch(e) {
    return void i(e);
  }
  s.done? t(l): Promise.resolve(l).then(n, a);
}
function s(e) {
  return function() {
    var t = this,
    i = arguments;
    return new Promise(function(n, a) {
      var o = e.apply(t, i);
      function s(e) {
        r(o, n, a, s, l, "next", e);
      }
      function l(e) {
        r(o, n, a, s, l, "throw", e);
      }
      s(void 0);
    }
);
  }
;
}
function l(e, t) {
  if(!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function c(e, t) {
  for(var i = 0;
  i < t.length;
  i++) {
    var n = t[i];
    n.enumerable = n.enumerable|| ! 1;
    n.configurable = ! 0;
    "value" in n&& (n.writable = ! 0);
    Object.defineProperty(e, p(n.key), n);
  }
}
function u(e, t, i) {
  t&& c(e.prototype, t);
  i&& c(e, i);
  Object.defineProperty(e, "prototype", {
    writable: ! 1
  }
);
  return e;
}
function d(e, t, i) {
(t = p(t)) in e? Object.defineProperty(e, t, {
    value: i, enumerable: ! 0, configurable: ! 0, writable: ! 0
  }
): e[t] = i;
  return e;
}
function h(e, t) {
  if("object" != typeof e|| null === e) return e;
  var i = e[Symbol.toPrimitive];
  if(void 0 === i) return("string" === t? String: Number)(e);
  if("object" != typeof(i = i.call(e, t|| "default"))) return i;
  throw new TypeError("@@toPrimitive must return a primitive value.");
}
function p(e) {
  return "symbol" == typeof(e = h(e, "string"))? e: String(e);
}
var _ = {
  LIB_VERSION: "4.8.1",
  LIB_NAME: "MG",
  LIB_STACK: "cocoscreator",
  BASE_URL: "https://backend.gravity-engine.com/event_center/api/v1"
}
,
f = {
}
,
g = Array.prototype,
m = Object.prototype,
y = g.slice,
v = m.toString,
b = Object.prototype.hasOwnProperty,
w = g.forEach,
k = Array.isArray,
S = {
}
;
f.isNumber = function(e) {
  return "number" == typeof e? 0 == e- e: "string" == typeof e&& "" !== e.trim()&& (Number.isFinite? Number.isFinite(+ e): isFinite(+ e));
}
;
f.each = function(e, t, i) {
  if(null == e) return ! 1;
  if(w&& e.forEach === w) e.forEach(t, i);
  else if(e.length === + e.length) {
    for(var n = 0, a = e.length;
    n < a;
    n++) if(n in e&& t.call(i, e[n], n, e) === S) return ! 1;
  } else for(var o in e) if(b.call(e, o)&& t.call(i, e[o], o, e) === S) return ! 1;
}
;
f.sleep = function(e) {
  return new Promise(function(t) {
    return setTimeout(t, e);
  }
);
}
;
f.extend = function(e) {
  f.each(y.call(arguments, 1), function(t) {
    for(var i in t) void 0 !== t[i]&& (e[i] = t[i]);
  }
);
  return e;
}
;
f.extend2Layers = function(e) {
  f.each(y.call(arguments, 1), function(t) {
    for(var i in t) void 0 !== t[i]&& (f.isObject(t[i])&& f.isObject(e[i])? f.extend(e[i], t[i]): e[i] = t[i]);
  }
);
  return e;
}
;
f.isArray = k|| function(e) {
  return "[object Array]" === v.call(e);
}
;
f.isFunction = function(e) {
  try {
    return "function" == typeof e;
  } catch(e) {
    return ! 1;
  }
}
;
f.isPromise = function(e) {
  return "[object Promise]" === v.call(e)&& null != e;
}
;
f.isObject = function(e) {
  return "[object Object]" === v.call(e)&& null != e;
}
;
f.isEmptyObject = function(e) {
  if(f.isObject(e)) {
    for(var t in e) if(b.call(e, t)) return ! 1;
    return ! 0;
  }
  return ! 1;
}
;
f.isUndefined = function(e) {
  return void 0 === e;
}
;
f.isString = function(e) {
  return "[object String]" === v.call(e);
}
;
f.isDate = function(e) {
  return "[object Date]" === v.call(e);
}
;
f.isBoolean = function(e) {
  return "[object Boolean]" === v.call(e);
}
;
f.isNumber = function(e) {
  return "[object Number]" === v.call(e)&& /[\ d \.]+/.test(String(e));
}
;
f.isJSONString = function(e) {
  try {
    JSON.parse(e);
  } catch(e) {
    return ! 1;
  }
  return ! 0;
}
;
f.decodeURIComponent = function(e) {
  var t = "";
  try {
    t = decodeURIComponent(e);
  } catch(i) {
    t = e;
  }
  return t;
}
;
f.encodeURIComponent = function(e) {
  var t = "";
  try {
    t = encodeURIComponent(e);
  } catch(i) {
    t = e;
  }
  return t;
}
;
f.utf8Encode = function(e) {
  for(var t, i = "", n = t = 0, a = (e = (e+ "").replace(/ \ r \ n/ g, "\n").replace(/ \ r/ g, "\n")).length, o = 0;
  o < a;
  o++) {
    var r = e.charCodeAt(o),
    s = null;
    r < 128? t++: s = 127 < r&& r < 2048? String.fromCharCode(r >> 6| 192, 63& r| 128): String.fromCharCode(r >> 12| 224, r >> 6& 63| 128, 63& r| 128);
    if(null !== s) {
      n < t&& (i+= e.substring(n, t));
      i+= s;
      n = t = o+ 1;
    }
  }
  n < t&& (i+= e.substring(n, e.length));
  return i;
}
;
f.base64Encode = function(e) {
  var t,
  i,
  n,
  a,
  o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  r = 0,
  s = 0,
  l = "",
  c = [];
  if(! e) return e;
  for(e = f.utf8Encode(e);
  t = (a = e.charCodeAt(r++) << 16| e.charCodeAt(r++) << 8| e.charCodeAt(r++)) >> 12& 63, i = a >> 6& 63, n = 63& a, c[s++] = o.charAt(a >> 18& 63)+ o.charAt(t)+ o.charAt(i)+ o.charAt(n), r < e.length;
);
  l = c.join("");
  switch(e.length% 3) {
    case 1: l = l.slice(0, - 2)+ "==";
    break;
    case 2: l = l.slice(0, - 1)+ "=";
  }
  return l;
}
;
f.encodeDates = function(e) {
  f.each(e, function(t, i) {
    if(f.isDate(t)) e[i] = f.formatDate(t);
    else if(f.isObject(t)) e[i] = f.encodeDates(t);
    else if(f.isArray(t)) for(var n = 0;
    n < t.length;
    n++) f.isDate(t[n])&& (e[i][n] = f.formatDate(t[n]));
  }
);
  return e;
}
;
f.formatDate = function(e) {
  function t(e) {
    return e < 10? "0"+ e: e;
  }
  return e.getFullYear()+ "-"+ t(e.getMonth()+ 1)+ "-"+ t(e.getDate())+ " "+ t(e.getHours())+ ":"+ t(e.getMinutes())+ ":"+ t(e.getSeconds())+ "."+((e = e.getMilliseconds()) < 100&& 9 < e? "0"+ e: e < 10? "00"+ e: e);
}
;
f.searchObjDate = function(e) {
  try {
(f.isObject(e)|| f.isArray(e))&& f.each(e, function(t, i) {
      f.isObject(t)|| f.isArray(t)? f.searchObjDate(e[i]): f.isDate(t)&& (e[i] = f.formatDate(t));
    }
);
  } catch(e) {
    C.warn(e);
  }
}
;
f.UUID = function() {
  var e = new Date().getTime();
  return String(Math.random()).replace(".", "").slice(1, 11)+ "-"+ e;
}
;
f.UUIDv4 = function() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/ g, function(e) {
    var t = 16* Math.random()| 0;
    return("x" === e? t: 3& t| 8).toString(16);
  }
);
}
;
f.setMpPlatform = function(e) {
  f.mpPlatform = e;
}
;
f.getMpPlatform = function() {
  return f.mpPlatform;
}
;
f.createExtraHeaders = function() {
  return {
    "GE-Integration-Type": _.LIB_NAME,
    "GE-Integration-Version": _.LIB_VERSION,
    "GE-Integration-Count": "1",
    "GE-Integration-Extra": f.getMpPlatform()
  }
;
}
;
f.checkAppId = function(e) {
  if("number" == typeof e) e = String(e);
  else if("string" != typeof e) return "";
  return e.replace(/ \ s*/ g, "");
}
;
f.checkUrl = function(e) {
  e = e.replace(/ \ s*/ g, "");
  return f.url("basic", e);
}
;
f.url = function() {
  function e() {
    return new RegExp(/(.*?) \.?([^.]*?) \.(com| net| org| biz| ws| in| me| co \.uk| co| org \.uk| ltd \.uk| plc \.uk| me \.uk| edu| mil| br \.com| cn \.com| eu \.com| hu \.com| no \.com| qc \.com| sa \.com| se \.com| se \.net| us \.com| uy \.com| ac| co \.ac| gv \.ac| or \.ac| ac \.ac| af| am| as| at| ac \.at| co \.at| gv \.at| or \.at| asn \.au| com \.au| edu \.au| org \.au| net \.au| id \.au| be| ac \.be| adm \.br| adv \.br| am \.br| arq \.br| art \.br| bio \.br| cng \.br| cnt \.br| com \.br| ecn \.br| eng \.br| esp \.br| etc \.br| eti \.br| fm \.br| fot \.br| fst \.br| g12 \.br| gov \.br| ind \.br| inf \.br| jor \.br| lel \.br| med \.br| mil \.br| net \.br| nom \.br| ntr \.br| odo \.br| org \.br| ppg \.br| pro \.br| psc \.br| psi \.br| rec \.br| slg \.br| tmp \.br| tur \.br| tv \.br| vet \.br| zlg \.br| br| ab \.ca| bc \.ca| mb \.ca| nb \.ca| nf \.ca| ns \.ca| nt \.ca| on \.ca| pe \.ca| qc \.ca| sk \.ca| yk \.ca| ca| cc| ac \.cn| net \.cn| com \.cn| edu \.cn| gov \.cn| org \.cn| bj \.cn| sh \.cn| tj \.cn| cq \.cn| he \.cn| nm \.cn| ln \.cn| jl \.cn| hl \.cn| js \.cn| zj \.cn| ah \.cn| gd \.cn| gx \.cn| hi \.cn| sc \.cn| gz \.cn| yn \.cn| xz \.cn| sn \.cn| gs \.cn| qh \.cn| nx \.cn| xj \.cn| tw \.cn| hk \.cn| mo \.cn| cn| cx| cz| de| dk| fo| com \.ec| tm \.fr| com \.fr| asso \.fr| presse \.fr| fr| gf| gs| co \.il| net \.il| ac \.il| k12 \.il| gov \.il| muni \.il| ac \.in| co \.in| org \.in| ernet \.in| gov \.in| net \.in| res \.in| is| it| ac \.jp| co \.jp| go \.jp| or \.jp| ne \.jp| ac \.kr| co \.kr| go \.kr| ne \.kr| nm \.kr| or \.kr| li| lt| lu| asso \.mc| tm \.mc| com \.mm| org \.mm| net \.mm| edu \.mm| gov \.mm| ms| nl| no| nu| pl| ro| org \.ro| store \.ro| tm \.ro| firm \.ro| www \.ro| arts \.ro| rec \.ro| info \.ro| nom \.ro| nt \.ro| se| si| com \.sg| org \.sg| net \.sg| gov \.sg| sk| st| tf| ac \.th| co \.th| go \.th| mi \.th| net \.th| or \.th| tm| to| com \.tr| edu \.tr| gov \.tr| k12 \.tr| net \.tr| org \.tr| com \.tw| org \.tw| net \.tw| ac \.uk| uk \.com| uk \.net| gb \.com| gb \.net| vg| sh| kz| ch| info| ua| gov| name| pro| ie| hk| com \.hk| org \.hk| net \.hk| edu \.hk| us| tk| cd| by| ad| lv| eu \.lv| bz| es| jp| cl| ag| mobi| eu| co \.nz| org \.nz| net \.nz| maori \.nz| iwi \.nz| io| la| md| sc| sg| vc| tw| travel| my| se| tv| pt| com \.pt| edu \.pt| asia| fi| com \.ve| net \.ve| fi| org \.ve| web \.ve| info \.ve| co \.ve| tel| im| gr| ru| net \.ru| org \.ru| hr| com \.hr| ly| xyz) $/);
  }
  function t(e, t) {
    var i = e.charAt(0);
    t = t.split(i);
    return i === e? t: t[(e = parseInt(e.substring(1), 10)) < 0? t.length+ e: e- 1];
  }
  function i(e, t) {
    for(var i, n = e.charAt(0), a = t.split("&"), o = [], r = {
    }
, s = e.substring(1), l = 0, c = a.length;
    l < c;
    l++) if("" !== (o = (o = a[l].match(/(.*?) = (.*)/))|| [a[l], a[l], ""])[1].replace(/\s/g, "")) {
      o[2] = (i = o[2]|| "", f.decodeURIComponent(i.replace(/\+/g, " ")));
      if(s === o[1]) return o[2];
      if(i = o[1].match(/(.*) \[([0-9]+) \]/)) {
        r[i[1]] = r[i[1]]|| [];
        r[i[1]][i[2]] = o[2];
      } else r[o[1]] = o[2];
    }
    return n === e? r: r[s];
  }
  return function(n, a) {
    var o,
    r = {
    }
;
    if("tld?" === n) return e();
    a = a|| window.location.toString();
    if(! n) return a;
    n = n.toString();
    if(a.match(/ ^ mailto:([^/].+)/)) {
      o = a.match(/ ^ mailto:([^/].+)/);
      r.protocol = "mailto";
      r.email = o[1];
    } else {
      if((a = a.match(/(.*?) \/ # !(.*)/)?(o = a.match(/(.*?) \/ # !(.*)/))[1]+ o[2]: a).match(/(.*?) #(.*)/)) {
        o = a.match(/(.*?) #(.*)/);
        r.hash = o[2];
        a = o[1];
      }
      if(r.hash&& n.match(/ ^ #/)) return i(n, r.hash);
      if(a.match(/(.*?) \?(.*)/)) {
        o = a.match(/(.*?) \?(.*)/);
        r.query = o[2];
        a = o[1];
      }
      if(r.query&& n.match(/ ^ \?/)) return i(n, r.query);
      if(a.match(/(.*?):? \/ \/(.*)/)) {
        o = a.match(/(.*?):? \/ \/(.*)/);
        r.protocol = o[1].toLowerCase();
        a = o[2];
      }
      if(a.match(/(.*?)(\/.*)/)) {
        o = a.match(/(.*?)(\/.*)/);
        r.path = o[2];
        a = o[1];
      }
      r.path = (r.path|| "").replace(/ ^([^/])/, "/$1").replace(/ \/ $/, "");
      if((n = n.match(/ ^[-0-9]+ $/)? n.replace(/ ^([^/])/, "/$1"): n).match(/ ^ \//)) return t(n, r.path.substring(1));
      if(o = (o = t("/-1", r.path.substring(1)))&& o.match(/(.*?) \.(.*)/)) {
        r.file = o[0];
        r.filename = o[1];
        r.fileext = o[2];
      }
      if(a.match(/(.*):([0-9]+) $/)) {
        o = a.match(/(.*):([0-9]+) $/);
        r.port = o[2];
        a = o[1];
      }
      if(a.match(/(.*?) @(.*)/)) {
        o = a.match(/(.*?) @(.*)/);
        r.auth = o[1];
        a = o[2];
      }
      if(r.auth) {
        o = r.auth.match(/(.*):(.*)/);
        r.user = o? o[1]: r.auth;
        r.pass = o? o[2]: void 0;
      }
      r.hostname = a.toLowerCase();
      if("." === n.charAt(0)) return t(n, r.hostname);
      if(e()&& (o = r.hostname.match(e()))) {
        r.tld = o[3];
        r.domain = o[2]? o[2]+ "."+ o[3]: void 0;
        r.sub = o[1]|| void 0;
      }
      a = r.port? ":"+ r.port: "";
      r.protocol = r.protocol|| window.location.protocol.replace(":", "");
      r.port = r.port|| ("https" === r.protocol? "443": "80");
      r.protocol = r.protocol|| ("443" === r.port? "https": "http");
      r.basic = r.protocol+ "://"+ r.hostname+ a;
    }
    return n in r? r[n]: "{}" === n? r: "";
  }
;
}
();
f.createString = function(e) {
  for(var t = e, i = Math.random().toString(36).substr(2);
  i.length < t;
) i+= Math.random().toString(36).substr(2);
  return i.substr(0, e);
}
;
f.createAesKey = function() {
  return f.createString(16);
}
;
f.setQuery = function(e) {
  var t,
  i = [];
  for(t in e) e.hasOwnProperty(t)&& i.push(encodeURIComponent(t)+ "="+ encodeURIComponent(e[t]));
  return i.join("&");
}
;
f.generateEncryptyData = function(e, t) {
  if(void 0 !== t) {
    var i = t.publicKey;
    t = t.version;
    if(void 0 !== i&& void 0 !== t&& "undefined" != typeof CryptoJS&& "undefined" != typeof JSEncrypt) {
      var n = f.createAesKey();
      try {
        var a = CryptoJS.enc.Utf8.parse(n),
        o = CryptoJS.enc.Utf8.parse(JSON.stringify(e)),
        r = f.isUndefined(CryptoJS.pad.Pkcs7)? CryptoJS.pad.PKCS7: CryptoJS.pad.Pkcs7,
        s = CryptoJS.AES.encrypt(o, a, {
          mode: CryptoJS.mode.ECB, padding: r
        }
).toString(),
        l = new JSEncrypt();
        l.setPublicKey(i);
        var c = l.encrypt(n);
        return ! 1 === c?(C.warn("私钥加密失败，返回原数据"), e): {
          pkv: t,
          ekey: c,
          payload: s
        }
;
      } catch(e) {
        C.warn("数据加密失败，返回原数据: "+ e);
      }
    }
  }
  return e;
}
;
var C = "object" === o(C)? C: {
}
;
C.info = function() {
  if("object" === ("undefined" == typeof console? "undefined": o(console))&& console.log&& C.enabled) try {
    return console.log.apply(console, arguments);
  } catch(e) {
    console.log(arguments[0]);
  }
}
;
C.warn = function() {
  if("object" === ("undefined" == typeof console? "undefined": o(console))&& console.log&& C.enabled) try {
    return console.warn.apply(console, arguments);
  } catch(e) {
    console.warn(arguments[0]);
  }
}
;
var T = function() {
  function e() {
    l(this, e);
    this.config = {
      persistenceName: "GravityEngine",
      persistenceNameOld: "GravityEngine_mg"
    }
;
  }
  u(e, [{
    key: "getConfig", value: function() {
      return this.config;
    }
  }
, {
    key: "getStorage", value: function(e, t, i) {
      e = localStorage.getItem(e);
      if(! t) return f.isJSONString(e)? JSON.parse(e): {
      }
;
      f.isJSONString(e)? i(JSON.parse(e)): i({
      }
);
    }
  }
, {
    key: "setStorage", value: function(e, t) {
      localStorage.setItem(e, t);
    }
  }
, {
    key: "_setSystemProxy", value: function(e) {
      this._sysCallback = e;
    }
  }
, {
    key: "getSystemInfo", value: function(e) {
      var t = {
        mp_platform: "web", system: this._getOs(), screenWidth: window.screen.width, screenHeight: window.screen.height, systemLanguage: navigator.language
      }
;
      this._sysCallback&& (t = f.extend(t, this._sysCallback(e)));
      e.success(t);
      e.complete();
    }
  }
, {
    key: "_getOs", value: function() {
      var e = navigator.userAgent;
      return/ Windows/ i.test(e)?/ Phone/.test(e)|| / WPDesktop/.test(e)? "Windows Phone": "Windows":/(iPhone| iPad| iPod)/.test(e)? "iOS":/ Android/.test(e)? "Android":/(BlackBerry| PlayBook| BB10)/ i.test(e)? "BlackBerry":/ Mac/ i.test(e)? "MacOS":/ Linux/.test(e)? "Linux":/ CrOS/.test(e)? "ChromeOS": "";
    }
  }
, {
    key: "getNetworkType", value: function(e) {
      e.complete();
    }
  }
, {
    key: "onNetworkStatusChange", value: function() {
    }
  }
, {
    key: "request", value: function(e) {
      var t = {
      }
, i = new XMLHttpRequest();
      i.open(e.method, e.url);
      if(e.header) for(var n in e.header) i.setRequestHeader(n, e.header[n]);
      i.onreadystatechange = function() {
        if(4 === i.readyState&& 200 === i.status) {
          t.statusCode = 200;
          f.isJSONString(i.responseText)&& (t.data = JSON.parse(i.responseText));
          e.success(t);
        } else 200 !== i.status&& (t.errMsg = "network error", e.fail(t));
      }
;
      i.ontimeout = function() {
        t.errMsg = "timeout";
        e.fail(t);
      }
;
      i.send(e.data);
      return i;
    }
  }
, {
    key: "initAutoTrackInstance", value: function(e, t) {
      this.instance = e;
      this.autoTrack = t.autoTrack;
      var i = this;
      "onpagehide" in window? window.onpagehide = function() {
        i.onPageHide(! 0);
      }
: window.onbeforeunload = function() {
        i.onPageHide(! 0);
      }
;
      i.onPageShow();
      i.autoTrack.appHide&& i.instance.timeEvent("ta_page_hide");
      "onvisibilitychange" in document&& (document.onvisibilitychange = function() {
        if(document.hidden) i.onPageHide(! 1);
        else {
          i.onPageShow();
          i.autoTrack.appHide&& i.instance.timeEvent("ta_page_hide");
        }
      }
);
    }
  }
, {
    key: "setGlobal", value: function(e, t) {
      window[t] = e;
    }
  }
, {
    key: "getAppOptions", value: function() {
    }
  }
, {
    key: "showToast", value: function() {
    }
  }
, {
    key: "onPageShow", value: function() {
      var e;
      if(this.autoTrack.appShow) {
        f.extend(e = {
        }
, this.autoTrack.properties);
        f.isFunction(this.autoTrack.callback)&& f.extend(e, this.autoTrack.callback("appShow"));
        this.instance._internalTrack("$WebPageView", e);
      }
    }
  }
, {
    key: "onPageHide", value: function(e) {
      var t;
      if(this.autoTrack.appHide) {
        f.extend(t = {
        }
, this.autoTrack.properties);
        f.isFunction(this.autoTrack.callback)&& f.extend(t, this.autoTrack.callback("appHide"));
        this.instance._internalTrack("$WebPageHide", t, new Date(), null, e);
      }
    }
  }
], [{
    key: "createInstance", value: function() {
      return new e();
    }
  }
]);
  return e;
}
(),
N = function() {
  function e(t, i) {
    l(this, e);
    this.taInstance = t;
    this.config = i|| {
    }
;
    this.referrer = "Directly open";
    if(this.config.isPlugin) {
      t.App = function() {
        App.apply(this, arguments);
      }
;
      inension(t.Page);
    } else {
      i = App;
      App = this._initAppExtention(i);
      t = Page;
      Page = this._initPageExtension(t);
    }
  }
  u(e, [{
    key: "_initPageExtension", value: function(e) {
      var t = this;
      return function(i) {
        var n = i.onLoad, a = i.onShow, o = i.onShareAppMessage, r = {
        }
;
        i.onLoad = function(e) {
          r = e|| {
          }
;
          "function" == typeof n&& n.call(this, e);
        }
;
        i.onShow = function(e) {
          t.onPageShow(r);
          "function" == typeof a&& a.call(this, e);
        }
;
        "function" == typeof o&& (i.onShareAppMessage = function(e) {
          e = o.call(this, e);
          return t.onPageShare(e);
        }
);
        return e(i);
      }
;
    }
  }
, {
    key: "_initAppExtention", value: function(e) {
      var t = this;
      return function(i) {
        var n = i.onLaunch, a = i.onShow, o = i.onHide;
        i.onLaunch = function(e) {
          t.onAppLaunch(e, this);
          "function" == typeof n&& n.call(this, e);
        }
;
        i.onShow = function(e) {
          t.onAppShow(e);
          "function" == typeof a&& a.call(this, e);
        }
;
        i.onHide = function() {
          t.onAppHide();
          "function" == typeof o&& o.call(this);
        }
;
        return e(i);
      }
;
    }
  }
, {
    key: "onAppLaunch", value: function(e, t) {
      this._setAutoTrackProperties(e);
      f.isUndefined(t)|| (t[this.taInstance.name] = this.taInstance);
      if(this.config.appLaunch) {
        t = {
        }
;
        e&& e.path&& (t.$url_query = f.setQuery(e.query), t.$scene = String(e.scene|| e.from));
        this.taInstance._internalTrack("$MPLaunch", t);
      }
    }
  }
, {
    key: "onAppShow", value: function(e) {
      var t;
      this.config.appHide&& this.taInstance.timeEvent("$MPHide");
      this._setAutoTrackProperties(e);
      if(this.config.appShow) {
        t = {
        }
;
        e&& e.path&& (t.$url_path = this._getPath(e.path), t.$url_query = f.setQuery(e.query), t.$scene = String(e.scene|| e.from));
        f.extend(t, this.config.properties);
        f.isFunction(this.config.callback)&& f.extend(t, this.config.callback("appShow"));
        this.taInstance._internalTrack("$MPShow", t);
      }
    }
  }
, {
    key: "onAppHide", value: function() {
      var e;
      if(this.config.appHide) {
        f.extend(e = {
        }
, this.config.properties);
        f.isFunction(this.config.callback)&& f.extend(e, this.config.callback("appHide"));
        this.taInstance._internalTrack("$MPHide", e);
      }
    }
  }
, {
    key: "_getCurrentPath", value: function() {
      var e = "Not to get";
      try {
        var t = getCurrentPages();
        e = t[t.length- 1].route;
      } catch(e) {
        C.info(e);
      }
      return e;
    }
  }
, {
    key: "_setAutoTrackProperties", value: function() {
      this.taInstance._setAutoTrackProperties({
      }
);
    }
  }
, {
    key: "_getPath", value: function(e) {
      return "string" == typeof e? e.replace(/ ^ \//, ""): "Abnormal values";
    }
  }
, {
    key: "onPageShare", value: function(e) {
      if(this.config.pageShare) {
        var t = 1;
        try {
          t = getCurrentPages().length;
        } catch(e) {
          t = 1;
        }
        this.taInstance._internalTrack("$MPShare", {
          $share_method: "转发消息卡片", $share_depth: t, $url_path: this._getCurrentPath()
        }
);
      }
      return f.isObject(e)? e: {
      }
;
    }
  }
, {
    key: "onPageShow", value: function(e) {
      var t;
      if(this.config.pageShow) {
        e = {
          $url_path:(t = this._getCurrentPath())|| "The system did not get a value", $url_query: f.setQuery(e)
        }
;
        this.referrer = t;
        this.taInstance._internalTrack("$MPViewScreen", e);
      }
    }
  }
]);
  return e;
}
(),
I = function() {
  function e(t, i, n) {
    var a = this;
    l(this, e);
    this.taInstance = t;
    this.config = i|| {
    }
;
    t = n.getLaunchOptionsSync();
    this._onShow(t);
    this.startTracked = ! 0;
    n.onShow(function(e) {
      a._onShow(e);
    }
);
    n.onHide(function() {
      var e;
      a.startTracked = ! 1;
      if(a.config.appHide) {
        f.extend(e = {
        }
, a.config.properties);
        f.isFunction(a.config.callback)&& f.extend(e, a.config.callback("appHide"));
        a.taInstance._internalTrack("$MPHide", e);
      }
    }
);
  }
  u(e, [{
    key: "_onShow", value: function(e) {
      var t;
      if(! this.startTracked) {
        this.config.appHide&& this.taInstance.timeEvent("$MPHide");
        this.config.appShow&& (f.extend(t = {
        }
, this.config.properties), f.isFunction(this.config.callback)&& f.extend(t, this.config.callback("appShow")), this.taInstance._internalTrack("$MPShow", n(n({
        }
, t), {
        }
, {
          $scene: String(e.scene|| e.from), $url_query: f.setQuery(D.getAppOptions().query)
        }
)));
      }
    }
  }
]);
  return e;
}
(),
A = function() {
  function e(t, i, n) {
    l(this, e);
    this.api = t;
    this.config = i;
    this._config = n;
  }
  u(e, [{
    key: "getConfig", value: function() {
      return this.config;
    }
  }
, {
    key: "getStorage", value: function(e, t, i) {
      if(! t) return "dd_mp" === this._config.platform?(t = this.api.getStorageSync({
        key: e
      }
), f.isJSONString(t.data)? JSON.parse(t.data): {
      }
):(t = this.api.getStorageSync(e), f.isJSONString(t)? JSON.parse(t): {
      }
);
      this.api.getStorage({
        key: e, success: function(e) {
          e = f.isJSONString(e.data)? JSON.parse(e.data): {
          }
;
          i(e);
        }
, fail: function() {
          C.warn("getStorage faild");
          i({
          }
);
        }
      }
);
    }
  }
, {
    key: "setStorage", value: function(e, t) {
      this.api.setStorage({
        key: e, data: t
      }
);
    }
  }
, {
    key: "_getPlatform", value: function() {
      return "";
    }
  }
, {
    key: "getSystemInfo", value: function(e) {
      var t = this._config.mpPlatform;
      this.api.getSystemInfo({
        success: function(i) {
          f.isFunction(t)? i.mp_platform = t(i): e.success(i);
          "wechat" === t&& e.complete();
        }
, complete: function() {
          e.complete();
        }
      }
);
    }
  }
, {
    key: "getNetworkType", value: function(e) {
      if(f.isFunction(this.api.getNetworkType)) this.api.getNetworkType({
        success: function(t) {
          e.success(t);
        }
, complete: function() {
          e.complete();
        }
      }
);
      else {
        e.success({
        }
);
        e.complete();
      }
    }
  }
, {
    key: "onNetworkStatusChange", value: function(e) {
      f.isFunction(this.api.onNetworkStatusChange)? this.api.onNetworkStatusChange(e): e({
      }
);
    }
  }
, {
    key: "request", value: function(e) {
      var t;
      return "ali_mp" === this._config.platform|| "dd_mp" === this._config.platform?((t = f.extend({
      }
, e)).headers = e.header, t.success = function(t) {
        t.statusCode = t.status;
        e.success(t);
      }
, t.fail = function(t) {
        t.errMsg = t.errorMessage;
        e.fail(t);
      }
, "dd_mp" === this._config.platform? this.api.httpRequest(t): this.api.request(t)): this.api.request(e);
    }
  }
, {
    key: "initAutoTrackInstance", value: function(e, t) {
      f.isObject(t.autoTrack)&& (t.autoTrack.isPlugin = t.is_plugin);
      return new(this._config.mp? N: I)(e, t.autoTrack, this.api);
    }
  }
, {
    key: "setGlobal", value: function(e, t) {
      this._config.mp? C.warn("GravityAnalytics: we do not set global name for GE instance when you do not enable auto track."): GameGlobal[t] = e;
    }
  }
, {
    key: "getAppOptions", value: function(e) {
      var t = {
      }
;
      try {
        t = this.api.getLaunchOptionsSync();
      } catch(e) {
        C.warn("Cannot get launch options.");
      }
      if(f.isFunction(e)) try {
        this._config.mp? this.api.onAppShow(e): this.api.onShow(e);
      } catch(e) {
        C.warn("Cannot register onShow callback.");
      }
      return t;
    }
  }
, {
    key: "showToast", value: function(e) {
      var t;
      if(f.isFunction(this.api.showToast)) {
        t = {
          title: e
        }
;
        "dd_mp" !== this._config.platform&& "ali_mp" !== this._config.platform|| (t.content = e);
        this.api.showToast(t);
      }
    }
  }
], [{
    key: "createInstance", value: function() {
      return this._createInstancR_CURRENT_PLATFORM;
    }
  }
, {
    key: "_createInstance", value: function(t) {
      switch(t) {
        case "wechat_mp": return new e(wx, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_wechat"
        }
, {
          mpPlatform: "wechat", mp: ! 0, platform: t
        }
);
        case "wechat_mg": return new e(wx, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_wechat_game"
        }
, {
          mpPlatform: "wechat", platform: t
        }
);
        case "qq_mp": return new e(qq, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_qq"
        }
, {
          mpPlatform: "qq", mp: ! 0, platform: t
        }
);
        case "qq_mg": return new e(qq, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_qq_game"
        }
, {
          mpPlatform: "qq", platform: t
        }
);
        case "baidu_mp": return new e(swan, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_swan"
        }
, {
          mpPlatform: function(e) {
            return e.host;
          }
, mp: ! 0, platform: t
        }
);
        case "baidu_mg": return new e(swan, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_swan_game"
        }
, {
          mpPlatform: function(e) {
            return e.host;
          }
, platform: t
        }
);
        case "tt_mg": return new e(tt, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_tt_game"
        }
, {
          mpPlatform: function(e) {
            return e.appName;
          }
, platform: t
        }
);
        case "tt_mp": return new e(tt, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_tt"
        }
, {
          mpPlatform: function(e) {
            return e.appName;
          }
, mp: ! 0, platform: t
        }
);
        case "ali_mp": return new e(my, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_ali"
        }
, {
          mpPlatform: function(e) {
            return e.app;
          }
, mp: ! 0, platform: t
        }
);
        case "dd_mp": return new e(dd, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_dd"
        }
, {
          mpPlatform: "dingding", mp: ! 0, platform: t
        }
);
        case "bl_mg": return new e(bl, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_mg"
        }
, {
          mpPlatform: "bilibili", platform: t
        }
);
        case "kuaishou_mp": return new e(ks, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_kuaishou_program"
        }
, {
          mpPlatform: "kuaishou", mp: ! 0, platform: t
        }
);
        case "kuaishou_mg": return new e(ks, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_kuaishou_game"
        }
, {
          mpPlatform: "kuaishou_game", platform: t
        }
);
        case "qh360_mg": return new e(qh, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_qh360"
        }
, {
          mpPlatform: "qh360", platform: t
        }
);
        case "tb_mp": return new e(my, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_tb"
        }
, {
          mpPlatform: "tb", mp: ! 0, platform: t
        }
);
        case "jd_mp": return new e(jd, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_jd"
        }
, {
          mpPlatform: "jd", mp: ! 0, platform: t
        }
);
        case "qh360_mp": return new e(qh, {
          persistenceName: "GravityEngine", persistenceNameOld: "GravityEngine_qh360"
        }
, {
          mpPlatform: "qh360", mp: ! 0, platform: t
        }
);
        case "WEB": return new T.createInstance();
      }
    }
  }
]);
  return e;
}
(),
R = u(function e(t, i) {
  var n = this;
  l(this, e);
  this.taInstance = t;
  this.config = i|| {
  }
;
  this.config.appShow&& this.taInstance._internalTrack("$MPShow");
  this.config.appHide&& this.taInstance.timeEvent("$MPHide");
  qg.onShow(function() {
    var e;
    n.config.appHide&& n.taInstance.timeEvent("$MPHide");
    if(n.config.appShow) {
      f.extend(e = {
      }
, n.config.properties);
      f.isFunction(n.config.callback)&& f.extend(e, n.config.callback("appShow"));
      n.taInstance._internalTrack("$MPShow");
    }
  }
);
  qg.onHide(function() {
    var e;
    if(n.config.appHide) {
      f.extend(e = {
      }
, n.config.properties);
      f.isFunction(n.config.callback)&& f.extend(e, n.config.callback("appHide"));
      n.taInstance._internalTrack("$MPHide");
    }
  }
);
}
),
P = function() {
  function e() {
    l(this, e);
    this.config = {
      persistenceName: "gravityengine",
      persistenceNameOld: "gravityengine_qg_vivo_game",
      asyncPersistence: ! 0
    }
;
  }
  u(e, [{
    key: "getConfig", value: function() {
      return this.config|| {
      }
;
    }
  }
, {
    key: "getStorage", value: function(e, t, i) {
      if(! t) {
        t = qg.getStorageSync({
          key: e
        }
);
        return f.isJSONString(t)? JSON.parse(t): {
        }
;
      }
      qg.getStorage({
        key: e, success: function(e) {
          e = f.isJSONString(e)? JSON.parse(e): {
          }
;
          i(e);
        }
, fail: function() {
          i({
          }
);
        }
      }
);
    }
  }
, {
    key: "setStorage", value: function(e, t) {
      qg.setStorage({
        key: e, value: t
      }
);
    }
  }
, {
    key: "getSystemInfo", value: function(e) {
      qg.getSystemInfo({
        success: function(t) {
          var i = t, n = [t.osType, t.osVersionName].join(" ");
          i.brand = t.manufacturer;
          i.mp_platform = "vivo_qg";
          e.success(i);
        }
, complete: function() {
          e.complete();
        }
      }
);
    }
  }
, {
    key: "getQuickDevice", value: function(e) {
      var t = {
        os_name: "android", android_id: "", imei: "", oaid: "", mac: "", android_version: "", api_version: 0, rom: {
          gravityengine_qg_huawei_game: "EMUI", gravityengine_qg: "MIUI", gravityengine_qg_oppo_game: "ColorOS", gravityengine_qg_vivo_game: "FuntouchOS", gravityengine_qg_mz_game: "Flyme"
        }
[e.platform], rom_version: "", phone_brand: "", phone_model: ""
      }
;
      qg.getSystemInfo({
        success: function(i) {
          var n;
          t.android_version = i.system;
          t.api_version = i.platformVersionCode;
          t.rom_version = i.COREVersion;
          t.phone_brand = i.brand;
          t.phone_model = i.model;
          if(qg.getOAID) {
            i = null != (n = null == (n = (i = qg).getOAID)? void 0: n.call(i).oaid)? n: "";
            t.android_id = i;
            t.imei = i;
            t.oaid = i;
          }
          e.success(t);
        }
      }
);
    }
  }
, {
    key: "getNetworkType", value: function(e) {
      qg.getNetworkType({
        success: function(t) {
          var i = t;
          i.networkType = t.type;
          e.success(i);
        }
, complete: function() {
          e.complete();
        }
      }
);
    }
  }
, {
    key: "onNetworkStatusChange", value: function(e) {
      qg.subscribeNetworkStatus({
        callback: function(t) {
          var i = t;
          i.networkType = t.type;
          e(i);
        }
      }
);
    }
  }
, {
    key: "request", value: function(e) {
      return qg.request({
        url: e.url, data: e.data, method: e.method, header: e.header, success: function(t) {
          e.success(t);
        }
, fail: function(t) {
          e.fail(t);
        }
      }
);
    }
  }
, {
    key: "initAutoTrackInstance", value: function(e, t) {
      return new R(e, t.autoTrack);
    }
  }
, {
    key: "setGlobal", value: function(e, t) {
      globalThis[t] = e;
    }
  }
, {
    key: "getAppOptions", value: function() {
      return {
      }
;
    }
  }
, {
    key: "showToast", value: function(e) {
      qg.showToast({
        message: e, duration: 0
      }
);
    }
  }
], [{
    key: "createInstance", value: function() {
      return new e();
    }
  }
]);
  return e;
}
(),
E = u(function e(t, i, n) {
  var a = this;
  l(this, e);
  this.taInstance = t;
  this.config = i|| {
  }
;
  if(this.config.appShow) {
    f.extend(t = {
    }
, this.config.properties);
    f.isFunction(this.config.callback)&& f.extend(t, this.config.callback("appShow"));
    this.taInstance._internalTrack("$MPShow", t);
  }
  this.config.appHide&& this.taInstance.timeEvent("$MPHide");
  n.onShow(function() {
    var e;
    a.config.appHide&& a.taInstance.timeEvent("$MPHide");
    if(a.config.appShow) {
      f.extend(e = {
      }
, a.config.properties);
      f.isFunction(a.config.callback)&& f.extend(e, a.config.callback("appShow"));
      a.taInstance._internalTrack("$MPShow", e);
    }
  }
);
  n.onHide(function() {
    var e;
    if(a.config.appHide) {
      f.extend(e = {
      }
, a.config.properties);
      f.isFunction(a.config.callback)&& f.extend(e, a.config.callback("appHide"));
      a.taInstance._internalTrack("$MPHide", e);
    }
  }
);
}
),
M = function() {
  function e(t, i, n) {
    l(this, e);
    this.api = t;
    this.config = i;
    this._config = n;
  }
  u(e, [{
    key: "getConfig", value: function() {
      return this.config|| {
      }
;
    }
  }
, {
    key: "getStorage", value: function(e, t, i) {
      e = localStorage.getItem(e);
      if(! t) return f.isJSONString(e)? JSON.parse(e): {
      }
;
      f.isJSONString(e)? i(JSON.parse(e)): i({
      }
);
    }
  }
, {
    key: "setStorage", value: function(e, t) {
      localStorage.setItem(e, t);
    }
  }
, {
    key: "getSystemInfo", value: function(e) {
      var t = this._config.mpPlatform;
      this.api.getSystemInfo({
        success: function(i) {
          e.success(i);
        }
, complete: function() {
          e.complete();
        }
      }
);
    }
  }
, {
    key: "getQuickDevice", value: function(e) {
      var t = {
        os_name: "android", android_id: "", imei: "", oaid: "", mac: "", android_version: "", api_version: 0, rom: {
          gravityengine_qg_huawei_game: "EMUI", gravityengine_qg: "MIUI", gravityengine_qg_oppo_game: "ColorOS", gravityengine_qg_vivo_game: "FuntouchOS", gravityengine_qg_mz_game: "Flyme"
        }
[e.platform], rom_version: "", phone_brand: "", phone_model: ""
      }
, i = this;
      this.api.getSystemInfo({
        success: function(n) {
          function a() {
            e.success(t);
          }
          t.android_version = n.system;
          t.api_version = n.platformVersionCode;
          t.rom_version = n.COREVersion;
          t.phone_brand = n.brand;
          t.phone_model = n.model;
          i.api.getDeviceId? i.api.getDeviceId({
            success: function(e) {
              t.android_id = e.deviceId;
              t.imei = e.deviceId;
              t.oaid = e.deviceId;
              a();
            }
          }
): i.api.getOAID? i.api.getOAID({
            success: function(e) {
              t.android_id = e.oaid;
              t.imei = e.oaid;
              t.oaid = e.oaid;
              a();
            }
          }
): a();
        }
      }
);
    }
  }
, {
    key: "getNetworkType", value: function(e) {
      this.api.getNetworkType({
        success: function(t) {
          e.success(t);
        }
, complete: function() {
          e.complete();
        }
      }
);
    }
  }
, {
    key: "onNetworkStatusChange", value: function(e) {
      this.api.onNetworkStatusChange({
        callback: function(t) {
          e(t);
        }
      }
);
    }
  }
, {
    key: "request", value: function(e) {
      var t = {
      }
, i = new XMLHttpRequest();
      i.open(e.method, e.url);
      if(e.header) for(var n in e.header) i.setRequestHeader(n, e.header[n]);
      i.onreadystatechange = function() {
        if(4 === i.readyState&& 200 === i.status) {
          t.statusCode = 200;
          f.isJSONString(i.responseText)&& (t.data = JSON.parse(i.responseText));
          e.success(t);
        } else 200 !== i.status&& (t.errMsg = "network error", e.fail(t));
      }
;
      i.ontimeout = function() {
        t.errMsg = "timeout";
        e.fail(t);
      }
;
      i.send(e.data);
      return i;
    }
  }
, {
    key: "initAutoTrackInstance", value: function(e, t) {
      return new E(e, t.autoTrack, this.api);
    }
  }
, {
    key: "setGlobal", value: function(e, t) {
      globalThis[t] = e;
    }
  }
, {
    key: "getAppOptions", value: function() {
      return this.api.getLaunchOptionsSync();
    }
  }
, {
    key: "showToast", value: function(e) {
      this.api.showToast({
        title: e, icon: "none", duration: 2e3
      }
);
    }
  }
], [{
    key: "createInstance", value: function() {
      return this._createInstancR_CURRENT_PLATFORM;
    }
  }
, {
    key: "_createInstance", value: function(t) {
      switch(t) {
        case "oppo": return new e(qg, {
          persistenceName: "gravityengine", persistenceNameOld: "gravityengine_qg_oppo_game"
        }
, {
          mpPlatform: "oppo_qg"
        }
);
        case "huawei": return new e(hbs, {
          persistenceName: "gravityengine", persistenceNameOld: "gravityengine_qg_huawei_game"
        }
, {
          mpPlatform: "huawei_qg"
        }
);
        case "mz": return new e(qg, {
          persistenceName: "gravityengine", persistenceNameOld: "gravityengine_qg_mz_game"
        }
, {
          mpPlatform: "mz"
        }
);
        case "xiaomi": return new e(qg, {
          persistenceName: "gravityengine", persistenceNameOld: "gravityengine_qg"
        }
, {
          mpPlatform: "xiaomi"
        }
);
      }
    }
  }
]);
  return e;
}
(),
L = function() {
  function e() {
    l(this, e);
  }
  u(e, null, [{
    key: "createInstance", value: function() {
      var e, t = Object.freeze({
        WECHAT_GAME: 104, QQ_PLAY: 105, BAIDU_GAME: 107, VIVO_GAME: 108, OPPO_GAME: 109, HUAWEI_GAME: 110, XIAOMI_GAME: 111, BYTEDANCE_GAME: 117, QTT_GAME: 116, LINKSURE: 119, WECHAT_MINI_GAME: "WECHAT_GAME", BAIDU_MINI_GAME: "BAIDU_MINI_GAME", XIAOMI_QUICK_GAME: "XIAOMI_QUICK_GAME", OPPO_MINI_GAME: "OPPO_MINI_GAME", VIVO_MINI_GAME: "VIVO_MINI_GAME", HUAWEI_QUICK_GAME: "HUAWEI_QUICK_GAME", BYTEDANCE_MINI_GAME: "BYTEDANCE_MINI_GAME", QTT_MINI_GAME: "QTT_MINI_GAME", LINKSURE_MINI_GAME: "LINKSURE_MINI_GAME"
      }
);
      return cc.sys.platform === t.WECHAT_GAME|| cc.sys.platform === t.WECHAT_MINI_GAME? A._createInstancwechat_mg: cc.sys.platform === t.BAIDU_GAME|| cc.sys.platform === t.BAIDU_MIN_GAME? A._createInstancbaidu_mg: cc.sys.platform === t.VIVO_GAME|| cc.sys.platform === t.VIVO_MINI_GAME? P.createInstance(): cc.sys.platform === t.QQ_PLAY? A._createInstancqq_mg: cc.sys.platform === t.OPPO_GAME|| cc.sys.platform === t.OPPO_MINI_GAME? M._createInstancoppo: cc.sys.platform === t.HUAWEI_GAME|| cc.sys.platform === t.HUAWEI_QUICK_GAME? M._createInstanchuawei: cc.sys.platform === t.XIAOMI_GAME|| cc.sys.platform === t.XIAOMI_QUICK_GAME? M._createInstancxiaomi: cc.sys.platform === t.BYTEDANCE_GAME|| cc.sys.platform === t.BYTEDANCE_MINI_GAME? A._createInstanctt_mg:((e = T.createInstance())._sysCallback = function() {
        return {
          system: cc.sys.os.replace(" ", "")+ " "+ cc.sys.osVersion
        }
;
      }
, e.getNetworkType = function(e) {
        var t = {
        }
;
        switch(cc.sys.getNetworkType()) {
          case cc.sys.NetworkType.LAN: t.networkType = "WIFI";
          break;
          case cc.sys.NetworkType.WWAN: t.networkType = "WWAN";
          break;
          default: t.networkType = "NONE";
        }
        e.success(t);
        e.complete();
      }
, e.getSystemInfo = function(t) {
        var i = {
          mp_platform: cc.sys.platform.toString(), system: e._getOs(), screenWidth: window.screen.width, screenHeight: window.screen.height
        }
;
        e._sysCallback&& (i = f.extend(i, e._sysCallback(t)));
        t.success(i);
        t.complete();
      }
, e);
    }
  }
]);
  return e;
}
(),
D = function() {
  function e() {
    l(this, e);
  }
  u(e, null, [{
    key: "_getCurrentPlatform", value: function() {
      return this.currentPlatform|| (this.currentPlatform = L.createInstance());
    }
  }
, {
    key: "getConfig", value: function() {
      return this._getCurrentPlatform().getConfig();
    }
  }
, {
    key: "getStorage", value: function(e, t, i) {
      return this._getCurrentPlatform().getStorage(e, t, i);
    }
  }
, {
    key: "setStorage", value: function(e, t) {
      return this._getCurrentPlatform().setStorage(e, t);
    }
  }
, {
    key: "getSystemInfo", value: function(e) {
      return this._getCurrentPlatform().getSystemInfo(e);
    }
  }
, {
    key: "getNetworkType", value: function(e) {
      return this._getCurrentPlatform().getNetworkType(e);
    }
  }
, {
    key: "getQuickDevice", value: function(e) {
      return this._getCurrentPlatform().getQuickDevice(e);
    }
  }
, {
    key: "onNetworkStatusChange", value: function(e) {
      this._getCurrentPlatform().onNetworkStatusChange(e);
    }
  }
, {
    key: "request", value: function(e) {
      return this._getCurrentPlatform().request(e);
    }
  }
, {
    key: "initAutoTrackInstance", value: function(e, t) {
      return this._getCurrentPlatform().initAutoTrackInstance(e, t);
    }
  }
, {
    key: "setGlobal", value: function(e, t) {
      e&& t&& this._getCurrentPlatform().setGlobal(e, t);
    }
  }
, {
    key: "getAppOptions", value: function(e) {
      return this._getCurrentPlatform().getAppOptions(e);
    }
  }
, {
    key: "showDebugToast", value: function(e) {
      this._getCurrentPlatform().showToast(e);
    }
  }
]);
  return e;
}
(),
x = / ^ \ $?[a- zA- Z][a- zA- Z0- 9_] {
  0,
  49
}
$/,
O = function() {
  function e() {
    l(this, e);
  }
  u(e, null, [{
    key: "stripProperties", value: function(e) {
      f.isObject(e)&& f.each(e, function(e, t) {
        f.isString(e)|| f.isNumber(e)|| f.isDate(e)|| f.isBoolean(e)|| f.isArray(e)|| f.isObject(e)|| C.warn("Your data -", t, e, "- format does not meet requirements and may not be stored correctly. Attribute values only support String, Number, Date, Boolean, Array, Object");
      }
);
      return e;
    }
  }
, {
    key: "_checkPropertiesKey", value: function(e) {
      var t = ! 0;
      f.each(e, function(e, i) {
        if(! x.test(i)) {
          C.warn("Invalid KEY: "+ i);
          t = ! 1;
        }
      }
);
      return t;
    }
  }
, {
    key: "event", value: function(e) {
      return !(! f.isString(e)|| ! x.test(e))|| (C.warn("Check the parameter format. The eventName must start with an English letter and contain no more than 50 characters including letters, digits, and underscores: "+ e), ! 1);
    }
  }
, {
    key: "propertyName", value: function(e) {
      return !(! f.isString(e)|| ! x.test(e))|| (C.warn("Check the parameter format. PropertyName must start with a letter and contain letters, digits, and underscores (_). The value is a string of no more than 50 characters: "+ e), ! 1);
    }
  }
, {
    key: "properties", value: function(e) {
      this.stripProperties(e);
      return !(e&& (f.isObject(e)? ! this._checkPropertiesKey(e)&& (C.warn("Check the parameter format. The properties key must start with a letter, contain digits, letters, and underscores (_), and contain a maximum of 50 characters"), 1):(C.warn("properties can be none, but it must be an object"), 1)));
    }
  }
, {
    key: "propertiesMust", value: function(e) {
      this.stripProperties(e);
      return void 0 === e|| ! f.isObject(e)|| f.isEmptyObject(e)?(C.warn("properties must be an object with a value"), ! 1): ! ! this._checkPropertiesKey(e)|| (C.warn("Check the parameter format. The properties key must start with a letter, contain digits, letters, and underscores (_), and contain a maximum of 50 characters"), ! 1);
    }
  }
, {
    key: "userId", value: function(e) {
      return !(! f.isString(e)|| !/ ^.{
        1, 64
      }
      $/.test(e))|| (C.warn("The user ID must be a string of less than 64 characters and cannot be null"), ! 1);
    }
  }
, {
    key: "userAddProperties", value: function(e) {
      if(! this.propertiesMust(e)) return ! 1;
      for(var t in e) if(! f.isNumber(e[t])) {
        C.warn("The attributes of userAdd need to be Number");
        return ! 1;
      }
      return ! 0;
    }
  }
, {
    key: "userAppendProperties", value: function(e) {
      if(! this.propertiesMust(e)) return ! 1;
      for(var t in e) if(! f.isArray(e[t])) {
        C.warn("The attribute of userAppend must be Array");
        return ! 1;
      }
      return ! 0;
    }
  }
]);
  return e;
}
(),
B = function() {
  function e(t, i, n, a, o, r) {
    l(this, e);
    this.data = t;
    this.serverUrl = i;
    this.callback = r;
    this.debugMode = o;
    this.tryCount = f.isNumber(n)? n: 1;
    this.permissionTryCount = 6;
    this.timeout = f.isNumber(a)? a: 3e3;
    this.taClassName = "HttpTask";
  }
  u(e, [{
    key: "run", value: function() {
      var e = this, t = f.createExtraHeaders();
      t["content-type"] = "application/json";
      "debug" === this.debugMode&& (t["Turbo-Debug-Mode"] = 1);
      var i = D.request({
        url: this.serverUrl, method: "POST", data: this.data, header: t, success: function(t) {
          var i;
          0 === (null == t|| null == (i = t.data)? void 0: i.code)? e.onSuccess(t): e.onFailed(t);
        }
, fail: function(t) {
          e.onFailed(t);
        }
      }
);
      setTimeout(function() {
(f.isObject(i)|| f.isPromise(i))&& f.isFunction(i.abort)&& i.abort();
      }
, this.timeout);
    }
  }
, {
    key: "onSuccess", value: function(e) {
      var t, i;
      if(200 === e.statusCode) {
        i = "Data Verified";
        null != e&& null != (t = e.data)&& null != (t = t.extra)&& null != (t = t.errors)&& t.length&& (i = e.data.extra.errors);
        this.callback({
          code: null == e|| null == (t = e.data)? void 0: t.code, msg: i
        }
);
      } else this.callback({
        code:- 3, msg: e.statusCode
      }
);
    }
  }
, {
    key: "onFailed", value: function(e) {
      var t, i = this;
      0 < -- this.tryCount? setTimeout(function() {
        i.run();
      }
, 1e3): this.callback({
        code:- 3, msg: "".concat(null == e|| null == (t = e.data)? void 0: t.msg, "：").concat(null == e|| null == (t = e.data)|| null == (t = t.extra)? void 0: t.error)
      }
);
    }
  }
]);
  return e;
}
(),
F = new(function() {
  function e() {
    l(this, e);
    this.items = [];
    this.isRunning = ! 1;
    this.showDebug = ! 1;
  }
  u(e, [{
    key: "enqueue", value: function(e, t, i) {
      var n = !(3 < arguments.length&& void 0 !== arguments[3])|| arguments[3], a = "debug" === i.debugMode, o = this;
      e = new B(JSON.stringify(e), t, i.maxRetries, i.sendTimeout, i.debugMode, function(e) {
        o.isRunning = ! 1;
        f.isFunction(i.callback)&& i.callback(e);
        o._runNext(a);
        a&& C.info("code ".concat(e.code, " and msg is ").concat(e.msg));
      }
);
      if(! 0 === n) {
        this.items.push(e);
        this._runNext(a);
      } else e.run();
    }
  }
, {
    key: "_dequeue", value: function() {
      return this.items.shift();
    }
  }
, {
    key: "_runNext", value: function(e) {
      if(0 < this.items.length&& ! this.isRunning) {
        this.isRunning = ! 0;
        if(e) this._dequeue().run();
        else {
          var t = this.items.splice(0, this.items.length);
          e = t[0];
          for(var i = JSON.parse(e.data), n = 1;
          n < t.length;
          n++) {
            var a = t[n];
            a = JSON.parse(a.data);
            i.event_list = i.event_list.concat(a.event_list);
          }
          var o = new Date().getTime();
          i.$flush_time = o;
          new B(JSON.stringify(i), e.serverUrl, e.tryCount, e.timeout, null == e? void 0: e.debugMode, e.callback).run();
        }
      }
    }
  }
]);
  return e;
}
())(),
U = {
  name: "GravityEngine",
  is_plugin: ! 1,
  maxRetries: 3,
  sendTimeout: 5e3,
  enablePersistence: ! 0,
  asyncPersistence: ! 1,
  strict: ! 1,
  debugMode: "none"
}
,
V = {
  properties: {
    $lib_version: _.LIB_VERSION,
    $lib: _.LIB_STACK,
    $scene: "",
    $today_first_scene: ""
  }
,
  getSystemInfo: function(e) {
    var t = this;
    D.onNetworkStatusChange(function(e) {
      t.properties.$network_type = e.networkType;
    }
);
    D.getNetworkType({
      success: function(e) {
        t.properties.$network_type = e.networkType;
      }
, complete: function() {
        D.getSystemInfo({
          success: function(e) {
            C.info(JSON.stringify(e, null, 4));
            var i = {
              $manufacturer: e.brand, $brand: e.brand, $model: e.model, $screen_width: Number(e.screenWidth), $screen_height: Number(e.screenHeight), $system_language: e.language, $os: e.platform, $os_version: e.system
            }
;
            f.extend(t.properties, i);
            f.setMpPlatform(e.mp_platform);
          }
, complete: function() {
            e();
          }
        }
);
      }
    }
);
  }
}
,
G = function() {
  function e(t, i) {
    var n = this;
    l(this, e);
    this.enabled = t.enablePersistence;
    if(this.enabled) {
      t.isChildInstance?(this.name = t.persistenceName+ "_"+ t.name, this.nameOld = t.persistenceNameOld+ "_"+ t.name):(this.name = t.persistenceName, this.nameOld = t.persistenceNameOld);
      t.asyncPersistence?(this._state = {
      }
, D.getStorage(this.name, ! 0, function(e) {
        if(f.isEmptyObject(e)) D.getStorage(n.nameOld, ! 0, function(e) {
          n._state = f.extend2Layers({
          }
, e, n._state);
          n._init(t, i);
          n._save();
        }
);
        else {
          n._state = f.extend2Layers({
          }
, e, n._state);
          n._init(t, i);
          n._save();
        }
      }
)):(this._state = D.getStorage(this.name)|| {
      }
, f.isEmptyObject(this._state)&& (this._state = D.getStorage(this.nameOld)|| {
      }
), this._init(t, i));
    } else {
      this._state = {
      }
;
      this._init(t, i);
    }
  }
  u(e, [{
    key: "_init", value: function(e, t) {
      this.getDistinctId()|| this.setDistinctId(f.UUID());
      e.isChildInstance|| this.getDeviceId()|| this._setDeviceId(f.UUID());
      this.initComplete = ! 0;
      "function" == typeof t&& t();
      t = null == (e = D.getStorage(this.name))? void 0: e.current_first_scene_date;
      var i = null == e? void 0: e.current_first_scene, n = new Date().toLocaleDateString();
      if(i&& t&& t === n) V.properties.$today_first_scene = String(null == e? void 0: e.current_first_scene);
      else {
        e = String((null == (i = D.getAppOptions())? void 0: i.scene)|| (null == (t = D.getAppOptions())? void 0: t.from));
        V.properties.$today_first_scene = e;
        this._state.current_first_scene = e;
        this._state.current_first_scene_date = n;
      }
      this._save();
    }
  }
, {
    key: "_save", value: function() {
      this.enabled&& this.initComplete&& D.setStorage(this.name, JSON.stringify(this._state));
    }
  }
, {
    key: "_set", value: function(e, t) {
      var i, n = this;
      "string" == typeof e?(i = {
      }
)[e] = t: "object" === o(e)&& (i = e);
      f.each(i, function(e, t) {
        n._state[t] = e;
      }
);
      this._save();
    }
  }
, {
    key: "_get", value: function(e) {
      return this._state[e];
    }
  }
, {
    key: "setEventTimer", value: function(e, t) {
      var i = this._state.event_timers|| {
      }
;
      i[e] = t;
      this._set("event_timers", i);
    }
  }
, {
    key: "removeEventTimer", value: function(e) {
      var t = (this._state.event_timers|| {
      }
)[e];
      if(! f.isUndefined(t)) {
        delete this._state.event_timers[e];
        this._save();
      }
      return t;
    }
  }
, {
    key: "getDeviceId", value: function() {
      return this._state.device_id;
    }
  }
, {
    key: "_setDeviceId", value: function(e) {
      this.getDeviceId()? C.warn("cannot modify the device id."): this._set("device_id", e);
    }
  }
, {
    key: "getDistinctId", value: function() {
      return this._state.distinct_id;
    }
  }
, {
    key: "setDistinctId", value: function(e) {
      this._set("distinct_id", e);
    }
  }
, {
    key: "getAccountId", value: function() {
      return this._state.account_id;
    }
  }
, {
    key: "setAccountId", value: function(e) {
      this._set("account_id", e);
    }
  }
, {
    key: "getSuperProperties", value: function() {
      return this._state.props|| {
      }
;
    }
  }
, {
    key: "setSuperProperties", value: function(e, t) {
      t = t? e: f.extend(this.getSuperProperties(), e);
      this._set("props", t);
    }
  }
]);
  return e;
}
();
function H() {
  return D.getConfig().persistenceNameOld;
}
var z = function() {
  function e(t) {
    l(this, e);
    t.appId = f.checkAppId((null == t? void 0: t.clientId)|| "");
    t.accessToken = t.accessToken;
    t.accessToken|| console.warn("GravityAnalytics: accessToken must be required");
    t.serverUrl = "".concat(_.BASE_URL, "/event/collect/?access_token=").concat(t.accessToken);
    var i = f.extend({
    }
, U, D.getConfig());
    f.isObject(t)? this.config = f.extend(i, t): this.config = i;
    this._init(this.config);
  }
  var t,
  i,
  n;
  u(e, [{
    key: "_init", value: function(e) {
      var t = this;
      this.name = e.name;
      this.appId = e.clientId;
      this.accessToken = e.accessToken;
      var i = e.serverUrl|| e.server_url;
("GravityEngine_wechat_game" === (this.serverUrl = i, this.serverDebugUrl = i, this.configUrl = i+ "/config", this.autoTrackProperties = {
      }
, this._queue = [], this.config.syncBatchSize = 100, this.config.syncInterval = 60, e.isChildInstance? this._state = {
      }
:(C.enabled = "debug" === e.debugMode, this.instances = [], this._state = {
        getSystemInfo: ! 1, initComplete: ! 1
      }
, V.getSystemInfo(function() {
        t._updateState({
          getSystemInfo: ! 0
        }
);
      }
), D.setGlobal(this, this.name)), V.properties.$scene = String((null == (i = D.getAppOptions())? void 0: i.scene)|| (null == (i = D.getAppOptions())? void 0: i.from)), this.store = new G(e, function() {
        t.config.asyncPersistence&& f.isFunction(t.config.persistenceComplete)&& t.config.persistenceComplete(t);
        t._updateState();
      }
), this.enabled = ! f.isBoolean(this.store._get("ge_enabled"))|| this.store._get("ge_enabled"), this.isOptOut = ! ! f.isBoolean(this.store._get("ge_isOptOut"))&& this.store._get("ge_isOptOut"), i = H())|| "GravityEngine_tt_game" === i|| i.includes("gravityengine_qg"))&& e.autoTrack.appLaunch&& this.track("$MPLaunch", {
        $url_query: this.setQuery(this.getQuery())
      }
);
! e.isChildInstance&& e.autoTrack&& (this.autoTrack = D.initAutoTrackInstance(this, e));
    }
  }
, {
    key: "updateConfig", value: function() {
    }
  }
, {
    key: "initInstance", value: function(t, i) {
      if(! this.config.isChildInstance) return f.isString(t)&& t !== this.name&& f.isUndefined(this[t])?(i = new e(f.extend({
      }
, this.config, {
        enablePersistence: ! 1, isChildInstance: ! 0, name: t
      }
, i)), this[t] = i, this.instances.push(t), this[t]._state = this._state, i): void C.warn("initInstance() failed due to the name is invalid: "+ t);
      C.warn("initInstance() cannot be called on child instance");
    }
  }
, {
    key: "lightInstance", value: function(e) {
      return this[e];
    }
  }
, {
    key: "_setAutoTrackProperties", value: function(e) {
      f.extend(this.autoTrackProperties, e);
    }
  }
, {
    key: "setupAndStart", value: function(e) {
      if(null != e&& e.clientId) {
        this.config.appId = e.clientId;
        this.appId = e.clientId;
      }
      if(this._state.initComplete) return ! 1;
      this._updateState({
        initComplete: ! 0
      }
);
    }
  }
, {
    key: "_isReady", value: function() {
      return this._state.getSystemInfo&& this._state.initComplete&& this.store.initComplete&& this.config.appId&& this.config.accessToken;
    }
  }
, {
    key: "_updateState", value: function(e) {
      var t = this;
      f.isObject(e)&& f.extend(this._state, e);
      this._onStateChange();
      f.each(this.instances, function(e) {
        t[e]._onStateChange();
      }
);
    }
  }
, {
    key: "_onStateChange", value: function() {
      var e = this;
      if(this._isReady()&& this._queue&& 0 < this._queue.length) {
        f.each(this._queue, function(t) {
          e[t[0]].apply(e, y.call(t[1]));
        }
);
        this._queue = [];
      }
    }
  }
, {
    key: "_hasDisabled", value: function() {
      var e = ! this.enabled|| this.isOptOut;
      e&& C.info("GravityEngine is Pause or Stop!");
      return e;
    }
  }
, {
    key: "_sendRequest", value: function(e, t, i) {
      var n, a;
      if(! this._hasDisabled()) if(! f.isUndefined(this.config.disableEventList)&& this.config.disableEventList.includes(e.eventName)) C.info("disabled Event : "+ e.eventName);
      else {
        t = f.isDate(t)? t: new Date();
(t = {
          event_list:[{
            type: e.type, time: new Date(t).getTime()
          }
]
        }
).event_list[0].event = e.eventName;
        "track" === e.type?(t.event_list[0].properties = this.getSendProperties(), n = this.store.removeEventTimer(e.eventName), f.isUndefined(n)|| (n = new Date().getTime()- n, 86400 < (n = parseFloat((n/ 1e3).toFixed(3)))? n = 86400: n < 0&& (n = 0), t.event_list[0].properties.$event_duration = n)): t.event_list[0].properties = {
        }
;
        f.isObject(e.properties)&& ! f.isEmptyObject(e.properties)&& f.extend(t.event_list[0].properties, e.properties);
        f.searchObjDate(t.event_list[0]);
        t.client_id = this.appId;
        C.info(JSON.stringify(t, null, 4));
        n = this.serverUrl;
        f.isBoolean(this.config.enableEncrypt)&& 1 == this.config.enableEncrypt&& (t.event_list[0] = f.generateEncryptyData(t.event_list[0], void 0));
        i?(i = new FormData(), "debug" === this.config.debugMode?(i.append("source", "client"), i.append("appid", this.appId), i.append("deviceId", this.getDeviceId()), i.append("data", JSON.stringify(t.event_list[0]))):(a = f.base64Encode(JSON.stringify(t)), i.append("data", a)), navigator.sendBeacon(n, i), f.isFunction(e.onComplete)&& e.onComplete({
          statusCode: 200
        }
)): F.enqueue(t, n, {
          maxRetries: this.config.maxRetries, sendTimeout: this.config.sendTimeout, callback: e.onComplete, debugMode: this.config.debugMode
        }
);
      }
    }
  }
, {
    key: "_isObjectParams", value: function(e) {
      return f.isObject(e)&& f.isFunction(e.onComplete);
    }
  }
, {
    key: "track", value: function(e, t, i, n) {
      var a;
      if(! this._hasDisabled()) {
        this._isObjectParams(e)&& (e = (a = e).eventName, t = a.properties, i = a.time, n = a.onComplete);
        O.event(e)&& O.properties(t)|| ! this.config.strict? this._internalTrack(e, t, i, n): f.isFunction(n)&& n({
          code:- 1, msg: "invalid parameters"
        }
);
      }
    }
  }
, {
    key: "_internalTrack", value: function(e, t, i, n, a) {
      if(! this._hasDisabled()) {
        i = f.isDate(i)? i: new Date();
        this._isReady()? this._sendRequest({
          type: "track", eventName: e, properties: t, onComplete: n
        }
, i, a): this._queue.push(["_internalTrack", [e, t, i, n]]);
      }
    }
  }
, {
    key: "userSet", value: function(e, t, i) {
      var n;
      if(! this._hasDisabled()) {
        this._isObjectParams(e)&& (e = (n = e).properties, t = n.time, i = n.onComplete);
        O.propertiesMust(e)|| ! this.config.strict?(t = f.isDate(t)? t: new Date(), this._isReady()? this._sendRequest({
          type: "profile", eventName: "profile_set", properties: e, onComplete: i
        }
, t): this._queue.push(["userSet", [e, t, i]])):(C.warn("calling userSet failed due to invalid arguments"), f.isFunction(i)&& i({
          code:- 1, msg: "invalid parameters"
        }
));
      }
    }
  }
, {
    key: "userSetOnce", value: function(e, t, i) {
      var n;
      if(! this._hasDisabled()) {
        this._isObjectParams(e)&& (e = (n = e).properties, t = n.time, i = n.onComplete);
        O.propertiesMust(e)|| ! this.config.strict?(t = f.isDate(t)? t: new Date(), this._isReady()? this._sendRequest({
          type: "profile", eventName: "profile_set_once", properties: e, onComplete: i
        }
, t): this._queue.push(["userSetOnce", [e, t, i]])):(C.warn("calling userSetOnce failed due to invalid arguments"), f.isFunction(i)&& i({
          code:- 1, msg: "invalid parameters"
        }
));
      }
    }
  }
, {
    key: "userAdd", value: function(e, t, i) {
      var n;
      if(! this._hasDisabled()) {
        this._isObjectParams(e)&& (e = (n = e).properties, t = n.time, i = n.onComplete);
        O.propertiesMust(e)|| ! this.config.strict?(t = f.isDate(t)? t: new Date(), this._isReady()? this._sendRequest({
          type: "profile", eventName: "profile_increment", properties: e, onComplete: i
        }
, t): this._queue.push(["userAdd", [e, t, i]])):(C.warn("calling userAdd failed due to invalid arguments"), f.isFunction(i)&& i({
          code:- 1, msg: "invalid parameters"
        }
));
      }
    }
  }
, {
    key: "userNumberMax", value: function(e, t, i) {
      if(! this._hasDisabled()) {
        var n, a, o;
        if(this._isObjectParams(e)) {
          e = (n = e).properties;
          t = n.time;
          i = n.onComplete;
        }
        for(a in e) if("number" != typeof e[a]) {
          o = "The key ".concat(a, " must be type of number");
          console.warn(o);
          return void(f.isFunction(i)&& i({
            code:- 1, msg: o
          }
));
        }
        if(O.propertiesMust(e)|| ! this.config.strict) {
          t = f.isDate(t)? t: new Date();
          this._isReady()? this._sendRequest({
            type: "profile", eventName: "profile_number_max", properties: e, onComplete: i
          }
, t): this._queue.push(["userNumberMax", [e, t, i]]);
        } else {
          C.warn("calling userNumberMax failed due to invalid arguments");
          f.isFunction(i)&& i({
            code:- 1, msg: "invalid parameters"
          }
);
        }
      }
    }
  }
, {
    key: "userNumberMin", value: function(e, t, i) {
      if(! this._hasDisabled()) {
        var n, a, o;
        if(this._isObjectParams(e)) {
          e = (n = e).properties;
          t = n.time;
          i = n.onComplete;
        }
        for(a in e) if("number" != typeof e[a]) {
          o = "The key ".concat(a, " must be type of number");
          console.warn(o);
          return void(f.isFunction(i)&& i({
            code:- 1, msg: o
          }
));
        }
        if(O.propertiesMust(e)|| ! this.config.strict) {
          t = f.isDate(t)? t: new Date();
          this._isReady()? this._sendRequest({
            type: "profile", eventName: "profile_number_min", properties: e, onComplete: i
          }
, t): this._queue.push(["userNumberMin", [e, t, i]]);
        } else {
          C.warn("calling userNumberMin failed due to invalid arguments");
          f.isFunction(i)&& i({
            code:- 1, msg: "invalid parameters"
          }
);
        }
      }
    }
  }
, {
    key: "userDel", value: function(e, t) {
      var i, n = {
      }
;
      if(! this._hasDisabled()) {
        this._isObjectParams(n)&& (n = (i = n).properties, e = i.time, t = i.onComplete);
        O.propertiesMust(n)|| ! this.config.strict?(e = f.isDate(e)? e: new Date(), this._isReady()? this._sendRequest({
          type: "profile", eventName: "profile_delete", properties: n, onComplete: t
        }
, e): this._queue.push(["userDel", [n, e, t]])):(C.warn("calling userDel failed due to invalid arguments"), f.isFunction(t)&& t({
          code:- 1, msg: "invalid parameters"
        }
));
      }
    }
  }
, {
    key: "userAppend", value: function(e, t, i) {
      var n;
      if(! this._hasDisabled()) {
        this._isObjectParams(e)&& (e = (n = e).properties, t = n.time, i = n.onComplete);
        O.propertiesMust(e)|| ! this.config.strict?(t = f.isDate(t)? t: new Date(), this._isReady()? this._sendRequest({
          type: "profile", eventName: "profile_append", properties: e, onComplete: i
        }
, t): this._queue.push(["userAppend", [e, t, i]])):(C.warn("calling userAppend failed due to invalid arguments"), f.isFunction(i)&& i({
          code:- 1, msg: "invalid parameters"
        }
));
      }
    }
  }
, {
    key: "userUniqAppend", value: function(e, t, i) {
      var n;
      if(! this._hasDisabled()) {
        this._isObjectParams(e)&& (e = (n = e).properties, t = n.time, i = n.onComplete);
        O.userAppendProperties(e)|| ! this.config.strict?(t = f.isDate(t)? t: new Date(), this._isReady()? this._sendRequest({
          type: "profile", eventName: "profile_uniq_append", properties: e, onComplete: i
        }
, t): this._queue.push(["userUniqAppend", [e, t, i]])):(C.warn("calling userAppend failed due to invalid arguments"), f.isFunction(i)&& i({
          code:- 1, msg: "invalid parameters"
        }
));
      }
    }
  }
, {
    key: "userUnset", value: function(e, t, i) {
      var n;
      e = d({
      }
, e, null);
      if(! this._hasDisabled()) {
        this._isObjectParams(e)&& (e = (n = e).properties, t = n.time, i = n.onComplete);
        O.propertiesMust(e)|| ! this.config.strict?(t = f.isDate(t)? t: new Date(), this._isReady()? this._sendRequest({
          type: "profile", eventName: "profile_unset", properties: e, onComplete: i
        }
, t): this._queue.push(["userUnset", [e, t, i]])):(C.warn("calling userUnset failed due to invalid arguments"), f.isFunction(i)&& i({
          code:- 1, msg: "invalid parameters"
        }
));
      }
    }
  }
, {
    key: "uploadQuickAppDeviceInfo", value: function() {
      var e = this;
      return new Promise(function(t, i) {
        var n;
        D.getQuickDevice({
          success:(n = s(a().mark(function n(o) {
            var r, s;
            return a().wrap(function(n) {
              for(;
;
) switch(n.prev = n.next) {
                case 0: r = {
                  os_name: "android", android_id: o.user, imei: o.device, oaid: o.device, mac: o.mac, android_version: o.system, api_version: o.osVersionCode, rom: o.vendorOsName, rom_version: o.vendorOsVersion, phone_brand: o.manufacturer, phone_model: o.model
                }
;
                s = "".concat(_.BASE_URL, "/user/device_info/?access_token=").concat(e.accessToken, "&client_id=").concat(e.appId);
                n.next = 4;
                return e.sendNetWork(s, {
                  data: r
                }
);
                case 4: s = n.sent;
                return n.abrupt("return", (0 === s.code? t: i)(s));
                case 6: case "end": return n.stop();
              }
            }
, n);
          }
)), function(e) {
            return n.apply(this, arguments);
          }
)
        }
);
      }
);
    }
  }
, {
    key: "uploadQuickGameDeviceInfo", value: function() {
      var e = this;
      return new Promise(function(t, i) {
        var n, o = H();
        D.getQuickDevice({
          platform: o, success:(n = s(a().mark(function n(o) {
            var r, s;
            return a().wrap(function(n) {
              for(;
;
) switch(n.prev = n.next) {
                case 0: r = o;
                s = "".concat(_.BASE_URL, "/user/device_info/?access_token=").concat(e.accessToken, "&client_id=").concat(e.appId);
                n.next = 4;
                return e.sendNetWork(s, {
                  data: r
                }
);
                case 4: s = n.sent;
                return n.abrupt("return", (0 === s.code? t: i)(s));
                case 6: case "end": return n.stop();
              }
            }
, n);
          }
)), function(e) {
            return n.apply(this, arguments);
          }
)
        }
);
      }
);
    }
  }
, {
    key: "logoutEvent", value: function() {
      this.track("$MPLogout", {
      }
);
    }
  }
, {
    key: "loginEvent", value: function() {
      this.track("$MPLogin", {
      }
);
    }
  }
, {
    key: "registerEvent", value: function() {
      "GravityEngine_quick_mp" === H()? this.track("$AppRegister", {
      }
): this.track("$MPRegister", {
      }
);
    }
  }
, {
    key: "payEvent", value: function(e, t, i, n, a) {
      if("number" != typeof e) throw new Error("pay_amount must be a number");
      if("string" != typeof t) throw new Error("pay_type must be a string");
      if("string" != typeof i) throw new Error("order_id must be a string");
      if("string" != typeof n) throw new Error("pay_reason must be a string");
      if("string" != typeof a) throw new Error("pay_method must be a string");
      this.track("$PayEvent", {
        $pay_amount: e, $pay_type: t, $order_id: i, $pay_reason: n, $pay_method: a
      }
);
    }
  }
, {
    key: "bindTAThirdPlatform", value: function(e, t) {
      if(! e&& ! t) throw new Error("taAccountId or taDistinctId must be required");
      if(e&& "string" != typeof e) throw new Error("taAccountId must be a string");
      if(t&& "string" != typeof t) throw new Error("taDistinctId must be a string");
      this.track("$BindThirdPlatform", {
        $third_platform_type: "ta", $ta_account_id: e, $ta_distinct_id: t
      }
);
    }
  }
, {
    key: "adShowEvent", value: function(e, t, i) {
      var n = H();
      if("GravityEngine_wechat" === n|| "GravityEngine_wechat_game" === n) {
        if("string" != typeof e) throw new Error("ad_type must be a string");
        if("string" != typeof t) throw new Error("ad_unit_id must be a string");
        n = {
          $ad_type: e, $ad_unit_id: t, $adn_type: "wechat"
        }
;
        "[object Object]" === Object.prototype.toString.call(i)&& Object.assign(n, i);
        this.track("$AdShow", n);
      }
    }
  }
, {
    key: "getQuery", value: function() {
      return D.getAppOptions().query|| {
      }
;
    }
  }
, {
    key: "setQuery", value: function(e) {
      var t, i = [];
      for(t in e) e.hasOwnProperty(t)&& i.push(encodeURIComponent(t)+ "="+ encodeURIComponent(e[t]));
      return i.join("&");
    }
  }
, {
    key: "sendNetWork", value: function(e, t) {
      var i = 2 < arguments.length&& void 0 !== arguments[2]? arguments[2]: "POST";
      return new Promise(function(n, a) {
        D.request({
          url: e, method: i, data: "string" == typeof t? t: JSON.stringify(t), header: {
            "content-type": "application/json"
          }
, success: function(e) {
            200 === e.statusCode? n(e.data): a(e);
          }
, fail: function(e) {
            a(e);
          }
        }
);
      }
);
    }
  }
, {
    key: "_errorPromise", value: function(e) {
      return Promise.reject(new Error(e));
    }
  }
, {
    key: "initializeWithHistoryUserInfo", value:(n = s(a().mark(function e() {
      var t, i, n = arguments;
      return a().wrap(function(e) {
        for(;
;
) switch(e.prev = e.next) {
          case 0: t = 0 < n.length&& void 0 !== n[0]? n[0]: {
          }
;
          i = 1 < n.length? n[1]: void 0;
          return e.abrupt("return", this.initialize(t, i));
          case 3: case "end": return e.stop();
        }
      }
, e, this);
    }
)), function() {
      return n.apply(this, arguments);
    }
)
  }
, {
    key: "initialize", value:(i = s(a().mark(function e() {
      var t, i, n = this, o = arguments;
      return a().wrap(function(e) {
        for(;
;
) switch(e.prev = e.next) {
          case 0: t = 0 < o.length&& void 0 !== o[0]? o[0]: {
          }
;
          i = 1 < o.length? o[1]: void 0;
          return e.abrupt("return", new Promise(function() {
            var e = s(a().mark(function e(o, r) {
              return a().wrap(function(e) {
                for(;
;
) switch(e.prev = e.next) {
                  case 0: D.getStorage("is_ge_registered", ! 0, function() {
                    var e = s(a().mark(function e(s) {
                      var l, c, u, d, h, p, g, m, y, v, b;
                      return a().wrap(function(e) {
                        for(;
;
) switch(e.prev = e.next) {
                          case 0: l = "";
                          n._state.initComplete? null != t&& t.name? null != t&& t.version|| 0 === (null == t? void 0: t.version)? f.isNumber(null == t? void 0: t.version)&& "number" == typeof(null == t? void 0: t.version)? void 0 !== i&& ("[object Object]" !== Object.prototype.toString.call(i)? l = "history_info must be type: Object": null != i&& i.company? "string" != typeof i.company? l = "history_info.company must be type: String": null != i&& i.create_time|| 0 === i.create_time? f.isNumber(i.create_time)&& "number" == typeof i.create_time|| (l = "history_info.create_time must be type: Number"): l = "history_info.create_time must be required": l = "history_info.company must be required"): l = "version must be type: Number": l = "version must be required": l = "name must be required": l = "initialize must be called after setupAndStart";
                          if(l) return e.abrupt("return", n._errorPromise(l));
                          e.next = 4;
                          break;
                          case 4: l = n.getQuery();
                          c = (null == t? void 0: t.channel)|| "base_channel";
                          h = {
                            client_id: n.appId, name: t.name, channel: c, version: t.version, wx_openid:(null == t? void 0: t.openid)|| (null == t? void 0: t.wx_openid)|| "", wx_unionid:(null == t? void 0: t.wx_unionid)|| "", promoted_object_id:(null == t? void 0: t.promoted_object_id)|| "", need_return_attribution:(null == t? void 0: t.enable_sync_attribution)|| ! 1, ad_data: l
                          }
;
                          i&& (h.history_info = i);
                          d = "".concat(_.BASE_URL, "/user/initialize/?access_token=").concat(n.accessToken);
                          e.next = 11;
                          return n.sendNetWork(d, h);
                          case 11: if(0 !== (u = e.sent).code) return e.abrupt("return", r(u));
                          e.next = 14;
                          break;
                          case 14: d = H();
                          console.log("gravity current platform: "+ d);
                          "GravityEngine_quick_mp" === d? n.uploadQuickAppDeviceInfo(): d.includes("gravityengine_qg")&& n.uploadQuickGameDeviceInfo();
                          h = V.properties;
                          m = new Date();
                          y = m.getFullYear();
                          v = ("0"+(m.getMonth()+ 1)).slice(- 2);
                          b = ("0"+ m.getDate()).slice(- 2);
                          p = ("0"+ m.getHours()).slice(- 2);
                          g = ("0"+ m.getMinutes()).slice(- 2);
                          m = ("0"+ m.getSeconds()).slice(- 2);
                          y = "".concat(y, "-").concat(v, "-").concat(b, " ").concat(p, ":").concat(g, ":").concat(m);
                          if("Y" !== s) {
                            n.userSetOnce({
                              $channel: c, $manufacturer: h.$manufacturer, $model: h.$model, $brand: h.$brand, $os: h.$os, $first_visit_time: y, $first_scene: String(null == (v = D.getAppOptions())? void 0: v.scene)
                            }
);
                            b = n.setQuery(n.getQuery());
                            n.track("$MPLaunch", {
                              $url_query: b
                            }
);
                            n.track("$MPShow", {
                              $url_query: b
                            }
);
                          }
                          D.setStorage("is_ge_registered", JSON.stringify("Y"));
                          return e.abrupt("return", o(u));
                          case 29: case "end": return e.stop();
                        }
                      }
, e);
                    }
));
                    return function(t) {
                      return e.apply(this, arguments);
                    }
;
                  }
());
                  case 1: case "end": return e.stop();
                }
              }
, e);
            }
));
            return function(t, i) {
              return e.apply(this, arguments);
            }
;
          }
()));
          case 3: case "end": return e.stop();
        }
      }
, e);
    }
)), function() {
      return i.apply(this, arguments);
    }
)
  }
, {
    key: "queryUserInfo", value:(t = s(a().mark(function e() {
      var t = this;
      return a().wrap(function(e) {
        for(;
;
) switch(e.prev = e.next) {
          case 0: if(this._state.initComplete) {
            e.next = 2;
            break;
          }
          return e.abrupt("return", this._errorPromisqueryUserInfomustbecalledaftersetupAndStart);
          case 2: return e.abrupt("return", new Promise(function() {
            var e = s(a().mark(function e(i, n) {
              var o;
              return a().wrap(function(e) {
                for(;
;
) switch(e.prev = e.next) {
                  case 0: o = "".concat(_.BASE_URL, "/user/get/?access_token=").concat(t.accessToken, "&client_id=").concat(t.appId);
                  e.next = 3;
                  return t.sendNetWork(o, {
                  }
, "GET");
                  case 3: o = e.sent;
                  return e.abrupt("return", (0 === o.code? i: n)(o));
                  case 5: case "end": return e.stop();
                }
              }
, e);
            }
));
            return function(t, i) {
              return e.apply(this, arguments);
            }
;
          }
()));
          case 3: case "end": return e.stop();
        }
      }
, e, this);
    }
)), function() {
      return t.apply(this, arguments);
    }
)
  }
, {
    key: "authorizeOpenID", value: function(e) {
      this.identify(e);
    }
  }
, {
    key: "identify", value: function(e) {
      if(! this._hasDisabled()) {
        if("number" == typeof e) e = String(e);
        else if("string" != typeof e) return ! 1;
        this.store.setDistinctId(e);
      }
    }
  }
, {
    key: "getDistinctId", value: function() {
      return this.store.getDistinctId();
    }
  }
, {
    key: "login", value: function(e) {
      if(! this._hasDisabled()) {
        if("number" == typeof e) e = String(e);
        else if("string" != typeof e) return ! 1;
        this.store.setAccountId(e);
      }
    }
  }
, {
    key: "getAccountId", value: function() {
      return this.store.getAccountId();
    }
  }
, {
    key: "logout", value: function() {
      this._hasDisabled()|| this.store.setAccountId(null);
    }
  }
, {
    key: "setSuperProperties", value: function(e) {
      this._hasDisabled()|| (O.propertiesMust(e)|| ! this.config.strict? this.store.setSuperProperties(e): C.warn("setSuperProperties parameter must be a valid property value"));
    }
  }
, {
    key: "registerApp", value: function(e) {
      this.setSuperProperties(e);
    }
  }
, {
    key: "clearSuperProperties", value: function() {
      this._hasDisabled()|| this.store.setSuperProperties({
      }
, ! 0);
    }
  }
, {
    key: "unsetSuperProperty", value: function(e) {
      var t;
      this._hasDisabled()|| f.isString(e)&& (delete(t = this.getSuperProperties())[e], this.store.setSuperProperties(t, ! 0));
    }
  }
, {
    key: "getSuperProperties", value: function() {
      return this.store.getSuperProperties();
    }
  }
, {
    key: "getSendProperties", value: function() {
      try {
        var e, t = f.extend({
        }
, V.properties, this.autoTrackProperties, this.store.getSuperProperties(), this.dynamicProperties? this.dynamicProperties(): {
        }
);
        for(e in t) "string" == typeof t[e]&& (t[e] = t[e].substring(0, 8192));
        return t;
      } catch(e) {
        return {
        }
;
      }
    }
  }
, {
    key: "getPresetProperties", value: function() {
      var e = V.properties, t = {
      }
, i = e.$system_language;
      t.system_language = f.isUndefined(i)? "": i;
      i = e.$os;
      t.os = f.isUndefined(i)? "": i;
      i = e.$screen_width;
      t.screenWidth = f.isUndefined(i)? 0: i;
      i = e.$screen_height;
      t.screenHeight = f.isUndefined(i)? 0: i;
      i = e.$network_type;
      t.networkType = f.isUndefined(i)? "": i;
      i = e.$model;
      t.deviceModel = f.isUndefined(i)? "": i;
      i = e.$os_version;
      t.osVersion = f.isUndefined(i)? "": i;
      t.deviceId = this.getDeviceId();
      i = 0- new Date().getTimezoneOffset()/ 60;
      t.zoneOffset = i;
      i = e.$manufacturer;
      t.manufacturer = f.isUndefined(i)? "": i;
      i = e.$manufacturer;
      t.brand = f.isUndefined(i)? "": i;
      t.toEventPresetProperties = function() {
        var e;
        return {
          $app_id: this.appId, $model: t.deviceModel, $screen_width: t.screenWidth, $screen_height: t.screenHeight, $system_language: t.system_language, $os: t.os, $os_version: t.osVersion, $network_type: t.networkType, $manufacturer: t.manufacturer, $brand: t.manufacturer, $scene: String((null == (e = D.getAppOptions())? void 0: e.scene)|| (null == (e = D.getAppOptions())? void 0: e.from))
        }
;
      }
;
      return t;
    }
  }
, {
    key: "setDynamicSuperProperties", value: function(e) {
      this._hasDisabled()|| ("function" == typeof e? O.properties(e())|| ! this.config.strict? this.dynamicProperties = e: C.warn("A dynamic public property must return a valid property value"): C.warn("setDynamicSuperProperties parameter must be a function type"));
    }
  }
, {
    key: "timeEvent", value: function(e, t) {
      if(! this._hasDisabled()) {
        t = f.isDate(t)? t: new Date();
        this._isReady()? O.event(e)|| ! this.config.strict? this.store.setEventTimer(e, t.getTime()): C.warn("calling timeEvent failed due to invalid eventName: "+ e): this._queue.push(["timeEvent", [e, t]]);
      }
    }
  }
, {
    key: "getDeviceId", value: function() {
      return V.properties.$device_id;
    }
  }
, {
    key: "enableTracking", value: function(e) {
      this.enabled = e;
      this.store._set("ta_enabled", e);
    }
  }
, {
    key: "optOutTracking", value: function() {
      this.store.setSuperProperties({
      }
, ! 0);
      this.store.setDistinctId(f.UUID());
      this.store.setAccountId(null);
      this._queue.splice(0, this._queue.length);
      this.isOptOut = ! 0;
      this.store._set("ge_isOptOut", ! 0);
    }
  }
, {
    key: "optOutTrackingAndDeleteUser", value: function() {
      var e = new Date();
      this._sendRequest({
        type: "user_del"
      }
, e);
      this.optOutTracking();
    }
  }
, {
    key: "optInTracking", value: function() {
      this.isOptOut = ! 1;
      this.store._set("ge_isOptOut", ! 1);
    }
  }
, {
    key: "setTrackStatus", value: function(e) {
      switch(e) {
        case "PAUSE": this.eventSaveOnly = ! 1;
        this.optInTracking();
        this.enableTracking(! 1);
        break;
        case "STOP": this.eventSaveOnly = ! 1;
        this.optOutTracking(! 0);
        break;
        default: this.eventSaveOnly = ! 1;
        this.optInTracking();
        this.enableTracking(! 0);
      }
    }
  }
]);
  return e;
}
(),
j = {
  name: "GravityEngine",
  enableLog: ! 0,
  enableNative: ! 1
}
,
q = function() {
  function e(t) {
    l(this, e);
    t.appId = f.checkAppId(t.clientId);
    t.accessToken = t.accessToken;
    t.appId? t.accessToken|| console.warn("GravityAnalytics: accessToken must be required"): console.warn("GravityAnalytics: clientId must be required");
    t.serverUrl = "".concat(_.BASE_URL, "/event/collect/?access_token=").concat(t.accessToken);
    var i = f.extend({
    }
, j, D.getConfig());
    f.isObject(t)? this.config = f.extend(i, t): this.config = i;
    this._init(this.config);
  }
  var t;
  u(e, [{
    key: "_isNativePlatform", value: function() {
      return !(! this._isIOS()&& ! this._isAndroid()|| ! this.config.enableNative);
    }
  }
, {
    key: "_isIOS", value: function() {
      return !(! cc.sys.isNative|| "iOS" !== cc.sys.os);
    }
  }
, {
    key: "_isAndroid", value: function() {
      return !(! cc.sys.isNative|| "Android" !== cc.sys.os);
    }
  }
, {
    key: "_init", value: function(e) {
      this.name = e.name;
      this.appId = e.clientId;
      this.accessToken = e.accessToken;
      var t = e.serverUrl|| e.server_url;
      this.serverUrl = t;
      this.serverDebugUrl = t+ "/data_debug";
      this.configUrl = t+ "/config";
      if(this._isNativePlatform()) {
        this.initInstanceForNative(this.name, e, this.appId);
        this._readStorage(e);
      } else this.geJs = new GravityAnalyticsAPIForJS(e);
    }
  }
, {
    key: "_readStorage", value: function(e) {
      var t = this, i = e.persistenceName, n = e.persistenceNameOld;
      if(e.isChildInstance) {
        i = e.persistenceName+ "_"+ e.name;
        n = e.persistenceNameOld+ "_"+ e.name;
      }
      this._state = D.getStorage(i)|| {
      }
;
      f.isEmptyObject(this._state)&& (this._state = D.getStorage(n)|| {
      }
);
      if(f.isEmptyObject(this._state)) D.getStorage(i, ! 0, function(e) {
        f.isEmptyObject(e)? D.getStorage(n, ! 0, function(e) {
          t._state = f.extend2Layers({
          }
, e, t._state);
        }
): t._state = f.extend2Layers({
        }
, e, t._state);
        t._state.distinct_id&& t.identifyForNative(t._state.distinct_id);
        t._state.account_id&& t.loginForNative(t._state.account_id);
      }
);
      else {
        this._state.distinct_id&& this.identifyForNative(this._state.distinct_id);
        this._state.account_id&& this.loginForNative(this._state.account_id);
      }
    }
  }
, {
    key: "initInstance", value: function(e, t) {
      this._isNativePlatform()? f.isUndefined(t)? this[e] = new GravityAnalyticsAPI(this.config): this[e] = new GravityAnalyticsAPI(t): this[e] = this.geJs.initInstance(e, t);
      return this[e];
    }
  }
, {
    key: "lightInstance", value: function(e) {
      return this[e];
    }
  }
, {
    key: "setupAndStart", value: function() {
      var e, t;
      if(this._isNativePlatform()) {
        e = window;
        t = this;
        e.__autoTrackCallback = function(e) {
          return f.isFunction(t.config.autoTrack.callback)?(e = t.config.autoTrack.callback(e), JSON.stringify(e)): "{}";
        }
;
        this.startGravityAnalyticsForNative();
      } else this.geJs.setupAndStart();
    }
  }
, {
    key: "track", value: function(e, t, i, n) {
      this._isNativePlatform()? this.trackForNative(e, t, i, this.appId): this.geJs.track(e, t, i, n);
    }
  }
, {
    key: "initializeWithHistoryUserInfo", value:(t = s(a().mark(function e() {
      var t, i, n = arguments;
      return a().wrap(function(e) {
        for(;
;
) switch(e.prev = e.next) {
          case 0: t = 0 < n.length&& void 0 !== n[0]? n[0]: {
          }
;
          i = 1 < n.length? n[1]: void 0;
          return e.abrupt("return", this.geJs.initializeWithHistoryUserInfo(t, i));
          case 3: case "end": return e.stop();
        }
      }
, e, this);
    }
)), function() {
      return t.apply(this, arguments);
    }
)
  }
, {
    key: "initialize", value: function() {
      var e = 0 < arguments.length&& void 0 !== arguments[0]? arguments[0]: {
      }
, t = 1 < arguments.length? arguments[1]: void 0;
      if(! this._isNativePlatform()) return this.geJs.initialize(e, t);
    }
  }
, {
    key: "queryUserInfo", value: function() {
      if(! this._isNativePlatform()) return this.geJs.queryUserInfo();
    }
  }
, {
    key: "registerApp", value: function(e) {
      if(! this._isNativePlatform()) return this.geJs.registerApp(e);
    }
  }
, {
    key: "registerEvent", value: function() {
      if(! this._isNativePlatform()) return this.geJs.registerEvent();
    }
  }
, {
    key: "loginEvent", value: function() {
      if(! this._isNativePlatform()) return this.geJs.loginEvent();
    }
  }
, {
    key: "logoutEvent", value: function() {
      if(! this._isNativePlatform()) return this.geJs.logoutEvent();
    }
  }
, {
    key: "payEvent", value: function(e, t, i, n, a) {
      if(! this._isNativePlatform()) return this.geJs.payEvent(e, t, i, n, a);
    }
  }
, {
    key: "bindTAThirdPlatform", value: function(e, t) {
      if(! this._isNativePlatform()) return this.geJs.bindTAThirdPlatform(e, t);
    }
  }
, {
    key: "adShowEvent", value: function(e, t, i) {
      if(! this._isNativePlatform()) return this.geJs.adShowEvent(e, t, i);
    }
  }
, {
    key: "userSet", value: function(e, t, i) {
      this._isNativePlatform()? this.userSetForNative(e, this.appId): this.geJs.userSet(e, t, i);
    }
  }
, {
    key: "userSetOnce", value: function(e, t, i) {
      this._isNativePlatform()? this.userSetOnceForNative(e, this.appId): this.geJs.userSetOnce(e, t, i);
    }
  }
, {
    key: "userUnset", value: function(e, t, i) {
      this._isNativePlatform()? this.userUnsetForNative(e, this.appId): this.geJs.userUnset(e, t, i);
    }
  }
, {
    key: "userDel", value: function(e, t) {
      this._isNativePlatform()? this.userDelForNative(this.appId): this.geJs.userDel(e, t);
    }
  }
, {
    key: "userAdd", value: function(e, t, i) {
      this._isNativePlatform()? this.userAddForNative(e, this.appId): this.geJs.userAdd(e, t, i);
    }
  }
, {
    key: "userNumberMax", value: function(e, t, i) {
      this._isNativePlatform()|| this.geJs.userNumberMax(e, t, i);
    }
  }
, {
    key: "userNumberMin", value: function(e, t, i) {
      this._isNativePlatform()|| this.geJs.userNumberMin(e, t, i);
    }
  }
, {
    key: "userAppend", value: function(e, t, i) {
      this._isNativePlatform()? this.userAppendForNative(e, this.appId): this.geJs.userAppend(e, t, i);
    }
  }
, {
    key: "userUniqAppend", value: function(e, t, i) {
      this._isNativePlatform()? this.userUniqAppendForNative(e, this.appId): this.geJs.userUniqAppend(e, t, i);
    }
  }
, {
    key: "authorizeOpenID", value: function(e) {
      this.identify(e);
    }
  }
, {
    key: "identify", value: function(e) {
      this._isNativePlatform()? this.identifyForNative(e, this.appId): this.geJs.identify(e);
    }
  }
, {
    key: "getDistinctId", value: function() {
      return this._isNativePlatform()? this.getDistinctIdForNative(this.appId): this.geJs.getDistinctId();
    }
  }
, {
    key: "login", value: function(e) {
      this._isNativePlatform()? this.loginForNative(e, this.appId): this.geJs.login(e);
    }
  }
, {
    key: "getAccountId", value: function() {
      return this._isNativePlatform()? this.getAccountIdForNative(this.appId): this.geJs.getAccountId();
    }
  }
, {
    key: "logout", value: function() {
      this._isNativePlatform()? this.logoutForNative(this.appId): this.geJs.logout();
    }
  }
, {
    key: "setSuperProperties", value: function(e) {
      this._isNativePlatform()? this.setSuperPropertiesForNative(e, this.appId): this.geJs.setSuperProperties(e);
    }
  }
, {
    key: "clearSuperProperties", value: function() {
      this._isNativePlatform()? this.clearSuperPropertiesForNative(this.appId): this.geJs.clearSuperProperties();
    }
  }
, {
    key: "unsetSuperProperty", value: function(e) {
      this._isNativePlatform()? this.unsetSuperPropertyForNative(e, this.appId): this.geJs.unsetSuperProperty(e);
    }
  }
, {
    key: "getSuperProperties", value: function() {
      return this._isNativePlatform()? this.getSuperPropertiesForNative(this.appId): this.geJs.getSuperProperties();
    }
  }
, {
    key: "getPresetProperties", value: function() {
      var e, t, i, n;
      return this._isNativePlatform()?(e = this.getPresetPropertiesForNative(this.appId), t = {
      }
, n = e.$system_language, t.system_language = f.isUndefined(n)? "": n, n = e.$os, t.os = f.isUndefined(n)? "": n, n = e.$screen_width, t.screenWidth = f.isUndefined(n)? 0: n, n = e.$screen_height, t.screenHeight = f.isUndefined(n)? 0: n, n = e.$network_type, t.networkType = f.isUndefined(n)? "": n, n = e.$device_model, t.deviceModel = f.isUndefined(n)? "": n, n = e.$os_version, t.osVersion = f.isUndefined(n)? "": n, t.deviceId = this.getDeviceId(), i = 0- new Date().getTimezoneOffset()/ 60, t.zoneOffset = i, n = e.$manufacturer, t.manufacturer = f.isUndefined(n)? "": n, n = e.$manufacturer, t.brand = f.isUndefined(n)? "": n, t.toEventPresetProperties = function() {
        return {
          $device_model: t.deviceModel, $device_id: t.deviceId, $screen_width: t.screenWidth, $screen_height: t.screenHeight, $system_language: t.system_language, $os: t.os, $os_version: t.osVersion, $network_type: t.networkType, $zone_offset: i, $manufacturer: t.manufacturer, $brand: t.manufacturer
        }
;
      }
, t): this.geJs.getPresetProperties();
    }
  }
, {
    key: "setDynamicSuperProperties", value: function(e) {
      if(this._isNativePlatform()) if("function" == typeof e) {
        this.dynamicProperties = e;
        window.__dynamicPropertiesForNative = function(t) {
          console.log("__dynamicPropertiesForNative: native msg: ", t);
          t = e();
          t = f.encodeDates(t);
          return JSON.stringify(t);
        }
;
        this.setDynamicSuperPropertiesForNativ__dynamicPropertiesForNative;
      } else logger.warn("setDynamicSuperProperties parameter must be a function type");
      else this.geJs.setDynamicSuperProperties(e);
    }
  }
, {
    key: "timeEvent", value: function(e, t) {
      return this._isNativePlatform()? this.timeEventForNative(e, this.appId): this.geJs.timeEvent(e, t);
    }
  }
, {
    key: "getDeviceId", value: function() {
      return this._isNativePlatform()? this.getDeviceIdForNative(this.appId): this.geJs.getDeviceId();
    }
  }
, {
    key: "enableTracking", value: function(e) {
      this._isNativePlatform()? this.enableTrackingForNative(e, this.appId): this.geJs.enableTracking(e);
    }
  }
, {
    key: "optOutTracking", value: function() {
      this._isNativePlatform()? this.optOutTrackingForNative(this.appId): this.geJs.optOutTracking();
    }
  }
, {
    key: "optOutTrackingAndDeleteUser", value: function() {
      this._isNativePlatform()? this.optOutTrackingAndDeleteUserForNative(this.appId): this.geJs.optOutTrackingAndDeleteUser();
    }
  }
, {
    key: "optInTracking", value: function() {
      this._isNativePlatform()? this.optInTrackingForNative(this.appId): this.geJs.optInTracking();
    }
  }
, {
    key: "setTrackStatus", value: function(e) {
      this._isNativePlatform()? this.setTrackStatusForNative(e, this.appId): this.geJs.setTrackStatus(e);
    }
  }
, {
    key: "trackForNative", value: function(e, t, i, n) {
      i = f.isDate(i)? f.formatDate(i): "";
      f.isUndefined(t)&& (t = {
      }
);
      t = f.extend(t, this.dynamicProperties? this.dynamicProperties(): {
      }
);
      t = f.encodeDates(t);
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "track", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", e, JSON.stringify(t), i, n): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "track:properties:time:appId:", e, JSON.stringify(t), i, n);
    }
  }
, {
    key: "timeEventForNative", value: function(e, t) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "timeEvent", "(Ljava/lang/String;Ljava/lang/String;)V", e, t): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "timeEvent:appId:", e, t);
    }
  }
, {
    key: "loginForNative", value: function(e, t) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "login", "(Ljava/lang/String;Ljava/lang/String;)V", e, t): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "login:appId:", e, t);
    }
  }
, {
    key: "logoutForNative", value: function(e) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "logout", "(Ljava/lang/String;)V", e): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "logout:", e);
    }
  }
, {
    key: "setSuperPropertiesForNative", value: function(e, t) {
      e = f.encodeDates(e);
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "setSuperProperties", "(Ljava/lang/String;Ljava/lang/String;)V", JSON.stringify(e), t): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "setSuperProperties:appId:", JSON.stringify(e), t);
    }
  }
, {
    key: "getSuperPropertiesForNative", value: function(e) {
      var t = "{}";
      this._isAndroid()? t = jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "getSuperProperties", "(Ljava/lang/String;)V", e): this._isIOS()&& (t = jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "getSuperProperties:", e));
      return JSON.parse(t);
    }
  }
, {
    key: "unsetSuperPropertyForNative", value: function(e, t) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "unsetSuperProperty", "(Ljava/lang/String;Ljava/lang/String;)V", e, t): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "unsetSuperProperty:appId:", e, t);
    }
  }
, {
    key: "clearSuperPropertiesForNative", value: function(e) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "clearSuperProperties", "(Ljava/lang/String;)V", e): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "clearSuperProperties:", e);
    }
  }
, {
    key: "userSetForNative", value: function(e, t) {
      e = f.encodeDates(e);
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "userSet", "(Ljava/lang/String;Ljava/lang/String;)V", JSON.stringify(e), t): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "userSet:appId:", JSON.stringify(e), t);
    }
  }
, {
    key: "userSetOnceForNative", value: function(e, t) {
      e = f.encodeDates(e);
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "userSetOnce", "(Ljava/lang/String;Ljava/lang/String;)V", JSON.stringify(e), t): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "userSetOnce:appId:", JSON.stringify(e), t);
    }
  }
, {
    key: "userAppendForNative", value: function(e, t) {
      e = f.encodeDates(e);
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "userAppend", "(Ljava/lang/String;Ljava/lang/String;)V", JSON.stringify(e), t): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "userAppend:appId:", JSON.stringify(e), t);
    }
  }
, {
    key: "userUniqAppendForNative", value: function(e, t) {
      e = f.encodeDates(e);
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "userUniqAppend", "(Ljava/lang/String;Ljava/lang/String;)V", JSON.stringify(e), t): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "userUniqAppend:appId:", JSON.stringify(e), t);
    }
  }
, {
    key: "userAddForNative", value: function(e, t) {
      e = f.encodeDates(e);
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "userAdd", "(Ljava/lang/String;Ljava/lang/String;)V", JSON.stringify(e), t): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "userAdd:appId:", JSON.stringify(e), t);
    }
  }
, {
    key: "userUnsetForNative", value: function(e, t) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "userUnset", "(Ljava/lang/String;Ljava/lang/String;)V", e, t): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "userUnset:appId:", e, t);
    }
  }
, {
    key: "userDelForNative", value: function(e) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "userDel", "(Ljava/lang/String;)V", e): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "userDel:", e);
    }
  }
, {
    key: "authorizeOpenIDForNative", value: function(e, t) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "authorizeOpenID", "(Ljava/lang/String;Ljava/lang/String;)V", e, t): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "authorizeOpenID:appId:", e, t);
    }
  }
, {
    key: "identifyForNative", value: function(e, t) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "identify", "(Ljava/lang/String;Ljava/lang/String;)V", e, t): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "identify:appId:", e, t);
    }
  }
, {
    key: "initInstanceForNative", value: function(e, t, i) {
      if(this._isAndroid()) {
        jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "setCustomerLibInfo", "(Ljava/lang/String;Ljava/lang/String;)V", _.LIB_NAME, _.LIB_VERSION);
        f.isUndefined(t)? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "initInstanceAppId", "(Ljava/lang/String;Ljava/lang/String;)V", e, i): jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "initInstanceConfig", "(Ljava/lang/String;Ljava/lang/String;)V", e, JSON.stringify(t));
      } else this._isIOS()&& (jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "setCustomerLibInfoWithLibName:libVersion:", _.LIB_NAME, _.LIB_VERSION), f.isUndefined(t)? jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "initInstance:appId:", e, i): jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "initInstance:config:", e, JSON.stringify(t)));
    }
  }
, {
    key: "lightInstanceForNative", value: function(e, t) {
      return this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "lightInstance", "(Ljava/lang/String;Ljava/lang/String;)V", e, t): this._isIOS()? jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "lightInstance:appId:", e, t): void 0;
    }
  }
, {
    key: "startGravityAnalyticsForNative", value: function(e) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "startGravityAnalytics", "(Ljava/lang/String;)V", e): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "startGravityAnalytics:", e);
    }
  }
, {
    key: "setDynamicSuperPropertiesForNative", value: function(e, t) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "setDynamicSuperProperties", "(Ljava/lang/String;Ljava/lang/String;)V", e, t): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "setDynamicSuperProperties:appId:", e, t);
    }
  }
, {
    key: "getDeviceIdForNative", value: function(e) {
      return this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "getDeviceId", "(Ljava/lang/String;)Ljava/lang/String;", e): this._isIOS()? jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "getDeviceId:", e): void 0;
    }
  }
, {
    key: "getDistinctIdForNative", value: function(e) {
      return this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "getDistinctId", "(Ljava/lang/String;)Ljava/lang/String;", e): this._isIOS()? jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "getDistinctId:", e): void 0;
    }
  }
, {
    key: "getAccountIdForNative", value: function(e) {
      return this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "getAccountId", "(Ljava/lang/String;)Ljava/lang/String;", e): this._isIOS()? jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "getAccountId:", e): void 0;
    }
  }
, {
    key: "getPresetPropertiesForNative", value: function(e) {
      var t = "{}";
      this._isAndroid()? t = jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "getPresetProperties", "(Ljava/lang/String;)Ljava/lang/String;", e): this._isIOS()&& (t = jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "getPresetProperties:", e));
      return JSON.parse(t);
    }
  }
, {
    key: "enableTrackingForNative", value: function(e, t) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "enableTracking", "(Ljava/lang/String;Ljava/lang/String;)V", e.toString(), t): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "enableTracking:appId:", e.toString(), t);
    }
  }
, {
    key: "optOutTrackingForNative", value: function(e) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "optOutTracking", "(Ljava/lang/String;)V", e): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "optOutTracking:", e);
    }
  }
, {
    key: "optOutTrackingAndDeleteUserForNative", value: function(e) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "optOutTrackingAndDeleteUser", "(Ljava/lang/String;)V", e): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "optOutTrackingAndDeleteUser:", e);
    }
  }
, {
    key: "optInTrackingForNative", value: function(e) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "optInTracking", "(Ljava/lang/String;)V", e): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "optInTracking:", e);
    }
  }
, {
    key: "setTrackStatusForNative", value: function(e, t) {
      this._isAndroid()? jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "setTrackStatus", "(Ljava/lang/String;Ljava/lang/String;)V", e, t): this._isIOS()&& jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "setTrackStatus:appId:", e, t);
    }
  }
]);
  return e;
}
();
window.GravityAnalyticsAPI = q;
window.GravityAnalyticsAPIForJS = z;

export {};
