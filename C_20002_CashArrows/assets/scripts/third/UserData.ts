// @ts-nocheck
import UserArchive from "./UserArchive";

const { __extends } = cc;
const n = __extends;
var a = function(e) {
function t() {
var t = e.call(this, "UserData") || this;
t.bool_firstdie = !0;
t.sidebar = !1;
t.level = 1;
t.music = !0;
t.sound = !0;
t.shake = !0;
t.dragSpeed = .5;
t.colorMode = !1;
t.userID = null;
t.firstVersion = "";
t.num_tipscards = 0;
t.openId = "";
t.yid = "";
t.cash_balance = 0;
t.hint_prop_count = 0;
t.guideline_prop_count = 0;
t.bubble_balance = "";
t.user_level = 1;
t.recentRandomLevels = [];
return t;
}
n(t, e);
t.prototype.init = function() {};
t.getUserId = function(e) {
var t = "1234567890abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
Date.now();
for (var i = [], n = 0; n < e; n++) i.push(t[Math.floor(Math.random() * t.length)]);
i.sort(function() {
return Math.random() > .5 ? 1 : -1;
});
return i.join("");
};
return t;
}(UserArchive.default);
export default  a;
