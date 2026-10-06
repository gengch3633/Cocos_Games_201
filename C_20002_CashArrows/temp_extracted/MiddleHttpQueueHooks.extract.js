MiddleHttpQueueHooks: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "796e84jgt5NSK8Q9qR+VbJh", "MiddleHttpQueueHooks");
Object.defineProperty(i, "__esModule", {
value: !0
});
i.createMiddleHttpQueueHooks = void 0;
i.createMiddleHttpQueueHooks = function(e, t, i, n) {
void 0 === n && (n = {});
return {
shouldEnqueue: function(e) {
return e.enterQueue();
},
shouldRetry: function(e) {
return e.needRetry();
},
refreshUrlOnRetry: function(e) {
return n.refreshUrlOnRetry ? n.refreshUrlOnRetry(e) : "";
},
onRetry: function(e, t) {
return n.onRetry ? n.onRetry(e, t) : t();
},
onQueueCallback: function(e) {
var a = e.requestTime, o = e.responseCode, r = e.url;
if (n.shouldReportHttpMonitor ? n.shouldReportHttpMonitor() : t() && i(1, 100) <= 5) {
var s = Date.now() - a;
n.reportHttpMonitor && n.reportHttpMonitor({
req_url: r,
response_code: o,
response_time: s
});
}
},
parseSuccessResponse: function(t) {
var i = t.url, a = t.reqData, o = t.responseText, r = t.status;
if (!o) {
e("【CC Network Err】url1:", i);
e("【CC Network Err】body:", a.toMiddleJSON());
e("【CC Network Err】decode body:", n.decrypt ? n.decrypt(a.toMiddleJSON()) : a.toMiddleJSON());
e("【CC Network Err】err:", "response 为空");
return {
success: !1,
data: {
code: -1,
message: "返回数据不存在",
http_status: r
}
};
}
e("【CC Network】url:", i);
e("【CC Network】response:", o);
var s = n.decrypt ? n.decrypt(o) : o;
if (!s) {
console.error("【CC Network Err】decrypt response error:", i);
return {
success: !1,
data: {
code: -1,
message: "decrypt response error",
http_status: r
}
};
}
var l = JSON.parse(s);
if (null !== l.data && 0 !== Object.keys(l.data).length) {
e("【CC Network Suc】url:", i);
e("【CC Network Suc】body:", a.toMiddleJSON());
e("【CC Network Suc】decode body:", n.decrypt ? n.decrypt(a.toMiddleJSON()) : a.toMiddleJSON());
e("【CC Network Suc】response:", JSON.stringify(o));
e("【CC Network Suc】respon:", JSON.stringify(s));
var c = l.data;
e("【CC Network Suc】res:", JSON.stringify(c));
return {
success: !0,
data: c
};
}
e("【CC Network Err】url0:", i);
e("【CC Network Err】body:", a.toMiddleJSON());
e("【CC Network Err】decode body:", n.decrypt ? n.decrypt(a.toMiddleJSON()) : a.toMiddleJSON());
e("【CC Network Err】err:", "data 为空 - message:" + l.message);
return {
success: !1,
data: {
code: -1,
message: "Data不存在",
http_status: r
}
};
},
buildRequestBody: function(e) {
return e.toMiddleJSON();
},
onRequestStart: function(t) {
var i = t.url, a = t.reqData;
e("【CC Network start】url:", i);
e("【CC Network start】body:", a.toMiddleJSON());
e("【CC Network start】decode body:", n.decrypt ? n.decrypt(a.toMiddleJSON()) : a.toMiddleJSON());
},
createStatusError: function(t) {
var i = t.url, a = t.reqData, o = t.status;
e("【CC Network Err】url2:", i);
e("【CC Network Err】body:", a.toMiddleJSON());
e("【CC Network Err】decode body:", n.decrypt ? n.decrypt(a.toMiddleJSON()) : a.toMiddleJSON());
e("【CC Network Err】err:", "xhr.status = " + o);
return {
code: -1,
message: "xhr.status" + o,
http_status: o
};
},
createRuntimeError: function(e) {
var t = e.url, i = e.status, n = e.statusText;
return {
code: -1,
message: "onXhr." + e.reason,
http_status: i,
statuText: n,
url: t
};
},
dispatchResult: function(e, t, i) {
e && (t ? e.success(i) : e.fail(i));
}
};
};
cc._RF.pop();
}