let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "126ceP2BoNDDqSRxkEAAhsz", "ScrollViewCtrl");
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
    var r = e("NodePool.js"),
      l = e("EngineUtil.js"),
      s = cc._decorator,
      c = s.ccclass,
      u = s.property,
      p = s.menu,
      d = (cc._decorator, function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.itemPrefab = null;
          t.scrollView = null;
          t.content = null;
          t.view = null;
          t.layout = null;
          t.itemName = null;
          t.mat4 = null;
          t.isInit = null;
          t.data = null;
          t.callbackList = null;
          t.extData = null;
          t.firstX = null;
          t.firstY = null;
          t.itemCache = null;
          t.itemBuffer = null;
          t._tmpV2 = null;
          t.viewRect = null;
          t._resetItemFlag = 0;
          t.bindIndexList = null;
          return t;
        }
        t.prototype.onItemChanged = function (e) {
          "function" == typeof e && this.callbackList.push(e);
        };
        t.prototype.afterItemSizeChange = function () {
          var e = this;
          this._resetItemFlag = 0;
          this.updateBuffer();
          this.scheduleOnce(function () {
            e.updateListView();
          });
        };
        t.prototype.updateBuffer = function () {
          var e,
            t = this,
            o = this.itemCache[this.itemCache.length - 1];
          if (this.scrollView.vertical) {
            this.itemCache[0].y = -this.itemCache[0].height / 2 - this.layout.paddingTop || 0;
            1 != this.itemCache[0].scaleY && (this.itemCache[0].y = -Math.abs(this.itemCache[0].scaleY * (null === (e = this.itemCache[0]) || void 0 === e ? void 0 : e.height)) / 2 - this.layout.paddingTop || 0);
            this.itemBuffer.find(function (e) {
              0 == e.index && (e.item.y = t.itemCache[0].y);
            });
            for (var n = 1; n < this.data.length; n++) {
              var i = this.itemCache[n - 1],
                a = this.itemCache[n];
              if (i && a) {
                var r = i.height || 0,
                  l = a.height || 0;
                1 != i.scaleY && (r = Math.abs(i.scaleY * i.height || 0));
                1 != a.scaleY && (l = Math.abs(a.scaleY * a.height || 0));
                a.y = i.y - (r / 2 + l / 2 + this.layout.spacingY);
                this.itemBuffer.find(function (e) {
                  e.index == n && (e.item.y = a.y || 0);
                });
              }
            }
            var s = (null == o ? void 0 : o.height) / 2 || 0;
            1 != o.scaleY && (s = Math.abs(o.scaleY * (null == o ? void 0 : o.height)) / 2 || 0);
            this.content && (this.content.height = Math.abs(o.y - s - this.layout.paddingBottom));
          }
        };
        t.prototype.removeItemByIndex = function (e) {
          if (this.itemBuffer) {
            var t = this.itemBuffer.findIndex(function (t) {
              return t.index == e;
            });
            if (t >= 0) {
              var o = this.itemBuffer.splice(t, 1);
              l.default.destroyNode(o.item);
            }
          }
        };
        t.prototype.registerScrollEvent = function (e, t) {
          if (e.name) {
            var o = this.node.getComponent(cc.ScrollView),
              n = new cc.Component.EventHandler();
            n.target = t.node;
            n.component = cc.js.getClassName(t);
            n.handler = e.name;
            var i = o.scrollEvents.length;
            o.scrollEvents[i] = n;
          }
        };
        t.prototype.getItem = function () {
          var e = r.default.Instance.getNode(this.itemName);
          e.x = this.firstX;
          e.y = this.firstY;
          var t = {
            item: e,
            index: -1
          };
          this.itemBuffer.push(t);
          e.on(cc.Node.EventType.SIZE_CHANGED, this.onItemSizeChanged.bind(this, e), this);
          e.on(cc.Node.EventType.SCALE_CHANGED, this.onItemSizeChanged.bind(this, e), this);
          return t;
        };
        t.prototype.recycle = function () {
          var e = this;
          this.itemBuffer && this.itemBuffer.forEach(function (t) {
            if (t && cc.isValid(t.item)) {
              t.item.off(cc.Node.EventType.SIZE_CHANGED, e.onItemSizeChanged.bind(e, t.item), e);
              t.item.off(cc.Node.EventType.SCALE_CHANGED, e.onItemSizeChanged.bind(e, t.item), e);
              r.default.Instance.putNode(e.itemName, t.item);
            }
          });
          this.itemCache = null;
          this.itemBuffer = null;
        };
        t.prototype.updateItemView = function (e, t) {
          var o = l.default.getScript(e);
          if (o && o.initData) {
            o.initData(this.data[t], t, this.extData);
            o.updateView && o.updateView();
          }
        };
        t.prototype.onDestroy = function () {
          this.content && this.content.off(cc.Node.EventType.POSITION_CHANGED, this.scrollEvent, this);
          this.recycle();
        };
        t.prototype.update = function () {
          this._resetItemFlag > 0 && this.afterItemSizeChange();
        };
        t.prototype.scrollEvent = function () {
          this.content && this.isInit && this.updateListView();
        };
        t.prototype.getItemByIndex = function (e) {
          if (this.itemBuffer) return (this.itemBuffer.find(function (t) {
            return t.index == e;
          }) || {}).item;
        };
        t.prototype.initOnce = function () {
          this.bindIndexList = {};
          this.scrollView = this.node.getComponent(cc.ScrollView);
          this.content = this.scrollView.content;
          this.view = this.content.parent;
          this.layout = this.content.getComponent(cc.Layout);
          this.itemName = this.itemPrefab.name;
          this.mat4 = cc.mat4();
          this.initOnce = function () {};
        };
        t.prototype.scrollToBottom = function () {
          this.scrollView.scrollToBottom();
        };
        t.prototype.start = function () {
          this.initOnce();
        };
        t.prototype.updateListView = function () {
          var e = this;
          if (this.itemCache) {
            for (var t = function (t, o) {
                t.index = o;
                t.item.x = e.itemCache[o].x;
                t.item.y = e.itemCache[o].y;
                t.item.scaleX = e.itemCache[o].scaleX;
                t.item.scaleY = e.itemCache[o].scaleY;
                t.item.opacity = 255;
                e.scrollView.horizontal && (t.item.width = e.itemCache[o].width);
                e.scrollView.vertical && (t.item.height = e.itemCache[o].height);
                t.item.parent = e.content;
                e.updateItemView(t.item, o);
              }, o = 0; o < this.itemCache.length; o++) {
              var n = this.itemCache[o],
                i = this.isItemInView(o),
                a = this.itemBuffer.find(function (e) {
                  return e.index == o;
                });
              if (i) {
                this.bindIndexList[o] && (a = this.itemBuffer.find(function (e) {
                  return e.bindIndex == o;
                }));
                a || (a = (a = this.itemBuffer.find(function (e) {
                  return -1 == e.index && null == e.bindIndex;
                })) || this.getItem());
                a.index != o && t(a, o);
              } else if (a) {
                a.index = -1;
                a.item.x = -9999999;
                a.item.y = -9999999;
                a.item.opacity = 0;
              }
              n.visible != i && this.runItemChangedCallback(o, i);
              n.visible = i;
            }
            this.itemBuffer.sort(function (e, t) {
              return e.index < 0 || t.index < 0 ? 1 : e.index - t.index;
            });
            for (o = 0; o < this.itemBuffer.length; o++) this.itemBuffer[o].item.setSiblingIndex(o);
          }
        };
        t.prototype.onItemSizeChanged = function (e) {
          if (this.itemCache) {
            var t = this.itemBuffer.find(function (t) {
              return t.item == e;
            });
            if (t && t.index >= 0) {
              var o = this.itemCache[t.index];
              if (this.scrollView.horizontal && o.width == e.width && o.scaleX == e.scaleX) return;
              if (this.scrollView.vertical && o.height == e.height && o.scaleY == e.scaleY) return;
              o.width = e.width;
              o.scaleX = e.scaleX;
              o.height = e.height;
              o.scaleY = e.scaleY;
              this._resetItemFlag = 1;
            }
          }
        };
        t.prototype.isItemInView = function (e) {
          this._tmpV2 = this._tmpV2 || cc.v2(0, 0);
          this.view.getWorldMatrix(this.mat4);
          var t = this.mat4.m[0],
            o = this.mat4.m[12],
            n = this.mat4.m[13],
            i = this.view.width * t,
            a = this.view.height * t,
            r = this.view.convertToWorldSpaceAR(cc.Vec2.ZERO, this._tmpV2);
          this.viewRect && 1 == t && this.viewRect.x + i / 2 == o && this.viewRect.y + a / 2 == n || (this.viewRect = new cc.Rect(r.x - i / 2, r.y - a / 2, i, a));
          var l = this.itemCache[e],
            s = this.content.convertToWorldSpaceAR(cc.v2(l.x, l.y)),
            c = l.width * l.scaleX,
            u = l.height * l.scaleY,
            p = new cc.Rect(s.x - c / 2, s.y - u / 2, c, u);
          return this.viewRect.intersects(p);
        };
        t.prototype.init = function (e, t) {
          var o = this;
          this.initOnce();
          if (Array.isArray(e)) {
            if (e.length) {
              t = t || {};
              this.isInit = !0;
              this.data = e;
              this.callbackList = [];
              this.extData = t.extData;
              t.onChanged && this.onItemChanged(t.onChanged);
              this.layout.enabled = !1;
              this.scrollView.stopAutoScroll();
              r.default.Instance.hasPool(this.itemName) || r.default.Instance.initPool(this.itemPrefab);
              var n = this.itemPrefab.data,
                i = this.layout.paddingLeft,
                a = this.layout.paddingRight,
                l = this.layout.paddingTop,
                s = this.layout.paddingBottom,
                c = this.layout.spacingX,
                u = this.layout.spacingY,
                p = n.x,
                d = n.y;
              if (this.scrollView.horizontal) {
                p = -n.width / 2;
                p -= i;
              }
              if (this.scrollView.vertical) {
                d = -n.height / 2;
                d -= l;
              }
              this.firstX = p;
              this.firstY = d;
              this.itemCache = [];
              this.itemBuffer = this.itemBuffer || [];
              var _ = 0;
              this.itemBuffer.forEach(function (t) {
                t.index = -1;
                if (_ >= e.length) {
                  t.item.x = -9999999;
                  t.item.y = -9999999;
                  t.item.opacity = 0;
                }
                _++;
              });
              var f = function (e) {
                o.itemCache[e] = o.itemCache[e] || {};
                o.itemCache[e].x = p;
                o.itemCache[e].y = d;
                o.itemCache[e].width = n.width;
                o.itemCache[e].height = n.height;
                o.itemCache[e].scaleX = n.scaleX;
                o.itemCache[e].scaleY = n.scaleY;
                o.itemCache[e].visible = !1;
              };
              f(0);
              for (var h = 1; h < this.data.length; h++) {
                f(h);
                this.scrollView.horizontal && (this.itemCache[h].x = this.itemCache[h - 1].x - (this.itemCache[h - 1].width / 2 + this.itemCache[h].width / 2 + c));
                this.scrollView.vertical && (this.itemCache[h].y = this.itemCache[h - 1].y - (this.itemCache[h - 1].height / 2 + this.itemCache[h].height / 2 + u));
              }
              var g = this.itemCache[this.itemCache.length - 1];
              this.scrollView.horizontal && (this.content.width = Math.abs(g.x + g.width / 2 + a));
              this.scrollView.vertical && (this.content.height = Math.abs(g.y - g.height / 2 - s));
              this.content.on(cc.Node.EventType.POSITION_CHANGED, this.scrollEvent, this);
              this.scheduleOnce(function () {
                o.updateListView();
              });
            } else {
              this.recycle();
              this.content.off(cc.Node.EventType.POSITION_CHANGED, this.scrollEvent, this);
            }
          } else console.error("传进来的数据不为数组！");
        };
        t.prototype.scrollToItem = function (e, t, o) {
          if (this.itemCache && this.itemCache.length) {
            e < 0 && (e = 0);
            e >= this.itemCache.length && (e = this.itemCache.length - 1);
            var n = this.itemCache[e];
            if (n) {
              o = o || {};
              t = t || 0;
              if (this.scrollView) {
                var i;
                if (o.customTween) ;else {
                  i = -(n.y + Math.abs(n.height * n.scaleY) / 2);
                  this.scrollView.scrollToOffset(cc.v2(0, i), t);
                }
              }
            }
          }
        };
        t.prototype.bindItemWithIndex = function (e, t, o) {
          if (this.itemBuffer) {
            o = o || !0;
            var n = this.itemBuffer.find(function (t) {
              return t.item == e;
            });
            if (n) {
              n.bindIndex = t;
              if (o) this.bindIndexList[t] = o;else {
                delete this.bindIndexList[t];
                delete n.bindIndex;
              }
            }
          }
        };
        t.prototype.setItemProperty = function (e, t, o) {
          var n = this;
          if (this.itemCache && this.itemBuffer) {
            var i = this.itemBuffer.find(function (t) {
              return t.index == e;
            });
            i ? i.item[t] = o : this.itemCache[e][t] = o;
            this.updateBuffer();
            this.scheduleOnce(function () {
              n.updateListView();
            });
          }
        };
        t.prototype.scrollToTop = function () {
          this.scrollToItem(0, 0);
          this.scrollView.scrollToOffset(cc.v2(0, 0), 0);
        };
        t.prototype.runItemChangedCallback = function (e, t) {
          try {
            for (var o = 0; o < this.callbackList.length; o++) this.callbackList[o](e, t);
          } catch (e) {
            console.error(e);
          }
        };
        a([u(cc.Prefab)], t.prototype, "itemPrefab", void 0);
        return a([c, p("自定义组件/ScrollViewCtrl")], t);
      }(cc.Component));
    o.default = d;
    cc._RF.pop();
