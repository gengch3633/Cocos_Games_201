declare const i18n: { t(key: string, params?: any): string };

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

    private _bar_big_orign_w: number = null;
    private _bar_cur_orign_w: number = null;
    private _bar_less_orign_w: number = null;
    private _attriType: number = null;

    get attriType(): number {
        return this._attriType;
    }

    onLoad(): void {
        this._bar_big_orign_w = this.attri_progress_bar_big.width;
        this._bar_cur_orign_w = this.attri_progress_bar_cur.width;
        this._bar_less_orign_w = this.attri_progress_bar_less.width;
    }

    updateData(cur: number, target: number, hideCompare: boolean): void {
        this.attri_progress_bar_cur.width = this._bar_cur_orign_w * cur;
        this.attri_percenter.string = Math.floor(100 * cur) + "%";
        if (hideCompare) {
            this.attri_progress_bar_big.active = false;
            this.attri_progress_bar_less.active = false;
        } else if (cur >= target) {
            this.attri_progress_bar_big.active = false;
            this.attri_progress_bar_less.active = true;
            this.attri_progress_bar_less.width = this._bar_less_orign_w * cur;
            cc.tween(this.attri_progress_bar_less)
                .to(0.2, { width: this._bar_less_orign_w * target })
                .start();
        } else {
            this.attri_progress_bar_big.active = true;
            this.attri_progress_bar_less.active = false;
            this.attri_progress_bar_big.width = this._bar_big_orign_w * cur;
            cc.tween(this.attri_progress_bar_big)
                .to(0.2, { width: this._bar_big_orign_w * target })
                .start();
        }
    }

    initData(attriType: number, cur: number, target: number, hideCompare: boolean): void {
        this._attriType = attriType;
        this.attri_item_title.string = i18n.t("cuename_" + attriType);
        this.updateData(cur, target, hideCompare);
    }
}
