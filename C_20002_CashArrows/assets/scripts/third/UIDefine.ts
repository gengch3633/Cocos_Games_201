import { DestroyStrategy, UIConfig } from "./UIMgr";

export enum UILayer {
    Scene = " Scene ",
    Bottom = " Bottom ",
    Middle = " Middle ",
    Top = " Top ",
    Tip = " Tip "
}

export default class UIDefine {
    static HomeUI = new UIConfig(" prefab/ ui/ homeUI ", " lobby ")
        .setLayerName(UILayer.Bottom)
        .setDestroyStrategy(DestroyStrategy.HideOnly);

    static gameView = new UIConfig(" prefab/ gameView ", " game ")
        .setLayerName(UILayer.Middle)
        .setDestroyStrategy(DestroyStrategy.DestroyOnly);

    static withMoodView = new UIConfig(" prefab/ withMoodView_v2 ", " ui ")
        .setLayerName(UILayer.Middle)
        .setDestroyStrategy(DestroyStrategy.DestroyOnly);

    static arrowTaskPopupView = new UIConfig(" prefab/ arrowTaskPopup ", " ui ")
        .setLayerName(UILayer.Middle)
        .setDestroyStrategy(DestroyStrategy.DestroyOnly);

    static cashArrowSetView = new UIConfig(" prefab/ cashArrowSetView ", " ui ")
        .setLayerName(UILayer.Top)
        .setDestroyStrategy(DestroyStrategy.DestroyOnly);

    static cashArrowSettingView = new UIConfig(" prefab/ cashArrowSettingView ", " ui ")
        .setLayerName(UILayer.Top)
        .setDestroyStrategy(DestroyStrategy.DestroyOnly);

    static cashArrowCheckView = new UIConfig(" prefab/ cashArrowCheckView ", " ui ")
        .setLayerName(UILayer.Top)
        .setDestroyStrategy(DestroyStrategy.DestroyOnly);

    static arrowSettleRewardView = new UIConfig(" prefab/ arrowSettleRewardView ", " ui ")
        .setLayerName(UILayer.Top)
        .setBackClosable(false)
        .setDestroyStrategy(DestroyStrategy.DestroyOnly);

    static cashArrowReviveView = new UIConfig(" prefab/ cashArrowReviveView ", " ui ")
        .setLayerName(UILayer.Middle)
        .setDestroyStrategy(DestroyStrategy.DestroyOnly);

    static cashArrowFailView = new UIConfig(" prefab/ cashArrowFailView ", " ui ")
        .setLayerName(UILayer.Middle)
        .setDestroyStrategy(DestroyStrategy.DestroyOnly);

    static netErrorView = new UIConfig(" prefab/ netErrorView ", " ui ")
        .setLayerName(UILayer.Tip)
        .setBackClosable(false)
        .setMaskClickHide(false)
        .setDestroyStrategy(DestroyStrategy.DestroyOnly);

    static appReviewView = new UIConfig(" prefab/ appReviewView ", " ui ")
        .setLayerName(UILayer.Top)
        .setDestroyStrategy(DestroyStrategy.DestroyOnly);
}
