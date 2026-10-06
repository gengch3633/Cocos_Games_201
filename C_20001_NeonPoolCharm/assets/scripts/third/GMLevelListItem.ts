import { UiManager } from "./UiManage";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/GMLevelListItem")
export default class GMLevelListItem extends cc.Component {
    @property(cc.Label)
    item_name_label: cc.Label = null;

    onClickCB: ((item: GMLevelListItem) => void) = null;

    private _label: string = null;

    setLabel(label: string): void {
        this._label = label;
        if (this.item_name_label) {
            this.item_name_label.string = label;
        }
    }

    onClick(): void {
        if (this.onClickCB) {
            this.onClickCB(this);
        }
    }

    onLoad(): void {
        UiManager.addButtonListen(this.node, this.onClick, this);
    }

    onEnable(): void {
        if (this.item_name_label && this._label) {
            this.item_name_label.string = this._label;
        }
    }
}
