let e = require;
let t = module;
"use strict";
cc._RF.push(t, "212b49wuBNObL5VVQgzzBIP", "MoviePlayer");
var o = {
}
,
n = function(e) {
  return Math.floor(10* e);
}
,
i = function(e) {
  return e/ 10;
}
,
a = function(e) {
  var t = new Uint8Array(e);
  return String.fromCharCode.apply(null, t);
}
,
r = function(e) {
  for(var t = new ArrayBuffer(e.length), o = new Uint8Array(t), n = 0, i = e.length;
  n < i;
  n++) o[n] = e.charCodeAt(n);
  return t;
}
;
o.refreshTime = new Date().getTime();
o.curCueInfo = null;
o.oneMV = {
}
;
o.createNewMV = function() {
  o.oneMV = {
  }
;
}
;
o.oneCue = function(e) {
  o.oneMV.cues = o.oneMV.cues|| [];
  var t = {
  }
;
  t.hit = {
    rad: e.rad,
    power: e.power,
    time: new Date().getTime()- o.refreshTime,
    radAngle: e.radAngle,
    radVx: e.radVx,
    radVy: e.radVy
  }
;
  t.moves = [];
  t.des = [];
  o.oneMV.cues.push(t);
  o.curCueInfo = t;
  console.log("MoviePlayer.oneCue", t);
}
;
o.packInitBalls = function(e) {
  var t = new ArrayBuffer(10),
  i = new DataView(t, 0, 10);
  i.setUint16(0, e.ballID, ! 0);
  i.setUint16(2, e.ballType, ! 0);
  i.setUint16(4, e.ballMatIdx, ! 0);
  i.setInt16(6, n(e.x), ! 0);
  i.setInt16(8, n(e.y), ! 0);
  if(o.oneMV) {
    o.oneMV.balls = o.oneMV.balls|| [];
    o.oneMV.balls.push(a(t));
  }
}
;
o.packBallMove = function(e) {
  var t = new ArrayBuffer(14),
  i = new DataView(t, 0, 14);
  i.setUint16(0, e.ballID, ! 0);
  i.setUint32(2, e.time- o.refreshTime, ! 0);
  i.setInt16(6, n(e.x), ! 0);
  i.setInt16(8, n(e.y), ! 0);
  i.setInt16(10, n(e.vx), ! 0);
  i.setInt16(12, n(e.vy), ! 0);
  o.curCueInfo&& o.curCueInfo.moves.push(a(t));
}
;
o.packBallDestroy = function(e) {
  var t = new ArrayBuffer(6),
  n = new DataView(t, 0, 6);
  n.setUint16(0, e.ballID, ! 0);
  n.setUint32(2, e.time- o.refreshTime, ! 0);
  o.curCueInfo&& o.curCueInfo.des.push(a(t));
}
;
o.unpackInitBalls = function(e) {
  var t = {
  }
,
  o = new DataView(e);
  t.ballID = o.getUint16(0, ! 0);
  t.ballType = o.getUint16(2, ! 0);
  t.ballMatIdx = o.getUint16(4, ! 0);
  t.x = i(o.getInt16(6, ! 0));
  t.y = i(o.getInt16(8, ! 0));
  return t;
}
;
o.unpackBallMove = function(e) {
  var t = {
  }
,
  o = new DataView(e);
  t.ballID = o.getUint16(0, ! 0);
  t.time = o.getUint32(2, ! 0);
  t.x = i(o.getInt16(6, ! 0));
  t.y = i(o.getInt16(8, ! 0));
  t.vx = i(o.getInt16(10, ! 0));
  t.vy = i(o.getInt16(12, ! 0));
  return t;
}
;
o.unpackBallDestroy = function(e) {
  var t = {
  }
,
  o = new DataView(e);
  t.ballID = o.getUint16(0, ! 0);
  t.time = o.getUint32(2, ! 0);
  return t;
}
;
o.compress = function() {
  console.log("compress", o.oneMV);
  if(o.oneMV) {
    var e = JSON.stringify(o.oneMV);
    console.log("zip_obj", typeof e, e.length);
    return e;
  }
  return null;
}
;
o.uncompress = function(e) {
  var t = e,
  n = JSON.parse(t);
  o.oneMV_strToArrayBuffer(n);
  console.log("uncompress", n);
  o.unpackOneMV(n);
  o.resetTimeOneMV(n);
  return n;
}
;
o.oneMV_strToArrayBuffer = function(e) {
  if(e.balls) for(var t = 0;
  t < e.balls.length;
  t++) {
    var o = e.balls[t];
    e.balls[t] = r(o);
  }
  if(e.cues) for(t = 0;
  t < e.cues.length;
  t++) {
    for(var n = e.cues[t].moves, i = 0;
    i < n.length;
    i++) n[i] = r(n[i]);
    var a = e.cues[t].des;
    if(a) for(var l = 0;
    l < a.length;
    l++) a[l] = r(a[l]);
  }
}
;
o.unpackOneMV = function(e) {
  if(e) {
    for(var t = e.balls, n = e.cues, i = 0;
    i < t.length;
    i++) {
      var a = t[i];
      t[i] = o.unpackInitBalls(a);
    }
    for(i = 0;
    i < n.length;
    i++) {
      for(var r = n[i], l = (r.hit, r.moves), s = 0;
      s < l.length;
      s++) {
        a = l[s];
        l[s] = o.unpackBallMove(a);
      }
      var c = r.des;
      if(c) for(s = 0;
      s < c.length;
      s++) {
        a = c[s];
        c[s] = o.unpackBallDestroy(a);
      }
    }
    console.log("unpackOneMV", e);
  }
}
;
o.resetTimeOneMV = function(e) {
  if(e) {
    for(var t = e.cues, o = 0, n = 0;
    n < t.length;
    n++) {
      var i = t[n],
      a = i.hit;
      0 == o&& (o = a.time);
      o = o;
      for(var r = i.moves, l = 0;
      l < r.length;
      l++) {
        var s = r[l];
        s.time = s.time- o+ 2e3;
        r[l] = s;
      }
      var c = i.des;
      if(c) for(l = 0;
      l < c.length;
      l++) {
        var u = c[l];
        u.time = u.time- o+ 2e3;
        c[l] = u;
      }
    }
    console.log("resetTimeOneMV", e);
  }
}
;
o.playOneMV = function(e) {
  e&& e.balls;
}
;
t.exports = o;
cc._RF.pop();
