let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "28974oMO2ZOmLBZfk4WVLpY", "ArchiveMgr");
var n = __extends,
a = __awaiter,
o = __generator;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var r = e("MultiPlatform"),
s = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.localDataMap = null;
    t.serverDatas = [];
    t.prefix = "";
    t._id = "ArchiveMgr_"+ Date.now();
    t.sync = ! 1;
    t.syncVersionCount = 0;
    return t;
  }
  n(t, e);
  t.prototype.init = function(e) {
    return a(this, void 0, Promise, function() {
      var t, i, n, a, s, l, c;
      return o(this, function() {
        this.sync = e;
        if(! e) return[2, ! 0];
        if(!(t = {
          success: ! 0, data: {
          }
        }
).success) return[2, ! 1];
        for(n in i = t.data) if("string" == typeof n&& n.startsWith("saveGameModule")&& (a = i[n], s = n.split("saveGameModule"), l = parseInt(s.pop()), "string" == typeof a&& (c = null, a))) {
          try {
            c = JSON.parse(a);
          } catch(e) {
            console.error("解析存档数据失败", e);
          }
          l >= 1&& (this.serverDatas[l] = c);
        }
        r.default.getInstance().on(r.default.EventType.OnHide, this.saveToServerAll, this);
        return[2, ! 0];
      }
);
    }
);
  }
;
  t.prototype.setPrefix = function(e) {
    e&& (this.prefix = e);
  }
;
  t.prototype.forceSaveToServer = function() {
    return this.saveToServerAll();
  }
;
  t.prototype.reset = function() {
    var e = this;
    return new Promise(function(t) {
      return a(e, void 0, void 0, function() {
        return o(this, function() {
          cc.sys.localStorage.clear();
          cc.sys.isBrowser&& cc.game.end();
          t();
          return[2];
        }
);
      }
);
    }
);
  }
;
  t.prototype.register = function(e) {
    var t = this;
    this.localDataMap|| (this.localDataMap = {
    }
);
    this.localDataMap[e._$key] = e;
    this.serverDatas|| (this.serverDatas = []);
    this.serverDatas[e._$serverIndex]|| (this.serverDatas[e._$serverIndex] = {
    }
);
    this.serverDatas[e._$serverIndex][e._$key] = e;
    e._$watch.on(function() {
      e._$version++;
      t.saveToLocal(e);
      if(t.sync&& e._$serverIndex) {
        t.syncVersionCount++;
        t.syncVersionCount >= 10&& (t.saveToServerAll(), t.syncVersionCount = 0);
      }
    }
, this);
    this.saveToLocal(e);
  }
;
  t.prototype.saveToLocal = function(e) {
    cc.director.getScheduler().unscheduleAllForTarget(e);
    cc.director.getScheduler().schedule(function() {
      cc.sys.localStorage.setItem(e._$key, JSON.stringify(e));
    }
, e, 0, 0, 0, ! 1);
  }
;
  t.prototype.saveToServerAll = function() {
    var e = this;
    return this.sync? new Promise(function(t) {
      console.log("数据保存到服务器");
      var i = 0, n = 0;
      e.serverDatas.forEach(function(e) {
        e&& ++ n >= ++ i&& t();
      }
);
    }
): Promise.resolve();
  }
;
  t.prototype.get = function(e, t) {
    var i,
    n = this.prefix+ e,
    a = null !== (i = cc.sys.localStorage.getItem(n))&& void 0 !== i? i: null,
    o = null;
    if(a) try {
      o = JSON.parse(a);
    } catch(e) {
    }
    var r = null;
    this.serverDatas&& this.serverDatas[t]&& (r = this.serverDatas[t][n]);
    return null == o&& null == r? null: null == o? r: null == r? o: o._$version > r._$version? o: r;
  }
;
  return t;
}
(e("Singleton").default);
i.default = s;
cc._RF.pop();
