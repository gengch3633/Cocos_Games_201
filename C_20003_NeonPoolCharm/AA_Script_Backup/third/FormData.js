let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "2bab3x1GA1AcLWABpv0Vvpy", "FormData");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = e("SystemDataSys.js"),
      i = function () {
        function e() {
          this._boundary_key = "AaB03x";
          this._boundary = "";
          this._end_boundary = "";
          this._result = "";
          this._formResult = "";
          this._boundary = "--" + this._boundary_key;
          this._end_boundary = this._boundary + "--";
          this._result = "";
        }
        e.prototype.append = function (e, t) {
          this._result += this._boundary + "\r\n";
          this._result += 'Content-Disposition: form-data; name="' + e + '"\r\n\r\n';
          this._result += t + "\r\n";
        };
        e.prototype.arrayBuffer = function () {
          this._formResult = this._result + this._end_boundary;
          var e = [];
          n.default.encrypt || (this._formResult = this.ch2Unicdoe(this._formResult));
          for (var t = 0; t < this._formResult.length; t++) e.push(this._formResult.charCodeAt(t));
          return new Uint8Array(e).buffer;
        };
        e.prototype.ch2Unicdoe = function (e) {
          if (!e) return "";
          for (var t = "", o = new RegExp("[一-龥]+"), n = new RegExp("[`~！@#￥……&*（）——|，、？]"), i = 0; i < e.length; i++) {
            var a = e.charAt(i);
            if (o.test(a)) t += "%u" + a.charCodeAt(0).toString(16);else if (n.test(a)) {
              var r = a.charCodeAt(0).toString(16);
              t += "%u" + "0000".substring(0, 4 - r.length) + r;
            } else t += a;
          }
          return t;
        };
        return e;
      }();
    o.default = i;
    cc._RF.pop();
