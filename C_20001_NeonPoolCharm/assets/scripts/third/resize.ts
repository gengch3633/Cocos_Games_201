const { ccclass } = cc._decorator;

@ccclass
export default class Resize extends cc.Component {
    onLoad(): void {
        const e = cc.winSize;
        console.log(e);
        this.node.height = e.height;
    }
}
