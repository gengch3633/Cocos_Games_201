const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode()
export default class Scaler extends cc.Component {

    @property
    get maxWidth(): number {
        return this._maxWidth;
    }
    set maxWidth(e: number) {
        if (e !== this._maxWidth) {
            this._maxWidth = e;
            this._updateScale();
        }
    }

    @property
    get maxHeight(): number {
        return this._maxHeight;
    }
    set maxHeight(e: number) {
        if (e !== this._maxHeight) {
            this._maxHeight = e;
            this._updateScale();
        }
    }

    @property
    _maxWidth: number = 0;

    @property
    _maxHeight: number = 0;

    _updateScale() {
        let e = this.node.getContentSize();
        let t = this._maxWidth > 0 ? this._maxWidth / e.width : 1;
        let a = this._maxHeight > 0 ? this._maxHeight / e.height : 1;
        this.node.scale = Math.min(t, a);
    }

    onEnable() {
        this._updateScale();
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
    }

    onLoad() {
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
    }
}
