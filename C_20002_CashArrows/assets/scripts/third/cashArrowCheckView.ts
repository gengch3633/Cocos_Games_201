import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import Tips from "./Tips";
import UIMgr from "./UIMgr";

const DEFAULT_FIELDS = [
    { field_value: "account", field_value_translate: "account", field_desc: "account", fail_desc: "account" },
    { field_value: "payee_name", field_value_translate: "name", field_desc: "name", fail_desc: "name" },
];

const { ccclass } = cc._decorator;

@ccclass
export default class CashArrowCheckView extends cc.Component {
    selectedOpt: any = null;
    channelData: any = null;
    bindInfo: any = null;
    onRevise: ((info: any) => void) | null = null;
    onWithdraw: ((info: any, opt: any, done?: () => void) => boolean | void) | null = null;
    onClose: (() => void) | null = null;
    isSubmitting = false;
    channelPreviewLoadVersion = 0;
    channelPreviewFrameCache: { [url: string]: cc.SpriteFrame } = {};
    fieldDisplayRows: cc.Node[] = [];
    fieldValueRows: cc.Node[] = [];
    extraFieldRows: cc.Node[] = [];

    private btnClose: cc.Node | null = null;
    private btnWithdraw: cc.Node | null = null;
    private btnRevise: cc.Node | null = null;
    private panelNode: cc.Node | null = null;
    private infoNode: cc.Node | null = null;
    private maskNode: cc.Node | null = null;
    private lblTitle: cc.Label | null = null;
    private lblWithdrawBtn: cc.Label | null = null;
    private fieldLabelTemplateA: cc.Node | null = null;
    private fieldLabelTemplateB: cc.Node | null = null;
    private fieldValueNodeA: cc.Node | null = null;
    private fieldValueNodeB: cc.Node | null = null;
    private channelPreviewNode: cc.Node | null = null;
    private channelPreviewSprite: cc.Sprite | null = null;
    private defaultChannelPreviewFrame: cc.SpriteFrame | null = null;
    private baseRowCount = 0;
    private fieldTitleRowGap = -116;
    private fieldValueOffset = -60;

    onLoad(): void {
        this.bindNodes();
        this.bindEvents();
        this.bindLanguageEvent();
    }

    onDestroy(): void {
        this.unbindLanguageEvent();
        this.unbindEvents();
        this.clearExtraFieldRows();
        this.channelPreviewLoadVersion += 1;
    }

    bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    onLanguageChanged(): void {
        this.refreshUI();
    }

    setEntryData(data: any): void {
        if (data) {
            this.selectedOpt = data.selectedOpt || null;
            this.channelData = data.channelData || null;
            this.bindInfo = data.bindInfo || null;
            if (!this.bindInfo && Array.isArray(data.txBindInfo) && data.txBindInfo.length > 0) {
                this.bindInfo = data.txBindInfo[0];
            }
            this.onRevise = typeof data.onRevise === "function" ? data.onRevise : null;
            this.onWithdraw = typeof data.onWithdraw === "function" ? data.onWithdraw : null;
            this.onClose = typeof data.onClose === "function" ? data.onClose : null;
            this.refreshUI();
        }
    }

    bindNodes(): void {
        this.btnClose = this.findNodeDeep(this.node, "btn_close");
        this.btnWithdraw = this.findNodeDeep(this.node, "btn_withdraw");
        this.btnRevise = this.findNodeDeep(this.node, "btn_revise");
        this.panelNode = this.findNodeDeep(this.node, "block_panel") || this.findNodeDeep(this.node, "panel");
        this.infoNode = this.findNodeDeep(this.node, "info");
        this.maskNode = this.findNodeDeep(this.node, "mask");
        this.lblTitle = this.findLabelDeep(this.node, "txt_enter_account_details");
        this.lblWithdrawBtn = this.findLabelDeep(this.node, "txt_withdraw_btn");
        this.fieldLabelTemplateA = this.findNodeDeep(this.node, "txt_input_account");
        this.fieldLabelTemplateB = this.findNodeDeep(this.node, "txt_input_username");
        this.fieldValueNodeA = this.findNodeDeep(this.node, "txt_account_value");
        this.fieldValueNodeB = this.findNodeDeep(this.node, "txt_username_value");
        this.channelPreviewNode = this.findNodeDeep(this.node, "img_channel_preview") || this.btnRevise;
        this.channelPreviewSprite = this.channelPreviewNode ? this.channelPreviewNode.getComponent(cc.Sprite) : null;
        this.defaultChannelPreviewFrame = this.channelPreviewSprite ? this.channelPreviewSprite.spriteFrame : null;
        this.fieldDisplayRows = [];
        this.fieldValueRows = [];
        if (this.fieldLabelTemplateA) {
            this.fieldDisplayRows.push(this.fieldLabelTemplateA);
        }
        if (this.fieldValueNodeA) {
            this.fieldValueRows.push(this.fieldValueNodeA);
        }
        if (this.fieldLabelTemplateB) {
            this.fieldDisplayRows.push(this.fieldLabelTemplateB);
        }
        if (this.fieldValueNodeB) {
            this.fieldValueRows.push(this.fieldValueNodeB);
        }
        this.baseRowCount = this.fieldDisplayRows.length;
        if (this.fieldLabelTemplateB && this.fieldLabelTemplateA) {
            this.fieldTitleRowGap = this.fieldLabelTemplateB.y - this.fieldLabelTemplateA.y;
        }
        if (this.fieldValueNodeA && this.fieldLabelTemplateA) {
            this.fieldValueOffset = this.fieldValueNodeA.y - this.fieldLabelTemplateA.y;
        }
    }

    clearExtraFieldRows(): void {
        while (this.extraFieldRows.length > 0) {
            const row = this.extraFieldRows.pop();
            row?.destroy();
        }
    }

    bindEvents(): void {
        this.btnClose?.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.btnWithdraw?.on(cc.Node.EventType.TOUCH_END, this.onClickWithdraw, this);
        this.btnRevise?.on(cc.Node.EventType.TOUCH_END, this.onClickRevise, this);
        this.maskNode?.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    }

    unbindEvents(): void {
        this.btnClose?.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.btnWithdraw?.off(cc.Node.EventType.TOUCH_END, this.onClickWithdraw, this);
        this.btnRevise?.off(cc.Node.EventType.TOUCH_END, this.onClickRevise, this);
        this.maskNode?.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    }

    refreshUI(): void {
        const info = this.bindInfo;
        if (info) {
            if (this.lblTitle) {
                this.lblTitle.string = this.i18n("key_cash_check_title", null, "Confirm Withdrawal Information");
            }
            if (this.lblWithdrawBtn) {
                this.lblWithdrawBtn.string = this.i18n("key_cash_check_withdraw_btn", null, "提现");
            }
            if (this.btnRevise) {
                this.btnRevise.active = !!this.onRevise;
            }
            this.refreshFieldDisplay(info);
            this.refreshChannelPreview(info);
        }
    }

    refreshFieldDisplay(info: any): void {
        const fields = this.resolveDisplayFields(info);
        this.ensureDisplayRows(fields.length);
        for (let i = 0; i < this.fieldDisplayRows.length; i++) {
            const labelNode = this.fieldDisplayRows[i];
            const valueNode = this.fieldValueRows[i];
            if (labelNode) {
                const visible = i < fields.length;
                labelNode.active = visible;
                if (valueNode) {
                    valueNode.active = visible;
                }
                if (visible) {
                    const field = fields[i];
                    const label = labelNode.getComponent(cc.Label);
                    if (label) {
                        const title = this.resolveFieldDisplayTitle(field);
                        const value = this.resolveFieldValue(info, field.field_value);
                        const valueLabel = valueNode ? valueNode.getComponent(cc.Label) : null;
                        if (valueLabel) {
                            label.string = title;
                            valueLabel.string = value;
                        } else {
                            label.string = title + ": " + value;
                        }
                    }
                }
            }
        }
    }

    resolveFieldDisplayTitle(field: any): string {
        const raw = (field && (field.field_value_translate || field.field_desc || field.field_value)) || "";
        const key = String(raw || "").toLowerCase();
        if (key === "account") {
            return this.i18n("key_cash_field_account", null, "Account");
        }
        if (key === "name" || key === "payee_name") {
            return this.i18n("key_cash_field_name", null, "Name");
        }
        return raw;
    }

    resolveDisplayFields(info: any): any[] {
        if (!info) {
            return DEFAULT_FIELDS;
        }
        const needField = info.need_field;
        if (Array.isArray(needField) && needField.length > 0) {
            return needField;
        }
        const channels = this.extractChannelList(this.channelData);
        for (let i = 0; i < channels.length; i++) {
            const ch = channels[i] || {};
            if ((ch.channel || "") === (info.channel || "") &&
                (ch.sub_channel || "") === (info.sub_channel || "") &&
                Array.isArray(ch.need_field) && ch.need_field.length > 0) {
                return ch.need_field;
            }
        }
        return DEFAULT_FIELDS;
    }

    extractChannelList(data: any): any[] {
        if (!data) {
            return [];
        }
        if (Array.isArray(data)) {
            return data.filter(Boolean);
        }
        let list = data.channel_list || data.c_l || data.channels || data.list || [];
        if (Array.isArray(list)) {
            return list.filter(Boolean);
        }
        if (data.data) {
            const inner = data.data;
            list = inner.channel_list || inner.c_l || inner.channels || inner.list || [];
            if (Array.isArray(list)) {
                return list.filter(Boolean);
            }
        }
        return [];
    }

    refreshChannelPreview(info: any): void {
        if (this.channelPreviewSprite) {
            this.channelPreviewLoadVersion += 1;
            const version = this.channelPreviewLoadVersion;
            this.channelPreviewSprite.spriteFrame = this.defaultChannelPreviewFrame || null;
            const url = this.resolveChannelPreviewUrl(info);
            if (url) {
                this.loadRemoteChannelPreviewSpriteFrame(url, (frame) => {
                    if (frame && version === this.channelPreviewLoadVersion &&
                        this.channelPreviewSprite && this.channelPreviewSprite.isValid) {
                        this.channelPreviewSprite.spriteFrame = frame;
                    }
                });
            }
        }
    }

    resolveChannelPreviewUrl(info: any): string {
        let url = info && info.channel_pic ? String(info.channel_pic).trim() : "";
        if (url) {
            return url;
        }
        const channels = this.extractChannelList(this.channelData);
        for (let i = 0; i < channels.length; i++) {
            const ch = channels[i] || {};
            if ((ch.channel || "") === (info && info.channel || "") &&
                (ch.sub_channel || "") === (info && info.sub_channel || "")) {
                const pic = ch.channel_pic ? String(ch.channel_pic).trim() : "";
                if (pic) {
                    return pic;
                }
            }
        }
        return "";
    }

    loadRemoteChannelPreviewSpriteFrame(url: string, callback: (frame: cc.SpriteFrame | null) => void): void {
        if (!url) {
            callback(null);
            return;
        }
        if (this.channelPreviewFrameCache[url]) {
            callback(this.channelPreviewFrameCache[url]);
            return;
        }
        cc.assetManager.loadRemote(url, (err, asset: any) => {
            if (cc.isValid(this) && this.channelPreviewFrameCache) {
                if (!err && asset) {
                    let frame: cc.SpriteFrame | null = null;
                    if (asset instanceof cc.SpriteFrame) {
                        frame = asset;
                    } else if (asset instanceof cc.Texture2D) {
                        frame = new cc.SpriteFrame(asset);
                    } else if (asset._texture instanceof cc.Texture2D) {
                        frame = new cc.SpriteFrame(asset._texture);
                    }
                    if (frame) {
                        this.channelPreviewFrameCache[url] = frame;
                        callback(frame);
                    } else {
                        callback(null);
                    }
                } else {
                    cc.warn("[cashArrowCheckView] load channel preview failed:", url, err);
                    callback(null);
                }
            }
        });
    }

    ensureDisplayRows(count: number): void {
        const target = Math.max(1, count || 0);
        while (this.fieldDisplayRows.length < target) {
            const labelTemplate = this.fieldLabelTemplateB || this.fieldLabelTemplateA;
            const valueTemplate = this.fieldValueNodeB || this.fieldValueNodeA;
            if (!labelTemplate || !valueTemplate || !this.infoNode) {
                break;
            }
            const index = this.fieldDisplayRows.length;
            const prevRow = this.fieldDisplayRows[index - 1] || this.fieldLabelTemplateB || this.fieldLabelTemplateA;
            const labelNode = cc.instantiate(labelTemplate);
            const valueNode = cc.instantiate(valueTemplate);
            labelNode.name = "txt_dynamic_confirm_field_title_" + index;
            valueNode.name = "txt_dynamic_confirm_field_value_" + index;
            if (prevRow) {
                labelNode.y = prevRow.y + this.fieldTitleRowGap;
            }
            valueNode.y = labelNode.y + this.fieldValueOffset;
            this.infoNode.addChild(labelNode);
            this.infoNode.addChild(valueNode);
            this.fieldDisplayRows.push(labelNode);
            this.fieldValueRows.push(valueNode);
            this.extraFieldRows.push(labelNode);
            this.extraFieldRows.push(valueNode);
        }
    }

    resolveFieldValue(info: any, fieldKey: string): string {
        if (!info || !fieldKey) {
            return "";
        }
        const direct = info[fieldKey];
        if (direct != null && direct !== "") {
            return fieldKey === "account" ? this.maskAccount(String(direct)) : String(direct);
        }
        if (fieldKey === "name" || fieldKey === "payee_name") {
            return info.payee_name || info.name || "";
        }
        if (fieldKey === "account") {
            return this.maskAccount(info.account || info.phone || info.email || "");
        }
        return "";
    }

    resolveRawFieldValue(info: any, fieldKey: string): string {
        if (!info || !fieldKey) {
            return "";
        }
        const direct = info[fieldKey];
        if (direct != null && direct !== "") {
            return String(direct);
        }
        if (fieldKey === "name" || fieldKey === "payee_name") {
            return info.payee_name || info.name || "";
        }
        if (fieldKey === "account") {
            return info.account || info.phone || info.email || "";
        }
        return "";
    }

    maskAccount(value: string): string {
        if (!value) {
            return "";
        }
        const str = String(value);
        if (str.length <= 4) {
            return str;
        }
        const prefix = str.substring(0, 2);
        const suffix = str.substring(str.length - 2);
        let stars = "";
        for (let i = 0; i < str.length - 4; i++) {
            stars += "*";
        }
        return prefix + stars + suffix;
    }

    onClickRevise(): void {
        if (this.bindInfo && this.onRevise) {
            this.onRevise(this.bindInfo);
            UIMgr.getInstance().hide(this.node);
        }
    }

    onClickWithdraw(): void {
        if (this.isSubmitting) {
            return;
        }
        if (!this.selectedOpt) {
            cc.warn("[cashArrowCheckView] no selectedOpt");
            return;
        }
        const info = this.bindInfo;
        if (!info) {
            cc.warn("[cashArrowCheckView] no bind info");
            return;
        }
        if (!this.onWithdraw) {
            cc.warn("[cashArrowCheckView] onWithdraw callback missing");
            return;
        }
        this.isSubmitting = true;
        UIMgr.getInstance().hide(this.node);
        try {
            const keepSubmitting = this.onWithdraw(info, this.selectedOpt, () => {
                this.isSubmitting = false;
            });
            if (keepSubmitting === false) {
                this.isSubmitting = false;
            }
        } catch (err: any) {
            this.isSubmitting = false;
            cc.warn("[cashArrowCheckView] onWithdraw error:", err?.message);
            this.showToast(this.i18n("key_common_network_error", null, "Network error"));
        }
    }

    i18n(key: string, params: any, fallback: string): string {
        return LanguageService.t(key, params || [], fallback);
    }

    showToast(message: string): void {
        try {
            Tips.show(message);
        } catch (e) {
            cc.log("[cashArrowCheckView] toast:", message);
        }
    }

    onClickClose(): void {
        this.onClose?.();
        UIMgr.getInstance().hide(this.node);
    }

    findNodeDeep(node: cc.Node | null, name: string): cc.Node | null {
        if (!node) {
            return null;
        }
        if (node.name === name) {
            return node;
        }
        for (let i = 0; i < node.childrenCount; i++) {
            const found = this.findNodeDeep(node.children[i], name);
            if (found) {
                return found;
            }
        }
        return null;
    }

    findLabelDeep(node: cc.Node, name: string): cc.Label | null {
        const found = this.findNodeDeep(node, name);
        return found ? found.getComponent(cc.Label) : null;
    }
}
