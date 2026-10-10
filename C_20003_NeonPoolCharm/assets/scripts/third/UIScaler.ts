const { ccclass, executeInEditMode, property } = cc._decorator;

@ccclass
@executeInEditMode()
export default class UIScaler extends cc.Component {
    @property
    get maxWidth() {
        return this._maxWidth;
    }

    set maxWidth(e) {
        if (e !== this._maxWidth) {
            this._maxWidth = e;
            this._updateScale();
        }
    }

    @property
    get maxHeight() {
        return this._maxHeight;
    }

    set maxHeight(e) {
        if (e !== this._maxHeight) {
            this._maxHeight = e;
            this._updateScale();
        }
    }

    @property
    _maxWidth = 0;

    @property
    _maxHeight = 0;

    onLoad() {
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
    }

    _updateScale() {
        const e = this.node.getContentSize();
        const t = this._maxWidth > 0 ? this._maxWidth / e.width : 1;
        const o = this._maxHeight > 0 ? this._maxHeight / e.height : 1;
        this.node.scale = Math.min(t, o);
    }

    onEnable() {
        this._updateScale();
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
    }
}
