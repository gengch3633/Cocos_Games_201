let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "c9230VwlO1G+41oPaBkfrz8", "UIScrollSelect");
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
    o.EventType = void 0;
    var r = cc._decorator,
      l = r.ccclass,
      s = r.property;
    o.EventType = cc.Enum({
      SCROLL_START: 0,
      SCROLL_ING: 1,
      SCROLL_END: 2
    });
    cc._decorator;
    var c = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t.content = null;
        t.circlePage = !0;
        t.leftBtn = null;
        t.rightBtn = null;
        t.deltaX = 100;
        t.centerScale = 1;
        t.minScale = 1;
        t.scrollSpeed = 300;
        t.selectEvents = [];
        t.childs = [];
        t.isTouching = !1;
        t.hasTouchMove = !1;
        t.isTestX = !1;
        t._touchId = null;
        t.currentIndex = 0;
        t._toMoveX = 1;
        t.dx = 0;
        t.moveAim = 0;
        t.startTouchX = 0;
        return t;
      }
      t.prototype._checkChildX = function (e, t) {
        this.circlePage && (t > this.childs.length / 2 * this.deltaX ? t -= this.childs.length * this.deltaX : t < -this.childs.length / 2 * this.deltaX && (t += this.childs.length * this.deltaX));
        e.position = cc.v3(t, e.position.y, e.position.z);
        var o = (1 - Math.min(Math.abs(t), this.deltaX) / this.deltaX) * (this.centerScale - this.minScale) + this.minScale;
        e.scale = o;
      };
      t.prototype._onTouch = function (e) {
        cc.game.emit("touchUIScrollSelect", !1);
        if (null == this._touchId || e.touch == this._touchId) if (e.type != cc.Node.EventType.TOUCH_START) {
          this.hasTouchMove = !0;
          var t = e.getLocation().x - this.dx;
          this._move(t);
          this.dx = e.getLocation().x;
          var n = {
            target: this,
            type: o.EventType.SCROLL_ING,
            dx: this.dx
          };
          cc.Component.EventHandler.emitEvents(this.selectEvents, n);
        } else {
          this.isTouching = !0;
          this.hasTouchMove = !1;
          this.isTestX = !1;
          this._touchId = e.touch;
          this.dx = e.getStartLocation().x;
          this.startTouchX = this.dx;
          var i = {
            target: this,
            type: o.EventType.SCROLL_START,
            index: this.currentIndex
          };
          cc.Component.EventHandler.emitEvents(this.selectEvents, i);
        }
      };
      t.prototype._move = function (e) {
        if (0 !== e) {
          if (!this.circlePage) {
            var t = this._isMoveEdge();
            if (e < 0 && t.right) {
              console.log("最右边 无法动" + this.currentIndex);
              this.currentIndex != this.childs.length - 1 && this.scrollTo(this.childs.length - 1, !1);
              return;
            }
            if (e > 0 && t.left) {
              console.log("最左边 无法动" + this.currentIndex);
              0 != this.currentIndex && this.scrollTo(0, !1);
              return;
            }
          }
          for (var o = 0; o < this.childs.length; o++) this._checkChildX(this.childs[o], this.childs[o].position.x + e);
        }
      };
      t.prototype.init = function () {
        this.childs = [];
        for (var e = 0; e < this.content.children.length; e++) {
          this.childs[e] = this.content.children[e];
          this.childs[e].position = cc.v3(this.deltaX * (e - 1), this.childs[e].position.y, 0);
        }
        this.isTouching = !1;
        this.hasTouchMove = !1;
        this.isTestX = !1;
        this._touchId = null;
        this.scrollTo(0, !1);
      };
      t.prototype.scrollTo = function (e, t) {
        void 0 === t && (t = !0);
        if (e < 0 && e >= this.childs.length) return console.error(this.node.name + "->移动超出边界面");
        this.currentIndex = e;
        this.moveAim = e;
        if (t) {
          this.isTestX = !0;
          cc.Component.EventHandler.emitEvents(this.selectEvents, {
            target: this,
            type: o.EventType.SCROLL_START,
            index: this.currentIndex
          });
        } else {
          for (var n = 0; n < this.childs.length; n++) this._checkChildX(this.childs[n], (n - e) * this.deltaX);
          var i = {
            target: this,
            type: o.EventType.SCROLL_END,
            index: this.currentIndex
          };
          cc.Component.EventHandler.emitEvents(this.selectEvents, i);
        }
      };
      t.prototype._onTouchEnd = function (e) {
        cc.game.emit("touchUIScrollSelect", !0);
        if (null == this._touchId || e.touch == this._touchId) {
          this.isTouching = !1;
          e.type != cc.Node.EventType.TOUCH_END && e.type != cc.Node.EventType.TOUCH_CANCEL || (this._touchId = null);
          var t = e.getLocation(),
            n = this.node.convertToNodeSpaceAR(t),
            i = Math.abs(this.startTouchX - t.x);
          if (!this.hasTouchMove || i < 2) {
            var a = Math.ceil((n.x - this.deltaX / 2) / this.deltaX);
            if (0 === a) {
              var r = {
                target: this,
                type: o.EventType.SCROLL_END,
                index: this.currentIndex
              };
              cc.Component.EventHandler.emitEvents(this.selectEvents, r);
            } else {
              var l = (this.currentIndex + a + this.childs.length) % this.childs.length;
              if (l > this.currentIndex && a < 0) {
                console.log("最左边 无法动");
                return;
              }
              if (l < this.currentIndex && a > 0) {
                console.log("最右边 无法动");
                return;
              }
              this.moveAim = l;
              this._toMoveX = a > 0 ? -1 : 1;
              this.isTestX = !0;
            }
          } else {
            if (!this.circlePage) {
              var s = this._isMoveEdge();
              if (s.right) {
                console.log("最右边 无法动");
                return;
              }
              if (s.left) {
                console.log("最左边 无法动");
                return;
              }
            }
            for (var c = this.deltaX, u = 0, p = 0; p < this.childs.length; p++) if (Math.abs(this.childs[p].position.x) <= c) {
              c = Math.abs(this.childs[p].position.x);
              u = p;
            }
            this.moveAim = u;
            this._toMoveX = this.childs[u].position.x >= 0 ? -1 : 1;
            this.isTestX = !0;
          }
        }
      };
      t.prototype.scrollToRight = function () {
        this._toMoveX = -1;
        this.scrollTo((this.currentIndex + 1 + this.childs.length) % this.childs.length);
        this._setPageBtnsStatus();
      };
      t.prototype.scrollToLeft = function () {
        this._toMoveX = 1;
        this.scrollTo((this.currentIndex - 1 + this.childs.length) % this.childs.length);
        this._setPageBtnsStatus();
      };
      t.prototype._setPageBtnsStatus = function () {
        var e = this.currentIndex >= this.childs.length - 1;
        if (!this.circlePage && e) {
          console.log("已经到了最右边", this.currentIndex);
          this.rightBtn && (this.rightBtn.interactable = !1);
        } else this.rightBtn && (this.rightBtn.interactable = !0);
        var t = this.currentIndex <= 0;
        if (!this.circlePage && t) {
          console.log("已经到了最左边", this.currentIndex);
          this.leftBtn && (this.leftBtn.interactable = !1);
        } else this.leftBtn && (this.leftBtn.interactable = !0);
      };
      t.prototype.start = function () {
        this.content.on(cc.Node.EventType.TOUCH_START, this._onTouch, this);
        this.content.on(cc.Node.EventType.TOUCH_MOVE, this._onTouch, this);
        this.content.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.content.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
      };
      t.prototype.update = function (e) {
        if (!this.isTouching && this.isTestX) {
          for (var t = this._toMoveX * e * this.scrollSpeed, n = this.childs[this.moveAim].position.x, i = 0; i < this.childs.length; i++) this._checkChildX(this.childs[i], this.childs[i].position.x + t);
          var a = this.childs[0].position.x,
            r = Math.round(a / this.deltaX),
            l = this.deltaX * r,
            s = this.childs[this.moveAim].position.x;
          if (n * s < 0 && Math.abs(s) < this.deltaX) {
            this.isTestX = !1;
            for (i = 0; i < this.childs.length; i++) if (Math.abs(this.childs[i].position.x) <= Math.abs(t)) {
              this.currentIndex = i;
              break;
            }
            for (i = 0; i < this.childs.length; i++) this._checkChildX(this.childs[i], this.childs[i].position.x + l - a);
            var c = {
              target: this,
              type: o.EventType.SCROLL_END,
              index: this.currentIndex
            };
            cc.Component.EventHandler.emitEvents(this.selectEvents, c);
          }
        }
      };
      t.prototype._isMoveEdge = function () {
        return {
          left: this.childs[0].position.x >= 0,
          right: this.childs[this.childs.length - 1].position.x <= 0
        };
      };
      t.EventType = o.EventType;
      a([s(cc.Node)], t.prototype, "content", void 0);
      a([s({
        tooltip: "是否无限翻页"
      })], t.prototype, "circlePage", void 0);
      a([s({
        type: cc.Button,
        tooltip: "左边按钮",
        visible: function () {
          return !this.circlePage;
        }
      })], t.prototype, "leftBtn", void 0);
      a([s({
        type: cc.Button,
        tooltip: "右边按钮",
        visible: function () {
          return !this.circlePage;
        }
      })], t.prototype, "rightBtn", void 0);
      a([s({
        type: cc.Integer,
        tooltip: "单个控件之间的距离"
      })], t.prototype, "deltaX", void 0);
      a([s({
        type: cc.Float,
        tooltip: "中心点的缩放比例"
      })], t.prototype, "centerScale", void 0);
      a([s({
        type: cc.Float,
        tooltip: "边缘点的缩放比例"
      })], t.prototype, "minScale", void 0);
      a([s({
        type: cc.Float,
        tooltip: "滚动时的速度"
      })], t.prototype, "scrollSpeed", void 0);
      a([s({
        type: cc.Component.EventHandler,
        tooltip: "选择后的回调"
      })], t.prototype, "selectEvents", void 0);
      return a([l], t);
    }(cc.Component);
    o.default = c;
    cc._RF.pop();
