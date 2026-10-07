let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "c3c5fm1CDlJWpzJybNRmZhy", "Drag");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var o = cc._decorator,
r = o.ccclass;
o.property;
var s = o.menu,
l = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t._draggable = ! 1;
    t.dragging = ! 1;
    t.startPoint = null;
    t.sensitivity = 0;
    return t;
  }
  var i;
  n(t, e);
  i = t;
  Object.defineProperty(t.prototype, "draggable", {
    get: function() {
      return this._draggable;
    }
, set: function(e) {
      this._draggable != e&& (e? this.startDrag(): this.removeDragEvent());
      this._draggable = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  t.prototype.touchStartHandle = function(e) {
    if(this._draggable) {
      e.stopPropagation();
      e.stopPropagationImmediate();
      this.startPoint = e.getLocation();
    }
  }
;
  t.prototype.touchMoveHandle = function(e) {
    if(this._draggable) {
      if(! this.dragging) {
        if(! this.startPoint) return;
        var t = e.getLocation();
        if(Math.abs(this.startPoint.x- t.x) < this.sensitivity&& Math.abs(this.startPoint.y- t.y) < this.sensitivity) return;
        this.dragging = ! 0;
        this.node.emit(i.Event.DRAG_START, e);
      }
      if(this.dragging) {
        e.stopPropagation();
        e.stopPropagationImmediate();
        this.node.x+= e.getDeltaX();
        this.node.y+= e.getDeltaY();
        this.node.emit(i.Event.DRAG_MOVE, e);
      }
    }
  }
;
  t.prototype.touchEndHandle = function(e) {
    if(this._draggable&& this.dragging) {
      e.stopPropagation();
      e.stopPropagationImmediate();
      this.dragging = ! 1;
      this.node.emit(i.Event.DRAG_END, e);
    }
  }
;
  t.prototype.startDrag = function() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartHandle, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveHandle, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndHandle, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndHandle, this);
    this._draggable = ! 0;
  }
;
  t.prototype.stopDrag = function() {
    this.dragging = ! 1;
  }
;
  t.prototype.removeDragEvent = function() {
    this.node.off(cc.Node.EventType.TOUCH_START, this.touchStartHandle, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoveHandle, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.touchEndHandle, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEndHandle, this);
  }
;
  t.Event = {
    DRAG_START: "drag_start",
    DRAG_MOVE: "drag_move",
    DRAG_END: "drag_end"
  }
;
  return i = a([r, s("UI/Cocos/Drag")], t);
}
(cc.Component);
i.default = l;
cc._RF.pop();
