import LanguageService from "./LanguageService";
import Tips from "./Tips";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("UI/Cocos/ClickClearLocalData")
export default class ClickClearLocalData extends cc.Component {
    @property
    public clickCount: number = 5;

    protected onLoad(): void {
        let lastTouchTime = 0;
        let touchCount = 0;

        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (Date.now() - lastTouchTime < 200) {
                ++touchCount;

                if (touchCount >= this.clickCount) {
                    cc.sys.localStorage.clear();

                    if (cc.sys.isBrowser) {
                        location.reload();
                    }

                    Tips.show(LanguageService.t("key_tip_local_archive_cleared"));
                }
            } else {
                touchCount = 0;
            }

            lastTouchTime = Date.now();
        }, this);
    }
}