import Tips from "./Tips";
import * as LanguageService from "./LanguageService";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("UI/Cocos/ClickClearLocalData")
export default class ClickClearLocalData extends cc.Component {
    @property
    clickCount = 5;

    onLoad(): void {
        let lastClickTime = 0;
        let consecutiveClicks = 0;

        this.node.on(
            cc.Node.EventType.TOUCH_END,
            () => {
                if (Date.now() - lastClickTime < 200) {
                    if (++consecutiveClicks >= this.clickCount) {
                        cc.sys.localStorage.clear();
                        if (cc.sys.isBrowser) {
                            location.reload();
                        }
                        Tips.show(LanguageService.t("key_tip_local_archive_cleared"));
                    }
                } else {
                    consecutiveClicks = 0;
                }
                lastClickTime = Date.now();
            },
            this,
        );
    }
}
