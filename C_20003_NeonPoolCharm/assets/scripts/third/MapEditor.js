let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "8d1d3XEwk9KabUKvDWoFJVD", "MapEditor");
    var n,
      i = this && this.__extends || (n = function (e, t) {
        return (n = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        })(e, t);
      }, function (e, t) {
        n(e, t);
        function o() {
          this.constructor = e;
        }
        e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
      }),
      a = this && this.__decorate || function (e, t, o, n) {
        var i,
          a = arguments.length,
          r = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (r = (a < 3 ? i(r) : a > 3 ? i(t, o, r) : i(t, o)) || r);
        return a > 3 && r && Object.defineProperty(t, o, r), r;
      };
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var r = e("UiManage.js"),
      l = e("List.js"),
      s = e("EngineUtil.js"),
      c = e("ConfigDataSys.js"),
      u = e("BallEditor.js"),
      p = e("FileMgr.js"),
      d = e("BallLogicMgr.js"),
      _ = cc._decorator,
      f = _.ccclass,
      h = _.property,
      g = (cc._decorator, function (t) {
        i(o, t);
        function o() {
          var e = null !== t && t.apply(this, arguments) || this;
          e.LevelEditBox = null;
          e.TabelEditBox = null;
          e.PosXEditBox = null;
          e.PosYEditBox = null;
          e.ballPosNode = null;
          e.ball = null;
          e.shadow_prefab = null;
          e.ballParent = null;
          e.shadow_container = null;
          e.camera2D = null;
          e.camera3D = null;
          e.SelectionBox = null;
          e.jsonArr = [];
          e.list = null;
          e.ballID = 0;
          e.SelectedCards = [];
          e.addNum = 1;
          e.json = null;
          return e;
        }
        n = o;
        o.prototype.onCopyCardBtnClick = function () {
          var e = this;
          if (0 !== this.SelectedCards.length) {
            var t = [];
            this.SelectedCards.forEach(function (o) {
              var n = cc.instantiate(o.node);
              n.Ball_id = o.node.Ball_id;
              e.ballParent.addChild(n);
              n.setPosition(n.x + 10, n.y);
              var i = n.getComponent(u.default);
              i.SetSelect(!0);
              t.push(i);
            });
            this.clearSelection();
            this.SelectedCards = t;
          }
        };
        o.prototype.clearSelection = function () {
          this.SelectedCards.forEach(function (e) {
            e.SetSelect(!1);
          });
          this.SelectedCards = [];
        };
        o.prototype.onNewBall = function () {
          var e = {
            x: 0,
            y: 40 * this.ballID,
            ballID: this.ballID
          };
          this.createBall(e);
        };
        o.prototype.onSelet = function (e, t) {
          var o = this,
            n = this.jsonArr[t].json;
          console.log("onSelet", t, n);
          this.clearSelection();
          var i = Math.floor(15 * Math.random()) + 1;
          n.balls.forEach(function (e) {
            e.ballID = i;
            var t = o.createBall(e, !1),
              n = t.getComponent(u.default);
            t.Ball_id = i;
            o.SelectedCards.push(n);
            n.SetSelect(!0);
          });
        };
        o.prototype.createBall = function (e, t) {
          void 0 === t && (t = !0);
          console.log("create", e);
          var o = cc.instantiate(this.ball);
          o.name = "3DBall_" + e.ballID;
          this.ballParent.addChild(o);
          o.getComponent(u.default).setMatIdx(0 == e.ballID ? 0 : e.ballID + 1);
          o.x = e.x;
          o.y = e.y;
          if (t) {
            this.clearSelection();
            var n = o.getComponent(u.default);
            this.SelectedCards.push(n);
            n.SetSelect(!0);
            this.ballID++;
          }
          return o;
        };
        o.prototype.onListRender = function (e, t) {
          console.log(t);
          e.getComponentInChildren(cc.Label).string = this.jsonArr[t].name;
        };
        o.prototype.onPlayBtnClick = function () {
          console.log("onPlayBtnClick");
          n.PlayMode = !0;
          e("BallLogicMgr.js");
          var t = this.CreateJson();
          n.PlayJson = t;
          var o = JSON.parse(t);
          d.isModifyBallDir = "1" == c.default.global_ConfigMap.get("easyball_on");
          var i = Number(c.default.global_ConfigMap.get("easyball_num")) || 20;
          d.ballDirModifyThreshold = i / 180 * Math.PI;
          console.log("isModifyBallDir", d.isModifyBallDir, "ballDirModifyThreshold", i);
          d.gotoEditor(o);
        };
        o.prototype.onExportBtnClick = function () {
          console.log("onExportBtnClick");
          this.json = this.CreateJson();
          var e = "a_" + this.LevelEditBox.string + ".json";
          p.default.downloadFile(this.json, e);
        };
        o.prototype.CreateJson = function () {
          var e = {};
          e.table_key = this.TabelEditBox.string;
          var t = [];
          e.balls = t;
          var o = 0;
          this.ballParent.children.forEach(function (e) {
            var n;
            n = e.Ball_id ? e.Ball_id : o++;
            var i = {
              x: e.x,
              y: e.y,
              ballID: n
            };
            t.push(i);
          });
          var n = JSON.stringify(e);
          console.log(n);
          return n;
        };
        o.prototype.onSetPos = function () {
          if (this.SelectedCards.length) {
            var e = Number(this.PosXEditBox.string) || 0,
              t = Number(this.PosYEditBox.string) || 0;
            this.SelectedCards[0].node.x = e;
            this.SelectedCards[0].node.y = t;
          }
        };
        o.prototype.onShowPos = function () {
          if (this.SelectedCards.length) {
            this.PosXEditBox.string = this.SelectedCards[0].node.x.toString();
            this.PosYEditBox.string = this.SelectedCards[0].node.y.toString();
          }
        };
        o.prototype.addEvent = function () {
          var e = this,
            t = cc.find("plane_table", this.node).getChildByName("table_touch"),
            o = (t.getBoundingBox(), t.getBoundingBoxToWorld()),
            n = cc.v2(o.xMax, o.yMax),
            i = cc.v2(o.xMin, o.yMin),
            a = this.camera3D.getWorldToScreenPoint(n),
            r = this.camera3D.getWorldToScreenPoint(i),
            l = a.x - r.x,
            s = a.y - r.y,
            c = new cc.Rect(r.x, r.y, l, s),
            p = function (e) {
              var o = e.sub(c.center),
                n = o.x / (l / 2) * t.width / 2,
                i = o.y / (s / 2) * t.height / 2;
              return cc.v2(n, i);
            },
            d = [];
          t.childrenCount > 0 && t.children.forEach(function (e) {
            var t = e.getComponent(cc.PolygonCollider);
            t ? d.push({
              type: 1,
              value: t.points
            }) : d.push({
              type: 0,
              value: e.getBoundingBox()
            });
          });
          d.length;
          t.on(cc.Node.EventType.TOUCH_START, function (t) {
            if (e.ctrlOrCmdPressed) {
              e.startTouchPos = p(t.getLocation());
              e.SelectionBox.setPosition(e.startTouchPos);
              e.SelectionBox.width = 0;
              e.SelectionBox.height = 0;
              e.SelectionBox.active = !0;
            } else {
              var o = e.camera3D.getRay(t.getLocation()),
                n = cc.geomUtils.intersect.raycast(e.ballParent, o, null, e.filterCard);
              console.log(n);
              if (n && n.length > 0) {
                var i = n[0].node.getComponent(u.default);
                e.clearSelection();
                i.SetSelect(!0);
                e.SelectedCards.push(i);
              } else e.clearSelection();
            }
          }, this);
          t.on(cc.Node.EventType.TOUCH_MOVE, function (t) {
            if (e.ctrlOrCmdPressed) {
              var o = p(t.getLocation()),
                n = Math.min(e.startTouchPos.x, o.x),
                i = Math.min(e.startTouchPos.y, o.y),
                a = Math.max(e.startTouchPos.x, o.x),
                r = Math.max(e.startTouchPos.y, o.y);
              e.SelectionBox.setPosition(n + (a - n) / 2, i + (r - i) / 2);
              e.SelectionBox.width = a - n;
              e.SelectionBox.height = r - i;
            } else {
              var l = p(t.getLocation());
              e.SelectedCards.length > 0 && (e.SelectedCards[0].node.position = cc.v3(Math.floor(l.x), Math.floor(l.y), 0));
            }
          }, this);
          t.on(cc.Node.EventType.TOUCH_END, function () {
            if (e.ctrlOrCmdPressed) {
              var t = e.SelectionBox.getBoundingBoxToWorld();
              e.clearSelection();
              e.ballParent.children.forEach(function (o) {
                var n = o.getComponent(u.default);
                if (n) {
                  var i = o.getBoundingBoxToWorld();
                  if (cc.Intersection.rectRect(t, i)) {
                    e.SelectedCards.push(n);
                    n.SetSelect(!0);
                  }
                }
              });
              e.SelectionBox.active = !1;
            }
          });
        };
        o.prototype.changeTable = function (e) {
          return __awaiter(this, void 0, void 0, function () {
            var t, o, n;
            return __generator(this, function (i) {
              switch (i.label) {
                case 0:
                  t = "prefabs/tables/table_" + e;
                  return [4, r.UiManager.loaderPrefabInDeepPath(t)];
                case 1:
                  if (!(o = i.sent())) {
                    s.default.showManageViewToast("table " + e + " not found");
                    return [2];
                  }
                  n = cc.instantiate(o);
                  this.addTableNode(n);
                  this.TabelEditBox.string = e;
                  return [2];
              }
            });
          });
        };
        o.prototype.loadMap = function (e) {
          return __awaiter(this, void 0, void 0, function () {
            var t,
              o = this;
            return __generator(this, function (n) {
              switch (n.label) {
                case 0:
                  t = JSON.parse(e);
                  this.onClear(null, !0);
                  return [4, this.changeTable(t.table_key)];
                case 1:
                  n.sent();
                  t.balls.forEach(function (e) {
                    o.createBall(e).Ball_id = e.ballID;
                  });
                  return [2];
              }
            });
          });
        };
        o.prototype.start = function () {
          return __awaiter(this, void 0, void 0, function () {
            var e, t;
            return __generator(this, function () {
              console.log(this.jsonArr);
              this.list.numItems = this.jsonArr.length;
              this.SelectionBox.active = !1;
              e = cc.winSize;
              console.log("design size", e);
              t = e.height / e.width;
              console.log("ratio", t);
              t > 2 && (cc.find("Camera3D", this.node).z *= 1.225);
              cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
              cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
              if (n.PlayJson) this.loadMap(n.PlayJson);else {
                this.changeTable("0_1");
                this.onClear(null, !1);
              }
              return [2];
            });
          });
        };
        o.prototype.filterCard = function (e) {
          return null != e.getComponent(u.default);
        };
        o.prototype.addTableNode = function (e) {
          var t = cc.find("plane_table", this.node),
            o = t.getChildByName("table_layers");
          o.removeAllChildren(!0);
          var n = e.getChildByName("plane_table"),
            i = n.getChildByName("table_layers").getChildByName("table");
          i.setParent(o);
          i.setPosition(cc.Vec2.ZERO);
          var a = t.getChildByName("table_touch");
          t.removeChild(a, !0);
          var r = n.getChildByName("table_touch");
          r.setParent(t);
          r.setPosition(cc.Vec2.ZERO);
          var l = cc.find("zhuo_pengzhuang", this.node);
          l.removeAllChildren(!0);
          var s = e.getChildByName("zhuo_pengzhuang").getChildByName("pengzhuang_root");
          s.setParent(l);
          s.setPosition(cc.Vec2.ZERO);
          this.addEvent();
        };
        o.prototype.onClear = function (e, t) {
          void 0 === e && (e = null);
          void 0 === t && (t = !1);
          this.ballParent.removeAllChildren();
          this.shadow_container.removeAllChildren();
          this.ballID = 0;
          t || this.createBall({
            x: 0,
            y: 0,
            ballID: 0
          });
        };
        o.prototype.onImportBtnClick = function () {
          var e = this;
          console.log("导入关卡");
          p.default.readJsonFile(function (t, o) {
            console.log("导入关卡", o, t);
            e.LevelEditBox.string = o.split(".")[0];
            "string" == typeof t && e.loadMap(t);
          });
        };
        o.prototype.onKeyUp = function (e) {
          switch (e.keyCode) {
            case cc.macro.KEY.ctrl:
            case cc.macro.KEY.space:
              this.ctrlOrCmdPressed = !1;
              break;
            case cc.macro.KEY.shift:
              this.addNum = 1;
          }
        };
        o.prototype.onKeyDown = function (e) {
          var t = this;
          switch (e.keyCode) {
            case cc.macro.KEY.w:
              this.SelectedCards.forEach(function (e) {
                return e.node.setPosition(e.node.x, e.node.y + t.addNum);
              });
              break;
            case cc.macro.KEY.s:
              this.SelectedCards.forEach(function (e) {
                return e.node.setPosition(e.node.x, e.node.y - t.addNum);
              });
              break;
            case cc.macro.KEY.a:
              this.SelectedCards.forEach(function (e) {
                return e.node.setPosition(e.node.x - t.addNum, e.node.y);
              });
              break;
            case cc.macro.KEY.d:
              this.SelectedCards.forEach(function (e) {
                return e.node.setPosition(e.node.x + t.addNum, e.node.y);
              });
              break;
            case cc.macro.KEY.x:
            case cc.macro.KEY.Delete:
            case cc.macro.KEY.backspace:
              this.SelectedCards.forEach(function (e) {
                t.ballParent.removeChild(e.node);
              });
              break;
            case cc.macro.KEY.f:
              this.onCopyCardBtnClick();
              break;
            case cc.macro.KEY.ctrl:
              this.ctrlOrCmdPressed = !0;
            case cc.macro.KEY.space:
              break;
            case cc.macro.KEY.shift:
              this.addNum = 10;
          }
        };
        o.prototype.onTableChangeBtnClick = function () {
          var e = this.TabelEditBox.string;
          this.changeTable(e);
        };
        var n;
        o.PlayMode = !1;
        a([h(cc.EditBox)], o.prototype, "LevelEditBox", void 0);
        a([h(cc.EditBox)], o.prototype, "TabelEditBox", void 0);
        a([h(cc.EditBox)], o.prototype, "PosXEditBox", void 0);
        a([h(cc.EditBox)], o.prototype, "PosYEditBox", void 0);
        a([h(cc.Prefab)], o.prototype, "ballPosNode", void 0);
        a([h(cc.Prefab)], o.prototype, "ball", void 0);
        a([h(cc.Prefab)], o.prototype, "shadow_prefab", void 0);
        a([h(cc.Node)], o.prototype, "ballParent", void 0);
        a([h(cc.Node)], o.prototype, "shadow_container", void 0);
        a([h(cc.Camera)], o.prototype, "camera2D", void 0);
        a([h(cc.Camera)], o.prototype, "camera3D", void 0);
        a([h(cc.Node)], o.prototype, "SelectionBox", void 0);
        a([h([cc.JsonAsset])], o.prototype, "jsonArr", void 0);
        a([h(l.default)], o.prototype, "list", void 0);
        return n = a([f], o);
      }(cc.Component));
    o.default = g;
    cc._RF.pop();
