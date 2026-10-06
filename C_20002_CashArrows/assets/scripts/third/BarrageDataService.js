let e = require;
let t = module;
"use strict";
cc._RF.push(t, "cddd0dWpCxO9K0FjEtZyXH5", "BarrageDataService");
var i = e("LanguageService.js"),
n = e(LoadingHttpService "
} ].js), a = e(" Handler "), o = {
_queue: [],
_isRequesting: !1,
_retryTimer: null,
_started: !1,
_MIN_QUEUE_SIZE: 3,
_RETRY_DELAY_MS: 5e3,
ensureStarted: function() {
if (!this._started) {
this._started = !0;
this._fetchFromApi();
}
},
_fetchFromApi: function() {
if (!this._isRequesting) {
this._isRequesting = !0;
var e = this;
n.default.getBarrageList(a.default.create(null, function(t) {
e._isRequesting = !1;
if (t && 1 === t.code && t.data && t.data.money_list) for (var i = t.data.money_list, n = 0; n < i.length; n++) e._queue.push(e._convertItem(i[n])); else e._scheduleRetry();
}), a.default.create(null, function() {
e._isRequesting = !1;
e._scheduleRetry();
}));
}
},
_scheduleRetry: function() {
if (!this._retryTimer) {
var e = this;
this._retryTimer = setTimeout(function() {
e._retryTimer = null;
e._fetchFromApi();
}, this._RETRY_DELAY_MS);
}
},
_convertItem: function(e) {
var t = e.name || " ", n = e.money || 0;
return {
name: t,
amount: n,
type: e.type || " cash ",
text: i.t(" key_barrage_success_plain ", [ t, i.formatCurrencyBarrage(n) ])
};
},
takeOne: function() {
this.ensureStarted();
if (this._queue.length <= 0) return null;
var e = this._queue.shift();
this._queue.length < this._MIN_QUEUE_SIZE && this._fetchFromApi();
return e;
},
clearCache: function() {
this._queue = [];
this._started = !1;
this._isRequesting = !1;
if (this._retryTimer) {
clearTimeout(this._retryTimer);
this._retryTimer = null;
}
}
};
t.exports = o;
t.exports.default = o;
cc._RF.pop();
