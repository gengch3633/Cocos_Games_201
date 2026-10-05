import ListItem from "./ListItem";

const { ccclass, property, disallowMultiple, menu, executionOrder, requireComponent } = cc._decorator;

export const TemplateType = cc.Enum({
    NODE: 1,
    PREFAB: 2,
});

export const SlideType = cc.Enum({
    NORMAL: 1,
    ADHERING: 2,
    PAGE: 3,
});

export const SelectedType = cc.Enum({
    NONE: 0,
    SINGLE: 1,
    MULT: 2,
});

@ccclass
@disallowMultiple()
@menu("自定义组件/List")
@requireComponent(cc.ScrollView)
@executionOrder(-5000)
export default class List extends cc.Component {
    @property({
        type: cc.Enum(TemplateType),
        tooltip: "",
    })
    templateType: number = TemplateType.NODE;

    @property({
        type: cc.Node,
        tooltip: "",
        visible: function (this: List) {
            return this.templateType == TemplateType.NODE;
        },
    })
    tmpNode: cc.Node = null;

    @property({
        type: cc.Prefab,
        tooltip: "",
        visible: function (this: List) {
            return this.templateType == TemplateType.PREFAB;
        },
    })
    tmpPrefab: cc.Prefab = null;

    @property()
    _slideMode: number = SlideType.NORMAL;

    @property({
        type: cc.Float,
        range: [0, 1, 0.1],
        tooltip: "",
        slide: true,
        visible: function (this: List) {
            return this._slideMode == SlideType.PAGE;
        },
    })
    pageDistance: number = 0.3;

    @property({
        type: cc.Component.EventHandler,
        tooltip: "",
        visible: function (this: List) {
            return this._slideMode == SlideType.PAGE;
        },
    })
    pageChangeEvent: cc.Component.EventHandler = new cc.Component.EventHandler();

    @property()
    _virtual: boolean = true;

    @property({
        tooltip: "",
        visible: function (this: List) {
            const e = this.slideMode == SlideType.NORMAL;
            if (!e) {
                this.cyclic = false;
            }
            return e;
        },
    })
    cyclic: boolean = false;

    @property({
        tooltip: "",
        visible: function (this: List) {
            return this.virtual;
        },
    })
    lackCenter: boolean = false;

    @property({
        tooltip: "",
        visible: function (this: List) {
            const e = this.virtual && !this.lackCenter;
            if (!e) {
                this.lackSlide = false;
            }
            return e;
        },
    })
    lackSlide: boolean = false;

    @property({
        type: cc.Integer,
    })
    _updateRate: number = 0;

    @property({
        type: cc.Integer,
        range: [0, 12, 1],
        tooltip: "",
        slide: true,
    })
    frameByFrameRenderNum: number = 0;

    @property({
        type: cc.Component.EventHandler,
        tooltip: "",
    })
    renderEvent: cc.Component.EventHandler = new cc.Component.EventHandler();

    @property({
        type: cc.Enum(SelectedType),
        tooltip: "",
    })
    selectedMode: number = SelectedType.NONE;

    @property({
        tooltip: "",
        visible: function (this: List) {
            return this.selectedMode == SelectedType.SINGLE;
        },
    })
    repeatEventSingle: boolean = false;

    @property({
        type: cc.Component.EventHandler,
        tooltip: "",
        visible: function (this: List) {
            return this.selectedMode > SelectedType.NONE;
        },
    })
    selectedEvent: cc.Component.EventHandler = new cc.Component.EventHandler();

    @property({
        serializable: false,
    })
    _numItems: number = 0;

    @property({
        type: cc.Enum(SlideType),
        tooltip: "",
    })
    get slideMode(): number {
        return this._slideMode;
    }
    set slideMode(value: number) {
        this._slideMode = value;
    }

    @property({
        type: cc.Boolean,
        tooltip: "",
    })
    get virtual(): boolean {
        return this._virtual;
    }
    set virtual(value: boolean) {
        if (value != null) {
            this._virtual = value;
        }
        if (this._numItems != 0) {
            this._onScrolling();
        }
    }

    @property({
        type: cc.Integer,
        range: [0, 6, 1],
        tooltip: "",
        slide: true,
    })
    get updateRate(): number {
        return this._updateRate;
    }
    set updateRate(value: number) {
        if (value >= 0 && value <= 6) {
            this._updateRate = value;
        }
    }

    _selectedId: number = -1;
    _forceUpdate: boolean = false;
    _updateDone: boolean = true;
    _inited: boolean = false;
    _needUpdateWidget: boolean = false;
    _aniDelRuning: boolean = false;
    _doneAfterUpdate: boolean = false;
    adhering: boolean = false;
    _adheringBarrier: boolean = false;
    curPageNum: number = 0;
    frameCount: number = null;
    _sizeType: any = null;
    _customSize: any = null;
    _beganPos: any = null;
    _scrollItem: any = null;
    multSelected: any = null;
    content: cc.Node = null;
    _scrollView: cc.ScrollView = null;
    _layout: cc.Layout = null;
    _align: number = null;
    _resizeMode: number = null;
    _startAxis: number = null;
    _topGap: number = null;
    _rightGap: number = null;
    _bottomGap: number = null;
    _leftGap: number = null;
    _columnGap: number = null;
    _lineGap: number = null;
    _colLineNum: number = null;
    _verticalDir: number = null;
    _horizontalDir: number = null;
    _alignCalcType: number = null;
    _lastDisplayData: any[] = null;
    displayData: any[] = null;
    _pool: cc.NodePool = null;
    _updateCounter: number = null;
    _itemTmp: cc.Node = null;
    _itemSize: cc.Size = null;
    _lastSelectedId: any = null;
    _actualNumItems: number = null;
    nearestListId: number = null;
    displayItemNum: number = null;
    firstListId: number = null;
    curScrollIsTouch: boolean = null;
    scrollToListId: any = null;
    _scrollPos: any = null;
    _scrollToListId: any = null;
    _scrollToEndTime: any = null;
    _scrollToSo: any = null;
    viewTop: number = null;
    viewRight: number = null;
    viewBottom: number = null;
    viewLeft: number = null;
    elasticTop: number = null;
    elasticRight: number = null;
    elasticBottom: number = null;
    elasticLeft: number = null;
    _allItemSize: number = null;
    _allItemSizeNoEdge: number = null;
    _cyclicPos1: number = null;
    _cyclicPos2: number = null;
    _cyclicNum: number = null;
    _cyclicAllItemSize: number = null;
    _cycilcAllItemSizeNoEdge: number = null;
    _lack: boolean = null;
    _aniDelCB: any = null;
    _aniDelItem: any = null;
    _aniDelBeforePos: any = null;
    _aniDelBeforeScale: any = null;

    get selectedId(): number {
        return this._selectedId;
    }
    set selectedId(e: number) {
        const o = this;
        let t: cc.Node;
        switch (o.selectedMode) {
            case SelectedType.SINGLE:
                if (!o.repeatEventSingle && e == o._selectedId) {
                    return;
                }
                t = o.getItemByListId(e);
                let n: ListItem = undefined;
                if (o._selectedId >= 0) {
                    o._lastSelectedId = o._selectedId;
                } else {
                    o._lastSelectedId = null;
                }
                o._selectedId = e;
                if (t) {
                    n = t.getComponent(ListItem);
                    n.selected = true;
                }
                if (o._lastSelectedId >= 0 && o._lastSelectedId != o._selectedId) {
                    const i = o.getItemByListId(o._lastSelectedId);
                    if (i) {
                        i.getComponent(ListItem).selected = false;
                    }
                }
                if (o.selectedEvent) {
                    cc.Component.EventHandler.emitEvents(
                        [o.selectedEvent],
                        t,
                        e % this._actualNumItems,
                        o._lastSelectedId == null ? null : o._lastSelectedId % this._actualNumItems
                    );
                }
                break;
            case SelectedType.MULT:
                if (!(t = o.getItemByListId(e))) {
                    return;
                }
                n = t.getComponent(ListItem);
                if (o._selectedId >= 0) {
                    o._lastSelectedId = o._selectedId;
                }
                o._selectedId = e;
                const a = !n.selected;
                n.selected = a;
                const l = o.multSelected.indexOf(e);
                if (a && l < 0) {
                    o.multSelected.push(e);
                } else if (!a && l >= 0) {
                    o.multSelected.splice(l, 1);
                }
                if (o.selectedEvent) {
                    cc.Component.EventHandler.emitEvents(
                        [o.selectedEvent],
                        t,
                        e % this._actualNumItems,
                        o._lastSelectedId == null ? null : o._lastSelectedId % this._actualNumItems,
                        a
                    );
                }
        }
    }

    get numItems(): number {
        return this._actualNumItems;
    }
    set numItems(e: number) {
        const t = this;
        if (t.checkInited(false)) {
            if (e == null || e < 0) {
                cc.error("numItems set the wrong::", e);
            } else {
                t._actualNumItems = t._numItems = e;
                t._forceUpdate = true;
                if (t._virtual) {
                    t._resizeContent();
                    if (t.cyclic) {
                        t._numItems = t._cyclicNum * t._numItems;
                    }
                    t._onScrolling();
                    if (!t.frameByFrameRenderNum && t.slideMode == SlideType.PAGE) {
                        t.curPageNum = t.nearestListId;
                    }
                } else {
                    if (t.cyclic) {
                        t._resizeContent();
                        t._numItems = t._cyclicNum * t._numItems;
                    }
                    const o = t.content.getComponent(cc.Layout);
                    if (o) {
                        o.enabled = true;
                    }
                    t._delRedundantItem();
                    t.firstListId = 0;
                    if (t.frameByFrameRenderNum > 0) {
                        const n = t.frameByFrameRenderNum > t._numItems ? t._numItems : t.frameByFrameRenderNum;
                        for (let i = 0; i < n; i++) {
                            t._createOrUpdateItem2(i);
                        }
                        if (t.frameByFrameRenderNum < t._numItems) {
                            t._updateCounter = t.frameByFrameRenderNum;
                            t._updateDone = false;
                        }
                    } else {
                        for (let i = 0; i < t._numItems; i++) {
                            t._createOrUpdateItem2(i);
                        }
                        t.displayItemNum = t._numItems;
                    }
                }
            }
        }
    }

    get scrollView(): cc.ScrollView {
        return this._scrollView;
    }

    hasMultSelected(e: number): boolean {
        return this.multSelected && this.multSelected.indexOf(e) >= 0;
    }

    _init(): void {
        const e = this;
        if (!e._inited) {
            e._scrollView = e.node.getComponent(cc.ScrollView);
            e.content = e._scrollView.content;
            if (e.content) {
                e._layout = e.content.getComponent(cc.Layout);
                e._align = e._layout.type;
                e._resizeMode = e._layout.resizeMode;
                e._startAxis = e._layout.startAxis;
                e._topGap = e._layout.paddingTop;
                e._rightGap = e._layout.paddingRight;
                e._bottomGap = e._layout.paddingBottom;
                e._leftGap = e._layout.paddingLeft;
                e._columnGap = e._layout.spacingX;
                e._lineGap = e._layout.spacingY;
                e._colLineNum;
                e._verticalDir = e._layout.verticalDirection;
                e._horizontalDir = e._layout.horizontalDirection;
                e.setTemplateItem(
                    cc.instantiate(e.templateType == TemplateType.PREFAB ? e.tmpPrefab : e.tmpNode)
                );
                if (e._slideMode == SlideType.ADHERING || e._slideMode == SlideType.PAGE) {
                    e._scrollView.inertia = false;
                    (e._scrollView as any)._onMouseWheel = function () {};
                }
                if (!e.virtual) {
                    e.lackCenter = false;
                }
                e._lastDisplayData = [];
                e.displayData = [];
                e._pool = new cc.NodePool();
                e._forceUpdate = false;
                e._updateCounter = 0;
                e._updateDone = true;
                e.curPageNum = 0;
                if (e.cyclic) {
                    (e._scrollView as any)._processAutoScrolling = this._processAutoScrolling.bind(e);
                    (e._scrollView as any)._startBounceBackIfNeeded = function () {
                        return false;
                    };
                }
                switch (e._align) {
                    case cc.Layout.Type.HORIZONTAL:
                        switch (e._horizontalDir) {
                            case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                                e._alignCalcType = 1;
                                break;
                            case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                                e._alignCalcType = 2;
                        }
                        break;
                    case cc.Layout.Type.VERTICAL:
                        switch (e._verticalDir) {
                            case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                                e._alignCalcType = 3;
                                break;
                            case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                                e._alignCalcType = 4;
                        }
                        break;
                    case cc.Layout.Type.GRID:
                        switch (e._startAxis) {
                            case cc.Layout.AxisDirection.HORIZONTAL:
                                switch (e._verticalDir) {
                                    case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                                        e._alignCalcType = 3;
                                        break;
                                    case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                                        e._alignCalcType = 4;
                                }
                                break;
                            case cc.Layout.AxisDirection.VERTICAL:
                                switch (e._horizontalDir) {
                                    case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                                        e._alignCalcType = 1;
                                        break;
                                    case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                                        e._alignCalcType = 2;
                                }
                        }
                }
                e.content.removeAllChildren();
                e._inited = true;
            } else {
                cc.error(e.node.name + "'s cc.ScrollView unset content!");
            }
        }
    }

    updateAll(): void {
        if (this.checkInited()) {
            this.numItems = this.numItems;
        }
    }

    _delRedundantItem(): void {
        if (this._virtual) {
            const e = this._getOutsideItem();
            for (let t = e.length - 1; t >= 0; t--) {
                const o = e[t];
                if (!this._scrollItem || (o as any)._listId != (this._scrollItem as any)._listId) {
                    (o as any).isCached = true;
                    this._pool.put(o);
                    for (let n = this._lastDisplayData.length - 1; n >= 0; n--) {
                        if (this._lastDisplayData[n] == (o as any)._listId) {
                            this._lastDisplayData.splice(n, 1);
                            break;
                        }
                    }
                }
            }
        } else {
            while (this.content.childrenCount > this._numItems) {
                this._delSingleItem(this.content.children[this.content.childrenCount - 1]);
            }
        }
    }

    _registerEvent(): void {
        const e = this;
        e.node.on(cc.Node.EventType.TOUCH_START, e._onTouchStart, e, true);
        e.node.on("touch-up", e._onTouchUp, e);
        e.node.on(cc.Node.EventType.TOUCH_CANCEL, e._onTouchCancelled, e, true);
        e.node.on("scroll-began", e._onScrollBegan, e, true);
        e.node.on("scroll-ended", e._onScrollEnded, e, true);
        e.node.on("scrolling", e._onScrolling, e, true);
        e.node.on(cc.Node.EventType.SIZE_CHANGED, e._onSizeChanged, e);
    }

    _getFixedSize(e?: number): any {
        if (!this._customSize) {
            return null;
        }
        if (e == null) {
            e = this._numItems;
        }
        let t = 0;
        let o = 0;
        for (const n in this._customSize) {
            if (parseInt(n) < e) {
                t += this._customSize[n];
                o++;
            }
        }
        return {
            val: t,
            count: o,
        };
    }

    getItemPos(e: number): any {
        if (this._virtual) {
            return this._calcItemPos(e);
        }
        if (this.frameByFrameRenderNum) {
            return this._calcItemPos(e);
        }
        return this._calcExistItemPos(e);
    }

    _onTouchStart(e: cc.Event.EventTouch, t: any): void {
        if (!this._scrollView.hasNestedViewGroup(e, t)) {
            this.curScrollIsTouch = true;
            if (e.eventPhase !== cc.Event.AT_TARGET || e.target !== this.node) {
                let o: any = e.target;
                while ((o as any)._listId == null && o.parent) {
                    o = o.parent;
                }
                this._scrollItem = (o as any)._listId != null ? o : e.target;
            }
        }
    }

    scrollTo(e: number, t?: number, o?: number, n?: boolean): boolean {
        if (t === undefined) {
            t = 0.5;
        }
        if (o === undefined) {
            o = null;
        }
        if (n === undefined) {
            n = false;
        }
        const i = this;
        if (i.checkInited(false)) {
            if (t == null) {
                t = 0.5;
            } else if (t < 0) {
                t = 0;
            }
            if (e < 0) {
                e = 0;
            } else if (e >= i._numItems) {
                e = i._numItems - 1;
            }
            if (!i._virtual && i._layout && i._layout.enabled) {
                i._layout.updateLayout();
            }
            let a: number;
            let r: number;
            let l = i.getItemPos(e);
            if (!l) {
                return false;
            }
            switch (i._alignCalcType) {
                case 1:
                    a = l.left;
                    a -= o != null ? i.node.width * o : i._leftGap;
                    l = cc.v2(a, 0);
                    break;
                case 2:
                    a = l.right - i.node.width;
                    a += o != null ? i.node.width * o : i._rightGap;
                    l = cc.v2(a + i.content.width, 0);
                    break;
                case 3:
                    r = l.top;
                    r += o != null ? i.node.height * o : i._topGap;
                    l = cc.v2(0, -r);
                    break;
                case 4:
                    r = l.bottom + i.node.height;
                    r -= o != null ? i.node.height * o : i._bottomGap;
                    l = cc.v2(0, -r + i.content.height);
            }
            let s = i.content.getPosition();
            s = Math.abs(i._sizeType ? s.y : s.x);
            const c = i._sizeType ? l.y : l.x;
            if (Math.abs((i._scrollPos != null ? i._scrollPos : s) - c) > 0.5) {
                i._scrollView.scrollToOffset(l, t);
                i._scrollToListId = e;
                i._scrollToEndTime = new Date().getTime() / 1e3 + t;
                i._scrollToSo = i.scheduleOnce(function () {
                    if (!i._adheringBarrier) {
                        i.adhering = i._adheringBarrier = false;
                    }
                    i._scrollPos = i._scrollToListId = i._scrollToEndTime = i._scrollToSo = null;
                    if (n) {
                        const tNode = i.getItemByListId(e);
                        if (tNode) {
                            cc.tween(tNode)
                                .to(0.1, {
                                    scale: 1.05,
                                })
                                .to(0.1, {
                                    scale: 1,
                                })
                                .start();
                        }
                    }
                }, t + 0.1);
                if (t <= 0) {
                    i._onScrolling();
                }
            }
        }
    }

    getMultSelected(): any {
        return this.multSelected;
    }

    _onSizeChanged(): void {
        if (this.checkInited(false)) {
            this._onScrolling();
        }
    }

    _onScrollEnded(): void {
        const e = this;
        e.curScrollIsTouch = false;
        if (e.scrollToListId != null) {
            const t = e.getItemByListId(e.scrollToListId);
            e.scrollToListId = null;
            if (t) {
                cc.tween(t)
                    .to(0.1, {
                        scale: 1.06,
                    })
                    .to(0.1, {
                        scale: 1,
                    })
                    .start();
            }
        }
        e._onScrolling();
        if (e._slideMode != SlideType.ADHERING || e.adhering) {
            if (e._slideMode == SlideType.PAGE) {
                if (e._beganPos != null && e.curScrollIsTouch) {
                    this._pageAdhere();
                } else {
                    e.adhere();
                }
            }
        } else {
            e.adhere();
        }
    }

    _createOrUpdateItem(e: any): void {
        let t = this.getItemByListId(e.id);
        if (t) {
            if (this._forceUpdate && this.renderEvent) {
                t.setPosition(cc.v2(e.x, e.y));
                this._resetItemSize(t);
                if (this.renderEvent) {
                    cc.Component.EventHandler.emitEvents([this.renderEvent], t, e.id % this._actualNumItems);
                }
            }
        } else {
            let o = this._pool.size() > 0;
            t = o ? this._pool.get() : cc.instantiate(this._itemTmp);
            if (!o || !cc.isValid(t)) {
                t = cc.instantiate(this._itemTmp);
                o = false;
            }
            if ((t as any)._listId != e.id) {
                (t as any)._listId = e.id;
                t.setContentSize(this._itemSize);
            }
            t.setPosition(cc.v2(e.x, e.y));
            this._resetItemSize(t);
            this.content.addChild(t);
            if (o && this._needUpdateWidget) {
                const n = t.getComponent(cc.Widget);
                if (n) {
                    n.updateAlignment();
                }
            }
            t.setSiblingIndex(this.content.childrenCount - 1);
            const i = t.getComponent(ListItem);
            (t as any).listItem = i;
            if (i) {
                i.listId = e.id;
                i.list = this;
                i._registerEvent();
            }
            if (this.renderEvent) {
                cc.Component.EventHandler.emitEvents([this.renderEvent], t, e.id % this._actualNumItems);
            }
        }
        this._resetItemSize(t);
        this._updateListItem((t as any).listItem);
        if (this._lastDisplayData.indexOf(e.id) < 0) {
            this._lastDisplayData.push(e.id);
        }
    }

    _delSingleItem(e: cc.Node): void {
        e.removeFromParent();
        if (e.destroy) {
            e.destroy();
        }
        e = null;
    }

    _createOrUpdateItem2(e: number): void {
        let t: ListItem;
        let o = this.content.children[e];
        if (o) {
            if (this._forceUpdate && this.renderEvent) {
                (o as any)._listId = e;
                if (t) {
                    t.listId = e;
                }
                if (this.renderEvent) {
                    cc.Component.EventHandler.emitEvents([this.renderEvent], o, e % this._actualNumItems);
                }
            }
        } else {
            o = cc.instantiate(this._itemTmp);
            (o as any)._listId = e;
            this.content.addChild(o);
            t = o.getComponent(ListItem);
            (o as any).listItem = t;
            if (t) {
                t.listId = e;
                t.list = this;
                t._registerEvent();
            }
            if (this.renderEvent) {
                cc.Component.EventHandler.emitEvents([this.renderEvent], o, e % this._actualNumItems);
            }
        }
        this._updateListItem(t);
        if (this._lastDisplayData.indexOf(e) < 0) {
            this._lastDisplayData.push(e);
        }
    }

    updateItem(e: number | number[]): void {
        if (this.checkInited()) {
            if (!Array.isArray(e)) {
                e = [e];
            }
            for (let t = 0, o = e.length; t < o; t++) {
                const n = e[t];
                const i = this.getItemByListId(n);
                if (i) {
                    cc.Component.EventHandler.emitEvents([this.renderEvent], i, n % this._actualNumItems);
                }
            }
        }
    }

    onDisable(): void {
        this._unregisterEvent();
    }

    _onScrollBegan(): void {
        this._beganPos = this._sizeType ? this.viewTop : this.viewLeft;
    }

    _processAutoScrolling(e: number): void {
        (this._scrollView as any)._autoScrollAccumulatedTime += 1 * e;
        let t = Math.min(1, (this._scrollView as any)._autoScrollAccumulatedTime / (this._scrollView as any)._autoScrollTotalTime);
        if ((this._scrollView as any)._autoScrollAttenuate) {
            const o = t - 1;
            t = o * o * o * o * o + 1;
        }
        const n = (this._scrollView as any)._autoScrollStartPosition.add(
            (this._scrollView as any)._autoScrollTargetDelta.mul(t)
        );
        const i = this._scrollView.getScrollEndedEventTiming();
        const a = Math.abs(t - 1) <= i;
        if (
            Math.abs(t - 1) <= this._scrollView.getScrollEndedEventTiming() &&
            !(this._scrollView as any)._isScrollEndedWithThresholdEventFired
        ) {
            (this._scrollView as any)._dispatchEvent("scroll-ended-with-threshold");
            (this._scrollView as any)._isScrollEndedWithThresholdEventFired = true;
        }
        if (a) {
            (this._scrollView as any)._autoScrolling = false;
        }
        const r = n.sub(this._scrollView.getContentPosition());
        (this._scrollView as any)._moveContent((this._scrollView as any)._clampDelta(r), a);
        (this._scrollView as any)._dispatchEvent("scrolling");
        if (!(this._scrollView as any)._autoScrolling) {
            (this._scrollView as any)._isBouncing = false;
            (this._scrollView as any)._scrolling = false;
            (this._scrollView as any)._dispatchEvent("scroll-ended");
        }
    }

    _unregisterEvent(): void {
        const e = this;
        e.node.off(cc.Node.EventType.TOUCH_START, e._onTouchStart, e, true);
        e.node.off("touch-up", e._onTouchUp, e);
        e.node.off(cc.Node.EventType.TOUCH_CANCEL, e._onTouchCancelled, e, true);
        e.node.off("scroll-began", e._onScrollBegan, e, true);
        e.node.off("scroll-ended", e._onScrollEnded, e, true);
        e.node.off("scrolling", e._onScrolling, e, true);
        e.node.off(cc.Node.EventType.SIZE_CHANGED, e._onSizeChanged, e);
    }

    skipPage(e: number, t?: number): void {
        const o = this;
        if (o.checkInited()) {
            if (o._slideMode != SlideType.PAGE) {
                return cc.error("This function is not allowed to be called, Must SlideMode = PAGE!");
            }
            if (!(e < 0 || e >= o._numItems) && o.curPageNum != e) {
                o.curPageNum = e;
                if (o.pageChangeEvent) {
                    cc.Component.EventHandler.emitEvents([o.pageChangeEvent], e);
                }
                o.scrollTo(e, t);
            }
        }
    }

    setTemplateItem(e: cc.Node): void {
        if (e) {
            const t = this;
            t._itemTmp = e;
            if (t._resizeMode == cc.Layout.ResizeMode.CHILDREN) {
                t._itemSize = t._layout.cellSize;
            } else {
                t._itemSize = cc.size(e.width, e.height);
            }
            let o = e.getComponent(ListItem);
            let n = false;
            if (!o) {
                n = true;
            }
            if (n) {
                t.selectedMode = SelectedType.NONE;
            }
            if ((o = e.getComponent(cc.Widget) as any) && o.enabled) {
                t._needUpdateWidget = true;
            }
            if (t.selectedMode == SelectedType.MULT) {
                t.multSelected = [];
            }
            switch (t._align) {
                case cc.Layout.Type.HORIZONTAL:
                    t._colLineNum = 1;
                    t._sizeType = false;
                    break;
                case cc.Layout.Type.VERTICAL:
                    t._colLineNum = 1;
                    t._sizeType = true;
                    break;
                case cc.Layout.Type.GRID:
                    switch (t._startAxis) {
                        case cc.Layout.AxisDirection.HORIZONTAL:
                            const i = t.content.width - t._leftGap - t._rightGap;
                            t._colLineNum = Math.floor((i + t._columnGap) / (t._itemSize.width + t._columnGap));
                            t._sizeType = true;
                            break;
                        case cc.Layout.AxisDirection.VERTICAL:
                            const a = t.content.height - t._topGap - t._bottomGap;
                            t._colLineNum = Math.floor((a + t._lineGap) / (t._itemSize.height + t._lineGap));
                            t._sizeType = false;
                    }
            }
        }
    }

    _calcNearestItem(): void {
        let e: any;
        let t: number;
        let o: number;
        let n: number;
        let i: number;
        let a: number;
        const r = this;
        r.nearestListId = null;
        if (r._virtual) {
            r._calcViewPos();
        }
        o = r.viewTop;
        n = r.viewRight;
        i = r.viewBottom;
        a = r.viewLeft;
        let l = false;
        for (let s = 0; s < r.content.childrenCount && !l; s += r._colLineNum) {
            if ((e = r._virtual ? r.displayData[s] : r._calcExistItemPos(s))) {
                t = r._sizeType ? (e.top + e.bottom) / 2 : (t = (e.left + e.right) / 2);
                switch (r._alignCalcType) {
                    case 1:
                        if (e.right >= a) {
                            r.nearestListId = e.id;
                            if (a > t) {
                                r.nearestListId += r._colLineNum;
                            }
                            l = true;
                        }
                        break;
                    case 2:
                        if (e.left <= n) {
                            r.nearestListId = e.id;
                            if (n < t) {
                                r.nearestListId += r._colLineNum;
                            }
                            l = true;
                        }
                        break;
                    case 3:
                        if (e.bottom <= o) {
                            r.nearestListId = e.id;
                            if (o < t) {
                                r.nearestListId += r._colLineNum;
                            }
                            l = true;
                        }
                        break;
                    case 4:
                        if (e.top >= i) {
                            r.nearestListId = e.id;
                            if (i > t) {
                                r.nearestListId += r._colLineNum;
                            }
                            l = true;
                        }
                }
            }
        }
        if (
            (e = r._virtual ? r.displayData[r.displayItemNum - 1] : r._calcExistItemPos(r._numItems - 1)) &&
            e.id == r._numItems - 1
        ) {
            t = r._sizeType ? (e.top + e.bottom) / 2 : (t = (e.left + e.right) / 2);
            switch (r._alignCalcType) {
                case 1:
                    if (n > t) {
                        r.nearestListId = e.id;
                    }
                    break;
                case 2:
                    if (a < t) {
                        r.nearestListId = e.id;
                    }
                    break;
                case 3:
                    if (i < t) {
                        r.nearestListId = e.id;
                    }
                    break;
                case 4:
                    if (o > t) {
                        r.nearestListId = e.id;
                    }
            }
        }
    }

    _getOutsideItem(): cc.Node[] {
        let e: cc.Node;
        const t: cc.Node[] = [];
        for (let o = this.content.childrenCount - 1; o >= 0; o--) {
            e = this.content.children[o];
            if (
                !this.displayData.find(function (t) {
                    return t.id == (e as any)._listId;
                })
            ) {
                t.push(e);
            }
        }
        return t;
    }

    _calcItemPos(e: number): any {
        let t: number;
        let o: number;
        let n: number;
        let i: number;
        let a: number;
        let r: number;
        let l: number;
        let s: number;
        let u: number;
        switch (this._align) {
            case cc.Layout.Type.HORIZONTAL:
                switch (this._horizontalDir) {
                    case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                        if (this._customSize) {
                            const c = this._getFixedSize(e);
                            a =
                                this._leftGap +
                                (this._itemSize.width + this._columnGap) * (e - c.count) +
                                (c.val + this._columnGap * c.count);
                            t = (u = this._customSize[e]) > 0 ? u : this._itemSize.width;
                        } else {
                            a = this._leftGap + (this._itemSize.width + this._columnGap) * e;
                            t = this._itemSize.width;
                        }
                        if (this.lackCenter) {
                            a -= this._leftGap;
                            a += this.content.width / 2 - this._allItemSizeNoEdge / 2;
                        }
                        return {
                            id: e,
                            left: a,
                            right: (r = a + t),
                            x: a + this._itemTmp.anchorX * t,
                            y: this._itemTmp.y,
                        };
                    case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                        if (this._customSize) {
                            const c = this._getFixedSize(e);
                            r =
                                -this._rightGap -
                                (this._itemSize.width + this._columnGap) * (e - c.count) -
                                (c.val + this._columnGap * c.count);
                            t = (u = this._customSize[e]) > 0 ? u : this._itemSize.width;
                        } else {
                            r = -this._rightGap - (this._itemSize.width + this._columnGap) * e;
                            t = this._itemSize.width;
                        }
                        if (this.lackCenter) {
                            r += this._rightGap;
                            r -= this.content.width / 2 - this._allItemSizeNoEdge / 2;
                        }
                        return {
                            id: e,
                            right: r,
                            left: (a = r - t),
                            x: a + this._itemTmp.anchorX * t,
                            y: this._itemTmp.y,
                        };
                }
                break;
            case cc.Layout.Type.VERTICAL:
                switch (this._verticalDir) {
                    case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                        if (this._customSize) {
                            const c = this._getFixedSize(e);
                            n =
                                -this._topGap -
                                (this._itemSize.height + this._lineGap) * (e - c.count) -
                                (c.val + this._lineGap * c.count);
                            o = (u = this._customSize[e]) > 0 ? u : this._itemSize.height;
                        } else {
                            n = -this._topGap - (this._itemSize.height + this._lineGap) * e;
                            o = this._itemSize.height;
                        }
                        if (this.lackCenter) {
                            n += this._topGap;
                            n -= this.content.height / 2 - this._allItemSizeNoEdge / 2;
                        }
                        return {
                            id: e,
                            top: n,
                            bottom: (i = n - o),
                            x: this._itemTmp.x,
                            y: i + this._itemTmp.anchorY * o,
                        };
                    case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                        if (this._customSize) {
                            const c = this._getFixedSize(e);
                            i =
                                this._bottomGap +
                                (this._itemSize.height + this._lineGap) * (e - c.count) +
                                (c.val + this._lineGap * c.count);
                            o = (u = this._customSize[e]) > 0 ? u : this._itemSize.height;
                        } else {
                            i = this._bottomGap + (this._itemSize.height + this._lineGap) * e;
                            o = this._itemSize.height;
                        }
                        if (this.lackCenter) {
                            i -= this._bottomGap;
                            i += this.content.height / 2 - this._allItemSizeNoEdge / 2;
                        }
                        return {
                            id: e,
                            top: (n = i + o),
                            bottom: i,
                            x: this._itemTmp.x,
                            y: i + this._itemTmp.anchorY * o,
                        };
                }
            case cc.Layout.Type.GRID:
                const p = Math.floor(e / this._colLineNum);
                switch (this._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL:
                        switch (this._verticalDir) {
                            case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                                s =
                                    (i = (n = -this._topGap - (this._itemSize.height + this._lineGap) * p) - this._itemSize.height) +
                                    this._itemTmp.anchorY * this._itemSize.height;
                                break;
                            case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                                n = (i = this._bottomGap + (this._itemSize.height + this._lineGap) * p) + this._itemSize.height;
                                s = i + this._itemTmp.anchorY * this._itemSize.height;
                        }
                        l = this._leftGap + (e % this._colLineNum) * (this._itemSize.width + this._columnGap);
                        switch (this._horizontalDir) {
                            case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                                l += this._itemTmp.anchorX * this._itemSize.width;
                                l -= this.content.anchorX * this.content.width;
                                break;
                            case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                                l += (1 - this._itemTmp.anchorX) * this._itemSize.width;
                                l -= (1 - this.content.anchorX) * this.content.width;
                                l *= -1;
                        }
                        return {
                            id: e,
                            top: n,
                            bottom: i,
                            x: l,
                            y: s,
                        };
                    case cc.Layout.AxisDirection.VERTICAL:
                        switch (this._horizontalDir) {
                            case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                                r = (a = this._leftGap + (this._itemSize.width + this._columnGap) * p) + this._itemSize.width;
                                l = a + this._itemTmp.anchorX * this._itemSize.width;
                                l -= this.content.anchorX * this.content.width;
                                break;
                            case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                                l =
                                    (a =
                                        (r = -this._rightGap - (this._itemSize.width + this._columnGap) * p) -
                                        this._itemSize.width) +
                                    this._itemTmp.anchorX * this._itemSize.width;
                                l += (1 - this.content.anchorX) * this.content.width;
                        }
                        s = -this._topGap - (e % this._colLineNum) * (this._itemSize.height + this._lineGap);
                        switch (this._verticalDir) {
                            case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                                s -= (1 - this._itemTmp.anchorY) * this._itemSize.height;
                                s += (1 - this.content.anchorY) * this.content.height;
                                break;
                            case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                                s -= this._itemTmp.anchorY * this._itemSize.height;
                                s += this.content.anchorY * this.content.height;
                                s *= -1;
                        }
                        return {
                            id: e,
                            left: a,
                            right: r,
                            x: l,
                            y: s,
                        };
                }
        }
    }

    _updateListItem(e: ListItem): void {
        if (e && this.selectedMode > SelectedType.NONE) {
            const t = e.node;
            switch (this.selectedMode) {
                case SelectedType.SINGLE:
                    e.selected = this.selectedId == (t as any)._listId;
                    break;
                case SelectedType.MULT:
                    e.selected = this.multSelected.indexOf((t as any)._listId) >= 0;
            }
        }
    }

    checkInited(e?: boolean): boolean {
        if (e === undefined) {
            e = true;
        }
        if (!this._inited) {
            if (e) {
                cc.error("List initialization not completed!");
            }
            return false;
        }
        return true;
    }

    onDestroy(): void {
        const e = this;
        if (cc.isValid(e._itemTmp)) {
            e._itemTmp.destroy();
        }
        if (cc.isValid(e.tmpNode)) {
            e.tmpNode.destroy();
        }
        if (e._pool) {
            e._pool.clear();
        }
    }

    _onScrolling(e?: any): void {
        if (e === undefined) {
            e = null;
        }
        if (this.frameCount == null) {
            this.frameCount = this._updateRate;
        }
        if (!this._forceUpdate && e && e.type != "scroll-ended" && this.frameCount > 0) {
            this.frameCount--;
        } else {
            this.frameCount = this._updateRate;
            if (!this._aniDelRuning) {
                if (this.cyclic) {
                    let t = this.content.getPosition();
                    t = this._sizeType ? t.y : t.x;
                    const o = this._allItemSizeNoEdge + (this._sizeType ? this._lineGap : this._columnGap);
                    const n = this._sizeType ? cc.v2(0, o) : cc.v2(o, 0);
                    switch (this._alignCalcType) {
                        case 1:
                            if (t > -this._cyclicPos1) {
                                this.content.x = -this._cyclicPos2;
                                if (this._scrollView.isAutoScrolling()) {
                                    (this._scrollView as any)._autoScrollStartPosition = (
                                        this._scrollView as any
                                    )._autoScrollStartPosition.sub(n);
                                }
                            } else if (t < -this._cyclicPos2) {
                                this.content.x = -this._cyclicPos1;
                                if (this._scrollView.isAutoScrolling()) {
                                    (this._scrollView as any)._autoScrollStartPosition = (
                                        this._scrollView as any
                                    )._autoScrollStartPosition.add(n);
                                }
                            }
                            break;
                        case 2:
                            if (t < this._cyclicPos1) {
                                this.content.x = this._cyclicPos2;
                                if (this._scrollView.isAutoScrolling()) {
                                    (this._scrollView as any)._autoScrollStartPosition = (
                                        this._scrollView as any
                                    )._autoScrollStartPosition.add(n);
                                }
                            } else if (t > this._cyclicPos2) {
                                this.content.x = this._cyclicPos1;
                                if (this._scrollView.isAutoScrolling()) {
                                    (this._scrollView as any)._autoScrollStartPosition = (
                                        this._scrollView as any
                                    )._autoScrollStartPosition.sub(n);
                                }
                            }
                            break;
                        case 3:
                            if (t < this._cyclicPos1) {
                                this.content.y = this._cyclicPos2;
                                if (this._scrollView.isAutoScrolling()) {
                                    (this._scrollView as any)._autoScrollStartPosition = (
                                        this._scrollView as any
                                    )._autoScrollStartPosition.add(n);
                                }
                            } else if (t > this._cyclicPos2) {
                                this.content.y = this._cyclicPos1;
                                if (this._scrollView.isAutoScrolling()) {
                                    (this._scrollView as any)._autoScrollStartPosition = (
                                        this._scrollView as any
                                    )._autoScrollStartPosition.sub(n);
                                }
                            }
                            break;
                        case 4:
                            if (t > -this._cyclicPos1) {
                                this.content.y = -this._cyclicPos2;
                                if (this._scrollView.isAutoScrolling()) {
                                    (this._scrollView as any)._autoScrollStartPosition = (
                                        this._scrollView as any
                                    )._autoScrollStartPosition.sub(n);
                                }
                            } else if (t < -this._cyclicPos2) {
                                this.content.y = -this._cyclicPos1;
                                if (this._scrollView.isAutoScrolling()) {
                                    (this._scrollView as any)._autoScrollStartPosition = (
                                        this._scrollView as any
                                    )._autoScrollStartPosition.add(n);
                                }
                            }
                    }
                }
                this._calcViewPos();
                let i: number;
                let a: number;
                let r: number;
                let l: number;
                if (this._sizeType) {
                    i = this.viewTop;
                    r = this.viewBottom;
                } else {
                    a = this.viewRight;
                    l = this.viewLeft;
                }
                if (this._virtual) {
                    this.displayData = [];
                    let s: any;
                    let c = 0;
                    let u = this._numItems - 1;
                    if (this._customSize) {
                        let p = false;
                        for (; c <= u && !p; c++) {
                            s = this._calcItemPos(c);
                            switch (this._align) {
                                case cc.Layout.Type.HORIZONTAL:
                                    if (s.right >= l && s.left <= a) {
                                        this.displayData.push(s);
                                    } else if (c != 0 && this.displayData.length > 0) {
                                        p = true;
                                    }
                                    break;
                                case cc.Layout.Type.VERTICAL:
                                    if (s.bottom <= i && s.top >= r) {
                                        this.displayData.push(s);
                                    } else if (c != 0 && this.displayData.length > 0) {
                                        p = true;
                                    }
                                    break;
                                case cc.Layout.Type.GRID:
                                    switch (this._startAxis) {
                                        case cc.Layout.AxisDirection.HORIZONTAL:
                                            if (s.bottom <= i && s.top >= r) {
                                                this.displayData.push(s);
                                            } else if (c != 0 && this.displayData.length > 0) {
                                                p = true;
                                            }
                                            break;
                                        case cc.Layout.AxisDirection.VERTICAL:
                                            if (s.right >= l && s.left <= a) {
                                                this.displayData.push(s);
                                            } else if (c != 0 && this.displayData.length > 0) {
                                                p = true;
                                            }
                                    }
                            }
                        }
                    } else {
                        const d = this._itemSize.width + this._columnGap;
                        const _ = this._itemSize.height + this._lineGap;
                        switch (this._alignCalcType) {
                            case 1:
                                c = (l - this._leftGap) / d;
                                u = (a - this._leftGap) / d;
                                break;
                            case 2:
                                c = (-a - this._rightGap) / d;
                                u = (-l - this._rightGap) / d;
                                break;
                            case 3:
                                c = (-i - this._topGap) / _;
                                u = (-r - this._topGap) / _;
                                break;
                            case 4:
                                c = (r - this._bottomGap) / _;
                                u = (i - this._bottomGap) / _;
                        }
                        c = Math.floor(c) * this._colLineNum;
                        u = Math.ceil(u) * this._colLineNum;
                        if (c < 0) {
                            c = 0;
                        }
                        if (--u >= this._numItems) {
                            u = this._numItems - 1;
                        }
                        for (; c <= u; c++) {
                            this.displayData.push(this._calcItemPos(c));
                        }
                    }
                    this._delRedundantItem();
                    if (this.displayData.length <= 0 || !this._numItems) {
                        this._lastDisplayData = [];
                        return;
                    }
                    this.firstListId = this.displayData[0].id;
                    this.displayItemNum = this.displayData.length;
                    const f = this._lastDisplayData.length;
                    let h = this.displayItemNum != f;
                    if (h) {
                        if (this.frameByFrameRenderNum > 0) {
                            this._lastDisplayData.sort(function (e, t) {
                                return e - t;
                            });
                        }
                        h =
                            this.firstListId != this._lastDisplayData[0] ||
                            this.displayData[this.displayItemNum - 1].id != this._lastDisplayData[f - 1];
                    }
                    if (this._forceUpdate || h) {
                        if (this.frameByFrameRenderNum > 0) {
                            if (this._numItems > 0) {
                                if (this._updateDone) {
                                    this._updateCounter = 0;
                                } else {
                                    this._doneAfterUpdate = true;
                                }
                                this._updateDone = false;
                            } else {
                                this._updateCounter = 0;
                                this._updateDone = true;
                            }
                        } else {
                            this._lastDisplayData = [];
                            for (let g = 0; g < this.displayItemNum; g++) {
                                this._createOrUpdateItem(this.displayData[g]);
                            }
                            this._forceUpdate = false;
                        }
                    }
                    this._calcNearestItem();
                }
            }
        }
    }

    prePage(e?: number): void {
        if (e === undefined) {
            e = 0.5;
        }
        if (this.checkInited()) {
            this.skipPage(this.curPageNum - 1, e);
        }
    }

    _onTouchUp(): void {
        const e = this;
        e._scrollPos = null;
        if (e._slideMode == SlideType.ADHERING) {
            if (this.adhering) {
                this._adheringBarrier = true;
            }
            e.adhere();
        } else if (e._slideMode == SlideType.PAGE) {
            if (e._beganPos != null) {
                this._pageAdhere();
            } else {
                e.adhere();
            }
        }
        this._scrollItem = null;
    }

    _calcExistItemPos(e: number): any {
        const t = this.getItemByListId(e);
        if (!t) {
            return null;
        }
        const o: any = {
            id: e,
            x: t.x,
            y: t.y,
        };
        if (this._sizeType) {
            o.top = t.y + t.height * (1 - t.anchorY);
            o.bottom = t.y - t.height * t.anchorY;
        } else {
            o.left = t.x - t.width * t.anchorX;
            o.right = t.x + t.width * (1 - t.anchorX);
        }
        return o;
    }

    setMultSelected(e: number | number[], t?: boolean): void {
        const o = this;
        if (o.checkInited()) {
            if (!Array.isArray(e)) {
                e = [e];
            }
            if (t == null) {
                o.multSelected = e;
            } else {
                let n: number;
                let i: number;
                if (t) {
                    for (let a = e.length - 1; a >= 0; a--) {
                        n = e[a];
                        i = o.multSelected.indexOf(n);
                        if (i < 0) {
                            o.multSelected.push(n);
                        }
                    }
                } else {
                    for (let a = e.length - 1; a >= 0; a--) {
                        n = e[a];
                        i = o.multSelected.indexOf(n);
                        if (i >= 0) {
                            o.multSelected.splice(i, 1);
                        }
                    }
                }
            }
            o._forceUpdate = true;
            o._onScrolling();
        }
    }

    _pageAdhere(): void {
        const e = this;
        if (e.cyclic || !(e.elasticTop > 0 || e.elasticRight > 0 || e.elasticBottom > 0 || e.elasticLeft > 0)) {
            const t = e._sizeType ? e.viewTop : e.viewLeft;
            const o = (e._sizeType ? e.node.height : e.node.width) * e.pageDistance;
            if (Math.abs(e._beganPos - t) > o) {
                switch (e._alignCalcType) {
                    case 1:
                    case 4:
                        if (e._beganPos > t) {
                            e.prePage(0.5);
                        } else {
                            e.nextPage(0.5);
                        }
                        break;
                    case 2:
                    case 3:
                        if (e._beganPos < t) {
                            e.prePage(0.5);
                        } else {
                            e.nextPage(0.5);
                        }
                }
            } else if (e.elasticTop <= 0 && e.elasticRight <= 0 && e.elasticBottom <= 0 && e.elasticLeft <= 0) {
                e.adhere();
            }
            e._beganPos = null;
        }
    }

    _updateItemPos(e: number | cc.Node): void {
        const t = isNaN(e as number) ? (e as cc.Node) : this.getItemByListId(e as number);
        const o = this.getItemPos((t as any)._listId);
        t.setPosition(o.x, o.y);
    }

    adhere(): void {
        const e = this;
        if (e.checkInited() && !(e.elasticTop > 0 || e.elasticRight > 0 || e.elasticBottom > 0 || e.elasticLeft > 0)) {
            e.adhering = true;
            e._calcNearestItem();
            const t = (e._sizeType ? e._topGap : e._leftGap) / (e._sizeType ? e.node.height : e.node.width);
            e.scrollTo(e.nearestListId, 0.7, t);
        }
    }

    onEnable(): void {
        this._registerEvent();
        this._init();
        if (this._aniDelRuning) {
            this._aniDelRuning = false;
            if (this._aniDelItem) {
                if (this._aniDelBeforePos) {
                    this._aniDelItem.position = this._aniDelBeforePos;
                    delete this._aniDelBeforePos;
                }
                if (this._aniDelBeforeScale) {
                    this._aniDelItem.scale = this._aniDelBeforeScale;
                    delete this._aniDelBeforeScale;
                }
                delete this._aniDelItem;
            }
            if (this._aniDelCB) {
                this._aniDelCB();
                delete this._aniDelCB;
            }
        }
    }

    _onTouchCancelled(e: cc.Event.EventTouch, t: any): void {
        const o = this;
        if (!o._scrollView.hasNestedViewGroup(e, t) && !(e as any).simulate) {
            o._scrollPos = null;
            if (o._slideMode == SlideType.ADHERING) {
                if (o.adhering) {
                    o._adheringBarrier = true;
                }
                o.adhere();
            } else if (o._slideMode == SlideType.PAGE) {
                if (o._beganPos != null) {
                    o._pageAdhere();
                } else {
                    o.adhere();
                }
            }
            this._scrollItem = null;
        }
    }

    _resizeContent(): void {
        let e: number;
        const t = this;
        switch (t._align) {
            case cc.Layout.Type.HORIZONTAL:
                if (t._customSize) {
                    const o = t._getFixedSize(null);
                    e =
                        t._leftGap +
                        o.val +
                        t._itemSize.width * (t._numItems - o.count) +
                        t._columnGap * (t._numItems - 1) +
                        t._rightGap;
                } else {
                    e = t._leftGap + t._itemSize.width * t._numItems + t._columnGap * (t._numItems - 1) + t._rightGap;
                }
                break;
            case cc.Layout.Type.VERTICAL:
                if (t._customSize) {
                    const o = t._getFixedSize(null);
                    e =
                        t._topGap +
                        o.val +
                        t._itemSize.height * (t._numItems - o.count) +
                        t._lineGap * (t._numItems - 1) +
                        t._bottomGap;
                } else {
                    e = t._topGap + t._itemSize.height * t._numItems + t._lineGap * (t._numItems - 1) + t._bottomGap;
                }
                break;
            case cc.Layout.Type.GRID:
                if (t.lackCenter) {
                    t.lackCenter = false;
                }
                switch (t._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL:
                        const n = Math.ceil(t._numItems / t._colLineNum);
                        e = t._topGap + t._itemSize.height * n + t._lineGap * (n - 1) + t._bottomGap;
                        break;
                    case cc.Layout.AxisDirection.VERTICAL:
                        const i = Math.ceil(t._numItems / t._colLineNum);
                        e = t._leftGap + t._itemSize.width * i + t._columnGap * (i - 1) + t._rightGap;
                }
        }
        const a = t.content.getComponent(cc.Layout);
        if (a) {
            a.enabled = false;
        }
        t._allItemSize = e;
        t._allItemSizeNoEdge = t._allItemSize - (t._sizeType ? t._topGap + t._bottomGap : t._leftGap + t._rightGap);
        if (t.cyclic) {
            const r = t._sizeType ? t.node.height : t.node.width;
            t._cyclicPos1 = 0;
            r -= t._cyclicPos1;
            t._cyclicNum = Math.ceil(r / t._allItemSizeNoEdge) + 1;
            const l = t._sizeType ? t._lineGap : t._columnGap;
            t._cyclicPos2 = t._cyclicPos1 + t._allItemSizeNoEdge + l;
            t._cyclicAllItemSize = t._allItemSize + t._allItemSizeNoEdge * (t._cyclicNum - 1) + l * (t._cyclicNum - 1);
            t._cycilcAllItemSizeNoEdge = t._allItemSizeNoEdge * t._cyclicNum;
            t._cycilcAllItemSizeNoEdge += l * (t._cyclicNum - 1);
        }
        t._lack = !t.cyclic && t._allItemSize < (t._sizeType ? t.node.height : t.node.width);
        const s = (t._lack && t.lackCenter) || !t.lackSlide ? 0.1 : 0;
        let c = t._lack ? (t._sizeType ? t.node.height : t.node.width) - s : t.cyclic ? t._cyclicAllItemSize : t._allItemSize;
        if (c < 0) {
            c = 0;
        }
        if (t._sizeType) {
            t.content.height = c;
        } else {
            t.content.width = c;
        }
    }

    _onItemAdaptive(e: cc.Node): void {
        if (
            (!this._sizeType && e.width != this._itemSize.width) ||
            (this._sizeType && e.height != this._itemSize.height)
        ) {
            if (!this._customSize) {
                this._customSize = {};
            }
            const t = this._sizeType ? e.height : e.width;
            if (this._customSize[(e as any)._listId] != t) {
                this._customSize[(e as any)._listId] = t;
                this._resizeContent();
                this.updateAll();
                if (this._scrollToListId != null) {
                    this._scrollPos = null;
                    this.unschedule(this._scrollToSo);
                    this.scrollTo(this._scrollToListId, Math.max(0, this._scrollToEndTime - new Date().getTime() / 1e3));
                }
            }
        }
    }

    aniDelItem(e: number, t: (index: number) => void, o: any): void {
        const n = this;
        if (!n.checkInited() || n.cyclic || !n._virtual) {
            return cc.error("This function is not allowed to be called!");
        }
        if (!t) {
            return cc.error("CallFunc are not allowed to be NULL, You need to delete the corresponding index in the data array in the CallFunc!");
        }
        if (n._aniDelRuning) {
            return cc.warn("Please wait for the current deletion to finish!");
        }
        let i: ListItem;
        const a = n.getItemByListId(e);
        if (a) {
            i = a.getComponent(ListItem);
            n._aniDelRuning = true;
            n._aniDelCB = t;
            n._aniDelItem = a;
            n._aniDelBeforePos = a.position;
            n._aniDelBeforeScale = a.scale;
            const l = n.displayData[n.displayData.length - 1].id;
            const s = i.selected;
            i.showAni(
                o,
                function () {
                    let o: number;
                    let r: boolean;
                    if (l < n._numItems - 2) {
                        o = l + 1;
                    }
                    if (o != null) {
                        const c = n._calcItemPos(o);
                        n.displayData.push(c);
                        if (n._virtual) {
                            n._createOrUpdateItem(c);
                        } else {
                            n._createOrUpdateItem2(o);
                        }
                    } else {
                        n._numItems--;
                    }
                    if (n.selectedMode == SelectedType.SINGLE) {
                        if (s) {
                            n._selectedId = -1;
                        } else if (n._selectedId - 1 >= 0) {
                            n._selectedId--;
                        }
                    } else if (n.selectedMode == SelectedType.MULT && n.multSelected.length) {
                        const u = n.multSelected.indexOf(e);
                        if (u >= 0) {
                            n.multSelected.splice(u, 1);
                        }
                        for (let p = n.multSelected.length - 1; p >= 0; p--) {
                            const f = n.multSelected[p];
                            if (f >= e) {
                                n.multSelected[p]--;
                            }
                        }
                    }
                    if (n._customSize) {
                        if (n._customSize[e]) {
                            delete n._customSize[e];
                        }
                        const d: any = {};
                        let _: number;
                        for (const f in n._customSize) {
                            _ = n._customSize[f];
                            const h = parseInt(f);
                            d[h - (h >= e ? 1 : 0)] = _;
                        }
                        n._customSize = d;
                    }
                    for (let p = o != null ? o : l; p >= e + 1; p--) {
                        const aNode = n.getItemByListId(p);
                        if (aNode) {
                            const y = n._calcItemPos(p - 1);
                            const tween = cc.tween(aNode).to(0.2333, {
                                position: cc.v2(y.x, y.y),
                            });
                            if (p <= e + 1) {
                                r = true;
                                tween.call(function () {
                                    n._aniDelRuning = false;
                                    t(e);
                                    delete n._aniDelCB;
                                });
                            }
                            tween.start();
                        }
                    }
                    if (!r) {
                        n._aniDelRuning = false;
                        t(e);
                        n._aniDelCB = null;
                    }
                },
                true
            );
        } else {
            t(e);
        }
    }

    nextPage(e?: number): void {
        if (e === undefined) {
            e = 0.5;
        }
        if (this.checkInited()) {
            this.skipPage(this.curPageNum + 1, e);
        }
    }

    onLoad(): void {
        this._init();
    }

    _calcViewPos(): void {
        const e = this.content.getPosition();
        switch (this._alignCalcType) {
            case 1:
                this.elasticLeft = e.x > 0 ? e.x : 0;
                this.viewLeft = (e.x < 0 ? -e.x : 0) - this.elasticLeft;
                this.viewRight = this.viewLeft + this.node.width;
                this.elasticRight = this.viewRight > this.content.width ? Math.abs(this.viewRight - this.content.width) : 0;
                this.viewRight += this.elasticRight;
                break;
            case 2:
                this.elasticRight = e.x < 0 ? -e.x : 0;
                this.viewRight = (e.x > 0 ? -e.x : 0) + this.elasticRight;
                this.viewLeft = this.viewRight - this.node.width;
                this.elasticLeft = this.viewLeft < -this.content.width ? Math.abs(this.viewLeft + this.content.width) : 0;
                this.viewLeft -= this.elasticLeft;
                break;
            case 3:
                this.elasticTop = e.y < 0 ? Math.abs(e.y) : 0;
                this.viewTop = (e.y > 0 ? -e.y : 0) + this.elasticTop;
                this.viewBottom = this.viewTop - this.node.height;
                this.elasticBottom =
                    this.viewBottom < -this.content.height ? Math.abs(this.viewBottom + this.content.height) : 0;
                this.viewBottom += this.elasticBottom;
                break;
            case 4:
                this.elasticBottom = e.y > 0 ? Math.abs(e.y) : 0;
                this.viewBottom = (e.y < 0 ? -e.y : 0) - this.elasticBottom;
                this.viewTop = this.viewBottom + this.node.height;
                this.elasticTop =
                    this.viewTop > this.content.height ? Math.abs(this.viewTop - this.content.height) : 0;
                this.viewTop -= this.elasticTop;
        }
    }

    _resetItemSize(_t?: cc.Node): void {}

    getItemByListId(e: number): cc.Node {
        if (this.content) {
            for (let t = this.content.childrenCount - 1; t >= 0; t--) {
                const o = this.content.children[t];
                if ((o as any)._listId == e) {
                    return o;
                }
            }
        }
    }

    calcCustomSize(e: number): any {
        const t = this;
        if (t.checkInited()) {
            if (!t._itemTmp) {
                return cc.error("Unset template item!");
            }
            if (!t.renderEvent) {
                return cc.error("Unset Render-Event!");
            }
            t._customSize = {};
            const o = cc.instantiate(t._itemTmp);
            t.content.addChild(o);
            for (let n = 0; n < e; n++) {
                cc.Component.EventHandler.emitEvents([t.renderEvent], o, n);
                if (o.height == t._itemSize.height && o.width == t._itemSize.width) {
                    // no custom size
                } else {
                    t._customSize[n] = t._sizeType ? o.height : o.width;
                }
            }
            if (!Object.keys(t._customSize).length) {
                t._customSize = null;
            }
            o.removeFromParent();
            if (o.destroy) {
                o.destroy();
            }
            return t._customSize;
        }
    }

    update(): void {
        if (!(this.frameByFrameRenderNum <= 0 || this._updateDone)) {
            if (this._virtual) {
                const e =
                    this._updateCounter + this.frameByFrameRenderNum > this.displayItemNum
                        ? this.displayItemNum
                        : this._updateCounter + this.frameByFrameRenderNum;
                for (let t = this._updateCounter; t < e; t++) {
                    const o = this.displayData[t];
                    if (o) {
                        this._createOrUpdateItem(o);
                    }
                }
                if (this._updateCounter >= this.displayItemNum - 1) {
                    if (this._doneAfterUpdate) {
                        this._updateCounter = 0;
                        this._updateDone = false;
                        this._doneAfterUpdate = false;
                    } else {
                        this._updateDone = true;
                        this._delRedundantItem();
                        this._forceUpdate = false;
                        this._calcNearestItem();
                        if (this.slideMode == SlideType.PAGE) {
                            this.curPageNum = this.nearestListId;
                        }
                    }
                } else {
                    this._updateCounter += this.frameByFrameRenderNum;
                }
            } else if (this._updateCounter < this._numItems) {
                const e =
                    this._updateCounter + this.frameByFrameRenderNum > this._numItems
                        ? this._numItems
                        : this._updateCounter + this.frameByFrameRenderNum;
                for (let t = this._updateCounter; t < e; t++) {
                    this._createOrUpdateItem2(t);
                }
                this._updateCounter += this.frameByFrameRenderNum;
            } else {
                this._updateDone = true;
                this._calcNearestItem();
                if (this.slideMode == SlideType.PAGE) {
                    this.curPageNum = this.nearestListId;
                }
            }
        }
    }
}
