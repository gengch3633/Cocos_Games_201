export class AbTestMgr {
    ab_props_num: string = null;
    ab_add_slot: string = null;
    ab_add_slot_price: string = null;
    ab_get_prop_2: string = null;

    init(data: any): void {
        if (data) {
            const abInfo = data.ab_info;
            if (abInfo) {
                this.ab_props_num = abInfo.ab_props_num;
                this.ab_add_slot = abInfo.ab_add_slot;
                this.ab_add_slot_price = abInfo.ab_add_slot_price;
                this.ab_get_prop_2 = abInfo.ab_get_prop_2;
            }
        }
    }

    static _instance: AbTestMgr = new AbTestMgr();

    static getInstance(): AbTestMgr {
        if (!this._instance) {
            this._instance = new AbTestMgr();
        }
        return this._instance;
    }
}
