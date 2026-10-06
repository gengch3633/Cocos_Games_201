// @ts-nocheck
import UserArchive from "./UserArchive";

const { __extends } = cc;
const n = __extends;
var a = function(e) {
function t() {
var t = e.call(this, "UserAudio", 1) || this;
t.musicMute = !1;
t.effectMute = !1;
t.vibrate = !0;
return t;
}
n(t, e);
t.prototype.init = function() {};
return t;
}(UserArchive.default);
export default  a;
