export let saveAs: (blob: Blob, filename?: string, disableAutoBOM?: boolean) => void;

saveAs =
    saveAs ||
    (function (global: any) {
        if (typeof global === "undefined" || (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent))) {
            return;
        }
        const doc = global.document;
        const getURL = () => global.URL || global.webkitURL || global;
        const anchor = doc.createElementNS("http://www.w3.org/1999/xhtml", "a");
        const canUseDownload = "download" in anchor;
        const isSafari = /constructor/i.test(global.HTMLElement) || global.safari;
        const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
        const throwOutside = (ex: any) => {
            (global.setImmediate || global.setTimeout)(() => {
                throw ex;
            }, 0);
        };
        const revoke = (file: string | Blob) => {
            setTimeout(() => {
                if (typeof file === "string") {
                    getURL().revokeObjectURL(file);
                } else {
                    (file as any).remove();
                }
            }, 40000);
        };
        const dispatch = (target: any, types: string[], event?: any) => {
            const list = [].concat(types);
            for (let i = list.length; i--; ) {
                const handler = target["on" + list[i]];
                if (typeof handler === "function") {
                    try {
                        handler.call(target, event || target);
                    } catch (ex) {
                        throwOutside(ex);
                    }
                }
            }
        };
        const autoBOM = (blob: Blob) => {
            if (
                /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)
            ) {
                return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
            }
            return blob;
        };
        const SaveAs = function (this: any, blob: Blob, name: string, noAutoBOM?: boolean) {
            if (!noAutoBOM) {
                blob = autoBOM(blob);
            }
            let url: string;
            const self = this;
            const force = blob.type === "application/octet-stream";
            const done = () => {
                dispatch(self, "writestart progress write writeend".split(" "));
            };
            self.readyState = self.INIT;
            if (canUseDownload) {
                url = getURL().createObjectURL(blob);
                setTimeout(() => {
                    anchor.href = url;
                    anchor.download = name;
                    anchor.dispatchEvent(new MouseEvent("click"));
                    done();
                    revoke(url);
                    self.readyState = self.DONE;
                });
            } else {
                (function () {
                    if ((isChromeIOS || (force && isSafari)) && global.FileReader) {
                        const reader = new FileReader();
                        reader.onloadend = function () {
                            let result = reader.result as string;
                            result = isChromeIOS ? result : result.replace(/^data:[^;]*;/, "data:attachment/file;");
                            if (!global.open(result, "_blank")) {
                                global.location.href = result;
                            }
                            self.readyState = self.DONE;
                            done();
                        };
                        reader.readAsDataURL(blob);
                        self.readyState = self.INIT;
                    } else {
                        if (!url) {
                            url = getURL().createObjectURL(blob);
                        }
                        if (force) {
                            global.location.href = url;
                        } else if (!global.open(url, "_blank")) {
                            global.location.href = url;
                        }
                        self.readyState = self.DONE;
                        done();
                        revoke(url);
                    }
                })();
            }
        };
        const proto = SaveAs.prototype;
        if (typeof navigator !== "undefined" && (navigator as any).msSaveOrOpenBlob) {
            return function (blob: Blob, name?: string, noAutoBOM?: boolean) {
                name = name || (blob as any).name || "download";
                if (!noAutoBOM) {
                    blob = autoBOM(blob);
                }
                return (navigator as any).msSaveOrOpenBlob(blob, name);
            };
        }
        proto.abort = function () {};
        proto.readyState = proto.INIT = 0;
        proto.WRITING = 1;
        proto.DONE = 2;
        proto.error = proto.onwritestart = proto.onprogress = proto.onwrite = proto.onabort = proto.onerror = proto.onwriteend = null;
        return function (blob: Blob, name?: string, noAutoBOM?: boolean) {
            return new (SaveAs as any)(blob, name || (blob as any).name || "download", noAutoBOM);
        };
    })((typeof self !== "undefined" && self) || (typeof window !== "undefined" && window) || ({} as any).content);
