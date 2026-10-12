import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import UIMgr from "./UIMgr";

declare const require: any;

const { ccclass, property } = cc._decorator;

interface CashFieldConfig {
	field_value: string;
	field_value_translate?: string;
	field_desc?: string;
	fail_desc?: string;
}

interface CashChannelInfo {
	channel?: string;
	sub_channel?: string;
	channel_pic?: string;
	need_field?: CashFieldConfig[];
	[key: string]: any;
}

interface CashBindInfo {
	channel?: string;
	sub_channel?: string;
	channel_pic?: string;
	need_field?: CashFieldConfig[];
	account?: string;
	phone?: string;
	email?: string;
	payee_name?: string;
	name?: string;
	[key: string]: any;
}

interface CashEntryData {
	selectedOpt?: any;
	channelData?: any;
	bindInfo?: CashBindInfo;
	txBindInfo?: CashBindInfo[];
	onRevise?: (bindInfo: CashBindInfo) => void;
	onWithdraw?: (bindInfo: CashBindInfo, selectedOpt: any, onDone: () => void) => boolean | void;
	onClose?: () => void;
}

const DEFAULT_FIELD_CONFIGS: CashFieldConfig[] = [
	{
		field_value: "account",
		field_value_translate: "account",
		field_desc: "account",
		fail_desc: "account"
	},
	{
		field_value: "payee_name",
		field_value_translate: "name",
		field_desc: "name",
		fail_desc: "name"
	}
];

@ccclass
export default class cashArrowCheckView extends cc.Component {

	private selectedOpt: any = null;
	private channelData: any = null;
	private bindInfo: CashBindInfo | null = null;
	private onRevise: ((bindInfo: CashBindInfo) => void) | null = null;
	private onWithdraw: ((bindInfo: CashBindInfo, selectedOpt: any, onDone: () => void) => boolean | void) | null = null;
	private onClose: (() => void) | null = null;
	private isSubmitting: boolean = false;
	private channelPreviewLoadVersion: number = 0;
	private channelPreviewFrameCache: { [url: string]: cc.SpriteFrame } = {};
	private fieldDisplayRows: cc.Node[] = [];
	private fieldValueRows: cc.Node[] = [];
	private extraFieldRows: cc.Node[] = [];
	private baseRowCount: number = 0;
	private fieldTitleRowGap: number = -116;
	private fieldValueOffset: number = -60;

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

	public onLoad(): void {
		this.selectedOpt = null;
		this.channelData = null;
		this.bindInfo = null;
		this.onRevise = null;
		this.onWithdraw = null;
		this.onClose = null;
		this.isSubmitting = false;
		this.channelPreviewLoadVersion = 0;
		this.channelPreviewFrameCache = {};
		this.fieldDisplayRows = [];
		this.fieldValueRows = [];
		this.extraFieldRows = [];
		this.bindNodes();
		this.bindEvents();
		this.bindLanguageEvent();
	}

	public onDestroy(): void {
		this.unbindLanguageEvent();
		this.unbindEvents();
		this.clearExtraFieldRows();
		this.channelPreviewLoadVersion += 1;
	}

	private bindLanguageEvent(): void {
		GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
	}

	private unbindLanguageEvent(): void {
		GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
	}

	private onLanguageChanged(): void {
		this.refreshUI();
	}

	public setEntryData(entryData: CashEntryData): void {
		if (!entryData) {
			return;
		}
		this.selectedOpt = entryData.selectedOpt || null;
		this.channelData = entryData.channelData || null;
		this.bindInfo = entryData.bindInfo || null;
		if (!this.bindInfo && Array.isArray(entryData.txBindInfo) && entryData.txBindInfo.length > 0) {
			this.bindInfo = entryData.txBindInfo[0];
		}
		this.onRevise = typeof entryData.onRevise === "function" ? entryData.onRevise : null;
		this.onWithdraw = typeof entryData.onWithdraw === "function" ? entryData.onWithdraw : null;
		this.onClose = typeof entryData.onClose === "function" ? entryData.onClose : null;
		this.refreshUI();
	}

	private bindNodes(): void {
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
		this.fieldTitleRowGap = this.fieldLabelTemplateB && this.fieldLabelTemplateA
			? this.fieldLabelTemplateB.y - this.fieldLabelTemplateA.y
			: -116;
		this.fieldValueOffset = this.fieldValueNodeA && this.fieldLabelTemplateA
			? this.fieldValueNodeA.y - this.fieldLabelTemplateA.y
			: -60;
	}

	private clearExtraFieldRows(): void {
		while (this.extraFieldRows.length > 0) {
			const row = this.extraFieldRows.pop();
			if (row) {
				row.destroy();
			}
		}
	}

	private bindEvents(): void {
		if (this.btnClose) {
			this.btnClose.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
		}
		if (this.btnWithdraw) {
			this.btnWithdraw.on(cc.Node.EventType.TOUCH_END, this.onClickWithdraw, this);
		}
		if (this.btnRevise) {
			this.btnRevise.on(cc.Node.EventType.TOUCH_END, this.onClickRevise, this);
		}
		if (this.maskNode) {
			this.maskNode.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
		}
	}

	private unbindEvents(): void {
		if (this.btnClose) {
			this.btnClose.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
		}
		if (this.btnWithdraw) {
			this.btnWithdraw.off(cc.Node.EventType.TOUCH_END, this.onClickWithdraw, this);
		}
		if (this.btnRevise) {
			this.btnRevise.off(cc.Node.EventType.TOUCH_END, this.onClickRevise, this);
		}
		if (this.maskNode) {
			this.maskNode.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
		}
	}

	public refreshUI(): void {
		const info = this.bindInfo;
		if (!info) {
			return;
		}
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

	private refreshFieldDisplay(bindInfo: CashBindInfo): void {
		const fields = this.resolveDisplayFields(bindInfo);
		this.ensureDisplayRows(fields.length);
		for (let i = 0; i < this.fieldDisplayRows.length; i++) {
			const titleNode = this.fieldDisplayRows[i];
			const valueNode = this.fieldValueRows[i];
			if (!titleNode) {
				continue;
			}
			const visible = i < fields.length;
			titleNode.active = visible;
			if (valueNode) {
				valueNode.active = visible;
			}
			if (!visible) {
				continue;
			}
			const field = fields[i];
			const titleLabel = titleNode.getComponent(cc.Label);
			if (!titleLabel) {
				continue;
			}
			const title = this.resolveFieldDisplayTitle(field);
			const value = this.resolveFieldValue(bindInfo, field.field_value);
			const valueLabel = valueNode ? valueNode.getComponent(cc.Label) : null;
			if (valueLabel) {
				titleLabel.string = title;
				valueLabel.string = value;
			} else {
				titleLabel.string = title + ": " + value;
			}
		}
	}

	private resolveFieldDisplayTitle(field: CashFieldConfig): string {
		const raw: string = (field && (field.field_value_translate || field.field_desc || field.field_value)) || "";
		const key = String(raw || "").toLowerCase();
		if (key === "account") {
			return this.i18n("key_cash_field_account", null, "Account");
		}
		if (key === "name" || key === "payee_name") {
			return this.i18n("key_cash_field_name", null, "Name");
		}
		return raw;
	}

	private resolveDisplayFields(bindInfo: CashBindInfo): CashFieldConfig[] {
		if (!bindInfo) {
			return DEFAULT_FIELD_CONFIGS;
		}
		const needField = bindInfo.need_field;
		if (Array.isArray(needField) && needField.length > 0) {
			return needField;
		}
		const channelList = this.extractChannelList(this.channelData);
		for (let i = 0; i < channelList.length; i++) {
			const channel = channelList[i] || {};
			if ((channel.channel || "") === (bindInfo.channel || "")
				&& (channel.sub_channel || "") === (bindInfo.sub_channel || "")
				&& Array.isArray(channel.need_field)
				&& channel.need_field.length > 0) {
				return channel.need_field;
			}
		}
		return DEFAULT_FIELD_CONFIGS;
	}

	private extractChannelList(channelData: any): CashChannelInfo[] {
		if (!channelData) {
			return [];
		}
		if (Array.isArray(channelData)) {
			return channelData.filter(Boolean);
		}
		let list = channelData.channel_list || channelData.c_l || channelData.channels || channelData.list || [];
		if (Array.isArray(list)) {
			return list.filter(Boolean);
		}
		if (channelData.data) {
			const data = channelData.data;
			list = data.channel_list || data.c_l || data.channels || data.list || [];
			if (Array.isArray(list)) {
				return list.filter(Boolean);
			}
		}
		return [];
	}

	private refreshChannelPreview(bindInfo: CashBindInfo): void {
		if (!this.channelPreviewSprite) {
			return;
		}
		this.channelPreviewLoadVersion += 1;
		const version = this.channelPreviewLoadVersion;
		this.channelPreviewSprite.spriteFrame = this.defaultChannelPreviewFrame || null;
		const url = this.resolveChannelPreviewUrl(bindInfo);
		if (!url) {
			return;
		}
		this.loadRemoteChannelPreviewSpriteFrame(url, (frame: cc.SpriteFrame | null) => {
			if (frame && version === this.channelPreviewLoadVersion && this.channelPreviewSprite && this.channelPreviewSprite.isValid) {
				this.channelPreviewSprite.spriteFrame = frame;
			}
		});
	}

	private resolveChannelPreviewUrl(bindInfo: CashBindInfo): string {
		const direct = bindInfo && bindInfo.channel_pic ? String(bindInfo.channel_pic).trim() : "";
		if (direct) {
			return direct;
		}
		const channelList = this.extractChannelList(this.channelData);
		for (let i = 0; i < channelList.length; i++) {
			const channel = channelList[i] || {};
			if ((channel.channel || "") === (bindInfo && bindInfo.channel || "")
				&& (channel.sub_channel || "") === (bindInfo && bindInfo.sub_channel || "")) {
				const pic = channel.channel_pic ? String(channel.channel_pic).trim() : "";
				if (pic) {
					return pic;
				}
			}
		}
		return "";
	}

	private loadRemoteChannelPreviewSpriteFrame(url: string, callback: (frame: cc.SpriteFrame | null) => void): void {
		if (!url) {
			if (callback) {
				callback(null);
			}
			return;
		}
		const cached = this.channelPreviewFrameCache[url];
		if (cached) {
			if (callback) {
				callback(cached);
			}
			return;
		}
		cc.assetManager.loadRemote(url, (err: Error | null, asset: any) => {
			if (!cc.isValid(this) || !this.channelPreviewFrameCache) {
				return;
			}
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
					if (callback) {
						callback(frame);
					}
				} else if (callback) {
					callback(null);
				}
			} else {
				cc.warn("[cashArrowCheckView] load channel preview failed:", url, err);
				if (callback) {
					callback(null);
				}
			}
		});
	}

	private ensureDisplayRows(count: number): void {
		const target = Math.max(1, count || 0);
		while (this.fieldDisplayRows.length < target) {
			const titleTemplate = this.fieldLabelTemplateB || this.fieldLabelTemplateA;
			const valueTemplate = this.fieldValueNodeB || this.fieldValueNodeA;
			if (!titleTemplate || !valueTemplate || !this.infoNode) {
				break;
			}
			const index = this.fieldDisplayRows.length;
			const prevTitle = this.fieldDisplayRows[index - 1] || this.fieldLabelTemplateB || this.fieldLabelTemplateA;
			const titleNode = cc.instantiate(titleTemplate);
			const valueNode = cc.instantiate(valueTemplate);
			titleNode.name = "txt_dynamic_confirm_field_title_" + index;
			valueNode.name = "txt_dynamic_confirm_field_value_" + index;
			if (prevTitle) {
				titleNode.y = prevTitle.y + this.fieldTitleRowGap;
			}
			valueNode.y = titleNode.y + this.fieldValueOffset;
			this.infoNode.addChild(titleNode);
			this.infoNode.addChild(valueNode);
			this.fieldDisplayRows.push(titleNode);
			this.fieldValueRows.push(valueNode);
			this.extraFieldRows.push(titleNode);
			this.extraFieldRows.push(valueNode);
		}
	}

	private resolveFieldValue(bindInfo: CashBindInfo, fieldKey: string): string {
		if (!bindInfo || !fieldKey) {
			return "";
		}
		const value = bindInfo[fieldKey];
		if (value !== null && value !== undefined && value !== "") {
			return fieldKey === "account" ? this.maskAccount(String(value)) : String(value);
		}
		if (fieldKey === "name" || fieldKey === "payee_name") {
			return bindInfo.payee_name || bindInfo.name || "";
		}
		if (fieldKey === "account") {
			return this.maskAccount(bindInfo.account || bindInfo.phone || bindInfo.email || "");
		}
		return "";
	}

	private resolveRawFieldValue(bindInfo: CashBindInfo, fieldKey: string): string {
		if (!bindInfo || !fieldKey) {
			return "";
		}
		const value = bindInfo[fieldKey];
		if (value !== null && value !== undefined && value !== "") {
			return String(value);
		}
		if (fieldKey === "name" || fieldKey === "payee_name") {
			return bindInfo.payee_name || bindInfo.name || "";
		}
		if (fieldKey === "account") {
			return bindInfo.account || bindInfo.phone || bindInfo.email || "";
		}
		return "";
	}

	private maskAccount(account: string): string {
		if (!account) {
			return "";
		}
		const value = String(account);
		if (value.length <= 4) {
			return value;
		}
		const head = value.substring(0, 2);
		const tail = value.substring(value.length - 2);
		let mask = "";
		for (let i = 0; i < value.length - 4; i++) {
			mask += "*";
		}
		return head + mask + tail;
	}

	private onClickRevise(): void {
		const bindInfo = this.bindInfo;
		const onRevise = this.onRevise;
		if (!bindInfo || !onRevise) {
			return;
		}
		onRevise(bindInfo);
		UIMgr.getInstance().hide(this.node);
	}

	private onClickWithdraw(): void {
		if (this.isSubmitting) {
			return;
		}
		if (!this.selectedOpt) {
			cc.warn("[cashArrowCheckView] no selectedOpt");
			return;
		}
		const bindInfo = this.bindInfo;
		if (!bindInfo) {
			cc.warn("[cashArrowCheckView] no bind info");
			return;
		}
		const onWithdraw = this.onWithdraw;
		if (!onWithdraw) {
			cc.warn("[cashArrowCheckView] onWithdraw callback missing");
			return;
		}
		this.isSubmitting = true;
		UIMgr.getInstance().hide(this.node);
		try {
			const result = onWithdraw(bindInfo, this.selectedOpt, () => {
				this.isSubmitting = false;
			});
			if (result === false) {
				this.isSubmitting = false;
			}
		} catch (err) {
			this.isSubmitting = false;
			cc.warn("[cashArrowCheckView] onWithdraw error:", err && err.message);
			this.showToast(this.i18n("key_common_network_error", null, "Network error"));
		}
	}

	private i18n(key: string, params?: any[] | null, fallback?: string): string {
		return LanguageService.t(key, params || [], fallback);
	}

	private showToast(message: string): void {
		try {
			const Tips: any = require("Tips");
			if (Tips.default) {
				Tips.default.show(message);
			} else if (Tips.show) {
				Tips.show(message);
			}
		} catch (err) {
			cc.log("[cashArrowCheckView] toast:", message);
		}
	}

	private onClickClose(): void {
		const onClose = this.onClose;
		if (onClose) {
			onClose();
		}
		UIMgr.getInstance().hide(this.node);
	}

	private findNodeDeep(root: cc.Node, name: string): cc.Node | null {
		if (!root) {
			return null;
		}
		if (root.name === name) {
			return root;
		}
		for (let i = 0; i < root.childrenCount; i++) {
			const node = this.findNodeDeep(root.children[i], name);
			if (node) {
				return node;
			}
		}
		return null;
	}

	private findLabelDeep(root: cc.Node, name: string): cc.Label | null {
		const node = this.findNodeDeep(root, name);
		return (node && node.getComponent(cc.Label)) || null;
	}
}