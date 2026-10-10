let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "30187z699xCUaIgEF1bQFBM", "NodeUtil");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = function () {
      function e() {}
      e.getRelativePosition = function (e, t) {
        var o = (e.getParent() || e).convertToWorldSpaceAR(e.getPosition());
        return t.convertToNodeSpaceAR(o);
      };
      e.isPosOnNodeRect = function (e, t) {
        return t.getBoundingBoxToWorld().contains(e);
      };
      e.areNodesOverlap = function (e, t, o) {
        void 0 === o && (o = !1);
        var n = e.getBoundingBoxToWorld(),
          i = t.getBoundingBoxToWorld();
        return o ? n.containsRect(i) : n.intersects(i);
      };
      e.getNodeSelfBoundingBoxToWorld = function (e) {
        e.parent._updateWorldMatrix();
        var t = e.getContentSize(),
          o = t.width,
          n = t.height,
          i = e.getAnchorPoint(),
          a = cc.rect(-i.x * o, -i.y * n, o, n);
        e._calculWorldMatrix();
        a.transformMat4(a, e._worldMatrix);
        return a;
      };
      return e;
    }();
    o.default = n;
    cc._RF.pop();
