const { ccclass } = cc._decorator;

@ccclass
export default class RollingItem extends cc.Component {
    rollingItem: cc.Node = null;
    icon: cc.Node = null;
    messageRichText: cc.Node = null;

    static URL = "db://assets/resources/prefabs/rollingItem.prefab";

    onLoad(): void {
        this.rollingItem = this.node;
        this.icon = this.rollingItem.getChildByName("icon");
        this.messageRichText = this.rollingItem.getChildByName("messageRichText");
    }
}
