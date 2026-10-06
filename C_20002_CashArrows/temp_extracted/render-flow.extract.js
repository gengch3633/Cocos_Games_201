"render-flow": [ function(e, t) {
"use strict";
cc._RF.push(t, "de892Y6FlFBd5qTVaELVkJS", "render-flow");
var i, n = 0, a = 0, o = 0, r = [], s = !1;
function l() {
if (r.length > 0) {
s && r.sort(function(e, t) {
return e.renderPriority - t.renderPriority;
});
for (var e = 0, t = r; e < t.length; e++) {
var n = t[e];
n._checkBacth(i, n.node._cullingMask);
n._assembler.fillBuffers(n, i);
}
r.length = 0;
}
s = !1;
}
cc.RenderFlow.visitRootNode = function(e) {
a = 0;
o = 0;
r.length = 0;
s = !1;
i = cc.RenderFlow.getBachther();
cc.RenderFlow.validateRenderers();
var t = n;
n = e._cullingMask;
if (e._renderFlag & cc.RenderFlow.FLAG_WORLD_TRANSFORM) {
i.worldMatDirty++;
e._calculWorldMatrix();
e._renderFlag &= ~cc.RenderFlow.FLAG_WORLD_TRANSFORM;
cc.RenderFlow.flows[e._renderFlag]._func(e);
l();
i.worldMatDirty--;
} else {
cc.RenderFlow.flows[e._renderFlag]._func(e);
l();
}
n = t;
};
cc.RenderFlow.prototype._render = function(e) {
var t = e._renderComponent, n = o;
o = e._sortingEnabled ? e._sortingPriority : o;
e._sortingEnabled && ++a;
if (a > 0) if (t instanceof cc.Mask) {
l();
t._checkBacth(i, e._cullingMask);
t._assembler.fillBuffers(t, i);
} else {
i.worldMatDirty && t._assembler.updateWorldVerts && t._assembler.updateWorldVerts(t);
t instanceof sp.Skeleton && (i.worldMatDirty++, t.attachUtil._syncAttachedNode());
r.push(t);
t.renderPriority = e._sortingEnabled ? e._sortingPriority : o;
0 != o && (s = !0);
} else {
t._checkBacth(i, e._cullingMask);
t._assembler.fillBuffers(t, i);
}
this._next._func(e);
e._sortingEnabled && --a <= 0 && l();
o = n;
};
cc.RenderFlow.prototype._postRender = function(e) {
var t = e._renderComponent;
t instanceof cc.Mask && l();
t._checkBacth(i, e._cullingMask);
t._assembler.postFillBuffers(t, i);
this._next._func(e);
};
cc.RenderFlow.prototype._children = function(e) {
var t = n, o = i, r = o.parentOpacity, s = o.parentOpacity *= e._opacity / 255;
!e._renderComponent && e._sortingEnabled && ++a;
for (var c = (o.worldMatDirty ? cc.RenderFlow.FLAG_WORLD_TRANSFORM : 0) | (o.parentOpacityDirty ? cc.RenderFlow.FLAG_OPACITY_COLOR : 0), u = e._children, d = 0, h = u.length; d < h; d++) {
var p = u[d];
p._renderFlag |= c;
if (p._activeInHierarchy && 0 !== p._opacity) {
n = p._cullingMask = 0 === p.groupIndex ? t : 1 << p.groupIndex;
var _ = p._color._val;
p._color._fastSetA(p._opacity * s);
cc.RenderFlow.flows[p._renderFlag]._func(p);
p._color._val = _;
}
}
o.parentOpacity = r;
this._next._func(e);
!e._renderComponent && e._sortingEnabled && --a <= 0 && l();
};
cc._RF.pop();
}