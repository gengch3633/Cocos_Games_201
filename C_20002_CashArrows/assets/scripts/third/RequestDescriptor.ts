export interface RequestDescriptorEntry {
    uri?: string;
    url?: string;
    enqueue?: boolean;
}

export default class RequestDescriptor {
    descriptors: Record<string, RequestDescriptorEntry>;

    constructor(descriptors: Record<string, RequestDescriptorEntry>) {
        this.descriptors = descriptors;
    }

    get(key: string): RequestDescriptorEntry | null {
        return this.descriptors[key] || null;
    }

    getUri(key: string): string {
        const entry = this.get(key);
        return entry?.uri || "";
    }

    getUrl(key: string): string {
        const entry = this.get(key);
        return entry?.url || "";
    }

    needEnqueue(key: string): boolean {
        const entry = this.get(key);
        return !!entry?.enqueue;
    }
}
