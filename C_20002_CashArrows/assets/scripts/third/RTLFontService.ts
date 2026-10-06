// @ts-nocheck


var i = {
ar: "font/NotoSansArabic",
ur: "font/NotoNastaliqUrdu",
bn: "font/NotoSansBengali"
}, n = "game", a = {
ar: null,
ur: null,
bn: null
}, o = {
ar: !1,
ur: !1,
bn: !1
}, r = {
ar: !1,
ur: !1,
bn: !1
}, s = {
ar: [],
ur: [],
bn: []
}, l = null, c = !1, u = [];
function d(e, t) {
var i = s[e] || [];
s[e] = [];
for (var n = 0; n < i.length; n++) try {
i[n](t);
} catch (e) {
cc.warn("[RTLFontService] callback error:", e);
}
}
function h(e) {
if (l) e(l); else {
u.push(e);
if (!c) {
c = !0;
var t = cc.assetManager && cc.assetManager.getBundle ? cc.assetManager.getBundle(n) : null;
if (t) {
l = t;
c = !1;
var i = u;
u = [];
for (var a = 0; a < i.length; a++) try {
i[a](l);
} catch (e) {}
} else if (cc.assetManager && cc.assetManager.loadBundle) cc.assetManager.loadBundle(n, function(e, t) {
c = !1;
if (!e && t) {
l = t;
var i = u;
u = [];
for (var a = 0; a < i.length; a++) try {
i[a](l);
} catch (e) {}
} else {
cc.warn("[RTLFontService] loadBundle " + n + " failed:", e);
l = null;
var o = u;
u = [];
for (var r = 0; r < o.length; r++) try {
o[r](null);
} catch (e) {}
}
}); else {
c = !1;
l = null;
cc.warn("[RTLFontService] cc.assetManager.loadBundle unavailable");
var o = u;
u = [];
for (var r = 0; r < o.length; r++) try {
o[r](null);
} catch (e) {}
}
}
}
}
var p = {
getFont: function(e) {
return a[e] || null;
},
isFailed: function(e) {
return !0 === r[e];
},
isLoading: function(e) {
return !0 === o[e];
},
ensureFont: function(e, t) {
var n = i[e];
if (n) if (a[e]) t && t(a[e]); else if (r[e]) t && t(null); else {
t && s[e].push(t);
if (!o[e]) {
o[e] = !0;
h(function(t) {
if (t) t.load(n, cc.Font, function(t, i) {
o[e] = !1;
if (!t && i) {
a[e] = i;
d(e, i);
} else {
r[e] = !0;
cc.warn("[RTLFontService] font missing or load failed: " + n + " (run tools/i18n/download_rtl_fonts.py and refresh meta in Cocos Creator)", t);
d(e, null);
}
}); else {
r[e] = !0;
o[e] = !1;
d(e, null);
}
});
}
} else t && t(null);
},
reset: function() {
a = {
ar: null,
ur: null,
bn: null
};
o = {
ar: !1,
ur: !1,
bn: !1
};
r = {
ar: !1,
ur: !1,
bn: !1
};
s = {
ar: [],
ur: [],
bn: []
};
}
};
export default p;
