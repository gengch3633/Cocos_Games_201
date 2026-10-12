import * as sortingDefine from "./sortingDefine";

const { ccclass, property, disallowMultiple, executeInEditMode, menu } = cc._decorator;

@ccclass
@menu("UI/Cocos/SortingGroup")
@disallowMultiple
@executeInEditMode
export default class SortingGroup extends cc.Component {
    @property({ type: cc.Enum(sortingDefine.SortingLayer) })
    private _sortingLayer: sortingDefine.SortingLayer = sortingDefine.SortingLayer.DEFAULT;

    @property({ type: cc.Float, min: 0, max: sortingDefine.ORDER_IN_LAYER_MAX })
    private _orderInLayer: number = 0;

    @property({ type: cc.Enum(sortingDefine.SortingLayer) })
    public get sortingLayer(): sortingDefine.SortingLayer {
        return this._sortingLayer;
    }

    public set sortingLayer(value: sortingDefine.SortingLayer) {
        this._sortingLayer = value;
        this.node.sortingPriority = Math.sign(this._sortingLayer) * (Math.abs(this._sortingLayer) * sortingDefine.ORDER_IN_LAYER_MAX + this._orderInLayer);
    }

    @property({ type: cc.Float, min: 0, max: sortingDefine.ORDER_IN_LAYER_MAX })
    public get orderInLayer(): number {
        return this._orderInLayer;
    }

    public set orderInLayer(value: number) {
        this._orderInLayer = value;
        this.node.sortingPriority = Math.sign(this._sortingLayer) * (Math.abs(this._sortingLayer) * sortingDefine.ORDER_IN_LAYER_MAX + this._orderInLayer);
    }

    protected onEnable(): void {
        this.node.sortingPriority = Math.sign(this._sortingLayer) * (Math.abs(this._sortingLayer) * sortingDefine.ORDER_IN_LAYER_MAX + this._orderInLayer);
        this.node.sortingEnabled = true;
    }

    protected onDisable(): void {
        this.node.sortingPriority = 0;
        this.node.sortingEnabled = false;
    }
}