import LanguageService from "./LanguageService";
import Tips from "./Tips";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("UI/Cocos/ClickClearLocalData")
export default class ClickClearLocalData extends cc.Component {
    @property
    public clickCount: number = 5;

    protected onLoad(): void {
        let lastTime = 0;
        let clickTimes = 0;
        this.node.on(
            cc.Node.EventType.TOUCH_END,
            () => {
                if (Date.now() - lastTime < 200) {
                    if (++clickTimes >= this.clickCount) {
                        cc.sys.localStorage.clear();
                        if (cc.sys.isBrowser) {
                            location.reload();
                        }
                        Tips.show(LanguageService.t("key_tip_local_archive_cleared"));
                    }
                } else {
                    clickTimes = 0;
                }
                lastTime = Date.now();
            },
            this
        );
    }
}