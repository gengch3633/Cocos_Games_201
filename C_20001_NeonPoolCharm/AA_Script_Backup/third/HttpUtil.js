let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "ac4ecCzxJRKM4Zevmxr91m4", "HttpUtil");
var n = this&& this.__decorate|| function(e, t, o, n) {
  var i,
  a = arguments.length,
  r = a < 3? t: null === n? n = Object.getOwnPropertyDescriptor(t, o): n;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);
  else for(var l = e.length- 1;
  l >= 0;
  l--)(i = e[l])&& (r = (a < 3? i(r): a > 3? i(t, o, r): i(t, o))|| r);
  return a > 3&& r&& Object.defineProperty(t, o, r),
  r;
}
;
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var i = e("SystemDataSys.js"),
a = e("frameworkManager.js"),
r = e("SdkHelper.js"),
l = e("Service.js"),
s = e("EngineUtil.js"),
c = cc._decorator.ccclass;
cc._decorator.property;
var u = function() {
  function e() {
  }
  t = e;
  e.queuePost = function(e, o, n) {
    if(! n|| n.enterQueue()) {
      t._postQueue.push({
        url: e, reqData: o, handler: n
      }
);
      if(! t._inRequesting) {
        t._inRequesting = ! 0;
        t._Post(e, o, n);
      }
    } else t._Post(e, o, n);
  }
;
  e.queuePostCallback = function(e, o, n, c) {
    var u = t._postQueue[0],
    p = u.url,
    d = u.handler;
    if(i.default.online_release&& s.default.getRandomNum(1, 100) <= 5) {
      var _ = Date.now()- e;
      r.default.reportData("http_monitor", {
        request_path: p, response_code: o, response_time: _
      }
);
    }
    if(! n&& d&& d.needRetry()) {
      t._postQueue[0].url = l.default.genRequestUrl(d.getRequestType());
      a.default.httpErr(c, function() {
        return t.requestQueueHead();
      }
);
    } else {
      n? d.success(c): d.fail(c);
      t._postQueue.shift();
      t.requestQueueHead();
    }
  }
;
  e.requestQueueHead = function() {
    t._postQueue&& t._postQueue.length? t._postQueue[0]&& t._postQueue[0].url? t._Post(t._postQueue[0].url, t._postQueue[0].reqData, t._postQueue[0].handler): t.requestQueueHead(): t._inRequesting = ! 1;
  }
;
  e._Post = function(e, o, n) {
    var a = 9999,
    l = Date.now(),
    s = new XMLHttpRequest(),
    c = function(e, o) {
      n&& n.enterQueue()? t.queuePostCallback(l, a, e, o): e? n.success(o): n.fail(o);
    }
;
    s.onreadystatechange = function() {
      if(4 == s.readyState) {
        a = s.status;
        if(s.status >= 200&& s.status < 400) {
          var t = s.responseText;
          if(t) {
            var o = JSON.parse(t),
            n = o;
            if(null == o? void 0: o.ecp) {
              n = r.default.getAesDncrypData(o.data);
              n = JSON.parse(n);
            }
            console.log("网络 ", e, JSON.stringify(o));
            if(e.includes(i.default.getServerTestUrl())|| e.includes(i.default.getServerReleaseUrl())) {
              var l = n.code;
              if(- 1 == l|| - 1e3 == l) {
                c(! 1, n);
                return;
              }
              c(! 0, n);
              return;
            }
            c(! 0, n);
          } else {
            console.log("返回数据不存在");
            c(! 1, {
              code:- 1, message: "返回数据不存在", http_status: s.status
            }
);
          }
        } else {
          console.log("请求失败");
          c(! 1, {
            code:- 1, message: "xhr.status"+ s.status, http_status: s.status
          }
);
        }
      }
    }
;
    s.open("POST", e, ! 0);
    s.setRequestHeader("Content-type", "multipart/form-data;boundary=AaB03x");
    r.default.setXhrCookie(s);
    s.send(o.arrayBuffer());
    s.addEventListener("abort", function() {
      cc.log("testlogin abort");
      c(! 1, {
        code:- 1, message: "onXhr.abort", http_status: s.status
      }
);
    }
);
    s.addEventListener("error", function() {
      cc.log("testlogin error");
      c(! 1, {
        code:- 1, message: "onXhr.error", http_status: s.status
      }
);
    }
);
    s.addEventListener("timeout", function() {
      cc.log("testlogin timeout");
      c(! 1, {
        code:- 1, message: "onXhr.timeout", http_status: s.status
      }
);
    }
);
  }
;
  e.Get = function(e, t, o) {
    void 0 === o&& (o = ! 1);
    return new Promise(function(t, n) {
      var i = new XMLHttpRequest();
      i.timeout = 3e4;
      var a = function(e, t) {
        n(e);
        r.default.reportData("ip_request_err", {
          err_type: t
        }
);
      }
;
      i.ontimeout = function() {
        cc.log("[tydf.https] get: request time out.");
        a(! 1, "ontimeout");
      }
;
      i.onreadystatechange = function() {
        if(4 === i.readyState) if(200 == i.status) {
          var e = JSON.parse(i.responseText), n = e;
          if(e&& o) {
            n = r.default.getAesDncrypData(e.data);
            n = JSON.parse(n);
          }
          n? t(n): a(! 1, "parseErr");
        } else a(! 1, "onreadystatechange");
      }
;
      i.onerror = function() {
        console.log("There was an error!");
        a(! 1, "onerror");
      }
;
      i.open("GET", encodeURI(e), ! 0);
      i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      i.send();
    }
);
  }
;
  var t;
  e._postQueue = [];
  e._inRequesting = ! 1;
  return t = n([c], e);
}
();
o.default = u;
cc._RF.pop();
