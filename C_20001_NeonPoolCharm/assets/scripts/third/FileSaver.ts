type SaveAsView = Window & {
    document: Document;
    URL?: typeof URL;
    webkitURL?: typeof URL;
    HTMLElement: typeof HTMLElement;
    safari?: boolean;
    setImmediate?: (callback: () => void) => void;
    FileReader?: typeof FileReader;
    open?: (url: string, target?: string) => Window | null;
};

function createSaveAs(view: SaveAsView): (blob: Blob, name?: string, noAutoBom?: boolean) => any {
    if (typeof view === "undefined" || (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent))) {
        return undefined;
    }

    const doc = view.document;
    const getUrlApi = () => view.URL || view.webkitURL || view;
    const anchor = doc.createElementNS("http://www.w3.org/1999/xhtml", "a") as HTMLAnchorElement;
    const canUseDownload = "download" in anchor;
    const isSafari = /constructor/i.test(view.HTMLElement as any) || view.safari;
    const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

    const throwOutside = (ex: unknown) => {
        (view.setImmediate || setTimeout)(() => {
            throw ex;
        }, 0);
    };

    const revoke = (file: string | { remove: () => void }) => {
        setTimeout(() => {
            if (typeof file === "string") {
                getUrlApi().revokeObjectURL(file);
            } else {
                file.remove();
            }
        }, 40000);
    };

    const dispatch = (target: any, type: string | string[], event?: Event) => {
        const types = [].concat(type);
        for (let i = types.length; i--; ) {
            const handler = target["on" + types[i]];
            if (typeof handler === "function") {
                try {
                    handler.call(target, event || target);
                } catch (ex) {
                    throwOutside(ex);
                }
            }
        }
    };

    const autoBom = (blob: Blob): Blob => {
        if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
            return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
        }
        return blob;
    };

    function FileSaver(this: any, blob: Blob, name: string, noAutoBom?: boolean) {
        if (!noAutoBom) {
            blob = autoBom(blob);
        }
        let url: string;
        const saver = this;
        const force = blob.type === "application/octet-stream";
        const dispatchAll = () => {
            dispatch(saver, "writestart progress write writeend".split(" "));
        };
        saver.readyState = saver.INIT;

        if (canUseDownload) {
            url = getUrlApi().createObjectURL(blob);
            setTimeout(() => {
                anchor.href = url;
                anchor.download = name;
                const clickEvent = new MouseEvent("click");
                anchor.dispatchEvent(clickEvent);
                dispatchAll();
                revoke(url);
                saver.readyState = saver.DONE;
            });
            return;
        }

        if ((isChromeIOS || (force && isSafari)) && view.FileReader) {
            const reader = new view.FileReader();
            reader.onloadend = function () {
                let result = reader.result as string;
                if (isChromeIOS) {
                    // keep result
                } else {
                    result = result.replace(/^data:[^;]*;/, "data:attachment/file;");
                }
                if (!view.open(result, "_blank")) {
                    view.location.href = result;
                }
                saver.readyState = saver.DONE;
                dispatchAll();
            };
            reader.readAsDataURL(blob);
            saver.readyState = saver.INIT;
            return;
        }

        if (!url) {
            url = getUrlApi().createObjectURL(blob);
        }
        if (force) {
            view.location.href = url;
        } else if (!view.open(url, "_blank")) {
            view.location.href = url;
        }
        saver.readyState = saver.DONE;
        dispatchAll();
        revoke(url);
    }

    const proto = FileSaver.prototype as any;
    if (typeof navigator !== "undefined" && (navigator as any).msSaveOrOpenBlob) {
        return (blob: Blob, name?: string, noAutoBom?: boolean) => {
            name = name || (blob as any).name || "download";
            if (!noAutoBom) {
                blob = autoBom(blob);
            }
            return (navigator as any).msSaveOrOpenBlob(blob, name);
        };
    }

    proto.abort = function () {};
    proto.readyState = proto.INIT = 0;
    proto.WRITING = 1;
    proto.DONE = 2;
    proto.error =
        proto.onwritestart =
        proto.onprogress =
        proto.onwrite =
        proto.onabort =
        proto.onerror =
        proto.onwriteend =
            null;

    return (blob: Blob, name?: string, noAutoBom?: boolean) => {
        return new (FileSaver as any)(blob, name || (blob as any).name || "download", noAutoBom);
    };
}

const view =
    (typeof self !== "undefined" && self) ||
    (typeof window !== "undefined" && window) ||
    (undefined as unknown as SaveAsView);

export const saveAs: (blob: Blob, name?: string, noAutoBom?: boolean) => any =
    (globalThis as any).saveAs || createSaveAs(view as SaveAsView);
