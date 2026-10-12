const { ccclass } = cc._decorator;

@ccclass
export default class time extends cc.Component {
    start() {
        cc.game.addPersistRootNode(this.node);
    }

    update() {}
}