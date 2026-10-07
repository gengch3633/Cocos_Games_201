let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "3adcbQq0jNCdakd9YM9rn2q", "ClickClearLocalData");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var o = e(Tips "
} ].js), r = e(" LanguageService.js "), s = cc._decorator, l = s.ccclass, c = s.property, u = s.menu, d = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.clickCount = 5;
return t;
}
n(t, e);
t.prototype.onLoad = function() {
var e = this, t = 0, i = 0;
this.node.on(cc.Node.EventType.TOUCH_END, function() {
Date.now() - t < 200 ? ++i >= e.clickCount && (cc.sys.localStorage.clear(), cc.sys.isBrowser && location.reload(),
o.default.show(r.t(" key_tip_local_archive_cleared "))) : i = 0;
t = Date.now();
}, this);
};
a([ c ], t.prototype, " clickCount ", void 0);
return a([ l, u(" UI/ Cocos/ ClickClearLocalData ") ], t);
}(cc.Component);
i.default = d;
cc._RF.pop();
