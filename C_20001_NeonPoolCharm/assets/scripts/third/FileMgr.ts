import { saveAs } from "./FileSaver";

const FileType = cc.Enum({
    DATA_URL: 0,
    TEXT: 1,
    BINARY: 2,
    ARRAYBUFFER: 3,
});

class FileMgr {
    static instance: FileMgr = null;

    static get getInstance(): FileMgr {
        if (!FileMgr.instance) {
            FileMgr.instance = new FileMgr();
        }
        return FileMgr.instance;
    }

    downloadFile(content: string | BlobPart, filename: string, returnBlob: boolean = false): Blob | void {
        const blob = new Blob([content], { type: "text/plain;" });
        if (returnBlob) {
            return blob;
        }
        saveAs(blob, filename);
    }

    loadMaps(path: string, callback: (maps: any[]) => void): void {
        cc.loader.loadResDir(path, (err, assets) => {
            if (err) {
                cc.error("loadMapData", err);
            } else {
                const maps: any[] = [];
                for (let i = 0; i < assets.length; i++) {
                    const data = assets[i].json;
                    data.name = assets[i]._name;
                    maps.push(data);
                    console.log("加载地图数据成功", data.name, data);
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
            input.setAttribute("left", "-999px");
            document.body.appendChild(input);
        }
        accept = accept || ".*";
        input.setAttribute("accept", accept);
        input.onchange = () => {
            const files = input.files;
            if (files && files.length > 0) {
                const file = files[0];
                callback?.(file);
            }
        };
        input.click();
    }

    readJsonFile(callback: (data: string, filename: string) => void): void {
        this.openLocalFile(".json", (file) => {
            console.log("file", file);
            this.readLocalFile(file, FileType.TEXT, (result) => {
                callback?.(result as string, file.name);
            });
        });
    }

    saveForBrowser(content: string, filename: string): void {
        if (cc.sys.isBrowser) {
            console.log("浏览器");
            const blob = new Blob([content], { type: "application/json" });
            const link = document.createElement("a");
            link.download = filename;
            link.innerHTML = "Download File";
            if (window.webkitURL != null) {
                link.href = window.webkitURL.createObjectURL(blob);
            } else {
                link.href = window.URL.createObjectURL(blob);
                link.style.display = "none";
                document.body.appendChild(link);
            }
            link.click();
        }
    }

    readLocalFile(file: Blob, type: number, callback: (result: string | ArrayBuffer) => void): void {
        const reader = new FileReader();
        reader.onload = () => {
            if (callback) {
                if (reader.readyState == FileReader.DONE) {
                    callback(reader.result as string | ArrayBuffer);
                } else {
                    callback(null);
                }
            }
        };
        switch (type) {
            case FileType.DATA_URL:
                reader.readAsDataURL(file);
                break;
            case FileType.TEXT:
                reader.readAsText(file);
                break;
            case FileType.BINARY:
                reader.readAsBinaryString(file);
                break;
            case FileType.ARRAYBUFFER:
                reader.readAsArrayBuffer(file);
                break;
        }
    }
}

export default FileMgr.getInstance;
