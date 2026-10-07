import ListItem from "./ListItem";

const { ccclass, property, disallowMultiple, menu, executionOrder, requireComponent } = cc._decorator;

export enum TemplateType {
    NODE = 1,
    PREFAB = 2,
}

export enum SlideMode {
    NORMAL = 1,
    ADHERING = 2,
    PAGE = 3,
}

export enum SelectedMode {
    NONE = 0,
    SINGLE = 1,
    MULT = 2,
}

interface ItemPosData {
    id: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    x: number;
    y: number;
}

interface FixedSizeResult {
    val: number;
    count: number;
}

@ccclass
@disallowMultiple()
@menu("自定义组件/List")
@requireComponent(cc.ScrollView)
@executionOrder(-5000)
export default class List extends cc.Component {
    @property({
        type: cc.Enum(TemplateType),
    })
    templateType: TemplateType = TemplateType.NODE;

    @property({
        type: cc.Node,
        visible(this: List) {
            return this.templateType === TemplateType.NODE;
        },
    })
    tmpNode: cc.Node | null = null;

    @property({
        type: cc.Prefab,
        visible(this: List) {
            return this.templateType === TemplateType.PREFAB;
        },
    })
    tmpPrefab: cc.Prefab | null = null;

    @property()
    _slideMode: SlideMode = SlideMode.NORMAL;

    @property({
        type: cc.Enum(SlideMode),
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
        visible(this: List) {
            return this._slideMode === SlideMode.PAGE;
        },
    })
    pageDistance = 0.3;

    @property({
        type: cc.Component.EventHandler,
        visible(this: List) {
            return this._slideMode === SlideMode.PAGE;
        },
    })
    pageChangeEvent = new cc.Component.EventHandler();

    @property()
    _virtual = true;

    @property({
        type: cc.Boolean,
    })
    get virtual(): boolean {
        return this._virtual;
    }

    set virtual(value: boolean) {
        if (value != null) {
            this._virtual = value;
        }
        if (this._numItems !== 0) {
            this._onScrolling();
        }
    }

    @property({
        visible(this: List) {
            const visible = this.slideMode === SlideMode.NORMAL;
            if (!visible) {
                this.cyclic = false;
            }
            return visible;
        },
    })
    cyclic = false;

    @property({
        visible(this: List) {
            return this.virtual;
        },
    })
    lackCenter = false;

    @property({
        visible(this: List) {
            const visible = this.virtual && !this.lackCenter;
            if (!visible) {
                this.lackSlide = false;
            }
            return visible;
        },
    })
    lackSlide = false;

    @property({
        type: cc.Integer,
    })
    _updateRate = 0;

    @property({
        type: cc.Integer,
        range: [0, 6, 1],
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

    @property({
        type: cc.Integer,
        range: [0, 12, 1],
        slide: true,
    })
    frameByFrameRenderNum = 0;

    @property({
        type: cc.Component.EventHandler,
    })
    renderEvent = new cc.Component.EventHandler();

    @property({
        type: cc.Enum(SelectedMode),
    })
    selectedMode: SelectedMode = SelectedMode.NONE;

    @property({
        visible(this: List) {
            return this.selectedMode === SelectedMode.SINGLE;
        },
    })
    repeatEventSingle = false;

    @property({
        type: cc.Component.EventHandler,
        visible(this: List) {
            return this.selectedMode > SelectedMode.NONE;
        },
    })
    selectedEvent = new cc.Component.EventHandler();

    @property({
        serializable: false,
    })
    _numItems = 0;

    _selectedId = -1;
    _forceUpdate = false;
    _updateDone = true;
    _inited = false;
    _needUpdateWidget = false;
    _aniDelRuning = false;
    _doneAfterUpdate = false;
    adhering = false;
    _adheringBarrier = false;
    curPageNum = 0;
    _scrollView: cc.ScrollView | null = null;
    content: cc.Node | null = null;
    _layout: cc.Layout | null = null;
    _align = 0;
    _resizeMode = 0;
    _startAxis = 0;
    _topGap = 0;
    _rightGap = 0;
    _bottomGap = 0;
    _leftGap = 0;
    _columnGap = 0;
    _lineGap = 0;
    _verticalDir = 0;
    _horizontalDir = 0;
    _itemTmp: cc.Node | null = null;
    _lastDisplayData: number[] = [];
    displayData: ItemPosData[] = [];
    _pool: cc.NodePool | null = null;
    _updateCounter = 0;
    _actualNumItems = 0;
    _lastSelectedId: number | null = null;
    multSelected: number[] = [];
    _itemSize = cc.size(0, 0);
    _alignCalcType = 0;
    _colLineNum = 1;
    _sizeType = false;
    _customSize: { [key: number]: number } | null = null;
    _allItemSize = 0;
    _allItemSizeNoEdge = 0;
    _cyclicPos1 = 0;
    _cyclicPos2 = 0;
    _cyclicNum = 0;
    _cyclicAllItemSize = 0;
    _cycilcAllItemSizeNoEdge = 0;
    _lack = false;
    frameCount: number | null = null;
    elasticLeft = 0;
    elasticRight = 0;
    elasticTop = 0;
    elasticBottom = 0;
    viewLeft = 0;
    viewRight = 0;
    viewTop = 0;
    viewBottom = 0;
    firstListId = 0;
    displayItemNum = 0;
    nearestListId: number | null = null;
    curScrollIsTouch = false;
    scrollToListId: number | null = null;
    _beganPos: number | null = null;
    _scrollItem: cc.Node | null = null;
    _scrollPos: number | null = null;
    _scrollToEndTime: number | null = null;
    _scrollToSo: (() => void) | null = null;
    _scrollToListId: number | null = null;
    _aniDelCB: ((index: number) => void) | null = null;
    _aniDelItem: cc.Node | null = null;
    _aniDelBeforePos: cc.Vec3 | null = null;
    _aniDelBeforeScale: number | null = null;

    get selectedId(): number {
        return this._selectedId;
    }

    set selectedId(value: number) {
        let item: cc.Node | null;
        switch (this.selectedMode) {
            case SelectedMode.SINGLE:
                if (!this.repeatEventSingle && value === this._selectedId) {
                    return;
                }
                item = this.getItemByListId(value);
                let listItem: ListItem | null = null;
                if (this._selectedId >= 0) {
                    this._lastSelectedId = this._selectedId;
                } else {
                    this._lastSelectedId = null;
                }
                this._selectedId = value;
                if (item) {
                    listItem = item.getComponent(ListItem);
                    if (listItem) {
                        listItem.selected = true;
                    }
                }
                if (this._lastSelectedId != null && this._lastSelectedId >= 0 && this._lastSelectedId !== this._selectedId) {
                    const lastItem = this.getItemByListId(this._lastSelectedId);
                    if (lastItem) {
                        const lastListItem = lastItem.getComponent(ListItem);
                        if (lastListItem) {
                            lastListItem.selected = false;
                        }
                    }
                }
                if (this.selectedEvent) {
                    cc.Component.EventHandler.emitEvents(
                        [this.selectedEvent],
                        item,
                        value % this._actualNumItems,
                        this._lastSelectedId == null ? null : this._lastSelectedId % this._actualNumItems
                    );
                }
                break;
            case SelectedMode.MULT:
                item = this.getItemByListId(value);
                if (!item) {
                    return;
                }
                listItem = item.getComponent(ListItem);
                if (!listItem) {
                    return;
                }
                if (this._selectedId >= 0) {
                    this._lastSelectedId = this._selectedId;
                }
                this._selectedId = value;
                const selected = !listItem.selected;
                listItem.selected = selected;
                const index = this.multSelected.indexOf(value);
                if (selected && index < 0) {
                    this.multSelected.push(value);
                } else if (!selected && index >= 0) {
                    this.multSelected.splice(index, 1);
                }
                if (this.selectedEvent) {
                    cc.Component.EventHandler.emitEvents(
                        [this.selectedEvent],
                        item,
                        value % this._actualNumItems,
                        this._lastSelectedId == null ? null : this._lastSelectedId % this._actualNumItems,
                        selected
                    );
                }
                break;
        }
    }

    get numItems(): number {
        return this._actualNumItems;
    }

    set numItems(value: number) {
        if (!this.checkInited(false)) {
            return;
        }
        if (value == null || value < 0) {
            cc.error("numItems set the wrong::", value);
            return;
        }
        this._actualNumItems = this._numItems = value;
        this._forceUpdate = true;
        if (this._virtual) {
            this._resizeContent();
            if (this.cyclic) {
                this._numItems = this._cyclicNum * this._numItems;
            }
            this._onScrolling();
            if (!this.frameByFrameRenderNum && this.slideMode === SlideMode.PAGE) {
                this.curPageNum = this.nearestListId!;
            }
        } else {
            if (this.cyclic) {
                this._resizeContent();
                this._numItems = this._cyclicNum * this._numItems;
            }
            const layout = this.content!.getComponent(cc.Layout);
            if (layout) {
                layout.enabled = true;
            }
            this._delRedundantItem();
            this.firstListId = 0;
            if (this.frameByFrameRenderNum > 0) {
                const count = this.frameByFrameRenderNum > this._numItems ?
                    this._numItems : this.frameByFrameRenderNum;
                for (let i = 0; i < count; i++) {
                    this._createOrUpdateItem2(i);
                }
                if (this.frameByFrameRenderNum < this._numItems) {
                    this._updateCounter = this.frameByFrameRenderNum;
                    this._updateDone = false;
                }
            } else {
                for (let i = 0; i < this._numItems; i++) {
                    this._createOrUpdateItem2(i);
                }
                this.displayItemNum = this._numItems;
            }
        }
    }

    get scrollView(): cc.ScrollView | null {
        return this._scrollView;
    }

    onLoad(): void {
        this._init();
    }

    onDestroy(): void {
        if (cc.isValid(this._itemTmp)) {
            this._itemTmp!.destroy();
        }
        if (cc.isValid(this.tmpNode)) {
            this.tmpNode!.destroy();
        }
        if (this._pool) {
            this._pool.clear();
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
                    delete (this as any)._aniDelBeforePos;
                }
                if (this._aniDelBeforeScale != null) {
                    this._aniDelItem.scale = this._aniDelBeforeScale;
                    delete (this as any)._aniDelBeforeScale;
                }
                delete (this as any)._aniDelItem;
            }
            if (this._aniDelCB) {
                (this._aniDelCB as any)();
                delete (this as any)._aniDelCB;
            }
        }
    }

    onDisable(): void {
        this._unregisterEvent();
    }

    _registerEvent(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this, true);
        this.node.on("touch-up", this._onTouchUp, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
        this.node.on("scroll-began", this._onScrollBegan, this, true);
        this.node.on("scroll-ended", this._onScrollEnded, this, true);
        this.node.on("scrolling", this._onScrolling, this, true);
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChanged, this);
    }

    _unregisterEvent(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this, true);
        this.node.off("touch-up", this._onTouchUp, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
        this.node.off("scroll-began", this._onScrollBegan, this, true);
        this.node.off("scroll-ended", this._onScrollEnded, this, true);
        this.node.off("scrolling", this._onScrolling, this, true);
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onSizeChanged, this);
    }

    _init(): void {
        if (this._inited) {
            return;
        }
        this._scrollView = this.node.getComponent(cc.ScrollView);
        this.content = this._scrollView!.content;
        if (this.content) {
            this._layout = this.content.getComponent(cc.Layout);
            this._align = this._layout!.type;
            this._resizeMode = this._layout!.resizeMode;
            this._startAxis = this._layout!.startAxis;
            this._topGap = this._layout!.paddingTop;
            this._rightGap = this._layout!.paddingRight;
            this._bottomGap = this._layout!.paddingBottom;
            this._leftGap = this._layout!.paddingLeft;
            this._columnGap = this._layout!.spacingX;
            this._lineGap = this._layout!.spacingY;
            this._verticalDir = this._layout!.verticalDirection;
            this._horizontalDir = this._layout!.horizontalDirection;
            this.setTemplateItem(cc.instantiate(
                this.templateType === TemplateType.PREFAB ? this.tmpPrefab : this.tmpNode
            ));
            const scrollViewAny = this._scrollView as any;
            if (this._slideMode === SlideMode.ADHERING || this._slideMode === SlideMode.PAGE) {
                this._scrollView!.inertia = false;
                scrollViewAny._onMouseWheel = () => {
                };
            }
            if (!this.virtual) {
                this.lackCenter = false;
            }
            this._lastDisplayData = [];
            this.displayData = [];
            this._pool = new cc.NodePool();
            this._forceUpdate = false;
            this._updateCounter = 0;
            this._updateDone = true;
            this.curPageNum = 0;
            if (this.cyclic) {
                scrollViewAny._processAutoScrolling = this._processAutoScrolling.bind(this);
                scrollViewAny._startBounceBackIfNeeded = () => false;
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
        } else {
            cc.error(this.node.name + "'s cc.ScrollView unset content!");
        }
    }

    _processAutoScrolling(dt: number): void {
        const scrollViewAny = this._scrollView as any;
        scrollViewAny._autoScrollAccumulatedTime += 1 * dt;
        let ratio = Math.min(1, scrollViewAny._autoScrollAccumulatedTime / scrollViewAny._autoScrollTotalTime);
        if (scrollViewAny._autoScrollAttenuate) {
            const t = ratio - 1;
            ratio = t * t * t * t * t + 1;
        }
        const newPos = scrollViewAny._autoScrollStartPosition.add(
            scrollViewAny._autoScrollTargetDelta.mul(ratio)
        );
        const endedTiming = this._scrollView!.getScrollEndedEventTiming();
        const reachedEnd = Math.abs(ratio - 1) <= endedTiming;
        if (Math.abs(ratio - 1) <= this._scrollView!.getScrollEndedEventTiming() &&
            !scrollViewAny._isScrollEndedWithThresholdEventFired) {
            scrollViewAny._dispatchEvent("scroll-ended-with-threshold");
            scrollViewAny._isScrollEndedWithThresholdEventFired = true;
        }
        if (reachedEnd) {
            scrollViewAny._autoScrolling = false;
        }
        const delta = newPos.sub(this._scrollView!.getContentPosition());
        scrollViewAny._moveContent(this._scrollView!._clampDelta(delta), reachedEnd);
        scrollViewAny._dispatchEvent("scrolling");
        if (!scrollViewAny._autoScrolling) {
            scrollViewAny._isBouncing = false;
            scrollViewAny._scrolling = false;
            scrollViewAny._dispatchEvent("scroll-ended");
        }
    }

    setTemplateItem(item: cc.Node): void {
        if (!item) {
            return;
        }
        this._itemTmp = item;
        if (this._resizeMode === cc.Layout.ResizeMode.CHILDREN) {
            this._itemSize = this._layout!.cellSize;
        } else {
            this._itemSize = cc.size(item.width, item.height);
        }
        let listItem = item.getComponent(ListItem);
        let missingListItem = false;
        if (!listItem) {
            missingListItem = true;
        }
        if (missingListItem) {
            this.selectedMode = SelectedMode.NONE;
        }
        const widget = item.getComponent(cc.Widget);
        if (widget && widget.enabled) {
            this._needUpdateWidget = true;
        }
        if (this.selectedMode === SelectedMode.MULT) {
            this.multSelected = [];
        }
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
                        const width = this.content!.width - this._leftGap - this._rightGap;
                        this._colLineNum = Math.floor((width + this._columnGap) / (this._itemSize.width + this._columnGap));
                        this._sizeType = true;
                        break;
                    }
                    case cc.Layout.AxisDirection.VERTICAL: {
                        const height = this.content!.height - this._topGap - this._bottomGap;
                        this._colLineNum = Math.floor((height + this._lineGap) / (this._itemSize.height + this._lineGap));
                        this._sizeType = false;
                        break;
                    }
                }
                break;
        }
    }

    checkInited(showError = true): boolean {
        if (this._inited) {
            return true;
        }
        if (showError) {
            cc.error("List initialization not completed!");
        }
        return false;
    }

    _resizeContent(): void {
        let size = 0;
        switch (this._align) {
            case cc.Layout.Type.HORIZONTAL:
                if (this._customSize) {
                    const fixed = this._getFixedSize(null)!;
                    size = this._leftGap + fixed.val + this._itemSize.width * (this._numItems - fixed.count) +
                        this._columnGap * (this._numItems - 1) + this._rightGap;
                } else {
                    size = this._leftGap + this._itemSize.width * this._numItems +
                        this._columnGap * (this._numItems - 1) + this._rightGap;
                }
                break;
            case cc.Layout.Type.VERTICAL:
                if (this._customSize) {
                    const fixed = this._getFixedSize(null)!;
                    size = this._topGap + fixed.val + this._itemSize.height * (this._numItems - fixed.count) +
                        this._lineGap * (this._numItems - 1) + this._bottomGap;
                } else {
                    size = this._topGap + this._itemSize.height * this._numItems +
                        this._lineGap * (this._numItems - 1) + this._bottomGap;
                }
                break;
            case cc.Layout.Type.GRID:
                if (this.lackCenter) {
                    this.lackCenter = false;
                }
                switch (this._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL: {
                        const rowCount = Math.ceil(this._numItems / this._colLineNum);
                        size = this._topGap + this._itemSize.height * rowCount + this._lineGap * (rowCount - 1) + this._bottomGap;
                        break;
                    }
                    case cc.Layout.AxisDirection.VERTICAL: {
                        const colCount = Math.ceil(this._numItems / this._colLineNum);
                        size = this._leftGap + this._itemSize.width * colCount + this._columnGap * (colCount - 1) + this._rightGap;
                        break;
                    }
                }
                break;
        }
        const layout = this.content!.getComponent(cc.Layout);
        if (layout) {
            layout.enabled = false;
        }
        this._allItemSize = size;
        this._allItemSizeNoEdge = this._allItemSize -
            (this._sizeType ? this._topGap + this._bottomGap : this._leftGap + this._rightGap);
        if (this.cyclic) {
            const viewSize = this._sizeType ? this.node.height : this.node.width;
            this._cyclicPos1 = 0;
            const remain = viewSize - this._cyclicPos1;
            this._cyclicNum = Math.ceil(remain / this._allItemSizeNoEdge) + 1;
            const gap = this._sizeType ? this._lineGap : this._columnGap;
            this._cyclicPos2 = this._cyclicPos1 + this._allItemSizeNoEdge + gap;
            this._cyclicAllItemSize = this._allItemSize + this._allItemSizeNoEdge * (this._cyclicNum - 1) + gap * (this._cyclicNum - 1);
            this._cycilcAllItemSizeNoEdge = this._allItemSizeNoEdge * this._cyclicNum;
            this._cycilcAllItemSizeNoEdge += gap * (this._cyclicNum - 1);
        }
        this._lack = !this.cyclic && this._allItemSize < (this._sizeType ? this.node.height : this.node.width);
        const lackOffset = this._lack && this.lackCenter || !this.lackSlide ? 0.1 : 0;
        let contentSize = this._lack ?
            (this._sizeType ? this.node.height : this.node.width) - lackOffset :
            this.cyclic ? this._cyclicAllItemSize : this._allItemSize;
        if (contentSize < 0) {
            contentSize = 0;
        }
        if (this._sizeType) {
            this.content!.height = contentSize;
        } else {
            this.content!.width = contentSize;
        }
    }

    _onScrolling(event: cc.Event | null = null): void {
        if (this.frameCount == null) {
            this.frameCount = this._updateRate;
        }
        if (!this._forceUpdate && event && event.type !== "scroll-ended" && this.frameCount > 0) {
            this.frameCount--;
        } else {
            this.frameCount = this._updateRate;
            if (!this._aniDelRuning) {
                if (this.cyclic) {
                    const contentPos = this.content!.getPosition();
                    let pos = this._sizeType ? contentPos.y : contentPos.x;
                    const step = this._allItemSizeNoEdge + (this._sizeType ? this._lineGap : this._columnGap);
                    const offset = this._sizeType ? cc.v2(0, step) : cc.v2(step, 0);
                    const scrollViewAny = this._scrollView as any;
                    switch (this._alignCalcType) {
                        case 1:
                            if (pos > -this._cyclicPos1) {
                                this.content!.x = -this._cyclicPos2;
                                if (this._scrollView!.isAutoScrolling()) {
                                    scrollViewAny._autoScrollStartPosition =
                                        scrollViewAny._autoScrollStartPosition.sub(offset);
                                }
                            } else if (pos < -this._cyclicPos2) {
                                this.content!.x = -this._cyclicPos1;
                                if (this._scrollView!.isAutoScrolling()) {
                                    scrollViewAny._autoScrollStartPosition =
                                        scrollViewAny._autoScrollStartPosition.add(offset);
                                }
                            }
                            break;
                        case 2:
                            if (pos < this._cyclicPos1) {
                                this.content!.x = this._cyclicPos2;
                                if (this._scrollView!.isAutoScrolling()) {
                                    scrollViewAny._autoScrollStartPosition =
                                        scrollViewAny._autoScrollStartPosition.add(offset);
                                }
                            } else if (pos > this._cyclicPos2) {
                                this.content!.x = this._cyclicPos1;
                                if (this._scrollView!.isAutoScrolling()) {
                                    scrollViewAny._autoScrollStartPosition =
                                        scrollViewAny._autoScrollStartPosition.sub(offset);
                                }
                            }
                            break;
                        case 3:
                            if (pos < this._cyclicPos1) {
                                this.content!.y = this._cyclicPos2;
                                if (this._scrollView!.isAutoScrolling()) {
                                    scrollViewAny._autoScrollStartPosition =
                                        scrollViewAny._autoScrollStartPosition.add(offset);
                                }
                            } else if (pos > this._cyclicPos2) {
                                this.content!.y = this._cyclicPos1;
                                if (this._scrollView!.isAutoScrolling()) {
                                    scrollViewAny._autoScrollStartPosition =
                                        scrollViewAny._autoScrollStartPosition.sub(offset);
                                }
                            }
                            break;
                        case 4:
                            if (pos > -this._cyclicPos1) {
                                this.content!.y = -this._cyclicPos2;
                                if (this._scrollView!.isAutoScrolling()) {
                                    scrollViewAny._autoScrollStartPosition =
                                        scrollViewAny._autoScrollStartPosition.sub(offset);
                                }
                            } else if (pos < -this._cyclicPos2) {
                                this.content!.y = -this._cyclicPos1;
                                if (this._scrollView!.isAutoScrolling()) {
                                    scrollViewAny._autoScrollStartPosition =
                                        scrollViewAny._autoScrollStartPosition.add(offset);
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
                    let itemPos: ItemPosData;
                    let start = 0;
                    let end = this._numItems - 1;
                    if (this._customSize) {
                        let done = false;
                        for (; start <= end && !done; start++) {
                            itemPos = this._calcItemPos(start);
                            switch (this._align) {
                                case cc.Layout.Type.HORIZONTAL:
                                    if (itemPos.right! >= viewLeft! && itemPos.left! <= viewRight!) {
                                        this.displayData.push(itemPos);
                                    } else if (start !== 0 && this.displayData.length > 0) {
                                        done = true;
                                    }
                                    break;
                                case cc.Layout.Type.VERTICAL:
                                    if (itemPos.bottom! <= viewTop! && itemPos.top! >= viewBottom!) {
                                        this.displayData.push(itemPos);
                                    } else if (start !== 0 && this.displayData.length > 0) {
                                        done = true;
                                    }
                                    break;
                                case cc.Layout.Type.GRID:
                                    switch (this._startAxis) {
                                        case cc.Layout.AxisDirection.HORIZONTAL:
                                            if (itemPos.bottom! <= viewTop! && itemPos.top! >= viewBottom!) {
                                                this.displayData.push(itemPos);
                                            } else if (start !== 0 && this.displayData.length > 0) {
                                                done = true;
                                            }
                                            break;
                                        case cc.Layout.AxisDirection.VERTICAL:
                                            if (itemPos.right! >= viewLeft! && itemPos.left! <= viewRight!) {
                                                this.displayData.push(itemPos);
                                            } else if (start !== 0 && this.displayData.length > 0) {
                                                done = true;
                                            }
                                            break;
                                    }
                                    break;
                            }
                        }
                    } else {
                        const widthStep = this._itemSize.width + this._columnGap;
                        const heightStep = this._itemSize.height + this._lineGap;
                        switch (this._alignCalcType) {
                            case 1:
                                start = (viewLeft! - this._leftGap) / widthStep;
                                end = (viewRight! - this._leftGap) / widthStep;
                                break;
                            case 2:
                                start = (-viewRight! - this._rightGap) / widthStep;
                                end = (-viewLeft! - this._rightGap) / widthStep;
                                break;
                            case 3:
                                start = (-viewTop! - this._topGap) / heightStep;
                                end = (-viewBottom! - this._topGap) / heightStep;
                                break;
                            case 4:
                                start = (viewBottom! - this._bottomGap) / heightStep;
                                end = (viewTop! - this._bottomGap) / heightStep;
                                break;
                        }
                        start = Math.floor(start) * this._colLineNum;
                        end = Math.ceil(end) * this._colLineNum;
                        if (start < 0) {
                            start = 0;
                        }
                        --end;
                        if (end >= this._numItems) {
                            end = this._numItems - 1;
                        }
                        for (; start <= end; start++) {
                            this.displayData.push(this._calcItemPos(start));
                        }
                    }
                    this._delRedundantItem();
                    if (this.displayData.length <= 0 || !this._numItems) {
                        this._lastDisplayData = [];
                        return;
                    }
                    this.firstListId = this.displayData[0].id;
                    this.displayItemNum = this.displayData.length;
                    const lastCount = this._lastDisplayData.length;
                    let changed = this.displayItemNum !== lastCount;
                    if (changed) {
                        if (this.frameByFrameRenderNum > 0) {
                            this._lastDisplayData.sort((a, b) => a - b);
                        }
                        changed = this.firstListId !== this._lastDisplayData[0] ||
                            this.displayData[this.displayItemNum - 1].id !== this._lastDisplayData[lastCount - 1];
                    }
                    if (this._forceUpdate || changed) {
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
                            for (let i = 0; i < this.displayItemNum; i++) {
                                this._createOrUpdateItem(this.displayData[i]);
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
        const pos = this.content!.getPosition();
        switch (this._alignCalcType) {
            case 1:
                this.elasticLeft = pos.x > 0 ? pos.x : 0;
                this.viewLeft = (pos.x < 0 ? -pos.x : 0) - this.elasticLeft;
                this.viewRight = this.viewLeft + this.node.width;
                this.elasticRight = this.viewRight > this.content!.width ?
                    Math.abs(this.viewRight - this.content!.width) : 0;
                this.viewRight += this.elasticRight;
                break;
            case 2:
                this.elasticRight = pos.x < 0 ? -pos.x : 0;
                this.viewRight = (pos.x > 0 ? -pos.x : 0) + this.elasticRight;
                this.viewLeft = this.viewRight - this.node.width;
                this.elasticLeft = this.viewLeft < -this.content!.width ?
                    Math.abs(this.viewLeft + this.content!.width) : 0;
                this.viewLeft -= this.elasticLeft;
                break;
            case 3:
                this.elasticTop = pos.y < 0 ? Math.abs(pos.y) : 0;
                this.viewTop = (pos.y > 0 ? -pos.y : 0) + this.elasticTop;
                this.viewBottom = this.viewTop - this.node.height;
                this.elasticBottom = this.viewBottom < -this.content!.height ?
                    Math.abs(this.viewBottom + this.content!.height) : 0;
                this.viewBottom += this.elasticBottom;
                break;
            case 4:
                this.elasticBottom = pos.y > 0 ? Math.abs(pos.y) : 0;
                this.viewBottom = (pos.y < 0 ? -pos.y : 0) - this.elasticBottom;
                this.viewTop = this.viewBottom + this.node.height;
                this.elasticTop = this.viewTop > this.content!.height ?
                    Math.abs(this.viewTop - this.content!.height) : 0;
                this.viewTop -= this.elasticTop;
                break;
        }
    }

    _calcItemPos(index: number): ItemPosData {
        let left = 0;
        let right = 0;
        let top = 0;
        let bottom = 0;
        let x = 0;
        let y = 0;
        let width = 0;
        let height = 0;
        switch (this._align) {
            case cc.Layout.Type.HORIZONTAL:
                switch (this._horizontalDir) {
                    case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                        if (this._customSize) {
                            const fixed = this._getFixedSize(index)!;
                            left = this._leftGap + (this._itemSize.width + this._columnGap) * (index - fixed.count) +
                                (fixed.val + this._columnGap * fixed.count);
                            width = this._customSize[index] > 0 ? this._customSize[index] : this._itemSize.width;
                        } else {
                            left = this._leftGap + (this._itemSize.width + this._columnGap) * index;
                            width = this._itemSize.width;
                        }
                        if (this.lackCenter) {
                            left -= this._leftGap;
                            left += this.content!.width / 2 - this._allItemSizeNoEdge / 2;
                        }
                        return {
                            id: index,
                            left,
                            right: right = left + width,
                            x: left + this._itemTmp!.anchorX * width,
                            y: this._itemTmp!.y,
                        };
                    case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                        if (this._customSize) {
                            const fixed = this._getFixedSize(index)!;
                            right = -this._rightGap - (this._itemSize.width + this._columnGap) * (index - fixed.count) -
                                (fixed.val + this._columnGap * fixed.count);
                            width = this._customSize[index] > 0 ? this._customSize[index] : this._itemSize.width;
                        } else {
                            right = -this._rightGap - (this._itemSize.width + this._columnGap) * index;
                            width = this._itemSize.width;
                        }
                        if (this.lackCenter) {
                            right += this._rightGap;
                            right -= this.content!.width / 2 - this._allItemSizeNoEdge / 2;
                        }
                        return {
                            id: index,
                            right,
                            left: left = right - width,
                            x: left + this._itemTmp!.anchorX * width,
                            y: this._itemTmp!.y,
                        };
                }
                break;
            case cc.Layout.Type.VERTICAL:
                switch (this._verticalDir) {
                    case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                        if (this._customSize) {
                            const fixed = this._getFixedSize(index)!;
                            top = -this._topGap - (this._itemSize.height + this._lineGap) * (index - fixed.count) -
                                (fixed.val + this._lineGap * fixed.count);
                            height = this._customSize[index] > 0 ? this._customSize[index] : this._itemSize.height;
                        } else {
                            top = -this._topGap - (this._itemSize.height + this._lineGap) * index;
                            height = this._itemSize.height;
                        }
                        if (this.lackCenter) {
                            top += this._topGap;
                            top -= this.content!.height / 2 - this._allItemSizeNoEdge / 2;
                        }
                        return {
                            id: index,
                            top,
                            bottom: bottom = top - height,
                            x: this._itemTmp!.x,
                            y: bottom + this._itemTmp!.anchorY * height,
                        };
                    case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                        if (this._customSize) {
                            const fixed = this._getFixedSize(index)!;
                            bottom = this._bottomGap + (this._itemSize.height + this._lineGap) * (index - fixed.count) +
                                (fixed.val + this._lineGap * fixed.count);
                            height = this._customSize[index] > 0 ? this._customSize[index] : this._itemSize.height;
                        } else {
                            bottom = this._bottomGap + (this._itemSize.height + this._lineGap) * index;
                            height = this._itemSize.height;
                        }
                        if (this.lackCenter) {
                            bottom -= this._bottomGap;
                            bottom += this.content!.height / 2 - this._allItemSizeNoEdge / 2;
                        }
                        return {
                            id: index,
                            top: top = bottom + height,
                            bottom,
                            x: this._itemTmp!.x,
                            y: bottom + this._itemTmp!.anchorY * height,
                        };
                }
                break;
            case cc.Layout.Type.GRID: {
                const lineIndex = Math.floor(index / this._colLineNum);
                switch (this._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL:
                        switch (this._verticalDir) {
                            case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                                y = (bottom = (top = -this._topGap - (this._itemSize.height + this._lineGap) * lineIndex) -
                                    this._itemSize.height) + this._itemTmp!.anchorY * this._itemSize.height;
                                break;
                            case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                                top = (bottom = this._bottomGap + (this._itemSize.height + this._lineGap) * lineIndex) +
                                    this._itemSize.height;
                                y = bottom + this._itemTmp!.anchorY * this._itemSize.height;
                                break;
                        }
                        x = this._leftGap + index % this._colLineNum * (this._itemSize.width + this._columnGap);
                        switch (this._horizontalDir) {
                            case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                                x += this._itemTmp!.anchorX * this._itemSize.width;
                                x -= this.content!.anchorX * this.content!.width;
                                break;
                            case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                                x += (1 - this._itemTmp!.anchorX) * this._itemSize.width;
                                x -= (1 - this.content!.anchorX) * this.content!.width;
                                x *= -1;
                                break;
                        }
                        return { id: index, top, bottom, x, y };
                    case cc.Layout.AxisDirection.VERTICAL:
                        switch (this._horizontalDir) {
                            case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                                right = (left = this._leftGap + (this._itemSize.width + this._columnGap) * lineIndex) +
                                    this._itemSize.width;
                                x = left + this._itemTmp!.anchorX * this._itemSize.width;
                                x -= this.content!.anchorX * this.content!.width;
                                break;
                            case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                                x = (left = (right = -this._rightGap - (this._itemSize.width + this._columnGap) * lineIndex) -
                                    this._itemSize.width) + this._itemTmp!.anchorX * this._itemSize.width;
                                x += (1 - this.content!.anchorX) * this.content!.width;
                                break;
                        }
                        y = -this._topGap - index % this._colLineNum * (this._itemSize.height + this._lineGap);
                        switch (this._verticalDir) {
                            case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                                y -= (1 - this._itemTmp!.anchorY) * this._itemSize.height;
                                y += (1 - this.content!.anchorY) * this.content!.height;
                                break;
                            case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                                y -= this._itemTmp!.anchorY * this._itemSize.height;
                                y += this.content!.anchorY * this.content!.height;
                                y *= -1;
                                break;
                        }
                        return { id: index, left, right, x, y };
                }
                break;
            }
        }
        return { id: index, x, y };
    }

    _calcExistItemPos(index: number): ItemPosData | null {
        const item = this.getItemByListId(index);
        if (!item) {
            return null;
        }
        const pos: ItemPosData = {
            id: index,
            x: item.x,
            y: item.y,
        };
        if (this._sizeType) {
            pos.top = item.y + item.height * (1 - item.anchorY);
            pos.bottom = item.y - item.height * item.anchorY;
        } else {
            pos.left = item.x - item.width * item.anchorX;
            pos.right = item.x + item.width * (1 - item.anchorX);
        }
        return pos;
    }

    getItemPos(index: number): ItemPosData | null {
        if (this._virtual) {
            return this._calcItemPos(index);
        }
        if (this.frameByFrameRenderNum) {
            return this._calcItemPos(index);
        }
        return this._calcExistItemPos(index);
    }

    _getFixedSize(index: number | null): FixedSizeResult | null {
        if (!this._customSize) {
            return null;
        }
        if (index == null) {
            index = this._numItems;
        }
        let val = 0;
        let count = 0;
        for (const key in this._customSize) {
            if (parseInt(key) < index!) {
                val += this._customSize[key];
                count++;
            }
        }
        return { val, count };
    }

    _onScrollBegan(): void {
        this._beganPos = this._sizeType ? this.viewTop : this.viewLeft;
    }

    _onScrollEnded(): void {
        this.curScrollIsTouch = false;
        if (this.scrollToListId != null) {
            const item = this.getItemByListId(this.scrollToListId);
            this.scrollToListId = null;
            if (item) {
                cc.tween(item).to(0.1, { scale: 1.06 }).to(0.1, { scale: 1 }).start();
            }
        }
        this._onScrolling();
        if (this._slideMode !== SlideMode.ADHERING || this.adhering) {
            if (this._slideMode === SlideMode.PAGE) {
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

    _onTouchStart(event: cc.Event.EventTouch, captureListeners?: any): void {
        if (!this._scrollView!.hasNestedViewGroup(event, captureListeners) &&
            (this.curScrollIsTouch = true, event.eventPhase !== cc.Event.AT_TARGET || event.target !== this.node)) {
            let target: any = event.target;
            while (target._listId == null && target.parent) {
                target = target.parent;
            }
            this._scrollItem = target._listId != null ? target : event.target as cc.Node;
        }
    }

    _onTouchUp(): void {
        this._scrollPos = null;
        if (this._slideMode === SlideMode.ADHERING) {
            if (this.adhering) {
                this._adheringBarrier = true;
            }
            this.adhere();
        } else if (this._slideMode === SlideMode.PAGE) {
            if (this._beganPos != null) {
                this._pageAdhere();
            } else {
                this.adhere();
            }
        }
        this._scrollItem = null;
    }

    _onTouchCancelled(event: cc.Event.EventTouch, captureListeners?: any): void {
        if (!this._scrollView!.hasNestedViewGroup(event, captureListeners) && !event.simulate) {
            this._scrollPos = null;
            if (this._slideMode === SlideMode.ADHERING) {
                if (this.adhering) {
                    this._adheringBarrier = true;
                }
                this.adhere();
            } else if (this._slideMode === SlideMode.PAGE) {
                if (this._beganPos != null) {
                    this._pageAdhere();
                } else {
                    this.adhere();
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
        if ((!this._sizeType && node.width !== this._itemSize.width) ||
            (this._sizeType && node.height !== this._itemSize.height)) {
            if (!this._customSize) {
                this._customSize = {};
            }
            const size = this._sizeType ? node.height : node.width;
            const listId = (node as any)._listId;
            if (this._customSize[listId] !== size) {
                this._customSize[listId] = size;
                this._resizeContent();
                this.updateAll();
                if (this._scrollToListId != null) {
                    this._scrollPos = null;
                    this.unschedule(this._scrollToSo as any);
                    this.scrollTo(
                        this._scrollToListId,
                        Math.max(0, this._scrollToEndTime! - new Date().getTime() / 1000)
                    );
                }
            }
        }
    }

    _pageAdhere(): void {
        if (this.cyclic ||
            !(this.elasticTop > 0 || this.elasticRight > 0 || this.elasticBottom > 0 || this.elasticLeft > 0)) {
            const currentPos = this._sizeType ? this.viewTop : this.viewLeft;
            const threshold = (this._sizeType ? this.node.height : this.node.width) * this.pageDistance;
            if (Math.abs(this._beganPos! - currentPos) > threshold) {
                switch (this._alignCalcType) {
                    case 1:
                    case 4:
                        if (this._beganPos! > currentPos) {
                            this.prePage(0.5);
                        } else {
                            this.nextPage(0.5);
                        }
                        break;
                    case 2:
                    case 3:
                        if (this._beganPos! < currentPos) {
                            this.prePage(0.5);
                        } else {
                            this.nextPage(0.5);
                        }
                        break;
                }
            } else if (this.elasticTop <= 0 && this.elasticRight <= 0 &&
                this.elasticBottom <= 0 && this.elasticLeft <= 0) {
                this.adhere();
            }
            this._beganPos = null;
        }
    }

    adhere(): void {
        if (this.checkInited() &&
            !(this.elasticTop > 0 || this.elasticRight > 0 || this.elasticBottom > 0 || this.elasticLeft > 0)) {
            this.adhering = true;
            this._calcNearestItem();
            const offset = (this._sizeType ? this._topGap : this._leftGap) /
                (this._sizeType ? this.node.height : this.node.width);
            this.scrollTo(this.nearestListId!, 0.7, offset);
        }
    }

    update(): void {
        if (this.frameByFrameRenderNum <= 0 || this._updateDone) {
            return;
        }
        if (this._virtual) {
            const end = this._updateCounter + this.frameByFrameRenderNum > this.displayItemNum ?
                this.displayItemNum : this._updateCounter + this.frameByFrameRenderNum;
            for (let i = this._updateCounter; i < end; i++) {
                const data = this.displayData[i];
                if (data) {
                    this._createOrUpdateItem(data);
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
                    if (this.slideMode === SlideMode.PAGE) {
                        this.curPageNum = this.nearestListId!;
                    }
                }
            } else {
                this._updateCounter += this.frameByFrameRenderNum;
            }
        } else if (this._updateCounter < this._numItems) {
            const end = this._updateCounter + this.frameByFrameRenderNum > this._numItems ?
                this._numItems : this._updateCounter + this.frameByFrameRenderNum;
            for (let i = this._updateCounter; i < end; i++) {
                this._createOrUpdateItem2(i);
            }
            this._updateCounter += this.frameByFrameRenderNum;
        } else {
            this._updateDone = true;
            this._calcNearestItem();
            if (this.slideMode === SlideMode.PAGE) {
                this.curPageNum = this.nearestListId!;
            }
        }
    }

    _createOrUpdateItem(data: ItemPosData): void {
        let item = this.getItemByListId(data.id);
        if (item) {
            if (this._forceUpdate && this.renderEvent) {
                item.setPosition(cc.v2(data.x, data.y));
                this._resetItemSize(item);
                cc.Component.EventHandler.emitEvents([this.renderEvent], item, data.id % this._actualNumItems);
            }
        } else {
            let fromPool = this._pool!.size() > 0;
            item = fromPool ? this._pool!.get() : cc.instantiate(this._itemTmp);
            if (!fromPool || !cc.isValid(item)) {
                item = cc.instantiate(this._itemTmp);
                fromPool = false;
            }
            if ((item as any)._listId !== data.id) {
                (item as any)._listId = data.id;
                item.setContentSize(this._itemSize);
            }
            item.setPosition(cc.v2(data.x, data.y));
            this._resetItemSize(item);
            this.content!.addChild(item);
            if (fromPool && this._needUpdateWidget) {
                const widget = item.getComponent(cc.Widget);
                if (widget) {
                    widget.updateAlignment();
                }
            }
            item.setSiblingIndex(this.content!.childrenCount - 1);
            const listItem = item.getComponent(ListItem);
            (item as any).listItem = listItem;
            if (listItem) {
                listItem.listId = data.id;
                listItem.list = this;
                listItem._registerEvent();
            }
            if (this.renderEvent) {
                cc.Component.EventHandler.emitEvents([this.renderEvent], item, data.id % this._actualNumItems);
            }
        }
        this._resetItemSize(item);
        this._updateListItem((item as any).listItem);
        if (this._lastDisplayData.indexOf(data.id) < 0) {
            this._lastDisplayData.push(data.id);
        }
    }

    _createOrUpdateItem2(index: number): void {
        let listItem: ListItem | null = null;
        let item = this.content!.children[index];
        if (item) {
            if (this._forceUpdate && this.renderEvent) {
                (item as any)._listId = index;
                if (listItem) {
                    listItem.listId = index;
                }
                cc.Component.EventHandler.emitEvents([this.renderEvent], item, index % this._actualNumItems);
            }
        } else {
            item = cc.instantiate(this._itemTmp);
            (item as any)._listId = index;
            this.content!.addChild(item);
            listItem = item.getComponent(ListItem);
            (item as any).listItem = listItem;
            if (listItem) {
                listItem.listId = index;
                listItem.list = this;
                listItem._registerEvent();
            }
            if (this.renderEvent) {
                cc.Component.EventHandler.emitEvents([this.renderEvent], item, index % this._actualNumItems);
            }
        }
        this._updateListItem(listItem);
        if (this._lastDisplayData.indexOf(index) < 0) {
            this._lastDisplayData.push(index);
        }
    }

    _updateListItem(listItem: ListItem | null): void {
        if (listItem && this.selectedMode > SelectedMode.NONE) {
            const node = listItem.node;
            switch (this.selectedMode) {
                case SelectedMode.SINGLE:
                    listItem.selected = this.selectedId === (node as any)._listId;
                    break;
                case SelectedMode.MULT:
                    listItem.selected = this.multSelected.indexOf((node as any)._listId) >= 0;
                    break;
            }
        }
    }

    _resetItemSize(_item?: cc.Node): void {
    }

    _updateItemPos(itemOrId: cc.Node | number): void {
        const item = isNaN(itemOrId as number) ? itemOrId as cc.Node : this.getItemByListId(itemOrId as number)!;
        const pos = this.getItemPos((item as any)._listId)!;
        item.setPosition(pos.x, pos.y);
    }

    setMultSelected(ids: number | number[], selected?: boolean): void {
        if (!this.checkInited()) {
            return;
        }
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        if (selected == null) {
            this.multSelected = ids as number[];
        } else {
            let index = 0;
            if (selected) {
                for (let i = ids.length - 1; i >= 0; i--) {
                    const id = ids[i];
                    if (this.multSelected.indexOf(id) < 0) {
                        this.multSelected.push(id);
                    }
                }
            } else {
                for (let i = ids.length - 1; i >= 0; i--) {
                    const id = ids[i];
                    index = this.multSelected.indexOf(id);
                    if (index >= 0) {
                        this.multSelected.splice(index, 1);
                    }
                }
            }
        }
        this._forceUpdate = true;
        this._onScrolling();
    }

    getMultSelected(): number[] {
        return this.multSelected;
    }

    hasMultSelected(id: number): boolean {
        return !!(this.multSelected && this.multSelected.indexOf(id) >= 0);
    }

    updateItem(ids: number | number[]): void {
        if (!this.checkInited()) {
            return;
        }
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const item = this.getItemByListId(id);
            if (item) {
                cc.Component.EventHandler.emitEvents([this.renderEvent], item, id % this._actualNumItems);
            }
        }
    }

    updateAll(): void {
        if (this.checkInited()) {
            this.numItems = this.numItems;
        }
    }

    getItemByListId(id: number): cc.Node | null {
        if (this.content) {
            for (let i = this.content.childrenCount - 1; i >= 0; i--) {
                const item = this.content.children[i];
                if ((item as any)._listId === id) {
                    return item;
                }
            }
        }
        return null;
    }

    _getOutsideItem(): cc.Node[] {
        const result: cc.Node[] = [];
        for (let i = this.content!.childrenCount - 1; i >= 0; i--) {
            const item = this.content!.children[i];
            if (!this.displayData.find((data) => data.id === (item as any)._listId)) {
                result.push(item);
            }
        }
        return result;
    }

    _delRedundantItem(): void {
        if (this._virtual) {
            const outsideItems = this._getOutsideItem();
            for (let i = outsideItems.length - 1; i >= 0; i--) {
                const item = outsideItems[i];
                if (!this._scrollItem || (item as any)._listId !== (this._scrollItem as any)._listId) {
                    (item as any).isCached = true;
                    this._pool!.put(item);
                    for (let j = this._lastDisplayData.length - 1; j >= 0; j--) {
                        if (this._lastDisplayData[j] === (item as any)._listId) {
                            this._lastDisplayData.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        } else {
            while (this.content!.childrenCount > this._numItems) {
                this._delSingleItem(this.content!.children[this.content!.childrenCount - 1]);
            }
        }
    }

    _delSingleItem(node: cc.Node): void {
        node.removeFromParent();
        if (node.destroy) {
            node.destroy();
        }
    }

    aniDelItem(index: number, callback: (index: number) => void, aniType?: number): void {
        if (!this.checkInited() || this.cyclic || !this._virtual) {
            cc.error("This function is not allowed to be called!");
            return;
        }
        if (!callback) {
            cc.error("CallFunc are not allowed to be NULL, You need to delete the corresponding index in the data array in the CallFunc!");
            return;
        }
        if (this._aniDelRuning) {
            cc.warn("Please wait for the current deletion to finish!");
            return;
        }
        const item = this.getItemByListId(index);
        if (item) {
            const listItem = item.getComponent(ListItem)!;
            this._aniDelRuning = true;
            this._aniDelCB = callback;
            this._aniDelItem = item;
            this._aniDelBeforePos = item.position;
            this._aniDelBeforeScale = item.scale;
            const lastDisplayId = this.displayData[this.displayData.length - 1].id;
            const wasSelected = listItem.selected;
            listItem.showAni(aniType!, () => {
                let nextId: number | undefined;
                if (lastDisplayId < this._numItems - 2) {
                    nextId = lastDisplayId + 1;
                }
                if (nextId != null) {
                    const pos = this._calcItemPos(nextId);
                    this.displayData.push(pos);
                    if (this._virtual) {
                        this._createOrUpdateItem(pos);
                    } else {
                        this._createOrUpdateItem2(nextId);
                    }
                } else {
                    this._numItems--;
                }
                if (this.selectedMode === SelectedMode.SINGLE) {
                    if (wasSelected) {
                        this._selectedId = -1;
                    } else if (this._selectedId - 1 >= 0) {
                        this._selectedId--;
                    }
                } else if (this.selectedMode === SelectedMode.MULT && this.multSelected.length) {
                    const selectedIndex = this.multSelected.indexOf(index);
                    if (selectedIndex >= 0) {
                        this.multSelected.splice(selectedIndex, 1);
                    }
                    for (let i = this.multSelected.length - 1; i >= 0; i--) {
                        const selectedId = this.multSelected[i];
                        if (selectedId >= index) {
                            this.multSelected[i]--;
                        }
                    }
                }
                if (this._customSize) {
                    if (this._customSize[index]) {
                        delete this._customSize[index];
                    }
                    const newCustomSize: { [key: number]: number } = {};
                    for (const key in this._customSize) {
                        const value = this._customSize[key];
                        const parsedKey = parseInt(key);
                        newCustomSize[parsedKey - (parsedKey >= index ? 1 : 0)] = value;
                    }
                    this._customSize = newCustomSize;
                }
                let hasCallbackTween = false;
                for (let i = nextId != null ? nextId : lastDisplayId; i >= index + 1; i--) {
                    const movingItem = this.getItemByListId(i);
                    if (movingItem) {
                        const targetPos = this._calcItemPos(i - 1);
                        const tween = cc.tween(movingItem).to(0.2333, {
                            position: cc.v2(targetPos.x, targetPos.y),
                        });
                        if (i <= index + 1) {
                            hasCallbackTween = true;
                            tween.call(() => {
                                this._aniDelRuning = false;
                                callback(index);
                                delete (this as any)._aniDelCB;
                            });
                        }
                        tween.start();
                    }
                }
                if (!hasCallbackTween) {
                    this._aniDelRuning = false;
                    callback(index);
                    this._aniDelCB = null;
                }
            }, true);
        } else {
            callback(index);
        }
    }

    scrollTo(listId: number, time = 0.5, offset: number | null = null, highlight = false): void {
        if (!this.checkInited(false)) {
            return;
        }
        if (time == null) {
            time = 0.5;
        } else if (time < 0) {
            time = 0;
        }
        if (listId < 0) {
            listId = 0;
        } else if (listId >= this._numItems) {
            listId = this._numItems - 1;
        }
        if (!this._virtual && this._layout && this._layout.enabled) {
            this._layout.updateLayout();
        }
        const itemPos = this.getItemPos(listId);
        if (!itemPos) {
            return;
        }
        let scrollOffset = cc.v2(itemPos.x, itemPos.y);
        switch (this._alignCalcType) {
            case 1: {
                let x = itemPos.left!;
                x -= offset != null ? this.node.width * offset : this._leftGap;
                scrollOffset = cc.v2(x, 0);
                break;
            }
            case 2: {
                let x = itemPos.right! - this.node.width;
                x += offset != null ? this.node.width * offset : this._rightGap;
                scrollOffset = cc.v2(x + this.content!.width, 0);
                break;
            }
            case 3: {
                let y = itemPos.top!;
                y += offset != null ? this.node.height * offset : this._topGap;
                scrollOffset = cc.v2(0, -y);
                break;
            }
            case 4: {
                let y = itemPos.bottom! + this.node.height;
                y -= offset != null ? this.node.height * offset : this._bottomGap;
                scrollOffset = cc.v2(0, -y + this.content!.height);
                break;
            }
        }
        const contentPosition = this.content!.getPosition();
        let contentPos = Math.abs(this._sizeType ? contentPosition.y : contentPosition.x);
        const targetPos = this._sizeType ? scrollOffset.y : scrollOffset.x;
        if (Math.abs((this._scrollPos != null ? this._scrollPos : contentPos) - targetPos) > 0.5) {
            this._scrollView!.scrollToOffset(scrollOffset, time);
            this._scrollToListId = listId;
            this._scrollToEndTime = new Date().getTime() / 1000 + time;
            this._scrollToSo = () => {
                if (!this._adheringBarrier) {
                    this.adhering = this._adheringBarrier = false;
                }
                this._scrollPos = this._scrollToListId = this._scrollToEndTime = this._scrollToSo = null;
                if (highlight) {
                    const highlightItem = this.getItemByListId(listId);
                    if (highlightItem) {
                        cc.tween(highlightItem).to(0.1, { scale: 1.05 }).to(0.1, { scale: 1 }).start();
                    }
                }
            };
            this.scheduleOnce(this._scrollToSo, time + 0.1);
            if (time <= 0) {
                this._onScrolling();
            }
        }
    }

    _calcNearestItem(): void {
        let center = 0;
        this.nearestListId = null;
        if (this._virtual) {
            this._calcViewPos();
        }
        const viewTop = this.viewTop;
        const viewRight = this.viewRight;
        const viewBottom = this.viewBottom;
        const viewLeft = this.viewLeft;
        let found = false;
        for (let i = 0; i < this.content!.childrenCount && !found; i += this._colLineNum) {
            const itemPos = this._virtual ? this.displayData[i] : this._calcExistItemPos(i);
            if (itemPos) {
                center = this._sizeType ? (itemPos.top! + itemPos.bottom!) / 2 : (itemPos.left! + itemPos.right!) / 2;
                switch (this._alignCalcType) {
                    case 1:
                        if (itemPos.right! >= viewLeft) {
                            this.nearestListId = itemPos.id;
                            if (viewLeft > center) {
                                this.nearestListId += this._colLineNum;
                            }
                            found = true;
                        }
                        break;
                    case 2:
                        if (itemPos.left! <= viewRight) {
                            this.nearestListId = itemPos.id;
                            if (viewRight < center) {
                                this.nearestListId += this._colLineNum;
                            }
                            found = true;
                        }
                        break;
                    case 3:
                        if (itemPos.bottom! <= viewTop) {
                            this.nearestListId = itemPos.id;
                            if (viewTop < center) {
                                this.nearestListId += this._colLineNum;
                            }
                            found = true;
                        }
                        break;
                    case 4:
                        if (itemPos.top! >= viewBottom) {
                            this.nearestListId = itemPos.id;
                            if (viewBottom > center) {
                                this.nearestListId += this._colLineNum;
                            }
                            found = true;
                        }
                        break;
                }
            }
        }
        const lastItemPos = this._virtual ?
            this.displayData[this.displayItemNum - 1] :
            this._calcExistItemPos(this._numItems - 1);
        if (lastItemPos && lastItemPos.id === this._numItems - 1) {
            center = this._sizeType ?
                (lastItemPos.top! + lastItemPos.bottom!) / 2 :
                (lastItemPos.left! + lastItemPos.right!) / 2;
            switch (this._alignCalcType) {
                case 1:
                    if (viewRight > center) {
                        this.nearestListId = lastItemPos.id;
                    }
                    break;
                case 2:
                    if (viewLeft < center) {
                        this.nearestListId = lastItemPos.id;
                    }
                    break;
                case 3:
                    if (viewBottom < center) {
                        this.nearestListId = lastItemPos.id;
                    }
                    break;
                case 4:
                    if (viewTop > center) {
                        this.nearestListId = lastItemPos.id;
                    }
                    break;
            }
        }
    }

    prePage(time = 0.5): void {
        if (this.checkInited()) {
            this.skipPage(this.curPageNum - 1, time);
        }
    }

    nextPage(time = 0.5): void {
        if (this.checkInited()) {
            this.skipPage(this.curPageNum + 1, time);
        }
    }

    skipPage(pageIndex: number, time?: number): void {
        if (!this.checkInited()) {
            return;
        }
        if (this._slideMode !== SlideMode.PAGE) {
            cc.error("This function is not allowed to be called, Must SlideMode = PAGE!");
            return;
        }
        if (pageIndex < 0 || pageIndex >= this._numItems) {
            return;
        }
        if (this.curPageNum !== pageIndex) {
            this.curPageNum = pageIndex;
            if (this.pageChangeEvent) {
                cc.Component.EventHandler.emitEvents([this.pageChangeEvent], pageIndex);
            }
            this.scrollTo(pageIndex, time);
        }
    }

    calcCustomSize(count: number): { [key: number]: number } | null {
        if (!this.checkInited()) {
            return null;
        }
        if (!this._itemTmp) {
            cc.error("Unset template item!");
            return null;
        }
        if (!this.renderEvent) {
            cc.error("Unset Render-Event!");
            return null;
        }
        this._customSize = {};
        const tempItem = cc.instantiate(this._itemTmp);
        this.content!.addChild(tempItem);
        for (let i = 0; i < count; i++) {
            cc.Component.EventHandler.emitEvents([this.renderEvent], tempItem, i);
            if (tempItem.height !== this._itemSize.height || tempItem.width !== this._itemSize.width) {
                this._customSize[i] = this._sizeType ? tempItem.height : tempItem.width;
            }
        }
        if (!Object.keys(this._customSize).length) {
            this._customSize = null;
        }
        tempItem.removeFromParent();
        if (tempItem.destroy) {
            tempItem.destroy();
        }
        return this._customSize;
    }
}
