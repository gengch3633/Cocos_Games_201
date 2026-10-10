let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "6d3caB6suhJ/pUr6owURtmm", "LevelTableConfigManager");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = e("ConfigDataSys.js"),
      i = e("PlayerDataSys.js"),
      a = e("GameServiceMgr.js"),
      r = function () {
        function e() {
          this._levelTableConfigDataMap = new Map();
        }
        e.prototype.getLevelTableConfigByFileName = function (e) {
          var t = this;
          return new Promise(function (o, n) {
            t._levelTableConfigDataMap.has(e) ? o(t._levelTableConfigDataMap.get(e)) : a.default.GetGameLevelConfig(e, function (n) {
              t._levelTableConfigDataMap.set(e, n);
              o(n);
            }, function () {
              return n(null);
            });
          });
        };
        e.getInstance = function () {
          this._instance || (this._instance = new e());
          return this._instance;
        };
        e.prototype.getLevelTableConfigByLevelID = function (e) {
          var t = n.default.level_configMap.get(i.default.getConfigLevelID(e));
          return this.getLevelTableConfigByFileName(t.lv_file);
        };
        e._instance = null;
        return e;
      }();
    o.default = r.getInstance();
    cc._RF.pop();
