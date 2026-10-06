import ResMgr from "./ResMgr";
import ClickAudio from "./ClickAudio";

const { ccclass, property, menu } = cc._decorator;
const BaseComponent = cc.Component;

export class Pager {
    listView: any;
    pageOfItems: number;
    currentPageIndex: number;
    onPageChangeListener: any;
    srcOnTouchEnded: any;
    srcOnTouchBegan: any;
    srcHandleReleaseLogic: any;
    _initAutoScrollToPage: boolean;
    touchBeganPosition: cc.Vec2;
    touchEndPosition: cc.Vec2;

    constructor(listView: any, pageOfItems: number = 0) {
        this.listView = null;
        this.pageOfItems = 0;
        this.currentPageIndex = 0;
        this.onPageChangeListener = null;
        this.srcOnTouchEnded = null;
        this.srcOnTouchBegan = null;
        this.srcHandleReleaseLogic = null;
        this._initAutoScrollToPage = false;
        this.touchBeganPosition = null;
        this.touchEndPosition = null;
        this.listView = listView;
        this.pageOfItems = pageOfItems;
    }

    initAutoScrollToPage() {
        if (!this._initAutoScrollToPage) {
            const scrollView = this.listView.getScrollView();
            this.srcOnTouchBegan = scrollView._onTouchBegan.bind(scrollView);
            scrollView._onTouchBegan = this.onTouchStartListener.bind(this);
            this.srcOnTouchEnded = scrollView._onTouchEnded.bind(scrollView);
            scrollView._onTouchEnded = this.onTouchEndListener.bind(this);
            this.srcHandleReleaseLogic = scrollView._handleReleaseLogic.bind(scrollView);
            scrollView._handleReleaseLogic = this.handleReleaseLogicListener.bind(this);
            this._initAutoScrollToPage = true;
        }
    }

    onTouchStartListener(event: any, captureListeners: any) {
        this.touchBeganPosition = event.touch.getLocation();
        this.srcOnTouchBegan(event, captureListeners);
    }

    onTouchEndListener(event: any, captureListeners: any) {
        this.touchEndPosition = event.touch.getLocation();
        this.srcOnTouchEnded(event, captureListeners);
    }

    handleReleaseLogicListener() {
        this.autoScrollToPage();
        const scrollView = this.listView.getScrollView();
        if (scrollView._scrolling) {
            scrollView._scrolling = false;
            scrollView._autoScrolling || scrollView.node.emit(" scroll- ended ");
        }
    }

    autoScrollToPage() {
        if (this.touchBeganPosition && this.touchEndPosition) {
            const delta = this.touchBeganPosition.sub(this.touchEndPosition);
            let page = this.getCurrentPage() + this.getDragDirection(delta);
            page = cc.misc.clampf(page, 0, this.getPageCount() - 1);
            this.currentPageIndex = page;
            this.listView.scrollToPage(page, 0, .5);
            this.onPageChangeListener && this.onPageChangeListener(this.listView, this.currentPageIndex);
        }
    }

    getDragDirection(delta: cc.Vec2) {
        return this.listView.getScrollView().horizontal ? 0 === delta.x ? 0 : delta.x > 0 ? 1 : -1 : this.listView.getScrollView().vertical ? 0 === delta.y ? 0 : delta.y < 0 ? 1 : -1 : void 0;
    }

    getPageCount() {
        if (!this.listView.getAdapter()) return 1;
        const count = this.listView.getAdapter().getCount();
        this.pageOfItems || (this.pageOfItems = this.listView.getVisibleElements());
        this.pageOfItems <= 0 && (this.pageOfItems = 1);
        return Math.ceil(count / this.pageOfItems);
    }

    getCurrentPage() {
        return this.currentPageIndex;
    }

    prePage() {
        if (!this.listView.getScrollView().isScrolling()) {
            this.currentPageIndex--;
            this.currentPageIndex < 0 && (this.currentPageIndex = 0);
            this.listView.scrollToPage(this.currentPageIndex, 0, .5);
            this.onPageChangeListener && this.onPageChangeListener(this.listView, this.currentPageIndex);
        }
    }

    nextPage() {
        if (!this.listView.getScrollView().isScrolling()) {
            this.currentPageIndex++;
            const pageCount = this.getPageCount();
            this.currentPageIndex > pageCount - 1 && (this.currentPageIndex = pageCount - 1);
            this.listView.scrollToPage(this.currentPageIndex, 0, .5);
            this.onPageChangeListener && this.onPageChangeListener(this.listView, this.currentPageIndex);
        }
    }

    canPrePage() {
        return this.currentPageIndex > 0;
    }

    canNextPage() {
        return this.currentPageIndex < this.getPageCount() - 1;
    }

    setOnPageChangeListener(listener: any) {
        this.onPageChangeListener = listener;
    }

    scrollToPageByIndex(index: number, duration: number = .5) {
        const pageCount = this.getPageCount();
        this.currentPageIndex = cc.misc.clampf(index, 0, pageCount - 1);
        this.listView.scrollToPage(this.currentPageIndex, 0, duration);
    }
}

export class AbsAdapter {
    _dataSet: any[];

    constructor() {
        this._dataSet = [];
    }

    get dataSet() {
        return this._dataSet;
    }

    setDataSet(data: any[]) {
        this._dataSet = data || [];
    }

    getCount() {
        return this.dataSet ? this.dataSet.length : 0;
    }

    getData(index: number) {
        return this.dataSet[index];
    }

    _getView(node: cc.Node, index: number) {
        this.updateView(node, index, this.getData(index));
        node.zIndex = index;
        node.on(cc.Node.EventType.TOUCH_END, this.onClickBase, this);
        return node;
    }

    onClickBase(event: any) {
        const target = event.currentTarget;
        this.onClickItem(target, this.getData(target.zIndex), target.zIndex);
    }

    onClickItem(_node: cc.Node, _data: any, _index: number) { }

    updateView(_node: cc.Node, _index: number, _data: any) { }
}

class DefaultAdapter extends AbsAdapter {
    updateView() { }
}

@ccclass
@menu(" UI/ Cocos/ ListView ")
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
    _filledIds: any = {};
    horizontal: boolean = false;
    _itemHeight: number = 1;
    _itemWidth: number = 1;
    _itemsVisible: number = 1;
    dataChanged: boolean = false;
    _isInited: boolean = false;
    visibleRange: number[] = [-1, -1];
    _pager: Pager = null;
    comp: any = null;
    _resLoader: any = null;
    _items: cc.NodePool = null;
    _isOnLoadCalled: boolean = false;

    get pager() {
        this._pager || (this._pager = new Pager(this));
        return this._pager;
    }

    get resLoader() {
        if (!this._resLoader) {
            this._resLoader = ResMgr.getInstance().getKeeper(this, true);
            this._resLoader.bindSelfAsset();
        }
        return this._resLoader;
    }

    get datas() {
        return this.adapter ? this.adapter.dataSet : null;
    }

    set datas(value: any[]) {
        this.adapter || (this.adapter = new DefaultAdapter());
        this.adapter.setDataSet(value);
        this.notifyUpdate();
    }

    onLoad() {
        null != this.itemTemplate && this.itemTemplate.active && (this.itemTemplate.active = false);
        this.resLoader;
        this.init();
        this.scrollView;
    }

    async setAdapter(adapter: AbsAdapter) {
        if (this.adapter === adapter) {
            this.notifyUpdate();
            return;
        }
        this.adapter = adapter;
        if (null == this.adapter) {
            console.warn(" adapter 为空.");
            return;
        }
        if (null == this.itemTemplate && null == this.itemPrefabTemplate) {
            console.error(" Listview 未设置待显示的Item模板.");
            return;
        }
        this.visibleRange[0] = this.visibleRange[1] = -1;
        this.recycleAll();
        this.notifyUpdate();
    }

    getAdapter() {
        return this.adapter;
    }

    getScrollView() {
        return this.scrollView;
    }

    getAllItems() {
        return this._items;
    }

    refreshAdapter(adapter: AbsAdapter) {
        this.adapter = adapter;
        this.visibleRange[0] = this.visibleRange[1] = -1;
        this.recycleAll();
        this.notifyUpdate();
    }

    scrollToPage(page: number, pageSize: number, duration: number) {
        if (!this.adapter || !this.scrollView) return false;
        this.adapter.getCount();
        if (this.horizontal) {
            let offset = 0;
            const contentWidth = this.content.width;
            const columnSize = this.getColumnWH();
            if (pageSize) offset = columnSize * pageSize;
            else {
                const parentWidth = Math.ceil(this.content.parent.width);
                offset = Math.floor(parentWidth / columnSize) * columnSize;
            }
            this.scrollView.stopAutoScroll();
            this.scrollView.scrollToOffset(cc.v2(offset * page, 0), duration);
            return offset * (page + 1) >= contentWidth;
        }
        const contentHeight = this.content.height;
        const columnSize = this.getColumnWH();
        let offset = 0;
        if (pageSize) offset = columnSize * pageSize;
        else {
            const parentHeight = this.content.parent.height;
            offset = Math.floor(parentHeight / columnSize) * columnSize;
        }
        this.scrollView.stopAutoScroll();
        this.scrollView.scrollToOffset(cc.v2(0, offset * page), duration);
        return offset * (page + 1) >= contentHeight;
    }

    getVisibleElements() {
        let count = 0;
        if (this.horizontal) {
            const width = this.content.parent.width;
            count = Math.floor(width / this.getColumnWH());
        } else {
            const height = this.content.parent.height;
            count = Math.floor(height / this.getColumnWH());
        }
        return count * this.column;
    }

    getColumnWH() {
        return this.horizontal ? this._itemWidth + this.spacing.x : this._itemHeight + this.spacing.y;
    }

    notifyUpdate() {
        if (null != this.adapter) {
            this._isOnLoadCalled || this.init();
            this.scrollView && this.content && (this.emptyView && (this.emptyView.opacity = this.adapter.getCount() > 0 ? 0 : 255),
                this.visibleRange[0] = this.visibleRange[1] = -1,
                this.horizontal ? this.content.width = Math.ceil(this.adapter.getCount() / this.column) * (this._itemWidth + this.spacing.x) - this.spacing.x + this.margin.x + this.margin.width : this.content.height = Math.ceil(this.adapter.getCount() / this.column) * (this._itemHeight + this.spacing.y) - this.spacing.y + this.margin.y + this.margin.height,
                this.dataChanged = true);
        }
    }

    getNodeByIndex(index: number) {
        return this._filledIds[index];
    }

    getIndexByNode(node: cc.Node) {
        for (const key in this._filledIds) {
            if (this._filledIds.hasOwnProperty(key) && this._filledIds[key] === node) return parseInt(key);
        }
        return -1;
    }

    lateUpdate() {
        const range = this.getVisibleRange();
        if (this.checkNeedUpdate(range)) {
            this.recycleDirty(range);
            this.updateView(range);
        }
    }

    _layoutVertical(node: cc.Node, index: number) {
        this.content.addChild(node);
        const columnIndex = index % (this.column || 1);
        const rowIndex = Math.floor(index / (this.column || 1));
        const x = this.column > 1 ? this.margin.x + node.width * node.anchorX + (node.width + this.spacing.x) * columnIndex - this.content.width * this.content.anchorX : 0;
        const y = -this.margin.y - node.height * (node.anchorY + rowIndex) - this.spacing.y * rowIndex;
        node.setPosition(x, y);
    }

    _layoutHorizontal(node: cc.Node, index: number) {
        this.content.addChild(node);
        const columnIndex = index % (this.column || 1);
        let rowIndex: number = index / (this.column || 1);
        this.isCenter || (rowIndex = Math.floor(rowIndex));
        const x = node.width * (node.anchorX + rowIndex) + this.spacing.x * rowIndex + this.margin.x;
        const y = this.column > 1 ? -1 * (this.margin.y + node.height * node.anchorY + (node.height + this.spacing.y) * columnIndex - this.content.height * this.content.anchorY) : this.margin.y;
        node.setPosition(x, y);
    }

    recycleAll() {
        for (const key in this._filledIds) {
            this._filledIds.hasOwnProperty(key) && this._items.put(this._filledIds[key]);
        }
        this._filledIds = {};
    }

    recycleDirty(range: number[]) {
        if (range && !(range.length < 2)) {
            for (let index = this.visibleRange[0]; index < range[0]; index++) {
                if (!(index < 0) && this._filledIds[index]) {
                    this._items.put(this._filledIds[index]);
                    this._filledIds[index] = null;
                }
            }
            for (let index = Object.values(this._filledIds).length; index > range[1]; index--) {
                if (!(index < 0) && this._filledIds[index]) {
                    this._items.put(this._filledIds[index]);
                    this._filledIds[index] = null;
                }
            }
            this.visibleRange[0] = range[0];
            this.visibleRange[1] = range[1];
        }
    }

    checkNeedUpdate(range: number[]) {
        return range && this.visibleRange && (this.visibleRange[0] != range[0] || this.visibleRange[1] != range[1]);
    }

    updateView(range: number[]) {
        let centerOffset = 0;
        if (this.isCenter) {
            const visibleCount = range[1] - range[0] + 1;
            const maxVisible = this.column > 1 ? this.column : this.getVisibleElements();
            centerOffset = visibleCount < maxVisible ? (maxVisible - visibleCount) / 2 : 0;
        }
        for (let index = range[0]; index <= range[1]; index++) {
            if (this.dataChanged || !this._filledIds[index]) {
                const node = this._filledIds[index] || this._items.get() || this.resLoader.instantiate(this.itemTemplate ? this.itemTemplate : this.itemPrefabTemplate);
                node.active = true;
                ClickAudio.addClickAudio(node);
                if (this.comp && !(node.getComponent(BaseComponent) instanceof this.comp)) {
                    node.removeComponent(BaseComponent);
                    node.addComponent(this.comp);
                }
                node.removeFromParent(false);
                const layoutIndex = this.isCenter ? index - range[0] + centerOffset : index;
                this.horizontal ? this._layoutHorizontal(node, layoutIndex) : this._layoutVertical(node, layoutIndex);
                this._filledIds[index] = this.adapter._getView(node, index);
            }
        }
        this.dataChanged = false;
    }

    getVisibleRange() {
        if (null == this.adapter) return null;
        const offset = this.scrollView.getScrollOffset();
        let start = 0;
        start = this.horizontal ? Math.floor(-offset.x / (this._itemWidth + this.spacing.x)) : Math.floor(offset.y / (this._itemHeight + this.spacing.y));
        start < 0 && (start = 0);
        let end = this.column * (start + this._itemsVisible + this.spawnCount);
        end >= this.adapter.getCount() && (end = this.adapter.getCount() - 1);
        return [start * this.column, end];
    }

    init() {
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
            } else console.error(" ListView need a scrollView for showing.");
            this._items || (this._items = new cc.NodePool(this.comp));
            const sample = this._items.get() || this.resLoader.instantiate(this.itemTemplate ? this.itemTemplate : this.itemPrefabTemplate);
            ClickAudio.addClickAudio(sample);
            sample.active = true;
            this._items.put(sample);
            this._itemHeight = sample.height || 10;
            this._itemWidth = sample.width || 10;
            this.horizontal ? this._itemsVisible = Math.ceil((this.content.parent.width - this.margin.x - this.margin.width) / (this._itemWidth + this.spacing.x)) : this._itemsVisible = Math.ceil((this.content.parent.height - this.margin.y - this.margin.height) / (this._itemHeight + this.spacing.y));
        }
    }

    setItemRender(itemRender: any, context: any) {
        if (itemRender) {
            this.adapter || (this.adapter = new DefaultAdapter());
            this.adapter.updateView = itemRender.bind(context);
            this.notifyUpdate();
            return this;
        }
        console.error(" ListView.setItemRender: itemRender is null or undefined.");
    }
}
