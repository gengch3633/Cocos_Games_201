RedDotNode: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "0ad140wIvlC0rJtb/2zyUZ/", "RedDotNode");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = function() {
function e(e, t) {
void 0 === t && (t = null);
this.parent = null;
this.children = [];
this.countAction = null;
this.nodes = [];
if (null == e) throw new Error("id 不能为 null 或 undefined");
this.id = e;
this.countAction = t;
}
e.prototype.setParent = function(e) {
var t;
return e === this ? this : (null === (t = this.parent) || void 0 === t || t.removeChild(this), 
this.parent = e, this);
};
e.prototype.addChild = function(e) {
return !e || this.children.includes(e) ? this : (e.setParent(this), this.children.push(e), 
this);
};
e.prototype.removeChild = function(e) {
if (!e) return this;
var t = this.children.indexOf(e);
if (t >= 0) {
this.children.splice(t, 1);
e.parent = null;
}
return this;
};
e.prototype.removeAllChildren = function() {
this.children.forEach(function(e) {
return e.parent = null;
});
this.children = [];
return this;
};
e.prototype.removeFromParent = function() {
this.parent && this.parent.removeChild(this);
return this;
};
e.prototype.getChildById = function(e) {
for (var t = 0; t < this.children.length; t++) {
var i = this.children[t];
if (i.id === e) return i;
}
return null;
};
e.prototype.setCountAction = function(e) {
this.countAction = e;
return this;
};
e.prototype.getCount = function() {
var e = this.countAction ? this.countAction() : 0;
this.children.forEach(function(t) {
e += t.getCount();
});
return e;
};
e.prototype.addAttachedNode = function(e) {
return this.nodes.indexOf(e) >= 0 ? this : (this.nodes.push(e), this);
};
e.prototype.removeAttachedNode = function(e) {
var t = this.nodes.indexOf(e);
t >= 0 && this.nodes.splice(t, 1);
return this;
};
e.prototype.removeAllAttachedNodes = function() {
this.nodes.length = 0;
return this;
};
e.prototype.notify = function() {
var t = this;
this.nodes.forEach(function(i) {
(null == i ? void 0 : i.isValid) && (null == i || i.emit(e.EventType.COUNT_CHANGED, t.id, t.getCount()));
});
this.children.forEach(function(e) {
return e.notify();
});
};
e.EventType = {
COUNT_CHANGED: "RedDotNode.CountChanged"
};
return e;
}();
i.default = n;
cc._RF.pop();
}