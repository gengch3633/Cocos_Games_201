let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "3b05eUZDBtCmqEpVCb1/xAz", "ListItem");
var n,
a = __extends,
o = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var r = cc._decorator,
s = r.ccclass,
l = r.property,
c = r.disallowMultiple,
u = r.menu,
d = r.executionOrder;
(function(e) {
  e[e.NONE = 0] = "NONE";
  e[e.TOGGLE = 1] = "TOGGLE";
  e[e.SWITCH = 2] = "SWITCH";
}
)(n|| (n = {
}
));
var h = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.icon = null;
    t.title = null;
    t.selectedMode = n.NONE;
    t.selectedFlag = null;
    t.selectedSpriteFrame = null;
    t._unselectedSpriteFrame = null;
    t.adaptiveSize = ! 1;
    t._selected = ! 1;
    t._eventReg = ! 1;
    return t;
  }
  a(t, e);
  Object.defineProperty(t.prototype, "selected", {
    get: function() {
      return this._selected;
    }
, set: function(e) {
      this._selected = e;
      if(this.selectedFlag) switch(this.selectedMode) {
        case n.TOGGLE: this.selectedFlag.active = e;
        break;
        case n.SWITCH: var t = this.selectedFlag.getComponent(cc.Sprite);
        t&& (t.spriteFrame = e? this.selectedSpriteFrame: this._unselectedSpriteFrame);
      }
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "btnCom", {
    get: function() {
      this._btnCom|| (this._btnCom = this.node.getComponent(cc.Button));
      return this._btnCom;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  t.prototype.onLoad = function() {
    if(this.selectedMode == n.SWITCH) {
      var e = this.selectedFlag.getComponent(cc.Sprite);
      this._unselectedSpriteFrame = e.spriteFrame;
    }
  }
;
  t.prototype.onDestroy = function() {
    this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
  }
;
  t.prototype._registerEvent = function() {
    if(! this._eventReg) {
      this.btnCom&& this.list.selectedMode > 0&& this.btnCom.clickEvents.unshift(this.createEvt(this, "onClickThis"));
      this.adaptiveSize&& this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
      this._eventReg = ! 0;
    }
  }
;
  t.prototype._onSizeChange = function() {
    this.list._onItemAdaptive(this.node);
  }
;
  t.prototype.createEvt = function(e, t, i) {
    void 0 === i&& (i = null);
    if(e.isValid) {
      e.comName = e.comName|| e.name.match(/ \ < (.*?) \ > / g).pop().replace(/ \ < | > / g, "");
      var n = new cc.Component.EventHandler();
      n.target = i|| e.node;
      n.component = e.comName;
      n.handler = t;
      return n;
    }
  }
;
  t.prototype.showAni = function(e, t, i) {
    var n,
    a = this;
    switch(e) {
      case 0: n = cc.tween(a.node).to(.2, {
        scale:.7
      }
).by(.3, {
        y: 2* a.node.height
      }
);
      break;
      case 1: n = cc.tween(a.node).to(.2, {
        scale:.7
      }
).by(.3, {
        x: 2* a.node.width
      }
);
      break;
      case 2: n = cc.tween(a.node).to(.2, {
        scale:.7
      }
).by(.3, {
        y:- 2* a.node.height
      }
);
      break;
      case 3: n = cc.tween(a.node).to(.2, {
        scale:.7
      }
).by(.3, {
        x:- 2* a.node.width
      }
);
      break;
      default: n = cc.tween(a.node).to(.3, {
        scale:.1
      }
);
    }
(t|| i)&& n.call(function() {
      if(i) {
        a.list._delSingleItem(a.node);
        for(var e = a.list.displayData.length- 1;
        e >= 0;
        e--) if(a.list.displayData[e].id == a.listId) {
          a.list.displayData.splice(e, 1);
          break;
        }
      }
      t();
    }
);
    n.start();
  }
;
  t.prototype.onClickThis = function() {
    this.list.selectedId = this.listId;
  }
;
  o([l({
    type: cc.Sprite
  }
)], t.prototype, "icon", void 0);
  o([l({
    type: cc.Node
  }
)], t.prototype, "title", void 0);
  o([l({
    type: cc.Enum(n)
  }
)], t.prototype, "selectedMode", void 0);
  o([l({
    type: cc.Node, visible: function() {
      return this.selectedMode > n.NONE;
    }
  }
)], t.prototype, "selectedFlag", void 0);
  o([l({
    type: cc.SpriteFrame, visible: function() {
      return this.selectedMode == n.SWITCH;
    }
  }
)], t.prototype, "selectedSpriteFrame", void 0);
  o([l({
  }
)], t.prototype, "adaptiveSize", void 0);
  return o([s, c(), u("自定义组件/List Item"), d(- 5001)], t);
}
(cc.Component);
i.default = h;
cc._RF.pop();
