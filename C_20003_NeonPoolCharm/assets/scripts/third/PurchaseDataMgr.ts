export default class PurchaseDataMgr {
    _map_skuDetail = new Map();
    _cur_shop_id = "";
    _map_skuScence = null;
    _get_order_status_count = 0;
    _map_pay_finish = new Map();
    _set_repair = new Set();

    get set_repair() {
        return this._set_repair;
    }

    set set_repair(e) {
        this._set_repair = e;
    }

    get map_pay_finish() {
        return this._map_pay_finish;
    }

    set map_pay_finish(e) {
        this._map_pay_finish = e;
    }

    get get_order_status_count() {
        return this._get_order_status_count;
    }

    set get_order_status_count(e) {
        this._get_order_status_count = e;
    }

    get map_skuScence() {
        return this._map_skuScence;
    }

    set map_skuScence(e) {
        this._map_skuScence = e;
    }

    get map_skuDetail() {
        return this._map_skuDetail;
    }

    set map_skuDetail(e) {
        this._map_skuDetail = e;
    }

    get cur_shop_id() {
        return this._cur_shop_id;
    }

    set cur_shop_id(e) {
        this._cur_shop_id = e;
    }
}
