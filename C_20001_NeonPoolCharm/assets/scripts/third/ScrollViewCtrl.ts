import EngineUtil from "./EngineUtil";
import NodePool from "./NodePool";

const { ccclass, property, menu } = cc._decorator;

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
    data: any[] = null;
    callbackList: Function[] = null;
    extData: any = null;
    firstX: number = null;
    firstY: number = null;
    itemCache: any[] = null;
    itemBuffer: { item: cc.Node; index: number; bindIndex?: number }[] = null;
    _tmpV2: cc.Vec2 = null;
    viewRect: cc.Rect = null;
    _resetItemFlag = 0;
    bindIndexList: Record<number, boolean> = null;

    onItemChanged(callback: Function): void {
        if (typeof callback == "function") {
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
            this.itemBuffer.find((bufferItem) => {
                if (bufferItem.index == 0) {
                    bufferItem.item.y = this.itemCache[0].y;
                }
            });
            for (let index = 1; index < this.data.length; index++) {
                const prevItem = this.itemCache[index - 1];
                const currentItem = this.itemCache[index];
                if (prevItem && currentItem) {
                    let prevHeight = prevItem.height || 0;
                    let currentHeight = currentItem.height || 0;
                    if (1 != prevItem.scaleY) {
                        prevHeight = Math.abs(prevItem.scaleY * prevItem.height || 0);
                    }
                    if (1 != currentItem.scaleY) {
                        currentHeight = Math.abs(currentItem.scaleY * currentItem.height || 0);
                    }
                    currentItem.y = prevItem.y - (prevHeight / 2 + currentHeight / 2 + this.layout.spacingY);
                    this.itemBuffer.find((bufferItem) => {
                        if (bufferItem.index == index) {
                            bufferItem.item.y = currentItem.y || 0;
                        }
                    });
                }
            }
            let halfHeight = (lastItem?.height) / 2 || 0;
            if (1 != lastItem.scaleY) {
                halfHeight = Math.abs(lastItem.scaleY * lastItem?.height) / 2 || 0;
            }
            this.content && (this.content.height = Math.abs(lastItem.y - halfHeight - this.layout.paddingBottom));
        }
    }

    removeItemByIndex(index: number): void {
        if (this.itemBuffer) {
            const bufferIndex = this.itemBuffer.findIndex((bufferItem) => bufferItem.index == index);
            if (bufferIndex >= 0) {
                const removedItems = this.itemBuffer.splice(bufferIndex, 1);
                EngineUtil.destroyNode(removedItems[0].item);
            }
        }
    }

    registerScrollEvent(handlerName: Function, target: cc.Component): void {
        if (handlerName.name) {
            const scrollView = this.node.getComponent(cc.ScrollView);
            const eventHandler = new cc.Component.EventHandler();
            eventHandler.target = target.node;
            eventHandler.component = cc.js.getClassName(target);
            eventHandler.handler = handlerName.name;
            const eventIndex = scrollView.scrollEvents.length;
            scrollView.scrollEvents[eventIndex] = eventHandler;
        }
    }

    getItem(): { item: cc.Node; index: number; bindIndex?: number } {
        const itemNode = NodePool.Instance.getNode(this.itemName);
        itemNode.x = this.firstX;
        itemNode.y = this.firstY;
        const bufferItem = {
            item: itemNode,
            index: -1,
        };
        this.itemBuffer.push(bufferItem);
        itemNode.on(cc.Node.EventType.SIZE_CHANGED, this.onItemSizeChanged.bind(this, itemNode), this);
        itemNode.on(cc.Node.EventType.SCALE_CHANGED, this.onItemSizeChanged.bind(this, itemNode), this);
        return bufferItem;
    }

    recycle(): void {
        this.itemBuffer &&
            this.itemBuffer.forEach((bufferItem) => {
                if (bufferItem && cc.isValid(bufferItem.item)) {
                    bufferItem.item.off(cc.Node.EventType.SIZE_CHANGED, this.onItemSizeChanged.bind(this, bufferItem.item), this);
                    bufferItem.item.off(cc.Node.EventType.SCALE_CHANGED, this.onItemSizeChanged.bind(this, bufferItem.item), this);
                    NodePool.Instance.putNode(this.itemName, bufferItem.item);
                }
            });
        this.itemCache = null;
        this.itemBuffer = null;
    }

    updateItemView(itemNode: cc.Node, dataIndex: number): void {
        const script = EngineUtil.getScript(itemNode);
        if (script && script.initData) {
            script.initData(this.data[dataIndex], dataIndex, this.extData);
            script.updateView && script.updateView();
        }
    }

    onDestroy(): void {
        this.content && this.content.off(cc.Node.EventType.POSITION_CHANGED, this.scrollEvent, this);
        this.recycle();
    }

    update(): void {
        this._resetItemFlag > 0 && this.afterItemSizeChange();
    }

    scrollEvent(): void {
        this.content && this.isInit && this.updateListView();
    }

    getItemByIndex(index: number): cc.Node {
        if (this.itemBuffer) {
            return (
                this.itemBuffer.find((bufferItem) => bufferItem.index == index) || ({} as any)
            ).item;
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
        this.initOnce = function () {};
    }

    scrollToBottom(): void {
        this.scrollView.scrollToBottom();
    }

    start(): void {
        this.initOnce();
    }

    updateListView(): void {
        if (this.itemCache) {
            const applyItemLayout = (bufferItem: { item: cc.Node; index: number }, cacheIndex: number) => {
                bufferItem.index = cacheIndex;
                bufferItem.item.x = this.itemCache[cacheIndex].x;
                bufferItem.item.y = this.itemCache[cacheIndex].y;
                bufferItem.item.scaleX = this.itemCache[cacheIndex].scaleX;
                bufferItem.item.scaleY = this.itemCache[cacheIndex].scaleY;
                bufferItem.item.opacity = 255;
                this.scrollView.horizontal && (bufferItem.item.width = this.itemCache[cacheIndex].width);
                this.scrollView.vertical && (bufferItem.item.height = this.itemCache[cacheIndex].height);
                bufferItem.item.parent = this.content;
                this.updateItemView(bufferItem.item, cacheIndex);
            };
            for (let cacheIndex = 0; cacheIndex < this.itemCache.length; cacheIndex++) {
                const cacheItem = this.itemCache[cacheIndex];
                const inView = this.isItemInView(cacheIndex);
                let bufferItem = this.itemBuffer.find((item) => item.index == cacheIndex);
                if (inView) {
                    this.bindIndexList[cacheIndex] &&
                        (bufferItem = this.itemBuffer.find((item) => item.bindIndex == cacheIndex));
                    bufferItem ||
                        (bufferItem =
                            this.itemBuffer.find((item) => item.index == -1 && item.bindIndex == null) || this.getItem());
                    bufferItem.index != cacheIndex && applyItemLayout(bufferItem, cacheIndex);
                } else if (bufferItem) {
                    bufferItem.index = -1;
                    bufferItem.item.x = -9999999;
                    bufferItem.item.y = -9999999;
                    bufferItem.item.opacity = 0;
                }
                cacheItem.visible != inView && this.runItemChangedCallback(cacheIndex, inView);
                cacheItem.visible = inView;
            }
            this.itemBuffer.sort((left, right) => {
                return left.index < 0 || right.index < 0 ? 1 : left.index - right.index;
            });
            for (let bufferIndex = 0; bufferIndex < this.itemBuffer.length; bufferIndex++) {
                this.itemBuffer[bufferIndex].item.setSiblingIndex(bufferIndex);
            }
        }
    }

    onItemSizeChanged(itemNode: cc.Node): void {
        if (this.itemCache) {
            const bufferItem = this.itemBuffer.find((item) => item.item == itemNode);
            if (bufferItem && bufferItem.index >= 0) {
                const cacheItem = this.itemCache[bufferItem.index];
                if (this.scrollView.horizontal && cacheItem.width == itemNode.width && cacheItem.scaleX == itemNode.scaleX) {
                    return;
                }
                if (this.scrollView.vertical && cacheItem.height == itemNode.height && cacheItem.scaleY == itemNode.scaleY) {
                    return;
                }
                cacheItem.width = itemNode.width;
                cacheItem.scaleX = itemNode.scaleX;
                cacheItem.height = itemNode.height;
                cacheItem.scaleY = itemNode.scaleY;
                this._resetItemFlag = 1;
            }
        }
    }

    isItemInView(index: number): boolean {
        this._tmpV2 = this._tmpV2 || cc.v2(0, 0);
        this.view.getWorldMatrix(this.mat4);
        const scaleX = this.mat4.m[0];
        const translateX = this.mat4.m[12];
        const translateY = this.mat4.m[13];
        const viewWidth = this.view.width * scaleX;
        const viewHeight = this.view.height * scaleX;
        const worldPos = this.view.convertToWorldSpaceAR(cc.Vec2.ZERO, this._tmpV2);
        (!(this.viewRect && scaleX == 1 && this.viewRect.x + viewWidth / 2 == translateX && this.viewRect.y + viewHeight / 2 == translateY) &&
            (this.viewRect = new cc.Rect(worldPos.x - viewWidth / 2, worldPos.y - viewHeight / 2, viewWidth, viewHeight)));
        const cacheItem = this.itemCache[index];
        const itemWorldPos = this.content.convertToWorldSpaceAR(cc.v2(cacheItem.x, cacheItem.y));
        const itemWidth = cacheItem.width * cacheItem.scaleX;
        const itemHeight = cacheItem.height * cacheItem.scaleY;
        const itemRect = new cc.Rect(itemWorldPos.x - itemWidth / 2, itemWorldPos.y - itemHeight / 2, itemWidth, itemHeight);
        return this.viewRect.intersects(itemRect);
    }

    init(data: any[], options?: any): void {
        this.initOnce();
        if (Array.isArray(data)) {
            if (data.length) {
                options = options || {};
                this.isInit = true;
                this.data = data;
                this.callbackList = [];
                this.extData = options.extData;
                options.onChanged && this.onItemChanged(options.onChanged);
                this.layout.enabled = false;
                this.scrollView.stopAutoScroll();
                NodePool.Instance.hasPool(this.itemName) || NodePool.Instance.initPool(this.itemPrefab);
                const prefabNode = this.itemPrefab.data;
                const paddingLeft = this.layout.paddingLeft;
                const paddingRight = this.layout.paddingRight;
                const paddingTop = this.layout.paddingTop;
                const paddingBottom = this.layout.paddingBottom;
                const spacingX = this.layout.spacingX;
                const spacingY = this.layout.spacingY;
                let firstX = prefabNode.x;
                let firstY = prefabNode.y;
                if (this.scrollView.horizontal) {
                    firstX = -prefabNode.width / 2;
                    firstX -= paddingLeft;
                }
                if (this.scrollView.vertical) {
                    firstY = -prefabNode.height / 2;
                    firstY -= paddingTop;
                }
                this.firstX = firstX;
                this.firstY = firstY;
                this.itemCache = [];
                this.itemBuffer = this.itemBuffer || [];
                let bufferCount = 0;
                this.itemBuffer.forEach((bufferItem) => {
                    bufferItem.index = -1;
                    if (bufferCount >= data.length) {
                        bufferItem.item.x = -9999999;
                        bufferItem.item.y = -9999999;
                        bufferItem.item.opacity = 0;
                    }
                    bufferCount++;
                });
                const initCacheItem = (cacheIndex: number) => {
                    this.itemCache[cacheIndex] = this.itemCache[cacheIndex] || {};
                    this.itemCache[cacheIndex].x = firstX;
                    this.itemCache[cacheIndex].y = firstY;
                    this.itemCache[cacheIndex].width = prefabNode.width;
                    this.itemCache[cacheIndex].height = prefabNode.height;
                    this.itemCache[cacheIndex].scaleX = prefabNode.scaleX;
                    this.itemCache[cacheIndex].scaleY = prefabNode.scaleY;
                    this.itemCache[cacheIndex].visible = false;
                };
                initCacheItem(0);
                for (let cacheIndex = 1; cacheIndex < this.data.length; cacheIndex++) {
                    initCacheItem(cacheIndex);
                    this.scrollView.horizontal &&
                        (this.itemCache[cacheIndex].x =
                            this.itemCache[cacheIndex - 1].x -
                            (this.itemCache[cacheIndex - 1].width / 2 + this.itemCache[cacheIndex].width / 2 + spacingX));
                    this.scrollView.vertical &&
                        (this.itemCache[cacheIndex].y =
                            this.itemCache[cacheIndex - 1].y -
                            (this.itemCache[cacheIndex - 1].height / 2 + this.itemCache[cacheIndex].height / 2 + spacingY));
                }
                const lastCacheItem = this.itemCache[this.itemCache.length - 1];
                this.scrollView.horizontal && (this.content.width = Math.abs(lastCacheItem.x + lastCacheItem.width / 2 + paddingRight));
                this.scrollView.vertical &&
                    (this.content.height = Math.abs(lastCacheItem.y - lastCacheItem.height / 2 - paddingBottom));
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

    scrollToItem(index: number, duration?: number, options?: any): void {
        if (this.itemCache && this.itemCache.length) {
            index < 0 && (index = 0);
            index >= this.itemCache.length && (index = this.itemCache.length - 1);
            const cacheItem = this.itemCache[index];
            if (cacheItem) {
                options = options || {};
                duration = duration || 0;
                if (this.scrollView) {
                    if (options.customTween) {
                    } else {
                        const offsetY = -(cacheItem.y + Math.abs(cacheItem.height * cacheItem.scaleY) / 2);
                        this.scrollView.scrollToOffset(cc.v2(0, offsetY), duration);
                    }
                }
            }
        }
    }

    bindItemWithIndex(itemNode: cc.Node, index: number, keepBind = true): void {
        if (this.itemBuffer) {
            keepBind = keepBind || true;
            const bufferItem = this.itemBuffer.find((item) => item.item == itemNode);
            if (bufferItem) {
                bufferItem.bindIndex = index;
                if (keepBind) {
                    this.bindIndexList[index] = keepBind;
                } else {
                    delete this.bindIndexList[index];
                    delete bufferItem.bindIndex;
                }
            }
        }
    }

    setItemProperty(index: number, propertyName: string, value: any): void {
        if (this.itemCache && this.itemBuffer) {
            const bufferItem = this.itemBuffer.find((item) => item.index == index);
            bufferItem ? (bufferItem.item[propertyName] = value) : (this.itemCache[index][propertyName] = value);
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
            for (let callbackIndex = 0; callbackIndex < this.callbackList.length; callbackIndex++) {
                this.callbackList[callbackIndex](index, visible);
            }
        } catch (error) {
            console.error(error);
        }
    }
}
