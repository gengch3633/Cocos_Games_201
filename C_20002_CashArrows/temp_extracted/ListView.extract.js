ListView: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "785da9hiQdJhLH4h0Kv38kP", "ListView");
var n = __extends, a = __decorate, o = __awaiter, r = __generator;
Object.defineProperty(i, "__esModule", {
value: !0
});
i.AbsAdapter = i.Pager = void 0;
var s = e("ResMgr"), l = e("ClickAudio"), c = cc.Component, u = cc._decorator, d = u.ccclass, h = u.property, p = u.menu, _ = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.itemTemplate = null;
t.itemPrefabTemplate = null;
t.spacing = cc.v2(0, 0);
t.margin = cc.rect(0, 0, 0, 0);
t.spawnCount = 2;
t.column = 1;
t.scrollView = null;
t.emptyView = null;
t.isCenter = !1;
t.content = null;
t.adapter = null;
t._filledIds = {};
t.horizontal = !1;
t._itemHeight = 1;
t._itemWidth = 1;
t._itemsVisible = 1;
t.dataChanged = !1;
t._isInited = !1;
t.visibleRange = [ -1, -1 ];
t._pager = null;
t.comp = null;
t._resLoader = null;
return t;
}
n(t, e);
Object.defineProperty(t.prototype, "pager", {
get: function() {
this._pager || (this._pager = new f(this));
return this._pager;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "resLoader", {
get: function() {
if (!this._resLoader) {
this._resLoader = s.default.getInstance().getKeeper(this, !0);
this._resLoader.bindSelfAsset();
}
return this._resLoader;
},
enumerable: !1,
configurable: !0
});
t.prototype.onLoad = function() {
null != this.itemTemplate && this.itemTemplate.active && (this.itemTemplate.active = !1);
this.resLoader;
this.init();
this.scrollView;
};
t.prototype.setAdapter = function(e) {
return o(this, void 0, void 0, function() {
return r(this, function() {
return this.adapter === e ? (this.notifyUpdate(), [ 2 ]) : (this.adapter = e, null == this.adapter ? (console.warn("adapter 为空."), 
[ 2 ]) : null == this.itemTemplate && null == this.itemPrefabTemplate ? (console.error("Listview 未设置待显示的Item模板."), 
[ 2 ]) : (this.visibleRange[0] = this.visibleRange[1] = -1, this.recycleAll(), this.notifyUpdate(), 
[ 2 ]));
});
});
};
t.prototype.getAdapter = function() {
return this.adapter;
};
t.prototype.getScrollView = function() {
return this.scrollView;
};
t.prototype.getAllItems = function() {
return this._items;
};
t.prototype.refreshAdapter = function(e) {
this.adapter = e;
this.visibleRange[0] = this.visibleRange[1] = -1;
this.recycleAll();
this.notifyUpdate();
};
t.prototype.scrollToPage = function(e, t, i) {
if (!this.adapter || !this.scrollView) return !1;
this.adapter.getCount();
if (this.horizontal) {
var n = 0, a = this.content.width, o = this.getColumnWH();
if (t) n = o * t; else {
var r = Math.ceil(this.content.parent.width);
n = Math.floor(r / o) * o;
}
this.scrollView.stopAutoScroll();
this.scrollView.scrollToOffset(cc.v2(n * e, 0), i);
return n * (e + 1) >= a;
}
var s = this.content.height, l = this.getColumnWH(), c = 0;
if (t) c = l * t; else {
var u = this.content.parent.height;
c = Math.floor(u / l) * l;
}
this.scrollView.stopAutoScroll();
this.scrollView.scrollToOffset(cc.v2(0, c * e), i);
return c * (e + 1) >= s;
};
t.prototype.getVisibleElements = function() {
var e = 0;
if (this.horizontal) {
var t = this.content.parent.width;
e = Math.floor(t / this.getColumnWH());
} else {
var i = this.content.parent.height;
e = Math.floor(i / this.getColumnWH());
}
return e * this.column;
};
t.prototype.getColumnWH = function() {
return this.horizontal ? this._itemWidth + this.spacing.x : this._itemHeight + this.spacing.y;
};
t.prototype.notifyUpdate = function() {
if (null != this.adapter) {
this._isOnLoadCalled || this.init();
this.scrollView && this.content && (this.emptyView && (this.emptyView.opacity = this.adapter.getCount() > 0 ? 0 : 255), 
this.visibleRange[0] = this.visibleRange[1] = -1, this.horizontal ? this.content.width = Math.ceil(this.adapter.getCount() / this.column) * (this._itemWidth + this.spacing.x) - this.spacing.x + this.margin.x + this.margin.width : this.content.height = Math.ceil(this.adapter.getCount() / this.column) * (this._itemHeight + this.spacing.y) - this.spacing.y + this.margin.y + this.margin.height, 
this.dataChanged = !0);
}
};
t.prototype.getNodeByIndex = function(e) {
return this._filledIds[e];
};
t.prototype.getIndexByNode = function(e) {
for (var t in this._filledIds) if (this._filledIds.hasOwnProperty(t) && this._filledIds[t] === e) return parseInt(t);
return -1;
};
t.prototype.lateUpdate = function() {
var e = this.getVisibleRange();
if (this.checkNeedUpdate(e)) {
this.recycleDirty(e);
this.updateView(e);
}
};
t.prototype._layoutVertical = function(e, t) {
this.content.addChild(e);
var i = t % (this.column || 1), n = Math.floor(t / (this.column || 1)), a = this.column > 1 ? this.margin.x + e.width * e.anchorX + (e.width + this.spacing.x) * i - this.content.width * this.content.anchorX : 0, o = -this.margin.y - e.height * (e.anchorY + n) - this.spacing.y * n;
e.setPosition(a, o);
};
t.prototype._layoutHorizontal = function(e, t) {
this.content.addChild(e);
var i = t % (this.column || 1), n = t / (this.column || 1);
this.isCenter || (n = Math.floor(n));
var a = e.width * (e.anchorX + n) + this.spacing.x * n + this.margin.x, o = this.column > 1 ? -1 * (this.margin.y + e.height * e.anchorY + (e.height + this.spacing.y) * i - this.content.height * this.content.anchorY) : this.margin.y;
e.setPosition(a, o);
};
t.prototype.recycleAll = function() {
for (var e in this._filledIds) this._filledIds.hasOwnProperty(e) && this._items.put(this._filledIds[e]);
this._filledIds = {};
};
t.prototype.recycleDirty = function(e) {
if (e && !(e.length < 2)) {
for (var t = this.visibleRange[0]; t < e[0]; t++) if (!(t < 0) && this._filledIds[t]) {
this._items.put(this._filledIds[t]);
this._filledIds[t] = null;
}
for (var i = Object.values(this._filledIds).length; i > e[1]; i--) if (!(i < 0) && this._filledIds[i]) {
this._items.put(this._filledIds[i]);
this._filledIds[i] = null;
}
this.visibleRange[0] = e[0];
this.visibleRange[1] = e[1];
}
};
t.prototype.checkNeedUpdate = function(e) {
return e && this.visibleRange && (this.visibleRange[0] != e[0] || this.visibleRange[1] != e[1]);
};
t.prototype.updateView = function(e) {
var t = 0;
if (this.isCenter) {
var i = e[1] - e[0] + 1, n = this.column > 1 ? this.column : this.getVisibleElements();
t = i < n ? (n - i) / 2 : 0;
}
for (var a = e[0]; a <= e[1]; a++) if (this.dataChanged || !this._filledIds[a]) {
var o = this._filledIds[a] || this._items.get() || this.resLoader.instantiate(this.itemTemplate ? this.itemTemplate : this.itemPrefabTemplate);
o.active = !0;
l.default.addClickAudio(o);
if (this.comp && !(o.getComponent(c) instanceof this.comp)) {
o.removeComponent(c);
o.addComponent(this.comp);
}
o.removeFromParent(!1);
var r = this.isCenter ? a - e[0] + t : a;
this.horizontal ? this._layoutHorizontal(o, r) : this._layoutVertical(o, r);
this._filledIds[a] = this.adapter._getView(o, a);
}
this.dataChanged = !1;
};
t.prototype.getVisibleRange = function() {
if (null == this.adapter) return null;
var e = this.scrollView.getScrollOffset(), t = 0;
(t = this.horizontal ? Math.floor(-e.x / (this._itemWidth + this.spacing.x)) : Math.floor(e.y / (this._itemHeight + this.spacing.y))) < 0 && (t = 0);
var i = this.column * (t + this._itemsVisible + this.spawnCount);
i >= this.adapter.getCount() && (i = this.adapter.getCount() - 1);
return [ t * this.column, i ];
};
t.prototype.init = function() {
var e, t;
if (!this._isInited) {
this._isInited = !0;
null === (e = this.getComponent(cc.Widget)) || void 0 === e || e.updateAlignment();
if (this.scrollView) {
this.content = this.scrollView.content;
null === (t = this.content.parent.getComponent(cc.Widget)) || void 0 === t || t.updateAlignment();
this.horizontal = this.scrollView.horizontal;
this.horizontal ? (this.scrollView.vertical = !1, this.content.anchorX = 0, this.content.anchorY = this.content.parent.anchorY, 
this.content.x = 0 - this.content.parent.width * this.content.parent.anchorX, this.content.y = 0) : (this.scrollView.vertical = !0, 
this.content.anchorX = this.content.parent.anchorX, this.content.anchorY = 1, this.content.x = 0, 
this.content.y = this.content.parent.height * this.content.parent.anchorY);
} else console.error("ListView need a scrollView for showing.");
this._items || (this._items = new cc.NodePool(this.comp));
var i = this._items.get() || this.resLoader.instantiate(this.itemTemplate ? this.itemTemplate : this.itemPrefabTemplate);
l.default.addClickAudio(i);
i.active = !0;
this._items.put(i);
this._itemHeight = i.height || 10;
this._itemWidth = i.width || 10;
this.horizontal ? this._itemsVisible = Math.ceil((this.content.parent.width - this.margin.x - this.margin.width) / (this._itemWidth + this.spacing.x)) : this._itemsVisible = Math.ceil((this.content.parent.height - this.margin.y - this.margin.height) / (this._itemHeight + this.spacing.y));
}
};
t.prototype.setItemRender = function(e, t) {
if (e) {
this.adapter || (this.adapter = new m());
this.adapter.updateView = e.bind(t);
this.notifyUpdate();
return this;
}
console.error("ListView.setItemRender: itemRender is null or undefined.");
};
Object.defineProperty(t.prototype, "datas", {
get: function() {
return this.adapter ? this.adapter.dataSet : null;
},
set: function(e) {
this.adapter || (this.adapter = new m());
this.adapter.setDataSet(e);
this.notifyUpdate();
},
enumerable: !1,
configurable: !0
});
a([ h(cc.Node) ], t.prototype, "itemTemplate", void 0);
a([ h(cc.Prefab) ], t.prototype, "itemPrefabTemplate", void 0);
a([ h(cc.Vec2) ], t.prototype, "spacing", void 0);
a([ h({
tooltip: "四周边距"
}) ], t.prototype, "margin", void 0);
a([ h({
tooltip: "比可见元素多缓存2个, 缓存越多,快速滑动越流畅,但同时初始化越慢."
}) ], t.prototype, "spawnCount", void 0);
a([ h({
tooltip: "行列数，横向滚动是行数，竖向滚动是列数."
}) ], t.prototype, "column", void 0);
a([ h(cc.ScrollView) ], t.prototype, "scrollView", void 0);
a([ h(cc.Node) ], t.prototype, "emptyView", void 0);
a([ h({
tooltip: "当可见元素小于最大可见数量时候,是否居中显示"
}) ], t.prototype, "isCenter", void 0);
return a([ d, p("UI/Cocos/ListView") ], t);
}(cc.Component);
i.default = _;
var f = function() {
function e(e, t) {
void 0 === t && (t = 0);
this.listView = null;
this.pageOfItems = 0;
this.currentPageIndex = 0;
this.onPageChangeListener = null;
this.srcOnTouchEnded = null;
this.srcOnTouchBegan = null;
this.srcHandleReleaseLogic = null;
this._initAutoScrollToPage = !1;
this.touchBeganPosition = null;
this.touchEndPosition = null;
this.listView = e;
this.pageOfItems = t;
}
e.prototype.initAutoScrollToPage = function() {
if (!this._initAutoScrollToPage) {
var e = this.listView.getScrollView();
this.srcOnTouchBegan = e._onTouchBegan.bind(e);
e._onTouchBegan = this.onTouchStartListener.bind(this);
this.srcOnTouchEnded = e._onTouchEnded.bind(e);
e._onTouchEnded = this.onTouchEndListener.bind(this);
this.srcHandleReleaseLogic = e._handleReleaseLogic.bind(e);
e._handleReleaseLogic = this.handleReleaseLogicListener.bind(this);
this._initAutoScrollToPage = !0;
}
};
e.prototype.onTouchStartListener = function(e, t) {
this.touchBeganPosition = e.touch.getLocation();
this.srcOnTouchBegan(e, t);
};
e.prototype.onTouchEndListener = function(e, t) {
this.touchEndPosition = e.touch.getLocation();
this.srcOnTouchEnded(e, t);
};
e.prototype.handleReleaseLogicListener = function() {
this.autoScrollToPage();
var e = this.listView.getScrollView();
if (e._scrolling) {
e._scrolling = !1;
e._autoScrolling || e.node.emit("scroll-ended");
}
};
e.prototype.autoScrollToPage = function() {
if (this.touchBeganPosition && this.touchEndPosition) {
var e = this.touchBeganPosition.sub(this.touchEndPosition), t = this.getCurrentPage() + this.getDragDirection(e);
t = cc.misc.clampf(t, 0, this.getPageCount() - 1);
this.currentPageIndex = t;
this.listView.scrollToPage(t, 0, .5);
this.onPageChangeListener && this.onPageChangeListener(this.listView, this.currentPageIndex);
}
};
e.prototype.getDragDirection = function(e) {
return this.listView.getScrollView().horizontal ? 0 === e.x ? 0 : e.x > 0 ? 1 : -1 : this.listView.getScrollView().vertical ? 0 === e.y ? 0 : e.y < 0 ? 1 : -1 : void 0;
};
e.prototype.getPageCount = function() {
if (!this.listView.getAdapter()) return 1;
var e = this.listView.getAdapter().getCount();
this.pageOfItems || (this.pageOfItems = this.listView.getVisibleElements());
this.pageOfItems <= 0 && (this.pageOfItems = 1);
return Math.ceil(e / this.pageOfItems);
};
e.prototype.getCurrentPage = function() {
return this.currentPageIndex;
};
e.prototype.prePage = function() {
if (!this.listView.getScrollView().isScrolling()) {
this.currentPageIndex--;
this.currentPageIndex < 0 && (this.currentPageIndex = 0);
this.listView.scrollToPage(this.currentPageIndex, 0, .5);
this.onPageChangeListener && this.onPageChangeListener(this.listView, this.currentPageIndex);
}
};
e.prototype.nextPage = function() {
if (!this.listView.getScrollView().isScrolling()) {
this.currentPageIndex++;
var e = this.getPageCount();
this.currentPageIndex > e - 1 && (this.currentPageIndex = e - 1);
this.listView.scrollToPage(this.currentPageIndex, 0, .5);
this.onPageChangeListener && this.onPageChangeListener(this.listView, this.currentPageIndex);
}
};
e.prototype.canPrePage = function() {
return this.currentPageIndex > 0;
};
e.prototype.canNextPage = function() {
return this.currentPageIndex < this.getPageCount() - 1;
};
e.prototype.setOnPageChangeListener = function(e) {
this.onPageChangeListener = e;
};
e.prototype.scrollToPageByIndex = function(e, t) {
void 0 === t && (t = .5);
var i = this.getPageCount();
this.currentPageIndex = cc.misc.clampf(e, 0, i - 1);
this.listView.scrollToPage(this.currentPageIndex, 0, t);
};
return e;
}();
i.Pager = f;
var g = function() {
function e() {
this._dataSet = [];
}
Object.defineProperty(e.prototype, "dataSet", {
get: function() {
return this._dataSet;
},
enumerable: !1,
configurable: !0
});
e.prototype.setDataSet = function(e) {
this._dataSet = e || [];
};
e.prototype.getCount = function() {
return this.dataSet ? this.dataSet.length : 0;
};
e.prototype.getData = function(e) {
return this.dataSet[e];
};
e.prototype._getView = function(e, t) {
this.updateView(e, t, this.getData(t));
e.zIndex = t;
e.on(cc.Node.EventType.TOUCH_END, this.onClickBase, this);
return e;
};
e.prototype.onClickBase = function(e) {
var t = e.currentTarget;
this.onClickItem(t, this.getData(t.zIndex), t.zIndex);
};
e.prototype.onClickItem = function() {};
return e;
}();
i.AbsAdapter = g;
var m = function(e) {
function t() {
return null !== e && e.apply(this, arguments) || this;
}
n(t, e);
t.prototype.updateView = function() {};
return t;
}(g);
cc._RF.pop();
}