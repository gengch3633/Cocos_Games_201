const { ccclass, executeInEditMode, property } = cc._decorator;

@ccclass
@executeInEditMode
export default class Scaler extends cc.Component {
    @property
    _maxWidth: number = 0;

    @property
    _maxHeight: number = 0;

    @property
    get maxWidth(): number {
        return this._maxWidth;
    }

    set maxWidth(value: number) {
        if (value !== this._maxWidth) {
            this._maxWidth = value;
            this._updateScale();
        }
    }

    @property
    get maxHeight(): number {
        return this._maxHeight;
    }

    set maxHeight(value: number) {
        if (value !== this._maxHeight) {
            this._maxHeight = value;
            this._updateScale();
        }
    }

    onLoad(): void {
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
    }

    onEnable(): void {
        this._updateScale();
    }

    onDestroy(): void {
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
    }

    _updateScale(): void {
        const size = this.node.getContentSize();
        const scaleX = this._maxWidth > 0 ? this._maxWidth / size.width : 1;
        const scaleY = this._maxHeight > 0 ? this._maxHeight / size.height : 1;
        this.node.scale = Math.min(scaleX, scaleY);
    }
}
