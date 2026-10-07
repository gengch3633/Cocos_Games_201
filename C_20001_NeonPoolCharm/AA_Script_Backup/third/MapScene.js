let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "bbdc8934X1Kl4knQocIwUKi", "MapScene");
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
var r = e("utils.js"),
l = cc._decorator,
s = l.ccclass,
c = (l.property, function(e) {
  i(t, e);
  function t() {
    return null !== e&& e.apply(this, arguments)|| this;
  }
  t.prototype.clickMap = function(e) {
    console.log("clickMap", e);
    var t = this.node.getChildByName("build");
    t.x = e.x;
    t.y = e.y;
  }
;
  t.prototype.saveSprite = function() {
  }
;
  t.prototype.onLoad = function() {
    var e = cc.winSize;
    console.log(e);
    this.node.height = e.height;
    var t = this.node.getChildByName("sprite").getComponent("cc.Sprite").spriteFrame;
    console.log("sFrame", t);
    var o = this.node.getChildByName("button"), n = this;
    o.on("click", function() {
      console.log("click");
      var e = cc.find("Canvas");
      console.log("find ", e);
      var t = e.getChildByName("diamondNode");
      console.log("diamondNode", t);
      var o = n.node.getChildByName("sprite");
      console.log("spriteFrame name", o.getComponent(cc.Sprite).spriteFrame.name);
      console.log("sprite", o);
      console.log("sprite attr", o.uuid, o.name, o.width, o.height, o.x, o.y, o.position, o.scale, o.scaleX, o.scaleY, o.anchorX, o.anchorY);
      var i = {
        uuid: o.uuid, name: o.name, width: o.width, height: o.height, x: o.x, y: o.y, position: o.position, scale: o.scale, scaleX: o.scaleX, scaleY: o.scaleY, anchorX: o.anchorX, anchorY: o.anchorY
      }
, a = JSON.stringify(i);
      a = r.formatJSON(a);
      if(cc.sys.isNative) {
        cc.log("getWritablePath:"+ jsb.fileUtils.getWritablePath());
        cc.log(jsb.fileUtils.writeStringToFile(a, "C:\\Users\\sesame\\Desktop\\json\\data.json"));
      } else if(cc.sys.isBrowser) {
        var l = new Blob([a], {
          type: "application/json"
        }
), s = document.createElement("a");
        s.download = "savetest";
        s.innerHTML = "Download File";
        if(null != window.webkitURL) s.href = window.webkitURL.createObjectURL(l);
        else {
          s.href = window.URL.createObjectURL(l);
          s.onclick = destroyClickedElement;
          s.style.display = "none";
          document.body.appendChild(s);
        }
      }
      var c = n.node.getChildByName("container").getChildByName("spine2").getComponent(sp.Skeleton);
      console.log("spine1 Skeleton", c, c.skeletonData);
      console.log("spine1 Skeleton skeletonData", c.skeletonData, c.skeletonData.name);
    }
, this);
  }
;
  return a([s], t);
}
(cc.Component));
o.default = c;
cc._RF.pop();
