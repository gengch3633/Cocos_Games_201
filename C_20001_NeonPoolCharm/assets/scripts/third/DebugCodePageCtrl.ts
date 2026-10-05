import { GameConfigurations } from "./GameConfigurations";
import BasePageCtrl from "./BasePageCtrl";
import PageMgr from "./PageMgr";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/DebugCodePageCtrl")
export default class DebugCodePageCtrl extends BasePageCtrl {
    static prefabUrl = "DebugCodePage";
    static className = "DebugCodePageCtrl";

    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    onOKButtonClick(): void {
        const code = this.editBox.string;
        const debugCode = GameConfigurations.debugCode;
        this.hide();
        if (debugCode.length > 0 && code === debugCode) {
            PageMgr.showPage("DebugPage");
        }
    }
}
