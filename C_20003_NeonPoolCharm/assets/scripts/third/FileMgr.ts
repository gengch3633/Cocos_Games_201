import { saveAs } from "./FileSaver";

const i = cc.Enum({
    DATA_URL: 0,
    TEXT: 1,
    BINARY: 2,
    ARRAYBUFFER: 3
});

class FileMgr {
    static instance;

    static getInstance() {
        FileMgr.instance || (FileMgr.instance = new FileMgr());
        return FileMgr.instance;
    }

    downloadFile(e, t, o?) {
        if (undefined === o) {
            o = false;
        }
        const file = new File([e], t, {
            type: "text/plain;"
        });
        if (o) return file;
        saveAs(file);
    }

    loadMaps(e, t) {
        cc.loader.loadResDir(e, function (e, o) {
            if (e) cc.error("loadMapData", e); else {
                const n = [];
                for (let i = 0; i < o.length; i++) {
                    const a = o[i].json;
                    a.name = o[i]._name;
                    n.push(a);
                    console.log("加载地图数据成功", a.name, a);
                }
                t(n);
            }
        });
    }

    openLocalFile(e, t) {
        let o: any = document.getElementById("file_input");
        if (!o) {
            (o = document.createElement("input")).id = "file_input";
            o.setAttribute("id", "file_input");
            o.setAttribute("type", "file");
            o.setAttribute("class", "fileToUpload");
            o.style.opacity = "0";
            o.style.position = "absolute";
            o.setAttribute("left", "-999px");
            document.body.appendChild(o);
        }
        e = e || ".*";
        o.setAttribute("accept", e);
        o.onchange = function () {
            const e = o.files;
            if (e && e.length > 0) {
                const n = e[0];
                t && t(n);
            }
        };
        o.click();
    }

    readJsonFile(e) {
        const t = this;
        this.openLocalFile(".json", function (o) {
            console.log("file", o);
            t.readLocalFile(o, 1, function (t) {
                e && e(t, o.name);
            });
        });
    }

    saveForBrowser(e, t) {
        if (cc.sys.isBrowser) {
            console.log("浏览器");
            const o = new Blob([e], {
                type: "application/json"
            });
            const n = document.createElement("a");
            n.download = t;
            n.innerHTML = "Download File";
            if (null != window.webkitURL) n.href = window.webkitURL.createObjectURL(o); else {
                n.href = window.URL.createObjectURL(o);
                n.style.display = "none";
                document.body.appendChild(n);
            }
            n.click();
        }
    }

    readLocalFile(e, t, o) {
        const n = new FileReader();
        n.onload = function () {
            o && (n.readyState == FileReader.DONE ? o(n.result) : o(null));
        };
        switch (t) {
            case i.DATA_URL:
                n.readAsDataURL(e);
                break;
            case i.TEXT:
                n.readAsText(e);
                break;
            case i.BINARY:
                n.readAsBinaryString(e);
                break;
            case i.ARRAYBUFFER:
                n.readAsArrayBuffer(e);
        }
    }
}

export default FileMgr.getInstance();
