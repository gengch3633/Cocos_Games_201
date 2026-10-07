import ClickAudio from "./ClickAudio";
import ResMgr from "./ResMgr";

const { ccclass, property, menu } = cc._decorator;

export class AbsAdapter {
    protected _dataSet: any[] = [];

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

    onClickItem(_node: cc.Node, _data: any, _index: number): void {}

    updateView(_node: cc.Node, _index: number, _data: any): void {}
}

class SimpleAdapter extends AbsAdapter {
    updateView(): void {}
}

export class Pager {
    listView: ListView = null;
    pageOfItems: number = 0;
    currentPageIndex: number = 0;
    onPageChangeListener: ((listView: ListView, pageIndex: number) => void) | null = null;

    private srcOnTouchEnded: Function = null;
    private srcOnTouchBegan: Function = null;
    private srcHandleReleaseLogic: Function = null;
    private _initAutoScrollToPage: boolean = false;
    private touchBeganPosition: cc.Vec2 = null;
    private touchEndPosition: cc.Vec2 = null;

    constructor(listView: ListView, pageOfItems: number = 0) {
        this.listView = listView;
        this.pageOfItems = pageOfItems;
    }

    initAutoScrollToPage(): void {
        if (!this._initAutoScrollToPage) {
            const scrollView = this.listView.getScrollView() as any;
            this.srcOnTouchBegan = scrollView._onTouchBegan.bind(scrollView);
            scrollView._onTouchBegan = this.onTouchStartListener.bind(this);
            this.srcOnTouchEnded = scrollView._onTouchEnded.bind(scrollView);
            scrollView._onTouchEnded = this.onTouchEndListener.bind(this);
            this.srcHandleReleaseLogic = scrollView._handleReleaseLogic.bind(scrollView);
            scrollView._handleReleaseLogic = this.handleReleaseLogicListener.bind(this);
            this._initAutoScrollToPage = true;
        }
    }

    onTouchStartListener(event: cc.Event.EventTouch, captureListeners: any): void {
        this.touchBeganPosition = event.touch.getLocation();
        this.srcOnTouchBegan(event, captureListeners);
    }

    onTouchEndListener(event: cc.Event.EventTouch, captureListeners: any): void {
        this.touchEndPosition = event.touch.getLocation();
        this.srcOnTouchEnded(event, captureListeners);
    }

    handleReleaseLogicListener(): void {
        this.autoScrollToPage();
        const scrollView = this.listView.getScrollView() as any;
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
            let pageIndex = this.getCurrentPage() + this.getDragDirection(delta);
            pageIndex = cc.misc.clampf(pageIndex, 0, this.getPageCount() - 1);
            this.currentPageIndex = pageIndex;
            this.listView.scrollToPage(pageIndex, 0, 0.5);
            this.onPageChangeListener && this.onPageChangeListener(this.listView, this.currentPageIndex);
        }
    }

    getDragDirection(delta: cc.Vec2): number {
        const scrollView = this.listView.getScrollView();
        if (scrollView.horizontal) {
            return delta.x === 0 ? 0 : delta.x > 0 ? 1 : -1;
        }
        if (scrollView.vertical) {
            return delta.y === 0 ? 0 : delta.y < 0 ? 1 : -1;
        }
        return undefined;
    }

    getPageCount(): number {
        if (!this.listView.getAdapter()) {
            return 1;
        }
        const count = this.listView.getAdapter().getCount();
        if (!this.pageOfItems) {
            this.pageOfItems = this.listView.getVisibleElements();
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
        if (!this.listView.getScrollView().isScrolling()) {
            this.currentPageIndex--;
            if (this.currentPageIndex < 0) {
                this.currentPageIndex = 0;
            }
            this.listView.scrollToPage(this.currentPageIndex, 0, 0.5);
            this.onPageChangeListener && this.onPageChangeListener(this.listView, this.currentPageIndex);
        }
    }

    nextPage(): void {
        if (!this.listView.getScrollView().isScrolling()) {
            this.currentPageIndex++;
            const pageCount = this.getPageCount();
            if (this.currentPageIndex > pageCount - 1) {
                this.currentPageIndex = pageCount - 1;
            }
            this.listView.scrollToPage(this.currentPageIndex, 0, 0.5);
            this.onPageChangeListener && this.onPageChangeListener(this.listView, this.currentPageIndex);
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

    scrollToPageByIndex(pageIndex: number, duration: number = 0.5): void {
        const pageCount = this.getPageCount();
        this.currentPageIndex = cc.misc.clampf(pageIndex, 0, pageCount - 1);
        this.listView.scrollToPage(this.currentPageIndex, 0, duration);
    }
}

@ccclass
@menu("UI/Cocos/ListView")
export default class ListView extends cc.Component {
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    @property(cc.Prefab)
    itemPrefabTemplate: cc.Prefab = null;

    @property(cc.Vec2)
    spacing: cc.Vec2 = cc.v2(0, 0);

    @property({
        tooltip: " 四周边距 "
    })
    margin: cc.Rect = cc.rect(0, 0, 0, 0);

    @property({
        tooltip: " 比可见元素多缓存2个, 缓存越多, 快速滑动越流畅, 但同时初始化越慢."
    })
    spawnCount: number = 2;

    @property({
        tooltip: " 行列数 ， 横向滚动是行数 ， 竖向滚动是列数."
    })
    column: number = 1;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    emptyView: cc.Node = null;

    @property({
        tooltip: " 当可见元素小于最大可见数量时候, 是否居中显示 "
    })
    isCenter: boolean = false;

    content: cc.Node = null;
    adapter: AbsAdapter = null;
    comp: typeof cc.Component = null;

    private _filledIds: { [index: number]: cc.Node } = {};
    private horizontal: boolean = false;
    private _itemHeight: number = 1;
    private _itemWidth: number = 1;
    private _itemsVisible: number = 1;
    private dataChanged: boolean = false;
    private _isInited: boolean = false;
    visibleRange: number[] = [-1, -1];
    private _pager: Pager = null;
    private _resLoader: any = null;
    private _items: cc.NodePool = null;

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

    get datas(): any[] {
        return this.adapter ? this.adapter.dataSet : null;
    }

    set datas(value: any[]) {
        if (!this.adapter) {
            this.adapter = new SimpleAdapter();
        }
        this.adapter.setDataSet(value);
        this.notifyUpdate();
    }

    onLoad(): void {
        if (this.itemTemplate != null && this.itemTemplate.active) {
            this.itemTemplate.active = false;
        }
        this.resLoader;
        this.init();
        this.scrollView;
    }

    async setAdapter(adapter: AbsAdapter): Promise<void> {
        if (this.adapter === adapter) {
            this.notifyUpdate();
            return;
        }
        this.adapter = adapter;
        if (this.adapter == null) {
            console.warn("adapter为空.");
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

    getAdapter(): AbsAdapter {
        return this.adapter;
    }

    getScrollView(): cc.ScrollView {
        return this.scrollView;
    }

    getAllItems(): cc.NodePool {
        return this._items;
    }

    refreshAdapter(adapter: AbsAdapter): void {
        this.adapter = adapter;
        this.visibleRange[0] = this.visibleRange[1] = -1;
        this.recycleAll();
        this.notifyUpdate();
    }

    scrollToPage(pageIndex: number, pageSize?: number, duration?: number): boolean {
        if (!this.adapter || !this.scrollView) {
            return false;
        }
        this.adapter.getCount();
        if (this.horizontal) {
            let offset = 0;
            const contentWidth = this.content.width;
            const columnSize = this.getColumnWH();
            if (pageSize) {
                offset = columnSize * pageSize;
            } else {
                const visibleWidth = Math.ceil(this.content.parent.width);
                offset = Math.floor(visibleWidth / columnSize) * columnSize;
            }
            this.scrollView.stopAutoScroll();
            this.scrollView.scrollToOffset(cc.v2(offset * pageIndex, 0), duration);
            return offset * (pageIndex + 1) >= contentWidth;
        }
        const contentHeight = this.content.height;
        const columnSize = this.getColumnWH();
        let offset = 0;
        if (pageSize) {
            offset = columnSize * pageSize;
        } else {
            const parentHeight = this.content.parent.height;
            offset = Math.floor(parentHeight / columnSize) * columnSize;
        }
        this.scrollView.stopAutoScroll();
        this.scrollView.scrollToOffset(cc.v2(0, offset * pageIndex), duration);
        return offset * (pageIndex + 1) >= contentHeight;
    }

    getVisibleElements(): number {
        let visibleCount = 0;
        if (this.horizontal) {
            const parentWidth = this.content.parent.width;
            visibleCount = Math.floor(parentWidth / this.getColumnWH());
        } else {
            const parentHeight = this.content.parent.height;
            visibleCount = Math.floor(parentHeight / this.getColumnWH());
        }
        return visibleCount * this.column;
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
                    this.content.width = Math.ceil(this.adapter.getCount() / this.column) * (this._itemWidth + this.spacing.x) - this.spacing.x + this.margin.x + this.margin.width;
                } else {
                    this.content.height = Math.ceil(this.adapter.getCount() / this.column) * (this._itemHeight + this.spacing.y) - this.spacing.y + this.margin.y + this.margin.height;
                }
                this.dataChanged = true;
            }
        }
    }

    getNodeByIndex(index: number): cc.Node {
        return this._filledIds[index];
    }

    getIndexByNode(node: cc.Node): number {
        for (const key in this._filledIds) {
            if (this._filledIds.hasOwnProperty(key) && this._filledIds[key] === node) {
                return parseInt(key, 10);
            }
        }
        return -1;
    }

    lateUpdate(): void {
        const visibleRange = this.getVisibleRange();
        if (this.checkNeedUpdate(visibleRange)) {
            this.recycleDirty(visibleRange);
            this.updateView(visibleRange);
        }
    }

    _layoutVertical(node: cc.Node, index: number): void {
        this.content.addChild(node);
        const columnIndex = index % (this.column || 1);
        const rowIndex = Math.floor(index / (this.column || 1));
        const x = this.column > 1
            ? this.margin.x + node.width * node.anchorX + (node.width + this.spacing.x) * columnIndex - this.content.width * this.content.anchorX
            : 0;
        const y = -this.margin.y - node.height * (node.anchorY + rowIndex) - this.spacing.y * rowIndex;
        node.setPosition(x, y);
    }

    _layoutHorizontal(node: cc.Node, index: number): void {
        this.content.addChild(node);
        const columnIndex = index % (this.column || 1);
        let rowIndex = index / (this.column || 1);
        if (!this.isCenter) {
            rowIndex = Math.floor(rowIndex);
        }
        const x = node.width * (node.anchorX + rowIndex) + this.spacing.x * rowIndex + this.margin.x;
        const y = this.column > 1
            ? -1 * (this.margin.y + node.height * node.anchorY + (node.height + this.spacing.y) * columnIndex - this.content.height * this.content.anchorY)
            : this.margin.y;
        node.setPosition(x, y);
    }

    recycleAll(): void {
        for (const key in this._filledIds) {
            if (this._filledIds.hasOwnProperty(key)) {
                this._items.put(this._filledIds[key]);
            }
        }
        this._filledIds = {};
    }

    recycleDirty(visibleRange: number[]): void {
        if (visibleRange && visibleRange.length >= 2) {
            for (let index = this.visibleRange[0]; index < visibleRange[0]; index++) {
                if (!(index < 0) && this._filledIds[index]) {
                    this._items.put(this._filledIds[index]);
                    this._filledIds[index] = null;
                }
            }
            for (let index = Object.values(this._filledIds).length; index > visibleRange[1]; index--) {
                if (!(index < 0) && this._filledIds[index]) {
                    this._items.put(this._filledIds[index]);
                    this._filledIds[index] = null;
                }
            }
            this.visibleRange[0] = visibleRange[0];
            this.visibleRange[1] = visibleRange[1];
        }
    }

    checkNeedUpdate(visibleRange: number[]): boolean {
        return visibleRange && this.visibleRange && (this.visibleRange[0] !== visibleRange[0] || this.visibleRange[1] !== visibleRange[1]);
    }

    updateView(visibleRange: number[]): void {
        let centerOffset = 0;
        if (this.isCenter) {
            const visibleCount = visibleRange[1] - visibleRange[0] + 1;
            const maxVisible = this.column > 1 ? this.column : this.getVisibleElements();
            centerOffset = visibleCount < maxVisible ? (maxVisible - visibleCount) / 2 : 0;
        }
        for (let index = visibleRange[0]; index <= visibleRange[1]; index++) {
            if (this.dataChanged || !this._filledIds[index]) {
                const node = this._filledIds[index]
                    || this._items.get()
                    || this.resLoader.instantiate(this.itemTemplate ? this.itemTemplate : this.itemPrefabTemplate);
                node.active = true;
                ClickAudio.addClickAudio(node);
                if (this.comp && !(node.getComponent(cc.Component) instanceof this.comp)) {
                    node.removeComponent(cc.Component);
                    node.addComponent(this.comp);
                }
                node.removeFromParent(false);
                const layoutIndex = this.isCenter ? index - visibleRange[0] + centerOffset : index;
                if (this.horizontal) {
                    this._layoutHorizontal(node, layoutIndex);
                } else {
                    this._layoutVertical(node, layoutIndex);
                }
                this._filledIds[index] = this.adapter._getView(node, index);
            }
        }
        this.dataChanged = false;
    }

    getVisibleRange(): number[] {
        if (this.adapter == null) {
            return null;
        }
        const scrollOffset = this.scrollView.getScrollOffset();
        let startIndex = 0;
        startIndex = this.horizontal
            ? Math.floor(-scrollOffset.x / (this._itemWidth + this.spacing.x))
            : Math.floor(scrollOffset.y / (this._itemHeight + this.spacing.y));
        if (startIndex < 0) {
            startIndex = 0;
        }
        let endIndex = this.column * (startIndex + this._itemsVisible + this.spawnCount);
        if (endIndex >= this.adapter.getCount()) {
            endIndex = this.adapter.getCount() - 1;
        }
        return [startIndex * this.column, endIndex];
    }

    init(): void {
        if (!this._isInited) {
            this._isInited = true;
            this.getComponent(cc.Widget)?.updateAlignment();
            if (this.scrollView) {
                this.content = this.scrollView.content;
                this.content.parent.getComponent(cc.Widget)?.updateAlignment();
                this.horizontal = this.scrollView.horizontal;
                if (this.horizontal) {
                    this.scrollView.vertical = false;
                    this.content.anchorX = 0;
                    this.content.anchorY = this.content.parent.anchorY;
                    this.content.x = 0 - this.content.parent.width * this.content.parent.anchorX;
                    this.content.y = 0;
                } else {
                    this.scrollView.vertical = true;
                    this.content.anchorX = this.content.parent.anchorX;
                    this.content.anchorY = 1;
                    this.content.x = 0;
                    this.content.y = this.content.parent.height * this.content.parent.anchorY;
                }
            } else {
                console.error("ListView need a scrollView for showing.");
            }
            if (!this._items) {
                this._items = new cc.NodePool(this.comp as any);
            }
            const sampleNode = this._items.get() || this.resLoader.instantiate(this.itemTemplate ? this.itemTemplate : this.itemPrefabTemplate);
            ClickAudio.addClickAudio(sampleNode);
            sampleNode.active = true;
            this._items.put(sampleNode);
            this._itemHeight = sampleNode.height || 10;
            this._itemWidth = sampleNode.width || 10;
            if (this.horizontal) {
                this._itemsVisible = Math.ceil((this.content.parent.width - this.margin.x - this.margin.width) / (this._itemWidth + this.spacing.x));
            } else {
                this._itemsVisible = Math.ceil((this.content.parent.height - this.margin.y - this.margin.height) / (this._itemHeight + this.spacing.y));
            }
        }
    }

    setItemRender(itemRender: (node: cc.Node, index: number, data: any) => void, context?: any): this {
        if (itemRender) {
            if (!this.adapter) {
                this.adapter = new SimpleAdapter();
            }
            this.adapter.updateView = itemRender.bind(context);
            this.notifyUpdate();
            return this;
        }
        console.error("ListView.setItemRender: itemRender is null or undefined.");
        return this;
    }
}
