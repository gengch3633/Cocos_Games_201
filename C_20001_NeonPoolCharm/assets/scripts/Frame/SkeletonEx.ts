const { ccclass, property } = cc._decorator;

@ccclass("animationObj")
class AnimationObj {
    @property()
    name: string = "";

    @property()
    isLoop: boolean = false;
}

@ccclass
export default class SkeletonEx extends cc.Component {
    @property([AnimationObj])
    animationArray: AnimationObj[] = [];

    onLoad(): void {
        const skeleton = this.node.getComponent(sp.Skeleton);
        if (skeleton && this.animationArray.length > 0) {
            for (let i = 0; i < this.animationArray.length; i++) {
                const anim = this.animationArray[i];
                if (i === 0) {
                    skeleton.setAnimation(0, anim.name, anim.isLoop);
                } else {
                    skeleton.addAnimation(0, anim.name, anim.isLoop);
                }
            }
        }
    }
}
