import NodePool from "./NodePool";
import EngineUtil from "./EngineUtil";

const { ccclass, property, menu } = cc._decorator;

interface ItemCacheEntry {
    x: number;
    y: number;
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
    visible: boolean;
}

interface ItemBufferEntry {
    item: cc.Node;
    index: number;
    bindIndex?: number;
}

interface ListItemScript extends cc.Component {
    initData?(data: unknown, index: number, extData: unknown): void;
    updateView?(): void;
}

interface ScrollInitOptions {
    extData?: unknown;
    onChanged?: (index: number, visible: boolean) => void;
}

interface ScrollToOptions {
    customTween?: boolean;
}

@ccclass
@menu("自定义组件/ScrollViewCtrl")
export default class ScrollViewCtrl extends cc.Component {
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    scrollView: cc.ScrollView = null;
    content: cc.Node = null;
    view: cc.Node = null;
    layout: cc.Layout = null;
    itemName: string = null;
    mat4: cc.Mat4 = null;
    isInit: boolean = null;
    data: unknown[] = null;
    callbackList: Array<(index: number, visible: boolean) => void> | null = null;
    extData: unknown = null;
    firstX: number = null;
    firstY: number = null;
    itemCache: ItemCacheEntry[] = null;
    itemBuffer: ItemBufferEntry[] = null;
    _tmpV2: cc.Vec2 = null;
    viewRect: cc.Rect = null;
    _resetItemFlag = 0;
    bindIndexList: Record<number, boolean> = null;

    onItemChanged(callback: (index: number, visible: boolean) => void): void {
        if ("function" == typeof callback) {
            this.callbackList.push(callback);
        }
    }

    afterItemSizeChange(): void {
        this._resetItemFlag = 0;
        this.updateBuffer();
        this.scheduleOnce(() => {
            this.updateListView();
        });
    }

    updateBuffer(): void {
        const lastItem = this.itemCache[this.itemCache.length - 1];
        if (this.scrollView.vertical) {
            this.itemCache[0].y = -this.itemCache[0].height / 2 - this.layout.paddingTop || 0;
            if (1 != this.itemCache[0].scaleY) {
                this.itemCache[0].y =
                    -Math.abs(this.itemCache[0].scaleY * this.itemCache[0]?.height) / 2 - this.layout.paddingTop || 0;
            }
            this.itemBuffer.find((entry) => {
                if (0 == entry.index) {
                    entry.item.y = this.itemCache[0].y;
                }
            });
            for (let index = 1; index < this.data.length; index++) {
                const prev = this.itemCache[index - 1];
                const current = this.itemCache[index];
                if (prev && current) {
                    let prevHeight = prev.height || 0;
                    let currentHeight = current.height || 0;
                    if (1 != prev.scaleY) {
                        prevHeight = Math.abs(prev.scaleY * prev.height || 0);
                    }
                    if (1 != current.scaleY) {
                        currentHeight = Math.abs(current.scaleY * current.height || 0);
                    }
                    current.y = prev.y - (prevHeight / 2 + currentHeight / 2 + this.layout.spacingY);
                    this.itemBuffer.find((entry) => {
                        if (entry.index == index) {
                            entry.item.y = current.y || 0;
                        }
                    });
                }
            }
            let halfHeight = (lastItem?.height || 0) / 2 || 0;
            if (1 != lastItem.scaleY) {
                halfHeight = Math.abs(lastItem.scaleY * lastItem?.height) / 2 || 0;
            }
            if (this.content) {
                this.content.height = Math.abs(lastItem.y - halfHeight - this.layout.paddingBottom);
            }
        }
    }

    removeItemByIndex(index: number): void {
        if (this.itemBuffer) {
            const bufferIndex = this.itemBuffer.findIndex((entry) => entry.index == index);
            if (bufferIndex >= 0) {
                const removed = this.itemBuffer.splice(bufferIndex, 1) as any;
                EngineUtil.destroyNode(removed.item);
            }
        }
    }

    registerScrollEvent(handler: { name: string }, target: cc.Component): void {
        if (handler.name) {
            const scrollView = this.node.getComponent(cc.ScrollView);
            const eventHandler = new cc.Component.EventHandler();
            eventHandler.target = target.node;
            eventHandler.component = cc.js.getClassName(target);
            eventHandler.handler = handler.name;
            const eventIndex = scrollView.scrollEvents.length;
            scrollView.scrollEvents[eventIndex] = eventHandler;
        }
    }

    getItem(): ItemBufferEntry {
        const node = NodePool.Instance.getNode(this.itemName);
        node.x = this.firstX;
        node.y = this.firstY;
        const entry: ItemBufferEntry = {
            item: node,
            index: -1,
        };
        this.itemBuffer.push(entry);
        node.on(cc.Node.EventType.SIZE_CHANGED, this.onItemSizeChanged.bind(this, node), this);
        node.on(cc.Node.EventType.SCALE_CHANGED, this.onItemSizeChanged.bind(this, node), this);
        return entry;
    }

    recycle(): void {
        if (this.itemBuffer) {
            this.itemBuffer.forEach((entry) => {
                if (entry && cc.isValid(entry.item)) {
                    entry.item.off(cc.Node.EventType.SIZE_CHANGED, this.onItemSizeChanged.bind(this, entry.item), this);
                    entry.item.off(cc.Node.EventType.SCALE_CHANGED, this.onItemSizeChanged.bind(this, entry.item), this);
                    NodePool.Instance.putNode(this.itemName, entry.item);
                }
            });
        }
        this.itemCache = null;
        this.itemBuffer = null;
    }

    updateItemView(node: cc.Node, index: number): void {
        const script = EngineUtil.getScript(node) as ListItemScript;
        if (script && script.initData) {
            script.initData(this.data[index], index, this.extData);
            script.updateView && script.updateView();
        }
    }

    onDestroy(): void {
        if (this.content) {
            this.content.off(cc.Node.EventType.POSITION_CHANGED, this.scrollEvent, this);
        }
        this.recycle();
    }

    update(): void {
        if (this._resetItemFlag > 0) {
            this.afterItemSizeChange();
        }
    }

    scrollEvent(): void {
        if (this.content && this.isInit) {
            this.updateListView();
        }
    }

    getItemByIndex(index: number): cc.Node {
        if (this.itemBuffer) {
            return (this.itemBuffer.find((entry) => entry.index == index) || {}).item;
        }
    }

    initOnce(): void {
        this.bindIndexList = {};
        this.scrollView = this.node.getComponent(cc.ScrollView);
        this.content = this.scrollView.content;
        this.view = this.content.parent;
        this.layout = this.content.getComponent(cc.Layout);
        this.itemName = this.itemPrefab.name;
        this.mat4 = cc.mat4();
        this.initOnce = () => {};
    }

    scrollToBottom(): void {
        this.scrollView.scrollToBottom();
    }

    start(): void {
        this.initOnce();
    }

    updateListView(): void {
        if (this.itemCache) {
            const bindVisibleItem = (entry: ItemBufferEntry, index: number) => {
                entry.index = index;
                entry.item.x = this.itemCache[index].x;
                entry.item.y = this.itemCache[index].y;
                entry.item.scaleX = this.itemCache[index].scaleX;
                entry.item.scaleY = this.itemCache[index].scaleY;
                entry.item.opacity = 255;
                if (this.scrollView.horizontal) {
                    entry.item.width = this.itemCache[index].width;
                }
                if (this.scrollView.vertical) {
                    entry.item.height = this.itemCache[index].height;
                }
                entry.item.parent = this.content;
                this.updateItemView(entry.item, index);
            };

            for (let index = 0; index < this.itemCache.length; index++) {
                const cacheEntry = this.itemCache[index];
                const inView = this.isItemInView(index);
                let bufferEntry = this.itemBuffer.find((entry) => entry.index == index);
                if (inView) {
                    if (this.bindIndexList[index]) {
                        bufferEntry = this.itemBuffer.find((entry) => entry.bindIndex == index);
                    }
                    if (!bufferEntry) {
                        bufferEntry =
                            this.itemBuffer.find((entry) => -1 == entry.index && null == entry.bindIndex) ||
                            this.getItem();
                    }
                    if (bufferEntry.index != index) {
                        bindVisibleItem(bufferEntry, index);
                    }
                } else if (bufferEntry) {
                    bufferEntry.index = -1;
                    bufferEntry.item.x = -9999999;
                    bufferEntry.item.y = -9999999;
                    bufferEntry.item.opacity = 0;
                }
                if (cacheEntry.visible != inView) {
                    this.runItemChangedCallback(index, inView);
                }
                cacheEntry.visible = inView;
            }

            this.itemBuffer.sort((a, b) => (a.index < 0 || b.index < 0 ? 1 : a.index - b.index));
            for (let index = 0; index < this.itemBuffer.length; index++) {
                this.itemBuffer[index].item.setSiblingIndex(index);
            }
        }
    }

    onItemSizeChanged(node: cc.Node): void {
        if (this.itemCache) {
            const bufferEntry = this.itemBuffer.find((entry) => entry.item == node);
            if (bufferEntry && bufferEntry.index >= 0) {
                const cacheEntry = this.itemCache[bufferEntry.index];
                if (this.scrollView.horizontal && cacheEntry.width == node.width && cacheEntry.scaleX == node.scaleX) {
                    return;
                }
                if (this.scrollView.vertical && cacheEntry.height == node.height && cacheEntry.scaleY == node.scaleY) {
                    return;
                }
                cacheEntry.width = node.width;
                cacheEntry.scaleX = node.scaleX;
                cacheEntry.height = node.height;
                cacheEntry.scaleY = node.scaleY;
                this._resetItemFlag = 1;
            }
        }
    }

    isItemInView(index: number): boolean {
        this._tmpV2 = this._tmpV2 || cc.v2(0, 0);
        this.view.getWorldMatrix(this.mat4);
        const scale = this.mat4.m[0];
        const offsetX = this.mat4.m[12];
        const offsetY = this.mat4.m[13];
        const viewWidth = this.view.width * scale;
        const viewHeight = this.view.height * scale;
        const worldOrigin = this.view.convertToWorldSpaceAR(cc.Vec2.ZERO, this._tmpV2);
        if (
            !this.viewRect ||
            1 != scale ||
            this.viewRect.x + viewWidth / 2 != offsetX ||
            this.viewRect.y + viewHeight / 2 != offsetY
        ) {
            this.viewRect = new cc.Rect(worldOrigin.x - viewWidth / 2, worldOrigin.y - viewHeight / 2, viewWidth, viewHeight);
        }
        const cacheEntry = this.itemCache[index];
        const itemWorldPos = this.content.convertToWorldSpaceAR(cc.v2(cacheEntry.x, cacheEntry.y));
        const itemWidth = cacheEntry.width * cacheEntry.scaleX;
        const itemHeight = cacheEntry.height * cacheEntry.scaleY;
        const itemRect = new cc.Rect(itemWorldPos.x - itemWidth / 2, itemWorldPos.y - itemHeight / 2, itemWidth, itemHeight);
        return this.viewRect.intersects(itemRect);
    }

    init(data: unknown[], options?: ScrollInitOptions): void {
        this.initOnce();
        if (Array.isArray(data)) {
            if (data.length) {
                options = options || {};
                this.isInit = true;
                this.data = data;
                this.callbackList = [];
                this.extData = options.extData;
                if (options.onChanged) {
                    this.onItemChanged(options.onChanged);
                }
                this.layout.enabled = false;
                this.scrollView.stopAutoScroll();
                if (!NodePool.Instance.hasPool(this.itemName)) {
                    NodePool.Instance.initPool(this.itemPrefab);
                }
                const prefabNode = this.itemPrefab.data;
                const paddingLeft = this.layout.paddingLeft;
                const paddingRight = this.layout.paddingRight;
                const paddingTop = this.layout.paddingTop;
                const paddingBottom = this.layout.paddingBottom;
                const spacingX = this.layout.spacingX;
                const spacingY = this.layout.spacingY;
                let startX = prefabNode.x;
                let startY = prefabNode.y;
                if (this.scrollView.horizontal) {
                    startX = -prefabNode.width / 2;
                    startX -= paddingLeft;
                }
                if (this.scrollView.vertical) {
                    startY = -prefabNode.height / 2;
                    startY -= paddingTop;
                }
                this.firstX = startX;
                this.firstY = startY;
                this.itemCache = [];
                this.itemBuffer = this.itemBuffer || [];
                let reusedCount = 0;
                this.itemBuffer.forEach((entry) => {
                    entry.index = -1;
                    if (reusedCount >= data.length) {
                        entry.item.x = -9999999;
                        entry.item.y = -9999999;
                        entry.item.opacity = 0;
                    }
                    reusedCount++;
                });
                const initCacheEntry = (index: number) => {
                    this.itemCache[index] = this.itemCache[index] || ({} as ItemCacheEntry);
                    this.itemCache[index].x = startX;
                    this.itemCache[index].y = startY;
                    this.itemCache[index].width = prefabNode.width;
                    this.itemCache[index].height = prefabNode.height;
                    this.itemCache[index].scaleX = prefabNode.scaleX;
                    this.itemCache[index].scaleY = prefabNode.scaleY;
                    this.itemCache[index].visible = false;
                };
                initCacheEntry(0);
                for (let index = 1; index < this.data.length; index++) {
                    initCacheEntry(index);
                    if (this.scrollView.horizontal) {
                        this.itemCache[index].x =
                            this.itemCache[index - 1].x -
                            (this.itemCache[index - 1].width / 2 + this.itemCache[index].width / 2 + spacingX);
                    }
                    if (this.scrollView.vertical) {
                        this.itemCache[index].y =
                            this.itemCache[index - 1].y -
                            (this.itemCache[index - 1].height / 2 + this.itemCache[index].height / 2 + spacingY);
                    }
                }
                const lastCacheEntry = this.itemCache[this.itemCache.length - 1];
                if (this.scrollView.horizontal) {
                    this.content.width = Math.abs(lastCacheEntry.x + lastCacheEntry.width / 2 + paddingRight);
                }
                if (this.scrollView.vertical) {
                    this.content.height = Math.abs(lastCacheEntry.y - lastCacheEntry.height / 2 - paddingBottom);
                }
                this.content.on(cc.Node.EventType.POSITION_CHANGED, this.scrollEvent, this);
                this.scheduleOnce(() => {
                    this.updateListView();
                });
            } else {
                this.recycle();
                this.content.off(cc.Node.EventType.POSITION_CHANGED, this.scrollEvent, this);
            }
        } else {
            console.error("传进来的数据不为数组！");
        }
    }

    scrollToItem(index: number, duration?: number, options?: ScrollToOptions): void {
        if (this.itemCache && this.itemCache.length) {
            if (index < 0) {
                index = 0;
            }
            if (index >= this.itemCache.length) {
                index = this.itemCache.length - 1;
            }
            const cacheEntry = this.itemCache[index];
            if (cacheEntry) {
                options = options || {};
                duration = duration || 0;
                if (this.scrollView) {
                    if (!options.customTween) {
                        const offsetY = -(cacheEntry.y + Math.abs(cacheEntry.height * cacheEntry.scaleY) / 2);
                        this.scrollView.scrollToOffset(cc.v2(0, offsetY), duration);
                    }
                }
            }
        }
    }

    bindItemWithIndex(item: cc.Node, index: number, keepBind = true): void {
        if (this.itemBuffer) {
            keepBind = keepBind || true;
            const bufferEntry = this.itemBuffer.find((entry) => entry.item == item);
            if (bufferEntry) {
                bufferEntry.bindIndex = index;
                if (keepBind) {
                    this.bindIndexList[index] = keepBind;
                } else {
                    delete this.bindIndexList[index];
                    delete bufferEntry.bindIndex;
                }
            }
        }
    }

    setItemProperty(index: number, key: keyof ItemCacheEntry, value: number): void {
        if (this.itemCache && this.itemBuffer) {
            const bufferEntry = this.itemBuffer.find((entry) => entry.index == index);
            if (bufferEntry) {
                (bufferEntry.item as any)[key] = value;
            } else {
                (this.itemCache[index] as any)[key] = value;
            }
            this.updateBuffer();
            this.scheduleOnce(() => {
                this.updateListView();
            });
        }
    }

    scrollToTop(): void {
        this.scrollToItem(0, 0);
        this.scrollView.scrollToOffset(cc.v2(0, 0), 0);
    }

    runItemChangedCallback(index: number, visible: boolean): void {
        try {
            for (let i = 0; i < this.callbackList.length; i++) {
                this.callbackList[i](index, visible);
            }
        } catch (error) {
            console.error(error);
        }
    }
}
