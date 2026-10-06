// @ts-nocheck
"use strict";
var o,
n,
i = function() {
  throw new Error("setTimeout has not been defined");
}
,
a = function() {
  throw new Error("clearTimeout has not been defined");
}
,
r = function(e) {
  if(o === setTimeout) return setTimeout(e, 0);
  if((o === i|| ! o)&& setTimeout) {
    o = setTimeout;
    return setTimeout(e, 0);
  }
  try {
    return o(e, 0);
  } catch(t) {
    try {
      return o.call(null, e, 0);
    } catch(t) {
      return o.call(this, e, 0);
    }
  }
}
,
l = function(e) {
  if(n === clearTimeout) return clearTimeout(e);
  if((n === a|| ! n)&& clearTimeout) {
    n = clearTimeout;
    return clearTimeout(e);
  }
  try {
    return n(e);
  } catch(t) {
    try {
      return n.call(null, e);
    } catch(t) {
      return n.call(this, e);
    }
  }
}
,
s = function() {
  if(h&& _) {
    h = ! 1;
    _.length? f = _.concat(f): g = - 1;
    f.length&& c();
  }
}
,
c = function() {
  if(! h) {
    var e = r(s);
    h = ! 0;
    for(var t = f.length;
    t;
) {
      _ = f;
      f = [];
      for(;
++ g < t;
) _&& _[g].run();
      g = - 1;
      t = f.length;
    }
    _ = null;
    h = ! 1;
    l(e);
  }
}
,
u = function(e, t) {
  this.fun = e;
  this.array = t;
}
,
p = function() {
}
,
const process = module.exports;
(function() {
  try {
    o = "function" == typeof setTimeout? setTimeout: i;
  } catch(e) {
    o = i;
  }
  try {
    n = "function" == typeof clearTimeout? clearTimeout: a;
  } catch(e) {
    n = a;
  }
}
)();
var _,
f = [],
h = ! 1,
g = - 1;
process.nextTick = function(e) {
  var t = new Array(arguments.length- 1);
  if(arguments.length > 1) for(var o = 1;
  o < arguments.length;
  o++) t[o- 1] = arguments[o];
  f.push(new u(e, t));
  1 !== f.length|| h|| r(c);
}
;
u.prototype.run = function() {
  this.fun.apply(null, this.array);
}
;
process.title = "browser";
process.browser = ! 0;
process.env = {
}
;
process.argv = [];
process.version = "";
process.versions = {
}
;
process.on = p;
process.addListener = p;
process.once = p;
process.off = p;
process.removeListener = p;
process.removeAllListeners = p;
process.emit = p;
process.prependListener = p;
process.prependOnceListener = p;
process.listeners = function() {
  return[];
}
;
process.binding = function() {
  throw new Error("process.binding is not supported");
}
;
process.cwd = function() {
  return "/";
}
;
process.chdir = function() {
  throw new Error("process.chdir is not supported");
}
;
process.umask = function() {
  return 0;
}
;
export = module.exports;
