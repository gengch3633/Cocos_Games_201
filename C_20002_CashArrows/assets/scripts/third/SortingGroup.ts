import { ORDER_IN_LAYER_MAX, SortingLayer } from "./sortingDefine";

const { ccclass, property, disallowMultiple, executeInEditMode, menu } = cc._decorator;

@ccclass
@menu(" UI/ Cocos/ SortingGroup ")
@disallowMultiple()
@executeInEditMode
export class SortingGroup extends cc.Component {
    @property({
        type: cc.Enum(SortingLayer)
    })
    _sortingLayer = SortingLayer.DEFAULT;

    @property({
        type: cc.Float,
        min: 0,
        max: ORDER_IN_LAYER_MAX
    })
    _orderInLayer = 0;

    @property({
        type: cc.Enum(SortingLayer)
    })
    get sortingLayer() {
        return this._sortingLayer;
    }

    set sortingLayer(value: any) {
        this._sortingLayer = value;
        this.node.sortingPriority = Math.sign(this._sortingLayer) * (Math.abs(this._sortingLayer) * ORDER_IN_LAYER_MAX + this._orderInLayer);
    }

    @property({
        type: cc.Float,
        min: 0,
        max: ORDER_IN_LAYER_MAX
    })
    get orderInLayer() {
        return this._orderInLayer;
    }

    set orderInLayer(value: number) {
        this._orderInLayer = value;
        this.node.sortingPriority = Math.sign(this._sortingLayer) * (Math.abs(this._sortingLayer) * ORDER_IN_LAYER_MAX + this._orderInLayer);
    }

    onEnable() {
        this.node.sortingPriority = Math.sign(this._sortingLayer) * (Math.abs(this._sortingLayer) * ORDER_IN_LAYER_MAX + this._orderInLayer);
        this.node.sortingEnabled = true;
    }

    onDisable() {
        this.node.sortingPriority = 0;
        this.node.sortingEnabled = false;
    }
}
