let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "ddc8b+ujgBNlpp+mV+Ohkd1", "LoadingSceneProgressAdapter");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
  }
  e.prototype.preloadTextures = function() {
  }
;
  e.prototype.preloadScene = function(e, t, i) {
    cc.director.preloadScene(e, t, i);
  }
;
  e.prototype.getLoadingTasks = function() {
    return[];
  }
;
  e.prototype.loadTask = function(e, t) {
    return __awaiter(this, void 0, void 0, function() {
      return __generator(this, function() {
        t(1, 1);
        return[2];
      }
);
    }
);
  }
;
  e.prototype.isDebug = function() {
    return ! 1;
  }
;
  return e;
}
(),
a = function() {
  function e() {
  }
  e.setImplementation = function(e) {
    this.implementation = e|| new n();
  }
;
  e.getImplementation = function() {
    return this.implementation;
  }
;
  e.implementation = new n();
  return e;
}
();
i.default = a;
cc._RF.pop();
