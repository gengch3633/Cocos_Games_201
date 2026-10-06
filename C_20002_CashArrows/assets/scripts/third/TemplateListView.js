let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "25803JJyGNOdofycLFVG513", "TemplateListView");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var o = e(ListView "
} ].js), r = cc._decorator, s = r.ccclass;
r.property;
var l = function(e) {
function t(t) {
var i = e.call(this) || this;
i.setDataSet(t);
return i;
}
n(t, e);
t.prototype.updateView = function(e, t, i) {
e.getComponentInChildren(cc.Label).string = i;
};
t.prototype.onClickItem = function() {};
return t;
}(o.AbsAdapter), c = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.listview = null;
return t;
}
n(t, e);
t.prototype.onLoad = function() {
this.listview = this.node.getComponent(o.default);
this.listview || (this.listview = this.node.getComponentInChildren(o.default));
};
t.prototype.start = function() {
this.listview.setAdapter(new l([ " 节奏春节 ", " 追逐人生 ", " 危险瑜伽 ", " testData3 ", " testData4 ", " testData5 ", " testData6 ", " testData7 ", " testData8 ", " testData9 ", " testData10 " ]));
};
return a([ s ], t);
}(cc.Component);
i.default = c;
cc._RF.pop();
