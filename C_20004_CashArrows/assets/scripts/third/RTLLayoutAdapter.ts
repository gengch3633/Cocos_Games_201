import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import RTLNoMirror from "./RTLNoMirror";

const { ccclass, property } = cc._decorator;

interface WidgetSnapshot {
	alignFlags: number;
	isAlignLeft: boolean;
	isAlignRight: boolean;
	isAlignHorizontalCenter: boolean;
	left: number;
	right: number;
	horizontalCenter: number;
	isAbsLeft: boolean;
	isAbsRight: boolean;
	isAbsHorizontalCenter: boolean;
}

interface LayoutSnapshot {
	type: number;
	horizontalDirection: number;
	paddingLeft: number;
	paddingRight: number;
}

interface WidgetCacheItem {
	kind: "widget";
	comp: cc.Widget;
	orig: WidgetSnapshot;
}

interface LayoutCacheItem {
	kind: "layout";
	comp: cc.Layout;
	orig: LayoutSnapshot;
}

interface PositionCacheItem {
	kind: "position";
	node: cc.Node;
	orig: { x: number };
}

type CacheItem = WidgetCacheItem | LayoutCacheItem | PositionCacheItem;

@ccclass
export default class RTLLayoutAdapter extends cc.Component {

	@property({ tooltip: "处理子树里的 cc.Widget：isAlignLeft <-> isAlignRight，left <-> right" })
	public affectWidget: boolean = true;

	@property({ tooltip: "处理子树里的 cc.Layout：HORIZONTAL/GRID 时翻转 horizontalDirection" })
	public affectLayout: boolean = true;

	@property({ tooltip: "CENTER_H 锚点的水平偏移在 RTL 下取反（偏右 -> 偏左）" })
	public flipCenterHOffset: boolean = true;

	@property({ tooltip: "根节点自身的 Widget / Layout 是否也参与镜像；Canvas 撑满 Widget 翻无差，prefab 根节点开启更符合预期" })
	public affectSelf: boolean = true;

	@property({ tooltip: "子节点 x 坐标按父中心镜像；项目里很多节点用绝对坐标定位时必须开" })
	public affectPosition: boolean = true;

	private _cache: CacheItem[] = [];
	private _collected: boolean = false;
	private _isDestroyed: boolean = false;

	protected onLoad(): void {
		this._cache = [];
		this._collected = false;
		this._isDestroyed = false;
		this.bindLanguageEvent();
		this.scheduleOnce(this._init, 0);
	}

	protected onDestroy(): void {
		this._isDestroyed = true;
		this.unbindLanguageEvent();
	}

	public bindLanguageEvent(): void {
		GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this._onLanguageChanged, this);
	}

	public unbindLanguageEvent(): void {
		GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this._onLanguageChanged, this);
	}

	private _init(): void {
		if (this._isDestroyed) {
			return;
		}
		this._collect();
		this._apply();
		try {
			if (LanguageService.isRTL()) {
				const name = this.node && this.node.name ? this.node.name : "?";
				cc.log("[RTLLayoutAdapter] init on '" + name + "' cached=" + this._cache.length + " rtl=true");
			}
		} catch (e) {
		}
	}

	private _onLanguageChanged(): void {
		if (this._isDestroyed) {
			return;
		}
		if (!this._collected) {
			this._collect();
		}
		this._apply();
	}

	private _collect(): void {
		this._cache = [];
		if (this.node && this.node.isValid) {
			this._walk(this.node);
			this._collected = true;
		} else {
			this._collected = true;
		}
	}

	private _walk(node: cc.Node): void {
		if (!node || !node.isValid) {
			return;
		}
		if (node !== this.node && (node.getComponent(RTLNoMirror) || node.getComponent(RTLLayoutAdapter))) {
			return;
		}

		let widget: cc.Widget | null = null;
		if (node !== this.node || this.affectSelf) {
			if (this.affectWidget) {
				widget = node.getComponent(cc.Widget);
				if (widget) {
					this._cache.push({
						kind: "widget",
						comp: widget,
						orig: this._snapshotWidget(widget)
					});
				}
			}
			if (this.affectLayout) {
				const layout = node.getComponent(cc.Layout);
				if (layout) {
					this._cache.push({
						kind: "layout",
						comp: layout,
						orig: this._snapshotLayout(layout)
					});
				}
			}
		}

		if (this.affectPosition && node !== this.node) {
			const targetWidget = widget || (this.affectWidget ? null : node.getComponent(cc.Widget));
			const parent = node.parent;
			const parentLayout = parent && parent.getComponent ? parent.getComponent(cc.Layout) : null;
			if (!targetWidget && !parentLayout) {
				this._cache.push({
					kind: "position",
					node: node,
					orig: {
						x: node.x
					}
				});
			}
		}

		for (let i = 0; i < node.childrenCount; i++) {
			this._walk(node.children[i]);
		}
	}

	private _snapshotWidget(widget: cc.Widget): WidgetSnapshot {
		return {
			alignFlags: (widget as any)._alignFlags,
			isAlignLeft: widget.isAlignLeft,
			isAlignRight: widget.isAlignRight,
			isAlignHorizontalCenter: widget.isAlignHorizontalCenter,
			left: widget.left,
			right: widget.right,
			horizontalCenter: widget.horizontalCenter,
			isAbsLeft: !!widget.isAbsoluteLeft,
			isAbsRight: !!widget.isAbsoluteRight,
			isAbsHorizontalCenter: !!widget.isAbsoluteHorizontalCenter
		};
	}

	private _snapshotLayout(layout: cc.Layout): LayoutSnapshot {
		return {
			type: layout.type,
			horizontalDirection: layout.horizontalDirection,
			paddingLeft: layout.paddingLeft,
			paddingRight: layout.paddingRight
		};
	}

	private _apply(): void {
		if (this._isDestroyed) {
			return;
		}
		const rtl = LanguageService.isRTL();
		for (let i = 0; i < this._cache.length; i++) {
			const item = this._cache[i];
			if (item.kind === "position") {
				if (!item.node || !item.node.isValid) {
					continue;
				}
				if (rtl) {
					this._mirrorPosition(item);
				} else {
					this._restorePosition(item);
				}
			} else if (item.kind === "widget") {
				if (!item.comp || !item.comp.isValid) {
					continue;
				}
				if (rtl) {
					this._mirrorWidget(item.comp, item.orig);
				} else {
					this._restoreWidget(item.comp, item.orig);
				}
			} else if (item.kind === "layout") {
				if (!item.comp || !item.comp.isValid) {
					continue;
				}
				if (rtl) {
					this._mirrorLayout(item.comp, item.orig);
				} else {
					this._restoreLayout(item.comp, item.orig);
				}
			}
		}
	}

	private _mirrorWidget(widget: cc.Widget, orig: WidgetSnapshot): void {
		widget.isAlignLeft = orig.isAlignRight;
		widget.isAlignRight = orig.isAlignLeft;
		widget.left = orig.right;
		widget.right = orig.left;
		widget.isAbsoluteLeft = orig.isAbsRight;
		widget.isAbsoluteRight = orig.isAbsLeft;
		if (orig.isAlignHorizontalCenter && this.flipCenterHOffset) {
			widget.horizontalCenter = -orig.horizontalCenter;
			widget.isAbsoluteHorizontalCenter = orig.isAbsHorizontalCenter;
		}
		if (widget.updateAlignment) {
			widget.updateAlignment();
		}
	}

	private _restoreWidget(widget: cc.Widget, orig: WidgetSnapshot): void {
		widget.isAlignLeft = orig.isAlignLeft;
		widget.isAlignRight = orig.isAlignRight;
		widget.left = orig.left;
		widget.right = orig.right;
		widget.isAbsoluteLeft = orig.isAbsLeft;
		widget.isAbsoluteRight = orig.isAbsRight;
		if (orig.isAlignHorizontalCenter) {
			widget.horizontalCenter = orig.horizontalCenter;
			widget.isAbsoluteHorizontalCenter = orig.isAbsHorizontalCenter;
		}
		if (widget.updateAlignment) {
			widget.updateAlignment();
		}
	}

	private _mirrorLayout(layout: cc.Layout, orig: LayoutSnapshot): void {
		if (orig.type === cc.Layout.Type.HORIZONTAL || orig.type === cc.Layout.Type.GRID) {
			layout.horizontalDirection = orig.horizontalDirection === cc.Layout.HorizontalDirection.LEFT_TO_RIGHT
				? cc.Layout.HorizontalDirection.RIGHT_TO_LEFT
				: cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
			layout.paddingLeft = orig.paddingRight;
			layout.paddingRight = orig.paddingLeft;
		}
	}

	private _restoreLayout(layout: cc.Layout, orig: LayoutSnapshot): void {
		layout.horizontalDirection = orig.horizontalDirection;
		layout.paddingLeft = orig.paddingLeft;
		layout.paddingRight = orig.paddingRight;
	}

	private _mirrorPosition(item: PositionCacheItem): void {
		const node = item.node;
		const parent = node.parent;
		if (parent && parent.isValid) {
			const width = parent.width || 0;
			const anchorX = parent.anchorX != null ? parent.anchorX : 0.5;
			node.x = width * (1 - 2 * anchorX) - item.orig.x;
		} else {
			node.x = -item.orig.x;
		}
	}

	private _restorePosition(item: PositionCacheItem): void {
		item.node.x = item.orig.x;
	}

	public rebuild(): void {
		if (this._cache && this._cache.length > 0) {
			for (let i = 0; i < this._cache.length; i++) {
				const item = this._cache[i];
				if (item.kind === "widget") {
					if (item.comp && item.comp.isValid) {
						this._restoreWidget(item.comp, item.orig);
					}
				} else if (item.kind === "layout") {
					if (item.comp && item.comp.isValid) {
						this._restoreLayout(item.comp, item.orig);
					}
				}
			}
		}
		this._collect();
		this._apply();
	}
}