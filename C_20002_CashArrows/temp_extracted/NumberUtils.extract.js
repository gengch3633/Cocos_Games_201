NumberUtils: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "5f81ct7MFZAl76+jkvw7vSZ", "NumberUtils");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = e("Random"), a = function() {
function e() {}
e.dayToDate = function(e) {
var t = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ], i = Math.floor(e / 365);
e -= 365 * i;
for (var n = 0, a = 0, o = 0; o < t.length; o++) if ((n += t[o]) > e) {
a = o;
n -= t[o];
break;
}
var r = {
year: i,
month: a + 1,
day: e - n
};
if (r.day <= 0) {
r.month = a;
r.day = t[a - 1];
}
return r;
};
e.isMonthLastDay = function(t) {
var i = e.dayToDate(t);
return i.day >= [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ][i.month - 1];
};
e.formatSeconds = function(e, t) {
void 0 === t && (t = "mm:ss");
e = Math.max(e, 0);
var i = Math.floor(e / 3600).toString(), n = Math.floor(e / 60 % 60).toString(), a = Math.floor(e % 60).toString(), o = {
h: i,
hh: i.padStart(2, "0"),
m: n,
mm: n.padStart(2, "0"),
s: a,
ss: a.padStart(2, "0")
};
return t.replace(/hh|h|mm|m|ss|s/g, function(e) {
return o[e];
});
};
e.formatTime = function(e, t) {
void 0 === t && (t = !1);
var i = "", n = e / 60, a = e - 60 * (n = parseInt(n + ""));
i += n > 9 ? n + (t ? "分" : ":") : "0" + n + (t ? "分" : ":");
return (i += (a = parseInt(a + "")) > 9 ? a : "0" + a) + (t ? "秒" : "");
};
e.getDay = function() {
var e = new Date().getTime();
return this.timeStampToDay(e);
};
e.timeStampToDay = function(e, t) {
void 0 === t && (t = 8);
e += 36e5 * t;
return Math.floor(e / 1e3 / 60 / 60 / 24);
};
e.isNewDay = function(e) {
null == e && (e = 0);
var t = new Date(e), i = new Date();
return t.getFullYear() < i.getFullYear() || t.getMonth() < i.getMonth() || t.getDate() < i.getDate();
};
e.toFixed = function(e, t) {
void 0 === t && (t = 1);
if ("number" != typeof e) return 0;
if (isNaN(e) || null == e || null == e) return 0;
if (Infinity == e) return 0;
if (t <= 0) return Math.round(e);
var i = Math.pow(10, t);
return Math.round(e * i) / i;
};
e.split = function(e, t) {
if (t <= 0 || e <= 0) throw new Error("目标值和分割份数必须大于0");
for (var i = new Array(t).fill(0), a = 0, o = 0; o < t - 1; o++) {
var r = n.default.floatRange(.1, e - a - .1 * (t - o - 1));
i[o] = r;
a += r;
}
i[t - 1] = e - a;
if (i[t - 1] <= 0) throw new Error("分割后的值不能小于等于0");
return i;
};
e.formatChinesNum = function(t) {
if (e.ChinesWords[t]) return e.ChinesWords[t];
if (t > 10 && t < 20) {
var i = (a = t.toString()).substring(1, 2);
return e.ChinesUnit[1] + e.ChinesWords[i];
}
if (t > 10) {
for (var n = "", a = t.toString(), o = 0; o < a.length; ++o) {
i = a.substring(o, o + 1);
var r = a.length - o - 1;
n += e.ChinesWords[i] + e.ChinesUnit[r];
}
return n;
}
return "零";
};
e.UnitConversion = function(e, t) {
void 0 === t && (t = !1);
var i = Math.abs(e), n = [ {
count: Infinity,
unit: "域"
}, {
count: Infinity,
unit: "古戈尔"
}, {
count: Infinity,
unit: "梵境"
}, {
count: Infinity,
unit: "太虚"
}, {
count: Infinity,
unit: "太初"
}, {
count: Infinity,
unit: "极乐"
}, {
count: Infinity,
unit: "轮回"
}, {
count: Infinity,
unit: "大成"
}, {
count: Infinity,
unit: "化一"
}, {
count: Infinity,
unit: "天巧"
}, {
count: Infinity,
unit: "天哭"
}, {
count: Infinity,
unit: "天暴"
}, {
count: Infinity,
unit: "天慧"
}, {
count: Infinity,
unit: "天牢"
}, {
count: Infinity,
unit: "天败"
}, {
count: Infinity,
unit: "天损"
}, {
count: Infinity,
unit: "天罪"
}, {
count: Infinity,
unit: "天平"
}, {
count: 1e308,
unit: "天剑"
}, {
count: 1e304,
unit: "天寿"
}, {
count: 1e300,
unit: "天退"
}, {
count: 1e296,
unit: "天究"
}, {
count: 1e292,
unit: "天微"
}, {
count: 1e288,
unit: "天煞"
}, {
count: 1e284,
unit: "天异"
}, {
count: 1e280,
unit: "天速"
}, {
count: 1e276,
unit: "天空"
}, {
count: 1e272,
unit: "天佑"
}, {
count: 1e268,
unit: "天暗"
}, {
count: 1e264,
unit: "天健"
}, {
count: 1e260,
unit: "天玄"
}, {
count: 1e266,
unit: "天伤"
}, {
count: 1e262,
unit: "天孤"
}, {
count: 1e258,
unit: "天满"
}, {
count: 1e254,
unit: "天富"
}, {
count: 1e250,
unit: "天贵"
}, {
count: 1e246,
unit: "天英"
}, {
count: 1e242,
unit: "天威"
}, {
count: 1e238,
unit: "天猛"
}, {
count: 1e234,
unit: "天雄"
}, {
count: 1e230,
unit: "天勇"
}, {
count: 1e226,
unit: "天闲"
}, {
count: 1e222,
unit: "天机"
}, {
count: 1e218,
unit: "天罡"
}, {
count: 1e214,
unit: "天魁"
}, {
count: 1e210,
unit: "兑"
}, {
count: 1e216,
unit: "艮"
}, {
count: 1e212,
unit: "离"
}, {
count: 1e208,
unit: "坎"
}, {
count: 1e204,
unit: "震"
}, {
count: 1e200,
unit: "巽"
}, {
count: 1e196,
unit: "坤"
}, {
count: 1e192,
unit: "乾"
}, {
count: 1e188,
unit: "亥"
}, {
count: 1e184,
unit: "戌"
}, {
count: 1e180,
unit: "酉"
}, {
count: 1e176,
unit: "申"
}, {
count: 1e172,
unit: "未"
}, {
count: 1e168,
unit: "午"
}, {
count: 1e164,
unit: "巳"
}, {
count: 1e160,
unit: "辰"
}, {
count: 1e156,
unit: "卯"
}, {
count: 1e152,
unit: "寅"
}, {
count: 1e148,
unit: "丑"
}, {
count: 1e144,
unit: "子"
}, {
count: 1e140,
unit: "魄"
}, {
count: 1e136,
unit: "髓"
}, {
count: 1e132,
unit: "砂"
}, {
count: 1e128,
unit: "晶"
}, {
count: 1e124,
unit: "玉"
}, {
count: 1e120,
unit: "灵"
}, {
count: 1e116,
unit: "坞"
}, {
count: 1e112,
unit: "漠"
}, {
count: 1e108,
unit: "瞬息"
}, {
count: 1e104,
unit: "净"
}, {
count: 1e100,
unit: "仄"
}, {
count: 1e96,
unit: "虚"
}, {
count: 1e92,
unit: "须臾"
}, {
count: 1e88,
unit: "无间"
}, {
count: 1e84,
unit: "弹指"
}, {
count: 1e80,
unit: "无极"
}, {
count: 1e76,
unit: "天数"
}, {
count: 1e72,
unit: "大数"
}, {
count: 1e68,
unit: "无量"
}, {
count: 1e64,
unit: "不思议"
}, {
count: 1e60,
unit: "那由他"
}, {
count: 1e56,
unit: "阿僧祇"
}, {
count: 1e52,
unit: "恒河沙"
}, {
count: 1e48,
unit: "极"
}, {
count: 1e44,
unit: "载"
}, {
count: 1e40,
unit: "正"
}, {
count: 1e36,
unit: "涧"
}, {
count: 1e32,
unit: "沟"
}, {
count: 1e28,
unit: "穰"
}, {
count: 1e24,
unit: "秭"
}, {
count: 1e20,
unit: "垓"
}, {
count: 1e16,
unit: "京"
}, {
count: 1e12,
unit: "兆"
}, {
count: 1e8,
unit: "亿"
}, {
count: 1e4,
unit: "万"
} ].sort(function(e, t) {
return t.count - e.count;
}).find(function(e) {
return i >= e.count;
});
if (n) {
var a = n.count, o = n.unit, r = i % a == 0 ? (i / a).toString() : (i / a).toFixed(2);
return t ? "" + Math.round(i / a) + o : (e > 0 ? "" : "-") + r + o;
}
return this.decimalPlaces(e) > 2 ? e.toFixed(2) : e.toString();
};
e.decimalPlaces = function(e) {
var t = e.toString();
return t.includes(".") ? t.split(".")[1].length : 0;
};
e.ChinesWords = [ "零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十" ];
e.ChinesUnit = [ "", "十", "百", "千", "万", "亿", "十", "百", "千" ];
return e;
}();
i.default = a;
cc._RF.pop();
}