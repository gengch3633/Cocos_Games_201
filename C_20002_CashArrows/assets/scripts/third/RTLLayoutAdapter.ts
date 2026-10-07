import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import RTLNoMirror from "./RTLNoMirror";

const { ccclass, property } = cc._decorator;

type CacheEntry =
    | { kind: "widget"; comp: cc.Widget; orig: any }
    | { kind: "layout"; comp: cc.Layout; orig: any }
    | { kind: "position"; node: cc.Node; orig: { x: number } };

@ccclass
export default class RTLLayoutAdapter extends cc.Component {
    @property({
        tooltip: "处理子树里的 cc.Widget：isAlignLeft <-> isAlignRight，left <-> right",
    })
    affectWidget = true;

    @property({
        tooltip: "处理子树里的 cc.Layout：HORIZONTAL/GRID 时翻转 horizontalDirection",
    })
    affectLayout = true;

    @property({
        tooltip: "CENTER_H 锚点的水平偏移在 RTL 下取反（偏右 -> 偏左）",
    })
    flipCenterHOffset = true;

    @property({
        tooltip: "根节点自身的 Widget / Layout 是否也参与镜像；Canvas 撑满 Widget 翻无差，prefab 根节点开启更符合预期",
    })
    affectSelf = true;

    @property({
        tooltip: "子节点 x 坐标按父中心镜像；项目里很多节点用绝对坐标定位时必须开",
    })
    affectPosition = true;

    _cache: CacheEntry[] = [];
    _collected = false;
    _isDestroyed = false;

    onLoad(): void {
        this._cache = [];
        this._collected = false;
        this._isDestroyed = false;
        this.bindLanguageEvent();
        this.scheduleOnce(this._init, 0);
    }

    onDestroy(): void {
        this._isDestroyed = true;
        this.unbindLanguageEvent();
    }

    bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this._onLanguageChanged, this);
    }

    unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this._onLanguageChanged, this);
    }

    _init(): void {
        if (this._isDestroyed) {
            return;
        }
        this._collect();
        this._apply();
        try {
            if (LanguageService.isRTL()) {
                const nodeName = this.node && this.node.name ? this.node.name : "?";
                cc.log("[RTLLayoutAdapter] init on '" + nodeName + "' cached=" + this._cache.length + " rtl=true");
            }
        } catch (e) {
        }
    }

    _onLanguageChanged(): void {
        if (this._isDestroyed) {
            return;
        }
        if (!this._collected) {
            this._collect();
        }
        this._apply();
    }

    _collect(): void {
        this._cache = [];
        if (this.node && this.node.isValid) {
            this._walk(this.node);
            this._collected = true;
        } else {
            this._collected = true;
        }
    }

    _walk(node: cc.Node): void {
        if (!node || !node.isValid) {
            return;
        }
        if (
            node !== this.node &&
            (node.getComponent(RTLNoMirror) || node.getComponent(RTLLayoutAdapter))
        ) {
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
                        orig: this._snapshotWidget(widget),
                    });
                }
            }
            if (this.affectLayout) {
                const layout = node.getComponent(cc.Layout);
                if (layout) {
                    this._cache.push({
                        kind: "layout",
                        comp: layout,
                        orig: this._snapshotLayout(layout),
                    });
                }
            }
        }
        if (this.affectPosition && node !== this.node) {
            const parent = node.parent;
            const parentLayout = parent && parent.getComponent && parent.getComponent(cc.Layout);
            const nodeWidget = widget || (this.affectWidget ? null : node.getComponent(cc.Widget));
            if (!nodeWidget && !parentLayout) {
                this._cache.push({
                    kind: "position",
                    node: node,
                    orig: { x: node.x },
                });
            }
        }
        for (let i = 0; i < node.childrenCount; i++) {
            this._walk(node.children[i]);
        }
    }

    _snapshotWidget(widget: cc.Widget): any {
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
            isAbsHorizontalCenter: !!widget.isAbsoluteHorizontalCenter,
        };
    }

    _snapshotLayout(layout: cc.Layout): any {
        return {
            type: layout.type,
            horizontalDirection: layout.horizontalDirection,
            paddingLeft: layout.paddingLeft,
            paddingRight: layout.paddingRight,
        };
    }

    _apply(): void {
        if (this._isDestroyed) {
            return;
        }
        const isRtl = LanguageService.isRTL();
        for (let i = 0; i < this._cache.length; i++) {
            const entry = this._cache[i];
            const isValid = entry.kind === "position"
                ? entry.node && entry.node.isValid
                : entry.comp && entry.comp.isValid;
            if (!isValid) {
                continue;
            }
            if (entry.kind === "widget") {
                if (isRtl) {
                    this._mirrorWidget(entry.comp, entry.orig);
                } else {
                    this._restoreWidget(entry.comp, entry.orig);
                }
            } else if (entry.kind === "layout") {
                if (isRtl) {
                    this._mirrorLayout(entry.comp, entry.orig);
                } else {
                    this._restoreLayout(entry.comp, entry.orig);
                }
            } else if (entry.kind === "position") {
                if (isRtl) {
                    this._mirrorPosition(entry);
                } else {
                    this._restorePosition(entry);
                }
            }
        }
    }

    _mirrorWidget(widget: cc.Widget, orig: any): void {
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

    _restoreWidget(widget: cc.Widget, orig: any): void {
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

    _mirrorLayout(layout: cc.Layout, orig: any): void {
        if (orig.type === cc.Layout.Type.HORIZONTAL || orig.type === cc.Layout.Type.GRID) {
            layout.horizontalDirection = orig.horizontalDirection === cc.Layout.HorizontalDirection.LEFT_TO_RIGHT
                ? cc.Layout.HorizontalDirection.RIGHT_TO_LEFT
                : cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
            layout.paddingLeft = orig.paddingRight;
            layout.paddingRight = orig.paddingLeft;
        }
    }

    _restoreLayout(layout: cc.Layout, orig: any): void {
        layout.horizontalDirection = orig.horizontalDirection;
        layout.paddingLeft = orig.paddingLeft;
        layout.paddingRight = orig.paddingRight;
    }

    _mirrorPosition(entry: { node: cc.Node; orig: { x: number } }): void {
        const node = entry.node;
        const parent = node.parent;
        if (parent && parent.isValid) {
            const parentWidth = parent.width || 0;
            const anchorX = parent.anchorX != null ? parent.anchorX : 0.5;
            node.x = parentWidth * (1 - 2 * anchorX) - entry.orig.x;
        } else {
            node.x = -entry.orig.x;
        }
    }

    _restorePosition(entry: { node: cc.Node; orig: { x: number } }): void {
        entry.node.x = entry.orig.x;
    }

    rebuild(): void {
        if (this._cache && this._cache.length > 0) {
            for (let i = 0; i < this._cache.length; i++) {
                const entry = this._cache[i];
                if (entry.kind !== "position" && entry.comp && entry.comp.isValid) {
                    if (entry.kind === "widget") {
                        this._restoreWidget(entry.comp, entry.orig);
                    } else if (entry.kind === "layout") {
                        this._restoreLayout(entry.comp, entry.orig);
                    }
                }
            }
        }
        this._collect();
        this._apply();
    }
}
