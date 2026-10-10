"use strict";
module.exports = function () {
      this || window;
      function e(e) {
        throw e;
      }
      var t = void 0,
        o = !0,
        n = this;
      function i(e, o) {
        var i,
          a = e.split("."),
          r = n;
        !(a[0] in r) && r.execScript && r.execScript("var " + a[0]);
        for (; a.length && (i = a.shift());) a.length || o === t ? r = r[i] ? r[i] : r[i] = {} : r[i] = o;
      }
      var a = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array && "undefined" != typeof DataView;
      function r(t, o) {
        this.index = "number" == typeof o ? o : 0;
        this.i = 0;
        this.buffer = t instanceof (a ? Uint8Array : Array) ? t : new (a ? Uint8Array : Array)(32768);
        2 * this.buffer.length <= this.index && e(Error("invalid index"));
        this.buffer.length <= this.index && this.f();
      }
      r.prototype.f = function () {
        var e,
          t = this.buffer,
          o = t.length,
          n = new (a ? Uint8Array : Array)(o << 1);
        if (a) n.set(t);else for (e = 0; e < o; ++e) n[e] = t[e];
        return this.buffer = n;
      };
      r.prototype.d = function (e, t, o) {
        var n,
          i = this.buffer,
          a = this.index,
          r = this.i,
          l = i[a];
        o && 1 < t && (e = 8 < t ? (d[255 & e] << 24 | d[e >>> 8 & 255] << 16 | d[e >>> 16 & 255] << 8 | d[e >>> 24 & 255]) >> 32 - t : d[e] >> 8 - t);
        if (8 > t + r) l = l << t | e, r += t;else for (n = 0; n < t; ++n) l = l << 1 | e >> t - n - 1 & 1, 8 == ++r && (r = 0, i[a++] = d[l], l = 0, a === i.length && (i = this.f()));
        i[a] = l;
        this.buffer = i;
        this.i = r;
        this.index = a;
      };
      r.prototype.finish = function () {
        var e,
          t = this.buffer,
          o = this.index;
        0 < this.i && (t[o] <<= 8 - this.i, t[o] = d[t[o]], o++);
        a ? e = t.subarray(0, o) : (t.length = o, e = t);
        return e;
      };
      var l,
        s = new (a ? Uint8Array : Array)(256);
      for (l = 0; 256 > l; ++l) {
        for (var c = p = l, u = 7, p = p >>> 1; p; p >>>= 1) c <<= 1, c |= 1 & p, --u;
        s[l] = (c << u & 255) >>> 0;
      }
      var d = s;
      function _(e) {
        this.buffer = new (a ? Uint16Array : Array)(2 * e);
        this.length = 0;
      }
      _.prototype.getParent = function (e) {
        return 2 * ((e - 2) / 4 | 0);
      };
      _.prototype.push = function (e, t) {
        var o,
          n,
          i,
          a = this.buffer;
        o = this.length;
        a[this.length++] = t;
        for (a[this.length++] = e; 0 < o && (n = this.getParent(o), a[o] > a[n]);) i = a[o], a[o] = a[n], a[n] = i, i = a[o + 1], a[o + 1] = a[n + 1], a[n + 1] = i, o = n;
        return this.length;
      };
      _.prototype.pop = function () {
        var e,
          t,
          o,
          n,
          i,
          a = this.buffer;
        t = a[0];
        e = a[1];
        this.length -= 2;
        a[0] = a[this.length];
        a[1] = a[this.length + 1];
        for (i = 0; !((n = 2 * i + 2) >= this.length);) {
          n + 2 < this.length && a[n + 2] > a[n] && (n += 2);
          if (!(a[n] > a[i])) break;
          o = a[i], a[i] = a[n], a[n] = o, o = a[i + 1], a[i + 1] = a[n + 1], a[n + 1] = o;
          i = n;
        }
        return {
          index: e,
          value: t,
          length: this.length
        };
      };
      function f(e) {
        var t,
          o,
          n,
          i,
          r,
          l,
          s,
          c,
          u,
          p,
          d = e.length,
          _ = 0,
          f = Number.POSITIVE_INFINITY;
        for (c = 0; c < d; ++c) e[c] > _ && (_ = e[c]), e[c] < f && (f = e[c]);
        t = 1 << _;
        o = new (a ? Uint32Array : Array)(t);
        n = 1;
        i = 0;
        for (r = 2; n <= _;) {
          for (c = 0; c < d; ++c) if (e[c] === n) {
            l = 0;
            s = i;
            for (u = 0; u < n; ++u) l = l << 1 | 1 & s, s >>= 1;
            p = n << 16 | c;
            for (u = l; u < t; u += r) o[u] = p;
            ++i;
          }
          ++n;
          i <<= 1;
          r <<= 1;
        }
        return [o, _, f];
      }
      function h(e, t) {
        this.h = 2;
        this.w = 0;
        this.input = a && e instanceof Array ? new Uint8Array(e) : e;
        this.b = 0;
        t && (t.lazy && (this.w = t.lazy), "number" == typeof t.compressionType && (this.h = t.compressionType), t.outputBuffer && (this.a = a && t.outputBuffer instanceof Array ? new Uint8Array(t.outputBuffer) : t.outputBuffer), "number" == typeof t.outputIndex && (this.b = t.outputIndex));
        this.a || (this.a = new (a ? Uint8Array : Array)(32768));
      }
      var g,
        y = [];
      for (g = 0; 288 > g; g++) switch (o) {
        case 143 >= g:
          y.push([g + 48, 8]);
          break;
        case 255 >= g:
          y.push([g - 144 + 400, 9]);
          break;
        case 279 >= g:
          y.push([g - 256 + 0, 7]);
          break;
        case 287 >= g:
          y.push([g - 280 + 192, 8]);
          break;
        default:
          e("invalid literal: " + g);
      }
      h.prototype.j = function () {
        var n,
          i,
          l,
          s,
          c = this.input;
        switch (this.h) {
          case 0:
            l = 0;
            for (s = c.length; l < s;) {
              var u,
                p,
                d,
                _ = i = a ? c.subarray(l, l + 65535) : c.slice(l, l + 65535),
                f = (l += i.length) === s,
                h = t,
                g = t,
                v = this.a,
                m = this.b;
              if (a) {
                for (v = new Uint8Array(this.a.buffer); v.length <= m + _.length + 5;) v = new Uint8Array(v.length << 1);
                v.set(this.a);
              }
              u = f ? 1 : 0;
              v[m++] = 0 | u;
              d = 65536 + ~(p = _.length) & 65535;
              v[m++] = 255 & p;
              v[m++] = p >>> 8 & 255;
              v[m++] = 255 & d;
              v[m++] = d >>> 8 & 255;
              if (a) v.set(_, m), m += _.length, v = v.subarray(0, m);else {
                h = 0;
                for (g = _.length; h < g; ++h) v[m++] = _[h];
                v.length = m;
              }
              this.b = m;
              this.a = v;
            }
            break;
          case 1:
            var b = new r(a ? new Uint8Array(this.a.buffer) : this.a, this.b);
            b.d(1, 1, o);
            b.d(1, 2, o);
            var P,
              I,
              E,
              T = C(this, c);
            P = 0;
            for (I = T.length; P < I; P++) {
              r.prototype.d.apply(b, y[E]);
              E = T[P];
              E = T[P];
              r.prototype.d.apply(b, y[E]);
              if (256 < E) b.d(T[++P], T[++P], o), b.d(T[++P], 5), b.d(T[++P], T[++P], o);else if (256 === E) break;
            }
            this.a = b.finish();
            this.b = this.a.length;
            break;
          case 2:
            var w,
              O,
              M,
              N,
              L,
              R,
              B,
              x,
              A,
              k,
              U,
              G,
              F,
              j,
              H = new r(a ? new Uint8Array(this.a.buffer) : this.a, this.b),
              V = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
              Y = Array(19);
            H.d(1, 1, o);
            H.d(2, 2, o);
            w = C(this, c);
            R = D(L = S(this.L, 15));
            x = D(B = S(this.K, 7));
            for (O = 286; 257 < O && 0 === L[O - 1]; O--);
            for (M = 30; 1 < M && 0 === B[M - 1]; M--);
            var W,
              J,
              K,
              X,
              Q,
              Z,
              z = O,
              q = M,
              $ = new (a ? Uint32Array : Array)(z + q),
              ee = new (a ? Uint32Array : Array)(316),
              te = new (a ? Uint8Array : Array)(19);
            for (W = J = 0; W < z; W++) $[J++] = L[W];
            for (W = 0; W < q; W++) $[J++] = B[W];
            if (!a) {
              W = 0;
              for (X = te.length; W < X; ++W) te[W] = 0;
            }
            W = Q = 0;
            for (X = $.length; W < X; W += J) {
              for (J = 1; W + J < X && $[W + J] === $[W]; ++J);
              K = J;
              if (0 === $[W]) {
                if (3 > K) for (; 0 < K--;) ee[Q++] = 0, te[0]++;else for (; 0 < K;) (Z = 138 > K ? K : 138) > K - 3 && Z < K && (Z = K - 3), 10 >= Z ? (ee[Q++] = 17, ee[Q++] = Z - 3, te[17]++) : (ee[Q++] = 18, ee[Q++] = Z - 11, te[18]++), K -= Z;
              } else {
                te[$[W]]++;
                ee[Q++] = $[W];
                ee[Q++] = $[W];
                te[$[W]]++;
                if (3 > --K) for (; 0 < K--;) ee[Q++] = $[W], te[$[W]]++;else for (; 0 < K;) (Z = 6 > K ? K : 6) > K - 3 && Z < K && (Z = K - 3), ee[Q++] = 16, ee[Q++] = Z - 3, te[16]++, K -= Z;
              }
            }
            n = a ? ee.subarray(0, Q) : ee.slice(0, Q);
            A = S(te, 7);
            for (F = 0; 19 > F; F++) Y[F] = A[V[F]];
            for (N = 19; 4 < N && 0 === Y[N - 1]; N--);
            k = D(A);
            H.d(O - 257, 5, o);
            H.d(M - 1, 5, o);
            H.d(N - 4, 4, o);
            for (F = 0; F < N; F++) H.d(Y[F], 3, o);
            F = 0;
            for (j = n.length; F < j; F++) {
              H.d(k[U], A[U], o);
              U = n[F];
              U = n[F];
              H.d(k[U], A[U], o);
              if (16 <= U) {
                F++;
                switch (U) {
                  case 16:
                    G = 2;
                    break;
                  case 17:
                    G = 3;
                    break;
                  case 18:
                    G = 7;
                    break;
                  default:
                    e("invalid code: " + U);
                }
                H.d(n[F], G, o);
              }
            }
            var oe,
              ne,
              ie,
              ae,
              re,
              le,
              se,
              ce,
              ue = [R, L],
              pe = [x, B];
            re = ue[0];
            le = ue[1];
            se = pe[0];
            ce = pe[1];
            oe = 0;
            for (ne = w.length; oe < ne; ++oe) {
              H.d(re[ie], le[ie], o);
              ie = w[oe];
              ie = w[oe];
              H.d(re[ie], le[ie], o);
              if (256 < ie) H.d(w[++oe], w[++oe], o), ae = w[++oe], H.d(se[ae], ce[ae], o), H.d(w[++oe], w[++oe], o);else if (256 === ie) break;
            }
            this.a = H.finish();
            this.b = this.a.length;
            break;
          default:
            e("invalid compression type");
        }
        return this.a;
      };
      function v(e, t) {
        this.length = e;
        this.G = t;
      }
      var m = function () {
          function t(t) {
            switch (o) {
              case 3 === t:
                return [257, t - 3, 0];
              case 4 === t:
                return [258, t - 4, 0];
              case 5 === t:
                return [259, t - 5, 0];
              case 6 === t:
                return [260, t - 6, 0];
              case 7 === t:
                return [261, t - 7, 0];
              case 8 === t:
                return [262, t - 8, 0];
              case 9 === t:
                return [263, t - 9, 0];
              case 10 === t:
                return [264, t - 10, 0];
              case 12 >= t:
                return [265, t - 11, 1];
              case 14 >= t:
                return [266, t - 13, 1];
              case 16 >= t:
                return [267, t - 15, 1];
              case 18 >= t:
                return [268, t - 17, 1];
              case 22 >= t:
                return [269, t - 19, 2];
              case 26 >= t:
                return [270, t - 23, 2];
              case 30 >= t:
                return [271, t - 27, 2];
              case 34 >= t:
                return [272, t - 31, 2];
              case 42 >= t:
                return [273, t - 35, 3];
              case 50 >= t:
                return [274, t - 43, 3];
              case 58 >= t:
                return [275, t - 51, 3];
              case 66 >= t:
                return [276, t - 59, 3];
              case 82 >= t:
                return [277, t - 67, 4];
              case 98 >= t:
                return [278, t - 83, 4];
              case 114 >= t:
                return [279, t - 99, 4];
              case 130 >= t:
                return [280, t - 115, 4];
              case 162 >= t:
                return [281, t - 131, 5];
              case 194 >= t:
                return [282, t - 163, 5];
              case 226 >= t:
                return [283, t - 195, 5];
              case 257 >= t:
                return [284, t - 227, 5];
              case 258 === t:
                return [285, t - 258, 0];
              default:
                e("invalid length: " + t);
            }
          }
          var n,
            i,
            a = [];
          for (n = 3; 258 >= n; n++) i = t(n), a[n] = i[2] << 24 | i[1] << 16 | i[0];
          return a;
        }(),
        b = a ? new Uint32Array(m) : m;
      function C(n, i) {
        function r(t, n) {
          var i,
            a,
            r,
            l,
            s = t.G,
            c = [],
            u = 0;
          i = b[t.length];
          c[u++] = 65535 & i;
          c[u++] = i >> 16 & 255;
          c[u++] = i >> 24;
          switch (o) {
            case 1 === s:
              a = [0, s - 1, 0];
              break;
            case 2 === s:
              a = [1, s - 2, 0];
              break;
            case 3 === s:
              a = [2, s - 3, 0];
              break;
            case 4 === s:
              a = [3, s - 4, 0];
              break;
            case 6 >= s:
              a = [4, s - 5, 1];
              break;
            case 8 >= s:
              a = [5, s - 7, 1];
              break;
            case 12 >= s:
              a = [6, s - 9, 2];
              break;
            case 16 >= s:
              a = [7, s - 13, 2];
              break;
            case 24 >= s:
              a = [8, s - 17, 3];
              break;
            case 32 >= s:
              a = [9, s - 25, 3];
              break;
            case 48 >= s:
              a = [10, s - 33, 4];
              break;
            case 64 >= s:
              a = [11, s - 49, 4];
              break;
            case 96 >= s:
              a = [12, s - 65, 5];
              break;
            case 128 >= s:
              a = [13, s - 97, 5];
              break;
            case 192 >= s:
              a = [14, s - 129, 6];
              break;
            case 256 >= s:
              a = [15, s - 193, 6];
              break;
            case 384 >= s:
              a = [16, s - 257, 7];
              break;
            case 512 >= s:
              a = [17, s - 385, 7];
              break;
            case 768 >= s:
              a = [18, s - 513, 8];
              break;
            case 1024 >= s:
              a = [19, s - 769, 8];
              break;
            case 1536 >= s:
              a = [20, s - 1025, 9];
              break;
            case 2048 >= s:
              a = [21, s - 1537, 9];
              break;
            case 3072 >= s:
              a = [22, s - 2049, 10];
              break;
            case 4096 >= s:
              a = [23, s - 3073, 10];
              break;
            case 6144 >= s:
              a = [24, s - 4097, 11];
              break;
            case 8192 >= s:
              a = [25, s - 6145, 11];
              break;
            case 12288 >= s:
              a = [26, s - 8193, 12];
              break;
            case 16384 >= s:
              a = [27, s - 12289, 12];
              break;
            case 24576 >= s:
              a = [28, s - 16385, 13];
              break;
            case 32768 >= s:
              a = [29, s - 24577, 13];
              break;
            default:
              e("invalid distance");
          }
          i = a;
          c[u++] = i[0];
          c[u++] = i[1];
          c[u++] = i[2];
          r = 0;
          for (l = c.length; r < l; ++r) y[v++] = c[r];
          C[c[0]]++;
          S[c[3]]++;
          m = t.length + n - 1;
          f = null;
        }
        var l,
          s,
          c,
          u,
          p,
          d,
          _,
          f,
          h,
          g = {},
          y = a ? new Uint16Array(2 * i.length) : [],
          v = 0,
          m = 0,
          C = new (a ? Uint32Array : Array)(286),
          S = new (a ? Uint32Array : Array)(30),
          I = n.w;
        if (!a) {
          for (c = 0; 285 >= c;) C[c++] = 0;
          for (c = 0; 29 >= c;) S[c++] = 0;
        }
        C[256] = 1;
        l = 0;
        for (s = i.length; l < s; ++l) {
          c = p = 0;
          for (u = 3; c < u && l + c !== s; ++c) p = p << 8 | i[l + c];
          g[p] === t && (g[p] = []);
          d = g[p];
          if (!(0 < m--)) {
            for (; 0 < d.length && 32768 < l - d[0];) d.shift();
            if (l + 3 >= s) {
              f && r(f, -1);
              c = 0;
              for (u = s - l; c < u; ++c) h = i[l + c], y[v++] = h, ++C[h];
              break;
            }
            0 < d.length ? (_ = P(i, l, d), f ? f.length < _.length ? (h = i[l - 1], y[v++] = h, ++C[h], r(_, 0)) : r(f, -1) : _.length < I ? f = _ : r(_, 0)) : f ? r(f, -1) : (h = i[l], y[v++] = h, ++C[h]);
          }
          d.push(l);
        }
        y[v++] = 256;
        C[256]++;
        n.L = C;
        n.K = S;
        return a ? y.subarray(0, v) : y;
      }
      function P(e, t, o) {
        var n,
          i,
          a,
          r,
          l,
          s,
          c = 0,
          u = e.length;
        r = 0;
        s = o.length;
        e: for (; r < s; r++) {
          n = o[s - r - 1];
          a = 3;
          if (3 < c) {
            for (l = c; 3 < l; l--) if (e[n + l - 1] !== e[t + l - 1]) continue e;
            a = c;
          }
          for (; 258 > a && t + a < u && e[n + a] === e[t + a];) ++a;
          a > c && (i = n, c = a);
          if (258 === a) break;
        }
        return new v(c, t - i);
      }
      function S(e, t) {
        var o,
          n,
          i,
          r,
          l,
          s = e.length,
          c = new _(572),
          u = new (a ? Uint8Array : Array)(s);
        if (!a) for (r = 0; r < s; r++) u[r] = 0;
        for (r = 0; r < s; ++r) 0 < e[r] && c.push(r, e[r]);
        o = Array(c.length / 2);
        n = new (a ? Uint32Array : Array)(c.length / 2);
        if (1 === o.length) return u[c.pop().index] = 1, u;
        r = 0;
        for (l = c.length / 2; r < l; ++r) o[r] = c.pop(), n[r] = o[r].value;
        i = I(n, n.length, t);
        r = 0;
        for (l = o.length; r < l; ++r) u[o[r].index] = i[r];
        return u;
      }
      function I(e, t, o) {
        function n(e) {
          var o = f[e][h[e]];
          o === t ? (n(e + 1), n(e + 1)) : --d[o];
          ++h[e];
        }
        var i,
          r,
          l,
          s,
          c,
          u = new (a ? Uint16Array : Array)(o),
          p = new (a ? Uint8Array : Array)(o),
          d = new (a ? Uint8Array : Array)(t),
          _ = Array(o),
          f = Array(o),
          h = Array(o),
          g = (1 << o) - t,
          y = 1 << o - 1;
        u[o - 1] = t;
        for (r = 0; r < o; ++r) g < y ? p[r] = 0 : (p[r] = 1, g -= y), g <<= 1, u[o - 2 - r] = (u[o - 1 - r] / 2 | 0) + t;
        u[0] = p[0];
        _[0] = Array(u[0]);
        f[0] = Array(u[0]);
        for (r = 1; r < o; ++r) u[r] > 2 * u[r - 1] + p[r] && (u[r] = 2 * u[r - 1] + p[r]), _[r] = Array(u[r]), f[r] = Array(u[r]);
        for (i = 0; i < t; ++i) d[i] = o;
        for (l = 0; l < u[o - 1]; ++l) _[o - 1][l] = e[l], f[o - 1][l] = l;
        for (i = 0; i < o; ++i) h[i] = 0;
        1 === p[o - 1] && (--d[0], ++h[o - 1]);
        for (r = o - 2; 0 <= r; --r) {
          s = i = 0;
          c = h[r + 1];
          for (l = 0; l < u[r]; l++) (s = _[r + 1][c] + _[r + 1][c + 1]) > e[i] ? (_[r][l] = s, f[r][l] = t, c += 2) : (_[r][l] = e[i], f[r][l] = i, ++i);
          h[r] = 0;
          1 === p[r] && n(r);
        }
        return d;
      }
      function D(e) {
        var t,
          o,
          n,
          i,
          r = new (a ? Uint16Array : Array)(e.length),
          l = [],
          s = [],
          c = 0;
        t = 0;
        for (o = e.length; t < o; t++) l[e[t]] = 1 + (0 | l[e[t]]);
        t = 1;
        for (o = 16; t <= o; t++) s[t] = c, c += 0 | l[t], c <<= 1;
        t = 0;
        for (o = e.length; t < o; t++) {
          c = s[e[t]];
          s[e[t]] += 1;
          n = r[t] = 0;
          for (i = e[t]; n < i; n++) r[t] = r[t] << 1 | 1 & c, c >>>= 1;
        }
        return r;
      }
      function E(t, o) {
        this.l = [];
        this.m = 32768;
        this.e = this.g = this.c = this.q = 0;
        this.input = a ? new Uint8Array(t) : t;
        this.s = !1;
        this.n = 1;
        this.B = !1;
        !o && (o = {}) || (o.index && (this.c = o.index), o.bufferSize && (this.m = o.bufferSize), o.bufferType && (this.n = o.bufferType), o.resize && (this.B = o.resize));
        switch (this.n) {
          case 0:
            this.b = 32768;
            this.a = new (a ? Uint8Array : Array)(32768 + this.m + 258);
            break;
          case 1:
            this.b = 0;
            this.a = new (a ? Uint8Array : Array)(this.m);
            this.f = this.J;
            this.t = this.H;
            this.o = this.I;
            break;
          default:
            e(Error("invalid inflate mode"));
        }
      }
      E.prototype.p = function () {
        for (; !this.s;) {
          var n = W(this, 3);
          1 & n && (this.s = o);
          switch (n >>>= 1) {
            case 0:
              var i = this.input,
                r = this.c,
                l = this.a,
                s = this.b,
                c = i.length,
                u = t,
                p = l.length,
                d = t;
              this.e = this.g = 0;
              r + 1 >= c && e(Error("invalid uncompressed block header: LEN"));
              u = i[r++] | i[r++] << 8;
              r + 1 >= c && e(Error("invalid uncompressed block header: NLEN"));
              u === ~(i[r++] | i[r++] << 8) && e(Error("invalid uncompressed block header: length verify"));
              r + u > i.length && e(Error("input buffer is broken"));
              switch (this.n) {
                case 0:
                  for (; s + u > l.length;) {
                    u -= d = p - s;
                    if (a) l.set(i.subarray(r, r + d), s), s += d, r += d;else for (; d--;) l[s++] = i[r++];
                    this.b = s;
                    l = this.f();
                    s = this.b;
                  }
                  break;
                case 1:
                  for (; s + u > l.length;) l = this.f({
                    v: 2
                  });
                  break;
                default:
                  e(Error("invalid inflate mode"));
              }
              if (a) l.set(i.subarray(r, r + u), s), s += u, r += u;else for (; u--;) l[s++] = i[r++];
              this.c = r;
              this.b = s;
              this.a = l;
              break;
            case 1:
              this.o(H, Y);
              break;
            case 2:
              var _,
                h,
                g,
                y,
                v = W(this, 5) + 257,
                m = W(this, 5) + 1,
                b = W(this, 4) + 4,
                C = new (a ? Uint8Array : Array)(M.length),
                P = t,
                S = t,
                I = t,
                D = t,
                E = t;
              for (E = 0; E < b; ++E) C[M[E]] = W(this, 3);
              if (!a) {
                E = b;
                for (b = C.length; E < b; ++E) C[M[E]] = 0;
              }
              _ = f(C);
              P = new (a ? Uint8Array : Array)(v + m);
              E = 0;
              for (y = v + m; E < y;) switch (S = J(this, _)) {
                case 16:
                  for (D = 3 + W(this, 2); D--;) P[E++] = I;
                  break;
                case 17:
                  for (D = 3 + W(this, 3); D--;) P[E++] = 0;
                  I = 0;
                  break;
                case 18:
                  for (D = 11 + W(this, 7); D--;) P[E++] = 0;
                  I = 0;
                  break;
                default:
                  I = P[E++] = S;
              }
              h = f(a ? P.subarray(0, v) : P.slice(0, v));
              g = f(a ? P.subarray(v) : P.slice(v));
              this.o(h, g);
              break;
            default:
              e(Error("unknown BTYPE: " + n));
          }
        }
        return this.t();
      };
      var T,
        w,
        O = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
        M = a ? new Uint16Array(O) : O,
        N = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 258, 258],
        L = a ? new Uint16Array(N) : N,
        R = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0],
        B = a ? new Uint8Array(R) : R,
        x = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577],
        A = a ? new Uint16Array(x) : x,
        k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
        U = a ? new Uint8Array(k) : k,
        G = new (a ? Uint8Array : Array)(288);
      T = 0;
      for (w = G.length; T < w; ++T) G[T] = 143 >= T ? 8 : 255 >= T ? 9 : 279 >= T ? 7 : 8;
      var F,
        j,
        H = f(G),
        V = new (a ? Uint8Array : Array)(30);
      F = 0;
      for (j = V.length; F < j; ++F) V[F] = 5;
      var Y = f(V);
      function W(t, o) {
        for (var n, i = t.g, a = t.e, r = t.input, l = t.c, s = r.length; a < o;) l >= s && e(Error("input buffer is broken")), i |= r[l++] << a, a += 8;
        n = i & (1 << o) - 1;
        t.g = i >>> o;
        t.e = a - o;
        t.c = l;
        return n;
      }
      function J(t, o) {
        for (var n, i, a = t.g, r = t.e, l = t.input, s = t.c, c = l.length, u = o[0], p = o[1]; r < p && !(s >= c);) a |= l[s++] << r, r += 8;
        (i = (n = u[a & (1 << p) - 1]) >>> 16) > r && e(Error("invalid code length: " + i));
        t.g = a >> i;
        t.e = r - i;
        t.c = s;
        return 65535 & n;
      }
      E.prototype.o = function (e, t) {
        var o = this.a,
          n = this.b;
        this.u = e;
        for (var i, a, r, l, s = o.length - 258; 256 !== (i = J(this, e));) if (256 > i) n >= s && (this.b = n, o = this.f(), n = this.b), o[n++] = i;else {
          l = L[a = i - 257];
          0 < B[a] && (l += W(this, B[a]));
          i = J(this, t);
          r = A[i];
          0 < U[i] && (r += W(this, U[i]));
          n >= s && (this.b = n, o = this.f(), n = this.b);
          for (; l--;) o[n] = o[n++ - r];
        }
        for (; 8 <= this.e;) this.e -= 8, this.c--;
        this.b = n;
      };
      E.prototype.I = function (e, t) {
        var o = this.a,
          n = this.b;
        this.u = e;
        for (var i, a, r, l, s = o.length; 256 !== (i = J(this, e));) if (256 > i) n >= s && (s = (o = this.f()).length), o[n++] = i;else {
          l = L[a = i - 257];
          0 < B[a] && (l += W(this, B[a]));
          i = J(this, t);
          r = A[i];
          0 < U[i] && (r += W(this, U[i]));
          n + l > s && (s = (o = this.f()).length);
          for (; l--;) o[n] = o[n++ - r];
        }
        for (; 8 <= this.e;) this.e -= 8, this.c--;
        this.b = n;
      };
      E.prototype.f = function () {
        var e,
          t,
          o = new (a ? Uint8Array : Array)(this.b - 32768),
          n = this.b - 32768,
          i = this.a;
        if (a) o.set(i.subarray(32768, o.length));else {
          e = 0;
          for (t = o.length; e < t; ++e) o[e] = i[e + 32768];
        }
        this.l.push(o);
        this.q += o.length;
        if (a) i.set(i.subarray(n, n + 32768));else for (e = 0; 32768 > e; ++e) i[e] = i[n + e];
        this.b = 32768;
        return i;
      };
      E.prototype.J = function (e) {
        var t,
          o,
          n,
          i = this.input.length / this.c + 1 | 0,
          r = this.input,
          l = this.a;
        e && ("number" == typeof e.v && (i = e.v), "number" == typeof e.F && (i += e.F));
        o = 2 > i ? (n = (r.length - this.c) / this.u[2] / 2 * 258 | 0) < l.length ? l.length + n : l.length << 1 : l.length * i;
        a ? (t = new Uint8Array(o)).set(l) : t = l;
        return this.a = t;
      };
      E.prototype.t = function () {
        var e,
          t,
          o,
          n,
          i,
          r = 0,
          l = this.a,
          s = this.l,
          c = new (a ? Uint8Array : Array)(this.q + (this.b - 32768));
        if (0 === s.length) return a ? this.a.subarray(32768, this.b) : this.a.slice(32768, this.b);
        t = 0;
        for (o = s.length; t < o; ++t) {
          n = 0;
          for (i = (e = s[t]).length; n < i; ++n) c[r++] = e[n];
        }
        t = 32768;
        for (o = this.b; t < o; ++t) c[r++] = l[t];
        this.l = [];
        return this.buffer = c;
      };
      E.prototype.H = function () {
        var e,
          t = this.b;
        a ? this.B ? (e = new Uint8Array(t)).set(this.a.subarray(0, t)) : e = this.a.subarray(0, t) : (this.a.length > t && (this.a.length = t), e = this.a);
        return this.buffer = e;
      };
      function K(e) {
        if ("string" == typeof e) {
          var t,
            o,
            n = e.split("");
          t = 0;
          for (o = n.length; t < o; t++) n[t] = (255 & n[t].charCodeAt(0)) >>> 0;
          e = n;
        }
        for (var i, a = 1, r = 0, l = e.length, s = 0; 0 < l;) {
          l -= i = 1024 < l ? 1024 : l;
          do {
            r += a += e[s++];
          } while (--i);
          a %= 65521;
          r %= 65521;
        }
        return (r << 16 | a) >>> 0;
      }
      function X(t, o) {
        var n, i;
        this.input = t;
        this.c = 0;
        !o && (o = {}) || (o.index && (this.c = o.index), o.verify && (this.M = o.verify));
        n = t[this.c++];
        i = t[this.c++];
        switch (15 & n) {
          case 8:
            this.method = 8;
            break;
          default:
            e(Error("unsupported compression method"));
        }
        0 != ((n << 8) + i) % 31 && e(Error("invalid fcheck flag:" + ((n << 8) + i) % 31));
        32 & i && e(Error("fdict flag is not supported"));
        this.A = new E(t, {
          index: this.c,
          bufferSize: o.bufferSize,
          bufferType: o.bufferType,
          resize: o.resize
        });
      }
      X.prototype.p = function () {
        var t,
          o = this.input;
        t = this.A.p();
        this.c = this.A.c;
        this.M && (o[this.c++] << 24 | o[this.c++] << 16 | o[this.c++] << 8 | o[this.c++]) >>> 0 !== K(t) && e(Error("invalid adler-32 checksum"));
        return t;
      };
      function Q(e, t) {
        this.input = e;
        this.a = new (a ? Uint8Array : Array)(32768);
        this.h = Z.k;
        var o,
          n = {};
        !t && (t = {}) || "number" != typeof t.compressionType || (this.h = t.compressionType);
        for (o in t) n[o] = t[o];
        n.outputBuffer = this.a;
        this.z = new h(this.input, n);
      }
      var Z = {
        NONE: 0,
        r: 1,
        k: 2,
        N: 3
      };
      Q.prototype.j = function () {
        var t,
          o,
          n,
          i,
          r,
          l = 0;
        r = this.a;
        t = Math.LOG2E * Math.log(32768) - 8 << 4 | 8;
        r[l++] = t;
        switch (this.h) {
          case Z.NONE:
            n = 0;
            break;
          case Z.r:
            n = 1;
            break;
          case Z.k:
            n = 2;
            break;
          default:
            e(Error("unsupported compression type"));
        }
        o = n << 6 | 0;
        r[l++] = o | 31 - (256 * t + o) % 31;
        i = K(this.input);
        this.z.b = l;
        l = (r = this.z.j()).length;
        a && ((r = new Uint8Array(r.buffer)).length <= l + 4 && (this.a = new Uint8Array(r.length + 4), this.a.set(r), r = this.a), r = r.subarray(0, l + 4));
        r[l++] = i >> 24 & 255;
        r[l++] = i >> 16 & 255;
        r[l++] = i >> 8 & 255;
        r[l++] = 255 & i;
        return r;
      };
      function z(e, t) {
        var o, n, a, r;
        if (Object.keys) o = Object.keys(t);else for (n in o = [], a = 0, t) o[a++] = n;
        a = 0;
        for (r = o.length; a < r; ++a) i(e + "." + (n = o[a]), t[n]);
      }
      i("Zlib.Inflate", X);
      i("Zlib.Inflate.prototype.decompress", X.prototype.p);
      z("Zlib.Inflate.BufferType", {
        ADAPTIVE: 1,
        BLOCK: 0
      });
      i("Zlib.Deflate", Q);
      i("Zlib.Deflate.compress", function (e, t) {
        return new Q(e, t).j();
      });
      i("Zlib.Deflate.prototype.compress", Q.prototype.j);
      z("Zlib.Deflate.CompressionType", {
        NONE: Z.NONE,
        FIXED: Z.r,
        DYNAMIC: Z.k
      });
    };
