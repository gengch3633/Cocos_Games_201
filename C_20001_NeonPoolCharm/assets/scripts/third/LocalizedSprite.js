let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "7e1c9Vrvd1Hx6oWrbHAPipU", "LocalizedSprite");
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
var r = e("SpriteFrameSet.js"),
l = cc._decorator,
s = l.ccclass,
c = l.executeInEditMode,
u = l.inspector,
p = l.menu,
d = l.property,
_ = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.spriteFrameSet = [];
    t.sprite = null;
    return t;
  }
  t.prototype.updateSprite = function(e) {
    if(this.sprite) {
      var t = this.getSpriteFrameByLang(e);
! t&& this.spriteFrameSet[0]&& (t = this.spriteFrameSet[0].spriteFrame);
      this.sprite.spriteFrame = t;
    } else cc.error("Failed to update localized sprite, sprite component is invalid!");
  }
;
  t.prototype.getSpriteFrameByLang = function(e) {
    for(var t = 0;
    t < this.spriteFrameSet.length;
++ t) if(this.spriteFrameSet[t].language === e) return this.spriteFrameSet[t].spriteFrame;
  }
;
  t.prototype.fetchRender = function() {
    var e = this.getComponent(cc.Sprite);
    if(e) {
      this.sprite = e;
      this.updateSprite(window.i18n.curLang);
    }
  }
;
  t.prototype.onLoad = function() {
    this.fetchRender();
  }
;
  a([d({
    type: r.SpriteFrameSet
  }
)], t.prototype, "spriteFrameSet", void 0);
  return a([s, c(), u("packages://i18n/inspector/localized-sprite.js"), p("i18n/LocalizedSprite")], t);
}
(cc.Component);
o.default = _;
cc._RF.pop();
