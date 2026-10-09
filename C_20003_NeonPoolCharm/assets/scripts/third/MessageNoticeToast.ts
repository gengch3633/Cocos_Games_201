const { ccclass } = cc._decorator;

@ccclass
export default class MessageNoticeToast extends cc.Component {
    MessageNoticeToast = null;
    node = null;
    content = null;
    icon_tips_fail = null;
    icon_tips_success = null;
    label_tips_top = null;
    label_tips_content = null;

    static URL = "db://assets/resources/prefabs/MessageNoticeToast.prefab";

    onLoad() {
        this.MessageNoticeToast = this.node;
        this.content = this.MessageNoticeToast.getChildByName("content");
        this.icon_tips_fail = this.content.getChildByName("icon_tips_fail");
        this.icon_tips_success = this.content.getChildByName("icon_tips_success");
        this.label_tips_top = this.content.getChildByName("label_tips_top");
        this.label_tips_content = this.content.getChildByName("label_tips_content");
    }
}
