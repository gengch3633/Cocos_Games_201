// @ts-nocheck
import MultiPlatform from "./MultiPlatform";
import Singleton from "./Singleton";

const { __extends } = cc;
const n = __extends;
var a = MultiPlatform, o = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.enable = !0;
return t;
}
n(t, e);
t.prototype.trackEvent = function(e, t) {
if (this.enable) {
var i = a.default.getInstance().uma;
i && i.trackEvent(e, t);
}
};
return t;
}(Singleton.default);
export default  o;
