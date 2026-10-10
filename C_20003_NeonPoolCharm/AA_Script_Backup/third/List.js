let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "80f32P5yONHJIf6cENTD6RX", "List");
    var n,
      i = this && this.__extends || (n = function (e, t) {
        return (n = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        })(e, t);
      }, function (e, t) {
        n(e, t);
        function o() {
          this.constructor = e;
        }
        e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
      }),
      a = this && this.__decorate || function (e, t, o, n) {
        var i,
          a = arguments.length,
          r = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (r = (a < 3 ? i(r) : a > 3 ? i(t, o, r) : i(t, o)) || r);
        return a > 3 && r && Object.defineProperty(t, o, r), r;
      };
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var r = e("ListItem.js"),
      l = cc._decorator,
      s = l.ccclass,
      c = l.property,
      u = l.disallowMultiple,
      p = l.menu,
      d = l.executionOrder,
      _ = l.requireComponent,
      f = cc.Enum({
        NODE: 1,
        PREFAB: 2
      }),
      h = cc.Enum({
        NORMAL: 1,
        ADHERING: 2,
        PAGE: 3
      }),
      g = cc.Enum({
        NONE: 0,
        SINGLE: 1,
        MULT: 2
      }),
      y = (cc._decorator, function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.templateType = f.NODE;
          t.tmpNode = null;
          t.tmpPrefab = null;
          t._slideMode = h.NORMAL;
          t.pageDistance = .3;
          t.pageChangeEvent = new cc.Component.EventHandler();
          t._virtual = !0;
          t.cyclic = !1;
          t.lackCenter = !1;
          t.lackSlide = !1;
          t._updateRate = 0;
          t.frameByFrameRenderNum = 0;
          t.renderEvent = new cc.Component.EventHandler();
          t.selectedMode = g.NONE;
          t.repeatEventSingle = !1;
          t.selectedEvent = new cc.Component.EventHandler();
          t._selectedId = -1;
          t._forceUpdate = !1;
          t._updateDone = !0;
          t._numItems = 0;
          t._inited = !1;
          t._needUpdateWidget = !1;
          t._aniDelRuning = !1;
          t._doneAfterUpdate = !1;
          t.adhering = !1;
          t._adheringBarrier = !1;
          t.curPageNum = 0;
          t.frameCount = null;
          t._sizeType = null;
          t._customSize = null;
          t._beganPos = null;
          t._scrollItem = null;
          t.multSelected = null;
          t.content = null;
          return t;
        }
        Object.defineProperty(t.prototype, "slideMode", {
          get: function () {
            return this._slideMode;
          },
          set: function (e) {
            this._slideMode = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(t.prototype, "virtual", {
          get: function () {
            return this._virtual;
          },
          set: function (e) {
            null != e && (this._virtual = e);
            0 != this._numItems && this._onScrolling();
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(t.prototype, "updateRate", {
          get: function () {
            return this._updateRate;
          },
          set: function (e) {
            e >= 0 && e <= 6 && (this._updateRate = e);
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(t.prototype, "selectedId", {
          get: function () {
            return this._selectedId;
          },
          set: function (e) {
            var t,
              o = this;
            switch (o.selectedMode) {
              case g.SINGLE:
                if (!o.repeatEventSingle && e == o._selectedId) return;
                t = o.getItemByListId(e);
                var n = void 0;
                o._selectedId >= 0 ? o._lastSelectedId = o._selectedId : o._lastSelectedId = null;
                o._selectedId = e;
                t && ((n = t.getComponent(r.default)).selected = !0);
                if (o._lastSelectedId >= 0 && o._lastSelectedId != o._selectedId) {
                  var i = o.getItemByListId(o._lastSelectedId);
                  i && (i.getComponent(r.default).selected = !1);
                }
                o.selectedEvent && cc.Component.EventHandler.emitEvents([o.selectedEvent], t, e % this._actualNumItems, null == o._lastSelectedId ? null : o._lastSelectedId % this._actualNumItems);
                break;
              case g.MULT:
                if (!(t = o.getItemByListId(e))) return;
                n = t.getComponent(r.default);
                o._selectedId >= 0 && (o._lastSelectedId = o._selectedId);
                o._selectedId = e;
                var a = !n.selected;
                n.selected = a;
                var l = o.multSelected.indexOf(e);
                a && l < 0 ? o.multSelected.push(e) : !a && l >= 0 && o.multSelected.splice(l, 1);
                o.selectedEvent && cc.Component.EventHandler.emitEvents([o.selectedEvent], t, e % this._actualNumItems, null == o._lastSelectedId ? null : o._lastSelectedId % this._actualNumItems, a);
            }
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(t.prototype, "numItems", {
          get: function () {
            return this._actualNumItems;
          },
          set: function (e) {
            var t = this;
            if (t.checkInited(!1)) if (null == e || e < 0) cc.error("numItems set the wrong::", e);else {
              t._actualNumItems = t._numItems = e;
              t._forceUpdate = !0;
              if (t._virtual) {
                t._resizeContent();
                t.cyclic && (t._numItems = t._cyclicNum * t._numItems);
                t._onScrolling();
                t.frameByFrameRenderNum || t.slideMode != h.PAGE || (t.curPageNum = t.nearestListId);
              } else {
                if (t.cyclic) {
                  t._resizeContent();
                  t._numItems = t._cyclicNum * t._numItems;
                }
                var o = t.content.getComponent(cc.Layout);
                o && (o.enabled = !0);
                t._delRedundantItem();
                t.firstListId = 0;
                if (t.frameByFrameRenderNum > 0) {
                  for (var n = t.frameByFrameRenderNum > t._numItems ? t._numItems : t.frameByFrameRenderNum, i = 0; i < n; i++) t._createOrUpdateItem2(i);
                  if (t.frameByFrameRenderNum < t._numItems) {
                    t._updateCounter = t.frameByFrameRenderNum;
                    t._updateDone = !1;
                  }
                } else {
                  for (i = 0; i < t._numItems; i++) t._createOrUpdateItem2(i);
                  t.displayItemNum = t._numItems;
                }
              }
            }
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(t.prototype, "scrollView", {
          get: function () {
            return this._scrollView;
          },
          enumerable: !1,
          configurable: !0
        });
        t.prototype.hasMultSelected = function (e) {
          return this.multSelected && this.multSelected.indexOf(e) >= 0;
        };
        t.prototype._init = function () {
          var e = this;
          if (!e._inited) {
            e._scrollView = e.node.getComponent(cc.ScrollView);
            e.content = e._scrollView.content;
            if (e.content) {
              e._layout = e.content.getComponent(cc.Layout);
              e._align = e._layout.type;
              e._resizeMode = e._layout.resizeMode;
              e._startAxis = e._layout.startAxis;
              e._topGap = e._layout.paddingTop;
              e._rightGap = e._layout.paddingRight;
              e._bottomGap = e._layout.paddingBottom;
              e._leftGap = e._layout.paddingLeft;
              e._columnGap = e._layout.spacingX;
              e._lineGap = e._layout.spacingY;
              e._colLineNum;
              e._verticalDir = e._layout.verticalDirection;
              e._horizontalDir = e._layout.horizontalDirection;
              e.setTemplateItem(cc.instantiate(e.templateType == f.PREFAB ? e.tmpPrefab : e.tmpNode));
              if (e._slideMode == h.ADHERING || e._slideMode == h.PAGE) {
                e._scrollView.inertia = !1;
                e._scrollView._onMouseWheel = function () {};
              }
              e.virtual || (e.lackCenter = !1);
              e._lastDisplayData = [];
              e.displayData = [];
              e._pool = new cc.NodePool();
              e._forceUpdate = !1;
              e._updateCounter = 0;
              e._updateDone = !0;
              e.curPageNum = 0;
              if (e.cyclic) {
                e._scrollView._processAutoScrolling = this._processAutoScrolling.bind(e);
                e._scrollView._startBounceBackIfNeeded = function () {
                  return !1;
                };
              }
              switch (e._align) {
                case cc.Layout.Type.HORIZONTAL:
                  switch (e._horizontalDir) {
                    case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                      e._alignCalcType = 1;
                      break;
                    case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                      e._alignCalcType = 2;
                  }
                  break;
                case cc.Layout.Type.VERTICAL:
                  switch (e._verticalDir) {
                    case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                      e._alignCalcType = 3;
                      break;
                    case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                      e._alignCalcType = 4;
                  }
                  break;
                case cc.Layout.Type.GRID:
                  switch (e._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL:
                      switch (e._verticalDir) {
                        case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                          e._alignCalcType = 3;
                          break;
                        case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                          e._alignCalcType = 4;
                      }
                      break;
                    case cc.Layout.AxisDirection.VERTICAL:
                      switch (e._horizontalDir) {
                        case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                          e._alignCalcType = 1;
                          break;
                        case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                          e._alignCalcType = 2;
                      }
                  }
              }
              e.content.removeAllChildren();
              e._inited = !0;
            } else cc.error(e.node.name + "'s cc.ScrollView unset content!");
          }
        };
        t.prototype.updateAll = function () {
          this.checkInited() && (this.numItems = this.numItems);
        };
        t.prototype._delRedundantItem = function () {
          if (this._virtual) for (var e = this._getOutsideItem(), t = e.length - 1; t >= 0; t--) {
            var o = e[t];
            if (!this._scrollItem || o._listId != this._scrollItem._listId) {
              o.isCached = !0;
              this._pool.put(o);
              for (var n = this._lastDisplayData.length - 1; n >= 0; n--) if (this._lastDisplayData[n] == o._listId) {
                this._lastDisplayData.splice(n, 1);
                break;
              }
            }
          } else for (; this.content.childrenCount > this._numItems;) this._delSingleItem(this.content.children[this.content.childrenCount - 1]);
        };
        t.prototype._registerEvent = function () {
          var e = this;
          e.node.on(cc.Node.EventType.TOUCH_START, e._onTouchStart, e, !0);
          e.node.on("touch-up", e._onTouchUp, e);
          e.node.on(cc.Node.EventType.TOUCH_CANCEL, e._onTouchCancelled, e, !0);
          e.node.on("scroll-began", e._onScrollBegan, e, !0);
          e.node.on("scroll-ended", e._onScrollEnded, e, !0);
          e.node.on("scrolling", e._onScrolling, e, !0);
          e.node.on(cc.Node.EventType.SIZE_CHANGED, e._onSizeChanged, e);
        };
        t.prototype._getFixedSize = function (e) {
          if (!this._customSize) return null;
          null == e && (e = this._numItems);
          var t = 0,
            o = 0;
          for (var n in this._customSize) if (parseInt(n) < e) {
            t += this._customSize[n];
            o++;
          }
          return {
            val: t,
            count: o
          };
        };
        t.prototype.getItemPos = function (e) {
          return this._virtual ? this._calcItemPos(e) : this.frameByFrameRenderNum ? this._calcItemPos(e) : this._calcExistItemPos(e);
        };
        t.prototype._onTouchStart = function (e, t) {
          if (!this._scrollView.hasNestedViewGroup(e, t)) {
            this.curScrollIsTouch = !0;
            if (e.eventPhase !== cc.Event.AT_TARGET || e.target !== this.node) {
              for (var o = e.target; null == o._listId && o.parent;) o = o.parent;
              this._scrollItem = null != o._listId ? o : e.target;
            }
          }
        };
        t.prototype.scrollTo = function (e, t, o, n) {
          void 0 === t && (t = .5);
          void 0 === o && (o = null);
          void 0 === n && (n = !1);
          var i = this;
          if (i.checkInited(!1)) {
            null == t ? t = .5 : t < 0 && (t = 0);
            e < 0 ? e = 0 : e >= i._numItems && (e = i._numItems - 1);
            !i._virtual && i._layout && i._layout.enabled && i._layout.updateLayout();
            var a,
              r,
              l = i.getItemPos(e);
            if (!l) return !1;
            switch (i._alignCalcType) {
              case 1:
                a = l.left;
                a -= null != o ? i.node.width * o : i._leftGap;
                l = cc.v2(a, 0);
                break;
              case 2:
                a = l.right - i.node.width;
                a += null != o ? i.node.width * o : i._rightGap;
                l = cc.v2(a + i.content.width, 0);
                break;
              case 3:
                r = l.top;
                r += null != o ? i.node.height * o : i._topGap;
                l = cc.v2(0, -r);
                break;
              case 4:
                r = l.bottom + i.node.height;
                r -= null != o ? i.node.height * o : i._bottomGap;
                l = cc.v2(0, -r + i.content.height);
            }
            var s = i.content.getPosition();
            s = Math.abs(i._sizeType ? s.y : s.x);
            var c = i._sizeType ? l.y : l.x;
            if (Math.abs((null != i._scrollPos ? i._scrollPos : s) - c) > .5) {
              i._scrollView.scrollToOffset(l, t);
              i._scrollToListId = e;
              i._scrollToEndTime = new Date().getTime() / 1e3 + t;
              i._scrollToSo = i.scheduleOnce(function () {
                i._adheringBarrier || (i.adhering = i._adheringBarrier = !1);
                i._scrollPos = i._scrollToListId = i._scrollToEndTime = i._scrollToSo = null;
                if (n) {
                  var t = i.getItemByListId(e);
                  t && cc.tween(t).to(.1, {
                    scale: 1.05
                  }).to(.1, {
                    scale: 1
                  }).start();
                }
              }, t + .1);
              t <= 0 && i._onScrolling();
            }
          }
        };
        t.prototype.getMultSelected = function () {
          return this.multSelected;
        };
        t.prototype._onSizeChanged = function () {
          this.checkInited(!1) && this._onScrolling();
        };
        t.prototype._onScrollEnded = function () {
          var e = this;
          e.curScrollIsTouch = !1;
          if (null != e.scrollToListId) {
            var t = e.getItemByListId(e.scrollToListId);
            e.scrollToListId = null;
            t && cc.tween(t).to(.1, {
              scale: 1.06
            }).to(.1, {
              scale: 1
            }).start();
          }
          e._onScrolling();
          e._slideMode != h.ADHERING || e.adhering ? e._slideMode == h.PAGE && (null != e._beganPos && e.curScrollIsTouch ? this._pageAdhere() : e.adhere()) : e.adhere();
        };
        t.prototype._createOrUpdateItem = function (e) {
          var t = this.getItemByListId(e.id);
          if (t) {
            if (this._forceUpdate && this.renderEvent) {
              t.setPosition(cc.v2(e.x, e.y));
              this._resetItemSize(t);
              this.renderEvent && cc.Component.EventHandler.emitEvents([this.renderEvent], t, e.id % this._actualNumItems);
            }
          } else {
            var o = this._pool.size() > 0;
            t = o ? this._pool.get() : cc.instantiate(this._itemTmp);
            if (!o || !cc.isValid(t)) {
              t = cc.instantiate(this._itemTmp);
              o = !1;
            }
            if (t._listId != e.id) {
              t._listId = e.id;
              t.setContentSize(this._itemSize);
            }
            t.setPosition(cc.v2(e.x, e.y));
            this._resetItemSize(t);
            this.content.addChild(t);
            if (o && this._needUpdateWidget) {
              var n = t.getComponent(cc.Widget);
              n && n.updateAlignment();
            }
            t.setSiblingIndex(this.content.childrenCount - 1);
            var i = t.getComponent(r.default);
            t.listItem = i;
            if (i) {
              i.listId = e.id;
              i.list = this;
              i._registerEvent();
            }
            this.renderEvent && cc.Component.EventHandler.emitEvents([this.renderEvent], t, e.id % this._actualNumItems);
          }
          this._resetItemSize(t);
          this._updateListItem(t.listItem);
          this._lastDisplayData.indexOf(e.id) < 0 && this._lastDisplayData.push(e.id);
        };
        t.prototype._delSingleItem = function (e) {
          e.removeFromParent();
          e.destroy && e.destroy();
          e = null;
        };
        t.prototype._createOrUpdateItem2 = function (e) {
          var t,
            o = this.content.children[e];
          if (o) {
            if (this._forceUpdate && this.renderEvent) {
              o._listId = e;
              t && (t.listId = e);
              this.renderEvent && cc.Component.EventHandler.emitEvents([this.renderEvent], o, e % this._actualNumItems);
            }
          } else {
            (o = cc.instantiate(this._itemTmp))._listId = e;
            this.content.addChild(o);
            t = o.getComponent(r.default);
            o.listItem = t;
            if (t) {
              t.listId = e;
              t.list = this;
              t._registerEvent();
            }
            this.renderEvent && cc.Component.EventHandler.emitEvents([this.renderEvent], o, e % this._actualNumItems);
          }
          this._updateListItem(t);
          this._lastDisplayData.indexOf(e) < 0 && this._lastDisplayData.push(e);
        };
        t.prototype.updateItem = function (e) {
          if (this.checkInited()) {
            Array.isArray(e) || (e = [e]);
            for (var t = 0, o = e.length; t < o; t++) {
              var n = e[t],
                i = this.getItemByListId(n);
              i && cc.Component.EventHandler.emitEvents([this.renderEvent], i, n % this._actualNumItems);
            }
          }
        };
        t.prototype.onDisable = function () {
          this._unregisterEvent();
        };
        t.prototype._onScrollBegan = function () {
          this._beganPos = this._sizeType ? this.viewTop : this.viewLeft;
        };
        t.prototype._processAutoScrolling = function (e) {
          this._scrollView._autoScrollAccumulatedTime += 1 * e;
          var t = Math.min(1, this._scrollView._autoScrollAccumulatedTime / this._scrollView._autoScrollTotalTime);
          if (this._scrollView._autoScrollAttenuate) {
            var o = t - 1;
            t = o * o * o * o * o + 1;
          }
          var n = this._scrollView._autoScrollStartPosition.add(this._scrollView._autoScrollTargetDelta.mul(t)),
            i = this._scrollView.getScrollEndedEventTiming(),
            a = Math.abs(t - 1) <= i;
          if (Math.abs(t - 1) <= this._scrollView.getScrollEndedEventTiming() && !this._scrollView._isScrollEndedWithThresholdEventFired) {
            this._scrollView._dispatchEvent("scroll-ended-with-threshold");
            this._scrollView._isScrollEndedWithThresholdEventFired = !0;
          }
          a && (this._scrollView._autoScrolling = !1);
          var r = n.sub(this._scrollView.getContentPosition());
          this._scrollView._moveContent(this._scrollView._clampDelta(r), a);
          this._scrollView._dispatchEvent("scrolling");
          if (!this._scrollView._autoScrolling) {
            this._scrollView._isBouncing = !1;
            this._scrollView._scrolling = !1;
            this._scrollView._dispatchEvent("scroll-ended");
          }
        };
        t.prototype._unregisterEvent = function () {
          var e = this;
          e.node.off(cc.Node.EventType.TOUCH_START, e._onTouchStart, e, !0);
          e.node.off("touch-up", e._onTouchUp, e);
          e.node.off(cc.Node.EventType.TOUCH_CANCEL, e._onTouchCancelled, e, !0);
          e.node.off("scroll-began", e._onScrollBegan, e, !0);
          e.node.off("scroll-ended", e._onScrollEnded, e, !0);
          e.node.off("scrolling", e._onScrolling, e, !0);
          e.node.off(cc.Node.EventType.SIZE_CHANGED, e._onSizeChanged, e);
        };
        t.prototype.skipPage = function (e, t) {
          var o = this;
          if (o.checkInited()) {
            if (o._slideMode != h.PAGE) return cc.error("This function is not allowed to be called, Must SlideMode = PAGE!");
            if (!(e < 0 || e >= o._numItems) && o.curPageNum != e) {
              o.curPageNum = e;
              o.pageChangeEvent && cc.Component.EventHandler.emitEvents([o.pageChangeEvent], e);
              o.scrollTo(e, t);
            }
          }
        };
        t.prototype.setTemplateItem = function (e) {
          if (e) {
            var t = this;
            t._itemTmp = e;
            t._resizeMode == cc.Layout.ResizeMode.CHILDREN ? t._itemSize = t._layout.cellSize : t._itemSize = cc.size(e.width, e.height);
            var o = e.getComponent(r.default),
              n = !1;
            o || (n = !0);
            n && (t.selectedMode = g.NONE);
            (o = e.getComponent(cc.Widget)) && o.enabled && (t._needUpdateWidget = !0);
            t.selectedMode == g.MULT && (t.multSelected = []);
            switch (t._align) {
              case cc.Layout.Type.HORIZONTAL:
                t._colLineNum = 1;
                t._sizeType = !1;
                break;
              case cc.Layout.Type.VERTICAL:
                t._colLineNum = 1;
                t._sizeType = !0;
                break;
              case cc.Layout.Type.GRID:
                switch (t._startAxis) {
                  case cc.Layout.AxisDirection.HORIZONTAL:
                    var i = t.content.width - t._leftGap - t._rightGap;
                    t._colLineNum = Math.floor((i + t._columnGap) / (t._itemSize.width + t._columnGap));
                    t._sizeType = !0;
                    break;
                  case cc.Layout.AxisDirection.VERTICAL:
                    var a = t.content.height - t._topGap - t._bottomGap;
                    t._colLineNum = Math.floor((a + t._lineGap) / (t._itemSize.height + t._lineGap));
                    t._sizeType = !1;
                }
            }
          }
        };
        t.prototype._calcNearestItem = function () {
          var e,
            t,
            o,
            n,
            i,
            a,
            r = this;
          r.nearestListId = null;
          r._virtual && r._calcViewPos();
          o = r.viewTop;
          n = r.viewRight;
          i = r.viewBottom;
          a = r.viewLeft;
          for (var l = !1, s = 0; s < r.content.childrenCount && !l; s += r._colLineNum) if (e = r._virtual ? r.displayData[s] : r._calcExistItemPos(s)) {
            t = r._sizeType ? (e.top + e.bottom) / 2 : t = (e.left + e.right) / 2;
            switch (r._alignCalcType) {
              case 1:
                if (e.right >= a) {
                  r.nearestListId = e.id;
                  a > t && (r.nearestListId += r._colLineNum);
                  l = !0;
                }
                break;
              case 2:
                if (e.left <= n) {
                  r.nearestListId = e.id;
                  n < t && (r.nearestListId += r._colLineNum);
                  l = !0;
                }
                break;
              case 3:
                if (e.bottom <= o) {
                  r.nearestListId = e.id;
                  o < t && (r.nearestListId += r._colLineNum);
                  l = !0;
                }
                break;
              case 4:
                if (e.top >= i) {
                  r.nearestListId = e.id;
                  i > t && (r.nearestListId += r._colLineNum);
                  l = !0;
                }
            }
          }
          if ((e = r._virtual ? r.displayData[r.displayItemNum - 1] : r._calcExistItemPos(r._numItems - 1)) && e.id == r._numItems - 1) {
            t = r._sizeType ? (e.top + e.bottom) / 2 : t = (e.left + e.right) / 2;
            switch (r._alignCalcType) {
              case 1:
                n > t && (r.nearestListId = e.id);
                break;
              case 2:
                a < t && (r.nearestListId = e.id);
                break;
              case 3:
                i < t && (r.nearestListId = e.id);
                break;
              case 4:
                o > t && (r.nearestListId = e.id);
            }
          }
        };
        t.prototype._getOutsideItem = function () {
          for (var e, t = [], o = this.content.childrenCount - 1; o >= 0; o--) {
            e = this.content.children[o];
            this.displayData.find(function (t) {
              return t.id == e._listId;
            }) || t.push(e);
          }
          return t;
        };
        t.prototype._calcItemPos = function (e) {
          var t, o, n, i, a, r, l, s;
          switch (this._align) {
            case cc.Layout.Type.HORIZONTAL:
              switch (this._horizontalDir) {
                case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                  if (this._customSize) {
                    var c = this._getFixedSize(e);
                    a = this._leftGap + (this._itemSize.width + this._columnGap) * (e - c.count) + (c.val + this._columnGap * c.count);
                    t = (u = this._customSize[e]) > 0 ? u : this._itemSize.width;
                  } else {
                    a = this._leftGap + (this._itemSize.width + this._columnGap) * e;
                    t = this._itemSize.width;
                  }
                  if (this.lackCenter) {
                    a -= this._leftGap;
                    a += this.content.width / 2 - this._allItemSizeNoEdge / 2;
                  }
                  return {
                    id: e,
                    left: a,
                    right: r = a + t,
                    x: a + this._itemTmp.anchorX * t,
                    y: this._itemTmp.y
                  };
                case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                  if (this._customSize) {
                    c = this._getFixedSize(e);
                    r = -this._rightGap - (this._itemSize.width + this._columnGap) * (e - c.count) - (c.val + this._columnGap * c.count);
                    t = (u = this._customSize[e]) > 0 ? u : this._itemSize.width;
                  } else {
                    r = -this._rightGap - (this._itemSize.width + this._columnGap) * e;
                    t = this._itemSize.width;
                  }
                  if (this.lackCenter) {
                    r += this._rightGap;
                    r -= this.content.width / 2 - this._allItemSizeNoEdge / 2;
                  }
                  return {
                    id: e,
                    right: r,
                    left: a = r - t,
                    x: a + this._itemTmp.anchorX * t,
                    y: this._itemTmp.y
                  };
              }
              break;
            case cc.Layout.Type.VERTICAL:
              switch (this._verticalDir) {
                case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                  if (this._customSize) {
                    c = this._getFixedSize(e);
                    n = -this._topGap - (this._itemSize.height + this._lineGap) * (e - c.count) - (c.val + this._lineGap * c.count);
                    o = (u = this._customSize[e]) > 0 ? u : this._itemSize.height;
                  } else {
                    n = -this._topGap - (this._itemSize.height + this._lineGap) * e;
                    o = this._itemSize.height;
                  }
                  if (this.lackCenter) {
                    n += this._topGap;
                    n -= this.content.height / 2 - this._allItemSizeNoEdge / 2;
                  }
                  return {
                    id: e,
                    top: n,
                    bottom: i = n - o,
                    x: this._itemTmp.x,
                    y: i + this._itemTmp.anchorY * o
                  };
                case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                  if (this._customSize) {
                    var u;
                    c = this._getFixedSize(e);
                    i = this._bottomGap + (this._itemSize.height + this._lineGap) * (e - c.count) + (c.val + this._lineGap * c.count);
                    o = (u = this._customSize[e]) > 0 ? u : this._itemSize.height;
                  } else {
                    i = this._bottomGap + (this._itemSize.height + this._lineGap) * e;
                    o = this._itemSize.height;
                  }
                  if (this.lackCenter) {
                    i -= this._bottomGap;
                    i += this.content.height / 2 - this._allItemSizeNoEdge / 2;
                  }
                  return {
                    id: e,
                    top: n = i + o,
                    bottom: i,
                    x: this._itemTmp.x,
                    y: i + this._itemTmp.anchorY * o
                  };
              }
            case cc.Layout.Type.GRID:
              var p = Math.floor(e / this._colLineNum);
              switch (this._startAxis) {
                case cc.Layout.AxisDirection.HORIZONTAL:
                  switch (this._verticalDir) {
                    case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                      s = (i = (n = -this._topGap - (this._itemSize.height + this._lineGap) * p) - this._itemSize.height) + this._itemTmp.anchorY * this._itemSize.height;
                      break;
                    case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                      n = (i = this._bottomGap + (this._itemSize.height + this._lineGap) * p) + this._itemSize.height;
                      s = i + this._itemTmp.anchorY * this._itemSize.height;
                  }
                  l = this._leftGap + e % this._colLineNum * (this._itemSize.width + this._columnGap);
                  switch (this._horizontalDir) {
                    case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                      l += this._itemTmp.anchorX * this._itemSize.width;
                      l -= this.content.anchorX * this.content.width;
                      break;
                    case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                      l += (1 - this._itemTmp.anchorX) * this._itemSize.width;
                      l -= (1 - this.content.anchorX) * this.content.width;
                      l *= -1;
                  }
                  return {
                    id: e,
                    top: n,
                    bottom: i,
                    x: l,
                    y: s
                  };
                case cc.Layout.AxisDirection.VERTICAL:
                  switch (this._horizontalDir) {
                    case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                      r = (a = this._leftGap + (this._itemSize.width + this._columnGap) * p) + this._itemSize.width;
                      l = a + this._itemTmp.anchorX * this._itemSize.width;
                      l -= this.content.anchorX * this.content.width;
                      break;
                    case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                      l = (a = (r = -this._rightGap - (this._itemSize.width + this._columnGap) * p) - this._itemSize.width) + this._itemTmp.anchorX * this._itemSize.width;
                      l += (1 - this.content.anchorX) * this.content.width;
                  }
                  s = -this._topGap - e % this._colLineNum * (this._itemSize.height + this._lineGap);
                  switch (this._verticalDir) {
                    case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                      s -= (1 - this._itemTmp.anchorY) * this._itemSize.height;
                      s += (1 - this.content.anchorY) * this.content.height;
                      break;
                    case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                      s -= this._itemTmp.anchorY * this._itemSize.height;
                      s += this.content.anchorY * this.content.height;
                      s *= -1;
                  }
                  return {
                    id: e,
                    left: a,
                    right: r,
                    x: l,
                    y: s
                  };
              }
          }
        };
        t.prototype._updateListItem = function (e) {
          if (e && this.selectedMode > g.NONE) {
            var t = e.node;
            switch (this.selectedMode) {
              case g.SINGLE:
                e.selected = this.selectedId == t._listId;
                break;
              case g.MULT:
                e.selected = this.multSelected.indexOf(t._listId) >= 0;
            }
          }
        };
        t.prototype.checkInited = function (e) {
          void 0 === e && (e = !0);
          if (!this._inited) {
            e && cc.error("List initialization not completed!");
            return !1;
          }
          return !0;
        };
        t.prototype.onDestroy = function () {
          var e = this;
          cc.isValid(e._itemTmp) && e._itemTmp.destroy();
          cc.isValid(e.tmpNode) && e.tmpNode.destroy();
          e._pool && e._pool.clear();
        };
        t.prototype._onScrolling = function (e) {
          void 0 === e && (e = null);
          null == this.frameCount && (this.frameCount = this._updateRate);
          if (!this._forceUpdate && e && "scroll-ended" != e.type && this.frameCount > 0) this.frameCount--;else {
            this.frameCount = this._updateRate;
            if (!this._aniDelRuning) {
              if (this.cyclic) {
                var t = this.content.getPosition();
                t = this._sizeType ? t.y : t.x;
                var o = this._allItemSizeNoEdge + (this._sizeType ? this._lineGap : this._columnGap),
                  n = this._sizeType ? cc.v2(0, o) : cc.v2(o, 0);
                switch (this._alignCalcType) {
                  case 1:
                    if (t > -this._cyclicPos1) {
                      this.content.x = -this._cyclicPos2;
                      this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(n));
                    } else if (t < -this._cyclicPos2) {
                      this.content.x = -this._cyclicPos1;
                      this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(n));
                    }
                    break;
                  case 2:
                    if (t < this._cyclicPos1) {
                      this.content.x = this._cyclicPos2;
                      this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(n));
                    } else if (t > this._cyclicPos2) {
                      this.content.x = this._cyclicPos1;
                      this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(n));
                    }
                    break;
                  case 3:
                    if (t < this._cyclicPos1) {
                      this.content.y = this._cyclicPos2;
                      this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(n));
                    } else if (t > this._cyclicPos2) {
                      this.content.y = this._cyclicPos1;
                      this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(n));
                    }
                    break;
                  case 4:
                    if (t > -this._cyclicPos1) {
                      this.content.y = -this._cyclicPos2;
                      this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(n));
                    } else if (t < -this._cyclicPos2) {
                      this.content.y = -this._cyclicPos1;
                      this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(n));
                    }
                }
              }
              this._calcViewPos();
              var i, a, r, l;
              if (this._sizeType) {
                i = this.viewTop;
                r = this.viewBottom;
              } else {
                a = this.viewRight;
                l = this.viewLeft;
              }
              if (this._virtual) {
                this.displayData = [];
                var s = void 0,
                  c = 0,
                  u = this._numItems - 1;
                if (this._customSize) for (var p = !1; c <= u && !p; c++) {
                  s = this._calcItemPos(c);
                  switch (this._align) {
                    case cc.Layout.Type.HORIZONTAL:
                      s.right >= l && s.left <= a ? this.displayData.push(s) : 0 != c && this.displayData.length > 0 && (p = !0);
                      break;
                    case cc.Layout.Type.VERTICAL:
                      s.bottom <= i && s.top >= r ? this.displayData.push(s) : 0 != c && this.displayData.length > 0 && (p = !0);
                      break;
                    case cc.Layout.Type.GRID:
                      switch (this._startAxis) {
                        case cc.Layout.AxisDirection.HORIZONTAL:
                          s.bottom <= i && s.top >= r ? this.displayData.push(s) : 0 != c && this.displayData.length > 0 && (p = !0);
                          break;
                        case cc.Layout.AxisDirection.VERTICAL:
                          s.right >= l && s.left <= a ? this.displayData.push(s) : 0 != c && this.displayData.length > 0 && (p = !0);
                      }
                  }
                } else {
                  var d = this._itemSize.width + this._columnGap,
                    _ = this._itemSize.height + this._lineGap;
                  switch (this._alignCalcType) {
                    case 1:
                      c = (l - this._leftGap) / d;
                      u = (a - this._leftGap) / d;
                      break;
                    case 2:
                      c = (-a - this._rightGap) / d;
                      u = (-l - this._rightGap) / d;
                      break;
                    case 3:
                      c = (-i - this._topGap) / _;
                      u = (-r - this._topGap) / _;
                      break;
                    case 4:
                      c = (r - this._bottomGap) / _;
                      u = (i - this._bottomGap) / _;
                  }
                  c = Math.floor(c) * this._colLineNum;
                  u = Math.ceil(u) * this._colLineNum;
                  c < 0 && (c = 0);
                  --u >= this._numItems && (u = this._numItems - 1);
                  for (; c <= u; c++) this.displayData.push(this._calcItemPos(c));
                }
                this._delRedundantItem();
                if (this.displayData.length <= 0 || !this._numItems) {
                  this._lastDisplayData = [];
                  return;
                }
                this.firstListId = this.displayData[0].id;
                this.displayItemNum = this.displayData.length;
                var f = this._lastDisplayData.length,
                  h = this.displayItemNum != f;
                if (h) {
                  this.frameByFrameRenderNum > 0 && this._lastDisplayData.sort(function (e, t) {
                    return e - t;
                  });
                  h = this.firstListId != this._lastDisplayData[0] || this.displayData[this.displayItemNum - 1].id != this._lastDisplayData[f - 1];
                }
                if (this._forceUpdate || h) if (this.frameByFrameRenderNum > 0) {
                  if (this._numItems > 0) {
                    this._updateDone ? this._updateCounter = 0 : this._doneAfterUpdate = !0;
                    this._updateDone = !1;
                  } else {
                    this._updateCounter = 0;
                    this._updateDone = !0;
                  }
                } else {
                  this._lastDisplayData = [];
                  for (var g = 0; g < this.displayItemNum; g++) this._createOrUpdateItem(this.displayData[g]);
                  this._forceUpdate = !1;
                }
                this._calcNearestItem();
              }
            }
          }
        };
        t.prototype.prePage = function (e) {
          void 0 === e && (e = .5);
          this.checkInited() && this.skipPage(this.curPageNum - 1, e);
        };
        t.prototype._onTouchUp = function () {
          var e = this;
          e._scrollPos = null;
          if (e._slideMode == h.ADHERING) {
            this.adhering && (this._adheringBarrier = !0);
            e.adhere();
          } else e._slideMode == h.PAGE && (null != e._beganPos ? this._pageAdhere() : e.adhere());
          this._scrollItem = null;
        };
        t.prototype._calcExistItemPos = function (e) {
          var t = this.getItemByListId(e);
          if (!t) return null;
          var o = {
            id: e,
            x: t.x,
            y: t.y
          };
          if (this._sizeType) {
            o.top = t.y + t.height * (1 - t.anchorY);
            o.bottom = t.y - t.height * t.anchorY;
          } else {
            o.left = t.x - t.width * t.anchorX;
            o.right = t.x + t.width * (1 - t.anchorX);
          }
          return o;
        };
        t.prototype.setMultSelected = function (e, t) {
          var o = this;
          if (o.checkInited()) {
            Array.isArray(e) || (e = [e]);
            if (null == t) o.multSelected = e;else {
              var n = void 0,
                i = void 0;
              if (t) for (var a = e.length - 1; a >= 0; a--) {
                n = e[a];
                (i = o.multSelected.indexOf(n)) < 0 && o.multSelected.push(n);
              } else for (a = e.length - 1; a >= 0; a--) {
                n = e[a];
                (i = o.multSelected.indexOf(n)) >= 0 && o.multSelected.splice(i, 1);
              }
            }
            o._forceUpdate = !0;
            o._onScrolling();
          }
        };
        t.prototype._pageAdhere = function () {
          var e = this;
          if (e.cyclic || !(e.elasticTop > 0 || e.elasticRight > 0 || e.elasticBottom > 0 || e.elasticLeft > 0)) {
            var t = e._sizeType ? e.viewTop : e.viewLeft,
              o = (e._sizeType ? e.node.height : e.node.width) * e.pageDistance;
            if (Math.abs(e._beganPos - t) > o) switch (e._alignCalcType) {
              case 1:
              case 4:
                e._beganPos > t ? e.prePage(.5) : e.nextPage(.5);
                break;
              case 2:
              case 3:
                e._beganPos < t ? e.prePage(.5) : e.nextPage(.5);
            } else e.elasticTop <= 0 && e.elasticRight <= 0 && e.elasticBottom <= 0 && e.elasticLeft <= 0 && e.adhere();
            e._beganPos = null;
          }
        };
        t.prototype._updateItemPos = function (e) {
          var t = isNaN(e) ? e : this.getItemByListId(e),
            o = this.getItemPos(t._listId);
          t.setPosition(o.x, o.y);
        };
        t.prototype.adhere = function () {
          var e = this;
          if (e.checkInited() && !(e.elasticTop > 0 || e.elasticRight > 0 || e.elasticBottom > 0 || e.elasticLeft > 0)) {
            e.adhering = !0;
            e._calcNearestItem();
            var t = (e._sizeType ? e._topGap : e._leftGap) / (e._sizeType ? e.node.height : e.node.width);
            e.scrollTo(e.nearestListId, .7, t);
          }
        };
        t.prototype.onEnable = function () {
          this._registerEvent();
          this._init();
          if (this._aniDelRuning) {
            this._aniDelRuning = !1;
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
        };
        t.prototype._onTouchCancelled = function (e, t) {
          var o = this;
          if (!o._scrollView.hasNestedViewGroup(e, t) && !e.simulate) {
            o._scrollPos = null;
            if (o._slideMode == h.ADHERING) {
              o.adhering && (o._adheringBarrier = !0);
              o.adhere();
            } else o._slideMode == h.PAGE && (null != o._beganPos ? o._pageAdhere() : o.adhere());
            this._scrollItem = null;
          }
        };
        t.prototype._resizeContent = function () {
          var e,
            t = this;
          switch (t._align) {
            case cc.Layout.Type.HORIZONTAL:
              if (t._customSize) {
                var o = t._getFixedSize(null);
                e = t._leftGap + o.val + t._itemSize.width * (t._numItems - o.count) + t._columnGap * (t._numItems - 1) + t._rightGap;
              } else e = t._leftGap + t._itemSize.width * t._numItems + t._columnGap * (t._numItems - 1) + t._rightGap;
              break;
            case cc.Layout.Type.VERTICAL:
              if (t._customSize) {
                o = t._getFixedSize(null);
                e = t._topGap + o.val + t._itemSize.height * (t._numItems - o.count) + t._lineGap * (t._numItems - 1) + t._bottomGap;
              } else e = t._topGap + t._itemSize.height * t._numItems + t._lineGap * (t._numItems - 1) + t._bottomGap;
              break;
            case cc.Layout.Type.GRID:
              t.lackCenter && (t.lackCenter = !1);
              switch (t._startAxis) {
                case cc.Layout.AxisDirection.HORIZONTAL:
                  var n = Math.ceil(t._numItems / t._colLineNum);
                  e = t._topGap + t._itemSize.height * n + t._lineGap * (n - 1) + t._bottomGap;
                  break;
                case cc.Layout.AxisDirection.VERTICAL:
                  var i = Math.ceil(t._numItems / t._colLineNum);
                  e = t._leftGap + t._itemSize.width * i + t._columnGap * (i - 1) + t._rightGap;
              }
          }
          var a = t.content.getComponent(cc.Layout);
          a && (a.enabled = !1);
          t._allItemSize = e;
          t._allItemSizeNoEdge = t._allItemSize - (t._sizeType ? t._topGap + t._bottomGap : t._leftGap + t._rightGap);
          if (t.cyclic) {
            var r = t._sizeType ? t.node.height : t.node.width;
            t._cyclicPos1 = 0;
            r -= t._cyclicPos1;
            t._cyclicNum = Math.ceil(r / t._allItemSizeNoEdge) + 1;
            var l = t._sizeType ? t._lineGap : t._columnGap;
            t._cyclicPos2 = t._cyclicPos1 + t._allItemSizeNoEdge + l;
            t._cyclicAllItemSize = t._allItemSize + t._allItemSizeNoEdge * (t._cyclicNum - 1) + l * (t._cyclicNum - 1);
            t._cycilcAllItemSizeNoEdge = t._allItemSizeNoEdge * t._cyclicNum;
            t._cycilcAllItemSizeNoEdge += l * (t._cyclicNum - 1);
          }
          t._lack = !t.cyclic && t._allItemSize < (t._sizeType ? t.node.height : t.node.width);
          var s = t._lack && t.lackCenter || !t.lackSlide ? .1 : 0,
            c = t._lack ? (t._sizeType ? t.node.height : t.node.width) - s : t.cyclic ? t._cyclicAllItemSize : t._allItemSize;
          c < 0 && (c = 0);
          t._sizeType ? t.content.height = c : t.content.width = c;
        };
        t.prototype._onItemAdaptive = function (e) {
          if (!this._sizeType && e.width != this._itemSize.width || this._sizeType && e.height != this._itemSize.height) {
            this._customSize || (this._customSize = {});
            var t = this._sizeType ? e.height : e.width;
            if (this._customSize[e._listId] != t) {
              this._customSize[e._listId] = t;
              this._resizeContent();
              this.updateAll();
              if (null != this._scrollToListId) {
                this._scrollPos = null;
                this.unschedule(this._scrollToSo);
                this.scrollTo(this._scrollToListId, Math.max(0, this._scrollToEndTime - new Date().getTime() / 1e3));
              }
            }
          }
        };
        t.prototype.aniDelItem = function (e, t, o) {
          var n = this;
          if (!n.checkInited() || n.cyclic || !n._virtual) return cc.error("This function is not allowed to be called!");
          if (!t) return cc.error("CallFunc are not allowed to be NULL, You need to delete the corresponding index in the data array in the CallFunc!");
          if (n._aniDelRuning) return cc.warn("Please wait for the current deletion to finish!");
          var i,
            a = n.getItemByListId(e);
          if (a) {
            i = a.getComponent(r.default);
            n._aniDelRuning = !0;
            n._aniDelCB = t;
            n._aniDelItem = a;
            n._aniDelBeforePos = a.position;
            n._aniDelBeforeScale = a.scale;
            var l = n.displayData[n.displayData.length - 1].id,
              s = i.selected;
            i.showAni(o, function () {
              var o, i, r;
              l < n._numItems - 2 && (o = l + 1);
              if (null != o) {
                var c = n._calcItemPos(o);
                n.displayData.push(c);
                n._virtual ? n._createOrUpdateItem(c) : n._createOrUpdateItem2(o);
              } else n._numItems--;
              if (n.selectedMode == g.SINGLE) s ? n._selectedId = -1 : n._selectedId - 1 >= 0 && n._selectedId--;else if (n.selectedMode == g.MULT && n.multSelected.length) {
                var u = n.multSelected.indexOf(e);
                u >= 0 && n.multSelected.splice(u, 1);
                for (var p = n.multSelected.length - 1; p >= 0; p--) (f = n.multSelected[p]) >= e && n.multSelected[p]--;
              }
              if (n._customSize) {
                n._customSize[e] && delete n._customSize[e];
                var d = {},
                  _ = void 0;
                for (var f in n._customSize) {
                  _ = n._customSize[f];
                  var h = parseInt(f);
                  d[h - (h >= e ? 1 : 0)] = _;
                }
                n._customSize = d;
              }
              for (p = null != o ? o : l; p >= e + 1; p--) if (a = n.getItemByListId(p)) {
                var y = n._calcItemPos(p - 1);
                i = cc.tween(a).to(.2333, {
                  position: cc.v2(y.x, y.y)
                });
                if (p <= e + 1) {
                  r = !0;
                  i.call(function () {
                    n._aniDelRuning = !1;
                    t(e);
                    delete n._aniDelCB;
                  });
                }
                i.start();
              }
              if (!r) {
                n._aniDelRuning = !1;
                t(e);
                n._aniDelCB = null;
              }
            }, !0);
          } else t(e);
        };
        t.prototype.nextPage = function (e) {
          void 0 === e && (e = .5);
          this.checkInited() && this.skipPage(this.curPageNum + 1, e);
        };
        t.prototype.onLoad = function () {
          this._init();
        };
        t.prototype._calcViewPos = function () {
          var e = this.content.getPosition();
          switch (this._alignCalcType) {
            case 1:
              this.elasticLeft = e.x > 0 ? e.x : 0;
              this.viewLeft = (e.x < 0 ? -e.x : 0) - this.elasticLeft;
              this.viewRight = this.viewLeft + this.node.width;
              this.elasticRight = this.viewRight > this.content.width ? Math.abs(this.viewRight - this.content.width) : 0;
              this.viewRight += this.elasticRight;
              break;
            case 2:
              this.elasticRight = e.x < 0 ? -e.x : 0;
              this.viewRight = (e.x > 0 ? -e.x : 0) + this.elasticRight;
              this.viewLeft = this.viewRight - this.node.width;
              this.elasticLeft = this.viewLeft < -this.content.width ? Math.abs(this.viewLeft + this.content.width) : 0;
              this.viewLeft -= this.elasticLeft;
              break;
            case 3:
              this.elasticTop = e.y < 0 ? Math.abs(e.y) : 0;
              this.viewTop = (e.y > 0 ? -e.y : 0) + this.elasticTop;
              this.viewBottom = this.viewTop - this.node.height;
              this.elasticBottom = this.viewBottom < -this.content.height ? Math.abs(this.viewBottom + this.content.height) : 0;
              this.viewBottom += this.elasticBottom;
              break;
            case 4:
              this.elasticBottom = e.y > 0 ? Math.abs(e.y) : 0;
              this.viewBottom = (e.y < 0 ? -e.y : 0) - this.elasticBottom;
              this.viewTop = this.viewBottom + this.node.height;
              this.elasticTop = this.viewTop > this.content.height ? Math.abs(this.viewTop - this.content.height) : 0;
              this.viewTop -= this.elasticTop;
          }
        };
        t.prototype._resetItemSize = function () {};
        t.prototype.getItemByListId = function (e) {
          if (this.content) for (var t = this.content.childrenCount - 1; t >= 0; t--) {
            var o = this.content.children[t];
            if (o._listId == e) return o;
          }
        };
        t.prototype.calcCustomSize = function (e) {
          var t = this;
          if (t.checkInited()) {
            if (!t._itemTmp) return cc.error("Unset template item!");
            if (!t.renderEvent) return cc.error("Unset Render-Event!");
            t._customSize = {};
            var o = cc.instantiate(t._itemTmp);
            t.content.addChild(o);
            for (var n = 0; n < e; n++) {
              cc.Component.EventHandler.emitEvents([t.renderEvent], o, n);
              o.height == t._itemSize.height && o.width == t._itemSize.width || (t._customSize[n] = t._sizeType ? o.height : o.width);
            }
            Object.keys(t._customSize).length || (t._customSize = null);
            o.removeFromParent();
            o.destroy && o.destroy();
            return t._customSize;
          }
        };
        t.prototype.update = function () {
          if (!(this.frameByFrameRenderNum <= 0 || this._updateDone)) if (this._virtual) {
            for (var e = this._updateCounter + this.frameByFrameRenderNum > this.displayItemNum ? this.displayItemNum : this._updateCounter + this.frameByFrameRenderNum, t = this._updateCounter; t < e; t++) {
              var o = this.displayData[t];
              o && this._createOrUpdateItem(o);
            }
            if (this._updateCounter >= this.displayItemNum - 1) {
              if (this._doneAfterUpdate) {
                this._updateCounter = 0;
                this._updateDone = !1;
                this._doneAfterUpdate = !1;
              } else {
                this._updateDone = !0;
                this._delRedundantItem();
                this._forceUpdate = !1;
                this._calcNearestItem();
                this.slideMode == h.PAGE && (this.curPageNum = this.nearestListId);
              }
            } else this._updateCounter += this.frameByFrameRenderNum;
          } else if (this._updateCounter < this._numItems) {
            for (e = this._updateCounter + this.frameByFrameRenderNum > this._numItems ? this._numItems : this._updateCounter + this.frameByFrameRenderNum, t = this._updateCounter; t < e; t++) this._createOrUpdateItem2(t);
            this._updateCounter += this.frameByFrameRenderNum;
          } else {
            this._updateDone = !0;
            this._calcNearestItem();
            this.slideMode == h.PAGE && (this.curPageNum = this.nearestListId);
          }
        };
        a([c({
          type: cc.Enum(f),
          tooltip: ""
        })], t.prototype, "templateType", void 0);
        a([c({
          type: cc.Node,
          tooltip: "",
          visible: function () {
            return this.templateType == f.NODE;
          }
        })], t.prototype, "tmpNode", void 0);
        a([c({
          type: cc.Prefab,
          tooltip: "",
          visible: function () {
            return this.templateType == f.PREFAB;
          }
        })], t.prototype, "tmpPrefab", void 0);
        a([c()], t.prototype, "_slideMode", void 0);
        a([c({
          type: cc.Float,
          range: [0, 1, .1],
          tooltip: "",
          slide: !0,
          visible: function () {
            return this._slideMode == h.PAGE;
          }
        })], t.prototype, "pageDistance", void 0);
        a([c({
          type: cc.Component.EventHandler,
          tooltip: "",
          visible: function () {
            return this._slideMode == h.PAGE;
          }
        })], t.prototype, "pageChangeEvent", void 0);
        a([c()], t.prototype, "_virtual", void 0);
        a([c({
          tooltip: "",
          visible: function () {
            var e = this.slideMode == h.NORMAL;
            e || (this.cyclic = !1);
            return e;
          }
        })], t.prototype, "cyclic", void 0);
        a([c({
          tooltip: "",
          visible: function () {
            return this.virtual;
          }
        })], t.prototype, "lackCenter", void 0);
        a([c({
          tooltip: "",
          visible: function () {
            var e = this.virtual && !this.lackCenter;
            e || (this.lackSlide = !1);
            return e;
          }
        })], t.prototype, "lackSlide", void 0);
        a([c({
          type: cc.Integer
        })], t.prototype, "_updateRate", void 0);
        a([c({
          type: cc.Integer,
          range: [0, 12, 1],
          tooltip: "",
          slide: !0
        })], t.prototype, "frameByFrameRenderNum", void 0);
        a([c({
          type: cc.Component.EventHandler,
          tooltip: ""
        })], t.prototype, "renderEvent", void 0);
        a([c({
          type: cc.Enum(g),
          tooltip: ""
        })], t.prototype, "selectedMode", void 0);
        a([c({
          tooltip: "",
          visible: function () {
            return this.selectedMode == g.SINGLE;
          }
        })], t.prototype, "repeatEventSingle", void 0);
        a([c({
          type: cc.Component.EventHandler,
          tooltip: "",
          visible: function () {
            return this.selectedMode > g.NONE;
          }
        })], t.prototype, "selectedEvent", void 0);
        a([c({
          serializable: !1
        })], t.prototype, "_numItems", void 0);
        a([c({
          type: cc.Enum(h),
          tooltip: ""
        })], t.prototype, "slideMode", null);
        a([c({
          type: cc.Boolean,
          tooltip: ""
        })], t.prototype, "virtual", null);
        a([c({
          type: cc.Integer,
          range: [0, 6, 1],
          tooltip: "",
          slide: !0
        })], t.prototype, "updateRate", null);
        return a([s, u(), p("自定义组件/List"), _(cc.ScrollView), d(-5e3)], t);
      }(cc.Component));
    o.default = y;
    cc._RF.pop();
