let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "852bdO3BHZBYqN6CW1lD7iF", "FileSaver");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
o.saveAs = void 0;
o.saveAs = o.saveAs|| function(e) {
  if(!("undefined" == typeof e|| "undefined" != typeof navigator&& / MSIE[1- 9] \./.test(navigator.userAgent))) {
    var t = e.document,
    o = function() {
      return e.URL|| e.webkitURL|| e;
    }
,
    n = t.createElementNS("http://www.w3.org/1999/xhtml", "a"),
    i = "download" in n,
    a = / constructor/ i.test(e.HTMLElement)|| e.safari,
    r = / CriOS \/[\ d]+/.test(navigator.userAgent),
    l = function(t) {
(e.setImmediate|| e.setTimeout)(function() {
        throw t;
      }
, 0);
    }
,
    s = function(e) {
      setTimeout(function() {
        "string" == typeof e? o().revokeObjectURL(e): e.remove();
      }
, 4e4);
    }
,
    c = function(e, t, o) {
      for(var n = (t = [].concat(t)).length;
      n--;
) {
        var i = e["on"+ t[n]];
        if("function" == typeof i) try {
          i.call(e, o|| e);
        } catch(e) {
          l(e);
        }
      }
    }
,
    u = function(e) {
      return/ ^ \ s*(?: text \/ \ S*| application \/ xml| \ S* \/ \ S* \+ xml) \ s*;
.* charset \ s*= \ s* utf- 8/ i.test(e.type)? new Blob([String.fromCharCode(65279), e], {
        type: e.type
      }
): e;
    }
,
    p = function(t, l, p) {
      p|| (t = u(t));
      var d,
      _ = this,
      f = "application/octet-stream" === t.type,
      h = function() {
        c(_, "writestart progress write writeend".split(" "));
      }
;
      _.readyState = _.INIT;
      if(i) {
        d = o().createObjectURL(t);
        setTimeout(function() {
          n.href = d;
          n.download = l;
          e = n, t = new MouseEvent("click"), e.dispatchEvent(t);
          var e, t;
          h();
          s(d);
          _.readyState = _.DONE;
        }
);
      } else(function() {
        if((r|| f&& a)&& e.FileReader) {
          var n = new FileReader();
          n.onloadend = function() {
            var t = r? n.result: n.result.replace(/ ^ data:[^;
]*;
/, "data:attachment/file;");
            e.open(t, "_blank")|| (e.location.href = t);
            t = void 0;
            _.readyState = _.DONE;
            h();
          }
;
          n.readAsDataURL(t);
          _.readyState = _.INIT;
        } else {
          d|| (d = o().createObjectURL(t));
          f? e.location.href = d: e.open(d, "_blank")|| (e.location.href = d);
          _.readyState = _.DONE;
          h();
          s(d);
        }
      }
)();
    }
,
    d = p.prototype;
    if("undefined" != typeof navigator&& navigator.msSaveOrOpenBlob) return function(e, t, o) {
      t = t|| e.name|| "download";
      o|| (e = u(e));
      return navigator.msSaveOrOpenBlob(e, t);
    }
;
    d.abort = function() {
    }
;
    d.readyState = d.INIT = 0;
    d.WRITING = 1;
    d.DONE = 2;
    d.error = d.onwritestart = d.onprogress = d.onwrite = d.onabort = d.onerror = d.onwriteend = null;
    return function(e, t, o) {
      return new p(e, t|| e.name|| "download", o);
    }
;
  }
}
("undefined" != typeof self&& self|| "undefined" != typeof window&& window|| (void 0).content);
"undefined" != typeof t&& o? o.saveAs = o.saveAs: "undefined" != typeof define&& null !== define&& null !== define.amd&& define("FileSaver.js", function() {
  return o.saveAs;
}
);
cc._RF.pop();
