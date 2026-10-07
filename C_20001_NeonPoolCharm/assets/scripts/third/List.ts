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
    @property({ type: cc.Enum(TemplateType), tooltip: "" })
    templateType = TemplateType.NODE;

    @property({
        type: cc.Node,
        tooltip: "",
        visible() {
            return this.templateType == TemplateType.NODE;
        },
    })
    tmpNode: cc.Node = null;

    @property({
        type: cc.Prefab,
        tooltip: "",
        visible() {
            return this.templateType == TemplateType.PREFAB;
        },
    })
    tmpPrefab: cc.Prefab = null;

    @property()
    _slideMode = SlideType.NORMAL;

    @property({
        type: cc.Float,
        range: [0, 1, 0.1],
        tooltip: "",
        slide: true,
        visible() {
            return this._slideMode == SlideType.PAGE;
        },
    })
    pageDistance = 0.3;

    @property({
        type: cc.Component.EventHandler,
        tooltip: "",
        visible() {
            return this._slideMode == SlideType.PAGE;
        },
    })
    pageChangeEvent = new cc.Component.EventHandler();

    @property()
    _virtual = true;

    @property({
        tooltip: "",
        visible() {
            const enabled = this.slideMode == SlideType.NORMAL;
            if (!enabled) {
                this.cyclic = false;
            }
            return enabled;
        },
    })
    cyclic = false;

    @property({
        tooltip: "",
        visible() {
            return this.virtual;
        },
    })
    lackCenter = false;

    @property({
        tooltip: "",
        visible() {
            const enabled = this.virtual && !this.lackCenter;
            if (!enabled) {
                this.lackSlide = false;
            }
            return enabled;
        },
    })
    lackSlide = false;

    @property({ type: cc.Integer })
    _updateRate = 0;

    @property({ type: cc.Integer, range: [0, 12, 1], tooltip: "", slide: true })
    frameByFrameRenderNum = 0;

    @property({ type: cc.Component.EventHandler, tooltip: "" })
    renderEvent = new cc.Component.EventHandler();

    @property({ type: cc.Enum(SelectedType), tooltip: "" })
    selectedMode = SelectedType.NONE;

    @property({
        tooltip: "",
        visible() {
            return this.selectedMode == SelectedType.SINGLE;
        },
    })
    repeatEventSingle = false;

    @property({
        type: cc.Component.EventHandler,
        tooltip: "",
        visible() {
            return this.selectedMode > SelectedType.NONE;
        },
    })
    selectedEvent = new cc.Component.EventHandler();

    @property({ serializable: false })
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
    frameCount: number = null;
    _sizeType: boolean = null;
    _customSize: Record<number, number> = null;
    _beganPos: number = null;
    _scrollItem: cc.Node = null;
    multSelected: number[] = null;
    content: cc.Node = null;
    _scrollView: cc.ScrollView = null;
    _layout: cc.Layout = null;
    _align: number = null;
    _resizeMode: number = null;
    _startAxis: number = null;
    _topGap = 0;
    _rightGap = 0;
    _bottomGap = 0;
    _leftGap = 0;
    _columnGap = 0;
    _lineGap = 0;
    _verticalDir: number = null;
    _horizontalDir: number = null;
    _alignCalcType = 0;
    _itemTmp: cc.Node = null;
    _itemSize: cc.Size = null;
    _lastDisplayData: number[] = [];
    displayData: any[] = [];
    _pool: cc.NodePool = null;
    _updateCounter = 0;
    _actualNumItems = 0;
    _lastSelectedId: number = null;
    firstListId = 0;
    displayItemNum = 0;
    nearestListId: number = null;
    curScrollIsTouch = false;
    scrollToListId: number = null;
    _scrollPos: number = null;
    _scrollToListId: number = null;
    _scrollToEndTime: number = null;
    _scrollToSo: any = null;
    viewTop = 0;
    viewRight = 0;
    viewBottom = 0;
    viewLeft = 0;
    elasticTop = 0;
    elasticRight = 0;
    elasticBottom = 0;
    elasticLeft = 0;
    _allItemSize = 0;
    _allItemSizeNoEdge = 0;
    _cyclicPos1 = 0;
    _cyclicPos2 = 0;
    _cyclicNum = 0;
    _cyclicAllItemSize = 0;
    _cycilcAllItemSizeNoEdge = 0;
    _lack = false;
    _colLineNum = 1;
    _aniDelCB: (index: number) => void = null;
    _aniDelItem: cc.Node = null;
    _aniDelBeforePos: cc.Vec3 = null;
    _aniDelBeforeScale: number = null;

    @property({ type: cc.Enum(SlideType), tooltip: "" })
    get slideMode(): number {
        return this._slideMode;
    }
    set slideMode(val: number) {
        this._slideMode = val;
    }

    @property({ type: cc.Boolean, tooltip: "" })
    get virtual(): boolean {
        return this._virtual;
    }
    set virtual(val: boolean) {
        if (val != null) {
            this._virtual = val;
        }
        if (this._numItems != 0) {
            this._onScrolling();
        }
    }

    @property({ type: cc.Integer, range: [0, 6, 1], tooltip: "", slide: true })
    get updateRate(): number {
        return this._updateRate;
    }
    set updateRate(val: number) {
        if (val >= 0 && val <= 6) {
            this._updateRate = val;
        }
    }

    get selectedId(): number {
        return this._selectedId;
    }
    set selectedId(val: number) {
        let item: cc.Node;
        switch (this.selectedMode) {
            case SelectedType.SINGLE:
                if (!this.repeatEventSingle && val == this._selectedId) {
                    return;
                }
                item = this.getItemByListId(val);
                let listItem: ListItem;
                if (this._selectedId >= 0) {
                    this._lastSelectedId = this._selectedId;
                } else {
                    this._lastSelectedId = null;
                }
                this._selectedId = val;
                if (item) {
                    listItem = item.getComponent(ListItem);
                    listItem.selected = true;
                }
                if (this._lastSelectedId >= 0 && this._lastSelectedId != this._selectedId) {
                    const lastItem = this.getItemByListId(this._lastSelectedId);
                    if (lastItem) {
                        lastItem.getComponent(ListItem).selected = false;
                    }
                }
                if (this.selectedEvent) {
                    cc.Component.EventHandler.emitEvents(
                        [this.selectedEvent],
                        item,
                        val % this._actualNumItems,
                        this._lastSelectedId == null ? null : this._lastSelectedId % this._actualNumItems
                    );
                }
                break;
            case SelectedType.MULT:
                item = this.getItemByListId(val);
                if (!item) {
                    return;
                }
                listItem = item.getComponent(ListItem);
                if (this._selectedId >= 0) {
                    this._lastSelectedId = this._selectedId;
                }
                this._selectedId = val;
                const selected = !listItem.selected;
                listItem.selected = selected;
                const idx = this.multSelected.indexOf(val);
                if (selected && idx < 0) {
                    this.multSelected.push(val);
                } else if (!selected && idx >= 0) {
                    this.multSelected.splice(idx, 1);
                }
                if (this.selectedEvent) {
                    cc.Component.EventHandler.emitEvents(
                        [this.selectedEvent],
                        item,
                        val % this._actualNumItems,
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
    set numItems(val: number) {
        if (!this.checkInited(false)) {
            return;
        }
        if (val == null || val < 0) {
            cc.error("numItems set the wrong::", val);
            return;
        }
        this._actualNumItems = this._numItems = val;
        this._forceUpdate = true;
        if (this._virtual) {
            this._resizeContent();
            if (this.cyclic) {
                this._numItems = this._cyclicNum * this._numItems;
            }
            this._onScrolling();
            if (!this.frameByFrameRenderNum && this.slideMode == SlideType.PAGE) {
                this.curPageNum = this.nearestListId;
            }
        } else {
            if (this.cyclic) {
                this._resizeContent();
                this._numItems = this._cyclicNum * this._numItems;
            }
            const layout = this.content.getComponent(cc.Layout);
            if (layout) {
                layout.enabled = true;
            }
            this._delRedundantItem();
            this.firstListId = 0;
            if (this.frameByFrameRenderNum > 0) {
                const count =
                    this.frameByFrameRenderNum > this._numItems ? this._numItems : this.frameByFrameRenderNum;
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

    get scrollView(): cc.ScrollView {
        return this._scrollView;
    }

    hasMultSelected(id: number): boolean {
        return this.multSelected && this.multSelected.indexOf(id) >= 0;
    }

    _init(): void {
        if (this._inited) {
            return;
        }
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
        this.setTemplateItem(
            cc.instantiate(this.templateType == TemplateType.PREFAB ? this.tmpPrefab : this.tmpNode)
        );
        if (this._slideMode == SlideType.ADHERING || this._slideMode == SlideType.PAGE) {
            this._scrollView.inertia = false;
            (this._scrollView as any)._onMouseWheel = function () {};
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

    updateAll(): void {
        if (this.checkInited()) {
            this.numItems = this.numItems;
        }
    }

    _delRedundantItem(): void {
        if (this._virtual) {
            const outside = this._getOutsideItem();
            for (let i = outside.length - 1; i >= 0; i--) {
                const node = outside[i] as any;
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
                this._delSingleItem(this.content.children[this.content.childrenCount - 1]);
            }
        }
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

    _getFixedSize(count?: number): { val: number; count: number } {
        if (!this._customSize) {
            return null;
        }
        if (count == null) {
            count = this._numItems;
        }
        let val = 0;
        let sizeCount = 0;
        for (const key in this._customSize) {
            if (parseInt(key) < count) {
                val += this._customSize[key];
                sizeCount++;
            }
        }
        return { val, count: sizeCount };
    }

    getItemPos(id: number): any {
        if (this._virtual) {
            return this._calcItemPos(id);
        }
        if (this.frameByFrameRenderNum) {
            return this._calcItemPos(id);
        }
        return this._calcExistItemPos(id);
    }

    _onTouchStart(event: cc.Event.EventTouch, captureListeners?: any): void {
        if (!this._scrollView.hasNestedViewGroup(event, captureListeners)) {
            this.curScrollIsTouch = true;
            if (event.eventPhase !== cc.Event.AT_TARGET || event.target !== this.node) {
                let target: any = event.target;
                while (target._listId == null && target.parent) {
                    target = target.parent;
                }
                this._scrollItem = target._listId != null ? target : event.target;
            }
        }
    }

    scrollTo(listId: number, time = 0.5, alignOffset: number = null, scaleAnim = false): boolean {
        if (!this.checkInited(false)) {
            return false;
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
        let pos = this.getItemPos(listId);
        if (!pos) {
            return false;
        }
        let offset: cc.Vec2;
        switch (this._alignCalcType) {
            case 1: {
                let left = pos.left;
                left -= alignOffset != null ? this.node.width * alignOffset : this._leftGap;
                offset = cc.v2(left, 0);
                break;
            }
            case 2: {
                let right = pos.right - this.node.width;
                right += alignOffset != null ? this.node.width * alignOffset : this._rightGap;
                offset = cc.v2(right + this.content.width, 0);
                break;
            }
            case 3: {
                let top = pos.top;
                top += alignOffset != null ? this.node.height * alignOffset : this._topGap;
                offset = cc.v2(0, -top);
                break;
            }
            case 4: {
                let bottom = pos.bottom + this.node.height;
                bottom -= alignOffset != null ? this.node.height * alignOffset : this._bottomGap;
                offset = cc.v2(0, -bottom + this.content.height);
                break;
            }
        }
        let contentPos = this.content.getPosition();
        contentPos = Math.abs(this._sizeType ? contentPos.y : contentPos.x);
        const targetPos = this._sizeType ? offset.y : offset.x;
        if (Math.abs((this._scrollPos != null ? this._scrollPos : contentPos) - targetPos) > 0.5) {
            this._scrollView.scrollToOffset(offset, time);
            this._scrollToListId = listId;
            this._scrollToEndTime = new Date().getTime() / 1000 + time;
            this._scrollToSo = this.scheduleOnce(() => {
                if (!this._adheringBarrier) {
                    this.adhering = this._adheringBarrier = false;
                }
                this._scrollPos = this._scrollToListId = this._scrollToEndTime = this._scrollToSo = null;
                if (scaleAnim) {
                    const item = this.getItemByListId(listId);
                    if (item) {
                        cc.tween(item).to(0.1, { scale: 1.05 }).to(0.1, { scale: 1 }).start();
                    }
                }
            }, time + 0.1);
            if (time <= 0) {
                this._onScrolling();
            }
        }
        return true;
    }

    getMultSelected(): number[] {
        return this.multSelected;
    }

    _onSizeChanged(): void {
        if (this.checkInited(false)) {
            this._onScrolling();
        }
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
        if (this._slideMode == SlideType.ADHERING && !this.adhering) {
            this.adhere();
        } else if (this._slideMode == SlideType.PAGE) {
            if (this._beganPos != null && this.curScrollIsTouch) {
                this._pageAdhere();
            } else {
                this.adhere();
            }
        }
    }

    _createOrUpdateItem(data: any): void {
        let node = this.getItemByListId(data.id);
        if (node) {
            if (this._forceUpdate && this.renderEvent) {
                node.setPosition(cc.v2(data.x, data.y));
                this._resetItemSize(node);
                cc.Component.EventHandler.emitEvents([this.renderEvent], node, data.id % this._actualNumItems);
            }
        } else {
            let fromPool = this._pool.size() > 0;
            node = fromPool ? this._pool.get() : cc.instantiate(this._itemTmp);
            if (!fromPool || !cc.isValid(node)) {
                node = cc.instantiate(this._itemTmp);
                fromPool = false;
            }
            const listNode = node as any;
            if (listNode._listId != data.id) {
                listNode._listId = data.id;
                node.setContentSize(this._itemSize);
            }
            node.setPosition(cc.v2(data.x, data.y));
            this._resetItemSize(node);
            this.content.addChild(node);
            if (fromPool && this._needUpdateWidget) {
                const widget = node.getComponent(cc.Widget);
                if (widget) {
                    widget.updateAlignment();
                }
            }
            node.setSiblingIndex(this.content.childrenCount - 1);
            const listItem = node.getComponent(ListItem);
            listNode.listItem = listItem;
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
        this._updateListItem((node as any).listItem);
        if (this._lastDisplayData.indexOf(data.id) < 0) {
            this._lastDisplayData.push(data.id);
        }
    }

    _delSingleItem(node: cc.Node): void {
        node.removeFromParent();
        if (node.destroy) {
            node.destroy();
        }
    }

    _createOrUpdateItem2(index: number): void {
        let node = this.content.children[index] as any;
        let listItem: ListItem;
        if (node) {
            if (this._forceUpdate && this.renderEvent) {
                node._listId = index;
                if (listItem) {
                    listItem.listId = index;
                }
                cc.Component.EventHandler.emitEvents([this.renderEvent], node, index % this._actualNumItems);
            }
        } else {
            node = cc.instantiate(this._itemTmp) as any;
            node._listId = index;
            this.content.addChild(node);
            listItem = node.getComponent(ListItem);
            node.listItem = listItem;
            if (listItem) {
                listItem.listId = index;
                listItem.list = this;
                listItem._registerEvent();
            }
            if (this.renderEvent) {
                cc.Component.EventHandler.emitEvents([this.renderEvent], node, index % this._actualNumItems);
            }
        }
        this._updateListItem(listItem);
        if (this._lastDisplayData.indexOf(index) < 0) {
            this._lastDisplayData.push(index);
        }
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
            const node = this.getItemByListId(id);
            if (node) {
                cc.Component.EventHandler.emitEvents([this.renderEvent], node, id % this._actualNumItems);
            }
        }
    }

    onDisable(): void {
        this._unregisterEvent();
    }

    _onScrollBegan(): void {
        this._beganPos = this._sizeType ? this.viewTop : this.viewLeft;
    }

    _processAutoScrolling(dt: number): void {
        const scrollView = this._scrollView as any;
        scrollView._autoScrollAccumulatedTime += 1 * dt;
        let ratio = Math.min(1, scrollView._autoScrollAccumulatedTime / scrollView._autoScrollTotalTime);
        if (scrollView._autoScrollAttenuate) {
            const t = ratio - 1;
            ratio = t * t * t * t * t + 1;
        }
        const newPos = scrollView._autoScrollStartPosition.add(scrollView._autoScrollTargetDelta.mul(ratio));
        const ended = Math.abs(ratio - 1) <= scrollView.getScrollEndedEventTiming();
        if (ended && !scrollView._isScrollEndedWithThresholdEventFired) {
            scrollView._dispatchEvent("scroll-ended-with-threshold");
            scrollView._isScrollEndedWithThresholdEventFired = true;
        }
        if (ended) {
            scrollView._autoScrolling = false;
        }
        const delta = newPos.sub(scrollView.getContentPosition());
        scrollView._moveContent(scrollView._clampDelta(delta), ended);
        scrollView._dispatchEvent("scrolling");
        if (!scrollView._autoScrolling) {
            scrollView._isBouncing = false;
            scrollView._scrolling = false;
            scrollView._dispatchEvent("scroll-ended");
        }
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

    skipPage(page: number, time?: number): void {
        if (!this.checkInited()) {
            return;
        }
        if (this._slideMode != SlideType.PAGE) {
            return cc.error("This function is not allowed to be called, Must SlideMode = PAGE!");
        }
        if (page < 0 || page >= this._numItems || this.curPageNum == page) {
            return;
        }
        this.curPageNum = page;
        if (this.pageChangeEvent) {
            cc.Component.EventHandler.emitEvents([this.pageChangeEvent], page);
        }
        this.scrollTo(page, time);
    }

    setTemplateItem(template: cc.Node): void {
        if (!template) {
            return;
        }
        this._itemTmp = template;
        if (this._resizeMode == cc.Layout.ResizeMode.CHILDREN) {
            this._itemSize = this._layout.cellSize;
        } else {
            this._itemSize = cc.size(template.width, template.height);
        }
        let listItem = template.getComponent(ListItem);
        if (!listItem) {
            this.selectedMode = SelectedType.NONE;
        }
        const widget = template.getComponent(cc.Widget);
        if (widget && widget.enabled) {
            this._needUpdateWidget = true;
        }
        if (this.selectedMode == SelectedType.MULT) {
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

    _calcNearestItem(): void {
        let itemData: any;
        let center: number;
        this.nearestListId = null;
        if (this._virtual) {
            this._calcViewPos();
        }
        const viewTop = this.viewTop;
        const viewRight = this.viewRight;
        const viewBottom = this.viewBottom;
        const viewLeft = this.viewLeft;
        let found = false;
        for (let i = 0; i < this.content.childrenCount && !found; i += this._colLineNum) {
            itemData = this._virtual ? this.displayData[i] : this._calcExistItemPos(i);
            if (itemData) {
                center = this._sizeType ? (itemData.top + itemData.bottom) / 2 : (itemData.left + itemData.right) / 2;
                switch (this._alignCalcType) {
                    case 1:
                        if (itemData.right >= viewLeft) {
                            this.nearestListId = itemData.id;
                            if (viewLeft > center) {
                                this.nearestListId += this._colLineNum;
                            }
                            found = true;
                        }
                        break;
                    case 2:
                        if (itemData.left <= viewRight) {
                            this.nearestListId = itemData.id;
                            if (viewRight < center) {
                                this.nearestListId += this._colLineNum;
                            }
                            found = true;
                        }
                        break;
                    case 3:
                        if (itemData.bottom <= viewTop) {
                            this.nearestListId = itemData.id;
                            if (viewTop < center) {
                                this.nearestListId += this._colLineNum;
                            }
                            found = true;
                        }
                        break;
                    case 4:
                        if (itemData.top >= viewBottom) {
                            this.nearestListId = itemData.id;
                            if (viewBottom > center) {
                                this.nearestListId += this._colLineNum;
                            }
                            found = true;
                        }
                        break;
                }
            }
        }
        itemData = this._virtual ? this.displayData[this.displayItemNum - 1] : this._calcExistItemPos(this._numItems - 1);
        if (itemData && itemData.id == this._numItems - 1) {
            center = this._sizeType ? (itemData.top + itemData.bottom) / 2 : (itemData.left + itemData.right) / 2;
            switch (this._alignCalcType) {
                case 1:
                    if (viewRight > center) {
                        this.nearestListId = itemData.id;
                    }
                    break;
                case 2:
                    if (viewLeft < center) {
                        this.nearestListId = itemData.id;
                    }
                    break;
                case 3:
                    if (viewBottom < center) {
                        this.nearestListId = itemData.id;
                    }
                    break;
                case 4:
                    if (viewTop > center) {
                        this.nearestListId = itemData.id;
                    }
                    break;
            }
        }
    }

    _getOutsideItem(): cc.Node[] {
        const result: cc.Node[] = [];
        for (let i = this.content.childrenCount - 1; i >= 0; i--) {
            const child = this.content.children[i] as any;
            if (!this.displayData.find((data) => data.id == child._listId)) {
                result.push(child);
            }
        }
        return result;
    }

    _calcItemPos(id: number): any {
        let left: number;
        let right: number;
        let top: number;
        let bottom: number;
        let x: number;
        let y: number;
        let width: number;
        let height: number;
        switch (this._align) {
            case cc.Layout.Type.HORIZONTAL:
                switch (this._horizontalDir) {
                    case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                        if (this._customSize) {
                            const fixed = this._getFixedSize(id);
                            left =
                                this._leftGap +
                                (this._itemSize.width + this._columnGap) * (id - fixed.count) +
                                (fixed.val + this._columnGap * fixed.count);
                            width = this._customSize[id] > 0 ? this._customSize[id] : this._itemSize.width;
                        } else {
                            left = this._leftGap + (this._itemSize.width + this._columnGap) * id;
                            width = this._itemSize.width;
                        }
                        if (this.lackCenter) {
                            left -= this._leftGap;
                            left += this.content.width / 2 - this._allItemSizeNoEdge / 2;
                        }
                        return { id, left, right: left + width, x: left + this._itemTmp.anchorX * width, y: this._itemTmp.y };
                    case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                        if (this._customSize) {
                            const fixed = this._getFixedSize(id);
                            right =
                                -this._rightGap -
                                (this._itemSize.width + this._columnGap) * (id - fixed.count) -
                                (fixed.val + this._columnGap * fixed.count);
                            width = this._customSize[id] > 0 ? this._customSize[id] : this._itemSize.width;
                        } else {
                            right = -this._rightGap - (this._itemSize.width + this._columnGap) * id;
                            width = this._itemSize.width;
                        }
                        if (this.lackCenter) {
                            right += this._rightGap;
                            right -= this.content.width / 2 - this._allItemSizeNoEdge / 2;
                        }
                        left = right - width;
                        return { id, right, left, x: left + this._itemTmp.anchorX * width, y: this._itemTmp.y };
                }
                break;
            case cc.Layout.Type.VERTICAL:
                switch (this._verticalDir) {
                    case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                        if (this._customSize) {
                            const fixed = this._getFixedSize(id);
                            top =
                                -this._topGap -
                                (this._itemSize.height + this._lineGap) * (id - fixed.count) -
                                (fixed.val + this._lineGap * fixed.count);
                            height = this._customSize[id] > 0 ? this._customSize[id] : this._itemSize.height;
                        } else {
                            top = -this._topGap - (this._itemSize.height + this._lineGap) * id;
                            height = this._itemSize.height;
                        }
                        if (this.lackCenter) {
                            top += this._topGap;
                            top -= this.content.height / 2 - this._allItemSizeNoEdge / 2;
                        }
                        bottom = top - height;
                        return { id, top, bottom, x: this._itemTmp.x, y: bottom + this._itemTmp.anchorY * height };
                    case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                        if (this._customSize) {
                            const fixed = this._getFixedSize(id);
                            bottom =
                                this._bottomGap +
                                (this._itemSize.height + this._lineGap) * (id - fixed.count) +
                                (fixed.val + this._lineGap * fixed.count);
                            height = this._customSize[id] > 0 ? this._customSize[id] : this._itemSize.height;
                        } else {
                            bottom = this._bottomGap + (this._itemSize.height + this._lineGap) * id;
                            height = this._itemSize.height;
                        }
                        if (this.lackCenter) {
                            bottom -= this._bottomGap;
                            bottom += this.content.height / 2 - this._allItemSizeNoEdge / 2;
                        }
                        top = bottom + height;
                        return { id, top, bottom, x: this._itemTmp.x, y: bottom + this._itemTmp.anchorY * height };
                }
                break;
            case cc.Layout.Type.GRID: {
                const row = Math.floor(id / this._colLineNum);
                switch (this._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL:
                        switch (this._verticalDir) {
                            case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                                bottom = (top = -this._topGap - (this._itemSize.height + this._lineGap) * row) - this._itemSize.height;
                                y = bottom + this._itemTmp.anchorY * this._itemSize.height;
                                break;
                            case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                                top = (bottom = this._bottomGap + (this._itemSize.height + this._lineGap) * row) + this._itemSize.height;
                                y = bottom + this._itemTmp.anchorY * this._itemSize.height;
                                break;
                        }
                        x = this._leftGap + (id % this._colLineNum) * (this._itemSize.width + this._columnGap);
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
                        return { id, top, bottom, x, y };
                    case cc.Layout.AxisDirection.VERTICAL:
                        switch (this._horizontalDir) {
                            case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                                right = (left = this._leftGap + (this._itemSize.width + this._columnGap) * row) + this._itemSize.width;
                                x = left + this._itemTmp.anchorX * this._itemSize.width;
                                x -= this.content.anchorX * this.content.width;
                                break;
                            case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                                x = (left = (right = -this._rightGap - (this._itemSize.width + this._columnGap) * row) - this._itemSize.width) + this._itemTmp.anchorX * this._itemSize.width;
                                x += (1 - this.content.anchorX) * this.content.width;
                                break;
                        }
                        y = -this._topGap - (id % this._colLineNum) * (this._itemSize.height + this._lineGap);
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
                        return { id, left, right, x, y };
                }
            }
        }
    }

    _updateListItem(listItem: ListItem): void {
        if (listItem && this.selectedMode > SelectedType.NONE) {
            const node = listItem.node as any;
            switch (this.selectedMode) {
                case SelectedType.SINGLE:
                    listItem.selected = this.selectedId == node._listId;
                    break;
                case SelectedType.MULT:
                    listItem.selected = this.multSelected.indexOf(node._listId) >= 0;
                    break;
            }
        }
    }

    checkInited(showError = true): boolean {
        if (!this._inited) {
            if (showError) {
                cc.error("List initialization not completed!");
            }
            return false;
        }
        return true;
    }

    onDestroy(): void {
        if (cc.isValid(this._itemTmp)) {
            this._itemTmp.destroy();
        }
        if (cc.isValid(this.tmpNode)) {
            this.tmpNode.destroy();
        }
        if (this._pool) {
            this._pool.clear();
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
                    const itemSize = this._allItemSizeNoEdge + (this._sizeType ? this._lineGap : this._columnGap);
                    const delta = this._sizeType ? cc.v2(0, itemSize) : cc.v2(itemSize, 0);
                    const scrollView = this._scrollView as any;
                    switch (this._alignCalcType) {
                        case 1:
                            if (pos > -this._cyclicPos1) {
                                this.content.x = -this._cyclicPos2;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.sub(delta);
                                }
                            } else if (pos < -this._cyclicPos2) {
                                this.content.x = -this._cyclicPos1;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.add(delta);
                                }
                            }
                            break;
                        case 2:
                            if (pos < this._cyclicPos1) {
                                this.content.x = this._cyclicPos2;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.add(delta);
                                }
                            } else if (pos > this._cyclicPos2) {
                                this.content.x = this._cyclicPos1;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.sub(delta);
                                }
                            }
                            break;
                        case 3:
                            if (pos < this._cyclicPos1) {
                                this.content.y = this._cyclicPos2;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.add(delta);
                                }
                            } else if (pos > this._cyclicPos2) {
                                this.content.y = this._cyclicPos1;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.sub(delta);
                                }
                            }
                            break;
                        case 4:
                            if (pos > -this._cyclicPos1) {
                                this.content.y = -this._cyclicPos2;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.sub(delta);
                                }
                            } else if (pos < -this._cyclicPos2) {
                                this.content.y = -this._cyclicPos1;
                                if (scrollView.isAutoScrolling()) {
                                    scrollView._autoScrollStartPosition = scrollView._autoScrollStartPosition.add(delta);
                                }
                            }
                            break;
                    }
                }
                this._calcViewPos();
                let viewTop: number;
                let viewRight: number;
                let viewBottom: number;
                let viewLeft: number;
                if (this._sizeType) {
                    viewTop = this.viewTop;
                    viewBottom = this.viewBottom;
                } else {
                    viewRight = this.viewRight;
                    viewLeft = this.viewLeft;
                }
                if (this._virtual) {
                    this.displayData = [];
                    let itemData: any;
                    let start = 0;
                    let end = this._numItems - 1;
                    if (this._customSize) {
                        let done = false;
                        for (let i = 0; i <= end && !done; i++) {
                            itemData = this._calcItemPos(i);
                            switch (this._align) {
                                case cc.Layout.Type.HORIZONTAL:
                                    if (itemData.right >= viewLeft && itemData.left <= viewRight) {
                                        this.displayData.push(itemData);
                                    } else if (i != 0 && this.displayData.length > 0) {
                                        done = true;
                                    }
                                    break;
                                case cc.Layout.Type.VERTICAL:
                                    if (itemData.bottom <= viewTop && itemData.top >= viewBottom) {
                                        this.displayData.push(itemData);
                                    } else if (i != 0 && this.displayData.length > 0) {
                                        done = true;
                                    }
                                    break;
                                case cc.Layout.Type.GRID:
                                    switch (this._startAxis) {
                                        case cc.Layout.AxisDirection.HORIZONTAL:
                                            if (itemData.bottom <= viewTop && itemData.top >= viewBottom) {
                                                this.displayData.push(itemData);
                                            } else if (i != 0 && this.displayData.length > 0) {
                                                done = true;
                                            }
                                            break;
                                        case cc.Layout.AxisDirection.VERTICAL:
                                            if (itemData.right >= viewLeft && itemData.left <= viewRight) {
                                                this.displayData.push(itemData);
                                            } else if (i != 0 && this.displayData.length > 0) {
                                                done = true;
                                            }
                                            break;
                                    }
                                    break;
                            }
                        }
                    } else {
                        const stepW = this._itemSize.width + this._columnGap;
                        const stepH = this._itemSize.height + this._lineGap;
                        switch (this._alignCalcType) {
                            case 1:
                                start = (viewLeft - this._leftGap) / stepW;
                                end = (viewRight - this._leftGap) / stepW;
                                break;
                            case 2:
                                start = (-viewRight - this._rightGap) / stepW;
                                end = (-viewLeft - this._rightGap) / stepW;
                                break;
                            case 3:
                                start = (-viewTop - this._topGap) / stepH;
                                end = (-viewBottom - this._topGap) / stepH;
                                break;
                            case 4:
                                start = (viewBottom - this._bottomGap) / stepH;
                                end = (viewTop - this._bottomGap) / stepH;
                                break;
                        }
                        start = Math.floor(start) * this._colLineNum;
                        end = Math.ceil(end) * this._colLineNum;
                        if (start < 0) {
                            start = 0;
                        }
                        if (--end >= this._numItems) {
                            end = this._numItems - 1;
                        }
                        for (let i = start; i <= end; i++) {
                            this.displayData.push(this._calcItemPos(i));
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
                    let changed = this.displayItemNum != lastCount;
                    if (changed) {
                        if (this.frameByFrameRenderNum > 0) {
                            this._lastDisplayData.sort((a, b) => a - b);
                        }
                        changed =
                            this.firstListId != this._lastDisplayData[0] ||
                            this.displayData[this.displayItemNum - 1].id != this._lastDisplayData[lastCount - 1];
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

    prePage(time = 0.5): void {
        if (this.checkInited()) {
            this.skipPage(this.curPageNum - 1, time);
        }
    }

    _onTouchUp(): void {
        this._scrollPos = null;
        if (this._slideMode == SlideType.ADHERING) {
            if (this.adhering) {
                this._adheringBarrier = true;
            }
            this.adhere();
        } else if (this._slideMode == SlideType.PAGE) {
            if (this._beganPos != null) {
                this._pageAdhere();
            } else {
                this.adhere();
            }
        }
        this._scrollItem = null;
    }

    _calcExistItemPos(id: number): any {
        const node = this.getItemByListId(id);
        if (!node) {
            return null;
        }
        const pos: any = { id, x: node.x, y: node.y };
        if (this._sizeType) {
            pos.top = node.y + node.height * (1 - node.anchorY);
            pos.bottom = node.y - node.height * node.anchorY;
        } else {
            pos.left = node.x - node.width * node.anchorX;
            pos.right = node.x + node.width * (1 - node.anchorX);
        }
        return pos;
    }

    setMultSelected(ids: number | number[], append?: boolean): void {
        if (!this.checkInited()) {
            return;
        }
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        if (append == null) {
            this.multSelected = ids as number[];
        } else if (append) {
            for (let i = ids.length - 1; i >= 0; i--) {
                const id = ids[i];
                if (this.multSelected.indexOf(id) < 0) {
                    this.multSelected.push(id);
                }
            }
        } else {
            for (let i = ids.length - 1; i >= 0; i--) {
                const id = ids[i];
                const idx = this.multSelected.indexOf(id);
                if (idx >= 0) {
                    this.multSelected.splice(idx, 1);
                }
            }
        }
        this._forceUpdate = true;
        this._onScrolling();
    }

    _pageAdhere(): void {
        if (
            this.cyclic ||
            !(this.elasticTop > 0 || this.elasticRight > 0 || this.elasticBottom > 0 || this.elasticLeft > 0)
        ) {
            const current = this._sizeType ? this.viewTop : this.viewLeft;
            const threshold = (this._sizeType ? this.node.height : this.node.width) * this.pageDistance;
            if (Math.abs(this._beganPos - current) > threshold) {
                switch (this._alignCalcType) {
                    case 1:
                    case 4:
                        if (this._beganPos > current) {
                            this.prePage(0.5);
                        } else {
                            this.nextPage(0.5);
                        }
                        break;
                    case 2:
                    case 3:
                        if (this._beganPos < current) {
                            this.prePage(0.5);
                        } else {
                            this.nextPage(0.5);
                        }
                        break;
                }
            } else if (
                this.elasticTop <= 0 &&
                this.elasticRight <= 0 &&
                this.elasticBottom <= 0 &&
                this.elasticLeft <= 0
            ) {
                this.adhere();
            }
            this._beganPos = null;
        }
    }

    _updateItemPos(target: number | cc.Node): void {
        const node = isNaN(target as number) ? (target as cc.Node) : this.getItemByListId(target as number);
        const pos = this.getItemPos((node as any)._listId);
        node.setPosition(pos.x, pos.y);
    }

    adhere(): void {
        if (
            !this.checkInited() ||
            this.elasticTop > 0 ||
            this.elasticRight > 0 ||
            this.elasticBottom > 0 ||
            this.elasticLeft > 0
        ) {
            return;
        }
        this.adhering = true;
        this._calcNearestItem();
        const alignOffset = (this._sizeType ? this._topGap : this._leftGap) / (this._sizeType ? this.node.height : this.node.width);
        this.scrollTo(this.nearestListId, 0.7, alignOffset);
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
                this._aniDelCB(null);
                delete this._aniDelCB;
            }
        }
    }

    _onTouchCancelled(event: cc.Event.EventTouch, captureListeners?: any): void {
        if (!this._scrollView.hasNestedViewGroup(event, captureListeners) && !event.simulate) {
            this._scrollPos = null;
            if (this._slideMode == SlideType.ADHERING) {
                if (this.adhering) {
                    this._adheringBarrier = true;
                }
                this.adhere();
            } else if (this._slideMode == SlideType.PAGE) {
                if (this._beganPos != null) {
                    this._pageAdhere();
                } else {
                    this.adhere();
                }
            }
            this._scrollItem = null;
        }
    }

    _resizeContent(): void {
        let size = 0;
        switch (this._align) {
            case cc.Layout.Type.HORIZONTAL:
                if (this._customSize) {
                    const fixed = this._getFixedSize(null);
                    size =
                        this._leftGap +
                        fixed.val +
                        this._itemSize.width * (this._numItems - fixed.count) +
                        this._columnGap * (this._numItems - 1) +
                        this._rightGap;
                } else {
                    size =
                        this._leftGap +
                        this._itemSize.width * this._numItems +
                        this._columnGap * (this._numItems - 1) +
                        this._rightGap;
                }
                break;
            case cc.Layout.Type.VERTICAL:
                if (this._customSize) {
                    const fixed = this._getFixedSize(null);
                    size =
                        this._topGap +
                        fixed.val +
                        this._itemSize.height * (this._numItems - fixed.count) +
                        this._lineGap * (this._numItems - 1) +
                        this._bottomGap;
                } else {
                    size =
                        this._topGap +
                        this._itemSize.height * this._numItems +
                        this._lineGap * (this._numItems - 1) +
                        this._bottomGap;
                }
                break;
            case cc.Layout.Type.GRID:
                if (this.lackCenter) {
                    this.lackCenter = false;
                }
                switch (this._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL: {
                        const rows = Math.ceil(this._numItems / this._colLineNum);
                        size = this._topGap + this._itemSize.height * rows + this._lineGap * (rows - 1) + this._bottomGap;
                        break;
                    }
                    case cc.Layout.AxisDirection.VERTICAL: {
                        const cols = Math.ceil(this._numItems / this._colLineNum);
                        size = this._leftGap + this._itemSize.width * cols + this._columnGap * (cols - 1) + this._rightGap;
                        break;
                    }
                }
                break;
        }
        const layout = this.content.getComponent(cc.Layout);
        if (layout) {
            layout.enabled = false;
        }
        this._allItemSize = size;
        this._allItemSizeNoEdge = this._allItemSize - (this._sizeType ? this._topGap + this._bottomGap : this._leftGap + this._rightGap);
        if (this.cyclic) {
            const viewSize = this._sizeType ? this.node.height : this.node.width;
            this._cyclicPos1 = 0;
            const gap = this._sizeType ? this._lineGap : this._columnGap;
            this._cyclicNum = Math.ceil(viewSize / this._allItemSizeNoEdge) + 1;
            this._cyclicPos2 = this._cyclicPos1 + this._allItemSizeNoEdge + gap;
            this._cyclicAllItemSize = this._allItemSize + this._allItemSizeNoEdge * (this._cyclicNum - 1) + gap * (this._cyclicNum - 1);
            this._cycilcAllItemSizeNoEdge = this._allItemSizeNoEdge * this._cyclicNum + gap * (this._cyclicNum - 1);
        }
        this._lack = !this.cyclic && this._allItemSize < (this._sizeType ? this.node.height : this.node.width);
        const edge = this._lack && this.lackCenter && !this.lackSlide ? 0.1 : 0;
        let contentSize = this._lack
            ? (this._sizeType ? this.node.height : this.node.width) - edge
            : this.cyclic
            ? this._cyclicAllItemSize
            : this._allItemSize;
        if (contentSize < 0) {
            contentSize = 0;
        }
        if (this._sizeType) {
            this.content.height = contentSize;
        } else {
            this.content.width = contentSize;
        }
    }

    _onItemAdaptive(node: cc.Node): void {
        const size = this._sizeType ? node.height : node.width;
        if ((!this._sizeType && node.width != this._itemSize.width) || (this._sizeType && node.height != this._itemSize.height)) {
            if (!this._customSize) {
                this._customSize = {};
            }
            if (this._customSize[(node as any)._listId] != size) {
                this._customSize[(node as any)._listId] = size;
                this._resizeContent();
                this.updateAll();
                if (this._scrollToListId != null) {
                    this._scrollPos = null;
                    this.unschedule(this._scrollToSo);
                    this.scrollTo(this._scrollToListId, Math.max(0, this._scrollToEndTime - new Date().getTime() / 1000));
                }
            }
        }
    }

    aniDelItem(listId: number, callback: (index: number) => void, animType?: number): void {
        if (!this.checkInited() || this.cyclic || !this._virtual) {
            return cc.error("This function is not allowed to be called!");
        }
        if (!callback) {
            return cc.error("CallFunc are not allowed to be NULL, You need to delete the corresponding index in the data array in the CallFunc!");
        }
        if (this._aniDelRuning) {
            return cc.warn("Please wait for the current deletion to finish!");
        }
        const node = this.getItemByListId(listId);
        if (node) {
            const listItem = node.getComponent(ListItem);
            this._aniDelRuning = true;
            this._aniDelCB = callback;
            this._aniDelItem = node;
            this._aniDelBeforePos = node.position;
            this._aniDelBeforeScale = node.scale;
            const lastId = this.displayData[this.displayData.length - 1].id;
            const wasSelected = listItem.selected;
            listItem.showAni(
                animType,
                () => {
                    let nextId: number;
                    let tweenStarted = false;
                    if (lastId < this._numItems - 2) {
                        nextId = lastId + 1;
                    }
                    if (nextId != null) {
                        const nextData = this._calcItemPos(nextId);
                        this.displayData.push(nextData);
                        if (this._virtual) {
                            this._createOrUpdateItem(nextData);
                        } else {
                            this._createOrUpdateItem2(nextId);
                        }
                    } else {
                        this._numItems--;
                    }
                    if (this.selectedMode == SelectedType.SINGLE) {
                        if (wasSelected) {
                            this._selectedId = -1;
                        } else if (this._selectedId - 1 >= 0) {
                            this._selectedId--;
                        }
                    } else if (this.selectedMode == SelectedType.MULT && this.multSelected.length) {
                        const idx = this.multSelected.indexOf(listId);
                        if (idx >= 0) {
                            this.multSelected.splice(idx, 1);
                        }
                        for (let i = this.multSelected.length - 1; i >= 0; i--) {
                            if (this.multSelected[i] >= listId) {
                                this.multSelected[i]--;
                            }
                        }
                    }
                    if (this._customSize) {
                        if (this._customSize[listId]) {
                            delete this._customSize[listId];
                        }
                        const newCustom: Record<number, number> = {};
                        for (const key in this._customSize) {
                            const parsed = parseInt(key);
                            newCustom[parsed - (parsed >= listId ? 1 : 0)] = this._customSize[key];
                        }
                        this._customSize = newCustom;
                    }
                    for (let i = nextId != null ? nextId : lastId; i >= listId + 1; i--) {
                        const itemNode = this.getItemByListId(i);
                        if (itemNode) {
                            const targetPos = this._calcItemPos(i - 1);
                            const tween = cc.tween(itemNode).to(0.2333, { position: cc.v2(targetPos.x, targetPos.y) });
                            if (i <= listId + 1) {
                                tweenStarted = true;
                                tween.call(() => {
                                    this._aniDelRuning = false;
                                    callback(listId);
                                    delete this._aniDelCB;
                                });
                            }
                            tween.start();
                        }
                    }
                    if (!tweenStarted) {
                        this._aniDelRuning = false;
                        callback(listId);
                        this._aniDelCB = null;
                    }
                },
                true
            );
        } else {
            callback(listId);
        }
    }

    nextPage(time = 0.5): void {
        if (this.checkInited()) {
            this.skipPage(this.curPageNum + 1, time);
        }
    }

    onLoad(): void {
        this._init();
    }

    _calcViewPos(): void {
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
                this.elasticBottom =
                    this.viewBottom < -this.content.height ? Math.abs(this.viewBottom + this.content.height) : 0;
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

    _resetItemSize(_node?: cc.Node): void {}

    getItemByListId(id: number): cc.Node {
        if (this.content) {
            for (let i = this.content.childrenCount - 1; i >= 0; i--) {
                const child = this.content.children[i] as any;
                if (child._listId == id) {
                    return child;
                }
            }
        }
    }

    calcCustomSize(count: number): Record<number, number> {
        if (!this.checkInited()) {
            return;
        }
        if (!this._itemTmp) {
            return cc.error("Unset template item!");
        }
        if (!this.renderEvent) {
            return cc.error("Unset Render-Event!");
        }
        this._customSize = {};
        const node = cc.instantiate(this._itemTmp);
        this.content.addChild(node);
        for (let i = 0; i < count; i++) {
            cc.Component.EventHandler.emitEvents([this.renderEvent], node, i);
            if (node.height != this._itemSize.height || node.width != this._itemSize.width) {
                this._customSize[i] = this._sizeType ? node.height : node.width;
            }
        }
        if (!Object.keys(this._customSize).length) {
            this._customSize = null;
        }
        node.removeFromParent();
        if (node.destroy) {
            node.destroy();
        }
        return this._customSize;
    }

    update(): void {
        if (this.frameByFrameRenderNum <= 0 || this._updateDone) {
            return;
        }
        if (this._virtual) {
            const end = Math.min(this._updateCounter + this.frameByFrameRenderNum, this.displayItemNum);
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
                    if (this.slideMode == SlideType.PAGE) {
                        this.curPageNum = this.nearestListId;
                    }
                }
            } else {
                this._updateCounter += this.frameByFrameRenderNum;
            }
        } else if (this._updateCounter < this._numItems) {
            const end = Math.min(this._updateCounter + this.frameByFrameRenderNum, this._numItems);
            for (let i = this._updateCounter; i < end; i++) {
                this._createOrUpdateItem2(i);
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
