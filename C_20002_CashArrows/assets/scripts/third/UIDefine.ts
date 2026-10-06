// @ts-nocheck
import * as UIMgr from "./UIMgr";

export enum UILayer {
    Scene = "Scene",
    Bottom = "Bottom",
    Middle = "Middle",
    Top = "Top",
    Tip = "Tip",
}

const UIDefine = (function () {
    function e() {}
    e.HomeUI = new UIMgr.UIConfig("prefab/ui/homeUI", "lobby")
        .setLayerName(UILayer.Bottom)
        .setDestroyStrategy(UIMgr.DestroyStrategy.HideOnly);
    e.gameView = new UIMgr.UIConfig("prefab/gameView", "game")
        .setLayerName(UILayer.Middle)
        .setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    e.withMoodView = new UIMgr.UIConfig("prefab/withMoodView_v2", "ui")
        .setLayerName(UILayer.Middle)
        .setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    e.arrowTaskPopupView = new UIMgr.UIConfig("prefab/arrowTaskPopup", "ui")
        .setLayerName(UILayer.Middle)
        .setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    e.cashArrowSetView = new UIMgr.UIConfig("prefab/cashArrowSetView", "ui")
        .setLayerName(UILayer.Top)
        .setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    e.cashArrowSettingView = new UIMgr.UIConfig("prefab/cashArrowSettingView", "ui")
        .setLayerName(UILayer.Top)
        .setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    e.cashArrowCheckView = new UIMgr.UIConfig("prefab/cashArrowCheckView", "ui")
        .setLayerName(UILayer.Top)
        .setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    e.arrowSettleRewardView = new UIMgr.UIConfig("prefab/arrowSettleRewardView", "ui")
        .setLayerName(UILayer.Top)
        .setBackClosable(false)
        .setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    e.cashArrowReviveView = new UIMgr.UIConfig("prefab/cashArrowReviveView", "ui")
        .setLayerName(UILayer.Middle)
        .setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    e.cashArrowFailView = new UIMgr.UIConfig("prefab/cashArrowFailView", "ui")
        .setLayerName(UILayer.Middle)
        .setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    e.netErrorView = new UIMgr.UIConfig("prefab/netErrorView", "ui")
        .setLayerName(UILayer.Tip)
        .setBackClosable(false)
        .setMaskClickHide(false)
        .setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    e.appReviewView = new UIMgr.UIConfig("prefab/appReviewView", "ui")
        .setLayerName(UILayer.Top)
        .setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    return e;
})();

export default UIDefine;
