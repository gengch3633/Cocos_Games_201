let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "a9309iQgVhCp5EQq3FLi3WU", "UIDefine");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
i.UILayer = void 0;
var n,
a = e(UIMgr "
} ].js);
(function(e) {
e.Scene = " Scene ";
e.Bottom = " Bottom ";
e.Middle = " Middle ";
e.Top = " Top ";
e.Tip = " Tip ";
})(n = i.UILayer || (i.UILayer = {}));
var o = function() {
function e() {}
e.HomeUI = new a.UIConfig(" prefab/ ui/ homeUI ", " lobby ").setLayerName(n.Bottom).setDestroyStrategy(a.DestroyStrategy.HideOnly);
e.gameView = new a.UIConfig(" prefab/ gameView ", " game ").setLayerName(n.Middle).setDestroyStrategy(a.DestroyStrategy.DestroyOnly);
e.withMoodView = new a.UIConfig(" prefab/ withMoodView_v2 ", " ui ").setLayerName(n.Middle).setDestroyStrategy(a.DestroyStrategy.DestroyOnly);
e.arrowTaskPopupView = new a.UIConfig(" prefab/ arrowTaskPopup ", " ui ").setLayerName(n.Middle).setDestroyStrategy(a.DestroyStrategy.DestroyOnly);
e.cashArrowSetView = new a.UIConfig(" prefab/ cashArrowSetView ", " ui ").setLayerName(n.Top).setDestroyStrategy(a.DestroyStrategy.DestroyOnly);
e.cashArrowSettingView = new a.UIConfig(" prefab/ cashArrowSettingView ", " ui ").setLayerName(n.Top).setDestroyStrategy(a.DestroyStrategy.DestroyOnly);
e.cashArrowCheckView = new a.UIConfig(" prefab/ cashArrowCheckView ", " ui ").setLayerName(n.Top).setDestroyStrategy(a.DestroyStrategy.DestroyOnly);
e.arrowSettleRewardView = new a.UIConfig(" prefab/ arrowSettleRewardView ", " ui ").setLayerName(n.Top).setBackClosable(!1).setDestroyStrategy(a.DestroyStrategy.DestroyOnly);
e.cashArrowReviveView = new a.UIConfig(" prefab/ cashArrowReviveView ", " ui ").setLayerName(n.Middle).setDestroyStrategy(a.DestroyStrategy.DestroyOnly);
e.cashArrowFailView = new a.UIConfig(" prefab/ cashArrowFailView ", " ui ").setLayerName(n.Middle).setDestroyStrategy(a.DestroyStrategy.DestroyOnly);
e.netErrorView = new a.UIConfig(" prefab/ netErrorView ", " ui ").setLayerName(n.Tip).setBackClosable(!1).setMaskClickHide(!1).setDestroyStrategy(a.DestroyStrategy.DestroyOnly);
e.appReviewView = new a.UIConfig(" prefab/ appReviewView ", " ui ").setLayerName(n.Top).setDestroyStrategy(a.DestroyStrategy.DestroyOnly);
return e;
}();
i.default = o;
cc._RF.pop();
