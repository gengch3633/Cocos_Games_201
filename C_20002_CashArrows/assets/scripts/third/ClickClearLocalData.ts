import Tips from "./Tips";
import LanguageService from "./LanguageService";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu(" UI/ Cocos/ ClickClearLocalData ")
export default class ClickClearLocalData extends cc.Component {
    @property
    clickCount: number = 5;

    onLoad() {
        var e = this, t = 0, i = 0;
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            Date.now() - t < 200 ? ++i >= e.clickCount && (cc.sys.localStorage.clear(), cc.sys.isBrowser && location.reload(),
                Tips.show(LanguageService.t(" key_tip_local_archive_cleared "))) : i = 0;
            t = Date.now();
        }, this);
    }
}
