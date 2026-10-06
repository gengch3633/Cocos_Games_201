// @ts-nocheck
import Handler from "./Handler";
import PlayerDataStore from "./PlayerDataStore";
import LoadingHttpService from "./LoadingHttpService";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import Singleton from "./Singleton";
import UserData from "./UserData";

const { __extends } = cc;
const n = __extends;
var a = UserData, o = Singleton, r = GlobalEventMgr, s = InterfaceMgr, l = PlayerDataStore, c = function(t) {
function i() {
return null !== t && t.apply(this, arguments) || this;
}
n(i, t);
i.prototype.fetch = function() {
var t = this, i = Date.now ? Date.now() : new Date().getTime();
if (t._lastFetchTs && i - t._lastFetchTs < 500) console.log("[UserInfoService] fetch throttled, elapsed=" + (i - t._lastFetchTs) + "ms"); else {
t._lastFetchTs = i;
try {
var n = LoadingHttpService, a = Handler, o = n.default, r = a.default;
o.getUserInfo(r.create(null, function(e) {
e && e.data ? t._applyToUserData(e.data) : console.error("[UserInfoService] fetch failed", e);
}), r.create(null, function(e) {
console.error("[UserInfoService] fetch error", e);
}));
} catch (e) {
console.error("[UserInfoService] fetch exception", e);
}
}
};
i.prototype._applyToUserData = function(e) {
if (e) {
var t = a.default.getInstance(), i = e.conf && e.conf.cash_extract_conf || {};
void 0 !== e.cash_balance && (t.cash_balance = e.cash_balance);
void 0 !== e.bubble_balance && (t.bubble_balance = e.bubble_balance);
if (void 0 !== e.hint_prop_count) {
t.hint_prop_count = e.hint_prop_count;
t.num_tipscards = e.hint_prop_count;
}
void 0 !== e.guideline_prop_count && (t.guideline_prop_count = e.guideline_prop_count);
void 0 !== e.user_level && (t.user_level = e.user_level);
void 0 !== i.money && (t.extract_money = i.money);
void 0 !== i.status && (t.bubble_status = i.status);
void 0 !== i.levels_passed_count && (t.levels_passed_count = i.levels_passed_count);
void 0 !== i.current_extract_levels_passed_count && (t.current_extract_levels_passed_count = i.current_extract_levels_passed_count);
void 0 !== i.levels_passed_limit && (t.levels_passed_limit = i.levels_passed_limit);
void 0 !== i.sign_in && (t.sign_in_days = i.sign_in);
void 0 !== i.sign_in_limit && (t.sign_in_limit = i.sign_in_limit);
void 0 !== i.level && (t.extract_user_level = i.level);
void 0 !== i.level_limit && (t.level_limit = i.level_limit);
var n, o, c = l.default;
if (void 0 !== e.task_point_num) {
n = Number(e.task_point_num) || 0;
c.task_point_num = n;
}
if (void 0 !== e.ltv_task_point_num) {
o = Number(e.ltv_task_point_num) || 0;
c.ltv_task_point_num = o;
}
r.default.getInstance().emit(s.gameEvent.userInfoUpdated, {
cash_balance: t.cash_balance,
bubble_balance: t.bubble_balance,
hint_prop_count: t.hint_prop_count,
guideline_prop_count: t.guideline_prop_count,
user_level: t.user_level,
extract_money: t.extract_money,
bubble_status: t.bubble_status,
levels_passed_count: t.levels_passed_count,
current_extract_levels_passed_count: t.current_extract_levels_passed_count,
levels_passed_limit: t.levels_passed_limit,
sign_in_days: t.sign_in_days,
sign_in_limit: t.sign_in_limit,
extract_user_level: t.extract_user_level,
level_limit: t.level_limit,
task_point_num: n,
ltv_task_point_num: o
});
}
};
return i;
}(o.default);
export default  c;
