const { ccclass } = cc._decorator;

@ccclass
export default class resize extends cc.Component {
    onLoad(): void {
        const winSize = cc.winSize;
        console.log(winSize);
        this.node.height = winSize.height;
    }
}
