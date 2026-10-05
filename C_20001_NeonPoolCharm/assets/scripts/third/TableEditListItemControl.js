let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "23a248R/fJDSr+t6MMg7Nih", "TableEditListItemControl");
var n,
i = this&& this.__extends|| (n = function(e, t) {
  return(n = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var o in t) Object.prototype.hasOwnProperty.call(t, o)&& (e[o] = t[o]);
  }
)(e, t);
}
, function(e, t) {
  n(e, t);
  function o() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(o.prototype = t.prototype, new o());
}
),
a = this&& this.__decorate|| function(e, t, o, n) {
  var i,
  a = arguments.length,
  r = a < 3? t: null === n? n = Object.getOwnPropertyDescriptor(t, o): n;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);
  else for(var l = e.length- 1;
  l >= 0;
  l--)(i = e[l])&& (r = (a < 3? i(r): a > 3? i(t, o, r): i(t, o))|| r);
  return a > 3&& r&& Object.defineProperty(t, o, r),
  r;
}
;
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var r = e("BallLogicMgr.js"),
l = e(GameMgr "
  }].js),
      s = cc._decorator,
      c = s.ccclass,
      u = s.property,
      p = function (t) {
        i(o, t);
        function o() {
          var e = null !== t && t.apply(this, arguments) || this;
          e.idx = 0;
          e.publictableInfo = null;
          return e;
        }
        o.prototype.onEnable = function () {};
        o.prototype.setData = function (e) {
          this.publictableInfo = e;
          cc.find(" label_id ", this.node).getComponent(cc.Label).string = e.tableID;
        };
        o.prototype.onLoad = function () {
          this.idx = this.idx || 0;
          e(" BallLogicMgr.js "), e(GameMgr"
}
].js);
var t = this;
cc.find("button", this.node).on("click", function() {
  t.publictableInfo&& - 1 == t.publictableInfo.tableID&& l.local_remove(l.LSKEY_EditingTableInfo);
}
);
cc.find("button_play", this.node).on("click", function() {
  if(t.publictableInfo) if(- 1 == t.publictableInfo.tableID) {
    r.editingTableInfo = t.publictableInfo.tableInfo;
    cc.director.loadScene("game_table_editor");
  } else r.clickTableEditListItem_challenge(t.publictableInfo);
}
);
}
;
o.prototype.update = function() {
}
;
a([u], o.prototype, "idx", void 0);
return a([c], o);
}
(cc.Component);
o.default = p;
cc._RF.pop();
