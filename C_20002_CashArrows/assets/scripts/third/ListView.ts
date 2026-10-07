import ClickAudio from "./ClickAudio";
import ResMgr from "./ResMgr";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("UI/Cocos/ListView")
export default class ListView extends cc.Component {
    @property(cc.Node)
    itemTemplate: cc.Node | null = null;

    @property(cc.Prefab)
    itemPrefabTemplate: cc.Prefab | null = null;

    @property(cc.Vec2)
    spacing = cc.v2(0, 0);

    @property({
        tooltip: "四周边距",
    })
    margin = cc.rect(0, 0, 0, 0);

    @property({
        tooltip: "比可见元素多缓存2个, 缓存越多,快速滑动越流畅,但同时初始化越慢.",
    })
    spawnCount = 2;

    @property({
        tooltip: "行列数，横向滚动是行数，竖向滚动是列数.",
    })
    column = 1;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView | null = null;

    @property(cc.Node)
    emptyView: cc.Node | null = null;

    @property({
        tooltip: "当可见元素小于最大可见数量时候,是否居中显示",
    })
    isCenter = false;

    content: cc.Node | null = null;
    adapter: AbsAdapter | DefaultAdapter | null = null;
    _filledIds: { [key: number]: cc.Node | null } = {};
    horizontal = false;
    _itemHeight = 1;
    _itemWidth = 1;
    _itemsVisible = 1;
    dataChanged = false;
    _isInited = false;
    visibleRange: number[] = [-1, -1];
    _pager: Pager | null = null;
    comp: typeof cc.Component | null = null;
    _resLoader: any = null;
    _items: cc.NodePool | null = null;
    _isOnLoadCalled = false;

    get pager(): Pager {
        if (!this._pager) {
            this._pager = new Pager(this);
        }
        return this._pager;
    }

    get resLoader(): any {
        if (!this._resLoader) {
            this._resLoader = ResMgr.getInstance().getKeeper(this, true);
            this._resLoader.bindSelfAsset();
        }
        return this._resLoader;
    }

    onLoad(): void {
        if (this.itemTemplate != null && this.itemTemplate.active) {
            this.itemTemplate.active = false;
        }
        this.resLoader;
        this.init();
        this.scrollView;
    }

    async setAdapter(adapter: AbsAdapter | DefaultAdapter | null): Promise<void> {
        if (this.adapter === adapter) {
            this.notifyUpdate();
            return;
        }
        this.adapter = adapter;
        if (this.adapter == null) {
            console.warn("adapter 为空.");
            return;
        }
        if (this.itemTemplate == null && this.itemPrefabTemplate == null) {
            console.error("Listview 未设置待显示的Item模板.");
            return;
        }
        this.visibleRange[0] = this.visibleRange[1] = -1;
        this.recycleAll();
        this.notifyUpdate();
    }

    getAdapter(): AbsAdapter | DefaultAdapter | null {
        return this.adapter;
    }

    getScrollView(): cc.ScrollView | null {
        return this.scrollView;
    }

    getAllItems(): cc.NodePool | null {
        return this._items;
    }

    refreshAdapter(adapter: AbsAdapter | DefaultAdapter | null): void {
        this.adapter = adapter;
        this.visibleRange[0] = this.visibleRange[1] = -1;
        this.recycleAll();
        this.notifyUpdate();
    }

    scrollToPage(pageIndex: number, pageSize?: number, duration = 0): boolean {
        if (!this.adapter || !this.scrollView) {
            return false;
        }
        this.adapter.getCount();
        if (this.horizontal) {
            let offset = 0;
            const contentWidth = this.content!.width;
            const columnWH = this.getColumnWH();
            if (pageSize) {
                offset = columnWH * pageSize;
            } else {
                const parentWidth = Math.ceil(this.content!.parent!.width);
                offset = Math.floor(parentWidth / columnWH) * columnWH;
            }
            this.scrollView.stopAutoScroll();
            this.scrollView.scrollToOffset(cc.v2(offset * pageIndex, 0), duration);
            return offset * (pageIndex + 1) >= contentWidth;
        }
        const contentHeight = this.content!.height;
        const columnWH = this.getColumnWH();
        let offset = 0;
        if (pageSize) {
            offset = columnWH * pageSize;
        } else {
            const parentHeight = this.content!.parent!.height;
            offset = Math.floor(parentHeight / columnWH) * columnWH;
        }
        this.scrollView.stopAutoScroll();
        this.scrollView.scrollToOffset(cc.v2(0, offset * pageIndex), duration);
        return offset * (pageIndex + 1) >= contentHeight;
    }

    getVisibleElements(): number {
        let count = 0;
        if (this.horizontal) {
            const parentWidth = this.content!.parent!.width;
            count = Math.floor(parentWidth / this.getColumnWH());
        } else {
            const parentHeight = this.content!.parent!.height;
            count = Math.floor(parentHeight / this.getColumnWH());
        }
        return count * this.column;
    }

    getColumnWH(): number {
        return this.horizontal ? this._itemWidth + this.spacing.x : this._itemHeight + this.spacing.y;
    }

    notifyUpdate(): void {
        if (this.adapter != null) {
            if (!this._isOnLoadCalled) {
                this.init();
            }
            if (this.scrollView && this.content) {
                if (this.emptyView) {
                    this.emptyView.opacity = this.adapter.getCount() > 0 ? 0 : 255;
                }
                this.visibleRange[0] = this.visibleRange[1] = -1;
                if (this.horizontal) {
                    this.content.width = Math.ceil(this.adapter.getCount() / this.column) *
                        (this._itemWidth + this.spacing.x) - this.spacing.x + this.margin.x + this.margin.width;
                } else {
                    this.content.height = Math.ceil(this.adapter.getCount() / this.column) *
                        (this._itemHeight + this.spacing.y) - this.spacing.y + this.margin.y + this.margin.height;
                }
                this.dataChanged = true;
            }
        }
    }

    getNodeByIndex(index: number): cc.Node | null {
        return this._filledIds[index] || null;
    }

    getIndexByNode(node: cc.Node): number {
        for (const key in this._filledIds) {
            if (this._filledIds.hasOwnProperty(key) && this._filledIds[key] === node) {
                return parseInt(key);
            }
        }
        return -1;
    }

    lateUpdate(): void {
        const range = this.getVisibleRange();
        if (this.checkNeedUpdate(range)) {
            this.recycleDirty(range!);
            this.updateView(range!);
        }
    }

    _layoutVertical(node: cc.Node, index: number): void {
        this.content!.addChild(node);
        const col = index % (this.column || 1);
        const row = Math.floor(index / (this.column || 1));
        const x = this.column > 1 ?
            this.margin.x + node.width * node.anchorX + (node.width + this.spacing.x) * col -
            this.content!.width * this.content!.anchorX : 0;
        const y = -this.margin.y - node.height * (node.anchorY + row) - this.spacing.y * row;
        node.setPosition(x, y);
    }

    _layoutHorizontal(node: cc.Node, index: number): void {
        this.content!.addChild(node);
        const col = index % (this.column || 1);
        let row = index / (this.column || 1);
        if (!this.isCenter) {
            row = Math.floor(row);
        }
        const x = node.width * (node.anchorX + row) + this.spacing.x * row + this.margin.x;
        const y = this.column > 1 ?
            -1 * (this.margin.y + node.height * node.anchorY + (node.height + this.spacing.y) * col -
                this.content!.height * this.content!.anchorY) : this.margin.y;
        node.setPosition(x, y);
    }

    recycleAll(): void {
        for (const key in this._filledIds) {
            if (this._filledIds.hasOwnProperty(key) && this._filledIds[key]) {
                this._items!.put(this._filledIds[key]!);
            }
        }
        this._filledIds = {};
    }

    recycleDirty(range: number[]): void {
        if (range && !(range.length < 2)) {
            for (let i = this.visibleRange[0]; i < range[0]; i++) {
                if (!(i < 0) && this._filledIds[i]) {
                    this._items!.put(this._filledIds[i]!);
                    this._filledIds[i] = null;
                }
            }
            for (let i = Object.values(this._filledIds).length; i > range[1]; i--) {
                if (!(i < 0) && this._filledIds[i]) {
                    this._items!.put(this._filledIds[i]!);
                    this._filledIds[i] = null;
                }
            }
            this.visibleRange[0] = range[0];
            this.visibleRange[1] = range[1];
        }
    }

    checkNeedUpdate(range: number[] | null): boolean {
        return !!(range && this.visibleRange &&
            (this.visibleRange[0] !== range[0] || this.visibleRange[1] !== range[1]));
    }

    updateView(range: number[]): void {
        let centerOffset = 0;
        if (this.isCenter) {
            const visibleCount = range[1] - range[0] + 1;
            const maxVisible = this.column > 1 ? this.column : this.getVisibleElements();
            centerOffset = visibleCount < maxVisible ? (maxVisible - visibleCount) / 2 : 0;
        }
        for (let i = range[0]; i <= range[1]; i++) {
            if (this.dataChanged || !this._filledIds[i]) {
                let node = this._filledIds[i] ||
                    this._items!.get() ||
                    this.resLoader.instantiate(this.itemTemplate ? this.itemTemplate : this.itemPrefabTemplate);
                node.active = true;
                ClickAudio.addClickAudio(node);
                if (this.comp && !(node.getComponent(cc.Component) instanceof this.comp)) {
                    node.removeComponent(cc.Component);
                    node.addComponent(this.comp);
                }
                node.removeFromParent(false);
                const layoutIndex = this.isCenter ? i - range[0] + centerOffset : i;
                if (this.horizontal) {
                    this._layoutHorizontal(node, layoutIndex);
                } else {
                    this._layoutVertical(node, layoutIndex);
                }
                this._filledIds[i] = this.adapter!._getView(node, i);
            }
        }
        this.dataChanged = false;
    }

    getVisibleRange(): number[] | null {
        if (this.adapter == null) {
            return null;
        }
        const scrollOffset = this.scrollView!.getScrollOffset();
        let startRow = 0;
        if (this.horizontal) {
            startRow = Math.floor(-scrollOffset.x / (this._itemWidth + this.spacing.x));
        } else {
            startRow = Math.floor(scrollOffset.y / (this._itemHeight + this.spacing.y));
        }
        if (startRow < 0) {
            startRow = 0;
        }
        let endIndex = this.column * (startRow + this._itemsVisible + this.spawnCount);
        if (endIndex >= this.adapter.getCount()) {
            endIndex = this.adapter.getCount() - 1;
        }
        return [startRow * this.column, endIndex];
    }

    init(): void {
        if (!this._isInited) {
            this._isInited = true;
            const widget = this.getComponent(cc.Widget);
            if (widget) {
                widget.updateAlignment();
            }
            if (this.scrollView) {
                this.content = this.scrollView.content;
                const contentParentWidget = this.content.parent!.getComponent(cc.Widget);
                if (contentParentWidget) {
                    contentParentWidget.updateAlignment();
                }
                this.horizontal = this.scrollView.horizontal;
                if (this.horizontal) {
                    this.scrollView.vertical = false;
                    this.content.anchorX = 0;
                    this.content.anchorY = this.content.parent!.anchorY;
                    this.content.x = 0 - this.content.parent!.width * this.content.parent!.anchorX;
                    this.content.y = 0;
                } else {
                    this.scrollView.vertical = true;
                    this.content.anchorX = this.content.parent!.anchorX;
                    this.content.anchorY = 1;
                    this.content.x = 0;
                    this.content.y = this.content.parent!.height * this.content.parent!.anchorY;
                }
            } else {
                console.error("ListView need a scrollView for showing.");
            }
            if (!this._items) {
                this._items = new cc.NodePool(this.comp as any);
            }
            const sampleNode = this._items.get() ||
                this.resLoader.instantiate(this.itemTemplate ? this.itemTemplate : this.itemPrefabTemplate);
            ClickAudio.addClickAudio(sampleNode);
            sampleNode.active = true;
            this._items.put(sampleNode);
            this._itemHeight = sampleNode.height || 10;
            this._itemWidth = sampleNode.width || 10;
            if (this.horizontal) {
                this._itemsVisible = Math.ceil(
                    (this.content!.parent!.width - this.margin.x - this.margin.width) /
                    (this._itemWidth + this.spacing.x)
                );
            } else {
                this._itemsVisible = Math.ceil(
                    (this.content!.parent!.height - this.margin.y - this.margin.height) /
                    (this._itemHeight + this.spacing.y)
                );
            }
        }
    }

    setItemRender(itemRender: (node: cc.Node, index: number, data: any) => void, context?: any): this | undefined {
        if (itemRender) {
            if (!this.adapter) {
                this.adapter = new DefaultAdapter();
            }
            (this.adapter as DefaultAdapter).updateView = itemRender.bind(context);
            this.notifyUpdate();
            return this;
        }
        console.error("ListView.setItemRender: itemRender is null or undefined.");
        return undefined;
    }

    get datas(): any[] | null {
        return this.adapter ? this.adapter.dataSet : null;
    }

    set datas(value: any[]) {
        if (!this.adapter) {
            this.adapter = new DefaultAdapter();
        }
        this.adapter.setDataSet(value);
        this.notifyUpdate();
    }
}

export class Pager {
    listView: ListView | null = null;
    pageOfItems = 0;
    currentPageIndex = 0;
    onPageChangeListener: ((listView: ListView, pageIndex: number) => void) | null = null;
    srcOnTouchEnded: ((event: cc.Event.EventTouch, captureListeners?: any) => void) | null = null;
    srcOnTouchBegan: ((event: cc.Event.EventTouch, captureListeners?: any) => void) | null = null;
    srcHandleReleaseLogic: (() => void) | null = null;
    _initAutoScrollToPage = false;
    touchBeganPosition: cc.Vec2 | null = null;
    touchEndPosition: cc.Vec2 | null = null;

    constructor(listView: ListView, pageOfItems = 0) {
        this.listView = listView;
        this.pageOfItems = pageOfItems;
    }

    initAutoScrollToPage(): void {
        if (!this._initAutoScrollToPage) {
            const scrollView = this.listView!.getScrollView()!;
            this.srcOnTouchBegan = scrollView._onTouchBegan.bind(scrollView);
            scrollView._onTouchBegan = this.onTouchStartListener.bind(this);
            this.srcOnTouchEnded = scrollView._onTouchEnded.bind(scrollView);
            scrollView._onTouchEnded = this.onTouchEndListener.bind(this);
            this.srcHandleReleaseLogic = scrollView._handleReleaseLogic.bind(scrollView);
            scrollView._handleReleaseLogic = this.handleReleaseLogicListener.bind(this);
            this._initAutoScrollToPage = true;
        }
    }

    onTouchStartListener(event: cc.Event.EventTouch, captureListeners?: any): void {
        this.touchBeganPosition = event.touch.getLocation();
        this.srcOnTouchBegan!(event, captureListeners);
    }

    onTouchEndListener(event: cc.Event.EventTouch, captureListeners?: any): void {
        this.touchEndPosition = event.touch.getLocation();
        this.srcOnTouchEnded!(event, captureListeners);
    }

    handleReleaseLogicListener(): void {
        this.autoScrollToPage();
        const scrollView = this.listView!.getScrollView()!;
        if (scrollView._scrolling) {
            scrollView._scrolling = false;
            if (!scrollView._autoScrolling) {
                scrollView.node.emit("scroll-ended");
            }
        }
    }

    autoScrollToPage(): void {
        if (this.touchBeganPosition && this.touchEndPosition) {
            const delta = this.touchBeganPosition.sub(this.touchEndPosition);
            let page = this.getCurrentPage() + this.getDragDirection(delta);
            page = cc.misc.clampf(page, 0, this.getPageCount() - 1);
            this.currentPageIndex = page;
            this.listView!.scrollToPage(page, 0, 0.5);
            if (this.onPageChangeListener) {
                this.onPageChangeListener(this.listView!, this.currentPageIndex);
            }
        }
    }

    getDragDirection(delta: cc.Vec2): number {
        const scrollView = this.listView!.getScrollView()!;
        if (scrollView.horizontal) {
            if (delta.x === 0) {
                return 0;
            }
            return delta.x > 0 ? 1 : -1;
        }
        if (scrollView.vertical) {
            if (delta.y === 0) {
                return 0;
            }
            return delta.y < 0 ? 1 : -1;
        }
        return undefined as any;
    }

    getPageCount(): number {
        if (!this.listView!.getAdapter()) {
            return 1;
        }
        const count = this.listView!.getAdapter()!.getCount();
        if (!this.pageOfItems) {
            this.pageOfItems = this.listView!.getVisibleElements();
        }
        if (this.pageOfItems <= 0) {
            this.pageOfItems = 1;
        }
        return Math.ceil(count / this.pageOfItems);
    }

    getCurrentPage(): number {
        return this.currentPageIndex;
    }

    prePage(): void {
        if (!this.listView!.getScrollView()!.isScrolling()) {
            this.currentPageIndex--;
            if (this.currentPageIndex < 0) {
                this.currentPageIndex = 0;
            }
            this.listView!.scrollToPage(this.currentPageIndex, 0, 0.5);
            if (this.onPageChangeListener) {
                this.onPageChangeListener(this.listView!, this.currentPageIndex);
            }
        }
    }

    nextPage(): void {
        if (!this.listView!.getScrollView()!.isScrolling()) {
            this.currentPageIndex++;
            const pageCount = this.getPageCount();
            if (this.currentPageIndex > pageCount - 1) {
                this.currentPageIndex = pageCount - 1;
            }
            this.listView!.scrollToPage(this.currentPageIndex, 0, 0.5);
            if (this.onPageChangeListener) {
                this.onPageChangeListener(this.listView!, this.currentPageIndex);
            }
        }
    }

    canPrePage(): boolean {
        return this.currentPageIndex > 0;
    }

    canNextPage(): boolean {
        return this.currentPageIndex < this.getPageCount() - 1;
    }

    setOnPageChangeListener(listener: (listView: ListView, pageIndex: number) => void): void {
        this.onPageChangeListener = listener;
    }

    scrollToPageByIndex(pageIndex: number, duration = 0.5): void {
        const pageCount = this.getPageCount();
        this.currentPageIndex = cc.misc.clampf(pageIndex, 0, pageCount - 1);
        this.listView!.scrollToPage(this.currentPageIndex, 0, duration);
    }
}

export class AbsAdapter {
    _dataSet: any[] = [];

    get dataSet(): any[] {
        return this._dataSet;
    }

    setDataSet(data: any[]): void {
        this._dataSet = data || [];
    }

    getCount(): number {
        return this.dataSet ? this.dataSet.length : 0;
    }

    getData(index: number): any {
        return this.dataSet[index];
    }

    _getView(node: cc.Node, index: number): cc.Node {
        this.updateView(node, index, this.getData(index));
        node.zIndex = index;
        node.on(cc.Node.EventType.TOUCH_END, this.onClickBase, this);
        return node;
    }

    onClickBase(event: cc.Event.EventTouch): void {
        const target = event.currentTarget as cc.Node;
        this.onClickItem(target, this.getData(target.zIndex), target.zIndex);
    }

    onClickItem(_node: cc.Node, _data: any, _index: number): void {
    }

    updateView(_node: cc.Node, _index: number, _data: any): void {
    }
}

class DefaultAdapter extends AbsAdapter {
    updateView(_node: cc.Node, _index: number, _data: any): void {
    }
}
