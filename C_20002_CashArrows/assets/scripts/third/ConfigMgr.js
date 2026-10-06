let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "52dfbvdCFhB0oPGOsYPYlp+", "ConfigMgr");
var n,
a = __extends,
o = __awaiter,
r = __generator;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var s = e("InterfaceMgr"),
l = e("ConfigDefine"),
c = e(UserData "
} ].js), u = e(" ResMgr "), d = e(" Singleton "), h = e(" EncryptXOR "), p = e(" URL ");
(function(e) {
e[e.None = 0] = " None ";
e[e.Done = 1] = " Done ";
})(n || (n = {}));
var _ = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.game_knzmx = " tt_knzmx ";
t.game_hystz = " tt_hystz ";
t.game_wnzzl = " wx_wnzzl ";
t.game_kyzmw = " wx_kyzmw ";
t.gameName = " wx_wnzzl ";
t.lk_oss = " https:// lkgame.mrkzx.cn/ ";
t.dataMap = new Map();
t.levelMap = new Map();
t.mackList = null;
t.loadState = n.None;
return t;
}
a(t, e);
t.prototype.loadAll = function(e, t, i) {
var a = this;
void 0 === t && (t = " config ");
void 0 === i && (i = "/ json ");
return new Promise(function(s) {
if (a.loadState != n.Done) {
var l = 0, c = p.default.isHttpUrl(e), d = function(t, i) {
return o(a, void 0, void 0, function() {
var n, a, o = this;
return r(this, function(r) {
switch (r.label) {
case 0:
r.trys.push([ 0, 5, , 6 ]);
n = 0;
r.label = 1;

case 1:
return n < 3 ? [ 4, cc.assetManager.loadRemote(p.default.parse(e, t + (i ? ".txt " : ".json? t = " + Date.now())), function(e, n) {
if (i) {
var a = h.default.getInstance().decrypt(n.msg);
n = JSON.parse(a);
} else n = n.json;
o.dataMap.set(t, n);
}) ] : [ 3, 4 ];

case 2:
r.sent();
r.label = 3;

case 3:
n++;
return [ 3, 1 ];

case 4:
f();
return [ 3, 6 ];

case 5:
a = r.sent();
console.error(" load local " + t + " error ", a);
s(!1);
return [ 3, 6 ];

case 6:
return [ 2 ];
}
});
});
}, _ = function(e, t) {
try {
var i = !1;
if (t instanceof cc.TextAsset) {
var n = h.default.getInstance().decrypt(t.text);
a.dataMap.set(e, JSON.parse(n));
i = !0;
} else a.dataMap.set(e, t.json);
t.decRef();
var o = 0 === String(e || " ").indexOf(" i18n_ ");
c && !o ? d(e, i) : f();
} catch (t) {
console.error(" load local " + e + " error ", t);
s(!1);
}
}, f = function() {
if (--l <= 0) {
a.loadState = n.Done;
s(!0);
}
};
u.default.getInstance().getBundle(t).then(function(e) {
l += 2;
e.loadDir(i, cc.TextAsset, function(e, t) {
l--;
if (e) console.error(e); else {
l += t.length;
t.forEach(function(e) {
return _(e.name, e);
});
}
});
e.loadDir(i, cc.JsonAsset, function(e, t) {
l--;
if (e) console.error(e); else {
l += t.length;
t.forEach(function(e) {
return _(e.name, e);
});
}
});
});
} else s(!0);
});
};
t.prototype.getOne = function(e) {
var t = e.TabName;
return this.dataMap.get(t);
};
t.prototype.getById = function(e, t, i) {
void 0 === i && (i = " id ");
var n = this.find(e, function(e) {
return e[i] == t;
});
n || console.error(" 配置表 " + e.TabName + " 中没有找到 " + String(i) + " = " + t + " 的数据 ");
return n;
};
t.prototype.getAll = function(e) {
var t = e.TabName;
return this.dataMap.get(t);
};
t.prototype.find = function(e, t) {
var i;
return null === (i = this.getAll(e)) || void 0 === i ? void 0 : i.find(t);
};
t.prototype.filter = function(e, t) {
var i;
return null === (i = this.getAll(e)) || void 0 === i ? void 0 : i.filter(t);
};
t.prototype.forEach = function(e, t) {
var i;
null === (i = this.getAll(e)) || void 0 === i || i.forEach(t);
};
t.prototype.loadLevel = function(e, t, i) {
var n = this;
void 0 === t && (t = " config ");
void 0 === i && (i = "/ game ");
return new Promise(function(a) {
var s = 0, l = p.default.isHttpUrl(e), c = function(t, s) {
return o(n, void 0, void 0, function() {
var n, l, c, u, d, f = this;
return r(this, function(g) {
switch (g.label) {
case 0:
g.trys.push([ 0, 5, , 6 ]);
n = function(e, t) {
return o(f, void 0, Promise, function() {
return r(this, function() {
return [ 2, new Promise(function(i) {
cc.assetManager.loadRemote(e, function(e, n) {
if (e) {
console.log(e);
i(null);
} else {
var a = null;
if (t) {
var o = n;
a = JSON.parse(h.default.getInstance().decrypt(o.text));
} else a = (o = n).json;
i(a);
}
});
}) ];
});
});
};
l = 0;
g.label = 1;

case 1:
return l < 3 ? (c = p.default.parse(e, i, t + (s ? ".txt " : ".json ")) + "? v = " + Date.now(),
[ 4, n(c, s) ]) : [ 3, 4 ];

case 2:
if (u = g.sent()) {
this.levelMap.set(t, u);
return [ 3, 4 ];
}
g.label = 3;

case 3:
l++;
return [ 3, 1 ];

case 4:
_();
return [ 3, 6 ];

case 5:
d = g.sent();
console.error(" load local " + t + " error ", d);
a(!1);
return [ 3, 6 ];

case 6:
return [ 2 ];
}
});
});
}, d = function(e, t) {
try {
var i = !1;
if (t instanceof cc.TextAsset) {
var o = h.default.getInstance().decrypt(t.text);
n.levelMap.set(e, JSON.parse(o));
i = !0;
} else n.levelMap.set(e, t.json);
t.decRef();
l ? c(e, i) : _();
} catch (t) {
console.error(" load local " + e + " error ", t);
a(!1);
}
}, _ = function() {
--s <= 0 && a(!0);
};
u.default.getInstance().getBundle(t).then(function(e) {
s += 2;
e.loadDir(i, cc.TextAsset, function(e, t) {
s--;
if (e) console.error(e); else {
s += t.length;
t.forEach(function(e) {
return d(e.name, e);
});
}
});
e.loadDir(i, cc.JsonAsset, function(e, t) {
s--;
if (e) console.error(e); else {
s += t.length;
t.forEach(function(e) {
return d(e.name, e);
});
}
});
});
});
};
t.prototype.getTimeInfoByLevel = function(e) {
return this.find(l.GametimeConfig, function(t) {
return t.id === e;
});
};
t.prototype.getAllLevels = function() {
return Array.from(this.levelMap.values());
};
t.prototype.loadLevelData = function(e, t) {
return o(this, void 0, void 0, function() {
var i = this;
return r(this, function() {
return null != this.levelMap.get(e) ? [ 2, !0 ] : [ 2, new Promise(function(n, a) {
if (t) {
var o = i.lk_oss + i.gameName.split(" _ ")[1] + "/ level/ " + e + ".json? t = " + Date.now();
cc.assetManager.loadRemote(o, function(t, o) {
if (t) a(t); else {
console.log(" json ", o);
i.levelMap.set(e, o.json);
n(!0);
}
});
} else cc.assetManager.getBundle(s.bundleName.config).load(" game/ " + e, function(t, o) {
if (t) a(t); else {
i.levelMap.set(e, o.json);
console.log(" load " + e + " data success ");
n(!0);
}
});
}) ];
});
});
};
t.prototype.loadmacList = function() {
return o(this, void 0, void 0, function() {
var e = this;
return r(this, function() {
return [ 2, new Promise(function(t, i) {
var n = e.lk_oss + e.gameName.split(" _ ")[1] + "/ systemConfig/ maclist.json? t = " + Date.now();
cc.assetManager.loadRemote(n, function(n, a) {
if (n) i(n); else {
console.log(" macList ", a.json);
e.mackList = a.json;
t(!0);
}
});
}) ];
});
});
};
t.prototype.getMackList = function() {
return o(this, void 0, void 0, function() {
var e = this;
return r(this, function() {
return [ 2, new Promise(function(t, i) {
e.mackList ? t(e.mackList) : e.loadmacList().then(function() {
t(e.mackList);
}).catch(function(e) {
i(e);
});
}) ];
});
});
};
t.prototype.getLevelById = function(e) {
return this.levelMap.get(" level_ " + e);
};
t.prototype.checkMac = function() {
return o(this, void 0, void 0, function() {
var e, t;
return r(this, function(i) {
switch (i.label) {
case 0:
return [ 4, this.getMackList() ];

case 1:
e = i.sent();
for (t = 0; t < e.length; t++) if (c.default.getInstance().userID == e[t].macId) return [ 2, !0 ];
return [ 2, !1 ];
}
});
});
};
return t;
}(d.default);
i.default = _;
cc._RF.pop();
