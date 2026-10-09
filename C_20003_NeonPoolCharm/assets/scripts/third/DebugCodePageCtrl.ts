import BasePageCtrl from "./BasePageCtrl";
import { GameConfigurations } from "./GameConfigurations";
import PageMgr from "./PageMgr";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/DebugCodePageCtrl")
export default class DebugCodePageCtrl extends BasePageCtrl {
    @property(cc.EditBox)
    editBox = null;

    static prefabUrl = "DebugCodePage";

    static className = "DebugCodePageCtrl";

    onOKButtonClick() {
        const e = this.editBox.string;
        const t = GameConfigurations.debugCode;
        this.hide();
        t.length > 0 && e === t && PageMgr.showPage("DebugPage");
    }
}
