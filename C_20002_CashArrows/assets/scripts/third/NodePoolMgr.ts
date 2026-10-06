// @ts-nocheck
import NodePool from "./NodePool";
import Singleton from "./Singleton";

const { __extends } = cc;
const n = __extends;
var o = function(e) {
function t() {
var t = e.call(this) || this;
t.pool_snake = new NodePool();
t.pool_map = new NodePool();
return t;
}
n(t, e);
return t;
}(Singleton);
export default o;
