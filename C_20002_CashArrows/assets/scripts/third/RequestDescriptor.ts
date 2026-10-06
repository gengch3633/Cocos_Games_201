export default class RequestDescriptor {
    descriptors: any;

    constructor(e: any) {
        this.descriptors = e;
    }

    get(e: any) {
        return this.descriptors[e] || null;
    }

    getUri(e: any) {
        var t = this.get(e);
        return (null == t ? void 0 : t.uri) || "";
    }

    getUrl(e: any) {
        var t = this.get(e);
        return (null == t ? void 0 : t.url) || "";
    }

    needEnqueue(e: any) {
        var t = this.get(e);
        return !!(null == t ? void 0 : t.enqueue);
    }
}
