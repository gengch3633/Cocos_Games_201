const { ccclass } = cc._decorator;

@ccclass
export default class rollingItem extends cc.Component {
    rollingItem = null;
    node = null;
    icon = null;
    messageRichText = null;

    static URL = "db://assets/resources/prefabs/rollingItem.prefab";

    onLoad() {
        this.rollingItem = this.node;
        this.icon = this.rollingItem.getChildByName("icon");
        this.messageRichText = this.rollingItem.getChildByName("messageRichText");
    }
}
