class AbTestMgr {
    ab_props_num: string = null;
    ab_add_slot: string = null;
    ab_add_slot_price: string = null;
    ab_get_prop_2: string = null;

    private static _instance: AbTestMgr = new AbTestMgr();

    init(data: { ab_info?: { ab_props_num?: string; ab_add_slot?: string; ab_get_prop_2?: string; ab_add_slot_price?: string } }): void {
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

    static getInstance(): AbTestMgr {
        if (!AbTestMgr._instance) {
            AbTestMgr._instance = new AbTestMgr();
        }
        return AbTestMgr._instance;
    }
}

export default AbTestMgr.getInstance();
