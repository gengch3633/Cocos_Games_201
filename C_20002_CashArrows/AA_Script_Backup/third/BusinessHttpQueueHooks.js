let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "b8c7dmAjZ1IHYdHcvnEj+3C", "BusinessHttpQueueHooks");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
i.createBusinessHttpQueueHooks = void 0;
i.createBusinessHttpQueueHooks = function(e, t) {
  void 0 === t&& (t = {
  }
);
  return {
    shouldEnqueue: function(e) {
      return e.enterQueue();
    }
,
    shouldRetry: function(e) {
      return e.needRetry();
    }
,
    refreshUrlOnRetry: function(e) {
      return t.refreshUrlOnRetry? t.refreshUrlOnRetry(e): "";
    }
,
    onRetry: function(i, a) {
      e("【YW Network Retry】res:", n(i));
      t.onRetry? t.onRetry(i, a): a();
    }
,
    onQueueCallback: function(e) {
      var i = e.requestTime,
      n = e.responseCode,
      a = e.url;
      if(t.shouldReportHttpMonitor&& t.shouldReportHttpMonitor()) {
        var o = Date.now()- i;
        t.reportHttpMonitor&& t.reportHttpMonitor({
          request_path: a, response_code: n, response_time: o
        }
);
      }
    }
,
    parseSuccessResponse: function(i) {
      var n = i.url,
      a = i.reqData,
      o = i.responseText;
      if(! o) {
        e("【YW Network Err】url1:", n);
        e("【YW Network Err】body:", a.toText());
        e("【YW Network Err】err:", "response 为空");
        return {
          success: ! 1,
          data: {
            code:- 1,
            message: "返回数据不存在"
          }
        }
;
      }
      var r = t.decryptResponse? t.decryptResponse(o): o;
      r|| (r = o);
      var s = JSON.parse(r);
      e("【YW Network Suc】url:", n);
      e("【YW Network Suc】body:", a.toText());
      e("【YW Network Suc】response:", JSON.stringify(o));
      e("【YW Network Suc】respon:", JSON.stringify(r));
      e("【YW Network Suc】res:", JSON.stringify(s));
      if(t.getServerReleaseUrl&& n.includes(t.getServerReleaseUrl())) {
        var l = s.code;
        return- 1 == l|| - 1e3 == l? {
          success: ! 1,
          data: s
        }
: {
          success: ! 0,
          data: s
        }
;
      }
      return {
        success: ! 0,
        data: s
      }
;
    }
,
    buildRequestBody: function(e) {
      return e.toText();
    }
,
    onRequestStart: function(t) {
      var i = t.url,
      n = t.reqData;
      e("【YW Network Start】url:", i);
      e("【YW Network Start】body:", n.toText());
    }
,
    createStatusError: function(e) {
      var t = e.status;
      return {
        code:- 1,
        message: "xhr.status"+ t,
        http_status: t
      }
;
    }
,
    createRuntimeError: function(e) {
      var t = e.status;
      return {
        code:- 1,
        message: "onXhr."+ e.reason,
        http_status: t
      }
;
    }
,
    dispatchResult: function(e, t, i) {
      e&& (t? e.success(i): e.fail(i));
    }
  }
;
}
;
function n(e) {
  try {
    return JSON.stringify(e);
  } catch(t) {
    return String(e);
  }
}
cc._RF.pop();
