// @ts-nocheck
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import ClientDataStore from "./ClientDataStore";
import MiddleHelper from "./MiddleHelper";
import MiddleNetwork from "./MiddleNetwork";

var n = MiddleNetwork, a = ClientDataStore, o = MiddleHelper, r = MIDDLE_PROJECT_ADAPTER_CONFIG.storageKeys, s = function() {
function e() {
this.applogQueue = [];
this.adsdkQueue = [];
this.coreDataQueue = [];
this.applogUploading = [];
this.adsdkUploading = [];
this.coreDataUploading = [];
this.isUploadingApplog = !1;
this.isUploadingAdSdk = !1;
this.isUploadingCoreData = !1;
this.applogQueue = this.readArray(r.applogPayload);
this.applogUploading = this.readArray(r.applogLoading);
this.adsdkQueue = this.readArray(r.adsdkPayload);
this.adsdkUploading = this.readArray(r.adsdkLoading);
this.coreDataQueue = this.readArray(r.coredataPayload);
this.coreDataUploading = this.readArray(r.coredataLoading);
}
e.getInstance = function() {
e.instance || (e.instance = new e());
return e.instance;
};
e.prototype.trackAll = function() {
if (a.default.isInit) {
this.flushApplog(1);
this.flushAdsdk(1);
this.flushCoredata(1);
}
};
e.prototype.reportData = function(e, t, i) {
void 0 === i && (i = !1);
var n = __assign({}, t || {}), a = n.redirect_type;
null != a && "" !== a && (a = Number(a));
if (i) {
a = 1;
n.redirect_type = 1;
}
this.track(e, n, a);
};
e.prototype.track = function(e, t, i) {
var n = __assign({}, t || {}), a = Date.now();
n.event_name = e;
n.ts = a;
n.timestamp = a;
n.system_time = a;
n.event_id = this.uuid();
n.report_id = this.uuid();
if (0 !== i && 2 !== i) if (1 !== i) {
this.enqueue("applog", n);
this.flushApplog();
} else {
this.enqueue("coredata", n);
this.flushCoredata();
} else {
this.enqueue("adsdk", n);
this.flushAdsdk();
}
};
e.prototype.stringifySafe = function(e) {
try {
return JSON.stringify(e);
} catch (t) {
return String(e);
}
};
e.prototype.eventNamePreview = function(e) {
return Array.isArray(e) ? e.slice(0, 5).map(function(e) {
return String((null == e ? void 0 : e.event_name) || "unknown");
}) : [];
};
e.prototype.logTrackRequest = function(e, t, i, n) {
var a = {
type: e,
stage: t,
size: Array.isArray(i) ? i.length : 0,
queueSize: "applog" === e ? this.applogQueue.length : "adsdk" === e ? this.adsdkQueue.length : this.coreDataQueue.length,
eventPreview: this.eventNamePreview(i),
extra: void 0 === n ? "" : this.stringifySafe(n)
}, o = "REQ" === t ? this.stringifySafe(i) : "", r = "[MiddleTrackManager] track request type=" + e + " stage=" + t + " size=" + a.size + " queueSize=" + a.queueSize + " detail=" + this.stringifySafe(a) + (o ? " payload=" + o : "");
"FAIL" !== t ? console.log(r) : console.warn(r);
};
e.prototype.enqueue = function(e, t) {
t.target_p = e;
if ("applog" === e) {
this.applogQueue.push(t);
this.writeArray(r.applogPayload, this.applogQueue);
} else if ("adsdk" === e) {
this.adsdkQueue.push(t);
this.writeArray(r.adsdkPayload, this.adsdkQueue);
} else {
this.coreDataQueue.push(t);
this.writeArray(r.coredataPayload, this.coreDataQueue);
}
};
e.prototype.flushApplog = function(e) {
var t = this;
void 0 === e && (e = 4);
if (a.default.isInit && o.default.isFinishRegional && !this.isUploadingApplog) {
if (0 === this.applogUploading.length) {
if (this.applogQueue.length < e) return;
this.applogUploading = this.applogQueue.splice(0, this.applogQueue.length);
this.writeArray(r.applogPayload, this.applogQueue);
this.writeArray(r.applogLoading, this.applogUploading);
}
this.isUploadingApplog = !0;
var i = {
payload: this.applogUploading
};
this.logTrackRequest("applog", "REQ", this.applogUploading);
n.default.trackAppLog(i, function(i) {
t.logTrackRequest("applog", "SUCCESS", t.applogUploading, i);
t.applogUploading = [];
t.writeArray(r.applogLoading, t.applogUploading);
t.isUploadingApplog = !1;
t.flushApplog(e);
}, function(e) {
var i;
t.logTrackRequest("applog", "FAIL", t.applogUploading, e);
(i = t.applogQueue).push.apply(i, t.applogUploading);
t.applogUploading = [];
t.writeArray(r.applogPayload, t.applogQueue);
t.writeArray(r.applogLoading, t.applogUploading);
t.isUploadingApplog = !1;
});
}
};
e.prototype.flushAdsdk = function(e) {
var t = this;
void 0 === e && (e = 1);
if (a.default.isInit && o.default.isFinishRegional && !this.isUploadingAdSdk) {
if (0 === this.adsdkUploading.length) {
if (this.adsdkQueue.length < e) return;
this.adsdkUploading = this.adsdkQueue.splice(0, this.adsdkQueue.length);
this.writeArray(r.adsdkPayload, this.adsdkQueue);
this.writeArray(r.adsdkLoading, this.adsdkUploading);
}
this.isUploadingAdSdk = !0;
var i = {
payload: this.adsdkUploading
};
this.logTrackRequest("adsdk", "REQ", this.adsdkUploading);
n.default.trackAdSdk(i, function(i) {
t.logTrackRequest("adsdk", "SUCCESS", t.adsdkUploading, i);
t.adsdkUploading = [];
t.writeArray(r.adsdkLoading, t.adsdkUploading);
t.isUploadingAdSdk = !1;
t.flushAdsdk(e);
}, function(e) {
var i;
t.logTrackRequest("adsdk", "FAIL", t.adsdkUploading, e);
(i = t.adsdkQueue).push.apply(i, t.adsdkUploading);
t.adsdkUploading = [];
t.writeArray(r.adsdkPayload, t.adsdkQueue);
t.writeArray(r.adsdkLoading, t.adsdkUploading);
t.isUploadingAdSdk = !1;
});
}
};
e.prototype.flushCoredata = function(e) {
var t = this;
void 0 === e && (e = 4);
if (a.default.isInit && o.default.isFinishRegional && !this.isUploadingCoreData) {
if (0 === this.coreDataUploading.length) {
if (this.coreDataQueue.length < e) return;
this.coreDataUploading = this.coreDataQueue.splice(0, this.coreDataQueue.length);
this.writeArray(r.coredataPayload, this.coreDataQueue);
this.writeArray(r.coredataLoading, this.coreDataUploading);
}
this.isUploadingCoreData = !0;
var i = {
payload: this.coreDataUploading
};
this.logTrackRequest("coredata", "REQ", this.coreDataUploading);
n.default.trackCoreData(i, function(i) {
t.logTrackRequest("coredata", "SUCCESS", t.coreDataUploading, i);
t.coreDataUploading = [];
t.writeArray(r.coredataLoading, t.coreDataUploading);
t.isUploadingCoreData = !1;
t.flushCoredata(e);
}, function(e) {
var i;
t.logTrackRequest("coredata", "FAIL", t.coreDataUploading, e);
(i = t.coreDataQueue).push.apply(i, t.coreDataUploading);
t.coreDataUploading = [];
t.writeArray(r.coredataPayload, t.coreDataQueue);
t.writeArray(r.coredataLoading, t.coreDataUploading);
t.isUploadingCoreData = !1;
});
}
};
e.prototype.readArray = function(e) {
try {
var t = cc.sys.localStorage.getItem(e);
if (!t) return [];
var i = JSON.parse(t);
return Array.isArray(i) ? i : [];
} catch (e) {
return [];
}
};
e.prototype.writeArray = function(e, t) {
try {
if (!t || 0 === t.length) {
cc.sys.localStorage.removeItem(e);
return;
}
cc.sys.localStorage.setItem(e, JSON.stringify(t));
} catch (e) {}
};
e.prototype.uuid = function() {
return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
var t = 16 * Math.random() | 0;
return ("x" == e ? t : 3 & t | 8).toString(16);
});
};
e.instance = null;
return e;
}();
export default  s;