export interface IRequestDescriptor {
    uri?: string;
    url?: string;
    enqueue?: boolean;
    [key: string]: any;
}

export default class RequestDescriptor {
    private descriptors: { [key: string]: IRequestDescriptor };

    constructor(descriptors: { [key: string]: IRequestDescriptor }) {
        this.descriptors = descriptors;
    }

    public get(id: string): IRequestDescriptor | null {
        return this.descriptors[id] || null;
    }

    public getUri(id: string): string {
        const desc = this.get(id);
        return (desc && desc.uri) || "";
    }

    public getUrl(id: string): string {
        const desc = this.get(id);
        return (desc && desc.url) || "";
    }

    public needEnqueue(id: string): boolean {
        const desc = this.get(id);
        return !!(desc && desc.enqueue);
    }
}