let e = require;
let t = module;
"use strict";
cc._RF.push(t, "3cd3cw4czZBvaf1xkUFj8jM", "FlyRewardAnimMgr");
var i = e("LanguageService.js"),
n = e("AudioMgr"),
a = {
  _iconPool:[],
  _labelPool:[],
  _getIconNode: function() {
    if(this._iconPool.length > 0) return this._iconPool.pop();
    var e = new cc.Node("flyIcon");
    e.addComponent(cc.Sprite);
    e.setContentSize(40, 40);
    return e;
  }
,
  _putIconNode: function(e) {
    cc.Tween.stopAllByTarget(e);
    e.removeFromParent(! 1);
    e.opacity = 255;
    e.scale = 1;
    e.setPosition(0, 0);
    this._iconPool.push(e);
  }
,
  _getLabelNode: function() {
    if(this._labelPool.length > 0) return this._labelPool.pop();
    var e = new cc.Node("flyLabel"),
    t = e.addComponent(cc.Label);
    t.fontSize = 22;
    t.lineHeight = 26;
    t.enableBold = ! 0;
    t.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
    e.color = cc.color(230, 26, 76);
    return e;
  }
,
  _putLabelNode: function(e) {
    cc.Tween.stopAllByTarget(e);
    e.removeFromParent(! 1);
    e.opacity = 255;
    e.setPosition(0, 0);
    this._labelPool.push(e);
  }
,
  playFlyAnim: function(e) {
    var t = this,
    i = e.iconFrame,
    a = e.startPos|| cc.v2(0, 0),
    o = e.endPos,
    r = e.parentNode,
    s = e.count|| 5,
    l = void 0 !== e.startScale? e.startScale:.15,
    c = void 0 !== e.endScale? e.endScale:.5,
    u = void 0 !== e.launchInterval? Math.max(0, e.launchInterval):.06,
    d = e.targetIconNode|| null,
    h = e.rewardText|| "",
    p = e.onAllArrived,
    _ = e.sfx|| "",
    f = e.sfxBundle|| "game";
    if(r&& r.isValid&& i&& o) {
      _&& n.default.getInstance().playEffect(_, f);
      for(var g = 0, m = (l+ c)/ 2, y = 0;
      y < s;
      y++)(function(e) {
        var n = t._getIconNode(), _ = n.getComponent(cc.Sprite);
        _&& (_.spriteFrame = i);
        var f = 360* Math.random(), y = 60* Math.random()+ 20, v = y* Math.cos(f* Math.PI/ 180), b = y* Math.sin(f* Math.PI/ 180);
        n.setPosition(a.x+ v, a.y+ b);
        n.scale = l;
        n.opacity = 255;
        n.zIndex = 999;
        r.addChild(n);
        var w = n.x, k = n.y, S = cc.v2(.25*(w+ o.x)- 60, .5*(k+ o.y)+ 80);
        cc.tween(n).to(.15, {
          scale: m
        }
, {
          easing: "backOut"
        }
).delay(e* u).parallel(cc.tween().bezierTo(.45, S, S, o), cc.tween().to(.45, {
          scale: c
        }
)).call(function() {
          t._putIconNode(n);
          if(++ g >= s) {
            d&& t.playIconPop(d);
            h&& t.playFloatText(h, o, r);
            p&& p();
          }
        }
).start();
      }
)(y);
    } else p&& p();
  }
,
  playIconPop: function(e) {
    if(e&& e.isValid) {
      cc.Tween.stopAllByTarget(e);
      e.scale = 1;
      cc.tween(e).to(.1, {
        scale: 1.3
      }
, {
        easing: "sineOut"
      }
).to(.15, {
        scale: 1
      }
, {
        easing: "bounceOut"
      }
).start();
    }
  }
,
  playFloatText: function(e, t, i) {
    if(i&& i.isValid) {
      var n = this._getLabelNode(),
      a = n.getComponent(cc.Label);
      a&& (a.string = e);
      n.setPosition(t.x+ 50, t.y+ 5);
      n.opacity = 255;
      n.zIndex = 1e3;
      i.addChild(n);
      var o = this;
      cc.tween(n).delay(.1).parallel(cc.tween().to(.8, {
        y: n.y+ 60
      }
, {
        easing: "sineOut"
      }
), cc.tween().delay(.3).to(.5, {
        opacity: 0
      }
)).call(function() {
        o._putLabelNode(n);
      }
).start();
    }
  }
,
  getWorldPos: function(e) {
    return e&& e.isValid&& e.parent? e.parent.convertToWorldSpaceAR(e.position): null;
  }
,
  formatRewardText: function(e) {
    return "+"+ i.formatCurrency(e);
  }
}
;
t.exports = a;
cc._RF.pop();
