let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "d1ff7zbL5VDFJGnPwF5Hs0m", "SpinePreviewComponent");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
i.SpinePreviewComponent = void 0;
var o = cc._decorator,
r = o.ccclass,
s = o.property,
l = o.menu,
c = o.executeInEditMode,
u = o.playOnFocus,
d = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t._isEditorPlay = ! 0;
    t._isEditoAttach_csryw = ! 1;
    return t;
  }
  n(t, e);
  Object.defineProperty(t.prototype, "isEditorPlay", {
    get: function() {
      return this._isEditorPlay;
    }
, set: function(e) {
      this._isEditorPlay = e;
      if(this._isEditorPlay) {
        for(var t = this._skeleton.data.events, i = this._N$skeletonData._name+ "事件集合：", n = "[", a = 0;
        a < t.length;
        a++) {
          var o = t[a].name, r = t[a].stringValue;
          "" == r&& (r = '""');
          0 != a&& (n+= ",");
          n = n+ o+ ":"+ r;
        }
        n+= "]";
        Editor.info(i+ n);
      }
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "isEditorAttach", {
    get: function() {
      return this._isEditoAttach_csryw;
    }
, set: function(e) {
      this._isEditoAttach_csryw = e;
      this._isEditoAttach_csryw&& this.attachUtil.generateAllAttachedNodes();
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  t.prototype.update = function(t) {
    e.prototype.update.call(this, t);
  }
;
  t.prototype.dumpSpineInfo = function() {
    var e = this._skeleton.data,
    t = e.animations,
    i = e.events,
    n = e.skins;
    console.group("spine : 节点 "+ this.name+ " ,动画 <"+ this._N$skeletonData._name+ " >");
    for(var a = "[", o = 0;
    o < t.length;
    o++) {
      0 != o&& (a+= ",");
      a+= s = t[o].name;
    }
    a+= "]";
    var r = "[";
    for(o = 0;
    o < i.length;
    o++) {
      var s = i[o].name,
      l = i[o].stringValue;
      "" == l&& (l = '""');
      0 != o&& (r+= ",");
      r = r+ s+ ":"+ l;
    }
    r+= "]";
    var c = "[";
    for(o = 0;
    o < n.length;
    o++) {
      0 != o&& (c+= ",");
      c+= s = n[o].name;
    }
    c+= "]";
    console.log("%c 动作集合： %c "+ a+ " ", "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;");
    console.log("%c 事件集合： %c "+ r+ " ", "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;");
    console.log("%c 皮肤集合： %c "+ c+ " ", "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;");
    console.groupEnd();
  }
;
  a([s()], t.prototype, "_isEditorPlay", void 0);
  a([s({
    tooltip: "编辑器中自动播放动作\n勾选状态，在选中节点时，帧率60，否则只有必要时才重绘\n非勾选，不自动播放", type: cc.Boolean
  }
)], t.prototype, "isEditorPlay", null);
  a([s()], t.prototype, "_isEditoAttach_csryw", void 0);
  a([s({
    tooltip: "编辑器中生成挂点\n勾选状态，生成挂点 ATTACHED_NODE_TREE\n非勾选，不做操作", type: cc.Boolean
  }
)], t.prototype, "isEditorAttach", null);
  return a([r, c, u, l("UI/Cocos/SpinePreviewComponent")], t);
}
(sp.Skeleton);
i.SpinePreviewComponent = d;
window.SpinePreviewComponent = d;
cc._RF.pop();
