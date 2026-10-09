let e = require;let t = module;
    "use strict";

    cc._RF.push(t, "c9509B0ZQhKmqdFI8CzpQHc", "Net");
    var o = "http://127.0.0.1:8081/",
      n = 0,
      i = "",
      a = {
        CMD_insertLog: "ball/insertLog",
        CMD_updateInfo: "ball/updateInfo",
        CMD_getInfo: "ball/getInfo",
        CMD_addAdvice: "ball/addAdvice",
        CMD_getRanklist: "ball/getRanklist",
        CMD_getID: "ball/getID",
        CMD_initEnv: "ball/initEnv",
        CMD_updateUserInfoKV: "ball/updateUserInfoKV",
        CMD_getMovieInfo: "ball/getMovieInfo",
        CMD_getPublicTableInfo: "ball/getPublicTableInfo",
        CMD_createOnePublicTableInfo: "ball/createOnePublicTableInfo",
        CMD_updateOnePublicTableInfo: "ball/updateOnePublicTableInfo",
        CMD_removeOnePublicTableInfo: "ball/removeOnePublicTableInfo",
        CMD_createOneTableInfo: "ball/createOneTableInfo",
        CMD_saveOneTableInfo: "ball/saveOneTableInfo",
        CMD_saveTablesInfo: "ball/saveTablesInfo",
        CMD_getTablesInfo: "ball/getTablesInfo",
        set_url: function (e) {
          o = e;
        },
        get_test: function () {
          var e = cc.loader.getXMLHttpRequest();
          e.onreadystatechange = function () {
            if (4 == e.readyState && e.status >= 200 && e.status < 400) {
              var t = e.responseText;
              console.log(t);
            }
          };
          e.open("GET", o, !0);
          e.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
          e.send();
        },
        do_post: function (e, t, a, r) {
          console.log("do_post", e);
          if (0 != n) {
            var l = new Date().getTime();
            if (l - n < 1e3 && i == e) {
              console.log("lock ms too short", l - n, i == e);
              return;
            }
          }
          var s = cc.loader.getXMLHttpRequest();
          s.onreadystatechange = function () {
            if (4 == s.readyState) if (s.status >= 200 && s.status < 400) {
              console.log("recv suc", s.readyState, s.status);
              n = 0;
              a && a(!0, s.responseText, s.status);
            } else {
              console.log("recv fail", s.readyState, s.status);
              n = 0;
              a && a(!1, s.responseText, s.status);
            }
          };
          s.open(r ? "POST" : "GET", o + e, !0);
          s.setRequestHeader("Content-type", "application/json;charset=UTF-8");
          s.send(JSON.stringify(t));
          console.log("xhr.open", r ? "POST" : "GET", o + e);
          n = new Date().getTime();
          i = e;
        },
        do_get: function (e, t, o) {
          console.log("do_get", e, t);
          var n = cc.loader.getXMLHttpRequest();
          n.onreadystatechange = function () {
            if (4 == n.readyState) if (n.status >= 200 && n.status < 400) {
              console.log("do_get recv suc", n.readyState, n.status, n.responseText, typeof n.responseText);
              if (o) {
                var e = JSON.parse(n.responseText);
                o(!0, e, n.status);
              }
            } else {
              console.log("do_get recv fail", n.readyState, n.status);
              o && o(!1, n.status);
            }
          };
          n.open("GET", e, !0);
          n.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
          n.send(null);
        }
      };
    t.exports = a;
    cc._RF.pop();
