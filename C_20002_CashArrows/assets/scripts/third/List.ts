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
    _selectedId: number = -1;
    _forceUpdate: boolean = false;
    _updateDone: boolean = true;
    _actualNumItems: number = 0;
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
    _align: number = 0;
    _resizeMode: number = 0;
    _startAxis: number = 0;
    _topGap: number = 0;
    _rightGap: number = 0;
    _bottomGap: number = 0;
    _leftGap: number = 0;
    _columnGap: number = 0;
    _lineGap: number = 0;
    _colLineNum: number = 0;
    _verticalDir: number = 0;
    _horizontalDir: number = 0;
    _alignCalcType: number = 0;
    _itemTmp: cc.Node = null;
    _itemSize: cc.Size = null;
    _sizeType: boolean = false;
    _lastDisplayData: number[] = [];
    displayData: any[] = [];
    _pool: cc.NodePool = null;
    _updateCounter: number = 0;
    _lastSelectedId: number = null;
    multSelected: number[] = null;
    _customSize: any = null;
    frameCount: number = null;
    _allItemSize: number = 0;
    _allItemSizeNoEdge: number = 0;
    _cyclicPos1: number = 0;
    _cyclicPos2: number = 0;
    _cyclicNum: number = 0;
    _cyclicAllItemSize: number = 0;
    _cycilcAllItemSizeNoEdge: number = 0;
    _lack: boolean = false;
    elasticLeft: number = 0;
    elasticRight: number = 0;
    elasticTop: number = 0;
    elasticBottom: number = 0;
    viewLeft: number = 0;
    viewRight: number = 0;
    viewTop: number = 0;
    viewBottom: number = 0;
    firstListId: number = 0;
    displayItemNum: number = 0;
    nearestListId: number = null;
    _beganPos: number = null;
    scrollToListId: number = null;
    curScrollIsTouch: boolean = false;
    _scrollItem: cc.Node = null;
    _scrollPos: number = null;
    _scrollToEndTime: number = null;
    _scrollToSo: any = null;
    _scrollToListId: number = null;
    _aniDelCB: any = null;
    _aniDelItem: cc.Node = null;
    _aniDelBeforePos: any = null;
    _aniDelBeforeScale: any = null;

    @property({ type: cc.Enum(TemplateType) })
    templateType: TemplateType = TemplateType.NODE;

    @property({ type: cc.Node, visible() { return this.templateType == TemplateType.NODE; } })
    tmpNode: cc.Node = null;

    @property({ type: cc.Prefab, visible() { return this.templateType == TemplateType.PREFAB; } })
    tmpPrefab: cc.Prefab = null;

    @property()
    _slideMode: SlideMode = SlideMode.NORMAL;

    @property({ type: cc.Enum(SlideMode) })
    get slideMode() { return this._slideMode; }
    set slideMode(value: SlideMode) { this._slideMode = value; }

    @property({ type: cc.Float, range: [0, 1, 0.1], slide: true, visible() { return this._slideMode == SlideMode.PAGE; } })
    pageDistance: number = 0.3;

    @property({ type: cc.Component.EventHandler, visible() { return this._slideMode == SlideMode.PAGE; } })
    pageChangeEvent: cc.Component.EventHandler = new cc.Component.EventHandler();

    @property()
    _virtual: boolean = true;

    @property({ type: cc.Boolean })
    get virtual() { return this._virtual; }
    set virtual(value: boolean) {
    null != value && (this._virtual = value);
    0 != this._numItems && this._onScrolling();
    }

    @property({ visible() { var e = this.slideMode == SlideMode.NORMAL; e || (this.cyclic = !1); return e; } })
    cyclic: boolean = false;

    @property({ visible() { return this.virtual; } })
    lackCenter: boolean = false;

    @property({ visible() { var e = this.virtual && !this.lackCenter; e || (this.lackSlide = !1); return e; } })
    lackSlide: boolean = false;

    @property({ type: cc.Integer })
    _updateRate: number = 0;

    @property({ type: cc.Integer, range: [0, 6, 1], slide: true })
    get updateRate() { return this._updateRate; }
    set updateRate(value: number) { value >= 0 && value <= 6 && (this._updateRate = value); }

    @property({ type: cc.Integer, range: [0, 12, 1], slide: true })
    frameByFrameRenderNum: number = 0;

    @property({ type: cc.Component.EventHandler })
    renderEvent: cc.Component.EventHandler = new cc.Component.EventHandler();

    @property({ type: cc.Enum(SelectedMode) })
    selectedMode: SelectedMode = SelectedMode.NONE;

    @property({ visible() { return this.selectedMode == SelectedMode.SINGLE; } })
    repeatEventSingle: boolean = false;

    @property({ type: cc.Component.EventHandler, visible() { return this.selectedMode > SelectedMode.NONE; } })
    selectedEvent: cc.Component.EventHandler = new cc.Component.EventHandler();

    @property({ serializable: false })
    _numItems: number = 0;

    get selectedId() {
    return this._selectedId;
    }
    set selectedId(value: number) {
    var t, i = this;
    switch (i.selectedMode) {
        case SelectedMode.SINGLE:
            if (!i.repeatEventSingle && value == i._selectedId) return;
            t = i.getItemByListId(value);
            var n: any = void 0;
            i._selectedId >= 0 ? i._lastSelectedId = i._selectedId : i._lastSelectedId = null;
            i._selectedId = value;
            t && ((n = t.getComponent(ListItem)).selected = !0);
            if (i._lastSelectedId >= 0 && i._lastSelectedId != i._selectedId) {
                var a = i.getItemByListId(i._lastSelectedId);
                a && (a.getComponent(ListItem).selected = !1);
            }
            i.selectedEvent && cc.Component.EventHandler.emitEvents([i.selectedEvent], t, value % this._actualNumItems, null == i._lastSelectedId ? null : i._lastSelectedId % this._actualNumItems);
            break;

        case SelectedMode.MULT:
            if (!(t = i.getItemByListId(value))) return;
            n = t.getComponent(ListItem);
            i._selectedId >= 0 && (i._lastSelectedId = i._selectedId);
            i._selectedId = value;
            var r = !n.selected;
            n.selected = r;
            var s = i.multSelected.indexOf(value);
            r && s < 0 ? i.multSelected.push(value) : !r && s >= 0 && i.multSelected.splice(s, 1);
            i.selectedEvent && cc.Component.EventHandler.emitEvents([i.selectedEvent], t, value % this._actualNumItems, null == i._lastSelectedId ? null : i._lastSelectedId % this._actualNumItems, r);
    }
    }

    get numItems() { return this._actualNumItems; }
    set numItems(value: number) {
    var t = this;
    if (t.checkInited(!1)) if (null == value || value < 0) cc.error(" numItems set the wrong:: ", value); else {
        t._actualNumItems = t._numItems = value;
        t._forceUpdate = !0;
        if (t._virtual) {
            t._resizeContent();
            t.cyclic && (t._numItems = t._cyclicNum * t._numItems);
            t._onScrolling();
            t.frameByFrameRenderNum || t.slideMode != SlideMode.PAGE || (t.curPageNum = t.nearestListId);
        } else {
            if (t.cyclic) {
                t._resizeContent();
                t._numItems = t._cyclicNum * t._numItems;
            }
            var i = t.content.getComponent(cc.Layout);
            i && (i.enabled = !0);
            t._delRedundantItem();
            t.firstListId = 0;
            if (t.frameByFrameRenderNum > 0) {
                for (var n = t.frameByFrameRenderNum > t._numItems ? t._numItems : t.frameByFrameRenderNum, o = 0; o < n; o++) t._createOrUpdateItem2(o);
                if (t.frameByFrameRenderNum < t._numItems) {
                    t._updateCounter = t.frameByFrameRenderNum;
                    t._updateDone = !1;
                }
            } else {
                for (o = 0; o < t._numItems; o++) t._createOrUpdateItem2(o);
                t.displayItemNum = t._numItems;
            }
        }
    }
    }

    get scrollView() { return this._scrollView; }

    onLoad() {
    this._init();
    }
    onDestroy() {
    var e = this;
    cc.isValid(e._itemTmp) && e._itemTmp.destroy();
    cc.isValid(e.tmpNode) && e.tmpNode.destroy();
    e._pool && e._pool.clear();
    }
    onEnable() {
    this._registerEvent();
    this._init();
    if (this._aniDelRuning) {
    this._aniDelRuning = !1;
    this._aniDelItem && (this._aniDelBeforePos && (this._aniDelItem.position = this._aniDelBeforePos,
    delete this._aniDelBeforePos), this._aniDelBeforeScale && (this._aniDelItem.scale = this._aniDelBeforeScale,
    delete this._aniDelBeforeScale), delete this._aniDelItem);
    this._aniDelCB && (this._aniDelCB(), delete this._aniDelCB);
    }
    }
    onDisable() {
    this._unregisterEvent();
    }
    _registerEvent() {
    var e = this;
    e.node.on(cc.Node.EventType.TOUCH_START, e._onTouchStart, e, !0);
    e.node.on(" touch- up ", e._onTouchUp, e);
    e.node.on(cc.Node.EventType.TOUCH_CANCEL, e._onTouchCancelled, e, !0);
    e.node.on(" scroll- began ", e._onScrollBegan, e, !0);
    e.node.on(" scroll- ended ", e._onScrollEnded, e, !0);
    e.node.on(" scrolling ", e._onScrolling, e, !0);
    e.node.on(cc.Node.EventType.SIZE_CHANGED, e._onSizeChanged, e);
    }
    _unregisterEvent() {
    var e = this;
    e.node.off(cc.Node.EventType.TOUCH_START, e._onTouchStart, e, !0);
    e.node.off(" touch- up ", e._onTouchUp, e);
    e.node.off(cc.Node.EventType.TOUCH_CANCEL, e._onTouchCancelled, e, !0);
    e.node.off(" scroll- began ", e._onScrollBegan, e, !0);
    e.node.off(" scroll- ended ", e._onScrollEnded, e, !0);
    e.node.off(" scrolling ", e._onScrolling, e, !0);
    e.node.off(cc.Node.EventType.SIZE_CHANGED, e._onSizeChanged, e);
    }
    _init() {
    var e = this;
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
    e.setTemplateItem(cc.instantiate(e.templateType == TemplateType.PREFAB ? e.tmpPrefab : e.tmpNode));
    if (e._slideMode == SlideMode.ADHERING || e._slideMode == SlideMode.PAGE) {
    e._scrollView.inertia = !1;
    e._scrollView._onMouseWheel = function() {};
    }
    e.virtual || (e.lackCenter = !1);
    e._lastDisplayData = [];
    e.displayData = [];
    e._pool = new cc.NodePool();
    e._forceUpdate = !1;
    e._updateCounter = 0;
    e._updateDone = !0;
    e.curPageNum = 0;
    if (e.cyclic) {
    e._scrollView._processAutoScrolling = this._processAutoScrolling.bind(e);
    e._scrollView._startBounceBackIfNeeded = function() {
    return !1;
    }
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
    e._inited = !0;
    } else cc.error(e.node.name + " 's cc.ScrollView unset content!");
    }
    }
    _processAutoScrolling(e) {
    this._scrollView._autoScrollAccumulatedTime += 1 * e;
    var t = Math.min(1, this._scrollView._autoScrollAccumulatedTime / this._scrollView._autoScrollTotalTime);
    if (this._scrollView._autoScrollAttenuate) {
    var i = t - 1;
    t = i * i * i * i * i + 1;
    }
    var n = this._scrollView._autoScrollStartPosition.add(this._scrollView._autoScrollTargetDelta.mul(t)), a = this._scrollView.getScrollEndedEventTiming(), o = Math.abs(t - 1) <= a;
    if (Math.abs(t - 1) <= this._scrollView.getScrollEndedEventTiming() && !this._scrollView._isScrollEndedWithThresholdEventFired) {
    this._scrollView._dispatchEvent("scroll-ended-with-threshold");
    this._scrollView._isScrollEndedWithThresholdEventFired = !0;
    }
    o && (this._scrollView._autoScrolling = !1);
    var r = n.sub(this._scrollView.getContentPosition());
    this._scrollView._moveContent(this._scrollView._clampDelta(r), o);
    this._scrollView._dispatchEvent("scrolling");
    if (!this._scrollView._autoScrolling) {
    this._scrollView._isBouncing = !1;
    this._scrollView._scrolling = !1;
    this._scrollView._dispatchEvent("scroll-ended");
    }
    }
    setTemplateItem(e) {
    if (e) {
    var t = this;
    t._itemTmp = e;
    t._resizeMode == cc.Layout.ResizeMode.CHILDREN ? t._itemSize = t._layout.cellSize : t._itemSize = cc.size(e.width, e.height);
    var i = e.getComponent(ListItem), n = !1;
    i || (n = !0);
    n && (t.selectedMode = SelectedMode.NONE);
    (i = e.getComponent(cc.Widget)) && i.enabled && (t._needUpdateWidget = !0);
    t.selectedMode == SelectedMode.MULT && (t.multSelected = []);
    switch (t._align) {
    case cc.Layout.Type.HORIZONTAL:
    t._colLineNum = 1;
    t._sizeType = !1;
    break;

    case cc.Layout.Type.VERTICAL:
    t._colLineNum = 1;
    t._sizeType = !0;
    break;

    case cc.Layout.Type.GRID:
    switch (t._startAxis) {
    case cc.Layout.AxisDirection.HORIZONTAL:
    var a = t.content.width - t._leftGap - t._rightGap;
    t._colLineNum = Math.floor((a + t._columnGap) / (t._itemSize.width + t._columnGap));
    t._sizeType = !0;
    break;

    case cc.Layout.AxisDirection.VERTICAL:
    var r = t.content.height - t._topGap - t._bottomGap;
    t._colLineNum = Math.floor((r + t._lineGap) / (t._itemSize.height + t._lineGap));
    t._sizeType = !1;
    }
    }
    }
    }
    checkInited(e) {
    void 0 === e && (e = !0);
    return !!this._inited || (e && cc.error("List initialization not completed!"), !1);
    }
    _resizeContent() {
    var e, t = this;
    switch (t._align) {
    case cc.Layout.Type.HORIZONTAL:
    if (t._customSize) {
    var i = t._getFixedSize(null);
    e = t._leftGap + i.val + t._itemSize.width * (t._numItems - i.count) + t._columnGap * (t._numItems - 1) + t._rightGap;
    } else e = t._leftGap + t._itemSize.width * t._numItems + t._columnGap * (t._numItems - 1) + t._rightGap;
    break;

    case cc.Layout.Type.VERTICAL:
    if (t._customSize) {
    i = t._getFixedSize(null);
    e = t._topGap + i.val + t._itemSize.height * (t._numItems - i.count) + t._lineGap * (t._numItems - 1) + t._bottomGap;
    } else e = t._topGap + t._itemSize.height * t._numItems + t._lineGap * (t._numItems - 1) + t._bottomGap;
    break;

    case cc.Layout.Type.GRID:
    t.lackCenter && (t.lackCenter = !1);
    switch (t._startAxis) {
    case cc.Layout.AxisDirection.HORIZONTAL:
    var n = Math.ceil(t._numItems / t._colLineNum);
    e = t._topGap + t._itemSize.height * n + t._lineGap * (n - 1) + t._bottomGap;
    break;

    case cc.Layout.AxisDirection.VERTICAL:
    var a = Math.ceil(t._numItems / t._colLineNum);
    e = t._leftGap + t._itemSize.width * a + t._columnGap * (a - 1) + t._rightGap;
    }
    }
    var o = t.content.getComponent(cc.Layout);
    o && (o.enabled = !1);
    t._allItemSize = e;
    t._allItemSizeNoEdge = t._allItemSize - (t._sizeType ? t._topGap + t._bottomGap : t._leftGap + t._rightGap);
    if (t.cyclic) {
    var r = t._sizeType ? t.node.height : t.node.width;
    t._cyclicPos1 = 0;
    r -= t._cyclicPos1;
    t._cyclicNum = Math.ceil(r / t._allItemSizeNoEdge) + 1;
    var s = t._sizeType ? t._lineGap : t._columnGap;
    t._cyclicPos2 = t._cyclicPos1 + t._allItemSizeNoEdge + s;
    t._cyclicAllItemSize = t._allItemSize + t._allItemSizeNoEdge * (t._cyclicNum - 1) + s * (t._cyclicNum - 1);
    t._cycilcAllItemSizeNoEdge = t._allItemSizeNoEdge * t._cyclicNum;
    t._cycilcAllItemSizeNoEdge += s * (t._cyclicNum - 1);
    }
    t._lack = !t.cyclic && t._allItemSize < (t._sizeType ? t.node.height : t.node.width);
    var l = t._lack && t.lackCenter || !t.lackSlide ? .1 : 0, c = t._lack ? (t._sizeType ? t.node.height : t.node.width) - l : t.cyclic ? t._cyclicAllItemSize : t._allItemSize;
    c < 0 && (c = 0);
    t._sizeType ? t.content.height = c : t.content.width = c;
    }
    _onScrolling(e) {
    void 0 === e && (e = null);
    null == this.frameCount && (this.frameCount = this._updateRate);
    if (!this._forceUpdate && e && "scroll-ended" != e.type && this.frameCount > 0) this.frameCount--; else {
    this.frameCount = this._updateRate;
    if (!this._aniDelRuning) {
    if (this.cyclic) {
    var t = this.content.getPosition();
    t = this._sizeType ? t.y : t.x;
    var i = this._allItemSizeNoEdge + (this._sizeType ? this._lineGap : this._columnGap), n = this._sizeType ? cc.v2(0, i) : cc.v2(i, 0);
    switch (this._alignCalcType) {
    case 1:
    if (t > -this._cyclicPos1) {
    this.content.x = -this._cyclicPos2;
    this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(n));
    } else t < -this._cyclicPos2 && (this.content.x = -this._cyclicPos1, this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(n)));
    break;

    case 2:
    if (t < this._cyclicPos1) {
    this.content.x = this._cyclicPos2;
    this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(n));
    } else t > this._cyclicPos2 && (this.content.x = this._cyclicPos1, this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(n)));
    break;

    case 3:
    if (t < this._cyclicPos1) {
    this.content.y = this._cyclicPos2;
    this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(n));
    } else t > this._cyclicPos2 && (this.content.y = this._cyclicPos1, this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(n)));
    break;

    case 4:
    if (t > -this._cyclicPos1) {
    this.content.y = -this._cyclicPos2;
    this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(n));
    } else t < -this._cyclicPos2 && (this.content.y = -this._cyclicPos1, this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(n)));
    }
    }
    var a, o, r, s;
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
    var l = void 0, c = 0, u = this._numItems - 1;
    if (this._customSize) for (var d = !1; c <= u && !d; c++) {
    l = this._calcItemPos(c);
    switch (this._align) {
    case cc.Layout.Type.HORIZONTAL:
    l.right >= s && l.left <= o ? this.displayData.push(l) : 0 != c && this.displayData.length > 0 && (d = !0);
    break;

    case cc.Layout.Type.VERTICAL:
    l.bottom <= a && l.top >= r ? this.displayData.push(l) : 0 != c && this.displayData.length > 0 && (d = !0);
    break;

    case cc.Layout.Type.GRID:
    switch (this._startAxis) {
    case cc.Layout.AxisDirection.HORIZONTAL:
    l.bottom <= a && l.top >= r ? this.displayData.push(l) : 0 != c && this.displayData.length > 0 && (d = !0);
    break;

    case cc.Layout.AxisDirection.VERTICAL:
    l.right >= s && l.left <= o ? this.displayData.push(l) : 0 != c && this.displayData.length > 0 && (d = !0);
    }
    }
    } else {
    var h = this._itemSize.width + this._columnGap, p = this._itemSize.height + this._lineGap;
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
    c < 0 && (c = 0);
    for (--u >= this._numItems && (u = this._numItems - 1); c <= u; c++) this.displayData.push(this._calcItemPos(c));
    }
    this._delRedundantItem();
    if (this.displayData.length <= 0 || !this._numItems) return void (this._lastDisplayData = []);
    this.firstListId = this.displayData[0].id;
    this.displayItemNum = this.displayData.length;
    var _ = this._lastDisplayData.length, f = this.displayItemNum != _;
    if (f) {
    this.frameByFrameRenderNum > 0 && this._lastDisplayData.sort(function(e, t) {
    return e - t;
    });
    f = this.firstListId != this._lastDisplayData[0] || this.displayData[this.displayItemNum - 1].id != this._lastDisplayData[_ - 1];
    }
    if (this._forceUpdate || f) if (this.frameByFrameRenderNum > 0) if (this._numItems > 0) {
    this._updateDone ? this._updateCounter = 0 : this._doneAfterUpdate = !0;
    this._updateDone = !1;
    } else {
    this._updateCounter = 0;
    this._updateDone = !0;
    } else {
    this._lastDisplayData = [];
    for (var g = 0; g < this.displayItemNum; g++) this._createOrUpdateItem(this.displayData[g]);
    this._forceUpdate = !1;
    }
    this._calcNearestItem();
    }
    }
    }
    }
    _calcViewPos() {
    var e = this.content.getPosition();
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
    _calcItemPos(e) {
    var t, i, n, a, o, r, s, l;
    switch (this._align) {
    case cc.Layout.Type.HORIZONTAL:
    switch (this._horizontalDir) {
    case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
    if (this._customSize) {
    var c = this._getFixedSize(e);
    o = this._leftGap + (this._itemSize.width + this._columnGap) * (e - c.count) + (c.val + this._columnGap * c.count);
    t = (u = this._customSize[e]) > 0 ? u : this._itemSize.width;
    } else {
    o = this._leftGap + (this._itemSize.width + this._columnGap) * e;
    t = this._itemSize.width;
    }
    if (this.lackCenter) {
    o -= this._leftGap;
    o += this.content.width / 2 - this._allItemSizeNoEdge / 2;
    }
    return {
    id: e,
    left: o,
    right: r = o + t,
    x: o + this._itemTmp.anchorX * t,
    y: this._itemTmp.y
    }

    case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
    if (this._customSize) {
    c = this._getFixedSize(e);
    r = -this._rightGap - (this._itemSize.width + this._columnGap) * (e - c.count) - (c.val + this._columnGap * c.count);
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
    left: o = r - t,
    x: o + this._itemTmp.anchorX * t,
    y: this._itemTmp.y
    }
    }
    break;

    case cc.Layout.Type.VERTICAL:
    switch (this._verticalDir) {
    case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
    if (this._customSize) {
    c = this._getFixedSize(e);
    n = -this._topGap - (this._itemSize.height + this._lineGap) * (e - c.count) - (c.val + this._lineGap * c.count);
    i = (u = this._customSize[e]) > 0 ? u : this._itemSize.height;
    } else {
    n = -this._topGap - (this._itemSize.height + this._lineGap) * e;
    i = this._itemSize.height;
    }
    if (this.lackCenter) {
    n += this._topGap;
    n -= this.content.height / 2 - this._allItemSizeNoEdge / 2;
    }
    return {
    id: e,
    top: n,
    bottom: a = n - i,
    x: this._itemTmp.x,
    y: a + this._itemTmp.anchorY * i
    }

    case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
    var u;
    if (this._customSize) {
    c = this._getFixedSize(e);
    a = this._bottomGap + (this._itemSize.height + this._lineGap) * (e - c.count) + (c.val + this._lineGap * c.count);
    i = (u = this._customSize[e]) > 0 ? u : this._itemSize.height;
    } else {
    a = this._bottomGap + (this._itemSize.height + this._lineGap) * e;
    i = this._itemSize.height;
    }
    if (this.lackCenter) {
    a -= this._bottomGap;
    a += this.content.height / 2 - this._allItemSizeNoEdge / 2;
    }
    return {
    id: e,
    top: n = a + i,
    bottom: a,
    x: this._itemTmp.x,
    y: a + this._itemTmp.anchorY * i
    }
    }

    case cc.Layout.Type.GRID:
    var d = Math.floor(e / this._colLineNum);
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
    s = this._leftGap + e % this._colLineNum * (this._itemSize.width + this._columnGap);
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
    id: e,
    top: n,
    bottom: a,
    x: s,
    y: l
    }

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
    l = -this._topGap - e % this._colLineNum * (this._itemSize.height + this._lineGap);
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
    id: e,
    left: o,
    right: r,
    x: s,
    y: l
    }
    }
    }
    }
    _calcExistItemPos(e) {
    var t = this.getItemByListId(e);
    if (!t) return null;
    var i = {
    id: e,
    x: t.x,
    y: t.y
    }
    if (this._sizeType) {
    i.top = t.y + t.height * (1 - t.anchorY);
    i.bottom = t.y - t.height * t.anchorY;
    } else {
    i.left = t.x - t.width * t.anchorX;
    i.right = t.x + t.width * (1 - t.anchorX);
    }
    return i;
    }
    getItemPos(e) {
    return this._virtual ? this._calcItemPos(e) : this.frameByFrameRenderNum ? this._calcItemPos(e) : this._calcExistItemPos(e);
    }
    _getFixedSize(e) {
    if (!this._customSize) return null;
    null == e && (e = this._numItems);
    var t = 0, i = 0;
    for (var n in this._customSize) if (parseInt(n) < e) {
    t += this._customSize[n];
    i++;
    }
    return {
    val: t,
    count: i
    }
    }
    _onScrollBegan() {
    this._beganPos = this._sizeType ? this.viewTop : this.viewLeft;
    }
    _onScrollEnded() {
    var e = this;
    e.curScrollIsTouch = !1;
    if (null != e.scrollToListId) {
    var t = e.getItemByListId(e.scrollToListId);
    e.scrollToListId = null;
    t && cc.tween(t).to(.1, {
    scale: 1.06
    }).to(.1, {
    scale: 1
    }).start();
    }
    e._onScrolling();
    e._slideMode != SlideMode.ADHERING || e.adhering ? e._slideMode == SlideMode.PAGE && (null != e._beganPos && e.curScrollIsTouch ? this._pageAdhere() : e.adhere()) : e.adhere();
    }
    _onTouchStart(e, t) {
    if (!this._scrollView.hasNestedViewGroup(e, t) && (this.curScrollIsTouch = !0, e.eventPhase !== cc.Event.AT_TARGET || e.target !== this.node)) {
    for (var i = e.target; null == i._listId && i.parent; ) i = i.parent;
    this._scrollItem = null != i._listId ? i : e.target;
    }
    }
    _onTouchUp() {
    var e = this;
    e._scrollPos = null;
    if (e._slideMode == SlideMode.ADHERING) {
    this.adhering && (this._adheringBarrier = !0);
    e.adhere();
    } else e._slideMode == SlideMode.PAGE && (null != e._beganPos ? this._pageAdhere() : e.adhere());
    this._scrollItem = null;
    }
    _onTouchCancelled(e, t) {
    var i = this;
    if (!i._scrollView.hasNestedViewGroup(e, t) && !e.simulate) {
    i._scrollPos = null;
    i._slideMode == SlideMode.ADHERING ? (i.adhering && (i._adheringBarrier = !0), i.adhere()) : i._slideMode == SlideMode.PAGE && (null != i._beganPos ? i._pageAdhere() : i.adhere());
    this._scrollItem = null;
    }
    }
    _onSizeChanged() {
    this.checkInited(!1) && this._onScrolling();
    }
    _onItemAdaptive(e) {
    if (!this._sizeType && e.width != this._itemSize.width || this._sizeType && e.height != this._itemSize.height) {
    this._customSize || (this._customSize = {});
    var t = this._sizeType ? e.height : e.width;
    if (this._customSize[e._listId] != t) {
    this._customSize[e._listId] = t;
    this._resizeContent();
    this.updateAll();
    null != this._scrollToListId && (this._scrollPos = null, this.unschedule(this._scrollToSo),
    this.scrollTo(this._scrollToListId, Math.max(0, this._scrollToEndTime - new Date().getTime() / 1e3)));
    }
    }
    }
    _pageAdhere() {
    var e = this;
    if (e.cyclic || !(e.elasticTop > 0 || e.elasticRight > 0 || e.elasticBottom > 0 || e.elasticLeft > 0)) {
    var t = e._sizeType ? e.viewTop : e.viewLeft, i = (e._sizeType ? e.node.height : e.node.width) * e.pageDistance;
    if (Math.abs(e._beganPos - t) > i) switch (e._alignCalcType) {
    case 1:
    case 4:
    e._beganPos > t ? e.prePage(.5) : e.nextPage(.5);
    break;

    case 2:
    case 3:
    e._beganPos < t ? e.prePage(.5) : e.nextPage(.5);
    } else e.elasticTop <= 0 && e.elasticRight <= 0 && e.elasticBottom <= 0 && e.elasticLeft <= 0 && e.adhere();
    e._beganPos = null;
    }
    }
    adhere() {
    var e = this;
    if (e.checkInited() && !(e.elasticTop > 0 || e.elasticRight > 0 || e.elasticBottom > 0 || e.elasticLeft > 0)) {
    e.adhering = !0;
    e._calcNearestItem();
    var t = (e._sizeType ? e._topGap : e._leftGap) / (e._sizeType ? e.node.height : e.node.width);
    e.scrollTo(e.nearestListId, .7, t);
    }
    }
    update() {
    if (!(this.frameByFrameRenderNum <= 0 || this._updateDone)) if (this._virtual) {
    for (var e = this._updateCounter + this.frameByFrameRenderNum > this.displayItemNum ? this.displayItemNum : this._updateCounter + this.frameByFrameRenderNum, t = this._updateCounter; t < e; t++) {
    var i = this.displayData[t];
    i && this._createOrUpdateItem(i);
    }
    if (this._updateCounter >= this.displayItemNum - 1) if (this._doneAfterUpdate) {
    this._updateCounter = 0;
    this._updateDone = !1;
    this._doneAfterUpdate = !1;
    } else {
    this._updateDone = !0;
    this._delRedundantItem();
    this._forceUpdate = !1;
    this._calcNearestItem();
    this.slideMode == SlideMode.PAGE && (this.curPageNum = this.nearestListId);
    } else this._updateCounter += this.frameByFrameRenderNum;
    } else if (this._updateCounter < this._numItems) {
    e = this._updateCounter + this.frameByFrameRenderNum > this._numItems ? this._numItems : this._updateCounter + this.frameByFrameRenderNum;
    for (t = this._updateCounter; t < e; t++) this._createOrUpdateItem2(t);
    this._updateCounter += this.frameByFrameRenderNum;
    } else {
    this._updateDone = !0;
    this._calcNearestItem();
    this.slideMode == SlideMode.PAGE && (this.curPageNum = this.nearestListId);
    }
    }
    _createOrUpdateItem(e) {
    var t = this.getItemByListId(e.id);
    if (t) {
    if (this._forceUpdate && this.renderEvent) {
    t.setPosition(cc.v2(e.x, e.y));
    this._resetItemSize(t);
    this.renderEvent && cc.Component.EventHandler.emitEvents([ this.renderEvent ], t, e.id % this._actualNumItems);
    }
    } else {
    var i = this._pool.size() > 0;
    t = i ? this._pool.get() : cc.instantiate(this._itemTmp);
    if (!i || !cc.isValid(t)) {
    t = cc.instantiate(this._itemTmp);
    i = !1;
    }
    if (t._listId != e.id) {
    t._listId = e.id;
    t.setContentSize(this._itemSize);
    }
    t.setPosition(cc.v2(e.x, e.y));
    this._resetItemSize(t);
    this.content.addChild(t);
    if (i && this._needUpdateWidget) {
    var n = t.getComponent(cc.Widget);
    n && n.updateAlignment();
    }
    t.setSiblingIndex(this.content.childrenCount - 1);
    var a = t.getComponent(ListItem);
    t.listItem = a;
    if (a) {
    a.listId = e.id;
    a.list = this;
    a._registerEvent();
    }
    this.renderEvent && cc.Component.EventHandler.emitEvents([ this.renderEvent ], t, e.id % this._actualNumItems);
    }
    this._resetItemSize(t);
    this._updateListItem(t.listItem);
    this._lastDisplayData.indexOf(e.id) < 0 && this._lastDisplayData.push(e.id);
    }
    _createOrUpdateItem2(e) {
    var t, i = this.content.children[e];
    if (i) this._forceUpdate && this.renderEvent && (i._listId = e, t && (t.listId = e),
    this.renderEvent && cc.Component.EventHandler.emitEvents([ this.renderEvent ], i, e % this._actualNumItems)); else {
    (i = cc.instantiate(this._itemTmp))._listId = e;
    this.content.addChild(i);
    t = i.getComponent(ListItem);
    i.listItem = t;
    t && (t.listId = e, t.list = this, t._registerEvent());
    this.renderEvent && cc.Component.EventHandler.emitEvents([ this.renderEvent ], i, e % this._actualNumItems);
    }
    this._updateListItem(t);
    this._lastDisplayData.indexOf(e) < 0 && this._lastDisplayData.push(e);
    }
    _updateListItem(e) {
    if (e && this.selectedMode > SelectedMode.NONE) {
    var t = e.node;
    switch (this.selectedMode) {
    case SelectedMode.SINGLE:
    e.selected = this.selectedId == t._listId;
    break;

    case SelectedMode.MULT:
    e.selected = this.multSelected.indexOf(t._listId) >= 0;
    }
    }
    }
    _resetItemSize() {};
    _updateItemPos(e) {
    var t = isNaN(e) ? e : this.getItemByListId(e), i = this.getItemPos(t._listId);
    t.setPosition(i.x, i.y);
    }
    setMultSelected(e, t) {
    var i = this;
    if (i.checkInited()) {
    Array.isArray(e) || (e = [ e ]);
    if (null == t) i.multSelected = e; else {
    var n = void 0, a = void 0;
    if (t) for (var o = e.length - 1; o >= 0; o--) {
    n = e[o];
    (a = i.multSelected.indexOf(n)) < 0 && i.multSelected.push(n);
    } else for (o = e.length - 1; o >= 0; o--) {
    n = e[o];
    (a = i.multSelected.indexOf(n)) >= 0 && i.multSelected.splice(a, 1);
    }
    }
    i._forceUpdate = !0;
    i._onScrolling();
    }
    }
    getMultSelected() {
    return this.multSelected;
    }
    hasMultSelected(e) {
    return this.multSelected && this.multSelected.indexOf(e) >= 0;
    }
    updateItem(e) {
    if (this.checkInited()) {
    Array.isArray(e) || (e = [ e ]);
    for (var t = 0, i = e.length; t < i; t++) {
    var n = e[t], a = this.getItemByListId(n);
    a && cc.Component.EventHandler.emitEvents([ this.renderEvent ], a, n % this._actualNumItems);
    }
    }
    }
    updateAll() {
    this.checkInited() && (this.numItems = this.numItems);
    }
    getItemByListId(e) {
    if (this.content) for (var t = this.content.childrenCount - 1; t >= 0; t--) {
    var i = this.content.children[t];
    if (i._listId == e) return i;
    }
    }
    _getOutsideItem() {
    for (var e, t = [], i = this.content.childrenCount - 1; i >= 0; i--) {
    e = this.content.children[i];
    this.displayData.find(function(t) {
    return t.id == e._listId;
    }) || t.push(e);
    }
    return t;
    }
    _delRedundantItem() {
    if (this._virtual) for (var e = this._getOutsideItem(), t = e.length - 1; t >= 0; t--) {
    var i = e[t];
    if (!this._scrollItem || i._listId != this._scrollItem._listId) {
    i.isCached = !0;
    this._pool.put(i);
    for (var n = this._lastDisplayData.length - 1; n >= 0; n--) if (this._lastDisplayData[n] == i._listId) {
    this._lastDisplayData.splice(n, 1);
    break;
    }
    }
    } else for (;this.content.childrenCount > this._numItems; ) this._delSingleItem(this.content.children[this.content.childrenCount - 1]);
    }
    _delSingleItem(e) {
    e.removeFromParent();
    e.destroy && e.destroy();
    e = null;
    }
    aniDelItem(e, t, i) {
    var n, a = this;
    if (!a.checkInited() || a.cyclic || !a._virtual) return cc.error("This function is not allowed to be called!");
    if (!t) return cc.error("CallFunc are not allowed to be NULL, You need to delete the corresponding index in the data array in the CallFunc!");
    if (a._aniDelRuning) return cc.warn("Please wait for the current deletion to finish!");
    var r = a.getItemByListId(e);
    if (r) {
    n = r.getComponent(ListItem);
    a._aniDelRuning = !0;
    a._aniDelCB = t;
    a._aniDelItem = r;
    a._aniDelBeforePos = r.position;
    a._aniDelBeforeScale = r.scale;
    var s = a.displayData[a.displayData.length - 1].id, l = n.selected;
    n.showAni(i, function() {
    var i, n, c;
    s < a._numItems - 2 && (i = s + 1);
    if (null != i) {
    var u = a._calcItemPos(i);
    a.displayData.push(u);
    a._virtual ? a._createOrUpdateItem(u) : a._createOrUpdateItem2(i);
    } else a._numItems--;
    if (a.selectedMode == SelectedMode.SINGLE) l ? a._selectedId = -1 : a._selectedId - 1 >= 0 && a._selectedId--; else if (a.selectedMode == SelectedMode.MULT && a.multSelected.length) {
    var d = a.multSelected.indexOf(e);
    d >= 0 && a.multSelected.splice(d, 1);
    for (var h = a.multSelected.length - 1; h >= 0; h--) (f = a.multSelected[h]) >= e && a.multSelected[h]--;
    }
    if (a._customSize) {
    a._customSize[e] && delete a._customSize[e];
    var p = {}, _ = void 0;
    for (var f in a._customSize) {
    _ = a._customSize[f];
    var g = parseInt(f);
    p[g - (g >= e ? 1 : 0)] = _;
    }
    a._customSize = p;
    }
    for (h = null != i ? i : s; h >= e + 1; h--) if (r = a.getItemByListId(h)) {
    var m = a._calcItemPos(h - 1);
    n = cc.tween(r).to(.2333, {
    position: cc.v2(m.x, m.y)
    });
    if (h <= e + 1) {
    c = !0;
    n.call(function() {
    a._aniDelRuning = !1;
    t(e);
    delete a._aniDelCB;
    });
    }
    n.start();
    }
    if (!c) {
    a._aniDelRuning = !1;
    t(e);
    a._aniDelCB = null;
    }
    }, !0);
    } else t(e);
    }
    scrollTo(e, t, i, n) {
    void 0 === t && (t = .5);
    void 0 === i && (i = null);
    void 0 === n && (n = !1);
    var a = this;
    if (a.checkInited(!1)) {
    null == t ? t = .5 : t < 0 && (t = 0);
    e < 0 ? e = 0 : e >= a._numItems && (e = a._numItems - 1);
    !a._virtual && a._layout && a._layout.enabled && a._layout.updateLayout();
    var o, r, s = a.getItemPos(e);
    if (!s) return !1;
    switch (a._alignCalcType) {
    case 1:
    o = s.left;
    o -= null != i ? a.node.width * i : a._leftGap;
    s = cc.v2(o, 0);
    break;

    case 2:
    o = s.right - a.node.width;
    o += null != i ? a.node.width * i : a._rightGap;
    s = cc.v2(o + a.content.width, 0);
    break;

    case 3:
    r = s.top;
    r += null != i ? a.node.height * i : a._topGap;
    s = cc.v2(0, -r);
    break;

    case 4:
    r = s.bottom + a.node.height;
    r -= null != i ? a.node.height * i : a._bottomGap;
    s = cc.v2(0, -r + a.content.height);
    }
    var l = a.content.getPosition();
    l = Math.abs(a._sizeType ? l.y : l.x);
    var c = a._sizeType ? s.y : s.x;
    if (Math.abs((null != a._scrollPos ? a._scrollPos : l) - c) > .5) {
    a._scrollView.scrollToOffset(s, t);
    a._scrollToListId = e;
    a._scrollToEndTime = new Date().getTime() / 1e3 + t;
    a._scrollToSo = a.scheduleOnce(function() {
    a._adheringBarrier || (a.adhering = a._adheringBarrier = !1);
    a._scrollPos = a._scrollToListId = a._scrollToEndTime = a._scrollToSo = null;
    if (n) {
    var t = a.getItemByListId(e);
    t && cc.tween(t).to(.1, {
    scale: 1.05
    }).to(.1, {
    scale: 1
    }).start();
    }
    }, t + .1);
    t <= 0 && a._onScrolling();
    }
    }
    }
    _calcNearestItem() {
    var e, t, i, n, a, o, r = this;
    r.nearestListId = null;
    r._virtual && r._calcViewPos();
    i = r.viewTop;
    n = r.viewRight;
    a = r.viewBottom;
    o = r.viewLeft;
    for (var s = !1, l = 0; l < r.content.childrenCount && !s; l += r._colLineNum) if (e = r._virtual ? r.displayData[l] : r._calcExistItemPos(l)) {
    t = r._sizeType ? (e.top + e.bottom) / 2 : t = (e.left + e.right) / 2;
    switch (r._alignCalcType) {
    case 1:
    if (e.right >= o) {
    r.nearestListId = e.id;
    o > t && (r.nearestListId += r._colLineNum);
    s = !0;
    }
    break;

    case 2:
    if (e.left <= n) {
    r.nearestListId = e.id;
    n < t && (r.nearestListId += r._colLineNum);
    s = !0;
    }
    break;

    case 3:
    if (e.bottom <= i) {
    r.nearestListId = e.id;
    i < t && (r.nearestListId += r._colLineNum);
    s = !0;
    }
    break;

    case 4:
    if (e.top >= a) {
    r.nearestListId = e.id;
    a > t && (r.nearestListId += r._colLineNum);
    s = !0;
    }
    }
    }
    if ((e = r._virtual ? r.displayData[r.displayItemNum - 1] : r._calcExistItemPos(r._numItems - 1)) && e.id == r._numItems - 1) {
    t = r._sizeType ? (e.top + e.bottom) / 2 : t = (e.left + e.right) / 2;
    switch (r._alignCalcType) {
    case 1:
    n > t && (r.nearestListId = e.id);
    break;

    case 2:
    o < t && (r.nearestListId = e.id);
    break;

    case 3:
    a < t && (r.nearestListId = e.id);
    break;

    case 4:
    i > t && (r.nearestListId = e.id);
    }
    }
    }
    prePage(e) {
    void 0 === e && (e = .5);
    this.checkInited() && this.skipPage(this.curPageNum - 1, e);
    }
    nextPage(e) {
    void 0 === e && (e = .5);
    this.checkInited() && this.skipPage(this.curPageNum + 1, e);
    }
    skipPage(e, t) {
    var i = this;
    if (i.checkInited()) return i._slideMode != SlideMode.PAGE ? cc.error("This function is not allowed to be called, Must SlideMode = PAGE!") : void (e < 0 || e >= i._numItems || i.curPageNum != e && (i.curPageNum = e,
    i.pageChangeEvent && cc.Component.EventHandler.emitEvents([ i.pageChangeEvent ], e),
    i.scrollTo(e, t)));
    }
    calcCustomSize(e) {
    var t = this;
    if (t.checkInited()) {
    if (!t._itemTmp) return cc.error("Unset template item!");
    if (!t.renderEvent) return cc.error("Unset Render-Event!");
    t._customSize = {};
    var i = cc.instantiate(t._itemTmp);
    t.content.addChild(i);
    for (var n = 0; n < e; n++) {
    cc.Component.EventHandler.emitEvents([ t.renderEvent ], i, n);
    i.height == t._itemSize.height && i.width == t._itemSize.width || (t._customSize[n] = t._sizeType ? i.height : i.width);
    }
    Object.keys(t._customSize).length || (t._customSize = null);
    i.removeFromParent();
    i.destroy && i.destroy();
    return t._customSize;
    }
    }

}
