import ListItem from "./ListItem";

const { ccclass, property, disallowMultiple, menu, executionOrder, requireComponent } = cc._decorator;

enum TemplateType {
    NODE = 1,
    PREFAB = 2,
}

enum SlideMode {
    NORMAL = 1,
    ADHERING = 2,
    PAGE = 3,
}

enum SelectedMode {
    NONE = 0,
    SINGLE = 1,
    MULT = 2,
}

@ccclass
@disallowMultiple()
@menu("自定义组件/List")
@requireComponent(cc.ScrollView)
@executionOrder(-5000)
export default class List extends cc.Component {
    @property({
        type: cc.Enum(TemplateType)
    })
    templateType: TemplateType = TemplateType.NODE;

    @property({
        type: cc.Node,
        visible(): boolean {
            return this.templateType == TemplateType.NODE;
        }
    })
    tmpNode: cc.Node = null;

    @property({
        type: cc.Prefab,
        visible(): boolean {
            return this.templateType == TemplateType.PREFAB;
        }
    })
    tmpPrefab: cc.Prefab = null;

    @property
    _slideMode: SlideMode = SlideMode.NORMAL;

    @property({
        type: cc.Enum(SlideMode)
    })
    get slideMode(): SlideMode {
        return this._slideMode;
    }

    set slideMode(value: SlideMode) {
        this._slideMode = value;
    }

    @property({
        type: cc.Float,
        range: [0, 1, 0.1],
        slide: true,
        visible(): boolean {
            return this._slideMode == SlideMode.PAGE;
        }
    })
    pageDistance: number = 0.3;

    @property({
        type: cc.Component.EventHandler,
        visible(): boolean {
            return this._slideMode == SlideMode.PAGE;
        }
    })
    pageChangeEvent: cc.Component.EventHandler = new cc.Component.EventHandler();

    @property
    _virtual: boolean = true;

    @property({
        type: cc.Boolean
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
        visible(): boolean {
            const e = this.slideMode == SlideMode.NORMAL;
            if (!e) {
                this.cyclic = false;
            }
            return e;
        }
    })
    cyclic: boolean = false;

    @property({
        visible(): boolean {
            return this.virtual;
        }
    })
    lackCenter: boolean = false;

    @property({
        visible(): boolean {
            const e = this.virtual && !this.lackCenter;
            if (!e) {
                this.lackSlide = false;
            }
            return e;
        }
    })
    lackSlide: boolean = false;

    @property({
        type: cc.Integer
    })
    _updateRate: number = 0;

    @property({
        type: cc.Integer,
        range: [0, 6, 1],
        slide: true
    })
    get updateRate(): number {
        return this._updateRate;
    }

    set updateRate(value: number) {
        if (value >= 0 && value <= 6) {
            this._updateRate = value;
        }
    }

    @property({
        type: cc.Integer,
        range: [0, 12, 1],
        slide: true
    })
    frameByFrameRenderNum: number = 0;

    @property({
        type: cc.Component.EventHandler
    })
    renderEvent: cc.Component.EventHandler = new cc.Component.EventHandler();

    @property({
        type: cc.Enum(SelectedMode)
    })
    selectedMode: SelectedMode = SelectedMode.NONE;

    @property({
        visible(): boolean {
            return this.selectedMode == SelectedMode.SINGLE;
        }
    })
    repeatEventSingle: boolean = false;

    @property({
        type: cc.Component.EventHandler,
        visible(): boolean {
            return this.selectedMode > SelectedMode.NONE;
        }
    })
    selectedEvent: cc.Component.EventHandler = new cc.Component.EventHandler();

    @property({
        serializable: false
    })
    _numItems: number = 0;

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

    _scrollView: cc.ScrollView = null;
    content: cc.Node = null;
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
    _itemTmp: cc.Node = null;
    _itemSize: cc.Size = null;
    multSelected: number[] = null;
    _lastDisplayData: number[] = [];
    displayData: any[] = [];
    _pool: cc.NodePool = null;
    _updateCounter: number = 0;
    _actualNumItems: number = 0;
    _lastSelectedId: number = null;
    frameCount: number = null;
    _customSize: { [key: number]: number } = null;
    _allItemSize: number = null;
    _allItemSizeNoEdge: number = null;
    _cyclicPos1: number = null;
    _cyclicPos2: number = null;
    _cyclicNum: number = null;
    _cyclicAllItemSize: number = null;
    _cycilcAllItemSizeNoEdge: number = null;
    _lack: boolean = null;
    firstListId: number = null;
    displayItemNum: number = null;
    nearestListId: number = null;
    _beganPos: number = null;
    curScrollIsTouch: boolean = null;
    scrollToListId: number = null;
    _scrollItem: cc.Node = null;
    _scrollPos: number = null;
    _scrollToListId: number = null;
    _scrollToEndTime: number = null;
    _scrollToSo: Function = null;
    _aniDelCB: Function = null;
    _aniDelItem: cc.Node = null;
    _aniDelBeforePos: cc.Vec3 = null;
    _aniDelBeforeScale: cc.Vec3 = null;
    _sizeType: boolean = null;
    elasticLeft: number = null;
    viewLeft: number = null;
    viewRight: number = null;
    elasticRight: number = null;
    elasticTop: number = null;
    viewTop: number = null;
    viewBottom: number = null;
    elasticBottom: number = null;

    get selectedId(): number {
        return this._selectedId;
    }

    set selectedId(value: number) {
        const i = this;
        switch (i.selectedMode) {
            case SelectedMode.SINGLE:
                if (!i.repeatEventSingle && value == i._selectedId) {
                    return;
                }
                let t = i.getItemByListId(value);
                let n: ListItem = undefined;
                if (i._selectedId >= 0) {
                    i._lastSelectedId = i._selectedId;
                } else {
                    i._lastSelectedId = null;
                }
                i._selectedId = value;
                if (t) {
                    n = t.getComponent(ListItem);
                    n.selected = true;
                }
                if (i._lastSelectedId >= 0 && i._lastSelectedId != i._selectedId) {
                    const a = i.getItemByListId(i._lastSelectedId);
                    if (a) {
                        a.getComponent(ListItem).selected = false;
                    }
                }
                if (i.selectedEvent) {
                    cc.Component.EventHandler.emitEvents([i.selectedEvent], t, value % this._actualNumItems, i._lastSelectedId == null ? null : i._lastSelectedId % this._actualNumItems);
                }
                break;

            case SelectedMode.MULT:
                t = i.getItemByListId(value);
                if (!t) {
                    return;
                }
                n = t.getComponent(ListItem);
                if (i._selectedId >= 0) {
                    i._lastSelectedId = i._selectedId;
                }
                i._selectedId = value;
                const r = !n.selected;
                n.selected = r;
                const s = i.multSelected.indexOf(value);
                if (r && s < 0) {
                    i.multSelected.push(value);
                } else if (!r && s >= 0) {
                    i.multSelected.splice(s, 1);
                }
                if (i.selectedEvent) {
                    cc.Component.EventHandler.emitEvents([i.selectedEvent], t, value % this._actualNumItems, i._lastSelectedId == null ? null : i._lastSelectedId % this._actualNumItems, r);
                }
                break;
        }
    }

    get numItems(): number {
        return this._actualNumItems;
    }

    set numItems(value: number) {
        const t = this;
        if (!t.checkInited(false)) {
            return;
        }
        if (value == null || value < 0) {
            cc.error(" numItems set the wrong:: ", value);
        } else {
            t._actualNumItems = t._numItems = value;
            t._forceUpdate = true;
            if (t._virtual) {
                t._resizeContent();
                if (t.cyclic) {
                    t._numItems = t._cyclicNum * t._numItems;
                }
                t._onScrolling();
                if (!t.frameByFrameRenderNum && t.slideMode == SlideMode.PAGE) {
                    t.curPageNum = t.nearestListId;
                }
            } else {
                if (t.cyclic) {
                    t._resizeContent();
                    t._numItems = t._cyclicNum * t._numItems;
                }
                const layout = t.content.getComponent(cc.Layout);
                if (layout) {
                    layout.enabled = true;
                }
                t._delRedundantItem();
                t.firstListId = 0;
                if (t.frameByFrameRenderNum > 0) {
                    const n = t.frameByFrameRenderNum > t._numItems ? t._numItems : t.frameByFrameRenderNum;
                    for (let o = 0; o < n; o++) {
                        t._createOrUpdateItem2(o);
                    }
                    if (t.frameByFrameRenderNum < t._numItems) {
                        t._updateCounter = t.frameByFrameRenderNum;
                        t._updateDone = false;
                    }
                } else {
                    for (let o = 0; o < t._numItems; o++) {
                        t._createOrUpdateItem2(o);
                    }
                    t.displayItemNum = t._numItems;
                }
            }
        }
    }

    get scrollView(): cc.ScrollView {
        return this._scrollView;
    }

    onLoad(): void {
        this._init();
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

    onDisable(): void {
        this._unregisterEvent();
    }

    _registerEvent(): void {
        const e = this;
        e.node.on(cc.Node.EventType.TOUCH_START, e._onTouchStart, e, true);
        e.node.on(" touch- up ", e._onTouchUp, e);
        e.node.on(cc.Node.EventType.TOUCH_CANCEL, e._onTouchCancelled, e, true);
        e.node.on(" scroll- began ", e._onScrollBegan, e, true);
        e.node.on(" scroll- ended ", e._onScrollEnded, e, true);
        e.node.on(" scrolling ", e._onScrolling, e, true);
        e.node.on(cc.Node.EventType.SIZE_CHANGED, e._onSizeChanged, e);
    }

    _unregisterEvent(): void {
        const e = this;
        e.node.off(cc.Node.EventType.TOUCH_START, e._onTouchStart, e, true);
        e.node.off(" touch- up ", e._onTouchUp, e);
        e.node.off(cc.Node.EventType.TOUCH_CANCEL, e._onTouchCancelled, e, true);
        e.node.off(" scroll- began ", e._onScrollBegan, e, true);
        e.node.off(" scroll- ended ", e._onScrollEnded, e, true);
        e.node.off(" scrolling ", e._onScrolling, e, true);
        e.node.off(cc.Node.EventType.SIZE_CHANGED, e._onSizeChanged, e);
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
                e._verticalDir = e._layout.verticalDirection;
                e._horizontalDir = e._layout.horizontalDirection;
                e.setTemplateItem(cc.instantiate(e.templateType == TemplateType.PREFAB ? e.tmpPrefab : e.tmpNode));
                if (e._slideMode == SlideMode.ADHERING || e._slideMode == SlideMode.PAGE) {
                    e._scrollView.inertia = false;
                    (e._scrollView as any)._onMouseWheel = function () { };
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
                cc.error(e.node.name + " 's cc.ScrollView unset content!");
            }
        }
    }

    _processAutoScrolling(dt: number): void {
        const scrollView = this._scrollView as any;
        scrollView._autoScrollAccumulatedTime += 1 * dt;
        let t = Math.min(1, scrollView._autoScrollAccumulatedTime / scrollView._autoScrollTotalTime);
        if (scrollView._autoScrollAttenuate) {
            const i = t - 1;
            t = i * i * i * i * i + 1;
        }
        const n = scrollView._autoScrollStartPosition.add(scrollView._autoScrollTargetDelta.mul(t));
        const a = scrollView.getScrollEndedEventTiming();
        const o = Math.abs(t - 1) <= a;
        if (Math.abs(t - 1) <= scrollView.getScrollEndedEventTiming() && !scrollView._isScrollEndedWithThresholdEventFired) {
            scrollView._dispatchEvent("scroll-ended-with-threshold");
            scrollView._isScrollEndedWithThresholdEventFired = true;
        }
        if (o) {
            scrollView._autoScrolling = false;
        }
        const r = n.sub(scrollView.getContentPosition());
        scrollView._moveContent(scrollView._clampDelta(r), o);
        scrollView._dispatchEvent("scrolling");
        if (!scrollView._autoScrolling) {
            scrollView._isBouncing = false;
            scrollView._scrolling = false;
            scrollView._dispatchEvent("scroll-ended");
        }
    }

    setTemplateItem(item: cc.Node): void {
        if (item) {
            const t = this;
            t._itemTmp = item;
            if (t._resizeMode == cc.Layout.ResizeMode.CHILDREN) {
                t._itemSize = t._layout.cellSize;
            } else {
                t._itemSize = cc.size(item.width, item.height);
            }
            let listItemComp = item.getComponent(ListItem);
            let n = false;
            if (!listItemComp) {
                n = true;
            }
            if (n) {
                t.selectedMode = SelectedMode.NONE;
            }
            const widget = item.getComponent(cc.Widget);
            if (widget && widget.enabled) {
                t._needUpdateWidget = true;
            }
            if (t.selectedMode == SelectedMode.MULT) {
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
                            const a = t.content.width - t._leftGap - t._rightGap;
                            t._colLineNum = Math.floor((a + t._columnGap) / (t._itemSize.width + t._columnGap));
                            t._sizeType = true;
                            break;

                        case cc.Layout.AxisDirection.VERTICAL:
                            const r = t.content.height - t._topGap - t._bottomGap;
                            t._colLineNum = Math.floor((r + t._lineGap) / (t._itemSize.height + t._lineGap));
                            t._sizeType = false;
                    }
            }
        }
    }

    checkInited(showError: boolean = true): boolean {
        return !!this._inited || (showError && cc.error("List initialization not completed!"), false);
    }

    _resizeContent(): void {
        let e: number;
        const t = this;
        switch (t._align) {
            case cc.Layout.Type.HORIZONTAL:
                if (t._customSize) {
                    let i = t._getFixedSize(null);
                    e = t._leftGap + i.val + t._itemSize.width * (t._numItems - i.count) + t._columnGap * (t._numItems - 1) + t._rightGap;
                } else {
                    e = t._leftGap + t._itemSize.width * t._numItems + t._columnGap * (t._numItems - 1) + t._rightGap;
                }
                break;

            case cc.Layout.Type.VERTICAL:
                if (t._customSize) {
                    const i = t._getFixedSize(null);
                    e = t._topGap + i.val + t._itemSize.height * (t._numItems - i.count) + t._lineGap * (t._numItems - 1) + t._bottomGap;
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
                        const a = Math.ceil(t._numItems / t._colLineNum);
                        e = t._leftGap + t._itemSize.width * a + t._columnGap * (a - 1) + t._rightGap;
                }
        }
        const layout = t.content.getComponent(cc.Layout);
        if (layout) {
            layout.enabled = false;
        }
        t._allItemSize = e;
        t._allItemSizeNoEdge = t._allItemSize - (t._sizeType ? t._topGap + t._bottomGap : t._leftGap + t._rightGap);
        if (t.cyclic) {
            const r = t._sizeType ? t.node.height : t.node.width;
            t._cyclicPos1 = 0;
            const viewSize = r - t._cyclicPos1;
            t._cyclicNum = Math.ceil(viewSize / t._allItemSizeNoEdge) + 1;
            const s = t._sizeType ? t._lineGap : t._columnGap;
            t._cyclicPos2 = t._cyclicPos1 + t._allItemSizeNoEdge + s;
            t._cyclicAllItemSize = t._allItemSize + t._allItemSizeNoEdge * (t._cyclicNum - 1) + s * (t._cyclicNum - 1);
            t._cycilcAllItemSizeNoEdge = t._allItemSizeNoEdge * t._cyclicNum;
            t._cycilcAllItemSizeNoEdge += s * (t._cyclicNum - 1);
        }
        t._lack = !t.cyclic && t._allItemSize < (t._sizeType ? t.node.height : t.node.width);
        const l = t._lack && t.lackCenter || !t.lackSlide ? 0.1 : 0;
        let c = t._lack ? (t._sizeType ? t.node.height : t.node.width) - l : t.cyclic ? t._cyclicAllItemSize : t._allItemSize;
        if (c < 0) {
            c = 0;
        }
        if (t._sizeType) {
            t.content.height = c;
        } else {
            t.content.width = c;
        }
    }

    _onScrolling(event: cc.Event = null): void {
        if (this.frameCount == null) {
            this.frameCount = this._updateRate;
        }
        if (!this._forceUpdate && event && event.type != "scroll-ended" && this.frameCount > 0) {
            this.frameCount--;
        } else {
            this.frameCount = this._updateRate;
            if (!this._aniDelRuning) {
                if (this.cyclic) {
                    let pos = this.content.getPosition();
                    pos = this._sizeType ? pos.y : pos.x;
                    const i = this._allItemSizeNoEdge + (this._sizeType ? this._lineGap : this._columnGap);
                    const n = this._sizeType ? cc.v2(0, i) : cc.v2(i, 0);
                    const scrollView = this._scrollView as any;
                    switch (this._alignCalcType) {
                        case 1:
                            if (pos > -this._cyclicPos1) {
                                this.content.x = -this._cyclicPos2;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.sub(n);
                                }
                            } else if (pos < -this._cyclicPos2) {
                                this.content.x = -this._cyclicPos1;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.add(n);
                                }
                            }
                            break;

                        case 2:
                            if (pos < this._cyclicPos1) {
                                this.content.x = this._cyclicPos2;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.add(n);
                                }
                            } else if (pos > this._cyclicPos2) {
                                this.content.x = this._cyclicPos1;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.sub(n);
                                }
                            }
                            break;

                        case 3:
                            if (pos < this._cyclicPos1) {
                                this.content.y = this._cyclicPos2;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.add(n);
                                }
                            } else if (pos > this._cyclicPos2) {
                                this.content.y = this._cyclicPos1;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.sub(n);
                                }
                            }
                            break;

                        case 4:
                            if (pos > -this._cyclicPos1) {
                                this.content.y = -this._cyclicPos2;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.sub(n);
                                }
                            } else if (pos < -this._cyclicPos2) {
                                this.content.y = -this._cyclicPos1;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.add(n);
                                }
                            }
                    }
                }
                let a: number;
                let o: number;
                let r: number;
                let s: number;
                this._calcViewPos();
                if (this._sizeType) {
                    a = this.viewTop;
                    r = this.viewBottom;
                } else {
                    o = this.viewRight;
                    s = this.viewLeft;
                }
                if (this._virtual) {
                    this.displayData = [];
                    let l: any;
                    let c = 0;
                    let u = this._numItems - 1;
                    if (this._customSize) {
                        let d = false;
                        for (; c <= u && !d; c++) {
                            l = this._calcItemPos(c);
                            switch (this._align) {
                                case cc.Layout.Type.HORIZONTAL:
                                    if (l.right >= s && l.left <= o) {
                                        this.displayData.push(l);
                                    } else if (c != 0 && this.displayData.length > 0) {
                                        d = true;
                                    }
                                    break;

                                case cc.Layout.Type.VERTICAL:
                                    if (l.bottom <= a && l.top >= r) {
                                        this.displayData.push(l);
                                    } else if (c != 0 && this.displayData.length > 0) {
                                        d = true;
                                    }
                                    break;

                                case cc.Layout.Type.GRID:
                                    switch (this._startAxis) {
                                        case cc.Layout.AxisDirection.HORIZONTAL:
                                            if (l.bottom <= a && l.top >= r) {
                                                this.displayData.push(l);
                                            } else if (c != 0 && this.displayData.length > 0) {
                                                d = true;
                                            }
                                            break;

                                        case cc.Layout.AxisDirection.VERTICAL:
                                            if (l.right >= s && l.left <= o) {
                                                this.displayData.push(l);
                                            } else if (c != 0 && this.displayData.length > 0) {
                                                d = true;
                                            }
                                    }
                            }
                        }
                    } else {
                        const h = this._itemSize.width + this._columnGap;
                        const p = this._itemSize.height + this._lineGap;
                        switch (this._alignCalcType) {
                            case 1:
                                c = (s - this._leftGap) / h;
                                u = (o - this._leftGap) / h;
                                break;

                            case 2:
                                c = (-o - this._rightGap) / h;
                                u = (-s - this._rightGap) / h;
                                break;

                            case 3:
                                c = (-a - this._topGap) / p;
                                u = (-r - this._topGap) / p;
                                break;

                            case 4:
                                c = (r - this._bottomGap) / p;
                                u = (a - this._bottomGap) / p;
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
                    const lastLen = this._lastDisplayData.length;
                    let f = this.displayItemNum != lastLen;
                    if (f) {
                        if (this.frameByFrameRenderNum > 0) {
                            this._lastDisplayData.sort(function (e, t) {
                                return e - t;
                            });
                        }
                        f = this.firstListId != this._lastDisplayData[0] || this.displayData[this.displayItemNum - 1].id != this._lastDisplayData[lastLen - 1];
                    }
                    if (this._forceUpdate || f) {
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
                this.elasticBottom = this.viewBottom < -this.content.height ? Math.abs(this.viewBottom + this.content.height) : 0;
                this.viewBottom += this.elasticBottom;
                break;

            case 4:
                this.elasticBottom = e.y > 0 ? Math.abs(e.y) : 0;
                this.viewBottom = (e.y < 0 ? -e.y : 0) - this.elasticBottom;
                this.viewTop = this.viewBottom + this.node.height;
                this.elasticTop = this.viewTop > this.content.height ? Math.abs(this.viewTop - this.content.height) : 0;
                this.viewTop -= this.elasticTop;
        }
    }

    _calcItemPos(index: number): any {
        let t: number;
        let i: number;
        let n: number;
        let a: number;
        let o: number;
        let r: number;
        let s: number;
        let l: number;
        switch (this._align) {
            case cc.Layout.Type.HORIZONTAL:
                switch (this._horizontalDir) {
                    case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                        if (this._customSize) {
                            const c = this._getFixedSize(index);
                            o = this._leftGap + (this._itemSize.width + this._columnGap) * (index - c.count) + (c.val + this._columnGap * c.count);
                            t = (this._customSize[index]) > 0 ? this._customSize[index] : this._itemSize.width;
                        } else {
                            o = this._leftGap + (this._itemSize.width + this._columnGap) * index;
                            t = this._itemSize.width;
                        }
                        if (this.lackCenter) {
                            o -= this._leftGap;
                            o += this.content.width / 2 - this._allItemSizeNoEdge / 2;
                        }
                        return {
                            id: index,
                            left: o,
                            right: r = o + t,
                            x: o + this._itemTmp.anchorX * t,
                            y: this._itemTmp.y
                        };

                    case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                        if (this._customSize) {
                            const c = this._getFixedSize(index);
                            r = -this._rightGap - (this._itemSize.width + this._columnGap) * (index - c.count) - (c.val + this._columnGap * c.count);
                            t = (this._customSize[index]) > 0 ? this._customSize[index] : this._itemSize.width;
                        } else {
                            r = -this._rightGap - (this._itemSize.width + this._columnGap) * index;
                            t = this._itemSize.width;
                        }
                        if (this.lackCenter) {
                            r += this._rightGap;
                            r -= this.content.width / 2 - this._allItemSizeNoEdge / 2;
                        }
                        return {
                            id: index,
                            right: r,
                            left: o = r - t,
                            x: o + this._itemTmp.anchorX * t,
                            y: this._itemTmp.y
                        };
                }
                break;

            case cc.Layout.Type.VERTICAL:
                switch (this._verticalDir) {
                    case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                        if (this._customSize) {
                            const c = this._getFixedSize(index);
                            n = -this._topGap - (this._itemSize.height + this._lineGap) * (index - c.count) - (c.val + this._lineGap * c.count);
                            i = (this._customSize[index]) > 0 ? this._customSize[index] : this._itemSize.height;
                        } else {
                            n = -this._topGap - (this._itemSize.height + this._lineGap) * index;
                            i = this._itemSize.height;
                        }
                        if (this.lackCenter) {
                            n += this._topGap;
                            n -= this.content.height / 2 - this._allItemSizeNoEdge / 2;
                        }
                        return {
                            id: index,
                            top: n,
                            bottom: a = n - i,
                            x: this._itemTmp.x,
                            y: a + this._itemTmp.anchorY * i
                        };

                    case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                        let u: number;
                        if (this._customSize) {
                            const c = this._getFixedSize(index);
                            a = this._bottomGap + (this._itemSize.height + this._lineGap) * (index - c.count) + (c.val + this._lineGap * c.count);
                            i = (u = this._customSize[index]) > 0 ? u : this._itemSize.height;
                        } else {
                            a = this._bottomGap + (this._itemSize.height + this._lineGap) * index;
                            i = this._itemSize.height;
                        }
                        if (this.lackCenter) {
                            a -= this._bottomGap;
                            a += this.content.height / 2 - this._allItemSizeNoEdge / 2;
                        }
                        return {
                            id: index,
                            top: n = a + i,
                            bottom: a,
                            x: this._itemTmp.x,
                            y: a + this._itemTmp.anchorY * i
                        };
                }

            case cc.Layout.Type.GRID:
                const d = Math.floor(index / this._colLineNum);
                switch (this._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL:
                        switch (this._verticalDir) {
                            case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                                l = (a = (n = -this._topGap - (this._itemSize.height + this._lineGap) * d) - this._itemSize.height) + this._itemTmp.anchorY * this._itemSize.height;
                                break;

                            case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                                n = (a = this._bottomGap + (this._itemSize.height + this._lineGap) * d) + this._itemSize.height;
                                l = a + this._itemTmp.anchorY * this._itemSize.height;
                        }
                        s = this._leftGap + index % this._colLineNum * (this._itemSize.width + this._columnGap);
                        switch (this._horizontalDir) {
                            case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                                s += this._itemTmp.anchorX * this._itemSize.width;
                                s -= this.content.anchorX * this.content.width;
                                break;

                            case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                                s += (1 - this._itemTmp.anchorX) * this._itemSize.width;
                                s -= (1 - this.content.anchorX) * this.content.width;
                                s *= -1;
                        }
                        return {
                            id: index,
                            top: n,
                            bottom: a,
                            x: s,
                            y: l
                        };

                    case cc.Layout.AxisDirection.VERTICAL:
                        switch (this._horizontalDir) {
                            case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                                r = (o = this._leftGap + (this._itemSize.width + this._columnGap) * d) + this._itemSize.width;
                                s = o + this._itemTmp.anchorX * this._itemSize.width;
                                s -= this.content.anchorX * this.content.width;
                                break;

                            case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                                s = (o = (r = -this._rightGap - (this._itemSize.width + this._columnGap) * d) - this._itemSize.width) + this._itemTmp.anchorX * this._itemSize.width;
                                s += (1 - this.content.anchorX) * this.content.width;
                        }
                        l = -this._topGap - index % this._colLineNum * (this._itemSize.height + this._lineGap);
                        switch (this._verticalDir) {
                            case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                                l -= (1 - this._itemTmp.anchorY) * this._itemSize.height;
                                l += (1 - this.content.anchorY) * this.content.height;
                                break;

                            case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                                l -= this._itemTmp.anchorY * this._itemSize.height;
                                l += this.content.anchorY * this.content.height;
                                l *= -1;
                        }
                        return {
                            id: index,
                            left: o,
                            right: r,
                            x: s,
                            y: l
                        };
                }
        }
    }

    _calcExistItemPos(index: number): any {
        const t = this.getItemByListId(index);
        if (!t) {
            return null;
        }
        const i: any = {
            id: index,
            x: t.x,
            y: t.y
        };
        if (this._sizeType) {
            i.top = t.y + t.height * (1 - t.anchorY);
            i.bottom = t.y - t.height * t.anchorY;
        } else {
            i.left = t.x - t.width * t.anchorX;
            i.right = t.x + t.width * (1 - t.anchorX);
        }
        return i;
    }

    getItemPos(index: number): any {
        return this._virtual ? this._calcItemPos(index) : this.frameByFrameRenderNum ? this._calcItemPos(index) : this._calcExistItemPos(index);
    }

    _getFixedSize(index: number): { val: number; count: number } {
        if (!this._customSize) {
            return null;
        }
        if (index == null) {
            index = this._numItems;
        }
        let t = 0;
        let i = 0;
        for (const n in this._customSize) {
            if (parseInt(n) < index) {
                t += this._customSize[n];
                i++;
            }
        }
        return {
            val: t,
            count: i
        };
    }

    _onScrollBegan(): void {
        this._beganPos = this._sizeType ? this.viewTop : this.viewLeft;
    }

    _onScrollEnded(): void {
        const e = this;
        e.curScrollIsTouch = false;
        if (e.scrollToListId != null) {
            const t = e.getItemByListId(e.scrollToListId);
            e.scrollToListId = null;
            if (t) {
                cc.tween(t).to(0.1, {
                    scale: 1.06
                }).to(0.1, {
                    scale: 1
                }).start();
            }
        }
        e._onScrolling();
        if (e._slideMode != SlideMode.ADHERING || e.adhering) {
            if (e._slideMode == SlideMode.PAGE) {
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

    _onTouchStart(event: cc.Event.EventTouch, captureListeners: any): void {
        if (!this._scrollView.hasNestedViewGroup(event, captureListeners) && (this.curScrollIsTouch = true, event.eventPhase !== cc.Event.AT_TARGET || event.target !== this.node)) {
            let i: any = event.target;
            while ((i as any)._listId == null && i.parent) {
                i = i.parent;
            }
            this._scrollItem = (i as any)._listId != null ? i : event.target;
        }
    }

    _onTouchUp(): void {
        const e = this;
        e._scrollPos = null;
        if (e._slideMode == SlideMode.ADHERING) {
            if (this.adhering) {
                this._adheringBarrier = true;
            }
            e.adhere();
        } else if (e._slideMode == SlideMode.PAGE) {
            if (e._beganPos != null) {
                this._pageAdhere();
            } else {
                e.adhere();
            }
        }
        this._scrollItem = null;
    }

    _onTouchCancelled(event: cc.Event.EventTouch, captureListeners: any): void {
        const i = this;
        if (!i._scrollView.hasNestedViewGroup(event, captureListeners) && !event.simulate) {
            i._scrollPos = null;
            if (i._slideMode == SlideMode.ADHERING) {
                if (i.adhering) {
                    i._adheringBarrier = true;
                }
                i.adhere();
            } else if (i._slideMode == SlideMode.PAGE) {
                if (i._beganPos != null) {
                    i._pageAdhere();
                } else {
                    i.adhere();
                }
            }
            this._scrollItem = null;
        }
    }

    _onSizeChanged(): void {
        if (this.checkInited(false)) {
            this._onScrolling();
        }
    }

    _onItemAdaptive(node: cc.Node): void {
        if (!this._sizeType && node.width != this._itemSize.width || this._sizeType && node.height != this._itemSize.height) {
            if (!this._customSize) {
                this._customSize = {};
            }
            const t = this._sizeType ? node.height : node.width;
            if (this._customSize[(node as any)._listId] != t) {
                this._customSize[(node as any)._listId] = t;
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

    _pageAdhere(): void {
        const e = this;
        if (e.cyclic || !(e.elasticTop > 0 || e.elasticRight > 0 || e.elasticBottom > 0 || e.elasticLeft > 0)) {
            const t = e._sizeType ? e.viewTop : e.viewLeft;
            const i = (e._sizeType ? e.node.height : e.node.width) * e.pageDistance;
            if (Math.abs(e._beganPos - t) > i) {
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

    adhere(): void {
        const e = this;
        if (e.checkInited() && !(e.elasticTop > 0 || e.elasticRight > 0 || e.elasticBottom > 0 || e.elasticLeft > 0)) {
            e.adhering = true;
            e._calcNearestItem();
            const t = (e._sizeType ? e._topGap : e._leftGap) / (e._sizeType ? e.node.height : e.node.width);
            e.scrollTo(e.nearestListId, 0.7, t);
        }
    }

    update(): void {
        if (!(this.frameByFrameRenderNum <= 0 || this._updateDone)) {
            if (this._virtual) {
                const end = this._updateCounter + this.frameByFrameRenderNum > this.displayItemNum ? this.displayItemNum : this._updateCounter + this.frameByFrameRenderNum;
                for (let t = this._updateCounter; t < end; t++) {
                    const i = this.displayData[t];
                    if (i) {
                        this._createOrUpdateItem(i);
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
                        if (this.slideMode == SlideMode.PAGE) {
                            this.curPageNum = this.nearestListId;
                        }
                    }
                } else {
                    this._updateCounter += this.frameByFrameRenderNum;
                }
            } else if (this._updateCounter < this._numItems) {
                const end = this._updateCounter + this.frameByFrameRenderNum > this._numItems ? this._numItems : this._updateCounter + this.frameByFrameRenderNum;
                for (let t = this._updateCounter; t < end; t++) {
                    this._createOrUpdateItem2(t);
                }
                this._updateCounter += this.frameByFrameRenderNum;
            } else {
                this._updateDone = true;
                this._calcNearestItem();
                if (this.slideMode == SlideMode.PAGE) {
                    this.curPageNum = this.nearestListId;
                }
            }
        }
    }

    _createOrUpdateItem(data: any): void {
        let t = this.getItemByListId(data.id);
        if (t) {
            if (this._forceUpdate && this.renderEvent) {
                t.setPosition(cc.v2(data.x, data.y));
                this._resetItemSize(t);
                if (this.renderEvent) {
                    cc.Component.EventHandler.emitEvents([this.renderEvent], t, data.id % this._actualNumItems);
                }
            }
        } else {
            let fromPool = this._pool.size() > 0;
            t = fromPool ? this._pool.get() : cc.instantiate(this._itemTmp);
            if (!fromPool || !cc.isValid(t)) {
                t = cc.instantiate(this._itemTmp);
                fromPool = false;
            }
            if ((t as any)._listId != data.id) {
                (t as any)._listId = data.id;
                t.setContentSize(this._itemSize);
            }
            t.setPosition(cc.v2(data.x, data.y));
            this._resetItemSize(t);
            this.content.addChild(t);
            if (fromPool && this._needUpdateWidget) {
                const widget = t.getComponent(cc.Widget);
                if (widget) {
                    widget.updateAlignment();
                }
            }
            t.setSiblingIndex(this.content.childrenCount - 1);
            const listItemComp = t.getComponent(ListItem);
            (t as any).listItem = listItemComp;
            if (listItemComp) {
                listItemComp.listId = data.id;
                listItemComp.list = this;
                listItemComp._registerEvent();
            }
            if (this.renderEvent) {
                cc.Component.EventHandler.emitEvents([this.renderEvent], t, data.id % this._actualNumItems);
            }
        }
        this._resetItemSize(t);
        this._updateListItem((t as any).listItem);
        if (this._lastDisplayData.indexOf(data.id) < 0) {
            this._lastDisplayData.push(data.id);
        }
    }

    _createOrUpdateItem2(index: number): void {
        let listItemComp: ListItem;
        let i = this.content.children[index];
        if (i) {
            if (this._forceUpdate && this.renderEvent) {
                (i as any)._listId = index;
                if (listItemComp) {
                    listItemComp.listId = index;
                }
                if (this.renderEvent) {
                    cc.Component.EventHandler.emitEvents([this.renderEvent], i, index % this._actualNumItems);
                }
            }
        } else {
            i = cc.instantiate(this._itemTmp);
            (i as any)._listId = index;
            this.content.addChild(i);
            listItemComp = i.getComponent(ListItem);
            (i as any).listItem = listItemComp;
            if (listItemComp) {
                listItemComp.listId = index;
                listItemComp.list = this;
                listItemComp._registerEvent();
            }
            if (this.renderEvent) {
                cc.Component.EventHandler.emitEvents([this.renderEvent], i, index % this._actualNumItems);
            }
        }
        this._updateListItem(listItemComp);
        if (this._lastDisplayData.indexOf(index) < 0) {
            this._lastDisplayData.push(index);
        }
    }

    _updateListItem(listItem: ListItem): void {
        if (listItem && this.selectedMode > SelectedMode.NONE) {
            const t = listItem.node;
            switch (this.selectedMode) {
                case SelectedMode.SINGLE:
                    listItem.selected = this.selectedId == (t as any)._listId;
                    break;

                case SelectedMode.MULT:
                    listItem.selected = this.multSelected.indexOf((t as any)._listId) >= 0;
            }
        }
    }

    _resetItemSize(_node?: cc.Node): void { }

    _updateItemPos(e: number | cc.Node): void {
        const t = isNaN(e as number) ? e as cc.Node : this.getItemByListId(e as number);
        const i = this.getItemPos((t as any)._listId);
        t.setPosition(i.x, i.y);
    }

    setMultSelected(ids: number | number[], add?: boolean): void {
        const i = this;
        if (i.checkInited()) {
            if (!Array.isArray(ids)) {
                ids = [ids];
            }
            if (add == null) {
                i.multSelected = ids as number[];
            } else {
                let n: number;
                let a: number;
                if (add) {
                    for (let o = ids.length - 1; o >= 0; o--) {
                        n = (ids as number[])[o];
                        a = i.multSelected.indexOf(n);
                        if (a < 0) {
                            i.multSelected.push(n);
                        }
                    }
                } else {
                    for (let o = ids.length - 1; o >= 0; o--) {
                        n = (ids as number[])[o];
                        a = i.multSelected.indexOf(n);
                        if (a >= 0) {
                            i.multSelected.splice(a, 1);
                        }
                    }
                }
            }
            i._forceUpdate = true;
            i._onScrolling();
        }
    }

    getMultSelected(): number[] {
        return this.multSelected;
    }

    hasMultSelected(id: number): boolean {
        return this.multSelected && this.multSelected.indexOf(id) >= 0;
    }

    updateItem(ids: number | number[]): void {
        if (this.checkInited()) {
            if (!Array.isArray(ids)) {
                ids = [ids];
            }
            for (let t = 0, len = ids.length; t < len; t++) {
                const n = ids[t];
                const a = this.getItemByListId(n);
                if (a) {
                    cc.Component.EventHandler.emitEvents([this.renderEvent], a, n % this._actualNumItems);
                }
            }
        }
    }

    updateAll(): void {
        if (this.checkInited()) {
            this.numItems = this.numItems;
        }
    }

    getItemByListId(id: number): cc.Node {
        if (this.content) {
            for (let t = this.content.childrenCount - 1; t >= 0; t--) {
                const i = this.content.children[t];
                if ((i as any)._listId == id) {
                    return i;
                }
            }
        }
        return null;
    }

    _getOutsideItem(): cc.Node[] {
        const t: cc.Node[] = [];
        for (let i = this.content.childrenCount - 1; i >= 0; i--) {
            const e = this.content.children[i];
            if (!this.displayData.find(function (data) {
                return data.id == (e as any)._listId;
            })) {
                t.push(e);
            }
        }
        return t;
    }

    _delRedundantItem(): void {
        if (this._virtual) {
            const outsideItems = this._getOutsideItem();
            for (let t = outsideItems.length - 1; t >= 0; t--) {
                const i = outsideItems[t];
                if (!this._scrollItem || (i as any)._listId != (this._scrollItem as any)._listId) {
                    (i as any).isCached = true;
                    this._pool.put(i);
                    for (let n = this._lastDisplayData.length - 1; n >= 0; n--) {
                        if (this._lastDisplayData[n] == (i as any)._listId) {
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

    _delSingleItem(node: cc.Node): void {
        node.removeFromParent();
        if (node.destroy) {
            node.destroy();
        }
    }

    aniDelItem(index: number, callback: (index: number) => void, animType?: number): void {
        let listItemComp: ListItem;
        const a = this;
        if (!a.checkInited() || a.cyclic || !a._virtual) {
            return cc.error("This function is not allowed to be called!");
        }
        if (!callback) {
            return cc.error("CallFunc are not allowed to be NULL, You need to delete the corresponding index in the data array in the CallFunc!");
        }
        if (a._aniDelRuning) {
            return cc.warn("Please wait for the current deletion to finish!");
        }
        const r = a.getItemByListId(index);
        if (r) {
            listItemComp = r.getComponent(ListItem);
            a._aniDelRuning = true;
            a._aniDelCB = callback;
            a._aniDelItem = r;
            a._aniDelBeforePos = r.position;
            a._aniDelBeforeScale = r.scale;
            const s = a.displayData[a.displayData.length - 1].id;
            const l = listItemComp.selected;
            listItemComp.showAni(animType, function () {
                let nextIndex: number;
                let c = false;
                if (s < a._numItems - 2) {
                    nextIndex = s + 1;
                }
                if (nextIndex != null) {
                    const u = a._calcItemPos(nextIndex);
                    a.displayData.push(u);
                    if (a._virtual) {
                        a._createOrUpdateItem(u);
                    } else {
                        a._createOrUpdateItem2(nextIndex);
                    }
                } else {
                    a._numItems--;
                }
                if (a.selectedMode == SelectedMode.SINGLE) {
                    if (l) {
                        a._selectedId = -1;
                    } else if (a._selectedId - 1 >= 0) {
                        a._selectedId--;
                    }
                } else if (a.selectedMode == SelectedMode.MULT && a.multSelected.length) {
                    const d = a.multSelected.indexOf(index);
                    if (d >= 0) {
                        a.multSelected.splice(d, 1);
                    }
                    for (let h = a.multSelected.length - 1; h >= 0; h--) {
                        const f = a.multSelected[h];
                        if (f >= index) {
                            a.multSelected[h]--;
                        }
                    }
                }
                if (a._customSize) {
                    if (a._customSize[index]) {
                        delete a._customSize[index];
                    }
                    const p: { [key: number]: number } = {};
                    let sizeVal: number;
                    for (const key in a._customSize) {
                        sizeVal = a._customSize[key];
                        const g = parseInt(key);
                        p[g - (g >= index ? 1 : 0)] = sizeVal;
                    }
                    a._customSize = p;
                }
                for (let h = nextIndex != null ? nextIndex : s; h >= index + 1; h--) {
                    const itemNode = a.getItemByListId(h);
                    if (itemNode) {
                        const m = a._calcItemPos(h - 1);
                        const tween = cc.tween(itemNode).to(0.2333, {
                            position: cc.v2(m.x, m.y)
                        });
                        if (h <= index + 1) {
                            c = true;
                            tween.call(function () {
                                a._aniDelRuning = false;
                                callback(index);
                                delete a._aniDelCB;
                            });
                        }
                        tween.start();
                    }
                }
                if (!c) {
                    a._aniDelRuning = false;
                    callback(index);
                    a._aniDelCB = null;
                }
            }, true);
        } else {
            callback(index);
        }
    }

    scrollTo(index: number, time?: number, offset?: number, highlight?: boolean): void {
        if (time === undefined) {
            time = 0.5;
        }
        if (offset === undefined) {
            offset = null;
        }
        if (highlight === undefined) {
            highlight = false;
        }
        const a = this;
        if (a.checkInited(false)) {
            if (time == null) {
                time = 0.5;
            } else if (time < 0) {
                time = 0;
            }
            if (index < 0) {
                index = 0;
            } else if (index >= a._numItems) {
                index = a._numItems - 1;
            }
            if (!a._virtual && a._layout && a._layout.enabled) {
                a._layout.updateLayout();
            }
            let o: number;
            let r: number;
            let s: any = a.getItemPos(index);
            if (!s) {
                return;
            }
            switch (a._alignCalcType) {
                case 1:
                    o = s.left;
                    o -= offset != null ? a.node.width * offset : a._leftGap;
                    s = cc.v2(o, 0);
                    break;

                case 2:
                    o = s.right - a.node.width;
                    o += offset != null ? a.node.width * offset : a._rightGap;
                    s = cc.v2(o + a.content.width, 0);
                    break;

                case 3:
                    r = s.top;
                    r += offset != null ? a.node.height * offset : a._topGap;
                    s = cc.v2(0, -r);
                    break;

                case 4:
                    r = s.bottom + a.node.height;
                    r -= offset != null ? a.node.height * offset : a._bottomGap;
                    s = cc.v2(0, -r + a.content.height);
            }
            let l = a.content.getPosition();
            l = Math.abs(a._sizeType ? l.y : l.x);
            const c = a._sizeType ? s.y : s.x;
            if (Math.abs((a._scrollPos != null ? a._scrollPos : l) - c) > 0.5) {
                a._scrollView.scrollToOffset(s, time);
                a._scrollToListId = index;
                a._scrollToEndTime = new Date().getTime() / 1e3 + time;
                a._scrollToSo = a.scheduleOnce(function () {
                    if (!a._adheringBarrier) {
                        a.adhering = a._adheringBarrier = false;
                    }
                    a._scrollPos = a._scrollToListId = a._scrollToEndTime = a._scrollToSo = null;
                    if (highlight) {
                        const item = a.getItemByListId(index);
                        if (item) {
                            cc.tween(item).to(0.1, {
                                scale: 1.05
                            }).to(0.1, {
                                scale: 1
                            }).start();
                        }
                    }
                }, time + 0.1);
                if (time <= 0) {
                    a._onScrolling();
                }
            }
        }
    }

    _calcNearestItem(): void {
        let e: any;
        let t: number;
        let i: number;
        let n: number;
        let a: number;
        let o: number;
        const r = this;
        r.nearestListId = null;
        if (r._virtual) {
            r._calcViewPos();
        }
        i = r.viewTop;
        n = r.viewRight;
        a = r.viewBottom;
        o = r.viewLeft;
        let s = false;
        for (let l = 0; l < r.content.childrenCount && !s; l += r._colLineNum) {
            e = r._virtual ? r.displayData[l] : r._calcExistItemPos(l);
            if (e) {
                t = r._sizeType ? (e.top + e.bottom) / 2 : (e.left + e.right) / 2;
                switch (r._alignCalcType) {
                    case 1:
                        if (e.right >= o) {
                            r.nearestListId = e.id;
                            if (o > t) {
                                r.nearestListId += r._colLineNum;
                            }
                            s = true;
                        }
                        break;

                    case 2:
                        if (e.left <= n) {
                            r.nearestListId = e.id;
                            if (n < t) {
                                r.nearestListId += r._colLineNum;
                            }
                            s = true;
                        }
                        break;

                    case 3:
                        if (e.bottom <= i) {
                            r.nearestListId = e.id;
                            if (i < t) {
                                r.nearestListId += r._colLineNum;
                            }
                            s = true;
                        }
                        break;

                    case 4:
                        if (e.top >= a) {
                            r.nearestListId = e.id;
                            if (a > t) {
                                r.nearestListId += r._colLineNum;
                            }
                            s = true;
                        }
                }
            }
        }
        e = r._virtual ? r.displayData[r.displayItemNum - 1] : r._calcExistItemPos(r._numItems - 1);
        if (e && e.id == r._numItems - 1) {
            t = r._sizeType ? (e.top + e.bottom) / 2 : (e.left + e.right) / 2;
            switch (r._alignCalcType) {
                case 1:
                    if (n > t) {
                        r.nearestListId = e.id;
                    }
                    break;

                case 2:
                    if (o < t) {
                        r.nearestListId = e.id;
                    }
                    break;

                case 3:
                    if (a < t) {
                        r.nearestListId = e.id;
                    }
                    break;

                case 4:
                    if (i > t) {
                        r.nearestListId = e.id;
                    }
            }
        }
    }

    prePage(time: number = 0.5): void {
        if (this.checkInited()) {
            this.skipPage(this.curPageNum - 1, time);
        }
    }

    nextPage(time: number = 0.5): void {
        if (this.checkInited()) {
            this.skipPage(this.curPageNum + 1, time);
        }
    }

    skipPage(page: number, time?: number): void {
        const i = this;
        if (i.checkInited()) {
            if (i._slideMode != SlideMode.PAGE) {
                cc.error("This function is not allowed to be called, Must SlideMode = PAGE!");
                return;
            }
            if (page < 0 || page >= i._numItems) {
                return;
            }
            if (i.curPageNum != page) {
                i.curPageNum = page;
                if (i.pageChangeEvent) {
                    cc.Component.EventHandler.emitEvents([i.pageChangeEvent], page);
                }
                i.scrollTo(page, time);
            }
        }
    }

    calcCustomSize(count: number): { [key: number]: number } {
        const t = this;
        if (t.checkInited()) {
            if (!t._itemTmp) {
                return cc.error("Unset template item!");
            }
            if (!t.renderEvent) {
                return cc.error("Unset Render-Event!");
            }
            t._customSize = {};
            const i = cc.instantiate(t._itemTmp);
            t.content.addChild(i);
            for (let n = 0; n < count; n++) {
                cc.Component.EventHandler.emitEvents([t.renderEvent], i, n);
                if (i.height != t._itemSize.height || i.width != t._itemSize.width) {
                    t._customSize[n] = t._sizeType ? i.height : i.width;
                }
            }
            if (!Object.keys(t._customSize).length) {
                t._customSize = null;
            }
            i.removeFromParent();
            if (i.destroy) {
                i.destroy();
            }
            return t._customSize;
        }
    }
}
