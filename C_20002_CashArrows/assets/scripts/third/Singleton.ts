export default class Singleton {
    static ins: any;

    static getInstance<T extends typeof Singleton>(this: T): InstanceType<T> {
        if (!this.ins) {
            this.ins = new this();
        }
        return this.ins;
    }
}
