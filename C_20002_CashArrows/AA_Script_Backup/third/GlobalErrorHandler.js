let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "d95e1EivpJF8L7p5j1E4pQL", "GlobalErrorHandler");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
i.globalErrorRegister = void 0;
var n = e("BusinessCommonConfig.js"),
a = e("ClientDataStore.js"),
o = e("PlayerDataStore.js"),
r = e("SystemDataStore.js"),
s = e(HotUpdateManager "
} ].js), l = {};
function c(e) {
return !(e = null == e ? void 0 : e.replace(/\([^)]*\)/g, " ")) || e.length < 200 ? e || " " : e.slice(0, 199);
}
function u(e, t) {
void 0 === t && (t = " 异常上报 ");
try {
var i = cc.loader.getXMLHttpRequest();
i.onreadystatechange = function() {};
i.open(" POST ", n.BUSINESS_COMMON_CONFIG.feishuWebhookUrl, !0);
i.setRequestHeader(" Content- Type ", " application/ json;
charset = utf- 8 ");
var l = {
game: r.default.gameName,
hot_version: s.default.getInstance().getVersion(),
apk_verions: a.default.version_name,
channel: a.default.channel_name,
uid: o.default.user_id,
yid: o.default.yid
};
i.send(JSON.stringify({
msg_type: " post ",
content: {
post: {
zh_ch: {
title: t,
content: [ [ {
tag: " text ",
text: JSON.stringify(l, null, " \ t ")
}, {
tag: " text ",
text: JSON.stringify(e, null, " \ t ")
} ] ]
}
}
}
}));
} catch (e) {}
}
i.globalErrorRegister = function(e) {
if (!cc.sys.isBrowser && e) {
cc.sys.isNative && (window.__errorHandler = function(e, t, i, n) {
var a = {
file: e,
line: t,
message: i,
error_stack: n
}, o = c(a.error_stack);
if (!l[o]) {
l[o] = 1;
u(a);
}
});
window.addEventListener(" unhandledrejection ", function(e) {
var t = e.reason, i = c(t);
if (!l[i]) {
l[i] = 1;
u({
type: " unhandledrejection ",
reason: t
});
e.preventDefault();
}
});
}
};
cc._RF.pop();
