// @ts-nocheck

var i = function(e, t, i) {
i = i || 128;
this.unitID = e;
this._memPool = t;
this._data = new Uint16Array(2);
this._data[0] = 0;
this._data[1] = 0;
this._contentNum = i;
this._signData = new Uint16Array(2 * this._contentNum);
this._spacesData = [];
for (var n = 0; n < i; n++) {
var a = 2 * n;
this._signData[a + 0] = n + 1;
this._signData[a + 1] = 0;
this._spacesData[n] = {
index: n,
unitID: e
};
}
this._signData[2 * (i - 1)] = 65535;
}, n = i.prototype;
n.hasSpace = function() {
return 65535 !== this._data[0];
};
n.isAllFree = function() {
return 0 == this._data[1];
};
n.pop = function() {
var e = this._data[0];
if (65535 === e) return null;
var t = e, i = 2 * t, n = this._spacesData[t];
this._signData[i + 1] = 1;
this._data[0] = this._signData[i + 0];
this._data[1]++;
return n;
};
n.push = function(e) {
var t = 2 * e;
this._signData[t + 1] = 0;
this._signData[t + 0] = this._data[0];
this._data[0] = e;
this._data[1]--;
};
n.dump = function() {
for (var e = 0, t = this._data[0], i = ""; 65535 != t; ) {
e++;
i += t + "->";
t = this._signData[2 * t + 0];
}
for (var n = 0, a = "", o = this._contentNum, r = 0; r < o; r++) if (1 == this._signData[2 * r + 1]) {
n++;
a += r + "->";
}
var s = e + n;
console.log("unitID:", this.unitID, "spaceNum:", e, "calc using num:", n, "store using num:", this._data[1], "calc total num:", s, "actually total num:", this._contentNum);
console.log("free info:", i);
console.log("using info:", a);
n != this._data[1] && cc.error("using num error", "calc using num:", n, "store using num:", this._data[1]);
e + n != this._contentNum && cc.error("total num error", "calc total num:", s, "actually total num:", this._contentNum);
};
export default  i;
