import { failReason } from "./GameDataMgr";
import RecordReason from "./RecordReason";

declare const i18n: any;

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/RecordReasonCtrl")
export default class RecordReasonCtrl extends cc.Component {
    ui = null;

    static prefabUrl = "assets/resources/prefabs/RecordReason";
    static className = "RecordReasonCtrl";

    addButtonListen() {}

    onUILoad() {
        this.ui = this.node.addComponent(RecordReason);
    }

    initData(e) {
        if (e && 1 != e) {
            let t = "";
            switch (e) {
                case failReason.account_error:
                    t = i18n.t("status_brief_2");
                    break;
                case failReason.account_abnormal:
                    t = i18n.t("status_brief_3");
                    break;
                case failReason.merchat_exception:
                    t = i18n.t("status_brief_4");
                    break;
                case failReason.system_error:
                    t = i18n.t("status_brief_5");
                    break;
                case failReason.unknown_error:
                    t = i18n.t("status_brief_6");
            }
            const o = i18n.t("feedback_dialog_word_3") + " " + t;
            this.ui.label_tips.getComponent(cc.Label).string = o || "";
            const label: any = this.ui.label_tips.getComponent(cc.Label);
            label._forceUpdateRenderData && label._forceUpdateRenderData();
            this.fitTips();
        }
    }

    onLoad() {
        this.onUILoad();
        this.addButtonListen();
    }

    fitTips() {
        this.ui.node_rect.width = this.ui.label_tips.getContentSize().width + 50;
        this.ui.node_rect.x = this.ui.spr_jt.x - this.ui.node_rect.width / 2 + 50;
        this.ui.label_tips.x = this.ui.node_rect.x;
    }

    start() {}
}
