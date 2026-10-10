let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "e6b61+LTX9H/ahhrVIhkEwf", "Ball2DControl");
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
    var r = e("GlobalConfig.js"),
      l = e("WSCMD.js"),
      s = e("SdkHelper.js"),
      c = e("EventMgr.js"),
      u = e("GameEventType.js"),
      p = e("ConfigDataMgr.js"),
      d = e("BallLogicMgr.js"),
      _ = cc._decorator,
      f = _.ccclass,
      h = _.property,
      g = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.ballID = 0;
          t.ball3D = null;
          t.aimTargetUUID = null;
          t.accele_power = null;
          t.state = null;
          t.dir = null;
          t.isAutoPlaying = null;
          t.stopCallback = null;
          t.sensor_value = null;
          t.accele_dir = null;
          t.last_vel_angle = null;
          t.tooSmallIdx = null;
          t.colliderCount = null;
          t._defaultLinearDamping = null;
          t.accele_power_div = null;
          t.accele_negOrPos_xx = null;
          t.accele_negOrPos_xy = null;
          t.accele_negOrPos_yx = null;
          t.accele_negOrPos_yy = null;
          t._destroyCB = null;
          return t;
        }
        t.prototype.isOnDeapMoving = function () {
          return "moving" == this.state || "on_destroy" == this.state || "on_destroy_roll" == this.state;
        };
        t.prototype.isTooSmallV = function (e) {
          return e.len() < 11;
        };
        t.prototype.doModifyMoveDir = function (e) {
          if (e && 0 != e.len()) {
            var t = this.node.getComponent(cc.RigidBody),
              o = t.linearVelocity.len();
            e = e.normalize();
            t.linearVelocity = e.mul(o);
          }
        };
        t.prototype.todoAfterStop = function () {
          this.node.parent && this.stopCallback && !this.isOnDestroy() && this.stopCallback(this.ballID);
        };
        t.prototype.onEnable = function () {};
        t.prototype.onPropUsedStateChanged = function (e) {
          e.prop_type == p.ETaiQiuPropType.E_BaiQiu && this.showBaiQiuEffect(e.state);
        };
        t.prototype.sendOnePack = function (e, t) {
          t = t || 0;
          e = e || l.BallMove;
          var o = this.node.getComponent(cc.RigidBody);
          return 0 != t ? {
            cmd: e,
            ballID: this.ballID,
            time: new Date().getTime(),
            x: this.node.x,
            y: this.node.y,
            vx: 0,
            vy: 0
          } : {
            cmd: e,
            ballID: this.ballID,
            time: new Date().getTime(),
            x: this.node.x,
            y: this.node.y,
            vx: o.linearVelocity.x,
            vy: o.linearVelocity.y
          };
        };
        t.prototype.doDestroyTween = function (e, t, o) {
          var n = this;
          this.state = "on_destroy";
          this.node.group = "qiudai_ball";
          this.ball3D.group = "qiudai_ball";
          this.node.getComponent(cc.PhysicsCircleCollider).restitution = .3;
          this.node.getComponent(cc.PhysicsCircleCollider).apply();
          this.accele_power = 0;
          this.accele_dir = null;
          this.last_vel_angle = null;
          if (t) {
            var i = t.children[0].convertToWorldSpaceAR(cc.Vec2.ZERO);
            this._rollTargetNodeWP = i;
            this._destroyCB = o;
          } else this._destroyCB = null;
          if (t) cc.v2(t.x, t.y), this.ball3D;else {
            this.state = "on_destroy_roll";
            cc.tween(this.ball3D).to(.5, {
              scale: 0
            }).call(function () {
              console.log("All tweens finished.");
              n.state = "none";
              n.colliderCount = 0;
              o();
            }).start();
          }
        };
        t.prototype.isBaiQiuEffectActive = function () {
          var e = this.ball3D.getChildByName("baiqiu_sp_effect");
          return e && e.active;
        };
        t.prototype.onDisable = function () {
          this.showBaiQiuEffect(!1);
        };
        t.prototype.getVelMag = function (e) {
          return cc.Vec2.mag(e);
        };
        t.prototype.isAcceleDirValid = function () {
          return this.colliderCount > 0 && this.accele_dir && (0 != this.accele_dir.x || 0 != this.accele_dir.y || 0 != this.accele_dir.z);
        };
        t.prototype.resetWhiteBallPos = function () {
          this.state = "resetWhiteBallPos";
          this.ball3D.scale = 1;
        };
        t.prototype.isOnDestroy = function () {
          return "on_destroy" == this.state || "on_destroy_roll" == this.state;
        };
        t.prototype.isMoving = function () {
          return "moving" == this.state;
        };
        t.prototype.ballWillBeDestroy = function (e) {
          e || !this.isAutoPlaying && this.isInPVPBattle() || this.isInMe_Editing();
        };
        t.prototype.onPreSolve = function (e, t, o) {
          var n = o.node.getComponent("Ball2DControl");
          if (this.ballID != r.ID_WHITEBALL && n) {
            if (e.disabled) {
              t.body.linearVelocity = cc.Vec2.ZERO;
              e.disabled = !1;
              return;
            }
            if (e.aimTargetUUID && e.aimTargetUUID == this.node.uuid) {
              var i = n.aimZheXian ? n.aimZheXian.normalize() : null,
                a = cc.v2(this._onBeginContactLinearVelocityOther),
                l = cc.v2(e.getWorldManifold().normal).normalizeSelf().rotateSelf(Math.PI),
                s = i ? i.angle(a) : l.angle(a);
              t.body.linearVelocity.len();
              if (s > 1.3 && t.body.linearVelocity.len() < 30) {
                t.body.linearVelocity = i ? i.mul(30) : l.mul(30);
                t.body.linearVelocity.len();
              }
            }
          }
        };
        t.prototype.isInPVPBattle = function () {
          return !1;
        };
        t.prototype.setRadMove = function (e, t) {
          this.accele_power = t || 1;
          this.accele_power < 1 && (this.accele_power = 1);
          this.accele_power > 100 && (this.accele_power = 100);
          this.accele_power = 1.1 * this.accele_power;
          var o = d.getParam("speed_power_reduce");
          this.accele_power_div = o;
          var n = e;
          this.accele_dir = n;
          this.accele_negOrPos_xx = null;
          this.accele_negOrPos_xy = null;
          this.accele_negOrPos_yx = null;
          this.accele_negOrPos_yy = null;
          this.last_vel_angle = null;
        };
        t.prototype.isInMe_Editing = function () {
          return d.MODE.ME_Editing == d.game_mode;
        };
        t.prototype.getBallType = function () {
          return Math.floor(this.ballID / 100);
        };
        t.prototype.rollToQiuDai = function () {
          var e = this;
          this.sensor_value = !1;
          this.node.getComponent(cc.PhysicsCircleCollider).enabled = this.sensor_value;
          this.node.group = "destroy";
          this.ball3D.group = "destroy";
          this.ball3D.children.forEach(function (e) {
            e.group = "destroy";
          });
          this.node.getComponent(cc.PhysicsCircleCollider).restitution = 0;
          this.node.getComponent(cc.PhysicsCircleCollider).apply();
          this.ball3D.children[0].getComponent("3D_ballRoll").setShowShadow(!1);
          var t = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO),
            o = this._rollTargetNodeWP.sub(t).normalizeSelf().mul(110).add(this.node.getPosition());
          cc.tween(this.node).to(1, {
            position: o
          }).call(function () {
            e.state = "none";
            e.colliderCount = 0;
            e._destroyCB && e._destroyCB();
            e._destroyCB = null;
          }).start();
        };
        t.prototype.onLoad = function () {
          this.state = "none";
          this.dir = 0;
          this.isAutoPlaying = !1;
          this.stopCallback = this.stopCallback || null;
          this.sensor_value = !1;
          this.accele_dir = null;
          this.last_vel_angle = null;
          this.tooSmallIdx = 0;
          this.colliderCount = 0;
          this._defaultLinearDamping = this.node.getComponent(cc.RigidBody).linearDamping;
        };
        t.prototype.update = function () {
          var e = this.node.getComponent(cc.RigidBody);
          "moving" == this.state && (e.linearVelocity.len() < 100 ? e.linearDamping == this._defaultLinearDamping && (e.linearDamping = this._defaultLinearDamping * (e.linearVelocity.len() < 80 ? 4 : 3)) : e.linearDamping != this._defaultLinearDamping && (e.linearDamping = this._defaultLinearDamping));
          if ("resetWhiteBallPos" == this.state) {
            this.state = "none";
            this.colliderCount = 0;
            this.node.x = -180;
            this.node.y = -180;
          }
          if ("on_destroy" != this.state) {
            if (!this.isOnDestroy()) if (0 != e.linearVelocity.x || 0 != e.linearVelocity.y || this.accele_dir) {
              if ("moving" == this.state || this.isOnDestroy()) {
                var t;
                ((t = 0 == e.linearVelocity.x ? 9999 : e.linearVelocity.y / e.linearVelocity.x) - this.dir > .01 || t - this.dir < -.01) && (this.dir = t);
                if (this.isAcceleDirValid()) {
                  var o = Math.atan2(e.linearVelocity.y, e.linearVelocity.x);
                  if (!this.accele_negOrPos_yx) {
                    this.accele_negOrPos_yx = e.linearVelocity.x > 0 ? 1 : -1;
                    this.accele_dir.y < 0 && (this.accele_negOrPos_yx = -this.accele_negOrPos_yx);
                  }
                  if (!this.accele_negOrPos_yy) {
                    this.accele_negOrPos_yy = e.linearVelocity.y > 0 ? 1 : -1;
                    this.accele_dir.y < 0 && (this.accele_negOrPos_yy = -this.accele_negOrPos_yy);
                  }
                  var n = this.accele_dir.y * this.accele_power,
                    i = Math.abs(Math.cos(o) * n) * this.accele_negOrPos_yx,
                    a = Math.abs(Math.sin(o) * n) * this.accele_negOrPos_yy,
                    r = (cc.v2(1 * e.linearVelocity.x, 1 * e.linearVelocity.y), this.accele_dir.x < 0 ? -1 : 1),
                    l = o + Math.PI / 2 * r,
                    s = this.accele_dir.x * this.accele_power,
                    c = Math.cos(l) * Math.abs(s),
                    u = Math.sin(l) * Math.abs(s),
                    p = this.getVelMag(e.linearVelocity) / 500,
                    d = 1 * (p = p > 1 ? 1 : p);
                  c *= d;
                  u *= d;
                  if (this.last_vel_angle) {
                    var _ = Math.abs(this.last_vel_angle - o);
                    if (_ > 5) {
                      console.log("angle_delta", _);
                      console.log("xx xy", c, u, i, a);
                    }
                  }
                  this.node.x = this.node.x;
                  this.node.y = this.node.y;
                  this.accele_power = this.accele_power * this.accele_power_div;
                  if (this.accele_power < .01) {
                    this.accele_power = 0;
                    this.accele_dir = null;
                    this.last_vel_angle = null;
                  } else {
                    var f = cc.v2(i + c, a + u);
                    f.x = 1 * f.x;
                    f.y = 1 * f.y;
                    this.node.getComponent(cc.RigidBody).applyLinearImpulse(f, cc.v2(0, 0), !0);
                  }
                  this.last_vel_angle = o;
                }
                if (this.isTooSmallV(e.linearVelocity)) {
                  if (!this.isAcceleDirValid()) {
                    this.tooSmallIdx = 0;
                    this.stopMove();
                  }
                  console.log("stop by manual");
                }
              } else this.state = "moving";
            } else 0 == e.linearVelocity.x && 0 == e.linearVelocity.y && "moving" == this.state && this.stopMove();
          } else if (e.linearVelocity.len() < 40) {
            this.state = "on_destroy_roll";
            this.rollToQiuDai();
          }
        };
        t.prototype.onEndContact = function (e, t, o) {
          this.ballID == r.ID_WHITEBALL && (t.node.getComponent("Ball2DControl").aimZheXian = null);
          o.body.node;
        };
        t.prototype.stopMove = function () {
          this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
          this.accele_power = 0;
          this.accele_dir = null;
          this.last_vel_angle = null;
          if (!this.isOnDestroy()) {
            this.state = "none";
            this.colliderCount = 0;
          }
          this.todoAfterStop();
        };
        t.prototype.modifyMoveToHole = function (e) {
          !d.isModifyBallDir || "moving" != this.state && "none" != this.state || c.default.trigger(u.default.ModifyBallMoveDir, {
            moveDir: e,
            ball2DCtrl: this,
            cb: this.doModifyMoveDir.bind(this)
          });
        };
        t.prototype.getNowPos = function () {
          return cc.v2(this.node.x, this.node.y);
        };
        t.prototype.onPostSolve = function (e, t, o) {
          var n = o.node.getComponent("Ball2DControl");
          this.ballID == r.ID_WHITEBALL && this.colliderCount++;
          if (this.ballID != r.ID_WHITEBALL) if (n) {
            if (e.disabled) {
              t.body.linearVelocity = cc.Vec2.ZERO;
              e.disabled = !1;
              return;
            }
            if (e.aimTargetUUID && e.aimTargetUUID == this.node.uuid && n.aimZheXian) {
              var i = n.aimZheXian.normalize();
              if (i) {
                var a = t.body.linearVelocity.len();
                t.body.linearVelocity = i.mul(a);
                console.log("jkd2972 onPostSolve", a, i);
              }
            } else this.modifyMoveToHole(t.body.linearVelocity);
          } else this.modifyMoveToHole(t.body.linearVelocity);
        };
        t.prototype.onBeginContact = function (e, t, o) {
          var n = o.node.getComponent("Ball2DControl");
          if (this.ballID != r.ID_WHITEBALL && n && n.ballID == r.ID_WHITEBALL) {
            if (n.aimTargetUUID && n.aimTargetUUID != this.node.uuid) e.disabled = !0;else {
              e.aimTargetUUID = n.aimTargetUUID;
              n.aimTargetUUID = null;
            }
            var i = cc.v2(t.body.linearVelocity);
            this._onBeginContactZheShe = n.aimZheShe;
            this._onBeginContactLinearVelocityOther = cc.v2(o.body.linearVelocity);
            console.log("jkd2972 onBeginContact", i, this._onBeginContactLinearVelocityOther);
          }
          this.ballID == r.ID_WHITEBALL && this.aimTargetUUID && (n || (this.aimTargetUUID = null));
          var a = o.body.node;
          if (a.getComponent("Ball2DControl")) {
            d.playBallCollideSound();
            if (this.ballID == r.ID_WHITEBALL && d.curPowerPercentFlag >= 1) {
              s.default.setVibrator();
              d.curPowerPercentFlag = 0;
            }
          } else "default" == a.group && d.playBoardCollideSound();
          var l = d.getParam("accele_power_reduce");
          this.accele_power = this.accele_power * l;
        };
        t.prototype.showBaiQiuEffect = function (e) {
          if (this.ball3D) {
            this.ball3D.zIndex = 999;
            var t = this.ball3D.getChildByName("baiqiu_sp_effect");
            t && (t.active = e);
            var o = this.ball3D.getChildByName("baiqiu_tip");
            if (o) {
              o.active = e;
              e && this.scheduleOnce(function () {
                o.active = !1;
              }, 1.5);
            }
          }
        };
        a([h], t.prototype, "ballID", void 0);
        a([h(cc.Node)], t.prototype, "ball3D", void 0);
        return a([f], t);
      }(cc.Component);
    o.default = g;
    cc._RF.pop();
