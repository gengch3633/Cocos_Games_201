export default class RequestDescriptor {
    descriptors: Record<string, { uri?: string; url?: string; enqueue?: boolean }>;

    constructor(descriptors: Record<string, { uri?: string; url?: string; enqueue?: boolean }>) {
        this.descriptors = descriptors;
    }

    get(key: string) {
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
