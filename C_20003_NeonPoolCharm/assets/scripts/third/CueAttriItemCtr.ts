const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/CueAttriItemCtr")
export default class CueAttriItemCtr extends cc.Component {
    @property(cc.Label)
    attri_item_title = null;

    @property(cc.Label)
    attri_percenter = null;

    @property(cc.Node)
    attri_progress_bar_big = null;

    @property(cc.Node)
    attri_progress_bar_cur = null;

    @property(cc.Node)
    attri_progress_bar_less = null;

    _bar_big_orign_w = null;
    _bar_cur_orign_w = null;
    _bar_less_orign_w = null;
    _attriType = null;

    get attriType() {
        return this._attriType;
    }

    onLoad() {
        this._bar_big_orign_w = this.attri_progress_bar_big.width;
        this._bar_cur_orign_w = this.attri_progress_bar_cur.width;
        this._bar_less_orign_w = this.attri_progress_bar_less.width;
    }

    updateData(current, target, same) {
        this.attri_progress_bar_cur.width = this._bar_cur_orign_w * current;
        this.attri_percenter.string = Math.floor(100 * current) + "%";
        if (same) {
            this.attri_progress_bar_big.active = false;
            this.attri_progress_bar_less.active = false;
        } else if (current >= target) {
            this.attri_progress_bar_big.active = false;
            this.attri_progress_bar_less.active = true;
            this.attri_progress_bar_less.width = this._bar_less_orign_w * current;
            cc.tween(this.attri_progress_bar_less).to(.2, {
                width: this._bar_less_orign_w * target
            }).start();
        } else {
            this.attri_progress_bar_big.active = true;
            this.attri_progress_bar_less.active = false;
            this.attri_progress_bar_big.width = this._bar_big_orign_w * current;
            cc.tween(this.attri_progress_bar_big).to(.2, {
                width: this._bar_big_orign_w * target
            }).start();
        }
    }

    initData(type, current, target, same) {
        this._attriType = type;
        const title = i18n.t("cuename_" + type);
        this.attri_item_title.string = title;
        this.updateData(current, target, same);
    }
}
