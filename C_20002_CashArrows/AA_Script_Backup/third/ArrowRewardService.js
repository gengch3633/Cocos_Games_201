let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "2d047G9r3JOhY/2qURSMPvh", "ArrowRewardService");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("LoadingHttpService.js"),
a = e("Handler.js"),
o = e("GlobalEventMgr"),
r = e(InterfaceMgr "
} ].js), s = e(" AdManager.js "), l = e(" PlayerDataStore.js "), c = e(" NetErrorPopupService.js "), u = "[ArrowReward] ";
function d() {
return c.default || c;
}
function h(e) {
return " ltv " === String(e || " ").toLowerCase() ? " ltv " : " ";
}
function p(e) {
var t, i = {
business_type: (t = e && e.businessType, " task " === String(t || " ").toLowerCase() ? " task " : " arrow ")
}, n = h(e && e.taskType), a = String(e && (e.taskId || " ") || " ");
if (" task " === i.business_type) {
" ltv " === n && (i.task_type = " ltv ");
a && (i.task_id = a);
}
return i;
}
function _(e) {
if (null == e) return null;
var t = e;
if (" string " == typeof t && !(t = t.replace(/,/g, " ").trim()).length) return null;
var i = Number(t);
return isFinite(i) ? Math.max(0, Math.floor(i)) : null;
}
function f(e, t) {
for (var i = e || {}, n = [ " cash_reward ", " reward_amount ", " ad_reward_amount ", " double_reward ", " switch_reward ", " task_reward ", " reward " ], a = 0; a < n.length; a++) {
var o = n[a], r = _(i[o]);
if (null !== r && r > 0) return {
amount: r,
source: o
};
}
var s = Number(i.cash_balance);
if (isFinite(s) && isFinite(t)) {
var l = Math.floor(s - t);
if (l >= 0) return {
amount: l,
source: " cash_balance_delta "
};
}
return {
amount: null,
source: " none "
};
}
function g(e, t) {
return e && " object " == typeof e ? {
showForceVideo: !!e.showForceVideo,
businessType: e.businessType || e.business_type || " arrow ",
taskType: e.taskType || e.task_type || " ",
taskId: e.taskId || e.task_id || " ",
callback: t || e.callback
} : {
showForceVideo: !!e,
businessType: " arrow ",
taskType: " ",
taskId: " ",
callback: t
};
}
function m(e, t) {
return " function " == typeof e ? {
businessType: " arrow ",
taskType: " ",
taskId: " ",
fallbackOnAdFail: !0,
callback: e
} : {
businessType: (e = e || {}).businessType || e.business_type || " arrow ",
taskType: e.taskType || e.task_type || " ",
taskId: e.taskId || e.task_id || " ",
fallbackOnAdFail: !1 !== e.fallbackOnAdFail,
callback: t || e.callback
};
}
function y(e, t, i) {
if (" function " == typeof e) {
i = t;
t = e;
e = !1;
}
var n = s && s.default && s.default.getInstance ? s.default.getInstance() : null;
if (n && " function " == typeof n.playNormalVideoAd) n.playNormalVideoAd({
ad_type: " reward_video ",
force_video: !!e
}, function() {
console.log(u + " _playAd: 广告播放完成 force_video = " + !!e);
t && t();
}, function(e) {
console.warn(u + " _playAd: 广告失败 err = " + JSON.stringify(e));
i && i(e);
}, " 激励视频播放失败 ， 请重试 "); else {
console.warn(u + " _playAd: 无广告SDK ， 视为广告失败 ");
i && i({
message: " ad_unavailable "
});
}
}
function v(e) {
if (e) {
var t = Number(l.default.cash_balance);
isFinite(t) || (t = NaN);
var i = f(e, t), n = i.amount;
void 0 !== e.cash_balance && (l.default.cash_balance = Number(e.cash_balance));
try {
var a = {};
void 0 !== e.cash_balance && (a.cash_balance = e.cash_balance);
void 0 !== e.bubble_balance && (a.bubble_balance = e.bubble_balance);
void 0 !== e.user_level && (a.user_level = e.user_level);
void 0 !== e.hint_prop_count && (a.hint_prop_count = e.hint_prop_count);
void 0 !== e.guideline_prop_count && (a.guideline_prop_count = e.guideline_prop_count);
void 0 !== e.task_point_num && (a.task_point_num = e.task_point_num);
void 0 !== e.ltv_task_point_num && (a.ltv_task_point_num = e.ltv_task_point_num);
void 0 !== e.sign_in && (a.sign_in = e.sign_in);
null !== n && n > 0 && (a.cash_reward = n);
o.default.getInstance().emit(r.gameEvent.userInfoUpdated, a);
null !== n && n > 0 && o.default.getInstance().emit(r.gameEvent.arrowRewardClaimed, {
reward_amount: n
});
console.log(u + " _applyRewardResult: reward_source = " + i.source + " reward_amount = " + n + " cash_balance = " + e.cash_balance + " bubble_balance = " + e.bubble_balance + " raw = " + JSON.stringify({
cash_reward: e.cash_reward,
reward_amount: e.reward_amount,
ad_reward_amount: e.ad_reward_amount,
switch_reward: e.switch_reward,
double_reward: e.double_reward
}));
} catch (e) {
console.warn(u + " _applyRewardResult: emit失败 " + e);
}
}
}
var b = {
claimNormal: function(e, t) {
var i = g(e, t), o = " function " == typeof i.callback ? i.callback : null, r = p(i);
function l() {
console.log(u + " claimNormal: 调用领取接口 ehwqDl/ CCDFGN payload = " + JSON.stringify(r));
n.default.claimArrowReward(r, a.default.create(null, function(e) {
var t = d();
if (t && t.shouldPop(e)) {
console.warn(u + " claimNormal force- retry code = " + (e && e.code));
t.showAndRetry(l);
} else if (e && e.data) {
console.log(u + " claimNormal 成功 data = " + JSON.stringify(e.data));
v(e.data);
o && o(!0, e.data);
} else {
console.warn(u + " claimNormal 返回数据异常 res = " + JSON.stringify(e));
o && o(!1, null);
}
}), a.default.create(null, function(e) {
var t = d();
if (t && t.shouldPop(e)) {
console.warn(u + " claimNormal 网络异常 ， 弹重试窗 err = " + JSON.stringify(e));
t.showAndRetry(l);
} else {
console.warn(u + " claimNormal 请求失败 err = " + JSON.stringify(e));
o && o(!1, null);
}
}));
}
function c(e) {
var t = s && s.default && s.default.getInstance ? s.default.getInstance() : null, i = t && t.cpm_data || {}, l = {
video_type: " arrow " === r.business_type ? " big_red " : " task ",
task_id: i.task_id || r.task_id || " ",
force_type: e ? " true " : " false ",
source: i.source || " ",
unitId: i.unitId || " ",
cpm: i.cpm || 0,
task_type: r.task_type,
business_type: r.business_type
};
r.task_type && (l.task_type = r.task_type);
console.log(u + " claimNormal: 广告完成 ， 调用广告奖励接口/ vNZlOY/ KWcPza params = " + JSON.stringify(l));
var h = function() {
c(e);
};
n.default.claimArrowAdReward(l, a.default.create(null, function(e) {
var t = d();
if (t && t.shouldPop(e)) {
console.warn(u + " claimNormal(AdReward) force- retry code = " + (e && e.code));
t.showAndRetry(h);
} else if (e && e.data) {
console.log(u + " claimNormal(AdReward) 成功 data = " + JSON.stringify(e.data));
v(e.data);
o && o(!0, e.data);
} else {
console.warn(u + " claimNormal(AdReward) 返回数据异常 res = " + JSON.stringify(e));
o && o(!1, null);
}
}), a.default.create(null, function(e) {
var t = d();
if (t && t.shouldPop(e)) {
console.warn(u + " claimNormal(AdReward) 网络异常 ， 弹重试窗 err = " + JSON.stringify(e));
t.showAndRetry(h);
} else {
console.warn(u + " claimNormal(AdReward) 请求失败 err = " + JSON.stringify(e));
o && o(!1, null);
}
}));
}
if (i.showForceVideo) {
console.log(u + " claimNormal: showForceVideo = true ， 先播广告 ");
y(!0, function() {
c(!0);
}, function() {
console.warn(u + " claimNormal: 广告失败 ， 降级普通领取接口 ");
l();
});
} else l();
},
claimDouble: function(e, t) {
var i = m(e, t), o = " function " == typeof i.callback ? i.callback : null, r = p(i);
console.log(u + " claimDouble: 开始播放广告 ");
y(!1, function() {
var e = s && s.default && s.default.getInstance ? s.default.getInstance() : null, t = e && e.cpm_data || {}, i = {
video_type: " arrow " === r.business_type ? " big_red " : " task ",
task_id: t.task_id || r.task_id || " ",
force_type: " false ",
source: t.source || " ",
unitId: t.unitId || " ",
cpm: t.cpm || 0,
task_type: r.task_type,
business_type: r.business_type
};
r.task_type && (i.task_type = r.task_type);
console.log(u + " claimDouble: 广告完成 ， 调用翻倍接口/ vNZlOY/ KWcPza params = " + JSON.stringify(i));
var l = function e() {
n.default.claimArrowAdReward(i, a.default.create(null, function(t) {
var i = d();
if (i && i.shouldPop(t)) i.showAndRetry(e); else if (t && t.data) {
v(t.data);
o && o(!0, t.data);
} else o && o(!1, null);
}), a.default.create(null, function(t) {
var i = d();
i && i.shouldPop(t) ? i.showAndRetry(e) : o && o(!1, null);
}));
};
n.default.claimArrowAdReward(i, a.default.create(null, function(e) {
var t = d();
if (t && t.shouldPop(e)) {
console.warn(u + " claimDouble force- retry code = " + (e && e.code));
t.showAndRetry(l);
} else if (e && e.data) {
console.log(u + " claimDouble 成功 data = " + JSON.stringify(e.data));
v(e.data);
o && o(!0, e.data);
} else {
console.warn(u + " claimDouble 返回数据异常 res = " + JSON.stringify(e));
o && o(!1, null);
}
}), a.default.create(null, function(e) {
var t = d();
if (t && t.shouldPop(e)) {
console.warn(u + " claimDouble 网络异常 ， 弹重试窗 err = " + JSON.stringify(e));
t.showAndRetry(l);
} else {
console.warn(u + " claimDouble 请求失败 err = " + JSON.stringify(e));
o && o(!1, null);
}
}));
}, function() {
if (!1 !== i.fallbackOnAdFail) {
console.warn(u + " claimDouble: 广告失败 ， 降级为普通领取 ");
b.claimNormal({
showForceVideo: !1,
businessType: i.businessType,
taskType: i.taskType,
taskId: i.taskId
}, o);
} else {
console.warn(u + " claimDouble: 广告失败 ， 不降级发奖 ");
o && o(!1, null);
}
});
}
};
i.default = b;
t.exports = b;
t.exports.default = b;
cc._RF.pop();
