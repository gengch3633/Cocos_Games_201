const { ccclass } = cc._decorator;

@ccclass
export default class Time extends cc.Component {
    start() {
        cc.game.addPersistRootNode(this.node);
    }

    update() {}
}
