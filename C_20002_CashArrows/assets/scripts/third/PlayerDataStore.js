let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "19b95i+vBxPRYWbffoAK6cr", "PlayerDataStore");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e(ClientDataStore "
} ].js), a = new (function() {
function e() {
this.user_id = " ";
this.user_name = " ";
this.yid = " yid_read_failed ";
this.fund_balance = 0;
this.cash_balance = 0;
this.bubble_balance = 0;
this.user_level = 0;
this.task_point_num = 0;
this.ltv_task_point_num = 0;
this.circle_count = 0;
this.sign_in = 0;
this.hint_prop_count = 0;
this.guideline_prop_count = 0;
this.levels_passed_count = 0;
this.guideline_eliminate_num = 0;
this.current_arrow_level_id = " 0 ";
this.arrow_level = {
arrow_level_id: 0,
level_index: 0,
time_limit: 0,
arrow_count: 0,
big_reward_trigger: 0,
tail_clearance: 5,
show_countdown: !1,
eliminate_reward: 0,
life_count: 3
};
this.is_tourists = !1;
this.create_time = " ";
this.ab_info = {};
this.tx_bind_info = [];
this.conf = {
parameter_conf: {},
cash_extract_conf: {}
};
this._rawData = {};
}
e.prototype.initUserId = function(e) {
var t = e.user_id, i = e.user_name, a = e.yid;
this.user_id = t || " ";
this.user_name = i || " ";
this.yid = a || " yid_read_failed ";
n.default.yid = a;
n.default.user_id = t || " ";
try {
cc.sys.localStorage.setItem(" yid ", a);
} catch (e) {}
};
e.prototype.init = function(e) {
if (e) {
var t = e.user_info && " object " == typeof e.user_info ? Object.assign({}, e, e.user_info) : e;
this._rawData = t || {};
this.cash_balance = Number(t.cash_balance || 0);
this.fund_balance = Number(t.fund_balance || 0);
this.bubble_balance = Number(t.bubble_balance || 0);
this.user_level = Number(t.user_level || 0);
this.task_point_num = Number(t.task_point_num || 0);
this.ltv_task_point_num = Number(t.ltv_task_point_num || 0);
this.circle_count = Number(t.circle_count || 0);
this.sign_in = Number(t.sign_in || 0);
this.hint_prop_count = Number(t.hint_prop_count || 0);
this.guideline_prop_count = Number(t.guideline_prop_count || 0);
this.levels_passed_count = Number(t.levels_passed_count || 0);
this.guideline_eliminate_num = Number(t.guideline_eliminate_num || 0);
this.current_arrow_level_id = String(t.current_arrow_level_id || " 0 ");
this.is_tourists = !!t.is_tourists;
this.create_time = String(t.create_time || " ");
this.ab_info = t.ab_info || {};
this.tx_bind_info = Array.isArray(t.tx_bind_info) ? t.tx_bind_info : [];
this.conf = t.conf || {
parameter_conf: {},
cash_extract_conf: {}
};
}
};
e.prototype.updateArrowLevel = function(e) {
if (e) {
var t = Number((null != e.level_index ? e.level_index : e.arrow_level_index) || 0);
this.arrow_level = {
arrow_level_id: Number(e.arrow_level_id || 0),
level_index: t,
time_limit: Number(e.time_limit || 0),
arrow_count: Number(e.arrow_count || 0),
big_reward_trigger: Number(e.big_reward_trigger || 0),
tail_clearance: Number(null != e.tail_clearance ? e.tail_clearance : 5),
show_countdown: !!e.show_countdown,
eliminate_reward: Number(e.eliminate_reward || 0),
life_count: Number(e.life_count || 3)
};
this.current_arrow_level_id = String(this.arrow_level.arrow_level_id || " 0 ");
try {
console.log("[ArrowLevel] PlayerDataStore.updateArrowLevel: " + JSON.stringify(this.arrow_level));
} catch (e) {}
}
};
e.prototype.get = function(e, t) {
void 0 === t && (t = null);
if (!e) return t;
for (var i = String(e).split("."), n = this._rawData, a = 0; a < i.length; a++) {
if (null == n) return t;
var o = i[a];
if (!Object.prototype.hasOwnProperty.call(n, o)) return t;
n = n[o];
}
return null == n ? t : n;
};
e.prototype.getUserInfoForBiz = function() {
return {
cash_balance: this.cash_balance,
fund_balance: this.fund_balance,
bubble_balance: this.bubble_balance,
user_level: this.user_level,
task_point_num: this.task_point_num,
ltv_task_point_num: this.ltv_task_point_num,
circle_count: this.circle_count,
sign_in: this.sign_in,
hint_prop_count: this.hint_prop_count,
guideline_prop_count: this.guideline_prop_count,
levels_passed_count: this.levels_passed_count,
guideline_eliminate_num: this.guideline_eliminate_num,
current_arrow_level_id: this.current_arrow_level_id,
is_tourists: this.is_tourists,
create_time: this.create_time,
tx_bind_info: this.tx_bind_info,
ab_info: this.ab_info,
conf: this.conf
};
};
e.prototype.getCashExtractConf = function() {
return this.get(" conf.cash_extract_conf ", {});
};
e.prototype.getParameterConf = function() {
return this.get(" conf.parameter_conf ", {});
};
return e;
}())();
i.default = a;
cc._RF.pop();
