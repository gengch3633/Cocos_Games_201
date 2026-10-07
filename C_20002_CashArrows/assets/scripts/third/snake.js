let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "94116DQk5lGcKgDKtSgmsDq", "snake");
var n,
a,
o,
r = __extends,
s = __decorate,
l = __awaiter,
c = __generator,
u = __spreadArrays;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
i.snakeState = i.Direction = i.Bodyparts = void 0;
var d = e("AudioMgr"),
h = e("GlobalEventMgr"),
p = e("MultiPlatform"),
_ = e("ResMgr"),
f = e("SpriteFrames"),
g = e("InterfaceMgr"),
m = e("UserData"),
y = e("game"),
v = cc._decorator,
b = v.ccclass;
v.property;
var w = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.id = 0;
    t.prefab_item = null;
    t.node_map = null;
    t.parent_snake = null;
    t.levelInfo = null;
    t.snakeInfo2 = [];
    t.node_allbody = [];
    t.direction = null;
    t.num_movedistance = 50;
    t.bool_moveflag = ! 1;
    t.gameManager = null;
    t.action = [];
    t.snakeState = o.norlmal;
    t.node_fuzhuline = null;
    t.color_red = cc.color(255, 75, 93);
    t.color_black = cc.color(17, 20, 51);
    t.color_blue = cc.color(61, 83, 183);
    t.snakeColor = cc.color(17, 20, 51);
    t.num_clicktime = - 1;
    t.tipsTween = [];
    t.bool_iserrored = ! 1;
    t.bool_longtouchShowFuzhulline = ! 1;
    t.bool_needShowTuowei = ! 0;
    t.bool_isLongtimeTouch = ! 1;
    return t;
  }
  r(t, e);
  t.prototype._parseHexColor = function(e) {
    if(! e|| "string" != typeof e|| e.length < 6) return cc.color(17, 20, 51);
    var t = parseInt(e.substring(0, 2), 16),
    i = parseInt(e.substring(2, 4), 16),
    n = parseInt(e.substring(4, 6), 16);
    return isNaN(t)|| isNaN(i)|| isNaN(n)? cc.color(17, 20, 51): cc.color(t, i, n);
  }
;
  t.prototype.Init = function(e, t, i, n) {
    var a = this;
    this.id = e;
    this.levelInfo = t;
    this.node_map = n;
    this.parent_snake = i;
    var o = this.levelInfo.Arrows[this.id];
    m.default.getInstance().colorMode&& o&& "string" == typeof o.Color&& (this.snakeColor = this._parseHexColor(o.Color));
    _.default.getInstance().loadRes("prefab/item", cc.Prefab, null, "game").then(function(e) {
      if(e) {
        a.prefab_item = e;
        a.ShowSnake();
        a.getNodePos({
          x: 1, y: 1
        }
);
        a.determineDirection();
        a.ShowFuzhuline2();
      }
    }
);
  }
;
  t.prototype.setGameManager = function(e) {
    this.gameManager = e;
  }
;
  t.prototype.touch_start = function() {
    if(! this.bool_moveflag) {
      this.bool_isLongtimeTouch = ! 1;
      this.scheduleOnce(this.showFuzhuline, .8);
    }
  }
;
  t.prototype.showFuzhuline = function() {
    this.bool_longtouchShowFuzhulline = ! 0;
    this.bool_isLongtimeTouch = ! 0;
    this.node_fuzhuline&& (this.node_fuzhuline.active = ! 0);
    for(var e = 0;
    e < this.node_allbody.length;
    e++) this.node_allbody[e].getChildByName("show").color = this.color_blue;
  }
;
  t.prototype.touch_move = function(e) {
    var t = ! 1;
    this.node_allbody.forEach(function(i) {
      i.getBoundingBoxToWorld().contains(e.getLocation())&& (t = ! 0);
    }
);
    if(! t) {
      console.log("touch_move,移走了  取消事件");
      this.bool_longtouchShowFuzhulline&& this.node_fuzhuline&& (this.node_fuzhuline.active = ! 1);
      this.node_fuzhuline&& (this.node_fuzhuline.active = ! 1);
      this.unschedule(this.showFuzhuline);
      for(var i = 0;
      i < this.node_allbody.length;
      i++) this.node_allbody[i].getChildByName("show").color = this.bool_iserrored? this.color_red: this.snakeColor;
    }
  }
;
  t.prototype.touch_end = function() {
    console.log("tc_end");
    if(! this.bool_moveflag) {
      this.unschedule(this.showFuzhuline);
      if(this.gameManager.clickState == y.ClickState.change) {
        d.default.getInstance().playClickEff();
        this.ShowChange();
        this.gameManager.setState(y.ClickState.norlmal);
      } else if(this.gameManager.clickState == y.ClickState.yichu) {
        this.ShowYichu();
        this.gameManager.setState(y.ClickState.norlmal);
      } else if(this.bool_isLongtimeTouch) {
        this.bool_longtouchShowFuzhulline&& this.node_fuzhuline&& (this.node_fuzhuline.active = ! 1);
        h.default.getInstance().emit(g.gameEvent.notifyGameCanMove);
        this.bool_isLongtimeTouch = ! 1;
        for(var e = 0;
        e < this.node_allbody.length;
        e++) this.node_allbody[e].getChildByName("show").color = this.bool_iserrored? this.color_red: this.snakeColor;
      } else this.snakeMove();
      h.default.getInstance().emit(g.gameEvent.notifySnakeTouch, this.id);
    }
  }
;
  t.prototype.touch_cancle = function() {
    this.bool_longtouchShowFuzhulline&& this.node_fuzhuline&& (this.node_fuzhuline.active = ! 1);
    console.log("tc_cancle");
    this.unschedule(this.showFuzhuline);
    this.node_fuzhuline&& (this.node_fuzhuline.active = ! 1);
    this.bool_isLongtimeTouch = ! 1;
    h.default.getInstance().emit(g.gameEvent.notifyGameCanMove);
    for(var e = 0;
    e < this.node_allbody.length;
    e++) this.node_allbody[e].getChildByName("show").color = this.snakeColor;
  }
;
  t.prototype.ShowSnake = function() {
    for(var e = this, t = 0;
    t < this.levelInfo.Arrows[this.id].Indices.length;
    t++) {
      var i = this.levelInfo.Arrows[this.id].Indices[t],
      n = cc.instantiate(this.prefab_item);
      this.parent_snake.addChild(n);
      this.gameManager.Layout_map.node.children[i].getChildByName("dian").opacity = 255;
      n.active = ! 1;
      var a = i% this.levelInfo.XSize,
      o = Math.floor(i/ this.levelInfo.XSize);
      this.gameManager.num_mapInfo[a][o] = this.id+ "_"+ t;
      n.setPosition(this.getNodePos({
        x: a, y: o
      }
));
      this.snakeInfo2.push({
        x: a, y: o
      }
);
      this.node_allbody.push(n);
      n.getChildByName("show").color = this.snakeColor;
      n.on(cc.Node.EventType.TOUCH_START, this.touch_start, this);
      n.on(cc.Node.EventType.TOUCH_MOVE, this.touch_move, this);
      n.on(cc.Node.EventType.TOUCH_END, this.touch_end, this);
      n.on(cc.Node.EventType.TOUCH_CANCEL, this.touch_cancle, this);
    }
    for(var r = 0, s = .3/ this.levelInfo.Arrows[this.id].Indices.length, l = function(t, i) {
      var n = c.node_allbody[t];
      c.scheduleOnce(function() {
        r+= 1;
        n.active = ! 0;
        r > 1&& e.updatePartialSnakeSkin();
      }
, s* i);
    }
, c = this, u = this.node_allbody.length- 1, d = 0;
    u >= 0;
    u--, d++) l(u, d);
  }
;
  t.prototype.updatePartialSnakeSkin = function() {
    var e = this.node_allbody.filter(function(e) {
      return e.active;
    }
);
    if(0 !== e.length) for(var t = 0;
    t < e.length;
    t++) {
      var i = e[t],
      a = null,
      o = this.node_allbody.indexOf(i),
      r = o > 0? this.snakeInfo2[o- 1]: null,
      s = this.snakeInfo2[o],
      l = o < this.snakeInfo2.length- 1? this.snakeInfo2[o+ 1]: null,
      c = null !== r&& this.node_allbody[o- 1].active,
      u = null !== l&& this.node_allbody[o+ 1].active;
      if(c|| u) {
        var d = c? r: null,
        h = u? l: null;
        a = this.getBodyType(d, s, h);
      } else a = n.尾_右;
      this.changeSpr(a, i);
    }
  }
;
  t.prototype.updateSnakeSkinByData = function() {
  }
;
  t.prototype.errorAni = function() {
    return l(this, void 0, void 0, function() {
      var e = this;
      return c(this, function() {
        p.default.getInstance().vibrateEnabled&& m.default.getInstance().shake&& p.default.getInstance().vibrateLong();
        d.default.getInstance().playEffect("audio/click_wrong_arrow", g.bundleName.game);
        return[2, new Promise(function(t) {
          var i = 0, n = 0;
          switch(e.direction) {
            case a.Left: i = - e.num_movedistance/ 2;
            break;
            case a.Right: i = e.num_movedistance/ 2;
            break;
            case a.Up: n = e.num_movedistance/ 2;
            break;
            case a.Down: n = - e.num_movedistance/ 2;
          }
          var o = 0, r = e.node_allbody.length;
          e.bool_iserrored = ! 0;
          for(var s = 0;
          s < e.node_allbody.length;
          s++) {
            var l = e.node_allbody[s];
            l.getChildByName("show").color = e.color_red;
            cc.tween(l).delay(.1).by(.1, {
              x: i, y: n
            }
).by(.1, {
              x:- i, y:- n
            }
).call(function() {
++ o === r&& t();
            }
).start();
          }
          0 === r&& t();
        }
)];
      }
);
    }
);
  }
;
  t.prototype.snakeMove = function() {
    return l(this, void 0, void 0, function() {
      var e, t, i, n;
      return c(this, function(a) {
        switch(a.label) {
          case 0: p.default.getInstance().vibrateEnabled&& m.default.getInstance().shake&& p.default.getInstance().vibrateShort();
          this.bool_moveflag = ! 0;
          if(!(e = this.checkZhanai()).hasCollision) return[3, 10];
          if(!(e.distance > 0)) return[3, 7];
          t = e.distance;
          n = 0;
          a.label = 1;
          case 1: return n < e.distance?[4, this.move()]:[3, 6];
          case 2: a.sent();
          if(-- t <= 0) {
            this._vibrateOnCollision();
            return h.default.getInstance().emit(g.gameEvent.snakeTouchSnake, e.collisionPos), [4, this.errorAni()];
          }
          return[3, 5];
          case 3: a.sent();
          h.default.getInstance().emit(g.gameEvent.gameFail, this.id);
          return[4, this.huitui()];
          case 4: a.sent();
          a.label = 5;
          case 5: n++;
          return[3, 1];
          case 6: return[3, 9];
          case 7: this._vibrateOnCollision();
          h.default.getInstance().emit(g.gameEvent.snakeTouchSnake, e.collisionPos);
          return[4, this.errorAni()];
          case 8: a.sent();
          h.default.getInstance().emit(g.gameEvent.gameFail, this.id);
          a.label = 9;
          case 9: this.bool_moveflag = ! 1;
          return[3, 19];
          case 10: this.snakeState = o.dead;
          this.gameManager.onSnakeDestroyed(this);
          this.node_fuzhuline.opacity = 0;
          if(! 0 !== e.isHeidong) return[3, 15];
          for(n = 0;
          n < this.node_allbody.length;
          n++) {
            i = this.node_allbody[n].getChildByName("show");
            cc.tween(i).to(.2, {
              color: cc.color(61, 83, 183)
            }
).to(.2, {
              color: this.snakeColor
            }
).start();
          }
          n = 0;
          a.label = 11;
          case 11: return n < 200?[4, this.move()]:[3, 14];
          case 12: a.sent();
          a.label = 13;
          case 13: n++;
          return[3, 11];
          case 14: return[3, 19];
          case 15: for(n = 0;
          n < this.node_allbody.length;
          n++) {
            i = this.node_allbody[n].getChildByName("show");
            cc.tween(i).to(.2, {
              color: cc.color(61, 83, 183)
            }
).to(.2, {
              color: this.snakeColor
            }
).start();
          }
          n = 0;
          a.label = 16;
          case 16: return n < 200?[4, this.move()]:[3, 19];
          case 17: a.sent();
          a.label = 18;
          case 18: n++;
          return[3, 16];
          case 19: return[2];
        }
      }
);
    }
);
  }
;
  t.prototype.move = function() {
    return l(this, void 0, void 0, function() {
      var e = this;
      return c(this, function() {
        return[2, new Promise(function(t) {
          return l(e, void 0, void 0, function() {
            var e, i, n, o, r, s, l, u, d, h, p = this;
            return c(this, function() {
              e = this.snakeInfo2.slice();
              i = this.snakeInfo2[0];
              n = i.x;
              o = i.y;
              r = null;
              switch(this.direction) {
                case a.Left: r = {
                  x: n- 1, y: o
                }
;
                break;
                case a.Right: r = {
                  x: n+ 1, y: o
                }
;
                break;
                case a.Up: r = {
                  x: n, y: o+ 1
                }
;
                break;
                case a.Down: r = {
                  x: n, y: o- 1
                }
;
              }
              s = [];
              l = [r].concat(e.slice(0, e.length- 1));
              this.snakeInfo2 = l;
              if((u = this.snakeInfo2[this.snakeInfo2.length- 1])&& this.gameManager.num_mapInfo&& this.gameManager.num_mapInfo[u.x]&& void 0 !== this.gameManager.num_mapInfo[u.x][u.y]) {
                this.gameManager.num_mapInfo[u.x][u.y];
                d = u.y* this.levelInfo.XSize+ u.x;
                h = this.gameManager.Layout_map.node.children[d];
                this.bool_needShowTuowei&& cc.tween(h).to(.2, {
                  scale: 3
                }
).to(.2, {
                  scale: 1
                }
).start();
              }
              this.snakeInfo2.forEach(function(e, t) {
                var i = p.node_allbody[t], n = p.getNodePos(e);
                if(p.gameManager.num_mapInfo&& p.gameManager.num_mapInfo[e.x]&& "o" === p.gameManager.num_mapInfo[e.x][e.y]) {
                  cc.director.once(cc.Director.EVENT_AFTER_UPDATE, function() {
                    i.active = ! 1;
                  }
);
                  t == p.node_allbody.length- 1&& (p.bool_needShowTuowei = ! 1);
                  var a = p.gameManager.heidong.filter(function(t) {
                    return t.posInfo.x === e.x&& t.posInfo.y === e.y;
                  }
);
                  0 === t? a[0].showStartAni(): t === p.node_allbody.length- 1&& a[0].showEndAni();
                }
                s.push(p.moveBody(i, n));
              }
);
              Promise.all(s).then(function() {
                p.action.push(e);
                t();
              }
);
              return[2];
            }
);
          }
);
        }
)];
      }
);
    }
);
  }
;
  t.prototype.getNodePos = function(e) {
    var t = this.node_map.children[0].position;
    return cc.v3(e.x* this.num_movedistance, e.y* this.num_movedistance, 0).addSelf(t);
  }
;
  t.prototype.moveBody = function(e, t) {
    return l(this, void 0, void 0, function() {
      var i = this;
      return c(this, function() {
        return[2, new Promise(function(n) {
          e.setPosition(t);
          i.updateSnakeBody(e);
          cc.director.once(cc.Director.EVENT_AFTER_UPDATE, function() {
            n();
          }
);
        }
)];
      }
);
    }
);
  }
;
  t.prototype.huitui = function() {
    return l(this, void 0, void 0, function() {
      var e, t, i, n = this;
      return c(this, function(a) {
        switch(a.label) {
          case 0: e = function(e) {
            var i, a;
            return c(this, function(o) {
              switch(o.label) {
                case 0: i = [];
                a = t.action[e];
                t.snakeInfo2 = a;
                a.forEach(function(e, t) {
                  var a = n.node_allbody[t], o = n.getNodePos(e);
                  i.push(n.moveBody(a, o));
                }
);
                return[4, Promise.all(i)];
                case 1: o.sent();
                return[2];
              }
            }
);
          }
;
          t = this;
          i = this.action.length- 1;
          a.label = 1;
          case 1: return i >= 0?[5, e(i)]:[3, 4];
          case 2: a.sent();
          a.label = 3;
          case 3: i--;
          return[3, 1];
          case 4: this.action = [];
          return[2];
        }
      }
);
    }
);
  }
;
  t.prototype.updateSnakeBody = function(e) {
    var t,
    i = this.node_allbody.indexOf(e);
    t = this.getBodyType(this.snakeInfo2[i- 1], this.snakeInfo2[i], this.snakeInfo2[i+ 1]);
    this.changeSpr(t, e);
  }
;
  t.prototype._isOwnBody = function(e) {
    return "string" == typeof e&& e.startsWith(this.id+ "_");
  }
;
  t.prototype._vibrateOnCollision = function() {
    var e = p.default.getInstance().vibrateEnabled,
    t = m.default.getInstance().shake;
    console.log("[vibrate] collision trigger, vibrateEnabled="+ e+ " shake="+ t+ " isNative="+ cc.sys.isNative+ " os="+ cc.sys.os);
    if(e&& t) if(cc.sys.isNative&& cc.sys.os === cc.sys.OS_ANDROID) {
      if("undefined" == typeof jsb|| ! jsb.reflection) {
        console.warn("[vibrate] jsb.reflection unavailable");
        return;
      }
      try {
        jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxHelper", "vibrate", "(F)V", .08);
        console.log("[vibrate] android (F)V ok");
        return;
      } catch(e) {
        console.warn("[vibrate] android (F)V failed:", e&& e.message|| e);
      }
      try {
        jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxHelper", "vibrate", "(J)V", 80);
        console.log("[vibrate] android (J)V ok");
        return;
      } catch(e) {
        console.warn("[vibrate] android (J)V failed:", e&& e.message|| e);
      }
      try {
        p.default.getInstance().vibrateShort();
        console.log("[vibrate] android fallback -> MultiPlatform.vibrateShort");
      } catch(e) {
        console.warn("[vibrate] android all paths failed:", e&& e.message|| e);
      }
    } else if(cc.sys.isNative&& cc.sys.os === cc.sys.OS_IOS) try {
      p.default.getInstance().vibrateShort();
      console.log("[vibrate] ios -> MultiPlatform.vibrateShort");
    } catch(e) {
      console.warn("[vibrate] ios failed:", e&& e.message|| e);
    } else try {
      if("undefined" != typeof navigator&& "function" == typeof navigator.vibrate) {
        var i = navigator.vibrate(80);
        console.log("[vibrate] web navigator.vibrate ok="+ i);
      } else {
        p.default.getInstance().vibrateShort();
        console.log("[vibrate] web -> MultiPlatform.vibrateShort (no navigator.vibrate)");
      }
    } catch(e) {
      console.warn("[vibrate] web failed:", e&& e.message|| e);
    }
  }
;
  t.prototype.checkZhanai = function() {
    var e = this.snakeInfo2[0],
    t = e.x,
    i = e.y;
    switch(this.direction) {
      case a.Left: for(var n = t- 1;
      n >= 0;
      n--) if((r = this.gameManager.num_mapInfo&& this.gameManager.num_mapInfo[n]&& this.gameManager.num_mapInfo[n][i])&& "0" !== r&& ! this._isOwnBody(r)) return "o" === r? {
        distance: t- n,
        hasCollision: ! 1,
        collisionPos: {
          x: n,
          y: i
        }
,
        isHeidong: ! 0
      }
:(console.log("向左移动会在("+ n+ ","+ i+ ")遇到障碍物"), {
        distance: t- n- 1, hasCollision: ! 0, collisionPos: {
          x: n, y: i
        }
      }
);
      return {
        distance:- 1,
        hasCollision: ! 1,
        collisionPos: null
      }
;
      case a.Right: for(n = t+ 1;
      n <= this.levelInfo.XSize- 1;
      n++) if((r = this.gameManager.num_mapInfo&& this.gameManager.num_mapInfo[n]&& this.gameManager.num_mapInfo[n][i])&& "0" !== r&& ! this._isOwnBody(r)) return "o" === r? {
        distance: n- t,
        hasCollision: ! 1,
        collisionPos: {
          x: n,
          y: i
        }
,
        isHeidong: ! 0
      }
:(console.log("向右移动会在("+ n+ ","+ i+ ")遇到障碍物"), {
        distance: n- t- 1, hasCollision: ! 0, collisionPos: {
          x: n, y: i
        }
      }
);
      return {
        distance:- 1,
        hasCollision: ! 1,
        collisionPos: null
      }
;
      case a.Up: for(var o = i+ 1;
      o <= this.levelInfo.YSize- 1;
      o++) if((r = this.gameManager.num_mapInfo&& this.gameManager.num_mapInfo[t]&& this.gameManager.num_mapInfo[t][o])&& "0" !== r&& ! this._isOwnBody(r)) return "o" === r? {
        distance: o- i,
        hasCollision: ! 1,
        collisionPos: {
          x: t,
          y: o
        }
,
        isHeidong: ! 0
      }
:(console.log("向上移动会在("+ t+ ","+ o+ ")遇到障碍物"), {
        distance: o- i- 1, hasCollision: ! 0, collisionPos: {
          x: t, y: o
        }
      }
);
      return {
        distance:- 1,
        hasCollision: ! 1,
        collisionPos: null
      }
;
      case a.Down: for(o = i- 1;
      o >= 0;
      o--) {
        var r;
        if((r = this.gameManager.num_mapInfo&& this.gameManager.num_mapInfo[t]&& this.gameManager.num_mapInfo[t][o])&& "0" !== r&& ! this._isOwnBody(r)) return "o" === r? {
          distance: i- o,
          hasCollision: ! 1,
          collisionPos: {
            x: t,
            y: o
          }
,
          isHeidong: ! 0
        }
:(console.log("向下移动会在("+ t+ ","+ o+ ")遇到障碍物"), {
          distance: i- o- 1, hasCollision: ! 0, collisionPos: {
            x: t, y: o
          }
        }
);
      }
      return {
        distance:- 1,
        hasCollision: ! 1,
        collisionPos: null
      }
;
    }
  }
;
  t.prototype.updateSnakePosition = function() {
    for(var e = 0;
    e < this.node_allbody.length;
    e++) {
      var t,
      i = this.node_allbody[e];
      t = this.getBodyType(this.snakeInfo2[e- 1], this.snakeInfo2[e], this.snakeInfo2[e+ 1]);
      this.changeSpr(t, i);
    }
  }
;
  t.prototype.determineDirection = function() {
    if(!(this.snakeInfo2.length < 2)) {
      var e = this.snakeInfo2[0],
      t = this.snakeInfo2[1];
      t.x === e.x+ 1? this.direction = a.Left: t.x === e.x- 1? this.direction = a.Right: t.y === e.y+ 1? this.direction = a.Down: t.y === e.y- 1&& (this.direction = a.Up);
    }
  }
;
  t.prototype.changeSpr_liti = function(e, t) {
    var i = t.getChildByName("show").getComponent(f.default);
    switch(e) {
      case n.头_上: i.setFrameByIndex(9);
      break;
      case n.头_下: i.setFrameByIndex(6);
      break;
      case n.头_左: i.setFrameByIndex(7);
      break;
      case n.头_右: i.setFrameByIndex(8);
      break;
      case n.身体_右右: i.setFrameByIndex(2);
      break;
      case n.身体_下右: i.setFrameByIndex(1);
      break;
      case n.身体_上右: i.setFrameByIndex(3);
      break;
      case n.身体_左左: i.setFrameByIndex(2);
      break;
      case n.身体_下左: i.setFrameByIndex(0);
      break;
      case n.身体_上左: i.setFrameByIndex(4);
      break;
      case n.身体_上上: i.setFrameByIndex(5);
      break;
      case n.身体_右上: i.setFrameByIndex(0);
      break;
      case n.身体_左上: i.setFrameByIndex(1);
      break;
      case n.身体_下下: i.setFrameByIndex(5);
      break;
      case n.身体_右下: i.setFrameByIndex(4);
      break;
      case n.身体_左下: i.setFrameByIndex(3);
      break;
      case n.尾_上: i.setFrameByIndex(13);
      break;
      case n.尾_下: i.setFrameByIndex(10);
      break;
      case n.尾_左: i.setFrameByIndex(11);
      break;
      case n.尾_右: i.setFrameByIndex(12);
      break;
      default: console.error("出错了,请检查");
      i.setFrameByIndex(3);
    }
  }
;
  t.prototype.changeSpr = function(e, t) {
    var i = t.getChildByName("show").getComponent(f.default);
    switch(e) {
      case n.头_上: i.setFrameByIndex(0);
      i.node.angle = 0;
      break;
      case n.头_下: i.setFrameByIndex(0);
      i.node.angle = 180;
      break;
      case n.头_左: i.setFrameByIndex(0);
      i.node.angle = 90;
      break;
      case n.头_右: i.setFrameByIndex(0);
      i.node.angle = - 90;
      break;
      case n.身体_右右: i.setFrameByIndex(2);
      i.node.angle = 90;
      break;
      case n.身体_下右: i.setFrameByIndex(3);
      i.node.angle = 0;
      break;
      case n.身体_上右: i.setFrameByIndex(3);
      i.node.angle = - 90;
      break;
      case n.身体_左左: i.setFrameByIndex(2);
      i.node.angle = 90;
      break;
      case n.身体_下左: i.setFrameByIndex(3);
      i.node.angle = 90;
      break;
      case n.身体_上左: i.setFrameByIndex(3);
      i.node.angle = 180;
      break;
      case n.身体_上上: i.setFrameByIndex(2);
      i.node.angle = 0;
      break;
      case n.身体_右上: i.setFrameByIndex(3);
      i.node.angle = 90;
      break;
      case n.身体_左上: i.setFrameByIndex(3);
      i.node.angle = 0;
      break;
      case n.身体_下下: i.setFrameByIndex(2);
      i.node.angle = 0;
      break;
      case n.身体_右下: i.setFrameByIndex(3);
      i.node.angle = 180;
      break;
      case n.身体_左下: i.setFrameByIndex(3);
      i.node.angle = - 90;
      break;
      case n.尾_上: i.setFrameByIndex(1);
      i.node.angle = 0;
      break;
      case n.尾_下: i.setFrameByIndex(1);
      i.node.angle = 180;
      break;
      case n.尾_左: i.setFrameByIndex(1);
      i.node.angle = 90;
      break;
      case n.尾_右: i.setFrameByIndex(1);
      i.node.angle = - 90;
      break;
      default: console.error("出错了,请检查");
      i.setFrameByIndex(3);
    }
  }
;
  t.prototype.getBodyType = function(e, t, i) {
    if(null === e|| null == e) {
      if(i.x == t.x+ 1) return n.头_左;
      if(i.x == t.x- 1) return n.头_右;
      if(i.y == t.y+ 1) return n.头_下;
      if(i.y == t.y- 1) return n.头_上;
    }
    if(void 0 === i|| null == i) {
      if(e.x == t.x+ 1) return n.尾_右;
      if(e.x == t.x- 1) return n.尾_左;
      if(e.y == t.y+ 1) return n.尾_上;
      if(e.y == t.y- 1) return n.尾_下;
    }
    if(e.x == t.x+ 1) {
      if(i.x == t.x- 1) return n.身体_右右;
      if(i.y == t.y+ 1) return n.身体_下右;
      if(i.y == t.y- 1) return n.身体_上右;
    } else if(e.x == t.x- 1) {
      if(i.x == t.x+ 1) return n.身体_左左;
      if(i.y == t.y+ 1) return n.身体_下左;
      if(i.y == t.y- 1) return n.身体_上左;
    } else if(e.y == t.y+ 1) {
      if(i.y == t.y- 1) return n.身体_上上;
      if(i.x == t.x+ 1) return n.身体_左上;
      if(i.x == t.x- 1) return n.身体_右上;
    } else if(e.y == t.y- 1) {
      if(i.y == t.y+ 1) return n.身体_下下;
      if(i.x == t.x+ 1) return n.身体_左下;
      if(i.x == t.x- 1) return n.身体_右下;
    }
    console.error("出错了,请检查", new Error().stack);
    return null;
  }
;
  t.prototype.showTip = function() {
    for(var e = 0;
    e < this.node_allbody.length;
    e++) {
      var t = this.node_allbody[e];
      this.tipsTween[e]&& this.tipsTween[e].stop();
      this.tipsTween[e] = cc.tween(t.getChildByName("show")).to(.8, {
        color: cc.Color.GREEN
      }
).to(.8, {
        color: this.snakeColor
      }
).union().repeatForever().start();
    }
  }
;
  t.prototype.ShowChange = function() {
    for(var e = this, t = 0;
    t < this.node_allbody.length;
    t++) {
      var i = this.node_allbody[t];
      cc.tween(i).to(.3, {
        opacity: 0
      }
).delay(.3).to(.3, {
        opacity: 255
      }
).start();
    }
    this.scheduleOnce(function() {
      e.node_fuzhuline&& (e.node_fuzhuline.active = ! 1);
      var t = u(e.snakeInfo2).reverse(), i = u(e.node_allbody).reverse();
      e.snakeInfo2 = t;
      e.node_allbody = i;
      for(var n = 0;
      n < e.node_allbody.length;
      n++) {
        var a = e.node_allbody[n], o = e.getNodePos(e.snakeInfo2[n]);
        a.setPosition(o);
        a.getChildByName("show").color = e.snakeColor;
        a.setSiblingIndex(n);
        e.updateSnakeBody(a);
      }
      e.determineDirection();
      if(e.gameManager&& e.gameManager.num_mapInfo) {
        for(var r = 0;
        r < e.levelInfo.XSize;
        r++) for(var s = 0;
        s < e.levelInfo.YSize;
        s++) {
          var l = e.gameManager.num_mapInfo[r][s];
          l&& l.startsWith(e.id+ "_")&& (e.gameManager.num_mapInfo[r][s] = "0");
        }
        for(n = 0;
        n < e.snakeInfo2.length;
        n++) {
          var c = e.snakeInfo2[n];
          e.gameManager.num_mapInfo[c.x][c.y] = e.id+ "_"+ n;
        }
      }
      for(n = 0;
      n < e.node_allbody.length;
      n++) {
(a = e.node_allbody[n]).off(cc.Node.EventType.TOUCH_END, e.touch_end, e);
        a.on(cc.Node.EventType.TOUCH_END, e.touch_end, e);
      }
    }
, .4);
  }
;
  t.prototype.ShowYichu = function() {
    this.snakeState = o.dead;
    this.gameManager.onSnakeDestroyed(this);
    for(var e = function(e) {
      var i = t.node_allbody[e];
      i.off(cc.Node.EventType.TOUCH_END, t.touch_end, t);
      cc.tween(i).to(.2, {
        opacity: 0
      }
).to(.2, {
        opacity: 255
      }
).to(.2, {
        opacity: 0
      }
).to(.2, {
        opacity: 255
      }
).to(.2, {
        opacity: 0
      }
).call(function() {
        i.x = 9999;
        i.active = ! 1;
      }
).start();
    }
, t = this, i = 0;
    i < this.node_allbody.length;
    i++) e(i);
    this.node_fuzhuline&& (this.node_fuzhuline.x = 9999);
  }
;
  t.prototype.ShowFuzhuline = function() {
    this.node_fuzhuline&& (this.node_fuzhuline.active = ! 0);
  }
;
  t.prototype.CloseFuzhuLine = function() {
    this.node_fuzhuline&& (this.node_fuzhuline.active = ! 1);
  }
;
  t.prototype.ShowFuzhuline2 = function() {
    null == this.node_fuzhuline&& null == this.node_fuzhuline|| 1 == this.node_fuzhuline.active&& (this.node_fuzhuline.active = ! 1);
    var e = cc.instantiate(this.gameManager.node_fuzhuline);
    e.parent = this.node.parent;
    var t = this.node_allbody[0].convertToWorldSpaceAR(cc.v2(0, 0)),
    i = this.node.parent.convertToNodeSpaceAR(t);
    e.setPosition(i);
    e.setSiblingIndex(0);
    switch(this.direction) {
      case a.Left: e.angle = 90;
      break;
      case a.Right: e.angle = - 90;
      break;
      case a.Up: e.angle = 0;
      break;
      case a.Down: e.angle = 180;
    }
    e.active = ! 1;
    this.node_fuzhuline = e;
  }
;
  t.prototype.CloseFuzhuline = function() {
    null == this.node_fuzhuline&& null == this.node_fuzhuline|| 1 == this.node_fuzhuline.active&& (this.node_fuzhuline.active = ! 1);
  }
;
  t.prototype.showPengzhuan = function() {
    for(var e = 0;
    e < this.node_allbody.length;
    e++) {
      var t = this.node_allbody[e].getChildByName("show");
      cc.tween(t).delay(.2).to(.2, {
        color: this.color_red
      }
).to(.2, {
        color: this.snakeColor
      }
).start();
    }
  }
;
  return s([b], t);
}
(cc.Component);
i.default = w;
(function(e) {
  e[e["头_上"] = 0] = "头_上";
  e[e["头_下"] = 1] = "头_下";
  e[e["头_左"] = 2] = "头_左";
  e[e["头_右"] = 3] = "头_右";
  e[e["身体_右右"] = 4] = "身体_右右";
  e[e["身体_下右"] = 5] = "身体_下右";
  e[e["身体_上右"] = 6] = "身体_上右";
  e[e["身体_左左"] = 7] = "身体_左左";
  e[e["身体_下左"] = 8] = "身体_下左";
  e[e["身体_上左"] = 9] = "身体_上左";
  e[e["身体_上上"] = 10] = "身体_上上";
  e[e["身体_右上"] = 11] = "身体_右上";
  e[e["身体_左上"] = 12] = "身体_左上";
  e[e["身体_下下"] = 13] = "身体_下下";
  e[e["身体_右下"] = 14] = "身体_右下";
  e[e["身体_左下"] = 15] = "身体_左下";
  e[e["尾_上"] = 16] = "尾_上";
  e[e["尾_下"] = 17] = "尾_下";
  e[e["尾_左"] = 18] = "尾_左";
  e[e["尾_右"] = 19] = "尾_右";
  e[e["西北"] = 20] = "西北";
  e[e["东北"] = 21] = "东北";
  e[e["西南"] = 22] = "西南";
  e[e["东南"] = 23] = "东南";
}
)(n = i.Bodyparts|| (i.Bodyparts = {
}
));
(function(e) {
  e[e.Up = 0] = "Up";
  e[e.Down = 1] = "Down";
  e[e.Left = 2] = "Left";
  e[e.Right = 3] = "Right";
}
)(a = i.Direction|| (i.Direction = {
}
));
(function(e) {
  e[e.norlmal = 0] = "norlmal";
  e[e.dead = 1] = "dead";
}
)(o = i.snakeState|| (i.snakeState = {
}
));
cc._RF.pop();
