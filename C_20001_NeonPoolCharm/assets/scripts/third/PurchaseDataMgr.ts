class PurchaseDataMgr {
    private _map_skuDetail = new Map<any, any>();
    private _cur_shop_id = "";
    private _map_skuScence: Map<any, any> = null;
    private _get_order_status_count = 0;
    private _map_pay_finish = new Map<any, any>();
    private _set_repair = new Set<any>();

    get set_repair(): Set<any> {
        return this._set_repair;
    }

    set set_repair(e: Set<any>) {
        this._set_repair = e;
    }

    get map_pay_finish(): Map<any, any> {
        return this._map_pay_finish;
    }

    set map_pay_finish(e: Map<any, any>) {
        this._map_pay_finish = e;
    }

    get get_order_status_count(): number {
        return this._get_order_status_count;
    }

    set get_order_status_count(e: number) {
        this._get_order_status_count = e;
    }

    get map_skuScence(): Map<any, any> {
        return this._map_skuScence;
    }

    set map_skuScence(e: Map<any, any>) {
        this._map_skuScence = e;
    }

    get map_skuDetail(): Map<any, any> {
        return this._map_skuDetail;
    }

    set map_skuDetail(e: Map<any, any>) {
        this._map_skuDetail = e;
    }

    get cur_shop_id(): string {
        return this._cur_shop_id;
    }

    set cur_shop_id(e: string) {
        this._cur_shop_id = e;
    }
}

export default PurchaseDataMgr;
