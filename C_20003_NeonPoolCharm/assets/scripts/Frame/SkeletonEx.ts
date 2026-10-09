const { ccclass, property } = cc._decorator;

@ccclass("animationObj")
class animationObj {

    @property()
    name: string = "";

    @property()
    isLoop: boolean = false;
}

@ccclass
export default class SkeletonEx extends cc.Component {

    @property([animationObj])
    animationArray: animationObj[] = [];

    onLoad() {
        let e = this.node.getComponent(sp.Skeleton);
        if (e && this.animationArray.length > 0) {
            for (let t = 0; t < this.animationArray.length; t++) {
                let a = this.animationArray[t];
                if (0 == t) {
                    e.setAnimation(0, a.name, a.isLoop);
                } else {
                    e.addAnimation(0, a.name, a.isLoop);
                }
            }
        }
    }
}
