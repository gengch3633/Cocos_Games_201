export default class Singleton {
    static ins: any;

    static getInstance() {
        this.ins || (this.ins = new (this as any)());
        return this.ins;
    }
}
