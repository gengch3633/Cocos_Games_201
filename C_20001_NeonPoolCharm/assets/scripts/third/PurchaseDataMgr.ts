export default class PurchaseDataMgr {
    private _map_skuDetail = new Map<string, unknown>();
    private _cur_shop_id = "";
    private _map_skuScence: Map<string, unknown> = null;
    private _get_order_status_count = 0;
    private _map_pay_finish = new Map<string, unknown>();
    private _set_repair = new Set<string>();

    get set_repair(): Set<string> {
        return this._set_repair;
    }

    set set_repair(value: Set<string>) {
        this._set_repair = value;
    }

    get map_pay_finish(): Map<string, unknown> {
        return this._map_pay_finish;
    }

    set map_pay_finish(value: Map<string, unknown>) {
        this._map_pay_finish = value;
    }

    get get_order_status_count(): number {
        return this._get_order_status_count;
    }

    set get_order_status_count(value: number) {
        this._get_order_status_count = value;
    }

    get map_skuScence(): Map<string, unknown> {
        return this._map_skuScence;
    }

    set map_skuScence(value: Map<string, unknown>) {
        this._map_skuScence = value;
    }

    get map_skuDetail(): Map<string, unknown> {
        return this._map_skuDetail;
    }

    set map_skuDetail(value: Map<string, unknown>) {
        this._map_skuDetail = value;
    }

    get cur_shop_id(): string {
        return this._cur_shop_id;
    }

    set cur_shop_id(value: string) {
        this._cur_shop_id = value;
    }
}
