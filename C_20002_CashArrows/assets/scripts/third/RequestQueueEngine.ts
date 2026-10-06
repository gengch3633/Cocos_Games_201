// @ts-nocheck

var n = function() {
function e(e) {
var t = this;
this.hooks = e;
this.postQueue = [];
this.inRequesting = !1;
this.requestQueueHead = function() {
if (t.postQueue && t.postQueue.length) if (t.postQueue[0] && t.postQueue[0].url) {
var e = t.postQueue[0], i = e.url, n = e.reqData, a = e.handler;
t.post(i, n, a);
} else {
t.postQueue.shift();
t.requestQueueHead();
} else t.inRequesting = !1;
};
}
e.prototype.queuePost = function(e, t, i) {
if (!i || this.hooks.shouldEnqueue(i)) {
this.postQueue.push({
url: e,
reqData: t,
handler: i
});
if (!this.inRequesting) {
this.inRequesting = !0;
this.post(e, t, i);
}
} else this.post(e, t, i);
};
e.prototype.queuePostCallback = function(e, t, i, n) {
if (this.postQueue[0]) {
var a = this.postQueue[0], o = a.url, r = a.handler;
this.hooks.onQueueCallback && this.hooks.onQueueCallback({
requestTime: e,
responseCode: t,
success: i,
res: n,
url: o,
handler: r
});
if (!i && r && this.hooks.shouldRetry(r)) {
this.postQueue[0].url = this.hooks.refreshUrlOnRetry(r);
this.hooks.onRetry(n, this.requestQueueHead);
} else {
this.hooks.dispatchResult(r, i, n);
this.postQueue.shift();
this.requestQueueHead();
}
}
};
e.prototype.post = function(e, t, i) {
var n = this, a = 9999, o = Date.now(), r = new XMLHttpRequest(), s = this.hooks.buildRequestBody(t), l = function(e, t) {
i && n.hooks.shouldEnqueue(i) ? n.queuePostCallback(o, a, e, t) : n.hooks.dispatchResult(i, e, t);
};
r.onreadystatechange = function() {
if (4 === r.readyState) {
a = r.status;
if (r.status >= 200 && r.status < 400) {
var i = n.hooks.parseSuccessResponse({
url: e,
reqData: t,
responseText: r.responseText,
status: r.status
});
if (null == i ? void 0 : i.skipDispatch) return;
l(i.success, i.data);
} else l(!1, n.hooks.createStatusError({
url: e,
reqData: t,
status: r.status
}));
}
};
r.open("POST", e, !0);
r.setRequestHeader("Content-type", "text/plain");
r.send(s);
this.hooks.onRequestStart && this.hooks.onRequestStart({
url: e,
reqData: t,
requestBody: s
});
r.addEventListener("abort", function() {
l(!1, n.hooks.createRuntimeError({
url: e,
reqData: t,
status: r.status,
statusText: r.statusText,
reason: "abort"
}));
});
r.addEventListener("error", function() {
l(!1, n.hooks.createRuntimeError({
url: e,
reqData: t,
status: r.status,
statusText: r.statusText,
reason: "error"
}));
});
r.addEventListener("timeout", function() {
l(!1, n.hooks.createRuntimeError({
url: e,
reqData: t,
status: r.status,
statusText: r.statusText,
reason: "timeout"
}));
});
};
return e;
}();
export default  n;
