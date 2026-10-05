export function CLICKLOCK(delay: number = 0.5) {
    return (_target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
        const original = descriptor.value;
        let locked = false;
        descriptor.value = function (this: cc.Component, ...args: unknown[]) {
            if (locked) {
                console.log("跳过了", this.name, propertyKey);
            } else {
                locked = true;
                setTimeout(() => {
                    locked = false;
                }, 1000 * delay);
                original.apply(this, args);
            }
        };
        return descriptor;
    };
}
