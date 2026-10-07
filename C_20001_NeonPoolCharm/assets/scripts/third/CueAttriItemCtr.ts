const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/CueAttriItemCtr")
export default class CueAttriItemCtr extends cc.Component {
    @property(cc.Label)
    attri_item_title: cc.Label = null;

    @property(cc.Label)
    attri_percenter: cc.Label = null;

    @property(cc.Node)
    attri_progress_bar_big: cc.Node = null;

    @property(cc.Node)
    attri_progress_bar_cur: cc.Node = null;

    @property(cc.Node)
    attri_progress_bar_less: cc.Node = null;

    _bar_big_orign_w = null;
    _bar_cur_orign_w = null;
    _bar_less_orign_w = null;
    _attriType = null;

    get attriType() {
        return this._attriType;
    }

    onLoad(): void {
        this._bar_big_orign_w = this.attri_progress_bar_big.width;
        this._bar_cur_orign_w = this.attri_progress_bar_cur.width;
        this._bar_less_orign_w = this.attri_progress_bar_less.width;
    }

    updateData(e: number, t: number, o: boolean): void {
        this.attri_progress_bar_cur.width = this._bar_cur_orign_w * e;
        this.attri_percenter.string = Math.floor(100 * e) + "%";
        if (o) {
            this.attri_progress_bar_big.active = false;
            this.attri_progress_bar_less.active = false;
        } else if (e >= t) {
            this.attri_progress_bar_big.active = false;
            this.attri_progress_bar_less.active = true;
            this.attri_progress_bar_less.width = this._bar_less_orign_w * e;
            cc.tween(this.attri_progress_bar_less).to(0.2, {
                width: this._bar_less_orign_w * t
            }).start();
        } else {
            this.attri_progress_bar_big.active = true;
            this.attri_progress_bar_less.active = false;
            this.attri_progress_bar_big.width = this._bar_big_orign_w * e;
            cc.tween(this.attri_progress_bar_big).to(0.2, {
                width: this._bar_big_orign_w * t
            }).start();
        }
    }

    initData(e: any, t: number, o: number, n: boolean): void {
        this._attriType = e;
        const i = i18n.t("cuename_" + e);
        this.attri_item_title.string = i;
        this.updateData(t, o, n);
    }
}
