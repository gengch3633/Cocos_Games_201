// @ts-nocheck
import RedDotNode from "./RedDotNode";
import Singleton from "./Singleton";

const { __extends } = cc;
const n = __extends;
var a = Singleton, o = RedDotNode, r = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.root = new o.default("RedDotMgr_Root");
return t;
}
n(t, e);
t.prototype.addRedDot = function(e) {
this.root.addChild(e);
};
t.prototype.getRedDot = function(e) {
return this.findChild(e, this.root);
};
t.prototype.findChild = function(e, t) {
if (!t) return null;
for (var i = 0; i < t.children.length; i++) if (t.children[i].id == e) return t.children[i];
for (i = 0; i < t.children.length; i++) {
var n = this.findChild(e, t.children[i]);
if (n) return n;
}
return null;
};
return t;
}(a.default);
export default  r;
