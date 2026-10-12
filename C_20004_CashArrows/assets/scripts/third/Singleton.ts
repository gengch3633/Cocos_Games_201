export default class Singleton {
    public static ins: any = null;

    public static getInstance<T extends new (...args: any[]) => any>(this: T): InstanceType<T> {
        const ctor: any = this;
        if (!ctor.ins) {
            ctor.ins = new ctor();
        }
        return ctor.ins as InstanceType<T>;
    }
}