let require = require;
let module = module;
let exports = exports;
"use strict";
cc._RF.push(module, "ddec2RrBQBGdp+fNd+63U0+", "util");
var utils = {
  isInteger: function(e) {
    return "number" == typeof e&& e% 1 == 0;
  }
,
  randomNum: function(e, t) {
    switch(arguments.length) {
      case 1: return parseInt(Math.random()* e+ 1, 10);
      case 2: return parseInt(Math.random()*(t- e+ 1)+ e, 10);
      default: return 0;
    }
  }
,
  randomSameNum: function(e, t) {
    for(var o = new Array(), n = 0;
    n < e;
    n++) o.push(n);
    var i = new Array();
    for(n = 0;
    n < t;
    n++) {
      var a = utils.randomNum(0, o.length- 1),
      r = o.splice(a, 1);
      i.push(r);
    }
    return i;
  }
,
  randomSameNum2: function(e, t, o) {
    for(var n = new Array(), i = e;
    i < t;
    i++) n.push(i);
    var a = new Array();
    for(i = 0;
    i < o;
    i++) {
      var r = utils.randomNum(0, n.length- 1),
      l = n.splice(r, 1);
      a.push(l);
    }
    return a;
  }
,
  randomSameNumExclude: function(e, t, o, n) {
    for(var i = new Array(), a = e;
    a < t;
    a++) a.toString() != n&& i.push(a);
    var r = new Array();
    for(a = 0;
    a < o;
    a++) {
      var l = utils.randomNum(0, i.length- 1),
      s = i.splice(l, 1);
      r.push(s);
    }
    return r;
  }
,
  replace_spec: function(e) {
    for(var t = new RegExp("[`~%!@#^''?！@#￥……&——‘”“？*()（），。、]"), o = "", n = 0;
    n < e.length;
    n++) o+= e.substr(n, 1).replace(t, "");
    return o;
  }
,
  array_contains: function(e, t) {
    for(var o in e) if(e[o] == t) return ! 0;
    return ! 1;
  }
,
  strClamp: function(e, t, o) {
    if(e.length <= 2* t) return e;
    o = null == o? "...": o;
    t*= 2;
    for(var n = function(e) {
      for(var t = [], o = 0, n = 0, i = 0;
      i < e.length;
) {
        var a = i;
        if(65039 != (o = e.charCodeAt(i++))) if(n) {
          var r = 65536+(n- 55296 << 10)+(o- 56320);
          t.push({
            v: r, pos: a
          }
);
          n = 0;
        } else 55296 <= o&& o <= 56319? n = o: t.push({
          v: o, pos: a
        }
);
      }
      return t;
    }
(e), i = 0, a = 0, r = 0;
    r < n.length;
++ r) {
      var l = 1;
      n[r].v >= 128&& (l = 2);
      if(i+ l > t) break;
      a = r;
      i+= l;
    }
    if(n.length- 1 == a) return e;
    var s = o? 1: 0;
    return e.substring(0, n[a- s].pos+ 1)+ o;
  }
,
  formatDateTime: function(e) {
    var t = e.getFullYear(),
    o = e.getMonth()+ 1;
    o = o < 10? "0"+ o: o;
    var n = e.getDate();
    n = n < 10? "0"+ n: n;
    var i = e.getHours();
    i = i < 10? "0"+ i: i;
    var a = e.getMinutes();
    a = a < 10? "0"+ a: a;
    var r = e.getSeconds();
    return t+ "-"+ o+ "-"+ n+ " "+ i+ ":"+ a+ ":"+(r < 10? "0"+ r: r);
  }
,
  rotDir: function(e, t) {
    var o = e.x* Math.cos(t)- Math.pow(e.y, Math.sin(t)),
    n = e.x* Math.sin(t)+ Math.pow(e.y, Math.cos(t));
    return cc.v2(o, n);
  }
,
  ArrayBufferToString2: function(e) {
    var t = new Uint8Array(e);
    return String.fromCharCode.apply(null, t);
  }
,
  Uint8ArrayToString: function(e) {
    for(var t = "", o = 0;
    o < e.length;
    o++) t+= String.fromCharCode(e[o]);
    return t;
  }
,
  stringToByteArray: function(e) {
    var t,
    o,
    n = new(void 0 !== window.Uint8Array? Uint8Array: Array)(e.length);
    for(t = 0, o = e.length;
    t < o;
++ t) n[t] = 255& e.charCodeAt(t);
    return n;
  }
,
  formatJSON: function(json, indent, leftBracesInSameLine) {
    function getIndentStr(e) {
      for(var t = "", o = 0;
      o < e;
      o++) t+= indent|| "  ";
      return t;
    }
    function format(e, t) {
      t = null == t? 0: t;
      var o = "";
      if("object" == typeof e&& null != e) {
        var n = e instanceof Array,
        i = 0;
        o+= (n? "[": "{")+ "\n";
        for(var a in e) {
          o+= i++ > 0? ",\n": "";
          var r = "object" == typeof e[a]&& null != e[a],
          l = getIndentStr(t+ 1);
          o+= n&& r? "": l;
          o+= n? "": '"'+ a+ '": '+(r&& ! leftBracesInSameLine? "\n": "");
          o+= ! r|| r&& leftBracesInSameLine&& ! n? "": l;
          o+= format(e[a], t+ 1);
        }
        o+= "\n"+ getIndentStr(t)+(n? "]": "}");
      } else {
        var s = "string" == typeof e? '"': "";
        o+= s+ e+ s+ "";
      }
      return o;
    }
    return format(eval("("+ json+ ")"));
  }
,
  save: function(e, t) {
    var o = e;
    document.getElementById("SaveChrome").download = t+ ".txt";
    var n = document.getElementById("SaveChrome");
    n.href = "data:text/csv;charset=utf-8,"+ o;
    n.click();
  }
,
  save2: function(e, t, o) {
    void 0 === t&& (t = "sprite");
    void 0 === o&& (o = "json");
    var n = JSON.stringify(e),
    i = utils.formatJSON(n),
    a = {
      txt: "text/plain",
      png: "image/png",
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      json: "text/plain"
    }
;
    if(a[o]) {
      var r = t+ "."+ o,
      l = new Blob([i], {
        type: a[o]
      }
);
      if(window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(l, r);
      else {
        var s = document.createElement("a"),
        c = URL.createObjectURL(l);
        s.href = c;
        s.download = r;
        document.body.appendChild(s);
        s.click();
        setTimeout(function() {
          document.body.removeChild(s);
          window.URL.revokeObjectURL(c);
        }
, 0);
      }
      console.log("File has been saved:", r);
    } else console.log("File not saved. Suffix not exist:", o);
  }
,
  clone: function(e) {
    var t;
    if("object" == typeof e) {
      if(null === e) t = null;
      else if(e instanceof Array) {
        t = [];
        for(var o = 0, n = e.length;
        o < n;
        o++) t.push(utils.clone(e[o]));
      } else {
        t = {
        }
;
        for(var i in e) t[i] = utils.clone(e[i]);
      }
    } else t = e;
    return t;
  }
}
;
module.exports = utils;
cc._RF.pop();
