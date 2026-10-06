import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import RTLNoMirror from "./RTLNoMirror";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RTLLayoutAdapter extends cc.Component {
    @property({
        default: true,
        tooltip: " 处理子树里的 cc.Widget ： isAlignLeft < - > isAlignRight ， left < - > right "
    })
    affectWidget: boolean = true;

    @property({
        default: true,
        tooltip: " 处理子树里的 cc.Layout ： HORIZONTAL/ GRID 时翻转 horizontalDirection "
    })
    affectLayout: boolean = true;

    @property({
        default: true,
        tooltip: " CENTER_H 锚点的水平偏移在 RTL 下取反 （ 偏右- > 偏左 ） "
    })
    flipCenterHOffset: boolean = true;

    @property({
        default: true,
        tooltip: " 根节点自身的 Widget/ Layout 是否也参与镜像 ； Canvas 撑满 Widget 翻无差 ， prefab 根节点开启更符合预期 "
    })
    affectSelf: boolean = true;

    @property({
        default: true,
        tooltip: " 子节点 x 坐标按父中心镜像 ； 项目里很多节点用绝对坐标定位时必须开 "
    })
    affectPosition: boolean = true;

    _cache: any[] = [];
    _collected = false;
    _isDestroyed = false;

    onLoad() {
        this._cache = [];
        this._collected = false;
        this._isDestroyed = false;
        this.bindLanguageEvent();
        this.scheduleOnce(this._init, 0);
    }

    onDestroy() {
        this._isDestroyed = true;
        this.unbindLanguageEvent();
    }

    bindLanguageEvent() {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this._onLanguageChanged, this);
    }

    unbindLanguageEvent() {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this._onLanguageChanged, this);
    }

    _init() {
        if (!this._isDestroyed) {
            this._collect();
            this._apply();
            try {
                if ((LanguageService as any).isRTL()) {
                    var name = this.node && this.node.name ? this.node.name : "? ";
                    cc.log("[RTLLayoutAdapter] init on '" + name + "' cached = " + this._cache.length + " rtl = true ");
                }
            } catch (e) { }
        }
    }

    _onLanguageChanged() {
        if (!this._isDestroyed) {
            this._collected || this._collect();
            this._apply();
        }
    }

    _collect() {
        this._cache = [];
        if (this.node && this.node.isValid) {
            this._walk(this.node);
            this._collected = true;
        } else {
            this._collected = true;
        }
    }

    _walk(node: cc.Node) {
        if (node && node.isValid && !(node !== this.node && node.getComponent(RTLNoMirror) || node !== this.node && node.getComponent(RTLLayoutAdapter))) {
            var widget: cc.Widget = null;
            if (node !== this.node || this.affectSelf) {
                this.affectWidget && (widget = node.getComponent(cc.Widget)) && this._cache.push({
                    kind: " widget ",
                    comp: widget,
                    orig: this._snapshotWidget(widget)
                });
                if (this.affectLayout) {
                    var layout = node.getComponent(cc.Layout);
                    layout && this._cache.push({
                        kind: " layout ",
                        comp: layout,
                        orig: this._snapshotLayout(layout)
                    });
                }
            }
            if (this.affectPosition && node !== this.node) {
                var parentLayout = widget || (this.affectWidget ? null : node.getComponent(cc.Widget)),
                    parent = node.parent,
                    layoutComp = parent && parent.getComponent && parent.getComponent(cc.Layout);
                parentLayout || layoutComp || this._cache.push({
                    kind: " position ",
                    node: node,
                    orig: {
                        x: node.x
                    }
                });
            }
            for (var i = 0; i < node.childrenCount; i++) {
                this._walk(node.children[i]);
            }
        }
    }

    _snapshotWidget(widget: cc.Widget) {
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

    _snapshotLayout(layout: cc.Layout) {
        return {
            type: layout.type,
            horizontalDirection: layout.horizontalDirection,
            paddingLeft: layout.paddingLeft,
            paddingRight: layout.paddingRight
        };
    }

    _apply() {
        if (!this._isDestroyed) {
            for (var rtl = (LanguageService as any).isRTL(), i = 0; i < this._cache.length; i++) {
                var item = this._cache[i];
                (" position " === item.kind ? item.node && item.node.isValid : item.comp && item.comp.isValid) && (" widget " === item.kind ? rtl ? this._mirrorWidget(item.comp, item.orig) : this._restoreWidget(item.comp, item.orig) : " layout " === item.kind ? rtl ? this._mirrorLayout(item.comp, item.orig) : this._restoreLayout(item.comp, item.orig) : " position " === item.kind && (rtl ? this._mirrorPosition(item) : this._restorePosition(item)));
            }
        }
    }

    _mirrorWidget(widget: cc.Widget, orig: any) {
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

    _restoreWidget(widget: cc.Widget, orig: any) {
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

    _mirrorLayout(layout: cc.Layout, orig: any) {
        if (orig.type === cc.Layout.Type.HORIZONTAL || orig.type === cc.Layout.Type.GRID) {
            layout.horizontalDirection = orig.horizontalDirection === cc.Layout.HorizontalDirection.LEFT_TO_RIGHT ? cc.Layout.HorizontalDirection.RIGHT_TO_LEFT : cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
            layout.paddingLeft = orig.paddingRight;
            layout.paddingRight = orig.paddingLeft;
        }
    }

    _restoreLayout(layout: cc.Layout, orig: any) {
        layout.horizontalDirection = orig.horizontalDirection;
        layout.paddingLeft = orig.paddingLeft;
        layout.paddingRight = orig.paddingRight;
    }

    _mirrorPosition(item: any) {
        var node = item.node,
            parent = node.parent;
        if (parent && parent.isValid) {
            var width = parent.width || 0,
                anchorX = null != parent.anchorX ? parent.anchorX : .5;
            node.x = width * (1 - 2 * anchorX) - item.orig.x;
        } else {
            node.x = -item.orig.x;
        }
    }

    _restorePosition(item: any) {
        item.node.x = item.orig.x;
    }

    rebuild() {
        if (this._cache && this._cache.length > 0) {
            for (var i = 0; i < this._cache.length; i++) {
                var item = this._cache[i];
                item.comp && item.comp.isValid && (" widget " === item.kind ? this._restoreWidget(item.comp, item.orig) : " layout " === item.kind && this._restoreLayout(item.comp, item.orig));
            }
        }
        this._collect();
        this._apply();
    }
}
