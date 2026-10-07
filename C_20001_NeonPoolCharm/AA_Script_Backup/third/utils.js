let require = require;
let module = module;
let exports = exports;
"use strict";
cc._RF.push(module, "ceb0beCr5pLlYNE3lvm+KnI", "utils");
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
  array_contains: function(e, t) {
    for(var o in e) if(e[o] == t) return ! 0;
    return ! 1;
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
}
;
module.exports = utils;
cc._RF.pop();
