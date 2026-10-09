let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "9059egi5QpHkK5rQIwKAV2C", "MyCircleColliderUtility");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = function () {
      function e() {}
      e.collide = function (e, t, o, n) {
        o.normalizeSelf();
        var i = e.position,
          a = t.position,
          r = e.r + t.r,
          l = a.clone().subSelf(i);
        if (o.angle(l) >= Math.PI / 2) return null;
        var s = o.clone().mulSelf(l.len() + 100),
          c = l.project(s),
          u = i.clone().addSelf(c);
        if (n) {
          n.strokeColor = cc.Color.CYAN;
          n.moveTo(i.x, i.y);
          n.lineTo(u.x, u.y);
          n.stroke();
        }
        var p = c.clone().subSelf(l),
          d = p.len();
        if (d < r) {
          if (n) {
            var _ = p.clone().addSelf(a);
            n.strokeColor = cc.Color.CYAN;
            n.moveTo(a.x, a.y);
            n.lineTo(_.x, _.y);
            n.stroke();
          }
          var f = Math.sin(Math.acos(d / r)) * r,
            h = c.len() - f,
            g = c.normalizeSelf().mulSelf(h).clone().addSelf(i);
          if (n) {
            n.strokeColor = cc.Color.RED;
            n.moveTo(i.x, i.y);
            n.lineTo(g.x, g.y);
            n.circle(g.x, g.y, e.r);
            n.stroke();
          }
          return g;
        }
        return null;
      };
      e.collideWhitLine = function (e, t, o, n, i) {
        n = n.normalize();
        t = t.clone();
        o = o.clone();
        var a = e.position,
          r = o.clone().subSelf(t),
          l = cc.v2(r).signAngle(n);
        if (l <= 0 || l >= Math.PI) return null;
        var s = a.add(n.mul(2e5)),
          c = r.len(),
          u = a.clone().subSelf(t);
        if (i) {
          var p = u.clone().addSelf(t);
          this.drawLine(t, p, i, cc.Color.WHITE);
        }
        var d = u.project(r),
          _ = d.clone().subSelf(u),
          f = s.clone().subSelf(t),
          h = f.project(r),
          g = h.clone().subSelf(f);
        h.angle(g);
        if (h.angle(g) < 1 && g.len() > _.len()) return null;
        if (i) {
          var y = d.clone().addSelf(t);
          this.drawLine(t, y, i, cc.Color.WHITE);
        }
        if (i) {
          var v = _.clone().addSelf(a);
          this.drawLine(a, v, i, cc.Color.WHITE);
        }
        var m = _.len(),
          b = n.angle(r),
          C = Math.sin(b),
          P = m / C;
        P -= e.r / C;
        var S = n.clone().mulSelf(P).clone().add(a),
          I = S.clone().sub(t).project(r).clone().add(t),
          D = (I.clone(), I.sub(t).len()),
          E = I.sub(o).len();
        if (D > e.r && D >= c || E > e.r && E >= c) return null;
        i && this.drawLine(t, I, i, cc.Color.BLUE);
        if (S.sub(a).angle(n) > Math.PI / 2) return null;
        if (i) {
          this.drawLine(a, S, i, cc.Color.RED);
          this.drawCircle(S, e.r, i, cc.Color.RED);
        }
        return S;
      };
      e.collideCheck = function (e, t, o) {
        var n = e.position,
          i = t.position.clone().subSelf(n);
        return i.angle(o) < Math.asin((e.r + t.r) / i.len());
      };
      e.drawCircle = function (e, t, o, n) {
        o.strokeColor = n;
        o.circle(e.x, e.y, t);
        o.stroke();
      };
      e.collidePoint = function (e, t, o, n) {
        var i = {
          r: 0,
          position: t
        };
        return this.collide(e, i, o, n);
      };
      e.drawLine = function (e, t, o, n) {
        o.strokeColor = n;
        o.moveTo(e.x, e.y);
        o.lineTo(t.x, t.y);
        o.stroke();
      };
      return e;
    }();
    o.default = n;
    cc._RF.pop();
