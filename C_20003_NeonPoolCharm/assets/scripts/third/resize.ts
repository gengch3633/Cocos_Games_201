const { ccclass } = cc._decorator;

@ccclass
export default class resize extends cc.Component {
    onLoad() {
        const e = cc.winSize;
        console.log(e);
        this.node.height = e.height;
    }
}
