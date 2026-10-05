import { saveAs } from "./FileSaver";

const ReadType = cc.Enum({
    DATA_URL: 0,
    TEXT: 1,
    BINARY: 2,
    ARRAYBUFFER: 3,
});

class FileMgr {
    private static instance: FileMgr = null;

    static get getInstance(): FileMgr {
        if (!FileMgr.instance) {
            FileMgr.instance = new FileMgr();
        }
        return FileMgr.instance;
    }

    downloadFile(content: BlobPart, filename: string, returnFile: boolean = false): File | void {
        const file = new File([content], filename, {
            type: "text/plain;",
        });
        if (returnFile) {
            return file;
        }
        saveAs(file);
    }

    loadMaps(path: string, callback: (maps: unknown[]) => void): void {
        cc.loader.loadResDir(path, (err: Error, assets: cc.JsonAsset[]) => {
            if (err) {
                cc.error("loadMapData", err);
            } else {
                const maps: unknown[] = [];
                for (let i = 0; i < assets.length; i++) {
                    const json = assets[i].json;
                    json.name = assets[i]._name;
                    maps.push(json);
                    console.log("加载地图数据成功", json.name, json);
                }
                callback(maps);
            }
        });
    }

    openLocalFile(accept: string, callback: (file: File) => void): void {
        let input = document.getElementById("file_input") as HTMLInputElement;
        if (!input) {
            input = document.createElement("input");
            input.id = "file_input";
            input.setAttribute("id", "file_input");
            input.setAttribute("type", "file");
            input.setAttribute("class", "fileToUpload");
            input.style.opacity = "0";
            input.style.position = "absolute";
            input.setAttribute("left", "-999px");
            document.body.appendChild(input);
        }
        accept = accept || ".*";
        input.setAttribute("accept", accept);
        input.onchange = () => {
            const files = input.files;
            if (files && files.length > 0) {
                const file = files[0];
                callback && callback(file);
            }
        };
        input.click();
    }

    readJsonFile(callback: (data: unknown, filename: string) => void): void {
        this.openLocalFile(".json", (file) => {
            console.log("file", file);
            this.readLocalFile(file, ReadType.TEXT, (data) => {
                callback && callback(data, file.name);
            });
        });
    }

    saveForBrowser(content: string, filename: string): void {
        if (cc.sys.isBrowser) {
            console.log("浏览器");
            const blob = new Blob([content], {
                type: "application/json",
            });
            const anchor = document.createElement("a");
            anchor.download = filename;
            anchor.innerHTML = "Download File";
            if (window.webkitURL != null) {
                anchor.href = window.webkitURL.createObjectURL(blob);
            } else {
                anchor.href = window.URL.createObjectURL(blob);
                anchor.style.display = "none";
                document.body.appendChild(anchor);
            }
            anchor.click();
        }
    }

    readLocalFile(file: Blob, readType: number, callback: (result: string | ArrayBuffer | null) => void): void {
        const reader = new FileReader();
        reader.onload = () => {
            if (callback) {
                callback(reader.readyState === FileReader.DONE ? (reader.result as string | ArrayBuffer) : null);
            }
        };
        switch (readType) {
            case ReadType.DATA_URL:
                reader.readAsDataURL(file);
                break;
            case ReadType.TEXT:
                reader.readAsText(file);
                break;
            case ReadType.BINARY:
                reader.readAsBinaryString(file);
                break;
            case ReadType.ARRAYBUFFER:
                reader.readAsArrayBuffer(file);
                break;
        }
    }
}

export default FileMgr.getInstance;
