import * as GameDataMgr from "./GameDataMgr";
import RecordReason from "./RecordReason";

const { ccclass, menu } = cc._decorator;

const failReason = (GameDataMgr as any).failReason;

@ccclass
@menu("UI/prefabs/RecordReasonCtrl")
export default class RecordReasonCtrl extends cc.Component {
    static prefabUrl = "assets/resources/prefabs/RecordReason";
    static className = "RecordReasonCtrl";

    ui: RecordReason = null;

    addButtonListen(): void {}

    onUILoad(): void {
        this.ui = this.node.addComponent(RecordReason);
    }

    initData(reason: number): void {
        if (reason && reason != 1) {
            let brief = "";
            switch (reason) {
                case failReason.account_error:
                    brief = i18n.t("status_brief_2");
                    break;
                case failReason.account_abnormal:
                    brief = i18n.t("status_brief_3");
                    break;
                case failReason.merchat_exception:
                    brief = i18n.t("status_brief_4");
                    break;
                case failReason.system_error:
                    brief = i18n.t("status_brief_5");
                    break;
                case failReason.unknown_error:
                    brief = i18n.t("status_brief_6");
                    break;
            }
            const text = i18n.t("feedback_dialog_word_3") + " " + brief;
            const label = this.ui.label_tips.getComponent(cc.Label);
            label.string = text || "";
            label._forceUpdateRenderData && label._forceUpdateRenderData();
            this.fitTips();
        }
    }

    onLoad(): void {
        this.onUILoad();
        this.addButtonListen();
    }

    fitTips(): void {
        this.ui.node_rect.width = this.ui.label_tips.getContentSize().width + 50;
        this.ui.node_rect.x = this.ui.spr_jt.x - this.ui.node_rect.width / 2 + 50;
        this.ui.label_tips.x = this.ui.node_rect.x;
    }

    start(): void {}
}
