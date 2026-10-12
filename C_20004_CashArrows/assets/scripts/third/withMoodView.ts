import BarrageDataService from "./BarrageDataService";
import cashArrowCheckView from "./cashArrowCheckView";
import cashArrowSetView from "./cashArrowSetView";
import CountryAssetService from "./CountryAssetService";
import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import InterfaceMgr from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";
import NetErrorPopupService from "./NetErrorPopupService";
import NewbieGuideFlow from "./NewbieGuideFlow";
import PlayerDataStore from "./PlayerDataStore";
import ResMgr from "./ResMgr";
import Tips from "./Tips";
import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";
import UserData from "./UserData";
import UserInfoService from "./UserInfoService";

const { ccclass } = cc._decorator;

interface OptionItemRef {
	index: number;
	node: cc.Node;
	bg: cc.Sprite | null;
	amount: cc.Label | null;
	countdownNode: cc.Node | null;
	countdown: cc.Label | null;
	checkNode: cc.Node | null;
}

interface WithdrawConditionResult {
	pass: boolean;
	message: string;
}

@ccclass
export default class WithMoodView extends cc.Component {
	public options: any[] = [];
	public selectedIndex: number = 0;
	public userLevel: number = 0;
	public userBalance: number = 0;
	public isForbidPai: boolean = false;
	public barrageList: any[] = [];
	public barragePlayIndex: number = 0;
	public barrageDuration: number = 7;
	public barrageMoveSpeed: number = 180;
	public barrageSpacing: number = 14;
	public barrageOffscreenPadding: number = 140;
	public barrageTween: cc.Action | null = null;
	public barrageFontSize: number = 30;
	public barrageLineHeight: number = 34;
	public barrageArrowNames: string[] = ["with_arrow_1", "with_arrow_2", "with_arrow_3", "with_arrow_4"];
	public barrageIconImageName: string = "";
	public barrageIconReqVersion: number = 0;
	public lastBarrageArrowIndex: number = -1;
	public barrageNormalColor: string = "#E7E7E7";
	public barrageHighlightColor: string = "#E71A4C";
	public barrageItemTemplateWidth: number = 0;
	public localizedImageReqVersionMap: { [key: string]: number } = {};
	public optionBgNormalSprite: cc.SpriteFrame | null = null;
	public optionBgSelectedSprite: cc.SpriteFrame | null = null;
	public optionLayoutBaseX: number = -240;
	public optionLayoutBaseY: number = 0;
	public optionLayoutStepX: number = 240;
	public optionLayoutStepY: number = -180;
	public isWithdrawSubmitting: boolean = false;
	public newbieGuidePulseNode: cc.Node | null = null;
	public newbieGuidePulseScale: number = 1;
	public newbieGuideToastStep: number = 0;

	private _lastClickTime: number = 0;
	private _bypassClickThrottle: boolean = false;
	private _withdrawInfoLoaded: boolean = false;
	private _guideStep5Pending: boolean = false;
	private _barrageRetryTimer: any = null;
	private _progressValue: number = 0;
	private _progressMaxValue: number = 1;

	public guideStep4TipNode: cc.Node | null = null;
	public guideStep5TipNode: cc.Node | null = null;
	public guideStep6TipNode: cc.Node | null = null;
	public guideStep4Overlay: cc.Node | null = null;
	public guideStep4Mask: cc.Node | null = null;
	public guideStep5Overlay: cc.Node | null = null;
	public guideStep5Mask: cc.Node | null = null;
	public guideStep6Overlay: cc.Node | null = null;
	public guideStep6Mask: cc.Node | null = null;
	public lblGuideStep4Tip: cc.Label | null = null;
	public lblGuideStep5Tip: cc.Label | null = null;
	public lblGuideStep6Tip: cc.Label | null = null;

	public btnBack: cc.Node | null = null;
	public btnHistory: cc.Node | null = null;
	public btnWithdraw: cc.Node | null = null;
	public lblPageTitle: cc.Label | null = null;
	public lblHistory: cc.Label | null = null;
	public lblBalanceTitle: cc.Label | null = null;
	public lblExplainTitle: cc.Label | null = null;
	public lblLv: cc.Label | null = null;
	public lblBalance: cc.Label | null = null;
	public barrageTextNode: cc.Node | null = null;
	public lblBarrage: cc.Label | null = null;
	public barrageTrack: cc.Node | null = null;
	public barrageItem: cc.Node | null = null;
	public iconBarrage: cc.Node | null = null;
	public lblOptionsTitle: cc.Label | null = null;
	public lblCondition1: cc.Label | null = null;
	public lblCondition2: cc.Label | null = null;
	public lblBottomCondition: cc.Label | null = null;
	public lblWithdrawBtn: cc.Label | null = null;
	public progressBg: cc.Node | null = null;
	public progressFill: cc.Node | null = null;
	public progressRightDecor: cc.Node | null = null;
	public scrollViewNode: cc.Node | null = null;
	public scrollView: cc.ScrollView | null = null;
	public scrollViewView: cc.Node | null = null;
	public scrollContent: cc.Node | null = null;
	public optionsRoot: cc.Node | null = null;
	public optionTemplateSelected: cc.Node | null = null;
	public optionTemplateNormal: cc.Node | null = null;
	public optionButtons: OptionItemRef[] = [];
	public i18nGroup: any = null;

	public onLoad(): void {
		this.userLevel = Number(UserData.getInstance().user_level || 0);
		this.getNewbieGuideFlow().bootstrap();
		this.bindNodes();
		this.i18nGroup = this.node.getComponent("I18nGroup");
		this.bindEvents();
		this.bindLanguageEvent();
		this.loadWithdrawInfo();
		this.loadBarrageList();
		this.loadOptionBgSpriteFrames();
		this.refreshLocalizedImageI18n();
		this.refreshAll();
	}

	public onDestroy(): void {
		this._guideStep5Pending = false;
		this.stopBarragePlayer();
		this.stopNewbieGuidePulse();
		this.hideAllNewbieGuideOverlays();
		this.unbindLanguageEvent();
		this.unbindEvents();
		GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.closeSet);
	}

	public bindLanguageEvent(): void {
		GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
	}

	public unbindLanguageEvent(): void {
		GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
	}

	public onLanguageChanged(): void {
		if (this.i18nGroup && this.i18nGroup.refreshChildren) {
			this.i18nGroup.refreshChildren();
		}
		this.refreshAll();
		this.refreshLocalizedImageI18n();
		this.refreshBarrageIconByCountry();
		this.playNextBarrage();
	}

	public setEntryData(data: any): void {
		if (!data) return;
		if (data.cash_balance !== undefined) {
			this.userBalance = data.cash_balance;
		}
		if (data.user_level !== undefined) {
			this.userLevel = Number(data.user_level);
			UserData.getInstance().user_level = data.user_level;
		}
		this.refreshAll();
	}

	public bindNodes(): void {
		this.btnBack = this.findNode("btn_back");
		this.btnHistory = this.findNode("btn_history");
		this.btnWithdraw = this.findNode("btn_withdraw");
		this.lblPageTitle = this.findLabel("title");
		this.lblHistory = this.btnHistory ? this.btnHistory.getComponent(cc.Label) : null;
		this.lblBalanceTitle = this.findLabel("lbl_balance_title");
		this.lblExplainTitle = this.findLabel("lbl_explain_title");
		this.lblLv = this.findLabel("lbl_lv");
		this.lblBalance = this.findLabel("lbl_balance");
		this.barrageTextNode = this.findNode("lbl_barrage");
		this.lblBarrage = this.ensureBarrageRichText(this.barrageTextNode);
		this.barrageTrack = this.findNode("barrage_track");
		this.barrageItem = this.findNode("barrage_item");
		this.iconBarrage = this.findNode("icon_barrage");
		this.barrageItemTemplateWidth = (this.barrageItem && this.barrageItem.width) || 0;
		this.lblOptionsTitle = this.findLabel("lbl_options_title");
		this.lblCondition1 = this.findLabel("lbl_condition1");
		this.lblCondition2 = this.findLabel("lbl_condition2");
		this.lblBottomCondition = this.findLabel("lbl_bottom_condition");
		this.lblWithdrawBtn = this.findLabel("lbl_withdraw");
		this.progressBg = this.findNode("progress_bg");
		this.progressFill = this.findNode("progress_fill");
		this.progressRightDecor = this.findNode("progress_right_decor");
		this.applyProgressHorizontalPadding();
		this.scrollViewNode = this.findNode("scroll_view");
		this.scrollView = this.scrollViewNode ? this.scrollViewNode.getComponent(cc.ScrollView) : null;
		this.scrollViewView = this.findNode("view");
		this.scrollContent = this.findNode("content");
		this.optionsRoot = this.findNode("options_root");
		this.optionTemplateSelected = this.findNode("tpl_option_selected");
		this.optionTemplateNormal = this.findNode("tpl_option_normal");
		this.prepareOptionTemplates();
		this.optionButtons = this.collectExistingOptionItems();
		this.captureOptionLayoutRule();
		this.guideStep4TipNode = this.findNode("guide_step4_tip");
		this.guideStep5TipNode = this.findNode("guide_step5_tip");
		this.guideStep6TipNode = this.findNode("guide_step6_tip");
		this.guideStep4Overlay = this.findNode("guide_step4_overlay");
		this.guideStep4Mask = this.findNode("guide_step4_mask");
		this.guideStep5Overlay = this.findNode("guide_step5_overlay");
		this.guideStep5Mask = this.findNode("guide_step5_mask");
		this.guideStep6Overlay = this.findNode("guide_step6_overlay");
		this.guideStep6Mask = this.findNode("guide_step6_mask");
		this.lblGuideStep4Tip = this.guideStep4TipNode ? this.guideStep4TipNode.getComponent(cc.Label) : null;
		this.lblGuideStep5Tip = this.guideStep5TipNode ? this.guideStep5TipNode.getComponent(cc.Label) : null;
		this.lblGuideStep6Tip = this.guideStep6TipNode ? this.guideStep6TipNode.getComponent(cc.Label) : null;
		this.hideAllNewbieGuideTipNodes();
		this.hideAllNewbieGuideOverlays();
	}

	public ensureBarrageRichText(node: cc.Node | null): cc.Label | null {
		if (!node) return null;
		let label = node.getComponent(cc.Label);
		if (!label) {
			label = node.addComponent(cc.Label);
		}
		return label;
	}

	public bindEvents(): void {
		if (this.btnBack) this.btnBack.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
		if (this.btnHistory) this.btnHistory.on(cc.Node.EventType.TOUCH_END, this.onClickHistory, this);
		if (this.btnWithdraw) this.btnWithdraw.on(cc.Node.EventType.TOUCH_END, this.onClickWithdraw, this);
	}

	public unbindEvents(): void {
		if (this.btnBack) this.btnBack.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
		if (this.btnHistory) this.btnHistory.off(cc.Node.EventType.TOUCH_END, this.onClickHistory, this);
		if (this.btnWithdraw) this.btnWithdraw.off(cc.Node.EventType.TOUCH_END, this.onClickWithdraw, this);
		this.clearOptionItems();
	}

	public clearOptionItems(): void {
		for (let i = 0; i < this.optionButtons.length; i++) {
			const item = this.optionButtons[i];
			if (item.node) {
				item.node.off(cc.Node.EventType.TOUCH_END, this.onClickOption, this);
			}
		}
	}

	public prepareOptionTemplates(): void {
		if (this.optionTemplateSelected) this.optionTemplateSelected.active = false;
		if (this.optionTemplateNormal) this.optionTemplateNormal.active = false;
	}

	public hasOptionTemplates(): boolean {
		return !!(this.optionTemplateSelected || this.optionTemplateNormal);
	}

	public collectExistingOptionItems(): OptionItemRef[] {
		if (!this.optionsRoot) return [];
		const list: OptionItemRef[] = [];
		for (let i = 0; i < this.optionsRoot.childrenCount; i++) {
			const child = this.optionsRoot.children[i];
			if (child && child.name.indexOf("option_") === 0) {
				const ref = this.buildOptionItemRef(child, list.length);
				list.push(ref);
			}
		}
		list.sort((a, b) => (a.index || 0) - (b.index || 0));
		for (let j = 0; j < list.length; j++) {
			(list[j].node as any)._optionIndex = j;
		}
		return list;
	}

	public buildOptionItemRef(node: cc.Node, fallbackIndex: number): OptionItemRef {
		let bg = node.getComponent(cc.Sprite);
		let amount = node.getComponent(cc.Label);
		if (!amount) {
			amount = this.findLabelInNode(node);
		}
		const ref: OptionItemRef = {
			index: this.getOptionNodeIndex(node, fallbackIndex),
			node: node,
			bg: bg,
			amount: amount,
			countdownNode: node.getChildByName("countdown"),
			countdown: null,
			checkNode: node.getChildByName("check")
		};
		if (ref.countdownNode) {
			ref.countdown = ref.countdownNode.getComponent(cc.Label);
		}
		(node as any)._optionIndex = fallbackIndex;
		node.off(cc.Node.EventType.TOUCH_END, this.onClickOption, this);
		node.on(cc.Node.EventType.TOUCH_END, this.onClickOption, this);
		return ref;
	}

	public getOptionNodeIndex(node: cc.Node | null, fallback: number): number {
		if (!node || !node.name) return fallback || 0;
		const match = node.name.match(/^option_(\d+)$/);
		if (!match) return fallback || 0;
		const idx = parseInt(match[1], 10);
		return isNaN(idx) ? (fallback || 0) : idx;
	}

	public findLabelInNode(node: cc.Node | null): cc.Label | null {
		if (!node) return null;
		let label = node.getComponent(cc.Label);
		if (label) return label;
		for (let i = 0; i < node.childrenCount; i++) {
			label = this.findLabelInNode(node.children[i]);
			if (label) return label;
		}
		return null;
	}

	public captureOptionLayoutRule(): void {
		if (this.hasOptionTemplates() && this.optionTemplateSelected) {
			this.optionLayoutBaseX = this.optionTemplateSelected.x;
			this.optionLayoutBaseY = this.optionTemplateSelected.y;
			this.optionLayoutStepX = this.optionTemplateNormal
				? this.optionTemplateNormal.x - this.optionTemplateSelected.x
				: 224.5;
			if (Math.abs(this.optionLayoutStepX) < 1) {
				this.optionLayoutStepX = 224.5;
			}
			this.optionLayoutStepY = -146;
		} else if (this.optionButtons && this.optionButtons.length > 0) {
			this.optionLayoutBaseX = this.optionButtons[0].node.x;
			this.optionLayoutBaseY = this.optionButtons[0].node.y;
			if (this.optionButtons.length > 1) {
				this.optionLayoutStepX = this.optionButtons[1].node.x - this.optionButtons[0].node.x;
			}
			if (this.optionButtons.length > 3) {
				this.optionLayoutStepY = this.optionButtons[3].node.y - this.optionButtons[0].node.y;
			}
		}
	}

	public getOptionPosition(index: number): cc.Vec2 {
		const col = index % 3;
		const row = Math.floor(index / 3);
		return cc.v2(
			this.optionLayoutBaseX + col * this.optionLayoutStepX,
			this.optionLayoutBaseY + row * this.optionLayoutStepY
		);
	}

	public ensureOptionItemsForCount(count: number): void {
		if (!this.optionsRoot) return;
		if (this.hasOptionTemplates()) {
			const template = this.optionTemplateNormal || this.optionTemplateSelected;
			let created = 0;
			while (template && this.optionButtons.length < count) {
				const idx = this.optionButtons.length;
				const node = cc.instantiate(template);
				node.name = "option_" + idx;
				node.active = true;
				this.optionsRoot.addChild(node);
				const pos = this.getOptionPosition(idx);
				node.setPosition(pos.x, pos.y);
				this.optionButtons.push(this.buildOptionItemRef(node, idx));
				created += 1;
			}
			if (created > 0) {
				this.refreshMoneyArrowIconSprites();
			}
		} else if (count > this.optionButtons.length) {
			cc.warn("[withMoodView] option count exceeds prefab nodes, extra items will be ignored");
		}
	}

	public relayoutOptionItems(): void {
		for (let i = 0; i < this.optionButtons.length; i++) {
			const item = this.optionButtons[i];
			(item.node as any)._optionIndex = i;
			item.node.name = "option_" + i;
			if (this.hasOptionTemplates()) {
				const pos = this.getOptionPosition(i);
				item.node.setPosition(pos.x, pos.y);
			}
		}
	}

	public applyOptionVisualByTemplate(item: OptionItemRef, selected: boolean): void {
		if (!item || !item.node) return;
		const template = selected ? this.optionTemplateSelected : this.optionTemplateNormal;
		if (!template) return;

		if (item.bg) {
			const tplSprite = template.getComponent(cc.Sprite);
			if (tplSprite) {
				item.bg.spriteFrame = tplSprite.spriteFrame;
				item.bg.type = tplSprite.type;
				item.bg.sizeMode = tplSprite.sizeMode;
				item.bg.node.color = tplSprite.node.color;
			}
		}

		if (item.amount) {
			const tplLabel = this.findLabelInNode(template);
			if (tplLabel) {
				item.amount.fontSize = tplLabel.fontSize;
				item.amount.lineHeight = tplLabel.lineHeight;
				item.amount.node.color = tplLabel.node.color;
				const tplOutline = tplLabel.getComponent(cc.LabelOutline);
				let outline = item.amount.getComponent(cc.LabelOutline);
				if (tplOutline) {
					if (!outline) {
						outline = item.amount.node.addComponent(cc.LabelOutline);
					}
					outline.enabled = tplOutline.enabled;
					outline.color = tplOutline.color;
					outline.width = tplOutline.width;
				} else if (outline) {
					outline.enabled = false;
				}
			}
		}

		if (item.checkNode) {
			const tplCheck = template.getChildByName("check");
			item.checkNode.active = !!(tplCheck && tplCheck.active);
		}
	}

	public loadOptionBgSpriteFrames(): void {
		this.optionBgNormalSprite = null;
		this.optionBgSelectedSprite = null;
	}

	public loadWithdrawInfo(): void {
		this.options = [];
		this.selectedIndex = 0;
		const retry = (): void => {
			this.loadWithdrawInfo();
		};
		LoadingHttpService.getWithdrawInfo(Handler.create(this, (resp: any) => {
			if (NetErrorPopupService.shouldPop(resp)) {
				cc.warn("[withMoodView] WithdrawInfo force-retry code=", resp && resp.code);
				NetErrorPopupService.showAndRetry(retry);
				return;
			}
			if (resp && resp.code === 1 && resp.data) {
				const data = resp.data;
				if (data.cash_balance !== undefined) {
					this.userBalance = data.cash_balance;
				}
				if (data.user_level !== undefined) {
					this.userLevel = Number(data.user_level);
					UserData.getInstance().user_level = data.user_level;
				} else if (data.game_level !== undefined) {
					this.userLevel = data.game_level;
				}
				const infoList = data.info || [];
				this.options = [];
				for (let i = 0; i < infoList.length; i++) {
					const src = infoList[i];
					const opt: any = {};
					for (const key in src) {
						if (src.hasOwnProperty(key)) {
							opt[key] = src[key];
						}
					}
					if (opt.status !== undefined) {
						opt.status = parseInt(opt.status, 10) || 0;
					}
					this.options.push(opt);
				}
				this.selectedIndex = 0;
				this._withdrawInfoLoaded = true;
				this.refreshAll();
			} else {
				cc.warn("[withMoodView] WithdrawInfo failed:", resp && resp.message);
			}
		}), Handler.create(this, (err: any) => {
			if (NetErrorPopupService.shouldPop(err)) {
				cc.warn("[withMoodView] WithdrawInfo 网络异常，弹重试窗 err=", err && err.message);
				NetErrorPopupService.showAndRetry(retry);
			} else {
				cc.warn("[withMoodView] WithdrawInfo error:", err && err.message);
			}
		}));
	}

	public loadBarrageList(): void {
		BarrageDataService.ensureStarted();
		this.playNextBarrage();
	}

	public stopBarragePlayer(): void {
		if (this.barrageTween) {
			this.barrageTween.stop();
		}
		this.barrageTween = null;
		if (this._barrageRetryTimer) {
			clearTimeout(this._barrageRetryTimer);
			this._barrageRetryTimer = null;
		}
	}

	public playNextBarrage(): void {
		if (!this.barrageTrack || !this.barrageItem || !this.lblBarrage) return;
		this.stopBarragePlayer();
		this.refreshRandomBarrageIcon();

		const data = BarrageDataService.takeOne();
		if (data) {
			this.lblBarrage.string = this.getBarrageRichText(data);
			const itemWidth = this.barrageItemTemplateWidth || this.barrageItem.width || 0;
			const startPoint = this.barrageTrack.convertToNodeSpaceAR(cc.v2(cc.winSize.width, cc.winSize.height / 2));
			const endPoint = this.barrageTrack.convertToNodeSpaceAR(cc.v2(0, cc.winSize.height / 2));
			const startX = startPoint.x + itemWidth / 2;
			const endX = endPoint.x - itemWidth / 2;
			const duration = Math.abs(startX - endX) / Math.max(1, this.barrageMoveSpeed || 150);

			this.barrageItem.stopAllActions();
			this.barrageItem.x = startX;
			const itemY = this.barrageItem.y;
			const moveAction = cc.moveTo(duration, endX, itemY);
			const callbackAction = cc.callFunc(() => {
				this.playNextBarrage();
			});
			this.barrageTween = cc.sequence(moveAction, callbackAction);
			this.barrageItem.runAction(this.barrageTween);
		} else {
			this.lblBarrage.string = this.i18n("key_common_barrage_empty");
			this._barrageRetryTimer = setTimeout(() => {
				this._barrageRetryTimer = null;
				this.playNextBarrage();
			}, 500);
		}
	}

	public updateBarrageItemLayout(): void {
		if (!this.barrageItem || !this.lblBarrage || !this.iconBarrage) return;
		const iconWidth = this.iconBarrage.width || 0;
		const labelWidth = this.lblBarrage.node.width || 0;
		const totalWidth = iconWidth + this.barrageSpacing + labelWidth;
		this.barrageItem.width = totalWidth;
		this.iconBarrage.x = -totalWidth / 2 + iconWidth / 2;
		this.lblBarrage.node.x = this.iconBarrage.x + iconWidth / 2 + this.barrageSpacing + labelWidth / 2;
	}

	public getBarrageRichText(data: any): string {
		if (!data) return this.i18n("key_common_barrage_empty");
		const name = data.name || this.i18n("key_common_user_default");
		const amount = data.amount !== undefined ? this.getCurrencyText(data.amount) : "";
		return (!amount && data.text) ? data.text : this.i18n("key_barrage_success_plain", [name, amount]);
	}

	public getBarrageItemWidth(): number {
		if (!this.barrageItem) return 0;
		let width = this.barrageItem.width || 0;
		if (width <= 0 && this.lblBarrage) {
			width = this.lblBarrage.node.width;
		}
		return Math.max(width, 0);
	}

	public refreshLocalizedImageI18n(): void {
		this.refreshWithProgressDecorSprite();
		this.refreshMoneyArrowIconSprites();
	}

	public refreshWithProgressDecorSprite(): void {
		this.loadLocalizedImageToNodes("with_progress", [this.progressRightDecor], "with_progress_decor");
	}

	public refreshMoneyArrowIconSprites(): void {
		this.loadLocalizedImageToNodes("money_arrow_icon", this.collectMoneyArrowIconNodes(), "money_arrow_icon_nodes");
	}

	public collectMoneyArrowIconNodes(): cc.Node[] {
		const nodes: cc.Node[] = [];
		const push = (n: cc.Node | null): void => {
			if (!n || !n.isValid) return;
			if (nodes.indexOf(n) >= 0) return;
			nodes.push(n);
		};
		if (this.optionTemplateSelected) push(this.optionTemplateSelected.getChildByName("icon"));
		if (this.optionTemplateNormal) push(this.optionTemplateNormal.getChildByName("icon"));
		for (let i = 0; i < this.optionButtons.length; i++) {
			const item = this.optionButtons[i];
			if (item && item.node) push(item.node.getChildByName("icon"));
		}
		return nodes;
	}

	public loadLocalizedImageToNodes(imageName: string, nodes: (cc.Node | null)[], requestKey: string): void {
		if (!imageName || !nodes || nodes.length <= 0) return;
		const sprites: cc.Sprite[] = [];
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (node && node.isValid) {
				const sp = node.getComponent(cc.Sprite);
				if (sp) sprites.push(sp);
			}
		}
		if (sprites.length <= 0) return;
		this.loadLocalizedSpriteFrame(imageName, requestKey || imageName, (frame: cc.SpriteFrame | null) => {
			if (frame) {
				for (let i = 0; i < sprites.length; i++) {
					const sp = sprites[i];
					if (sp && sp.isValid) {
						sp.spriteFrame = frame;
					}
				}
			}
		});
	}

	public loadLocalizedSpriteFrame(imageName: string, requestKey: string, callback: (frame: cc.SpriteFrame | null) => void): void {
		if (!imageName || typeof callback !== "function") return;
		if (!this.localizedImageReqVersionMap) this.localizedImageReqVersionMap = {};
		const key = requestKey || imageName;
		const version = (this.localizedImageReqVersionMap[key] || 0) + 1;
		this.localizedImageReqVersionMap[key] = version;

		const path = CountryAssetService.getPathByImageName(imageName);
		const idPath = CountryAssetService.getPathByImageName(imageName, "ID");
		const done = (frame: cc.SpriteFrame | null): void => {
			if (version === this.localizedImageReqVersionMap[key]) {
				callback(frame || null);
			}
		};

		ResMgr.getInstance().loadRes(path, cc.SpriteFrame, this, "game").then((frame: cc.SpriteFrame) => {
			if (frame) {
				done(frame);
			} else if (idPath && idPath !== path) {
				ResMgr.getInstance().loadRes(idPath, cc.SpriteFrame, this, "game").then((fallback: cc.SpriteFrame) => {
					if (!fallback) {
						cc.warn("[withMoodView] load localized image fallback failed:", imageName, idPath);
					}
					done(fallback || null);
				});
			} else {
				cc.warn("[withMoodView] load localized image failed:", imageName, path);
				done(null);
			}
		});
	}

	public refreshRandomBarrageIcon(): void {
		const name = this.pickRandomBarrageArrowName();
		if (name) {
			this.loadBarrageIconByImageName(name);
		}
	}

	public refreshBarrageIconByCountry(): void {
		if (this.barrageIconImageName) {
			this.loadBarrageIconByImageName(this.barrageIconImageName);
		}
	}

	public pickRandomBarrageArrowName(): string {
		if (!this.barrageArrowNames || this.barrageArrowNames.length <= 0) return "";
		const len = this.barrageArrowNames.length;
		let idx = Math.floor(Math.random() * len);
		if (len > 1 && idx === this.lastBarrageArrowIndex) {
			idx = (idx + 1 + Math.floor(Math.random() * (len - 1))) % len;
		}
		this.lastBarrageArrowIndex = idx;
		return this.barrageArrowNames[idx];
	}

	public loadBarrageIconByImageName(imageName: string): void {
		if (!this.iconBarrage || !imageName) return;
		const sprite = this.iconBarrage.getComponent(cc.Sprite);
		if (!sprite) return;

		this.barrageIconImageName = imageName;
		const version = ++this.barrageIconReqVersion;
		const path = CountryAssetService.getPathByImageName(imageName);
		const idPath = CountryAssetService.getPathByImageName(imageName, "ID");
		const apply = (frame: cc.SpriteFrame | null): void => {
			if (version === this.barrageIconReqVersion && this.iconBarrage && this.iconBarrage.isValid && frame) {
				sprite.spriteFrame = frame;
			}
		};

		ResMgr.getInstance().loadRes(path, cc.SpriteFrame, this, "game").then((frame: cc.SpriteFrame) => {
			if (frame) {
				apply(frame);
			} else if (idPath && idPath !== path) {
				ResMgr.getInstance().loadRes(idPath, cc.SpriteFrame, this, "game").then((fallback: cc.SpriteFrame) => {
					if (fallback) {
						apply(fallback);
					} else {
						cc.warn("[withMoodView] load barrage icon fallback failed:", idPath);
					}
				});
			} else {
				cc.warn("[withMoodView] load barrage icon failed:", path);
			}
		});
	}

	public refreshAll(): void {
		this.setLabelI18n(this.lblPageTitle, "key_withdraw_page_title");
		this.setLabelI18n(this.lblHistory, "key_withdraw_history");
		this.setLabelI18n(this.lblBalanceTitle, "key_withdraw_balance_title");
		this.setLabelI18n(this.lblOptionsTitle, "key_withdraw_options_title");
		this.setLabelI18n(this.lblExplainTitle, "key_withdraw_explain_title");

		if (this.lblLv) {
			const level = Number(UserData.getInstance().user_level || 0);
			if (level > 0) this.userLevel = level;
			this.lblLv.string = this.i18n("key_common_lv_prefix") + (this.userLevel != null ? this.userLevel : 0);
		}
		if (this.lblBalance) {
			this.lblBalance.string = this.getCurrencyText(this.userBalance);
		}
		this.refreshOptions();
		this.refreshConditions();
		this.refreshWithdrawBtn();
		this.applyProgressHorizontalPadding();
		this.refreshNewbieGuide();
	}

	public applyProgressHorizontalPadding(): void {
		if (!this.progressBg || !this.progressBg.parent) return;
		const parentWidth = this.progressBg.parent.width || 0;
		const width = Math.max(0, parentWidth - 80);
		this.progressBg.width = width;
		this.progressBg.x = 0;

		if (this.progressFill) {
			const maxValue = Math.max(1, this._progressMaxValue || 1);
			const ratio = Math.max(0, Math.min(1, (this._progressValue || 0) / maxValue));
			this.progressFill.width = this.progressBg.width * ratio;
			this.progressFill.anchorX = 0;
			this.progressFill.x = this.progressBg.x - this.progressBg.width / 2;
			this.progressFill.y = this.progressBg.y;
		}
	}

	public refreshOptions(): void {
		this.ensureOptionItemsForCount(this.options.length);
		this.relayoutOptionItems();

		for (let i = 0; i < this.optionButtons.length; i++) {
			const item = this.optionButtons[i];
			const opt = this.options[i];
			if (opt) {
				item.node.active = true;
				if (item.amount) item.amount.string = this.getCurrencyText(opt.money);
				const selected = i === this.selectedIndex;
				item.node.color = cc.Color.WHITE;
				this.applyOptionVisualByTemplate(item, selected);

				if (!this.hasOptionTemplates()) {
					if (item.bg) {
						if (selected && this.optionBgSelectedSprite) {
							item.bg.spriteFrame = this.optionBgSelectedSprite;
						} else if (this.optionBgNormalSprite) {
							item.bg.spriteFrame = this.optionBgNormalSprite;
						}
						item.bg.node.color = cc.Color.WHITE;
					}
					if (item.amount) {
						item.amount.node.color = selected ? new cc.Color(255, 201, 53) : cc.Color.WHITE;
					}
					if (item.checkNode) {
						item.checkNode.active = selected;
					}
				}

				if (item.countdownNode) {
					item.countdownNode.active = !!opt.cpm_flag;
				}
				if (opt.cpm_flag) {
					if (item.countdown) {
						item.countdown.string = (opt._remaining || opt.cpm_countdown || 0) + "s";
					}
				} else if (item.countdown) {
					item.countdown.string = "";
				}
			} else {
				item.node.active = false;
			}
		}

		if (this.guideStep4Overlay && this.guideStep4Overlay.active) {
			this.updateStep4GuideMask();
		}
	}

	public refreshConditions(): void {
		const opt = this.options[this.selectedIndex];
		if (!opt) {
			this.setLabelI18n(this.lblCondition1, "key_withdraw_cond_none");
			this.setLabelText(this.lblCondition2, "");
			this.setLabelText(this.lblBottomCondition, "");
			this.setProgress(0, 1);
			return;
		}

		const amountText = this.getCurrencyText(opt.money);
		this.setLabelI18n(this.lblCondition1, "key_withdraw_cond_platform_amount", [amountText]);
		this.setLabelText(this.lblCondition2, "");
		this.setLabelText(this.lblBottomCondition, "");

		const status = opt.status;
		if (status === 4) {
			this.setLabelI18n(this.lblCondition1, "key_withdraw_cond_ready");
			this.setProgress(1, 1);
		} else if (status === 0) {
			const gap = Math.max(0, opt.money - this.userBalance);
			if (gap <= 0) {
				this.setLabelI18n(this.lblBottomCondition, "key_withdraw_cond_ready");
				this.setProgress(1, 1);
			} else {
				this.setLabelI18n(this.lblBottomCondition, "key_withdraw_cond_need_gap", [amountText, this.getCurrencyText(gap)]);
				this.setProgress(this.userBalance, opt.money);
			}
		} else if (status === 1) {
			const passed = opt.current_extract_levels_passed_count || 0;
			const remain = Math.max(0, (opt.levels_passed_limit || 0) - passed);
			this.setLabelI18n(this.lblCondition2, "key_withdraw_cond_play_tip");
			this.setLabelI18n(this.lblBottomCondition, "key_withdraw_cond_need_episode", [remain, amountText]);
			this.setProgress(passed, opt.levels_passed_limit || 1);
		} else if (status === 2) {
			const daysNeed = Math.max(0, (opt.sign_in_limit || 0) - (opt.sign_in || 0));
			this.setLabelI18n(this.lblBottomCondition, "key_withdraw_cond_need_days", [daysNeed, amountText]);
			this.setProgress(opt.sign_in || 0, opt.sign_in_limit || 1);
		} else if (status === 3) {
			this.setLabelI18n(this.lblBottomCondition, "key_withdraw_cond_need_level", [opt.level_limit || 0, amountText]);
			this.setProgress(opt.level || 0, opt.level_limit || 1);
		}
	}

	public refreshWithdrawBtn(): void {
		const opt = this.options[this.selectedIndex];
		this.setLabelI18n(this.lblWithdrawBtn, "key_withdraw_btn", [this.getCurrencyText(opt ? opt.money : 0)]);
	}

	public setProgress(value: number, max: number): void {
		if (!this.progressFill || !this.progressBg) return;
		this._progressValue = value;
		this._progressMaxValue = max;
		const total = Math.max(1, max);
		const ratio = Math.max(0, Math.min(1, value / total));
		this.progressFill.width = this.progressBg.width * ratio;
		this.progressFill.anchorX = 0;
		this.progressFill.x = this.progressBg.x - this.progressBg.width / 2;
		this.progressFill.y = this.progressBg.y;
	}

	public getNewbieGuideFlow(): any {
		return NewbieGuideFlow;
	}

	public getNewbieGuideStep(): number {
		const flow = this.getNewbieGuideFlow();
		return flow && typeof flow.getStep === "function" ? Number(flow.getStep() || 0) : 0;
	}

	public isNewbieGuideStep(step: number): boolean {
		return this.getNewbieGuideStep() === Number(step || 0);
	}

	public advanceNewbieGuideStep(step: number): boolean {
		const flow = this.getNewbieGuideFlow();
		return !!(flow && typeof flow.advanceIfCurrent === "function" && flow.advanceIfCurrent(step));
	}

	public stopNewbieGuidePulse(): void {
		if (this.newbieGuidePulseNode && this.newbieGuidePulseNode.isValid) {
			cc.Tween.stopAllByTarget(this.newbieGuidePulseNode);
			this.newbieGuidePulseNode.scale = this.newbieGuidePulseScale || 1;
			this.newbieGuidePulseNode = null;
			this.newbieGuidePulseScale = 1;
		} else {
			this.newbieGuidePulseNode = null;
		}
	}

	public startNewbieGuidePulse(node: cc.Node | null): void {
		if (!node || !node.isValid) {
			this.stopNewbieGuidePulse();
			return;
		}
		if (this.newbieGuidePulseNode === node) return;
		this.stopNewbieGuidePulse();
		this.newbieGuidePulseNode = node;
		this.newbieGuidePulseScale = Number(node.scale || 1);
		const targetScale = 1.08 * this.newbieGuidePulseScale;
		cc.tween(node)
			.to(0.3, { scale: targetScale })
			.to(0.3, { scale: this.newbieGuidePulseScale })
			.union()
			.repeatForever()
			.start();
	}

	public hideAllNewbieGuideTipNodes(): void {
		if (this.guideStep4TipNode) this.guideStep4TipNode.active = false;
		if (this.guideStep5TipNode) this.guideStep5TipNode.active = false;
		if (this.guideStep6TipNode) this.guideStep6TipNode.active = false;
	}

	public resolveStep4GuideTargetNode(): cc.Node | null {
		const first = this.optionButtons && this.optionButtons[0] && this.optionButtons[0].node;
		if (first && first.isValid && first.activeInHierarchy) return first;
		for (let i = 0; i < this.optionButtons.length; i++) {
			const node = this.optionButtons[i] && this.optionButtons[i].node;
			if (node && node.isValid && node.activeInHierarchy) return node;
		}
		return null;
	}

	public updateStep4GuideMask(): void {
		if (!this.guideStep4Overlay || !this.guideStep4Overlay.isValid
			|| !this.guideStep4Mask || !this.guideStep4Mask.isValid) return;
		const target = this.resolveStep4GuideTargetNode();
		if (target && target.isValid && target.parent && target.parent.isValid) {
			const worldPos = target.parent.convertToWorldSpaceAR(cc.v2(target.x, target.y));
			const localPos = this.guideStep4Overlay.convertToNodeSpaceAR(worldPos);
			this.guideStep4Mask.x = localPos.x;
			this.guideStep4Mask.y = localPos.y;
			this.guideStep4Mask.width = Math.max(180, Number(target.width || 0) + 28);
			this.guideStep4Mask.height = Math.max(90, Number(target.height || 0) + 24);
		}
	}

	public setStep4GuideOverlayActive(active: boolean): void {
		if (!this.guideStep4Overlay || !this.guideStep4Overlay.isValid) return;
		if (active) this.updateStep4GuideMask();
		this.guideStep4Overlay.active = !!active;
		this.bindGuideOverlayClick(this.guideStep4Overlay, !!active, this.onGuideStep4OverlayClick);
	}

	public setStep5GuideOverlayActive(active: boolean): void {
		if (!this.guideStep5Overlay || !this.guideStep5Overlay.isValid) return;
		this.guideStep5Overlay.active = !!active;
		this.bindGuideOverlayClick(this.guideStep5Overlay, !!active, this.onGuideStep5OverlayClick);
	}

	public setStep6GuideOverlayActive(active: boolean): void {
		if (!this.guideStep6Overlay || !this.guideStep6Overlay.isValid) return;
		this.guideStep6Overlay.active = !!active;
		this.bindGuideOverlayClick(this.guideStep6Overlay, !!active, this.onGuideStep6OverlayClick);
	}

	public bindGuideOverlayClick(node: cc.Node, enabled: boolean, handler: () => void): void {
		if (!node || !node.isValid || typeof handler !== "function") return;
		node.off(cc.Node.EventType.TOUCH_END, handler, this);
		if (enabled) {
			node.on(cc.Node.EventType.TOUCH_END, handler, this);
		}
	}

	public onGuideStep4OverlayClick(): void {
		const flow = this.getNewbieGuideFlow();
		if (flow && this.isNewbieGuideStep(flow.STEP_WITHDRAW_OPTION)) {
			this.setStep4GuideOverlayActive(false);
			if (this.guideStep4TipNode) this.guideStep4TipNode.active = false;
			this.selectedIndex = 0;
			this.advanceNewbieGuideStep(flow.STEP_WITHDRAW_OPTION);
			this.refreshAll();
		}
	}

	public onGuideStep5OverlayClick(): void {
		const flow = this.getNewbieGuideFlow();
		if (flow && this.isNewbieGuideStep(flow.STEP_WITHDRAW_BUTTON)) {
			this._guideStep5Pending = true;
			this.setStep5GuideOverlayActive(false);
			if (this.guideStep5TipNode) this.guideStep5TipNode.active = false;
			this.stopNewbieGuidePulse();
			this._bypassClickThrottle = true;
			this.onClickWithdraw();
		}
	}

	public onGuideStep6OverlayClick(): void {
		const flow = this.getNewbieGuideFlow();
		if (flow && this.isNewbieGuideStep(flow.STEP_WITHDRAW_BACK)) {
			this._bypassClickThrottle = true;
			this.onClickClose();
		}
	}

	public updateGuideMaskOverTarget(overlayNode: cc.Node, maskNode: cc.Node, targetNode: cc.Node, padX: number, padY: number): void {
		if (!overlayNode || !overlayNode.isValid
			|| !maskNode || !maskNode.isValid
			|| !targetNode || !targetNode.isValid
			|| !targetNode.parent || !targetNode.parent.isValid) return;
		const widget = maskNode.getComponent(cc.Widget);
		if (widget) widget.enabled = false;
		const worldPos = targetNode.parent.convertToWorldSpaceAR(cc.v2(targetNode.x, targetNode.y));
		const localPos = overlayNode.convertToNodeSpaceAR(worldPos);
		maskNode.x = localPos.x;
		maskNode.y = localPos.y;
		const px = Number(padX || 0);
		const py = Number(padY || 0);
		maskNode.width = Math.max(60, Number(targetNode.width || 0) + px);
		maskNode.height = Math.max(60, Number(targetNode.height || 0) + py);
	}

	public hideAllNewbieGuideOverlays(): void {
		this.setStep4GuideOverlayActive(false);
		this.setStep5GuideOverlayActive(false);
		this.setStep6GuideOverlayActive(false);
	}

	public showNewbieGuideTip(step: number, key: string, fallback: string): void {
		const text = this.i18n(key, [], fallback || "");
		this.hideAllNewbieGuideTipNodes();
		if (!text) return;
		this.newbieGuideToastStep = step;

		const flow = this.getNewbieGuideFlow();
		let tipNode: cc.Node | null = null;
		let tipLabel: cc.Label | null = null;
		if (flow && step === flow.STEP_WITHDRAW_OPTION) {
			tipNode = this.guideStep4TipNode;
			tipLabel = this.lblGuideStep4Tip;
		} else if (flow && step === flow.STEP_WITHDRAW_BUTTON) {
			tipNode = this.guideStep5TipNode;
			tipLabel = this.lblGuideStep5Tip;
		} else if (flow && step === flow.STEP_WITHDRAW_BACK) {
			tipNode = this.guideStep6TipNode;
			tipLabel = this.lblGuideStep6Tip;
		}

		if (tipNode && tipLabel) {
			this.setLabelText(tipLabel, text);
			tipNode.active = true;
		} else {
			this.setLabelText(this.lblBottomCondition, text);
		}
	}

	public refreshNewbieGuide(): void {
		const flow = this.getNewbieGuideFlow();
		if (!flow || (flow.isDone && flow.isDone())) {
			this.stopNewbieGuidePulse();
			this.hideAllNewbieGuideTipNodes();
			this.hideAllNewbieGuideOverlays();
			return;
		}
		if (!this._withdrawInfoLoaded) {
			this.stopNewbieGuidePulse();
			this.hideAllNewbieGuideTipNodes();
			this.hideAllNewbieGuideOverlays();
			return;
		}

		const step = this.getNewbieGuideStep();
		if (step === flow.STEP_WITHDRAW_OPTION) {
			const firstNode = this.optionButtons && this.optionButtons[0] && this.optionButtons[0].node;
			this.startNewbieGuidePulse(firstNode);
			this.setStep5GuideOverlayActive(false);
			this.setStep6GuideOverlayActive(false);
			this.setStep4GuideOverlayActive(true);
			this.showNewbieGuideTip(step, "key_newbie_guide_step4", "选择你想要提现的金额");
		} else if (step === flow.STEP_WITHDRAW_BUTTON) {
			if (this._guideStep5Pending) {
				this.stopNewbieGuidePulse();
				this.hideAllNewbieGuideTipNodes();
				this.hideAllNewbieGuideOverlays();
				return;
			}
			this.startNewbieGuidePulse(this.btnWithdraw);
			this.setStep4GuideOverlayActive(false);
			this.setStep6GuideOverlayActive(false);
			this.setStep5GuideOverlayActive(true);
			if (this.guideStep5Mask && this.guideStep5Mask.isValid) {
				this.guideStep5Mask.active = true;
			}
			this.showNewbieGuideTip(step, "key_newbie_guide_step5", "达成目标，立即提现");
		} else if (step === flow.STEP_WITHDRAW_BACK) {
			this.startNewbieGuidePulse(this.btnBack);
			this.setStep4GuideOverlayActive(false);
			this.setStep5GuideOverlayActive(false);
			this.setStep6GuideOverlayActive(true);
			if (this.guideStep6Mask && this.guideStep6Mask.isValid) {
				this.guideStep6Mask.active = true;
			}
			this.showNewbieGuideTip(step, "key_newbie_guide_step6", "继续闯关赚钱吧");
		} else {
			this.stopNewbieGuidePulse();
			this.hideAllNewbieGuideTipNodes();
			this.hideAllNewbieGuideOverlays();
		}
	}

	public tryAdvanceToStep6(): void {
		const flow = this.getNewbieGuideFlow();
		if (!flow) return;
		this._guideStep5Pending = false;
		if (this.advanceNewbieGuideStep(flow.STEP_WITHDRAW_BUTTON)
			|| this.isNewbieGuideStep(flow.STEP_WITHDRAW_BACK)) {
			this.refreshAll();
		}
	}

	public resetGuideStep5Pending(): void {
		if (!this._guideStep5Pending) return;
		this._guideStep5Pending = false;
		const flow = this.getNewbieGuideFlow();
		if (flow && this.isNewbieGuideStep(flow.STEP_WITHDRAW_BUTTON)) {
			this.refreshNewbieGuide();
		}
	}

	public isClickThrottled(): boolean {
		if (this._bypassClickThrottle) {
			this._bypassClickThrottle = false;
			this._lastClickTime = Date.now();
			return false;
		}
		const now = Date.now();
		if (now - this._lastClickTime < 500) return true;
		this._lastClickTime = now;
		return false;
	}

	public onClickOption(event: cc.Event.EventTouch): void {
		const idx = event && event.currentTarget && (event.currentTarget as any)._optionIndex;
		if (idx === undefined || idx === null) return;
		if (Number(idx) === Number(this.selectedIndex)) return;

		const flow = this.getNewbieGuideFlow();
		if (flow && this.isNewbieGuideStep(flow.STEP_WITHDRAW_OPTION)) {
			if (Number(idx) !== 0) return;
			this.advanceNewbieGuideStep(flow.STEP_WITHDRAW_OPTION);
		}
		this.selectedIndex = idx;
		this.refreshAll();
	}

	public onClickHistory(): void {
		if (this.isClickThrottled()) return;
		cc.log("[withMoodView] open history");
	}

	public onClickWithdraw(): void {
		if (this.isClickThrottled()) {
			this.resetGuideStep5Pending();
			return;
		}
		const opt = this.options[this.selectedIndex];
		if (!opt) {
			cc.warn("[withMoodView] no option selected");
			this.resetGuideStep5Pending();
			return;
		}

		const retry = (): void => {
			this.onClickWithdraw();
		};
		LoadingHttpService.getWithdrawChannels(Handler.create(this, (resp: any) => {
			if (NetErrorPopupService.shouldPop(resp)) {
				cc.warn("[withMoodView] getWithdrawChannels force-retry code=", resp && resp.code);
				NetErrorPopupService.showAndRetry(retry);
				return;
			}
			const code = Number(resp && resp.code);
			if (!(resp && resp.data && (isNaN(code) || code === 1))) {
				cc.warn("[withMoodView] getWithdrawChannels failed:", resp && resp.message);
				this.resetGuideStep5Pending();
				return;
			}
			if (!this.node || !this.node.isValid || !this.node.activeInHierarchy) {
				cc.warn("[withMoodView] getWithdrawChannels success but view already hidden, skip popup");
				this.resetGuideStep5Pending();
				return;
			}

			const data = resp.data;
			const channelList = this.extractChannelList(data);
			const existingBindInfo = Array.isArray(PlayerDataStore.tx_bind_info) ? PlayerDataStore.tx_bind_info : [];
			const validBindInfo = this.pickValidBindInfo(existingBindInfo, channelList);
			const onDone = (): void => {
				this.tryAdvanceToStep6();
			};
			if (validBindInfo) {
				this.showCheckView(opt, data, validBindInfo, onDone);
			} else {
				this.showSetView(opt, data, null, onDone);
			}
		}), Handler.create(this, (err: any) => {
			if (NetErrorPopupService.shouldPop(err)) {
				cc.warn("[withMoodView] getWithdrawChannels 网络异常，弹重试窗 err=", err && err.message);
				NetErrorPopupService.showAndRetry(retry);
			} else {
				cc.warn("[withMoodView] getWithdrawChannels error:", err && err.message);
				this.resetGuideStep5Pending();
			}
		}));
	}

	public showSetView(selectedOpt: any, channelData: any, initialBindInfo: any, onClose: (() => void) | null): void {
		UIMgr.getInstance().show(UIDefine.cashArrowSetView).then((node: cc.Node) => {
			if (!node || !node.isValid) return;
			let comp = node.getComponent(cashArrowSetView);
			if (!comp) comp = node.addComponent(cashArrowSetView);
			if (comp.setEntryData) {
				comp.setEntryData({
					selectedOpt: selectedOpt,
					channelData: channelData,
					initialBindInfo: initialBindInfo || null,
					onClose: onClose || null,
					onValidated: (bindInfo: any) => {
						this.showCheckView(selectedOpt, channelData, bindInfo, onClose);
					}
				});
			}
		});
	}

	public showCheckView(selectedOpt: any, channelData: any, bindInfo: any, onClose: (() => void) | null): void {
		UIMgr.getInstance().show(UIDefine.cashArrowCheckView).then((node: cc.Node) => {
			if (!node || !node.isValid) return;
			let comp = node.getComponent(cashArrowCheckView);
			if (!comp) comp = node.addComponent(cashArrowCheckView);
			if (comp.setEntryData) {
				comp.setEntryData({
					selectedOpt: selectedOpt,
					channelData: channelData,
					bindInfo: bindInfo,
					onClose: onClose || null,
					onRevise: (newBindInfo: any) => {
						this.showSetView(selectedOpt, channelData, newBindInfo || bindInfo, onClose);
					},
					onWithdraw: (currentBindInfo: any, currentOpt: any, done: any) => {
						this.tryAdvanceToStep6();
						this.submitWithdrawFlow({
							selectedOpt: currentOpt || selectedOpt,
							bindInfo: currentBindInfo || bindInfo,
							checkNode: node,
							done: done
						});
					}
				});
			}
		});
	}

	public extractChannelList(data: any): any[] {
		if (!data) return [];
		if (Array.isArray(data)) return data;
		let list = data.channel_list || data.channels || data.list || [];
		if (Array.isArray(list)) return list.filter(Boolean);
		if (data.data) {
			const inner = data.data;
			list = inner.channel_list || inner.channels || inner.list || [];
			if (Array.isArray(list)) return list.filter(Boolean);
		}
		return [];
	}

	public pickValidBindInfo(bindList: any[], channelList: any[]): any | null {
		if (!Array.isArray(bindList) || bindList.length <= 0) return null;
		if (!Array.isArray(channelList) || channelList.length <= 0) return null;
		for (let i = 0; i < bindList.length; i++) {
			const bind = bindList[i];
			if (!bind) continue;
			for (let j = 0; j < channelList.length; j++) {
				const ch = channelList[j];
				if (ch
					&& (bind.channel || "") === (ch.channel || "")
					&& (bind.sub_channel || "") === (ch.sub_channel || "")) {
					return bind;
				}
			}
		}
		return null;
	}

	public submitWithdrawFlow(params: any): boolean {
		const selectedOpt = params && params.selectedOpt;
		const bindInfo = params && params.bindInfo;
		const checkNode = params && params.checkNode;
		const done = params && params.done;

		if (this.isWithdrawSubmitting) {
			if (done) done();
			return false;
		}
		if (!selectedOpt) {
			cc.warn("[withMoodView] submitWithdrawFlow no selectedOpt");
			this.showToast(this.i18n("key_cash_check_withdraw_failed", null, "Withdrawal failed"));
			if (done) done();
			return false;
		}
		if (!bindInfo) {
			cc.warn("[withMoodView] submitWithdrawFlow no bindInfo");
			this.showToast(this.i18n("key_cash_check_bind_failed", null, "Binding failed"));
			if (done) done();
			return false;
		}

		this.isWithdrawSubmitting = true;
		const finish = (): void => {
			this.isWithdrawSubmitting = false;
			if (done) done();
		};
		const requestData = this.buildBindRequestData(bindInfo);
		const retry = (): void => {
			this.isWithdrawSubmitting = false;
			this.submitWithdrawFlow(params);
		};

		LoadingHttpService.bindTxAccount(requestData, Handler.create(this, (resp: any) => {
			if (NetErrorPopupService.shouldPop(resp)) {
				cc.warn("[withMoodView] bindTxAccount force-retry code=", resp && resp.code);
				this.isWithdrawSubmitting = false;
				NetErrorPopupService.showAndRetry(retry);
				return;
			}
			if (resp && Number(resp.code) === 1) {
				this.syncBindInfoToStore(resp, bindInfo);
				this.refreshUserInfoAfterBind();
				const condition = this.checkWithdrawCondition(selectedOpt);
				if (condition.pass) {
					this.executeWithdrawRequest(selectedOpt, bindInfo, checkNode, finish);
				} else {
					this.showToast(condition.message || this.i18n("key_withdraw_cond_not_met", null, "Withdrawal conditions not met"));
					finish();
				}
			} else {
				cc.warn("[withMoodView] bind failed:", resp && resp.message);
				this.showToast((resp && resp.message) || this.i18n("key_cash_check_bind_failed", null, "Binding failed"));
				finish();
			}
		}), Handler.create(this, (err: any) => {
			if (NetErrorPopupService.shouldPop(err)) {
				cc.warn("[withMoodView] bindTxAccount 网络异常，弹重试窗 err=", err && err.message);
				this.isWithdrawSubmitting = false;
				NetErrorPopupService.showAndRetry(retry);
			} else {
				cc.warn("[withMoodView] bind error:", err && err.message);
				this.showToast((err && err.message) || this.i18n("key_common_network_error", null, "Network error"));
				finish();
			}
		}));
		return true;
	}

	public checkWithdrawCondition(opt: any): WithdrawConditionResult {
		const data = opt || {};
		let status = parseInt(data.status, 10);
		if (isNaN(status)) status = 0;
		const money = Number(data.money || 0);

		if (status === 4) return { pass: true, message: "" };

		if (status === 0) {
			const gap = Math.max(0, money - Number(this.userBalance || 0));
			if (gap <= 0) return { pass: true, message: "" };
			return {
				pass: false,
				message: this.i18n("key_withdraw_toast_need_gap", [this.getCurrencyText(gap)], "Insufficient balance")
			};
		}

		if (status === 1) {
			const remain = Math.max(0, Number(data.levels_passed_limit || 0) - Number(data.current_extract_levels_passed_count || 0));
			if (remain <= 0) return { pass: true, message: "" };
			return {
				pass: false,
				message: this.i18n("key_withdraw_toast_need_episode", [remain], "Not enough cleared levels")
			};
		}

		if (status === 2) {
			const remain = Math.max(0, Number(data.sign_in_limit || 0) - Number(data.sign_in || 0));
			if (remain <= 0) return { pass: true, message: "" };
			return {
				pass: false,
				message: this.i18n("key_withdraw_toast_need_days", [remain], "Not enough check-in days")
			};
		}

		if (status === 3) {
			const level = Number(data.level || this.userLevel || 0);
			if (Math.max(0, Number(data.level_limit || 0) - level) <= 0) return { pass: true, message: "" };
			return {
				pass: false,
				message: this.i18n("key_withdraw_toast_need_level", [data.level_limit || 0], "Level too low")
			};
		}

		return { pass: true, message: "" };
	}

	public buildBindRequestData(bindInfo: any): any {
		const data: any = {
			channel: bindInfo.channel || "",
			sub_channel: bindInfo.sub_channel || ""
		};

		if (bindInfo._input_data) {
			for (const key in bindInfo._input_data) {
				if (Object.prototype.hasOwnProperty.call(bindInfo._input_data, key)) {
					data[key] = bindInfo._input_data[key];
				}
			}
		} else {
			const fields = Array.isArray(bindInfo.need_field) && bindInfo.need_field.length > 0
				? bindInfo.need_field
				: [{ field_value: "account" }, { field_value: "payee_name" }];
			for (let i = 0; i < fields.length; i++) {
				const field = fields[i];
				if (field && field.field_value) {
					data[field.field_value] = this.resolveRawBindFieldValue(bindInfo, field.field_value);
				}
			}
		}

		if (!data.account) {
			data.account = bindInfo.account || bindInfo.phone || bindInfo.email || "";
		}
		if (!data.payee_name) {
			data.payee_name = bindInfo.payee_name || bindInfo.name || "";
		}
		if (!data.name && data.payee_name) {
			data.name = data.payee_name;
		}
		return data;
	}

	public resolveRawBindFieldValue(bindInfo: any, field: string): string {
		if (!bindInfo || !field) return "";
		const value = bindInfo[field];
		if (value !== null && value !== undefined && value !== "") {
			return String(value);
		}
		if (field === "name" || field === "payee_name") {
			return bindInfo.payee_name || bindInfo.name || "";
		}
		if (field === "account") {
			return bindInfo.account || bindInfo.phone || bindInfo.email || "";
		}
		return "";
	}

	public syncBindInfoToStore(resp: any, bindInfo: any): void {
		if (resp && resp.data && Array.isArray(resp.data.tx_bind_info)) {
			PlayerDataStore.tx_bind_info = resp.data.tx_bind_info;
			return;
		}
		const list = Array.isArray(PlayerDataStore.tx_bind_info) ? PlayerDataStore.tx_bind_info.slice() : [];
		let replaced = false;
		for (let i = 0; i < list.length; i++) {
			const item = list[i];
			if (item
				&& (item.channel || "") === (bindInfo.channel || "")
				&& (item.sub_channel || "") === (bindInfo.sub_channel || "")) {
				list[i] = bindInfo;
				replaced = true;
				break;
			}
		}
		if (!replaced) list.push(bindInfo);
		PlayerDataStore.tx_bind_info = list;
	}

	public refreshUserInfoAfterBind(): void {
		GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.refreshUserInfo);
		this.fetchUserInfoByService();
	}

	public fetchUserInfoByService(): void {
		try {
			if (!UserInfoService || typeof UserInfoService.getInstance !== "function") return;
			const service = UserInfoService.getInstance();
			if (service && typeof service.fetch === "function") {
				service.fetch();
			}
		} catch (err) {
			cc.warn("[withMoodView] fetch user info error:", err && err.message);
		}
	}

	public executeWithdrawRequest(selectedOpt: any, bindInfo: any, checkNode: cc.Node | null, done: (() => void) | null): void {
		const txId = (selectedOpt && selectedOpt.id) || "";
		if (!txId) {
			this.showToast(this.i18n("key_cash_check_withdraw_failed", null, "Withdrawal failed"));
			if (done) done();
			return;
		}

		const payload = {
			tx_id: txId,
			channel: bindInfo.channel || "",
			sub_channel: bindInfo.sub_channel || ""
		};
		const retry = (): void => {
			this.executeWithdrawRequest(selectedOpt, bindInfo, checkNode, done);
		};

		LoadingHttpService.withdrawCash(payload, Handler.create(this, (resp: any) => {
			if (NetErrorPopupService.shouldPop(resp)) {
				cc.warn("[withMoodView] withdrawCash force-retry code=", resp && resp.code);
				NetErrorPopupService.showAndRetry(retry);
				return;
			}
			if (resp && Number(resp.code) === 1) {
				GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.refreshUserInfo);
				this.fetchUserInfoByService();
				this.showToast(this.i18n("key_cash_check_withdraw_success", null, "Withdrawal successful"));
				if (checkNode && checkNode.isValid) {
					UIMgr.getInstance().hide(checkNode);
				}
				this.loadWithdrawInfo();
				if (done) done();
			} else {
				cc.warn("[withMoodView] withdraw failed:", resp && resp.message);
				this.showToast((resp && resp.message) || this.i18n("key_cash_check_withdraw_failed", null, "Withdrawal failed"));
				if (done) done();
			}
		}), Handler.create(this, (err: any) => {
			if (NetErrorPopupService.shouldPop(err)) {
				cc.warn("[withMoodView] withdrawCash 网络异常，弹重试窗 err=", err && err.message);
				NetErrorPopupService.showAndRetry(retry);
			} else {
				cc.warn("[withMoodView] withdraw error:", err && err.message);
				this.showToast((err && err.message) || this.i18n("key_common_network_error", null, "Network error"));
				if (done) done();
			}
		}));
	}

	public showToast(msg: any): void {
		if (!msg && msg !== 0) return;
		const text = String(msg);
		try {
			if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
				const bridge = NativeSdkBridgeAdapter && typeof NativeSdkBridgeAdapter.getBridge === "function"
					? NativeSdkBridgeAdapter.getBridge()
					: null;
				if (bridge && typeof bridge.showAppLongTapToast === "function") {
					bridge.showAppLongTapToast(text, 0);
					return;
				}
			}
			if (Tips && typeof Tips.show === "function") {
				Tips.show(text);
			}
		} catch (err) {
			cc.log("[withMoodView] toast:", text);
		}
	}

	public onClickClose(): void {
		if (this.isClickThrottled()) return;
		this._guideStep5Pending = false;
		const flow = this.getNewbieGuideFlow();
		if (flow) this.advanceNewbieGuideStep(flow.STEP_WITHDRAW_BACK);
		this.stopNewbieGuidePulse();
		UIMgr.getInstance().hide(this.node);
	}

	public formatMoney(value: number): string {
		return Math.max(0, Math.floor(value || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}

	public getCurrencyText(value: number, displayValue?: number): string {
		const v = arguments.length > 1 ? displayValue : value;
		return LanguageService.formatCurrency(v);
	}

	public i18n(key: string, args?: any[] | null, fallback?: string): string {
		return LanguageService.t(key, args, fallback);
	}

	public setLabelText(label: cc.Label | null, text: string): void {
		if (label) label.string = text || "";
	}

	public setLabelI18n(label: cc.Label | null, key: string, args?: any[] | null, fallback?: string): void {
		if (!label || !key) return;
		const i18nLabel = label.node.getComponent("I18nLabel") as any;
		if (i18nLabel && typeof i18nLabel.setI18nKey === "function") {
			i18nLabel.setI18nKey(key, args || [], fallback);
		} else {
			label.string = this.i18n(key, args || [], fallback);
		}
	}

	public findNode(name: string): cc.Node | null {
		return this.findNodeDeep(this.node, name);
	}

	public findLabel(name: string): cc.Label | null {
		const node = this.findNode(name);
		if (!node) return null;
		let label = node.getComponent(cc.Label);
		if (!label) label = node.addComponent(cc.Label);
		return label;
	}

	public findNodeDeep(node: cc.Node | null, name: string): cc.Node | null {
		if (!node) return null;
		if (node.name === name) return node;
		for (let i = 0; i < node.childrenCount; i++) {
			const found = this.findNodeDeep(node.children[i], name);
			if (found) return found;
		}
		return null;
	}
}