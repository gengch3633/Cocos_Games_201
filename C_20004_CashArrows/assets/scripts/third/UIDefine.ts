import UIMgr from "./UIMgr";

export enum UILayer {
    Scene = "Scene",
    Bottom = "Bottom",
    Middle = "Middle",
    Top = "Top",
    Tip = "Tip"
}

export default class UIDefine {
    public static HomeUI = new UIMgr.UIConfig("prefab/ui/homeUI", "lobby").setLayerName(UILayer.Bottom).setDestroyStrategy(UIMgr.DestroyStrategy.HideOnly);
    public static gameView = new UIMgr.UIConfig("prefab/gameView", "game").setLayerName(UILayer.Middle).setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    public static withMoodView = new UIMgr.UIConfig("prefab/withMoodView_v2", "ui").setLayerName(UILayer.Middle).setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    public static arrowTaskPopupView = new UIMgr.UIConfig("prefab/arrowTaskPopup", "ui").setLayerName(UILayer.Middle).setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    public static cashArrowSetView = new UIMgr.UIConfig("prefab/cashArrowSetView", "ui").setLayerName(UILayer.Top).setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    public static cashArrowSettingView = new UIMgr.UIConfig("prefab/cashArrowSettingView", "ui").setLayerName(UILayer.Top).setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    public static cashArrowCheckView = new UIMgr.UIConfig("prefab/cashArrowCheckView", "ui").setLayerName(UILayer.Top).setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    public static arrowSettleRewardView = new UIMgr.UIConfig("prefab/arrowSettleRewardView", "ui").setLayerName(UILayer.Top).setBackClosable(false).setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    public static cashArrowReviveView = new UIMgr.UIConfig("prefab/cashArrowReviveView", "ui").setLayerName(UILayer.Middle).setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    public static cashArrowFailView = new UIMgr.UIConfig("prefab/cashArrowFailView", "ui").setLayerName(UILayer.Middle).setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    public static netErrorView = new UIMgr.UIConfig("prefab/netErrorView", "ui").setLayerName(UILayer.Tip).setBackClosable(false).setMaskClickHide(false).setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
    public static appReviewView = new UIMgr.UIConfig("prefab/appReviewView", "ui").setLayerName(UILayer.Top).setDestroyStrategy(UIMgr.DestroyStrategy.DestroyOnly);
}