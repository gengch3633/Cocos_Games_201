const { ccclass, executeInEditMode, menu, property } = cc._decorator;

@ccclass
@executeInEditMode()
@menu("i18n/LocalizedLabel")
export default class LocalizedLabel extends cc.Component {
    @property
    _dataID = "";

    @property({})
    get dataID(): string {
        return this._dataID;
    }

    set dataID(val: string) {
        if (this._dataID !== val) {
            this._dataID = val;
            this.updateLabel();
        }
    }

    label: cc.Label = null;
    editBox: cc.EditBox = null;
    richText: cc.RichText = null;

    updateLabel(): void {
        if (this.label || this.editBox || this.richText) {
            const text = i18n.t(this.dataID);
            if (text) {
                if (this.label) {
                    this.label.string = text;
                }
                if (this.editBox) {
                    this.editBox.placeholder = text;
                }
                if (this.richText) {
                    this.richText.string = text;
                }
            }
        } else {
            cc.error("Failed to update localized label, label or editbox component is invalid!");
        }
    }

    fetchRender(): void {
        const label = this.getComponent(cc.Label);
        if (label) {
            this.label = label;
        }
        const editBox = this.getComponent(cc.EditBox);
        if (editBox) {
            this.editBox = editBox;
        }
        const richText = this.getComponent(cc.RichText);
        if (richText) {
            this.richText = richText;
        }
        this.updateLabel();
    }

    onLoad(): void {
        if (!i18n.inst) {
            i18n.init();
        }
        this.fetchRender();
    }
}
