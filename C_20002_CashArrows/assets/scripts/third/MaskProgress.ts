const { ccclass, property, menu } = cc._decorator;

export enum Direction {
    HORIZONTAL = 0,
    VERTICAL = 1
}

@ccclass
@menu("UI/Cocos/MaskProgress")
export default class MaskProgress extends cc.Component {
    @property(cc.Node)
    iconFolowed: cc.Node = null;

    @property(cc.Label)
    labelProgress: cc.Label = null;

    @property({
        type: cc.Enum(Direction)
    })
    direction: Direction = Direction.HORIZONTAL;

    @property(cc.Mask)
    mask: cc.Mask = null;

    @property
    _progress: number = 0;

    @property({
        min: 0,
        max: 1,
        slide: true
    })
    get progress(): number {
        return this._progress;
    }

    set progress(value: number) {
        value = Math.max(0, Math.min(1, value));
        if (this._progress != value) {
            this._progress = value;
            if (this.direction == Direction.VERTICAL) {
                this.mask.node.height = Math.floor(value * this.node.height);
                if (this.iconFolowed) {
                    this.iconFolowed.y = this.mask.node.y + this.mask.node.height;
                }
            } else {
                this.mask.node.width = Math.floor(value * this.node.width);
                if (this.iconFolowed) {
                    this.iconFolowed.x = this.mask.node.x + this.mask.node.width;
                }
            }
            if (this.labelProgress) {
                this.labelProgress.string = Math.floor(100 * value) + "%";
            }
        }
    }
}
