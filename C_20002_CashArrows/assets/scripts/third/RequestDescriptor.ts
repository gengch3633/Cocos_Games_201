export default class RequestDescriptor {
    descriptors: Record<string, any>;

    constructor(descriptors: Record<string, any>) {
        this.descriptors = descriptors;
    }

    get(key: string): any {
        return this.descriptors[key] || null;
    }

    getUri(key: string): string {
        const descriptor = this.get(key);
        return descriptor?.uri || "";
    }

    getUrl(key: string): string {
        const descriptor = this.get(key);
        return descriptor?.url || "";
    }

    needEnqueue(key: string): boolean {
        const descriptor = this.get(key);
        return !!descriptor?.enqueue;
    }
}
