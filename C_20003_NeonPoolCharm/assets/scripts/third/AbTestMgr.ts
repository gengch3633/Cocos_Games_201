class AbTestMgr {
    ab_props_num: any;
    ab_add_slot: any;
    ab_add_slot_price: any;
    ab_get_prop_2: any;

    static _instance: AbTestMgr = new AbTestMgr();

    init(data) {
        if (data) {
            const info = data.ab_info;
            if (info) {
                const ab_props_num = info.ab_props_num;
                const ab_add_slot = info.ab_add_slot;
                const ab_get_prop_2 = info.ab_get_prop_2;
                const ab_add_slot_price = info.ab_add_slot_price;
                this.ab_props_num = ab_props_num;
                this.ab_add_slot = ab_add_slot;
                this.ab_add_slot_price = ab_add_slot_price;
                this.ab_get_prop_2 = ab_get_prop_2;
            }
        }
    }

    static getInstance() {
        if (!this._instance) {
            this._instance = new AbTestMgr();
        }
        return this._instance;
    }
}

export default AbTestMgr.getInstance();
