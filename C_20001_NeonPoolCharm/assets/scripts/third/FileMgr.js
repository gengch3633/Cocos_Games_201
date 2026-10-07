let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "bc2a1NTKSJP/6jnPfuDLsdu", "FileMgr");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e("FileSaver.js"),
i = cc.Enum({
  DATA_URL: 0, TEXT: 1, BINARY: 2, ARRAYBUFFER: 3
}
),
a = function() {
  function e() {
  }
  Object.defineProperty(e, "getInstance", {
    get: function() {
      e.instance|| (e.instance = new e());
      return e.instance;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  e.prototype.downloadFile = function(e, t, o) {
    void 0 === o&& (o = ! 1);
    var i = new File([e], t, {
      type: "text/plain;"
    }
);
    if(o) return i;
    n.saveAs(i);
  }
;
  e.prototype.loadMaps = function(e, t) {
    cc.loader.loadResDir(e, function(e, o) {
      if(e) cc.error("loadMapData", e);
      else {
        for(var n = [], i = 0;
        i < o.length;
        i++) {
          var a = o[i].json;
          a.name = o[i]._name;
          n.push(a);
          console.log("加载地图数据成功", a.name, a);
        }
        t(n);
      }
    }
);
  }
;
  e.prototype.openLocalFile = function(e, t) {
    var o = document.getElementById("file_input");
    if(! o) {
(o = document.createElement("input")).id = "file_input";
      o.setAttribute("id", "file_input");
      o.setAttribute("type", "file");
      o.setAttribute("class", "fileToUpload");
      o.style.opacity = "0";
      o.style.position = "absolute";
      o.setAttribute("left", "-999px");
      document.body.appendChild(o);
    }
    e = e|| ".*";
    o.setAttribute("accept", e);
    o.onchange = function() {
      var e = o.files;
      if(e&& e.length > 0) {
        var n = e[0];
        t&& t(n);
      }
    }
;
    o.click();
  }
;
  e.prototype.readJsonFile = function(e) {
    var t = this;
    this.openLocalFile(".json", function(o) {
      console.log("file", o);
      t.readLocalFile(o, 1, function(t) {
        e&& e(t, o.name);
      }
);
    }
);
  }
;
  e.prototype.saveForBrowser = function(e, t) {
    if(cc.sys.isBrowser) {
      console.log("浏览器");
      var o = new Blob([e], {
        type: "application/json"
      }
),
      n = document.createElement("a");
      n.download = t;
      n.innerHTML = "Download File";
      if(null != window.webkitURL) n.href = window.webkitURL.createObjectURL(o);
      else {
        n.href = window.URL.createObjectURL(o);
        n.style.display = "none";
        document.body.appendChild(n);
      }
      n.click();
    }
  }
;
  e.prototype.readLocalFile = function(e, t, o) {
    var n = new FileReader();
    n.onload = function() {
      o&& (n.readyState == FileReader.DONE? o(n.result): o(null));
    }
;
    switch(t) {
      case i.DATA_URL: n.readAsDataURL(e);
      break;
      case i.TEXT: n.readAsText(e);
      break;
      case i.BINARY: n.readAsBinaryString(e);
      break;
      case i.ARRAYBUFFER: n.readAsArrayBuffer(e);
    }
  }
;
  return e;
}
();
o.default = a.getInstance;
cc._RF.pop();
