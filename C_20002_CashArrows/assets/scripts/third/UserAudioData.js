let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "19df6B3e11Bbb1Oyvsp2xjn", "UserAudioData");
var n = __extends;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var a = function(e) {
  function t() {
    var t = e.call(this, "UserAudio", 1)|| this;
    t.musicMute = ! 1;
    t.effectMute = ! 1;
    t.vibrate = ! 0;
    return t;
  }
  n(t, e);
  t.prototype.init = function() {
  }
;
  return t;
}
(e("UserArchive").default);
i.default = a;
cc._RF.pop();
