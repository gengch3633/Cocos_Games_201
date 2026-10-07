// @ts-nocheck
var i,
n,
a,
o,
r,
s,
l,
c,
u,
d,
h,
p,
_,
f,
g,
m,
y,
v = cc.gfx,
b = sp.spine,
w = v.VertexFormat.vfmtPosUvColor,
k = v.VertexFormat.vfmtPosUvTwoColor,
S = 0,
C = [0, 1, 2, 2, 3, 0],
T = cc.color(0, 0, 255, 255),
N = cc.color(255, 0, 0, 255),
I = cc.color(0, 255, 0, 255),
A = cc.color(255, 255, 0, 255),
R = null,
P = null,
E = null,
M = null;
R = new b.Color(1, 1, 1, 1);
P = new b.Color(1, 1, 1, 1);
var L,
D,
x,
O,
B,
F,
U,
V,
G,
H,
z,
j,
q,
W,
J,
K,
Y,
X,
Q,
$,
Z,
ee,
te,
ie,
ne,
ae,
oe,
re,
se,
le = b.Vector2|| function() {
  this.x = 0;
  this.y = 0;
}
;
E = new le();
M = new le();
var ce = 0,
ue = 0,
de = 0,
he = 0,
pe = 0,
_e = 0,
fe = 0;
function ge(e, t) {
  var n,
  a;
  switch(t) {
    case b.BlendMode.Additive: n = i? cc.macro.ONE: cc.macro.SRC_ALPHA;
    a = cc.macro.ONE;
    break;
    case b.BlendMode.Multiply: n = cc.macro.DST_COLOR;
    a = cc.macro.ONE_MINUS_SRC_ALPHA;
    break;
    case b.BlendMode.Screen: n = cc.macro.ONE;
    a = cc.macro.ONE_MINUS_SRC_COLOR;
    break;
    case b.BlendMode.Normal: default: n = i? cc.macro.ONE: cc.macro.SRC_ALPHA;
    a = cc.macro.ONE_MINUS_SRC_ALPHA;
  }
  var o = ! ie.enableBatch,
  s = ie._materials[0];
  if(! s) return null;
  var l = e.getId()+ n+ a+ r+ o,
  c = ie._materialCache,
  u = c[l];
  if(! u) {
    c.baseMaterial? u = cc.MaterialVariant.create(s, null):(u = s, c.baseMaterial = s);
    u.define("CC_USE_MODEL", o);
    u.define("USE_TINT", r);
    u.setProperty("texture", e);
    u.setBlend(! 0, v.BLEND_FUNC_ADD, n, a, v.BLEND_FUNC_ADD, n, a);
    c[l] = u;
  }
  return u;
}
function me(e) {
  $ = e.fa* p;
  W = u*(n = i? $/ 255: 1);
  J = d* n;
  K = h* n;
  Y = e.fr* W;
  X = e.fg* J;
  Q = e.fb* K;
  _ = ($ << 24 >>> 0)+(Q << 16)+(X << 8)+ Y;
  Z = e.dr* W;
  ee = e.dg* J;
  te = e.db* K;
  f = ((i? 255: 0) << 24 >>> 0)+(te << 16)+(ee << 8)+ Z;
}
function ye(e) {
  return(e.a << 24 >>> 0)+(e.b << 16)+(e.g << 8)+ e.r;
}
sp.Skeleton.__assembler__.fillVertices = function(e, t, a, o, s) {
  var l,
  c = ne._vData,
  g = ne._iData,
  v = ne._uintVData;
  R.a = a.a* t.a* e.a* p* 255;
  n = i? R.a: 255;
  L = u* t.r* e.r* n;
  D = d* t.g* e.g* n;
  x = h* t.b* e.b* n;
  R.r = L* a.r;
  R.g = D* a.g;
  R.b = x* a.b;
  if(null == s.darkColor) P.set(0, 0, 0, 1);
  else {
    P.r = s.darkColor.r* L;
    P.g = s.darkColor.g* D;
    P.b = s.darkColor.b* x;
  }
  P.a = i? 255: 0;
  if(o.isClipping()) {
    var b = c.subarray(de+ 2);
    o.clipTriangles(c.subarray(de), ce, g.subarray(_e), pe, b, R, P, r, m);
    var w = new Float32Array(o.clippedVertices),
    k = o.clippedTriangles;
    pe = k.length;
    ce = w.length/ y* m;
    l = ne.request(ce/ m, pe);
    _e = l.indiceOffset;
    he = l.vertexOffset;
    de = l.byteOffset >> 2;
    c = ne._vData;
    g = ne._iData;
    v = ne._uintVData;
    g.set(k, _e);
    if(se) {
      C = 0;
      T = w.length;
      for(var S = de;
      C < T;
      C+= y, S+= m) {
        E.x = w[C];
        E.y = w[C+ 1];
        R.set(w[C+ 2], w[C+ 3], w[C+ 4], w[C+ 5]);
        M.x = w[C+ 6];
        M.y = w[C+ 7];
        r? P.set(w[C+ 8], w[C+ 9], w[C+ 10], w[C+ 11]): P.set(0, 0, 0, 0);
        se.transform(E, M, R, P);
        c[S] = E.x;
        c[S+ 1] = E.y;
        c[S+ 2] = M.x;
        c[S+ 3] = M.y;
        v[S+ 4] = ye(R);
        r&& (v[S+ 5] = ye(P));
      }
    } else {
      C = 0;
      T = w.length;
      for(S = de;
      C < T;
      C+= y, S+= m) {
        c[S] = w[C];
        c[S+ 1] = w[C+ 1];
        c[S+ 2] = w[C+ 6];
        c[S+ 3] = w[C+ 7];
        _ = (w[C+ 5] << 24 >>> 0)+(w[C+ 4] << 16)+(w[C+ 3] << 8)+ w[C+ 2];
        v[S+ 4] = _;
        if(r) {
          f = (w[C+ 11] << 24 >>> 0)+(w[C+ 10] << 16)+(w[C+ 9] << 8)+ w[C+ 8];
          v[S+ 5] = f;
        }
      }
    }
  } else if(se) for(var C = de, T = de+ ce;
  C < T;
  C+= m) {
    E.x = c[C];
    E.y = c[C+ 1];
    M.x = c[C+ 2];
    M.y = c[C+ 3];
    se.transform(E, M, R, P);
    c[C] = E.x;
    c[C+ 1] = E.y;
    c[C+ 2] = M.x;
    c[C+ 3] = M.y;
    v[C+ 4] = ye(R);
    r&& (v[C+ 5] = ye(P));
  } else {
    _ = ye(R);
    f = ye(P);
    C = de;
    for(T = de+ ce;
    C < T;
    C+= m) {
      v[C+ 4] = _;
      r&& (v[C+ 5] = f);
    }
  }
}
;
sp.Skeleton.__assembler__.realTimeTraverse = function(e) {
  var t,
  i,
  n,
  u,
  d,
  h,
  p,
  _,
  f,
  g,
  v,
  w,
  k = ie._skeleton,
  S = k.color,
  R = ie._debugRenderer,
  P = ie._clipper,
  E = null;
  a = ie._startSlotIndex;
  o = ie._endSlotIndex;
  O = ! 1;
- 1 == a&& (O = ! 0);
  s = ie.debugSlots;
  l = ie.debugBones;
  c = ie.debugMesh;
  if(R&& (l|| s|| c)) {
    R.clear();
    R.lineWidth = 2;
  }
  y = r? 12: 8;
  ce = 0;
  de = 0;
  he = 0;
  pe = 0;
  _e = 0;
  for(var M = 0, L = k.drawOrder.length;
  M < L;
  M++) if(null != (v = k.drawOrder[M])&& v.bone.active) {
    a >= 0&& a == v.data.index&& (O = ! 0);
    if(O) {
      o >= 0&& o == v.data.index&& (O = ! 1);
      ce = 0;
      pe = 0;
      if(n = v.getAttachment()) {
        _ = n instanceof b.RegionAttachment;
        f = n instanceof b.MeshAttachment;
        if(n instanceof b.ClippingAttachment) P.clipStart(v, n);
        else if(_|| f) if(E = ge(n.region.texture._texture, v.data.blendMode)) {
          if(B|| E.getHash() !== ae.material.getHash()) {
            B = ! 1;
            ae._flush();
            ae.node = oe;
            ae.material = E;
          }
          if(_) {
            p = C;
            ce = 4* m;
            pe = 6;
            g = ne.request(4, 6);
            _e = g.indiceOffset;
            he = g.vertexOffset;
            de = g.byteOffset >> 2;
            t = ne._vData;
            i = ne._iData;
            n.computeWorldVertices(v.bone, t, de, m);
            if(R&& s) {
              R.strokeColor = T;
              R.moveTo(t[de], t[de+ 1]);
              for(var D = de+ m, x = de+ ce;
              D < x;
              D+= m) R.lineTo(t[D], t[D+ 1]);
              R.close();
              R.stroke();
            }
          } else if(f&& (p = n.triangles, ce = (n.worldVerticesLength >> 1)* m, pe = p.length, g = ne.request(ce/ m, pe), _e = g.indiceOffset, he = g.vertexOffset, de = g.byteOffset >> 2, t = ne._vData, i = ne._iData, n.computeWorldVertices(v, 0, n.worldVerticesLength, t, de, m), R&& c)) {
            R.strokeColor = A;
            D = 0;
            for(x = p.length;
            D < x;
            D+= 3) {
              var W = p[D]* m+ de,
              J = p[D+ 1]* m+ de,
              K = p[D+ 2]* m+ de;
              R.moveTo(t[W], t[W+ 1]);
              R.lineTo(t[J], t[J+ 1]);
              R.lineTo(t[K], t[K+ 1]);
              R.close();
              R.stroke();
            }
          }
          if(0 != ce&& 0 != pe) {
            i.set(p, _e);
            h = n.uvs;
            for(var Y = de, X = de+ ce, Q = 0;
            Y < X;
            Y+= m, Q+= 2) {
              t[Y+ 2] = h[Q];
              t[Y+ 3] = h[Q+ 1];
            }
            u = n.color;
            d = v.color;
            this.fillVertices(S, u, d, P, v);
            t = ne._vData;
            i = ne._iData;
            if(pe > 0) {
              D = _e;
              for(x = _e+ pe;
              D < x;
              D++) i[D]+= he;
              if(e) {
                w = e.m;
                V = w[0];
                G = w[4];
                H = w[12];
                z = w[1];
                j = w[5];
                q = w[13];
                D = de;
                for(x = de+ ce;
                D < x;
                D+= m) {
                  F = t[D];
                  U = t[D+ 1];
                  t[D] = F* V+ U* G+ H;
                  t[D+ 1] = F* z+ U* j+ q;
                }
              }
              ne.adjust(ce/ m, pe);
            }
            P.clipEndWithSlot(v);
          } else P.clipEndWithSlot(v);
        } else P.clipEndWithSlot(v);
        else P.clipEndWithSlot(v);
      } else P.clipEndWithSlot(v);
    } else P.clipEndWithSlot(v);
  }
  P.clipEnd();
  if(R&& l) {
    var $ = void 0;
    R.strokeColor = N;
    R.fillColor = T;
    var Z = 0;
    for(X = k.bones.length;
    Z < X;
    Z++) {
      var ee = ($ = k.bones[Z]).data.length* $.a+ $.worldX,
      te = $.data.length* $.c+ $.worldY;
      R.moveTo($.worldX, $.worldY);
      R.lineTo(ee, te);
      R.stroke();
      R.circle($.worldX, $.worldY, 1.5* Math.PI);
      R.fill();
      0 === Z&& (R.fillColor = I);
    }
  }
}
;
sp.Skeleton.__assembler__.cacheTraverse = function(e) {
  var t = ie._curFrame;
  if(t) {
    var i = t.segments;
    if(0 != i.length) {
      var n,
      a,
      o,
      r,
      s,
      l,
      c = t.vertices,
      u = t.indices,
      d = 0,
      h = 0,
      p = 0;
      if(e) {
        l = e.m;
        V = l[0];
        z = l[1];
        G = l[4];
        j = l[5];
        H = l[12];
        q = l[13];
      }
      var g = 16& S,
      m = g&& 1 === V&& 0 === z&& 0 === G&& 1 === j,
      y = 0,
      v = t.colors,
      b = v[y++],
      w = b.vfOffset;
      me(b);
      for(var k = 0, C = i.length;
      k < C;
      k++) {
        var T = i[k];
        if(r = ge(T.tex, T.blendMode)) {
          if(B|| r.getHash() !== ae.material.getHash()) {
            B = ! 1;
            ae._flush();
            ae.node = oe;
            ae.material = r;
          }
          ue = T.vertexCount;
          pe = T.indexCount;
          s = ne.request(ue, pe);
          _e = s.indiceOffset;
          he = s.vertexOffset;
          fe = s.byteOffset >> 2;
          n = ne._vData;
          a = ne._iData;
          o = ne._uintVData;
          for(var N = _e, I = _e+ pe;
          N < I;
          N++) a[N] = he+ u[h++];
          p = T.vfCount;
          n.set(c.subarray(d, d+ p), fe);
          d+= p;
          if(m) {
            N = fe;
            for(I = fe+ p;
            N < I;
            N+= 6) {
              n[N]+= H;
              n[N+ 1]+= q;
            }
          } else if(g) {
            N = fe;
            for(I = fe+ p;
            N < I;
            N+= 6) {
              F = n[N];
              U = n[N+ 1];
              n[N] = F* V+ U* G+ H;
              n[N+ 1] = F* z+ U* j+ q;
            }
          }
          ne.adjust(ue, pe);
          if(re) {
            var A = d- p;
            N = fe+ 4;
            for(I = fe+ 4+ p;
            N < I;
            N+= 6, A+= 6) {
              if(A >= w) {
                me(b = v[y++]);
                w = b.vfOffset;
              }
              o[N] = _;
              o[N+ 1] = f;
            }
          }
        }
      }
    }
  }
}
;
sp.Skeleton.__assembler__.fillBuffers = function(e, t) {
  var a = e.node;
  a._renderFlag|= cc.RenderFlow.FLAG_UPDATE_RENDER_DATA;
  if(e._skeleton) {
    var o = a._color;
    u = o.r/ 255;
    d = o.g/ 255;
    h = o.b/ 255;
    p = o.a/ 255;
    r = e.useTint|| e.isAnimationCached();
    g = r? k: w;
    m = r? 6: 5;
    oe = e.node;
    ne = t.getBuffer("spine", g);
    ae = t;
    ie = e;
    B = ! 0;
    i = e.premultipliedAlpha;
    n = 1;
    S = 0;
    re = ! 1;
    se = e._effectDelegate&& e._effectDelegate._vertexEffect;
(4294967295 !== o._val|| i)&& (re = ! 0);
    r&& (S|= 1);
    var s = void 0;
    if(ie.enableBatch) {
      s = oe._worldMatrix;
      B = ! 1;
      S|= 16;
    }
    if(e.isAnimationCached()) this.cacheTraverse(s);
    else {
      se&& se.begin(e._skeleton);
      this.realTimeTraverse(s);
      se&& se.end();
    }
    oe = void 0;
    ne = void 0;
    ae = void 0;
    ie = void 0;
    se = null;
  }
}
;
