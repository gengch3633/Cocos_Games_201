let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "c594dzOmDVOzogALTHLOtci", "AudioPlay");
var n = __extends,
a = __decorate,
o = __awaiter,
r = __generator;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var s = e("AudioMgr"),
l = e(ResMgr "
} ].js), c = cc._decorator, u = c.ccclass, d = c.property, h = c.menu, p = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.clips = [];
t.bundle = null;
t.effIds = [];
t.musicId = -1;
return t;
}
var i;
n(t, e);
i = t;
t.get = function(e) {
var t;
return e.isValid ? null !== (t = e.getComponent(i)) && void 0 !== t ? t : e.addComponent(i) : null;
};
t.prototype.playEffect = function(e, t, i, n) {
void 0 === i && (i = 1);
void 0 === n && (n = !1);
return o(this, void 0, Promise, function() {
var a;
return r(this, function(o) {
switch (o.label) {
case 0:
return e ? (a = this.clips.find(function(t) {
return t.name == e;
})) ? [ 2, this.play(a, i, n) ] : [ 4, this.loadClip(e, t) ] : [ 2, -1 ];

case 1:
return (a = o.sent()) ? (this.clips.findIndex(function(t) {
return t.name == e;
}) < 0 && this.clips.push(a), [ 2, this.play(a, i, n) ]) : [ 2, -1 ];
}
});
});
};
t.prototype.play = function(e, t, i) {
void 0 === t && (t = 1);
void 0 === i && (i = !1);
return o(this, void 0, void 0, function() {
var n, a, o = this;
return r(this, function(r) {
switch (r.label) {
case 0:
return [ 4, s.default.getInstance().playEffect(e, t, i) ];

case 1:
n = r.sent();
this.effIds.push(n);
if (!i) {
a = s.default.getInstance().getDuration(n);
this.scheduleOnce(function() {
var e = o.effIds.indexOf(n);
e >= 0 && o.effIds.splice(e, 1);
}, a);
}
return [ 2, n ];
}
});
});
};
t.prototype.playMusic = function(e, t) {
void 0 === t && (t = null);
return o(this, void 0, Promise, function() {
var i, n, a;
return r(this, function(o) {
switch (o.label) {
case 0:
return e ? (i = this.clips.find(function(t) {
return t.name == e;
})) ? (this.stopMusic(), n = this, [ 4, s.default.getInstance().playMusic(i) ]) : [ 3, 2 ] : [ 2, -1 ];

case 1:
n.musicId = o.sent();
return [ 2, this.musicId ];

case 2:
return [ 4, this.loadClip(e, t) ];

case 3:
return (i = o.sent()) ? (this.clips.findIndex(function(t) {
return t.name == e;
}) < 0 && this.clips.push(i), this.stopMusic(), a = this, [ 4, s.default.getInstance().playMusic(i) ]) : [ 2, -1 ];

case 4:
a.musicId = o.sent();
return [ 2, this.musicId ];
}
});
});
};
t.prototype.loadClip = function(e, t) {
void 0 === t && (t = null);
return o(this, void 0, Promise, function() {
return r(this, function(i) {
switch (i.label) {
case 0:
e.includes("/ ") || (e = " audio/ " + e);
t || (t = this.bundle);
return [ 4, l.default.getInstance().getKeeper(this, !0).loadRes(e, cc.AudioClip, t) ];

case 1:
return [ 2, i.sent() ];
}
});
});
};
t.prototype.stopAllEff = function() {
var e = this;
this.effIds.forEach(function(t) {
return e.stop(t);
});
};
t.prototype.stop = function(e) {
cc.audioEngine.stopEffect(e);
};
t.prototype.stopMusic = function() {
this.stop(this.musicId);
};
a([ d([ cc.AudioClip ]) ], t.prototype, " clips ", void 0);
a([ d ], t.prototype, " bundle ", void 0);
return i = a([ u, h(" UI/ Cocos/ AudioPlay ") ], t);
}(cc.Component);
i.default = p;
cc._RF.pop();
