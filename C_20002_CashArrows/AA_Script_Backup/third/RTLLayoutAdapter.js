let e = require;
let t = module;
"use strict";
cc._RF.push(t, "7097bOvOCZNM6IxGIfCnoBX", "RTLLayoutAdapter");
var i = e("GlobalEventMgr"),
n = e("InterfaceMgr"),
a = e("LanguageService.js"),
o = e("RTLNoMirror.js"),
r = cc.Class({
  extends: cc.Component, properties: {
    affectWidget: {
      default: ! 0, tooltip: "处理子树里的 cc.Widget：isAlignLeft <-> isAlignRight，left <-> right"
    }
, affectLayout: {
      default: ! 0, tooltip: "处理子树里的 cc.Layout：HORIZONTAL/GRID 时翻转 horizontalDirection"
    }
, flipCenterHOffset: {
      default: ! 0, tooltip: "CENTER_H 锚点的水平偏移在 RTL 下取反（偏右 -> 偏左）"
    }
, affectSelf: {
      default: ! 0, tooltip: "根节点自身的 Widget / Layout 是否也参与镜像；Canvas 撑满 Widget 翻无差，prefab 根节点开启更符合预期"
    }
, affectPosition: {
      default: ! 0, tooltip: "子节点 x 坐标按父中心镜像；项目里很多节点用绝对坐标定位时必须开"
    }
  }
, onLoad: function() {
    this._cache = [];
    this._collected = ! 1;
    this._isDestroyed = ! 1;
    this.bindLanguageEvent();
    this.scheduleOnce(this._init, 0);
  }
, onDestroy: function() {
    this._isDestroyed = ! 0;
    this.unbindLanguageEvent();
  }
, bindLanguageEvent: function() {
    i.default.getInstance().on(n.gameEvent.languageChanged, this._onLanguageChanged, this);
  }
, unbindLanguageEvent: function() {
    i.default.getInstance().off(n.gameEvent.languageChanged, this._onLanguageChanged, this);
  }
, _init: function() {
    if(! this._isDestroyed) {
      this._collect();
      this._apply();
      try {
        if(a.isRTL()) {
          var e = this.node&& this.node.name? this.node.name: "?";
          cc.log("[RTLLayoutAdapter] init on '"+ e+ "' cached="+ this._cache.length+ " rtl=true");
        }
      } catch(e) {
      }
    }
  }
, _onLanguageChanged: function() {
    if(! this._isDestroyed) {
      this._collected|| this._collect();
      this._apply();
    }
  }
, _collect: function() {
    this._cache = [];
    if(this.node&& this.node.isValid) {
      this._walk(this.node);
      this._collected = ! 0;
    } else this._collected = ! 0;
  }
, _walk: function(e) {
    if(e&& e.isValid&& !(e !== this.node&& e.getComponent(o)|| e !== this.node&& e.getComponent(r))) {
      var t = null;
      if(e !== this.node|| this.affectSelf) {
        this.affectWidget&& (t = e.getComponent(cc.Widget))&& this._cache.push({
          kind: "widget", comp: t, orig: this._snapshotWidget(t)
        }
);
        if(this.affectLayout) {
          var i = e.getComponent(cc.Layout);
          i&& this._cache.push({
            kind: "layout", comp: i, orig: this._snapshotLayout(i)
          }
);
        }
      }
      if(this.affectPosition&& e !== this.node) {
        var n = t|| (this.affectWidget? null: e.getComponent(cc.Widget)), a = e.parent, s = a&& a.getComponent&& a.getComponent(cc.Layout);
        n|| s|| this._cache.push({
          kind: "position", node: e, orig: {
            x: e.x
          }
        }
);
      }
      for(var l = 0;
      l < e.childrenCount;
      l++) this._walk(e.children[l]);
    }
  }
, _snapshotWidget: function(e) {
    return {
      alignFlags: e._alignFlags, isAlignLeft: e.isAlignLeft, isAlignRight: e.isAlignRight, isAlignHorizontalCenter: e.isAlignHorizontalCenter, left: e.left, right: e.right, horizontalCenter: e.horizontalCenter, isAbsLeft: ! ! e.isAbsoluteLeft, isAbsRight: ! ! e.isAbsoluteRight, isAbsHorizontalCenter: ! ! e.isAbsoluteHorizontalCenter
    }
;
  }
, _snapshotLayout: function(e) {
    return {
      type: e.type, horizontalDirection: e.horizontalDirection, paddingLeft: e.paddingLeft, paddingRight: e.paddingRight
    }
;
  }
, _apply: function() {
    if(! this._isDestroyed) for(var e = a.isRTL(), t = 0;
    t < this._cache.length;
    t++) {
      var i = this._cache[t];
("position" === i.kind? i.node&& i.node.isValid: i.comp&& i.comp.isValid)&& ("widget" === i.kind? e? this._mirrorWidget(i.comp, i.orig): this._restoreWidget(i.comp, i.orig): "layout" === i.kind? e? this._mirrorLayout(i.comp, i.orig): this._restoreLayout(i.comp, i.orig): "position" === i.kind&& (e? this._mirrorPosition(i): this._restorePosition(i)));
    }
  }
, _mirrorWidget: function(e, t) {
    e.isAlignLeft = t.isAlignRight;
    e.isAlignRight = t.isAlignLeft;
    e.left = t.right;
    e.right = t.left;
    e.isAbsoluteLeft = t.isAbsRight;
    e.isAbsoluteRight = t.isAbsLeft;
    if(t.isAlignHorizontalCenter&& this.flipCenterHOffset) {
      e.horizontalCenter = - t.horizontalCenter;
      e.isAbsoluteHorizontalCenter = t.isAbsHorizontalCenter;
    }
    e.updateAlignment&& e.updateAlignment();
  }
, _restoreWidget: function(e, t) {
    e.isAlignLeft = t.isAlignLeft;
    e.isAlignRight = t.isAlignRight;
    e.left = t.left;
    e.right = t.right;
    e.isAbsoluteLeft = t.isAbsLeft;
    e.isAbsoluteRight = t.isAbsRight;
    if(t.isAlignHorizontalCenter) {
      e.horizontalCenter = t.horizontalCenter;
      e.isAbsoluteHorizontalCenter = t.isAbsHorizontalCenter;
    }
    e.updateAlignment&& e.updateAlignment();
  }
, _mirrorLayout: function(e, t) {
    if(t.type === cc.Layout.Type.HORIZONTAL|| t.type === cc.Layout.Type.GRID) {
      e.horizontalDirection = t.horizontalDirection === cc.Layout.HorizontalDirection.LEFT_TO_RIGHT? cc.Layout.HorizontalDirection.RIGHT_TO_LEFT: cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
      e.paddingLeft = t.paddingRight;
      e.paddingRight = t.paddingLeft;
    }
  }
, _restoreLayout: function(e, t) {
    e.horizontalDirection = t.horizontalDirection;
    e.paddingLeft = t.paddingLeft;
    e.paddingRight = t.paddingRight;
  }
, _mirrorPosition: function(e) {
    var t = e.node, i = t.parent;
    if(i&& i.isValid) {
      var n = i.width|| 0, a = null != i.anchorX? i.anchorX:.5;
      t.x = n*(1- 2* a)- e.orig.x;
    } else t.x = - e.orig.x;
  }
, _restorePosition: function(e) {
    e.node.x = e.orig.x;
  }
, rebuild: function() {
    if(this._cache&& this._cache.length > 0) for(var e = 0;
    e < this._cache.length;
    e++) {
      var t = this._cache[e];
      t.comp&& t.comp.isValid&& ("widget" === t.kind? this._restoreWidget(t.comp, t.orig): "layout" === t.kind&& this._restoreLayout(t.comp, t.orig));
    }
    this._collect();
    this._apply();
  }
}
);
t.exports = r;
t.exports.default = r;
cc._RF.pop();
