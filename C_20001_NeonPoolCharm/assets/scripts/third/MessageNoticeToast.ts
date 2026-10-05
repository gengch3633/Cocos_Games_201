const { ccclass } = cc._decorator;

@ccclass
export default class MessageNoticeToast extends cc.Component {
    MessageNoticeToast: cc.Node = null;
    content: cc.Node = null;
    icon_tips_fail: cc.Node = null;
    icon_tips_success: cc.Node = null;
    label_tips_top: cc.Node = null;
    label_tips_content: cc.Node = null;

    static URL = "db://assets/resources/prefabs/MessageNoticeToast.prefab";

    onLoad(): void {
        this.MessageNoticeToast = this.node;
        this.content = this.MessageNoticeToast.getChildByName("content");
        this.icon_tips_fail = this.content.getChildByName("icon_tips_fail");
        this.icon_tips_success = this.content.getChildByName("icon_tips_success");
        this.label_tips_top = this.content.getChildByName("label_tips_top");
        this.label_tips_content = this.content.getChildByName("label_tips_content");
    }
}
