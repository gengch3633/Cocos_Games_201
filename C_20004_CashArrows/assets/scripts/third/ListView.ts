import ClickAudio from "./ClickAudio";
import ResMgr from "./ResMgr";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("UI/Cocos/ListView")
export default class ListView extends cc.Component {
    @property(cc.Node)
    public itemTemplate: cc.Node = null;

    @property(cc.Prefab)
    public itemPrefabTemplate: cc.Prefab = null;

    @property(cc.Vec2)
    public spacing: cc.Vec2 = cc.v2(0, 0);

    @property({ tooltip: "四周边距" })
    public margin: cc.Rect = cc.rect(0, 0, 0, 0);

    @property({ tooltip: "比可见元素多缓存2个, 缓存越多,快速滑动越流畅,但同时初始化越慢." })
    public spawnCount: number = 2;

    @property({ tooltip: "行列数，横向滚动是行数，竖向滚动是列数." })
    public column: number = 1;

    @property(cc.ScrollView)
    public scrollView: cc.ScrollView = null;

    @property(cc.Node)
    public emptyView: cc.Node = null;

    @property({ tooltip: "当可见元素小于最大可见数量时候,是否居中显示" })
    public isCenter: boolean = false;

    public content: cc.Node = null;
    public adapter: AbsAdapter = null;
    public comp: any = null;
    public horizontal: boolean = false;

    private _filledIds: { [index: number]: cc.Node } = {};
    private _itemHeight: number = 1;
    private _itemWidth: number = 1;
    private _itemsVisible: number = 1;
    private dataChanged: boolean = false;
    private _isInited: boolean = false;
    private visibleRange: number[] = [-1, -1];
    private _pager: Pager = null;
    private _resLoader: any = null;
    private _items: cc.NodePool = null;

    public get pager(): Pager {
        if (!this._pager) {
            this._pager = new Pager(this);
        }
        return this._pager;
    }

    public get resLoader(): any {
        if (!this._resLoader) {
            this._resLoader = ResMgr.getInstance().getKeeper(this, true);
            this._resLoader.bindSelfAsset();
        }
        return this._resLoader;
    }

    public onLoad(): void {
        if (this.itemTemplate != null && this.itemTemplate.active) {
            this.itemTemplate.active = false;
        }
        this.resLoader;
        this.init();
        this.scrollView;
    }

    public async setAdapter(adapter: AbsAdapter): Promise<void> {
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

    public getAdapter(): AbsAdapter {
        return this.adapter;
    }

    public getScrollView(): cc.ScrollView {
        return this.scrollView;
    }

    public getAllItems(): cc.NodePool {
        return this._items;
    }

    public refreshAdapter(adapter: AbsAdapter): void {
        this.adapter = adapter;
        this.visibleRange[0] = this.visibleRange[1] = -1;
        this.recycleAll();
        this.notifyUpdate();
    }

    public scrollToPage(pageIndex: number, itemIndex?: number, timeInSecond?: number): boolean {
        if (!this.adapter || !this.scrollView) return false;
        this.adapter.getCount();

        if (this.horizontal) {
            const contentWidth = this.content.width;
            const columnWH = this.getColumnWH();
            let offset = 0;
            if (itemIndex) {
                offset = columnWH * itemIndex;
            } else {
                const parentWidth = Math.ceil(this.content.parent.width);
                offset = Math.floor(parentWidth / columnWH) * columnWH;
            }
            this.scrollView.stopAutoScroll();
            this.scrollView.scrollToOffset(cc.v2(offset * pageIndex, 0), timeInSecond);
            return offset * (pageIndex + 1) >= contentWidth;
        }

        const contentHeight = this.content.height;
        const columnWH = this.getColumnWH();
        let offset = 0;
        if (itemIndex) {
            offset = columnWH * itemIndex;
        } else {
            const parentHeight = this.content.parent.height;
            offset = Math.floor(parentHeight / columnWH) * columnWH;
        }
        this.scrollView.stopAutoScroll();
        this.scrollView.scrollToOffset(cc.v2(0, offset * pageIndex), timeInSecond);
        return offset * (pageIndex + 1) >= contentHeight;
    }

    public getVisibleElements(): number {
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

    public getColumnWH(): number {
        return this.horizontal ? this._itemWidth + this.spacing.x : this._itemHeight + this.spacing.y;
    }

    public notifyUpdate(): void {
        if (this.adapter == null) return;
        if (!this._isOnLoadCalled) {
            this.init();
        }
        if (!this.scrollView || !this.content) return;

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

    public getNodeByIndex(index: number): cc.Node {
        return this._filledIds[index];
    }

    public getIndexByNode(node: cc.Node): number {
        for (const key in this._filledIds) {
            if (this._filledIds.hasOwnProperty(key) && this._filledIds[key] === node) {
                return parseInt(key);
            }
        }
        return -1;
    }

    public lateUpdate(): void {
        const range = this.getVisibleRange();
        if (this.checkNeedUpdate(range)) {
            this.recycleDirty(range);
            this.updateView(range);
        }
    }

    private _layoutVertical(item: cc.Node, index: number): void {
        this.content.addChild(item);
        const columnIndex = index % (this.column || 1);
        const rowIndex = Math.floor(index / (this.column || 1));
        const x = this.column > 1
            ? this.margin.x + item.width * item.anchorX + (item.width + this.spacing.x) * columnIndex - this.content.width * this.content.anchorX
            : 0;
        const y = -this.margin.y - item.height * (item.anchorY + rowIndex) - this.spacing.y * rowIndex;
        item.setPosition(x, y);
    }

    private _layoutHorizontal(item: cc.Node, index: number): void {
        this.content.addChild(item);
        const columnIndex = index % (this.column || 1);
        let rowIndex = index / (this.column || 1);
        if (!this.isCenter) {
            rowIndex = Math.floor(rowIndex);
        }
        const x = item.width * (item.anchorX + rowIndex) + this.spacing.x * rowIndex + this.margin.x;
        const y = this.column > 1
            ? -1 * (this.margin.y + item.height * item.anchorY + (item.height + this.spacing.y) * columnIndex - this.content.height * this.content.anchorY)
            : this.margin.y;
        item.setPosition(x, y);
    }

    private recycleAll(): void {
        for (const key in this._filledIds) {
            if (this._filledIds.hasOwnProperty(key)) {
                this._items.put(this._filledIds[key]);
            }
        }
        this._filledIds = {};
    }

    private recycleDirty(range: number[]): void {
        if (!range || range.length < 2) return;

        for (let i = this.visibleRange[0]; i < range[0]; i++) {
            if (!(i < 0) && this._filledIds[i]) {
                this._items.put(this._filledIds[i]);
                this._filledIds[i] = null;
            }
        }
        for (let i = Object.keys(this._filledIds).length; i > range[1]; i--) {
            if (!(i < 0) && this._filledIds[i]) {
                this._items.put(this._filledIds[i]);
                this._filledIds[i] = null;
            }
        }
        this.visibleRange[0] = range[0];
        this.visibleRange[1] = range[1];
    }

    private checkNeedUpdate(range: number[]): boolean {
        return !!(range && this.visibleRange && (this.visibleRange[0] !== range[0] || this.visibleRange[1] !== range[1]));
    }

    private updateView(range: number[]): void {
        let centerOffset = 0;
        if (this.isCenter) {
            const visibleCount = range[1] - range[0] + 1;
            const maxVisible = this.column > 1 ? this.column : this.getVisibleElements();
            centerOffset = visibleCount < maxVisible ? (maxVisible - visibleCount) / 2 : 0;
        }

        for (let index = range[0]; index <= range[1]; index++) {
            if (!this.dataChanged && this._filledIds[index]) continue;

            const item: cc.Node = this._filledIds[index]
                || this._items.get()
                || this.resLoader.instantiate(this.itemTemplate ? this.itemTemplate : this.itemPrefabTemplate);

            item.active = true;
            ClickAudio.addClickAudio(item);

            if (this.comp && !(item.getComponent(cc.Component) instanceof this.comp)) {
                item.removeComponent(cc.Component);
                item.addComponent(this.comp);
            }

            item.removeFromParent(false);

            const layoutIndex = this.isCenter ? index - range[0] + centerOffset : index;
            if (this.horizontal) {
                this._layoutHorizontal(item, layoutIndex);
            } else {
                this._layoutVertical(item, layoutIndex);
            }
            this._filledIds[index] = this.adapter._getView(item, index);
        }
        this.dataChanged = false;
    }

    private getVisibleRange(): number[] {
        if (this.adapter == null) return null;

        const offset = this.scrollView.getScrollOffset();
        let index = 0;
        index = this.horizontal
            ? Math.floor(-offset.x / (this._itemWidth + this.spacing.x))
            : Math.floor(offset.y / (this._itemHeight + this.spacing.y));
        if (index < 0) index = 0;

        let endIndex = this.column * (index + this._itemsVisible + this.spawnCount);
        if (endIndex >= this.adapter.getCount()) {
            endIndex = this.adapter.getCount() - 1;
        }
        return [index * this.column, endIndex];
    }

    private init(): void {
        if (this._isInited) return;
        this._isInited = true;

        const widget = this.getComponent(cc.Widget);
        if (widget) widget.updateAlignment();

        if (this.scrollView) {
            this.content = this.scrollView.content;
            const contentWidget = this.content.parent.getComponent(cc.Widget);
            if (contentWidget) contentWidget.updateAlignment();

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
            this._items = new cc.NodePool(this.comp);
        }

        const item: cc.Node = this._items.get()
            || this.resLoader.instantiate(this.itemTemplate ? this.itemTemplate : this.itemPrefabTemplate);
        ClickAudio.addClickAudio(item);
        item.active = true;
        this._items.put(item);

        this._itemHeight = item.height || 10;
        this._itemWidth = item.width || 10;

        if (this.horizontal) {
            this._itemsVisible = Math.ceil((this.content.parent.width - this.margin.x - this.margin.width) / (this._itemWidth + this.spacing.x));
        } else {
            this._itemsVisible = Math.ceil((this.content.parent.height - this.margin.y - this.margin.height) / (this._itemHeight + this.spacing.y));
        }
    }

    public setItemRender(itemRender: (item: cc.Node, index: number, data: any) => void, target?: any): ListView {
        if (!itemRender) {
            console.error("ListView.setItemRender: itemRender is null or undefined.");
            return null;
        }
        if (!this.adapter) {
            this.adapter = new DefaultAdapter();
        }
        this.adapter.updateView = itemRender.bind(target);
        this.notifyUpdate();
        return this;
    }

    public get datas(): any[] {
        return this.adapter ? this.adapter.dataSet : null;
    }

    public set datas(value: any[]) {
        if (!this.adapter) {
            this.adapter = new DefaultAdapter();
        }
        this.adapter.setDataSet(value);
        this.notifyUpdate();
    }
}

export class Pager {
    public listView: ListView = null;
    public pageOfItems: number = 0;
    public currentPageIndex: number = 0;
    public onPageChangeListener: (listView: ListView, pageIndex: number) => void = null;
    public srcOnTouchEnded: Function = null;
    public srcOnTouchBegan: Function = null;
    public srcHandleReleaseLogic: Function = null;

    private _initAutoScrollToPage: boolean = false;
    private touchBeganPosition: cc.Vec2 = null;
    private touchEndPosition: cc.Vec2 = null;

    constructor(listView: ListView, pageOfItems: number = 0) {
        this.listView = listView;
        this.pageOfItems = pageOfItems;
    }

    public initAutoScrollToPage(): void {
        if (this._initAutoScrollToPage) return;

        const scrollView = this.listView.getScrollView() as any;
        this.srcOnTouchBegan = scrollView._onTouchBegan.bind(scrollView);
        scrollView._onTouchBegan = this.onTouchStartListener.bind(this);

        this.srcOnTouchEnded = scrollView._onTouchEnded.bind(scrollView);
        scrollView._onTouchEnded = this.onTouchEndListener.bind(this);

        this.srcHandleReleaseLogic = scrollView._handleReleaseLogic.bind(scrollView);
        scrollView._handleReleaseLogic = this.handleReleaseLogicListener.bind(this);

        this._initAutoScrollToPage = true;
    }

    public onTouchStartListener(event: cc.Event.EventTouch, captureListeners?: any): void {
        this.touchBeganPosition = event.touch.getLocation();
        this.srcOnTouchBegan(event, captureListeners);
    }

    public onTouchEndListener(event: cc.Event.EventTouch, captureListeners?: any): void {
        this.touchEndPosition = event.touch.getLocation();
        this.srcOnTouchEnded(event, captureListeners);
    }

    public handleReleaseLogicListener(): void {
        this.autoScrollToPage();

        const scrollView = this.listView.getScrollView() as any;
        if (scrollView._scrolling) {
            scrollView._scrolling = false;
            if (!scrollView._autoScrolling) {
                scrollView.node.emit("scroll-ended");
            }
        }
    }

    public autoScrollToPage(): void {
        if (!this.touchBeganPosition || !this.touchEndPosition) return;

        const delta = this.touchBeganPosition.sub(this.touchEndPosition);
        let pageIndex = this.getCurrentPage() + this.getDragDirection(delta);
        pageIndex = cc.misc.clampf(pageIndex, 0, this.getPageCount() - 1);
        this.currentPageIndex = pageIndex;
        this.listView.scrollToPage(pageIndex, 0, 0.5);
        if (this.onPageChangeListener) {
            this.onPageChangeListener(this.listView, this.currentPageIndex);
        }
    }

    public getDragDirection(delta: cc.Vec2): number {
        const scrollView = this.listView.getScrollView();
        if (scrollView.horizontal) {
            return delta.x === 0 ? 0 : delta.x > 0 ? 1 : -1;
        }
        if (scrollView.vertical) {
            return delta.y === 0 ? 0 : delta.y < 0 ? 1 : -1;
        }
        return undefined;
    }

    public getPageCount(): number {
        if (!this.listView.getAdapter()) return 1;

        const count = this.listView.getAdapter().getCount();
        if (!this.pageOfItems) {
            this.pageOfItems = this.listView.getVisibleElements();
        }
        if (this.pageOfItems <= 0) {
            this.pageOfItems = 1;
        }
        return Math.ceil(count / this.pageOfItems);
    }

    public getCurrentPage(): number {
        return this.currentPageIndex;
    }

    public prePage(): void {
        if (this.listView.getScrollView().isScrolling()) return;

        this.currentPageIndex--;
        if (this.currentPageIndex < 0) {
            this.currentPageIndex = 0;
        }
        this.listView.scrollToPage(this.currentPageIndex, 0, 0.5);
        if (this.onPageChangeListener) {
            this.onPageChangeListener(this.listView, this.currentPageIndex);
        }
    }

    public nextPage(): void {
        if (this.listView.getScrollView().isScrolling()) return;

        this.currentPageIndex++;
        const pageCount = this.getPageCount();
        if (this.currentPageIndex > pageCount - 1) {
            this.currentPageIndex = pageCount - 1;
        }
        this.listView.scrollToPage(this.currentPageIndex, 0, 0.5);
        if (this.onPageChangeListener) {
            this.onPageChangeListener(this.listView, this.currentPageIndex);
        }
    }

    public canPrePage(): boolean {
        return this.currentPageIndex > 0;
    }

    public canNextPage(): boolean {
        return this.currentPageIndex < this.getPageCount() - 1;
    }

    public setOnPageChangeListener(listener: (listView: ListView, pageIndex: number) => void): void {
        this.onPageChangeListener = listener;
    }

    public scrollToPageByIndex(pageIndex: number, timeInSecond: number = 0.5): void {
        const pageCount = this.getPageCount();
        this.currentPageIndex = cc.misc.clampf(pageIndex, 0, pageCount - 1);
        this.listView.scrollToPage(this.currentPageIndex, 0, timeInSecond);
    }
}

export class AbsAdapter {
    protected _dataSet: any[] = [];

    public get dataSet(): any[] {
        return this._dataSet;
    }

    public setDataSet(dataSet: any[]): void {
        this._dataSet = dataSet || [];
    }

    public getCount(): number {
        return this.dataSet ? this.dataSet.length : 0;
    }

    public getData(index: number): any {
        return this.dataSet[index];
    }

    public _getView(item: cc.Node, index: number): cc.Node {
        this.updateView(item, index, this.getData(index));
        item.zIndex = index;
        item.on(cc.Node.EventType.TOUCH_END, this.onClickBase, this);
        return item;
    }

    public onClickBase(event: cc.Event.EventTouch): void {
        const node = event.currentTarget as cc.Node;
        this.onClickItem(node, this.getData(node.zIndex), node.zIndex);
    }

    public onClickItem(item: cc.Node, data: any, index: number): void {}

    public updateView: (item: cc.Node, index: number, data: any) => void;
}

class DefaultAdapter extends AbsAdapter {
    public updateView(item: cc.Node, index: number, data: any): void {}
}