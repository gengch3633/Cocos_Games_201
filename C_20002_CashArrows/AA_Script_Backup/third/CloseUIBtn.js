let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "bf088laOPdJub3PSqGSB1TC", "CloseUIBtn");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var o = e("UIMgr"),
r = e(UIParams "
} ].js), s = cc._decorator, l = s.ccclass, c = s.property, u = s.menu, d = s.executionOrder, h = s.requireComponent, p = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.target = null;
return t;
}
n(t, e);
t.prototype.onLoad = function() {
this.node.on(cc.Button.EventType.CLICK, this.clickHandle, this);
};
t.prototype.clickHandle = function() {
var e, t, i, n, a, s = null !== (i = null !== (t = null === (e = this.target) || void 0 === e ? void 0 : e.getComponent(r.UIParams)) && void 0 !== t ? t : this.node.getComponent(r.UIParams)) && void 0 !== i ? i : null === (a = null === (n = this.node) || void 0 === n ? void 0 : n.parent) || void 0 === a ? void 0 : a.getComponent(r.UIParams);
s && !s.runingAnim && o.default.getInstance().hide(s.node);
};
a([ c({
tooltip: " 需要关闭的ui ",
type: cc.Node
}) ], t.prototype, " target ", void 0);
return a([ l, u(" UI/ Cocos/ Btn/ CloseUIBtn "), d(-1), h(cc.Button) ], t);
}(cc.Component);
i.default = p;
cc._RF.pop();
