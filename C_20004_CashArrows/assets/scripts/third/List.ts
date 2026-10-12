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

interface ItemPos {
    id: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    x: number;
    y: number;
}

type ListNode = cc.Node & {
    _listId?: number;
    listItem?: any;
    isCached?: boolean;
};

@ccclass
@disallowMultiple
@menu("自定义组件/List")
@requireComponent(cc.ScrollView)
@executionOrder(-5000)
export default class List extends cc.Component {

    @property({ type: cc.Enum(TemplateType) })
    templateType: TemplateType = TemplateType.NODE;

    @property({
        type: cc.Node,
        visible(this: any) {
            return this.templateType == TemplateType.NODE;
        },
    })
    tmpNode: cc.Node = null;

    @property({
        type: cc.Prefab,
        visible(this: any) {
            return this.templateType == TemplateType.PREFAB;
        },
    })
    tmpPrefab: cc.Prefab = null;

    @property
    _slideMode: SlideMode = SlideMode.NORMAL;

    @property({ type: cc.Enum(SlideMode) })
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
        visible(this: any) {
            return this._slideMode == SlideMode.PAGE;
        },
    })
    pageDistance: number = 0.3;

    @property({
        type: cc.Component.EventHandler,
        visible(this: any) {
            return this._slideMode == SlideMode.PAGE;
        },
    })
    pageChangeEvent: cc.Component.EventHandler = new cc.Component.EventHandler();

    @property
    _virtual: boolean = true;

    @property({ type: cc.Boolean })
    get virtual(): boolean {
        return this._virtual;
    }
    set virtual(value: boolean) {
        if (value != null) this._virtual = value;
        if (this._numItems != 0) this._onScrolling();
    }

    @property({
        visible(this: any) {
            const show = this.slideMode == SlideMode.NORMAL;
            if (!show) this.cyclic = false;
            return show;
        },
    })
    cyclic: boolean = false;

    @property({
        visible(this: any) {
            return this.virtual;
        },
    })
    lackCenter: boolean = false;

    @property({
        visible(this: any) {
            const show = this.virtual && !this.lackCenter;
            if (!show) this.lackSlide = false;
            return show;
        },
    })
    lackSlide: boolean = false;

    @property({ type: cc.Integer })
    _updateRate: number = 0;

    @property({
        type: cc.Integer,
        range: [0, 6, 1],
        slide: true,
    })
    get updateRate(): number {
        return this._updateRate;
    }
    set updateRate(value: number) {
        if (value >= 0 && value <= 6) this._updateRate = value;
    }

    @property({
        type: cc.Integer,
        range: [0, 12, 1],
        slide: true,
    })
    frameByFrameRenderNum: number = 0;

    @property({ type: cc.Component.EventHandler })
    renderEvent: cc.Component.EventHandler = new cc.Component.EventHandler();

    @property({ type: cc.Enum(SelectedMode) })
    selectedMode: SelectedMode = SelectedMode.NONE;

    @property({
        visible(this: any) {
            return this.selectedMode == SelectedMode.SINGLE;
        },
    })
    repeatEventSingle: boolean = false;

    @property({
        type: cc.Component.EventHandler,
        visible(this: any) {
            return this.selectedMode > SelectedMode.NONE;
        },
    })
    selectedEvent: cc.Component.EventHandler = new cc.Component.EventHandler();

    @property({ serializable: false })
    _numItems: number = 0;

    _selectedId: number = -1;
    _lastSelectedId: number = null;
    _actualNumItems: number = 0;

    get selectedId(): number {
        return this._selectedId;
    }
    set selectedId(value: number) {
        switch (this.selectedMode) {
            case SelectedMode.SINGLE: {
                if (!this.repeatEventSingle && value == this._selectedId) return;
                const node = this.getItemByListId(value);
                this._lastSelectedId = this._selectedId >= 0 ? this._selectedId : null;
                this._selectedId = value;
                if (node) {
                    const listItem: any = node.getComponent(ListItem);
                    listItem.selected = true;
                }
                if (this._lastSelectedId >= 0 && this._lastSelectedId != this._selectedId) {
                    const lastNode = this.getItemByListId(this._lastSelectedId);
                    if (lastNode) {
                        (lastNode.getComponent(ListItem) as any).selected = false;
                    }
                }
                if (this.selectedEvent) {
                    cc.Component.EventHandler.emitEvents(
                        [this.selectedEvent],
                        node,
                        value % this._actualNumItems,
                        this._lastSelectedId == null ? null : this._lastSelectedId % this._actualNumItems
                    );
                }
                break;
            }
            case SelectedMode.MULT: {
                const node = this.getItemByListId(value);
                if (!node) return;
                const listItem: any = node.getComponent(ListItem);
                if (this._selectedId >= 0) this._lastSelectedId = this._selectedId;
                this._selectedId = value;
                const selected = !listItem.selected;
                listItem.selected = selected;
                const idx = this.multSelected.indexOf(value);
                if (selected && idx < 0) {
                    this.multSelected.push(value);
                } else if (!selected && idx >= 0) {
                    this.multSelected.splice(idx, 1);
                }
                if (this.selectedEvent) {
                    cc.Component.EventHandler.emitEvents(
                        [this.selectedEvent],
                        node,
                        value % this._actualNumItems,
                        this._lastSelectedId == null ? null : this._lastSelectedId % this._actualNumItems,
                        selected
                    );
                }
                break;
            }
        }
    }

    get numItems(): number {
        return this._actualNumItems;
    }
    set numItems(value: number) {
        if (!this.checkInited(false)) return;
        if (value == null || value < 0) {
            cc.error("numItems set the wrong::", value);
            return;
        }
        this._actualNumItems = this._numItems = value;
        this._forceUpdate = true;
        if (this._virtual) {
            this._resizeContent();
            if (this.cyclic) this._numItems = this._cyclicNum * this._numItems;
            this._onScrolling();
            if (!this.frameByFrameRenderNum && this.slideMode == SlideMode.PAGE) {
                this.curPageNum = this.nearestListId;
            }
        } else {
            if (this.cyclic) {
                this._resizeContent();
                this._numItems = this._cyclicNum * this._numItems;
            }
            const layout = this.content.getComponent(cc.Layout);
            if (layout) layout.enabled = true;
            this._delRedundantItem();
            this.firstListId = 0;
            if (this.frameByFrameRenderNum > 0) {
                const count = this.frameByFrameRenderNum > this._numItems ? this._numItems : this.frameByFrameRenderNum;
                for (let i = 0; i < count; i++) this._createOrUpdateItem2(i);
                if (this.frameByFrameRenderNum < this._numItems) {
                    this._updateCounter = this.frameByFrameRenderNum;
                    this._updateDone = false;
                }
            } else {
                for (let i = 0; i < this._numItems; i++) this._createOrUpdateItem2(i);
                this.displayItemNum = this._numItems;
            }
        }
    }

    get scrollView(): cc.ScrollView {
        return this._scrollView;
    }

    _scrollView: cc.ScrollView = null;
    content: cc.Node = null;
    _layout: cc.Layout = null;
    _align: cc.Layout.Type = null;
    _resizeMode: cc.Layout.ResizeMode = null;
    _startAxis: cc.Layout.AxisDirection = null;
    _topGap: number = 0;
    _rightGap: number = 0;
    _bottomGap: number = 0;
    _leftGap: number = 0;
    _columnGap: number = 0;
    _lineGap: number = 0;
    _colLineNum: number = 0;
    _verticalDir: cc.Layout.VerticalDirection = null;
    _horizontalDir: cc.Layout.HorizontalDirection = null;
    _alignCalcType: number = 0;
    _sizeType: boolean = false;
    _itemTmp: cc.Node = null;
    _itemSize: cc.Size = null;
    _customSize: { [key: number]: number } = null;
    _pool: cc.NodePool = null;
    _lastDisplayData: number[] = [];
    displayData: ItemPos[] = [];
    _forceUpdate: boolean = false;
    _updateCounter: number = 0;
    _updateDone: boolean = true;
    _inited: boolean = false;
    _needUpdateWidget: boolean = false;
    _aniDelRuning: boolean = false;
    _doneAfterUpdate: boolean = false;
    _aniDelItem: ListNode = null;
    _aniDelBeforePos: cc.Vec3 = null;
    _aniDelBeforeScale: cc.Vec3 = null;
    _aniDelCB: (listId: number) => void = null;
    adhering: boolean = false;
    _adheringBarrier: boolean = false;
    curPageNum: number = 0;
    nearestListId: number = null;
    firstListId: number = 0;
    displayItemNum: number = 0;
    frameCount: number = null;
    curScrollIsTouch: boolean = false;
    _beganPos: number = null;
    _scrollPos: number = null;
    scrollToListId: number = null;
    _scrollToEndTime: number = 0;
    _scrollToSo: any = null;
    multSelected: number[] = [];
    elasticLeft: number = 0;
    elasticRight: number = 0;
    elasticTop: number = 0;
    elasticBottom: number = 0;
    viewLeft: number = 0;
    viewRight: number = 0;
    viewTop: number = 0;
    viewBottom: number = 0;
    _allItemSize: number = 0;
    _allItemSizeNoEdge: number = 0;
    _cyclicPos1: number = 0;
    _cyclicPos2: number = 0;
    _cyclicNum: number = 0;
    _cyclicAllItemSize: number = 0;
    _cycilcAllItemSizeNoEdge: number = 0;
    _lack: boolean = false;
    _scrollItem: ListNode = null;

    onLoad() {
        this._init();
    }

    onDestroy() {
        if (cc.isValid(this._itemTmp)) this._itemTmp.destroy();
        if (cc.isValid(this.tmpNode)) this.tmpNode.destroy();
        if (this._pool) this._pool.clear();
    }

    onEnable() {
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

    onDisable() {
        this._unregisterEvent();
    }

    _registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this, true);
        this.node.on("touch-up", this._onTouchUp, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
        this.node.on("scroll-began", this._onScrollBegan, this, true);
        this.node.on("scroll-ended", this._onScrollEnded, this, true);
        this.node.on("scrolling", this._onScrolling, this, true);
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChanged, this);
    }

    _unregisterEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this, true);
        this.node.off("touch-up", this._onTouchUp, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
        this.node.off("scroll-began", this._onScrollBegan, this, true);
        this.node.off("scroll-ended", this._onScrollEnded, this, true);
        this.node.off("scrolling", this._onScrolling, this, true);
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onSizeChanged, this);
    }

    _init() {
        if (this._inited) return;
        this._scrollView = this.node.getComponent(cc.ScrollView);
        this.content = this._scrollView.content;
        if (!this.content) {
            cc.error(this.node.name + "'s cc.ScrollView unset content!");
            return;
        }
        this._layout = this.content.getComponent(cc.Layout);
        this._align = this._layout.type;
        this._resizeMode = this._layout.resizeMode;
        this._startAxis = this._layout.startAxis;
        this._topGap = this._layout.paddingTop;
        this._rightGap = this._layout.paddingRight;
        this._bottomGap = this._layout.paddingBottom;
        this._leftGap = this._layout.paddingLeft;
        this._columnGap = this._layout.spacingX;
        this._lineGap = this._layout.spacingY;
        this._verticalDir = this._layout.verticalDirection;
        this._horizontalDir = this._layout.horizontalDirection;

        this.setTemplateItem(cc.instantiate(this.templateType == TemplateType.PREFAB ? this.tmpPrefab : this.tmpNode));

        if (this._slideMode == SlideMode.ADHERING || this._slideMode == SlideMode.PAGE) {
            this._scrollView.inertia = false;
            (this._scrollView as any)._onMouseWheel = function () { };
        }
        if (!this.virtual) this.lackCenter = false;

        this._lastDisplayData = [];
        this.displayData = [];
        this._pool = new cc.NodePool();
        this._forceUpdate = false;
        this._updateCounter = 0;
        this._updateDone = true;
        this.curPageNum = 0;

        if (this.cyclic) {
            (this._scrollView as any)._processAutoScrolling = this._processAutoScrolling.bind(this);
            (this._scrollView as any)._startBounceBackIfNeeded = function () {
                return false;
            };
        }

        switch (this._align) {
            case cc.Layout.Type.HORIZONTAL:
                switch (this._horizontalDir) {
                    case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                        this._alignCalcType = 1;
                        break;
                    case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                        this._alignCalcType = 2;
                        break;
                }
                break;
            case cc.Layout.Type.VERTICAL:
                switch (this._verticalDir) {
                    case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                        this._alignCalcType = 3;
                        break;
                    case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                        this._alignCalcType = 4;
                        break;
                }
                break;
            case cc.Layout.Type.GRID:
                switch (this._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL:
                        switch (this._verticalDir) {
                            case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                                this._alignCalcType = 3;
                                break;
                            case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                                this._alignCalcType = 4;
                                break;
                        }
                        break;
                    case cc.Layout.AxisDirection.VERTICAL:
                        switch (this._horizontalDir) {
                            case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                                this._alignCalcType = 1;
                                break;
                            case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                                this._alignCalcType = 2;
                                break;
                        }
                        break;
                }
                break;
        }
        this.content.removeAllChildren();
        this._inited = true;
    }

    _processAutoScrolling(dt: number) {
        const sv: any = this._scrollView;
        sv._autoScrollAccumulatedTime += 1 * dt;
        let t = Math.min(1, sv._autoScrollAccumulatedTime / sv._autoScrollTotalTime);
        if (sv._autoScrollAttenuate) {
            const i = t - 1;
            t = i * i * i * i * i + 1;
        }
        const target = sv._autoScrollStartPosition.add(sv._autoScrollTargetDelta.mul(t));
        const timing = sv.getScrollEndedEventTiming();
        const ended = Math.abs(t - 1) <= timing;
        if (Math.abs(t - 1) <= sv.getScrollEndedEventTiming() && !sv._isScrollEndedWithThresholdEventFired) {
            sv._dispatchEvent("scroll-ended-with-threshold");
            sv._isScrollEndedWithThresholdEventFired = true;
        }
        if (ended) sv._autoScrolling = false;
        const delta = target.sub(sv.getContentPosition());
        sv._moveContent(sv._clampDelta(delta), ended);
        sv._dispatchEvent("scrolling");
        if (!sv._autoScrolling) {
            sv._isBouncing = false;
            sv._scrolling = false;
            sv._dispatchEvent("scroll-ended");
        }
    }

    setTemplateItem(item: cc.Node) {
        if (!item) return;
        this._itemTmp = item;
        if (this._resizeMode == cc.Layout.ResizeMode.CHILDREN) {
            this._itemSize = this._layout.cellSize;
        } else {
            this._itemSize = cc.size(item.width, item.height);
        }

        let listItem: any = item.getComponent(ListItem);
        let noListItem = false;
        if (!listItem) noListItem = true;
        if (noListItem) this.selectedMode = SelectedMode.NONE;

        const widget = item.getComponent(cc.Widget);
        if (widget && widget.enabled) this._needUpdateWidget = true;

        if (this.selectedMode == SelectedMode.MULT) this.multSelected = [];

        switch (this._align) {
            case cc.Layout.Type.HORIZONTAL:
                this._colLineNum = 1;
                this._sizeType = false;
                break;
            case cc.Layout.Type.VERTICAL:
                this._colLineNum = 1;
                this._sizeType = true;
                break;
            case cc.Layout.Type.GRID:
                switch (this._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL: {
                        const width = this.content.width - this._leftGap - this._rightGap;
                        this._colLineNum = Math.floor((width + this._columnGap) / (this._itemSize.width + this._columnGap));
                        this._sizeType = true;
                        break;
                    }
                    case cc.Layout.AxisDirection.VERTICAL: {
                        const height = this.content.height - this._topGap - this._bottomGap;
                        this._colLineNum = Math.floor((height + this._lineGap) / (this._itemSize.height + this._lineGap));
                        this._sizeType = false;
                        break;
                    }
                }
                break;
        }
    }

    checkInited(printErr: boolean = true): boolean {
        if (this._inited) return true;
        if (printErr) cc.error("List initialization not completed!");
        return false;
    }

    _resizeContent() {
        let totalSize: number = 0;
        switch (this._align) {
            case cc.Layout.Type.HORIZONTAL:
                if (this._customSize) {
                    const fixed = this._getFixedSize(null);
                    totalSize = this._leftGap + fixed.val + this._itemSize.width * (this._numItems - fixed.count) + this._columnGap * (this._numItems - 1) + this._rightGap;
                } else {
                    totalSize = this._leftGap + this._itemSize.width * this._numItems + this._columnGap * (this._numItems - 1) + this._rightGap;
                }
                break;
            case cc.Layout.Type.VERTICAL:
                if (this._customSize) {
                    const fixed = this._getFixedSize(null);
                    totalSize = this._topGap + fixed.val + this._itemSize.height * (this._numItems - fixed.count) + this._lineGap * (this._numItems - 1) + this._bottomGap;
                } else {
                    totalSize = this._topGap + this._itemSize.height * this._numItems + this._lineGap * (this._numItems - 1) + this._bottomGap;
                }
                break;
            case cc.Layout.Type.GRID:
                if (this.lackCenter) this.lackCenter = false;
                switch (this._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL: {
                        const rowCount = Math.ceil(this._numItems / this._colLineNum);
                        totalSize = this._topGap + this._itemSize.height * rowCount + this._lineGap * (rowCount - 1) + this._bottomGap;
                        break;
                    }
                    case cc.Layout.AxisDirection.VERTICAL: {
                        const colCount = Math.ceil(this._numItems / this._colLineNum);
                        totalSize = this._leftGap + this._itemSize.width * colCount + this._columnGap * (colCount - 1) + this._rightGap;
                        break;
                    }
                }
                break;
        }

        const layout = this.content.getComponent(cc.Layout);
        if (layout) layout.enabled = false;

        this._allItemSize = totalSize;
        this._allItemSizeNoEdge = this._allItemSize - (this._sizeType ? this._topGap + this._bottomGap : this._leftGap + this._rightGap);

        if (this.cyclic) {
            let viewSize = this._sizeType ? this.node.height : this.node.width;
            this._cyclicPos1 = 0;
            viewSize -= this._cyclicPos1;
            this._cyclicNum = Math.ceil(viewSize / this._allItemSizeNoEdge) + 1;
            const gap = this._sizeType ? this._lineGap : this._columnGap;
            this._cyclicPos2 = this._cyclicPos1 + this._allItemSizeNoEdge + gap;
            this._cyclicAllItemSize = this._allItemSize + this._allItemSizeNoEdge * (this._cyclicNum - 1) + gap * (this._cyclicNum - 1);
            this._cycilcAllItemSizeNoEdge = this._allItemSizeNoEdge * this._cyclicNum;
            this._cycilcAllItemSizeNoEdge += gap * (this._cyclicNum - 1);
        }

        this._lack = !this.cyclic && this._allItemSize < (this._sizeType ? this.node.height : this.node.width);
        const extra = (this._lack && this.lackCenter) || !this.lackSlide ? 0.1 : 0;
        let contentSize = this._lack
            ? (this._sizeType ? this.node.height : this.node.width) - extra
            : this.cyclic ? this._cyclicAllItemSize : this._allItemSize;
        if (contentSize < 0) contentSize = 0;
        if (this._sizeType) this.content.height = contentSize;
        else this.content.width = contentSize;
    }

    _onScrolling(event: any = null) {
        if (this.frameCount == null) this.frameCount = this._updateRate;
        if (!this._forceUpdate && event && event.type != "scroll-ended" && this.frameCount > 0) {
            this.frameCount--;
            return;
        }
        this.frameCount = this._updateRate;
        if (this._aniDelRuning) return;

        if (this.cyclic) {
            let curPos = this.content.getPosition();
            let pos = this._sizeType ? curPos.y : curPos.x;
            const step = this._allItemSizeNoEdge + (this._sizeType ? this._lineGap : this._columnGap);
            const offset = this._sizeType ? cc.v2(0, step) : cc.v2(step, 0);
            switch (this._alignCalcType) {
                case 1:
                    if (pos > -this._cyclicPos1) {
                        this.content.x = -this._cyclicPos2;
                        if (this._scrollView.isAutoScrolling()) {
                            (this._scrollView as any)._autoScrollStartPosition = (this._scrollView as any)._autoScrollStartPosition.sub(offset);
                        }
                    } else if (pos < -this._cyclicPos2) {
                        this.content.x = -this._cyclicPos1;
                        if (this._scrollView.isAutoScrolling()) {
                            (this._scrollView as any)._autoScrollStartPosition = (this._scrollView as any)._autoScrollStartPosition.add(offset);
                        }
                    }
                    break;
                case 2:
                    if (pos < this._cyclicPos1) {
                        this.content.x = this._cyclicPos2;
                        if (this._scrollView.isAutoScrolling()) {
                            (this._scrollView as any)._autoScrollStartPosition = (this._scrollView as any)._autoScrollStartPosition.add(offset);
                        }
                    } else if (pos > this._cyclicPos2) {
                        this.content.x = this._cyclicPos1;
                        if (this._scrollView.isAutoScrolling()) {
                            (this._scrollView as any)._autoScrollStartPosition = (this._scrollView as any)._autoScrollStartPosition.sub(offset);
                        }
                    }
                    break;
                case 3:
                    if (pos < this._cyclicPos1) {
                        this.content.y = this._cyclicPos2;
                        if (this._scrollView.isAutoScrolling()) {
                            (this._scrollView as any)._autoScrollStartPosition = (this._scrollView as any)._autoScrollStartPosition.add(offset);
                        }
                    } else if (pos > this._cyclicPos2) {
                        this.content.y = this._cyclicPos1;
                        if (this._scrollView.isAutoScrolling()) {
                            (this._scrollView as any)._autoScrollStartPosition = (this._scrollView as any)._autoScrollStartPosition.sub(offset);
                        }
                    }
                    break;
                case 4:
                    if (pos > -this._cyclicPos1) {
                        this.content.y = -this._cyclicPos2;
                        if (this._scrollView.isAutoScrolling()) {
                            (this._scrollView as any)._autoScrollStartPosition = (this._scrollView as any)._autoScrollStartPosition.sub(offset);
                        }
                    } else if (pos < -this._cyclicPos2) {
                        this.content.y = -this._cyclicPos1;
                        if (this._scrollView.isAutoScrolling()) {
                            (this._scrollView as any)._autoScrollStartPosition = (this._scrollView as any)._autoScrollStartPosition.add(offset);
                        }
                    }
                    break;
            }
        }

        let viewTop: number;
        let viewRight: number;
        let viewBottom: number;
        let viewLeft: number;
        this._calcViewPos();
        if (this._sizeType) {
            viewTop = this.viewTop;
            viewBottom = this.viewBottom;
        } else {
            viewRight = this.viewRight;
            viewLeft = this.viewLeft;
        }

        if (this._virtual) {
            this.displayData = [];
            let data: ItemPos = null;
            let curId = 0;
            let lastId = this._numItems - 1;
            if (this._customSize) {
                let stop = false;
                for (; curId <= lastId && !stop; curId++) {
                    data = this._calcItemPos(curId);
                    switch (this._align) {
                        case cc.Layout.Type.HORIZONTAL:
                            if (data.right >= viewLeft && data.left <= viewRight) {
                                this.displayData.push(data);
                            } else if (curId != 0 && this.displayData.length > 0) {
                                stop = true;
                            }
                            break;
                        case cc.Layout.Type.VERTICAL:
                            if (data.bottom <= viewTop && data.top >= viewBottom) {
                                this.displayData.push(data);
                            } else if (curId != 0 && this.displayData.length > 0) {
                                stop = true;
                            }
                            break;
                        case cc.Layout.Type.GRID:
                            switch (this._startAxis) {
                                case cc.Layout.AxisDirection.HORIZONTAL:
                                    if (data.bottom <= viewTop && data.top >= viewBottom) {
                                        this.displayData.push(data);
                                    } else if (curId != 0 && this.displayData.length > 0) {
                                        stop = true;
                                    }
                                    break;
                                case cc.Layout.AxisDirection.VERTICAL:
                                    if (data.right >= viewLeft && data.left <= viewRight) {
                                        this.displayData.push(data);
                                    } else if (curId != 0 && this.displayData.length > 0) {
                                        stop = true;
                                    }
                                    break;
                            }
                            break;
                    }
                }
            } else {
                const itemStepX = this._itemSize.width + this._columnGap;
                const itemStepY = this._itemSize.height + this._lineGap;
                switch (this._alignCalcType) {
                    case 1:
                        curId = (viewLeft - this._leftGap) / itemStepX;
                        lastId = (viewRight - this._leftGap) / itemStepX;
                        break;
                    case 2:
                        curId = (-viewRight - this._rightGap) / itemStepX;
                        lastId = (-viewLeft - this._rightGap) / itemStepX;
                        break;
                    case 3:
                        curId = (-viewTop - this._topGap) / itemStepY;
                        lastId = (-viewBottom - this._topGap) / itemStepY;
                        break;
                    case 4:
                        curId = (viewBottom - this._bottomGap) / itemStepY;
                        lastId = (viewTop - this._bottomGap) / itemStepY;
                        break;
                }
                curId = Math.floor(curId) * this._colLineNum;
                lastId = Math.ceil(lastId) * this._colLineNum;
                if (curId < 0) curId = 0;
                --lastId;
                if (lastId >= this._numItems) lastId = this._numItems - 1;
                for (; curId <= lastId; curId++) {
                    this.displayData.push(this._calcItemPos(curId));
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
            let changed = this.displayItemNum != lastLen;
            if (changed) {
                if (this.frameByFrameRenderNum > 0) {
                    this._lastDisplayData.sort(function (a, b) {
                        return a - b;
                    });
                }
                changed = this.firstListId != this._lastDisplayData[0] || this.displayData[this.displayItemNum - 1].id != this._lastDisplayData[lastLen - 1];
            }

            if (this._forceUpdate || changed) {
                if (this.frameByFrameRenderNum > 0) {
                    if (this._numItems > 0) {
                        if (this._updateDone) this._updateCounter = 0;
                        else this._doneAfterUpdate = true;
                        this._updateDone = false;
                    } else {
                        this._updateCounter = 0;
                        this._updateDone = true;
                    }
                } else {
                    this._lastDisplayData = [];
                    for (let i = 0; i < this.displayItemNum; i++) {
                        this._createOrUpdateItem(this.displayData[i]);
                    }
                    this._forceUpdate = false;
                }
            }
        }
        this._calcNearestItem();
    }

    _calcViewPos() {
        const pos = this.content.getPosition();
        switch (this._alignCalcType) {
            case 1:
                this.elasticLeft = pos.x > 0 ? pos.x : 0;
                this.viewLeft = (pos.x < 0 ? -pos.x : 0) - this.elasticLeft;
                this.viewRight = this.viewLeft + this.node.width;
                this.elasticRight = this.viewRight > this.content.width ? Math.abs(this.viewRight - this.content.width) : 0;
                this.viewRight += this.elasticRight;
                break;
            case 2:
                this.elasticRight = pos.x < 0 ? -pos.x : 0;
                this.viewRight = (pos.x > 0 ? -pos.x : 0) + this.elasticRight;
                this.viewLeft = this.viewRight - this.node.width;
                this.elasticLeft = this.viewLeft < -this.content.width ? Math.abs(this.viewLeft + this.content.width) : 0;
                this.viewLeft -= this.elasticLeft;
                break;
            case 3:
                this.elasticTop = pos.y < 0 ? Math.abs(pos.y) : 0;
                this.viewTop = (pos.y > 0 ? -pos.y : 0) + this.elasticTop;
                this.viewBottom = this.viewTop - this.node.height;
                this.elasticBottom = this.viewBottom < -this.content.height ? Math.abs(this.viewBottom + this.content.height) : 0;
                this.viewBottom += this.elasticBottom;
                break;
            case 4:
                this.elasticBottom = pos.y > 0 ? Math.abs(pos.y) : 0;
                this.viewBottom = (pos.y < 0 ? -pos.y : 0) - this.elasticBottom;
                this.viewTop = this.viewBottom + this.node.height;
                this.elasticTop = this.viewTop > this.content.height ? Math.abs(this.viewTop - this.content.height) : 0;
                this.viewTop -= this.elasticTop;
                break;
        }
    }

    _calcItemPos(listId: number): ItemPos {
        let itemW: number;
        let itemH: number;
        let top: number;
        let bottom: number;
        let left: number;
        let right: number;
        let x: number;
        let y: number;
        let customVal: number;

        switch (this._align) {
            case cc.Layout.Type.HORIZONTAL:
                switch (this._horizontalDir) {
                    case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT: {
                        if (this._customSize) {
                            const fixed = this._getFixedSize(listId);
                            left = this._leftGap + (this._itemSize.width + this._columnGap) * (listId - fixed.count) + (fixed.val + this._columnGap * fixed.count);
                            customVal = this._customSize[listId];
                            itemW = customVal > 0 ? customVal : this._itemSize.width;
                        } else {
                            left = this._leftGap + (this._itemSize.width + this._columnGap) * listId;
                            itemW = this._itemSize.width;
                        }
                        if (this.lackCenter) {
                            left -= this._leftGap;
                            left += this.content.width / 2 - this._allItemSizeNoEdge / 2;
                        }
                        right = left + itemW;
                        return {
                            id: listId,
                            left: left,
                            right: right,
                            x: left + this._itemTmp.anchorX * itemW,
                            y: this._itemTmp.y,
                        };
                    }
                    case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT: {
                        if (this._customSize) {
                            const fixed = this._getFixedSize(listId);
                            right = -this._rightGap - (this._itemSize.width + this._columnGap) * (listId - fixed.count) - (fixed.val + this._columnGap * fixed.count);
                            customVal = this._customSize[listId];
                            itemW = customVal > 0 ? customVal : this._itemSize.width;
                        } else {
                            right = -this._rightGap - (this._itemSize.width + this._columnGap) * listId;
                            itemW = this._itemSize.width;
                        }
                        if (this.lackCenter) {
                            right += this._rightGap;
                            right -= this.content.width / 2 - this._allItemSizeNoEdge / 2;
                        }
                        left = right - itemW;
                        return {
                            id: listId,
                            right: right,
                            left: left,
                            x: left + this._itemTmp.anchorX * itemW,
                            y: this._itemTmp.y,
                        };
                    }
                }
                break;

            case cc.Layout.Type.VERTICAL:
                switch (this._verticalDir) {
                    case cc.Layout.VerticalDirection.TOP_TO_BOTTOM: {
                        if (this._customSize) {
                            const fixed = this._getFixedSize(listId);
                            top = -this._topGap - (this._itemSize.height + this._lineGap) * (listId - fixed.count) - (fixed.val + this._lineGap * fixed.count);
                            customVal = this._customSize[listId];
                            itemH = customVal > 0 ? customVal : this._itemSize.height;
                        } else {
                            top = -this._topGap - (this._itemSize.height + this._lineGap) * listId;
                            itemH = this._itemSize.height;
                        }
                        if (this.lackCenter) {
                            top += this._topGap;
                            top -= this.content.height / 2 - this._allItemSizeNoEdge / 2;
                        }
                        bottom = top - itemH;
                        return {
                            id: listId,
                            top: top,
                            bottom: bottom,
                            x: this._itemTmp.x,
                            y: bottom + this._itemTmp.anchorY * itemH,
                        };
                    }
                    case cc.Layout.VerticalDirection.BOTTOM_TO_TOP: {
                        if (this._customSize) {
                            const fixed = this._getFixedSize(listId);
                            bottom = this._bottomGap + (this._itemSize.height + this._lineGap) * (listId - fixed.count) + (fixed.val + this._lineGap * fixed.count);
                            customVal = this._customSize[listId];
                            itemH = customVal > 0 ? customVal : this._itemSize.height;
                        } else {
                            bottom = this._bottomGap + (this._itemSize.height + this._lineGap) * listId;
                            itemH = this._itemSize.height;
                        }
                        if (this.lackCenter) {
                            bottom -= this._bottomGap;
                            bottom += this.content.height / 2 - this._allItemSizeNoEdge / 2;
                        }
                        top = bottom + itemH;
                        return {
                            id: listId,
                            top: top,
                            bottom: bottom,
                            x: this._itemTmp.x,
                            y: bottom + this._itemTmp.anchorY * itemH,
                        };
                    }
                }
                break;

            case cc.Layout.Type.GRID: {
                const rowIndex = Math.floor(listId / this._colLineNum);
                switch (this._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL: {
                        switch (this._verticalDir) {
                            case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                                top = -this._topGap - (this._itemSize.height + this._lineGap) * rowIndex;
                                bottom = top - this._itemSize.height;
                                y = bottom + this._itemTmp.anchorY * this._itemSize.height;
                                break;
                            case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                                bottom = this._bottomGap + (this._itemSize.height + this._lineGap) * rowIndex;
                                top = bottom + this._itemSize.height;
                                y = bottom + this._itemTmp.anchorY * this._itemSize.height;
                                break;
                        }
                        x = this._leftGap + (listId % this._colLineNum) * (this._itemSize.width + this._columnGap);
                        switch (this._horizontalDir) {
                            case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                                x += this._itemTmp.anchorX * this._itemSize.width;
                                x -= this.content.anchorX * this.content.width;
                                break;
                            case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                                x += (1 - this._itemTmp.anchorX) * this._itemSize.width;
                                x -= (1 - this.content.anchorX) * this.content.width;
                                x *= -1;
                                break;
                        }
                        return {
                            id: listId,
                            top: top,
                            bottom: bottom,
                            x: x,
                            y: y,
                        };
                    }
                    case cc.Layout.AxisDirection.VERTICAL: {
                        switch (this._horizontalDir) {
                            case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                                left = this._leftGap + (this._itemSize.width + this._columnGap) * rowIndex;
                                right = left + this._itemSize.width;
                                x = left + this._itemTmp.anchorX * this._itemSize.width;
                                x -= this.content.anchorX * this.content.width;
                                break;
                            case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                                right = -this._rightGap - (this._itemSize.width + this._columnGap) * rowIndex;
                                left = right - this._itemSize.width;
                                x = left + this._itemTmp.anchorX * this._itemSize.width;
                                x += (1 - this.content.anchorX) * this.content.width;
                                break;
                        }
                        y = -this._topGap - (listId % this._colLineNum) * (this._itemSize.height + this._lineGap);
                        switch (this._verticalDir) {
                            case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                                y -= (1 - this._itemTmp.anchorY) * this._itemSize.height;
                                y += (1 - this.content.anchorY) * this.content.height;
                                break;
                            case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                                y -= this._itemTmp.anchorY * this._itemSize.height;
                                y += this.content.anchorY * this.content.height;
                                y *= -1;
                                break;
                        }
                        return {
                            id: listId,
                            left: left,
                            right: right,
                            x: x,
                            y: y,
                        };
                    }
                }
                break;
            }
        }
        return null;
    }

    _calcExistItemPos(listId: number): ItemPos {
        const node = this.getItemByListId(listId);
        if (!node) return null;
        const data: ItemPos = {
            id: listId,
            x: node.x,
            y: node.y,
        };
        if (this._sizeType) {
            data.top = node.y + node.height * (1 - node.anchorY);
            data.bottom = node.y - node.height * node.anchorY;
        } else {
            data.left = node.x - node.width * node.anchorX;
            data.right = node.x + node.width * (1 - node.anchorX);
        }
        return data;
    }

    getItemPos(listId: number): ItemPos {
        return this._virtual ? this._calcItemPos(listId) : this.frameByFrameRenderNum ? this._calcItemPos(listId) : this._calcExistItemPos(listId);
    }

    _getFixedSize(listId: number = null): { val: number; count: number } {
        if (!this._customSize) return null;
        const id = listId == null ? this._numItems : listId;
        let val = 0;
        let count = 0;
        for (const key in this._customSize) {
            if (parseInt(key) < id) {
                val += this._customSize[key];
                count++;
            }
        }
        return { val: val, count: count };
    }

    _onScrollBegan() {
        this._beganPos = this._sizeType ? this.viewTop : this.viewLeft;
    }

    _onScrollEnded() {
        this.curScrollIsTouch = false;
        if (this.scrollToListId != null) {
            const node = this.getItemByListId(this.scrollToListId);
            this.scrollToListId = null;
            if (node) {
                cc.tween(node).to(0.1, { scale: 1.06 }).to(0.1, { scale: 1 }).start();
            }
        }
        this._onScrolling();
        if (this._slideMode != SlideMode.ADHERING || this.adhering) {
            if (this._slideMode == SlideMode.PAGE) {
                if (this._beganPos != null && this.curScrollIsTouch) {
                    this._pageAdhere();
                } else {
                    this.adhere();
                }
            }
        } else {
            this.adhere();
        }
    }

    _onTouchStart(event: cc.Event.EventTouch, captureListeners: cc.Node[]) {
        if (!(this._scrollView as any).hasNestedViewGroup(event, captureListeners) && (this.curScrollIsTouch = true, event.eventPhase !== cc.Event.AT_TARGET || event.target !== this.node)) {
            let target: ListNode = event.target as ListNode;
            while (target._listId == null && target.parent) {
                target = target.parent as ListNode;
            }
            this._scrollItem = target._listId != null ? target : (event.target as ListNode);
        }
    }

    _onTouchUp() {
        this._scrollPos = null;
        if (this._slideMode == SlideMode.ADHERING) {
            if (this.adhering) this._adheringBarrier = true;
            this.adhere();
        } else if (this._slideMode == SlideMode.PAGE) {
            if (this._beganPos != null) this._pageAdhere();
            else this.adhere();
        }
        this._scrollItem = null;
    }

    _onTouchCancelled(event: cc.Event.EventTouch, captureListeners: cc.Node[]) {
        if (!(this._scrollView as any).hasNestedViewGroup(event, captureListeners) && !(event as any).simulate) {
            this._scrollPos = null;
            if (this._slideMode == SlideMode.ADHERING) {
                if (this.adhering) this._adheringBarrier = true;
                this.adhere();
            } else if (this._slideMode == SlideMode.PAGE) {
                if (this._beganPos != null) this._pageAdhere();
                else this.adhere();
            }
            this._scrollItem = null;
        }
    }

    _onSizeChanged() {
        if (this.checkInited(false)) this._onScrolling();
    }

    _onItemAdaptive(node: ListNode) {
        if ((!this._sizeType && node.width != this._itemSize.width) || (this._sizeType && node.height != this._itemSize.height)) {
            if (!this._customSize) this._customSize = {};
            const size = this._sizeType ? node.height : node.width;
            if (this._customSize[node._listId] != size) {
                this._customSize[node._listId] = size;
                this._resizeContent();
                this.updateAll();
                if (this.scrollToListId != null) {
                    this._scrollPos = null;
                    this.unschedule(this._scrollToSo);
                    this.scrollTo(this.scrollToListId, Math.max(0, this._scrollToEndTime - new Date().getTime() / 1000));
                }
            }
        }
    }

    _pageAdhere() {
        if (this.cyclic || !(this.elasticTop > 0 || this.elasticRight > 0 || this.elasticBottom > 0 || this.elasticLeft > 0)) {
            const pos = this._sizeType ? this.viewTop : this.viewLeft;
            const distance = (this._sizeType ? this.node.height : this.node.width) * this.pageDistance;
            if (Math.abs(this._beganPos - pos) > distance) {
                switch (this._alignCalcType) {
                    case 1:
                    case 4:
                        if (this._beganPos > pos) this.prePage(0.5);
                        else this.nextPage(0.5);
                        break;
                    case 2:
                    case 3:
                        if (this._beganPos < pos) this.prePage(0.5);
                        else this.nextPage(0.5);
                        break;
                }
            } else if (this.elasticTop <= 0 && this.elasticRight <= 0 && this.elasticBottom <= 0 && this.elasticLeft <= 0) {
                this.adhere();
            }
            this._beganPos = null;
        }
    }

    adhere() {
        if (!this.checkInited()) return;
        if (this.elasticTop > 0 || this.elasticRight > 0 || this.elasticBottom > 0 || this.elasticLeft > 0) return;
        this.adhering = true;
        this._calcNearestItem();
        const offset = (this._sizeType ? this._topGap : this._leftGap) / (this._sizeType ? this.node.height : this.node.width);
        this.scrollTo(this.nearestListId, 0.7, offset);
    }

    update() {
        if (this.frameByFrameRenderNum <= 0 || this._updateDone) return;
        if (this._virtual) {
            const end = this._updateCounter + this.frameByFrameRenderNum > this.displayItemNum
                ? this.displayItemNum
                : this._updateCounter + this.frameByFrameRenderNum;
            for (let i = this._updateCounter; i < end; i++) {
                const data = this.displayData[i];
                if (data) this._createOrUpdateItem(data);
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
                    if (this.slideMode == SlideMode.PAGE) this.curPageNum = this.nearestListId;
                }
            } else {
                this._updateCounter += this.frameByFrameRenderNum;
            }
        } else if (this._updateCounter < this._numItems) {
            const end = this._updateCounter + this.frameByFrameRenderNum > this._numItems
                ? this._numItems
                : this._updateCounter + this.frameByFrameRenderNum;
            for (let i = this._updateCounter; i < end; i++) {
                this._createOrUpdateItem2(i);
            }
            this._updateCounter += this.frameByFrameRenderNum;
        } else {
            this._updateDone = true;
            this._calcNearestItem();
            if (this.slideMode == SlideMode.PAGE) this.curPageNum = this.nearestListId;
        }
    }

    _createOrUpdateItem(data: ItemPos) {
        let node = this.getItemByListId(data.id) as ListNode;
        if (node) {
            if (this._forceUpdate && this.renderEvent) {
                node.setPosition(cc.v2(data.x, data.y));
                this._resetItemSize(node);
                if (this.renderEvent) {
                    cc.Component.EventHandler.emitEvents([this.renderEvent], node, data.id % this._actualNumItems);
                }
            }
        } else {
            let fromPool = this._pool.size() > 0;
            node = (fromPool ? this._pool.get() : cc.instantiate(this._itemTmp)) as ListNode;
            if (!fromPool || !cc.isValid(node)) {
                node = cc.instantiate(this._itemTmp) as ListNode;
                fromPool = false;
            }
            if (node._listId != data.id) {
                node._listId = data.id;
                node.setContentSize(this._itemSize);
            }
            node.setPosition(cc.v2(data.x, data.y));
            this._resetItemSize(node);
            this.content.addChild(node);
            if (fromPool && this._needUpdateWidget) {
                const widget = node.getComponent(cc.Widget);
                if (widget) widget.updateAlignment();
            }
            node.setSiblingIndex(this.content.childrenCount - 1);
            const listItem: any = node.getComponent(ListItem);
            node.listItem = listItem;
            if (listItem) {
                listItem.listId = data.id;
                listItem.list = this;
                listItem._registerEvent();
            }
            if (this.renderEvent) {
                cc.Component.EventHandler.emitEvents([this.renderEvent], node, data.id % this._actualNumItems);
            }
        }
        this._resetItemSize(node);
        this._updateListItem(node.listItem);
        if (this._lastDisplayData.indexOf(data.id) < 0) {
            this._lastDisplayData.push(data.id);
        }
    }

    _createOrUpdateItem2(listId: number) {
        let listItem: any = null;
        let node = this.content.children[listId] as ListNode;
        if (node) {
            if (this._forceUpdate && this.renderEvent) {
                node._listId = listId;
                if (listItem) listItem.listId = listId;
                if (this.renderEvent) {
                    cc.Component.EventHandler.emitEvents([this.renderEvent], node, listId % this._actualNumItems);
                }
            }
        } else {
            node = cc.instantiate(this._itemTmp) as ListNode;
            node._listId = listId;
            this.content.addChild(node);
            listItem = node.getComponent(ListItem);
            node.listItem = listItem;
            if (listItem) {
                listItem.listId = listId;
                listItem.list = this;
                listItem._registerEvent();
            }
            if (this.renderEvent) {
                cc.Component.EventHandler.emitEvents([this.renderEvent], node, listId % this._actualNumItems);
            }
        }
        this._updateListItem(listItem);
        if (this._lastDisplayData.indexOf(listId) < 0) {
            this._lastDisplayData.push(listId);
        }
    }

    _updateListItem(listItem: any) {
        if (listItem && this.selectedMode > SelectedMode.NONE) {
            const node = listItem.node;
            switch (this.selectedMode) {
                case SelectedMode.SINGLE:
                    listItem.selected = this.selectedId == node._listId;
                    break;
                case SelectedMode.MULT:
                    listItem.selected = this.multSelected.indexOf(node._listId) >= 0;
                    break;
            }
        }
    }

    _resetItemSize(_node?: cc.Node) {
    }

    _updateItemPos(listIdOrNode: number | ListNode) {
        const node = typeof listIdOrNode === "number" ? this.getItemByListId(listIdOrNode) : listIdOrNode;
        const data = this.getItemPos(node._listId);
        node.setPosition(data.x, data.y);
    }

    setMultSelected(listIds: number | number[], selected: boolean = null) {
        if (!this.checkInited()) return;
        if (!Array.isArray(listIds)) listIds = [listIds];
        if (selected == null) {
            this.multSelected = listIds;
        } else if (selected) {
            for (let i = listIds.length - 1; i >= 0; i--) {
                const id = listIds[i];
                if (this.multSelected.indexOf(id) < 0) {
                    this.multSelected.push(id);
                }
            }
        } else {
            for (let i = listIds.length - 1; i >= 0; i--) {
                const id = listIds[i];
                const idx = this.multSelected.indexOf(id);
                if (idx >= 0) {
                    this.multSelected.splice(idx, 1);
                }
            }
        }
        this._forceUpdate = true;
        this._onScrolling();
    }

    getMultSelected(): number[] {
        return this.multSelected;
    }

    hasMultSelected(listId: number): boolean {
        return this.multSelected && this.multSelected.indexOf(listId) >= 0;
    }

    updateItem(listIds: number | number[]) {
        if (!this.checkInited()) return;
        if (!Array.isArray(listIds)) listIds = [listIds];
        for (let i = 0; i < listIds.length; i++) {
            const id = listIds[i];
            const node = this.getItemByListId(id);
            if (node) {
                cc.Component.EventHandler.emitEvents([this.renderEvent], node, id % this._actualNumItems);
            }
        }
    }

    updateAll() {
        if (this.checkInited()) this.numItems = this.numItems;
    }

    getItemByListId(listId: number): ListNode {
        if (this.content) {
            for (let i = this.content.childrenCount - 1; i >= 0; i--) {
                const node = this.content.children[i] as ListNode;
                if (node._listId == listId) return node;
            }
        }
        return null;
    }

    _getOutsideItem(): ListNode[] {
        const result: ListNode[] = [];
        for (let i = this.content.childrenCount - 1; i >= 0; i--) {
            const node = this.content.children[i] as ListNode;
            const found = this.displayData.find(function (data) {
                return data.id == node._listId;
            });
            if (!found) result.push(node);
        }
        return result;
    }

    _delRedundantItem() {
        if (this._virtual) {
            const outsideItems = this._getOutsideItem();
            for (let i = outsideItems.length - 1; i >= 0; i--) {
                const node = outsideItems[i];
                if (!this._scrollItem || node._listId != this._scrollItem._listId) {
                    node.isCached = true;
                    this._pool.put(node);
                    for (let j = this._lastDisplayData.length - 1; j >= 0; j--) {
                        if (this._lastDisplayData[j] == node._listId) {
                            this._lastDisplayData.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        } else {
            while (this.content.childrenCount > this._numItems) {
                this._delSingleItem(this.content.children[this.content.childrenCount - 1] as ListNode);
            }
        }
    }

    _delSingleItem(node: ListNode) {
        node.removeFromParent();
        if (node.destroy) node.destroy();
    }

    aniDelItem(listId: number, callFunc: (listId: number) => void, showAniParam?: any) {
        if (!this.checkInited() || this.cyclic || !this._virtual) {
            return cc.error("This function is not allowed to be called!");
        }
        if (!callFunc) {
            return cc.error("CallFunc are not allowed to be NULL, You need to delete the corresponding index in the data array in the CallFunc!");
        }
        if (this._aniDelRuning) {
            return cc.warn("Please wait for the current deletion to finish!");
        }

        const node = this.getItemByListId(listId);
        if (node) {
            const listItem: any = node.getComponent(ListItem);
            this._aniDelRuning = true;
            this._aniDelCB = callFunc;
            this._aniDelItem = node;
            this._aniDelBeforePos = node.position;
            this._aniDelBeforeScale = node.scale;
            const lastDisplayId = this.displayData[this.displayData.length - 1].id;
            const wasSelected = listItem.selected;

            listItem.showAni(showAniParam, () => {
                let newId: number = null;
                let called = false;

                if (lastDisplayId < this._numItems - 2) newId = lastDisplayId + 1;

                if (newId != null) {
                    const data = this._calcItemPos(newId);
                    this.displayData.push(data);
                    if (this._virtual) this._createOrUpdateItem(data);
                    else this._createOrUpdateItem2(newId);
                } else {
                    this._numItems--;
                }

                if (this.selectedMode == SelectedMode.SINGLE) {
                    if (wasSelected) {
                        this._selectedId = -1;
                    } else if (this._selectedId - 1 >= 0) {
                        this._selectedId--;
                    }
                } else if (this.selectedMode == SelectedMode.MULT && this.multSelected.length) {
                    const idx = this.multSelected.indexOf(listId);
                    if (idx >= 0) this.multSelected.splice(idx, 1);
                    for (let i = this.multSelected.length - 1; i >= 0; i--) {
                        if (this.multSelected[i] >= listId) this.multSelected[i]--;
                    }
                }

                if (this._customSize) {
                    if (this._customSize[listId]) delete this._customSize[listId];
                    const newCustomSize: { [key: number]: number } = {};
                    for (const key in this._customSize) {
                        const size = this._customSize[key];
                        const index = parseInt(key);
                        newCustomSize[index - (index >= listId ? 1 : 0)] = size;
                    }
                    this._customSize = newCustomSize;
                }

                for (let i = newId != null ? newId : lastDisplayId; i >= listId + 1; i--) {
                    const moveNode = this.getItemByListId(i);
                    if (moveNode) {
                        const data = this._calcItemPos(i - 1);
                        const tween = cc.tween(moveNode).to(0.2333, { position: cc.v2(data.x, data.y) });
                        if (i <= listId + 1) {
                            called = true;
                            tween.call(() => {
                                this._aniDelRuning = false;
                                callFunc(listId);
                                delete this._aniDelCB;
                            });
                        }
                        tween.start();
                    }
                }

                if (!called) {
                    this._aniDelRuning = false;
                    callFunc(listId);
                    this._aniDelCB = null;
                }
            }, true);
        } else {
            callFunc(listId);
        }
    }

    scrollTo(listId: number, timeInSecond: number = 0.5, offsetFactor: number = null, showTip: boolean = false) {
        if (!this.checkInited(false)) return;
        if (timeInSecond == null) timeInSecond = 0.5;
        else if (timeInSecond < 0) timeInSecond = 0;
        if (listId < 0) listId = 0;
        else if (listId >= this._numItems) listId = this._numItems - 1;

        if (!this._virtual && this._layout && this._layout.enabled) this._layout.updateLayout();

        let posX: number;
        let posY: number;
        let data = this.getItemPos(listId);
        if (!data) return false;

        switch (this._alignCalcType) {
            case 1:
                posX = data.left;
                posX -= offsetFactor != null ? this.node.width * offsetFactor : this._leftGap;
                data = cc.v2(posX, 0);
                break;
            case 2:
                posX = data.right - this.node.width;
                posX += offsetFactor != null ? this.node.width * offsetFactor : this._rightGap;
                data = cc.v2(posX + this.content.width, 0);
                break;
            case 3:
                posY = data.top;
                posY += offsetFactor != null ? this.node.height * offsetFactor : this._topGap;
                data = cc.v2(0, -posY);
                break;
            case 4:
                posY = data.bottom + this.node.height;
                posY -= offsetFactor != null ? this.node.height * offsetFactor : this._bottomGap;
                data = cc.v2(0, -posY + this.content.height);
                break;
        }

        const contentPos = this.content.getPosition();
        const curPos = Math.abs(this._sizeType ? contentPos.y : contentPos.x);
        const targetPos = this._sizeType ? data.y : data.x;

        if (Math.abs((this._scrollPos != null ? this._scrollPos : curPos) - targetPos) > 0.5) {
            this._scrollView.scrollToOffset(data, timeInSecond);
            this.scrollToListId = listId;
            this._scrollToEndTime = new Date().getTime() / 1000 + timeInSecond;
            this._scrollToSo = this.scheduleOnce(() => {
                if (!this._adheringBarrier) {
                    this.adhering = this._adheringBarrier = false;
                }
                this._scrollPos = this.scrollToListId = this._scrollToEndTime = this._scrollToSo = null;
                if (showTip) {
                    const node = this.getItemByListId(listId);
                    if (node) {
                        cc.tween(node).to(0.1, { scale: 1.05 }).to(0.1, { scale: 1 }).start();
                    }
                }
            }, timeInSecond + 0.1);
            if (timeInSecond <= 0) this._onScrolling();
        }
    }

    _calcNearestItem() {
        this.nearestListId = null;
        if (this._virtual) this._calcViewPos();

        const viewTop = this.viewTop;
        const viewRight = this.viewRight;
        const viewBottom = this.viewBottom;
        const viewLeft = this.viewLeft;

        let data: ItemPos = null;
        let center: number;
        let stop = false;
        for (let i = 0; i < this.content.childrenCount && !stop; i += this._colLineNum) {
            data = this._virtual ? this.displayData[i] : this._calcExistItemPos(i);
            if (!data) continue;
            center = this._sizeType ? (data.top + data.bottom) / 2 : (data.left + data.right) / 2;
            switch (this._alignCalcType) {
                case 1:
                    if (data.right >= viewLeft) {
                        this.nearestListId = data.id;
                        if (viewLeft > center) this.nearestListId += this._colLineNum;
                        stop = true;
                    }
                    break;
                case 2:
                    if (data.left <= viewRight) {
                        this.nearestListId = data.id;
                        if (viewRight < center) this.nearestListId += this._colLineNum;
                        stop = true;
                    }
                    break;
                case 3:
                    if (data.bottom <= viewTop) {
                        this.nearestListId = data.id;
                        if (viewTop < center) this.nearestListId += this._colLineNum;
                        stop = true;
                    }
                    break;
                case 4:
                    if (data.top >= viewBottom) {
                        this.nearestListId = data.id;
                        if (viewBottom > center) this.nearestListId += this._colLineNum;
                        stop = true;
                    }
                    break;
            }
        }

        data = this._virtual ? this.displayData[this.displayItemNum - 1] : this._calcExistItemPos(this._numItems - 1);
        if (data && data.id == this._numItems - 1) {
            center = this._sizeType ? (data.top + data.bottom) / 2 : (data.left + data.right) / 2;
            switch (this._alignCalcType) {
                case 1:
                    if (viewRight > center) this.nearestListId = data.id;
                    break;
                case 2:
                    if (viewLeft < center) this.nearestListId = data.id;
                    break;
                case 3:
                    if (viewBottom < center) this.nearestListId = data.id;
                    break;
                case 4:
                    if (viewTop > center) this.nearestListId = data.id;
                    break;
            }
        }
    }

    prePage(timeInSecond: number = 0.5) {
        if (this.checkInited()) this.skipPage(this.curPageNum - 1, timeInSecond);
    }

    nextPage(timeInSecond: number = 0.5) {
        if (this.checkInited()) this.skipPage(this.curPageNum + 1, timeInSecond);
    }

    skipPage(pageNum: number, timeInSecond: number) {
        if (!this.checkInited()) return;
        if (this._slideMode != SlideMode.PAGE) {
            return cc.error("This function is not allowed to be called, Must SlideMode = PAGE!");
        }
        if (pageNum < 0 || pageNum >= this._numItems) return;
        if (this.curPageNum == pageNum) return;
        this.curPageNum = pageNum;
        if (this.pageChangeEvent) {
            cc.Component.EventHandler.emitEvents([this.pageChangeEvent], pageNum);
        }
        this.scrollTo(pageNum, timeInSecond);
    }

    calcCustomSize(num: number) {
        if (!this.checkInited()) return;
        if (!this._itemTmp) return cc.error("Unset template item!");
        if (!this.renderEvent) return cc.error("Unset Render-Event!");

        this._customSize = {};
        const node = cc.instantiate(this._itemTmp);
        this.content.addChild(node);
        for (let i = 0; i < num; i++) {
            cc.Component.EventHandler.emitEvents([this.renderEvent], node, i);
            if (node.height != this._itemSize.height || node.width != this._itemSize.width) {
                this._customSize[i] = this._sizeType ? node.height : node.width;
            }
        }
        if (!Object.keys(this._customSize).length) this._customSize = null;
        node.removeFromParent();
        if (node.destroy) node.destroy();
        return this._customSize;
    }
}