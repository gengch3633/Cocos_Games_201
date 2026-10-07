import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import RTLNoMirror from "./RTLNoMirror";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RTLLayoutAdapter extends cc.Component {
    @property({
        tooltip: "处理子树里的 cc.Widget ： isAlignLeft <-> isAlignRight ， left <-> right"
    })
    affectWidget: boolean = true;

    @property({
        tooltip: "处理子树里的 cc.Layout ： HORIZONTAL/GRID 时翻转 horizontalDirection"
    })
    affectLayout: boolean = true;

    @property({
        tooltip: "CENTER_H 锚点的水平偏移在 RTL 下取反 （ 偏右-> 偏左 ）"
    })
    flipCenterHOffset: boolean = true;

    @property({
        tooltip: "根节点自身的 Widget/Layout 是否也参与镜像 ； Canvas 撑满 Widget 翻无差 ， prefab 根节点开启更符合预期"
    })
    affectSelf: boolean = true;

    @property({
        tooltip: "子节点 x 坐标按父中心镜像；项目里很多节点用绝对坐标定位时必须开"
    })
    affectPosition: boolean = true;

    _cache: any[] = [];
    _collected: boolean = false;
    _isDestroyed: boolean = false;

    onLoad(): void {
        this._cache = [];
        this._collected = false;
        this._isDestroyed = false;
        this.bindLanguageEvent();
        this.scheduleOnce(this.initAdapter, 0);
    }

    onDestroy(): void {
        this._isDestroyed = true;
        this.unbindLanguageEvent();
    }

    bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    initAdapter(): void {
        if (!this._isDestroyed) {
            this.collectNodes();
            this.applyLayout();
            try {
                const isRTL = typeof (LanguageService as any).isRTL === "function"? (LanguageService as any).isRTL() : false; if (isRTL) { const nodeName = this.node && this.node.name ? this.node.name :"?";
                    cc.log("[RTLLayoutAdapter] init on '" + nodeName + "' cached=" + this._cache.length + " rtl=true");
                }
            } catch (err) { }
        }
    }

    onLanguageChanged(): void {
        if (!this._isDestroyed) {
            if (!this._collected) {
                this.collectNodes();
            }
            this.applyLayout();
        }
    }

    collectNodes(): void {
        this._cache = [];
        if (this.node && this.node.isValid) {
            this.walkNode(this.node);
            this._collected = true;
        } else {
            this._collected = true;
        }
    }

    walkNode(node: cc.Node): void {
        if (!node || !node.isValid) {
            return;
        }
        if (node !== this.node && (node.getComponent(RTLNoMirror) || node.getComponent(RTLLayoutAdapter))) {
            return;
        }
        let widget: cc.Widget = null;
        if (node !== this.node || this.affectSelf) {
            if (this.affectWidget) {
                widget = node.getComponent(cc.Widget);
                if (widget) {
                    this._cache.push({
                        kind: "widget",
                        comp: widget,
                        orig: this.snapshotWidget(widget)
                    });
                }
            }
            if (this.affectLayout) {
                const layout = node.getComponent(cc.Layout);
                if (layout) {
                    this._cache.push({
                        kind: "layout",
                        comp: layout,
                        orig: this.snapshotLayout(layout)
                    });
                }
            }
        }
        if (this.affectPosition && node !== this.node) {
            const parentLayout = node.parent && node.parent.getComponent && node.parent.getComponent(cc.Layout);
            const nodeWidget = widget || (this.affectWidget ? null : node.getComponent(cc.Widget));
            if (!nodeWidget && !parentLayout) {
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
            this.walkNode(node.children[i]);
        }
    }

    snapshotWidget(widget: cc.Widget): any {
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

    snapshotLayout(layout: cc.Layout): any {
        return {
            type: layout.type,
            horizontalDirection: layout.horizontalDirection,
            paddingLeft: layout.paddingLeft,
            paddingRight: layout.paddingRight
        };
    }

    applyLayout(): void {
        if (!this._isDestroyed) {
            const isRTL = typeof (LanguageService as any).isRTL === "function"? (LanguageService as any).isRTL() : false; for (let i = 0; i < this._cache.length; i++) { const item = this._cache[i]; const valid = item.kind ==="position"? item.node && item.node.isValid : item.comp && item.comp.isValid; if (valid) { if (item.kind ==="widget") {
                        isRTL ? this.mirrorWidget(item.comp, item.orig) : this.restoreWidget(item.comp, item.orig);
                    } else if (item.kind === "layout") {
                        isRTL ? this.mirrorLayout(item.comp, item.orig) : this.restoreLayout(item.comp, item.orig);
                    } else if (item.kind === "position") {
                        isRTL ? this.mirrorPosition(item) : this.restorePosition(item);
                    }
                }
            }
        }
    }

    mirrorWidget(widget: cc.Widget, orig: any): void {
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
        widget.updateAlignment && widget.updateAlignment();
    }

    restoreWidget(widget: cc.Widget, orig: any): void {
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
        widget.updateAlignment && widget.updateAlignment();
    }

    mirrorLayout(layout: cc.Layout, orig: any): void {
        if (orig.type === cc.Layout.Type.HORIZONTAL || orig.type === cc.Layout.Type.GRID) {
            layout.horizontalDirection = orig.horizontalDirection === cc.Layout.HorizontalDirection.LEFT_TO_RIGHT ? cc.Layout.HorizontalDirection.RIGHT_TO_LEFT : cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
            layout.paddingLeft = orig.paddingRight;
            layout.paddingRight = orig.paddingLeft;
        }
    }

    restoreLayout(layout: cc.Layout, orig: any): void {
        layout.horizontalDirection = orig.horizontalDirection;
        layout.paddingLeft = orig.paddingLeft;
        layout.paddingRight = orig.paddingRight;
    }

    mirrorPosition(item: any): void {
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

    restorePosition(item: any): void {
        item.node.x = item.orig.x;
    }

    rebuild(): void {
        if (this._cache && this._cache.length > 0) {
            for (let i = 0; i < this._cache.length; i++) {
                const item = this._cache[i];
                if (item.comp && item.comp.isValid) {
                    if (item.kind === "widget") {
                        this.restoreWidget(item.comp, item.orig);
                    } else if (item.kind === "layout") {
                        this.restoreLayout(item.comp, item.orig);
                    }
                }
            }
        }
        this.collectNodes();
        this.applyLayout();
    }
}
