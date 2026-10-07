export default class Singleton {
    static ins: any;

    static getInstance(): any {
        if (!this.ins) {
            this.ins = new (this as any)();
        }
        return this.ins;
    }
}
