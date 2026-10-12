import { DestroyStrategy, UIConfig } from "./UIMgr";

export enum UILayer {
    Scene = "Scene",
    Bottom = "Bottom",
    Middle = "Middle",
    Top = "Top",
    Tip = "Tip"
}

export default class UIDefine {
    public static HomeUI = new UIConfig("prefab/ui/homeUI", "lobby").setLayerName(UILayer.Bottom).setDestroyStrategy(DestroyStrategy.HideOnly);
    public static gameView = new UIConfig("prefab/gameView", "game").setLayerName(UILayer.Middle).setDestroyStrategy(DestroyStrategy.DestroyOnly);
    public static withMoodView = new UIConfig("prefab/withMoodView_v2", "ui").setLayerName(UILayer.Middle).setDestroyStrategy(DestroyStrategy.DestroyOnly);
    public static arrowTaskPopupView = new UIConfig("prefab/arrowTaskPopup", "ui").setLayerName(UILayer.Middle).setDestroyStrategy(DestroyStrategy.DestroyOnly);
    public static cashArrowSetView = new UIConfig("prefab/cashArrowSetView", "ui").setLayerName(UILayer.Top).setDestroyStrategy(DestroyStrategy.DestroyOnly);
    public static cashArrowSettingView = new UIConfig("prefab/cashArrowSettingView", "ui").setLayerName(UILayer.Top).setDestroyStrategy(DestroyStrategy.DestroyOnly);
    public static cashArrowCheckView = new UIConfig("prefab/cashArrowCheckView", "ui").setLayerName(UILayer.Top).setDestroyStrategy(DestroyStrategy.DestroyOnly);
    public static arrowSettleRewardView = new UIConfig("prefab/arrowSettleRewardView", "ui").setLayerName(UILayer.Top).setBackClosable(false).setDestroyStrategy(DestroyStrategy.DestroyOnly);
    public static cashArrowReviveView = new UIConfig("prefab/cashArrowReviveView", "ui").setLayerName(UILayer.Middle).setDestroyStrategy(DestroyStrategy.DestroyOnly);
    public static cashArrowFailView = new UIConfig("prefab/cashArrowFailView", "ui").setLayerName(UILayer.Middle).setDestroyStrategy(DestroyStrategy.DestroyOnly);
    public static netErrorView = new UIConfig("prefab/netErrorView", "ui").setLayerName(UILayer.Tip).setBackClosable(false).setMaskClickHide(false).setDestroyStrategy(DestroyStrategy.DestroyOnly);
    public static appReviewView = new UIConfig("prefab/appReviewView", "ui").setLayerName(UILayer.Top).setDestroyStrategy(DestroyStrategy.DestroyOnly);
}