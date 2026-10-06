export default class Singleton {
    static ins: Singleton | null = null;

    static getInstance<T extends Singleton>(this: new () => T): T {
        if (!(this as unknown as { ins?: T }).ins) {
            (this as unknown as { ins: T }).ins = new this();
        }
        return (this as unknown as { ins: T }).ins;
    }
}
