let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "5f01bUvQqZNMrIkBoUxNfxb", "TypeWriter");
var n,
a = __extends,
o = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var r = e(AudioMgr "
} ].js), s = cc._decorator, l = s.ccclass, c = s.property, u = s.menu, d = s.requireComponent;
(function(e) {
e[e.None = 0] = " None ";
e[e.Clip = 1] = " Clip ";
e[e.Url = 2] = " Url ";
})(n || (n = {}));
var h = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._label = null;
t.interval = .25;
t.voiceType = n.None;
t.voiceClip = null;
t.voiceBundleName = " ";
t.voiceUrl = " ";
t.strArr = [];
t._audioId = 0;
return t;
}
var i;
a(t, e);
i = t;
Object.defineProperty(t.prototype, " label ", {
get: function() {
this._label || (this._label = this.getComponent(cc.Label));
return this._label;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, " isCompleted ", {
get: function() {
var e, t;
return (null !== (t = null === (e = null == this ? void 0 : this.strArr) || void 0 === e ? void 0 : e.length) && void 0 !== t ? t : 0) <= 0;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, " audioId ", {
get: function() {
return this._audioId;
},
enumerable: !1,
configurable: !0
});
t.prototype.show = function(e, t, i) {
var a, o = this;
if (e = e || this.label.string) {
this.strArr = null !== (a = null == e ? void 0 : e.split(" ")) && void 0 !== a ? a : [];
this.unscheduleAllCallbacks();
this.label.string = " ";
t && (" string " == typeof t ? (this.voiceType = n.Url, this.voiceUrl = t, this.voiceBundleName = i) : (this.voiceType = n.Clip,
this.voiceClip = t));
this.voiceType !== n.None && (this.voiceType === n.Clip && this.voiceClip ? r.default.getInstance().playEffect(this.voiceClip).then(function(e) {
o._audioId = e;
o.isCompleted && r.default.getInstance().stopEffect(e);
}) : this.voiceType === n.Url && this.voiceUrl && r.default.getInstance().playEffect(this.voiceUrl, this.voiceBundleName).then(function(e) {
o._audioId = e;
o.isCompleted && r.default.getInstance().stopEffect(e);
}));
this.showWord();
} else console.warn(" TypeWriter: str is empty ");
};
t.prototype.showAll = function() {
if (!this.isCompleted) {
this.unscheduleAllCallbacks();
this.label.string += this.strArr.join(" ");
this.strArr.length = 0;
r.default.getInstance().stopEffect(this._audioId);
this.node.emit(i.EventType.Complete);
}
};
t.prototype.showWord = function() {
var e = this;
if (this.strArr.length <= 0) this.node.emit(i.EventType.Complete); else {
this.scheduleOnce(function() {
return e.showWord();
}, this.interval);
this.label.string += this.strArr.shift();
}
};
t.prototype.onDisable = function() {
r.default.getInstance().stopEffect(this._audioId);
};
t.EventType = {
Complete: " TypeWriter_Complete "
};
o([ c({
tooltip: " 每个字出现的间隔 "
}) ], t.prototype, " interval ", void 0);
o([ c({
type: cc.Enum(n)
}) ], t.prototype, " voiceType ", void 0);
o([ c({
type: cc.AudioClip,
tooltip: " 绑定的语音 ",
visible: function() {
return this.voiceType !== n.None;
}
}) ], t.prototype, " voiceClip ", void 0);
o([ c({
tooltip: " 绑定的语音资源包名 ",
visible: function() {
return this.voiceType === n.Url;
}
}) ], t.prototype, " voiceBundleName ", void 0);
o([ c({
tooltip: " 绑定的语音资源路径 ",
visible: function() {
return this.voiceType === n.Url;
}
}) ], t.prototype, " voiceUrl ", void 0);
return i = o([ l, d(cc.Label), u(" UI/ Cocos/ TypeWriter ") ], t);
}(cc.Component);
i.default = h;
cc._RF.pop();
