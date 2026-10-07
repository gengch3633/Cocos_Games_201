const { ccclass, executeInEditMode, property } = cc._decorator;

@ccclass
@executeInEditMode()
export default class UIScaler extends cc.Component {
    @property
    _maxWidth = 0;

    @property
    _maxHeight = 0;

    @property({})
    get maxWidth(): number {
        return this._maxWidth;
    }

    set maxWidth(val: number) {
        if (val !== this._maxWidth) {
            this._maxWidth = val;
            this._updateScale();
        }
    }

    @property({})
    get maxHeight(): number {
        return this._maxHeight;
    }

    set maxHeight(val: number) {
        if (val !== this._maxHeight) {
            this._maxHeight = val;
            this._updateScale();
        }
    }

    onLoad(): void {
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
    }

    _updateScale(): void {
        const size = this.node.getContentSize();
        const scaleX = this._maxWidth > 0 ? this._maxWidth / size.width : 1;
        const scaleY = this._maxHeight > 0 ? this._maxHeight / size.height : 1;
        this.node.scale = Math.min(scaleX, scaleY);
    }

    onEnable(): void {
        this._updateScale();
    }

    onDestroy(): void {
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
    }
}
