let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "cebdblsru9Mm4UAbTaY1yDi", "TimeUtils");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
  }
  e.getTimestamp = function() {
    return new Date().getTime();
  }
;
  e.getDateString = function() {
    var e = new Date(),
    t = e.getHours(),
    o = e.getMinutes();
    return(t < 10? "0"+ t: t)+ ":"+(o < 10? "0"+ o: o);
  }
;
  e.secondsToHMS = function(e, t) {
    void 0 === t&& (t = ! 0);
    if(e < 60&& t) return "00:00:"+((n = e) < 10? "0"+ n: n);
    if(e < 60&& ! t) return "00:"+((n = e) < 10? "0"+ n: n);
    if(! t&& e < 3600) return((o = Math.floor(e/ 60)) < 10? "0"+ o: o)+ ":"+((n = e% 60) < 10? "0"+ n: n);
    if(e < 3600) return "00:"+((o = Math.floor(e/ 60)) < 10? "0"+ o: o)+ ":"+((n = e% 60) < 10? "0"+ n: n);
    var o,
    n,
    i = Math.floor(e/ 3600);
    return(i < 10? "0"+ i: i)+ ":"+((o = Math.floor(e% 3600/ 60)) < 10? "0"+ o: o)+ ":"+((n = e% 60) < 10? "0"+ n: n);
  }
;
  e.getUTCTime = function() {
    var e = new Date(),
    t = new Date(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds()).getTime();
    return Math.floor(t/ 1e3);
  }
;
  e.getTimeinSeconds = function() {
    return Math.floor(+ new Date()/ 1e3);
  }
;
  e.getTargetTimestamp = function(e, t, o) {
    void 0 === e&& (e = 0);
    void 0 === t&& (t = 0);
    void 0 === o&& (o = 0);
    var n = new Date(new Date().toLocaleDateString()).getTime();
    return new Date(n+ 1e3*(3600* e+ 60* t+ o)).getTime();
  }
;
  e.msToHMS = function(e, t, o) {
    void 0 === t&& (t = ":");
    void 0 === o&& (o = ! 0);
    var n = Math.floor(e/ 36e5),
    i = Math.floor((e- 36e5* n)/ 6e4),
    a = Math.floor((e- 36e5* n- 6e4* i)/ 1e3);
    return(0 !== n|| o? n.toString().padStart(2, "0")+ ":": "")+ i.toString().padStart(2, "0")+ t+ a.toString().padStart(2, "0");
  }
;
  e.getTimeInMilliseconds = function() {
    return+ new Date();
  }
;
  e.getDate = function() {
    return new Date().toLocaleDateString();
  }
;
  e.formatSeconds = function(e) {
    var t = Math.floor(e),
    o = 0,
    n = 0,
    i = 0;
    if(t > 60) {
      o = Math.floor(t/ 60);
      t = Math.floor(t% 60);
      if(o > 60) {
        n = Math.floor(o/ 60);
        o = Math.floor(o% 60);
        if(n > 24) {
          i = Math.floor(n/ 24);
          n = Math.floor(n% 24);
        }
      }
    }
    var a = "";
    t > 0&& (a = " "+ Math.floor(t)+ " "+ i18n.t("task_daily_word_10"));
    o > 0&& (a = " "+ Math.floor(o)+ " "+ i18n.t("task_daily_word_9")+ a);
    n > 0&& (a = " "+ Math.floor(n)+ " "+ i18n.t("task_daily_word_8")+ a);
    i > 0&& (a = " "+ Math.floor(i)+ " "+ i18n.t("day_name")+ a);
    return a;
  }
;
  return e;
}
();
o.default = n;
cc._RF.pop();
