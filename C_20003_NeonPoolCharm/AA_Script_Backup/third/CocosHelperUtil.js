let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "16f6eA/SItFYKCzY1SfY38K", "CocosHelperUtil");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = function () {
      function e() {}
      e.GetComponent = function (e, t) {
        var o = null,
          n = e.node ? e.node : e;
        n && ((o = n.getComponent(t)) || (o = n.getComponentInChildren(t)));
        return o;
      };
      e.GotoScene = function (t, o) {
        var n = !1;
        if (t && e.GetCurSceneName() != t) {
          cc.log("go to scene: " + t);
          n = cc.director.loadScene(t, o);
        }
        return n;
      };
      e.GetLabelString = function (e) {
        var t = "";
        e && e instanceof cc.Label && (t = e.string);
        return t;
      };
      e.ScaleTo = function (e, t, o, n) {
        if (e) {
          var i = e.node ? e.node : e;
          if (i) {
            var a = cc.scaleTo(o, t);
            n ? i.runAction(cc.sequence(a, cc.callFunc(function () {
              n();
            }, this))) : i.runAction(a);
          }
        }
      };
      e.PreloadScene = function (e, t) {
        e && cc.director.preloadScene(e, function (e) {
          t && t(e);
        });
      };
      e.SetText = function (e, t) {
        if (e && null != t) {
          t = "" + t;
          e.string = t;
        }
      };
      e.GetChildByName = function (t, o, n) {
        var i = t.node ? t.node : t,
          a = null;
        if (i && o) {
          a = i.getChildByName(o);
          if (n && !a) for (var r = i.children, l = i.childrenCount, s = 0; s < l && !(a = e.GetChildByName(r[s], o, n)); ++s);
        }
        return a;
      };
      e.SetOpaque = function (e, t) {
        e && (e.node ? e.node.opacity = t : e.opacity && (e.opacity = t));
      };
      e.GetRotation = function (e, t) {
        t || (t = cc.v2(0, 0));
        e && (t = e.node ? e.node.getRotation() : e.getRotation());
        return t;
      };
      e.DegreesToRadians = function (e) {
        return cc.misc.degreesToRadians(e);
      };
      e.Emit = function () {};
      e.SetColor = function (e, t) {
        e && t && e.color && (e.color = t);
      };
      e.SetButtonEnabled = function (e, t) {
        e && e instanceof cc.Node && (e = e.getComponent(cc.Button));
        if (e && e instanceof cc.Button) {
          t = !!t;
          e.enableAutoGrayEffect = !0;
          e.interactable = t;
        }
      };
      e.RadiansToDegrees = function (e) {
        return cc.misc.radiansToDegrees(e);
      };
      e.SetVisible = function (e, t) {
        e && (e.node ? e.node.opacity = t ? 255 : 0 : e.opacity && (e.opacity = t ? 255 : 0));
      };
      e.IsPausedGame = function () {
        return cc.game.isPaused();
      };
      e.MoveTo = function (t, o, n, i, a) {
        if (t) {
          var r = t.node ? t.node : t;
          if (r) {
            o && e.SetPos(r, o.x, o.y);
            var l = cc.moveTo(i, n);
            a ? r.runAction(cc.sequence(l, cc.callFunc(function () {
              a();
            }, this))) : r.runAction(l);
          }
        }
      };
      e.GetComponentsInChildren = function (e, t, o, n) {
        var i = [],
          a = e.node ? e.node : e;
        if (a) if (o) {
          if (n) i = a.getComponentsInChildren(t);else {
            (u = a.getComponent(t)) && i.push(u);
            for (var r = (s = a.children).length, l = 0; l < r; l++) (u = (c = s[l]).getComponent(t)) && i.push(u);
          }
        } else {
          var s;
          r = (s = a.children).length;
          if (n) for (l = 0; l < r; l++) {
            var c = s[l];
            i = i.concat(c.getComponentsInChildren(t));
          } else for (l = 0; l < r; l++) {
            var u;
            (u = (c = s[l]).getComponent(t)) && i.push(u);
          }
        }
        return i;
      };
      e.SetScaleY = function (e, t) {
        e && (e.node ? e.node.setScaleY(t) : e.setScaleY(t));
      };
      e.EventHandlerEmitWithReturn = function (e) {
        for (var t = [], o = 1; o < arguments.length; o++) t[o - 1] = arguments[o];
        if (e && e instanceof cc.Component.EventHandler && e.target) {
          var n = e.target;
          if (!cc.isValid(n)) return;
          var i = n.getComponent(e.component);
          if (!cc.isValid(i)) return;
          var a = i[e.handler];
          if ("function" != typeof a) return;
          var r = t || [];
          null != e.customEventData && "" !== e.customEventData && (r = r.slice()).push(e.customEventData);
          return a.apply(i, r);
        }
      };
      e.SetSize = function (e, t, o) {
        e && void 0 !== t && void 0 !== o && (e.node ? e.node.setContentSize(t, o) : e.setContentSize(t, o));
      };
      e.GetCurSceneName = function () {
        return cc.director.getScene().name;
      };
      e.PauseGame = function () {
        cc.game.pause();
      };
      e.SetScale = function (e, t) {
        e && (e.node ? e.node.setScale(t) : e.setScale(t));
      };
      e.ChangeSpriteFrame = function (e, t) {
        e instanceof cc.Sprite && t instanceof cc.SpriteFrame && (e.spriteFrame = t);
      };
      e.SetActive = function (e, t) {
        if (e) {
          t = !!t;
          e instanceof cc.Component ? e.isValid && e.node && e.node.active != t && (e.node.active = t) : e.isValid && e.active != t && (e.active = t);
        }
      };
      e.ExitGame = function () {
        if (cc.sys.isBrowser) {
          window.history.back();
          window.close();
        } else cc.game.end();
      };
      e.SetRotation = function (e, t, o) {
        e && (e.node ? e.node.setRotation(t, o) : e.setRotation(t, o));
      };
      e.Instantiate = function (e, t, o) {
        var n = null;
        if (e) {
          var i = cc.instantiate(e);
          if (i) {
            n = o ? null != (n = i.getComponent(o)) ? n : i.addComponent(o) : i;
            t && (t.node ? t.node.addChild(i) : t.addChild(i));
          }
        }
        return n;
      };
      e.PauseDirector = function () {
        cc.director.pause();
      };
      e.GetSpriteFrameName = function (e) {
        var t = "";
        e && e instanceof cc.Sprite && e.spriteFrame && (t = e.spriteFrame.name);
        return t;
      };
      e.StopAllActions = function (e) {
        if (e) {
          var t = e.node ? e.node : e;
          t && t.stopAllActions();
        }
      };
      e.SetEnable = function (e, t) {
        if (e) {
          t = !!t;
          e.enabled != t && (e.enabled = t);
        }
      };
      e.SetPos = function (e, t, o) {
        e && (e instanceof cc.Component ? e.node.setPosition(t, o) : e.setPosition(t, o));
      };
      e.SetFrameRate = function (e) {
        cc.game.setFrameRate(e);
      };
      e.ChangeParent = function (e, t) {
        if (e.parent != t) {
          var o = function (e) {
              var t = e,
                o = t.rotation;
              do {
                o += (t = t.parent).rotation;
              } while (null != t.pageView);
              return o % 360;
            },
            n = o(e) - o(t),
            i = e.convertToWorldSpaceAR(cc.v2(0, 0)),
            a = t.convertToNodeSpaceAR(i);
          e.parent = t;
          e.position = a;
          e.rotation = n;
        }
      };
      e.ResumeDirector = function () {
        cc.director.resume();
      };
      e.SetPageViewEnable = function (e, t) {
        e && (t ? e.node.on(cc.Node.EventType.TOUCH_MOVE, e._onTouchMoved, e.node, !0) : e.node.off(cc.Node.EventType.TOUCH_MOVE, e._onTouchMoved, e.node, !0));
      };
      e.GetPos = function (e, t) {
        t || (t = cc.v2(0, 0));
        e && (t = e.node ? e.node.getPosition() : e.getPosition());
        return t;
      };
      e.IsPausedDirector = function () {
        return cc.director.isPaused();
      };
      e.SetScaleX = function (e, t) {
        e && (e.node ? e.node.setScaleX(t) : e.setScaleX(t));
      };
      e.ResumeGame = function () {
        cc.game.resume();
      };
      return e;
    }();
    o.default = n;
    cc._RF.pop();
